import { Router } from 'express';
import { createPerson, updatePerson } from '../controllers/people.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.post('/', createPerson);
router.patch('/:personId', updatePerson);

export default router;
