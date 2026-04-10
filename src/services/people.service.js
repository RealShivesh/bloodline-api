import { z } from 'zod';
import prisma from '../lib/prisma.js';

export const createPersonSchema = z.object({
  name: z.string().min(1),
  maritalStatus: z.string().optional().default('single'),
  notes: z.string().optional(),
  birthYear: z.number().int().optional(),
  deathYear: z.number().int().optional(),
});

export const updatePersonSchema = z.object({
  name: z.string().min(1).optional(),
  maritalStatus: z.string().optional(),
  notes: z.string().optional(),
  birthYear: z.number().int().optional(),
  deathYear: z.number().int().optional(),
}).partial();

export async function createPerson(familyId, ownerId, data) {
  const family = await prisma.family.findFirst({ where: { id: familyId, ownerId } });
  if (!family) throw Object.assign(new Error('Family not found'), { status: 404 });

  const person = await prisma.person.create({
    data: { ...data, familyId },
  });
  return person;
}

export async function updatePerson(familyId, personId, ownerId, data) {
  const family = await prisma.family.findFirst({ where: { id: familyId, ownerId } });
  if (!family) throw Object.assign(new Error('Family not found'), { status: 404 });

  const person = await prisma.person.findFirst({ where: { id: personId, familyId } });
  if (!person) throw Object.assign(new Error('Person not found'), { status: 404 });

  const updated = await prisma.person.update({
    where: { id: personId },
    data,
  });
  return updated;
}
