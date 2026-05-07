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
    
    return NextResponse.json({
      skills: profile?.skills || "",
      preferredLocation: profile?.preferredLocation || "",
    });
  } catch (error) {
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
    console.log("Saving:", body);

    const profile = await prisma.volunteerProfile.upsert({
      where: { userId: session.user.id },
      update: { 
        skills: body.skills || "",
        preferredLocation: body.preferredLocation || "",
      },
      create: {
        userId: session.user.id,
        skills: body.skills || "",
        preferredLocation: body.preferredLocation || "",
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}