import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export const ProgressMetricsSection = () => {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Progress Metrics Coming Soon</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Track quantifiable progress metrics like reading levels, behavior frequency, and skill
          acquisition over time.
        </p>
      </CardContent>
    </Card>
  );
};
