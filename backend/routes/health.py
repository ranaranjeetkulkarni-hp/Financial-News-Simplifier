"""
Health Check Route
Provides endpoint for uptime monitoring and API configuration verification.
"""

from fastapi import APIRouter
from backend.config import settings
from backend.models.schemas import HealthResponse

router = APIRouter(prefix="/api", tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def check_health():
    """
    Returns system health status and flags indicating whether
    external services (NewsAPI, Groq) are configured.
    """
    return HealthResponse(
        status="healthy",
        service=settings.APP_NAME,
        version=settings.APP_VERSION,
        news_api_configured=settings.has_news_api_key,
        groq_api_configured=settings.has_groq_api_key,
        model=settings.GROQ_MODEL
    )
