# FinNews AI – Financial News Simplifier 📈🤖

> **Understand financial news. Simply.**  
> Turn complex financial terminology, market jargon, and economic reports into clear, jargon-free, easy-to-understand insights using **FastAPI**, **NewsAPI**, and **Groq Llama 3.3 70B**.

---

## 1. Project Overview

Financial news is notoriously dense—filled with terms like *basis points, yield curve inversions, quantitative tightening, CapEx ratios, and reverse repo rates*. Non-experts and retail investors often struggle to extract actionable understanding from traditional headlines.

**FinNews AI** bridges this gap:
1. Ingests real-time financial and market news via **NewsAPI**.
2. Simplifies the articles with **Groq's ultra-low latency Llama 3.3 70B** model.
3. Produces a plain-English headline, 2–4 sentence summary, key takeaway, market relevance, and a clickable financial term glossary.
4. Delivers everything through a sleek, responsive, fintech-grade dark-navy dashboard.

---

## 2. Features

- **One-Click "FETCH & SIMPLIFY"**: Automates the full retrieval and LLM summarization pipeline.
- **Llama 3.3 70B Engine**: Runs on Groq's high-speed inference LPUs for near-instant responses.
- **Structured Simplifications**:
  - Jargon-free simple headline
  - 2–4 sentence concise summary
  - Core "Key Takeaway" box
  - Demystified financial terms with interactive definitions
  - Market relevance analysis
  - Original source attribution and direct link
- **Multi-Category Filters**: *Latest, Markets, Business, Economy, Technology, Global*.
- **Search Capabilities**: Filter articles by keywords (e.g., inflation, chips, oil, Fed).
- **Interactive Playground**: Test arbitrary financial paragraphs, SEC filings, or earnings excerpts on demand.
- **Fail-Safe Offline Mode**: Includes curated real-world financial fallbacks so the application runs even if API keys have not yet been configured or rate limits are reached.
- **Financial Compliance Disclaimer**: Explicitly informs users that summaries are educational and not investment advice.

---

## 3. Technology Stack

- **Backend**: Python 3.8+, FastAPI, Uvicorn, Pydantic v2, HTTPX, python-dotenv
- **AI / LLM**: Groq Python SDK (`llama-3.3-70b-versatile` running Llama 3.3 70B)
- **News Provider**: NewsAPI (Top business headlines & keyword search)
- **Frontend**: HTML5, Modern CSS3 (CSS Grid, Flexbox, custom variables), Vanilla JavaScript (ES6+)
- **OS Compatibility**: Windows 10/11, macOS, Linux Ubuntu

---

## 4. Project Directory Structure

```text
finnews-ai/
│
├── backend/
│   ├── __init__.py               # Python package marker
│   ├── main.py                   # FastAPI app, CORS middleware & static serving
│   ├── config.py                 # Configuration and environment variables
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── news.py               # News fetching & simplification endpoints
│   │   └── health.py             # System health check route
│   ├── services/
│   │   ├── __init__.py
│   │   ├── news_service.py       # NewsAPI client & fallback management
│   │   └── groq_service.py       # Groq Llama 3.3 70B prompt orchestration
│   └── models/
│       ├── __init__.py
│       └── schemas.py            # Pydantic data schemas
│
├── frontend/
│   ├── index.html                # Responsive fintech dashboard UI
│   ├── style.css                 # Dark navy theme, glowing cards & animations
│   └── script.js                 # API handler, state management, modal logic
│
├── .env.example                  # Template for API keys
├── .gitignore                    # Git ignore file (prevents key leaks)
├── requirements.txt              # Python package dependencies
├── run.bat                       # One-click Windows starter script
└── README.md                     # Comprehensive documentation
```

---

## 5. Prerequisites

Before running the project, verify that you have:
- **Python**: Version 3.8 or higher (`python --version`)
- **Modern Web Browser**: Google Chrome, Mozilla Firefox, or Microsoft Edge
- **Git** (optional): For version control

---

## 6. How to Obtain API Keys

### Step A: Obtain a Free NewsAPI Key
1. Go to [https://newsapi.org/](https://newsapi.org/).
2. Click **Get API Key** and sign up for a free developer account.
3. Copy your 32-character API key from your account dashboard.

### Step B: Obtain a Free Groq API Key
1. Go to the [Groq Console](https://console.groq.com/keys).
2. Sign in with your Google or GitHub account.
3. Click **Create API Key**.
4. Label it `finnews-ai` and copy the key (starts with `gsk_...`).

---

## 7. Step-by-Step Setup on Windows PowerShell

Open **Windows PowerShell** in the project directory:

### Step 1: Create a Virtual Environment
```powershell
python -m venv venv
```

### Step 2: Activate the Virtual Environment
```powershell
venv\Scripts\activate
```
*(If you see an execution policy error, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned` first)*

### Step 3: Install Required Python Packages
```powershell
pip install -r requirements.txt
```

### Step 4: Configure the Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```
Open `.env` in Notepad or VS Code and replace the placeholders:
```ini
NEWS_API_KEY=your_actual_newsapi_key_here
GROQ_API_KEY=your_actual_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
PORT=8000
DEBUG=True
```

---

## 8. Running the Application

### Option A: Using the Windows Batch File (Easiest)
Double-click `run.bat` or run:
```cmd
.\run.bat
```

### Option B: Running via PowerShell / Terminal
With the virtual environment active:
```powershell
python -m uvicorn backend.main:app --reload
```

You should see:
```text
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

---

## 9. Opening the Frontend

Once the server is running, open your web browser and navigate to:
```text
http://127.0.0.1:8000
```
FastAPI automatically serves the modern `frontend/index.html` dashboard directly at the root!

Alternatively, if you prefer editing frontend files independently, open `frontend/index.html` in your browser or with VS Code Live Server.

---

## 10. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Serves the frontend web dashboard |
| `GET` | `/api/health` | System health check and API key readiness |
| `GET` | `/api/news` | Raw financial articles from NewsAPI |
| `GET` | `/api/news/simplified` | **Primary pipeline**: Fetches news & simplifies via Groq Llama 3.3 70B |
| `POST` | `/api/simplify` | Simplifies arbitrary user-supplied financial text |
| `GET` | `/docs` | Interactive Swagger / OpenAPI documentation |

### Example API Request:
```bash
curl -X GET "http://127.0.0.1:8000/api/news/simplified?category=markets&page_size=3"
```

### Example JSON Response Structure:
```json
{
  "success": true,
  "articles": [
    {
      "id": "art-101",
      "title": "Federal Reserve Pauses Rate Hikes as Everyday Inflation Shows Signs of Cooling Down",
      "original_title": "Federal Reserve Signals Pauses on Benchmark Interest Rate Hikes",
      "summary": "The Federal Reserve has decided to keep interest rates steady. Consumer inflation numbers have started to moderate, so central bankers are waiting to evaluate ongoing economic conditions.",
      "key_takeaway": "Mortgage rates and auto loan interest charges may stabilize instead of climbing higher.",
      "market_relevance": "Directly impacts borrowing costs for everyday consumers and small businesses.",
      "terms": [
        {
          "term": "Interest Rate",
          "explanation": "The cost of borrowing money or the reward for saving it, influenced by the central bank."
        }
      ],
      "source": "Financial Times",
      "published_at": "2026-03-30T14:30:00Z",
      "url": "https://www.ft.com",
      "image_url": "https://...",
      "category": "Markets"
    }
  ],
  "total_results": 1,
  "using_fallback": false
}
```

---

## 11. Testing Each API Endpoint

You can test every endpoint directly using the interactive Swagger UI:
1. Open `http://127.0.0.1:8000/docs` in your browser.
2. Expand `GET /api/health` -> Click **Try it out** -> **Execute**.
3. Expand `GET /api/news/simplified` -> Select category `markets` -> **Execute**.
4. Verify that the response returns HTTP status code `200` and structured articles.

---

## 12. Troubleshooting & Common Errors

| Issue | Cause | Fix |
|---|---|---|
| `'python' is not recognized` | Python not added to PATH | Reinstall Python and check **"Add Python to PATH"** in the installer. |
| `NewsAPI returns 401 Unauthorized` | Invalid or expired NewsAPI key | Double-check `NEWS_API_KEY` in `.env` without extra spaces or quotes. |
| `Groq authentication error (401)` | Invalid Groq key | Verify `GROQ_API_KEY` in `.env` starts with `gsk_`. |
| `NewsAPI 429 Rate Limit` | Free tier limit (100 req/day) | The app automatically switches to curated fallback articles with zero crash. |
| `CORS Error in Browser` | Port mismatch | The backend allows `localhost:3000`, `localhost:8000`, and all dev ports by default. |

---

## 13. Security Considerations

1. **Zero Key Exposure**: `NEWS_API_KEY` and `GROQ_API_KEY` are read strictly on the server and are never delivered to the client browser.
2. **Environment Isolation**: `.env` is listed in `.gitignore` to prevent accidental commits to public repositories.
3. **CORS Restrictions**: In production, modify `ALLOWED_ORIGINS` in `backend/config.py` to only allow your registered domain.
4. **Input Sanitization**: Client inputs are HTML-escaped before DOM insertion to prevent Cross-Site Scripting (XSS).

---

## 14. Preparing for AWS Cloud Deployment

To deploy FinNews AI to AWS:
- **AWS Elastic Beanstalk (PaaS)**:
  - Add a `Procfile`: `web: uvicorn backend.main:app --host 0.0.0.0 --port 5000`
  - Deploy with the AWS EB CLI (`eb init`, `eb create`).
- **AWS App Runner or ECS (Containerized)**:
  - Create a `Dockerfile`:
    ```dockerfile
    FROM python:3.10-slim
    WORKDIR /app
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    COPY . .
    CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
    ```
  - Set `NEWS_API_KEY` and `GROQ_API_KEY` in AWS Parameter Store or AWS Secrets Manager.

---

## 15. Future Roadmap

- 🎧 **Text-to-Speech (TTS)**: Voice playback of simplified summaries for on-the-go commuting.
- 🔔 **Custom Watchlist Alerts**: Real-time notifications for specific stocks or economic metrics.
- 🌐 **Multilingual Translation**: Real-time localization of simplified summaries into Spanish, Hindi, French, and Japanese.
- 📊 **Historical Sentiment Charts**: Visual tracking of whether market sentiment is trending positive, neutral, or cautious.

---

## 16. Disclaimer

*FinNews AI provides simplified financial news for informational and educational purposes only. It does not provide personalized financial, investment, legal, or tax advice.*
