import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, BookOpen, Clock, TrendingUp, Target, Award, Zap, MessageSquare, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SpeedControl } from '@/components/coach/SpeedControl';
import type { Persona, AIDrill } from '@/types/aiCoach';
import { useCommandCenterChat } from '@/hooks/useCommandCenterChat';
import type { CommandCenterMessage } from '@/hooks/useCommandCenterChat';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAICoachStudyMaterials } from '@/hooks/useAICoachStudyMaterials';
import { useAICoachConversations } from '@/hooks/useAICoachConversations';
import { useAICoachCommandAnalytics } from '@/hooks/useAICoachCommandAnalytics';
import { useAICoachStudyPlans } from '@/hooks/useAICoachStudyPlans';
import { toast } from 'sonner';
import VoiceInputButton from '@/components/notes/VoiceInputButton';
import { MessageBubble } from '@/components/ai-coach/MessageBubble';
import VoiceSettingsCard from '@/components/ai-coach/VoiceSettingsCard';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';

// Left Column: Context & History
const ContextHistoryColumn: React.FC<{
  studyMaterials: any[];
  savedChats: any[];
  onLoadChat: (chatId: string) => void;
  onUploadMaterial: (file: File) => Promise<boolean>;
  isLoadingMaterials: boolean;
  isLoadingChats: boolean;
}> = ({ studyMaterials, savedChats, onLoadChat, onUploadMaterial, isLoadingMaterials, isLoadingChats }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const success = await onUploadMaterial(file);
    if (success && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "bg-blue-50/90 border border-blue-100 shadow-md hover:shadow-lg rounded-xl flex flex-col transition-shadow duration-200",
      isMobile ? "p-3 min-h-[50vh]" : "p-4 lg:p-6 h-[calc(100vh-240px)]"
    )}>
      <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6">
      {/* Uploaded Study Materials */}
      <div>
        <h3 className={cn(
          "font-semibold text-gray-800 flex items-center gap-2 mb-3",
          isMobile ? "text-base" : "text-lg"
        )}>
          <BookOpen className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
          Study Materials
        </h3>
        <div className="space-y-2">
          {isLoadingMaterials ? (
            <p className="text-sm text-gray-500 italic animate-pulse">Loading materials...</p>
          ) : studyMaterials.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No materials uploaded yet</p>
          ) : (
            studyMaterials.map((material) => (
              <div key={material.id} className="p-3 bg-purple-50/80 rounded border border-purple-200/60 hover:bg-purple-100/80 cursor-pointer transition">
                <p className="text-sm font-medium text-gray-800">{material.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {material.file_type || 'FILE'} • {new Date(material.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full mt-3 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition flex items-center justify-center gap-2 text-sm"
          >
            <Upload className="w-4 h-4" />
            Upload Material
          </button>
        </div>
      </div>

      {/* Saved Chats */}
      <div>
        <h3 className={cn(
          "font-semibold text-gray-800 flex items-center gap-2 mb-3",
          isMobile ? "text-base" : "text-lg"
        )}>
          <Clock className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
          Saved Chats
        </h3>
        <div className="space-y-2">
          {isLoadingChats ? (
            <p className="text-sm text-gray-500 italic animate-pulse">Loading chats...</p>
          ) : savedChats.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No saved chats yet</p>
          ) : (
            savedChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onLoadChat(chat.id)}
                className="p-3 bg-blue-50/80 rounded border border-blue-200/60 hover:bg-blue-100/80 cursor-pointer transition"
              >
                <p className="text-sm font-medium text-gray-800">{chat.title}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{chat.last_message_preview || 'No preview'}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {chat.message_count} messages • {new Date(chat.updated_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

// Right Column: Insights & Analytics
const InsightsAnalyticsColumn: React.FC<{
  analytics: any;
  studyPlan: any;
  drills: AIDrill[];
  isLoadingAnalytics: boolean;
  isLoadingPlan: boolean;
}> = ({ analytics, studyPlan, drills, isLoadingAnalytics, isLoadingPlan }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "bg-green-50/90 border border-green-100 shadow-md hover:shadow-lg rounded-xl flex flex-col transition-shadow duration-200",
      isMobile ? "p-3 min-h-[50vh]" : "p-4 lg:p-6 h-[calc(100vh-240px)]"
    )}>
      <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6">
      {/* Learning Analytics */}
      <div>
        <h3 className={cn(
          "font-semibold text-gray-800 flex items-center gap-2 mb-3",
          isMobile ? "text-base" : "text-lg"
        )}>
          <TrendingUp className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
          Learning Analytics
        </h3>
        {isLoadingAnalytics ? (
          <p className="text-sm text-gray-500 italic animate-pulse">Loading analytics...</p>
        ) : (
          <>
            <div className={cn("grid gap-3", isMobile ? "grid-cols-1 gap-2" : "grid-cols-2")}>
              <div className={cn("bg-blue-50 rounded border border-blue-200", isMobile ? "p-2" : "p-3")}>
                <p className="text-xs text-blue-600 font-medium">Study Time</p>
                <p className={cn("font-bold text-blue-800 mt-1", isMobile ? "text-lg" : "text-xl md:text-2xl")}>
                  {analytics?.totalStudyTime || 0}h
                </p>
              </div>
              <div className={cn("bg-green-50 rounded border border-green-200", isMobile ? "p-2" : "p-3")}>
                <p className="text-xs text-green-600 font-medium">Sessions</p>
                <p className={cn("font-bold text-green-800 mt-1", isMobile ? "text-lg" : "text-xl md:text-2xl")}>
                  {analytics?.sessionsCompleted || 0}
                </p>
              </div>
              <div className={cn("bg-purple-50 rounded border border-purple-200", isMobile ? "p-2" : "p-3")}>
                <p className="text-xs text-purple-600 font-medium">Avg Score</p>
                <p className={cn("font-bold text-purple-800 mt-1", isMobile ? "text-lg" : "text-xl md:text-2xl")}>
                  {analytics?.averageScore || 0}%
                </p>
              </div>
              <div className={cn("bg-amber-50 rounded border border-amber-200", isMobile ? "p-2" : "p-3")}>
                <p className="text-xs text-amber-600 font-medium">Streak</p>
                <p className={cn("font-bold text-amber-800 mt-1", isMobile ? "text-lg" : "text-xl md:text-2xl")}>
                  {analytics?.streakDays || 0} days
                </p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-600 font-medium mb-2">Topics Studied</p>
              <div className="flex flex-wrap gap-1">
                {analytics?.topicsStudied?.length > 0 ? (
                  analytics.topicsStudied.map((topic: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {topic}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">No topics yet</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* AI-Generated Study Plan */}
      <div>
        <h3 className={cn(
          "font-semibold text-gray-800 flex items-center gap-2 mb-3",
          isMobile ? "text-base" : "text-lg"
        )}>
          <Target className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
          Study Plan
        </h3>
        {isLoadingPlan ? (
          <p className="text-sm text-gray-500 italic animate-pulse">Loading study plan...</p>
        ) : studyPlan ? (
          <div className="p-3 bg-gradient-to-br from-fpk-primary to-fpk-secondary text-white rounded">
            <h4 className="font-semibold text-sm mb-1">{studyPlan.title}</h4>
            <p className="text-xs opacity-90 mb-2">{studyPlan.description}</p>
            <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
              <div
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${studyPlan.progress}%` }}
              />
            </div>
            <p className="text-xs">Progress: {studyPlan.progress}% • {studyPlan.estimatedTime}h remaining</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No active study plan</p>
        )}
      </div>

      {/* AI-Generated Drills */}
      <div>
        <h3 className={cn(
          "font-semibold text-gray-800 flex items-center gap-2 mb-3",
          isMobile ? "text-base" : "text-lg"
        )}>
          <Zap className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
          Practice Drills
        </h3>
        <div className="space-y-2">
          {drills.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No drills available yet</p>
          ) : (
            drills.slice(0, 3).map((drill) => (
              <div key={drill.id} className="p-3 bg-amber-50/80 rounded border border-amber-200/60 hover:bg-amber-100/80 cursor-pointer transition">
                <div className="flex items-start justify-between mb-1">
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded',
                    drill.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    drill.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  )}>
                    {drill.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">{drill.topic}</span>
                </div>
                <p className="text-sm text-gray-800 line-clamp-2">{drill.question}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Voice Controls */}
      <div>
        <h3 className={cn(
          "font-semibold text-gray-800 flex items-center gap-2 mb-3",
          isMobile ? "text-base" : "text-lg"
        )}>
          <Volume2 className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
          Voice Settings
        </h3>
        <VoiceSettingsCard />
      </div>
      </div>
    </div>
  );
};

// Center Column: AI Interaction
const AIInteractionColumn: React.FC<{
  messages: CommandCenterMessage[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onVoiceTranscription: (text: string) => void;
  isLoading: boolean;
}> = ({ messages, inputValue, onInputChange, onSendMessage, onVoiceTranscription, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string | null>(null);
  const isMobile = useIsMobile();

  // Intelligent auto-scroll: scrolls chat container on new AI messages
  useEffect(() => {
    if (messages.length === 0 || !messagesEndRef.current) return;
    
    // Get the ScrollArea viewport (2 levels up in DOM hierarchy)
    const scrollViewport = messagesEndRef.current.parentElement?.parentElement;
    if (!scrollViewport) return;
    
    // Check if this is a new message from an AI persona
    const lastMessage = messages[messages.length - 1];
    const isNewAssistantMessage = 
      lastMessage?.persona !== 'USER' && 
      lastMessage.id !== lastMessageRef.current;
    
    if (isNewAssistantMessage) {
      lastMessageRef.current = lastMessage.id;
    }
    
    const { scrollTop, scrollHeight, clientHeight } = scrollViewport;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isNearBottom = distanceFromBottom < 150;
    
    // Auto-scroll if: near bottom, first message, OR new AI response
    if (isNearBottom || messages.length === 1 || isNewAssistantMessage) {
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(() => {
          if (scrollViewport) {
            scrollViewport.scrollTo({
              top: scrollViewport.scrollHeight,
              behavior: 'smooth'
            });
          }
        });
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [messages]); // Trigger on any message change, including streaming updates

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className={cn(
      "bg-purple-50/90 border border-purple-100 shadow-md hover:shadow-lg rounded-xl flex flex-col transition-shadow duration-200",
      isMobile ? "p-3 h-[calc(100vh-200px)] min-h-[500px]" : "p-4 lg:p-6 h-[calc(100vh-240px)]"
    )}>
      <div className={cn(
        "font-semibold text-gray-800 flex items-center justify-between mb-4",
        isMobile ? "text-base" : "text-lg"
      )}>
        <div className="flex items-center gap-2">
          <Award className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
          <span>AI Study Coach</span>
        </div>
        <SpeedControl compact={isMobile} />
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-3 pr-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center min-h-[200px] text-center">
              <div>
                <p className="text-gray-500 mb-2">👋 Welcome to your AI Command Center!</p>
                <p className="text-sm text-gray-400">Ask a question or start studying to begin.</p>
              </div>
            </div>
          ) : (
            messages.map((message) => <MessageBubble key={message.id} message={message} />)
          )}
          {isLoading && (
            <div className="flex items-start">
              <div className="max-w-[80%] px-4 py-3 rounded-2xl shadow-sm bg-purple-100 border border-purple-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t pt-4 flex-shrink-0">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question or describe what you're studying..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-fpk-primary"
            rows={2}
          />
          <div className="flex flex-col gap-2">
            <VoiceInputButton
              onTranscription={onVoiceTranscription}
              placeholder="AI Coach voice input"
              disabled={isLoading}
            />
            <button
              onClick={onSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-fpk-primary hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
interface AICoachCommandCenterProps {
  isFreeChatAllowed?: boolean;
}

export const AICoachCommandCenter: React.FC<AICoachCommandCenterProps> = ({ isFreeChatAllowed = true }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Use the streaming chat hook
  const {
    messages,
    loading: isLoading,
    sendMessage: sendChatMessage,
    conversationId
  } = useCommandCenterChat(user?.id);
  
  const [inputValue, setInputValue] = useState('');

  // Live data hooks - replacing all placeholder data
  const { studyMaterials, isLoadingMaterials, uploadMaterial } = useAICoachStudyMaterials();
  const { conversations, isLoadingConversations, loadMessages, saveConversation } = useAICoachConversations();
  const { analytics, isLoadingAnalytics, trackSession } = useAICoachCommandAnalytics();
  const { activeStudyPlan, isLoadingPlan } = useAICoachStudyPlans();

  // Placeholder drills - will be implemented later
  const drills: AIDrill[] = [];

  // TTS Integration
  const { speak, stop } = useTextToSpeech();
  const { settings: voiceSettings } = useVoiceSettings();
  const prevMessagesLength = useRef(messages.length);

  // Auto-play new AI messages when autoRead is enabled
  useEffect(() => {
    if (messages.length > prevMessagesLength.current && voiceSettings.autoRead && voiceSettings.enabled) {
      const lastMessage = messages[messages.length - 1];
      
      // Only speak AI messages (not user messages, not CONDUCTOR, not while streaming)
      if (lastMessage.persona !== 'USER' && lastMessage.persona !== 'CONDUCTOR' && !lastMessage.isStreaming) {
        console.log('[TTS] 🔊 Auto-playing new AI message from', lastMessage.persona);
        speak(lastMessage.content, lastMessage.persona);
      }
    }
    
    prevMessagesLength.current = messages.length;
  }, [messages, voiceSettings.autoRead, voiceSettings.enabled, speak]);

  const handleSendMessage = async () => {
    console.log('[AI COMMAND CENTER] 🚀 handleSendMessage called', { 
      hasInput: !!inputValue.trim(), 
      isLoading, 
      hasUser: !!user,
      userId: user?.id 
    });
    
    if (!inputValue.trim() || isLoading || !user) {
      console.log('[AI COMMAND CENTER] ❌ Validation failed - not sending message');
      return;
    }

    const currentInput = inputValue;
    setInputValue('');
    
    console.log('[AI COMMAND CENTER] ✅ Calling sendChatMessage with:', currentInput);
    // Call the streaming hook's sendMessage
    await sendChatMessage(currentInput);

    // Track analytics after interaction
    await trackSession(5, [currentInput.substring(0, 50)]);
  };

  const handleVoiceTranscription = (transcription: string) => {
    setInputValue(transcription);
    // Text is now in the input, user can review and send
  };

  const handleLoadChat = async (chatId: string) => {
    toast.info('Chat history loading is managed by the streaming service');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      <div 
        className="w-full max-w-7xl rounded-3xl shadow-2xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/50"
        style={{ maxHeight: 'calc(100vh - 60px)' }}
      >
        <div className="h-full flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col p-2 sm:p-3 md:p-4 lg:p-6">
            <TabsList className="w-full grid grid-cols-3 mb-4 h-12 sm:h-14 md:h-16">
              <TabsTrigger value="materials" className="text-sm md:text-base lg:text-lg">
                <BookOpen className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="hidden sm:inline">Materials</span>
                <span className="sm:hidden">Materials</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-sm md:text-base lg:text-lg">
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="hidden sm:inline">Chat</span>
                <span className="sm:hidden">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-sm md:text-base lg:text-lg">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Analytics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="materials" className="flex-1 overflow-auto mt-0 p-2 sm:p-3 md:p-4 lg:p-6">
              <ContextHistoryColumn
                studyMaterials={studyMaterials}
                savedChats={conversations}
                onLoadChat={handleLoadChat}
                onUploadMaterial={uploadMaterial}
                isLoadingMaterials={isLoadingMaterials}
                isLoadingChats={isLoadingConversations}
              />
            </TabsContent>

            <TabsContent value="chat" className="flex-1 overflow-hidden mt-0">
              <div className="h-full p-2 sm:p-3 md:p-4 lg:p-6">
                <AIInteractionColumn
                  messages={messages}
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSendMessage={handleSendMessage}
                  onVoiceTranscription={handleVoiceTranscription}
                  isLoading={isLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="flex-1 overflow-auto mt-0 p-2 sm:p-3 md:p-4 lg:p-6">
              <InsightsAnalyticsColumn
                analytics={analytics}
                studyPlan={activeStudyPlan}
                drills={drills}
                isLoadingAnalytics={isLoadingAnalytics}
                isLoadingPlan={isLoadingPlan}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AICoachCommandCenter;
