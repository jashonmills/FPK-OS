
import React from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import DualLanguageText from '@/components/DualLanguageText';
import NotesSection from '@/components/notes/NotesSection';
import FlashcardsSection from '@/components/notes/FlashcardsSection';
import FileUploadSection from '@/components/notes/FileUploadSection';
import ProgressSection from '@/components/notes/ProgressSection';
import FlashcardPreviewModule from '@/components/notes/FlashcardPreviewModule';

const Notes = () => {
  const { getAccessibilityClasses } = useAccessibility();

  return (
    <div className={`p-3 sm:p-6 space-y-4 sm:space-y-6 ${getAccessibilityClasses('container')}`}>
      {/* Header Section */}
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          <DualLanguageText translationKey="nav.notes" fallback="Notes & Flashcards" />
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
          Create study notes, generate flashcards, and track your learning progress with our comprehensive study tools.
        </p>
        <div className="text-xs sm:text-sm text-gray-500 space-y-1">
          <p>Take notes and organize your learning materials</p>
          <p>Generate flashcards from uploaded documents</p>
          <p>Practice with multiple study modes and track progress</p>
        </div>
      </div>

      {/* Flashcard Preview Module - Always visible when there are preview cards */}
      <FlashcardPreviewModule />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="space-y-4 sm:space-y-6">
          <NotesSection />
          <FileUploadSection />
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          <FlashcardsSection />
          <ProgressSection />
        </div>
      </div>
    </div>
  );
};

export default Notes;
