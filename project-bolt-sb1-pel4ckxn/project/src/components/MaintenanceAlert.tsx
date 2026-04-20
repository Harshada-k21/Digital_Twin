import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { MaintenancePrediction } from '../lib/supabase';

interface MaintenanceAlertProps {
  prediction: MaintenancePrediction;
  onDismiss?: () => void;
}

export function MaintenanceAlert({ prediction, onDismiss }: MaintenanceAlertProps) {
  const severityConfig = {
    low: {
      icon: Info,
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-400',
      iconColor: 'text-blue-500'
    },
    medium: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-400',
      iconColor: 'text-yellow-500'
    },
    high: {
      icon: AlertTriangle,
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-400',
      iconColor: 'text-orange-500'
    },
    critical: {
      icon: AlertTriangle,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500',
      textColor: 'text-red-400',
      iconColor: 'text-red-500 animate-pulse'
    }
  };

  const config = severityConfig[prediction.severity];
  const Icon = config.icon;

  const formatTimeUntilFailure = () => {
    if (!prediction.estimated_failure_time) return null;
    const now = new Date();
    const failure = new Date(prediction.estimated_failure_time);
    const diff = failure.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days`;
    if (hours > 0) return `${hours} hours`;
    return 'Immediate';
  };

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-4 mb-3 transition-all hover:shadow-lg`}>
      <div className="flex items-start space-x-3">
        <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className={`font-semibold ${config.textColor} text-sm uppercase tracking-wide`}>
                {prediction.severity} - {prediction.prediction_type}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Confidence: {prediction.confidence}%
                {prediction.estimated_failure_time && (
                  <span className="ml-3">Est. Time: {formatTimeUntilFailure()}</span>
                )}
              </p>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {prediction.recommended_action}
          </p>
        </div>
      </div>
    </div>
  );
}
