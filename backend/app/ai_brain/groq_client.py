# backend/app/ai_brain/groq_client.py
# Purpose: Interface with Groq API to generate human-readable insights.

import json
import os
import asyncio
from pathlib import Path
from groq import AsyncGroq
from app.core.config import settings
from app.schemas.analysis_models import AnalysisComputations, AIInsights

class AIProcessor:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.client = AsyncGroq(api_key=self.api_key)
        # TASK 3: Fix Groq Model (llama3-8b-8192 is deprecated)
        self.model = "llama-3.1-8b-instant" 
        self.prompts = self._load_prompts()
        
        # Initial Connection Log
        print(f"AI Brain Initialized. Model: {self.model}")

    def _load_prompts(self):
        # TASK 1: Fix Prompt File Paths using pathlib (Absolute Paths)
        # Resolves to: backend/app/ai_brain/
        BASE_DIR = Path(__file__).resolve().parent
        PROMPTS_DIR = BASE_DIR / "prompts"
        
        prompts = {}
        try:
            # Load prompts using absolute paths
            # Reading as utf-8 to ensure compatibility
            prompts["analysis"] = (PROMPTS_DIR / "analysis.txt").read_text(encoding="utf-8")
            prompts["ats"] = (PROMPTS_DIR / "ats_suggestions.txt").read_text(encoding="utf-8")
            prompts["rewrite"] = (PROMPTS_DIR / "rewrite.txt").read_text(encoding="utf-8")
            
            # Combine them for the full system prompt
            prompts["full_system"] = f"{prompts['analysis']}\n\n{prompts['ats']}\n\n{prompts['rewrite']}"
            
        except Exception as e:
            print(f"CRITICAL: Error loading prompts from {PROMPTS_DIR}: {e}")
            prompts["full_system"] = "You are a helpful AI assistant."
        
        return prompts

    async def test_groq_connection(self) -> bool:
        """
        Simple health check for Groq API.
        """
        try:
            print("Testing Groq Connection...")
            chat_completion = await self.client.chat.completions.create(
                messages=[{"role": "user", "content": "Hello"}],
                model=self.model,
                max_tokens=10
            )
            print("Groq Connection Successful.")
            return True
        except Exception as e:
            print(f"Groq Connection Failed: {e}")
            return False

    async def generate_insights(self, analysis: AnalysisComputations) -> AIInsights | None:
        """
        Sends the Rule Engine's output to Groq and retrieves structured insights.
        Includes Try/Except/Timeout for robustness.
        Returns None on failure (handled by API layer).
        """
        input_data = analysis.model_dump_json()
        
        try:
            # 10 second timeout to prevent hanging
            print(f"Sending data to Groq AI (Model: {self.model})...")
            chat_completion = await asyncio.wait_for(
                self.client.chat.completions.create(
                    messages=[
                        {
                            "role": "system",
                            "content": self.prompts["full_system"]
                        },
                        {
                            "role": "user",
                            "content": f"Here is the Analysis Data:\n{input_data}"
                        }
                    ],
                    model=self.model,
                    temperature=0.2, 
                    response_format={"type": "json_object"}
                ),
                timeout=10.0 
            )
            
            response_content = chat_completion.choices[0].message.content
            parsed_json = json.loads(response_content)
            
            return AIInsights(**parsed_json)

        except asyncio.TimeoutError:
            print("AI Error: Request Timed Out.")
            # TASK 4: Return None on failure
            return None
            
        except Exception as e:
            print(f"AI Generation Error: {e}")
            # TASK 4: Return None on failure
            return None

ai_brain = AIProcessor()
