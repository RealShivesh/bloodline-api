import { Router } from 'express';
import { login, session } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.get('/session', requireAuth, session);

export default router;
