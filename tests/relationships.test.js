import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { signToken } from '../src/lib/jwt.js';

vi.mock('../src/lib/prisma.js', () => ({
  default: {
    family: { findFirst: vi.fn() },
    person: { findFirst: vi.fn(), updateMany: vi.fn() },
    marriage: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
    parentRelation: { count: vi.fn(), create: vi.fn(), findFirst: vi.fn() },
    stepParentRelation: { create: vi.fn(), findFirst: vi.fn() },
  },
}));

import prisma from '../src/lib/prisma.js';

const TOKEN = signToken({ userId: 'user-1', username: 'admin' });
const AUTH = { Authorization: `Bearer ${TOKEN}` };
const FID = 'family-1';
const PA = '00000000-0000-0000-0000-000000000001';
const PB = '00000000-0000-0000-0000-000000000002';
const PC = '00000000-0000-0000-0000-000000000003';

describe('POST /api/families/:familyId/marriages', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 for self-marriage', async () => {
    prisma.family.findFirst.mockResolvedValue({ id: FID });
    const res = await request(app)
      .post(`/api/families/${FID}/marriages`)
      .set(AUTH)
      .send({ personAId: PA, personBId: PA });
    expect(res.status).toBe(400);
  });

  it('creates a marriage', async () => {
    prisma.family.findFirst.mockResolvedValue({ id: FID });
    prisma.person.findFirst.mockResolvedValue({ id: PA });
    prisma.marriage.findFirst.mockResolvedValue(null);
    prisma.marriage.create.mockResolvedValue({ id: 'm1', personAId: PA, personBId: PB, status: 'active' });
    prisma.person.updateMany.mockResolvedValue({});
    const res = await request(app)
      .post(`/api/families/${FID}/marriages`)
      .set(AUTH)
      .send({ personAId: PA, personBId: PB });
    expect(res.status).toBe(201);
    expect(res.body.marriage).toMatchObject({ status: 'active' });
  });
});

describe('PATCH /api/families/:familyId/marriages/divorce', () => {
  beforeEach(() => vi.clearAllMocks());

  it('marks a marriage as divorced', async () => {
    prisma.family.findFirst.mockResolvedValue({ id: FID });
    prisma.marriage.findFirst.mockResolvedValue({ id: 'm1', status: 'active', personAId: PA, personBId: PB });
    prisma.marriage.update.mockResolvedValue({ id: 'm1', status: 'divorced', endYear: 2020 });
    prisma.person.updateMany.mockResolvedValue({});
    const res = await request(app)
      .patch(`/api/families/${FID}/marriages/divorce`)
      .set(AUTH)
      .send({ personAId: PA, personBId: PB, endYear: 2020 });
    expect(res.status).toBe(200);
    expect(res.body.marriage.status).toBe('divorced');
  });
});

describe('POST /api/families/:familyId/relationships/parents', () => {
  beforeEach(() => vi.clearAllMocks());

  it('adds a parent relationship', async () => {
    prisma.family.findFirst.mockResolvedValue({ id: FID });
    prisma.person.findFirst.mockResolvedValue({ id: PC });
    prisma.parentRelation.count.mockResolvedValue(0);
    prisma.parentRelation.create.mockResolvedValue({ id: 'pr1', childId: PC, parentId: PA });
    const res = await request(app)
      .post(`/api/families/${FID}/relationships/parents`)
      .set(AUTH)
      .send({ childId: PC, parentId: PA });
    expect(res.status).toBe(201);
  });

  it('rejects self-parenting', async () => {
    prisma.family.findFirst.mockResolvedValue({ id: FID });
    const res = await request(app)
      .post(`/api/families/${FID}/relationships/parents`)
      .set(AUTH)
      .send({ childId: PA, parentId: PA });
    expect(res.status).toBe(400);
  });
});
