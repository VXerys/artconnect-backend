import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  getSalesDeals,
  getSalesDealById,
  createSalesDeal,
  updateSalesDeal,
  updateDealStage,
  deleteSalesDeal
} from '../controllers/salesController';
import { validate } from '../middlewares/validation';
import { createDealSchema, updateStageSchema } from '../schemas/salesSchema';

const router = Router();

router.use(authenticate);

router.get('/', getSalesDeals);
router.get('/:id', getSalesDealById);
router.post('/', validate(createDealSchema), createSalesDeal);
router.put('/:id', updateSalesDeal); // Add specific schema if needed, otherwise uses partials
router.put('/:id/stage', validate(updateStageSchema), updateDealStage);
router.delete('/:id', deleteSalesDeal);

export default router;
