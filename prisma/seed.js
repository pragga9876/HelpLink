const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Clear existing data
  await prisma.microTask.deleteMany();
  await prisma.report.deleteMany();
  await prisma.volunteerProfile.deleteMany();
  await prisma.user.deleteMany();
  
  // Create users
  await prisma.user.createMany({
    data: [
      { email: 'ngo1@example.com', password: hashedPassword, name: 'NGO Howrah', role: 'REPORTER' },
      { email: 'ngo2@example.com', password: hashedPassword, name: 'Community Kolkata', role: 'REPORTER' },
      { email: 'volunteer1@example.com', password: hashedPassword, name: 'Amit Sharma', role: 'VOLUNTEER' },
      { email: 'volunteer2@example.com', password: hashedPassword, name: 'Priya Patel', role: 'VOLUNTEER' },
      { email: 'volunteer3@example.com', password: hashedPassword, name: 'Rahul Verma', role: 'VOLUNTEER' }
    ]
  });
  
  console.log('✅ Created 5 users');
  console.log('\n📝 You can now login with:');
  console.log('   ngo1@example.com / password123');
  console.log('   volunteer1@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });