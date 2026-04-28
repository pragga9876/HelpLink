import { PrismaClient, ProblemType, Severity, TaskStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.microTask.deleteMany();
  await prisma.report.deleteMany();
  await prisma.volunteerProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const reporter1 = await prisma.user.create({
    data: {
      email: 'ngo1@example.com',
      password: hashedPassword,
      name: 'NGO Howrah',
      role: 'REPORTER',
    },
  });

  const reporter2 = await prisma.user.create({
    data: {
      email: 'ngo2@example.com',
      password: hashedPassword,
      name: 'Community Kolkata',
      role: 'REPORTER',
    },
  });

  const volunteer1 = await prisma.user.create({
    data: {
      email: 'volunteer1@example.com',
      password: hashedPassword,
      name: 'Amit Sharma',
      role: 'VOLUNTEER',
      volunteerProfile: {
        create: {
          skills: 'Medical Aid,Logistics',
          preferredLocation: 'Howrah',
        },
      },
    },
  });

  const volunteer2 = await prisma.user.create({
    data: {
      email: 'volunteer2@example.com',
      password: hashedPassword,
      name: 'Priya Patel',
      role: 'VOLUNTEER',
      volunteerProfile: {
        create: {
          skills: 'Teaching,Verification',
          preferredLocation: 'Kolkata',
        },
      },
    },
  });

  const volunteer3 = await prisma.user.create({
    data: {
      email: 'volunteer3@example.com',
      password: hashedPassword,
      name: 'Rahul Verma',
      role: 'VOLUNTEER',
      volunteerProfile: {
        create: {
          skills: 'Cooking/Distribution,Logistics',
          preferredLocation: 'Howrah',
        },
      },
    },
  });

  // Create reports
  const reports = [
    {
      problemType: ProblemType.MEDICAL,
      location: 'Howrah',
      description: 'Urgent medical supplies needed for flood-affected families. Need bandages, antiseptics, and basic medicines.',
      severity: Severity.HIGH,
      contactInfo: '+91 9876543210',
      reporterId: reporter1.id,
    },
    {
      problemType: ProblemType.FOOD,
      location: 'Howrah',
      description: '200 families need food supplies. Rice, dal, and basic vegetables required.',
      severity: Severity.HIGH,
      contactInfo: '+91 9876543211',
      reporterId: reporter1.id,
    },
    {
      problemType: ProblemType.SHELTER,
      location: 'Kolkata',
      description: 'Temporary shelter materials needed for displaced families. Tarpaulin, blankets, and mats.',
      severity: Severity.MEDIUM,
      contactInfo: '+91 9876543212',
      reporterId: reporter2.id,
    },
    {
      problemType: ProblemType.EDUCATION,
      location: 'Kolkata',
      description: 'School supplies for 50 children. Notebooks, pencils, and textbooks.',
      severity: Severity.MEDIUM,
      contactInfo: '+91 9876543213',
      reporterId: reporter2.id,
    },
    {
      problemType: ProblemType.SANITATION,
      location: 'Howrah',
      description: 'Sanitation kits required. Soap, sanitizers, and hygiene products.',
      severity: Severity.LOW,
      contactInfo: '+91 9876543214',
      reporterId: reporter1.id,
    },
    {
      problemType: ProblemType.MEDICAL,
      location: 'Kolkata',
      description: 'First aid training session needed for community workers.',
      severity: Severity.MEDIUM,
      contactInfo: '+91 9876543215',
      reporterId: reporter2.id,
    },
  ];

  const createdReports = [];
  for (const report of reports) {
    const created = await prisma.report.create({
      data: report,
    });
    createdReports.push(created);
  }

  // Create micro-tasks
  const microTasks = [
    {
      title: 'Deliver Medical Supplies',
      description: 'Pick up and deliver medical supplies to Howrah camp. 5 boxes of medicines.',
      location: 'Howrah',
      reportId: createdReports[0].id,
      status: TaskStatus.AVAILABLE,
    },
    {
      title: 'Medical Volunteer',
      description: 'Spend 2 hours providing basic first aid at the Howrah camp.',
      location: 'Howrah',
      reportId: createdReports[0].id,
      status: TaskStatus.AVAILABLE,
    },
    {
      title: 'Collect Food Donations',
      description: 'Coordinate with local grocery stores to collect food items.',
      location: 'Howrah',
      reportId: createdReports[1].id,
      status: TaskStatus.CLAIMED,
      volunteerId: volunteer3.id,
    },
    {
      title: 'Pack Food Kits',
      description: 'Help pack 200 food kits at the distribution center.',
      location: 'Howrah',
      reportId: createdReports[1].id,
      status: TaskStatus.AVAILABLE,
    },
    {
      title: 'Distribute Food',
      description: 'Join food distribution team for 3 hours.',
      location: 'Howrah',
      reportId: createdReports[1].id,
      status: TaskStatus.AVAILABLE,
    },
    {
      title: 'Set Up Shelter',
      description: 'Help set up temporary shelters at the camp site.',
      location: 'Kolkata',
      reportId: createdReports[2].id,
      status: TaskStatus.AVAILABLE,
    },
    {
      title: 'Collect Blankets',
      description: 'Collect blankets and warm clothes from donors.',
      location: 'Kolkata',
      reportId: createdReports[2].id,
      status: TaskStatus.AVAILABLE,
    },
    {
      title: 'Teach Children',
      description: 'Conduct 2-hour teaching session for children aged 6-10.',
      location: 'Kolkata',
      reportId: createdReports[3].id,
      status: TaskStatus.AVAILABLE,
    },
    {
      title: 'Prepare Teaching Materials',
      description: 'Create simple worksheets and learning materials.',
      location: 'Kolkata',
      reportId: createdReports[3].id,
      status: TaskStatus.CLAIMED,
      volunteerId: volunteer2.id,
    },
    {
      title: 'Distribute Sanitation Kits',
      description: 'Help distribute hygiene kits to 50 families.',
      location: 'Howrah',
      reportId: createdReports[4].id,
      status: TaskStatus.AVAILABLE,
    },
  ];

  for (const task of microTasks) {
    await prisma.microTask.create({
      data: task,
    });
  }

  // Update priority scores
  for (const report of createdReports) {
    let baseScore = 0;
    switch (report.problemType) {
      case ProblemType.MEDICAL: baseScore = 5; break;
      case ProblemType.FOOD: baseScore = 4; break;
      case ProblemType.EDUCATION: baseScore = 3; break;
      case ProblemType.SHELTER: baseScore = 3; break;
      case ProblemType.SANITATION: baseScore = 2; break;
      default: baseScore = 1;
    }
    
    const sameLocationCount = await prisma.report.count({
      where: { location: report.location }
    });
    
    const severityBonus = report.severity === Severity.HIGH ? 1 : 0;
    const priorityScore = baseScore + sameLocationCount + severityBonus;
    
    await prisma.report.update({
      where: { id: report.id },
      data: { priorityScore },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });