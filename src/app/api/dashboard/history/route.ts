import { NextResponse } from "next/server";
import { dataStore } from "@/lib/store";

// GET /api/dashboard/history - Historical assessments data
export async function GET() {
  const history = dataStore.getHistoryData();
  return NextResponse.json(history);
}
