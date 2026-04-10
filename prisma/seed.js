import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  const owner = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
      displayName: 'Shivesh',
    },
  });
  console.log('Created owner:', owner.username);

  const family = await prisma.family.upsert({
    where: { id: 'seed-family-1' },
    update: {},
    create: {
      id: 'seed-family-1',
      name: 'The Sharma Family',
      ownerId: owner.id,
    },
  });
  console.log('Created family:', family.name);

  const raj = await prisma.person.upsert({
    where: { id: 'seed-person-raj' },
    update: {},
    create: {
      id: 'seed-person-raj',
      familyId: family.id,
      name: 'Raj Sharma',
      maritalStatus: 'married',
      birthYear: 1960,
    },
  });

  const priya = await prisma.person.upsert({
    where: { id: 'seed-person-priya' },
    update: {},
    create: {
      id: 'seed-person-priya',
      familyId: family.id,
      name: 'Priya Sharma',
      maritalStatus: 'divorced',
      birthYear: 1963,
    },
  });

  const anita = await prisma.person.upsert({
    where: { id: 'seed-person-anita' },
    update: {},
    create: {
      id: 'seed-person-anita',
      familyId: family.id,
      name: 'Anita Mehta',
      maritalStatus: 'married',
      birthYear: 1965,
    },
  });

  const arjun = await prisma.person.upsert({
    where: { id: 'seed-person-arjun' },
    update: {},
    create: {
      id: 'seed-person-arjun',
      familyId: family.id,
      name: 'Arjun Sharma',
      maritalStatus: 'single',
      birthYear: 1988,
    },
  });

  const meera = await prisma.person.upsert({
    where: { id: 'seed-person-meera' },
    update: {},
    create: {
      id: 'seed-person-meera',
      familyId: family.id,
      name: 'Meera Sharma',
      maritalStatus: 'single',
      birthYear: 1990,
    },
  });

  console.log('Created people');

  await prisma.marriage.upsert({
    where: { id: 'seed-marriage-1' },
    update: {},
    create: {
      id: 'seed-marriage-1',
      familyId: family.id,
      personAId: raj.id,
      personBId: priya.id,
      status: 'divorced',
      startYear: 1985,
      endYear: 2005,
    },
  });

  await prisma.marriage.upsert({
    where: { id: 'seed-marriage-2' },
    update: {},
    create: {
      id: 'seed-marriage-2',
      familyId: family.id,
      personAId: raj.id,
      personBId: anita.id,
      status: 'active',
      startYear: 2007,
    },
  });

  console.log('Created marriages');

  await prisma.parentRelation.upsert({
    where: { id: 'seed-parent-1' },
    update: {},
    create: {
      id: 'seed-parent-1',
      childId: arjun.id,
      parentId: raj.id,
    },
  });

  await prisma.parentRelation.upsert({
    where: { id: 'seed-parent-2' },
    update: {},
    create: {
      id: 'seed-parent-2',
      childId: arjun.id,
      parentId: priya.id,
    },
  });

  await prisma.parentRelation.upsert({
    where: { id: 'seed-parent-3' },
    update: {},
    create: {
      id: 'seed-parent-3',
      childId: meera.id,
      parentId: raj.id,
    },
  });

  await prisma.parentRelation.upsert({
    where: { id: 'seed-parent-4' },
    update: {},
    create: {
      id: 'seed-parent-4',
      childId: meera.id,
      parentId: priya.id,
    },
  });

  await prisma.stepParentRelation.upsert({
    where: { id: 'seed-step-1' },
    update: {},
    create: {
      id: 'seed-step-1',
      childId: arjun.id,
      stepParentId: anita.id,
    },
  });

  await prisma.stepParentRelation.upsert({
    where: { id: 'seed-step-2' },
    update: {},
    create: {
      id: 'seed-step-2',
      childId: meera.id,
      stepParentId: anita.id,
    },
  });

  console.log('Created relationships');
  console.log('Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
