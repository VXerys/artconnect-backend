import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} from '../controllers/contactController';
import { validate } from '../middlewares/validation';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchema';

const router = Router();

router.use(authenticate);

router.get('/', getContacts);
router.get('/:id', getContactById);
router.post('/', validate(createContactSchema), createContact);
router.put('/:id', validate(updateContactSchema), updateContact);
router.delete('/:id', deleteContact);

export default router;
