
import { supabase } from '@/integrations/supabase/client';
import { analyticsEventBus, AnalyticsEvent } from './AnalyticsEventBus';

export interface LearningInsight {
  id: string;
  type: 'performance' | 'pattern' | 'recommendation' | 'motivation' | 'anomaly';
  title: string;
  message: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface AnomalyAlert {
  id: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
}

class AIInsightsEngine {
  private insights: LearningInsight[] = [];
  private anomalies: AnomalyAlert[] = [];
  private analysisTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeInsightGeneration();
  }

  private initializeInsightGeneration() {
    // Subscribe to analytics events for real-time analysis
    analyticsEventBus.subscribe({
      id: 'ai-insights-engine',
      eventTypes: ['*'],
      callback: (event) => this.analyzeEvent(event)
    });

    // Schedule periodic deep analysis
    this.schedulePeriodicAnalysis();
    console.log('🤖 AI Insights Engine initialized');
  }

  private analyzeEvent(event: AnalyticsEvent) {
    // Trigger analysis with debouncing to avoid overwhelming the system
    const analysisKey = `${event.userId}-${event.eventType}`;
    
    if (this.analysisTimers.has(analysisKey)) {
      clearTimeout(this.analysisTimers.get(analysisKey)!);
    }

    const timer = setTimeout(() => {
      this.performEventAnalysis(event);
      this.analysisTimers.delete(analysisKey);
    }, 5000); // 5-second debounce

    this.analysisTimers.set(analysisKey, timer);
  }

  private async performEventAnalysis(event: AnalyticsEvent) {
    try {
      // Detect anomalies in real-time
      await this.detectAnomalies(event);
      
      // Generate contextual insights
      await this.generateContextualInsights(event);
    } catch (error) {
      console.error('Error in event analysis:', error);
    }
  }

  private async detectAnomalies(event: AnalyticsEvent) {
    const metricValue = this.extractMetricValue(event);
    if (metricValue === null) return;

    // Get historical data for comparison
    const historicalData = await analyticsEventBus.getTimeSeriesData(event.eventType, '7d');
    
    if (historicalData.length < 10) return; // Need enough data for analysis

    const values = historicalData.map(d => d.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Simple anomaly detection using standard deviation
    const threshold = mean + (2 * stdDev); // 2 sigma threshold
    const isAnomaly = metricValue > threshold || metricValue < (mean - 2 * stdDev);

    if (isAnomaly) {
      const anomaly: AnomalyAlert = {
        id: crypto.randomUUID(),
        metric: event.eventType,
        value: metricValue,
        threshold,
        severity: this.calculateSeverity(metricValue, mean, stdDev),
        message: this.generateAnomalyMessage(event.eventType, metricValue, mean),
        timestamp: new Date().toISOString(),
        resolved: false
      };

      this.anomalies.unshift(anomaly);
      console.log('🚨 Anomaly detected:', anomaly);

      // Store anomaly in database
      await this.storeAnomaly(anomaly, event.userId);
    }
  }

  private calculateSeverity(value: number, mean: number, stdDev: number): 'info' | 'warning' | 'critical' {
    const deviations = Math.abs(value - mean) / stdDev;
    
    if (deviations >= 3) return 'critical';
    if (deviations >= 2) return 'warning';
    return 'info';
  }

  private generateAnomalyMessage(eventType: string, value: number, mean: number): string {
    const isHigh = value > mean;
    const eventName = eventType.replace(/_/g, ' ').toLowerCase();
    
    if (isHigh) {
      return `Unusually high ${eventName} detected (${value.toFixed(1)} vs average ${mean.toFixed(1)})`;
    } else {
      return `Unusually low ${eventName} detected (${value.toFixed(1)} vs average ${mean.toFixed(1)})`;
    }
  }

  private async generateContextualInsights(event: AnalyticsEvent) {
    try {
      // Call the existing AI study insights function
      const { data, error } = await supabase.functions.invoke('generate-study-insights', {
        body: {
          userId: event.userId,
          context: {
            recentEvent: event,
            eventType: event.eventType,
            metadata: event.metadata
          }
        }
      });

      if (error) {
        console.error('Error generating AI insights:', error);
        return;
      }

      if (data?.insights) {
        const insights: LearningInsight[] = data.insights.map((insight: any) => ({
          id: crypto.randomUUID(),
          type: insight.type || 'recommendation',
          title: insight.title,
          message: insight.message,
          confidence: insight.confidence || 0.8,
          priority: insight.priority || 'medium',
          actionable: insight.actionable !== false,
          metadata: insight.metadata || {},
          timestamp: new Date().toISOString()
        }));

        insights.forEach(insight => {
          this.insights.unshift(insight);
        });

        // Keep only recent insights
        this.insights = this.insights.slice(0, 100);
        
        console.log('💡 Generated contextual insights:', insights.length);
      }
    } catch (error) {
      console.error('Error in generateContextualInsights:', error);
    }
  }

  private schedulePeriodicAnalysis() {
    // Run deep analysis every hour
    setInterval(async () => {
      try {
        await this.performDeepAnalysis();
      } catch (error) {
        console.error('Error in periodic analysis:', error);
      }
    }, 60 * 60 * 1000); // 1 hour
  }

  private async performDeepAnalysis() {
    console.log('🔍 Performing deep learning analytics...');
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-study-insights', {
        body: {
          analysisType: 'deep',
          timeRange: '7d'
        }
      });

      if (error) {
        console.error('Error in deep analysis:', error);
        return;
      }

      if (data?.insights) {
        const deepInsights: LearningInsight[] = data.insights.map((insight: any) => ({
          id: crypto.randomUUID(),
          type: insight.type || 'pattern',
          title: insight.title,
          message: insight.message,
          confidence: insight.confidence || 0.9,
          priority: insight.priority || 'medium',
          actionable: insight.actionable !== false,
          metadata: { ...insight.metadata, source: 'deep_analysis' },
          timestamp: new Date().toISOString()
        }));

        deepInsights.forEach(insight => {
          this.insights.unshift(insight);
        });

        console.log('🧠 Deep analysis complete:', deepInsights.length, 'insights generated');
      }
    } catch (error) {
      console.error('Error in performDeepAnalysis:', error);
    }
  }

  private extractMetricValue(event: AnalyticsEvent): number | null {
    switch (event.eventType) {
      case 'xp_earned':
        return event.metadata.amount || 0;
      case 'reading_session_end':
        return event.metadata.duration || 0;
      case 'flashcard_reviewed':
        return event.metadata.correct ? 1 : 0;
      case 'study_session_complete':
        return event.metadata.performance?.accuracy || 0;
      default:
        return 1;
    }
  }

  private async storeAnomaly(anomaly: AnomalyAlert, userId: string) {
    try {
      const { error } = await supabase
        .from('anomaly_alerts')
        .insert({
          id: anomaly.id,
          user_id: userId,
          metric_name: anomaly.metric,
          value: anomaly.value,
          threshold: anomaly.threshold,
          severity: anomaly.severity,
          message: anomaly.message,
          resolved: anomaly.resolved
        });

      if (error) {
        console.error('Error storing anomaly:', error);
      }
    } catch (error) {
      console.error('Error in storeAnomaly:', error);
    }
  }

  getRecentInsights(limit = 10): LearningInsight[] {
    return this.insights.slice(0, limit);
  }

  getActiveAnomalies(): AnomalyAlert[] {
    return this.anomalies.filter(a => !a.resolved);
  }

  async resolveAnomaly(anomalyId: string): Promise<void> {
    const anomaly = this.anomalies.find(a => a.id === anomalyId);
    if (anomaly) {
      anomaly.resolved = true;
      
      // Update in database
      await supabase
        .from('anomaly_alerts')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', anomalyId);
    }
  }

  disconnect() {
    // Clean up timers
    this.analysisTimers.forEach(timer => clearTimeout(timer));
    this.analysisTimers.clear();
  }
}

export const aiInsightsEngine = new AIInsightsEngine();
