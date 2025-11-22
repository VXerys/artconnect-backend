import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { syncUser, getUserProfile, updateUserProfile } from '../controllers/authController';
import { validate } from '../middlewares/validation';
import { updateProfileSchema } from '../schemas/authSchema';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

// All routes here require authentication
// Note: Register is now handled by syncUser which is called on login/sync
router.post('/sync', authLimiter, authenticate, syncUser);

// Keeping register for backward compatibility if needed, but pointing to syncUser logic essentially
// However, the task asked to refactor auth flow. Let's stick to sync.
// If the frontend expects /register, we might need to alias it or change frontend.
// Assuming we are updating the API contract:
router.post('/register', authLimiter, authenticate, syncUser);

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), updateUserProfile);

export default router;
