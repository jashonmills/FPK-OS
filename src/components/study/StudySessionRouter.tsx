
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useFlashcards } from '@/hooks/useFlashcards';
import MemoryTestSession from './MemoryTestSession';
import MultipleChoiceSession from './MultipleChoiceSession';
import TimedChallengeSession from './TimedChallengeSession';

const StudySessionRouter: React.FC = () => {
  const { sessionId, mode } = useParams<{ sessionId: string; mode: string }>();
  const navigate = useNavigate();
  const { sessions } = useStudySessions();
  const { flashcards } = useFlashcards();

  const session = sessions.find(s => s.id === sessionId);
  
  if (!session) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Session not found</h2>
        <button 
          onClick={() => navigate('/dashboard/learner/notes')}
          className="text-blue-600 hover:underline"
        >
          Return to Notes
        </button>
      </div>
    );
  }

  const sessionFlashcards = flashcards.filter(card => 
    session.flashcard_ids.includes(card.id)
  );

  const commonProps = {
    session,
    flashcards: sessionFlashcards,
    onComplete: () => navigate('/dashboard/learner/notes')
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

export default StudySessionRouter;
