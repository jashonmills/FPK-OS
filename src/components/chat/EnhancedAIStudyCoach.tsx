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
  const [isPromoting, setIsPromoting] = useState(false);
  const [dataSource, setDataSource] = useState<DataSource>('general');
  const [orgSettings, setOrgSettings] = useState<any>(null);
  const [currentMessages, setCurrentMessages] = useState<any[]>([]);
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

  const toggleSocraticMode = () => {
    // Don't allow toggling if organization restricts general chat
    if (orgSettings?.restrict_general_chat && socraticMode) {
      return;
    }
    
    // Manual toggle: If switching TO Structured Mode, show session setup panel
    if (!socraticMode && !session) {
      setShowSessionPanel(true);
      setSocraticMode(true);
    } else {
      // Switching back to Free Chat
      setSocraticMode(!socraticMode);
    }
  };

  const handlePromoteToStructured = async () => {
    console.log('🚀 Starting promotion to Structured Mode');
    setIsPromoting(true);
    setShowSessionPanel(false); // Explicitly hide panel during promotion
    
    try {
      // Extract topic from ongoing conversation
      console.log('📝 Extracting topic from conversation...');
      const extractedTopic = await extractTopicFromChat();
      console.log('✅ Topic extracted:', extractedTopic);
      
      if (!extractedTopic) {
        console.warn('⚠️ No topic extracted, falling back to manual setup');
        // Couldn't extract topic, fall back to manual setup
        setShowSessionPanel(true);
        setSocraticMode(true);
        setIsPromoting(false);
        return;
      }
      
      // Seamlessly transition to Structured Mode with the extracted topic
      console.log('🎯 Switching to Structured Mode with topic:', extractedTopic);
      setSocraticMode(true);
      
      // Start session with warm handoff message
      console.log('📚 Starting Socratic session...');
      const sessionId = await startSession(extractedTopic, `Deep understanding of ${extractedTopic}`);
      console.log('✅ Session created:', sessionId);
      
      if (!sessionId) {
        console.error('❌ Session creation failed');
        // Session creation failed, fall back to manual setup
        setShowSessionPanel(true);
        setIsPromoting(false);
        return;
      }
      
      // Get first question from AI with warm handoff context
      console.log('🤖 Requesting warm handoff from AI...');
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          userId,
          socraticMode: true,
          socraticIntent: 'start',
          socraticTopic: extractedTopic,
          socraticObjective: `Deep understanding of ${extractedTopic}`,
          contextData: { 
            orgId,
            promotedFromFreeChat: true,
            warmHandoff: true
          }
        }
      });

      if (error) {
        console.error('❌ AI request error:', error);
        throw error;
      }

      console.log('✅ AI response received:', data);

      // Add warm handoff message that acknowledges the ongoing conversation
      const warmHandoffMessage = `Great! I can see we've been discussing ${extractedTopic}. Let's dive deeper using the Socratic method. ${data.question || "What aspect would you like to explore first?"}`;
      
      console.log('💬 Adding warm handoff message to session');
      addTurn({
        role: 'coach',
        content: warmHandoffMessage
      });
      
      updateSession({
        current_question: data.question || warmHandoffMessage,
        state: 'WAIT'
      });
      
      console.log('✅ Promotion complete - session active');
      
    } catch (error) {
      console.error('❌ Error promoting to Structured Mode:', error);
      // Fallback: show session panel
      setShowSessionPanel(true);
      setSocraticMode(true);
    } finally {
      setIsPromoting(false);
    }
  };

  const extractTopicFromChat = async (): Promise<string | null> => {
    try {
      // Need conversation history to extract topic
      if (!currentMessages || currentMessages.length < 2) {
        console.warn('⚠️ Not enough messages for topic extraction');
        return null;
      }

      // Format messages for edge function
      const clientHistory = currentMessages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));

      console.log('📨 Sending conversation history for topic extraction:', clientHistory.length, 'messages');

      // Call edge function to extract topic from chat using AI
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          extractTopicOnly: true,
          userId,
          sessionId: 'topic-extraction',
          message: 'Extract topic from conversation',
          clientHistory
        }
      });

      if (error) {
        console.error('Error extracting topic:', error);
        return null;
      }

      return data?.extractedTopic || null;
    } catch (error) {
      console.error('Error in extractTopicFromChat:', error);
      return null;
    }
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
          {showSessionPanel && !session && !isPromoting && (
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

          {isPromoting && !session && (
            <div className="flex-1 flex items-center justify-center">
              <Card className="p-8 max-w-md">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
                  <h3 className="font-semibold text-lg">Transitioning to Structured Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyzing our conversation and preparing your personalized learning session...
                  </p>
                </div>
              </Card>
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
          isStructuredMode={false}
          onPromoteToStructured={handlePromoteToStructured}
          onMessagesChange={setCurrentMessages}
        />
      )}
    </div>
  );
}
