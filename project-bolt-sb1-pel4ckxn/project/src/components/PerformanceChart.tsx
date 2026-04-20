import { useMemo } from 'react';

interface DataPoint {
  value: number;
  timestamp: number;
}

interface PerformanceChartProps {
  data: DataPoint[];
  label: string;
  color: string;
  unit: string;
  min?: number;
  max?: number;
}

export function PerformanceChart({ data, label, color, unit, min, max }: PerformanceChartProps) {
  const { points, minVal, maxVal } = useMemo(() => {
    if (data.length === 0) {
      return { points: '', minVal: 0, maxVal: 100 };
    }

    const values = data.map(d => d.value);
    const calculatedMin = min ?? Math.min(...values);
    const calculatedMax = max ?? Math.max(...values);
    const range = calculatedMax - calculatedMin || 1;

    const width = 100;
    const height = 60;
    const padding = 5;

    const pointsStr = data
      .map((d, i) => {
        const x = padding + (i / (data.length - 1 || 1)) * (width - 2 * padding);
        const y = height - padding - ((d.value - calculatedMin) / range) * (height - 2 * padding);
        return `${x},${y}`;
      })
      .join(' ');

    return { points: pointsStr, minVal: calculatedMin, maxVal: calculatedMax };
  }, [data, min, max]);

  const currentValue = data.length > 0 ? data[data.length - 1].value : 0;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">
            {currentValue.toFixed(1)} <span className="text-sm text-slate-400">{unit}</span>
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>Max: {maxVal.toFixed(1)}</div>
          <div>Min: {minVal.toFixed(1)}</div>
        </div>
      </div>
      <svg viewBox="0 0 100 60" className="w-full h-20">
        <defs>
          <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <line x1="5" y1="55" x2="95" y2="55" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1="5" y1="30" x2="95" y2="30" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1="5" y1="5" x2="95" y2="5" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />

        {data.length > 0 && (
          <>
            <polyline
              points={`5,60 ${points} 95,60`}
              fill={`url(#gradient-${label})`}
              stroke="none"
            />
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
    </div>
  );
}
