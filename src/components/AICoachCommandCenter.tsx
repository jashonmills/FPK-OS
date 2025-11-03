import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, BookOpen, Clock, TrendingUp, Target, Award, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Message, Persona, AIDrill } from '@/types/aiCoach';
import { AIService } from '../services/aiService';
import { useAuth } from '@/hooks/useAuth';
import { useAICoachStudyMaterials } from '@/hooks/useAICoachStudyMaterials';
import { useAICoachConversations } from '@/hooks/useAICoachConversations';
import { useAICoachCommandAnalytics } from '@/hooks/useAICoachCommandAnalytics';
import { useAICoachStudyPlans } from '@/hooks/useAICoachStudyPlans';
import { toast } from 'sonner';
import VoiceInputButton from '@/components/notes/VoiceInputButton';

// Persona avatar components
const PersonaAvatar: React.FC<{ persona: Persona }> = ({ persona }) => {
  const avatarConfig = {
    USER: { bg: 'bg-blue-600', icon: '👤', label: 'You' },
    BETTY: { bg: 'bg-purple-600', icon: '🦉', label: 'Betty' },
    AL: { bg: 'bg-blue-500', icon: '🎓', label: 'Al' },
    NITE_OWL: { bg: 'bg-amber-500', icon: '🌙', label: 'Nite Owl' },
  };

  const config = avatarConfig[persona];

  return (
    <div className="flex items-center gap-2 mb-1">
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-sm', config.bg)}>
        {config.icon}
      </div>
      <span className="text-xs font-semibold text-gray-600">{config.label}</span>
    </div>
  );
};

// Message bubble component
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const bubbleStyles = {
    USER: 'bg-blue-600 text-white',
    BETTY: 'bg-purple-100 text-purple-900 border border-purple-200',
    AL: 'bg-blue-100 text-blue-900 border border-blue-200',
    NITE_OWL: 'bg-amber-100 text-amber-900 border border-amber-200',
  }[message.persona];

  return (
    <div className={cn('flex flex-col', message.persona === 'USER' ? 'items-end' : 'items-start')}>
      <PersonaAvatar persona={message.persona} />
      <div className={cn('max-w-[80%] px-4 py-3 rounded-2xl shadow-sm', bubbleStyles)}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

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
  return (
    <div className="bg-blue-50/90 border border-blue-100 shadow-md hover:shadow-lg rounded-xl p-6 space-y-6 h-full overflow-y-auto transition-shadow duration-200">
      {/* Uploaded Study Materials */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5" />
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
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5" />
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
  return (
    <div className="bg-green-50/90 border border-green-100 shadow-md hover:shadow-lg rounded-xl p-6 space-y-6 h-full overflow-y-auto transition-shadow duration-200">
      {/* Learning Analytics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5" />
          Learning Analytics
        </h3>
        {isLoadingAnalytics ? (
          <p className="text-sm text-gray-500 italic animate-pulse">Loading analytics...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-600 font-medium">Study Time</p>
                <p className="text-2xl font-bold text-blue-800 mt-1">{analytics?.totalStudyTime || 0}h</p>
              </div>
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <p className="text-xs text-green-600 font-medium">Sessions</p>
                <p className="text-2xl font-bold text-green-800 mt-1">{analytics?.sessionsCompleted || 0}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded border border-purple-200">
                <p className="text-xs text-purple-600 font-medium">Avg Score</p>
                <p className="text-2xl font-bold text-purple-800 mt-1">{analytics?.averageScore || 0}%</p>
              </div>
              <div className="p-3 bg-amber-50 rounded border border-amber-200">
                <p className="text-xs text-amber-600 font-medium">Streak</p>
                <p className="text-2xl font-bold text-amber-800 mt-1">{analytics?.streakDays || 0} days</p>
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
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <Target className="w-5 h-5" />
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
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5" />
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
    </div>
  );
};

// Center Column: AI Interaction
const AIInteractionColumn: React.FC<{
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onVoiceTranscription: (text: string) => void;
  isLoading: boolean;
}> = ({ messages, inputValue, onInputChange, onSendMessage, onVoiceTranscription, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="bg-purple-50/90 border border-purple-100 shadow-md hover:shadow-lg rounded-xl p-6 flex flex-col h-full transition-shadow duration-200">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <Award className="w-5 h-5" />
        AI Study Coach
      </h3>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
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

      {/* Input Area */}
      <div className="border-t pt-4">
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
export const AICoachCommandCenter: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Live data hooks - replacing all placeholder data
  const { studyMaterials, isLoadingMaterials, uploadMaterial } = useAICoachStudyMaterials();
  const { conversations, isLoadingConversations, loadMessages, saveConversation } = useAICoachConversations();
  const { analytics, isLoadingAnalytics, trackSession } = useAICoachCommandAnalytics();
  const { activeStudyPlan, isLoadingPlan } = useAICoachStudyPlans();

  // Placeholder drills - will be implemented later
  const drills: AIDrill[] = [];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      persona: 'USER',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the real AI orchestrator with actual user ID
      const response = await AIService.sendMessage(
        user.id,
        currentInput,
        messages
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        persona: response.persona.toUpperCase() as Persona,
        content: response.content,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);

      // Track analytics after successful interaction
      await trackSession(5, [currentInput.substring(0, 50)]);

      // Auto-save conversation every 4 messages (2 exchanges)
      if (messages.length > 0 && messages.length % 4 === 0) {
        const conversationMessages = [...messages, userMessage, aiMessage].map(msg => ({
          role: msg.persona === 'USER' ? 'user' as const : 'assistant' as const,
          content: msg.content,
          persona: msg.persona === 'USER' ? undefined : msg.persona
        }));
        
        const title = messages[0]?.content.substring(0, 50) || 'New Conversation';
        await saveConversation(title, conversationMessages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        persona: 'BETTY',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscription = (transcription: string) => {
    setInputValue(transcription);
    // Text is now in the input, user can review and send
  };

  const handleLoadChat = async (chatId: string) => {
    try {
      const loadedMessages = await loadMessages(chatId);
      
      // Transform to Message format
      const transformedMessages: Message[] = loadedMessages.map(msg => ({
        id: msg.id,
        persona: msg.role === 'user' ? 'USER' : (msg.persona?.toUpperCase() as Persona || 'BETTY'),
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }));
      
      setMessages(transformedMessages);
      toast.success('Chat loaded successfully');
    } catch (error) {
      console.error('Error loading chat:', error);
      toast.error('Failed to load chat');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <header className="mb-6 pt-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">FPK University AI Command Center</h1>
          <p className="text-gray-600">Your personalized AI study companion</p>
        </header>

        {/* Three-Column Layout with Frosted Glass Effect */}
        <div className="p-8 bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[700px] max-h-[calc(100vh-240px)]">
          {/* Left Column - Context & History */}
          <div className="lg:col-span-3 overflow-hidden">
            <ContextHistoryColumn
              studyMaterials={studyMaterials}
              savedChats={conversations}
              onLoadChat={handleLoadChat}
              onUploadMaterial={uploadMaterial}
              isLoadingMaterials={isLoadingMaterials}
              isLoadingChats={isLoadingConversations}
            />
          </div>

          {/* Center Column - AI Interaction */}
          <div className="lg:col-span-6 overflow-hidden">
            <AIInteractionColumn
              messages={messages}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSendMessage={handleSendMessage}
              onVoiceTranscription={handleVoiceTranscription}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Insights & Analytics */}
          <div className="lg:col-span-3 overflow-hidden">
            <InsightsAnalyticsColumn
              analytics={analytics}
              studyPlan={activeStudyPlan}
              drills={drills}
              isLoadingAnalytics={isLoadingAnalytics}
              isLoadingPlan={isLoadingPlan}
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AICoachCommandCenter;
