import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import categoryRoutes from './routes/categories';
import quizRoutes from './routes/quiz';
import careerRoutes from './routes/career';
import adminRoutes from './routes/admin';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
const uploadsPath = process.env.UPLOAD_PATH
  ? path.isAbsolute(process.env.UPLOAD_PATH)
    ? process.env.UPLOAD_PATH
    : path.join(process.cwd(), process.env.UPLOAD_PATH)
  : path.join(__dirname, '../uploads/profile');

app.use('/uploads/profile', express.static(uploadsPath));

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/pathpilot';

// Connect to MongoDB (skip during tests; tests manage their own connection)
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((error) => console.error('❌ MongoDB connection error:', error));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'PathPilot API is running!',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Error handling middleware
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Error:', error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate field value entered',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
);

const PORT = process.env.PORT || 5000;

// Create HTTP server and attach socket.io
const server = http.createServer(app);

// Lazy-import socket initializer to avoid requiring socket.io when not installed during tests
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { initSocket } = require('./socket');
  initSocket(server);
} catch (err) {
  console.warn(
    'Socket.IO not initialized (socket.io may not be installed):',
    (err as any).message
  );
}

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `📚 API Documentation available at http://localhost:${PORT}/api/health`
  );
});

export default app;
