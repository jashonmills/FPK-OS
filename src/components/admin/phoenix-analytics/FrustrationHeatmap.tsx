import { Card } from "@/components/ui/card";
import { useFrustrationReport } from "@/hooks/usePhoenixPerformanceAnalytics";
import { AlertTriangle, TrendingUp, MessageSquare } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  escape_hatch: '#ef4444',
  correction: '#f97316',
  confusion: '#eab308',
  repetition: '#3b82f6',
  frustration: '#8b5cf6'
};

export function FrustrationHeatmap() {
  const { data: frustration, isLoading } = useFrustrationReport(7);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-semibold">User Frustration Analytics</h3>
        </div>
        <p className="text-sm text-muted-foreground">Loading frustration data...</p>
      </Card>
    );
  }

  if (!frustration || frustration.totalEvents === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-semibold">User Frustration Analytics</h3>
        </div>
        <p className="text-sm text-muted-foreground">No frustration events detected yet 🎉</p>
      </Card>
    );
  }

  const feedbackData = frustration.feedbackDistribution 
    ? Object.entries(frustration.feedbackDistribution).map(([type, count]) => ({
        name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: count as number,
        color: COLORS[type as keyof typeof COLORS] || '#94a3b8'
      }))
    : [];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <h3 className="text-lg font-semibold">User Frustration Analytics</h3>
        <span className="text-xs text-muted-foreground ml-auto">Last 7 days</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Total Events</p>
          <p className="text-2xl font-bold">{frustration.totalEvents}</p>
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Escape Hatch Rate</p>
          <p className="text-2xl font-bold text-destructive">{frustration.escapeHatchRate}%</p>
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Avg Turns Before</p>
          <p className="text-2xl font-bold">{frustration.avgTurnsBeforeFrustration}</p>
        </div>
      </div>

      {/* Feedback Distribution Chart */}
      {feedbackData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3">Feedback Type Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={feedbackData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {feedbackData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Persona Breakdown */}
      {frustration.byPersona && Object.keys(frustration.byPersona).length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3">Frustration by Persona</h4>
          <div className="space-y-2">
            {Object.entries(frustration.byPersona).map(([persona, stats]) => (
              <div key={persona} className="flex items-center justify-between p-2 rounded-lg border">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{persona}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {stats.count} events • {stats.avgTurns} avg turns
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Feedback */}
      {frustration.recentFeedback && frustration.recentFeedback.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Recent Feedback</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {frustration.recentFeedback.slice(0, 5).map((feedback, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-muted/50 text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium text-xs uppercase">{feedback.type.replace('_', ' ')}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    Turn {feedback.turns}
                  </span>
                </div>
                <p className="text-muted-foreground line-clamp-2">{feedback.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}