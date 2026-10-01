"""
News Routes
Endpoints for fetching financial news and generating simplified summaries using Groq.
"""

import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from backend.models.schemas import (
    NewsResponse,
    RawArticle,
    SimplifyTextRequest,
    SimplifiedArticle
)
from backend.services.groq_service import groq_service
from backend.services.news_service import news_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Financial News"])


@router.get("/news", response_model=dict)
async def get_raw_news(
    category: Optional[str] = Query("business", description="News category filter"),
    q: Optional[str] = Query(None, description="Search keyword for financial articles"),
    page_size: int = Query(6, ge=1, le=15, description="Number of articles to fetch")
):
    """
    Fetch raw financial articles from NewsAPI without running LLM summarization.
    Useful for inspecting incoming news feeds.
    """
    try:
        articles, is_fallback, message = await news_service.fetch_financial_news(
            category=category,
            query=q,
            page_size=page_size
        )
        return {
            "success": True,
            "total_results": len(articles),
            "using_fallback": is_fallback,
            "message": message,
            "articles": [art.model_dump() for art in articles]
        }
    except Exception as exc:
        logger.error(f"Error in /api/news endpoint: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to fetch financial news at this time. Please try again later."
        )


@router.get("/news/simplified", response_model=NewsResponse)
async def get_simplified_news(
    category: Optional[str] = Query("business", description="News category filter (e.g. markets, economy, technology)"),
    q: Optional[str] = Query(None, description="Search keyword in financial news"),
    page_size: int = Query(6, ge=1, le=12, description="Number of articles to process and summarize")
):
    """
    Core pipeline:
    1. Fetches top financial news via NewsAPI.
    2. Passes article content to Groq Llama 3.3 70B.
    3. Transforms jargon into clear summaries, takeaways, and glossary definitions.
    4. Returns structured JSON for frontend cards.
    """
    try:
        # Step 1: Fetch raw articles
        raw_articles, is_fallback, fetch_msg = await news_service.fetch_financial_news(
            category=category,
            query=q,
            page_size=page_size
        )

        if not raw_articles:
            return NewsResponse(
                success=True,
                articles=[],
                total_results=0,
                message="No financial news articles found matching your query.",
                using_fallback=is_fallback
            )

        # Step 2: Simplify articles via Groq Llama 3.3 70B
        simplified = await groq_service.simplify_articles_batch(raw_articles)

        return NewsResponse(
            success=True,
            articles=simplified,
            total_results=len(simplified),
            message=fetch_msg or "Articles successfully simplified by Groq Llama 3.3 70B.",
            using_fallback=is_fallback
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error in /api/news/simplified endpoint: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while simplifying financial news. Please try again."
        )


@router.post("/simplify", response_model=SimplifiedArticle)
async def simplify_custom_text(payload: SimplifyTextRequest):
    """
    Simplify arbitrary user-supplied financial article text or excerpts
    using Groq Llama 3.3 70B.
    """
    try:
        raw_article = RawArticle(
            source_name=payload.source or "User Submission",
            title=payload.title or "Custom Financial Excerpt",
            description=payload.text[:200],
            content=payload.text,
            url=payload.url or "#",
            image_url=None,
            published_at="Just now",
            category=payload.category or "Custom"
        )

        simplified = await groq_service.simplify_article(raw_article)
        return simplified

    except Exception as exc:
        logger.error(f"Error in /api/simplify endpoint: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to simplify submitted text. Please verify formatting and try again."
        )
