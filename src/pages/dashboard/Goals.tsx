
import React from 'react';
import { GoalsDashboard } from '@/components/goals/GoalsDashboard';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';

const Goals = () => {
  const { t } = useDualLanguage();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <DualLanguageText translationKey="nav.goals" fallback="Goals" />
        </h1>
        <p className="text-gray-600">
          <DualLanguageText 
            translationKey="goals.description" 
            fallback="Track your learning objectives and celebrate your progress" 
          />
        </p>
      </div>
      <GoalsDashboard />
    </div>
  );
};

export default Goals;
