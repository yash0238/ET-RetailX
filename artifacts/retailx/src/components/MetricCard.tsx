import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  valueColor?: string;
}

export function MetricCard({ title, value, subtitle, trend = "neutral", valueColor }: MetricCardProps) {
  return (
    <div className="bg-panel border border-border rounded-xl p-5 hover:border-border/80 transition-all group shadow-sm shadow-black/20">
      <h3 className="text-sm font-medium text-neutral mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-2xl font-bold font-mono tracking-tight", valueColor || "text-foreground")}>
          {value}
        </span>
      </div>
      {subtitle && (
        <p className={cn(
          "text-xs mt-2 font-medium",
          trend === "up" ? "text-bullish" : trend === "down" ? "text-bearish" : "text-neutral"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
