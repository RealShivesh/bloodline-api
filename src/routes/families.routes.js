import { Router } from 'express';
import { getFamilies, getFamilyDetail } from '../controllers/families.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getFamilies);
router.get('/:familyId', getFamilyDetail);

export default router;
