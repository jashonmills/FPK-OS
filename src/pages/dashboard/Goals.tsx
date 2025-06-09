
import React from 'react';
import { XPTracker } from '@/components/goals/XPTracker';
import { ActiveGoalsList } from '@/components/goals/ActiveGoalsList';
import { AchievementsList } from '@/components/goals/AchievementsList';
import { GoalReminders } from '@/components/goals/GoalReminders';

const Goals = () => {
  return (
    <div className="p-6">
      {/* Hero Section with XP Tracker */}
      <XPTracker />
      
      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Active Learning Goals */}
        <div className="lg:col-span-1">
          <ActiveGoalsList />
        </div>
        
        {/* Center Column - Achievements & Rewards */}
        <div className="lg:col-span-1">
          <AchievementsList />
        </div>
        
        {/* Right Column - Goal Reminders */}
        <div className="lg:col-span-1">
          <GoalReminders />
        </div>
      </div>
    </div>
  );
};

export default Goals;
