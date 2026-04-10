import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

vi.mock('../src/lib/prisma.js', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

import prisma from '../src/lib/prisma.js';
import bcrypt from 'bcrypt';
import { signToken } from '../src/lib/jwt.js';

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 if body is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('returns 401 if user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/login').send({ username: 'x', password: 'y' });
    expect(res.status).toBe(401);
  });

  it('returns 401 if password is wrong', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: '1', username: 'admin', passwordHash: 'hash', displayName: 'A' });
    bcrypt.compare.mockResolvedValue(false);
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('returns token and user on success', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: '1', username: 'admin', passwordHash: 'hash', displayName: 'Admin' });
    bcrypt.compare.mockResolvedValue(true);
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'admin123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ username: 'admin' });
  });
});

describe('GET /api/auth/session', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/session');
    expect(res.status).toBe(401);
  });

  it('returns user with valid token', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: '1', username: 'admin', displayName: 'Admin' });
    const token = signToken({ userId: '1', username: 'admin' });
    const res = await request(app).get('/api/auth/session').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ username: 'admin' });
  });
});
