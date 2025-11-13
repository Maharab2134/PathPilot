"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../src/app"));
const User_1 = __importDefault(require("../src/models/User"));
const Category_1 = __importDefault(require("../src/models/Category"));
const Question_1 = __importDefault(require("../src/models/Question"));
describe('Quiz API', () => {
    let authToken;
    let categoryId;
    let questions = [];
    beforeAll(async () => {
        await mongoose_1.default.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/pathpilot_test');
    });
    afterAll(async () => {
        await mongoose_1.default.connection.dropDatabase();
        await mongoose_1.default.connection.close();
    });
    beforeEach(async () => {
        await User_1.default.deleteMany({});
        await Category_1.default.deleteMany({});
        await Question_1.default.deleteMany({});
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };
        await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(userData);
        const loginResponse = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: userData.email,
            password: userData.password
        });
        authToken = loginResponse.body.data.accessToken;
        const category = await Category_1.default.create({
            name: 'Test Category',
            description: 'Test Description'
        });
        categoryId = category._id.toString();
        questions = await Question_1.default.create([
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
            const response = await (0, supertest_1.default)(app_1.default)
                .get(`/api/quiz/questions/random/${categoryId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.questions).toHaveLength(2);
            response.body.data.questions.forEach((question) => {
                expect(question.correctIndex).toBeUndefined();
            });
        });
        it('should require authentication', async () => {
            await (0, supertest_1.default)(app_1.default)
                .get(`/api/quiz/questions/random/${categoryId}`)
                .expect(401);
        });
    });
    describe('POST /api/quiz/submit', () => {
        it('should submit quiz and return results', async () => {
            const quizData = {
                categoryId: categoryId,
                answers: [
                    { questionId: questions[0]._id.toString(), selectedIndex: 0 },
                    { questionId: questions[1]._id.toString(), selectedIndex: 0 }
                ]
            };
            const response = await (0, supertest_1.default)(app_1.default)
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
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/quiz/submit')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);
            expect(response.body.success).toBe(false);
        });
    });
});
//# sourceMappingURL=quiz.test.js.map