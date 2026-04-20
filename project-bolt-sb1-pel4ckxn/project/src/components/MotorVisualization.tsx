import { MotorState } from '../lib/motorSimulation';

interface MotorVisualizationProps {
  state: MotorState;
  isRunning: boolean;
}

export function MotorVisualization({ state, isRunning }: MotorVisualizationProps) {
  const getStatusColor = () => {
    if (state.temperature > 85) return '#ef4444';
    if (state.temperature > 70) return '#f59e0b';
    if (state.vibration > 4) return '#ef4444';
    if (state.vibration > 3) return '#f59e0b';
    return '#10b981';
  };

  const statusColor = getStatusColor();
  const rotationSpeed = isRunning ? (state.speed / 1480) * 2 : 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full max-w-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="motorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <radialGradient id="shaftGradient">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect x="50" y="80" width="200" height="140" rx="10" fill="url(#motorGradient)" stroke="#64748b" strokeWidth="2"/>

        <rect x="60" y="100" width="30" height="100" rx="5" fill="#374151" stroke="#64748b" strokeWidth="1"/>
        <rect x="90" y="100" width="30" height="100" rx="5" fill="#374151" stroke="#64748b" strokeWidth="1"/>
        <rect x="180" y="100" width="30" height="100" rx="5" fill="#374151" stroke="#64748b" strokeWidth="1"/>
        <rect x="210" y="100" width="30" height="100" rx="5" fill="#374151" stroke="#64748b" strokeWidth="1"/>

        <circle cx="150" cy="150" r="35" fill="url(#shaftGradient)" stroke="#94a3b8" strokeWidth="2"/>

        <g
          style={{
            transformOrigin: '150px 150px',
            animation: isRunning ? `rotate ${2 / rotationSpeed}s linear infinite` : 'none'
          }}
        >
          <line x1="150" y1="150" x2="150" y2="120" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round"/>
          <line x1="150" y1="150" x2="180" y2="150" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round"/>
        </g>

        <rect x="250" y="130" width="100" height="40" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="2"/>
        <rect x="260" y="140" width="30" height="20" rx="3" fill="#374151"/>
        <rect x="300" y="140" width="30" height="20" rx="3" fill="#374151"/>

        <circle cx="150" cy="150" r="8" fill={statusColor} filter="url(#glow)"/>

        <text x="150" y="250" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="600">
          75 kW Industrial Motor
        </text>
        <text x="150" y="270" textAnchor="middle" fill="#64748b" fontSize="12">
          {isRunning ? 'RUNNING' : 'STOPPED'} | {state.speed.toFixed(0)} RPM
        </text>
      </svg>

      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
