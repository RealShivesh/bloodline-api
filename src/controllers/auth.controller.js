import { z } from 'zod';
import * as authService from '../services/auth.service.js';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
    }
    const { username, password } = parsed.data;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function session(req, res, next) {
  try {
    const user = await authService.getSession(req.user.userId);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
