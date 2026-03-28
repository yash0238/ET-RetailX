// Client-side computation for historical indicators to render on the chart
import type { CandleStick } from "@workspace/api-client-react";

export function calculateSMA(data: number[], period: number) {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const sum = slice.reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  return sma;
}

export function calculateStdDev(data: number[], sma: (number | null)[], period: number) {
  const stddev = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1 || sma[i] === null) {
      stddev.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = sma[i] as number;
      const squaredDiffs = slice.map((val) => Math.pow(val - mean, 2));
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
      stddev.push(Math.sqrt(variance));
    }
  }
  return stddev;
}

export function calculateBollingerBands(candles: CandleStick[], period = 20, multiplier = 2) {
  const closes = candles.map((c) => c.close);
  const sma = calculateSMA(closes, period);
  const stddev = calculateStdDev(closes, sma, period);

  return candles.map((c, i) => {
    if (sma[i] === null || stddev[i] === null) {
      return { time: c.date, upper: null, middle: null, lower: null };
    }
    const middle = sma[i] as number;
    const sd = stddev[i] as number;
    return {
      time: c.date,
      upper: middle + multiplier * sd,
      middle: middle,
      lower: middle - multiplier * sd,
    };
  });
}

export function calculateEMA(data: number[], period: number) {
  const ema = [];
  const k = 2 / (period + 1);
  let prevEma = data[0];
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      ema.push(prevEma);
    } else {
      const currentEma = data[i] * k + prevEma * (1 - k);
      ema.push(currentEma);
      prevEma = currentEma;
    }
  }
  return ema;
}

export function calculateMACD(candles: CandleStick[], fast = 12, slow = 26, signal = 9) {
  const closes = candles.map((c) => c.close);
  const emaFast = calculateEMA(closes, fast);
  const emaSlow = calculateEMA(closes, slow);
  
  const macdLine = emaFast.map((f, i) => f - emaSlow[i]);
  const signalLine = calculateEMA(macdLine, signal);
  
  return candles.map((c, i) => {
    return {
      time: c.date,
      macd: macdLine[i],
      signal: signalLine[i],
      histogram: macdLine[i] - signalLine[i]
    };
  });
}
