import { Request, Response } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import CareerInfo from '../models/CareerInfo';
import { handleValidationErrors } from '../middleware/validation';

export const careerInfoValidation = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('skills')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required'),
  body('learningPath')
    .isArray({ min: 1 })
    .withMessage('At least one learning path step is required'),
  body('minScore')
    .isInt({ min: 0, max: 100 })
    .withMessage('Minimum score must be between 0 and 100'),
];

export const careerController = {
  async getCareerInfo(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;

      const careerInfo = await CareerInfo.findOne({ categoryId }).populate(
        'categoryId',
        'name description'
      );

      if (!careerInfo) {
        return res.status(404).json({
          success: false,
          message: 'Career information not found for this category',
        });
      }

      res.json({
        success: true,
        data: { careerInfo },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching career information',
        error: error.message,
      });
    }
  },

  async createCareerInfo(req: AuthRequest, res: Response) {
    try {
      const {
        categoryId,
        title,
        description,
        skills,
        learningPath,
        youtubeLinks,
        bookLinks,
        courseLinks,
        minScore,
      } = req.body;

      const existingCareerInfo = await CareerInfo.findOne({ categoryId });
      if (existingCareerInfo) {
        return res.status(400).json({
          success: false,
          message: 'Career info for this category already exists',
        });
      }

      const careerInfo = new CareerInfo({
        categoryId,
        title,
        description,
        skills,
        learningPath,
        youtubeLinks: youtubeLinks || [],
        bookLinks: bookLinks || [],
        courseLinks: courseLinks || [],
        minScore: minScore || 70,
      });

      await careerInfo.save();
      await careerInfo.populate('categoryId', 'name description');

      res.status(201).json({
        success: true,
        message: 'Career information created successfully',
        data: { careerInfo },
      });
      // emit socket event
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getIo } = require('../socket');
        getIo().emit('career:created', careerInfo);
      } catch (err) {
        // socket not initialized
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error creating career information',
        error: error.message,
      });
    }
  },

  async updateCareerInfo(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const careerInfo = await CareerInfo.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate('categoryId', 'name description');

      if (!careerInfo) {
        return res.status(404).json({
          success: false,
          message: 'Career information not found',
        });
      }

      res.json({
        success: true,
        message: 'Career information updated successfully',
        data: { careerInfo },
      });
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getIo } = require('../socket');
        getIo().emit('career:updated', careerInfo);
      } catch (err) {
        // socket not initialized
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error updating career information',
        error: error.message,
      });
    }
  },

  async deleteCareerInfo(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const careerInfo = await CareerInfo.findByIdAndDelete(id);
      if (!careerInfo) {
        return res.status(404).json({
          success: false,
          message: 'Career information not found',
        });
      }

      res.json({
        success: true,
        message: 'Career information deleted successfully',
      });
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getIo } = require('../socket');
        getIo().emit('career:deleted', { id });
      } catch (err) {
        // socket not initialized
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error deleting career information',
        error: error.message,
      });
    }
  },
};
