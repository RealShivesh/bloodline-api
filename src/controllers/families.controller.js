import * as familiesService from '../services/families.service.js';

export async function getFamilies(req, res, next) {
  try {
    const families = await familiesService.getFamilies(req.user.userId);
    res.json({ families });
  } catch (err) {
    next(err);
  }
}

export async function getFamilyDetail(req, res, next) {
  try {
    const family = await familiesService.getFamilyDetail(req.params.familyId, req.user.userId);
    res.json({ family });
  } catch (err) {
    next(err);
  }
}
