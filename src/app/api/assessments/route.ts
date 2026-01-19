import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { AssessmentStatus } from "@/types";

// GET /api/assessments - List all assessments
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") as AssessmentStatus | null;

  let assessments = dataStore.getAllAssessments();

  if (status) {
    assessments = assessments.filter(a => a.status === status);
  }

  return NextResponse.json(assessments);
}

// POST /api/assessments - Create new assessment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { completedBy, completedByEmail } = body;

    if (!completedBy || !completedByEmail) {
      return NextResponse.json(
        { error: "completedBy and completedByEmail are required" },
        { status: 400 }
      );
    }

    const assessment = dataStore.createAssessment(completedBy, completedByEmail);
    return NextResponse.json(assessment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
