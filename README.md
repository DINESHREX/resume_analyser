# AI Resume & Job Intelligence Engine

A production-grade, privacy-first Resume Analysis foundation.

## Features
- **Strict Logic Separation**: Rule Engine interprets data; AI explains it.
- **Privacy**: No candidate data is trained on.
- **FastAPI Backend**: Async, typed, and fast.
- **Local Vectors**: Uses `sentence-transformers` and `FAISS` locally.

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   Create a `.env` file in the root:
   ```env
   GROQ_API_KEY=gsk_...
   ```

3. **Run Backend**
   ```bash
   # From root directory
   uvicorn backend.app.main:app --reload
   ```

4. **Run Frontend**
   Open `frontend/index.html` in your browser.

## Architecture
- `backend/app/rule_engine`: Deterministic scoring (0-100%).
- `backend/app/ai_brain`: Generative explanations.
- `backend/app/resume_parser`: PDF/DOCX extraction.

## API Documentation
Once running, visit: `http://localhost:8000/docs`
