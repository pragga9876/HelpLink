import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Fetching microtasks...");
    
    const tasks = await prisma.microTask.findMany({
      include: {
        report: {
          select: {
            id: true,
            problemType: true,
            location: true,
            description: true,
          }
        },
        volunteer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    
    console.log(`Found ${tasks.length} microtasks`);
    
    // Return empty array if no tasks, not an error
    return NextResponse.json(tasks || []);
    
  } catch (error) {
    console.error("Error in /api/microtasks:", error);
    // Return empty array on error instead of 500
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, location, reportId } = body;

    const task = await prisma.microTask.create({
      data: {
        title,
        description,
        location,
        reportId,
        status: "AVAILABLE",
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}