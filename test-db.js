const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing database connection...');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`✅ Users: ${userCount}`);
    
    // Count reports
    const reportCount = await prisma.report.count();
    console.log(`✅ Reports: ${reportCount}`);
    
    // Count microtasks
    const taskCount = await prisma.microTask.count();
    console.log(`✅ Micro-tasks: ${taskCount}`);
    
    // Get first few tasks
    const tasks = await prisma.microTask.findMany({
      take: 3,
      include: { report: true }
    });
    console.log(`✅ Sample tasks:`, tasks.map(t => t.title));
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();