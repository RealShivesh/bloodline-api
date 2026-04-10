import { Router } from 'express';
import {
  addMarriage, markDivorce,
  addParent, addStepParent,
  removeParent, removeStepParent,
} from '../controllers/relationships.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.post('/marriages', addMarriage);
router.patch('/marriages/divorce', markDivorce);
router.post('/relationships/parents', addParent);
router.post('/relationships/step-parents', addStepParent);
router.delete('/relationships/parents', removeParent);
router.delete('/relationships/step-parents', removeStepParent);

export default router;
