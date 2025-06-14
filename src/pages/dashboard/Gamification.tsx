
import React from 'react';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import { useAccessibility } from '@/hooks/useAccessibility';

const Gamification = () => {
  const { getAccessibilityClasses } = useAccessibility();

  return (
    <div className={`container mx-auto p-4 sm:p-6 lg:p-8 ${getAccessibilityClasses('container')}`}>
      <div className="mb-6">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${getAccessibilityClasses('text')}`}>
          Achievements & Progress
        </h1>
        <p className={`text-muted-foreground ${getAccessibilityClasses('text')}`}>
          Track your learning journey, earn XP, unlock badges, and compete with others!
        </p>
      </div>

      <GamificationDashboard />
    </div>
  );
};

export default Gamification;
