
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('StudySessionRouter: Starting with mode:', mode);
    console.log('StudySessionRouter: Location state:', location.state);
    console.log('StudySessionRouter: Available sessions:', sessions.length);
    console.log('StudySessionRouter: Available flashcards:', flashcards.length);
    
    const initializeSession = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Priority 1: Use session data from navigation state (preferred method)
        if (location.state?.session && location.state?.flashcards) {
          console.log('StudySessionRouter: Using session data from navigation state');
          console.log('StudySessionRouter: Session ID:', location.state.session.id);
          console.log('StudySessionRouter: Flashcards count:', location.state.flashcards.length);
          
          // Validate the flashcards data
          if (location.state.flashcards.length === 0) {
            throw new Error('No flashcards provided for study session');
          }
          
          setSessionData({
            session: location.state.session,
            flashcards: location.state.flashcards
          });
          setIsLoading(false);
          return;
        }

        // Priority 2: Find most recent incomplete session for this mode
        if (sessions.length > 0 && flashcards.length > 0) {
          const modeMap: Record<string, string> = {
            'memory-test': 'memory_test',
            'multiple-choice': 'multiple_choice',
            'timed-challenge': 'timed_challenge'
          };
          
          const sessionType = modeMap[mode || ''];
          if (!sessionType) {
            throw new Error(`Invalid study mode: ${mode}`);
          }
          
          console.log('StudySessionRouter: Looking for sessions of type:', sessionType);
          
          // Find the most recent incomplete session for this type
          const recentSession = sessions
            .filter(s => {
              const isCorrectType = s.session_type === sessionType;
              const isIncomplete = !s.completed_at;
              console.log(`Session ${s.id}: type=${s.session_type}, completed=${!!s.completed_at}, match=${isCorrectType && isIncomplete}`);
              return isCorrectType && isIncomplete;
            })
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

          if (recentSession) {
            console.log('StudySessionRouter: Using recent session:', recentSession.id);
            console.log('StudySessionRouter: Session flashcard IDs:', recentSession.flashcard_ids);
            
            const sessionFlashcards = flashcards.filter(card => {
              const isIncluded = recentSession.flashcard_ids.includes(card.id);
              console.log(`Flashcard ${card.id}: included=${isIncluded}`);
              return isIncluded;
            });
            
            console.log('StudySessionRouter: Found', sessionFlashcards.length, 'flashcards for session');
            
            if (sessionFlashcards.length > 0) {
              setSessionData({
                session: recentSession,
                flashcards: sessionFlashcards
              });
              setIsLoading(false);
              return;
            } else {
              console.warn('StudySessionRouter: No matching flashcards found for session');
            }
          } else {
            console.log('StudySessionRouter: No recent incomplete sessions found');
          }
        }

        // No valid session data found
        throw new Error('No valid study session found. Please start a new study session from the Notes page.');
        
      } catch (err) {
        console.error('StudySessionRouter: Error initializing session:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setIsLoading(false);
      }
    };

    // Only initialize if we have the necessary data
    if (sessions.length >= 0 && flashcards.length >= 0) {
      initializeSession();
    }
  }, [mode, location.state, sessions, flashcards]);

  const handleComplete = () => {
    navigate('/dashboard/learner/notes', { replace: true });
  };

  const handleBackToNotes = () => {
    navigate('/dashboard/learner/notes', { replace: true });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Loading Study Session...</h2>
          <p className="text-gray-600">Preparing your flashcards for study</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !sessionData.session || sessionData.flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-red-800">Session Error</h2>
          <p className="text-gray-600 mb-6">
            {error || 'Unable to load study session. Please try starting a new session.'}
          </p>
          <button 
            onClick={handleBackToNotes}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Return to Notes
          </button>
        </div>
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-bold mb-4">Invalid Study Mode</h2>
            <p className="text-gray-600 mb-6">The study mode "{mode}" is not recognized.</p>
            <button 
              onClick={handleBackToNotes}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Return to Notes
            </button>
          </div>
        </div>
      );
  }
};

export default StudySessionRouter;
