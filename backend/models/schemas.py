"""
Pydantic Schemas for FinNews AI
Defines structured data models for requests, articles, simplifications, and responses.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class FinancialTerm(BaseModel):
    """Represents a simplified financial term and its plain-English explanation."""
    term: str = Field(..., description="The financial term or acronym (e.g., Inflation, Fed Rate)")
    explanation: str = Field(..., description="Plain-English explanation for non-experts")


class RawArticle(BaseModel):
    """Raw article fetched from NewsAPI or external source."""
    source_name: str
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    url: str
    image_url: Optional[str] = None
    published_at: str
    category: Optional[str] = "business"


class SimplifiedArticle(BaseModel):
    """Structured simplified financial news article."""
    id: Optional[str] = None
    title: str = Field(..., description="Simplified, clear headline")
    original_title: Optional[str] = Field(None, description="Original news headline")
    summary: str = Field(..., description="2-4 sentence simplified summary in plain language")
    key_takeaway: str = Field(..., description="Core actionable takeaway for non-experts")
    terms: List[FinancialTerm] = Field(default_factory=list, description="Extracted terms and plain explanations")
    market_relevance: Optional[str] = Field(None, description="Why this news matters to everyday people or markets")
    source: str = Field(..., description="Original news publication source")
    published_at: str = Field(..., description="Publication timestamp / date")
    url: str = Field(..., description="Link to original full article")
    image_url: Optional[str] = Field(None, description="Article preview thumbnail image URL")
    category: Optional[str] = Field("General", description="Category tag e.g. Markets, Economy, Tech")


class NewsResponse(BaseModel):
    """API response envelope for fetched and simplified news."""
    success: bool
    articles: List[SimplifiedArticle]
    total_results: int = 0
    message: Optional[str] = None
    using_fallback: bool = False


class SimplifyTextRequest(BaseModel):
    """Request payload to simplify arbitrary financial text or an article."""
    title: Optional[str] = None
    text: str = Field(..., min_length=15, description="Financial article or excerpt text to simplify")
    source: Optional[str] = "Custom Input"
    url: Optional[str] = None
    category: Optional[str] = "Markets"


class HealthResponse(BaseModel):
    """Health check status response."""
    status: str
    service: str
    version: str
    news_api_configured: bool
    groq_api_configured: bool
    model: str
