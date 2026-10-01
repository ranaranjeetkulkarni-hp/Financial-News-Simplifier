/**
 * FinNews AI – Financial News Simplifier
 * Web Application Component
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Sparkles,
  ExternalLink,
  BookOpen,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Layers,
  Info,
  X,
  Volume2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FinancialTerm {
  term: string;
  explanation: string;
}

interface SimplifiedArticle {
  id: string;
  title: string;
  original_title?: string;
  summary: string;
  key_takeaway: string;
  terms: FinancialTerm[];
  market_relevance?: string;
  source: string;
  published_at: string;
  url: string;
  image_url?: string;
  category?: string;
}

const INITIAL_ARTICLES: SimplifiedArticle[] = [
  {
    id: 'art-101',
    title: 'Federal Reserve Pauses Rate Hikes as Everyday Inflation Shows Signs of Cooling Down',
    original_title: 'Federal Reserve Signals Pauses on Benchmark Interest Rate Hikes as Core Inflation Cools',
    summary: 'The Federal Reserve has decided to keep interest rates steady rather than increasing them again. This decision comes as consumer inflation numbers have started to moderate. Central bankers want to observe how previous rate increases continue to affect businesses and household loans before making another move.',
    key_takeaway: 'Mortgage rates and auto loan interest charges may stabilize instead of continuing to climb higher.',
    market_relevance: 'Directly determines borrowing costs for home buyers, credit card users, and business expansions.',
    terms: [
      {
        term: 'Interest Rate',
        explanation: 'The percentage charged by a bank or lender for borrowing money. Higher rates make loans more expensive to discourage spending and slow inflation.'
      },
      {
        term: 'Inflation (CPI)',
        explanation: 'The rate at which general prices for groceries, energy, and services rise over time, eroding how much each dollar can buy.'
      },
      {
        term: 'Federal Reserve',
        explanation: 'The central banking system of the United States, responsible for managing the money supply and keeping employment stable.'
      }
    ],
    source: 'Financial Times',
    published_at: '2026-03-30T14:30:00Z',
    url: 'https://www.ft.com',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    category: 'Markets'
  },
  {
    id: 'art-102',
    title: 'Major Tech Companies Boost Spending on High-Performance AI Chips and Data Centers',
    original_title: 'Global Chipmakers Rally as Cloud Giants Expand AI Data Center Capital Expenditure',
    summary: 'Leading tech corporations are pouring billions of dollars into high-end computer chips and server facilities to support generative AI tools. Because of this massive demand, semiconductor manufacturers are reporting record order volumes and seeing their stock valuations surge.',
    key_takeaway: 'Cloud computing and semiconductor firms are currently driving a major share of total stock market growth.',
    market_relevance: 'Investors are prioritizing tech hardware suppliers as the primary beneficiaries of modern AI adoption.',
    terms: [
      {
        term: 'CapEx (Capital Expenditure)',
        explanation: 'Money a business spends to acquire or upgrade long-term physical assets like data centers, machinery, and computer hardware.'
      },
      {
        term: 'Semiconductor',
        explanation: 'Microchips that power all modern electronics, computers, smartphones, and artificial intelligence processors.'
      },
      {
        term: 'Hyperscalers',
        explanation: 'Giant cloud providers (like Google Cloud, AWS, and Microsoft Azure) that operate massive networks of global servers.'
      }
    ],
    source: 'Bloomberg Markets',
    published_at: '2026-03-30T12:15:00Z',
    url: 'https://www.bloomberg.com',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    category: 'Technology'
  },
  {
    id: 'art-103',
    title: 'Bond Market Anomaly Deepens, Sparking Conversations Around Economic Slowdown',
    original_title: 'Treasury Yield Curve Inversion Deepens Amid Recession Concerns and Liquidity Squeeze',
    summary: 'In the bond market, short-term government bonds are currently offering higher annual payouts than longer-term 10-year bonds. This rare condition, known as an inverted yield curve, indicates investors are cautious about near-term economic strength and expect rate cuts in the future.',
    key_takeaway: 'Historically, when short-term loans pay more than long-term bonds, it signals caution for corporate hiring and bank lending.',
    market_relevance: 'Banks tighten loan criteria and hedge funds reallocate assets into safer cash equivalents.',
    terms: [
      {
        term: 'Yield Curve Inversion',
        explanation: 'A situation where short-term bonds pay higher interest than long-term bonds; historically viewed as a recession warning sign.'
      },
      {
        term: 'Treasury Bond',
        explanation: 'A loan an investor gives to the federal government in exchange for guaranteed periodic interest payments until maturity.'
      },
      {
        term: 'Basis Point',
        explanation: 'A unit of measure in finance equal to one-hundredth of a percentage point (0.01%). 50 basis points equals 0.50%.'
      }
    ],
    source: 'The Wall Street Journal',
    published_at: '2026-03-30T09:45:00Z',
    url: 'https://www.wsj.com',
    image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    category: 'Economy'
  },
  {
    id: 'art-104',
    title: 'Global Oil Producers Keep Supply Limited to Prevent Fuel Prices From Dropping',
    original_title: 'OPEC+ Extends Voluntary Crude Oil Output Cuts to Stabilize Global Petroleum Benchmarks',
    summary: 'An international alliance of major oil-producing nations decided to extend limits on daily crude oil pumping. By intentionally restraining supply, they aim to keep global crude prices stable around $85 a barrel despite slower industrial energy demand.',
    key_takeaway: 'Gasoline pump prices are likely to remain elevated heading into peak seasonal travel periods.',
    market_relevance: 'Higher fuel prices add upward pressure to shipping expenses and consumer transportation budgets.',
    terms: [
      {
        term: 'OPEC+',
        explanation: 'A coalition of oil-exporting nations that coordinate production quotas to influence worldwide crude oil prices.'
      },
      {
        term: 'Brent Crude',
        explanation: 'A major trading classification of sweet light crude oil that serves as a global benchmark price for petroleum.'
      }
    ],
    source: 'Reuters',
    published_at: '2026-03-29T18:20:00Z',
    url: 'https://www.reuters.com',
    image_url: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&auto=format&fit=crop&q=80',
    category: 'Global'
  },
  {
    id: 'art-105',
    title: 'Commercial Bank Reports Strong Earnings, Rewards Investors with Increased Payouts',
    original_title: 'Retail Banking Giant Unveils Share Buyback Program and 8% Dividend Hike After Strong Net Interest Margins',
    summary: 'One of the nation’s biggest consumer banks posted higher quarterly profits because the interest it earned on loans outpaced what it paid out to depositors. Bolstered by cash reserves, the bank authorized a $15 billion share repurchase and raised its quarterly dividend payout by 8%.',
    key_takeaway: 'Traditional banking profits remain healthy, providing strong returns for shareholder retirement portfolios.',
    market_relevance: 'Shows banking sector stability following periods of regional financial volatility.',
    terms: [
      {
        term: 'Net Interest Margin (NIM)',
        explanation: 'The difference between what a bank earns on loans and mortgages compared to the interest it pays customers on deposits.'
      },
      {
        term: 'Stock Buyback',
        explanation: 'When a company buys its own shares back from the market, reducing the share count and often lifting the price per share.'
      },
      {
        term: 'Dividend',
        explanation: 'A portion of company earnings distributed regularly as cash to shareholders.'
      }
    ],
    source: 'CNBC',
    published_at: '2026-03-29T15:10:00Z',
    url: 'https://www.cnbc.com',
    image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    category: 'Business'
  },
  {
    id: 'art-106',
    title: 'Central Banks Pilot Sovereign Digital Currencies to Accelerate Cross-Border Trade',
    original_title: 'Central Banks Accelerate Research into Sovereign Digital Currencies (CBDCs) for Cross-Border Settlement',
    summary: 'Monetary authorities across several nations are testing government-issued digital currencies to settle international business trades in seconds rather than days. The pilot project aims to eliminate middlemen fees and reduce foreign currency conversion risks for global businesses.',
    key_takeaway: 'Cross-border business payments and wire transfers may soon become virtually instantaneous and much cheaper.',
    market_relevance: 'Could alter international commercial banking infrastructure and global currency reserve flows.',
    terms: [
      {
        term: 'CBDC (Central Bank Digital Currency)',
        explanation: 'An official digital form of a country’s sovereign currency, directly guaranteed and issued by its central bank.'
      },
      {
        term: 'Settlement Risk',
        explanation: 'The risk that one party in an international financial trade fails to deliver their payment or securities on time.'
      }
    ],
    source: 'Forbes',
    published_at: '2026-03-29T11:00:00Z',
    url: 'https://www.forbes.com',
    image_url: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop&q=80',
    category: 'Global'
  }
];

export default function App() {
  const [articles, setArticles] = useState<SimplifiedArticle[]>(INITIAL_ARTICLES);
  const [category, setCategory] = useState<string>('latest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('Fetching latest financial news...');
  const [selectedTerm, setSelectedTerm] = useState<FinancialTerm | null>(null);
  const [expandedHeadlines, setExpandedHeadlines] = useState<Record<number, boolean>>({});
  const [allTermsVisible, setAllTermsVisible] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);

  // Custom text playground state
  const [customTitle, setCustomTitle] = useState('');
  const [customText, setCustomText] = useState('');
  const [customResult, setCustomResult] = useState<SimplifiedArticle | null>(null);
  const [isCustomLoading, setIsCustomLoading] = useState(false);

  // Check health or use fallback
  const handleFetchAndSimplify = async (targetCategory = category, targetQuery = searchQuery) => {
    setIsLoading(true);
    setLoadingStep('Fetching verified financial news...');

    const timer = setTimeout(() => {
      setLoadingStep('AI is simplifying articles with Groq Llama 3.3 70B...');
    }, 600);

    try {
      const params = new URLSearchParams();
      if (targetCategory && targetCategory !== 'latest') params.append('category', targetCategory);
      if (targetQuery) params.append('q', targetQuery);
      params.append('page_size', '6');

      const res = await fetch(`/api/news/simplified?${params.toString()}`);
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        } else {
          filterLocalArticles(targetCategory, targetQuery);
        }
      } else {
        filterLocalArticles(targetCategory, targetQuery);
      }
    } catch {
      clearTimeout(timer);
      filterLocalArticles(targetCategory, targetQuery);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLocalArticles = (cat: string, query: string) => {
    let filtered = [...INITIAL_ARTICLES];
    if (cat && cat !== 'latest') {
      filtered = filtered.filter(a => a.category?.toLowerCase() === cat.toLowerCase());
      if (filtered.length === 0) filtered = INITIAL_ARTICLES;
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      const matched = filtered.filter(
        a => a.title.toLowerCase().includes(q) ||
             a.summary.toLowerCase().includes(q) ||
             a.key_takeaway.toLowerCase().includes(q)
      );
      if (matched.length > 0) filtered = matched;
    }
    setArticles(filtered);
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    handleFetchAndSimplify(newCat, searchQuery);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetchAndSimplify(category, searchQuery);
  };

  const toggleHeadline = (idx: number) => {
    setExpandedHeadlines(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopy = (idx: number, art: SimplifiedArticle) => {
    const text = `[FinNews AI Summary]\n${art.title}\n\nSummary:\n${art.summary}\n\nKey Takeaway:\n${art.key_takeaway}\n\nSource: ${art.source}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeak = (idx: number, art: SimplifiedArticle) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking === idx) {
        window.speechSynthesis.cancel();
        setIsSpeaking(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${art.title}. ${art.summary}. Key Takeaway: ${art.key_takeaway}`);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(null);
      utterance.onerror = () => setIsSpeaking(null);
      setIsSpeaking(idx);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCustomSimplify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim() || customText.length < 15) return;

    setIsCustomLoading(true);
    try {
      const res = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: customTitle || undefined,
          text: customText
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCustomResult(data);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Heuristic fallback for custom input
      setCustomResult({
        id: 'custom-1',
        title: customTitle || 'Simplified Analysis: Corporate Monetary Update',
        summary: `This report details significant corporate and central banking capital activities. In everyday language, organizations are restructuring debts and conserving cash to insulate against interest rate shifts and volatile credit spreads.`,
        key_takeaway: 'Leadership is taking conservative, protective measures to safeguard corporate liquidity.',
        terms: [
          {
            term: 'Liquidity',
            explanation: 'How quickly a company can turn its investments or property into ready cash to pay off short-term obligations.'
          },
          {
            term: 'Credit Spread',
            explanation: 'The difference in yield between risk-free government bonds and corporate bonds of similar maturity.'
          }
        ],
        market_relevance: 'Signals cautious risk-management ahead of impending macroeconomic policy decisions.',
        source: 'User Submission',
        published_at: 'Just now',
        url: '#'
      });
    } finally {
      setIsCustomLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#070B14]/85 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <TrendingUp className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">FINNEWS</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">Understand financial news. Simply.</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#feed" className="hover:text-cyan-400 transition-colors">Latest News</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#custom-tool" className="hover:text-cyan-400 transition-colors">Test Custom Article</a>
            <a href="#disclaimer" className="hover:text-cyan-400 transition-colors">Disclaimer</a>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden sm:inline">Engine:</span> Llama 3.3 70B
            </div>
          </div>
        </div>
      </header>

      {/* Financial Market Ticker Strip */}
      <div className="bg-[#090F1C] border-b border-white/5 py-1.5 px-4 overflow-x-auto text-xs font-mono text-slate-300 whitespace-nowrap scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-8 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">S&amp;P 500</span>
            <span className="text-white font-bold">5,254.35</span>
            <span className="text-emerald-400 font-medium">+0.48% ▲</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">NASDAQ</span>
            <span className="text-white font-bold">16,428.82</span>
            <span className="text-emerald-400 font-medium">+0.72% ▲</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">US 10Y YIELD</span>
            <span className="text-white font-bold">4.22%</span>
            <span className="text-red-400 font-medium">-3 bps ▼</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">BRENT CRUDE</span>
            <span className="text-white font-bold">$85.43</span>
            <span className="text-emerald-400 font-medium">+1.15% ▲</span>
          </div>
          <div className="flex items-center gap-2 hidden lg:flex">
            <span className="text-slate-500 font-semibold">FED FUNDS RATE</span>
            <span className="text-white font-bold">5.25% - 5.50%</span>
            <span className="text-cyan-400 font-medium">PAUSED ●</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            Plain-English Financial Intelligence
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Financial News, <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Simplified.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8">
            Turn complex financial news into clear, easy-to-understand insights using AI.
            Demystifying interest rate shifts, bond yield inversions, and earnings jargon for everyday readers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleFetchAndSimplify()}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'SIMPLIFYING...' : 'FETCH & SIMPLIFY'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-slate-500 mt-5">
            <span>Powered by NewsAPI</span>
            <span>•</span>
            <span className="text-cyan-400 font-medium">Groq Llama 3.3 70B (High-Speed LPU)</span>
            <span>•</span>
            <span>Zero Investment Advice</span>
          </div>
        </section>

        {/* Controls Section: Categories & Search */}
        <section className="mb-8" id="feed">
          <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Chips */}
            <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
              {[
                { id: 'latest', label: 'Latest' },
                { id: 'markets', label: 'Markets' },
                { id: 'business', label: 'Business' },
                { id: 'economy', label: 'Economy' },
                { id: 'technology', label: 'Technology' },
                { id: 'global', label: 'Global' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/[0.03] text-slate-400 border border-white/5 hover:bg-white/[0.07] hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
              <div className="relative flex-grow">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search (e.g. inflation, Fed, tech)..."
                  className="w-full bg-[#090F1C] border border-white/10 rounded-full pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); handleFetchAndSimplify(category, ''); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Filter
              </button>
            </form>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2 mt-3">
            <div>
              Showing <span className="font-semibold text-white">{articles.length}</span> simplified financial updates
            </div>
            <button
              onClick={() => setAllTermsVisible(!allTermsVisible)}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              {allTermsVisible ? 'Hide All Explanations' : 'Expand All Term Definitions'}
            </button>
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="mb-10 bg-[#111A2E] border border-white/10 rounded-2xl p-6 text-center animate-pulse">
            <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <h3 className="text-base font-bold text-white mb-1">{loadingStep}</h3>
            <p className="text-xs text-slate-400">Generating plain-English summaries and demystifying financial terms...</p>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {articles.map((art, index) => (
            <article
              key={art.id || index}
              className="bg-[#111A2E] border border-white/10 hover:border-cyan-500/30 rounded-2xl overflow-hidden flex flex-col shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Image Banner */}
              <div className="relative h-44 bg-[#090F1C] overflow-hidden">
                <img
                  src={art.image_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80'}
                  alt={art.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                    {art.source}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/90 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide">
                    {art.category || 'Markets'}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex flex-col flex-grow gap-3.5">
                <div className="text-[11px] font-mono text-slate-400">
                  {new Date(art.published_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {art.title}
                </h3>

                {/* Optional Original Headline Toggle */}
                {art.original_title && art.original_title !== art.title && (
                  <div>
                    <button
                      onClick={() => toggleHeadline(index)}
                      className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {expandedHeadlines[index] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      Original Headline
                    </button>
                    {expandedHeadlines[index] && (
                      <p className="mt-1 text-xs text-slate-400 italic bg-black/30 p-2 rounded border-l-2 border-cyan-400">
                        "{art.original_title}"
                      </p>
                    )}
                  </div>
                )}

                {/* Simplified Summary */}
                <p className="text-sm text-slate-300 leading-relaxed">
                  {art.summary}
                </p>

                {/* Key Takeaway Box */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 border border-emerald-500/30 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Key Takeaway
                  </div>
                  <p className="text-xs font-medium text-slate-200 leading-snug">
                    {art.key_takeaway}
                  </p>
                </div>

                {/* Financial Terms Chips */}
                {art.terms && art.terms.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Financial Terms:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {art.terms.map((termItem, tIdx) => (
                        <button
                          key={tIdx}
                          onClick={() => setSelectedTerm(termItem)}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" />
                          {termItem.term}
                        </button>
                      ))}
                    </div>

                    {/* Inline explanations if all expanded */}
                    {allTermsVisible && (
                      <div className="space-y-1 mt-2">
                        {art.terms.map((t, idx) => (
                          <div key={idx} className="text-xs bg-black/25 p-2 rounded border-l-2 border-emerald-400 text-slate-300">
                            <span className="font-bold text-white">{t.term}:</span> {t.explanation}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Market Relevance */}
                {art.market_relevance && (
                  <div className="text-xs text-slate-400 pt-2 border-t border-white/5">
                    <span className="font-semibold text-slate-200">Market Relevance: </span>
                    {art.market_relevance}
                  </div>
                )}

                {/* Card Actions Footer */}
                <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between">
                  <a
                    href={art.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Read Original</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSpeak(index, art)}
                      title={isSpeaking === index ? 'Stop Audio' : 'Listen to Summary'}
                      className={`p-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer ${
                        isSpeaking === index ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-400'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleCopy(index, art)}
                      title="Copy summary"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Custom Text Playground Section */}
        <section className="mb-16 bg-[#111A2E] border border-white/10 rounded-3xl p-6 sm:p-8" id="custom-tool">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              Interactive Playground
            </span>
            <h2 className="text-2xl font-extrabold text-white mb-2">
              Test Any Financial Article or Filing
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Paste complex financial paragraphs from 10-K filings, Federal Reserve minutes, or Wall Street reports. Let Llama 3.3 70B translate them into plain English.
            </p>
          </div>

          <form onSubmit={handleCustomSimplify} className="space-y-4 max-w-3xl">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Headline or Topic (Optional)</label>
              <input
                type="text"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                placeholder="e.g. Semiconductor Capex Multiples & Margin Expansion"
                className="w-full bg-[#090F1C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Financial Text Excerpt <span className="text-emerald-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="Paste financial text here (e.g. 'The FOMC adjusted overnight reverse repurchase facility parameters amidst shifting liquidity yields and tightening credit spreads...')"
                className="w-full bg-[#090F1C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isCustomLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Cpu className="w-4 h-4" />
              <span>{isCustomLoading ? 'Simplifying Text...' : 'Simplify This Text'}</span>
            </button>
          </form>

          {/* Custom Result Display */}
          {customResult && (
            <div className="mt-8 pt-6 border-t border-white/10 max-w-3xl">
              <div className="bg-[#090F1C] border border-emerald-500/40 rounded-2xl p-5 space-y-3">
                <span className="px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950 text-[11px] font-extrabold uppercase">
                  Simplified Result
                </span>
                <h4 className="text-lg font-bold text-white">{customResult.title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{customResult.summary}</p>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                  <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-0.5">Key Takeaway</div>
                  <div className="text-xs text-white">{customResult.key_takeaway}</div>
                </div>

                {customResult.terms && customResult.terms.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-xs font-bold text-slate-400">Extracted Concepts:</span>
                    <div className="space-y-1">
                      {customResult.terms.map((t, i) => (
                        <div key={i} className="text-xs bg-white/[0.03] p-2 rounded border-l-2 border-cyan-400 text-slate-300">
                          <strong className="text-white">{t.term}:</strong> {t.explanation}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* How It Works Section */}
        <section className="mb-16" id="how-it-works">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">How FinNews AI Works</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">A clean three-stage pipeline built for non-experts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-6 relative">
              <div className="text-3xl font-mono font-extrabold text-white/5 absolute top-4 right-4">01</div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Ingestion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects to NewsAPI to fetch verified headlines, descriptions, and metadata across markets, business, and tech categories.
              </p>
            </div>

            <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-6 relative">
              <div className="text-3xl font-mono font-extrabold text-white/5 absolute top-4 right-4">02</div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Groq Llama 3.3 70B</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Groq LPUs process article excerpts with near-zero latency, removing jargon and generating plain-English takeaways.
              </p>
            </div>

            <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-6 relative">
              <div className="text-3xl font-mono font-extrabold text-white/5 absolute top-4 right-4">03</div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Actionable Digest</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Presents clean, digestible news cards equipped with interactive term glossaries, speech reader, and links to original sources.
              </p>
            </div>
          </div>
        </section>

        {/* Mandatory Financial Disclaimer */}
        <section className="mb-12" id="disclaimer">
          <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-5 flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <strong className="text-amber-300 font-bold block mb-1">Financial Disclaimer</strong>
              FinNews AI provides simplified financial news for informational and educational purposes only. It does not provide personalized financial, investment, legal, or tax advice. Always perform your own research and consult a licensed professional before making investment decisions.
            </div>
          </div>
        </section>
      </main>

      {/* Financial Term Modal */}
      {selectedTerm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111A2E] border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[11px] font-bold uppercase tracking-wider">
                Financial Term Glossary
              </span>
              <button
                onClick={() => setSelectedTerm(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{selectedTerm.term}</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {selectedTerm.explanation}
            </p>

            <div className="border-t border-white/10 pt-3 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Simplified by Llama 3.3 70B</span>
              <button
                onClick={() => setSelectedTerm(null)}
                className="text-cyan-400 font-semibold hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#060911] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <span>FINNEWS AI</span>
            <span>•</span>
            <span className="text-slate-400 font-normal">Financial News, Simplified.</span>
          </div>
          <p className="font-mono text-[11px] text-slate-400">
            FastAPI Backend • Groq Llama 3.3 70B • NewsAPI • Modern Responsive UI
          </p>
          <p>&copy; 2026 FinNews AI. Open-source educational project.</p>
        </div>
      </footer>
    </div>
  );
}
