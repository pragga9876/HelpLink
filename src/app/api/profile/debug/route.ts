import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try to find existing profile
    let profile = await prisma.volunteerProfile.findUnique({
      where: { userId: session.user.id },
    });
    
    // If no profile exists, create an empty one
    if (!profile) {
      try {
        profile = await prisma.volunteerProfile.create({
          data: {
            userId: session.user.id,
            skills: "",
            preferredLocation: "",
          },
        });
      } catch (createError) {
        // If creation fails, return empty object
        return NextResponse.json({ skills: "", preferredLocation: "" });
      }
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    // Return empty profile instead of error
    return NextResponse.json({ skills: "", preferredLocation: "" });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { skills, preferredLocation } = body;

    // Validate input
    if (skills === undefined || preferredLocation === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert profile
    const profile = await prisma.volunteerProfile.upsert({
      where: { userId: session.user.id },
      update: { 
        skills: skills || "",
        preferredLocation: preferredLocation || "",
      },
      create: {
        userId: session.user.id,
        skills: skills || "",
        preferredLocation: preferredLocation || "",
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("POST /api/profile error:", error);
    return NextResponse.json({ 
      error: "Failed to update profile",
      details: error.message 
    }, { status: 500 });
  }
}