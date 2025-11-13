import { Router } from 'express';
import {
  quizController,
  submitQuizValidation,
} from '../controllers/quizController';
import { authenticate, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Only regular users (role: user) can fetch random questions or submit a quiz
router.get(
  '/questions/random/:categoryId',
  authenticate,
  authorize('user'),
  quizController.getRandomQuestions
);
router.post(
  '/submit',
  authenticate,
  authorize('user'),
  submitQuizValidation,
  handleValidationErrors,
  quizController.submitQuiz
);
router.get('/leaderboard/:categoryId', quizController.getLeaderboard);
router.get('/attempts', authenticate, quizController.getUserAttempts);
router.get(
  '/attempts/:attemptId',
  authenticate,
  quizController.getAttemptDetail
);

export default router;
