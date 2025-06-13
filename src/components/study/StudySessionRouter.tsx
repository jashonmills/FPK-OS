
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useFlashcards } from '@/hooks/useFlashcards';
import MemoryTestSession from './MemoryTestSession';
import MultipleChoiceSession from './MultipleChoiceSession';
import TimedChallengeSession from './TimedChallengeSession';
import type { Flashcard } from '@/hooks/useFlashcards';
import type { StudySession } from '@/hooks/useStudySessions';

const StudySessionRouter: React.FC = () => {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { sessions } = useStudySessions();
  const { flashcards } = useFlashcards();
  const [sessionData, setSessionData] = useState<{
    session: StudySession | null;
    flashcards: Flashcard[];
  }>({ session: null, flashcards: [] });

  useEffect(() => {
    console.log('StudySessionRouter loaded with mode:', mode);
    console.log('Location state:', location.state);
    
    // Try to get session data from navigation state first
    if (location.state?.session && location.state?.flashcards) {
      setSessionData({
        session: location.state.session,
        flashcards: location.state.flashcards
      });
      console.log('Using session data from navigation state');
      return;
    }

    // Fallback: try to find the most recent session of this type
    if (sessions.length > 0 && flashcards.length > 0) {
      const modeMap: Record<string, string> = {
        'memory-test': 'memory_test',
        'multiple-choice': 'multiple_choice',
        'timed-challenge': 'timed_challenge'
      };
      
      const sessionType = modeMap[mode || ''];
      const recentSession = sessions
        .filter(s => s.session_type === sessionType)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      if (recentSession) {
        const sessionFlashcards = flashcards.filter(card => 
          recentSession.flashcard_ids.includes(card.id)
        );
        
        setSessionData({
          session: recentSession,
          flashcards: sessionFlashcards
        });
        console.log('Using most recent session data');
        return;
      }
    }

    // If no session data available, redirect to notes
    console.log('No session data found, redirecting to notes');
    navigate('/dashboard/learner/notes');
  }, [mode, location.state, sessions, flashcards, navigate]);

  const handleComplete = () => {
    navigate('/dashboard/learner/notes');
  };

  if (!sessionData.session || sessionData.flashcards.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Loading study session...</h2>
      </div>
    );
  }

  const commonProps = {
    session: sessionData.session,
    flashcards: sessionData.flashcards,
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

export default StudySessionRouter;
