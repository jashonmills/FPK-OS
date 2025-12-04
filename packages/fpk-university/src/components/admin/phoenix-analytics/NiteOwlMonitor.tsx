import { Card } from "@/components/ui/card";
import { useNiteOwlEffectiveness } from "@/hooks/usePhoenixPerformanceAnalytics";
import { Moon, TrendingUp, Clock, Target } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const TRIGGER_COLORS = {
  random_timer: '#3b82f6',
  struggle_detected: '#f97316',
  manual_override: '#8b5cf6'
};

export function NiteOwlMonitor() {
  const { data: niteOwl, isLoading } = useNiteOwlEffectiveness(7);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Nite Owl Effectiveness</h3>
        </div>
        <p className="text-sm text-muted-foreground">Loading Nite Owl data...</p>
      </Card>
    );
  }

  if (!niteOwl || niteOwl.totalTriggers === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Nite Owl Effectiveness</h3>
        </div>
        <p className="text-sm text-muted-foreground">No Nite Owl triggers yet</p>
      </Card>
    );
  }

  const triggerData = niteOwl.triggerReasons
    ? Object.entries(niteOwl.triggerReasons).map(([reason, count]) => ({
        name: reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: count as number,
        color: TRIGGER_COLORS[reason as keyof typeof TRIGGER_COLORS] || '#94a3b8'
      }))
    : [];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Moon className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Nite Owl Effectiveness</h3>
        <span className="text-xs text-muted-foreground ml-auto">Last 7 days</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Total Triggers</p>
          </div>
          <p className="text-2xl font-bold">{niteOwl.totalTriggers}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Avg {niteOwl.avgTurnsBetween} turns between
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-success" />
            <p className="text-xs text-muted-foreground">Engagement Rate</p>
          </div>
          <p className="text-2xl font-bold text-success">{niteOwl.engagementRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            Users continued after Nite Owl
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Avg Response Time</p>
          </div>
          <p className="text-2xl font-bold">{niteOwl.avgResponseTime}s</p>
          <p className="text-xs text-muted-foreground mt-1">
            Time to next user message
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-success" />
            <p className="text-xs text-muted-foreground">Helpful Rate</p>
          </div>
          <p className="text-2xl font-bold text-success">{niteOwl.helpfulRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            Quick engagement after appearance
          </p>
        </div>
      </div>

      {/* Trigger Reasons Chart */}
      {triggerData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3">Trigger Reason Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={triggerData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {triggerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Analysis */}
      <div className="p-4 rounded-lg bg-muted/30 border">
        <h4 className="text-sm font-semibold mb-2">Analysis</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          {niteOwl.sessionEndRate > 30 && (
            <p className="flex items-start gap-2">
              <span className="text-warning">⚠️</span>
              <span>High session end rate ({niteOwl.sessionEndRate}%) - Nite Owl may be interrupting at wrong times</span>
            </p>
          )}
          {niteOwl.engagementRate > 70 && (
            <p className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <span>Strong engagement rate - Nite Owl is helping users stay engaged</span>
            </p>
          )}
          {niteOwl.avgTurnsBetween < 3 && (
            <p className="flex items-start gap-2">
              <span className="text-warning">⚠️</span>
              <span>Very frequent appearances - consider increasing spacing between triggers</span>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}