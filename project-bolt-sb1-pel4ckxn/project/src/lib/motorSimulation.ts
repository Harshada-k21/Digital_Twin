export interface MotorParameters {
  ratedPower: number;
  ratedVoltage: number;
  ratedCurrent: number;
  ratedSpeed: number;
  ratedTorque: number;
  efficiency: number;
  powerFactor: number;
}

export interface MotorState {
  temperature: number;
  vibration: number;
  current: number;
  voltage: number;
  speed: number;
  power: number;
  efficiency: number;
  torque: number;
  load: number;
  operatingHours: number;
}

export class MotorSimulator {
  private params: MotorParameters;
  private state: MotorState;
  private degradationFactor: number;
  private bearingWear: number;
  private windingInsulationHealth: number;

  constructor(params: MotorParameters) {
    this.params = params;
    this.degradationFactor = 1.0;
    this.bearingWear = 0;
    this.windingInsulationHealth = 100;

    this.state = {
      temperature: 25,
      vibration: 0.5,
      current: 0,
      voltage: params.ratedVoltage,
      speed: 0,
      power: 0,
      efficiency: params.efficiency,
      torque: 0,
      load: 0,
      operatingHours: 0
    };
  }

  setLoad(loadPercentage: number) {
    this.state.load = Math.max(0, Math.min(100, loadPercentage));
  }

  addDegradation(hours: number) {
    this.state.operatingHours += hours;
    this.bearingWear += hours * 0.01;
    this.windingInsulationHealth -= hours * 0.001;
    this.degradationFactor = 1 - (this.bearingWear * 0.001);
  }

  simulate(deltaTime: number = 1): MotorState {
    const loadFactor = this.state.load / 100;

    this.state.current = this.params.ratedCurrent * loadFactor * (1 + Math.random() * 0.02 - 0.01);
    this.state.voltage = this.params.ratedVoltage * (1 + Math.random() * 0.01 - 0.005);
    this.state.speed = this.params.ratedSpeed * this.degradationFactor * (1 - loadFactor * 0.02) * (1 + Math.random() * 0.005 - 0.0025);
    this.state.torque = this.params.ratedTorque * loadFactor * (1 + Math.random() * 0.02 - 0.01);
    this.state.power = (this.state.voltage * this.state.current * Math.sqrt(3) * this.params.powerFactor) / 1000;

    const baseTemp = 25;
    const loadTemp = 40 * loadFactor;
    const degradationTemp = (this.bearingWear / 10) * 15;
    const ambientNoise = Math.random() * 3 - 1.5;
    this.state.temperature = baseTemp + loadTemp + degradationTemp + ambientNoise;

    const baseVibration = 0.5;
    const loadVibration = 1.5 * loadFactor;
    const bearingVibration = (this.bearingWear / 5) * 2;
    const randomVibration = Math.random() * 0.3 - 0.15;
    this.state.vibration = baseVibration + loadVibration + bearingVibration + randomVibration;

    const baseLoss = 0.05;
    const loadLoss = 0.15 * loadFactor;
    const degradationLoss = (1 - this.degradationFactor) * 0.1;
    this.state.efficiency = (this.params.efficiency - baseLoss - loadLoss - degradationLoss) * 100;

    const hoursElapsed = deltaTime / 3600;
    this.addDegradation(hoursElapsed);

    return { ...this.state };
  }

  getState(): MotorState {
    return { ...this.state };
  }

  getBearingWear(): number {
    return this.bearingWear;
  }

  getWindingHealth(): number {
    return Math.max(0, this.windingInsulationHealth);
  }

  reset() {
    this.degradationFactor = 1.0;
    this.bearingWear = 0;
    this.windingInsulationHealth = 100;
    this.state.operatingHours = 0;
  }

  accelerateDegradation(factor: number = 10) {
    this.bearingWear += factor;
    this.windingInsulationHealth -= factor * 0.5;
    this.degradationFactor = Math.max(0.5, 1 - (this.bearingWear * 0.001));
  }
}

export const defaultMotorParams: MotorParameters = {
  ratedPower: 75,
  ratedVoltage: 400,
  ratedCurrent: 140,
  ratedSpeed: 1480,
  ratedTorque: 484,
  efficiency: 0.94,
  powerFactor: 0.85
};
