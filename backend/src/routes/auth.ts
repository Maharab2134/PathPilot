import { Router } from 'express';
import { authController, registerValidation, loginValidation } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

router.post('/register', registerValidation, handleValidationErrors, authController.register);
router.post('/login', loginValidation, handleValidationErrors, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, upload.single('avatar'), authController.updateProfile);

export default router;