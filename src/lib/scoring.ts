import { AssessmentResponse, Dimension, MaturityLevel, ALL_DIMENSIONS } from "@/types";
import { getQuestionById } from "@/data/questions";

/**
 * Calculate the score for a single dimension (0-100)
 */
export function calculateDimensionScore(
  responses: AssessmentResponse[],
  dimension: Dimension
): number {
  const dimensionResponses = responses.filter(r => r.dimension === dimension);
  if (dimensionResponses.length === 0) return 0;

  const totalScore = dimensionResponses.reduce((sum, r) => {
    const question = getQuestionById(r.questionId);
    const weight = question?.weight ?? 1;
    return sum + (r.answer * weight);
  }, 0);

  const maxPossible = dimensionResponses.reduce((sum, r) => {
    const question = getQuestionById(r.questionId);
    const weight = question?.weight ?? 1;
    return sum + (5 * weight); // Max answer is 5
  }, 0);

  return Math.round((totalScore / maxPossible) * 100);
}

/**
 * Calculate all dimension scores
 */
export function calculateAllDimensionScores(
  responses: AssessmentResponse[]
): Record<Dimension, number> {
  const scores: Record<Dimension, number> = {} as Record<Dimension, number>;

  ALL_DIMENSIONS.forEach(dimension => {
    scores[dimension] = calculateDimensionScore(responses, dimension);
  });

  return scores;
}

/**
 * Calculate overall score from dimension scores (average)
 */
export function calculateOverallScore(dimensionScores: Record<Dimension, number>): number {
  const scores = Object.values(dimensionScores);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * Determine maturity level from score
 */
export function getMaturityLevel(score: number): MaturityLevel {
  if (score <= 20) return MaturityLevel.AdHoc;
  if (score <= 40) return MaturityLevel.Developing;
  if (score <= 60) return MaturityLevel.Defined;
  if (score <= 80) return MaturityLevel.Managed;
  return MaturityLevel.Optimised;
}

/**
 * Get maturity level name
 */
export function getMaturityLevelName(level: MaturityLevel): string {
  const names: Record<MaturityLevel, string> = {
    [MaturityLevel.AdHoc]: "Ad Hoc",
    [MaturityLevel.Developing]: "Developing",
    [MaturityLevel.Defined]: "Defined",
    [MaturityLevel.Managed]: "Managed",
    [MaturityLevel.Optimised]: "Optimised"
  };
  return names[level];
}

/**
 * Get level colour
 */
export function getLevelColour(level: MaturityLevel): string {
  const colours: Record<MaturityLevel, string> = {
    [MaturityLevel.AdHoc]: "#FF6B6B",
    [MaturityLevel.Developing]: "#F59E0B",
    [MaturityLevel.Defined]: "#FBBF24",
    [MaturityLevel.Managed]: "#34D399",
    [MaturityLevel.Optimised]: "#7BC96F"
  };
  return colours[level];
}

/**
 * Get level colour from score directly
 */
export function getLevelColourFromScore(score: number): string {
  return getLevelColour(getMaturityLevel(score));
}

/**
 * Calculate dimension-specific maturity level
 */
export function getDimensionMaturityLevel(
  responses: AssessmentResponse[],
  dimension: Dimension
): MaturityLevel {
  const score = calculateDimensionScore(responses, dimension);
  return getMaturityLevel(score);
}

/**
 * Full assessment calculation - returns all computed values
 */
export function calculateAssessmentResults(responses: AssessmentResponse[]): {
  dimensionScores: Record<Dimension, number>;
  overallScore: number;
  maturityLevel: MaturityLevel;
  policyScore: number;
  riskManagementScore: number;
  rolesScore: number;
  trainingScore: number;
  monitoringScore: number;
  vendorScore: number;
  improvementScore: number;
} {
  const dimensionScores = calculateAllDimensionScores(responses);
  const overallScore = calculateOverallScore(dimensionScores);
  const maturityLevel = getMaturityLevel(overallScore);

  return {
    dimensionScores,
    overallScore,
    maturityLevel,
    policyScore: dimensionScores[Dimension.Policy],
    riskManagementScore: dimensionScores[Dimension.RiskManagement],
    rolesScore: dimensionScores[Dimension.Roles],
    trainingScore: dimensionScores[Dimension.Training],
    monitoringScore: dimensionScores[Dimension.Monitoring],
    vendorScore: dimensionScores[Dimension.Vendor],
    improvementScore: dimensionScores[Dimension.Improvement]
  };
}

/**
 * Compare two assessments and return deltas
 */
export function compareAssessments(
  current: Record<Dimension, number>,
  previous: Record<Dimension, number>
): {
  dimensionDeltas: Record<Dimension, number>;
  overallDelta: number;
} {
  const dimensionDeltas: Record<Dimension, number> = {} as Record<Dimension, number>;

  ALL_DIMENSIONS.forEach(dimension => {
    dimensionDeltas[dimension] = (current[dimension] ?? 0) - (previous[dimension] ?? 0);
  });

  const currentOverall = calculateOverallScore(current);
  const previousOverall = calculateOverallScore(previous);
  const overallDelta = currentOverall - previousOverall;

  return { dimensionDeltas, overallDelta };
}

/**
 * Get gap analysis - what's needed for next level
 */
export function getGapAnalysis(
  currentScore: number,
  dimension: Dimension
): {
  currentLevel: MaturityLevel;
  nextLevel: MaturityLevel | null;
  scoreNeeded: number;
  percentageGap: number;
} {
  const currentLevel = getMaturityLevel(currentScore);

  if (currentLevel === MaturityLevel.Optimised) {
    return {
      currentLevel,
      nextLevel: null,
      scoreNeeded: 0,
      percentageGap: 0
    };
  }

  const thresholds: Record<MaturityLevel, number> = {
    [MaturityLevel.AdHoc]: 21,
    [MaturityLevel.Developing]: 41,
    [MaturityLevel.Defined]: 61,
    [MaturityLevel.Managed]: 81,
    [MaturityLevel.Optimised]: 100
  };

  const nextLevel = (currentLevel + 1) as MaturityLevel;
  const scoreNeeded = thresholds[currentLevel];
  const percentageGap = scoreNeeded - currentScore;

  return {
    currentLevel,
    nextLevel,
    scoreNeeded,
    percentageGap
  };
}
