
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, CheckCircle } from 'lucide-react';

interface StudyPlanCardProps {
  todaysFocus: string[];
}

const StudyPlanCard: React.FC<StudyPlanCardProps> = ({ todaysFocus }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-purple-600" />
          AI-Generated Study Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Today's Focus Areas:</h4>
          <div className="space-y-2">
            {todaysFocus.length > 0 ? todaysFocus.map((focus, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">{focus}</span>
              </div>
            )) : (
              <div className="text-center py-4">
                <Brain className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-muted-foreground">
                  Complete a study session to get personalized recommendations
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyPlanCard;
