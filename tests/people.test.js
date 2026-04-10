import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { signToken } from '../src/lib/jwt.js';

vi.mock('../src/lib/prisma.js', () => ({
  default: {
    family: { findFirst: vi.fn() },
    person: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
  },
}));

import prisma from '../src/lib/prisma.js';

const TOKEN = signToken({ userId: 'user-1', username: 'admin' });
const AUTH = { Authorization: `Bearer ${TOKEN}` };
const FAMILY_ID = 'family-1';

describe('POST /api/families/:familyId/people', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 404 if family not found', async () => {
    prisma.family.findFirst.mockResolvedValue(null);
    const res = await request(app)
      .post(`/api/families/${FAMILY_ID}/people`)
      .set(AUTH)
      .send({ name: 'Alice' });
    expect(res.status).toBe(404);
  });

  it('creates a person', async () => {
    prisma.family.findFirst.mockResolvedValue({ id: FAMILY_ID, ownerId: 'user-1' });
    prisma.person.create.mockResolvedValue({
      id: 'p1',
      familyId: FAMILY_ID,
      name: 'Alice',
      maritalStatus: 'single',
    });
    const res = await request(app)
      .post(`/api/families/${FAMILY_ID}/people`)
      .set(AUTH)
      .send({ name: 'Alice' });
    expect(res.status).toBe(201);
    expect(res.body.person.name).toBe('Alice');
  });

  it('returns 400 for missing name', async () => {
    const res = await request(app)
      .post(`/api/families/${FAMILY_ID}/people`)
      .set(AUTH)
      .send({});
    expect(res.status).toBe(400);
  });
});
