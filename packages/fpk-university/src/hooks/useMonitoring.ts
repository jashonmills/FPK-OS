
import { useState, useEffect } from 'react';
import { sloMonitoringService } from '@/services/monitoring/SLOMonitoringService';

export const useMonitoring = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const data = sloMonitoringService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to load monitoring data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Listen for real-time updates
    const handleAlert = () => {
      loadData();
    };

    window.addEventListener('slo-alert', handleAlert);

    return () => {
      window.removeEventListener('slo-alert', handleAlert);
    };
  }, []);

  const trackSearch = (query: string, searchType: 'instant' | 'full' = 'full') => {
    sloMonitoringService['conversionTracker'].trackSearch(query, searchType);
  };

  const trackSearchResults = (query: string, resultCount: number, loadTime?: number) => {
    sloMonitoringService['conversionTracker'].trackSearchResults(query, resultCount, loadTime);
  };

  const trackBookDetail = (bookId: string, source: 'search' | 'recommendation' | 'browse' = 'search') => {
    sloMonitoringService['conversionTracker'].trackBookDetail(bookId, source);
  };

  const trackReadingStart = (bookId: string, format: 'epub' | 'pdf', loadTime?: number) => {
    sloMonitoringService['conversionTracker'].trackReadingStart(bookId, format, loadTime);
  };

  const trackReadingComplete = (bookId: string, totalTime: number, completionRate: number) => {
    sloMonitoringService['conversionTracker'].trackReadingComplete(bookId, totalTime, completionRate);
  };

  const recordCustomMetric = (name: string, value: number) => {
    sloMonitoringService['webVitalsTracker'].recordCustomMetric(name, value);
  };

  return {
    dashboardData,
    isLoading,
    trackSearch,
    trackSearchResults,
    trackBookDetail,
    trackReadingStart,
    trackReadingComplete,
    recordCustomMetric,
    getSLOStatus: () => sloMonitoringService.getSLOStatus(),
    getAlerts: () => sloMonitoringService.getAlerts(),
    acknowledgeAlert: (id: string) => sloMonitoringService.acknowledgeAlert(id)
  };
};
