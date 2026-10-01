"""
FinNews AI - Main Application Entrypoint
FastAPI server, CORS middleware, API route registration, and static frontend serving.
"""

import logging
import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from backend.config import settings
from backend.routes.health import router as health_router
from backend.routes.news import router as news_router

# Configure clean logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("finnews_ai")

# Initialize FastAPI application
app = FastAPI(
    title="FinNews AI – Financial News Simplifier",
    description="Transforms complex market reports and financial terminology into plain, actionable insights using Groq Llama 3.3 70B and NewsAPI.",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health_router)
app.include_router(news_router)

# Mount frontend directory for easy local access
FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    @app.get("/", include_in_schema=False)
    async def serve_frontend_index():
        """Serve the frontend dashboard index.html at root."""
        index_file = FRONTEND_DIR / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return JSONResponse({
            "service": settings.APP_NAME,
            "status": "online",
            "message": "Frontend index.html not found, but API is operational.",
            "docs": "/docs"
        })
else:
    @app.get("/")
    async def root_status():
        """Fallback root API status."""
        return {
            "service": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "online",
            "docs": "/docs"
        }


# Global exception handler to prevent leaking internal stack traces
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal Server Error",
            "message": "A temporary server issue occurred. Please try again shortly."
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
