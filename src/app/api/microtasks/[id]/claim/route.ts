import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = params.id;
    
    // Check if task exists and is available
    const existingTask = await prisma.microTask.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (existingTask.status !== "AVAILABLE") {
      return NextResponse.json({ error: "Task already claimed" }, { status: 400 });
    }

    // Update the task
    const updatedTask = await prisma.microTask.update({
      where: { id: taskId },
      data: {
        status: "CLAIMED",
        volunteerId: session.user.id,
      },
    });

    return NextResponse.json(updatedTask);
    
  } catch (error) {
    console.error("Error claiming task:", error);
    return NextResponse.json({ error: "Failed to claim task" }, { status: 500 });
  }
}