import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  uploadArtworkImage
} from '../controllers/artworkController';
import { validate } from '../middlewares/validation';
import { createArtworkSchema, updateArtworkSchema } from '../schemas/artworkSchema';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', getArtworks);
router.get('/:id', getArtworkById);
router.post('/', validate(createArtworkSchema), createArtwork);
router.put('/:id', validate(updateArtworkSchema), updateArtwork);
router.delete('/:id', deleteArtwork);
router.post('/:id/image', uploadArtworkImage);

export default router;
