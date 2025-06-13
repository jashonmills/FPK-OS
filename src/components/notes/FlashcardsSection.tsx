
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
      const session = await createSession({
        session_type: mode,
        flashcard_ids: studyCards.map(card => card.id),
        total_cards: studyCards.length
      });

      console.log('Session created:', session);

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
    <Card className="fpk-card border-0 shadow-sm bg-white">
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
      
      <CardContent className="space-y-8">
        {/* Study Mode Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Choose Your Study Mode</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {studyModes.map((mode) => (
              <div key={mode.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300">
                {/* Icon and Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${mode.color} text-white shadow-sm flex-shrink-0`}>
                    <mode.icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900">
                    {mode.title}
                  </h4>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-6 leading-relaxed min-h-[40px]">
                  {mode.description}
                </p>
                
                {/* Start Button */}
                <Button
                  className={`w-full ${mode.color} ${mode.hoverColor} text-white font-medium py-3 rounded-lg transition-colors duration-200`}
                  onClick={() => handleStartStudyMode(mode.id)}
                  disabled={flashcards.length === 0 || isCreating}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isCreating ? 'Starting...' : 'Start Mode'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Flashcards Preview */}
        {flashcards.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Flashcards</h3>
                <p className="text-sm text-gray-600 mt-1">Preview your latest study materials</p>
              </div>
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium"
                onClick={() => setShowReview(true)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Review All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {flashcards.slice(0, 4).map((card) => (
                <div key={card.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow duration-200">
                  <div className="space-y-4">
                    {/* Front Content */}
                    <div>
                      <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Front</div>
                      <div className="text-sm text-gray-900 leading-relaxed line-clamp-3">
                        {card.front_content}
                      </div>
                    </div>
                    
                    {/* Back Content */}
                    <div>
                      <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Back</div>
                      <div className="text-sm text-gray-900 leading-relaxed line-clamp-3">
                        {card.back_content}
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Stats */}
                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                    <Badge variant="outline" className="text-xs bg-white border-gray-300 text-gray-600">
                      Level {card.difficulty_level}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Reviewed {card.times_reviewed} times
                    </span>
                    {card.times_reviewed > 0 && (
                      <span className="text-xs text-green-600 font-medium">
                        {Math.round((card.times_correct / card.times_reviewed) * 100)}% correct
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <Brain className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No flashcards yet</h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Upload files or create notes to generate flashcards and start your learning journey!
              </p>
            </div>
            <div className="text-sm text-gray-500 space-y-2">
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
