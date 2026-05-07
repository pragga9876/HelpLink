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
    
    // Always return an object with the expected fields
    return NextResponse.json({
      skills: profile?.skills || "",
      preferredlocation: profile?.preferredlocation || "",
    });
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
    console.log("Received:", body);

    // Try to update existing profile
    try {
      const updated = await prisma.volunteerProfile.update({
        where: { userId: session.user.id },
        data: {
          skills: body.skills || "",
          preferredlocation: body.preferredlocation || "",
        },
      });
      console.log("Updated existing profile:", updated);
      return NextResponse.json({ success: true, profile: updated });
    } catch (updateError) {
      // If update fails, create new profile
      const created = await prisma.volunteerProfile.create({
        data: {
          userId: session.user.id,
          skills: body.skills || "",
          preferredlocation: body.preferredlocation || "",
        },
      });
      console.log("Created new profile:", created);
      return NextResponse.json({ success: true, profile: created });
    }
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ 
      error: "Failed to update profile",
      details: String(error)
    }, { status: 500 });
  }
}