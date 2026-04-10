import * as peopleService from '../services/people.service.js';

export async function createPerson(req, res, next) {
  try {
    const parsed = peopleService.createPersonSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
    }
    const person = await peopleService.createPerson(req.params.familyId, req.user.userId, parsed.data);
    res.status(201).json({ person });
  } catch (err) {
    next(err);
  }
}

export async function updatePerson(req, res, next) {
  try {
    const parsed = peopleService.updatePersonSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
    }
    const person = await peopleService.updatePerson(
      req.params.familyId,
      req.params.personId,
      req.user.userId,
      parsed.data
    );
    res.json({ person });
  } catch (err) {
    next(err);
  }
}
