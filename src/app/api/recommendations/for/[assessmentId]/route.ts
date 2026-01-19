import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { getRecommendationsForAssessment } from "@/data/recommendations";
import { Dimension } from "@/types";

// GET /api/recommendations/for/:assessmentId - Get personalised recommendations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await params;
  const assessment = dataStore.getAssessmentById(assessmentId);

  if (!assessment) {
    return NextResponse.json(
      { error: "Assessment not found" },
      { status: 404 }
    );
  }

  const dimensionScores: Record<Dimension, number> = {
    [Dimension.Policy]: assessment.policyScore,
    [Dimension.RiskManagement]: assessment.riskManagementScore,
    [Dimension.Roles]: assessment.rolesScore,
    [Dimension.Training]: assessment.trainingScore,
    [Dimension.Monitoring]: assessment.monitoringScore,
    [Dimension.Vendor]: assessment.vendorScore,
    [Dimension.Improvement]: assessment.improvementScore
  };

  const recommendations = getRecommendationsForAssessment(dimensionScores);
  return NextResponse.json(recommendations);
}
