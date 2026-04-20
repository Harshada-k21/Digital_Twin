import { Video as LucideIcon } from 'lucide-react';

interface ParameterCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}

export function ParameterCard({ icon: Icon, label, value, unit, status, trend }: ParameterCardProps) {
  const statusColors = {
    normal: 'border-green-500 bg-green-500/10',
    warning: 'border-yellow-500 bg-yellow-500/10',
    critical: 'border-red-500 bg-red-500/10'
  };

  const statusDots = {
    normal: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500 animate-pulse'
  };

  const trendSymbols = {
    up: '↑',
    down: '↓',
    stable: '→'
  };

  return (
    <div className={`relative border-2 ${statusColors[status]} rounded-lg p-4 transition-all hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-2">
        <Icon className="w-5 h-5 text-slate-400" />
        <div className={`w-2 h-2 rounded-full ${statusDots[status]}`} />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl font-bold text-white">{value}</p>
          <span className="text-sm text-slate-400">{unit}</span>
          {trend && (
            <span className="text-sm text-slate-400 ml-auto">
              {trendSymbols[trend]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
