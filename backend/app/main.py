# backend/app/main.py
# Purpose: Application Entry Point.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes.v1 import analyze # New path

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
# Note: Prefix is configurable, but generally it would match API_V1_STR
app.include_router(analyze.router, prefix=settings.API_V1_STR, tags=["analysis"])

@app.get("/")
def root():
    return {"message": "AI Resume Intelligence Engine is Running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
