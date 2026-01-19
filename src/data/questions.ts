import { Dimension, Question } from "@/types";

export const questions: Question[] = [
  // Dimension 1: Policy & Documentation
  {
    id: "q1.1",
    dimension: Dimension.Policy,
    text: "Do you have a written AI Acceptable Use Policy?",
    helpText: "Consider whether your organisation has formally documented guidelines for how AI tools should be used by employees.",
    levelIndicators: {
      1: "No policy exists",
      2: "Informal guidelines only",
      3: "Documented policy, not widely communicated",
      4: "Documented, communicated, and acknowledged by staff",
      5: "Regularly reviewed and updated based on feedback"
    },
    weight: 1,
    order: 1
  },
  {
    id: "q1.2",
    dimension: Dimension.Policy,
    text: "Are there documented procedures for AI tool approval?",
    helpText: "Think about the process employees must follow before using a new AI tool in their work.",
    levelIndicators: {
      1: "No approval process",
      2: "Ad hoc approval by managers",
      3: "Basic checklist exists",
      4: "Formal process with defined criteria",
      5: "Automated workflow with audit trail"
    },
    weight: 1,
    order: 2
  },
  {
    id: "q1.3",
    dimension: Dimension.Policy,
    text: "Is there a register of approved vs. prohibited AI tools?",
    helpText: "Consider whether there's a maintained list of which AI tools are sanctioned for use and which are banned.",
    levelIndicators: {
      1: "No register exists",
      2: "Informal list maintained by IT",
      3: "Documented register, occasionally updated",
      4: "Comprehensive register, regularly reviewed",
      5: "Real-time inventory integrated with IT systems"
    },
    weight: 1,
    order: 3
  },

  // Dimension 2: Risk Management
  {
    id: "q2.1",
    dimension: Dimension.RiskManagement,
    text: "Do you conduct risk assessments for AI tools?",
    helpText: "Consider whether your organisation formally evaluates the risks associated with each AI tool before and during use.",
    levelIndicators: {
      1: "No risk assessments",
      2: "Assessments for major tools only",
      3: "Consistent methodology for all tools",
      4: "Regular re-assessments with tracking",
      5: "Continuous risk monitoring with alerts"
    },
    weight: 1,
    order: 1
  },
  {
    id: "q2.2",
    dimension: Dimension.RiskManagement,
    text: "Is there a risk scoring framework (e.g., likelihood × impact)?",
    helpText: "Think about whether you have a standardised way to quantify and compare AI-related risks.",
    levelIndicators: {
      1: "No framework",
      2: "Informal risk ratings",
      3: "Documented framework, inconsistent use",
      4: "Consistent framework with traffic light ratings",
      5: "Quantitative framework with historical data"
    },
    weight: 1,
    order: 2
  },
  {
    id: "q2.3",
    dimension: Dimension.RiskManagement,
    text: "Are AI-specific risks identified (data leakage, bias, hallucination)?",
    helpText: "Consider whether your organisation has identified and documented risks unique to AI systems.",
    levelIndicators: {
      1: "Not considered",
      2: "Basic awareness, no documentation",
      3: "Key risks documented",
      4: "Comprehensive risk taxonomy maintained",
      5: "Risks mapped to controls and mitigations"
    },
    weight: 1,
    order: 3
  },

  // Dimension 3: Roles & Accountability
  {
    id: "q3.1",
    dimension: Dimension.Roles,
    text: "Is there a designated AI governance owner/committee?",
    helpText: "Consider whether someone or some group has explicit responsibility for AI governance.",
    levelIndicators: {
      1: "No designated owner",
      2: "IT informally responsible",
      3: "Individual owner assigned",
      4: "Cross-functional committee established",
      5: "Committee with executive sponsorship and board reporting"
    },
    weight: 1,
    order: 1
  },
  {
    id: "q3.2",
    dimension: Dimension.Roles,
    text: "Are RACI responsibilities defined for AI governance?",
    helpText: "Think about whether it's clear who is Responsible, Accountable, Consulted, and Informed for AI governance activities.",
    levelIndicators: {
      1: "No RACI exists",
      2: "Informal understanding",
      3: "RACI documented for key activities",
      4: "Comprehensive RACI, communicated to all",
      5: "RACI embedded in job descriptions and performance reviews"
    },
    weight: 1,
    order: 2
  },
  {
    id: "q3.3",
    dimension: Dimension.Roles,
    text: "Does the board receive regular AI governance updates?",
    helpText: "Consider whether senior leadership is kept informed about AI governance matters.",
    levelIndicators: {
      1: "No board visibility",
      2: "Occasional ad hoc updates",
      3: "Annual governance report",
      4: "Quarterly structured updates",
      5: "Standing agenda item with KPIs and trends"
    },
    weight: 1,
    order: 3
  },

  // Dimension 4: Training & Awareness
  {
    id: "q4.1",
    dimension: Dimension.Training,
    text: "Have employees received AI governance training?",
    helpText: "Consider whether staff have been educated on your organisation's AI policies and best practices.",
    levelIndicators: {
      1: "No training provided",
      2: "Optional resources available",
      3: "One-time training delivered",
      4: "Regular training programme with tracking",
      5: "Role-specific training with certification"
    },
    weight: 1,
    order: 1
  },
  {
    id: "q4.2",
    dimension: Dimension.Training,
    text: "Is there awareness of data protection risks with AI?",
    helpText: "Think about whether employees understand the data privacy implications of using AI tools.",
    levelIndicators: {
      1: "No awareness initiatives",
      2: "Basic email communications",
      3: "Training module on data risks",
      4: "Regular reminders and case studies",
      5: "Embedded in onboarding and annual compliance"
    },
    weight: 1,
    order: 2
  },
  {
    id: "q4.3",
    dimension: Dimension.Training,
    text: "Do employees know how to report AI-related concerns?",
    helpText: "Consider whether there's a clear process for staff to raise issues or concerns about AI use.",
    levelIndicators: {
      1: "No reporting mechanism",
      2: "General IT helpdesk",
      3: "Dedicated reporting channel",
      4: "Anonymous reporting with response SLA",
      5: "Integrated with incident management system"
    },
    weight: 1,
    order: 3
  },

  // Dimension 5: Monitoring & Audit
  {
    id: "q5.1",
    dimension: Dimension.Monitoring,
    text: "Are AI tools monitored for policy compliance?",
    helpText: "Consider whether there's ongoing oversight of how AI tools are being used.",
    levelIndicators: {
      1: "No monitoring",
      2: "Reactive monitoring (complaints only)",
      3: "Periodic manual reviews",
      4: "Regular scheduled audits",
      5: "Continuous automated monitoring"
    },
    weight: 1,
    order: 1
  },
  {
    id: "q5.2",
    dimension: Dimension.Monitoring,
    text: "Is there an AI incident tracking process?",
    helpText: "Think about whether AI-related issues are formally recorded and tracked.",
    levelIndicators: {
      1: "No tracking",
      2: "Ad hoc email records",
      3: "Spreadsheet-based tracking",
      4: "Dedicated incident system with workflows",
      5: "Integrated with root cause analysis and prevention"
    },
    weight: 1,
    order: 2
  },
  {
    id: "q5.3",
    dimension: Dimension.Monitoring,
    text: "Are audit findings acted upon and tracked to closure?",
    helpText: "Consider whether issues identified in audits are formally addressed and resolved.",
    levelIndicators: {
      1: "Findings not tracked",
      2: "Some findings documented",
      3: "All findings logged",
      4: "Findings tracked with owners and deadlines",
      5: "Trend analysis and systemic improvements"
    },
    weight: 1,
    order: 3
  },

  // Dimension 6: Vendor Management
  {
    id: "q6.1",
    dimension: Dimension.Vendor,
    text: "Is there a vetting process for AI vendors?",
    helpText: "Consider whether external AI tool providers are evaluated before contracts are signed.",
    levelIndicators: {
      1: "No vetting process",
      2: "Basic security questionnaire",
      3: "Standardised checklist for all vendors",
      4: "Comprehensive due diligence with scoring",
      5: "Risk-tiered vetting with ongoing monitoring"
    },
    weight: 1,
    order: 1
  },
  {
    id: "q6.2",
    dimension: Dimension.Vendor,
    text: "Do contracts include AI-specific clauses (data usage, model training)?",
    helpText: "Think about whether your vendor agreements address how your data is used by AI systems.",
    levelIndicators: {
      1: "No AI-specific clauses",
      2: "Generic data protection clauses",
      3: "Some AI clauses in new contracts",
      4: "Standard AI addendum for all vendors",
      5: "Negotiated clauses with regular review"
    },
    weight: 1,
    order: 2
  },
  {
    id: "q6.3",
    dimension: Dimension.Vendor,
    text: "Are vendor assessments repeated periodically?",
    helpText: "Consider whether AI vendors are re-evaluated on an ongoing basis.",
    levelIndicators: {
      1: "Never re-assessed",
      2: "Re-assessed at renewal",
      3: "Annual re-assessment",
      4: "Risk-based re-assessment schedule",
      5: "Continuous monitoring with alerts"
    },
    weight: 1,
    order: 3
  },

  // Dimension 7: Continuous Improvement
  {
    id: "q7.1",
    dimension: Dimension.Improvement,
    text: "Is there a process to incorporate lessons learned?",
    helpText: "Consider whether insights from AI incidents or projects feed back into governance improvements.",
    levelIndicators: {
      1: "No process",
      2: "Informal discussions",
      3: "Post-incident reviews documented",
      4: "Regular retrospectives with action items",
      5: "Systematic improvement programme"
    },
    weight: 1,
    order: 1
  },
  {
    id: "q7.2",
    dimension: Dimension.Improvement,
    text: "Are AI governance metrics tracked and reported?",
    helpText: "Think about whether you measure the effectiveness of your AI governance programme.",
    levelIndicators: {
      1: "No metrics",
      2: "Basic counts (# tools, # incidents)",
      3: "KPIs defined and reported",
      4: "Dashboard with trends",
      5: "Benchmarking against industry/peers"
    },
    weight: 1,
    order: 2
  },
  {
    id: "q7.3",
    dimension: Dimension.Improvement,
    text: "Is the governance framework reviewed for effectiveness?",
    helpText: "Consider whether the governance approach itself is periodically evaluated and improved.",
    levelIndicators: {
      1: "Never reviewed",
      2: "Reviewed when problems arise",
      3: "Annual review",
      4: "Quarterly review with stakeholder input",
      5: "Continuous improvement with external validation"
    },
    weight: 1,
    order: 3
  }
];

// Helper to get questions by dimension
export function getQuestionsByDimension(dimension: Dimension): Question[] {
  return questions.filter(q => q.dimension === dimension).sort((a, b) => a.order - b.order);
}

// Helper to get question by ID
export function getQuestionById(id: string): Question | undefined {
  return questions.find(q => q.id === id);
}

// Helper to get all dimensions with their questions
export function getQuestionsGroupedByDimension(): Map<Dimension, Question[]> {
  const grouped = new Map<Dimension, Question[]>();
  Object.values(Dimension).forEach(dim => {
    grouped.set(dim, getQuestionsByDimension(dim));
  });
  return grouped;
}
