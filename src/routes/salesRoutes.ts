import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  getSalesDeals,
  createSalesDeal,
  updateDealStage
} from '../controllers/salesController';
import { validate } from '../middlewares/validation';
import { createDealSchema, updateStageSchema } from '../schemas/salesSchema';

const router = Router();

router.use(authenticate);

router.get('/', getSalesDeals);
router.post('/', validate(createDealSchema), createSalesDeal);
router.put('/:id/stage', validate(updateStageSchema), updateDealStage);

export default router;
