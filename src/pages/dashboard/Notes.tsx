
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccessibility } from '@/hooks/useAccessibility';
import DualLanguageText from '@/components/DualLanguageText';
import NotesSection from '@/components/notes/NotesSection';
import FlashcardsSection from '@/components/notes/FlashcardsSection';
import FileUploadSection from '@/components/notes/FileUploadSection';
import ProgressSection from '@/components/notes/ProgressSection';
import FlashcardPreviewModule from '@/components/notes/FlashcardPreviewModule';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Notes = () => {
  const { getAccessibilityClasses } = useAccessibility();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('all');

  // Handle URL parameters on component mount
  useEffect(() => {
    const filter = searchParams.get('filter');
    const noteId = searchParams.get('noteId');
    
    if (filter === 'ai-insights') {
      setActiveTab('ai-insights');
    } else if (noteId) {
      setActiveTab('all');
      // Note ID will be handled by NotesSection component
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without noteId when switching tabs
    const newParams = new URLSearchParams();
    if (value === 'ai-insights') {
      newParams.set('filter', 'ai-insights');
    }
    setSearchParams(newParams);
  };

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

      {/* Notes Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Notes</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="study">Study Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6">
              <NotesSection filterCategory={null} highlightNoteId={searchParams.get('noteId')} />
              <FileUploadSection />
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              <FlashcardsSection />
              <ProgressSection />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6">
              <NotesSection filterCategory="ai-insights" highlightNoteId={searchParams.get('noteId')} />
              <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">AI Learning Coach Insights</h3>
                <p className="text-sm text-purple-700">
                  Notes saved from your AI Learning Coach conversations appear here. 
                  These insights are automatically tagged for easy organization.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              <FlashcardsSection />
              <ProgressSection />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="study" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6">
              <NotesSection filterCategory="study" highlightNoteId={null} />
              <FileUploadSection />
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              <FlashcardsSection />
              <ProgressSection />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notes;
