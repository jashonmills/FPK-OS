import { Card } from "@/components/ui/card";
import { useIntentAccuracy } from "@/hooks/usePhoenixPerformanceAnalytics";
import { Target, AlertCircle, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function IntentAccuracyChart() {
  const { data: intentData, isLoading } = useIntentAccuracy(7);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Intent Detection Accuracy</h3>
        </div>
        <p className="text-sm text-muted-foreground">Loading intent data...</p>
      </Card>
    );
  }

  if (!intentData || intentData.totalIntents === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Intent Detection Accuracy</h3>
        </div>
        <p className="text-sm text-muted-foreground">No intent data available yet</p>
      </Card>
    );
  }

  const intentDistributionData = intentData.intentDistribution
    ? Object.entries(intentData.intentDistribution).map(([intent, count]) => ({
        name: intent,
        value: count as number
      })).sort((a, b) => b.value - a.value).slice(0, 8)
    : [];

  const misinterpretedData = intentData.topMisinterpretedIntents || [];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Intent Detection Accuracy</h3>
        <span className="text-xs text-muted-foreground ml-auto">Last 7 days</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Total Intents Detected</p>
          <p className="text-2xl font-bold">{intentData.totalIntents}</p>
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-xs text-muted-foreground">Misinterpretation Rate</p>
          </div>
          <p className="text-2xl font-bold text-destructive">{intentData.misinterpretationRate}%</p>
        </div>
      </div>

      {/* Intent Distribution Chart */}
      {intentDistributionData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3">Top Detected Intents</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={intentDistributionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Misinterpreted Intents */}
      {misinterpretedData.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-warning" />
            Most Misinterpreted Intents
          </h4>
          <div className="space-y-2">
            {misinterpretedData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">{item.intent}</p>
                  <p className="text-xs text-muted-foreground">{item.count} occurrences</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-destructive">{item.rate.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">error rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}