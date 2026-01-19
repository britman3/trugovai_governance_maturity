"use client";

import React from "react";
import { Priority, Effort } from "@/types";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className = "" }: PriorityBadgeProps) {
  const styles = {
    [Priority.Critical]: "bg-level1 text-white",
    [Priority.High]: "bg-level2 text-white",
    [Priority.Medium]: "bg-level3 text-[#1a1a1a]",
    [Priority.Low]: "bg-level4 text-white"
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
        ${styles[priority]}
        ${className}
      `}
    >
      {priority}
    </span>
  );
}

interface EffortBadgeProps {
  effort: Effort;
  className?: string;
}

export function EffortBadge({ effort, className = "" }: EffortBadgeProps) {
  const styles = {
    [Effort.Quick]: "bg-mint300 text-navy",
    [Effort.Moderate]: "bg-teal text-white",
    [Effort.Significant]: "bg-navy text-white"
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
        ${styles[effort]}
        ${className}
      `}
    >
      {effort}
    </span>
  );
}

interface DimensionBadgeProps {
  dimension: string;
  className?: string;
}

export function DimensionBadge({ dimension, className = "" }: DimensionBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
        bg-ice text-navy border border-slate700/20
        ${className}
      `}
    >
      {dimension}
    </span>
  );
}
