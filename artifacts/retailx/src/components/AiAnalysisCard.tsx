import { Bot, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { useGetAiAnalysis } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import type { Indicators } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";

interface AiAnalysisCardProps {
  ticker: string;
  companyName: string;
  indicators: Indicators;
}

export function AiAnalysisCard({ ticker, companyName, indicators }: AiAnalysisCardProps) {
  const { mutate, data, isPending, isError } = useGetAiAnalysis();

  const handleAnalyze = () => {
    mutate({
      ticker,
      data: {
        currentPrice: indicators.currentPrice,
        pattern: indicators.pattern,
        sentiment: indicators.sentiment,
        winRate: indicators.winRate,
        expectedMove: indicators.expectedMove,
        companyName: companyName,
        rsi: indicators.rsi,
        macd: indicators.macd,
        macdSignal: indicators.macdSignal,
      }
    });
  };

  const getSentimentColors = (sentiment?: string) => {
    if (sentiment === "Bullish") return "bg-bullish-muted border-bullish/30 text-bullish";
    if (sentiment === "Bearish") return "bg-bearish-muted border-bearish/30 text-bearish";
    if (sentiment === "Neutral") return "bg-neutral/10 border-neutral/30 text-neutral";
    return "bg-panel border-border text-foreground";
  };

  return (
    <div className={cn(
      "rounded-xl border p-6 transition-all duration-500 overflow-hidden relative",
      getSentimentColors(data?.sentiment)
    )}>
      
      {/* Background glow effect based on sentiment */}
      {data?.sentiment && (
        <div className={cn(
          "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-30 pointer-events-none",
          data.sentiment === "Bullish" ? "bg-bullish" : data.sentiment === "Bearish" ? "bg-bearish" : "bg-neutral"
        )} />
      )}

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            data ? "bg-background/50" : "bg-primary/10 text-primary"
          )}>
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Groq AI Analysis</h3>
            <p className="text-xs opacity-80 font-medium">Llama 3 70B • SEBI-style guidance</p>
          </div>
        </div>

        {data?.actionLabel && (
          <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-background/50 border border-current shadow-sm">
            {data.actionLabel}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!data && !isPending && !isError && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="py-4"
          >
            <p className="text-sm opacity-80 mb-6 leading-relaxed">
              Generate an institutional-grade analysis for {ticker} based on the current technical indicators, historical win rates, and expected moves.
            </p>
            <button
              onClick={handleAnalyze}
              className="w-full py-3 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              Analyze with AI
            </button>
          </motion.div>
        )}

        {isPending && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="py-8 flex flex-col items-center justify-center gap-4"
          >
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-medium animate-pulse">Running quantitative models...</p>
          </motion.div>
        )}

        {data && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="py-2"
          >
            <p className="text-sm leading-relaxed font-medium">
              {data.analysis}
            </p>
            
            <button
              onClick={handleAnalyze}
              className="mt-6 text-xs font-semibold flex items-center gap-1 hover:underline opacity-80"
            >
              Refresh Analysis <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>
        )}

        {isError && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-6 text-center text-bearish"
          >
            <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-80" />
            <p className="text-sm font-medium">Analysis engine currently unavailable.</p>
            <button
              onClick={handleAnalyze}
              className="mt-4 px-4 py-2 text-xs border border-bearish/30 rounded hover:bg-bearish/10 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
