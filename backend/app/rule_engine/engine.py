# backend/app/rule_engine/engine.py
# Purpose: Core business logic for Resume vs JD scoring.
# STRICTLY NO AI HERE. Uses deterministic math and embeddings.

import json
from typing import List
from pathlib import Path
from app.schemas.analysis_models import ResumeContent, JobDescription, ScoringResult, SkillAnalysis, AnalysisComputations
from app.embeddings.embedder import embedding_service
from app.utils.text_cleaning import clean_text

class RuleEngine:
    
    @staticmethod
    def _load_ontology(filename: str) -> any:
        """
        Generic loader for JSON ontology files using absolute paths.
        TASK 2: FIX ONTOLOGY JSON PATHS
        """
        BASE_DIR = Path(__file__).resolve().parent
        ONTOLOGY_DIR = BASE_DIR / "ontology"
        path = ONTOLOGY_DIR / filename

        try:
            with open(path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load ontology from {path}: {e}")
            return [] if "skills.json" in filename else {}

    @staticmethod
    def extract_skills_from_text(text: str) -> List[str]:
        """
        Extracts skills using simple keyword matching against the ontology.
        """
        if not text:
            return []
            
        skills_ontology = RuleEngine._load_ontology("skills.json")
        found_skills = []
        text_lower = text.lower()
        
        for skill in skills_ontology:
            # Check for word boundary mostly to avoid partial matches
            if f" {skill} " in f" {text_lower} ":
                found_skills.append(skill)
        
        return found_skills

    @staticmethod
    def detect_role_from_jd(text: str) -> str:
        """
        Infers the role based on keywords in the JD.
        """
        text_lower = text.lower()
        
        if any(w in text_lower for w in ["ai", "llm", "automation", "machine learning", "rag"]):
            return "ai_automation_engineer"
        elif any(w in text_lower for w in ["backend", "fastapi", "api", "django", "server"]):
            return "python_backend_developer"
        elif any(w in text_lower for w in ["frontend", "react", "javascript", "ui/ux"]):
            return "frontend_developer"
        
        return "generic_software_engineer"

    @staticmethod
    def get_jd_skills(text: str) -> List[str]:
        """
        Orchestrator for JD Skill Extraction.
        Strategy:
        1. Try explicit extraction.
        2. If empty, infer role and load defaults.
        """
        # 1. Explicit Extraction
        extracted_skills = RuleEngine.extract_skills_from_text(text)
        
        if extracted_skills:
            print(f"DEBUG: Found {len(extracted_skills)} explicit skills in JD.")
            return extracted_skills
        
        # 2. Fallback: Role Inference
        role = RuleEngine.detect_role_from_jd(text)
        print(f"DEBUG: No explicit skills found. Inferred Role: {role}")
        
        roles_ontology = RuleEngine._load_ontology("roles.json")
        default_skills = roles_ontology.get(role, [])
        
        return default_skills

    @staticmethod
    def parse_jd(text: str) -> JobDescription:
        """
        Parses raw JD text into a structured object.
        Uses the new intelligent extraction logic.
        """
        if not text:
            raise ValueError("Job Description cannot be empty.")
        
        # intelligently get skills
        final_skills = RuleEngine.get_jd_skills(text)

        return JobDescription(
            raw_text=text,
            required_skills=final_skills
        )

    @staticmethod
    async def analyze(resume: ResumeContent, jd: JobDescription) -> AnalysisComputations:
        """
        Orchestrates the scoring and gap analysis.
        """
        
        # 1. Clean Texts
        clean_resume_text = clean_text(resume.raw_text)
        clean_jd_text = clean_text(jd.raw_text)
        
        clean_resume_skills_text = " ".join(resume.skills)
        clean_jd_skills_text = " ".join(jd.required_skills) if jd.required_skills else clean_jd_text
        
        # 3. Calculate Component Scores
        # A. Skills Score (45%)
        skills_score = embedding_service.compute_similarity_score(
            clean_resume_skills_text if clean_resume_skills_text else clean_resume_text, 
            clean_jd_skills_text
        )
        
        # B. Experience Score (35%)
        clean_experience_text = " ".join(resume.experience)
        experience_score = embedding_service.compute_similarity_score(
            clean_experience_text if clean_experience_text else clean_resume_text,
            clean_jd_text
        )
        
        # C. Projects Score (20%)
        clean_projects_text = " ".join(resume.projects)
        project_score = embedding_service.compute_similarity_score(
            clean_projects_text if clean_projects_text else clean_resume_text,
            clean_jd_text
        )
        
        # 4. Weighted Total
        total = (skills_score * 0.45) + (experience_score * 0.35) + (project_score * 0.20)
        
        scores = ScoringResult(
            overall_score=round(total * 100, 2),
            skills_score=round(skills_score * 100, 2),
            experience_score=round(experience_score * 100, 2),
            project_score=round(project_score * 100, 2)
        )
        
        # 5. Gap Analysis
        skill_gap = RuleEngine._analyze_skill_gap(resume.raw_text, jd.required_skills)

        return AnalysisComputations(
            scores=scores,
            skill_gap=skill_gap,
            resume_data=resume,
            jd_data=jd
        )

    @staticmethod
    def _analyze_skill_gap(resume_text: str, jd_skills: List[str]) -> SkillAnalysis:
        strong = []
        weak = []
        missing = []
        
        resume_lower = resume_text.lower()
        
        for skill in jd_skills:
            skill_lower = skill.lower()
            if skill_lower in resume_lower:
                strong.append(skill)
            else:
                missing.append(skill)
        
        return SkillAnalysis(
            strong_matches=strong,
            weak_matches=weak,
            missing_skills=missing
        )
