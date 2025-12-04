import { useState, useEffect, useCallback } from 'react';
import { systemDiagnostics } from '@/utils/systemDiagnostics';

interface SystemHealth {
  overallScore: number;
  issues: Array<{
    category: string;
    issue: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'detected' | 'fixed' | 'monitoring';
    details: string;
    recommendation?: string;
  }>;
  memoryUsage: number;
  performanceScore: number;
  networkHealth: number;
  recommendations: string[];
}

export const useSystemDiagnostics = () => {
  const [healthData, setHealthData] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [criticalIssues, setCriticalIssues] = useState(0);

  const runDiagnostics = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await systemDiagnostics.runFullDiagnostics();
      setHealthData(results);
      setLastUpdate(new Date());
      setCriticalIssues(results.issues.filter(i => i.severity === 'critical').length);
    } catch (error) {
      console.error('Failed to run system diagnostics:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for automatic health alerts
  useEffect(() => {
    const handleHealthAlert = (event: CustomEvent) => {
      setHealthData(event.detail);
      setLastUpdate(new Date());
      setCriticalIssues(event.detail.issues.filter((i: any) => i.severity === 'critical').length);
    };

    window.addEventListener('system-health-alert', handleHealthAlert as EventListener);
    return () => window.removeEventListener('system-health-alert', handleHealthAlert as EventListener);
  }, []);

  // Initial load
  useEffect(() => {
    runDiagnostics();
  }, [runDiagnostics]);

  const getHealthStatus = useCallback(() => {
    if (!healthData) return 'unknown';
    if (criticalIssues > 0) return 'critical';
    if (healthData.overallScore < 70) return 'warning';
    if (healthData.overallScore < 90) return 'good';
    return 'excellent';
  }, [healthData, criticalIssues]);

  const hasIssues = useCallback(() => {
    return healthData?.issues.length ?? 0 > 0;
  }, [healthData]);

  const getCriticalIssues = useCallback(() => {
    return healthData?.issues.filter(i => i.severity === 'critical') ?? [];
  }, [healthData]);

  return {
    healthData,
    isLoading,
    lastUpdate,
    criticalIssues,
    runDiagnostics,
    getHealthStatus,
    hasIssues,
    getCriticalIssues
  };
};