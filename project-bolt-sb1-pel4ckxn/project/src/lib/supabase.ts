import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MotorTelemetry {
  id?: string;
  timestamp: string;
  temperature: number;
  vibration: number;
  current: number;
  voltage: number;
  speed: number;
  power: number;
  efficiency: number;
  torque: number;
}

export interface MaintenancePrediction {
  id?: string;
  timestamp: string;
  prediction_type: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommended_action: string;
  estimated_failure_time?: string;
  is_active: boolean;
  resolved_at?: string;
}

export interface MaintenanceLog {
  id?: string;
  timestamp: string;
  action_type: string;
  description: string;
  performed_by: string;
}
