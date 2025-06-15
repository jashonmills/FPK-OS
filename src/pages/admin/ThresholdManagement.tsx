
import React from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import ThresholdManagement from '@/components/admin/ThresholdManagement';

const ThresholdManagementPage = () => {
  const { getAccessibilityClasses } = useAccessibility();

  return (
    <div className={`min-h-screen bg-background ${getAccessibilityClasses('container')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ThresholdManagement />
      </div>
    </div>
  );
};

export default ThresholdManagementPage;
