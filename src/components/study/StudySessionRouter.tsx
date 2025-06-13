
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
    console.log('StudySessionRouter: Loaded with mode:', mode);
    console.log('StudySessionRouter: Location state:', location.state);
    
    // Priority 1: Use session data from navigation state (preferred method)
    if (location.state?.session && location.state?.flashcards) {
      console.log('StudySessionRouter: Using session data from navigation state');
      console.log('StudySessionRouter: Session ID:', location.state.session.id);
      console.log('StudySessionRouter: Flashcards count:', location.state.flashcards.length);
      console.log('StudySessionRouter: First flashcard:', location.state.flashcards[0]?.front_content);
      
      setSessionData({
        session: location.state.session,
        flashcards: location.state.flashcards
      });
      return;
    }

    // Priority 2: Find very recent session (created in last 2 minutes) as fallback
    if (sessions.length > 0 && flashcards.length > 0) {
      const modeMap: Record<string, string> = {
        'memory-test': 'memory_test',
        'multiple-choice': 'multiple_choice',
        'timed-challenge': 'timed_challenge'
      };
      
      const sessionType = modeMap[mode || ''];
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      
      const recentSession = sessions
        .filter(s => 
          s.session_type === sessionType && 
          new Date(s.created_at) > twoMinutesAgo &&
          !s.completed_at // Only use incomplete sessions
        )
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      if (recentSession) {
        console.log('StudySessionRouter: Using recent session as fallback:', recentSession.id);
        
        const sessionFlashcards = flashcards.filter(card => 
          recentSession.flashcard_ids.includes(card.id)
        );
        
        console.log('StudySessionRouter: Found', sessionFlashcards.length, 'flashcards for session');
        
        if (sessionFlashcards.length > 0) {
          setSessionData({
            session: recentSession,
            flashcards: sessionFlashcards
          });
          return;
        }
      }
    }

    // No valid session data found - redirect back
    console.log('StudySessionRouter: No valid session data found, redirecting to notes');
    navigate('/dashboard/learner/notes', { replace: true });
  }, [mode, location.state, sessions, flashcards, navigate]);

  const handleComplete = () => {
    navigate('/dashboard/learner/notes', { replace: true });
  };

  // Show loading while we determine the session data
  if (!sessionData.session || sessionData.flashcards.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Loading study session...</h2>
        <p className="text-gray-600">Preparing your flashcards...</p>
      </div>
    );
  }

  // Validate that we have the expected flashcards
  const expectedCount = sessionData.session.total_cards;
  const actualCount = sessionData.flashcards.length;
  
  if (actualCount !== expectedCount) {
    console.warn(`StudySessionRouter: Flashcard count mismatch. Expected: ${expectedCount}, Actual: ${actualCount}`);
  }

  console.log('StudySessionRouter: Starting session with', actualCount, 'flashcards');

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
