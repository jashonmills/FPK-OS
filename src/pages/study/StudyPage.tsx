
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MemoryTestSession from '@/components/study/MemoryTestSession';
import MultipleChoiceSession from '@/components/study/MultipleChoiceSession';
import TimedChallengeSession from '@/components/study/TimedChallengeSession';
import type { Flashcard } from '@/hooks/useFlashcards';
import type { StudySession } from '@/hooks/useStudySessions';

const StudyPage: React.FC = () => {
  const { mode } = useParams<{ mode: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [session, setSession] = useState<StudySession | null>(null);

  useEffect(() => {
    // Get flashcards and session from navigation state
    if (location.state?.flashcards && location.state?.session) {
      setFlashcards(location.state.flashcards);
      setSession(location.state.session);
      console.log('StudyPage loaded with session:', location.state.session);
    } else {
      // If no data in state, redirect back to notes
      console.log('No session data found, redirecting to notes');
      navigate('/dashboard/learner/notes');
    }
  }, [location.state, navigate]);

  const handleComplete = () => {
    navigate('/dashboard/learner/notes');
  };

  if (!session || flashcards.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Loading study session...</h2>
      </div>
    );
  }

  const commonProps = {
    session,
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
