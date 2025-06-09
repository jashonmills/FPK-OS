
import React from 'react';
import { XPTracker } from '@/components/goals/XPTracker';
import { ActiveGoalsList } from '@/components/goals/ActiveGoalsList';
import { AchievementsList } from '@/components/goals/AchievementsList';
import { GoalReminders } from '@/components/goals/GoalReminders';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Goals = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  console.log('Goals page - User:', user);
  console.log('Goals page - Loading:', loading);

  if (loading) {
    return (
      <div className="p-6">
        <div className="fpk-gradient text-white p-6 rounded-lg mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-4"></div>
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-6 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Please log in to view your goals and XP tracker.</p>
        </div>
      </div>
    );
  }

  console.log('Goals page - Rendering main content for user:', user.id);

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
