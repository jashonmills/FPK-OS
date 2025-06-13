
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/hooks/useAccessibility';
import FlashcardManager from '@/components/flashcards/FlashcardManager';

const FlashcardManagerPage = () => {
  const navigate = useNavigate();
  const { getAccessibilityClasses } = useAccessibility();

  const handleBack = () => {
    navigate('/dashboard/learner/notes');
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${getAccessibilityClasses('container')}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <FlashcardManager onBack={handleBack} />
      </div>
    </div>
  );
};

export default FlashcardManagerPage;
