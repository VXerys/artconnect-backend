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

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', getArtworks);
router.get('/:id', getArtworkById);
router.post('/', createArtwork);
router.put('/:id', updateArtwork);
router.delete('/:id', deleteArtwork);
router.post('/:id/image', uploadArtworkImage);

export default router;
