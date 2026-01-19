"use client";

import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { getLevelColourFromScore } from "@/lib/scoring";

interface ProgressLineChartProps {
  data: Array<{
    date: string;
    overallScore: number;
    maturityLevel?: number;
  }>;
  height?: number;
  showGrid?: boolean;
  className?: string;
}

export function ProgressLineChart({
  data,
  height = 300,
  showGrid = true,
  className = ""
}: ProgressLineChartProps) {
  // Add color based on maturity level
  const dataWithColors = data.map(point => ({
    ...point,
    color: getLevelColourFromScore(point.overallScore)
  }));

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={dataWithColors}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
          <XAxis
            dataKey="date"
            tick={{ fill: "#4C5D6B", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
            }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#4C5D6B", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                    <p className="text-sm text-slate700 mb-1">
                      {new Date(data.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                    <p className="font-semibold" style={{ color: data.color }}>
                      {data.overallScore}%
                    </p>
                    {data.maturityLevel && (
                      <p className="text-xs text-slate700">Level {data.maturityLevel}</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="overallScore"
            stroke="#1AA7A1"
            strokeWidth={3}
            dot={({ cx, cy, payload }) => (
              <circle
                key={payload.date}
                cx={cx}
                cy={cy}
                r={6}
                fill={payload.color}
                stroke="white"
                strokeWidth={2}
              />
            )}
            activeDot={{ r: 8, stroke: "#1AA7A1", strokeWidth: 2, fill: "white" }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({
  data,
  width = 100,
  height = 30,
  color = "#1AA7A1",
  className = ""
}: SparklineProps) {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg className={className} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
