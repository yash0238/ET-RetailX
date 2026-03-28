import { useRoute, useLocation } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { useGetStockData } from "@workspace/api-client-react";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { MetricCard } from "@/components/MetricCard";
import { TradingChart } from "@/components/TradingChart";
import { AiAnalysisCard } from "@/components/AiAnalysisCard";
import { AlertCircle, ArrowLeft, Search } from "lucide-react";
import { useState } from "react";

export function Dashboard() {
  const [match, params] = useRoute("/stock/:ticker");
  const ticker = match ? params.ticker : "RELIANCE.NS";
  
  const { data, isLoading, isError, error } = useGetStockData(ticker, {
    query: {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-8 overflow-hidden flex flex-col gap-6">
          <div className="h-20 w-64 bg-panel animate-pulse rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-panel animate-pulse rounded-xl" />)}
          </div>
          <div className="flex-1 bg-panel animate-pulse rounded-xl" />
        </main>
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState ticker={ticker} />;
  }

  const { companyName, indicators, candles } = data;
  
  // Styling helpers
  const isUp = indicators.priceChange >= 0;
  const priceColor = isUp ? "text-bullish" : "text-bearish";
  
  const getPatternColor = (pattern: string) => {
    switch(pattern) {
      case "Breakout": return "bg-[hsl(var(--color-pattern-breakout)_/_0.15)] text-[hsl(var(--color-pattern-breakout))] border-[hsl(var(--color-pattern-breakout)_/_0.3)]";
      case "Oversold": return "bg-[hsl(var(--color-pattern-oversold)_/_0.15)] text-[hsl(var(--color-pattern-oversold))] border-[hsl(var(--color-pattern-oversold)_/_0.3)]";
      case "Overbought": return "bg-[hsl(var(--color-pattern-overbought)_/_0.15)] text-[hsl(var(--color-pattern-overbought))] border-[hsl(var(--color-pattern-overbought)_/_0.3)]";
      case "Trend Reversal": return "bg-[hsl(var(--color-pattern-reversal)_/_0.15)] text-[hsl(var(--color-pattern-reversal))] border-[hsl(var(--color-pattern-reversal)_/_0.3)]";
      default: return "bg-neutral/10 text-neutral border-neutral/30";
    }
  };

  const getRsiColor = (rsi?: number | null) => {
    if (!rsi) return undefined;
    if (rsi > 70) return "text-bearish"; // Overbought -> bearish divergence
    if (rsi < 30) return "text-bullish"; // Oversold -> bullish divergence
    return "text-foreground";
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{companyName}</h2>
                <span className="px-2.5 py-1 rounded-md bg-panel border border-border text-xs font-mono font-bold text-neutral">
                  {ticker}
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold font-mono tracking-tighter">
                  {formatCurrency(indicators.currentPrice)}
                </span>
                <span className={cn("text-lg font-semibold font-mono", priceColor)}>
                  {indicators.priceChange > 0 ? "+" : ""}{indicators.priceChange.toFixed(2)} ({formatPercent(indicators.priceChangePct)})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={cn(
                "px-4 py-2 rounded-lg border font-bold text-sm tracking-wide shadow-sm",
                getPatternColor(indicators.pattern)
              )}>
                {indicators.pattern} Detected
              </div>
            </div>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              title="RSI (14)" 
              value={indicators.rsi?.toFixed(2) || "N/A"} 
              valueColor={getRsiColor(indicators.rsi)}
              subtitle={indicators.rsi ? (indicators.rsi > 70 ? "Overbought" : indicators.rsi < 30 ? "Oversold" : "Neutral") : ""}
            />
            <MetricCard 
              title="MACD" 
              value={indicators.macd?.toFixed(2) || "N/A"} 
              trend={indicators.macd && indicators.macdSignal && indicators.macd > indicators.macdSignal ? "up" : "down"}
              subtitle={indicators.macdSignal ? `Signal: ${indicators.macdSignal.toFixed(2)}` : ""}
            />
            <MetricCard 
              title="Historical Win Rate" 
              value={`${indicators.winRate}%`} 
              trend={indicators.winRate > 50 ? "up" : "down"}
              subtitle="Pattern accuracy"
            />
            <MetricCard 
              title="Expected Move" 
              value={formatPercent(indicators.expectedMove)} 
              trend={indicators.expectedMove > 0 ? "up" : "down"}
              valueColor={indicators.expectedMove > 0 ? "text-bullish" : "text-bearish"}
              subtitle="Next 14 trading days"
            />
          </div>

          {/* Chart & AI Split */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 flex flex-col min-h-[550px]">
              <div className="bg-panel border border-border rounded-xl p-4 flex-1 shadow-lg shadow-black/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral">Price Action & Indicators</h3>
                  <div className="flex gap-2 text-xs font-mono text-neutral">
                    <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-primary" /> BB</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-bullish" /> MACD</span>
                  </div>
                </div>
                <div className="h-[calc(100%-2rem)]">
                  <TradingChart candles={candles} />
                </div>
              </div>
            </div>
            
            <div className="xl:col-span-1">
              <AiAnalysisCard 
                ticker={ticker} 
                companyName={companyName} 
                indicators={indicators} 
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Error Fallback Component
function ErrorState({ ticker }: { ticker: string }) {
  const [, setLocation] = useLocation();
  const [searchInput, setSearchInput] = useState("");
  
  const suggestions = ["TCS.NS", "HDFCBANK.NS", "INFY.NS", "WIPRO.NS", "SBIN.NS"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    let t = searchInput.trim().toUpperCase();
    if (!t.endsWith(".NS") && !t.endsWith(".BO")) t += ".NS";
    setLocation(`/stock/${t}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-panel border border-border rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-bearish/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-bearish" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Ticker Not Found</h1>
        <p className="text-neutral mb-8">
          We couldn't locate data for <span className="font-mono text-foreground font-bold">{ticker}</span>. 
          It might be delisted or invalid.
        </p>

        <form onSubmit={handleSearch} className="relative mb-8 text-left">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
          <input
            type="text"
            placeholder="Try another ticker..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-input border border-border rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
          />
        </form>

        <div className="text-left">
          <p className="text-xs font-semibold text-neutral uppercase tracking-wider mb-3">Try these popular stocks:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => setLocation(`/stock/${s}`)}
                className="px-3 py-1.5 bg-input border border-border rounded-md text-sm font-mono hover:border-primary hover:text-primary transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setLocation("/stock/RELIANCE.NS")}
          className="mt-8 text-sm text-neutral hover:text-foreground flex items-center gap-2 mx-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}
