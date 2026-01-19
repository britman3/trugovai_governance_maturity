import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { compareAssessments } from "@/lib/scoring";
import { Dimension } from "@/types";

// GET /api/dashboard/comparison - Compare two assessments
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id1 = searchParams.get("id1");
  const id2 = searchParams.get("id2");

  if (!id1 || !id2) {
    return NextResponse.json(
      { error: "id1 and id2 query parameters are required" },
      { status: 400 }
    );
  }

  const assessment1 = dataStore.getAssessmentById(id1);
  const assessment2 = dataStore.getAssessmentById(id2);

  if (!assessment1 || !assessment2) {
    return NextResponse.json(
      { error: "One or both assessments not found" },
      { status: 404 }
    );
  }

  const scores1: Record<Dimension, number> = {
    [Dimension.Policy]: assessment1.policyScore,
    [Dimension.RiskManagement]: assessment1.riskManagementScore,
    [Dimension.Roles]: assessment1.rolesScore,
    [Dimension.Training]: assessment1.trainingScore,
    [Dimension.Monitoring]: assessment1.monitoringScore,
    [Dimension.Vendor]: assessment1.vendorScore,
    [Dimension.Improvement]: assessment1.improvementScore
  };

  const scores2: Record<Dimension, number> = {
    [Dimension.Policy]: assessment2.policyScore,
    [Dimension.RiskManagement]: assessment2.riskManagementScore,
    [Dimension.Roles]: assessment2.rolesScore,
    [Dimension.Training]: assessment2.trainingScore,
    [Dimension.Monitoring]: assessment2.monitoringScore,
    [Dimension.Vendor]: assessment2.vendorScore,
    [Dimension.Improvement]: assessment2.improvementScore
  };

  const comparison = compareAssessments(scores1, scores2);

  return NextResponse.json({
    assessment1: {
      id: assessment1.id,
      date: assessment1.assessmentDate,
      overallScore: assessment1.overallScore,
      maturityLevel: assessment1.maturityLevel,
      dimensionScores: scores1
    },
    assessment2: {
      id: assessment2.id,
      date: assessment2.assessmentDate,
      overallScore: assessment2.overallScore,
      maturityLevel: assessment2.maturityLevel,
      dimensionScores: scores2
    },
    deltas: comparison.dimensionDeltas,
    overallDelta: comparison.overallDelta
  });
}
