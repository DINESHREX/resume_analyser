# backend/app/api/routes/v1/analyze.py
# Purpose: Define the API endpoints for Resume Analysis.

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.schemas.analysis_models import FullAnalysisResponse, AIInsights
from app.resume_parser.parser import ResumeParser
from app.rule_engine.engine import RuleEngine
from app.ai_brain.groq_client import ai_brain

router = APIRouter()

@router.post("/analyze", response_model=FullAnalysisResponse)
async def analyze_resume(
    resume_file: UploadFile = File(...),
    jd_text: str = Form(...)
):
    """
    Main Endpoint: Upload Resume + Paste JD to get full AI analysis.
    """
    try:
        # 1. Parse Inputs
        print(f"Parsing Resume: {resume_file.filename}")
        resume_content = await ResumeParser.parse(resume_file)
        
        # New: JD parsing now includes fallback logic automatically
        print("Parsing Job Description (with Fallback Logic)...")
        jd_content = RuleEngine.parse_jd(jd_text)
        
        # 2. Rule Engine (Deterministic Scoring)
        print("Running Rule Engine...")
        analysis_computation = await RuleEngine.analyze(resume_content, jd_content)
        
        # 3. AI Brain (Insights Generation)
        print("Querying AI Brain...")
        ai_insights = await ai_brain.generate_insights(analysis_computation)
        
        # TASK 5: AI FALLBACK HANDLING
        if ai_insights is None:
            print("AI Service unavailable (returned None). Using Fallback.")
            ai_insights = AIInsights(
                summary_explanation="AI service temporarily unavailable. Scores are calculated deterministically and are accurate.",
                ats_suggestions=["Ensure all keywords from the job description are present.", "Use standardized section headers."],
                rewritten_bullets=["[AI Unavailable] Manual review recommended for bullet points."]
            )
        
        # 4. Construct Response
        return FullAnalysisResponse(
            computation=analysis_computation,
            ai_insights=ai_insights
        )
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during processing.")
