import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, BookOpen, Clock, TrendingUp, Target, Award, Zap, MessageSquare, Volume2, Trash2, Save, Download, Paperclip } from 'lucide-react';
import { cn } from '../lib/utils';
import { isMobileBrowser } from '@/utils/mobileAudioUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SpeedControl } from '@/components/coach/SpeedControl';
import type { Persona, AIDrill } from '@/types/aiCoach';
import { useCommandCenterChat } from '@/hooks/useCommandCenterChat';
import { useOrgAIChat } from '@/hooks/useOrgAIChat';
import type { CommandCenterMessage } from '@/hooks/useCommandCenterChat';
import { useAuth } from '@/hooks/useAuth';
import { useUserIdentity } from '@/hooks/useUserIdentity';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAICoachStudyMaterials } from '@/hooks/useAICoachStudyMaterials';
import { useAICoachConversations } from '@/hooks/useAICoachConversations';
import { useAICoachCommandAnalytics } from '@/hooks/useAICoachCommandAnalytics';
import { useAICoachStudyPlans } from '@/hooks/useAICoachStudyPlans';
import { toast } from 'sonner';
import VoiceInputButton from '@/components/notes/VoiceInputButton';
import { MessageBubble } from '@/components/ai-coach/MessageBubble';
import { MessageGroupContainer } from '@/components/ai-coach/MessageGroupContainer';
import { groupConsecutiveMessages } from '@/utils/messageGrouping';
import VoiceSettingsCard from '@/components/ai-coach/VoiceSettingsCard';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';
import { SaveBeforeClearDialog } from '@/components/ai-coach/SaveBeforeClearDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MaterialsSubTab } from '@/components/ai-coach/MaterialsSubTab';
import { SavedChatsSubTab } from '@/components/ai-coach/SavedChatsSubTab';
import { AttachContextButton } from '@/components/ai-coach/AttachContextButton';
import { AttachedMaterialsBadge } from '@/components/ai-coach/AttachedMaterialsBadge';
import { AttachMaterialButton } from '@/components/ai-coach/AttachMaterialButton';
import { DocumentAttachmentOnboarding } from '@/components/ai-coach/DocumentAttachmentOnboarding';
import { AttachedCourseBadge } from '@/components/ai-coach/AttachedCourseBadge';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { DocumentReader } from '@/components/ai-coach/DocumentReader';
import { AssignedMaterialsTab } from '@/components/ai-coach/AssignedMaterialsTab';
import type { StudentAssignment } from '@/hooks/useStudentAssignments';

// Left Column: Context & History
const ContextHistoryColumn: React.FC<{
  studyMaterials: any[];
  savedChats: any[];
  onLoadChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => Promise<void>;
  onUploadMaterial: (file: File) => Promise<boolean>;
  isLoadingMaterials: boolean;
  isLoadingChats: boolean;
}> = ({ studyMaterials, savedChats, onLoadChat, onDeleteChat, onUploadMaterial, isLoadingMaterials, isLoadingChats }) => {
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
                className="p-3 bg-blue-50/80 rounded border border-blue-200/60 hover:bg-blue-100/80 transition group relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div 
                    className="flex-1 cursor-pointer" 
                    onClick={() => onLoadChat(chat.id)}
                  >
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{chat.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{chat.last_message_preview || 'No preview'}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {chat.message_count} messages • {new Date(chat.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 rounded flex-shrink-0"
                    title="Delete chat"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
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

// AI Interaction Column
const AIInteractionColumn: React.FC<{
  messages: CommandCenterMessage[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onVoiceTranscription: (text: string) => void;
  onSaveChat: () => void;
  onSaveAndClear: () => void;
  onClearChat: () => void;
  isLoading: boolean;
  attachedMaterialIds: string[];
  onAttachedMaterialsChange: (ids: string[]) => void;
  studyMaterials: any[];
  orgId?: string;
  conversationDocumentContext: string[];
  onConversationDocumentContextChange: (ids: string[]) => void;
  selectedCourseSlug?: string;
  onCourseChange?: (slug: string | undefined) => void;
  onViewDocument?: (document: any) => void;
}> = ({ messages, inputValue, onInputChange, onSendMessage, onVoiceTranscription, onSaveChat, onSaveAndClear, onClearChat, isLoading, attachedMaterialIds, onAttachedMaterialsChange, studyMaterials, orgId, conversationDocumentContext, onConversationDocumentContextChange, selectedCourseSlug, onCourseChange, onViewDocument }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  // Intelligent auto-scroll with proper Radix UI viewport targeting
  useEffect(() => {
    // Clear any pending scroll operations
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    if (messages.length === 0) return;

    // Get the actual scrollable viewport using Radix UI's data attribute
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    
    if (!viewport) {
      console.warn('[Auto-scroll] Could not find scroll viewport');
      return;
    }

    console.log('[Auto-scroll] Triggered', {
      messageCount: messages.length,
      lastMessagePersona: messages[messages.length - 1]?.persona,
      viewportHeight: viewport.scrollHeight,
      currentScroll: viewport.scrollTop
    });

    // Check if this is a new AI message
    const lastMessage = messages[messages.length - 1];
    const isNewAIMessage = 
      lastMessage?.persona !== 'USER' && 
      lastMessage.id !== lastMessageRef.current;

    if (isNewAIMessage) {
      lastMessageRef.current = lastMessage.id;
      console.log('[Auto-scroll] New AI message detected:', lastMessage.id);
    }

    // Scroll logic with debounce
    scrollTimeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        if (viewport) {
          const { scrollTop, scrollHeight, clientHeight } = viewport;
          const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
          
          console.log('[Auto-scroll] Scroll metrics:', {
            scrollTop,
            scrollHeight,
            clientHeight,
            distanceFromBottom,
            isNewAIMessage
          });

          // Always scroll for new AI messages or if user is near bottom
          if (isNewAIMessage || distanceFromBottom < 150 || messages.length === 1) {
            viewport.scrollTo({
              top: scrollHeight,
              behavior: 'smooth'
            });
            console.log('[Auto-scroll] Scrolling to bottom');
          }
        }
      });
    }, 300); // Increased delay to ensure DOM is fully updated

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleRemoveMaterial = (materialId: string) => {
    console.log('[AIInteractionColumn] Removing material:', materialId);
    onAttachedMaterialsChange(attachedMaterialIds.filter(id => id !== materialId));
  };

  const handleAttachMaterial = (materialId: string) => {
    console.log('[AIInteractionColumn] Attaching material:', materialId);
    if (!attachedMaterialIds.includes(materialId)) {
      onAttachedMaterialsChange([...attachedMaterialIds, materialId]);
    }
  };

  return (
    <div className={cn(
      "bg-purple-50/90 border border-purple-100 shadow-md hover:shadow-lg rounded-xl flex flex-col transition-shadow duration-200",
      isMobile 
        ? "p-3 h-[calc(100vh-200px)] min-h-[500px]"
        : "p-4 lg:p-6 h-[calc(100vh-240px)]"
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
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1 mb-4"
      >
        <div className="space-y-3 pr-2">
          {/* Mobile Audio Enablement Banner */}
          {isMobileBrowser() && messages.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-900 dark:text-amber-100 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                📱 Tap anywhere to enable audio playback
              </p>
            </div>
          )}
          
          {messages.length === 0 ? (
            <div className="flex items-center justify-center min-h-[200px] text-center">
              <div>
                <p className="text-gray-500 mb-2">👋 Welcome to your AI Command Center!</p>
                <p className="text-sm text-gray-400">Ask a question or start studying to begin.</p>
              </div>
            </div>
          ) : (
            groupConsecutiveMessages(messages).map((item, index) => {
              if ('groupId' in item && 'messages' in item) {
                // This is a message group - render in container
                return <MessageGroupContainer key={item.groupId} group={item} />;
              } else {
                // This is a standalone message - render normally
                return <MessageBubble key={item.id} message={item} />;
              }
            })
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

      {/* Chat Controls */}
      {messages.length > 0 && (
        <div className="border-t border-b py-2 px-2 flex gap-2 justify-end flex-wrap">
          <button
            onClick={onSaveChat}
            className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition"
            title="Save current chat"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save Chat</span>
          </button>
          <button
            onClick={onSaveAndClear}
            className="px-3 py-1.5 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center gap-2 transition"
            title="Save and clear chat"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Save & Clear</span>
          </button>
          <button
            onClick={onClearChat}
            className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition"
            title="Clear chat without saving"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t pt-4 flex-shrink-0">
        {/* PHASE 3: Enhanced Persistent Document Context Indicator with Debug Info */}
        {conversationDocumentContext.length > 0 && (
          <div className="mb-3 p-3 bg-purple-50 border-2 border-purple-300 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <BookOpen className="w-4 h-4 text-purple-700 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-purple-900 block">
                    📚 Studying: {studyMaterials.find(m => m.id === conversationDocumentContext[0])?.title || 'Document'}
                  </span>
                  <span className="text-xs text-purple-500 block mt-1 font-mono truncate">
                    Context ID: {conversationDocumentContext[0]?.substring(0, 12)}...
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  onConversationDocumentContextChange([]);
                  toast.info('Study session ended');
                }}
                className="px-3 py-1 text-xs text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded-md transition-colors font-medium flex-shrink-0 ml-2"
              >
                End Study Session
              </button>
            </div>
          </div>
        )}
        
        {/* PHASE 3: Warning for attaching documents to existing conversation */}
        {attachedMaterialIds.length > 0 && messages.length > 5 && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-amber-600 text-lg">⚠️</span>
              <div className="text-sm text-amber-800">
                <strong>Tip:</strong> You're adding a document to an existing conversation. 
                For best results, start a{' '}
                <button 
                  onClick={() => {
                    if (confirm('Start a new conversation? Current chat will be cleared.')) {
                      onClearChat();
                    }
                  }} 
                  className="underline font-semibold hover:text-amber-900"
                >
                  new conversation
                </button>
                {' '}when studying different materials.
              </div>
            </div>
          </div>
        )}
        
        {/* Attached Course - Visual Indicator */}
        {selectedCourseSlug && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
                <BookOpen className="w-4 h-4" />
                <span>📚 Course attached - AI coaches can discuss this course content</span>
              </div>
              <button
                onClick={() => {
                  onInputChange("What lessons are in this course?");
                  setTimeout(() => onSendMessage(), 100);
                }}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                title="Test if AI can access the course"
              >
                🧪 Test Course Access
              </button>
            </div>
            <AttachedCourseBadge
              courseSlug={selectedCourseSlug}
              onRemove={() => onCourseChange?.(undefined)}
            />
          </div>
        )}
        
        {/* Attached Materials - Prominent Visual Indicator */}
        {attachedMaterialIds.length > 0 && (
          <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-purple-900">
                <Paperclip className="w-4 h-4" />
                <span>📎 Document attached - AI coaches can now see and discuss this content</span>
              </div>
              <button
                onClick={() => {
                  onInputChange("Can you see the attached document? Please tell me what it's about.");
                  setTimeout(() => onSendMessage(), 100);
                }}
                className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1"
                title="Test if AI can access the document"
              >
                🧪 Test Access
              </button>
            </div>
            <AttachedMaterialsBadge
              materialIds={attachedMaterialIds}
              materials={studyMaterials}
              onRemove={handleRemoveMaterial}
            />
          </div>
        )}
        
        <div className={cn(
          "flex gap-2",
          isMobile ? "flex-col" : "flex-row"
        )}>
          <textarea
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question or describe what you're studying..."
            className={cn(
              "flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-fpk-primary",
              isMobile && "min-h-[80px]"
            )}
            rows={isMobile ? 3 : 2}
            disabled={isLoading}
          />
          <div className={cn(
            "flex gap-2",
            isMobile ? "flex-row w-full" : "flex-col"
          )}>
            <div className={cn(
              "flex gap-2",
              isMobile && "flex-1"
            )}>
              <AttachContextButton
                orgId={orgId}
                selectedMaterialIds={attachedMaterialIds}
                onMaterialsChange={onAttachedMaterialsChange}
                selectedCourseSlug={selectedCourseSlug}
                onCourseChange={onCourseChange}
                onViewDocument={onViewDocument}
              />
              <VoiceInputButton
                onTranscription={onVoiceTranscription}
                placeholder="AI Coach voice input"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => onSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                "p-3 bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors",
                isMobile ? "flex-1 min-h-[44px]" : ""
              )}
              title="Send message"
            >
              <Send className={cn("w-5 h-5", isMobile && "mx-auto")} />
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
  orgId?: string;
  orgName?: string;
  initialTab?: string;
  onViewDocument?: (material: any) => void;
  onStartStudying?: (assignment: StudentAssignment) => Promise<void>;
  assignmentContext?: {
    materialContent: string;
    educatorInstructions: string;
    materialTitle: string;
    assignmentId: string;
  } | null;
}

export const AICoachCommandCenter: React.FC<AICoachCommandCenterProps> = ({ 
  isFreeChatAllowed = true,
  orgId,
  orgName,
  initialTab = 'chat',
  onViewDocument,
  onStartStudying,
  assignmentContext
}) => {
  const { user } = useAuth();
  const { identity } = useUserIdentity();
  const isMobile = useIsMobile();
  
  // Use appropriate chat hook based on context
  const standardChat = useCommandCenterChat(user?.id);
  const orgChat = useOrgAIChat({ 
    userId: user?.id, 
    orgId: orgId || '', 
    orgName: orgName || '' 
  });
  
  // Initialize org chat if needed
  useEffect(() => {
    if (orgId && orgChat.messages.length === 0 && user && identity) {
      orgChat.initializeChat(identity?.profile?.fullName || identity?.profile?.displayName || 'there');
    }
  }, [orgId, user, identity]);
  
  // Select the appropriate chat based on context
  const messages = orgId ? orgChat.messages : standardChat.messages;
  const isLoading = orgId ? orgChat.isSending : standardChat.loading;
  const sendChatMessage = orgId ? orgChat.sendMessage : standardChat.sendMessage;
  const conversationId = orgId ? null : standardChat.conversationId;
  
  const [inputValue, setInputValue] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [attachedMaterialIds, setAttachedMaterialIds] = useState<string[]>([]);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | undefined>();
  
  // PHASE 2: Persistent document context with localStorage backup
  const [conversationDocumentContextState, setConversationDocumentContextState] = useState<string[]>(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem('activeStudySession');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Wrapper to also persist to localStorage
  const setConversationDocumentContext = (value: string[] | ((prev: string[]) => string[])) => {
    const newValue = typeof value === 'function' ? value(conversationDocumentContextState) : value;
    setConversationDocumentContextState(newValue);
    if (newValue.length > 0) {
      localStorage.setItem('activeStudySession', JSON.stringify(newValue));
      console.log('[🔍 STORAGE] Saved to localStorage:', newValue);
    } else {
      localStorage.removeItem('activeStudySession');
      console.log('[🔍 STORAGE] Cleared localStorage');
    }
  };
  
  const conversationDocumentContext = conversationDocumentContextState;
  
  // PHASE 1: Lifecycle logging for debugging
  useEffect(() => {
    console.log('[🔍 STATE DEBUG] conversationDocumentContext changed:', {
      context: conversationDocumentContext,
      length: conversationDocumentContext.length,
      firstId: conversationDocumentContext[0] || 'NONE',
      timestamp: new Date().toISOString()
    });
  }, [conversationDocumentContext]);

  useEffect(() => {
    console.log('[🔍 MOUNT DEBUG] AICoachCommandCenter mounted');
    return () => {
      console.log('[🔍 UNMOUNT DEBUG] AICoachCommandCenter unmounting');
    };
  }, []);

  // Live data hooks - replacing all placeholder data
  const { studyMaterials, isLoadingMaterials, uploadMaterial } = useAICoachStudyMaterials();
  const { conversations, isLoadingConversations, loadMessages, saveConversation, deleteConversation } = useAICoachConversations();
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
      
      // Only speak AI messages (not user messages, not while streaming)
      const isStreaming = 'isStreaming' in lastMessage && lastMessage.isStreaming;
      
      // NEW: Check if message is part of a group (grouped messages handled by unified player)
      const isGrouped = 'groupId' in lastMessage && lastMessage.groupId;
      
      // Check for persona-based messages (both CommandCenter and Org messages now have persona)
      // Skip grouped messages - they're controlled by the Unified Player
      if ('persona' in lastMessage && 
          lastMessage.persona !== 'USER' && 
          lastMessage.persona !== 'CONDUCTOR' && 
          !isStreaming && 
          !isGrouped) {
        console.log('[TTS] 🔊 Auto-playing new AI message from', lastMessage.persona);
        speak(lastMessage.content, lastMessage.persona);
      }
    }
    
    prevMessagesLength.current = messages.length;
  }, [messages, voiceSettings.autoRead, voiceSettings.enabled, speak]);

  const handleSendMessage = async (messageOverride?: string, materialIdsOverride?: string[]) => {
    // Defensive: ensure messageOverride is actually a string
    const actualMessage = (typeof messageOverride === 'string' && messageOverride.length > 0) 
      ? messageOverride 
      : inputValue;
    const currentInput = actualMessage;
    
    // Merge conversation context with message-specific attachments
    const messageAttachments = materialIdsOverride || attachedMaterialIds;
    const allAttachments = [...new Set([...conversationDocumentContext, ...messageAttachments])];
    
    // PHASE 4: Enhanced logging in handleSendMessage
    console.log('[AI COMMAND CENTER] 🚀 handleSendMessage called', { 
      hasInput: !!currentInput.trim(), 
      isLoading, 
      hasUser: !!user,
      userId: user?.id,
      messagePreview: currentInput.substring(0, 50) + '...',
      messageAttachments,
      messageAttachmentsLength: messageAttachments.length,
      conversationContext: conversationDocumentContext, // Show exact array
      conversationContextLength: conversationDocumentContext.length, // Show count
      conversationContextFirstId: conversationDocumentContext[0] || 'NONE', // Show first ID
      mergedAttachments: allAttachments,
      mergedLength: allAttachments.length,
      selectedCourseSlug,
      localStorageBackup: localStorage.getItem('activeStudySession')
    });
    
    if (!currentInput.trim() || !user) {
      console.log('[AI COMMAND CENTER] ❌ Validation failed - not sending message');
      return;
    }

    setInputValue('');
    setAttachedMaterialIds([]); // Clear message-specific attachments
    // NOTE: conversationDocumentContext NOT cleared - persists for session
    // NOTE: selectedCourseSlug persists for session (only cleared via UI badge)
    
    console.log('[AI COMMAND CENTER] ✅ Calling sendChatMessage with merged attachments and course slug:', { 
      attachments: allAttachments, 
      courseSlug: selectedCourseSlug 
    });
    
    // ✅ Pass selected course slug to orchestrator
    await sendChatMessage(currentInput, allAttachments, selectedCourseSlug);

    // Track analytics after interaction
    await trackSession(5, [currentInput.substring(0, 50)]);
  };

  const handleVoiceTranscription = (transcription: string) => {
    setInputValue(transcription);
    // Text is now in the input, user can review and send
  };

  const handleSaveChat = async () => {
    if (messages.length === 0) {
      toast.error('No messages to save');
      return;
    }

    // Generate title from first user message
    const firstUserMessage = messages.find(m => m.persona === 'USER');
    const autoTitle = firstUserMessage 
      ? firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
      : 'Untitled Chat';

    const formattedMessages = messages.map(msg => ({
      role: msg.persona === 'USER' ? 'user' as const : 'assistant' as const,
      content: msg.content,
      persona: msg.persona
    }));

    await saveConversation(autoTitle, formattedMessages);
  };

  const handleSaveAndClear = async (customTitle?: string) => {
    if (messages.length === 0) return;

    const firstUserMessage = messages.find(m => m.persona === 'USER');
    const autoTitle = customTitle || (firstUserMessage 
      ? firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
      : 'Untitled Chat');

    const formattedMessages = messages.map(msg => ({
      role: msg.persona === 'USER' ? 'user' as const : 'assistant' as const,
      content: msg.content,
      persona: msg.persona
    }));

    const savedId = await saveConversation(autoTitle, formattedMessages);
    
    if (savedId) {
      // Clear chat after successful save
      if (orgId) {
        orgChat.clearAllMessages();
      } else {
        standardChat.clearMessages();
      }
      toast.success('Chat saved and cleared');
    }
  };

  const handleClearWithoutSaving = () => {
    if (orgId) {
      orgChat.clearAllMessages();
    } else {
      standardChat.clearMessages();
    }
    setConversationDocumentContext([]); // Clear persistent document context on new chat
    setShowClearConfirm(false);
    toast.info('Chat cleared');
  };

  const handleViewDocument = (material: any) => {
    console.log('[AICoachCommandCenter] Delegating to parent:', material.title);
    
    // Automatically attach the document to chat context for AI discussion
    if (!attachedMaterialIds.includes(material.id) && !conversationDocumentContext.includes(material.id)) {
      setConversationDocumentContext([material.id]);
    }
    
    // Delegate to parent handler
    if (onViewDocument) {
      onViewDocument(material);
    }
    
    // Switch to Chat tab so user can discuss the document
    setActiveTab('chat');
  };

  const handleStartStudyingDocument = async (documentTitle: string, materialId: string) => {
    console.log('[AICoachCommandCenter] 📚 Starting document study session with:', { documentTitle, materialId });
    setActiveTab('chat');
    
    // Set BOTH message attachment AND conversation context for persistent study session
    setAttachedMaterialIds([materialId]);
    setConversationDocumentContext([materialId]); // Persists until user ends study session
    
    // PHASE 5: Add safeguard with localStorage backup
    localStorage.setItem('activeStudySession', JSON.stringify([materialId]));
    console.log('[AICoachCommandCenter] 📌 Set conversation context:', { 
      materialId, 
      contextArray: [materialId],
      localStorage: localStorage.getItem('activeStudySession')
    });
    
    const prompt = `Let's study the document I just uploaded: "${documentTitle}". Can you help me understand the key concepts?`;
    console.log('[AICoachCommandCenter] Sending message with persistent document context');
    // Send immediately with attached material to avoid race conditions
    await handleSendMessage(prompt, [materialId]);
  };

  const handleLoadChat = async (chatId: string) => {
    try {
      toast.loading('Loading conversation...', { id: 'load-chat' });
      
      const loadedMessages = await loadMessages(chatId);
      
      if (loadedMessages.length === 0) {
        toast.error('No messages found in this conversation', { id: 'load-chat' });
        return;
      }

      // Format messages for the current chat system
      const formattedForChat = loadedMessages.map(msg => ({
        id: msg.id,
        persona: (msg.persona || (msg.role === 'user' ? 'USER' : 'AL')) as 'USER' | 'BETTY' | 'AL' | 'CONDUCTOR' | 'NITE_OWL',
        content: msg.content,
        created_at: msg.created_at,
      }));

      // Clear current chat and load the saved one
      if (orgId) {
        orgChat.clearAllMessages();
        // Note: Org chat doesn't have loadHistoricalMessages yet, would need to add it
        toast.info('Loaded messages. Note: Org chat history loading needs implementation.', { id: 'load-chat' });
      } else {
        standardChat.clearMessages();
        standardChat.loadHistoricalMessages(formattedForChat);
        toast.success(`Loaded conversation with ${loadedMessages.length} messages`, { id: 'load-chat' });
      }

      // Switch to Chat tab after loading
      setActiveTab('chat');
      
    } catch (error) {
      console.error('Error loading chat:', error);
      toast.error('Failed to load conversation', { id: 'load-chat' });
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }
    
    const success = await deleteConversation(chatId);
    if (success) {
      toast.success('Conversation deleted');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      <div 
        className="w-full max-w-7xl rounded-3xl shadow-2xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/50"
        style={{ maxHeight: 'calc(100vh - 60px)' }}
      >
        <div className="h-full flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col p-2 sm:p-3 md:p-4 lg:p-6">
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

            <TabsContent value="materials" className="flex-1 overflow-hidden mt-0">
              <Tabs defaultValue="study-materials" className="h-full flex flex-col">
                <TabsList className="mb-4 grid grid-cols-3">
                  <TabsTrigger value="study-materials">Study Materials</TabsTrigger>
                  <TabsTrigger value="assigned">Assigned</TabsTrigger>
                  <TabsTrigger value="saved-chats">Saved Chats</TabsTrigger>
                </TabsList>

                <TabsContent value="study-materials" className="flex-1 overflow-hidden p-2 sm:p-3 md:p-4 lg:p-6">
                  <MaterialsSubTab
                    orgId={orgId}
                    onStartStudying={handleStartStudyingDocument}
                    onViewDocument={handleViewDocument}
                    attachedMaterialIds={[...conversationDocumentContext, ...attachedMaterialIds]}
                    onAttachToChat={(materialId) => {
                      if (!attachedMaterialIds.includes(materialId) && !conversationDocumentContext.includes(materialId)) {
                        setAttachedMaterialIds(prev => [...prev, materialId]);
                      }
                      setActiveTab('chat');
                    }}
                  />
                </TabsContent>

                <TabsContent value="assigned" className="flex-1 overflow-hidden p-2 sm:p-3 md:p-4 lg:p-6">
                  {onStartStudying ? (
                    <AssignedMaterialsTab
                      orgId={orgId}
                      onStartStudying={onStartStudying}
                    />
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-sm text-muted-foreground">Assignment feature not available</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="saved-chats" className="h-full">
                  <SavedChatsSubTab
                    orgId={orgId}
                    onLoadChat={handleLoadChat}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="chat" className="flex-1 overflow-hidden mt-0">
              <div className="h-full p-2 sm:p-3 md:p-4 lg:p-6">
                <AIInteractionColumn
                  messages={messages as any}
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSendMessage={handleSendMessage}
                  onVoiceTranscription={handleVoiceTranscription}
                  onSaveChat={handleSaveChat}
                  onSaveAndClear={() => setShowSaveDialog(true)}
                  onClearChat={() => setShowClearConfirm(true)}
                  isLoading={isLoading}
                  attachedMaterialIds={attachedMaterialIds}
                  onAttachedMaterialsChange={setAttachedMaterialIds}
                  studyMaterials={studyMaterials}
                  orgId={orgId}
                  conversationDocumentContext={conversationDocumentContext}
                  onConversationDocumentContextChange={setConversationDocumentContext}
                  selectedCourseSlug={selectedCourseSlug}
                  onCourseChange={setSelectedCourseSlug}
                  onViewDocument={handleViewDocument}
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

      {/* Save Before Clear Dialog */}
      <SaveBeforeClearDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSaveAndClear={handleSaveAndClear}
        onClearWithoutSaving={handleClearWithoutSaving}
        messageCount={messages.length}
      />

      {/* Clear Confirmation Dialog */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete {messages.length} message(s) from this conversation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearWithoutSaving}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Document Attachment Onboarding */}
      <DocumentAttachmentOnboarding
        hasUploadedDocument={studyMaterials.length > 0}
        isInChat={activeTab === 'chat'}
      />
    </div>
  );
};

export default AICoachCommandCenter;
