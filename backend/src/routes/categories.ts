import { Router } from 'express';
import { categoryController, categoryValidation } from '../controllers/categoryController';
import { authenticate, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategory);

// Admin routes
router.post('/', authenticate, authorize('admin'), categoryValidation, handleValidationErrors, categoryController.createCategory);
router.put('/:id', authenticate, authorize('admin'), categoryValidation, handleValidationErrors, categoryController.updateCategory);
router.delete('/:id', authenticate, authorize('admin'), categoryController.deleteCategory);

export default router;