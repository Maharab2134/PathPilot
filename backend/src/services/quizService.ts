import { Types } from 'mongoose';
import Question from '../models/Question';
import Attempt, { IAttempt } from '../models/Attempt';
// emit socket events on new attempts
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getIo } = require('../socket');
import CareerInfo from '../models/CareerInfo';

export class QuizService {
  static async getRandomQuestions(categoryId: string, limit: number = 20) {
    return Question.aggregate([
      { $match: { categoryId: new Types.ObjectId(categoryId) } },
      { $sample: { size: limit } },
      { $project: { correctIndex: 0, explanation: 0 } },
    ]);
  }

  static async evaluateQuiz(
    answers: Array<{ questionId: string; selectedIndex: number }>
  ) {
    const questionIds = answers.map((a) => new Types.ObjectId(a.questionId));
    const questions = await Question.find({ _id: { $in: questionIds } });

    let score = 0;
    const detail = answers.map((answer) => {
      const question = questions.find(
        (q) => q._id.toString() === answer.questionId
      );
      const correct = question
        ? question.correctIndex === answer.selectedIndex
        : false;

      if (correct) score++;

      return {
        questionId: new Types.ObjectId(answer.questionId),
        selectedIndex: answer.selectedIndex,
        correct,
      };
    });

    const total = answers.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    return { score, total, percentage, detail };
  }

  static async saveAttempt(
    userId: Types.ObjectId,
    categoryId: Types.ObjectId,
    score: number,
    total: number,
    percentage: number,
    detail: IAttempt['detail']
  ) {
    const attempt = new Attempt({
      userId,
      categoryId,
      score,
      total,
      percentage,
      detail,
    });

    const saved = await attempt.save();
    try {
      // Notify connected admin dashboards / listeners about the new attempt
      getIo().emit('attempt:created', {
        _id: saved._id,
        userId: saved.userId,
        categoryId: saved.categoryId,
        score: saved.score,
        total: saved.total,
        percentage: saved.percentage,
        createdAt: saved.createdAt,
      });
    } catch (err) {
      // If socket isn't initialized or emit fails, don't break the flow
      // eslint-disable-next-line no-console
      console.warn('Failed to emit attempt:created', err?.message || err);
    }

    return saved;
  }

  static async getCareerRecommendation(
    categoryId: Types.ObjectId,
    score: number
  ) {
    // Return the best matching career info for the achieved score.
    // Sort by minScore descending so we pick the highest threshold that the user satisfies.
    return CareerInfo.findOne({
      categoryId,
      minScore: { $lte: score },
    })
      .sort({ minScore: -1 })
      .populate('categoryId');
  }

  static async getLeaderboard(categoryId: string, limit: number = 10) {
    return Attempt.aggregate([
      { $match: { categoryId: new Types.ObjectId(categoryId) } },
      { $sort: { percentage: -1, createdAt: -1 } },
      {
        $group: {
          _id: '$userId',
          bestScore: { $max: '$percentage' },
          latestAttempt: { $first: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.passwordHash': 0,
          'user.__v': 0,
          'latestAttempt.detail': 0,
        },
      },
      { $sort: { bestScore: -1, 'latestAttempt.createdAt': -1 } },
      { $limit: limit },
    ]);
  }
}
