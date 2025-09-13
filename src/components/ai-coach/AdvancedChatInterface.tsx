import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Brain, User, Bot, Mic, MicOff, History, Volume2, VolumeX, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useEnhancedVoiceInput } from '@/hooks/useEnhancedVoiceInput';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { useChatMode } from '@/hooks/useChatMode';
import { useChatMessages } from '@/hooks/useChatMessages';
import { cn } from '@/lib/utils';
import ChatModeToggle from './ChatModeToggle';

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
  const { chatMode, changeChatMode } = useChatMode();
  const [showQuizWidget, setShowQuizWidget] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitializingSession, setIsInitializingSession] = useState(false);
  const [lastSpokenMessageId, setLastSpokenMessageId] = useState<string | null>(null);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(() => 
    localStorage.getItem('aistudycoach_voice_autoplay') === 'true'
  );
  
  const { toast } = useToast();
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();
  const { settings, toggle } = useVoiceSettings();
  const voiceInput = useEnhancedVoiceInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use the new hybrid chat system
  const { 
    messages, 
    isLoading, 
    isSending, 
    sendMessage, 
    addMessage, 
    loadMessages 
  } = useChatMessages(sessionId);

  // Initialize session with proper race condition handling
  useEffect(() => {
    if (user?.id && !sessionId && !isInitializingSession) {
      initializeSession();
    }
  }, [user?.id, sessionId, isInitializingSession]);

  const initializeSession = async () => {
    if (!user || isInitializingSession) return;
    
    setIsInitializingSession(true);
    try {
      console.log('Initializing new chat session...');
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
      
      console.log('Session initialized:', data.id);
      setSessionId(data.id);
    } catch (error) {
      console.error('Error initializing session:', error);
      toast({
        title: "Session Error",
        description: "Failed to initialize chat session. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setIsInitializingSession(false);
    }
  };

  // Auto scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }, 100);
    }
  }, [messages]);



  // Clean text for speech synthesis
  const cleanTextForSpeech = useCallback((text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s*(.*)/g, '$1')
      .replace(/[🎯📚🧠🎮💡🌐📖🔍]/g, '')
      .replace(/\n\s*\n/g, '. ')
      .replace(/\n/g, ' ')
      .trim();
  }, []);

  const speakText = useCallback((text: string) => {
    const cleanText = cleanTextForSpeech(text);
    if (cleanText) {
      speak(cleanText, { interrupt: true });
    }
  }, [speak, cleanTextForSpeech]);

  // Auto-speak new AI messages when TTS is enabled
  useEffect(() => {
    const autoPlayEnabled = localStorage.getItem('aistudycoach_voice_autoplay') === 'true';
    
    if (settings.enabled && settings.autoRead && autoPlayEnabled && messages.length > 0 && !isLoading) {
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.role === 'assistant' && lastMessage.id !== lastSpokenMessageId) {
        setLastSpokenMessageId(lastMessage.id);
        setTimeout(() => {
          if (settings.enabled) {
            speakText(lastMessage.content);
          }
        }, 500);
      }
    }
  }, [messages, settings.enabled, settings.autoRead, isLoading, lastSpokenMessageId, speakText]);

  // Flashcard quiz detection
  const detectQuizRequest = (text: string): boolean => {
    const quizKeywords = ['quiz me', 'practice my flashcards', 'review my cards', 'flashcard quiz'];
    return quizKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSending || !user?.id) return;
    
    // If no session exists, wait for it to be created
    if (!sessionId) {
      if (!isInitializingSession) {
        console.log('No session found, initializing...');
        await initializeSession();
      } else {
        console.log('Session already initializing, waiting...');
      }
      
      // Wait for session to be ready
      let attempts = 0;
      while (!sessionId && attempts < 50) { // 5 second timeout
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!sessionId) {
        toast({
          title: "Session Error",
          description: "Could not create chat session. Please refresh the page.",
          variant: "destructive"
        });
        return;
      }
    }

    // Check for quiz session request
    if (detectQuizRequest(message)) {
      if (flashcards && flashcards.length > 0) {
        setShowQuizWidget(true);
      } else {
        await addMessage(`I'd love to start a quiz session! However, you don't have any flashcards yet. 

📚 **To get started:**
1. Upload study materials using the file upload card
2. The AI will automatically generate flashcards from your content
3. Then you can say "quiz me" to practice!`, 'assistant');
      }
      setMessage('');
      return;
    }

    // Store message before sending
    const messageToSend = message;
    setMessage('');
    
    try {
      console.log('Sending message with sessionId:', sessionId);
      // Use the hybrid chat system
      await sendMessage(messageToSend, undefined, chatMode);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Send Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      // Restore the message if sending failed
      setMessage(messageToSend);
    }
  };

  const handleVoiceInput = async () => {
    if (voiceInput.isRecording) {
      try {
        const transcribedText = await voiceInput.stopRecording();
        if (transcribedText && transcribedText.trim()) {
          setMessage(transcribedText.trim());
          setTimeout(() => handleSendMessage(), 100);
        }
      } catch (error) {
        console.error('Error stopping voice recording:', error);
        toast({
          title: "Voice Input Error",
          description: "Failed to process voice input. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      try {
        await voiceInput.startRecording((text) => {
          setMessage(text);
        });
      } catch (error) {
        console.error('Error starting voice recording:', error);
        toast({
          title: "Voice Input Error", 
          description: "Could not access microphone. Please check permissions.",
          variant: "destructive"
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = async () => {
    try {
      stop();
      setLastSpokenMessageId(null);
      setSessionId(null);
      toast({
        title: "Chat Cleared",
        description: "Started a new conversation",
      });
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const handlePlayIntroduction = useCallback(() => {
    if (messages.length > 0) {
      const welcomeMessage = messages.find(msg => msg.role === 'assistant');
      if (welcomeMessage) {
        speakText(welcomeMessage.content);
        setHasPlayedIntro(true);
      }
    }
  }, [messages, speakText]);

  const handleAutoPlayToggle = useCallback(() => {
    const newAutoPlayEnabled = !autoPlayEnabled;
    setAutoPlayEnabled(newAutoPlayEnabled);
    localStorage.setItem('aistudycoach_voice_autoplay', newAutoPlayEnabled.toString());
  }, [autoPlayEnabled]);

  return (
    <>
      <Card className={cn("w-full overflow-x-hidden", fixedHeight ? "h-full flex flex-col" : "min-h-[600px]")}>
        <CardHeader className="flex-shrink-0 pb-4 overflow-x-hidden">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Brain className="h-6 w-6 text-purple-600" />
              <h2 className="font-semibold text-lg">AI Learning Coach</h2>
              <Badge variant="outline" className="text-xs">
                {completedSessions.length} Sessions • {flashcards.length} Cards
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
              {/* Chat Mode Toggle */}
              <ChatModeToggle 
                mode={chatMode} 
                onModeChange={(mode) => {
                  changeChatMode(mode);
                  setLastSpokenMessageId(null);
                }}
                className="scale-90 w-full sm:w-auto max-w-full min-w-0"
              />
              
              {/* Text-to-Speech Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggle}
                  className={cn(
                    "h-8 w-8 p-0",
                    settings.enabled ? "text-green-600 bg-green-50" : "text-gray-500"
                  )}
                  title={settings.enabled ? "Disable text-to-speech" : "Enable text-to-speech"}
                >
                  {settings.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                
                {isSpeaking && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stop}
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
        
        <CardContent className={cn("overflow-x-hidden flex flex-col", fixedHeight ? "flex-1 min-h-0" : "")}>
          {/* Audio Introduction Controls */}
          {!hasPlayedIntro && messages.length > 0 && messages[0].role === 'assistant' && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 mb-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Button
                  onClick={handlePlayIntroduction}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-fit"
                  size="sm"
                  aria-label="Play introduction"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play Introduction
                </Button>
                <span className="text-xs sm:text-sm text-purple-700 break-words">Listen to a spoken welcome message</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPlayEnabled}
                    onChange={handleAutoPlayToggle}
                    className="rounded border-purple-300 text-purple-600 focus:ring-purple-500 flex-shrink-0"
                  />
                  <span className="text-xs sm:text-sm text-purple-700 break-words">Enable auto-play next time</span>
                </label>
              </div>
            </div>
          )}
          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            className={cn(
              "flex-1 overflow-y-auto mb-4 space-y-4",
              fixedHeight ? "min-h-0" : "min-h-[400px] max-h-[400px]"
            )}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                data-message-role={msg.role}
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
            
            {(isLoading || isSending) && (
              <div className="flex gap-3 p-3 rounded-lg bg-gray-50 sm:mr-8">
                <Bot className="h-5 w-5 text-gray-600" />
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {chatMode === 'personal' ? 'Analyzing your study data...' : 'Processing your request...'}
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
                         : "Ask platform questions or general knowledge..."
                      : "Please log in to chat"
                  }
                  disabled={isSending || !user?.id}
                  className="pr-12"
                />
                
                {/* Voice Input Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0",
                    voiceInput.isRecording && "text-red-500"
                  )}
                  onClick={handleVoiceInput}
                  disabled={!user?.id || voiceInput.isProcessing}
                  title={voiceInput.isRecording ? "Stop voice input" : "Start voice input"}
                >
                  {voiceInput.isRecording ? (
                    <MicOff className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={isSending || !message.trim() || !user?.id || isInitializingSession}
                size="icon"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-4 min-w-0">
                <span className="truncate">💡 Try: "Quiz me", "Analyze my progress", or click mic to speak</span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {isInitializingSession && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                      <span>Initializing...</span>
                    </div>
                  )}
                  {settings.enabled && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Volume2 className="h-3 w-3" />
                      <span>TTS</span>
                      {isSpeaking && <span className="animate-pulse">• Speaking</span>}
                    </div>
                  )}
                  {voiceInput.isNativeSupported && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Mic className="h-3 w-3" />
                      <span>Voice Input</span>
                      {voiceInput.isRecording && <span className="animate-pulse">• Listening</span>}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="outline" className="text-xs">
                  {chatMode === 'personal' ? '🔒 My Data' : '🏫 General & Guide'}
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
