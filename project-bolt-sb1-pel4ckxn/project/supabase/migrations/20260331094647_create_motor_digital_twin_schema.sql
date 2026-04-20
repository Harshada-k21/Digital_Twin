/*
  # Motor Digital Twin Schema

  1. New Tables
    - motor_telemetry: Stores real-time motor performance data
      - id, timestamp, temperature, vibration, current, voltage, speed, power, efficiency, torque
    
    - maintenance_predictions: Stores predictive maintenance alerts
      - id, timestamp, prediction_type, confidence, severity, recommended_action, estimated_failure_time
    
    - maintenance_logs: Historical maintenance records
      - id, timestamp, action_type, description, performed_by

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS motor_telemetry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  temperature numeric NOT NULL,
  vibration numeric NOT NULL,
  current numeric NOT NULL,
  voltage numeric NOT NULL,
  speed numeric NOT NULL,
  power numeric NOT NULL,
  efficiency numeric NOT NULL,
  torque numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maintenance_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  prediction_type text NOT NULL,
  confidence numeric NOT NULL,
  severity text NOT NULL,
  recommended_action text NOT NULL,
  estimated_failure_time timestamptz,
  is_active boolean DEFAULT true,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maintenance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  action_type text NOT NULL,
  description text NOT NULL,
  performed_by text DEFAULT 'System',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE motor_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to motor_telemetry"
  ON motor_telemetry
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to motor_telemetry"
  ON motor_telemetry
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read access to maintenance_predictions"
  ON maintenance_predictions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to maintenance_predictions"
  ON maintenance_predictions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to maintenance_predictions"
  ON maintenance_predictions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to maintenance_logs"
  ON maintenance_logs
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to maintenance_logs"
  ON maintenance_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_motor_telemetry_timestamp ON motor_telemetry(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_maintenance_predictions_active ON maintenance_predictions(is_active, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_timestamp ON maintenance_logs(timestamp DESC);