"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { HeroMaturityBadge } from "@/components/ui/MaturityBadge";
import { DimensionRadarChart } from "@/components/charts/RadarChart";
import { ProgressLineChart } from "@/components/charts/LineChart";
import { DimensionScoreCard } from "@/components/dashboard/DimensionScoreCard";
import { AssessmentCTA, EmptyDashboard } from "@/components/dashboard/AssessmentCTA";
import { dataStore } from "@/lib/store";
import { Assessment, Dimension, ALL_DIMENSIONS } from "@/types";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [previousAssessment, setPreviousAssessment] = useState<Assessment | null>(null);
  const [historyData, setHistoryData] = useState<Array<{
    date: string;
    overallScore: number;
    maturityLevel: number;
  }>>([]);
  const [daysSinceLastAssessment, setDaysSinceLastAssessment] = useState<number | null>(null);

  useEffect(() => {
    const summary = dataStore.getDashboardSummary();
    setCurrentAssessment(summary.currentAssessment);
    setPreviousAssessment(summary.previousAssessment);
    setDaysSinceLastAssessment(summary.daysSinceLastAssessment);
    setHistoryData(dataStore.getHistoryData());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-slate700">Loading dashboard...</div>
      </div>
    );
  }

  // Show empty state if no completed assessments
  if (!currentAssessment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyDashboard />
      </div>
    );
  }

  // Build dimension scores for current and previous
  const currentScores: Record<Dimension, number> = {
    [Dimension.Policy]: currentAssessment.policyScore,
    [Dimension.RiskManagement]: currentAssessment.riskManagementScore,
    [Dimension.Roles]: currentAssessment.rolesScore,
    [Dimension.Training]: currentAssessment.trainingScore,
    [Dimension.Monitoring]: currentAssessment.monitoringScore,
    [Dimension.Vendor]: currentAssessment.vendorScore,
    [Dimension.Improvement]: currentAssessment.improvementScore
  };

  const previousScores = previousAssessment
    ? {
        [Dimension.Policy]: previousAssessment.policyScore,
        [Dimension.RiskManagement]: previousAssessment.riskManagementScore,
        [Dimension.Roles]: previousAssessment.rolesScore,
        [Dimension.Training]: previousAssessment.trainingScore,
        [Dimension.Monitoring]: previousAssessment.monitoringScore,
        [Dimension.Vendor]: previousAssessment.vendorScore,
        [Dimension.Improvement]: previousAssessment.improvementScore
      }
    : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-2">AI Governance Dashboard</h1>
        <p className="text-slate700">
          Track your organisation&apos;s AI governance maturity and progress over time.
        </p>
      </div>

      {/* Assessment CTA */}
      <AssessmentCTA
        daysSinceLastAssessment={daysSinceLastAssessment}
        hasCompletedAssessment={true}
        className="mb-8"
      />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Hero Maturity Badge */}
        <Card className="lg:col-span-1 flex items-center justify-center py-8">
          <HeroMaturityBadge
            level={currentAssessment.maturityLevel}
            score={currentAssessment.overallScore}
            lastAssessmentDate={new Date(currentAssessment.assessmentDate)}
          />
        </Card>

        {/* Radar Chart */}
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-semibold text-navy mb-4">Dimension Scores</h3>
          <DimensionRadarChart
            currentScores={currentScores}
            previousScores={previousScores}
            height={350}
          />
        </Card>
      </div>

      {/* Dimension Score Cards */}
      <h3 className="text-xl font-semibold text-navy mb-4">Performance by Dimension</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {ALL_DIMENSIONS.map(dimension => (
          <DimensionScoreCard
            key={dimension}
            dimension={dimension}
            score={currentScores[dimension]}
            previousScore={previousScores?.[dimension]}
          />
        ))}
      </div>

      {/* Progress Over Time */}
      {historyData.length > 1 && (
        <Card className="mb-8">
          <h3 className="text-xl font-semibold text-navy mb-4">Progress Over Time</h3>
          <ProgressLineChart data={historyData} height={300} />
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-slate700 mb-1">Total Assessments</p>
            <p className="text-3xl font-bold text-navy">{historyData.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-slate700 mb-1">Highest Score</p>
            <p className="text-3xl font-bold text-level5">
              {historyData.length > 0
                ? Math.max(...historyData.map(h => h.overallScore))
                : 0}%
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-slate700 mb-1">Score Change</p>
            <p className={`text-3xl font-bold ${
              previousAssessment
                ? currentAssessment.overallScore - previousAssessment.overallScore >= 0
                  ? "text-level5"
                  : "text-level1"
                : "text-slate700"
            }`}>
              {previousAssessment
                ? `${currentAssessment.overallScore - previousAssessment.overallScore >= 0 ? "+" : ""}${currentAssessment.overallScore - previousAssessment.overallScore}%`
                : "N/A"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
