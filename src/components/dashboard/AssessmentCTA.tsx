"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface AssessmentCTAProps {
  daysSinceLastAssessment: number | null;
  hasCompletedAssessment: boolean;
  className?: string;
}

export function AssessmentCTA({
  daysSinceLastAssessment,
  hasCompletedAssessment,
  className = ""
}: AssessmentCTAProps) {
  const isOverdue = daysSinceLastAssessment !== null && daysSinceLastAssessment > 90;

  return (
    <Card className={`${className} ${isOverdue ? "border-2 border-level2" : ""}`}>
      <div className="flex items-center justify-between">
        <div>
          {!hasCompletedAssessment ? (
            <>
              <h3 className="text-lg font-semibold text-navy mb-1">
                Begin Your First Assessment
              </h3>
              <p className="text-slate700 text-sm">
                Complete a self-assessment to understand your AI governance maturity.
                This typically takes 15-20 minutes.
              </p>
            </>
          ) : isOverdue ? (
            <>
              <h3 className="text-lg font-semibold text-level2 mb-1">
                Assessment Overdue
              </h3>
              <p className="text-slate700 text-sm">
                It&apos;s been {daysSinceLastAssessment} days since your last assessment.
                Quarterly reviews are recommended.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-navy mb-1">
                Ready for Re-Assessment?
              </h3>
              <p className="text-slate700 text-sm">
                {daysSinceLastAssessment !== null ? (
                  <>Days since last assessment: {daysSinceLastAssessment}</>
                ) : (
                  <>Track your progress with regular assessments</>
                )}
                <span className="block mt-1">Recommended frequency: Quarterly</span>
              </p>
            </>
          )}
        </div>

        <Link href="/assessment">
          <Button variant={isOverdue ? "primary" : "primary"} size="md">
            {hasCompletedAssessment ? "Start New Assessment" : "Start Assessment"}
          </Button>
        </Link>
      </div>
    </Card>
  );
}

interface EmptyDashboardProps {
  className?: string;
}

export function EmptyDashboard({ className = "" }: EmptyDashboardProps) {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="w-24 h-24 mx-auto mb-6 bg-ice rounded-full flex items-center justify-center">
        <svg
          className="w-12 h-12 text-teal"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-navy mb-2">
        Welcome to TruGovAI Maturity Assessment
      </h2>
      <p className="text-slate700 mb-8 max-w-md mx-auto">
        Start your AI governance journey by completing your first self-assessment.
        Understand where you stand and get personalised recommendations.
      </p>
      <Link href="/assessment">
        <Button variant="primary" size="lg">
          Start Your First Assessment
        </Button>
      </Link>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
        <div className="p-4">
          <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center mb-3">
            <span className="text-teal font-bold">1</span>
          </div>
          <h4 className="font-semibold text-navy mb-1">Answer Questions</h4>
          <p className="text-sm text-slate700">
            21 questions across 7 governance dimensions. Takes about 15-20 minutes.
          </p>
        </div>
        <div className="p-4">
          <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center mb-3">
            <span className="text-teal font-bold">2</span>
          </div>
          <h4 className="font-semibold text-navy mb-1">Get Your Score</h4>
          <p className="text-sm text-slate700">
            Receive a maturity level (1-5) with detailed breakdown by dimension.
          </p>
        </div>
        <div className="p-4">
          <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center mb-3">
            <span className="text-teal font-bold">3</span>
          </div>
          <h4 className="font-semibold text-navy mb-1">Take Action</h4>
          <p className="text-sm text-slate700">
            Get tailored recommendations linking to TruGovAI toolkit resources.
          </p>
        </div>
      </div>
    </div>
  );
}
