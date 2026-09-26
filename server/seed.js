import { PrismaClient } from '@prisma/client';
import { createAuthUser, createAppUser } from './services/supabase.js';

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
  const email = 'harshitseth.eh@gmail.com';
  const password = '123456';

  // Create identity in Supabase Auth (admin bypasses email confirmation).
  const { data: authData, error: authError } = await createAuthUser(email, password, 'Harshit', 'admin');
  if (authError) {
    console.error('Failed to create Supabase auth user:', authError.message);
    throw new Error(authError.message);
  }

  const authUserId = authData?.user?.id;
  if (!authUserId) throw new Error('Supabase auth user id missing');

  await createAppUser({
    id: authUserId,
    email,
    passwordHash: 'SUPABASE_MANAGED',
    role: 'admin',
    fullName: 'Harshit',
    status: 'active',
  });

  console.log('Admin user created: Harshit (harshitseth.eh@gmail.com)');
  console.log('');
  console.log('Login credentials:');
  console.log('  Admin:   harshitseth.eh@gmail.com / 123456');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());