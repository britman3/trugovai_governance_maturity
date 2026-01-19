import { NextRequest, NextResponse } from "next/server";
import { getQuestionsByDimension } from "@/data/questions";
import { Dimension } from "@/types";

// GET /api/questions/:dimension - Get questions for dimension
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dimension: string }> }
) {
  const { dimension } = await params;
  const decodedDimension = decodeURIComponent(dimension);

  // Check if it's a valid dimension
  if (!Object.values(Dimension).includes(decodedDimension as Dimension)) {
    return NextResponse.json(
      { error: "Invalid dimension" },
      { status: 400 }
    );
  }

  const questions = getQuestionsByDimension(decodedDimension as Dimension);
  return NextResponse.json(questions);
}
