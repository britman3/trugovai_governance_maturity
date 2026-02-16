# AUDIT.md — TruGovAI™ AI Governance Maturity Model

**Audit Date:** 2026-02-16
**Audited By:** Automated code audit
**Repository:** trugovai_governance_maturity
**Status:** PRE-IMPLEMENTATION — This repository contains only a specification document. No application source code has been written on any branch.

---

## 1. Branch Info

### All Branches Found

| Branch | Location | Contents |
|--------|----------|----------|
| `master` | local | `README.md`, `spec.md` |
| `main` | remote only (`origin/main`) | `README.md`, `spec.md` |
| `claude/create-audit-docs-fqIfo` | local + remote | `README.md`, `spec.md`, `AUDIT.md` |

### Which branch contains the code?

**None.** Every branch was inspected — no branch contains a `src/` directory, `package.json`, `prisma/` folder, or any application code. The repository consists of a specification document (`spec.md`) and a README on all branches.

The `master` / `main` branch has 2 commits:
```
2c68465 Add files via upload
f9e1067 Initial commit
```

All audit findings below are derived from `spec.md` (the authoritative specification). Items marked **(spec only)** have not been implemented.

---

## 2. Tech Stack

**No `package.json` exists.** The project has not been initialised.

The **spec.md** defines the following intended stack:

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| Frontend | React + TypeScript + Tailwind CSS | TBD | spec only |
| Backend | Node.js + Express (or Next.js API routes) | TBD | spec only |
| Database | PostgreSQL with Prisma ORM | TBD | spec only |
| Auth | NextAuth.js or Clerk (email/password + Google SSO) | TBD | spec only |
| Charts | Recharts (radar chart, line chart, progress bars) | TBD | spec only |
| Export | jsPDF + html2canvas for PDF generation | TBD | spec only |

- **Framework:** Next.js (React + TypeScript)
- **CSS:** Tailwind CSS
- **ORM:** Prisma

---

## 3. Database Schema

**No `prisma/schema.prisma` or SQL migration files exist.** No database has been configured.

The spec defines the following data model as TypeScript interfaces (not yet translated to Prisma):

### Model: Assessment (core entity)

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
| status | AssessmentStatus | "Draft" or "Completed" |
| responses | AssessmentResponse[] | One-to-many relation |
| createdAt | Date | |
| updatedAt | Date | |

### Model: AssessmentResponse

| Field | Type | Notes |
|-------|------|-------|
| id | string | Primary key |
| assessmentId | string | FK → Assessment |
| questionId | string | FK → Question |
| dimension | Dimension (enum) | One of 7 dimensions |
| answer | number | 1–5 scale |
| notes | string | Optional context, max 500 chars |

### Model: Question

| Field | Type | Notes |
|-------|------|-------|
| id | string | Primary key |
| dimension | Dimension (enum) | |
| text | string | Question text |
| helpText | string | Guidance for answering |
| levelIndicators | object | Keys 1–5, string descriptions for each level |
| weight | number | Importance within dimension (default 1) |
| order | number | Display order |

### Model: Recommendation

| Field | Type | Notes |
|-------|------|-------|
| id | string | Primary key |
| dimension | Dimension (enum) | |
| currentLevel | MaturityLevel | When to show this rec |
| targetLevel | MaturityLevel | What this helps achieve |
| title | string | |
| description | string | |
| toolkitLink | string | Link to relevant TruGovAI tool |
| priority | Priority enum | Critical / High / Medium / Low |
| effort | Effort enum | Quick Win / Moderate / Significant |

### Enums

| Enum | Values |
|------|--------|
| Dimension | Policy & Documentation, Risk Management, Roles & Accountability, Training & Awareness, Monitoring & Audit, Vendor Management, Continuous Improvement |
| MaturityLevel | 1 (Ad Hoc), 2 (Developing), 3 (Defined), 4 (Managed), 5 (Optimised) |
| AssessmentStatus | Draft, Completed |
| Priority | Critical, High, Medium, Low |
| Effort | Quick Win (< 1 week), Moderate (1–4 weeks), Significant (> 1 month) |

### Relationships

```
Assessment 1 ──→ N AssessmentResponse
Question   1 ──→ N AssessmentResponse (via questionId)
Recommendation (standalone, linked by dimension + level)
```

### DATABASE_URL Format

Not configured. Expected Prisma format:
```
DATABASE_URL="postgresql://<USER>:********@<HOST>:<PORT>/<DATABASE>?schema=public"
```

---

## 4. All Pages & Screens

**No `src/app/` or `src/pages/` directories exist.** No routes have been created.

### Planned UI Screens (from spec)

| # | Screen | Route (implied) | Description |
|---|--------|-----------------|-------------|
| 1 | Dashboard (Home) | `/` | Overview: maturity level badge, radar chart, dimension score cards, progress-over-time line chart, "Start New Assessment" CTA |
| 2 | Assessment Wizard | `/assessment/new` | Multi-step wizard: Step 0 (intro) → Steps 1–7 (dimension questions) → Step 8 (review & submit) |
| 3 | Results View | `/assessment/:id/results` | Radar chart, dimension deep-dive accordion, recommendations panel, export actions |
| 4 | Assessment History | `/history` | Timeline of past assessments, comparison mode (side-by-side), trend analysis with sparklines |
| 5 | Recommendations Library | `/recommendations` | Browse/filter all recommendations by dimension, level, priority, effort; Quick Win section |
| 6 | Export/Reports | (actions, not a standalone page) | PDF export of single assessment, progress report, 1-page board summary |

### Planned API Routes (from spec)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/assessments` | List all assessments (with filters) |
| GET | `/api/assessments/:id` | Get single assessment with responses |
| GET | `/api/assessments/latest` | Get most recent completed assessment |
| POST | `/api/assessments` | Start new assessment |
| PUT | `/api/assessments/:id` | Update assessment (save progress) |
| POST | `/api/assessments/:id/submit` | Submit completed assessment |
| DELETE | `/api/assessments/:id` | Delete assessment (draft only) |
| GET | `/api/questions` | Get all questions |
| GET | `/api/questions/:dimension` | Get questions for dimension |
| GET | `/api/recommendations` | List all recommendations |
| GET | `/api/recommendations/for/:assessmentId` | Get personalised recommendations |
| GET | `/api/dashboard/summary` | Current maturity level and scores |
| GET | `/api/dashboard/history` | Historical assessments data |
| GET | `/api/dashboard/comparison` | Compare two assessments |
| GET | `/api/export/pdf/:assessmentId` | Export single assessment PDF |
| GET | `/api/export/progress-report` | Export progress over time |
| GET | `/api/export/board-summary` | Export 1-page board summary |

**Total: 6 screens, 17 API endpoints planned.**

---

## 5. All Components

**No `src/components/` directory exists.** No components have been built.

The spec implies the following components will be needed:

| Component (implied) | Purpose |
|---------------------|---------|
| MaturityLevelBadge | Large circular badge showing level (1–5), name, colour, overall % score, last assessment date |
| RadarChart | 7-axis Recharts radar chart, overlay previous assessment for comparison, hover tooltips |
| DimensionScoreCard | Per-dimension card: score (0–100), progress bar, mini maturity badge, "Improve this area" link |
| ProgressLineChart | X = assessment dates, Y = overall score, line with data points, tooltips |
| AssessmentWizardStep | Question display with 5-point scale, level descriptions, expandable help text, optional notes field |
| WizardProgressBar | Step indicator across 8+ steps (intro + 7 dimensions + review) |
| DimensionAccordion | Expandable per-dimension results: score, level, questions/answers, gap analysis |
| RecommendationCard | Title, description, priority badge, effort badge, toolkit resource link |
| AssessmentTimelineItem | History row: date, overall score, maturity level, click to view |
| ComparisonView | Side-by-side two-assessment comparison with delta scores per dimension |
| PDFExportButton | Triggers jsPDF + html2canvas generation for assessment/progress/board reports |

---

## 6. Business Logic

### Scoring / Calculation Logic

The spec defines four functions. **These exist only in spec.md — no source files implement them.**

```typescript
// Calculate a single dimension's score (0-100)
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

// Calculate overall score (average of 7 dimension scores)
function calculateOverallScore(dimensionScores: Record<Dimension, number>): number {
  const scores = Object.values(dimensionScores);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// Map overall score to maturity level
function getMaturityLevel(score: number): MaturityLevel {
  if (score <= 20) return MaturityLevel.AdHoc;
  if (score <= 40) return MaturityLevel.Developing;
  if (score <= 60) return MaturityLevel.Defined;
  if (score <= 80) return MaturityLevel.Managed;
  return MaturityLevel.Optimised;
}

// Map maturity level to brand colour
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

### Maturity Level Thresholds

| Level | Name | Score Range | Colour |
|-------|------|-------------|--------|
| 1 | Ad Hoc | 0–20% | `#FF6B6B` |
| 2 | Developing | 21–40% | `#F59E0B` |
| 3 | Defined | 41–60% | `#FBBF24` |
| 4 | Managed | 61–80% | `#34D399` |
| 5 | Optimised | 81–100% | `#7BC96F` |

### Question Bank

21 questions total (3 per dimension across 7 dimensions). Each question has 5 level indicators describing what each answer (1–5) means. All questions use default weight of 1.

### Export Features (spec only)

- **Library:** `jsPDF` + `html2canvas`
- **Format:** PDF only (no CSV export specified)
- **Three export types:**
  1. **Single Assessment PDF** — branded TruGovAI header, maturity level summary, radar chart, dimension scores table, key recommendations, footer with date
  2. **Progress Report PDF** — multi-assessment comparison, progress chart, improvement narrative
  3. **Board Summary PDF** — 1-page: current maturity level, key risks (lowest dimensions), priority actions, target for next quarter

### Integrations with Other Apps

Outbound links only to other TruGovAI Toolkit components (no API integrations in v1):

| Recommendation | Links To |
|----------------|----------|
| "Create an AI register" | AI Tool Inventory + Dashboard |
| "Deploy staff survey" | Employee AI Survey |
| "Implement risk scoring" | AI Risk Scoring Matrix |
| "Establish vendor vetting" | Vendor Vetting Checklist |
| "Track AI incidents" | AI Incident Tracker |
| "Conduct quarterly audits" | Quarterly Audit Tracker |

### Email / Notification Features

**None in v1.** "Automated reminders for quarterly assessments" is listed under Future Considerations and explicitly excluded from v1 scope.

---

## 7. Auth & Multi-tenancy

### Authentication (spec only — not implemented)

- **Provider:** NextAuth.js or Clerk (decision not yet made)
- **Methods:** Email/password + Google SSO
- **User identity fields on Assessment:** `completedBy` (name), `completedByEmail` (email)
- **Sessions:** Not detailed beyond provider choice

### Multi-tenancy

**Explicitly excluded from v1.** The spec states:
> "Assume a single-organisation context (no multi-tenancy UI or logic in v1)."

The data model includes an `organisationId` field on Assessment (designed for future multi-tenancy), but this is listed under "Future Considerations (don't build now, but design for)."

### User Roles

**Not specified for v1.** No role-based access control, permissions, or admin/user distinction defined in the spec.

---

## 8. Config

### Port

**Not configured.** No `next.config.js`, `package.json`, or server config exists. Next.js default is port `3000`.

### Environment Variables Needed

**No `.env`, `.env.example`, or `.env.local` files exist.** Based on the spec, the following will be required:

| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string for Prisma | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js session secret (if using NextAuth) | Yes (if NextAuth) |
| `NEXTAUTH_URL` | Canonical app URL (if using NextAuth) | Yes (if NextAuth) |
| `CLERK_PUBLISHABLE_KEY` | Clerk public key (if using Clerk) | Yes (if Clerk) |
| `CLERK_SECRET_KEY` | Clerk secret key (if using Clerk) | Yes (if Clerk) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID for SSO | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret for SSO | Yes |

### Docker Config

**None.** No `Dockerfile` or `docker-compose.yml` exists in the repository.

---

## 9. Lines of Code

```
0 total
```

**No source code exists.** There is no `src/` directory on any branch. The entire repository consists of:

| File | Size | Lines | Description |
|------|------|-------|-------------|
| `README.md` | 30 B | 1 | Project title only (`# trugovai_governance_maturity`) |
| `spec.md` | ~25.5 KB | 817 | Complete authoritative specification |
| **Total** | **~25.5 KB** | **818** | **Spec only — 0 lines of application code** |

---

## 10. UI Patterns

**No UI has been built.** The following patterns are defined in the spec:

### Navigation Style

Not explicitly specified. The spec defines 6 screens (Dashboard, Assessment Wizard, Results, History, Recommendations Library, Export/Reports) which implies a sidebar or top-nav pattern. The Assessment Wizard uses a multi-step internal navigation with progress bar.

### Chart Library

**Recharts** (spec only) — for:
- Radar chart (7-axis, dimension scores, comparison overlay)
- Line chart (progress over time)
- Progress bars (dimension score cards)
- Sparklines (per-dimension trends in history view)

### Brand Colours (exact hex values from spec)

**Primary:**

| Token | Hex | Usage |
|-------|-----|-------|
| `--navy` | `#0F2A3A` | Primary background, headers |
| `--teal` | `#1AA7A1` | Primary accent, buttons, links |
| `--ice` | `#F4F7F9` | Light background |

**Secondary:**

| Token | Hex | Usage |
|-------|-----|-------|
| `--slate700` | `#4C5D6B` | Body text on light backgrounds |
| `--mint300` | `#71D1C8` | Charts, secondary accent |

**Maturity Level Colours:**

| Token | Hex | Level |
|-------|-----|-------|
| `--level1` | `#FF6B6B` | Ad Hoc (Red) |
| `--level2` | `#F59E0B` | Developing (Amber) |
| `--level3` | `#FBBF24` | Defined (Yellow) |
| `--level4` | `#34D399` | Managed (Light Green) |
| `--level5` | `#7BC96F` | Optimised (Green) |

**UI Tokens:**

| Token | Value |
|-------|-------|
| `--radius` | `14px` |
| `--shadow` | `0 8px 24px rgba(0,0,0,0.08)` |

### Fonts

| Usage | Font | Fallback |
|-------|------|----------|
| Primary (all UI) | **Inter** | system-ui, sans-serif |
| Monospace (data display) | **JetBrains Mono** | — |

**Type Scale:** H1 44px | H2 32px | H3 24px | Body 16px | Small 14px

### Component Style Tokens (from spec)

- **Buttons:** 12px/16px padding, 8px radius, bold 16px text
- **Cards:** 14px radius, subtle shadow, white background on `--ice`
- **Progress indicators:** Gradient fill using current maturity level colour

---

## Summary

| Category | Status |
|----------|--------|
| Application code | **None** — 0 lines across all branches |
| Branches with code | **None** — all branches contain only `README.md` + `spec.md` |
| Specification | **Complete** — 817-line spec covering data model, 6 screens, 17 API endpoints, 21 questions, scoring logic, brand guidelines |
| Database | **Not set up** — Prisma schema not written |
| Auth | **Not implemented** — NextAuth.js or Clerk specified |
| Docker | **Not configured** |

### Repository File Tree (all branches)

```
.
├── README.md       (1 line — project title)
├── spec.md         (817 lines — authoritative specification)
└── AUDIT.md        (this file)
```

This is a greenfield project ready for implementation. The spec is comprehensive and prescriptive — see `spec.md` for the complete build plan.
