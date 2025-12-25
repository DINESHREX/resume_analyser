# backend/app/utils/text_cleaning.py
# Purpose: Provide standard text normalization functions.
# This ensures consistency between Resume and JD text for better matching.

import re

def clean_text(text: str) -> str:
    """
    Cleans and normalizes text.
    - Removes special characters
    - Normalizes whitespace
    - Converts to lowercase
    """
    if not text:
        return ""
    
    # Replace newlines and tabs with space
    text = text.replace('\n', ' ').replace('\t', ' ')
    
    # Remove non-ascii characters (optional, but good for cleanliness)
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip().lower()

def extract_sentences(text: str) -> list[str]:
    """
    Splits text into basic sentences/bullets.
    Useful for extracting experience/project lines.
    """
    # Simple split by period or newline, can be enhanced with SpaCy later
    # For now, regex split is efficient enough for Foundation
    sentences = re.split(r'[.!?\n]\s+', text)
    return [s.strip() for s in sentences if s.strip()]
