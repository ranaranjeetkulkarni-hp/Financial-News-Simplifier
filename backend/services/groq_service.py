"""
Groq LLM Service - Llama 3.3 70B Integration
Simplifies complex financial articles into plain-English summaries,
key takeaways, and demystified financial terms.
"""

import asyncio
import json
import logging
import re
from typing import List, Optional
from backend.config import settings
from backend.models.schemas import FinancialTerm, RawArticle, SimplifiedArticle

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a financial news simplification assistant.
Explain financial news in simple language for a general audience.
Preserve factual accuracy. Do not invent information.
Do not provide personalized investment advice. Clearly distinguish facts from interpretations.
If the article does not contain enough information to determine something, say so.

Respond ONLY with valid JSON in this exact structure without markdown backticks:
{
  "title": "Clear, engaging, jargon-free headline",
  "summary": "2 to 4 simple sentences explaining what happened and why it matters in everyday terms.",
  "key_takeaway": "1 sharp, memorable bullet point summarizing the primary real-world impact.",
  "market_relevance": "1 to 2 sentences explaining how this affects markets, consumers, or investors.",
  "terms": [
    {
      "term": "Specific financial term or acronym from the article",
      "explanation": "Clear, 1-sentence plain-English definition for someone with no finance background."
    }
  ]
}"""


class GroqService:
    """Handles communication with Groq API running Llama 3.3 70B."""

    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL
        self._client = None

    def _get_client(self):
        """Lazy initialization of AsyncGroq client."""
        if self._client is None and settings.has_groq_api_key:
            try:
                from groq import AsyncGroq
                self._client = AsyncGroq(api_key=self.api_key)
            except ImportError:
                logger.error("groq package is not installed. Please install 'groq'.")
                return None
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {e}")
                return None
        return self._client

    async def simplify_article(self, article: RawArticle) -> SimplifiedArticle:
        """
        Simplify a single financial article using Groq Llama 3.3 70B.
        Falls back to rule-based simplification if Groq API is unavailable.
        """
        client = self._get_client()

        # If Groq is not configured, generate high-quality fallback simplification
        if not client or not settings.has_groq_api_key:
            return self._fallback_simplification(article)

        # Prepare trimmed text to avoid exceeding token limits or sending bloat
        article_text = (
            f"Title: {article.title}\n"
            f"Description: {article.description or 'N/A'}\n"
            f"Content: {(article.content or '')[:1200]}"
        )

        user_prompt = f"Please simplify this financial news article for a non-expert:\n\n{article_text}"

        try:
            response = await client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                max_tokens=850,
                response_format={"type": "json_object"}
            )

            response_content = response.choices[0].message.content
            parsed = self._parse_json_safely(response_content)

            if parsed:
                terms_list = [
                    FinancialTerm(
                        term=t.get("term", "Term"),
                        explanation=t.get("explanation", "Financial concept.")
                    )
                    for t in parsed.get("terms", [])
                    if isinstance(t, dict) and t.get("term")
                ]

                return SimplifiedArticle(
                    id=f"art-{abs(hash(article.title)) % 100000}",
                    title=parsed.get("title") or article.title,
                    original_title=article.title,
                    summary=parsed.get("summary") or (article.description or article.title),
                    key_takeaway=parsed.get("key_takeaway") or "Understand market context before making financial choices.",
                    terms=terms_list or self._extract_default_terms(article),
                    market_relevance=parsed.get("market_relevance") or "Reflects broader macroeconomic conditions.",
                    source=article.source_name,
                    published_at=article.published_at,
                    url=article.url,
                    image_url=article.image_url,
                    category=article.category or "Markets"
                )
            else:
                logger.warning(f"Could not parse JSON from Groq for article: {article.title}")
                return self._fallback_simplification(article)

        except Exception as exc:
            logger.error(f"Error calling Groq API for '{article.title}': {exc}")
            return self._fallback_simplification(article)

    async def simplify_articles_batch(
        self,
        articles: List[RawArticle],
        concurrency: int = 3
    ) -> List[SimplifiedArticle]:
        """
        Process multiple articles concurrently with controlled parallelism
        to respect Groq rate limits.
        """
        semaphore = asyncio.Semaphore(concurrency)

        async def worker(art: RawArticle):
            async with semaphore:
                return await self.simplify_article(art)

        tasks = [worker(art) for art in articles]
        results = await asyncio.gather(*tasks, return_exceptions=False)
        return results

    def _parse_json_safely(self, text: str) -> Optional[dict]:
        """Parse JSON response, stripping markdown backticks if present."""
        if not text:
            return None
        text = text.strip()
        # Remove ```json ... ``` wrapper if present
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\s*", "", text)
            text = re.sub(r"\s*```$", "", text)
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Try to find { ... }
            match = re.search(r"\{.*\}", text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except Exception:
                    pass
        return None

    def _extract_default_terms(self, article: RawArticle) -> List[FinancialTerm]:
        """Extract common financial terms based on article keywords."""
        content_lower = f"{article.title} {article.description or ''} {article.content or ''}".lower()
        glossary = {
            "interest rate": ("Interest Rate", "The cost of borrowing money or the reward for saving it, set largely by central banks."),
            "inflation": ("Inflation", "The general increase in prices over time, reducing the purchasing power of each dollar."),
            "yield curve": ("Yield Curve Inversion", "When short-term debt pays higher interest than long-term debt, historically signaling recession risk."),
            "buyback": ("Share Buyback", "When a company purchases its own stock from the open market to reduce shares and increase value."),
            "dividend": ("Dividend", "A cash payment made by a corporation to its shareholders out of its quarterly profits."),
            "capex": ("CapEx (Capital Expenditure)", "Funds used by a business to acquire, upgrade, and maintain physical assets like technology and data centers."),
            "cpi": ("CPI (Consumer Price Index)", "A standard benchmark measuring the average change in prices paid by consumers for a basket of goods."),
            "fomc": ("FOMC (Federal Open Market Committee)", "The Federal Reserve branch that votes on national monetary policy and interest rates."),
            "liquidity": ("Liquidity", "How quickly and easily an asset or investment can be converted into ready cash without loss of value."),
            "sovereign": ("CBDC (Central Bank Digital Currency)", "A digital form of a country's official currency issued and backed by its central monetary authority.")
        }
        found: List[FinancialTerm] = []
        for key, (term, exp) in glossary.items():
            if key in content_lower:
                found.append(FinancialTerm(term=term, explanation=exp))
            if len(found) >= 3:
                break

        if not found:
            found.append(FinancialTerm(
                term="Market Sentiment",
                explanation="The overall attitude or tone of investors and traders toward a specific financial market or security."
            ))

        return found

    def _fallback_simplification(self, article: RawArticle) -> SimplifiedArticle:
        """
        Produce a high-grade plain-English simplification without calling external LLM.
        Ensures the application operates cleanly in offline mode or during key setup.
        """
        # Clean headline
        raw_title = article.title
        simple_title = raw_title.split(" - ")[0].split(" | ")[0]

        desc = article.description or "Recent financial market developments have occurred."
        summary = (
            f"{desc} This update highlights shifting market dynamics and changing investor expectations. "
            f"Analysts are watching these indicators closely to evaluate broad economic health and consumer stability."
        )

        terms = self._extract_default_terms(article)

        return SimplifiedArticle(
            id=f"art-{abs(hash(article.title)) % 100000}",
            title=simple_title,
            original_title=raw_title,
            summary=summary,
            key_takeaway="Watch how central policy and corporate investment trends impact broader consumer and market conditions.",
            terms=terms,
            market_relevance="Directly influences borrowing rates, corporate earnings projections, and investor portfolio positioning.",
            source=article.source_name,
            published_at=article.published_at,
            url=article.url,
            image_url=article.image_url,
            category=article.category or "Markets"
        )


groq_service = GroqService()
