import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Clear all existing users
    await prisma.microTask.deleteMany();
    await prisma.report.deleteMany();
    await prisma.volunteerProfile.deleteMany();
    await prisma.user.deleteMany();
    
    // Hash password properly
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log("Generated hash:", hashedPassword);
    
    // Create fresh users
    const users = await prisma.user.createMany({
      data: [
        {
          id: "1",
          email: "ngo1@example.com",
          password: hashedPassword,
          name: "NGO Howrah",
          role: "REPORTER",
        },
        {
          id: "2",
          email: "ngo2@example.com",
          password: hashedPassword,
          name: "Community Kolkata",
          role: "REPORTER",
        },
        {
          id: "3",
          email: "volunteer1@example.com",
          password: hashedPassword,
          name: "Amit Sharma",
          role: "VOLUNTEER",
        },
        {
          id: "4",
          email: "volunteer2@example.com",
          password: hashedPassword,
          name: "Priya Patel",
          role: "VOLUNTEER",
        },
        {
          id: "5",
          email: "volunteer3@example.com",
          password: hashedPassword,
          name: "Rahul Verma",
          role: "VOLUNTEER",
        },
      ],
    });
    
    // Verify users were created
    const allUsers = await prisma.user.findMany();
    
    return NextResponse.json({ 
      success: true, 
      message: `Created ${users.count} users`,
      users: allUsers.map(u => ({ email: u.email, role: u.role })),
      note: "Use password: password123"
    });
    
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}