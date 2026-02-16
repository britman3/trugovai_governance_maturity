# AUDIT.md — TruGovAI™ AI Governance Maturity Model

**Audit Date:** 2026-02-16
**Audited By:** Automated code audit
**Repository:** trugovai_governance_maturity
**Status:** PRE-IMPLEMENTATION — This repository contains a specification only. No source code has been written yet.

---

## 1. Tech Stack

**No `package.json` exists.** The project has not been initialised.

The **spec.md** defines the following intended tech stack:

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript + Tailwind CSS | Not yet specified |
| Backend | Node.js + Express (or Next.js API routes) | Not yet specified |
| Database | PostgreSQL (with Prisma ORM) | Not yet specified |
| Auth | NextAuth.js or Clerk (email/password + Google SSO) | Not yet specified |
| Charts | Recharts (radar chart, line chart, progress bars) | Not yet specified |
| Export | jsPDF + html2canvas for PDF generation | Not yet specified |

**Confirmed framework:** Next.js (React + TypeScript)
**Confirmed CSS:** Tailwind CSS
**Confirmed ORM:** Prisma

---

## 2. Database Schema

**No `prisma/schema.prisma` or SQL migration files exist.** No database has been set up.

The spec defines the following data model (TypeScript interfaces only — no Prisma schema written):

### Assessment (core entity)

| Field | Type | Notes |
|-------|------|-------|
| id | string (UUID) | Primary key |
| organisationId | string | Link to org |
| assessmentDate | Date | |
| completedBy | string | User who completed |
| completedByEmail | string | |
| policyScore | number | 0–100 |
| riskManagementScore | number | 0–100 |
| rolesScore | number | 0–100 |
| trainingScore | number | 0–100 |
| monitoringScore | number | 0–100 |
| vendorScore | number | 0–100 |
| improvementScore | number | 0–100 |
| overallScore | number | Average of all dimensions |
| maturityLevel | MaturityLevel (1–5) | Derived from overallScore |
| status | AssessmentStatus | Draft or Completed |
| responses | AssessmentResponse[] | One-to-many |
| createdAt | Date | |
| updatedAt | Date | |

### AssessmentResponse

| Field | Type | Notes |
|-------|------|-------|
| id | string | Primary key |
| assessmentId | string | FK → Assessment |
| questionId | string | FK → Question |
| dimension | Dimension (enum) | |
| answer | number | 1–5 scale |
| notes | string | Optional, max 500 chars |

### Question

| Field | Type | Notes |
|-------|------|-------|
| id | string | Primary key |
| dimension | Dimension (enum) | |
| text | string | |
| helpText | string | Guidance for answering |
| levelIndicators | object | Keys 1–5, string descriptions |
| weight | number | Importance within dimension (default 1) |
| order | number | Display order |

### Recommendation

| Field | Type | Notes |
|-------|------|-------|
| id | string | Primary key |
| dimension | Dimension (enum) | |
| currentLevel | MaturityLevel | When to show |
| targetLevel | MaturityLevel | What this helps achieve |
| title | string | |
| description | string | |
| toolkitLink | string | Link to relevant TruGovAI tool |
| priority | Priority (Critical/High/Medium/Low) | |
| effort | Effort (Quick Win/Moderate/Significant) | |

### Enums

```
Dimension: Policy & Documentation | Risk Management | Roles & Accountability |
           Training & Awareness | Monitoring & Audit | Vendor Management |
           Continuous Improvement

MaturityLevel: 1 (Ad Hoc) | 2 (Developing) | 3 (Defined) | 4 (Managed) | 5 (Optimised)

AssessmentStatus: Draft | Completed

Priority: Critical | High | Medium | Low

Effort: Quick Win | Moderate | Significant
```

### DATABASE_URL Format

Not configured. Expected format (from Prisma convention):
```
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?schema=public"
```

---

## 3. All Pages & Screens

**No `src/app/` or `src/pages/` directories exist.** No routes have been created.

The spec defines the following intended screens:

### UI Screens (from spec)

| # | Screen | Description |
|---|--------|-------------|
| 1 | Dashboard (Home) | Overview of current maturity level, radar chart, dimension score cards, progress-over-time line chart, and "Start New Assessment" CTA |
| 2 | Assessment Wizard | Multi-step wizard: Introduction → 7 dimension question steps → Review & Submit |
| 3 | Results View | Detailed breakdown with radar chart, dimension accordion deep-dive, recommendations panel, export actions |
| 4 | Assessment History | Timeline of past assessments, comparison mode (side-by-side), trend analysis |
| 5 | Recommendations Library | Browse/filter all recommendations by dimension, level, priority, effort; includes Quick Win section |
| 6 | Export/Reports | PDF export of single assessment, progress report, 1-page board summary |

### API Routes (from spec)

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/assessments | List all assessments (with filters) |
| GET | /api/assessments/:id | Get single assessment with responses |
| GET | /api/assessments/latest | Get most recent completed assessment |
| POST | /api/assessments | Start new assessment |
| PUT | /api/assessments/:id | Update assessment (save progress) |
| POST | /api/assessments/:id/submit | Submit completed assessment |
| DELETE | /api/assessments/:id | Delete assessment (draft only) |
| GET | /api/questions | Get all questions |
| GET | /api/questions/:dimension | Get questions for dimension |
| GET | /api/recommendations | List all recommendations |
| GET | /api/recommendations/for/:assessmentId | Get personalised recommendations |
| GET | /api/dashboard/summary | Current maturity level and scores |
| GET | /api/dashboard/history | Historical assessments data |
| GET | /api/dashboard/comparison | Compare two assessments |
| GET | /api/export/pdf/:assessmentId | Export single assessment PDF |
| GET | /api/export/progress-report | Export progress over time |
| GET | /api/export/board-summary | Export 1-page board summary |

---

## 4. All Components

**No `src/components/` directory exists.** No components have been built.

The spec implies the following components will be needed:

- Maturity Level Badge (circular badge with level, colour, score)
- Radar Chart (7-axis, Recharts-based, with overlay comparison)
- Dimension Score Card (score, progress bar, mini level badge)
- Progress Over Time Line Chart (assessment dates vs overall score)
- Assessment Wizard Step (question display, 5-point scale, notes field)
- Wizard Progress Bar (step indicator across 8+ steps)
- Results Dimension Accordion (expandable per-dimension detail)
- Recommendation Card (title, description, priority badge, effort badge, toolkit link)
- Assessment Timeline Item (date, score, level for history list)
- Comparison View (side-by-side delta scores)
- PDF Export Button / Report Generator

---

## 5. Business Logic

### Scoring / Calculation Logic

The spec defines three scoring functions. **These are specification-only — no implementation files exist.**

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

### Maturity Levels

| Level | Name | Score Range |
|-------|------|-------------|
| 1 | Ad Hoc | 0–20% |
| 2 | Developing | 21–40% |
| 3 | Defined | 41–60% |
| 4 | Managed | 61–80% |
| 5 | Optimised | 81–100% |

### Export Features

- **PDF export** — via `jsPDF` + `html2canvas` (specified, not implemented)
- Three export types planned:
  1. Single assessment PDF (branded header, radar chart, scores table, recommendations)
  2. Progress report PDF (multi-assessment comparison, progress chart)
  3. Board summary PDF (1-page: current level, key risks, priority actions, quarterly target)
- **No CSV export** specified

### Integrations

The app is designed to link to other TruGovAI™ Toolkit components:

| Recommendation | Links To |
|----------------|----------|
| "Create an AI register" | AI Tool Inventory + Dashboard |
| "Deploy staff survey" | Employee AI Survey |
| "Implement risk scoring" | AI Risk Scoring Matrix |
| "Establish vendor vetting" | Vendor Vetting Checklist |
| "Track AI incidents" | AI Incident Tracker |
| "Conduct quarterly audits" | Quarterly Audit Tracker |

These are outbound links only — no API integrations are specified for v1.

### Email / Notification Features

**None specified for v1.** Future considerations mention "Automated reminders for quarterly assessments" but this is explicitly excluded from v1 scope.

---

## 6. Auth & Multi-tenancy

### Authentication

**Not yet implemented.** The spec defines:
- **Auth provider:** NextAuth.js or Clerk
- **Methods:** Email/password + Google SSO
- **User identity:** `completedBy` (name) and `completedByEmail` fields on Assessment

### Multi-tenancy

**Explicitly excluded from v1.** From the spec:
> "Assume a single-organisation context (no multi-tenancy UI or logic in v1)."

The data model includes an `organisationId` field on Assessment, but multi-tenancy is listed under "Future Considerations (don't build now, but design for)."

### User Roles

**Not specified for v1.** No role-based access control is defined in the spec.

---

## 7. Config

### Port

**Not configured.** No `next.config.js`, `package.json`, or any server config exists. Next.js default would be port `3000`.

### Environment Variables

**No `.env` or `.env.example` files exist.** Based on the spec, the following will be needed:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Prisma) |
| `NEXTAUTH_SECRET` or Clerk keys | Authentication provider config |
| `NEXTAUTH_URL` | Canonical app URL (if using NextAuth.js) |
| Google OAuth credentials | For Google SSO |

### Docker Config

**None.** No `Dockerfile` or `docker-compose.yml` exists.

---

## 8. Lines of Code

```
0 total
```

**No source code exists.** The `src/` directory has not been created. The repository contains only:

| File | Size | Description |
|------|------|-------------|
| `README.md` | 30 bytes | Project title only |
| `spec.md` | ~25.5 KB | Complete authoritative specification |

---

## 9. UI Patterns

**No UI has been built.** The following patterns are defined in the spec:

### Navigation Style

Not explicitly specified. The spec defines 6 screens (Dashboard, Assessment Wizard, Results, History, Recommendations Library, Export/Reports) which implies a sidebar or top navigation pattern.

### Chart Library

- **Recharts** — specified for radar chart, line chart, and progress bars

### Brand Colours

Defined in spec as CSS custom properties:

| Variable | Hex | Usage |
|----------|-----|-------|
| `--navy` | `#0F2A3A` | Primary background, headers |
| `--teal` | `#1AA7A1` | Primary accent, buttons, links |
| `--ice` | `#F4F7F9` | Light background |
| `--slate700` | `#4C5D6B` | Body text on light backgrounds |
| `--mint300` | `#71D1C8` | Charts, secondary accent |
| `--level1` | `#FF6B6B` | Ad Hoc (Red) |
| `--level2` | `#F59E0B` | Developing (Amber) |
| `--level3` | `#FBBF24` | Defined (Yellow) |
| `--level4` | `#34D399` | Managed (Light Green) |
| `--level5` | `#7BC96F` | Optimised (Green) |

Additional UI tokens:
- `--radius`: `14px`
- `--shadow`: `0 8px 24px rgba(0,0,0,0.08)`

### Font

- **Primary:** Inter (fallback: system-ui, sans-serif)
- **Monospace (data):** JetBrains Mono
- **Scale:** H1 44px | H2 32px | H3 24px | Body 16px | Small 14px

### Component Style (from spec)

- **Buttons:** 12px/16px padding, 8px radius, bold 16px text
- **Cards:** 14px radius, subtle shadow, white background on ice
- **Progress indicators:** Gradient fill from current level colour

---

## Summary

This repository is in a **pre-implementation state**. It contains a comprehensive, authoritative specification (`spec.md`) that defines the full application — data model, screens, API endpoints, scoring logic, brand guidelines, and non-functional requirements — but **zero source code has been written**. All sections above document what the spec *intends* rather than what *exists* in code.

### Files in Repository

```
.
├── README.md          (30 bytes — project title only)
├── spec.md            (~25.5 KB — full specification)
└── AUDIT.md           (this file)
```
