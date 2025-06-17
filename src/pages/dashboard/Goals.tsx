
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { Plus } from 'lucide-react';
import GoalStatsGrid from '@/components/goals/GoalStatsGrid';
import GoalTabs from '@/components/goals/GoalTabs';

const Goals = () => {
  const { t, renderText } = useGlobalTranslation('goals');
  const { getAccessibilityClasses } = useAccessibility();
  const [activeTab, setActiveTab] = useState('all');

  // Apply accessibility classes
  const containerClasses = getAccessibilityClasses('container');
  const textClasses = getAccessibilityClasses('text');

  // Mock data for goals
  const mockGoals = [
    {
      id: 1,
      title: 'Complete React Course',
      description: 'Finish all modules in the React course by the end of the month.',
      status: 'in-progress',
      progress: 60,
      dueDate: '2024-08-31',
    },
    {
      id: 2,
      title: 'Study 30 Minutes Daily',
      description: 'Dedicate at least 30 minutes each day to studying new material.',
      status: 'active',
      progress: 30,
      dueDate: '2024-09-15',
    },
    {
      id: 3,
      title: 'Learn a New JavaScript Framework',
      description: 'Explore and understand the basics of Vue.js.',
      status: 'paused',
      progress: 0,
      dueDate: '2024-10-01',
    },
    {
      id: 4,
      title: 'Master TypeScript',
      description: 'Become proficient in TypeScript by completing advanced tutorials.',
      status: 'completed',
      progress: 100,
      dueDate: '2024-07-31',
    },
    {
      id: 5,
      title: 'Contribute to Open Source',
      description: 'Make a meaningful contribution to a project on GitHub.',
      status: 'active',
      progress: 80,
      dueDate: '2024-09-30',
    },
  ];

  return (
    <div className={`p-3 md:p-6 space-y-4 md:space-y-6 ${containerClasses}`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-amber-600 bg-clip-text text-transparent ${textClasses}`}>
            {renderText(t('myGoals'))}
          </h1>
          <p className={`text-gray-600 mt-1 text-sm md:text-base ${textClasses}`}>
            Track your learning objectives and celebrate your achievements.
          </p>
        </div>
        
        <Button className={`gap-2 ${textClasses}`}>
          <Plus className="h-4 w-4" />
          {renderText(t('createNew'))}
        </Button>
      </div>

      {/* Stats Grid */}
      <GoalStatsGrid />

      {/* Goals Tabs */}
      <GoalTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mockGoals={mockGoals} 
      />
    </div>
  );
};

export default Goals;
