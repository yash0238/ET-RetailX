import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
} from "lightweight-charts";
import type { CandleStick } from "@workspace/api-client-react";
import { calculateBollingerBands, calculateMACD } from "@/lib/indicators";

interface TradingChartProps {
  candles: CandleStick[];
}

export function TradingChart({ candles }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const macdContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !macdContainerRef.current || !candles.length) return;

    const layoutOptions = {
      background: { type: ColorType.Solid, color: "transparent" },
      textColor: "#64748b",
      fontSize: 12,
      fontFamily: "'JetBrains Mono', monospace",
    };

    const gridOptions = {
      vertLines: { color: "#212736", style: LineStyle.Dotted },
      horzLines: { color: "#212736", style: LineStyle.Dotted },
    };

    // --- MAIN CHART (Candles + BB) ---
    const mainChart = createChart(chartContainerRef.current, {
      layout: layoutOptions,
      grid: gridOptions,
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#475569", labelBackgroundColor: "#1e293b" },
        horzLine: { color: "#475569", labelBackgroundColor: "#1e293b" },
      },
      rightPriceScale: {
        borderColor: "#212736",
        autoScale: true,
      },
      timeScale: {
        borderColor: "#212736",
        timeVisible: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 380,
    });

    const candleSeries = mainChart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#f03e3e",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#f03e3e",
    });

    const formattedCandles = candles.map((c) => ({
      time: c.date as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    candleSeries.setData(formattedCandles);

    // Add Bollinger Bands
    const bbData = calculateBollingerBands(candles);

    const bbUpperSeries = mainChart.addSeries(LineSeries, {
      color: "#2962FF",
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    const bbMiddleSeries = mainChart.addSeries(LineSeries, {
      color: "#64748b",
      lineWidth: 1,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    const bbLowerSeries = mainChart.addSeries(LineSeries, {
      color: "#2962FF",
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    bbUpperSeries.setData(
      bbData.filter((d) => d.upper !== null).map((d) => ({ time: d.time as any, value: d.upper as number }))
    );
    bbMiddleSeries.setData(
      bbData.filter((d) => d.middle !== null).map((d) => ({ time: d.time as any, value: d.middle as number }))
    );
    bbLowerSeries.setData(
      bbData.filter((d) => d.lower !== null).map((d) => ({ time: d.time as any, value: d.lower as number }))
    );

    // --- MACD CHART ---
    const macdChart = createChart(macdContainerRef.current, {
      layout: layoutOptions,
      grid: gridOptions,
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#475569", labelBackgroundColor: "#1e293b" },
        horzLine: { color: "#475569", labelBackgroundColor: "#1e293b" },
      },
      rightPriceScale: {
        borderColor: "#212736",
      },
      timeScale: {
        borderColor: "#212736",
        visible: false,
      },
      width: macdContainerRef.current.clientWidth,
      height: macdContainerRef.current.clientHeight || 120,
    });

    const macdSeriesData = calculateMACD(candles);

    const histogramSeries = macdChart.addSeries(HistogramSeries, {
      color: "#2962FF",
      priceScaleId: "right",
    });

    const macdLineSeries = macdChart.addSeries(LineSeries, {
      color: "#00bcd4",
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    const signalLineSeries = macdChart.addSeries(LineSeries, {
      color: "#ff9800",
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    histogramSeries.setData(
      macdSeriesData.map((d) => ({
        time: d.time as any,
        value: d.histogram,
        color: d.histogram >= 0 ? "#22c55e80" : "#f03e3e80",
      }))
    );

    macdLineSeries.setData(macdSeriesData.map((d) => ({ time: d.time as any, value: d.macd })));
    signalLineSeries.setData(macdSeriesData.map((d) => ({ time: d.time as any, value: d.signal })));

    // Sync charts
    mainChart.timeScale().subscribeVisibleLogicalRangeChange((timeRange) => {
      if (timeRange) macdChart.timeScale().setVisibleLogicalRange(timeRange);
    });
    macdChart.timeScale().subscribeVisibleLogicalRangeChange((timeRange) => {
      if (timeRange) mainChart.timeScale().setVisibleLogicalRange(timeRange);
    });

    mainChart.timeScale().fitContent();

    // Handle Resize
    const handleResize = () => {
      if (chartContainerRef.current && macdContainerRef.current) {
        mainChart.applyOptions({ width: chartContainerRef.current.clientWidth });
        macdChart.applyOptions({ width: macdContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mainChart.remove();
      macdChart.remove();
    };
  }, [candles]);

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div ref={chartContainerRef} className="flex-grow min-h-[380px] w-full" />
      <div ref={macdContainerRef} className="h-32 w-full" />
    </div>
  );
}
