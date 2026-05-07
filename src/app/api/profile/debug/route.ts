import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    // Check if VolunteerProfile table exists and has the right columns
    const tableCheck = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'VolunteerProfile'
    `;
    
    // Try to find or create profile
    let profile = await prisma.volunteerProfile.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!profile) {
      // Try to create one
      try {
        profile = await prisma.volunteerProfile.create({
          data: {
            userId: session.user.id,
            skills: "",
            preferredLocation: "",
          },
        });
      } catch (createError) {
        return NextResponse.json({ 
          error: "Create failed", 
          details: String(createError),
          tableColumns: tableCheck
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      profile,
      tableColumns: tableCheck
    });
  } catch (error) {
    return NextResponse.json({ 
      error: String(error),
      message: error.message 
    }, { status: 500 });
  }
}