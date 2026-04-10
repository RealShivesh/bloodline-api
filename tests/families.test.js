import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { signToken } from '../src/lib/jwt.js';

vi.mock('../src/lib/prisma.js', () => ({
  default: {
    family: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    person: {
      findMany: vi.fn(),
    },
  },
}));

import prisma from '../src/lib/prisma.js';

const TOKEN = signToken({ userId: 'user-1', username: 'admin' });
const AUTH = { Authorization: `Bearer ${TOKEN}` };

describe('GET /api/families', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/families');
    expect(res.status).toBe(401);
  });

  it('returns families list', async () => {
    prisma.family.findMany.mockResolvedValue([
      { id: 'f1', name: 'Sharma', _count: { people: 3 } },
    ]);
    const res = await request(app).get('/api/families').set(AUTH);
    expect(res.status).toBe(200);
    expect(res.body.families).toHaveLength(1);
    expect(res.body.families[0]).toMatchObject({ id: 'f1', name: 'Sharma', members: 3 });
  });
});
