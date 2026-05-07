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

    const profile = await prisma.volunteerProfile.findUnique({
      where: { userId: session.user.id },
    });
    
    return NextResponse.json(profile || { skills: "", preferredlocation: "" });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ skills: "", preferredlocation: "" });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Received data:", body);
    
    const { skills, preferredlocation } = body;

    const profile = await prisma.volunteerProfile.upsert({
      where: { userId: session.user.id },
      update: { 
        skills: skills || "",
        preferredlocation: preferredlocation || "",
      },
      create: {
        userId: session.user.id,
        skills: skills || "",
        preferredlocation: preferredlocation || "",
      },
    });

    console.log("Saved profile:", profile);
    
    return NextResponse.json({ 
      success: true, 
      profile,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ 
      error: "Failed to update profile",
      details: error.message 
    }, { status: 500 });
  }
}