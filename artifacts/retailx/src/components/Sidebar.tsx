import { Search, TrendingUp, Activity, Settings, Target, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { cn } from "@/lib/utils";

const WATCHLIST = [
  "RELIANCE.NS",
  "TCS.NS",
  "HDFCBANK.NS",
  "INFY.NS",
  "WIPRO.NS"
];

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    let ticker = searchInput.trim().toUpperCase();
    if (!ticker.endsWith(".NS") && !ticker.endsWith(".BO")) {
      ticker += ".NS";
    }
    setLocation(`/stock/${ticker}`);
    setSearchInput("");
  };

  return (
    <aside className="w-64 bg-panel border-r border-border h-screen flex flex-col hidden md:flex shrink-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-foreground">ET RetailX</h1>
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
          <input
            type="text"
            placeholder="Search ticker..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-input border border-border rounded-md py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-neutral focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
          />
        </form>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        <div>
          <h2 className="text-xs font-semibold text-neutral uppercase tracking-wider mb-3 px-2">Watchlist</h2>
          <div className="space-y-1">
            {WATCHLIST.map((ticker) => {
              const isActive = location === `/stock/${ticker}`;
              return (
                <Link
                  key={ticker}
                  href={`/stock/${ticker}`}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all group",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-neutral hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  <span className="font-mono">{ticker}</span>
                  <ChevronRight className={cn(
                    "w-4 h-4 opacity-0 -translate-x-2 transition-all",
                    isActive || "group-hover:opacity-100 group-hover:translate-x-0"
                  )} />
                </Link>
              );
            })}
          </div>
        </div>
        
        <div>
          <h2 className="text-xs font-semibold text-neutral uppercase tracking-wider mb-3 px-2">Tools</h2>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-neutral hover:bg-white/5 hover:text-foreground transition-all">
              <TrendingUp className="w-4 h-4" />
              Screener
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-neutral hover:bg-white/5 hover:text-foreground transition-all">
              <Target className="w-4 h-4" />
              Pattern Alerts
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-neutral hover:bg-white/5 hover:text-foreground transition-all">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}
