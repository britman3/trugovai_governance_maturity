"use client";

import React from "react";
import { Dimension, DIMENSIONS } from "@/types";

interface WizardProgressProps {
  currentStep: number; // 0 = intro, 1-7 = dimensions, 8 = review
  completedSteps: number[];
  onStepClick?: (step: number) => void;
  className?: string;
}

export function WizardProgress({
  currentStep,
  completedSteps,
  onStepClick,
  className = ""
}: WizardProgressProps) {
  const steps = [
    { id: 0, label: "Intro" },
    ...Object.values(Dimension).map((dim, index) => ({
      id: index + 1,
      label: DIMENSIONS[dim].shortName
    })),
    { id: 8, label: "Review" }
  ];

  return (
    <div className={`${className}`}>
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-slate700">
            Step {currentStep} of 8
          </span>
          <span className="text-sm text-slate700">
            {Math.round((currentStep / 8) * 100)}% Complete
          </span>
        </div>
      </div>

      {/* Step Indicators - Desktop */}
      <div className="hidden lg:flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isClickable = onStepClick && (isCompleted || step.id <= currentStep);

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={`
                  flex flex-col items-center
                  ${isClickable ? "cursor-pointer" : "cursor-default"}
                `}
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    transition-all duration-200
                    ${isCompleted
                      ? "bg-teal text-white"
                      : isCurrent
                        ? "bg-navy text-white ring-4 ring-teal/30"
                        : "bg-gray-200 text-slate700"}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`
                    text-xs mt-1 max-w-[60px] text-center
                    ${isCurrent ? "text-navy font-medium" : "text-slate700"}
                  `}
                >
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-full h-0.5 mx-2
                    ${completedSteps.includes(step.id) ? "bg-teal" : "bg-gray-200"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Indicators - Mobile */}
      <div className="lg:hidden">
        <div className="flex flex-wrap gap-2 justify-center">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`
                  w-3 h-3 rounded-full transition-all duration-200
                  ${isCompleted
                    ? "bg-teal"
                    : isCurrent
                      ? "bg-navy ring-2 ring-teal/50"
                      : "bg-gray-200"}
                `}
              />
            );
          })}
        </div>
        <p className="text-center text-sm text-navy font-medium mt-2">
          {steps[currentStep]?.label}
        </p>
      </div>
    </div>
  );
}

interface DimensionHeaderProps {
  dimension: Dimension;
  questionNumber: number;
  totalQuestions: number;
}

export function DimensionHeader({
  dimension,
  questionNumber,
  totalQuestions
}: DimensionHeaderProps) {
  const { name, description } = DIMENSIONS[dimension];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-teal font-medium">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-navy mb-1">{name}</h2>
      <p className="text-slate700">{description}</p>
    </div>
  );
}
