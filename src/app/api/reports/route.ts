import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("API: Fetching reports...");
    
    const reports = await prisma.report.findMany({
      orderBy: { priorityScore: "desc" },
      include: { 
        reporter: {
          select: { name: true, email: true }
        }
      },
    });
    
    console.log(`API: Found ${reports.length} reports`);
    
    return NextResponse.json(reports);
  } catch (error) {
    console.error("API Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { problemType, location, description, severity, contactInfo } = body;

    // Calculate priority score
    let baseScore = 0;
    switch (problemType) {
      case "MEDICAL": baseScore = 5; break;
      case "FOOD": baseScore = 4; break;
      case "EDUCATION": baseScore = 3; break;
      case "SHELTER": baseScore = 3; break;
      case "SANITATION": baseScore = 2; break;
      default: baseScore = 1;
    }

    const sameLocationCount = await prisma.report.count({ where: { location } });
    const severityBonus = severity === "HIGH" ? 1 : 0;
    const priorityScore = baseScore + sameLocationCount + severityBonus;

    const report = await prisma.report.create({
      data: {
        problemType,
        location,
        description,
        severity,
        contactInfo,
        priorityScore,
        reporterId: session.user.id,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}