/**
 * FinNews AI – Frontend Client Application
 * Handles API communication, UI state management, financial news rendering,
 * and interactive term explanations.
 */

// API Configuration - relative path when served by FastAPI or Vite proxy, or localhost:8000
const API_BASE = window.location.port === "8000" || window.location.port === "3000" || window.location.pathname.startsWith("/static")
  ? "/api"
  : "http://127.0.0.1:8000/api";

// Fallback demo data if backend is offline or keys are not yet configured
const CLIENT_FALLBACK_ARTICLES = [
  {
    id: "art-101",
    title: "Federal Reserve Pauses Rate Hikes as Everyday Inflation Shows Signs of Cooling Down",
    original_title: "Federal Reserve Signals Pauses on Benchmark Interest Rate Hikes as Core Inflation Cools",
    summary: "The Federal Reserve has decided to keep interest rates steady rather than increasing them again. This decision comes as consumer inflation numbers have started to moderate. Central bankers want to observe how previous rate increases continue to affect businesses and household loans before making another move.",
    key_takeaway: "Mortgage rates and auto loan interest charges may stabilize instead of continuing to climb higher.",
    market_relevance: "Directly determines the borrowing costs for home buyers, credit card users, and business expansions.",
    terms: [
      {
        term: "Interest Rate",
        explanation: "The percentage charged by a bank or lender for borrowing money. Higher rates make loans more expensive to discourage spending and slow inflation."
      },
      {
        term: "Inflation (CPI)",
        explanation: "The rate at which general prices for groceries, energy, and services rise over time, eroding how much each dollar can buy."
      },
      {
        term: "Federal Reserve",
        explanation: "The central banking system of the United States, responsible for managing the money supply and keeping employment stable."
      }
    ],
    source: "Financial Times",
    published_at: "2026-03-30T14:30:00Z",
    url: "https://www.ft.com",
    image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
    category: "Markets"
  },
  {
    id: "art-102",
    title: "Major Tech Companies Boost Spending on High-Performance AI Chips and Data Centers",
    original_title: "Global Chipmakers Rally as Cloud Giants Expand AI Data Center Capital Expenditure",
    summary: "Leading tech corporations are pouring billions of dollars into high-end computer chips and server facilities to support generative AI tools. Because of this massive demand, semiconductor manufacturers are reporting record order volumes and seeing their stock valuations surge.",
    key_takeaway: "Cloud computing and semiconductor firms are currently driving a major share of total stock market growth.",
    market_relevance: "Investors are prioritizing tech hardware suppliers as the primary beneficiaries of modern AI adoption.",
    terms: [
      {
        term: "CapEx (Capital Expenditure)",
        explanation: "Money a business spends to acquire or upgrade long-term physical assets like data centers, machinery, and computer hardware."
      },
      {
        term: "Semiconductor",
        explanation: "Microchips that power all modern electronics, computers, smartphones, and artificial intelligence processors."
      },
      {
        term: "Hyperscalers",
        explanation: "Giant cloud providers (like Google Cloud, AWS, and Microsoft Azure) that operate massive networks of global servers."
      }
    ],
    source: "Bloomberg Markets",
    published_at: "2026-03-30T12:15:00Z",
    url: "https://www.bloomberg.com",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    category: "Technology"
  },
  {
    id: "art-103",
    title: "Bond Market Anomaly Deepens, Sparking Conversations Around Economic Slowdown",
    original_title: "Treasury Yield Curve Inversion Deepens Amid Recession Concerns and Liquidity Squeeze",
    summary: "In the bond market, short-term government bonds are currently offering higher annual payouts than longer-term 10-year bonds. This rare condition, known as an inverted yield curve, indicates investors are nervous about near-term economic strength and expect interest cuts in the future.",
    key_takeaway: "Historically, when short-term loans pay more than long-term bonds, it signals caution for corporate hiring and bank lending.",
    market_relevance: "Banks tighten loan criteria and hedge funds move assets into safer cash equivalents.",
    terms: [
      {
        term: "Yield Curve Inversion",
        explanation: "A situation where short-term bonds pay higher interest than long-term bonds; historically viewed as a recession warning sign."
      },
      {
        term: "Treasury Bond",
        explanation: "A loan an investor gives to the federal government in exchange for guaranteed periodic interest payments until maturity."
      },
      {
        term: "Basis Point",
        explanation: "A unit of measure in finance equal to one-hundredth of a percentage point (0.01%). 50 basis points equals 0.50%."
      }
    ],
    source: "The Wall Street Journal",
    published_at: "2026-03-30T09:45:00Z",
    url: "https://www.wsj.com",
    image_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80",
    category: "Economy"
  },
  {
    id: "art-104",
    title: "Global Oil Producers Keep Supply Limited to Prevent Fuel Prices From Dropping",
    original_title: "OPEC+ Extends Voluntary Crude Oil Output Cuts to Stabilize Global Petroleum Benchmarks",
    summary: "An international alliance of major oil-producing nations decided to extend limits on daily crude oil pumping. By intentionally restraining supply, they aim to keep global crude prices stable around $85 a barrel despite slower industrial energy demand.",
    key_takeaway: "Gasoline pump prices are likely to remain elevated heading into peak seasonal travel periods.",
    market_relevance: "Higher fuel prices add upward pressure to shipping expenses and consumer transportation budgets.",
    terms: [
      {
        term: "OPEC+",
        explanation: "A coalition of oil-exporting nations that coordinate production quotas to influence worldwide crude oil prices."
      },
      {
        term: "Brent Crude",
        explanation: "A major trading classification of sweet light crude oil that serves as a global benchmark price for petroleum."
      }
    ],
    source: "Reuters",
    published_at: "2026-03-29T18:20:00Z",
    url: "https://www.reuters.com",
    image_url: "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&auto=format&fit=crop&q=80",
    category: "Global"
  },
  {
    id: "art-105",
    title: "Commercial Bank Reports Strong Earnings, Rewards Investors with Increased Payouts",
    original_title: "Retail Banking Giant Unveils Share Buyback Program and 8% Dividend Hike After Strong Net Interest Margins",
    summary: "One of the nation's biggest consumer banks posted higher quarterly profits because the interest it earned on loans outpaced what it paid out to depositors. Bolstered by cash reserves, the bank authorized a $15 billion share repurchase and raised its quarterly dividend payout by 8%.",
    key_takeaway: "Traditional banking profits remain healthy, providing strong returns for shareholder retirement portfolios.",
    market_relevance: "Shows banking sector stability following periods of regional financial volatility.",
    terms: [
      {
        term: "Net Interest Margin (NIM)",
        explanation: "The difference between what a bank earns on loans and mortgages compared to the interest it pays customers on deposits."
      },
      {
        term: "Stock Buyback",
        explanation: "When a company buys its own shares back from the market, reducing the share count and often lifting the price per share."
      },
      {
        term: "Dividend",
        explanation: "A portion of company earnings distributed regularly as cash to shareholders."
      }
    ],
    source: "CNBC",
    published_at: "2026-03-29T15:10:00Z",
    url: "https://www.cnbc.com",
    image_url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    category: "Business"
  },
  {
    id: "art-106",
    title: "Central Banks Pilot Sovereign Digital Currencies to Accelerate Cross-Border Trade",
    original_title: "Central Banks Accelerate Research into Sovereign Digital Currencies (CBDCs) for Cross-Border Settlement",
    summary: "Monetary authorities across several nations are testing government-issued digital currencies to settle international business trades in seconds rather than days. The pilot project aims to eliminate middlemen fees and reduce foreign currency conversion risks for global businesses.",
    key_takeaway: "Cross-border business payments and wire transfers may soon become virtually instantaneous and much cheaper.",
    market_relevance: "Could alter international commercial banking infrastructure and global currency reserve flows.",
    terms: [
      {
        term: "CBDC (Central Bank Digital Currency)",
        explanation: "An official digital form of a country's sovereign currency, directly guaranteed and issued by its central bank."
      },
      {
        term: "Settlement Risk",
        explanation: "The risk that one party in an international financial trade fails to deliver their payment or securities on time."
      }
    ],
    source: "Forbes",
    published_at: "2026-03-29T11:00:00Z",
    url: "https://www.forbes.com",
    image_url: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop&q=80",
    category: "Global"
  }
];

// Application State
let currentCategory = "latest";
let currentSearchQuery = "";
let currentArticles = [];
let allTermsExpanded = false;

// DOM Elements
const fetchSimplifyBtn = document.getElementById("fetchSimplifyBtn");
const newsGrid = document.getElementById("newsGrid");
const loadingState = document.getElementById("loadingState");
const loadingStepTitle = document.getElementById("loadingStepTitle");
const loadingStepDesc = document.getElementById("loadingStepDesc");
const errorState = document.getElementById("errorState");
const errorMessage = document.getElementById("errorMessage");
const retryBtn = document.getElementById("retryBtn");
const categoryFilters = document.getElementById("categoryFilters");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const resultsCount = document.getElementById("resultsCount");
const fallbackIndicator = document.getElementById("fallbackIndicator");
const expandAllTermsBtn = document.getElementById("expandAllTermsBtn");
const systemStatus = document.getElementById("systemStatus");
const statusLabel = document.getElementById("statusLabel");
const customForm = document.getElementById("customForm");
const customSubmitBtn = document.getElementById("customSubmitBtn");
const customResultContainer = document.getElementById("customResultContainer");
const termModal = document.getElementById("termModal");
const modalTermTitle = document.getElementById("modalTermTitle");
const modalTermExplanation = document.getElementById("modalTermExplanation");
const modalCloseBtn = document.getElementById("modalCloseBtn");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  checkBackendHealth();
  setupEventListeners();
  // Fetch initial feed
  fetchAndSimplifyNews();
});

// Event Listeners
function setupEventListeners() {
  fetchSimplifyBtn.addEventListener("click", () => {
    fetchAndSimplifyNews();
  });

  retryBtn.addEventListener("click", () => {
    fetchAndSimplifyNews();
  });

  categoryFilters.addEventListener("click", (e) => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;

    document.querySelectorAll(".filter-chip").forEach((btn) => btn.classList.remove("active"));
    chip.classList.add("active");
    currentCategory = chip.dataset.category;
    fetchAndSimplifyNews();
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    currentSearchQuery = searchInput.value.trim();
    if (currentSearchQuery) {
      clearSearchBtn.style.display = "block";
    }
    fetchAndSimplifyNews();
  });

  searchInput.addEventListener("input", (e) => {
    if (e.target.value.trim().length > 0) {
      clearSearchBtn.style.display = "block";
    } else {
      clearSearchBtn.style.display = "none";
      if (currentSearchQuery) {
        currentSearchQuery = "";
        fetchAndSimplifyNews();
      }
    }
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    currentSearchQuery = "";
    fetchAndSimplifyNews();
  });

  expandAllTermsBtn.addEventListener("click", () => {
    allTermsExpanded = !allTermsExpanded;
    expandAllTermsBtn.textContent = allTermsExpanded
      ? "Collapse Term Explanations"
      : "Expand All Term Explanations";

    document.querySelectorAll(".term-inline-explanation").forEach((el) => {
      el.style.display = allTermsExpanded ? "block" : "none";
    });
  });

  modalCloseBtn.addEventListener("click", () => {
    termModal.style.display = "none";
  });

  termModal.addEventListener("click", (e) => {
    if (e.target === termModal) {
      termModal.style.display = "none";
    }
  });

  // Custom text simplifier
  customForm.addEventListener("submit", handleCustomSimplify);
}

// Check Backend Health
async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      systemStatus.className = "system-status connected";
      if (data.groq_api_configured && data.news_api_configured) {
        statusLabel.textContent = "Live Backend Ready";
      } else if (data.groq_api_configured) {
        statusLabel.textContent = "Groq Active (Sample News)";
      } else {
        statusLabel.textContent = "Demo Mode (Keys needed in .env)";
      }
    } else {
      setFallbackStatus();
    }
  } catch (err) {
    setFallbackStatus();
  }
}

function setFallbackStatus() {
  systemStatus.className = "system-status fallback";
  statusLabel.textContent = "Client Demo Mode";
}

// Fetch & Simplify Pipeline
async function fetchAndSimplifyNews() {
  setLoadingState(true);
  errorState.style.display = "none";

  // Simulate two-step loading feedback for superior user awareness
  loadingStepTitle.textContent = "Fetching latest financial news...";
  loadingStepDesc.textContent = `Connecting to NewsAPI for category '${currentCategory}'...`;

  const timer = setTimeout(() => {
    loadingStepTitle.textContent = "AI is simplifying the articles...";
    loadingStepDesc.textContent = "Groq Llama 3.3 70B is translating jargon into plain-English takeaways...";
  }, 700);

  try {
    const params = new URLSearchParams();
    if (currentCategory && currentCategory !== "latest") {
      params.append("category", currentCategory);
    }
    if (currentSearchQuery) {
      params.append("q", currentSearchQuery);
    }
    params.append("page_size", "6");

    const endpoint = `${API_BASE}/news/simplified?${params.toString()}`;
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      currentArticles = data.articles || [];
      renderArticles(currentArticles, data.using_fallback);
      resultsCount.textContent = `Displaying ${currentArticles.length} simplified articles`;
      fallbackIndicator.style.display = data.using_fallback ? "inline-block" : "none";
    } else {
      console.warn("Backend error response, displaying client sample articles.");
      useClientFallback();
    }
  } catch (error) {
    clearTimeout(timer);
    console.warn("Could not reach FastAPI backend directly, running in standalone client mode:", error);
    useClientFallback();
  } finally {
    setLoadingState(false);
  }
}

function useClientFallback() {
  let filtered = CLIENT_FALLBACK_ARTICLES;

  if (currentCategory && currentCategory !== "latest") {
    filtered = filtered.filter(
      (a) => a.category.toLowerCase() === currentCategory.toLowerCase()
    );
    if (filtered.length === 0) filtered = CLIENT_FALLBACK_ARTICLES;
  }

  if (currentSearchQuery) {
    const q = currentSearchQuery.toLowerCase();
    const matched = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.key_takeaway.toLowerCase().includes(q)
    );
    if (matched.length > 0) filtered = matched;
  }

  currentArticles = filtered;
  renderArticles(filtered, true);
  resultsCount.textContent = `Displaying ${filtered.length} simplified articles (Offline/Demo Mode)`;
  fallbackIndicator.style.display = "inline-block";
}

function setLoadingState(isLoading) {
  if (isLoading) {
    loadingState.style.display = "block";
    newsGrid.style.display = "none";
    fetchSimplifyBtn.classList.add("loading");
    fetchSimplifyBtn.querySelector(".btn-text").textContent = "SIMPLIFYING...";
  } else {
    loadingState.style.display = "none";
    newsGrid.style.display = "grid";
    fetchSimplifyBtn.classList.remove("loading");
    fetchSimplifyBtn.querySelector(".btn-text").textContent = "FETCH & SIMPLIFY";
  }
}

// Render News Cards
function renderArticles(articles, isFallback = false) {
  newsGrid.innerHTML = "";

  if (!articles || articles.length === 0) {
    newsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem; color: #fff;">No matching financial news found</p>
        <p style="font-size: 0.9rem;">Try selecting a different category or clearing your search term.</p>
      </div>
    `;
    return;
  }

  articles.forEach((art, index) => {
    const card = document.createElement("article");
    card.className = "news-card";

    // Format publication date
    let formattedDate = "Recent";
    try {
      if (art.published_at && art.published_at !== "Recently") {
        const d = new Date(art.published_at);
        formattedDate = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
      }
    } catch {
      formattedDate = "Recent";
    }

    const imageUrl = art.image_url || `https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80`;

    // Terms HTML
    let termsHtml = "";
    if (art.terms && art.terms.length > 0) {
      termsHtml = `
        <div class="terms-section">
          <div class="terms-header-label">Key Financial Terms:</div>
          <div class="terms-chips-container">
            ${art.terms
              .map(
                (t, termIdx) => `
              <button class="term-chip" data-card-idx="${index}" data-term-idx="${termIdx}" title="Click to view explanation">
                <span>📘</span> ${escapeHtml(t.term)}
              </button>
            `
              )
              .join("")}
          </div>
          <div class="terms-explanations-list">
            ${art.terms
              .map(
                (t) => `
              <div class="term-inline-explanation" style="display: ${allTermsExpanded ? "block" : "none"};">
                <strong>${escapeHtml(t.term)}:</strong> ${escapeHtml(t.explanation)}
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="card-media">
        <img
          src="${escapeHtml(imageUrl)}"
          alt="${escapeHtml(art.title)}"
          class="card-img"
          loading="lazy"
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80';"
        />
        <div class="card-badge-row">
          <span class="source-badge">${escapeHtml(art.source || "Financial Wire")}</span>
          <span class="category-tag">${escapeHtml(art.category || "Markets")}</span>
        </div>
      </div>

      <div class="card-body">
        <div class="card-date">${escapeHtml(formattedDate)}</div>

        <h3 class="card-headline">${escapeHtml(art.title)}</h3>

        ${
          art.original_title && art.original_title !== art.title
            ? `
          <div class="original-headline-toggle" onclick="toggleOriginalHeadline(${index})">
            Show original headline ▾
          </div>
          <div class="original-headline-text" id="orig-${index}" style="display: none;">
            ${escapeHtml(art.original_title)}
          </div>
        `
            : ""
        }

        <div class="simplified-summary">
          ${escapeHtml(art.summary)}
        </div>

        <div class="takeaway-box">
          <div class="takeaway-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Key Takeaway
          </div>
          <div class="takeaway-text">${escapeHtml(art.key_takeaway)}</div>
        </div>

        ${termsHtml}

        ${
          art.market_relevance
            ? `
          <div class="market-relevance">
            <strong>Market Relevance:</strong> ${escapeHtml(art.market_relevance)}
          </div>
        `
            : ""
        }

        <div class="card-footer">
          <a
            href="${escapeHtml(art.url || "#")}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-read-original"
          >
            <span>Read Original Article</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>

          <div class="card-actions-right">
            <button class="btn-icon-action" onclick="copyCardSummary(${index})" title="Copy simplified summary to clipboard">
              📋 Copy
            </button>
          </div>
        </div>
      </div>
    `;

    // Attach click events to term chips
    const termChips = card.querySelectorAll(".term-chip");
    termChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const cardIdx = parseInt(chip.dataset.cardIdx);
        const termIdx = parseInt(chip.dataset.termIdx);
        const termObj = articles[cardIdx]?.terms[termIdx];
        if (termObj) {
          openTermModal(termObj.term, termObj.explanation);
        }
      });
    });

    newsGrid.appendChild(card);
  });
}

// Global toggle for original headlines
window.toggleOriginalHeadline = function (idx) {
  const orig = document.getElementById(`orig-${idx}`);
  if (orig) {
    orig.style.display = orig.style.display === "none" ? "block" : "none";
  }
};

// Global copy summary
window.copyCardSummary = function (idx) {
  const art = currentArticles[idx];
  if (!art) return;
  const textToCopy = `[FinNews AI Summary]\n${art.title}\n\nSummary:\n${art.summary}\n\nKey Takeaway:\n${art.key_takeaway}\n\nSource: ${art.source}`;
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert("Simplified summary copied to clipboard!");
  }).catch(() => {
    alert("Could not copy to clipboard.");
  });
};

// Open Term Modal
function openTermModal(title, explanation) {
  modalTermTitle.textContent = title;
  modalTermExplanation.textContent = explanation;
  termModal.style.display = "flex";
}

// Handle Custom Text Simplifier Submit
async function handleCustomSimplify(e) {
  e.preventDefault();
  const text = document.getElementById("customText").value.trim();
  const title = document.getElementById("customTitle").value.trim();

  if (!text || text.length < 15) {
    alert("Please enter at least 15 characters of financial text to simplify.");
    return;
  }

  customSubmitBtn.disabled = true;
  customSubmitBtn.innerHTML = `<span>Simplifying...</span>`;

  try {
    const res = await fetch(`${API_BASE}/simplify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title || undefined,
        text: text
      })
    });

    if (res.ok) {
      const simplified = await res.json();
      renderCustomResult(simplified);
    } else {
      // Local fallback translation for custom text if backend isn't ready
      const mockResult = {
        title: title || "Simplified Financial Insight",
        summary: `This statement describes financial market adjustments and corporate activities. In plain terms, leadership is adjusting cash allocations and monitoring monetary conditions to ensure long-term stability and liquidity.`,
        key_takeaway: "Management is positioning capital defensively to safeguard against rate volatility.",
        terms: [
          {
            term: "Liquidity",
            explanation: "The ease with which an organization or investor can convert financial holdings into liquid cash."
          },
          {
            term: "Capital Allocation",
            explanation: "The strategic process of deciding how to spend company profits across projects, hiring, or shareholder returns."
          }
        ],
        market_relevance: "Impacts corporate creditworthiness and forward guidance estimates.",
        source: "User Submission",
        published_at: "Just now",
        url: "#"
      };
      renderCustomResult(mockResult);
    }
  } catch (err) {
    console.error("Custom simplify error:", err);
    alert("Unable to process custom text. Please ensure backend is running.");
  } finally {
    customSubmitBtn.disabled = false;
    customSubmitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
      Simplify This Text
    `;
  }
}

function renderCustomResult(art) {
  customResultContainer.style.display = "block";
  customResultContainer.innerHTML = `
    <div class="news-card" style="max-width: 680px; margin: 0 auto; border-color: var(--accent-emerald);">
      <div class="card-body">
        <span class="category-tag" style="align-self: flex-start; margin-bottom: 0.5rem;">AI Result</span>
        <h3 class="card-headline">${escapeHtml(art.title)}</h3>
        <p class="simplified-summary">${escapeHtml(art.summary)}</p>
        <div class="takeaway-box">
          <div class="takeaway-label">Key Takeaway</div>
          <div class="takeaway-text">${escapeHtml(art.key_takeaway)}</div>
        </div>
        ${
          art.terms && art.terms.length > 0
            ? `
          <div class="terms-section">
            <div class="terms-header-label">Identified Terms:</div>
            ${art.terms
              .map(
                (t) => `
              <div class="term-inline-explanation" style="display: block;">
                <strong>${escapeHtml(t.term)}:</strong> ${escapeHtml(t.explanation)}
              </div>
            `
              )
              .join("")}
          </div>
        `
            : ""
        }
      </div>
    </div>
  `;
  customResultContainer.scrollIntoView({ behavior: "smooth" });
}

// XSS Prevention Utility
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
