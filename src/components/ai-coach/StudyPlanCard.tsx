
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, CheckCircle } from 'lucide-react';

interface StudyPlanCardProps {
  todaysFocus: string[];
}

const StudyPlanCard: React.FC<StudyPlanCardProps> = ({ todaysFocus }) => {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
          <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
          <span className="truncate">AI-Generated Study Plan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6 pt-0">
        <div>
          <h4 className="font-medium mb-2 text-sm sm:text-base">Today's Focus Areas:</h4>
          <div className="space-y-2">
            {todaysFocus.length > 0 ? todaysFocus.map((focus, index) => (
              <div key={index} className="flex items-start gap-2 w-full overflow-hidden">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm leading-relaxed break-words overflow-hidden text-ellipsis line-clamp-2 max-w-full">
                  {focus}
                </span>
              </div>
            )) : (
              <div className="text-center py-3 sm:py-4">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-xs sm:text-sm text-muted-foreground px-2 leading-relaxed break-words">
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
