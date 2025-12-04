import React from 'react';
import StudyPlanCard from '@/components/ai-coach/StudyPlanCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Zap, TrendingUp } from 'lucide-react';

export function InsightsPanel() {
  return (
    <div className="h-full overflow-y-auto space-y-4 pr-2">
      <StudyPlanCard todaysFocus={[]} />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Learning Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              Analytics will appear here as you interact with your AI coach
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4" />
            Quick Drills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              Practice drills will be suggested based on your learning
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
