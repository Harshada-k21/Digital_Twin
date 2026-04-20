import { useEffect, useState, useRef } from 'react';
import { Thermometer, Activity, Zap, Gauge, Settings, TrendingUp, Clock } from 'lucide-react';
import { MotorSimulator, defaultMotorParams, MotorState } from './lib/motorSimulation';
import { PredictiveMaintenanceEngine } from './lib/predictiveMaintenance';
import { supabase, MaintenancePrediction } from './lib/supabase';
import { MotorVisualization } from './components/MotorVisualization';
import { ParameterCard } from './components/ParameterCard';
import { MaintenanceAlert } from './components/MaintenanceAlert';
import { PerformanceChart } from './components/PerformanceChart';
import { ControlPanel } from './components/ControlPanel';

interface ChartData {
  value: number;
  timestamp: number;
}

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [motorState, setMotorState] = useState<MotorState | null>(null);
  const [load, setLoad] = useState(50);
  const [predictions, setPredictions] = useState<MaintenancePrediction[]>([]);
  const [temperatureData, setTemperatureData] = useState<ChartData[]>([]);
  const [vibrationData, setVibrationData] = useState<ChartData[]>([]);
  const [efficiencyData, setEfficiencyData] = useState<ChartData[]>([]);
  const [powerData, setPowerData] = useState<ChartData[]>([]);

  const motorRef = useRef<MotorSimulator | null>(null);
  const maintenanceEngineRef = useRef<PredictiveMaintenanceEngine | null>(null);
  const simulationIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    motorRef.current = new MotorSimulator(defaultMotorParams);
    maintenanceEngineRef.current = new PredictiveMaintenanceEngine();
    motorRef.current.setLoad(load);
    const initialState = motorRef.current.simulate(0);
    setMotorState(initialState);

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (motorRef.current) {
      motorRef.current.setLoad(load);
    }
  }, [load]);

  useEffect(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }

    if (isRunning && motorRef.current && maintenanceEngineRef.current) {
      simulationIntervalRef.current = window.setInterval(() => {
        const motor = motorRef.current!;
        const maintenanceEngine = maintenanceEngineRef.current!;

        const newState = motor.simulate(1);
        setMotorState(newState);

        maintenanceEngine.addDataPoint(newState);

        const timestamp = Date.now();
        setTemperatureData(prev => [...prev.slice(-50), { value: newState.temperature, timestamp }]);
        setVibrationData(prev => [...prev.slice(-50), { value: newState.vibration, timestamp }]);
        setEfficiencyData(prev => [...prev.slice(-50), { value: newState.efficiency, timestamp }]);
        setPowerData(prev => [...prev.slice(-50), { value: newState.power, timestamp }]);

        supabase.from('motor_telemetry').insert({
          timestamp: new Date().toISOString(),
          temperature: newState.temperature,
          vibration: newState.vibration,
          current: newState.current,
          voltage: newState.voltage,
          speed: newState.speed,
          power: newState.power,
          efficiency: newState.efficiency,
          torque: newState.torque
        }).then(({ error }) => {
          if (error) console.error('Error saving telemetry:', error);
        });

        const newPredictions = maintenanceEngine.analyze(
          newState,
          motor.getBearingWear(),
          motor.getWindingHealth()
        );

        if (newPredictions.length > 0) {
          setPredictions(newPredictions);

          newPredictions.forEach(pred => {
            supabase.from('maintenance_predictions').insert(pred).then(({ error }) => {
              if (error) console.error('Error saving prediction:', error);
            });
          });
        }
      }, 1000);
    }

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, [isRunning]);

  const handleToggleRun = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    if (motorRef.current) {
      motorRef.current.reset();
      motorRef.current.setLoad(load);
      const resetState = motorRef.current.simulate(0);
      setMotorState(resetState);
      setPredictions([]);
      setTemperatureData([]);
      setVibrationData([]);
      setEfficiencyData([]);
      setPowerData([]);
      if (maintenanceEngineRef.current) {
        maintenanceEngineRef.current.clearHistory();
      }
    }
  };

  const handleAccelerateDegradation = () => {
    if (motorRef.current) {
      motorRef.current.accelerateDegradation(50);
    }
  };

  const getParameterStatus = (value: number, thresholds: { warning: number; critical: number }, isHigherWorse: boolean = true) => {
    if (isHigherWorse) {
      if (value >= thresholds.critical) return 'critical';
      if (value >= thresholds.warning) return 'warning';
    } else {
      if (value <= thresholds.critical) return 'critical';
      if (value <= thresholds.warning) return 'warning';
    }
    return 'normal';
  };

  if (!motorState) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Initializing motor simulation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="border-b border-slate-700 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Industrial Motor Digital Twin
              </h1>
              <p className="text-slate-400 mt-1">Real-time monitoring & predictive maintenance system</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold ${
                isRunning ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {isRunning ? 'RUNNING' : 'STOPPED'}
              </div>
            </div>
          </div>
        </header>

        {predictions.length > 0 && (
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-red-400">
              <Settings className="w-5 h-5 mr-2" />
              Active Maintenance Alerts ({predictions.length})
            </h2>
            <div className="space-y-3">
              {predictions.map((pred, idx) => (
                <MaintenanceAlert
                  key={idx}
                  prediction={pred}
                  onDismiss={() => setPredictions(predictions.filter((_, i) => i !== idx))}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800/30 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-400" />
              Motor Visualization
            </h2>
            <div className="h-80">
              <MotorVisualization state={motorState} isRunning={isRunning} />
            </div>
          </div>

          <ControlPanel
            isRunning={isRunning}
            load={load}
            onToggleRun={handleToggleRun}
            onLoadChange={setLoad}
            onReset={handleReset}
            onAccelerateDegradation={handleAccelerateDegradation}
            operatingHours={motorState.operatingHours}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-blue-400" />
            Real-Time Parameters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ParameterCard
              icon={Thermometer}
              label="Temperature"
              value={motorState.temperature.toFixed(1)}
              unit="°C"
              status={getParameterStatus(motorState.temperature, { warning: 70, critical: 85 })}
            />
            <ParameterCard
              icon={Activity}
              label="Vibration"
              value={motorState.vibration.toFixed(2)}
              unit="mm/s"
              status={getParameterStatus(motorState.vibration, { warning: 3.5, critical: 5.0 })}
            />
            <ParameterCard
              icon={Zap}
              label="Current"
              value={motorState.current.toFixed(1)}
              unit="A"
              status={getParameterStatus(motorState.current, { warning: 150, critical: 170 })}
            />
            <ParameterCard
              icon={TrendingUp}
              label="Efficiency"
              value={motorState.efficiency.toFixed(1)}
              unit="%"
              status={getParameterStatus(motorState.efficiency, { warning: 85, critical: 80 }, false)}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
            Performance Trends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PerformanceChart
              data={temperatureData}
              label="Temperature"
              color="#ef4444"
              unit="°C"
              min={20}
              max={100}
            />
            <PerformanceChart
              data={vibrationData}
              label="Vibration"
              color="#f59e0b"
              unit="mm/s"
              min={0}
              max={6}
            />
            <PerformanceChart
              data={efficiencyData}
              label="Efficiency"
              color="#10b981"
              unit="%"
              min={70}
              max={100}
            />
            <PerformanceChart
              data={powerData}
              label="Power"
              color="#3b82f6"
              unit="kW"
              min={0}
              max={80}
            />
          </div>
        </div>

        <footer className="border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
          <p>Digital Twin Simulation | Physics-based Motor Model with Predictive Maintenance</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
