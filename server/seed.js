import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean ALL existing data - fresh empty database
  await prisma.sessionTracking.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.skillRequest.deleteMany();
  await prisma.driveRequest.deleteMany();
  await prisma.feedbackSkill.deleteMany();
  await prisma.curriculumGap.deleteMany();
  await prisma.companyImprovementPath.deleteMany();
  await prisma.studentApplication.deleteMany();
  await prisma.internshipJob.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.studentQuizAttempt.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.studentProject.deleteMany();
  await prisma.skillMaster.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.user.deleteMany();

  console.log('All default data cleared.');

  // ─── Admin User (Harshit) ────────────────────────────
  const password = await bcrypt.hash('123456', 12);

  await prisma.user.create({
    data: {
      email: 'harshitseth.eh@gmail.com',
      passwordHash: password,
      role: 'admin',
      fullName: 'Harshit',
      isVerified: true,
      status: 'active',
    },
  });

  console.log('Admin user created: Harshit (harshitseth.eh@gmail.com)');
  console.log('');
  console.log('Login credentials:');
  console.log('  Admin:   harshitseth.eh@gmail.com / 123456');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
