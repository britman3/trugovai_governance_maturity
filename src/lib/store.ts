import {
  Assessment,
  AssessmentResponse,
  AssessmentStatus,
  Dimension,
  MaturityLevel,
  Organisation
} from "@/types";
import { calculateAssessmentResults } from "./scoring";
import { v4 as uuidv4 } from "uuid";

// Default organisation for single-org context
const DEFAULT_ORG: Organisation = {
  id: "default-org",
  name: "My Organisation",
  createdAt: new Date(),
  updatedAt: new Date()
};

// In-memory store with localStorage persistence
class DataStore {
  private assessments: Assessment[] = [];
  private organisation: Organisation = DEFAULT_ORG;
  private isInitialized = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    if (this.isInitialized) return;

    try {
      const saved = localStorage.getItem("trugovai_assessments");
      if (saved) {
        const parsed = JSON.parse(saved);
        this.assessments = parsed.map((a: Assessment) => ({
          ...a,
          assessmentDate: new Date(a.assessmentDate),
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt)
        }));
      }

      const orgSaved = localStorage.getItem("trugovai_organisation");
      if (orgSaved) {
        const orgParsed = JSON.parse(orgSaved);
        this.organisation = {
          ...orgParsed,
          createdAt: new Date(orgParsed.createdAt),
          updatedAt: new Date(orgParsed.updatedAt)
        };
      }
    } catch {
      console.error("Failed to load from localStorage");
    }

    this.isInitialized = true;
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("trugovai_assessments", JSON.stringify(this.assessments));
      localStorage.setItem("trugovai_organisation", JSON.stringify(this.organisation));
    } catch {
      console.error("Failed to save to localStorage");
    }
  }

  // Organisation methods
  getOrganisation(): Organisation {
    return this.organisation;
  }

  updateOrganisation(name: string): Organisation {
    this.organisation = {
      ...this.organisation,
      name,
      updatedAt: new Date()
    };
    this.saveToStorage();
    return this.organisation;
  }

  // Assessment methods
  getAllAssessments(): Assessment[] {
    this.loadFromStorage();
    return [...this.assessments].sort(
      (a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime()
    );
  }

  getAssessmentById(id: string): Assessment | undefined {
    this.loadFromStorage();
    return this.assessments.find(a => a.id === id);
  }

  getLatestAssessment(): Assessment | undefined {
    const all = this.getAllAssessments();
    return all.find(a => a.status === AssessmentStatus.Completed);
  }

  getCompletedAssessments(): Assessment[] {
    return this.getAllAssessments().filter(a => a.status === AssessmentStatus.Completed);
  }

  getDraftAssessments(): Assessment[] {
    return this.getAllAssessments().filter(a => a.status === AssessmentStatus.Draft);
  }

  createAssessment(completedBy: string, completedByEmail: string): Assessment {
    const newAssessment: Assessment = {
      id: uuidv4(),
      organisationId: this.organisation.id,
      assessmentDate: new Date(),
      completedBy,
      completedByEmail,
      policyScore: 0,
      riskManagementScore: 0,
      rolesScore: 0,
      trainingScore: 0,
      monitoringScore: 0,
      vendorScore: 0,
      improvementScore: 0,
      overallScore: 0,
      maturityLevel: MaturityLevel.AdHoc,
      status: AssessmentStatus.Draft,
      responses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.assessments.push(newAssessment);
    this.saveToStorage();
    return newAssessment;
  }

  updateAssessment(id: string, responses: AssessmentResponse[]): Assessment | undefined {
    const index = this.assessments.findIndex(a => a.id === id);
    if (index === -1) return undefined;

    const assessment = this.assessments[index];

    // Only allow updates to draft assessments
    if (assessment.status !== AssessmentStatus.Draft) {
      console.warn("Cannot update a completed assessment");
      return assessment;
    }

    // Calculate scores from responses
    const results = calculateAssessmentResults(responses);

    const updated: Assessment = {
      ...assessment,
      responses,
      ...results,
      updatedAt: new Date()
    };

    this.assessments[index] = updated;
    this.saveToStorage();
    return updated;
  }

  submitAssessment(id: string): Assessment | undefined {
    const index = this.assessments.findIndex(a => a.id === id);
    if (index === -1) return undefined;

    const assessment = this.assessments[index];

    // Validate all questions are answered
    if (assessment.responses.length < 21) {
      throw new Error("Assessment must have all questions answered before submitting");
    }

    const submitted: Assessment = {
      ...assessment,
      status: AssessmentStatus.Completed,
      assessmentDate: new Date(),
      updatedAt: new Date()
    };

    this.assessments[index] = submitted;
    this.saveToStorage();
    return submitted;
  }

  deleteAssessment(id: string): boolean {
    const index = this.assessments.findIndex(a => a.id === id);
    if (index === -1) return false;

    const assessment = this.assessments[index];

    // Only allow deletion of draft assessments
    if (assessment.status !== AssessmentStatus.Draft) {
      console.warn("Cannot delete a completed assessment");
      return false;
    }

    this.assessments.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Response methods
  addOrUpdateResponse(
    assessmentId: string,
    questionId: string,
    dimension: Dimension,
    answer: number,
    notes?: string
  ): AssessmentResponse | undefined {
    const assessment = this.getAssessmentById(assessmentId);
    if (!assessment || assessment.status !== AssessmentStatus.Draft) return undefined;

    // Validate answer
    if (answer < 1 || answer > 5 || !Number.isInteger(answer)) {
      throw new Error("Answer must be an integer between 1 and 5");
    }

    // Validate notes length
    if (notes && notes.length > 500) {
      throw new Error("Notes cannot exceed 500 characters");
    }

    const existingIndex = assessment.responses.findIndex(
      r => r.questionId === questionId
    );

    const response: AssessmentResponse = {
      id: existingIndex >= 0 ? assessment.responses[existingIndex].id : uuidv4(),
      assessmentId,
      questionId,
      dimension,
      answer,
      notes: notes ?? ""
    };

    if (existingIndex >= 0) {
      assessment.responses[existingIndex] = response;
    } else {
      assessment.responses.push(response);
    }

    this.updateAssessment(assessmentId, assessment.responses);
    return response;
  }

  // Dashboard data
  getDashboardSummary() {
    const latest = this.getLatestAssessment();
    const completed = this.getCompletedAssessments();
    const previous = completed.length > 1 ? completed[1] : undefined;

    let daysSinceLastAssessment: number | null = null;
    if (latest) {
      const diff = new Date().getTime() - new Date(latest.assessmentDate).getTime();
      daysSinceLastAssessment = Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    return {
      currentAssessment: latest ?? null,
      previousAssessment: previous ?? null,
      totalAssessments: completed.length,
      daysSinceLastAssessment
    };
  }

  // History data for charts
  getHistoryData(): Array<{
    date: string;
    overallScore: number;
    maturityLevel: number;
    dimensionScores: Record<Dimension, number>;
  }> {
    return this.getCompletedAssessments().map(a => ({
      date: new Date(a.assessmentDate).toISOString().split("T")[0],
      overallScore: a.overallScore,
      maturityLevel: a.maturityLevel,
      dimensionScores: {
        [Dimension.Policy]: a.policyScore,
        [Dimension.RiskManagement]: a.riskManagementScore,
        [Dimension.Roles]: a.rolesScore,
        [Dimension.Training]: a.trainingScore,
        [Dimension.Monitoring]: a.monitoringScore,
        [Dimension.Vendor]: a.vendorScore,
        [Dimension.Improvement]: a.improvementScore
      }
    })).reverse(); // Chronological order for charts
  }

  // Clear all data (for testing)
  clearAll() {
    this.assessments = [];
    this.organisation = DEFAULT_ORG;
    if (typeof window !== "undefined") {
      localStorage.removeItem("trugovai_assessments");
      localStorage.removeItem("trugovai_organisation");
    }
  }
}

// Singleton instance
export const dataStore = new DataStore();
