# backend/app/resume_parser/parser.py
# Purpose: Handle file ingestion and text extraction from PDF/DOCX.
# It uses heuristics to segment the text into Skills, Experience, and Projects.

import io
import re
import pdfplumber
import docx
from fastapi import UploadFile
from app.schemas.analysis_models import ResumeContent
from app.utils.text_cleaning import clean_text

class ResumeParser:
    """
    Parser for Resume files.
    """
    
    @staticmethod
    async def parse(file: UploadFile) -> ResumeContent:
        filename = file.filename.lower()
        content = await file.read()
        file_stream = io.BytesIO(content)
        
        raw_text = ""
        
        if filename.endswith(".pdf"):
            raw_text = ResumeParser._extract_pdf(file_stream)
        elif filename.endswith(".docx"):
            raw_text = ResumeParser._extract_docx(file_stream)
        else:
            raise ValueError("Unsupported file format. Use PDF or DOCX.")
            
        return ResumeParser._structure_text(raw_text)

    @staticmethod
    def _extract_pdf(stream) -> str:
        text = ""
        with pdfplumber.open(stream) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        return text

    @staticmethod
    def _extract_docx(stream) -> str:
        doc = docx.Document(stream)
        text = []
        for para in doc.paragraphs:
            text.append(para.text)
        return "\n".join(text)

    @staticmethod
    def _structure_text(text: str) -> ResumeContent:
        """
        Heuristic segmentation of the resume text.
        This is a Foundation Rule-Based implementation.
        """
        lines = text.split('\n')
        
        sections = {
            "skills": [],
            "experience": [],
            "projects": []
        }
        
        current_section = None
        
        # Simple keywords to switch sections
        keywords = {
            "skills": ["skills", "technologies", "technical skills", "stack"],
            "experience": ["experience", "work history", "employment", "internships"],
            "projects": ["projects", "personal projects", "academic projects"]
        }
        
        for line in lines:
            normalized_line = line.strip().lower()
            if not normalized_line:
                continue
                
            # Check if line is a header
            is_header = False
            for section, keys in keywords.items():
                if any(key in normalized_line for key in keys) and len(normalized_line) < 30:
                    current_section = section
                    is_header = True
                    break
            
            if is_header:
                continue
                
            if current_section:
                sections[current_section].append(line.strip())
        
        if not any(sections.values()):
             sections["experience"] = [line.strip() for line in lines if line.strip()]

        return ResumeContent(
            raw_text=text,
            skills=sections["skills"],
            experience=sections["experience"],
            projects=sections["projects"]
        )
