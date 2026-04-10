import prisma from '../lib/prisma.js';

async function verifyFamily(familyId, ownerId) {
  const family = await prisma.family.findFirst({ where: { id: familyId, ownerId } });
  if (!family) throw Object.assign(new Error('Family not found'), { status: 404 });
  return family;
}

async function verifyPerson(personId, familyId) {
  const person = await prisma.person.findFirst({ where: { id: personId, familyId } });
  if (!person) throw Object.assign(new Error(`Person ${personId} not found in family`), { status: 404 });
  return person;
}

export async function addMarriage(familyId, ownerId, { personAId, personBId, status = 'active', startYear, endYear }) {
  await verifyFamily(familyId, ownerId);
  if (personAId === personBId) throw Object.assign(new Error('Cannot marry oneself'), { status: 400 });
  await verifyPerson(personAId, familyId);
  await verifyPerson(personBId, familyId);

  const existing = await prisma.marriage.findFirst({
    where: {
      familyId,
      status: 'active',
      OR: [
        { personAId, personBId },
        { personAId: personBId, personBId: personAId },
      ],
    },
  });
  if (existing) throw Object.assign(new Error('Active marriage already exists between these people'), { status: 409 });

  const marriage = await prisma.marriage.create({
    data: { familyId, personAId, personBId, status, startYear, endYear },
  });

  await prisma.person.updateMany({
    where: { id: { in: [personAId, personBId] } },
    data: { maritalStatus: 'married' },
  });

  return marriage;
}

export async function markDivorce(familyId, ownerId, { personAId, personBId, endYear }) {
  await verifyFamily(familyId, ownerId);

  const marriage = await prisma.marriage.findFirst({
    where: {
      familyId,
      status: 'active',
      OR: [
        { personAId, personBId },
        { personAId: personBId, personBId: personAId },
      ],
    },
  });
  if (!marriage) throw Object.assign(new Error('No active marriage found between these people'), { status: 404 });

  const updated = await prisma.marriage.update({
    where: { id: marriage.id },
    data: { status: 'divorced', endYear },
  });

  await prisma.person.updateMany({
    where: { id: { in: [personAId, personBId] } },
    data: { maritalStatus: 'divorced' },
  });

  return updated;
}

export async function addParent(familyId, ownerId, { childId, parentId }) {
  await verifyFamily(familyId, ownerId);
  if (childId === parentId) throw Object.assign(new Error('Cannot be own parent'), { status: 400 });
  await verifyPerson(childId, familyId);
  await verifyPerson(parentId, familyId);

  const existingParents = await prisma.parentRelation.count({ where: { childId } });
  if (existingParents >= 2) throw Object.assign(new Error('A child can have at most 2 parents'), { status: 400 });

  try {
    const relation = await prisma.parentRelation.create({ data: { childId, parentId } });
    return relation;
  } catch (err) {
    if (err.code === 'P2002') throw Object.assign(new Error('Parent relationship already exists'), { status: 409 });
    throw err;
  }
}

export async function addStepParent(familyId, ownerId, { childId, stepParentId }) {
  await verifyFamily(familyId, ownerId);
  if (childId === stepParentId) throw Object.assign(new Error('Cannot be own step-parent'), { status: 400 });
  await verifyPerson(childId, familyId);
  await verifyPerson(stepParentId, familyId);

  try {
    const relation = await prisma.stepParentRelation.create({ data: { childId, stepParentId } });
    return relation;
  } catch (err) {
    if (err.code === 'P2002') throw Object.assign(new Error('Step-parent relationship already exists'), { status: 409 });
    throw err;
  }
}

export async function removeParent(familyId, ownerId, { childId, parentId }) {
  await verifyFamily(familyId, ownerId);
  const relation = await prisma.parentRelation.findFirst({ where: { childId, parentId } });
  if (!relation) throw Object.assign(new Error('Parent relationship not found'), { status: 404 });
  await prisma.parentRelation.delete({ where: { id: relation.id } });
}

export async function removeStepParent(familyId, ownerId, { childId, stepParentId }) {
  await verifyFamily(familyId, ownerId);
  const relation = await prisma.stepParentRelation.findFirst({ where: { childId, stepParentId } });
  if (!relation) throw Object.assign(new Error('Step-parent relationship not found'), { status: 404 });
  await prisma.stepParentRelation.delete({ where: { id: relation.id } });
}
