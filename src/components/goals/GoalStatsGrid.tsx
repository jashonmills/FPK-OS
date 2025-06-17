
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { Target, Flag, CheckCircle, TrendingUp } from 'lucide-react';

const GoalStatsGrid = () => {
  const { t, renderText } = useGlobalTranslation('goals');
  const { getAccessibilityClasses } = useAccessibility();
  const cardClasses = getAccessibilityClasses('card');
  const textClasses = getAccessibilityClasses('text');

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <Card className={`fpk-card ${cardClasses}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs md:text-sm font-medium text-gray-600 ${textClasses}`}>
                {renderText(t('stats.totalGoals'))}
              </p>
              <p className={`text-xl md:text-2xl font-bold ${textClasses}`}>12</p>
            </div>
            <Target className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className={`fpk-card ${cardClasses}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs md:text-sm font-medium text-gray-600 ${textClasses}`}>
                {renderText(t('stats.activeGoals'))}
              </p>
              <p className={`text-xl md:text-2xl font-bold ${textClasses}`}>7</p>
            </div>
            <Flag className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className={`fpk-card ${cardClasses}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs md:text-sm font-medium text-gray-600 ${textClasses}`}>
                {renderText(t('stats.completedGoals'))}
              </p>
              <p className={`text-xl md:text-2xl font-bold ${textClasses}`}>5</p>
            </div>
            <CheckCircle className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className={`fpk-card ${cardClasses}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs md:text-sm font-medium text-gray-600 ${textClasses}`}>
                {renderText(t('stats.completionRate'))}
              </p>
              <p className={`text-xl md:text-2xl font-bold ${textClasses}`}>68%</p>
            </div>
            <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-amber-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalStatsGrid;
