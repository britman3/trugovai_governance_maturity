import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";

// GET /api/assessments/latest - Get most recent completed assessment
export async function GET() {
  const assessment = dataStore.getLatestAssessment();

  if (!assessment) {
    return NextResponse.json(
      { error: "No completed assessments found" },
      { status: 404 }
    );
  }

  return NextResponse.json(assessment);
}
