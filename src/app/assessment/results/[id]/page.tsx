"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HeroMaturityBadge, MaturityBadge } from "@/components/ui/MaturityBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PriorityBadge, EffortBadge, DimensionBadge } from "@/components/ui/Badge";
import { DimensionRadarChart } from "@/components/charts/RadarChart";
import { dataStore } from "@/lib/store";
import { getRecommendationsForAssessment } from "@/data/recommendations";
import { getQuestionsByDimension } from "@/data/questions";
import { Assessment, Dimension, ALL_DIMENSIONS, Recommendation } from "@/types";
import { getMaturityLevel, getGapAnalysis, getMaturityLevelName } from "@/lib/scoring";
import { exportAssessmentPDF, exportBoardSummaryPDF } from "@/lib/pdf-export";

export default function ResultsPage() {
  const params = useParams();
  const assessmentId = params.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [previousAssessment, setPreviousAssessment] = useState<Assessment | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [expandedDimensions, setExpandedDimensions] = useState<Set<Dimension>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedAssessment = dataStore.getAssessmentById(assessmentId);
    if (loadedAssessment) {
      setAssessment(loadedAssessment);

      // Get previous assessment for comparison
      const allCompleted = dataStore.getCompletedAssessments();
      const previousIndex = allCompleted.findIndex(a => a.id === assessmentId);
      if (previousIndex < allCompleted.length - 1) {
        setPreviousAssessment(allCompleted[previousIndex + 1]);
      }

      // Get recommendations
      const dimensionScores = {
        [Dimension.Policy]: loadedAssessment.policyScore,
        [Dimension.RiskManagement]: loadedAssessment.riskManagementScore,
        [Dimension.Roles]: loadedAssessment.rolesScore,
        [Dimension.Training]: loadedAssessment.trainingScore,
        [Dimension.Monitoring]: loadedAssessment.monitoringScore,
        [Dimension.Vendor]: loadedAssessment.vendorScore,
        [Dimension.Improvement]: loadedAssessment.improvementScore
      };
      setRecommendations(getRecommendationsForAssessment(dimensionScores));
    }
    setIsLoading(false);
  }, [assessmentId]);

  const toggleDimension = (dimension: Dimension) => {
    setExpandedDimensions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dimension)) {
        newSet.delete(dimension);
      } else {
        newSet.add(dimension);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-slate700">Loading results...</div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy mb-4">Assessment Not Found</h1>
        <p className="text-slate700 mb-8">The requested assessment could not be found.</p>
        <Link href="/">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const currentScores: Record<Dimension, number> = {
    [Dimension.Policy]: assessment.policyScore,
    [Dimension.RiskManagement]: assessment.riskManagementScore,
    [Dimension.Roles]: assessment.rolesScore,
    [Dimension.Training]: assessment.trainingScore,
    [Dimension.Monitoring]: assessment.monitoringScore,
    [Dimension.Vendor]: assessment.vendorScore,
    [Dimension.Improvement]: assessment.improvementScore
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate700 mb-2">
          <span>Assessment completed</span>
          <span>•</span>
          <span>{new Date(assessment.assessmentDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}</span>
          <span>•</span>
          <span>By {assessment.completedBy}</span>
        </div>
        <h1 className="text-3xl font-bold text-navy">Assessment Results</h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Hero Badge */}
        <Card className="lg:col-span-1 flex items-center justify-center py-8">
          <HeroMaturityBadge
            level={assessment.maturityLevel}
            score={assessment.overallScore}
            lastAssessmentDate={new Date(assessment.assessmentDate)}
          />
        </Card>

        {/* Radar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dimension Scores</CardTitle>
            {previousAssessment && (
              <p className="text-sm text-slate700">Compared to previous assessment</p>
            )}
          </CardHeader>
          <CardContent>
            <DimensionRadarChart
              currentScores={currentScores}
              previousScores={previousScores}
              height={350}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dimension Deep-Dive */}
      <h2 className="text-2xl font-bold text-navy mb-4">Dimension Breakdown</h2>
      <div className="space-y-4 mb-8">
        {ALL_DIMENSIONS.map(dimension => {
          const score = currentScores[dimension];
          const level = getMaturityLevel(score);
          const gap = getGapAnalysis(score, dimension);
          const dimQuestions = getQuestionsByDimension(dimension);
          const isExpanded = expandedDimensions.has(dimension);

          // Get responses for this dimension
          const dimResponses = assessment.responses.filter(r => r.dimension === dimension);

          return (
            <Card key={dimension}>
              <button
                className="w-full text-left"
                onClick={() => toggleDimension(dimension)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-navy text-lg">{dimension}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-2xl font-bold text-navy">{score}%</span>
                        <MaturityBadge level={level} size="sm" />
                      </div>
                    </div>
                  </div>
                  <svg
                    className={`w-6 h-6 text-slate700 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <ProgressBar value={score} className="mt-3" />
              </button>

              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  {/* Gap Analysis */}
                  {gap.nextLevel && (
                    <div className="bg-ice p-4 rounded-lg mb-4">
                      <p className="text-sm text-slate700">
                        <strong>Gap Analysis:</strong> You need {gap.percentageGap} more points to reach Level {gap.nextLevel} ({getMaturityLevelName(gap.nextLevel)})
                      </p>
                    </div>
                  )}

                  {/* Questions and Answers */}
                  <div className="space-y-4">
                    {dimQuestions.map(question => {
                      const response = dimResponses.find(r => r.questionId === question.id);
                      const answer = response?.answer || 0;

                      return (
                        <div key={question.id} className="border-l-4 border-gray-200 pl-4">
                          <p className="font-medium text-navy mb-2">{question.text}</p>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-slate700">Your answer:</span>
                            <MaturityBadge level={answer as 1|2|3|4|5} size="sm" showLevel={false} />
                            <span className="text-sm text-slate700">
                              {question.levelIndicators[answer as 1|2|3|4|5]}
                            </span>
                          </div>
                          {response?.notes && (
                            <p className="text-sm text-slate700 italic mt-1">
                              Notes: {response.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Recommendations */}
      <h2 className="text-2xl font-bold text-navy mb-4">Recommendations</h2>
      <p className="text-slate700 mb-6">
        Based on your assessment, here are prioritised recommendations to improve your AI governance maturity.
      </p>

      {recommendations.length > 0 ? (
        <div className="space-y-4 mb-8">
          {recommendations.slice(0, 6).map(rec => (
            <Card key={rec.id}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <DimensionBadge dimension={rec.dimension} />
                    <PriorityBadge priority={rec.priority} />
                    <EffortBadge effort={rec.effort} />
                  </div>
                  <h3 className="font-semibold text-navy text-lg mb-2">{rec.title}</h3>
                  <p className="text-slate700 text-sm mb-3">{rec.description}</p>
                  <p className="text-xs text-slate700">
                    This helps you progress from Level {rec.currentLevel} to Level {rec.targetLevel}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <a
                    href={rec.toolkitLink}
                    className="inline-flex items-center gap-2 text-teal hover:text-[#158a85] font-medium text-sm"
                  >
                    View in Toolkit
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </Card>
          ))}

          {recommendations.length > 6 && (
            <Link href="/recommendations">
              <Button variant="outline" className="w-full">
                View All {recommendations.length} Recommendations
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <Card className="text-center py-8 mb-8">
          <p className="text-slate700">
            Congratulations! You&apos;re at the highest maturity level. Focus on maintaining your governance practices.
          </p>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <h3 className="font-semibold text-navy text-lg mb-4">Next Steps</h3>
        <div className="flex flex-wrap gap-4">
          <Link href="/">
            <Button variant="primary">Return to Dashboard</Button>
          </Link>
          <Link href="/history">
            <Button variant="outline">View Assessment History</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => assessment && exportAssessmentPDF(assessment)}
          >
            Export as PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => assessment && exportBoardSummaryPDF(assessment)}
          >
            Export Board Summary
          </Button>
        </div>
      </Card>
    </div>
  );
}
