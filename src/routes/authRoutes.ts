import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { registerUser, getUserProfile, updateUserProfile } from '../controllers/authController';
import { validate } from '../middlewares/validation';
import { registerSchema, updateProfileSchema } from '../schemas/authSchema';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

// All routes here require authentication
router.post('/register', authLimiter, authenticate, validate(registerSchema), registerUser);
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), updateUserProfile);

export default router;
