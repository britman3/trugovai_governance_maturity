"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MaturityBadge } from "@/components/ui/MaturityBadge";
import { Dimension, DIMENSIONS } from "@/types";
import { getMaturityLevel } from "@/lib/scoring";
import Link from "next/link";

interface DimensionScoreCardProps {
  dimension: Dimension;
  score: number;
  previousScore?: number;
  showImproveAction?: boolean;
  className?: string;
}

export function DimensionScoreCard({
  dimension,
  score,
  previousScore,
  showImproveAction = true,
  className = ""
}: DimensionScoreCardProps) {
  const { name, description } = DIMENSIONS[dimension];
  const level = getMaturityLevel(score);
  const delta = previousScore !== undefined ? score - previousScore : undefined;

  return (
    <Card className={`h-full ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-navy text-lg">{name}</h4>
          <p className="text-sm text-slate700">{description}</p>
        </div>
        <MaturityBadge level={level} size="sm" />
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-2xl font-bold text-navy">{score}%</span>
          {delta !== undefined && delta !== 0 && (
            <span className={`text-sm font-medium ${delta > 0 ? "text-level5" : "text-level1"}`}>
              {delta > 0 ? "+" : ""}{delta}%
            </span>
          )}
        </div>
        <ProgressBar value={score} size="md" />
      </div>

      {showImproveAction && (
        <Link
          href={`/recommendations?dimension=${encodeURIComponent(dimension)}`}
          className="text-sm font-medium text-teal hover:text-[#158a85] inline-flex items-center gap-1"
        >
          Improve this area
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      )}
    </Card>
  );
}
