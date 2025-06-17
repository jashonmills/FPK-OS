
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { useAccessibility } from '@/hooks/useAccessibility';
import GoalCard from './GoalCard';
import EmptyGoalsState from './EmptyGoalsState';

interface Goal {
  id: number;
  title: string;
  description: string;
  status: string;
  progress: number;
  dueDate: string;
}

interface GoalTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mockGoals: Goal[];
}

const GoalTabs: React.FC<GoalTabsProps> = ({ activeTab, setActiveTab, mockGoals }) => {
  const { t, renderText, tString } = useGlobalTranslation('goals');
  const { getAccessibilityClasses } = useAccessibility();
  const textClasses = getAccessibilityClasses('text');
  const cardClasses = getAccessibilityClasses('card');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className={`w-full ${textClasses}`}>
        <TabsTrigger value="all" className={textClasses}>
          {renderText(t('tabs.all'))}
        </TabsTrigger>
        <TabsTrigger value="active" className={textClasses}>
          {renderText(t('tabs.active'))}
        </TabsTrigger>
        <TabsTrigger value="completed" className={textClasses}>
          {renderText(t('tabs.completed'))}
        </TabsTrigger>
        <TabsTrigger value="paused" className={textClasses}>
          {renderText(t('tabs.paused'))}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {mockGoals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {mockGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <EmptyGoalsState 
            title={tString('empty.allTitle', 'No goals yet')}
            description={tString('empty.allDescription', 'Create your first goal to get started')}
            textClasses={textClasses}
            cardClasses={cardClasses}
          />
        )}
      </TabsContent>

      <TabsContent value="active" className="space-y-4">
        {mockGoals.filter(goal => goal.status === 'active').length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {mockGoals.filter(goal => goal.status === 'active').map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <EmptyGoalsState 
            title={tString('empty.activeTitle', 'No active goals')}
            description={tString('empty.activeDescription', 'Set an active goal to track your progress')}
            textClasses={textClasses}
            cardClasses={cardClasses}
          />
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        {mockGoals.filter(goal => goal.status === 'completed').length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {mockGoals.filter(goal => goal.status === 'completed').map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <EmptyGoalsState 
            title={tString('empty.completedTitle', 'No completed goals')}
            description={tString('empty.completedDescription', 'Complete a goal to see it here')}
            textClasses={textClasses}
            cardClasses={cardClasses}
          />
        )}
      </TabsContent>

      <TabsContent value="paused" className="space-y-4">
        {mockGoals.filter(goal => goal.status === 'paused').length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {mockGoals.filter(goal => goal.status === 'paused').map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <EmptyGoalsState 
            title={tString('empty.pausedTitle', 'No paused goals')}
            description={tString('empty.pausedDescription', 'Paused goals will appear here')}
            textClasses={textClasses}
            cardClasses={cardClasses}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default GoalTabs;
