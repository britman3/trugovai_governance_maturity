import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/store";
import { AssessmentStatus, Dimension } from "@/types";

// GET /api/assessments/:id - Get single assessment with responses
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const assessment = dataStore.getAssessmentById(id);

  if (!assessment) {
    return NextResponse.json(
      { error: "Assessment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(assessment);
}

// PUT /api/assessments/:id - Update assessment (save progress)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { responses } = body;

    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: "responses array is required" },
        { status: 400 }
      );
    }

    // Validate each response
    for (const response of responses) {
      if (
        typeof response.questionId !== "string" ||
        !Object.values(Dimension).includes(response.dimension) ||
        typeof response.answer !== "number" ||
        response.answer < 1 ||
        response.answer > 5
      ) {
        return NextResponse.json(
          { error: "Invalid response format" },
          { status: 400 }
        );
      }

      if (response.notes && response.notes.length > 500) {
        return NextResponse.json(
          { error: "Notes cannot exceed 500 characters" },
          { status: 400 }
        );
      }
    }

    const assessment = dataStore.updateAssessment(id, responses);

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found or cannot be updated" },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// DELETE /api/assessments/:id - Delete assessment (draft only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const assessment = dataStore.getAssessmentById(id);

  if (!assessment) {
    return NextResponse.json(
      { error: "Assessment not found" },
      { status: 404 }
    );
  }

  if (assessment.status !== AssessmentStatus.Draft) {
    return NextResponse.json(
      { error: "Only draft assessments can be deleted" },
      { status: 400 }
    );
  }

  const deleted = dataStore.deleteAssessment(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Failed to delete assessment" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
