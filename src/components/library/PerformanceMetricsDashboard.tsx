
import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import { PublicDomainBook } from '@/types/publicDomainBooks';

interface PerformanceMetricsDashboardProps {
  performanceMetrics: any;
  browsingAnalytics: any;
  prefetchSuggestions: PublicDomainBook[];
}

const PerformanceMetricsDashboard: React.FC<PerformanceMetricsDashboardProps> = ({
  performanceMetrics,
  browsingAnalytics,
  prefetchSuggestions
}) => {
  if (!performanceMetrics && !browsingAnalytics) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-green-800">Phase 4: Search & UX Optimizations Active</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {performanceMetrics && (
          <>
            <div className="text-green-700">
              <span className="font-medium">Search Index:</span> {performanceMetrics.prefetchedBooksCount} books
            </div>
            <div className="text-green-700">
              <span className="font-medium">Instant Search:</span> Enabled
            </div>
          </>
        )}
        
        {browsingAnalytics && (
          <>
            <div className="text-blue-700">
              <span className="font-medium">Session Events:</span> {browsingAnalytics.currentSession.eventCount}
            </div>
            <div className="text-blue-700">
              <span className="font-medium">Smart Prefetch:</span> {prefetchSuggestions.length} books
            </div>
          </>
        )}
      </div>

      {/* Browsing Patterns */}
      {browsingAnalytics?.currentSession?.patterns?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Detected Patterns:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {browsingAnalytics.currentSession.patterns.map((pattern: string, index: number) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
              >
                {pattern.replace(':', ': ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetricsDashboard;
