import { Card } from "@/components/ui/card";
import { usePhoenixPerformanceAnalytics } from "@/hooks/usePhoenixPerformanceAnalytics";
import { Activity, Clock, Zap, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function PerformanceDashboard() {
  const { data: performance, isLoading } = usePhoenixPerformanceAnalytics(7);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Performance Metrics</h3>
        </div>
        <p className="text-sm text-muted-foreground">Loading analytics data...</p>
      </Card>
    );
  }

  if (!performance) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Performance Metrics</h3>
        </div>
        <p className="text-sm text-muted-foreground">No data available yet</p>
      </Card>
    );
  }

  const stepData = [
    { name: 'Context', value: performance.stepBreakdown?.contextLoading || 0, color: '#8884d8' },
    { name: 'Intent', value: performance.stepBreakdown?.intentDetection || 0, color: '#82ca9d' },
    { name: 'LLM', value: performance.stepBreakdown?.llmResponse || 0, color: '#ffc658' },
    { name: 'Governor', value: performance.stepBreakdown?.governorCheck || 0, color: '#ff8042' },
    { name: 'TTS', value: performance.stepBreakdown?.ttsGeneration || 0, color: '#a4de6c' },
  ];

  return (
    <Card className="p-6 col-span-2">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Performance Metrics</h3>
        <span className="text-xs text-muted-foreground ml-auto">Last 7 days</span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Avg Latency</p>
          </div>
          <p className="text-2xl font-bold">{performance.avgLatency}ms</p>
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">TTFT</p>
          </div>
          <p className="text-2xl font-bold">{performance.avgTTFT}ms</p>
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">P90 Latency</p>
          </div>
          <p className="text-2xl font-bold">{Math.round(performance.p90Latency)}ms</p>
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-xs text-muted-foreground">Error Rate</p>
          </div>
          <p className="text-2xl font-bold">{performance.errorRate}%</p>
        </div>
      </div>

      {/* Step Breakdown Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Latency Breakdown by Step</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stepData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {stepData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Persona Breakdown */}
      {performance.byPersona && (
        <div>
          <h4 className="text-sm font-medium mb-3">Performance by Persona</h4>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(performance.byPersona).map(([persona, stats]) => (
              <div key={persona} className="p-3 rounded-lg border">
                <p className="text-sm font-medium mb-2">{persona}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.count} requests • {stats.avgLatency}ms avg
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.errorRate}% errors
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}