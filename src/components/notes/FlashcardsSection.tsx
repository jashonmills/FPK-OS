
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useStudySessions } from '@/hooks/useStudySessions';
import { Brain, Target, Clock, Play, RotateCcw } from 'lucide-react';

const FlashcardsSection: React.FC = () => {
  const { flashcards, isLoading } = useFlashcards();
  const { createSession, isCreating } = useStudySessions();
  const [selectedMode, setSelectedMode] = useState<'memory_test' | 'multiple_choice' | 'timed_challenge' | null>(null);

  const handleStartStudyMode = (mode: 'memory_test' | 'multiple_choice' | 'timed_challenge') => {
    if (flashcards.length === 0) {
      alert('Create some flashcards first!');
      return;
    }

    const shuffledCards = [...flashcards].sort(() => Math.random() - 0.5);
    const studyCards = shuffledCards.slice(0, Math.min(10, flashcards.length));
    
    createSession({
      session_type: mode,
      flashcard_ids: studyCards.map(card => card.id),
      total_cards: studyCards.length
    });

    setSelectedMode(mode);
  };

  const studyModes = [
    {
      id: 'memory_test' as const,
      title: 'Memory Test',
      description: 'Classic flashcard review with front and back',
      icon: Brain,
      color: 'bg-blue-500'
    },
    {
      id: 'multiple_choice' as const,
      title: 'Multiple Choice',
      description: 'Answer with multiple choice options',
      icon: Target,
      color: 'bg-green-500'
    },
    {
      id: 'timed_challenge' as const,
      title: 'Timed Challenge',
      description: 'Beat the clock in rapid-fire mode',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎯 Flashcards & Study Modes
          <Badge variant="secondary" className="ml-auto">
            {flashcards.length} cards
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Study Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {studyModes.map((mode) => (
            <div key={mode.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${mode.color} text-white`}>
                  <mode.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{mode.title}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{mode.description}</p>
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleStartStudyMode(mode.id)}
                disabled={flashcards.length === 0 || isCreating}
              >
                <Play className="h-4 w-4 mr-2" />
                {isCreating ? 'Starting...' : 'Start Mode'}
              </Button>
            </div>
          ))}
        </div>

        {/* Flashcards Preview */}
        {flashcards.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Recent Flashcards</h3>
              <Button size="sm" variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Review All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcards.slice(0, 4).map((card) => (
                <div key={card.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Front:</div>
                    <div className="text-gray-900">{card.front_content}</div>
                    <div className="text-sm font-medium text-gray-700 mt-3">Back:</div>
                    <div className="text-gray-900">{card.back_content}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <Badge variant="outline" className="text-xs">
                      Level {card.difficulty_level}
                    </Badge>
                    <span>Reviewed {card.times_reviewed} times</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No flashcards yet</p>
            <p className="text-sm">Upload files or create notes to generate flashcards!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlashcardsSection;
