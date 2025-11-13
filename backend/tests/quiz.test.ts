import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import User from '../src/models/User';
import Category from '../src/models/Category';
import Question from '../src/models/Question';

describe('Quiz API', () => {
  let authToken: string;
  let categoryId: string;
  let questions: any[] = [];

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/pathpilot_test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Category.deleteMany({});
    await Question.deleteMany({});

    // Create user and get token
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    await request(app).post('/api/auth/register').send(userData);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    authToken = loginResponse.body.data.accessToken;

    // Create category
    const category = await Category.create({
      name: 'Test Category',
      description: 'Test Description'
    });
    categoryId = category._id.toString();

    // Create questions
    questions = await Question.create([
      {
        categoryId: category._id,
        text: 'Test Question 1',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: 0,
        difficulty: 'easy'
      },
      {
        categoryId: category._id,
        text: 'Test Question 2',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: 1,
        difficulty: 'medium'
      }
    ]);
  });

  describe('GET /api/quiz/questions/random/:categoryId', () => {
    it('should get random questions for category', async () => {
      const response = await request(app)
        .get(`/api/quiz/questions/random/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.questions).toHaveLength(2);
      
      // Should not include correct answers
      response.body.data.questions.forEach((question: any) => {
        expect(question.correctIndex).toBeUndefined();
      });
    });

    it('should require authentication', async () => {
      await request(app)
        .get(`/api/quiz/questions/random/${categoryId}`)
        .expect(401);
    });
  });

  describe('POST /api/quiz/submit', () => {
    it('should submit quiz and return results', async () => {
      const quizData = {
        categoryId: categoryId,
        answers: [
          { questionId: questions[0]._id.toString(), selectedIndex: 0 }, // Correct
          { questionId: questions[1]._id.toString(), selectedIndex: 0 }  // Wrong
        ]
      };

      const response = await request(app)
        .post('/api/quiz/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quizData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.attempt).toHaveProperty('id');
      expect(response.body.data.attempt.score).toBe(1);
      expect(response.body.data.attempt.total).toBe(2);
      expect(response.body.data.attempt.percentage).toBe(50);
      expect(response.body.data.passed).toBe(false);
    });

    it('should validate quiz submission data', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});