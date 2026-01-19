import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { Dimension } from "@/types";

// GET /api/dashboard/summary - Current maturity level and scores
export async function GET() {
  const summary = dataStore.getDashboardSummary();
  const latest = summary.currentAssessment;

  if (!latest) {
    return NextResponse.json({
      hasAssessment: false,
      maturityLevel: null,
      overallScore: null,
      dimensionScores: null,
      daysSinceLastAssessment: null
    });
  }

  return NextResponse.json({
    hasAssessment: true,
    maturityLevel: latest.maturityLevel,
    overallScore: latest.overallScore,
    dimensionScores: {
      [Dimension.Policy]: latest.policyScore,
      [Dimension.RiskManagement]: latest.riskManagementScore,
      [Dimension.Roles]: latest.rolesScore,
      [Dimension.Training]: latest.trainingScore,
      [Dimension.Monitoring]: latest.monitoringScore,
      [Dimension.Vendor]: latest.vendorScore,
      [Dimension.Improvement]: latest.improvementScore
    },
    assessmentDate: latest.assessmentDate,
    completedBy: latest.completedBy,
    daysSinceLastAssessment: summary.daysSinceLastAssessment,
    totalAssessments: summary.totalAssessments
  });
}
