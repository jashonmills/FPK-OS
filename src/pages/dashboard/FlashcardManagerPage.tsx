
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
      <div className="w-full max-w-none px-2 py-2 sm:px-4 sm:py-4 lg:max-w-7xl lg:mx-auto lg:px-8 lg:py-8">
        <FlashcardManager onBack={handleBack} />
      </div>
    </div>
  );
};

export default FlashcardManagerPage;
