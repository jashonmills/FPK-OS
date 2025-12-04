import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle } from 'lucide-react';
import { useAIInbox } from '@/hooks/useAIInbox';

interface AIInsightsDashboardProps {
  orgId?: string;
  cohortId?: string;
  role?: 'admin' | 'instructor' | 'owner';
}

export const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({
  orgId,
  cohortId,
  role = 'instructor'
}) => {
  const { inboxCards, isLoading } = useAIInbox({ 
    org_id: orgId, 
    cohort_id: cohortId, 
    limit: 10 
  });

  const highPriorityCards = inboxCards.filter(
    card => card.severity === 'high' || card.severity === 'critical'
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">AI Learning Insights</h2>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-muted rounded-lg" />
          <div className="h-20 bg-muted rounded-lg" />
          <div className="h-20 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI Learning Insights</h2>
        <Badge variant="outline">
          {role === 'admin' ? 'Platform View' : 'Organization View'}
        </Badge>
      </div>

      <div className="grid gap-4">
        {highPriorityCards.length > 0 ? (
          highPriorityCards.map((card) => (
            <Card key={card.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <Badge 
                    variant={card.severity === 'critical' ? 'destructive' : 'secondary'}
                  >
                    {card.severity}
                  </Badge>
                </div>
                {card.subtitle && (
                  <p className="text-sm text-muted-foreground">{card.subtitle}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {card.why && card.why.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Why this matters:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {card.why.map((reason, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 mt-0.5 text-warning" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Confidence:</span>
                    <Badge variant="outline">
                      {Math.round(card.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No high-priority insights</p>
              <p className="text-muted-foreground">
                All systems are running smoothly. Check back later for updates.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};