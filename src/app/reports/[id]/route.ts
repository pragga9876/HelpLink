import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        reporter: {
          select: { name: true, email: true }
        },
        microTasks: true
      }
    });
    
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}