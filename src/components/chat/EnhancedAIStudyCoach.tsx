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
import { useOptionalOrgContext } from '@/components/organizations/OrgContext';
import { useQuery } from '@tanstack/react-query';

interface EnhancedAIStudyCoachProps {
  userId?: string;
  orgId?: string;
  chatMode?: 'personal' | 'general' | 'org_admin';
  adminMode?: 'educational' | 'org_data';
  showHeader?: boolean;
  user?: any;
  completedSessions?: any[];
  flashcards?: any[];
  insights?: any[];
  fixedHeight?: boolean;
  isFreeChatAllowed?: boolean; // New prop to control Free Chat access
}

export function EnhancedAIStudyCoach(props: EnhancedAIStudyCoachProps) {
  const { userId, orgId, chatMode, isFreeChatAllowed = true } = props;
  const [socraticMode, setSocraticMode] = useState(false);
  const [showSessionPanel, setShowSessionPanel] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [dataSource, setDataSource] = useState<DataSource>('general');
  const [orgSettings, setOrgSettings] = useState<any>(null);
  const [currentMessages, setCurrentMessages] = useState<any[]>([]);
  const currentOrg = useOptionalOrgContext()?.currentOrg || null;
  
  // Fetch user's AI interaction style preference
  const { data: userPreferences } = useQuery({
    queryKey: ['user-ai-preferences', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('ai_interaction_style, ai_hint_aggressiveness')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user preferences:', error);
        return null;
      }
      return data;
    },
    enabled: !!userId
  });
  
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

  // Force Socratic mode if Free Chat is disabled
  useEffect(() => {
    if (!isFreeChatAllowed && !socraticMode) {
      setSocraticMode(true);
    }
  }, [isFreeChatAllowed, socraticMode]);

  const handleStartSocraticSession = async (topic: string, objective: string) => {
    console.log('handleStartSocraticSession called with:', { topic, objective, userId, orgId });
    
    if (!userId) {
      console.error('Cannot start session: userId is missing in EnhancedAIStudyCoach');
      return;
    }
    
    const sessionId = await startSession(topic, objective);
    console.log('Session ID returned from startSession:', sessionId);
    
    if (sessionId) {
      setShowSessionPanel(false);
      
      // Get first question from AI
      try {
        console.log('Invoking AI for first question...');
        const { data, error } = await supabase.functions.invoke('ai-study-chat', {
          body: {
            userId,
            socraticMode: true,
            socraticIntent: 'start',
            socraticTopic: topic,
            socraticObjective: objective,
            contextData: { orgId },
            interactionStyle: userPreferences?.ai_interaction_style || 'encouraging_friendly',
            hintAggressiveness: userPreferences?.ai_hint_aggressiveness || 1
          }
        });

        if (error) {
          console.error('AI invocation error:', error);
          throw error;
        }

        console.log('AI response:', data);

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
        console.error('Error getting first question from AI:', error);
      }
    } else {
      console.error('Session creation failed - no session ID returned');
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
          contextData: { orgId },
          interactionStyle: userPreferences?.ai_interaction_style || 'encouraging_friendly',
          hintAggressiveness: userPreferences?.ai_hint_aggressiveness || 1
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
    // Don't allow toggling if Free Chat is disabled
    if (!isFreeChatAllowed && socraticMode) {
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
      
      // Get first question from AI with warm handoff context (with retry logic)
      console.log('🤖 Requesting warm handoff from AI...');
      
      let warmHandoffMessage: string | null = null;
      let aiError: any = null;
      
      // Try up to 3 times to get the AI-generated warm handoff
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`🔄 AI request attempt ${attempt}/3`);
          
          const { data, error } = await supabase.functions.invoke('ai-study-chat', {
            body: {
              userId,
              socraticMode: true,
              socraticIntent: 'start',
              socraticTopic: extractedTopic,
              socraticObjective: `Deep understanding of ${extractedTopic}`,
              socraticSessionId: sessionId,
              promotedFromFreeChat: true, // Flag for warm handoff
              contextData: { 
                orgId,
                promotedFromFreeChat: true
              }
            }
          });

          if (error) {
            console.error(`❌ AI request error (attempt ${attempt}):`, error);
            aiError = error;
            
            // Wait before retry (exponential backoff)
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
              continue;
            }
          } else if (data?.question) {
            console.log('✅ AI response received:', data);
            warmHandoffMessage = data.question;
            break; // Success!
          } else {
            console.warn('⚠️ AI response missing question field:', data);
            aiError = new Error('AI response missing question field');
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
              continue;
            }
          }
        } catch (err) {
          console.error(`❌ Exception during AI call (attempt ${attempt}):`, err);
          aiError = err;
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
            continue;
          }
        }
      }

      // Use AI-generated message if we got it, otherwise use a thoughtful fallback
      const finalMessage = warmHandoffMessage || 
        `Perfect! I can see we've been discussing **${extractedTopic}**. Let's transition into a more structured exploration of this topic.\n\n` +
        `I'll guide you through understanding ${extractedTopic} using the Socratic method - asking questions that help you discover insights on your own.\n\n` +
        `**Let's start with this:** What do you already know about ${extractedTopic}? Share your current understanding, even if it feels incomplete.`;
      
      if (!warmHandoffMessage) {
        console.warn('⚠️ Using fallback warm handoff message after AI call failures:', aiError?.message);
      } else {
        console.log('✅ Using AI-generated warm handoff message');
      }
      
      console.log('💬 Adding warm handoff message to session');
      addTurn({
        role: 'coach',
        content: finalMessage
      });
      
      updateSession({
        current_question: finalMessage,
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
    <div className="flex flex-col h-full max-h-full gap-4">{/* Removed overflow-hidden to allow scrolling */}
      {/* Onboarding for first-time users */}
      <ModeOnboarding onComplete={() => {}} userRole={currentOrg?.role} />
      
      {/* Mode Toggle and Data Source Selector */}
      <div className="flex justify-between items-center px-4 gap-2">
        {/* Only show toggles if Free Chat is allowed */}
        {isFreeChatAllowed ? (
          <>
            {/* Data Source Toggle - Only show in Personal Mode and Free Chat */}
            {isPersonalMode && !socraticMode && (
              <DataSourceToggle
                dataSource={dataSource}
                onDataSourceChange={setDataSource}
              />
            )}
            
            {/* Spacer for org mode or when in structured mode */}
            {(!isPersonalMode || socraticMode) && <div className="flex-1" />}
            
            {/* Socratic Mode Toggle */}
            <SocraticModeToggle
              enabled={socraticMode}
              onToggle={toggleSocraticMode}
              sessionActive={!!session && session.state !== 'COMPLETED'}
              averageScore={averageScore}
            />
          </>
        ) : (
          <>
            <div className="flex-1" />
            {/* Locked mode indicator when Free Chat is disabled */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground px-3 py-2 bg-muted/50 rounded-md border border-border">
              <span className="font-medium">Structured Learning Session Mode</span>
            </div>
          </>
        )}
      </div>

      {/* Show Socratic Session Panel or Chat Interface */}
      {socraticMode ? (
        <>
          {!session && !isPromoting && (
            <div className="flex-1 overflow-y-auto px-2 sm:px-4">
              <SocraticSessionPanel
                onStartSession={handleStartSocraticSession}
                onCancel={() => {
                  setShowSessionPanel(false);
                  // Only allow switching back to Free Chat if it's explicitly allowed
                  if (isFreeChatAllowed) {
                    setSocraticMode(false);
                  }
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
            <div className="flex-1 min-h-0 overflow-hidden">
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
