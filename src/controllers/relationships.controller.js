import { z } from 'zod';
import * as relService from '../services/relationships.service.js';

const marriageSchema = z.object({
  personAId: z.string().uuid(),
  personBId: z.string().uuid(),
  status: z.enum(['active', 'divorced', 'widowed']).optional(),
  startYear: z.number().int().optional(),
  endYear: z.number().int().optional(),
});

const divorceSchema = z.object({
  personAId: z.string().uuid(),
  personBId: z.string().uuid(),
  endYear: z.number().int().optional(),
});

const parentSchema = z.object({
  childId: z.string().uuid(),
  parentId: z.string().uuid(),
});

const stepParentSchema = z.object({
  childId: z.string().uuid(),
  stepParentId: z.string().uuid(),
});

const removeParentSchema = z.object({
  childId: z.string().uuid(),
  parentId: z.string().uuid(),
});

const removeStepParentSchema = z.object({
  childId: z.string().uuid(),
  stepParentId: z.string().uuid(),
});

function validate(schema, data, res) {
  const result = schema.safeParse(data);
  if (!result.success) {
    res.status(400).json({ error: 'Validation failed', details: result.error.flatten().fieldErrors });
    return null;
  }
  return result.data;
}

export async function addMarriage(req, res, next) {
  try {
    const data = validate(marriageSchema, req.body, res);
    if (!data) return;
    const marriage = await relService.addMarriage(req.params.familyId, req.user.userId, data);
    res.status(201).json({ marriage });
  } catch (err) { next(err); }
}

export async function markDivorce(req, res, next) {
  try {
    const data = validate(divorceSchema, req.body, res);
    if (!data) return;
    const marriage = await relService.markDivorce(req.params.familyId, req.user.userId, data);
    res.json({ marriage });
  } catch (err) { next(err); }
}

export async function addParent(req, res, next) {
  try {
    const data = validate(parentSchema, req.body, res);
    if (!data) return;
    const relation = await relService.addParent(req.params.familyId, req.user.userId, data);
    res.status(201).json({ relation });
  } catch (err) { next(err); }
}

export async function addStepParent(req, res, next) {
  try {
    const data = validate(stepParentSchema, req.body, res);
    if (!data) return;
    const relation = await relService.addStepParent(req.params.familyId, req.user.userId, data);
    res.status(201).json({ relation });
  } catch (err) { next(err); }
}

export async function removeParent(req, res, next) {
  try {
    const data = validate(removeParentSchema, req.body, res);
    if (!data) return;
    await relService.removeParent(req.params.familyId, req.user.userId, data);
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function removeStepParent(req, res, next) {
  try {
    const data = validate(removeStepParentSchema, req.body, res);
    if (!data) return;
    await relService.removeStepParent(req.params.familyId, req.user.userId, data);
    res.status(204).send();
  } catch (err) { next(err); }
}
