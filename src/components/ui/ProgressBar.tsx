"use client";

import React from "react";
import { getLevelColourFromScore } from "@/lib/scoring";

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  useMaturityColors?: boolean;
  color?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = "md",
  className = "",
  useMaturityColors = true,
  color
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  };

  const fillColor = color || (useMaturityColors ? getLevelColourFromScore(value) : "var(--teal)");

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-slate700">{Math.round(value)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out`}
          style={{
            width: `${percentage}%`,
            backgroundColor: fillColor
          }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  useMaturityColors?: boolean;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  className = "",
  children,
  useMaturityColors = true
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const fillColor = useMaturityColors ? getLevelColourFromScore(value) : "var(--teal)";

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
