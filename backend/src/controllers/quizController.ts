import { Request, Response } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { QuizService } from '../services/quizService';
import { Types } from 'mongoose';
import Attempt from '../models/Attempt';
import { handleValidationErrors } from '../middleware/validation';

export const submitQuizValidation = [
  body('categoryId').isMongoId().withMessage('Valid category ID is required'),
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers array is required with at least one answer'),
  body('answers.*.questionId')
    .isMongoId()
    .withMessage('Valid question ID is required for each answer'),
  body('answers.*.selectedIndex')
    .isInt({ min: 0 })
    .withMessage('Selected index must be a non-negative integer'),
];

export const quizController = {
  async getRandomQuestions(req: AuthRequest, res: Response) {
    try {
      const { categoryId } = req.params;
      if (!categoryId) {
        return res
          .status(400)
          .json({ success: false, message: 'Category ID is required' });
      }

      const questions = await QuizService.getRandomQuestions(
        categoryId as string,
        20
      );

      res.json({
        success: true,
        data: { questions },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching questions',
        error: error.message,
      });
    }
  },

  async submitQuiz(req: AuthRequest, res: Response) {
    try {
      const { categoryId, answers } = req.body;
      const userId = req.user!._id;

      // Evaluate quiz
      const { score, total, percentage, detail } =
        await QuizService.evaluateQuiz(answers);

      // Save attempt
      const attempt = await QuizService.saveAttempt(
        userId,
        new Types.ObjectId(categoryId),
        score,
        total,
        percentage,
        detail
      );

      // Get career recommendation using configured CareerInfo thresholds.
      // Do NOT gate this behind a hard-coded 70% — career recommendations
      // should be shown when the user's percentage meets the CareerInfo.minScore
      // (e.g., site admins may set a low threshold like 20%).
      const careerRecommendation = await QuizService.getCareerRecommendation(
        new Types.ObjectId(categoryId),
        percentage
      );

      // Return attempt summary including categoryId so frontend can link back
      res.json({
        success: true,
        data: {
          attempt: {
            _id: attempt._id,
            score,
            total,
            percentage,
            createdAt: attempt.createdAt,
            categoryId: categoryId as string,
          },
          careerRecommendation,
          passed: percentage >= 70,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error submitting quiz',
        error: error.message,
      });
    }
  },

  async getLeaderboard(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      if (!categoryId) {
        return res
          .status(400)
          .json({ success: false, message: 'Category ID is required' });
      }

      const limit = parseInt(req.query.limit as string) || 10;

      const leaderboard = await QuizService.getLeaderboard(
        categoryId as string,
        limit
      );

      res.json({
        success: true,
        data: { leaderboard },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching leaderboard',
        error: error.message,
      });
    }
  },

  async getUserAttempts(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!._id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const attempts = await Attempt.find({ userId })
        .populate('categoryId', 'name description')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-detail');

      const total = await Attempt.countDocuments({ userId });

      res.json({
        success: true,
        data: {
          attempts,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching attempts',
        error: error.message,
      });
    }
  },

  async getAttemptDetail(req: AuthRequest, res: Response) {
    try {
      const { attemptId } = req.params;
      const userId = req.user!._id;

      const attempt = await Attempt.findOne({ _id: attemptId, userId })
        .populate('detail.questionId')
        .populate('categoryId');

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: 'Attempt not found',
        });
      }

      res.json({
        success: true,
        data: { attempt },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching attempt details',
        error: error.message,
      });
    }
  },
};
