import { NextResponse } from "next/server";
import { questions } from "@/data/questions";

// GET /api/questions - Get all questions
export async function GET() {
  return NextResponse.json(questions);
}
