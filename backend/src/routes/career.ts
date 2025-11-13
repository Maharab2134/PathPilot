import { Router } from 'express';
import { careerController, careerInfoValidation } from '../controllers/careerController';
import { authenticate, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/:categoryId', careerController.getCareerInfo);

// Admin routes
router.post('/', authenticate, authorize('admin'), careerInfoValidation, handleValidationErrors, careerController.createCareerInfo);
router.put('/:id', authenticate, authorize('admin'), careerInfoValidation, handleValidationErrors, careerController.updateCareerInfo);
router.delete('/:id', authenticate, authorize('admin'), careerController.deleteCareerInfo);

export default router;