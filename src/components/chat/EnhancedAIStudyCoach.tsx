import { useState } from 'react';
import { AIStudyChatInterface } from './AIStudyChatInterface';
import { SocraticModeToggle } from './SocraticModeToggle';
import { SocraticSessionPanel } from './SocraticSessionPanel';
import { SocraticSessionView } from './SocraticSessionView';
import { useSocraticSession } from '@/hooks/useSocraticSession';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface EnhancedAIStudyCoachProps {
  userId?: string;
  orgId?: string;
  chatMode?: 'personal' | 'general';
  showHeader?: boolean;
  user?: any;
  completedSessions?: any[];
  flashcards?: any[];
  insights?: any[];
  fixedHeight?: boolean;
}

export function EnhancedAIStudyCoach(props: EnhancedAIStudyCoachProps) {
  const { userId, orgId } = props;
  const [socraticMode, setSocraticMode] = useState(false);
  const [showSessionPanel, setShowSessionPanel] = useState(false);
  
  const { 
    session, 
    turns, 
    loading, 
    startSession, 
    addTurn,
    updateSession,
    completeSession
  } = useSocraticSession(userId, orgId);

  const handleStartSocraticSession = async (topic: string, objective: string) => {
    const sessionId = await startSession(topic, objective);
    if (sessionId) {
      setShowSessionPanel(false);
      
      // Get first question from AI
      try {
        const { data, error } = await supabase.functions.invoke('ai-study-chat', {
          body: {
            userId,
            socraticMode: true,
            socraticIntent: 'start',
            socraticTopic: topic,
            socraticObjective: objective,
            contextData: { orgId }
          }
        });

        if (error) throw error;

        if (data.question) {
          addTurn({
            role: 'coach',
            content: data.question
          });
          updateSession({
            current_question: data.question,
            state: 'WAIT'
          });
        }
      } catch (error) {
        console.error('Error starting Socratic session:', error);
      }
    }
  };

  const handleSocraticResponse = async (message: string) => {
    if (!session) return;

    // Add user message
    addTurn({
      role: 'student',
      content: message
    });

    try {
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message,
          userId,
          socraticMode: true,
          socraticIntent: 'respond',
          socraticSessionId: session.id,
          contextData: { orgId }
        }
      });

      if (error) throw error;

      // Add coach response
      if (data.question) {
        addTurn({
          role: 'coach',
          content: data.question,
          score: data.score
        });

        const newScoreHistory = session.score_history ? [...session.score_history, data.score] : [data.score];
        
        updateSession({
          current_question: data.question,
          state: data.state,
          score_history: newScoreHistory,
          nudge_count: data.state === 'NUDGE' ? (session.nudge_count || 0) + 1 : 0
        });
      }

      if (data.isComplete) {
        completeSession();
      }
    } catch (error) {
      console.error('Error in Socratic session:', error);
    }
  };

  const toggleSocraticMode = () => {
    if (!socraticMode && !session) {
      setShowSessionPanel(true);
    }
    setSocraticMode(!socraticMode);
  };

  const averageScore = session?.score_history?.length 
    ? session.score_history.reduce((a, b) => a + b, 0) / session.score_history.length
    : undefined;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Mode Toggle */}
      <div className="flex justify-end px-4">
        <SocraticModeToggle
          enabled={socraticMode}
          onToggle={toggleSocraticMode}
          sessionActive={!!session && session.state !== 'COMPLETED'}
          averageScore={averageScore}
        />
      </div>

      {/* Show Socratic Session Panel or Chat Interface */}
      {socraticMode ? (
        <>
          {showSessionPanel && !session && (
            <div className="px-4">
              <SocraticSessionPanel
                onStartSession={handleStartSocraticSession}
                onCancel={() => {
                  setShowSessionPanel(false);
                  setSocraticMode(false);
                }}
              />
            </div>
          )}

          {session && (
            <div className="flex-1">
              <SocraticSessionView
                session={session}
                turns={turns}
                loading={loading}
                onSendResponse={handleSocraticResponse}
                onEndSession={() => {
                  completeSession();
                  setSocraticMode(false);
                }}
              />
            </div>
          )}
        </>
      ) : (
        <AIStudyChatInterface {...props} />
      )}
    </div>
  );
}
