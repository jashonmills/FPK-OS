
/**
 * SLO Monitoring Service
 * Automated performance alerts and SLO monitoring
 */

import { WebVitalsTracker } from './WebVitalsTracker';
import { ConversionFunnelTracker } from './ConversionFunnelTracker';
import { cleanupManager } from '@/utils/cleanupManager';

interface SLOTarget {
  metric: string;
  target: number;
  threshold: number;
  timeWindow: number; // in milliseconds
  alertOnBreach: boolean;
}

interface AlertRule {
  id: string;
  name: string;
  condition: (value: number, target: number) => boolean;
  severity: 'info' | 'warning' | 'critical';
  cooldown: number; // in milliseconds
  lastTriggered?: number;
}

interface MonitoringAlert {
  id: string;
  rule: string;
  metric: string;
  value: number;
  target: number;
  severity: 'info' | 'warning' | 'critical';
  timestamp: number;
  acknowledged: boolean;
}

export class SLOMonitoringService {
  private webVitalsTracker: WebVitalsTracker;
  private conversionTracker: ConversionFunnelTracker;
  private sloTargets: Map<string, SLOTarget> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private alerts: MonitoringAlert[] = [];
  private monitoringIntervalId?: string;

  constructor() {
    this.webVitalsTracker = new WebVitalsTracker(this.handlePerformanceAlert.bind(this));
    this.conversionTracker = new ConversionFunnelTracker();
    this.initializeSLOs();
    this.initializeAlertRules();
    this.startMonitoring();
  }

  /**
   * Initialize SLO targets
   */
  private initializeSLOs(): void {
    // Performance SLOs
    this.sloTargets.set('page_load_time', {
      metric: 'page_load_time',
      target: 1000, // 1 second
      threshold: 1500, // Alert if > 1.5 seconds
      timeWindow: 300000, // 5 minutes
      alertOnBreach: true
    });

    this.sloTargets.set('LCP', {
      metric: 'LCP',
      target: 2500,
      threshold: 4000,
      timeWindow: 300000,
      alertOnBreach: true
    });

    this.sloTargets.set('FID', {
      metric: 'FID',
      target: 100,
      threshold: 300,
      timeWindow: 300000,
      alertOnBreach: true
    });

    this.sloTargets.set('CLS', {
      metric: 'CLS',
      target: 0.1,
      threshold: 0.25,
      timeWindow: 300000,
      alertOnBreach: true
    });

    // Conversion SLOs
    this.sloTargets.set('search_to_read_conversion', {
      metric: 'search_to_read_conversion',
      target: 15, // 15% conversion rate
      threshold: 10, // Alert if < 10%
      timeWindow: 3600000, // 1 hour
      alertOnBreach: true
    });

    this.sloTargets.set('epub_load_time', {
      metric: 'epub_load_time',
      target: 2000,
      threshold: 5000,
      timeWindow: 300000,
      alertOnBreach: true
    });

    console.log('🎯 SLO targets initialized:', this.sloTargets.size);
  }

  /**
   * Initialize alert rules
   */
  private initializeAlertRules(): void {
    this.alertRules.set('load_time_breach', {
      id: 'load_time_breach',
      name: 'Load Time SLO Breach',
      condition: (value, target) => value > target,
      severity: 'warning',
      cooldown: 300000 // 5 minutes
    });

    this.alertRules.set('load_time_critical', {
      id: 'load_time_critical',
      name: 'Critical Load Time',
      condition: (value, target) => value > target * 2,
      severity: 'critical',
      cooldown: 180000 // 3 minutes
    });

    this.alertRules.set('conversion_drop', {
      id: 'conversion_drop',
      name: 'Conversion Rate Drop',
      condition: (value, target) => value < target * 0.7, // 30% drop
      severity: 'warning',
      cooldown: 1800000 // 30 minutes
    });

    this.alertRules.set('core_vitals_poor', {
      id: 'core_vitals_poor',
      name: 'Poor Core Web Vitals',
      condition: (value, target) => value > target * 1.5,
      severity: 'critical',
      cooldown: 600000 // 10 minutes
    });

    console.log('🚨 Alert rules initialized:', this.alertRules.size);
  }

  /**
   * Start monitoring
   */
  private startMonitoring(): void {
    // Monitor every 30 seconds
    this.monitoringIntervalId = cleanupManager.setInterval(() => {
      this.checkSLOs();
    }, 30000, 'SLOMonitoringService');

    console.log('📊 SLO monitoring started');
  }

  /**
   * Check all SLOs
   */
  private checkSLOs(): void {
    const webVitals = this.webVitalsTracker.getMetrics();
    const conversionMetrics = this.conversionTracker.getConversionMetrics();

    // Check performance SLOs
    webVitals.forEach(metric => {
      const slo = this.sloTargets.get(metric.name);
      if (slo) {
        this.evaluateMetric(metric.name, metric.value, slo);
      }
    });

    // Check conversion SLOs
    const searchToRead = conversionMetrics.conversionRates.searchToRead;
    const searchToReadSLO = this.sloTargets.get('search_to_read_conversion');
    if (searchToReadSLO && conversionMetrics.totalSearches > 0) {
      this.evaluateMetric('search_to_read_conversion', searchToRead, searchToReadSLO);
    }
  }

  /**
   * Evaluate metric against SLO
   */
  private evaluateMetric(metricName: string, value: number, slo: SLOTarget): void {
    const isBreached = value > slo.threshold || (metricName.includes('conversion') && value < slo.threshold);
    
    if (isBreached && slo.alertOnBreach) {
      this.triggerAlert(metricName, value, slo);
    }
  }

  /**
   * Trigger alert
   */
  private triggerAlert(metric: string, value: number, slo: SLOTarget): void {
    const severity = value > slo.threshold * 2 ? 'critical' : 'warning';
    const ruleId = severity === 'critical' ? 'load_time_critical' : 'load_time_breach';
    const rule = this.alertRules.get(ruleId);

    if (!rule) return;

    // Check cooldown
    if (rule.lastTriggered && Date.now() - rule.lastTriggered < rule.cooldown) {
      return;
    }

    const alert: MonitoringAlert = {
      id: crypto.randomUUID(),
      rule: rule.id,
      metric,
      value,
      target: slo.target,
      severity,
      timestamp: Date.now(),
      acknowledged: false
    };

    this.alerts.push(alert);
    rule.lastTriggered = Date.now();

    console.warn(`🚨 SLO Alert: ${metric} = ${value.toFixed(2)} (target: ${slo.target})`, alert);

    // Trigger notification
    this.notifyAlert(alert);
  }

  /**
   * Handle performance alert from Web Vitals tracker
   */
  private handlePerformanceAlert(alert: any): void {
    const monitoringAlert: MonitoringAlert = {
      id: crypto.randomUUID(),
      rule: 'web_vitals_alert',
      metric: alert.metric,
      value: alert.value,
      target: alert.threshold,
      severity: alert.severity,
      timestamp: alert.timestamp,
      acknowledged: false
    };

    this.alerts.push(monitoringAlert);
    this.notifyAlert(monitoringAlert);
  }

  /**
   * Notify alert (can be extended to send to external systems)
   */
  private notifyAlert(alert: MonitoringAlert): void {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Performance Alert: ${alert.metric}`, {
        body: `${alert.metric} exceeded threshold: ${alert.value.toFixed(2)}`,
        icon: '/favicon.ico'
      });
    }

    // Console notification
    const emoji = alert.severity === 'critical' ? '🔴' : '🟡';
    console.warn(`${emoji} Alert: ${alert.metric} = ${alert.value.toFixed(2)} (target: ${alert.target})`);

    // Custom event for UI components
    window.dispatchEvent(new CustomEvent('slo-alert', { 
      detail: alert 
    }));
  }

  /**
   * Get SLO compliance status
   */
  getSLOStatus(): Record<string, { status: 'passing' | 'failing'; value: number; target: number }> {
    const status: Record<string, { status: 'passing' | 'failing'; value: number; target: number }> = {};
    const webVitals = this.webVitalsTracker.getMetrics();
    const conversionMetrics = this.conversionTracker.getConversionMetrics();

    // Check Web Vitals
    webVitals.forEach(metric => {
      const slo = this.sloTargets.get(metric.name);
      if (slo) {
        status[metric.name] = {
          status: metric.value <= slo.threshold ? 'passing' : 'failing',
          value: metric.value,
          target: slo.target
        };
      }
    });

    // Check conversion rates
    const searchToRead = conversionMetrics.conversionRates.searchToRead;
    const conversionSLO = this.sloTargets.get('search_to_read_conversion');
    if (conversionSLO) {
      status['search_to_read_conversion'] = {
        status: searchToRead >= conversionSLO.threshold ? 'passing' : 'failing',
        value: searchToRead,
        target: conversionSLO.target
      };
    }

    return status;
  }

  /**
   * Get recent alerts
   */
  getAlerts(limit = 10): MonitoringAlert[] {
    return this.alerts.slice(-limit).reverse();
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  /**
   * Get monitoring dashboard data
   */
  getDashboardData() {
    return {
      sloStatus: this.getSLOStatus(),
      alerts: this.getAlerts(),
      webVitals: this.webVitalsTracker.getMetrics(),
      conversionMetrics: this.conversionTracker.getConversionMetrics(),
      funnelData: this.conversionTracker.getFunnelData()
    };
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringIntervalId) {
      cleanupManager.cleanup(this.monitoringIntervalId);
      this.monitoringIntervalId = undefined;
    }
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
}

// Global monitoring instance
export const sloMonitoringService = new SLOMonitoringService();
