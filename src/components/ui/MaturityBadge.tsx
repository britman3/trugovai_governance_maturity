"use client";

import React from "react";
import { MaturityLevel, MATURITY_LEVELS } from "@/types";
import { getLevelColour, getMaturityLevelName } from "@/lib/scoring";

interface MaturityBadgeProps {
  level: MaturityLevel;
  size?: "sm" | "md" | "lg";
  showLevel?: boolean;
  className?: string;
}

export function MaturityBadge({
  level,
  size = "md",
  showLevel = true,
  className = ""
}: MaturityBadgeProps) {
  const color = getLevelColour(level);
  const name = getMaturityLevelName(level);

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  // Use dark text for level 3 (yellow) for better contrast
  const textColor = level === MaturityLevel.Defined ? "#1a1a1a" : "white";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-full
        ${sizeStyles[size]}
        ${className}
      `}
      style={{ backgroundColor: color, color: textColor }}
    >
      {showLevel && <span>L{level}</span>}
      <span>{name}</span>
    </span>
  );
}

interface MaturityLevelCardProps {
  level: MaturityLevel;
  score?: number;
  isCurrent?: boolean;
  onClick?: () => void;
  className?: string;
}

export function MaturityLevelCard({
  level,
  score,
  isCurrent = false,
  onClick,
  className = ""
}: MaturityLevelCardProps) {
  const { name, description, scoreRange } = MATURITY_LEVELS[level];
  const color = getLevelColour(level);

  return (
    <div
      className={`
        p-4 rounded-lg border-2 transition-all duration-200
        ${isCurrent ? "border-current shadow-lg" : "border-gray-200"}
        ${onClick ? "cursor-pointer hover:border-current" : ""}
        ${className}
      `}
      style={{ borderColor: isCurrent ? color : undefined }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: color }}
        >
          {level}
        </div>
        <div>
          <h4 className="font-semibold text-navy">{name}</h4>
          <span className="text-xs text-slate700">{scoreRange}</span>
        </div>
      </div>
      <p className="text-sm text-slate700">{description}</p>
      {score !== undefined && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-sm font-medium" style={{ color }}>
            Your score: {score}%
          </span>
        </div>
      )}
    </div>
  );
}

interface HeroMaturityBadgeProps {
  level: MaturityLevel;
  score: number;
  lastAssessmentDate?: Date;
  className?: string;
}

export function HeroMaturityBadge({
  level,
  score,
  lastAssessmentDate,
  className = ""
}: HeroMaturityBadgeProps) {
  const color = getLevelColour(level);
  const name = getMaturityLevelName(level);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Large circular badge */}
      <div
        className="relative w-40 h-40 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: color }}
      >
        <div className="text-center text-white">
          <div className="text-5xl font-bold">{level}</div>
          <div className="text-sm font-medium uppercase tracking-wide">Level</div>
        </div>
        {/* Score ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width="160"
          height="160"
        >
          <circle
            cx="80"
            cy="80"
            r="76"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="4"
          />
          <circle
            cx="80"
            cy="80"
            r="76"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 478} 478`}
          />
        </svg>
      </div>

      {/* Level name */}
      <h2 className="text-2xl font-bold text-navy mb-1">{name}</h2>

      {/* Score */}
      <p className="text-lg font-semibold" style={{ color }}>
        {score}% Overall Score
      </p>

      {/* Last assessment date */}
      {lastAssessmentDate && (
        <p className="text-sm text-slate700 mt-2">
          Last assessed: {new Date(lastAssessmentDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
          })}
        </p>
      )}
    </div>
  );
}
