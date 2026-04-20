import { Play, Pause, RotateCcw, Zap, TrendingUp } from 'lucide-react';

interface ControlPanelProps {
  isRunning: boolean;
  load: number;
  onToggleRun: () => void;
  onLoadChange: (load: number) => void;
  onReset: () => void;
  onAccelerateDegradation: () => void;
  operatingHours: number;
}

export function ControlPanel({
  isRunning,
  load,
  onToggleRun,
  onLoadChange,
  onReset,
  onAccelerateDegradation,
  operatingHours
}: ControlPanelProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-400" />
          Motor Control
        </h3>

        <div className="space-y-4">
          <button
            onClick={onToggleRun}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Stop Motor</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Start Motor</span>
              </>
            )}
          </button>

          <div>
            <label className="flex items-center justify-between text-sm text-slate-400 mb-2">
              <span>Load: {load}%</span>
              <TrendingUp className="w-4 h-4" />
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={load}
              onChange={(e) => onLoadChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-700">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Simulation Controls</h3>
        <div className="space-y-2">
          <button
            onClick={onAccelerateDegradation}
            className="w-full py-2 px-4 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-lg text-sm font-medium transition-all"
          >
            Accelerate Wear (Demo)
          </button>
          <button
            onClick={onReset}
            className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Motor</span>
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-500">
          <div className="flex justify-between mb-1">
            <span>Operating Hours:</span>
            <span className="text-white font-mono">{operatingHours.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
