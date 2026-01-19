"use client";

import React, { useState } from "react";
import { Question } from "@/types";
import { Card } from "@/components/ui/Card";
import { getLevelColour } from "@/lib/scoring";
import { MaturityLevel } from "@/types";

interface QuestionCardProps {
  question: Question;
  currentAnswer?: number;
  currentNotes?: string;
  onAnswer: (answer: number, notes: string) => void;
  showHelpText?: boolean;
}

export function QuestionCard({
  question,
  currentAnswer,
  currentNotes = "",
  onAnswer,
  showHelpText = true
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(currentAnswer);
  const [notes, setNotes] = useState(currentNotes);
  const [isHelpExpanded, setIsHelpExpanded] = useState(false);

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
    onAnswer(answer, notes);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value.slice(0, 500);
    setNotes(newNotes);
    if (selectedAnswer) {
      onAnswer(selectedAnswer, newNotes);
    }
  };

  const levelNames = ["Ad Hoc", "Developing", "Defined", "Managed", "Optimised"];

  return (
    <Card className="mb-6">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-navy mb-2">{question.text}</h4>
        {showHelpText && (
          <div>
            <button
              className="text-sm text-teal hover:text-[#158a85] flex items-center gap-1"
              onClick={() => setIsHelpExpanded(!isHelpExpanded)}
            >
              <svg
                className={`w-4 h-4 transform transition-transform ${isHelpExpanded ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {isHelpExpanded ? "Hide guidance" : "Show guidance"}
            </button>
            {isHelpExpanded && (
              <p className="mt-2 text-sm text-slate700 bg-ice p-3 rounded-lg">
                {question.helpText}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((level) => {
          const indicator = question.levelIndicators[level as 1 | 2 | 3 | 4 | 5];
          const isSelected = selectedAnswer === level;
          const color = getLevelColour(level as MaturityLevel);

          return (
            <button
              key={level}
              onClick={() => handleAnswerSelect(level)}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                ${isSelected
                  ? "border-current shadow-md"
                  : "border-gray-200 hover:border-gray-300"}
              `}
              style={{
                borderColor: isSelected ? color : undefined,
                backgroundColor: isSelected ? `${color}10` : undefined
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    text-white font-bold text-sm
                  `}
                  style={{ backgroundColor: color }}
                >
                  {level}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-navy">{levelNames[level - 1]}</span>
                  </div>
                  <p className="text-sm text-slate700">{indicator}</p>
                </div>
                {isSelected && (
                  <svg
                    className="w-6 h-6 text-white flex-shrink-0"
                    style={{ color }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Notes Section */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate700 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add any context or notes about your answer..."
          className="w-full p-3 border border-gray-200 rounded-lg text-sm text-slate700
                     focus:border-teal focus:ring-1 focus:ring-teal outline-none resize-none"
          rows={2}
          maxLength={500}
        />
        <p className="text-xs text-slate700 mt-1">{notes.length}/500 characters</p>
      </div>
    </Card>
  );
}
