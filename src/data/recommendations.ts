import { Dimension, Effort, MaturityLevel, Priority, Recommendation } from "@/types";

export const recommendations: Recommendation[] = [
  // Policy & Documentation recommendations
  {
    id: "rec-policy-1-2",
    dimension: Dimension.Policy,
    currentLevel: MaturityLevel.AdHoc,
    targetLevel: MaturityLevel.Developing,
    title: "Create an AI Acceptable Use Policy",
    description: "Draft initial guidelines for how employees should use AI tools. Start with key principles around data handling, prohibited uses, and approval requirements.",
    toolkitLink: "/toolkit/acceptable-use-policy-template",
    priority: Priority.Critical,
    effort: Effort.Moderate
  },
  {
    id: "rec-policy-2-3",
    dimension: Dimension.Policy,
    currentLevel: MaturityLevel.Developing,
    targetLevel: MaturityLevel.Defined,
    title: "Formalise and Communicate Your AI Policy",
    description: "Document your AI policy formally and communicate it across the organisation. Implement an acknowledgment process to ensure staff awareness.",
    toolkitLink: "/toolkit/policy-communication-guide",
    priority: Priority.High,
    effort: Effort.Quick
  },
  {
    id: "rec-policy-3-4",
    dimension: Dimension.Policy,
    currentLevel: MaturityLevel.Defined,
    targetLevel: MaturityLevel.Managed,
    title: "Implement AI Tool Approval Workflow",
    description: "Establish a formal approval process with defined criteria for evaluating new AI tools. Include security, privacy, and business impact assessments.",
    toolkitLink: "/toolkit/tool-approval-workflow",
    priority: Priority.Medium,
    effort: Effort.Moderate
  },
  {
    id: "rec-policy-4-5",
    dimension: Dimension.Policy,
    currentLevel: MaturityLevel.Managed,
    targetLevel: MaturityLevel.Optimised,
    title: "Automate Policy Compliance and Updates",
    description: "Integrate your AI register with IT systems for real-time tracking. Establish scheduled policy reviews with stakeholder feedback loops.",
    toolkitLink: "/toolkit/automated-compliance",
    priority: Priority.Low,
    effort: Effort.Significant
  },

  // Risk Management recommendations
  {
    id: "rec-risk-1-2",
    dimension: Dimension.RiskManagement,
    currentLevel: MaturityLevel.AdHoc,
    targetLevel: MaturityLevel.Developing,
    title: "Begin Basic AI Risk Assessments",
    description: "Start conducting risk assessments for your most critical AI tools. Focus on data security, privacy, and operational risks.",
    toolkitLink: "/toolkit/basic-risk-assessment",
    priority: Priority.Critical,
    effort: Effort.Quick
  },
  {
    id: "rec-risk-2-3",
    dimension: Dimension.RiskManagement,
    currentLevel: MaturityLevel.Developing,
    targetLevel: MaturityLevel.Defined,
    title: "Implement the AI Risk Scoring Matrix",
    description: "Apply consistent likelihood × impact scoring to all AI tools. Use the Risk Scoring Matrix to standardise assessments across the organisation.",
    toolkitLink: "/toolkit/risk-scoring-matrix",
    priority: Priority.Critical,
    effort: Effort.Moderate
  },
  {
    id: "rec-risk-3-4",
    dimension: Dimension.RiskManagement,
    currentLevel: MaturityLevel.Defined,
    targetLevel: MaturityLevel.Managed,
    title: "Establish Risk Re-assessment Cadence",
    description: "Implement regular risk re-assessments based on risk tier. High-risk tools should be reviewed quarterly, medium-risk semi-annually.",
    toolkitLink: "/toolkit/risk-reassessment-schedule",
    priority: Priority.High,
    effort: Effort.Moderate
  },
  {
    id: "rec-risk-4-5",
    dimension: Dimension.RiskManagement,
    currentLevel: MaturityLevel.Managed,
    targetLevel: MaturityLevel.Optimised,
    title: "Deploy Continuous Risk Monitoring",
    description: "Implement automated risk monitoring with alerts for changes in vendor security posture, regulatory requirements, or usage patterns.",
    toolkitLink: "/toolkit/continuous-risk-monitoring",
    priority: Priority.Low,
    effort: Effort.Significant
  },

  // Roles & Accountability recommendations
  {
    id: "rec-roles-1-2",
    dimension: Dimension.Roles,
    currentLevel: MaturityLevel.AdHoc,
    targetLevel: MaturityLevel.Developing,
    title: "Designate an AI Governance Owner",
    description: "Assign explicit responsibility for AI governance to an individual, typically within IT, Legal, or Risk. Define their mandate and authority.",
    toolkitLink: "/toolkit/governance-owner-role",
    priority: Priority.Critical,
    effort: Effort.Quick
  },
  {
    id: "rec-roles-2-3",
    dimension: Dimension.Roles,
    currentLevel: MaturityLevel.Developing,
    targetLevel: MaturityLevel.Defined,
    title: "Document RACI for AI Governance",
    description: "Create a RACI matrix defining who is Responsible, Accountable, Consulted, and Informed for key AI governance activities.",
    toolkitLink: "/toolkit/raci-template",
    priority: Priority.High,
    effort: Effort.Quick
  },
  {
    id: "rec-roles-3-4",
    dimension: Dimension.Roles,
    currentLevel: MaturityLevel.Defined,
    targetLevel: MaturityLevel.Managed,
    title: "Establish AI Governance Committee",
    description: "Form a cross-functional AI governance committee with representatives from IT, Legal, HR, and business units. Define charter and meeting cadence.",
    toolkitLink: "/toolkit/committee-charter",
    priority: Priority.Medium,
    effort: Effort.Moderate
  },
  {
    id: "rec-roles-4-5",
    dimension: Dimension.Roles,
    currentLevel: MaturityLevel.Managed,
    targetLevel: MaturityLevel.Optimised,
    title: "Embed Governance in Performance Management",
    description: "Integrate AI governance responsibilities into job descriptions and performance reviews. Establish board-level reporting with KPIs.",
    toolkitLink: "/toolkit/governance-performance",
    priority: Priority.Low,
    effort: Effort.Significant
  },

  // Training & Awareness recommendations
  {
    id: "rec-training-1-2",
    dimension: Dimension.Training,
    currentLevel: MaturityLevel.AdHoc,
    targetLevel: MaturityLevel.Developing,
    title: "Create Basic AI Awareness Resources",
    description: "Develop introductory materials about AI governance, policies, and risks. Make available through your intranet or learning management system.",
    toolkitLink: "/toolkit/awareness-resources",
    priority: Priority.High,
    effort: Effort.Quick
  },
  {
    id: "rec-training-2-3",
    dimension: Dimension.Training,
    currentLevel: MaturityLevel.Developing,
    targetLevel: MaturityLevel.Defined,
    title: "Deploy the AI Governance Training Module",
    description: "Roll out the TruGovAI training module to all staff. Track completion rates and require acknowledgment of the AI Acceptable Use Policy.",
    toolkitLink: "/toolkit/training-modules",
    priority: Priority.High,
    effort: Effort.Moderate
  },
  {
    id: "rec-training-3-4",
    dimension: Dimension.Training,
    currentLevel: MaturityLevel.Defined,
    targetLevel: MaturityLevel.Managed,
    title: "Implement Regular Training with Tracking",
    description: "Establish annual refresher training with completion tracking. Use real case studies to reinforce learning and maintain awareness.",
    toolkitLink: "/toolkit/training-tracking",
    priority: Priority.Medium,
    effort: Effort.Moderate
  },
  {
    id: "rec-training-4-5",
    dimension: Dimension.Training,
    currentLevel: MaturityLevel.Managed,
    targetLevel: MaturityLevel.Optimised,
    title: "Develop Role-Specific AI Training Paths",
    description: "Create differentiated training for different roles (executives, developers, general staff). Include certification and assessment components.",
    toolkitLink: "/toolkit/role-training",
    priority: Priority.Low,
    effort: Effort.Significant
  },

  // Monitoring & Audit recommendations
  {
    id: "rec-monitoring-1-2",
    dimension: Dimension.Monitoring,
    currentLevel: MaturityLevel.AdHoc,
    targetLevel: MaturityLevel.Developing,
    title: "Establish Basic AI Monitoring",
    description: "Begin tracking AI tool usage and any reported issues. Create a simple log for AI-related incidents and concerns.",
    toolkitLink: "/toolkit/basic-monitoring",
    priority: Priority.High,
    effort: Effort.Quick
  },
  {
    id: "rec-monitoring-2-3",
    dimension: Dimension.Monitoring,
    currentLevel: MaturityLevel.Developing,
    targetLevel: MaturityLevel.Defined,
    title: "Implement AI Incident Tracker",
    description: "Deploy a structured system for tracking AI incidents. Include categorisation, status tracking, and basic reporting.",
    toolkitLink: "/toolkit/incident-tracker",
    priority: Priority.High,
    effort: Effort.Moderate
  },
  {
    id: "rec-monitoring-3-4",
    dimension: Dimension.Monitoring,
    currentLevel: MaturityLevel.Defined,
    targetLevel: MaturityLevel.Managed,
    title: "Schedule Regular AI Audits",
    description: "Establish quarterly audit schedule for AI tool compliance. Track findings with owners and deadlines. Report results to governance committee.",
    toolkitLink: "/toolkit/quarterly-audit-tracker",
    priority: Priority.Medium,
    effort: Effort.Moderate
  },
  {
    id: "rec-monitoring-4-5",
    dimension: Dimension.Monitoring,
    currentLevel: MaturityLevel.Managed,
    targetLevel: MaturityLevel.Optimised,
    title: "Deploy Continuous Automated Monitoring",
    description: "Implement automated compliance monitoring with real-time alerts. Integrate incident tracking with root cause analysis and prevention measures.",
    toolkitLink: "/toolkit/automated-monitoring",
    priority: Priority.Low,
    effort: Effort.Significant
  },

  // Vendor Management recommendations
  {
    id: "rec-vendor-1-2",
    dimension: Dimension.Vendor,
    currentLevel: MaturityLevel.AdHoc,
    targetLevel: MaturityLevel.Developing,
    title: "Create Basic Vendor Security Questionnaire",
    description: "Develop a simple questionnaire covering key security and data handling practices for AI vendors. Apply to new vendor evaluations.",
    toolkitLink: "/toolkit/vendor-questionnaire",
    priority: Priority.High,
    effort: Effort.Quick
  },
  {
    id: "rec-vendor-2-3",
    dimension: Dimension.Vendor,
    currentLevel: MaturityLevel.Developing,
    targetLevel: MaturityLevel.Defined,
    title: "Implement Vendor Vetting Checklist",
    description: "Standardise your vendor evaluation process with a comprehensive checklist covering security, privacy, AI-specific risks, and compliance.",
    toolkitLink: "/toolkit/vendor-vetting-checklist",
    priority: Priority.High,
    effort: Effort.Moderate
  },
  {
    id: "rec-vendor-3-4",
    dimension: Dimension.Vendor,
    currentLevel: MaturityLevel.Defined,
    targetLevel: MaturityLevel.Managed,
    title: "Develop Standard AI Contract Addendum",
    description: "Create standard contractual clauses addressing AI-specific concerns: data usage, model training opt-out, output ownership, and audit rights.",
    toolkitLink: "/toolkit/contract-addendum",
    priority: Priority.Medium,
    effort: Effort.Moderate
  },
  {
    id: "rec-vendor-4-5",
    dimension: Dimension.Vendor,
    currentLevel: MaturityLevel.Managed,
    targetLevel: MaturityLevel.Optimised,
    title: "Implement Continuous Vendor Monitoring",
    description: "Deploy ongoing vendor risk monitoring based on risk tier. Set up alerts for security incidents, regulatory changes, or material changes to vendor services.",
    toolkitLink: "/toolkit/vendor-monitoring",
    priority: Priority.Low,
    effort: Effort.Significant
  },

  // Continuous Improvement recommendations
  {
    id: "rec-improvement-1-2",
    dimension: Dimension.Improvement,
    currentLevel: MaturityLevel.AdHoc,
    targetLevel: MaturityLevel.Developing,
    title: "Begin Documenting Lessons Learned",
    description: "Start recording insights from AI incidents, near-misses, and successful implementations. Create a simple log accessible to the governance team.",
    toolkitLink: "/toolkit/lessons-learned-log",
    priority: Priority.Medium,
    effort: Effort.Quick
  },
  {
    id: "rec-improvement-2-3",
    dimension: Dimension.Improvement,
    currentLevel: MaturityLevel.Developing,
    targetLevel: MaturityLevel.Defined,
    title: "Establish Quarterly Governance Reviews",
    description: "Schedule quarterly reviews to assess governance effectiveness. Use the Quarterly Audit Tracker to maintain consistency.",
    toolkitLink: "/toolkit/quarterly-audit-tracker",
    priority: Priority.Medium,
    effort: Effort.Quick
  },
  {
    id: "rec-improvement-3-4",
    dimension: Dimension.Improvement,
    currentLevel: MaturityLevel.Defined,
    targetLevel: MaturityLevel.Managed,
    title: "Implement Governance KPI Dashboard",
    description: "Define and track key performance indicators for AI governance. Create a dashboard showing trends in compliance, incidents, and training completion.",
    toolkitLink: "/toolkit/governance-dashboard",
    priority: Priority.Medium,
    effort: Effort.Moderate
  },
  {
    id: "rec-improvement-4-5",
    dimension: Dimension.Improvement,
    currentLevel: MaturityLevel.Managed,
    targetLevel: MaturityLevel.Optimised,
    title: "Establish Industry Benchmarking",
    description: "Participate in industry benchmarking to compare your governance maturity against peers. Seek external validation through audits or certifications.",
    toolkitLink: "/toolkit/benchmarking-guide",
    priority: Priority.Low,
    effort: Effort.Significant
  }
];

// Helper to get recommendations by dimension
export function getRecommendationsByDimension(dimension: Dimension): Recommendation[] {
  return recommendations.filter(r => r.dimension === dimension);
}

// Helper to get recommendations for a specific assessment based on dimension scores
export function getRecommendationsForAssessment(
  dimensionScores: Record<Dimension, number>
): Recommendation[] {
  const relevantRecommendations: Recommendation[] = [];

  Object.entries(dimensionScores).forEach(([dimension, score]) => {
    const currentLevel = getMaturityLevelFromScore(score);
    const dimensionRecs = recommendations.filter(
      r => r.dimension === dimension as Dimension && r.currentLevel === currentLevel
    );
    relevantRecommendations.push(...dimensionRecs);
  });

  // Sort by priority
  const priorityOrder = {
    [Priority.Critical]: 0,
    [Priority.High]: 1,
    [Priority.Medium]: 2,
    [Priority.Low]: 3
  };

  return relevantRecommendations.sort((a, b) =>
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}

// Helper to get maturity level from score
function getMaturityLevelFromScore(score: number): MaturityLevel {
  if (score <= 20) return MaturityLevel.AdHoc;
  if (score <= 40) return MaturityLevel.Developing;
  if (score <= 60) return MaturityLevel.Defined;
  if (score <= 80) return MaturityLevel.Managed;
  return MaturityLevel.Optimised;
}

// Helper to get quick wins (low effort, any priority)
export function getQuickWins(): Recommendation[] {
  return recommendations.filter(r => r.effort === Effort.Quick);
}
