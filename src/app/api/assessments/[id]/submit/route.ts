import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/store";

// POST /api/assessments/:id/submit - Submit completed assessment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const assessment = dataStore.submitAssessment(id);

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit assessment" },
      { status: 400 }
    );
  }
}
