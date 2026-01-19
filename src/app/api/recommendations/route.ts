import { NextRequest, NextResponse } from "next/server";
import { recommendations } from "@/data/recommendations";
import { Dimension, Priority, Effort, MaturityLevel } from "@/types";

// GET /api/recommendations - List all recommendations
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dimension = searchParams.get("dimension") as Dimension | null;
  const priority = searchParams.get("priority") as Priority | null;
  const effort = searchParams.get("effort") as Effort | null;
  const level = searchParams.get("level");

  let filtered = [...recommendations];

  if (dimension && Object.values(Dimension).includes(dimension)) {
    filtered = filtered.filter(r => r.dimension === dimension);
  }

  if (priority && Object.values(Priority).includes(priority)) {
    filtered = filtered.filter(r => r.priority === priority);
  }

  if (effort && Object.values(Effort).includes(effort)) {
    filtered = filtered.filter(r => r.effort === effort);
  }

  if (level) {
    const levelNum = parseInt(level, 10) as MaturityLevel;
    if (levelNum >= 1 && levelNum <= 5) {
      filtered = filtered.filter(r => r.currentLevel === levelNum);
    }
  }

  return NextResponse.json(filtered);
}
