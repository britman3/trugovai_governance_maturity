"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MaturityBadge } from "@/components/ui/MaturityBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Sparkline, ProgressLineChart } from "@/components/charts/LineChart";
import { DimensionRadarChart } from "@/components/charts/RadarChart";
import { dataStore } from "@/lib/store";
import { Assessment, Dimension, ALL_DIMENSIONS, DIMENSIONS } from "@/types";
import { compareAssessments } from "@/lib/scoring";

export default function HistoryPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [historyData, setHistoryData] = useState<Array<{
    date: string;
    overallScore: number;
    maturityLevel: number;
    dimensionScores: Record<Dimension, number>;
  }>>([]);
  const [selectedAssessments, setSelectedAssessments] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"timeline" | "comparison">("timeline");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const completed = dataStore.getCompletedAssessments();
    setAssessments(completed);
    setHistoryData(dataStore.getHistoryData());
    setIsLoading(false);
  }, []);

  const toggleAssessmentSelection = (id: string) => {
    setSelectedAssessments(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const getComparisonData = () => {
    if (selectedAssessments.length !== 2) return null;

    const [id1, id2] = selectedAssessments;
    const a1 = assessments.find(a => a.id === id1);
    const a2 = assessments.find(a => a.id === id2);

    if (!a1 || !a2) return null;

    const scores1: Record<Dimension, number> = {
      [Dimension.Policy]: a1.policyScore,
      [Dimension.RiskManagement]: a1.riskManagementScore,
      [Dimension.Roles]: a1.rolesScore,
      [Dimension.Training]: a1.trainingScore,
      [Dimension.Monitoring]: a1.monitoringScore,
      [Dimension.Vendor]: a1.vendorScore,
      [Dimension.Improvement]: a1.improvementScore
    };

    const scores2: Record<Dimension, number> = {
      [Dimension.Policy]: a2.policyScore,
      [Dimension.RiskManagement]: a2.riskManagementScore,
      [Dimension.Roles]: a2.rolesScore,
      [Dimension.Training]: a2.trainingScore,
      [Dimension.Monitoring]: a2.monitoringScore,
      [Dimension.Vendor]: a2.vendorScore,
      [Dimension.Improvement]: a2.improvementScore
    };

    // Determine which is older/newer
    const date1 = new Date(a1.assessmentDate);
    const date2 = new Date(a2.assessmentDate);
    const [older, newer, olderScores, newerScores] = date1 < date2
      ? [a1, a2, scores1, scores2]
      : [a2, a1, scores2, scores1];

    const comparison = compareAssessments(newerScores, olderScores);

    return {
      older,
      newer,
      olderScores,
      newerScores,
      ...comparison
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-slate700">Loading history...</div>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-ice rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-slate700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-navy mb-4">No Assessment History</h1>
        <p className="text-slate700 mb-8">
          Complete your first assessment to start tracking your AI governance progress over time.
        </p>
        <Link href="/assessment">
          <Button variant="primary">Start Your First Assessment</Button>
        </Link>
      </div>
    );
  }

  const comparison = getComparisonData();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Assessment History</h1>
        <p className="text-slate700">
          Track your AI governance maturity progress over time and compare assessments.
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={viewMode === "timeline" ? "primary" : "outline"}
          onClick={() => setViewMode("timeline")}
        >
          Timeline View
        </Button>
        <Button
          variant={viewMode === "comparison" ? "primary" : "outline"}
          onClick={() => setViewMode("comparison")}
        >
          Compare ({selectedAssessments.length}/2 selected)
        </Button>
      </div>

      {/* Trend Chart */}
      {historyData.length > 1 && viewMode === "timeline" && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Maturity Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressLineChart data={historyData} height={300} />
          </CardContent>
        </Card>
      )}

      {/* Comparison View */}
      {viewMode === "comparison" && selectedAssessments.length === 2 && comparison && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Assessment Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart Comparison */}
              <div>
                <DimensionRadarChart
                  currentScores={comparison.newerScores}
                  previousScores={comparison.olderScores}
                  height={350}
                />
              </div>

              {/* Delta Table */}
              <div>
                <div className="text-center mb-4">
                  <p className="text-slate700 text-sm">Overall Score Change</p>
                  <p className={`text-4xl font-bold ${comparison.overallDelta >= 0 ? "text-level5" : "text-level1"}`}>
                    {comparison.overallDelta >= 0 ? "+" : ""}{comparison.overallDelta}%
                  </p>
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm text-slate700">Dimension</th>
                      <th className="text-center py-2 text-sm text-slate700">
                        {new Date(comparison.older.assessmentDate).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}
                      </th>
                      <th className="text-center py-2 text-sm text-slate700">
                        {new Date(comparison.newer.assessmentDate).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}
                      </th>
                      <th className="text-center py-2 text-sm text-slate700">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALL_DIMENSIONS.map(dimension => {
                      const delta = comparison.dimensionDeltas[dimension];
                      return (
                        <tr key={dimension} className="border-b border-gray-100">
                          <td className="py-2 text-sm text-navy font-medium">
                            {DIMENSIONS[dimension].shortName}
                          </td>
                          <td className="text-center py-2 text-sm text-slate700">
                            {comparison.olderScores[dimension]}%
                          </td>
                          <td className="text-center py-2 text-sm text-slate700">
                            {comparison.newerScores[dimension]}%
                          </td>
                          <td className={`text-center py-2 text-sm font-medium ${delta >= 0 ? "text-level5" : "text-level1"}`}>
                            {delta >= 0 ? "+" : ""}{delta}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "comparison" && selectedAssessments.length < 2 && (
        <Card className="mb-8 bg-ice">
          <p className="text-center text-slate700 py-8">
            Select two assessments from the list below to compare them.
          </p>
        </Card>
      )}

      {/* Dimension Sparklines */}
      {historyData.length > 1 && viewMode === "timeline" && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dimension Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ALL_DIMENSIONS.map(dimension => {
                const dimensionData = historyData.map(h => h.dimensionScores[dimension]);
                const latest = dimensionData[dimensionData.length - 1] || 0;
                const previous = dimensionData[dimensionData.length - 2] || latest;
                const delta = latest - previous;

                return (
                  <div key={dimension} className="p-3 bg-ice rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-navy">
                        {DIMENSIONS[dimension].shortName}
                      </span>
                      <span className={`text-xs font-medium ${delta >= 0 ? "text-level5" : "text-level1"}`}>
                        {delta >= 0 ? "+" : ""}{delta}%
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-xl font-bold text-navy">{latest}%</span>
                      <Sparkline data={dimensionData} width={80} height={24} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessment List */}
      <h2 className="text-xl font-bold text-navy mb-4">All Assessments</h2>
      <div className="space-y-4">
        {assessments.map((assessment, index) => {
          const isSelected = selectedAssessments.includes(assessment.id);
          const previousAssessment = assessments[index + 1];
          const delta = previousAssessment
            ? assessment.overallScore - previousAssessment.overallScore
            : null;

          return (
            <Card
              key={assessment.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected ? "ring-2 ring-teal" : ""
              }`}
              onClick={() => viewMode === "comparison" && toggleAssessmentSelection(assessment.id)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {viewMode === "comparison" && (
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        isSelected ? "border-teal bg-teal" : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-navy">
                        {new Date(assessment.assessmentDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                      <MaturityBadge level={assessment.maturityLevel} size="sm" />
                    </div>
                    <p className="text-sm text-slate700">
                      Completed by {assessment.completedBy}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-navy">{assessment.overallScore}%</p>
                    {delta !== null && (
                      <p className={`text-sm font-medium ${delta >= 0 ? "text-level5" : "text-level1"}`}>
                        {delta >= 0 ? "+" : ""}{delta}% from previous
                      </p>
                    )}
                  </div>
                  <div className="w-32">
                    <ProgressBar value={assessment.overallScore} size="md" />
                  </div>
                  <Link href={`/assessment/results/${assessment.id}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
