import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Upload, BookOpen, Clock, TrendingUp, Target, Award, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Message, Persona, UserAnalytics, StudyPlan, SavedChat, StudyMaterial, AIDrill } from '@/types/aiCoach';
import { AIService } from '../services/aiService';
import { useAuth } from '@/hooks/useAuth';

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
  const bubbleClass = {
    USER: 'chat-bubble-user',
    BETTY: 'chat-bubble-betty',
    AL: 'chat-bubble-al',
    NITE_OWL: 'chat-bubble-nite-owl',
  }[message.persona];

  return (
    <div className={cn('flex flex-col', message.persona === 'USER' ? 'items-end' : 'items-start')}>
      <PersonaAvatar persona={message.persona} />
      <div className={cn('chat-bubble', bubbleClass)}>
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
  studyMaterials: StudyMaterial[];
  savedChats: SavedChat[];
  onLoadChat: (chatId: string) => void;
}> = ({ studyMaterials, savedChats, onLoadChat }) => {
  return (
    <div className="column-container space-y-6">
      {/* Uploaded Study Materials */}
      <div>
        <h3 className="section-title flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Study Materials
        </h3>
        <div className="space-y-2">
          {studyMaterials.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No materials uploaded yet</p>
          ) : (
            studyMaterials.map((material) => (
              <div key={material.id} className="p-3 bg-purple-50/80 rounded border border-purple-200/60 hover:bg-purple-100/80 cursor-pointer transition">
                <p className="text-sm font-medium text-gray-800">{material.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {material.type.toUpperCase()} • {new Date(material.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
          <button className="w-full mt-3 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition flex items-center justify-center gap-2 text-sm">
            <Upload className="w-4 h-4" />
            Upload Material
          </button>
        </div>
      </div>

      {/* Saved Chats */}
      <div>
        <h3 className="section-title flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Saved Chats
        </h3>
        <div className="space-y-2">
          {savedChats.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No saved chats yet</p>
          ) : (
            savedChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onLoadChat(chat.id)}
                className="p-3 bg-blue-50/80 rounded border border-blue-200/60 hover:bg-blue-100/80 cursor-pointer transition"
              >
                <p className="text-sm font-medium text-gray-800">{chat.title}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{chat.lastMessage}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {chat.messageCount} messages • {new Date(chat.timestamp).toLocaleDateString()}
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
  analytics: UserAnalytics;
  studyPlan: StudyPlan | null;
  drills: AIDrill[];
}> = ({ analytics, studyPlan, drills }) => {
  return (
    <div className="column-container space-y-6">
      {/* Learning Analytics */}
      <div>
        <h3 className="section-title flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Learning Analytics
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Study Time</p>
            <p className="text-2xl font-bold text-blue-800 mt-1">{analytics.totalStudyTime}h</p>
          </div>
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <p className="text-xs text-green-600 font-medium">Sessions</p>
            <p className="text-2xl font-bold text-green-800 mt-1">{analytics.sessionsCompleted}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded border border-purple-200">
            <p className="text-xs text-purple-600 font-medium">Avg Score</p>
            <p className="text-2xl font-bold text-purple-800 mt-1">{analytics.averageScore}%</p>
          </div>
          <div className="p-3 bg-amber-50 rounded border border-amber-200">
            <p className="text-xs text-amber-600 font-medium">Streak</p>
            <p className="text-2xl font-bold text-amber-800 mt-1">{analytics.streakDays} days</p>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xs text-gray-600 font-medium mb-2">Topics Studied</p>
          <div className="flex flex-wrap gap-1">
            {analytics.topicsStudied.map((topic, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI-Generated Study Plan */}
      <div>
        <h3 className="section-title flex items-center gap-2">
          <Target className="w-5 h-5" />
          Study Plan
        </h3>
        {studyPlan ? (
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
        <h3 className="section-title flex items-center gap-2">
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
  onVoiceInput: () => void;
  isLoading: boolean;
}> = ({ messages, inputValue, onInputChange, onSendMessage, onVoiceInput, isLoading }) => {
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
    <div className="column-container flex flex-col">
      <h3 className="section-title flex items-center gap-2 mb-4">
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
            <div className="chat-bubble chat-bubble-betty">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
            <button
              onClick={onVoiceInput}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              title="Voice input"
            >
              <Mic className="w-5 h-5 text-gray-600" />
            </button>
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder data - will be replaced with actual API calls
  const [studyMaterials] = useState<StudyMaterial[]>([
    {
      id: '1',
      title: 'Biology Chapter 5: Cell Division',
      type: 'pdf',
      uploadedAt: new Date('2024-01-15'),
      size: 2048,
    },
  ]);

  const [savedChats] = useState<SavedChat[]>([
    {
      id: '1',
      title: 'Photosynthesis Discussion',
      lastMessage: 'So the light-dependent reactions occur in the thylakoid membrane...',
      timestamp: new Date('2024-01-14'),
      messageCount: 23,
    },
  ]);

  const [analytics] = useState<UserAnalytics>({
    totalStudyTime: 47,
    sessionsCompleted: 12,
    topicsStudied: ['Biology', 'Chemistry', 'Physics', 'Math'],
    averageScore: 87,
    streakDays: 5,
  });

  const [studyPlan] = useState<StudyPlan>({
    id: '1',
    title: 'Master Cell Biology',
    description: 'Complete understanding of cellular processes and structures',
    topics: ['Cell Division', 'Photosynthesis', 'Cellular Respiration'],
    estimatedTime: 8,
    progress: 65,
  });

  const [drills] = useState<AIDrill[]>([
    {
      id: '1',
      question: 'What are the main stages of mitosis?',
      type: 'short-answer',
      difficulty: 'medium',
      topic: 'Cell Division',
    },
    {
      id: '2',
      question: 'True or False: Chloroplasts are found in animal cells.',
      type: 'true-false',
      difficulty: 'easy',
      topic: 'Cell Structure',
    },
  ]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

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
      // Call the real AI orchestrator
      const userId = 'current-user-id'; // TODO: Get from auth context
      const response = await AIService.sendMessage(
        userId,
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
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error message to user
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

  const handleVoiceInput = () => {
    // TODO: Implement voice input functionality
    alert('Voice input feature coming soon!');
  };

  const handleLoadChat = (chatId: string) => {
    // TODO: Load saved chat from database
    console.log('Loading chat:', chatId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <header className="mb-6 pt-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">FPK University AI Command Center</h1>
          <p className="text-gray-600">Your personalized AI study companion</p>
        </header>

        {/* Three-Column Layout with Frosted Glass Effect */}
        <div className="p-8 bg-white/30 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-240px)]">
          {/* Left Column - Context & History */}
          <div className="lg:col-span-3 overflow-hidden">
            <ContextHistoryColumn
              studyMaterials={studyMaterials}
              savedChats={savedChats}
              onLoadChat={handleLoadChat}
            />
          </div>

          {/* Center Column - AI Interaction */}
          <div className="lg:col-span-6 overflow-hidden">
            <AIInteractionColumn
              messages={messages}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSendMessage={handleSendMessage}
              onVoiceInput={handleVoiceInput}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Insights & Analytics */}
          <div className="lg:col-span-3 overflow-hidden">
            <InsightsAnalyticsColumn
              analytics={analytics}
              studyPlan={studyPlan}
              drills={drills}            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AICoachCommandCenter;
