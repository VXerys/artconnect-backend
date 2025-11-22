import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  getDashboardMetrics,
  getSalesPerformance
} from '../controllers/analyticsController';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboardMetrics);
router.get('/sales-performance', getSalesPerformance);

export default router;
