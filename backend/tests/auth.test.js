"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../src/app"));
const User_1 = __importDefault(require("../src/models/User"));
describe('Auth API', () => {
    beforeAll(async () => {
        await mongoose_1.default.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/pathpilot_test');
    });
    afterAll(async () => {
        await mongoose_1.default.connection.dropDatabase();
        await mongoose_1.default.connection.close();
    });
    beforeEach(async () => {
        await User_1.default.deleteMany({});
    });
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User registered successfully');
            expect(response.body.data.user).toHaveProperty('id');
            expect(response.body.data.user.email).toBe(userData.email);
            expect(response.body.data.user.name).toBe(userData.name);
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
        });
        it('should not register user with duplicate email', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };
            await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(userData);
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User with this email already exists');
        });
        it('should validate required fields', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({})
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
    });
    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
        });
        it('should login user successfully', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123'
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send(loginData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.data.user.email).toBe(loginData.email);
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
        });
        it('should not login with wrong password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid email or password');
        });
        it('should not login with non-existent email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid email or password');
        });
    });
});
//# sourceMappingURL=auth.test.js.map