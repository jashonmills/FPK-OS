// src/components/analytics/IntelligentChartGrid.tsx
// FORGED VERSION - BUILT FOR LOVABLE.DEV

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client'; // The "Lovable Way" import
import { Loader2 } from 'lucide-react';
import { MasteryGaugeChart } from './MasteryGaugeChart';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Define the structure of the data we expect from the bedrock_metrics table
interface Metric {
  id: string;
  metric_name: string;
  metric_value: number;
  measurement_date: string;
  target_value?: number;
  unit?: string;
}

interface IntelligentChartGridProps {
  clientId: string;
}

export const IntelligentChartGrid = ({ clientId }: IntelligentChartGridProps) => {
  // Use a robust useQuery hook to fetch data
  const { data: metrics, isLoading, isError, error } = useQuery<Metric[]>({
    queryKey: ['bedrock_metrics', clientId], // Unique query key
    queryFn: async () => {
      if (!clientId) return []; // Don't fetch if there's no client ID

      const { data, error } = await supabase
        .from('bedrock_metrics')
        .select('*')
        .eq('client_id', clientId)
        .order('measurement_date', { ascending: false });

      if (error) {
        console.error('Error fetching bedrock_metrics:', error);
        throw new Error(error.message); // Throw error to be caught by isError state
      }
      return data || [];
    },
    enabled: !!clientId, // Ensures the query only runs when clientId is available
  });

  // --- ROBUST RENDER STATES ---

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /> <span className="ml-2">Loading Intelligent Charts...</span></div>;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load intelligent charts. Error: {error.message}</AlertDescription>
      </Alert>
    );
  }

  // --- INTELLIGENT FILTERING LOGIC ---

  const displayedMetrics = new Set<string>();
  const masteryMetrics = metrics.filter(metric => {
    // Skip if we've already shown this metric (we only want the latest one)
    if (displayedMetrics.has(metric.metric_name)) {
      return false;
    }

    // Check if it's a metric we can display in a gauge chart
    const isMasteryMetric = (
      metric.metric_name.toLowerCase().includes('mastery') || 
      metric.metric_name.toLowerCase().includes('accuracy')
    ) && (metric.unit === '%' || (metric.metric_value >= 0 && metric.metric_value <= 100));
    
    if (isMasteryMetric) {
      displayedMetrics.add(metric.metric_name); // Mark this metric as displayed
      return true;
    }
    return false;
  });

  if (masteryMetrics.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No applicable mastery or accuracy metrics were found to display as charts.</AlertDescription>
      </Alert>
    );
  }

  // --- RENDER THE GRID ---

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {masteryMetrics.map((metric) => (
        <MasteryGaugeChart
          key={metric.id}
          metric={{
            title: metric.metric_name,
            percentage: metric.metric_value,
            description: `Last measured on ${new Date(metric.measurement_date).toLocaleDateString()}`,
            target_value: metric.target_value,
            unit: metric.unit,
          }}
        />
      ))}
    </div>
  );
};
