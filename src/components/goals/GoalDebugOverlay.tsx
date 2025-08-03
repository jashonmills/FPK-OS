import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bug, RefreshCw } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';

interface GoalDebugOverlayProps {
  show: boolean;
  onToggle: () => void;
}

const GoalDebugOverlay: React.FC<GoalDebugOverlayProps> = ({ show, onToggle }) => {
  const { goals, loading, error, refetchGoals } = useGoals();

  if (!show) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggle}
          size="sm"
          variant="outline"
          className="bg-white shadow-lg"
        >
          <Bug className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="bg-white shadow-xl border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Goals Debug Info
            </span>
            <div className="flex gap-2">
              <Button
                onClick={refetchGoals}
                size="sm"
                variant="outline"
                className="h-6 px-2"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button
                onClick={onToggle}
                size="sm"
                variant="ghost"
                className="h-6 px-2"
              >
                ×
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Badge variant="secondary" className="text-xs">
                Total: {goals?.length || 0}
              </Badge>
            </div>
            <div>
              <Badge variant="secondary" className="text-xs">
                Loading: {loading ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
          
          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 font-medium">Error:</p>
              <p className="text-red-500">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <p className="font-medium">Goal Breakdown:</p>
            {goals?.map(goal => (
              <div key={goal.id} className="p-2 bg-gray-50 rounded">
                <div className="flex justify-between">
                  <span className="font-medium">{goal.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {goal.status}
                  </Badge>
                </div>
                <div className="text-gray-500 mt-1">
                  Category: {goal.category} | Progress: {goal.progress}%
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t">
            <p className="text-gray-500">
              Last Update: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalDebugOverlay;