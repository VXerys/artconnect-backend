import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact
} from '../controllers/contactController';

const router = Router();

router.use(authenticate);

router.get('/', getContacts);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;
