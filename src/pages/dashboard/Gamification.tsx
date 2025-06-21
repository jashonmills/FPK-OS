
import React from 'react';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import { useAccessibility } from '@/hooks/useAccessibility';

const Gamification = () => {
  const { getAccessibilityClasses } = useAccessibility();

  return (
    <div className={`mobile-container mobile-section-spacing ${getAccessibilityClasses('container')}`}>
      <div className="mb-4 sm:mb-6">
        <h1 className={`mobile-heading-xl mb-2 ${getAccessibilityClasses('text')}`}>
          Goals, Achievements & Progress
        </h1>
        <p className={`text-muted-foreground mobile-text-base ${getAccessibilityClasses('text')}`}>
          Track your learning journey, earn XP, unlock badges, and compete with others!
        </p>
      </div>

      <GamificationDashboard />
    </div>
  );
};

export default Gamification;
