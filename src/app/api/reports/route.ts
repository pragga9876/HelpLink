import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { problemType, location, description, severity, contactInfo } = body;

    // Validate
    if (!problemType || !location || !description || !severity) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Calculate priority
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

    // Create report using the correct field names
    const report = await prisma.report.create({
      data: {
        problemtype: problemType,  // Note: problemtype not problemType
        location: location,
        description: description,
        severity: severity,
        contactinfo: contactInfo || null,
        priorityscore: priorityScore,
        reporterid: session.user.id,
        createdat: new Date(),
        updatedat: new Date(),
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdat: "desc" },
    });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json([]);
  }
}