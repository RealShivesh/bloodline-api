import prisma from '../lib/prisma.js';

export async function getFamilies(ownerId) {
  const families = await prisma.family.findMany({
    where: { ownerId },
    include: { _count: { select: { people: true } } },
  });
  return families.map((f) => ({
    id: f.id,
    name: f.name,
    members: f._count.people,
  }));
}

export async function getFamilyDetail(familyId, ownerId) {
  const family = await prisma.family.findFirst({
    where: { id: familyId, ownerId },
    include: {
      people: {
        include: {
          parentRelations: { include: { parent: true } },
          stepParentRelations: { include: { stepParent: true } },
          marriagesAsA: { include: { personB: true } },
          marriagesAsB: { include: { personA: true } },
        },
      },
    },
  });
  if (!family) throw Object.assign(new Error('Family not found'), { status: 404 });

  return {
    id: family.id,
    name: family.name,
    people: family.people.map((p) => {
      const marriages = [
        ...p.marriagesAsA.map((m) => ({
          spouseId: m.personBId,
          status: m.status,
          startYear: m.startYear,
          endYear: m.endYear,
        })),
        ...p.marriagesAsB.map((m) => ({
          spouseId: m.personAId,
          status: m.status,
          startYear: m.startYear,
          endYear: m.endYear,
        })),
      ];
      return {
        id: p.id,
        name: p.name,
        maritalStatus: p.maritalStatus,
        birthYear: p.birthYear,
        deathYear: p.deathYear,
        notes: p.notes,
        parents: p.parentRelations.map((r) => r.parentId),
        stepParents: p.stepParentRelations.map((r) => r.stepParentId),
        marriages,
      };
    }),
  };
}
