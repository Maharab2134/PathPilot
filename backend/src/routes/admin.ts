import { Router, Response } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import Question from '../models/Question';
import Attempt from '../models/Attempt';
import User from '../models/User';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

function emitEvent(event: string, payload: any) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getIo } = require('../socket');
    getIo().emit(event, payload);
  } catch (err) {
    // socket not initialized or not installed; ignore
  }
}

// Question management
const questionValidation = [
  body('text')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Question text must be between 10 and 1000 characters'),
  body('options')
    .isArray({ min: 2, max: 5 })
    .withMessage('Question must have between 2 and 5 options'),
  body('correctIndex')
    .isInt({ min: 0 })
    .withMessage('Correct index must be a non-negative integer'),
  body('categoryId').isMongoId().withMessage('Valid category ID is required'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
];

router.get('/questions', authenticate, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const questions = await Question.find()
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Question.countDocuments();

    res.json({
      success: true,
      data: {
        questions,
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
      message: 'Error fetching questions',
      error: error.message,
    });
  }
});

router.post(
  '/questions',
  authenticate,
  authorize('admin'),
  questionValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const question = new Question(req.body);
      await question.save();
      await question.populate('categoryId', 'name');

      res.status(201).json({
        success: true,
        message: 'Question created successfully',
        data: { question },
      });
      // emit socket event
      emitEvent('question:created', question);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error creating question',
        error: error.message,
      });
    }
  }
);

router.put(
  '/questions/:id',
  authenticate,
  authorize('admin'),
  questionValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      // Use find + save instead of findByIdAndUpdate so Mongoose document validators
      // (which may rely on other fields like options) run with the full document context.
      const question = await Question.findById(req.params.id);

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found',
        });
      }

      // Assign only allowed fields to avoid unexpected updates
      const {
        text,
        options,
        correctIndex,
        categoryId,
        difficulty,
        explanation,
      } = req.body;
      if (text !== undefined) question.text = text;
      if (options !== undefined) question.options = options;
      if (correctIndex !== undefined) question.correctIndex = correctIndex;
      if (categoryId !== undefined) question.categoryId = categoryId;
      if (difficulty !== undefined) question.difficulty = difficulty;
      if (explanation !== undefined) question.explanation = explanation;

      await question.save();
      await question.populate('categoryId', 'name');

      res.json({
        success: true,
        message: 'Question updated successfully',
        data: { question },
      });
      emitEvent('question:updated', question);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error updating question',
        error: error.message,
      });
    }
  }
);

router.delete(
  '/questions/:id',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const question = await Question.findByIdAndDelete(req.params.id);
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found',
        });
      }

      res.json({
        success: true,
        message: 'Question deleted successfully',
      });
      emitEvent('question:deleted', { id: req.params.id });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error deleting question',
        error: error.message,
      });
    }
  }
);

// User management
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Allow optional filtering by role/status (e.g., ?role=user or ?status=active)
    const filter: any = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const users = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
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
      message: 'Error fetching users',
      error: error.message,
    });
  }
});

// Attempts listing (admin) - provide counts for dashboard
router.get('/attempts', authenticate, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const attempts = await Attempt.find()
      .populate('categoryId', 'name')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-detail');

    const total = await Attempt.countDocuments();

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
});

// Delete a user (admin only)
router.delete(
  '/users/:id',
  authenticate,
  authorize('admin'),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.id;

      // Prevent admin from deleting themselves
      if (req.user && req.user._id && req.user._id.toString() === userId) {
        return res.status(400).json({
          success: false,
          message: 'You cannot delete your own account',
        });
      }

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }

      res.json({ success: true, message: 'User deleted successfully' });
      emitEvent('user:deleted', { id: userId });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error: error.message,
      });
    }
  }
);

// Emit socket events for admin actions (questions/users)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getIo } = require('../socket');

  // After creating/updating/deleting questions, call getIo().emit('questions:changed', { type: 'updated' })
  // We'll emit from controllers where appropriate. For deletes above, emit here.
  // NOTE: Keep emits non-blocking and optional if socket not initialized.
  const originalDelete = router.stack?.slice?.bind?.(router.stack)
    ? null
    : null; // noop to satisfy linter
} catch (err) {
  // socket not available
}

// Update user (status) - admin only
router.patch(
  '/users/:id',
  authenticate,
  authorize('admin'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage("Status must be 'active' or 'inactive'"),
  handleValidationErrors,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.id;

      // Prevent admin from changing their own status
      if (req.user && req.user._id && req.user._id.toString() === userId) {
        return res.status(400).json({
          success: false,
          message: 'You cannot modify your own status',
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }

      const { status } = req.body;
      if (status !== undefined) user.status = status;

      await user.save();

      // Do not return passwordHash
      const userObj = user.toObject();
      delete (userObj as any).passwordHash;

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user: userObj },
      });
      emitEvent('user:updated', userObj);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error updating user',
        error: error.message,
      });
    }
  }
);

export default router;
