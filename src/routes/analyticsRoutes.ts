import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  getDashboardMetrics,
  getRevenueAnalytics,
  getPipelineMetrics
} from '../controllers/analyticsController';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboardMetrics);
router.get('/revenue', getRevenueAnalytics);
router.get('/pipeline', getPipelineMetrics);

export default router;
