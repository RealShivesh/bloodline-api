import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import { signToken } from '../lib/jwt.js';

export async function login(username, password) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const token = signToken({ userId: user.id, username: user.username });
  return {
    token,
    user: { id: user.id, username: user.username, displayName: user.displayName },
  };
}

export async function getSession(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return { id: user.id, username: user.username, displayName: user.displayName };
}
