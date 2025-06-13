import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useStudySessions } from '@/hooks/useStudySessions';
import { Brain, Target, Clock, Play, RotateCcw } from 'lucide-react';
import FlashcardReview from '../study/FlashcardReview';
import FlashcardSelectionModal from '../study/FlashcardSelectionModal';
import type { Flashcard } from '@/hooks/useFlashcards';

const FlashcardsSection: React.FC = () => {
  const { flashcards, isLoading } = useFlashcards();
  const { createSession, isCreating } = useStudySessions();
  const [showReview, setShowReview] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectedStudyMode, setSelectedStudyMode] = useState<'memory_test' | 'multiple_choice' | 'timed_challenge'>('memory_test');
  const navigate = useNavigate();

  const handleStudyModeClick = (mode: 'memory_test' | 'multiple_choice' | 'timed_challenge') => {
    if (flashcards.length === 0) {
      alert('Create some flashcards first!');
      return;
    }

    setSelectedStudyMode(mode);
    setShowSelectionModal(true);
  };

  const handleFlashcardSelection = async (selectedFlashcards: Flashcard[]) => {
    try {
      console.log('FlashcardsSection: Starting study session with selected flashcards:', selectedFlashcards.map(c => ({ id: c.id, front: c.front_content })));
      
      const session = await createSession({
        session_type: selectedStudyMode,
        flashcard_ids: selectedFlashcards.map(card => card.id),
        total_cards: selectedFlashcards.length
      });

      console.log('FlashcardsSection: Session created successfully:', session);
      console.log('FlashcardsSection: Navigating with state:', {
        flashcards: selectedFlashcards.length,
        sessionId: session.id,
        sessionType: session.session_type
      });

      const routeMode = selectedStudyMode.replace('_', '-');
      
      // Add a small delay to ensure session is fully created
      setTimeout(() => {
        navigate(`/study/${routeMode}`, { 
          state: { 
            flashcards: selectedFlashcards,
            session: session,
            timestamp: Date.now() // Add timestamp to ensure fresh state
          },
          replace: true // Use replace to avoid back button issues
        });
      }, 100);
      
    } catch (error) {
      console.error('FlashcardsSection: Error creating session:', error);
      alert('Failed to start study session. Please try again.');
    } finally {
      setShowSelectionModal(false);
    }
  };

  const studyModes = [
    {
      id: 'memory_test' as const,
      title: 'Memory Test',
      description: 'Classic flashcard review with front and back',
      icon: Brain,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'multiple_choice' as const,
      title: 'Multiple Choice',
      description: 'Answer with multiple choice options',
      icon: Target,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      id: 'timed_challenge' as const,
      title: 'Timed Challenge',
      description: 'Beat the clock in rapid-fire mode',
      icon: Clock,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ];

  if (showReview) {
    return <FlashcardReview onClose={() => setShowReview(false)} />;
  }

  if (isLoading) {
    return (
      <Card className="fpk-card border-0 shadow-sm bg-white">
        <CardContent className="p-8">
          <div className="text-center text-gray-500">Loading flashcards...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="fpk-card border-0 shadow-sm bg-white w-full overflow-hidden">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <span className="text-xl font-bold text-gray-900">Flashcards & Study Modes</span>
            </div>
            <Badge variant="secondary" className="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-700">
              {flashcards.length} cards
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8 p-6">
          {/* Study Mode Selection */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 sm:mb-6 text-gray-800">Choose Your Study Mode</h3>
            
            {/* Study Mode Cards - Mobile Optimized */}
            <div className="w-full space-y-3 sm:space-y-2">
              {studyModes.map((mode) => (
                <div 
                  key={mode.id} 
                  className="w-full bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-300 overflow-hidden"
                >
                  {/* Mobile-first Rectangle Card Content */}
                  <div className="flex items-center p-3 sm:p-4 gap-3 sm:gap-4">
                    {/* Icon - Smaller on mobile */}
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${mode.color} text-white shadow-sm flex-shrink-0`}>
                      <mode.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    
                    {/* Content - Optimized text for mobile */}
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-base sm:text-lg text-gray-900 mb-1 truncate">
                        {mode.title}
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                        {mode.description}
                      </p>
                    </div>
                    
                    {/* Start Button - Compact on mobile */}
                    <div className="flex-shrink-0">
                      <Button
                        className={`${mode.color} ${mode.hoverColor} text-white font-medium px-3 sm:px-6 py-1.5 sm:py-2 rounded-md sm:rounded-lg transition-colors duration-200 text-xs sm:text-sm`}
                        onClick={() => handleStudyModeClick(mode.id)}
                        disabled={flashcards.length === 0 || isCreating}
                      >
                        <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">{isCreating ? 'Starting...' : 'Start Mode'}</span>
                        <span className="xs:hidden">{isCreating ? '...' : 'Start'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flashcards Preview */}
          {flashcards.length > 0 ? (
            <div className="space-y-6 w-full overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Flashcards</h3>
                  <p className="text-sm text-gray-600 mt-1">Preview your latest study materials</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium flex-shrink-0"
                  onClick={() => setShowReview(true)}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Review All</span>
                  <span className="sm:hidden">Review</span>
                </Button>
              </div>
              
              <div className="w-full overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {flashcards.slice(0, 4).map((card) => (
                    <div key={card.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 lg:p-6 hover:shadow-sm transition-shadow duration-200 overflow-hidden">
                      <div className="space-y-4">
                        {/* Front Content */}
                        <div>
                          <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Front</div>
                          <div className="text-sm text-gray-900 leading-relaxed line-clamp-3 break-words">
                            {card.front_content}
                          </div>
                        </div>
                        
                        {/* Back Content */}
                        <div>
                          <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Back</div>
                          <div className="text-sm text-gray-900 leading-relaxed line-clamp-3 break-words">
                            {card.back_content}
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Stats */}
                      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                        <Badge variant="outline" className="text-xs bg-white border-gray-300 text-gray-600 flex-shrink-0">
                          Level {card.difficulty_level}
                        </Badge>
                        <span className="text-xs text-gray-500 truncate">
                          Reviewed {card.times_reviewed} times
                        </span>
                        {card.times_reviewed > 0 && (
                          <span className="text-xs text-green-600 font-medium flex-shrink-0">
                            {Math.round((card.times_correct / card.times_reviewed) * 100)}% correct
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 lg:py-16 w-full">
              <div className="mb-6">
                <Brain className="h-12 w-12 lg:h-16 lg:w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No flashcards yet</h3>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed px-4">
                  Upload files or create notes to generate flashcards and start your learning journey!
                </p>
              </div>
              <div className="text-sm text-gray-500 space-y-2 px-4">
                <p>💡 Upload documents to auto-generate flashcards</p>
                <p>📝 Create manual notes and convert them to flashcards</p>
                <p>🎯 Practice with multiple study modes once you have cards</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <FlashcardSelectionModal
        isOpen={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        onConfirm={handleFlashcardSelection}
        studyMode={selectedStudyMode}
      />
    </>
  );
};

export default FlashcardsSection;
