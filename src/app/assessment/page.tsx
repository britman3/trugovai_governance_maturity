"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { WizardProgress, DimensionHeader } from "@/components/assessment/WizardProgress";
import { MaturityBadge } from "@/components/ui/MaturityBadge";
import { questions, getQuestionsByDimension } from "@/data/questions";
import { dataStore } from "@/lib/store";
import { Assessment, AssessmentResponse, Dimension, ALL_DIMENSIONS } from "@/types";
import { calculateAssessmentResults, getMaturityLevel, getMaturityLevelName, getLevelColour } from "@/lib/scoring";

interface LocalResponse {
  questionId: string;
  dimension: Dimension;
  answer: number;
  notes: string;
}

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [responses, setResponses] = useState<Map<string, LocalResponse>>(new Map());
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Get questions for current dimension
  const currentDimension = currentStep > 0 && currentStep < 8 ? ALL_DIMENSIONS[currentStep - 1] : null;
  const dimensionQuestions = currentDimension ? getQuestionsByDimension(currentDimension) : [];

  // Check if current step is complete
  const isCurrentStepComplete = () => {
    if (currentStep === 0) {
      return userName.trim() !== "" && userEmail.trim() !== "";
    }
    if (currentStep === 8) return true;
    if (!currentDimension) return false;

    return dimensionQuestions.every(q => responses.has(q.id) && responses.get(q.id)!.answer > 0);
  };

  // Initialize or load draft assessment
  useEffect(() => {
    const drafts = dataStore.getDraftAssessments();
    if (drafts.length > 0) {
      const draft = drafts[0];
      setAssessment(draft);
      setUserName(draft.completedBy);
      setUserEmail(draft.completedByEmail);

      // Load existing responses
      const existingResponses = new Map<string, LocalResponse>();
      draft.responses.forEach(r => {
        existingResponses.set(r.questionId, {
          questionId: r.questionId,
          dimension: r.dimension,
          answer: r.answer,
          notes: r.notes
        });
      });
      setResponses(existingResponses);

      // Calculate completed steps
      const completed: number[] = [];
      if (draft.completedBy && draft.completedByEmail) completed.push(0);
      ALL_DIMENSIONS.forEach((dim, index) => {
        const dimQuestions = getQuestionsByDimension(dim);
        if (dimQuestions.every(q => existingResponses.has(q.id))) {
          completed.push(index + 1);
        }
      });
      setCompletedSteps(completed);
    }
  }, []);

  // Save responses when they change
  useEffect(() => {
    if (assessment && responses.size > 0) {
      const responseArray: AssessmentResponse[] = Array.from(responses.values()).map(r => ({
        id: r.questionId,
        assessmentId: assessment.id,
        questionId: r.questionId,
        dimension: r.dimension,
        answer: r.answer,
        notes: r.notes
      }));
      dataStore.updateAssessment(assessment.id, responseArray);
    }
  }, [responses, assessment]);

  const handleStartAssessment = () => {
    if (!userName.trim() || !userEmail.trim()) return;

    let currentAssessment = assessment;
    if (!currentAssessment) {
      currentAssessment = dataStore.createAssessment(userName, userEmail);
      setAssessment(currentAssessment);
    }

    setCompletedSteps([...completedSteps, 0]);
    setCurrentStep(1);
  };

  const handleAnswerQuestion = (questionId: string, dimension: Dimension, answer: number, notes: string) => {
    setResponses(prev => {
      const newResponses = new Map(prev);
      newResponses.set(questionId, { questionId, dimension, answer, notes });
      return newResponses;
    });
  };

  const handleNext = () => {
    if (!isCurrentStepComplete()) return;

    if (currentStep > 0 && currentStep < 8) {
      setCompletedSteps(prev => [...prev.filter(s => s !== currentStep), currentStep]);
    }

    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!assessment || responses.size < 21) return;

    setIsSubmitting(true);
    try {
      dataStore.submitAssessment(assessment.id);
      router.push(`/assessment/results/${assessment.id}`);
    } catch (error) {
      console.error("Failed to submit assessment:", error);
      alert("Failed to submit assessment. Please ensure all questions are answered.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate preview scores for review step
  const getPreviewScores = () => {
    const responseArray: AssessmentResponse[] = Array.from(responses.values()).map(r => ({
      id: r.questionId,
      assessmentId: assessment?.id || "",
      questionId: r.questionId,
      dimension: r.dimension,
      answer: r.answer,
      notes: r.notes
    }));
    return calculateAssessmentResults(responseArray);
  };

  // Step 0: Introduction
  if (currentStep === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WizardProgress
          currentStep={0}
          completedSteps={completedSteps}
          className="mb-8"
        />

        <Card className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-teal/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-navy mb-4">AI Governance Self-Assessment</h1>

          <p className="text-slate700 mb-6 max-w-xl mx-auto">
            This assessment will help you understand your organisation&apos;s AI governance maturity across seven key dimensions. Answer honestly based on your current practices.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left max-w-xl mx-auto">
            <div className="p-4 bg-ice rounded-lg">
              <div className="text-2xl font-bold text-teal mb-1">15-20</div>
              <div className="text-sm text-slate700">Minutes to complete</div>
            </div>
            <div className="p-4 bg-ice rounded-lg">
              <div className="text-2xl font-bold text-teal mb-1">21</div>
              <div className="text-sm text-slate700">Questions total</div>
            </div>
            <div className="p-4 bg-ice rounded-lg">
              <div className="text-2xl font-bold text-teal mb-1">7</div>
              <div className="text-sm text-slate700">Governance dimensions</div>
            </div>
          </div>

          <div className="bg-ice p-4 rounded-lg mb-8 text-left max-w-xl mx-auto">
            <h3 className="font-semibold text-navy mb-2">Tips for accurate self-assessment:</h3>
            <ul className="text-sm text-slate700 space-y-1">
              <li>• Be honest about your current state, not where you want to be</li>
              <li>• Consider evidence and documentation, not just intentions</li>
              <li>• If unsure between two levels, choose the lower one</li>
              <li>• Your answers auto-save as you progress</li>
            </ul>
          </div>

          <div className="space-y-4 max-w-md mx-auto mb-6">
            <div>
              <label className="block text-sm font-medium text-slate700 mb-1 text-left">
                Your Name *
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-teal focus:ring-1 focus:ring-teal outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate700 mb-1 text-left">
                Your Email *
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-teal focus:ring-1 focus:ring-teal outline-none"
              />
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleStartAssessment}
            disabled={!userName.trim() || !userEmail.trim()}
          >
            Start Assessment
          </Button>
        </Card>
      </div>
    );
  }

  // Step 8: Review & Submit
  if (currentStep === 8) {
    const preview = getPreviewScores();

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WizardProgress
          currentStep={8}
          completedSteps={completedSteps}
          onStepClick={setCurrentStep}
          className="mb-8"
        />

        <h1 className="text-3xl font-bold text-navy mb-2">Review & Submit</h1>
        <p className="text-slate700 mb-8">
          Review your answers before submitting. You can click on any section to make changes.
        </p>

        {/* Preview Score */}
        <Card className="mb-8 text-center">
          <h2 className="text-xl font-semibold text-navy mb-4">Predicted Maturity Level</h2>
          <div
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4"
            style={{ backgroundColor: getLevelColour(preview.maturityLevel) }}
          >
            {preview.maturityLevel}
          </div>
          <p className="text-2xl font-bold text-navy mb-1">
            {getMaturityLevelName(preview.maturityLevel)}
          </p>
          <p className="text-lg text-slate700">{preview.overallScore}% Overall Score</p>
        </Card>

        {/* Dimension Summary */}
        <div className="space-y-4 mb-8">
          {ALL_DIMENSIONS.map((dimension, index) => {
            const dimQuestions = getQuestionsByDimension(dimension);
            const dimScore = preview.dimensionScores[dimension];
            const level = getMaturityLevel(dimScore);

            return (
              <Card
                key={dimension}
                hoverable
                onClick={() => setCurrentStep(index + 1)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-navy">{dimension}</h3>
                    <p className="text-sm text-slate700">
                      {dimQuestions.length} questions answered
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xl font-bold text-navy">{dimScore}%</span>
                    </div>
                    <MaturityBadge level={level} size="sm" />
                    <svg className="w-5 h-5 text-slate700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={responses.size < 21}
          >
            Submit Assessment
          </Button>
        </div>
      </div>
    );
  }

  // Steps 1-7: Dimension Questions
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WizardProgress
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={(step) => {
          if (step < currentStep || completedSteps.includes(step)) {
            setCurrentStep(step);
          }
        }}
        className="mb-8"
      />

      {currentDimension && (
        <>
          <DimensionHeader
            dimension={currentDimension}
            questionNumber={currentStep}
            totalQuestions={7}
          />

          {dimensionQuestions.map(question => {
            const existingResponse = responses.get(question.id);
            return (
              <QuestionCard
                key={question.id}
                question={question}
                currentAnswer={existingResponse?.answer}
                currentNotes={existingResponse?.notes}
                onAnswer={(answer, notes) =>
                  handleAnswerQuestion(question.id, currentDimension, answer, notes)
                }
              />
            );
          })}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!isCurrentStepComplete()}
            >
              {currentStep === 7 ? "Review Answers" : "Next Dimension"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
