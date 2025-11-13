import { Request, Response } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import Category from '../models/Category';
import { handleValidationErrors } from '../middleware/validation';

export const categoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
];

export const categoryController = {
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await Category.find({ active: true })
        .select('name description')
        .sort({ name: 1 });

      res.json({
        success: true,
        data: { categories },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching categories',
        error: error.message,
      });
    }
  },

  async getCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      res.json({
        success: true,
        data: { category },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching category',
        error: error.message,
      });
    }
  },

  async createCategory(req: AuthRequest, res: Response) {
    try {
      const { name, description } = req.body;

      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists',
        });
      }

      const category = new Category({ name, description });
      await category.save();

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category },
      });
      // emit socket event (optional)
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getIo } = require('../socket');
        getIo().emit('category:created', category);
      } catch (err) {
        // socket not initialized
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error creating category',
        error: error.message,
      });
    }
  },

  async updateCategory(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, active } = req.body;

      const category = await Category.findByIdAndUpdate(
        id,
        { name, description, active },
        { new: true, runValidators: true }
      );

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      res.json({
        success: true,
        message: 'Category updated successfully',
        data: { category },
      });
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getIo } = require('../socket');
        getIo().emit('category:updated', category);
      } catch (err) {
        // socket not initialized
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error updating category',
        error: error.message,
      });
    }
  },

  async deleteCategory(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      res.json({
        success: true,
        message: 'Category deleted successfully',
      });
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getIo } = require('../socket');
        getIo().emit('category:deleted', { id });
      } catch (err) {
        // socket not initialized
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error deleting category',
        error: error.message,
      });
    }
  },
};
