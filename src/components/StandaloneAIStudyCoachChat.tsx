import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Trash2, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useEnhancedVoiceInput } from '@/hooks/useEnhancedVoiceInput';
import { safeLocalStorage } from '@/utils/safeStorage';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useWidgetChatStorage } from '@/hooks/useWidgetChatStorage';
import { useConversationState, ChatMessage as ConversationMessage } from '@/hooks/useConversationState';
import { v4 as uuidv4 } from 'uuid';
import { useCleanup } from '@/utils/cleanupManager';
import { logger } from '@/utils/logger';
import { useSocraticSession } from '@/hooks/useSocraticSession';
import { SocraticModeToggle } from '@/components/chat/SocraticModeToggle';
import { SocraticSessionPanel } from '@/components/chat/SocraticSessionPanel';
import { calculateAverageScore } from '@/lib/socratic/orchestrator';

// Helper to prevent hanging requests
const withTimeout = <T,>(promise: Promise<T>, cleanup: any, ms = 18000, timeoutMessage = 'AI response timed out'): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timerId = cleanup.setTimeout(() => reject(new Error(timeoutMessage)), ms);
    promise.then((value) => {
      cleanup.cleanup(timerId);
      resolve(value);
    }).catch((err) => {
      cleanup.cleanup(timerId);
      reject(err);
    });
  });
};

const StandaloneAIStudyCoachChat: React.FC = () => {
  const cleanup = useCleanup('StandaloneAIStudyCoachChat');
  const { user } = useAuth();
  const { toast } = useToast();
  const anonymousId = useState(() => `anonymous_${Date.now()}`)[0];
  const { messages, addMessage, clearAllMessages } = useWidgetChatStorage(user?.id || anonymousId);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => uuidv4());
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastSpokenMessageId, setLastSpokenMessageId] = useState<string | null>(null);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(() => 
    safeLocalStorage.getItem<string>('aistudycoach_voice_autoplay', {
      fallbackValue: 'false',
      logErrors: false
    }) === 'true'
  );
  const [showSocraticPanel, setShowSocraticPanel] = useState(false);
  
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const { settings } = useVoiceSettings();
  const voiceInput = useEnhancedVoiceInput();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Socratic session management
  const {
    session: socraticSession,
    turns: socraticTurns,
    loading: socraticLoading,
    startSession: startSocraticSession,
    addTurn,
    updateSession,
    completeSession
  } = useSocraticSession(user?.id);

  const { state: conversationState, analyzeConversation, updateState } = useConversationState();

  // Auto scroll when messages change
  useEffect(() => {
    if ((messages.length > 0 || socraticTurns.length > 0) && !isInputFocused) {
      cleanup.setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [messages, socraticTurns, cleanup, isInputFocused]);

  // Add welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0 && !socraticSession) {
      const welcomeMessage = {
        role: 'assistant' as const,
        content: `Hello! I'm your AI Learning Coach. I can help you with:

🌐 **General Knowledge** - Any subject, research, or educational topics
📖 **Study Techniques** - Learning strategies and academic methods  
🎯 **Structured Learning** - Guided Socratic sessions with scoring
💡 **Learning Guidance** - Study tips and educational advice

${user ? 'Toggle to Structured Mode to start a guided learning session!' : 'Please log in for full Structured Learning features.'}

What would you like to learn about today?`
      };
      
      addMessage(welcomeMessage);
    }
  }, [messages.length, addMessage, socraticSession, user]);

  const handleStartSocraticSession = async (topic: string, objective: string) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to use Structured Learning Sessions',
        variant: 'destructive'
      });
      return;
    }

    setShowSocraticPanel(false);
    setIsLoading(true);

    try {
      const newSessionId = await startSocraticSession(topic, objective);
      if (newSessionId) {
        toast({
          title: 'Session Started',
          description: 'Your structured learning session has begun!'
        });
      }
    } catch (error) {
      logger.error('Error starting Socratic session', 'SOCRATIC', error);
      toast({
        title: 'Error',
        description: 'Failed to start learning session',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSocraticMode = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to use Structured Learning Sessions',
        variant: 'destructive'
      });
      return;
    }

    if (socraticSession && socraticSession.state !== 'COMPLETED') {
      // Complete active session
      completeSession();
    } else {
      // Show panel to start new session
      setShowSocraticPanel(true);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Handle Socratic session responses
    if (socraticSession && socraticSession.state !== 'COMPLETED') {
      setInput('');
      setIsLoading(true);

      try {
        // Add student's turn to UI
        addTurn({
          role: 'student',
          content: messageText.trim()
        });

        // Send to edge function for evaluation
        const { data, error } = await withTimeout(
          supabase.functions.invoke('ai-study-chat', {
            body: {
              intent: 'respond',
              userId: user?.id,
              sessionId: socraticSession.id,
              studentResponse: messageText.trim()
            }
          }),
          cleanup,
          18000
        );

        if (error) throw error;

        // Add coach's response
        if (data.coachMessage) {
          addTurn({
            role: 'coach',
            content: data.coachMessage,
            score: data.score,
            misconception: data.misconception
          });
        }

        // Update session state
        if (data.state) {
          updateSession({
            state: data.state,
            score_history: data.scoreHistory || socraticSession.score_history,
            nudge_count: data.nudgeCount || socraticSession.nudge_count
          });
        }

        // Check if session is complete
        if (data.isComplete) {
          const avgScore = calculateAverageScore(data.scoreHistory || []);
          toast({
            title: 'Session Complete!',
            description: `Great work! Average score: ${avgScore.toFixed(1)}/3`
          });
        }
      } catch (error: any) {
        logger.error('Error in Socratic turn', 'SOCRATIC', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to process response',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Regular free chat message
    const userMessage = {
      role: 'user' as const,
      content: messageText.trim()
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      // Convert messages to conversation format for analysis
      const conversationHistory: ConversationMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));
      
      // Analyze conversation
      const analyzedState = analyzeConversation(conversationHistory, messageText);
      updateState(analyzedState);
      
      const contextData = {
        quizTopic: analyzedState.currentTopic,
        teachingHistory: analyzedState.teachingMethods.join(', '),
        incorrectCount: analyzedState.incorrectAnswersCount,
        isInQuiz: analyzedState.isInQuiz,
        inRefresherMode: analyzedState.inRefresherMode
      };

      const clientHistory = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp
      }));
      
      const { data, error } = await withTimeout(
        supabase.functions.invoke('ai-study-chat', {
          body: {
            message: messageText,
            userId: user?.id || anonymousId,
            sessionId,
            promptType: analyzedState.promptType,
            chatMode: 'general',
            voiceActive: false,
            useOpenAIAssistant: true,
            threadId: threadId,
            contextData,
            clientHistory
          }
        }),
        cleanup,
        18000
      );
      
      if (error) throw error;

      if (data?.threadId) {
        setThreadId(data.threadId);
      }

      if (!data?.response) {
        throw new Error('No response received from AI');
      }

      const aiResponse = {
        role: 'assistant' as const,
        content: data.response
      };

      addMessage(aiResponse);

      if (data.metadata?.promptType) {
        updateState({ 
          promptType: data.metadata.promptType,
          lastAIQuestion: data.response.includes('?') ? data.response : null
        });
      }

    } catch (error) {
      logger.error('Chat error', 'CHAT', error);
      
      const fallbackResponse = {
        role: 'assistant' as const,
        content: `I'm experiencing a connection issue. Here are some study tips while we reconnect:

🎯 **Study Techniques:**
- Use active recall: test yourself without looking at answers
- Practice spaced repetition: review at increasing intervals
- Break topics into smaller chunks

📚 **Learning Methods:**
- Pomodoro Method: 25-min sessions with 5-min breaks
- Feynman Technique: Explain concepts in simple terms
- Active engagement through questions and discussions

What would you like to focus on?`
      };

      addMessage(fallbackResponse);
      
      toast({
        title: "Connection Issue",
        description: "Using offline mode",
        variant: "default",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleVoiceInput = (transcription: string) => {
    if (transcription.trim()) {
      setInput(transcription);
      cleanup.setTimeout(() => sendMessage(transcription), 100);
    }
  };

  const handleClearChat = () => {
    if (messages.length === 0 && socraticTurns.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear all messages?')) {
      clearAllMessages();
      if (socraticSession) {
        completeSession();
      }
      stop();
      setLastSpokenMessageId(null);
      updateState({
        promptType: 'initiate_session',
        isInQuiz: false,
        inRefresherMode: false,
        lastAIQuestion: null,
        currentTopic: null,
        incorrectAnswersCount: 0,
        teachingMethods: []
      });
      
      toast({
        title: "Chat cleared",
        description: "Starting fresh conversation",
        duration: 2000
      });
    }
  };

  const handleAutoPlayToggle = () => {
    const newAutoPlay = !autoPlayEnabled;
    setAutoPlayEnabled(newAutoPlay);
    safeLocalStorage.setItem('aistudycoach_voice_autoplay', newAutoPlay.toString());
    
    toast({
      title: newAutoPlay ? "Auto-play on" : "Auto-play off",
      duration: 1500
    });
  };

  // Merge messages for display
  const displayMessages = socraticSession 
    ? socraticTurns.map(turn => ({
        id: turn.id,
        role: turn.role === 'coach' ? 'assistant' : turn.role,
        content: turn.content,
        timestamp: turn.created_at,
        score: turn.score,
        misconception: turn.misconception
      }))
    : messages;

  // Auto-play AI responses
  useEffect(() => {
    if (!autoPlayEnabled || !settings.enabled) return;
    
    const lastMessage = displayMessages[displayMessages.length - 1];
    if (lastMessage && 
        lastMessage.role === 'assistant' && 
        lastMessage.id !== lastSpokenMessageId &&
        !isLoading) {
      
      cleanup.setTimeout(() => {
        speak(lastMessage.content);
        setLastSpokenMessageId(lastMessage.id);
      }, 500);
    }
  }, [displayMessages, autoPlayEnabled, settings.enabled, lastSpokenMessageId, isLoading, speak]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Demo Badge */}
      <div className="flex-shrink-0 bg-primary/10 border-b border-border p-2 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          🤖 AI Study Coach {user ? '- Authenticated' : '- Demo Mode'}
        </span>
        {displayMessages.length >= 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <div className="space-y-4">
          {/* Socratic Session Panel */}
          {showSocraticPanel && (
            <div className="mb-4">
              <SocraticSessionPanel
                onStartSession={handleStartSocraticSession}
                onCancel={() => setShowSocraticPanel(false)}
              />
            </div>
          )}

          {/* Session Info */}
          {socraticSession && socraticSession.state !== 'COMPLETED' && (
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{socraticSession.topic}</p>
                  <p className="text-sm text-muted-foreground">{socraticSession.objective}</p>
                </div>
                <Badge variant="secondary">
                  Avg: {calculateAverageScore(socraticSession.score_history).toFixed(1)}/3
                </Badge>
              </div>
            </div>
          )}

          {/* Empty State */}
          {displayMessages.length === 0 && !showSocraticPanel && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">AI Study Coach</p>
                <p className="text-sm">Start a conversation or toggle to Structured Mode!</p>
              </div>
            </div>
          )}

          {/* Messages */}
          {displayMessages.map((msg: any) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 p-4 rounded-lg max-w-[85%]",
                msg.role === 'user'
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "mr-auto bg-muted"
              )}
            >
              <div className="flex-shrink-0">
                {msg.role === 'user' ? (
                  <User className="w-6 h-6" />
                ) : (
                  <Bot className="w-6 h-6 text-purple-600" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                </div>
                {msg.role === 'assistant' && settings.enabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (isSpeaking && lastSpokenMessageId === msg.id) {
                        stop();
                      } else {
                        speak(msg.content);
                        setLastSpokenMessageId(msg.id);
                      }
                    }}
                    className="h-6 px-2 text-xs"
                  >
                    {isSpeaking && lastSpokenMessageId === msg.id ? (
                      <VolumeX className="w-3 h-3" />
                    ) : (
                      <Volume2 className="w-3 h-3" />
                    )}
                  </Button>
                )}
                {/* Socratic Score */}
                {msg.score !== undefined && (
                  <div className="text-xs text-muted-foreground mt-2">
                    <Badge variant={msg.score >= 3 ? 'default' : msg.score >= 2 ? 'secondary' : 'outline'}>
                      Score: {msg.score}/3
                    </Badge>
                    {msg.misconception && (
                      <span className="ml-2 text-amber-500">
                        • {msg.misconception}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading */}
          {(isLoading || socraticLoading) && (
            <div className="flex gap-3 p-4 rounded-lg max-w-[85%] mr-auto bg-muted">
              <Bot className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm">{socraticSession ? 'Evaluating...' : 'Thinking...'}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Bottom Controls */}
      <div className="flex-shrink-0 p-4 max-w-4xl mx-auto w-full bg-background border-t">
        {/* Mode Toggle & Voice Controls */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <SocraticModeToggle
            enabled={!!socraticSession && socraticSession.state !== 'COMPLETED'}
            onToggle={handleToggleSocraticMode}
            sessionActive={!!socraticSession}
            averageScore={socraticSession ? calculateAverageScore(socraticSession.score_history) : undefined}
            disabled={isLoading || socraticLoading}
          />
          
          {settings.enabled && (
            <div className="flex items-center gap-2">
              <Button
                variant={autoPlayEnabled ? "default" : "outline"}
                size="sm"
                onClick={handleAutoPlayToggle}
              >
                <Volume2 className="w-4 h-4 mr-1" />
                Auto-play
              </Button>
              <Button
                variant={voiceInput.isRecording ? "default" : "outline"}
                size="sm"
                onClick={() => voiceInput.isRecording ? voiceInput.stopRecording() : voiceInput.startRecording(handleVoiceInput)}
              >
                {voiceInput.isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder={socraticSession ? "Type your answer..." : "Ask me anything..."}
            disabled={isLoading || socraticLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading || socraticLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StandaloneAIStudyCoachChat;