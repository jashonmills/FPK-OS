/**
 * Garmin Health Data Simulator
 * 
 * This module simulates Garmin Health SDK and API responses for development
 * and testing purposes. It will be replaced with real Garmin integration
 * once API keys are obtained.
 */

export type BiometricState = 'resting' | 'active' | 'stressed' | 'sleeping';

interface LiveBiometrics {
  heartRate: number;
  stressLevel: number;
  batteryLevel: number;
  timestamp: Date;
}

interface SleepData {
  sleepDate: string;
  sleepScore: number;
  deepSleepSeconds: number;
  lightSleepSeconds: number;
  remSleepSeconds: number;
  awakeSeconds: number;
  avgHeartRate: number;
  avgRespirationRate: number;
  avgSpo2: number;
  restlessnessScore: number;
  sleepStartTime: string;
  sleepEndTime: string;
}

class GarminDataSimulator {
  private currentState: BiometricState = 'resting';
  private baselineHeartRate = 78;
  private batteryLevel = 85;

  /**
   * Set the simulator's current state
   * Used for testing different scenarios
   */
  setState(state: BiometricState) {
    this.currentState = state;
    console.log(`[Garmin Simulator] State changed to: ${state}`);
  }

  /**
   * Get the current state
   */
  getState(): BiometricState {
    return this.currentState;
  }

  /**
   * Generate real-time biometric data
   * Mimics the Garmin Health SDK real-time stream
   */
  getLiveStreamData(): LiveBiometrics {
    let heartRate: number;
    let stressLevel: number;

    switch (this.currentState) {
      case 'resting':
        heartRate = this.baselineHeartRate + this.randomVariation(-3, 3);
        stressLevel = this.randomVariation(15, 30);
        break;
      case 'active':
        heartRate = this.baselineHeartRate + this.randomVariation(20, 35);
        stressLevel = this.randomVariation(40, 55);
        break;
      case 'stressed':
        heartRate = this.baselineHeartRate + this.randomVariation(30, 45);
        stressLevel = this.randomVariation(70, 90);
        break;
      case 'sleeping':
        heartRate = this.baselineHeartRate - this.randomVariation(10, 15);
        stressLevel = this.randomVariation(5, 15);
        break;
      default:
        heartRate = this.baselineHeartRate;
        stressLevel = 25;
    }

    // Simulate slow battery drain
    if (Math.random() < 0.01) {
      this.batteryLevel = Math.max(10, this.batteryLevel - 1);
    }

    return {
      heartRate: Math.round(heartRate),
      stressLevel: Math.round(stressLevel),
      batteryLevel: this.batteryLevel,
      timestamp: new Date()
    };
  }

  /**
   * Generate historical sleep data
   * Mimics the Garmin Health API sleep endpoint response
   */
  getHistoricalSleepData(date: Date = new Date()): SleepData {
    const sleepScore = this.randomVariation(60, 95);
    
    // Total sleep time between 6-9 hours
    const totalSleepMinutes = this.randomVariation(360, 540);
    const totalSleepSeconds = totalSleepMinutes * 60;
    
    // Sleep stage distributions (realistic percentages)
    const deepSleepPercent = this.randomVariation(15, 25) / 100;
    const remSleepPercent = this.randomVariation(20, 25) / 100;
    const lightSleepPercent = this.randomVariation(45, 55) / 100;
    const awakePercent = 1 - (deepSleepPercent + remSleepPercent + lightSleepPercent);
    
    const deepSleepSeconds = Math.round(totalSleepSeconds * deepSleepPercent);
    const remSleepSeconds = Math.round(totalSleepSeconds * remSleepPercent);
    const lightSleepSeconds = Math.round(totalSleepSeconds * lightSleepPercent);
    const awakeSeconds = totalSleepSeconds - (deepSleepSeconds + remSleepSeconds + lightSleepSeconds);
    
    // Generate realistic sleep window
    const bedtime = new Date(date);
    bedtime.setHours(22, this.randomVariation(0, 45), 0, 0);
    
    const wakeTime = new Date(bedtime);
    wakeTime.setMinutes(wakeTime.getMinutes() + totalSleepMinutes + awakeSeconds / 60);
    
    return {
      sleepDate: date.toISOString().split('T')[0],
      sleepScore,
      deepSleepSeconds,
      lightSleepSeconds,
      remSleepSeconds,
      awakeSeconds,
      avgHeartRate: this.randomVariation(55, 65),
      avgRespirationRate: this.randomVariation(12, 16),
      avgSpo2: this.randomVariation(95, 99),
      restlessnessScore: this.randomVariation(10, 40),
      sleepStartTime: bedtime.toISOString(),
      sleepEndTime: wakeTime.toISOString()
    };
  }

  /**
   * Reset the battery to full
   */
  rechargeBattery() {
    this.batteryLevel = 100;
    console.log('[Garmin Simulator] Battery recharged to 100%');
  }

  /**
   * Helper: Generate random variation within a range
   */
  private randomVariation(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}

// Export singleton instance
export const garminSimulator = new GarminDataSimulator();
