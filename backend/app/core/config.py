# backend/app/core/config.py
# Purpose: Load and manage application configuration and environment variables.
# This ensures no sensitive keys are hardcoded in the codebase.

from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    """
    Application Settings.
    Loads values from environment variables or defaults.
    """
    PROJECT_NAME: str = "AI Resume Intelligence Engine"
    API_V1_STR: str = "/api/v1"
    
    # SECURITY: GROQ_API_KEY must be set in the environment
    GROQ_API_KEY: str = Field(..., description="API Key for Groq AI Service")

    # Embeddings model config
    EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
