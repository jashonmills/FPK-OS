
import React, { useEffect } from 'react';
import { useMonitoring } from '@/hooks/useMonitoring';
import { performanceService } from '@/services/PerformanceOptimizationService';

interface LibraryWithMonitoringProps {
  children: React.ReactNode;
}

const LibraryWithMonitoring: React.FC<LibraryWithMonitoringProps> = ({ children }) => {
  const { trackSearch, trackSearchResults, trackBookDetail, recordCustomMetric } = useMonitoring();

  useEffect(() => {
    // Track page load performance
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      recordCustomMetric('library_page_load', loadTime);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [recordCustomMetric]);

  // Wrap search functionality
  const monitoredSearch = React.useCallback((query: string, resultCount: number, loadTime?: number) => {
    trackSearch(query);
    if (loadTime !== undefined) {
      trackSearchResults(query, resultCount, loadTime);
    }
  }, [trackSearch, trackSearchResults]);

  // Wrap book detail viewing
  const monitoredBookView = React.useCallback((bookId: string, source: 'search' | 'recommendation' | 'browse' = 'search') => {
    trackBookDetail(bookId, source);
  }, [trackBookDetail]);

  return (
    <div data-monitoring="enabled">
      {React.cloneElement(children as React.ReactElement, {
        onSearch: monitoredSearch,
        onBookView: monitoredBookView
      })}
    </div>
  );
};

export default LibraryWithMonitoring;
