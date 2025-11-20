import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  getSalesDeals,
  createSalesDeal,
  updateDealStage
} from '../controllers/salesController';

const router = Router();

router.use(authenticate);

router.get('/', getSalesDeals);
router.post('/', createSalesDeal);
router.put('/:id/stage', updateDealStage);

export default router;
