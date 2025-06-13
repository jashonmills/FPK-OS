
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useStudySessions } from '@/hooks/useStudySessions';
import { Brain, Target, Clock, Play, RotateCcw } from 'lucide-react';
import FlashcardReview from '../study/FlashcardReview';

const FlashcardsSection: React.FC = () => {
  const { flashcards, isLoading } = useFlashcards();
  const { createSession, isCreating } = useStudySessions();
  const [showReview, setShowReview] = useState(false);
  const navigate = useNavigate();

  const handleStartStudyMode = async (mode: 'memory_test' | 'multiple_choice' | 'timed_challenge') => {
    if (flashcards.length === 0) {
      alert('Create some flashcards first!');
      return;
    }

    const shuffledCards = [...flashcards].sort(() => Math.random() - 0.5);
    const studyCards = shuffledCards.slice(0, Math.min(10, flashcards.length));
    
    try {
      // Create the session and wait for it to complete
      const session = await createSession({
        session_type: mode,
        flashcard_ids: studyCards.map(card => card.id),
        total_cards: studyCards.length
      });

      console.log('Session created:', session);

      // Navigate to the study session with the session data
      const routeMode = mode.replace('_', '-');
      navigate(`/study/${routeMode}`, { 
        state: { 
          flashcards: studyCards,
          session
        }
      });
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to start study session. Please try again.');
    }
  };

  const studyModes = [
    {
      id: 'memory_test' as const,
      title: 'Memory Test',
      description: 'Classic flashcard review with front and back',
      icon: Brain,
      color: 'bg-blue-500',
      shortTitle: 'Me...'
    },
    {
      id: 'multiple_choice' as const,
      title: 'Multiple Choice',
      description: 'Answer with multiple choice options',
      icon: Target,
      color: 'bg-green-500',
      shortTitle: 'Mul...'
    },
    {
      id: 'timed_challenge' as const,
      title: 'Timed Challenge',
      description: 'Beat the clock in rapid-fire mode',
      icon: Clock,
      color: 'bg-orange-500',
      shortTitle: 'Tim...'
    }
  ];

  if (showReview) {
    return <FlashcardReview onClose={() => setShowReview(false)} />;
  }

  if (isLoading) {
    return (
      <Card className="fpk-card border-0 shadow-md">
        <CardContent className="p-6">
          <div className="text-center">Loading flashcards...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fpk-card border-0 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            🎯 
            <span className="text-lg lg:text-xl font-semibold">Flashcards & Study Modes</span>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {flashcards.length} cards
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Study Mode Selection - Enhanced Desktop Layout */}
        <div>
          <h3 className="text-base font-medium mb-4 text-gray-700">Choose Your Study Mode</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {studyModes.map((mode) => (
              <div key={mode.id} className="group relative">
                <div className="p-6 border-2 border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col bg-gradient-to-br from-white to-gray-50 group-hover:from-purple-50 group-hover:to-white">
                  {/* Icon and Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${mode.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <mode.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg group-hover:text-purple-900 transition-colors">
                        {mode.title}
                      </h4>
                      <p className="text-sm text-gray-500 hidden lg:block">
                        {mode.shortTitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                    {mode.description}
                  </p>
                  
                  {/* Start Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                    onClick={() => handleStartStudyMode(mode.id)}
                    disabled={flashcards.length === 0 || isCreating}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isCreating ? 'Starting...' : 'Start Mode'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flashcards Preview - Enhanced Desktop Layout */}
        {flashcards.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900">Recent Flashcards</h3>
                <p className="text-sm text-gray-500 mt-1">Preview your latest study materials</p>
              </div>
              <Button 
                variant="outline" 
                className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors"
                onClick={() => setShowReview(true)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Review All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {flashcards.slice(0, 4).map((card) => (
                <div key={card.id} className="group">
                  <div className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-300">
                    <div className="space-y-4">
                      {/* Front Content */}
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Front</div>
                        <div className="text-base text-gray-900 leading-relaxed line-clamp-3">
                          {card.front_content}
                        </div>
                      </div>
                      
                      {/* Back Content */}
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Back</div>
                        <div className="text-base text-gray-900 leading-relaxed line-clamp-3">
                          {card.back_content}
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Stats */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/50">
                      <Badge variant="outline" className="text-xs bg-white/70 border-gray-200">
                        Level {card.difficulty_level}
                      </Badge>
                      <span className="text-xs text-gray-600">
                        Reviewed {card.times_reviewed} times
                      </span>
                      {card.times_reviewed > 0 && (
                        <span className="text-xs text-green-600 font-medium">
                          {Math.round((card.times_correct / card.times_reviewed) * 100)}% correct
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-6">
              <Brain className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No flashcards yet</h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Upload files or create notes to generate flashcards and start your learning journey!
              </p>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Upload documents to auto-generate flashcards</p>
              <p>📝 Create manual notes and convert them to flashcards</p>
              <p>🎯 Practice with multiple study modes once you have cards</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlashcardsSection;
