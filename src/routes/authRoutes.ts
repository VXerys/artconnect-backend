import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { registerUser, getUserProfile, updateUserProfile } from '../controllers/authController';

const router = Router();

// All routes here require authentication
router.post('/register', authenticate, registerUser);
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);

export default router;
