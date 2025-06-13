import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useFlashcardSets } from '@/hooks/useFlashcardSets';
import { useStudySessions } from '@/hooks/useStudySessions';
import { BookOpen, Brain, Play, Settings, Plus, FileText, Clock, Target } from 'lucide-react';
import FlashcardSelectionModal from '@/components/study/FlashcardSelectionModal';
import type { Flashcard } from '@/hooks/useFlashcards';

const FlashcardsSection = () => {
  const navigate = useNavigate();
  const { flashcards } = useFlashcards();
  const { sets } = useFlashcardSets();
  const { createSession } = useStudySessions();
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectedStudyMode, setSelectedStudyMode] = useState<'memory_test' | 'multiple_choice' | 'timed_challenge'>('memory_test');
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const totalCards = flashcards.length;
  const totalSets = sets.length;

  const handleManageFlashcards = () => {
    navigate('/dashboard/learner/flashcards');
  };

  const handleStartStudy = (mode: 'memory_test' | 'multiple_choice' | 'timed_challenge') => {
    if (totalCards === 0) {
      return;
    }
    setSelectedStudyMode(mode);
    setShowSelectionModal(true);
  };

  const handleStudyConfirm = async (selectedFlashcards: Flashcard[]) => {
    setIsCreatingSession(true);
    
    try {
      console.log('Creating study session for', selectedStudyMode, 'with', selectedFlashcards.length, 'cards');
      
      // Create the study session first
      const session = await createSession({
        session_type: selectedStudyMode,
        flashcard_ids: selectedFlashcards.map(card => card.id),
        total_cards: selectedFlashcards.length
      });

      console.log('Created session:', session);
      
      setShowSelectionModal(false);
      
      // Navigate to study session with both session and flashcards
      const routeMap = {
        memory_test: '/study/memory-test',
        multiple_choice: '/study/multiple-choice',
        timed_challenge: '/study/timed-challenge'
      };
      
      console.log('Navigating to', routeMap[selectedStudyMode], 'with session and flashcards');
      
      navigate(routeMap[selectedStudyMode], { 
        state: { 
          session: session,
          flashcards: selectedFlashcards 
        } 
      });
    } catch (error) {
      console.error('Error creating study session:', error);
      alert('Failed to start study session. Please try again.');
    } finally {
      setIsCreatingSession(false);
    }
  };

  return (
    <>
      <Card className="fpk-card border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Smart Flashcards
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Practice with AI-generated and custom flashcards
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {totalCards} cards
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Cards</span>
              </div>
              <p className="text-lg font-bold text-blue-700 mt-1">{totalCards}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Study Sets</span>
              </div>
              <p className="text-lg font-bold text-green-700 mt-1">{totalSets}</p>
            </div>
          </div>

          {/* Study Mode Buttons */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Choose Study Mode</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={() => handleStartStudy('memory_test')}
                disabled={totalCards === 0}
                className="flex flex-col items-center gap-2 h-auto py-3 bg-blue-600 hover:bg-blue-700"
              >
                <Brain className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium">Memory Test</div>
                  <div className="text-xs opacity-90">Flip & recall</div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleStartStudy('multiple_choice')}
                disabled={totalCards === 0}
                className="flex flex-col items-center gap-2 h-auto py-3 bg-green-600 hover:bg-green-700"
              >
                <Target className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium">Multiple Choice</div>
                  <div className="text-xs opacity-90">Pick the answer</div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleStartStudy('timed_challenge')}
                disabled={totalCards === 0}
                className="flex flex-col items-center gap-2 h-auto py-3 bg-orange-600 hover:bg-orange-700"
              >
                <Clock className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium">Timed Challenge</div>
                  <div className="text-xs opacity-90">Beat the clock</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Management Button */}
          <div className="pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handleManageFlashcards}
              className="w-full flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Manage Flashcards
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs"
                onClick={() => navigate('/dashboard/learner/notes')}
              >
                <Plus className="h-3 w-3 mr-1" />
                Create from Notes
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs"
                onClick={handleManageFlashcards}
              >
                <FileText className="h-3 w-3 mr-1" />
                Upload & Generate
              </Button>
            </div>
          </div>

          {totalCards === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm mb-2">No flashcards yet</p>
              <p className="text-xs text-gray-400">
                Create notes or upload files to generate flashcards
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <FlashcardSelectionModal
        isOpen={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        onConfirm={handleStudyConfirm}
        studyMode={selectedStudyMode}
      />
    </>
  );
};

export default FlashcardsSection;
