"""
FinNews AI - Configuration Module
Loads application settings and environment variables securely.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)


class Settings:
    """Application Settings and Environment Variables"""

    APP_NAME: str = "FinNews AI – Financial News Simplifier"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

    # API Keys
    NEWS_API_KEY: str = os.getenv("NEWS_API_KEY", "").strip()
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "").strip()

    # Groq Model - Supported Llama 3.3 70B model identifier
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    # NewsAPI Settings
    NEWS_API_BASE_URL: str = "https://newsapi.org/v2"
    DEFAULT_NEWS_CATEGORY: str = "business"
    DEFAULT_PAGE_SIZE: int = int(os.getenv("DEFAULT_PAGE_SIZE", "6"))
    MAX_PAGE_SIZE: int = 15

    # CORS Settings (comma-separated origins)
    ALLOWED_ORIGINS: list = [
        origin.strip()
        for origin in os.getenv(
            "ALLOWED_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000,http://localhost:5173,http://127.0.0.1:5173,*"
        ).split(",")
        if origin.strip()
    ]

    # Server configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    @property
    def has_news_api_key(self) -> bool:
        """Check if NewsAPI key is provided and not a placeholder."""
        return bool(self.NEWS_API_KEY and not self.NEWS_API_KEY.startswith("your_"))

    @property
    def has_groq_api_key(self) -> bool:
        """Check if Groq API key is provided and not a placeholder."""
        return bool(self.GROQ_API_KEY and not self.GROQ_API_KEY.startswith("your_"))


settings = Settings()
