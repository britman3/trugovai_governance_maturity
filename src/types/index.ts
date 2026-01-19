// Enums
export enum Dimension {
  Policy = "Policy & Documentation",
  RiskManagement = "Risk Management",
  Roles = "Roles & Accountability",
  Training = "Training & Awareness",
  Monitoring = "Monitoring & Audit",
  Vendor = "Vendor Management",
  Improvement = "Continuous Improvement"
}

export enum MaturityLevel {
  AdHoc = 1,
  Developing = 2,
  Defined = 3,
  Managed = 4,
  Optimised = 5
}

export enum AssessmentStatus {
  Draft = "Draft",
  Completed = "Completed"
}

export enum Priority {
  Critical = "Critical",
  High = "High",
  Medium = "Medium",
  Low = "Low"
}

export enum Effort {
  Quick = "Quick Win",
  Moderate = "Moderate",
  Significant = "Significant"
}

// Interfaces
export interface Assessment {
  id: string;
  organisationId: string;
  assessmentDate: Date;
  completedBy: string;
  completedByEmail: string;

  // Dimension Scores (0-100 each)
  policyScore: number;
  riskManagementScore: number;
  rolesScore: number;
  trainingScore: number;
  monitoringScore: number;
  vendorScore: number;
  improvementScore: number;

  // Calculated
  overallScore: number;
  maturityLevel: MaturityLevel;

  // Metadata
  status: AssessmentStatus;
  responses: AssessmentResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  questionId: string;
  dimension: Dimension;
  answer: number; // 1-5 scale
  notes: string; // Optional context
}

export interface Question {
  id: string;
  dimension: Dimension;
  text: string;
  helpText: string;
  levelIndicators: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  weight: number;
  order: number;
}

export interface Recommendation {
  id: string;
  dimension: Dimension;
  currentLevel: MaturityLevel;
  targetLevel: MaturityLevel;
  title: string;
  description: string;
  toolkitLink: string;
  priority: Priority;
  effort: Effort;
}

export interface Organisation {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

// Dashboard types
export interface DashboardSummary {
  currentAssessment: Assessment | null;
  previousAssessment: Assessment | null;
  maturityLevel: MaturityLevel;
  overallScore: number;
  dimensionScores: Record<Dimension, number>;
  daysSinceLastAssessment: number | null;
}

export interface AssessmentComparison {
  assessment1: Assessment;
  assessment2: Assessment;
  dimensionDeltas: Record<Dimension, number>;
  overallDelta: number;
}

// Maturity level metadata
export const MATURITY_LEVELS: Record<MaturityLevel, {
  name: string;
  scoreRange: string;
  description: string;
  color: string;
}> = {
  [MaturityLevel.AdHoc]: {
    name: "Ad Hoc",
    scoreRange: "0-20%",
    description: "No formal AI governance; reactive approach; no policies or oversight",
    color: "#FF6B6B"
  },
  [MaturityLevel.Developing]: {
    name: "Developing",
    scoreRange: "21-40%",
    description: "Basic awareness; some policies emerging; inconsistent application",
    color: "#F59E0B"
  },
  [MaturityLevel.Defined]: {
    name: "Defined",
    scoreRange: "41-60%",
    description: "Documented policies; assigned responsibilities; regular reviews",
    color: "#FBBF24"
  },
  [MaturityLevel.Managed]: {
    name: "Managed",
    scoreRange: "61-80%",
    description: "Metrics tracked; proactive risk management; embedded in operations",
    color: "#34D399"
  },
  [MaturityLevel.Optimised]: {
    name: "Optimised",
    scoreRange: "81-100%",
    description: "Continuous improvement; industry leadership; predictive controls",
    color: "#7BC96F"
  }
};

// Dimension metadata
export const DIMENSIONS: Record<Dimension, {
  name: string;
  shortName: string;
  description: string;
}> = {
  [Dimension.Policy]: {
    name: "Policy & Documentation",
    shortName: "Policy",
    description: "Written policies, acceptable use guidelines, procedures"
  },
  [Dimension.RiskManagement]: {
    name: "Risk Management",
    shortName: "Risk",
    description: "Risk identification, assessment, mitigation strategies"
  },
  [Dimension.Roles]: {
    name: "Roles & Accountability",
    shortName: "Roles",
    description: "Clear ownership, RACI defined, governance committee"
  },
  [Dimension.Training]: {
    name: "Training & Awareness",
    shortName: "Training",
    description: "Staff education, ongoing learning, compliance awareness"
  },
  [Dimension.Monitoring]: {
    name: "Monitoring & Audit",
    shortName: "Monitoring",
    description: "Regular reviews, incident tracking, compliance checks"
  },
  [Dimension.Vendor]: {
    name: "Vendor Management",
    shortName: "Vendor",
    description: "Due diligence, contract controls, ongoing oversight"
  },
  [Dimension.Improvement]: {
    name: "Continuous Improvement",
    shortName: "Improvement",
    description: "Feedback loops, metrics, iterative enhancement"
  }
};

// Helper to get all dimension values
export const ALL_DIMENSIONS = Object.values(Dimension);
