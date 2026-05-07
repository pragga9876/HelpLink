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
        console.error("Create profile error:", createError);
        return NextResponse.json({ skills: "", preferredLocation: "" });
      }
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
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
    console.log("Received update:", body); // Debug log
    
    const { skills, preferredLocation } = body;

    // Validate input
    if (skills === undefined) {
      return NextResponse.json({ error: "Skills field missing" }, { status: 400 });
    }

    // Update or create profile
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

    console.log("Updated profile:", profile); // Debug log

    return NextResponse.json({ 
      success: true, 
      profile,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("POST /api/profile error:", error);
    return NextResponse.json({ 
      error: "Failed to update profile",
      details: error.message 
    }, { status: 500 });
  }
}