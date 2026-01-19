# TruGovAI™ AI Governance Maturity Model
#— Authoritative Specification

This document is the single source of truth for this application.

## Mandatory Implementation Rules

The implementing agent MUST follow these rules:

1. Implement the application exactly as specified in this document.
2. Do NOT invent features, screens, fields, workflows, or data models.
3. Do NOT remove, simplify, or reinterpret any requirement.
4. Do NOT change the tech stack, libraries, or architecture unless explicitly required to make the app run.
5. If any requirement is ambiguous or technically conflicting, STOP and ask a clarification question before proceeding.
6. Build incrementally and confirm completion of each major section before moving on.
7. If assumptions conflict with this document, THIS DOCUMENT WINS.

## Scope Control

- This specification defines **v1 only**.
- Features listed under *Future Considerations* must NOT be implemented.
- Assume a **single-organisation context** (no multi-tenancy UI or logic in v1).

## Authority & Compliance

- File name: `SPEC.md`
- Status: **Authoritative / Contractual**
- Any deviation from this document is considered an error.

Proceed only after confirming full understanding of this specification.
## Project Overview

Build a web application for self-assessing AI governance maturity across five progressive levels. Users answer questions across governance dimensions, receive maturity scores with visualisations, and track progress over time. The app provides tailored recommendations pointing users to relevant toolkit resources.

**Target users:** SME leadership, compliance officers, governance committees  
**Core value:** Transform static maturity PDFs into a dynamic self-assessment tool that tracks organisational progress from Ad Hoc to Optimised governance

---

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS  
- **Backend:** Node.js + Express (or Next.js API routes)  
- **Database:** PostgreSQL (with Prisma ORM)  
- **Auth:** NextAuth.js or Clerk (email/password + Google SSO)  
- **Charts:** Recharts (radar chart, line chart, progress bars)  
- **Export:** jsPDF + html2canvas for PDF generation

---

## Brand Guidelines

### Colours (use these exact hex values)

```css  
:root {  
  /* Primary */  
  --navy: #0F2A3A;        /* Primary background, headers */  
  --teal: #1AA7A1;        /* Primary accent, buttons, links */  
  --ice: #F4F7F9;         /* Light background */  
    
  /* Secondary */  
  --slate700: #4C5D6B;    /* Body text on light backgrounds */  
  --mint300: #71D1C8;     /* Charts, secondary accent */  
    
  /* Maturity Level Colours */  
  --level1: #FF6B6B;      /* Ad Hoc (Red) */  
  --level2: #F59E0B;      /* Developing (Amber) */  
  --level3: #FBBF24;      /* Defined (Yellow) */  
  --level4: #34D399;      /* Managed (Light Green) */  
  --level5: #7BC96F;      /* Optimised (Green) */  
    
  /* UI */  
  --radius: 14px;  
  --shadow: 0 8px 24px rgba(0,0,0,0.08);  
}  
```

### Typography  
- **Primary font:** Inter (fallback: system-ui, sans-serif)  
- **Scale:** H1 44px | H2 32px | H3 24px | Body 16px | Small 14px  
- **Mono (for data):** JetBrains Mono

### Component Style  
- Buttons: 12px/16px padding, 8px radius, bold 16px text  
- Cards: 14px radius, subtle shadow, white background on ice  
- Progress indicators: Gradient fill from current level colour

---

## Maturity Framework

### Five Maturity Levels

| Level | Name | Score Range | Description |
|-------|------|-------------|-------------|
| 1 | Ad Hoc | 0-20% | No formal AI governance; reactive approach; no policies or oversight |
| 2 | Developing | 21-40% | Basic awareness; some policies emerging; inconsistent application |
| 3 | Defined | 41-60% | Documented policies; assigned responsibilities; regular reviews |
| 4 | Managed | 61-80% | Metrics tracked; proactive risk management; embedded in operations |
| 5 | Optimised | 81-100% | Continuous improvement; industry leadership; predictive controls |

### Seven Governance Dimensions

1. **Policy & Documentation** - Written policies, acceptable use guidelines, procedures
2. **Risk Management** - Risk identification, assessment, mitigation strategies
3. **Roles & Accountability** - Clear ownership, RACI defined, governance committee
4. **Training & Awareness** - Staff education, ongoing learning, compliance awareness
5. **Monitoring & Audit** - Regular reviews, incident tracking, compliance checks
6. **Vendor Management** - Due diligence, contract controls, ongoing oversight
7. **Continuous Improvement** - Feedback loops, metrics, iterative enhancement

---

## Data Model

### Assessment (core entity)

```typescript  
interface Assessment {  
  id: string;                    // UUID  
  organisationId: string;        // Link to org  
  assessmentDate: Date;  
  completedBy: string;           // User who completed  
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
  overallScore: number;          // Average of all dimensions  
  maturityLevel: MaturityLevel;  // Derived from overall score  
    
  // Metadata  
  status: AssessmentStatus;      // Draft, Completed  
  responses: AssessmentResponse[];  
  createdAt: Date;  
  updatedAt: Date;  
}

interface AssessmentResponse {  
  id: string;  
  assessmentId: string;  
  questionId: string;  
  dimension: Dimension;  
  answer: number;                // 1-5 scale  
  notes: string;                 // Optional context  
}

interface Question {  
  id: string;  
  dimension: Dimension;  
  text: string;  
  helpText: string;              // Guidance for answering  
  levelIndicators: {             // What each answer means  
    1: string;  // Ad Hoc  
    2: string;  // Developing  
    3: string;  // Defined  
    4: string;  // Managed  
    5: string;  // Optimised  
  };  
  weight: number;                // Importance within dimension (default 1)  
  order: number;                 // Display order  
}

enum Dimension {  
  Policy = "Policy & Documentation",  
  RiskManagement = "Risk Management",  
  Roles = "Roles & Accountability",  
  Training = "Training & Awareness",  
  Monitoring = "Monitoring & Audit",  
  Vendor = "Vendor Management",  
  Improvement = "Continuous Improvement"  
}

enum MaturityLevel {  
  AdHoc = 1,  
  Developing = 2,  
  Defined = 3,  
  Managed = 4,  
  Optimised = 5  
}

enum AssessmentStatus {  
  Draft = "Draft",  
  Completed = "Completed"  
}  
```

### Recommendations

```typescript  
interface Recommendation {  
  id: string;  
  dimension: Dimension;  
  currentLevel: MaturityLevel;   // When to show this recommendation  
  targetLevel: MaturityLevel;    // What this helps achieve  
  title: string;  
  description: string;  
  toolkitLink: string;           // Link to relevant TruGovAI tool  
  priority: Priority;  
  effort: Effort;  
}

enum Priority {  
  Critical = "Critical",  
  High = "High",  
  Medium = "Medium",  
  Low = "Low"  
}

enum Effort {  
  Quick = "Quick Win",           // < 1 week  
  Moderate = "Moderate",         // 1-4 weeks  
  Significant = "Significant"    // > 1 month  
}  
```

---

## Question Bank (3-4 questions per dimension)

### Dimension 1: Policy & Documentation

**Q1.1:** Do you have a written AI Acceptable Use Policy?
- 1: No policy exists
- 2: Informal guidelines only
- 3: Documented policy, not widely communicated
- 4: Documented, communicated, and acknowledged by staff
- 5: Regularly reviewed and updated based on feedback

**Q1.2:** Are there documented procedures for AI tool approval?
- 1: No approval process
- 2: Ad hoc approval by managers
- 3: Basic checklist exists
- 4: Formal process with defined criteria
- 5: Automated workflow with audit trail

**Q1.3:** Is there a register of approved vs. prohibited AI tools?
- 1: No register exists
- 2: Informal list maintained by IT
- 3: Documented register, occasionally updated
- 4: Comprehensive register, regularly reviewed
- 5: Real-time inventory integrated with IT systems

### Dimension 2: Risk Management

**Q2.1:** Do you conduct risk assessments for AI tools?
- 1: No risk assessments
- 2: Assessments for major tools only
- 3: Consistent methodology for all tools
- 4: Regular re-assessments with tracking
- 5: Continuous risk monitoring with alerts

**Q2.2:** Is there a risk scoring framework (e.g., likelihood × impact)?
- 1: No framework
- 2: Informal risk ratings
- 3: Documented framework, inconsistent use
- 4: Consistent framework with traffic light ratings
- 5: Quantitative framework with historical data

**Q2.3:** Are AI-specific risks identified (data leakage, bias, hallucination)?
- 1: Not considered
- 2: Basic awareness, no documentation
- 3: Key risks documented
- 4: Comprehensive risk taxonomy maintained
- 5: Risks mapped to controls and mitigations

### Dimension 3: Roles & Accountability

**Q3.1:** Is there a designated AI governance owner/committee?
- 1: No designated owner
- 2: IT informally responsible
- 3: Individual owner assigned
- 4: Cross-functional committee established
- 5: Committee with executive sponsorship and board reporting

**Q3.2:** Are RACI responsibilities defined for AI governance?
- 1: No RACI exists
- 2: Informal understanding
- 3: RACI documented for key activities
- 4: Comprehensive RACI, communicated to all
- 5: RACI embedded in job descriptions and performance reviews

**Q3.3:** Does the board receive regular AI governance updates?
- 1: No board visibility
- 2: Occasional ad hoc updates
- 3: Annual governance report
- 4: Quarterly structured updates
- 5: Standing agenda item with KPIs and trends

### Dimension 4: Training & Awareness

**Q4.1:** Have employees received AI governance training?
- 1: No training provided
- 2: Optional resources available
- 3: One-time training delivered
- 4: Regular training programme with tracking
- 5: Role-specific training with certification

**Q4.2:** Is there awareness of data protection risks with AI?
- 1: No awareness initiatives
- 2: Basic email communications
- 3: Training module on data risks
- 4: Regular reminders and case studies
- 5: Embedded in onboarding and annual compliance

**Q4.3:** Do employees know how to report AI-related concerns?
- 1: No reporting mechanism
- 2: General IT helpdesk
- 3: Dedicated reporting channel
- 4: Anonymous reporting with response SLA
- 5: Integrated with incident management system

### Dimension 5: Monitoring & Audit

**Q5.1:** Are AI tools monitored for policy compliance?
- 1: No monitoring
- 2: Reactive monitoring (complaints only)
- 3: Periodic manual reviews
- 4: Regular scheduled audits
- 5: Continuous automated monitoring

**Q5.2:** Is there an AI incident tracking process?
- 1: No tracking
- 2: Ad hoc email records
- 3: Spreadsheet-based tracking
- 4: Dedicated incident system with workflows
- 5: Integrated with root cause analysis and prevention

**Q5.3:** Are audit findings acted upon and tracked to closure?
- 1: Findings not tracked
- 2: Some findings documented
- 3: All findings logged
- 4: Findings tracked with owners and deadlines
- 5: Trend analysis and systemic improvements

### Dimension 6: Vendor Management

**Q6.1:** Is there a vetting process for AI vendors?
- 1: No vetting process
- 2: Basic security questionnaire
- 3: Standardised checklist for all vendors
- 4: Comprehensive due diligence with scoring
- 5: Risk-tiered vetting with ongoing monitoring

**Q6.2:** Do contracts include AI-specific clauses (data usage, model training)?
- 1: No AI-specific clauses
- 2: Generic data protection clauses
- 3: Some AI clauses in new contracts
- 4: Standard AI addendum for all vendors
- 5: Negotiated clauses with regular review

**Q6.3:** Are vendor assessments repeated periodically?
- 1: Never re-assessed
- 2: Re-assessed at renewal
- 3: Annual re-assessment
- 4: Risk-based re-assessment schedule
- 5: Continuous monitoring with alerts

### Dimension 7: Continuous Improvement

**Q7.1:** Is there a process to incorporate lessons learned?
- 1: No process
- 2: Informal discussions
- 3: Post-incident reviews documented
- 4: Regular retrospectives with action items
- 5: Systematic improvement programme

**Q7.2:** Are AI governance metrics tracked and reported?
- 1: No metrics
- 2: Basic counts (# tools, # incidents)
- 3: KPIs defined and reported
- 4: Dashboard with trends
- 5: Benchmarking against industry/peers

**Q7.3:** Is the governance framework reviewed for effectiveness?
- 1: Never reviewed
- 2: Reviewed when problems arise
- 3: Annual review
- 4: Quarterly review with stakeholder input
- 5: Continuous improvement with external validation

---

## Score Calculation Logic

```typescript  
function calculateDimensionScore(responses: AssessmentResponse[], dimension: Dimension): number {  
  const dimensionResponses = responses.filter(r => r.dimension === dimension);  
  if (dimensionResponses.length === 0) return 0;  
    
  const totalScore = dimensionResponses.reduce((sum, r) => {  
    const question = getQuestion(r.questionId);  
    return sum + (r.answer * question.weight);  
  }, 0);  
    
  const maxPossible = dimensionResponses.reduce((sum, r) => {  
    const question = getQuestion(r.questionId);  
    return sum + (5 * question.weight);  // Max answer is 5  
  }, 0);  
    
  return Math.round((totalScore / maxPossible) * 100);  
}

function calculateOverallScore(dimensionScores: Record<Dimension, number>): number {  
  const scores = Object.values(dimensionScores);  
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);  
}

function getMaturityLevel(score: number): MaturityLevel {  
  if (score <= 20) return MaturityLevel.AdHoc;  
  if (score <= 40) return MaturityLevel.Developing;  
  if (score <= 60) return MaturityLevel.Defined;  
  if (score <= 80) return MaturityLevel.Managed;  
  return MaturityLevel.Optimised;  
}

function getLevelColour(level: MaturityLevel): string {  
  const colours = {  
    [MaturityLevel.AdHoc]: '#FF6B6B',  
    [MaturityLevel.Developing]: '#F59E0B',  
    [MaturityLevel.Defined]: '#FBBF24',  
    [MaturityLevel.Managed]: '#34D399',  
    [MaturityLevel.Optimised]: '#7BC96F'  
  };  
  return colours[level];  
}  
```

---

## Features & Screens

### 1. Dashboard (Home)

**Purpose:** Overview of current maturity level and historical progress

**Components:**  
- **Maturity Level Badge (hero):**  
  - Large circular badge showing current level (1-5)  
  - Level name and colour  
  - Overall percentage score  
  - Date of last assessment

- **Radar Chart (main visual):**  
  - Seven axes (one per dimension)  
  - Current score plotted  
  - Optional: overlay previous assessment for comparison  
  - Hover shows dimension name and score

- **Dimension Score Cards (grid):**  
  - One card per dimension  
  - Shows score (0-100) with progress bar  
  - Mini badge showing maturity level for that dimension  
  - Quick action: "Improve this area"

- **Progress Over Time (line chart):**  
  - X-axis: Assessment dates  
  - Y-axis: Overall maturity score  
  - Line with data points  
  - Tooltip shows date and score

- **Next Assessment CTA:**  
  - "Start New Assessment" button  
  - Days since last assessment  
  - Recommended frequency: Quarterly

### 2. Assessment Wizard

**Purpose:** Guided self-assessment experience

**Layout:** Multi-step wizard with progress indicator

**Step 0: Introduction**  
- Explanation of the assessment  
- Time estimate (15-20 minutes)  
- Tips for accurate self-assessment  
- "Start Assessment" button

**Steps 1-7: Dimension Questions**  
- One step per dimension  
- Progress bar showing completion  
- Dimension name and description  
- 3-4 questions per dimension  
- Each question shows:  
  - Question text  
  - Help text (expandable)  
  - 5-point scale with level descriptions  
  - Optional notes field  
- "Next" and "Back" buttons  
- Auto-save on each answer

**Step 8: Review & Submit**  
- Summary of all answers  
- Ability to edit any response  
- Overall calculated score preview  
- "Submit Assessment" button

**Post-Submit:**  
- Success message  
- Redirect to Results screen

### 3. Results View

**Purpose:** Detailed breakdown of assessment results with recommendations

**Sections:**  
- **Header:**  
  - Assessment date  
  - Completed by  
  - Overall maturity level badge  
  - Overall score percentage

- **Radar Chart:**  
  - All seven dimensions plotted  
  - Compared to previous assessment (if exists)  
  - Legend showing current vs. previous

- **Dimension Deep-Dive (accordion):**  
  - Each dimension expandable  
  - Shows score and level  
  - Lists questions and your answers  
  - Gap analysis: "You answered 3, Level 4 requires..."

- **Recommendations Panel:**  
  - Prioritised list of recommendations  
  - Based on lowest-scoring dimensions  
  - Each recommendation shows:  
    - Title and description  
    - Priority badge  
    - Effort estimate  
    - Link to relevant toolkit resource  
  - Filter by dimension or priority

- **Actions:**  
  - Export as PDF  
  - Share with team  
  - Schedule next assessment

### 4. Assessment History

**Purpose:** View and compare past assessments

**Features:**  
- **Timeline View:**  
  - Chronological list of assessments  
  - Each shows date, overall score, maturity level  
  - Click to view full details

- **Comparison Mode:**  
  - Select two assessments  
  - Side-by-side comparison  
  - Highlight improvements and regressions  
  - Delta scores per dimension

- **Trend Analysis:**  
  - Line chart of overall score over time  
  - Sparklines for each dimension  
  - Annotations for significant changes

### 5. Recommendations Library

**Purpose:** Browse all recommendations regardless of assessment

**Features:**  
- **Filter by:**  
  - Dimension  
  - Current maturity level  
  - Priority  
  - Effort

- **Each Recommendation Card:**  
  - Title  
  - Description  
  - Applicable levels  
  - Toolkit resource link  
  - Priority and effort badges

- **Quick Win Section:**  
  - Filtered view of low-effort, high-impact recommendations

### 6. Export/Reports

**Features:**  
- **Export Assessment PDF:**  
  - Branded TruGovAI™ header  
  - Maturity level summary  
  - Radar chart  
  - Dimension scores table  
  - Key recommendations  
  - Footer with date and generator

- **Export Progress Report:**  
  - Multi-assessment comparison  
  - Progress chart  
  - Improvement narrative

- **Board Summary (1-page):**  
  - Current maturity level  
  - Key risks (lowest dimensions)  
  - Priority actions  
  - Target for next quarter

---

## User Flows

### Completing First Assessment  
1. User clicks "Start Assessment" from empty dashboard  
2. Reads introduction and time estimate  
3. Progresses through 7 dimension sections  
4. Answers 3-4 questions per dimension  
5. Reviews all answers  
6. Submits assessment  
7. Views results with maturity level reveal  
8. Reviews personalised recommendations  
9. Exports PDF for records

### Quarterly Re-Assessment  
1. Dashboard shows "Assessment Due" reminder  
2. User clicks "Start New Assessment"  
3. Previous answers shown as reference (optional)  
4. User updates answers based on current state  
5. Submits new assessment  
6. Results show comparison to previous  
7. Highlights improvements and regressions  
8. Updated recommendations reflect new scores

### Sharing with Leadership  
1. User completes assessment  
2. Clicks "Export Board Summary"  
3. 1-page PDF generates  
4. Shares via email or board portal  
5. Leadership sees maturity level and key actions

---

## API Endpoints

```  
# Assessments  
GET    /api/assessments              # List all assessments (with filters)  
GET    /api/assessments/:id          # Get single assessment with responses  
GET    /api/assessments/latest       # Get most recent completed assessment  
POST   /api/assessments              # Start new assessment  
PUT    /api/assessments/:id          # Update assessment (save progress)  
POST   /api/assessments/:id/submit   # Submit completed assessment  
DELETE /api/assessments/:id          # Delete assessment (draft only)

# Questions  
GET    /api/questions                # Get all questions  
GET    /api/questions/:dimension     # Get questions for dimension

# Recommendations  
GET    /api/recommendations          # List all recommendations  
GET    /api/recommendations/for/:assessmentId  # Get personalised recommendations

# Dashboard  
GET    /api/dashboard/summary        # Current maturity level and scores  
GET    /api/dashboard/history        # Historical assessments data  
GET    /api/dashboard/comparison     # Compare two assessments

# Export  
GET    /api/export/pdf/:assessmentId        # Export single assessment  
GET    /api/export/progress-report          # Export progress over time  
GET    /api/export/board-summary            # Export 1-page board summary  
```

---

## Validation Rules

- Assessment must have at least one response to save as draft  
- Assessment must have all questions answered to submit  
- Answer must be integer 1-5  
- Notes field maximum 500 characters  
- Only draft assessments can be deleted  
- Cannot edit submitted assessments (create new instead)

---

## Sample Data (for testing)

### Sample Assessment

```json  
{  
  "assessmentDate": "2026-01-15",  
  "completedBy": "Sarah Johnson",  
  "completedByEmail": "sarah@example.com",  
  "status": "Completed",  
  "dimensionScores": {  
    "Policy & Documentation": 47,  
    "Risk Management": 33,  
    "Roles & Accountability": 60,  
    "Training & Awareness": 27,  
    "Monitoring & Audit": 40,  
    "Vendor Management": 53,  
    "Continuous Improvement": 20  
  },  
  "overallScore": 40,  
  "maturityLevel": 2  
}  
```

### Sample Recommendations

```json  
[  
  {  
    "dimension": "Training & Awareness",  
    "currentLevel": 2,  
    "targetLevel": 3,  
    "title": "Deploy the AI Governance Training Module",  
    "description": "Roll out the TruGovAI training module to all staff. Track completion rates and require acknowledgment of the AI Acceptable Use Policy.",  
    "toolkitLink": "/toolkit/training-modules",  
    "priority": "High",  
    "effort": "Moderate"  
  },  
  {  
    "dimension": "Continuous Improvement",  
    "currentLevel": 1,  
    "targetLevel": 2,  
    "title": "Establish Quarterly Governance Reviews",  
    "description": "Schedule quarterly reviews to assess governance effectiveness. Use the Quarterly Audit Tracker to maintain consistency.",  
    "toolkitLink": "/toolkit/quarterly-audit-tracker",  
    "priority": "Medium",  
    "effort": "Quick Win"  
  },  
  {  
    "dimension": "Risk Management",  
    "currentLevel": 2,  
    "targetLevel": 3,  
    "title": "Implement the AI Risk Scoring Matrix",  
    "description": "Apply consistent likelihood × impact scoring to all AI tools. Use the Risk Scoring Matrix to standardise assessments across the organisation.",  
    "toolkitLink": "/toolkit/risk-scoring-matrix",  
    "priority": "Critical",  
    "effort": "Moderate"  
  }  
]  
```

---

## Non-Functional Requirements

- **Performance:** Assessment loads in <2s; radar chart renders in <500ms  
- **Responsiveness:** Works on desktop (primary) and tablet  
- **Accessibility:** WCAG 2.1 AA compliance; screen reader support for charts  
- **Browser support:** Chrome, Firefox, Safari, Edge (latest 2 versions)  
- **Data retention:** All assessments retained indefinitely for trend analysis

---

## Future Considerations (don't build now, but design for)

- Multi-tenancy (multiple organisations)  
- Benchmarking against anonymised peer data  
- Integration with AI Tool Inventory (auto-populate policy evidence)  
- Automated reminders for quarterly assessments  
- Custom question sets for specific industries  
- API for external governance platforms

---

## Success Criteria

1. User can complete a full assessment in under 20 minutes  
2. Scores calculate correctly across all dimensions  
3. Radar chart accurately displays dimension scores  
4. Recommendations are relevant to current maturity level  
5. Historical assessments show clear progress comparison  
6. PDF export generates clean, branded document  
7. Maturity level colours match spec exactly

---

## Integration with TruGovAI™ Toolkit

The Maturity Model connects to other toolkit components:

| Recommendation | Links To |
|----------------|----------|
| "Create an AI register" | AI Tool Inventory + Dashboard |
| "Deploy staff survey" | Employee AI Survey |
| "Implement risk scoring" | AI Risk Scoring Matrix |
| "Establish vendor vetting" | Vendor Vetting Checklist |
| "Track AI incidents" | AI Incident Tracker |
| "Conduct quarterly audits" | Quarterly Audit Tracker |

---

## Getting Started

1. Set up Next.js project with TypeScript  
2. Configure Tailwind with brand colours and level colours  
3. Set up PostgreSQL + Prisma schema (Assessment, Response, Question)  
4. Seed question bank with all 21 questions  
5. Build assessment wizard UI with progress tracking  
6. Build score calculation engine  
7. Build dashboard with radar chart (Recharts)  
8. Build results view with recommendations  
9. Add assessment history and comparison  
10. Add PDF export  
11. Test and polish

---

*Part of the TruGovAI™ Toolkit — "Board-ready AI governance in 30 days"*
