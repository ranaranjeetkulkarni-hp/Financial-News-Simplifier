"""
News Service - NewsAPI Integration
Handles fetching financial, business, and market news articles.
Includes comprehensive error handling, pagination, and curated fallbacks.
"""

import logging
from typing import List, Optional, Tuple
import httpx
from backend.config import settings
from backend.models.schemas import RawArticle

logger = logging.getLogger(__name__)

# Curated fallback articles for instant demonstration, offline development, or when API limits are reached
DEMO_FINANCIAL_ARTICLES: List[RawArticle] = [
    RawArticle(
        source_name="Financial Times",
        title="Federal Reserve Signals Pauses on Benchmark Interest Rate Hikes as Core Inflation Cools",
        description="Federal Reserve policymakers indicated a potential halt to their historic interest rate tightening campaign following a notable dip in the Consumer Price Index (CPI).",
        content="The Federal Open Market Committee (FOMC) convened to assess prevailing macroeconomic indicators. Chairman emphasized that while labor market resilience persists, tightening credit conditions and cooling core inflation may warrant holding the federal funds rate steady at 5.25%-5.50%. Bond yields receded globally across 10-year Treasury maturities.",
        url="https://www.ft.com",
        image_url="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
        published_at="2026-03-30T14:30:00Z",
        category="Markets"
    ),
    RawArticle(
        source_name="Bloomberg Markets",
        title="Global Chipmakers Rally as Cloud Giants Expand AI Data Center Capital Expenditure",
        description="Semiconductor equity valuations reached unprecedented highs after major hyperscalers reported substantial increases in projected capital expenditures for enterprise AI infrastructure.",
        content="Major tech conglomerates reported surging capital expenditures (CapEx) targeted at graphics processing units (GPUs) and specialized high-bandwidth memory (HBM). Supply-chain analysts noted book-to-bill ratios for top foundries expanded to 1.3, leading to widespread stock upgrades across institutional asset managers.",
        url="https://www.bloomberg.com",
        image_url="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        published_at="2026-03-30T12:15:00Z",
        category="Technology"
    ),
    RawArticle(
        source_name="The Wall Street Journal",
        title="Treasury Yield Curve Inversion Deepens Amid Recession Concerns and Liquidity Squeeze",
        description="The spread between 2-year and 10-year US Treasury notes reached historic inverted territory, causing market watchers to evaluate banking sector liquidity reserves.",
        content="Fixed-income investors parsed recent Treasury auctions as the 2-year/10-year yield spread remained inverted by over 45 basis points. Historical precedents suggest yield curve inversions frequently precede economic contractions, prompting institutional hedge funds to rebalance into defensive equities and high-grade commercial paper.",
        url="https://www.wsj.com",
        image_url="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80",
        published_at="2026-03-30T09:45:00Z",
        category="Economy"
    ),
    RawArticle(
        source_name="Reuters",
        title="OPEC+ Extends Voluntary Crude Oil Output Cuts to Stabilize Global Petroleum Benchmarks",
        description="Oil-producing nations coordinated to preserve daily production quotas, countering bearish demand forecasts and keeping Brent crude near $85 per barrel.",
        content="Representatives from the Organization of the Petroleum Exporting Countries along with key allies finalized an agreement to prolong 2.2 million barrels per day in voluntary output curbs. Energy analysts indicated this supply-side constraint aims to counter downward pressure on crude futures stemming from high global inventory builds.",
        url="https://www.reuters.com",
        image_url="https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&auto=format&fit=crop&q=80",
        published_at="2026-03-29T18:20:00Z",
        category="Global"
    ),
    RawArticle(
        source_name="CNBC",
        title="Retail Banking Giant Unveils Share Buyback Program and 8% Dividend Hike After Strong Net Interest Margins",
        description="Robust net interest margins helped quarterly earnings exceed Wall Street estimates, paving the way for aggressive capital return programs.",
        content="The multinational financial institution posted strong Return on Equity (ROE) of 14.8%, benefiting from widened spreads between deposit rates and lending yields. The executive board authorized a $15 billion share repurchase tranche alongside an increased quarterly payout to common equity shareholders.",
        url="https://www.cnbc.com",
        image_url="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
        published_at="2026-03-29T15:10:00Z",
        category="Business"
    ),
    RawArticle(
        source_name="Forbes",
        title="Central Banks Accelerate Research into Sovereign Digital Currencies (CBDCs) for Cross-Border Settlement",
        description="Monetary authorities from twelve economies announced a pilot framework to streamline foreign exchange liquidity and lower transaction friction.",
        content="Project Meridian demonstrates synchronized gross settlement mechanisms across disparate central bank digital ledger infrastructures. The initiative aims to mitigate counterparty risk and currency settlement volatility in global trade corridors without sacrificing regulatory oversight or KYC compliance.",
        url="https://www.forbes.com",
        image_url="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop&q=80",
        published_at="2026-03-29T11:00:00Z",
        category="Global"
    )
]


class NewsService:
    """Service to interact with NewsAPI and manage financial articles."""

    def __init__(self):
        self.api_key = settings.NEWS_API_KEY
        self.base_url = settings.NEWS_API_BASE_URL
        self.headers = {
            "User-Agent": "FinNewsAI/1.0 (+https://github.com/finnews-ai)",
            "Accept": "application/json"
        }

    async def fetch_financial_news(
        self,
        category: Optional[str] = "business",
        query: Optional[str] = None,
        page_size: int = 6
    ) -> Tuple[List[RawArticle], bool, Optional[str]]:
        """
        Fetch financial news from NewsAPI.
        
        Returns:
            Tuple[List[RawArticle], is_fallback, status_message]
        """
        # If API key is missing or placeholder, use fallback
        if not settings.has_news_api_key:
            logger.info("NewsAPI key not configured or placeholder. Using curated financial articles.")
            articles = self._filter_demo_articles(category=category, query=query, limit=page_size)
            return articles, True, "Using curated live sample articles (NewsAPI key not set in .env)"

        page_size = min(max(1, page_size), settings.MAX_PAGE_SIZE)

        # Build parameters
        params = {
            "apiKey": self.api_key,
            "pageSize": page_size,
            "language": "en"
        }

        # Select endpoint: everything if query provided, else top-headlines
        if query and query.strip():
            url = f"{self.base_url}/everything"
            params["q"] = f"({query.strip()}) AND (finance OR market OR economy OR business OR stock)"
            params["sortBy"] = "publishedAt"
        else:
            url = f"{self.base_url}/top-headlines"
            # Map category
            cat_map = {
                "markets": "business",
                "economy": "business",
                "business": "business",
                "technology": "technology",
                "global": "general",
                "latest": "business"
            }
            api_cat = cat_map.get((category or "business").lower(), "business")
            params["category"] = api_cat

        try:
            async with httpx.AsyncClient(timeout=10.0, headers=self.headers) as client:
                response = await client.get(url, params=params)

                if response.status_code == 200:
                    data = response.json()
                    articles_data = data.get("articles", [])

                    raw_articles: List[RawArticle] = []
                    for item in articles_data:
                        # Exclude removed or blank articles
                        title = item.get("title", "")
                        if not title or "[Removed]" in title or len(title) < 10:
                            continue

                        raw_articles.append(
                            RawArticle(
                                source_name=item.get("source", {}).get("name") or "Financial Wire",
                                title=title,
                                description=item.get("description"),
                                content=item.get("content"),
                                url=item.get("url") or "https://news.google.com",
                                image_url=item.get("urlToImage"),
                                published_at=item.get("publishedAt") or "Recently",
                                category=category.capitalize() if category else "Markets"
                            )
                        )

                    if raw_articles:
                        return raw_articles[:page_size], False, "Articles fetched successfully from NewsAPI."

                    logger.warning("NewsAPI returned 0 valid articles. Using curated fallback.")
                    return self._filter_demo_articles(category, query, page_size), True, "No recent news matched criteria; showing curated financial news."

                elif response.status_code == 401:
                    logger.error("NewsAPI 401 Unauthorized - Invalid API Key.")
                    return self._filter_demo_articles(category, query, page_size), True, "Invalid NewsAPI key. Using curated financial articles."

                elif response.status_code == 429:
                    logger.warning("NewsAPI rate limit reached. Using curated fallback.")
                    return self._filter_demo_articles(category, query, page_size), True, "NewsAPI rate limit reached. Showing curated financial news."

                else:
                    logger.error(f"NewsAPI returned status {response.status_code}: {response.text}")
                    return self._filter_demo_articles(category, query, page_size), True, f"NewsAPI temporary error ({response.status_code}). Showing curated news."

        except httpx.RequestError as exc:
            logger.error(f"Network error while connecting to NewsAPI: {exc}")
            return self._filter_demo_articles(category, query, page_size), True, "Network error reaching NewsAPI. Displaying curated financial news."
        except Exception as exc:
            logger.error(f"Unexpected error in NewsService: {exc}")
            return self._filter_demo_articles(category, query, page_size), True, "An error occurred while fetching news. Displaying curated news."

    def _filter_demo_articles(self, category: Optional[str], query: Optional[str], limit: int) -> List[RawArticle]:
        """Filter demo articles based on category and query."""
        results = DEMO_FINANCIAL_ARTICLES

        if category and category.lower() not in ("latest", "all", "general"):
            cat_lower = category.lower()
            filtered = [a for a in results if (a.category or "").lower() == cat_lower]
            if filtered:
                results = filtered

        if query and query.strip():
            q_lower = query.strip().lower()
            matched = [
                a for a in results
                if q_lower in a.title.lower() or (a.description and q_lower in a.description.lower())
            ]
            if matched:
                results = matched

        return results[:limit]


news_service = NewsService()
