import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Brain, User, Bot, Mic, MicOff, Settings, Save, History, Zap, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
// import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
// import SaveToNotesDialog from './SaveToNotesDialog';
// import QuizSessionWidget from './QuizSessionWidget';
// import { useQuizSession } from '@/hooks/useQuizSession';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  ragMetadata?: {
    ragEnabled: boolean;
    personalItems: number;
    externalItems: number;
    similarItems: number;
    confidence: number;
    sources: string[];
  };
}

interface AdvancedChatInterfaceProps {
  user: any;
  completedSessions: any[];
  flashcards: any[];
  insights: any;
  fixedHeight?: boolean;
}

const AdvancedChatInterface: React.FC<AdvancedChatInterfaceProps> = ({ 
  user, 
  completedSessions, 
  flashcards, 
  insights, 
  fixedHeight = false 
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'personal' | 'general'>('personal');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [showQuizWidget, setShowQuizWidget] = useState(false);
  const [sessionId, setSessionId] = useLocalStorage<string | null>('ai_coach_session_id', null);
  const [ttsEnabled, setTtsEnabled] = useLocalStorage<boolean>('ai_coach_tts_enabled', false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  
  const { toast } = useToast();
  // const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  // const { sessionState, startQuizSession } = useQuizSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session and load chat history
  useEffect(() => {
    if (user?.id) {
      initializeSession();
    }
  }, [user?.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getWelcomeMessage = (mode = chatMode) => {
    if (mode === 'personal') {
      return `Hello! I'm your AI Learning Coach with full access to your study data. I can help you with:

🎯 **Personalized Study Guidance** - Based on your ${completedSessions.length} study sessions
📚 **Flashcard Analysis** - Using your ${flashcards.length} flashcards  
🧠 **Learning Pattern Insights** - From your study history
🎮 **Quiz Sessions** - Just say "quiz me" to start practicing
💡 **Study Tips** - Tailored to your learning style

What would you like to work on today?`;
    } else {
      return `Hello! I'm your AI Learning Coach in General Knowledge mode. I can help you with:

🌐 **General Academic Help** - Any subject or topic
📖 **Research Assistance** - Finding and explaining concepts
🧠 **Study Techniques** - General learning strategies
💡 **Educational Guidance** - Academic advice and tips
🔍 **Concept Explanations** - Breaking down complex ideas

Note: In this mode, I don't access your personal study data. Switch to "My Data" mode for personalized assistance.

What would you like to learn about today?`;
    }
  };

  const initializeSession = async () => {
    try {
      if (!sessionId) {
        // Create new session
        const { data, error } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user.id,
            title: 'AI Coach Session',
            context_tag: 'AI Coach'
          })
          .select()
          .single();

        if (error) throw error;
        setSessionId(data.id);
        
        // Add welcome message based on current mode
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: getWelcomeMessage(),
          timestamp: new Date().toISOString()
        }]);
      } else {
        // Load existing messages
        loadChatHistory();
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      toast({
        title: "Session Error", 
        description: "Failed to initialize chat session",
        variant: "destructive"
      });
    }
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setMessages(data as ChatMessage[]);
      } else {
        // If no chat history, show welcome message
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: getWelcomeMessage(),
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // On error, show welcome message
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date().toISOString()
      }]);
    }
  };

  // Text-to-Speech functionality
  const speakText = useCallback((text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;

    // Stop any current speech
    if (currentUtterance) {
      speechSynthesis.cancel();
      setCurrentUtterance(null);
      setIsSpeaking(false);
    }

    // Clean text for better speech (remove markdown, emojis, etc.)
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/#{1,6}\s*(.*)/g, '$1') // Remove headers
      .replace(/[🎯📚🧠🎮💡🌐📖🔍]/g, '') // Remove emojis
      .replace(/\n\s*\n/g, '. ') // Replace double line breaks with periods
      .replace(/\n/g, ' ') // Replace single line breaks with spaces
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Configure voice settings
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Try to use a pleasant voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentUtterance(utterance);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentUtterance(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentUtterance(null);
      toast({
        title: "Speech Error",
        description: "Unable to speak the message",
        variant: "destructive"
      });
    };

    speechSynthesis.speak(utterance);
  }, [ttsEnabled, currentUtterance, toast]);

  const stopSpeaking = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentUtterance(null);
  }, []);

  const toggleTTS = useCallback(() => {
    setTtsEnabled(!ttsEnabled);
    if (!ttsEnabled) {
      toast({
        title: "Text-to-Speech Enabled",
        description: "AI responses will now be spoken aloud",
      });
    } else {
      stopSpeaking();
      toast({
        title: "Text-to-Speech Disabled",
        description: "AI responses will no longer be spoken",
      });
    }
  }, [ttsEnabled, stopSpeaking, toast]);

  // Auto-speak new AI messages when TTS is enabled
  useEffect(() => {
    if (ttsEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !isLoading) {
        // Small delay to ensure message is fully rendered
        setTimeout(() => speakText(lastMessage.content), 500);
      }
    }
  }, [messages, ttsEnabled, isLoading, speakText]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Quiz detection
  const detectQuizRequest = (text: string): boolean => {
    const quizKeywords = [
      'quiz me', 'practice', 'review these', 'test me', 'challenge me',
      'quiz session', 'study session', 'practice cards', 'drill me',
      'start quiz', 'quiz time'
    ];
    return quizKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !user?.id) return;

    // Check for quiz session request
    if (detectQuizRequest(message) && flashcards && flashcards.length > 0) {
      setShowQuizWidget(true);
      setMessage('');
      return;
    } else if (detectQuizRequest(message) && (!flashcards || flashcards.length === 0)) {
      // Handle no flashcards available
      const noCardsMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I'd love to start a quiz session with you! However, you don't have any flashcards yet. 

📚 **To get started:**
1. Upload study materials using the file upload card
2. The AI will automatically generate flashcards from your content
3. Then you can say "quiz me" to practice!

You can upload PDFs, documents, or text files and I'll create personalized flashcards for you.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, noCardsMessage]);
      setMessage('');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Save user message to database
      if (sessionId) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            role: 'user',
            content: userMessage.content,
            timestamp: userMessage.timestamp
          });
      }

      // Call enhanced AI function with full context
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: userMessage.content,
          userId: user.id,
          sessionId: sessionId,
          chatMode,
          voiceActive: false,
          metadata: {
            completedSessions: completedSessions?.length || 0,
            flashcardCount: flashcards?.length || 0,
            ragEnabled: true,
            insights: insights
          }
        }
      });

      let aiResponse: ChatMessage;

      if (error || !data?.response) {
        // Enhanced fallback with study-specific guidance
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateStudyFallbackResponse(userMessage.content, completedSessions, flashcards),
          timestamp: new Date().toISOString()
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
          ragMetadata: data.ragMetadata
        };
      }

      setMessages(prev => [...prev, aiResponse]);

      // Save AI response to database
      if (sessionId) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            role: 'assistant',
            content: aiResponse.content,
            timestamp: aiResponse.timestamp
          });
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateStudyFallbackResponse(userMessage.content, completedSessions, flashcards),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, fallbackResponse]);
      
      toast({
        title: "Connection Issue",
        description: "Using enhanced offline mode with your study data",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateStudyFallbackResponse = (userMsg: string, sessions: any[], cards: any[]): string => {
    const sessionCount = sessions?.length || 0;
    const cardCount = cards?.length || 0;
    
    return `Based on your question about "${userMsg}" and your study data (${sessionCount} sessions, ${cardCount} flashcards):

🎯 **Personalized Recommendations:**
- You've completed ${sessionCount} study sessions - great progress!
- With ${cardCount} flashcards, try active recall: test yourself without looking
- Focus on spaced repetition: review cards at increasing intervals

📚 **Study Techniques for Your Level:**
- **Pomodoro Method**: 25-min focused sessions (perfect for your pace)
- **Feynman Technique**: Explain concepts in simple terms
- **Active Recall**: Quiz yourself regularly on your flashcards

🧠 **Memory Enhancement:**
- Create visual associations for difficult concepts
- Use mnemonic devices for lists and sequences
- Practice interleaving: mix different topics in study sessions

💡 **Next Steps:**
- Try saying "quiz me" to practice with your flashcards
- Upload new study materials for personalized analysis
- Set up a regular study schedule based on your ${sessionCount} completed sessions

What specific topic from your studies would you like to dive deeper into?`;
  };

  const handleVoiceToggle = async () => {
    // Temporarily disabled
    toast({
      title: "Voice feature temporarily disabled",
      description: "We're working on improving this feature"
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveToNotes = (message: ChatMessage) => {
    setSelectedMessage(message);
    setShowSaveDialog(true);
  };

  const clearChat = async () => {
    try {
      if (sessionId) {
        await supabase
          .from('chat_messages')
          .delete()
          .eq('session_id', sessionId);
      }
      setMessages([]);
      setSessionId(null);
      await initializeSession();
      
      toast({
        title: "Chat Cleared",
        description: "Started a new conversation",
      });
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  return (
    <>
      <Card className={cn("w-full", fixedHeight ? "h-full flex flex-col" : "min-h-[600px]")}>
        <CardHeader className="flex-shrink-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <h2 className="font-semibold text-lg">AI Learning Coach</h2>
              <Badge variant="outline" className="text-xs">
                {completedSessions.length} Sessions • {flashcards.length} Cards
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Chat Mode Toggle */}
              <div className="flex rounded-lg border p-1">
                <button
                  onClick={() => {
                    setChatMode('personal');
                    // Update welcome message if this is the only message
                    if (messages.length === 1 && messages[0].id === 'welcome') {
                      setMessages([{
                        id: 'welcome',
                        role: 'assistant',
                        content: getWelcomeMessage('personal'),
                        timestamp: new Date().toISOString()
                      }]);
                    }
                  }}
                  className={cn(
                    "px-3 py-1 text-xs rounded transition-colors",
                    chatMode === 'personal' 
                      ? "bg-purple-100 text-purple-700 font-medium" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  🔒 My Data
                </button>
                <button
                  onClick={() => {
                    setChatMode('general');
                    // Update welcome message if this is the only message
                    if (messages.length === 1 && messages[0].id === 'welcome') {
                      setMessages([{
                        id: 'welcome',
                        role: 'assistant',
                        content: getWelcomeMessage('general'),
                        timestamp: new Date().toISOString()
                      }]);
                    }
                  }}
                  className={cn(
                    "px-3 py-1 text-xs rounded transition-colors",
                    chatMode === 'general' 
                      ? "bg-blue-100 text-blue-700 font-medium" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  🌐 General
                </button>
              </div>
              
              {/* Text-to-Speech Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTTS}
                  className={cn(
                    "h-8 w-8 p-0",
                    ttsEnabled ? "text-green-600 bg-green-50" : "text-gray-500"
                  )}
                  title={ttsEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
                >
                  {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                
                {isSpeaking && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stopSpeaking}
                    className="h-8 w-8 p-0 text-red-600 bg-red-50"
                    title="Stop speaking"
                  >
                    <VolumeX className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="h-8 w-8 p-0"
              >
                <History className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={cn("flex flex-col", fixedHeight ? "flex-1 min-h-0" : "")}>
          {/* Messages Area */}
          <div className={cn(
            "flex-1 overflow-y-auto mb-4 space-y-4",
            fixedHeight ? "min-h-0" : "min-h-[400px] max-h-[400px]"
          )}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 p-3 rounded-lg group",
                  msg.role === 'user'
                    ? "bg-purple-50 ml-8"
                    : "bg-gray-50 mr-8"
                )}
              >
                <div className="flex-shrink-0">
                  {msg.role === 'user' ? (
                    <User className="h-5 w-5 text-purple-600" />
                  ) : (
                    <Bot className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                  
                  {/* RAG Metadata */}
                  {msg.ragMetadata && (
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        🔍 RAG Enhanced
                      </Badge>
                      {msg.ragMetadata.personalItems > 0 && (
                        <Badge variant="outline" className="text-xs">
                          📚 {msg.ragMetadata.personalItems} Personal
                        </Badge>
                      )}
                      {msg.ragMetadata.externalItems > 0 && (
                        <Badge variant="outline" className="text-xs">
                          🌐 {msg.ragMetadata.externalItems} External
                        </Badge>
                      )}
                    </div>
                  )}
                  
                   <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-500">
                       {new Date(msg.timestamp).toLocaleTimeString()}
                     </span>
                     
                     {/* Speech controls for AI messages */}
                     {msg.role === 'assistant' && 'speechSynthesis' in window && (
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => speakText(msg.content)}
                         className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                         title="Speak this message"
                       >
                         <Volume2 className="h-3 w-3" />
                       </Button>
                     )}
                   </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 p-3 rounded-lg bg-gray-50 mr-8">
                <Bot className="h-5 w-5 text-gray-600" />
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {chatMode === 'personal' ? 'Analyzing your study data...' : 'Accessing general knowledge...'}
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    user?.id 
                      ? chatMode === 'personal' 
                        ? "Ask about your study data, flashcards, or say 'quiz me'..."
                        : "Ask any general knowledge question..."
                      : "Please log in to chat"
                  }
                  disabled={isLoading || !user?.id}
                  className="pr-12"
                />
                
                {/* Voice Recording Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  )}
                  onClick={handleVoiceToggle}
                  disabled={!user?.id}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim() || !user?.id}
                size="icon"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>💡 Try: "Quiz me", "Analyze my progress", or "Study tips"</span>
                {ttsEnabled && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Volume2 className="h-3 w-3" />
                    <span>TTS Enabled</span>
                    {isSpeaking && <span className="animate-pulse">• Speaking</span>}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {chatMode === 'personal' ? '🔒 My Data' : '🌐 General'}
                </Badge>
                {chatMode === 'personal' && (
                  <span className="text-xs text-purple-600">
                    {completedSessions.length}S • {flashcards.length}F
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temporarily remove save dialog and quiz widget until dependencies are fixed */}
    </>
  );
};

export default AdvancedChatInterface;