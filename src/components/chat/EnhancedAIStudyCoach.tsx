import { useState, useEffect } from 'react';
import { AIStudyChatInterface } from './AIStudyChatInterface';
import { SocraticModeToggle } from './SocraticModeToggle';
import { SocraticSessionPanel } from './SocraticSessionPanel';
import { SocraticSessionView } from './SocraticSessionView';
import { ModeOnboarding } from './ModeOnboarding';
import { DataSourceToggle, type DataSource } from '@/components/ai-coach/DataSourceToggle';
import { useSocraticSession } from '@/hooks/useSocraticSession';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useOrgContext } from '@/components/organizations/OrgContext';

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
  const { userId, orgId, chatMode } = props;
  const [socraticMode, setSocraticMode] = useState(false);
  const [showSessionPanel, setShowSessionPanel] = useState(false);
  const [dataSource, setDataSource] = useState<DataSource>('general');
  const [orgSettings, setOrgSettings] = useState<any>(null);
  const { currentOrg } = useOrgContext();
  
  // Personal mode uses the tri-modal system, org mode uses the legacy system
  const isPersonalMode = chatMode === 'personal' && !orgId;
  
  const { 
    session, 
    turns, 
    loading, 
    startSession, 
    addTurn,
    updateSession,
    completeSession
  } = useSocraticSession(userId, orgId);

  // Fetch organization settings to check if General Chat is restricted
  useEffect(() => {
    if (orgId || currentOrg?.organization_id) {
      const fetchOrgSettings = async () => {
        const { data } = await supabase
          .from('organizations')
          .select('restrict_general_chat')
          .eq('id', orgId || currentOrg?.organization_id)
          .single();
        
        if (data) {
          setOrgSettings(data);
          // If general chat is restricted, force structured mode
          if (data.restrict_general_chat) {
            setSocraticMode(true);
          }
        }
      };
      fetchOrgSettings();
    }
  }, [orgId, currentOrg]);

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

  const toggleSocraticMode = async () => {
    // Don't allow toggling if organization restricts general chat
    if (orgSettings?.restrict_general_chat && socraticMode) {
      return;
    }
    
    // If switching TO Structured Mode, check if we can extract a topic from recent chat
    if (!socraticMode && !session) {
      // Try to extract topic from recent conversation
      const extractedTopic = await extractTopicFromChat();
      
      if (extractedTopic) {
        // Automatically start a Socratic session with the extracted topic
        setSocraticMode(true);
        handleStartSocraticSession(extractedTopic, `Deep understanding of ${extractedTopic}`);
      } else {
        // No topic found, show the session panel to let user choose
        setShowSessionPanel(true);
        setSocraticMode(true);
      }
    } else {
      setSocraticMode(!socraticMode);
    }
  };

  const extractTopicFromChat = async (): Promise<string | null> => {
    // This function will be called to extract the topic from recent chat history
    // For now, return null to show the session panel
    // TODO: Implement AI-based topic extraction from chat history
    return null;
  };

  const averageScore = session?.score_history?.length 
    ? session.score_history.reduce((a, b) => a + b, 0) / session.score_history.length
    : undefined;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Onboarding for first-time users */}
      <ModeOnboarding onComplete={() => {}} />
      
      {/* Mode Toggle and Data Source Selector */}
      <div className="flex justify-between items-center px-4 gap-2">
        {/* Data Source Toggle - Only show in Personal Mode and Free Chat */}
        {isPersonalMode && !socraticMode && (
          <DataSourceToggle
            dataSource={dataSource}
            onDataSourceChange={setDataSource}
          />
        )}
        
        {/* Spacer for org mode or when in structured mode */}
        {(!isPersonalMode || socraticMode) && <div className="flex-1" />}
        
        {/* Organization restriction message */}
        {orgSettings?.restrict_general_chat && (
          <div className="text-xs text-muted-foreground mr-4 self-center">
            Your organization has enabled Structured Mode for focused learning
          </div>
        )}
        
        {/* Socratic Mode Toggle */}
        <SocraticModeToggle
          enabled={socraticMode}
          onToggle={toggleSocraticMode}
          sessionActive={!!session && session.state !== 'COMPLETED'}
          averageScore={averageScore}
          disabled={orgSettings?.restrict_general_chat}
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
        <AIStudyChatInterface 
          {...props}
          dataSource={isPersonalMode ? dataSource : undefined}
          isStructuredMode={socraticMode}
        />
      )}
    </div>
  );
}
