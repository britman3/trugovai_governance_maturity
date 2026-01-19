"use client";

import jsPDF from "jspdf";
import { Assessment, Dimension, ALL_DIMENSIONS, DIMENSIONS, MATURITY_LEVELS } from "@/types";
import { getMaturityLevelName, getLevelColour } from "./scoring";
import { getRecommendationsForAssessment } from "@/data/recommendations";

export async function exportAssessmentPDF(assessment: Assessment): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  // Helper to add text with word wrap
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 6): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  // --- HEADER ---
  // Brand bar
  doc.setFillColor(15, 42, 58); // Navy
  doc.rect(0, 0, pageWidth, 35, "F");

  // Logo/Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("TruGovAI", margin, 15);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("AI Governance Maturity Assessment", margin, 25);

  yPos = 45;

  // --- ASSESSMENT INFO ---
  doc.setTextColor(76, 93, 107); // Slate700
  doc.setFontSize(10);
  doc.text(`Assessment Date: ${new Date(assessment.assessmentDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })}`, margin, yPos);
  yPos += 6;
  doc.text(`Completed By: ${assessment.completedBy}`, margin, yPos);
  yPos += 15;

  // --- MATURITY LEVEL SUMMARY ---
  const levelColor = getLevelColour(assessment.maturityLevel);
  const levelName = getMaturityLevelName(assessment.maturityLevel);

  // Level box
  doc.setFillColor(
    parseInt(levelColor.slice(1, 3), 16),
    parseInt(levelColor.slice(3, 5), 16),
    parseInt(levelColor.slice(5, 7), 16)
  );
  doc.roundedRect(margin, yPos, 50, 50, 5, 5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text(String(assessment.maturityLevel), margin + 18, yPos + 25);
  doc.setFontSize(10);
  doc.text("LEVEL", margin + 15, yPos + 35);

  // Level name and score
  doc.setTextColor(15, 42, 58); // Navy
  doc.setFontSize(24);
  doc.text(levelName, margin + 60, yPos + 15);
  doc.setFontSize(16);
  doc.setTextColor(76, 93, 107);
  doc.text(`${assessment.overallScore}% Overall Score`, margin + 60, yPos + 28);

  // Level description
  const levelInfo = MATURITY_LEVELS[assessment.maturityLevel];
  doc.setFontSize(10);
  yPos = addWrappedText(levelInfo.description, margin + 60, yPos + 38, contentWidth - 60);

  yPos += 20;

  // --- DIMENSION SCORES TABLE ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 42, 58);
  doc.text("Dimension Scores", margin, yPos);
  yPos += 10;

  const dimensionScores: Record<Dimension, number> = {
    [Dimension.Policy]: assessment.policyScore,
    [Dimension.RiskManagement]: assessment.riskManagementScore,
    [Dimension.Roles]: assessment.rolesScore,
    [Dimension.Training]: assessment.trainingScore,
    [Dimension.Monitoring]: assessment.monitoringScore,
    [Dimension.Vendor]: assessment.vendorScore,
    [Dimension.Improvement]: assessment.improvementScore
  };

  // Table header
  doc.setFillColor(244, 247, 249); // Ice
  doc.rect(margin, yPos, contentWidth, 8, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(76, 93, 107);
  doc.text("Dimension", margin + 2, yPos + 5);
  doc.text("Score", margin + contentWidth - 35, yPos + 5);
  doc.text("Level", margin + contentWidth - 15, yPos + 5);
  yPos += 10;

  // Table rows
  doc.setFont("helvetica", "normal");
  ALL_DIMENSIONS.forEach((dimension, index) => {
    const score = dimensionScores[dimension];
    const level = score <= 20 ? 1 : score <= 40 ? 2 : score <= 60 ? 3 : score <= 80 ? 4 : 5;

    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos - 3, contentWidth, 8, "F");
    }

    doc.setTextColor(15, 42, 58);
    doc.text(DIMENSIONS[dimension].shortName, margin + 2, yPos + 2);
    doc.text(`${score}%`, margin + contentWidth - 35, yPos + 2);
    doc.text(`L${level}`, margin + contentWidth - 12, yPos + 2);

    // Mini progress bar
    doc.setFillColor(229, 231, 235);
    doc.rect(margin + 55, yPos - 1, 60, 4, "F");
    const barColor = getLevelColour(level as 1|2|3|4|5);
    doc.setFillColor(
      parseInt(barColor.slice(1, 3), 16),
      parseInt(barColor.slice(3, 5), 16),
      parseInt(barColor.slice(5, 7), 16)
    );
    doc.rect(margin + 55, yPos - 1, (score / 100) * 60, 4, "F");

    yPos += 8;
  });

  yPos += 10;

  // --- KEY RECOMMENDATIONS ---
  const recommendations = getRecommendationsForAssessment(dimensionScores).slice(0, 3);

  if (recommendations.length > 0 && yPos < 230) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 42, 58);
    doc.text("Key Recommendations", margin, yPos);
    yPos += 10;

    recommendations.forEach((rec, index) => {
      if (yPos > 260) return; // Prevent overflow

      doc.setFillColor(244, 247, 249);
      doc.roundedRect(margin, yPos - 2, contentWidth, 25, 3, 3, "F");

      // Priority indicator
      const priorityColors: Record<string, string> = {
        Critical: "#FF6B6B",
        High: "#F59E0B",
        Medium: "#FBBF24",
        Low: "#34D399"
      };
      const pColor = priorityColors[rec.priority] || "#71D1C8";
      doc.setFillColor(
        parseInt(pColor.slice(1, 3), 16),
        parseInt(pColor.slice(3, 5), 16),
        parseInt(pColor.slice(5, 7), 16)
      );
      doc.circle(margin + 5, yPos + 5, 3, "F");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 42, 58);
      doc.text(rec.title, margin + 12, yPos + 5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(76, 93, 107);
      doc.text(`${DIMENSIONS[rec.dimension].shortName} • ${rec.priority} • ${rec.effort}`, margin + 12, yPos + 12);
      yPos = addWrappedText(rec.description.slice(0, 100) + "...", margin + 12, yPos + 18, contentWidth - 15, 4);
      yPos += 8;
    });
  }

  // --- FOOTER ---
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFillColor(15, 42, 58);
  doc.rect(0, footerY - 5, pageWidth, 20, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("TruGovAI™ Toolkit — Board-ready AI governance in 30 days", margin, footerY + 2);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-GB")}`, pageWidth - margin - 40, footerY + 2);

  // Save the PDF
  const filename = `TruGovAI-Assessment-${new Date(assessment.assessmentDate).toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}

export async function exportBoardSummaryPDF(assessment: Assessment): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  // --- HEADER ---
  doc.setFillColor(15, 42, 58);
  doc.rect(0, 0, pageWidth, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("AI Governance — Board Summary", margin, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(new Date(assessment.assessmentDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }), pageWidth - margin - 40, 18);

  yPos = 45;

  // --- CURRENT STATE ---
  const levelColor = getLevelColour(assessment.maturityLevel);
  const levelName = getMaturityLevelName(assessment.maturityLevel);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 42, 58);
  doc.text("Current Maturity Level", margin, yPos);
  yPos += 10;

  // Large level display
  doc.setFillColor(
    parseInt(levelColor.slice(1, 3), 16),
    parseInt(levelColor.slice(3, 5), 16),
    parseInt(levelColor.slice(5, 7), 16)
  );
  doc.roundedRect(margin, yPos, 40, 40, 5, 5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text(String(assessment.maturityLevel), margin + 12, yPos + 22);
  doc.setFontSize(8);
  doc.text("LEVEL", margin + 11, yPos + 32);

  doc.setTextColor(15, 42, 58);
  doc.setFontSize(18);
  doc.text(`${levelName} (${assessment.overallScore}%)`, margin + 50, yPos + 18);

  yPos += 55;

  // --- KEY RISKS ---
  const dimensionScores: Record<Dimension, number> = {
    [Dimension.Policy]: assessment.policyScore,
    [Dimension.RiskManagement]: assessment.riskManagementScore,
    [Dimension.Roles]: assessment.rolesScore,
    [Dimension.Training]: assessment.trainingScore,
    [Dimension.Monitoring]: assessment.monitoringScore,
    [Dimension.Vendor]: assessment.vendorScore,
    [Dimension.Improvement]: assessment.improvementScore
  };

  // Find lowest scoring dimensions
  const sortedDimensions = ALL_DIMENSIONS
    .map(d => ({ dimension: d, score: dimensionScores[d] }))
    .sort((a, b) => a.score - b.score);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 42, 58);
  doc.text("Key Risk Areas", margin, yPos);
  yPos += 8;

  sortedDimensions.slice(0, 3).forEach(({ dimension, score }) => {
    doc.setFillColor(255, 107, 107, 0.1);
    doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 107, 107);
    doc.text(`${score}%`, margin + 5, yPos + 8);

    doc.setTextColor(15, 42, 58);
    doc.text(DIMENSIONS[dimension].shortName, margin + 25, yPos + 8);

    yPos += 15;
  });

  yPos += 10;

  // --- PRIORITY ACTIONS ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 42, 58);
  doc.text("Priority Actions", margin, yPos);
  yPos += 8;

  const recommendations = getRecommendationsForAssessment(dimensionScores).slice(0, 3);
  recommendations.forEach((rec, index) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 42, 58);
    doc.text(`${index + 1}. ${rec.title}`, margin, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(76, 93, 107);
    doc.text(`${DIMENSIONS[rec.dimension].shortName} • ${rec.effort}`, margin + 5, yPos);
    yPos += 10;
  });

  // --- FOOTER ---
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFillColor(15, 42, 58);
  doc.rect(0, footerY - 5, pageWidth, 20, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("TruGovAI™ — Board Summary", margin, footerY + 2);
  doc.text(`1 of 1`, pageWidth - margin - 15, footerY + 2);

  // Save
  const filename = `TruGovAI-Board-Summary-${new Date(assessment.assessmentDate).toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}
