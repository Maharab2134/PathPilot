import { Request, Response } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { AuthService } from '../services/authService';
import { handleValidationErrors } from '../middleware/validation';

export const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists',
        });
      }

      // Create user
      const user = await AuthService.createUser({ name, email, password });

      // Generate tokens
      const tokens = AuthService.generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error registering user',
        error: error.message,
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await AuthService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Generate tokens
      const tokens = AuthService.generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error during login',
        error: error.message,
      });
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
      }

      const payload = AuthService.verifyRefreshToken(refreshToken);

      // Generate new access token using AuthService helper
      const tokens = AuthService.generateTokens({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      });

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: { accessToken: tokens.accessToken },
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        error: error.message,
      });
    }
  },

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = req.user!;
      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching profile',
        error: error.message,
      });
    }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { name } = req.body;
      const user = req.user!;

      user.name = name || user.name;

      if (req.file) {
        user.avatarUrl = `/uploads/profile/${req.file.filename}`;
      }

      await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error updating profile',
        error: error.message,
      });
    }
  },
};
