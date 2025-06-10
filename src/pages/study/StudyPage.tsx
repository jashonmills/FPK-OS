
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MemoryTestSession from '@/components/study/MemoryTestSession';
import MultipleChoiceSession from '@/components/study/MultipleChoiceSession';
import TimedChallengeSession from '@/components/study/TimedChallengeSession';
import type { Flashcard } from '@/hooks/useFlashcards';

const StudyPage: React.FC = () => {
  const { mode } = useParams<{ mode: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    // Get flashcards from navigation state
    if (location.state?.flashcards) {
      setFlashcards(location.state.flashcards);
    } else {
      // If no flashcards in state, redirect back to notes
      navigate('/dashboard/learner/notes');
    }
  }, [location.state, navigate]);

  const handleComplete = () => {
    navigate('/dashboard/learner/notes');
  };

  if (flashcards.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Loading study session...</h2>
      </div>
    );
  }

  // Create a mock session object for the components
  const mockSession = {
    id: 'temp-session',
    user_id: '',
    session_type: location.state?.mode || 'memory_test',
    flashcard_ids: flashcards.map(card => card.id),
    total_cards: flashcards.length,
    correct_answers: 0,
    incorrect_answers: 0,
    session_duration_seconds: null,
    completed_at: null,
    created_at: new Date().toISOString()
  };

  const commonProps = {
    session: mockSession,
    flashcards,
    onComplete: handleComplete
  };

  switch (mode) {
    case 'memory-test':
      return <MemoryTestSession {...commonProps} />;
    case 'multiple-choice':
      return <MultipleChoiceSession {...commonProps} />;
    case 'timed-challenge':
      return <TimedChallengeSession {...commonProps} />;
    default:
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Invalid study mode</h2>
          <button 
            onClick={() => navigate('/dashboard/learner/notes')}
            className="text-blue-600 hover:underline"
          >
            Return to Notes
          </button>
        </div>
      );
  }
};

export default StudyPage;
