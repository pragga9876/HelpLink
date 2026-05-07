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

    let profile = await prisma.volunteerProfile.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!profile) {
      try {
        profile = await prisma.volunteerProfile.create({
          data: {
            userId: session.user.id,
            skills: "",
            preferredlocation: "",  // ← lowercase
          },
        });
      } catch (createError) {
        return NextResponse.json({ skills: "", preferredlocation: "" });
      }
    }
    
    return NextResponse.json(profile);
  } catch (error) {
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
    const { skills, preferredlocation } = body;  // ← lowercase

    const profile = await prisma.volunteerProfile.upsert({
      where: { userId: session.user.id },
      update: { 
        skills: skills || "",
        preferredlocation: preferredlocation || "",  // ← lowercase
      },
      create: {
        userId: session.user.id,
        skills: skills || "",
        preferredlocation: preferredlocation || "",  // ← lowercase
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ 
      error: "Failed to update profile" 
    }, { status: 500 });
  }
}