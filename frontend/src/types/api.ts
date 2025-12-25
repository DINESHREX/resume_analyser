export interface ResumeContent {
  raw_text: string;
  skills: string[];
  experience: string[];
  projects: string[];
}

export interface JobDescription {
  raw_text: string;
  required_skills: string[];
}

export interface SkillAnalysis {
  strong_matches: string[];
  weak_matches: string[];
  missing_skills: string[];
}

export interface ScoringResult {
  overall_score: number;
  skills_score: number;
  experience_score: number;
  project_score: number;
}

export interface AnalysisComputations {
  scores: ScoringResult;
  skill_gap: SkillAnalysis;
  resume_data: ResumeContent;
  jd_data: JobDescription;
}

export interface AIInsights {
  summary_explanation: string;
  ats_suggestions: string[];
  rewritten_bullets: string[];
}

export interface FullAnalysisResponse {
  computation: AnalysisComputations;
  ai_insights: AIInsights;
}
