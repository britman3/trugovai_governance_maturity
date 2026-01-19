"use client";

import React from "react";
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { Dimension, DIMENSIONS } from "@/types";

interface RadarChartProps {
  currentScores: Record<Dimension, number>;
  previousScores?: Record<Dimension, number>;
  height?: number;
  showLegend?: boolean;
  className?: string;
}

export function DimensionRadarChart({
  currentScores,
  previousScores,
  height = 400,
  showLegend = true,
  className = ""
}: RadarChartProps) {
  // Transform data for Recharts
  const data = Object.values(Dimension).map(dimension => ({
    dimension: DIMENSIONS[dimension].shortName,
    fullName: DIMENSIONS[dimension].name,
    current: currentScores[dimension] || 0,
    previous: previousScores?.[dimension] || 0
  }));

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#4C5D6B", fontSize: 12, fontWeight: 500 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#4C5D6B", fontSize: 10 }}
            tickCount={6}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                    <p className="font-semibold text-navy mb-1">{data.fullName}</p>
                    <p className="text-sm">
                      <span className="inline-block w-3 h-3 rounded-full bg-teal mr-2"></span>
                      Current: {data.current}%
                    </p>
                    {previousScores && (
                      <p className="text-sm">
                        <span className="inline-block w-3 h-3 rounded-full bg-mint300 mr-2"></span>
                        Previous: {data.previous}%
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          {previousScores && (
            <Radar
              name="Previous"
              dataKey="previous"
              stroke="#71D1C8"
              fill="#71D1C8"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          )}
          <Radar
            name="Current"
            dataKey="current"
            stroke="#1AA7A1"
            fill="#1AA7A1"
            fillOpacity={0.5}
            strokeWidth={2}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span className="text-slate700 text-sm">{value}</span>
              )}
            />
          )}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
