import { MotorState } from './motorSimulation';
import { MaintenancePrediction } from './supabase';

interface ThresholdConfig {
  temperature: { warning: number; critical: number };
  vibration: { warning: number; critical: number };
  efficiency: { warning: number; critical: number };
  current: { warning: number; critical: number };
}

const thresholds: ThresholdConfig = {
  temperature: { warning: 70, critical: 85 },
  vibration: { warning: 3.5, critical: 5.0 },
  efficiency: { warning: 85, critical: 80 },
  current: { warning: 150, critical: 170 }
};

export class PredictiveMaintenanceEngine {
  private historicalData: MotorState[] = [];
  private maxHistorySize = 100;

  addDataPoint(state: MotorState) {
    this.historicalData.push(state);
    if (this.historicalData.length > this.maxHistorySize) {
      this.historicalData.shift();
    }
  }

  analyze(currentState: MotorState, bearingWear: number, windingHealth: number): MaintenancePrediction[] {
    const predictions: MaintenancePrediction[] = [];
    const now = new Date().toISOString();

    const tempCheck = this.checkTemperature(currentState.temperature);
    if (tempCheck) {
      predictions.push({
        timestamp: now,
        prediction_type: 'Overheating',
        confidence: tempCheck.confidence,
        severity: tempCheck.severity,
        recommended_action: tempCheck.action,
        estimated_failure_time: this.estimateFailureTime(tempCheck.severity),
        is_active: true
      });
    }

    const vibrationCheck = this.checkVibration(currentState.vibration, bearingWear);
    if (vibrationCheck) {
      predictions.push({
        timestamp: now,
        prediction_type: 'Bearing Wear',
        confidence: vibrationCheck.confidence,
        severity: vibrationCheck.severity,
        recommended_action: vibrationCheck.action,
        estimated_failure_time: this.estimateFailureTime(vibrationCheck.severity),
        is_active: true
      });
    }

    const efficiencyCheck = this.checkEfficiency(currentState.efficiency, windingHealth);
    if (efficiencyCheck) {
      predictions.push({
        timestamp: now,
        prediction_type: 'Winding Degradation',
        confidence: efficiencyCheck.confidence,
        severity: efficiencyCheck.severity,
        recommended_action: efficiencyCheck.action,
        estimated_failure_time: this.estimateFailureTime(efficiencyCheck.severity),
        is_active: true
      });
    }

    const currentCheck = this.checkCurrent(currentState.current);
    if (currentCheck) {
      predictions.push({
        timestamp: now,
        prediction_type: 'Overcurrent',
        confidence: currentCheck.confidence,
        severity: currentCheck.severity,
        recommended_action: currentCheck.action,
        estimated_failure_time: this.estimateFailureTime(currentCheck.severity),
        is_active: true
      });
    }

    const trendCheck = this.analyzeTrends();
    if (trendCheck) {
      predictions.push({
        timestamp: now,
        prediction_type: 'Performance Degradation',
        confidence: trendCheck.confidence,
        severity: trendCheck.severity,
        recommended_action: trendCheck.action,
        estimated_failure_time: this.estimateFailureTime(trendCheck.severity),
        is_active: true
      });
    }

    return predictions;
  }

  private checkTemperature(temp: number) {
    if (temp >= thresholds.temperature.critical) {
      return {
        confidence: 95,
        severity: 'critical' as const,
        action: 'IMMEDIATE ACTION: Stop motor and inspect cooling system. Check for blocked vents or coolant issues.'
      };
    } else if (temp >= thresholds.temperature.warning) {
      return {
        confidence: 75,
        severity: 'high' as const,
        action: 'Schedule cooling system inspection within 24 hours. Monitor temperature closely.'
      };
    }
    return null;
  }

  private checkVibration(vibration: number, bearingWear: number) {
    if (vibration >= thresholds.vibration.critical || bearingWear > 50) {
      return {
        confidence: 90,
        severity: 'critical' as const,
        action: 'IMMEDIATE ACTION: Stop motor and replace bearings. Risk of catastrophic failure.'
      };
    } else if (vibration >= thresholds.vibration.warning || bearingWear > 30) {
      return {
        confidence: 80,
        severity: 'high' as const,
        action: 'Schedule bearing replacement within 1 week. Lubricate bearings immediately.'
      };
    } else if (bearingWear > 15) {
      return {
        confidence: 60,
        severity: 'medium' as const,
        action: 'Plan bearing maintenance in next scheduled downtime. Monitor vibration levels.'
      };
    }
    return null;
  }

  private checkEfficiency(efficiency: number, windingHealth: number) {
    if (efficiency < thresholds.efficiency.critical || windingHealth < 50) {
      return {
        confidence: 85,
        severity: 'high' as const,
        action: 'Schedule motor winding inspection. Perform insulation resistance test.'
      };
    } else if (efficiency < thresholds.efficiency.warning || windingHealth < 75) {
      return {
        confidence: 70,
        severity: 'medium' as const,
        action: 'Monitor efficiency trends. Consider thermal imaging inspection.'
      };
    }
    return null;
  }

  private checkCurrent(current: number) {
    if (current >= thresholds.current.critical) {
      return {
        confidence: 92,
        severity: 'critical' as const,
        action: 'IMMEDIATE ACTION: Reduce load or stop motor. Check for mechanical binding or electrical issues.'
      };
    } else if (current >= thresholds.current.warning) {
      return {
        confidence: 78,
        severity: 'high' as const,
        action: 'Inspect load conditions and motor alignment. Check electrical connections.'
      };
    }
    return null;
  }

  private analyzeTrends() {
    if (this.historicalData.length < 20) return null;

    const recentData = this.historicalData.slice(-20);
    const olderData = this.historicalData.slice(-40, -20);

    if (olderData.length === 0) return null;

    const recentAvgTemp = recentData.reduce((sum, d) => sum + d.temperature, 0) / recentData.length;
    const olderAvgTemp = olderData.reduce((sum, d) => sum + d.temperature, 0) / olderData.length;

    const recentAvgVib = recentData.reduce((sum, d) => sum + d.vibration, 0) / recentData.length;
    const olderAvgVib = olderData.reduce((sum, d) => sum + d.vibration, 0) / olderData.length;

    const tempIncrease = ((recentAvgTemp - olderAvgTemp) / olderAvgTemp) * 100;
    const vibIncrease = ((recentAvgVib - olderAvgVib) / olderAvgVib) * 100;

    if (tempIncrease > 15 || vibIncrease > 20) {
      return {
        confidence: 70,
        severity: 'medium' as const,
        action: 'Increasing degradation trend detected. Schedule comprehensive motor inspection.'
      };
    }

    return null;
  }

  private estimateFailureTime(severity: string): string | undefined {
    const now = new Date();
    switch (severity) {
      case 'critical':
        now.setHours(now.getHours() + 24);
        return now.toISOString();
      case 'high':
        now.setDate(now.getDate() + 7);
        return now.toISOString();
      case 'medium':
        now.setDate(now.getDate() + 30);
        return now.toISOString();
      default:
        return undefined;
    }
  }

  clearHistory() {
    this.historicalData = [];
  }
}
