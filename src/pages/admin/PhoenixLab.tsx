import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Sparkles, Brain, TestTube, AlertCircle, ArrowLeft, Mic, Volume2, VolumeX, RotateCcw, History, User, X, ChevronUp, ChevronDown, Podcast } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { usePhoenixSettings } from '@/hooks/usePhoenixSettings';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { PhoenixFeatureFlags } from '@/components/admin/PhoenixFeatureFlags';
import { PerformanceDashboard } from '@/components/admin/phoenix-analytics/PerformanceDashboard';
import { FrustrationHeatmap } from '@/components/admin/phoenix-analytics/FrustrationHeatmap';
import { NiteOwlMonitor } from '@/components/admin/phoenix-analytics/NiteOwlMonitor';
import { IntentAccuracyChart } from '@/components/admin/phoenix-analytics/IntentAccuracyChart';
import { FeatureFlagTelemetry } from '@/components/admin/phoenix-analytics/FeatureFlagTelemetry';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SUPABASE_URL = "https://zgcegkmqfgznbpdplscz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnY2Vna21xZmd6bmJwZHBsc2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDcxNTgsImV4cCI6MjA2NDk4MzE1OH0.RCtAqfgz7aqjG-QWiOqFBCG5xg2Rok9T4tbyGQMnCm8";

interface Message {
  id: string;
  persona: 'USER' | 'BETTY' | 'AL' | 'CONDUCTOR' | 'NITE_OWL';
  content: string;
  intent?: string;
  sentiment?: string;
  metadata?: any;
  created_at: string;
  audioUrl?: string;
  isWelcome?: boolean;
  isTyping?: boolean;
  isStreaming?: boolean;
}

// New single-message "Showtime" welcome with pre-generated multi-speaker audio
const WELCOME_MESSAGES: Omit<Message, 'id' | 'created_at'>[] = [
  {
    persona: 'NITE_OWL',
    content: `🎙️ **Showtime!**

Nite Owl kicks off your AI Coach session, introducing Betty (your Socratic guide) and Al (your direct expert).

Ready to learn? Let's make some magic happen! 🦉✨`,
    isWelcome: true,
    // NOTE: Replace this URL with the actual public URL after uploading to Supabase Storage
    audioUrl: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/audio/betty-al-night-Owl-intro/welcome_dialogue_trio.mp3'
  }
];

// Phase features data
const PHASE_FEATURES = {
  1: [
    'Database Schema',
    'Conversation Storage',
    'Message Persistence',
    'Session Management',
    'Basic UI Shell',
    'Auth Integration',
  ],
  2: [
    'Dual Persona System',
    'Intent Classification',
    'Sentiment Analysis',
    'Response Routing',
    'Basic Prompts',
    'Context Handling',
  ],
  3: [
    'Modular Prompt Architecture',
    'Betty (Socratic + AVCQ)',
    'Al (Direct Expert)',
    'Al Socratic Support',
    '5-Intent Detection',
    'Socratic Handoff',
    'Streaming UI',
    'Voice I/O (STT/TTS)',
    'Governor Verification',
    'Audio Caching',
  ],
  4: [
    'Podcast Generation',
    'Aha Moment Detection',
    'Multi-Speaker Audio',
    'Analytics Dashboard',
  ],
  5: [
    'Context Persistence',
    'Learning Path Mapping',
    'Knowledge Graph',
    'Advanced Metrics',
    'Multi-Session Memory',
    'Adaptive Scaffolding',
  ],
} as const;

const PHASE_COMPLETION_STATUS = {
  1: 'all', // All features complete
  2: 'all', // All features complete
  3: 'all', // All features complete
  4: 'all', // Phase 4 complete - Content & Analytics
  5: 'partial', // Phase 5 in progress - Cognitive Enhancements
} as const;

const PHASE_TITLES = {
  1: 'Foundation',
  2: 'Dual Persona',
  3: 'Advanced AI',
  4: 'Content & Analytics (Complete)',
  5: 'Cognitive Enhancements (In Progress)',
} as const;

export default function PhoenixLab() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(() => crypto.randomUUID());
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [hasWelcomePlayed, setHasWelcomePlayed] = useState(false); // CRITICAL: Prevents welcome replay
  const [hasUserStartedChat, setHasUserStartedChat] = useState(false); // Start chat trigger
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistorySession, setSelectedHistorySession] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState(4); // Start at current phase
  const [generatingPodcast, setGeneratingPodcast] = useState(false);
  const [isBackfilling, setIsBackfilling] = useState(false);
  const [showBackfillAlert, setShowBackfillAlert] = useState(true);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const activeAudioElements = React.useRef<Set<HTMLAudioElement>>(new Set());
  const audioLockRef = React.useRef(false);
  const playedMessagesRef = React.useRef<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Phoenix settings hook for persistent preferences
  const { settings, isLoading: settingsLoading, toggleWelcomeMessage, toggleAudio } = usePhoenixSettings();
  
  // Sync audioEnabled state with settings
  const [audioEnabled, setAudioEnabled] = useState(settings.audioEnabled);
  
  useEffect(() => {
    if (!settingsLoading) {
      setAudioEnabled(settings.audioEnabled);
    }
  }, [settings.audioEnabled, settingsLoading]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = (smooth = true) => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    }
  };

  // Track scroll position to show/hide "Jump to Bottom" button
  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        const { scrollHeight, scrollTop, clientHeight } = viewport;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        setIsScrolledUp(distanceFromBottom > 200);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch session history from coach_sessions
  const { data: sessionHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['phoenixSessionHistory', user?.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('coach_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('source', 'coach_portal')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching session history:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user, // Fetch when user is available
  });
  
  // Load a specific session from history
  const loadSession = (session: any) => {
    if (!session.session_data || typeof session.session_data !== 'object' || !('messages' in session.session_data)) return;
    
    const sessionMessages = (session.session_data as any).messages;
    if (!Array.isArray(sessionMessages)) return;
    
    const loadedMessages: Message[] = sessionMessages.map((msg: any) => ({
      id: crypto.randomUUID(),
      persona: msg.role === 'user' ? 'USER' : msg.role.toUpperCase(),
      content: msg.content,
      created_at: msg.timestamp || new Date().toISOString(),
    }));
    
    setMessages(loadedMessages);
    setShowHistoryModal(false);
    
    // Auto-scroll to bottom after loading
    setTimeout(() => scrollToBottom(false), 100);
    
    toast({
      title: "Session Loaded",
      description: `Loaded conversation from ${new Date(session.created_at).toLocaleDateString()}`
    });
  };

  // Stop all audio when audio is disabled - use immediate effect
  useEffect(() => {
    if (!audioEnabled) {
      console.log('[PHOENIX] 🔴 Audio toggle disabled - force stopping all audio');
      stopAllAudio();
    }
  }, [audioEnabled]);

  // Load most recent session on mount
  useEffect(() => {
    const loadLastSession = async () => {
      if (!user || settingsLoading || hasWelcomePlayed || messages.length > 0) return;
      
      console.log('[PHOENIX] 📂 Checking for recent session to load...');
      
      const { data: recentSession } = await supabase
        .from('coach_sessions')
        .select('id, session_data, created_at')
        .eq('user_id', user.id)
        .eq('source', 'coach_portal')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (recentSession?.session_data && typeof recentSession.session_data === 'object' && 'messages' in recentSession.session_data) {
        const sessionMessages = (recentSession.session_data as any).messages;
        if (Array.isArray(sessionMessages) && sessionMessages.length > 0) {
          console.log('[PHOENIX] ✅ Found recent session, loading messages...');
          const loadedMessages: Message[] = sessionMessages.map((msg: any) => ({
            id: crypto.randomUUID(),
            persona: msg.role === 'user' ? 'USER' : msg.role.toUpperCase(),
            content: msg.content,
            created_at: msg.timestamp || new Date().toISOString(),
          }));
          
          setMessages(loadedMessages);
          setHasWelcomePlayed(true);
          
          // Auto-scroll to bottom after loading
          setTimeout(() => scrollToBottom(false), 100);
          
          toast({
            title: "Session Restored",
            description: "Your last conversation has been loaded"
          });
        }
      }
    };
    
    loadLastSession();
  }, [user, settingsLoading]);

  // Initialize conversation and speech recognition - ONLY ONCE
  useEffect(() => {
    console.log('[PHOENIX] 🔍 useEffect triggered - hasUserStartedChat:', hasUserStartedChat, 'hasWelcomePlayed:', hasWelcomePlayed, 'messages.length:', messages.length);
    
    // Wait for settings to load before proceeding
    if (settingsLoading) {
      console.log('[PHOENIX] ⏳ Waiting for settings to load...');
      return;
    }
    
    // SIMPLIFIED: Only check if messages are empty AND user clicked start
    if (messages.length === 0 && hasUserStartedChat && !hasWelcomePlayed) {
      console.log('[PHOENIX] 🎬 Starting welcome sequence (showWelcome:', settings.showWelcomeMessage, ')');
      initializeConversation();
    } else {
      console.log('[PHOENIX] ⏭️ Skipping welcome - conditions not met');
    }
    initializeSpeechRecognition();
  }, [hasUserStartedChat, messages.length, settingsLoading]); // Removed hasWelcomePlayed to prevent re-trigger

  // Listen for real-time podcast notifications
  useEffect(() => {
    if (!hasUserStartedChat) return;

    const setupPodcastListener = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log('[PHOENIX] 🎙️ Setting up podcast notification listener');
      
      const channel = supabase.channel(`podcast_ready_${user.id}`);
      
      channel
        .on('broadcast', { event: 'podcast_ready' }, (payload) => {
          console.log('[PHOENIX] 🎙️ Podcast ready notification received:', payload);
          
          const { episodeId, topic, audioUrl, shareToken } = payload.payload;
          
          // Add Nite Owl's presentation message
          const niteOwlMessage: Message = {
            id: crypto.randomUUID(),
            persona: 'NITE_OWL',
            content: `Hoo-hoo! I've got something special for you! 🎙️\n\nYour conversation about "${topic}" was so insightful that I created a podcast episode capturing your learning journey! You can listen to it in the Learning Moments gallery or share it with others.\n\nKeep up the amazing work!`,
            created_at: new Date().toISOString(),
            metadata: {
              episodeId,
              audioUrl,
              shareToken,
              type: 'podcast_notification'
            }
          };
          
          setMessages(prev => [...prev, niteOwlMessage]);
          
          // Play audio if enabled
          if (audioEnabled && audioUrl) {
            playAudioWithHighlight(audioUrl, niteOwlMessage.id);
          }
          
          toast({
            title: "🎙️ Podcast Created!",
            description: `Your learning moment about "${topic}" is ready!`
          });
        })
        .subscribe();

      return () => {
        console.log('[PHOENIX] 🎙️ Cleaning up podcast listener');
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupPodcastListener();
    
    return () => {
      cleanup.then(fn => fn?.());
    };
  }, [hasUserStartedChat, audioEnabled]);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Could not capture audio. Please try again.",
          variant: "destructive"
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // Audio caching and generation functions removed - using pre-generated Showtime audio file

  const initializeConversation = async () => {
    // CRITICAL GUARD: Prevent welcome sequence from ever replaying
    if (hasWelcomePlayed) {
      console.log('[PHOENIX] ⛔ Welcome already played, skipping initialization');
      return;
    }
    
    // Check if user wants to skip welcome message
    if (!settingsLoading && !settings.showWelcomeMessage) {
      console.log('[PHOENIX] ⏭️ Skipping welcome sequence per user preference');
      
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      
      // Create conversation record WITHOUT any welcome messages
      const { data: convData, error: convError } = await supabase.from('phoenix_conversations').insert({
        user_id: authUser.id,
        session_id: conversationId,
        metadata: { 
          phase: 3,
          source: 'phoenix_lab',
          welcome_skipped: true
        }
      }).select('id').single();
      
      if (convError) {
        console.error('[PHOENIX] Error creating conversation:', convError);
      } else {
        console.log('[PHOENIX] ✅ Conversation created (no welcome):', convData.id);
      }
      
      // CRITICAL: Mark as played to prevent re-triggering
      setHasWelcomePlayed(true);
      
      toast({
        title: "🧪 Phoenix Lab Ready",
        description: "Start chatting to begin learning!"
      });
      
      return;
    }
    
    try {
      console.log('[PHOENIX] 🎬 Initializing conversation with welcome sequence');
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      setIsGeneratingAudio(true);

      // Create conversation
      const { data: convData, error: convError } = await supabase.from('phoenix_conversations').insert({
        user_id: authUser.id,
        session_id: conversationId,
        metadata: { phase: 2, created_from: 'phoenix_lab' }
      }).select('id').single();
      
      if (convError || !convData) {
        console.error('[PHOENIX] Failed to create conversation:', convError);
        setIsGeneratingAudio(false);
        return;
      }
      
      const conversationUuid = convData.id;

      // Insert single welcome message
      await supabase.from('phoenix_messages').insert({
        conversation_id: conversationUuid,
        persona: 'NITE_OWL',
        content: WELCOME_MESSAGES[0].content,
        metadata: { is_welcome: true, is_showtime: true }
      });

      setIsGeneratingAudio(false);

      // Create message with pre-defined audio URL
      const showtimeMessage: Message = {
        ...WELCOME_MESSAGES[0],
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      };

      // Display message
      setMessages([showtimeMessage]);

      // Play audio if enabled
      if (audioEnabled && showtimeMessage.audioUrl) {
        console.log('[PHOENIX] 🎵 Playing Showtime welcome audio');
        await playAudioWithHighlight(showtimeMessage.audioUrl, showtimeMessage.id);
      }

      // Mark welcome as played to prevent replay
      setHasWelcomePlayed(true);
      console.log('[PHOENIX] ✅ Showtime welcome complete');

      toast({
        title: "🎬 Showtime!",
        description: "Betty and Al are ready. What would you like to learn?"
      });

    } catch (error) {
      console.error('Error initializing conversation:', error);
      setIsGeneratingAudio(false);
      setHasWelcomePlayed(false); // Unlock if failed
    }
  };

  const sendMessage = async (retryCount = 0): Promise<void> => {
    if (!input.trim() || loading) return;

    setLoading(true);
    const userMessage = input.trim();
    setInput('');

    // Add user message to UI immediately (optimistic UI)
    const tempUserMessage: Message = {
      id: crypto.randomUUID(),
      persona: 'USER',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    // Add typing indicator
    const typingId = crypto.randomUUID();
    setMessages(prev => [...prev, {
      id: typingId,
      persona: 'CONDUCTOR',
      content: '',
      created_at: new Date().toISOString(),
      isTyping: true
    }]);

    try {
      // Get auth session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Call the orchestrator edge function with streaming using direct fetch
      // (supabase.functions.invoke doesn't support streaming yet)
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/ai-coach-orchestrator`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            message: userMessage,
            conversationId,
            conversationHistory: messages
              .filter(m => !m.isWelcome && !m.isTyping)
              .map(m => ({
                persona: m.persona,
                content: m.content
              }))
          })
        }
      );

      // Remove typing indicator immediately, before any potential errors
      setMessages(prev => prev.filter(m => m.id !== typingId));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[PHOENIX] Response error:', response.status, errorText);
        
        // Retry logic for network errors
        if (retryCount < 3 && (response.status >= 500 || response.status === 429)) {
          console.warn(`[PHOENIX] Retry attempt ${retryCount + 1}/3 after ${response.status} error`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          setLoading(false);
          setInput(userMessage); // Restore input
          return sendMessage(retryCount + 1);
        }
        
        throw new Error(`Server error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessageId = crypto.randomUUID();
      let currentPersona: 'BETTY' | 'AL' = 'AL';
      let fullText = '';
      let buffer = '';
      let isStreamingActive = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('[PHOENIX] Stream complete');
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          // Process complete lines (SSE format: data: {...}\n\n)
          let newlineIndex;
          while ((newlineIndex = buffer.indexOf('\n\n')) !== -1) {
            const line = buffer.slice(0, newlineIndex).trim();
            buffer = buffer.slice(newlineIndex + 2);
            
            if (!line || !line.startsWith('data: ')) continue;
            
            try {
              const jsonStr = line.slice(6);
              if (jsonStr === '[DONE]') continue;
              
              const data = JSON.parse(jsonStr);

              // Handle "thinking" indicator from backend
              if (data.type === 'thinking') {
                console.log('[PHOENIX] 🤔', data.persona, 'is thinking...');
                // Optional: Could show "Betty is thinking..." in UI here
                continue;
              }

              if (data.type === 'chunk') {
                fullText += data.content;
                currentPersona = data.persona;
                isStreamingActive = true;
                
                // Update message with streaming content + cursor
                setMessages(prev => {
                  const existing = prev.find(m => m.id === aiMessageId);
                  if (existing) {
                    return prev.map(m => 
                      m.id === aiMessageId 
                        ? { ...m, content: fullText, persona: currentPersona, isStreaming: true }
                        : m
                    );
                  }
                  // Create new message with streaming indicator
                  return [...prev, {
                    id: aiMessageId,
                    persona: currentPersona,
                    content: fullText,
                    created_at: new Date().toISOString(),
                    isStreaming: true
                  }];
                });
              } else if (data.type === 'handoff') {
                // Nite Owl handoff - add follow-up message from original persona
                console.log('[PHOENIX] 🔄 Handoff message received from', data.persona);
                
                const handoffMessageId = crypto.randomUUID();
                const handoffMessage: Message = {
                  id: handoffMessageId,
                  persona: data.persona,
                  content: data.content,
                  created_at: new Date().toISOString(),
                  audioUrl: data.audioUrl,
                  isStreaming: false
                };
                
                setMessages(prev => [...prev, handoffMessage]);
                
                // Auto-play handoff audio if enabled
                if (data.audioUrl && audioEnabled) {
                  console.log('[PHOENIX] Auto-playing handoff audio');
                  await playAudio(data.audioUrl, handoffMessageId);
                }
              } else if (data.type === 'dialogue') {
                // V2 DIALOGUE ENGINE: Single audio file with Betty + Al together
                console.log('[PHOENIX] 🎭✨ V2 Live Dialogue response received');
                console.log('[PHOENIX] Dialogue:', data.dialogue);
                console.log('[PHOENIX] Has audio:', !!data.audioUrl);
                
                const { dialogue, audioUrl } = data;
                
                // Validate dialogue structure
                if (!dialogue || !Array.isArray(dialogue) || dialogue.length !== 2) {
                  console.error('[PHOENIX] Invalid dialogue structure received');
                  return;
                }
                
                // Create message objects for both speakers
                const bettyMsgId = crypto.randomUUID();
                const bettyMsg: Message = {
                  id: bettyMsgId,
                  persona: 'BETTY',
                  content: dialogue[0].text,
                  created_at: new Date().toISOString(),
                  isStreaming: false,
                  metadata: {
                    isDialogue: true,
                    dialoguePart: 1,
                    generatedBy: data.metadata?.generatedBy
                  }
                };
                
                const alMsgId = crypto.randomUUID();
                const alMsg: Message = {
                  id: alMsgId,
                  persona: 'AL',
                  content: dialogue[1].text,
                  created_at: new Date().toISOString(),
                  audioUrl: audioUrl || undefined,
                  isStreaming: false,
                  metadata: {
                    isDialogue: true,
                    dialoguePart: 2,
                    generatedBy: data.metadata?.generatedBy
                  }
                };
                
                // Display Betty's message first
                setMessages(prev => [...prev, bettyMsg]);
                console.log('[PHOENIX] ✅ Betty message displayed');
                
                // Play combined audio immediately (contains both voices with natural pause)
                if (audioEnabled && audioUrl) {
                  console.log('[PHOENIX] 🎵 Playing multi-speaker dialogue audio');
                  try {
                    await playAudio(audioUrl, bettyMsgId);
                    console.log('[PHOENIX] ✅ Dialogue audio playback complete');
                  } catch (error) {
                    console.error('[PHOENIX] Audio playback error:', error);
                  }
                } else if (audioUrl) {
                  console.log('[PHOENIX] 🔇 Audio available but playback disabled');
                } else {
                  console.log('[PHOENIX] 📝 No audio generated - text-only dialogue');
                }
                
                // Display Al's message after short delay (matches audio pause timing)
                setTimeout(() => {
                  setMessages(prev => [...prev, alMsg]);
                  console.log('[PHOENIX] ✅ Al message displayed (delayed for natural flow)');
                }, 1500); // 1.5s matches the 750ms SSML pause + natural reading time
                
              } else if (data.type === 'co_response_al') {
                // PHASE 5.2: Co-Response Part 1 - Al's validation
                console.log('[PHOENIX] 🤝✨ Co-Response: Al validates (Part 1)');
                
                const alMessageId = crypto.randomUUID();
                const alMessage: Message = {
                  id: alMessageId,
                  persona: 'AL',
                  content: data.content,
                  created_at: new Date().toISOString(),
                  isStreaming: false,
                  metadata: {
                    isCoResponse: true,
                    coResponsePart: 1,
                    answerQuality: data.metadata?.answerQuality
                  }
                };
                
                setMessages(prev => [...prev, alMessage]);
                
              } else if (data.type === 'co_response_betty') {
                // PHASE 5.2: Co-Response Part 2 - Betty's follow-up
                console.log('[PHOENIX] 🤝✨ Co-Response: Betty deepens (Part 2)');
                
                const bettyMessageId = crypto.randomUUID();
                const bettyMessage: Message = {
                  id: bettyMessageId,
                  persona: 'BETTY',
                  content: data.content,
                  created_at: new Date().toISOString(),
                  isStreaming: false,
                  metadata: {
                    isCoResponse: true,
                    coResponsePart: 2
                  }
                };
                
                setMessages(prev => [...prev, bettyMessage]);
                
              } else if (data.type === 'done') {
                console.log('[PHOENIX] Stream done event:', data.metadata);
                isStreamingActive = false;
                
                // PHASE 3: Check for audio failure and notify user
                if (data.metadata?.audioFailed) {
                  toast({
                    title: "Voice Unavailable",
                    description: "Audio generation failed - showing text response only",
                    variant: "default",
                  });
                  console.warn('[PHOENIX] ⚠️ Audio generation failed, continuing with text-only');
                }
                
                // PHASE 5.2: Skip normal processing for co-response (already handled)
                if (data.isCoResponse) {
                  console.log('[PHOENIX] ✨ Co-response complete - skipping normal done processing');
                  continue; // Co-response messages already added, nothing more to do
                }
                
                // CRITICAL FIX: Use the finalText from done event, not accumulated chunks
                // This ensures text-audio synchronization even if Governor modified the response
                const finalTextFromServer = data.fullText || fullText;
                
                // SANITY CHECK: Detect text-audio desynchronization
                if (finalTextFromServer !== fullText) {
                  console.warn('[PHOENIX] ⚠️ TEXT MISMATCH DETECTED!');
                  console.warn('[PHOENIX] Accumulated from chunks:', fullText.substring(0, 80));
                  console.warn('[PHOENIX] Final from server:', finalTextFromServer.substring(0, 80));
                  console.warn('[PHOENIX] Replacing display text with server version for audio sync');
                } else {
                  console.log('[PHOENIX] ✅ Text-audio alignment verified');
                }
                
                // Update message with final text (could differ from streamed if Governor modified it)
                setMessages(prev => prev.map(m => 
                  m.id === aiMessageId 
                    ? { 
                        ...m, 
                        content: finalTextFromServer, // Use server's final text
                        isStreaming: false, 
                        audioUrl: data.audioUrl 
                      }
                    : m
                ));
                
                // Auto-play audio if enabled
                if (data.audioUrl && audioEnabled) {
                  console.log('[PHOENIX] Auto-playing response audio');
                  await playAudio(data.audioUrl, aiMessageId);
                }
              }
            } catch (parseError) {
              console.error('[PHOENIX] JSON parse error:', parseError);
              console.error('[PHOENIX] Failed line:', line.substring(0, 200));
            }
          }
        }

        // Handle any remaining buffer content
        if (buffer.trim()) {
          console.warn('[PHOENIX] Remaining buffer:', buffer.substring(0, 100));
        }

        // Ensure streaming indicator is removed
        if (isStreamingActive) {
          setMessages(prev => prev.map(m => 
            m.id === aiMessageId ? { ...m, isStreaming: false } : m
          ));
        }
        
        // Auto-save session after successful message exchange
        // Use setTimeout to avoid blocking the UI
        setTimeout(() => {
          saveCurrentSession();
        }, 2000);

      } catch (streamError) {
        console.error('[PHOENIX] Stream reading error:', streamError);
        throw streamError;
      }

    } catch (error) {
      console.error('Error sending message:', error);
      // Remove typing indicator and any streaming messages on error
      setMessages(prev => prev.filter(m => 
        m.id !== typingId && !m.isTyping && !m.isStreaming
      ));
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    } finally {
      // Always clear loading state
      setLoading(false);
      console.log('[PHOENIX] Loading state cleared');
    }
  };

  const manuallyTriggerPodcast = async () => {
    if (messages.length < 5) {
      toast({
        title: "Not Enough Content",
        description: "Have at least 5 messages before creating a podcast",
        variant: "destructive"
      });
      return;
    }

    setGeneratingPodcast(true);
    
    try {
      console.log('[PHOENIX] 🎙️ Manual podcast trigger initiated');
      
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error('Not authenticated');
      }

      // Take last 10-20 messages for context
      const recentMessages = messages.slice(-20).map(msg => ({
        role: msg.persona === 'USER' ? 'user' : msg.persona.toLowerCase(),
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('podcast-generator', {
        body: {
          conversationId,
          sessionId: conversationId,
          transcript: recentMessages,
          userId: authUser.id,
          manualTrigger: true // Flag for bypassing threshold
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "🎙️ Podcast Created!",
          description: `Topic: ${data.episode.topic}`,
        });
        
        // Add Nite Owl's presentation to chat
        if (data.niteOwlPresentation) {
          const niteOwlMsg: Message = {
            id: crypto.randomUUID(),
            persona: 'NITE_OWL',
            content: data.niteOwlPresentation.content,
            created_at: new Date().toISOString(),
            metadata: {
              episodeId: data.episode.id,
              audioUrl: data.episode.audioUrl,
              shareToken: data.episode.shareToken,
              type: 'podcast_notification'
            }
          };
          
          setMessages(prev => [...prev, niteOwlMsg]);
        }
      } else {
        toast({
          title: "No Aha! Moment Found",
          description: data?.analysis?.reasoning || "Try discussing a concept more deeply",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('[PHOENIX] Podcast generation error:', error);
      toast({
        title: "Podcast Generation Failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setGeneratingPodcast(false);
    }
  };

  const runBackfill = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in",
        variant: "destructive"
      });
      return;
    }

    setIsBackfilling(true);
    
    try {
      console.log('[PHOENIX] 📊 Starting backfill for user:', user.id);
      
      const { data, error } = await supabase.functions.invoke('backfill-phoenix-data', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      console.log('[PHOENIX] ✅ Backfill complete:', data);
      
      toast({
        title: "🎉 Data Migration Complete!",
        description: `Processed ${data.sessionsProcessed} sessions with ${data.messagesBackfilled} messages`,
      });
    } catch (error) {
      console.error('[PHOENIX] Backfill error:', error);
      toast({
        title: "Backfill Failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsBackfilling(false);
    }
  };

  const stopAllAudio = () => {
    console.log('[PHOENIX] 🛑 FORCE STOPPING all audio - active elements:', activeAudioElements.current.size);
    
    // Stop and remove ALL active audio elements with extreme prejudice
    activeAudioElements.current.forEach(audio => {
      try {
        // Stop playback immediately
        audio.pause();
        audio.currentTime = 0;
        
        // Remove all event listeners
        audio.onended = null;
        audio.onerror = null;
        audio.onplay = null;
        audio.onpause = null;
        
        // Release the audio source
        audio.src = '';
        audio.srcObject = null;
        
        // Force the audio element to release resources
        audio.load();
        
        // Remove from DOM if attached
        if (audio.parentNode) {
          audio.parentNode.removeChild(audio);
        }
        
        console.log('[PHOENIX] ✓ Destroyed audio element');
      } catch (err) {
        console.error('[PHOENIX] Error destroying audio:', err);
      }
    });
    
    // Clear the set
    activeAudioElements.current.clear();
    
    // Also find and kill any rogue audio elements in the DOM
    document.querySelectorAll('audio').forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        audio.load();
        if (audio.parentNode) {
          audio.parentNode.removeChild(audio);
        }
        console.log('[PHOENIX] ✓ Killed rogue audio element');
      } catch (err) {
        console.error('[PHOENIX] Error killing rogue audio:', err);
      }
    });
    
    // Clear any speaking indicators
    setSpeakingMessageId(null);
    
    // Release lock
    audioLockRef.current = false;
    
    console.log('[PHOENIX] 🛑 Audio stop complete');
  };

  const playAudio = async (audioUrl: string, messageId?: string, forceReplay = false): Promise<void> => {
    console.log('[PHOENIX] 🔊 playAudio called - messageId:', messageId, 'audioEnabled:', audioEnabled, 'forceReplay:', forceReplay);
    
    // Check if audio is enabled FIRST
    if (!audioEnabled) {
      console.log('[PHOENIX] ⛔ Audio disabled, aborting playback');
      return;
    }
    
    // Prevent duplicate plays of the same message (unless forced for manual replay)
    if (!forceReplay && messageId && playedMessagesRef.current.has(messageId)) {
      console.log('[PHOENIX] ⏭️ Message already played, skipping:', messageId);
      return;
    }
    
    // Wait for lock with timeout and auto-recovery
    const acquireLock = async (): Promise<boolean> => {
      const startTime = Date.now();
      while (audioLockRef.current) {
        // Check if audio was disabled while waiting
        if (!audioEnabled) {
          console.log('[PHOENIX] ⛔ Audio disabled during wait, aborting');
          return false;
        }
        
        if (Date.now() - startTime > 3000) { // 3 second timeout
          console.warn('[PHOENIX] ⚠️ Lock timeout - forcing release and cleanup');
          audioLockRef.current = false;
          stopAllAudio(); // Clean up any zombie audio
          return true;
        }
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      return true;
    };
    
    const lockAcquired = await acquireLock();
    if (!lockAcquired) return;
    
    // Double-check audio is still enabled after waiting
    if (!audioEnabled) {
      console.log('[PHOENIX] ⛔ Audio disabled after wait, aborting');
      return;
    }
    
    // Acquire lock FIRST before doing anything else
    audioLockRef.current = true;
    console.log('[PHOENIX] 🔒 Audio lock acquired for:', messageId || 'unknown');
    
    // Mark as played immediately after acquiring lock to prevent duplicates
    if (messageId) {
      playedMessagesRef.current.add(messageId);
      console.log('[PHOENIX] ✓ Marked as played:', messageId);
    }
    
    // Stop any currently playing audio WITHOUT releasing our lock
    console.log('[PHOENIX] ⏹️ Stopping previous audio - active elements:', activeAudioElements.current.size);
    activeAudioElements.current.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.onended = null;
        audio.onerror = null;
        audio.src = '';
        audio.load();
      } catch (err) {
        console.error('[PHOENIX] Error stopping audio:', err);
      }
    });
    activeAudioElements.current.clear();
    setSpeakingMessageId(null);
    
    return new Promise<void>((resolve) => {
      if (messageId) {
        setSpeakingMessageId(messageId);
      }
      
      const audio = new Audio(audioUrl);
      activeAudioElements.current.add(audio);
      console.log('[PHOENIX] Created new audio element. Total active:', activeAudioElements.current.size);
      
      const cleanup = () => {
        activeAudioElements.current.delete(audio);
        setSpeakingMessageId(null);
        audioLockRef.current = false;
        console.log('[PHOENIX] Audio cleanup complete. Remaining active:', activeAudioElements.current.size);
      };
      
      audio.onended = () => {
        console.log('[PHOENIX] Audio playback completed');
        cleanup();
        resolve();
      };
      
      audio.onerror = (err) => {
        console.error('[PHOENIX] Audio playback error:', err);
        cleanup();
        resolve();
      };
      
      audio.play().catch(err => {
        console.error('[PHOENIX] Audio play failed:', err);
        cleanup();
        resolve();
      });
    });
  };

  const playAudioWithHighlight = async (audioUrl: string, messageId: string): Promise<void> => {
    console.log('[PHOENIX] 🎵 playAudioWithHighlight called for message:', messageId);
    await playAudio(audioUrl, messageId);
  };

  const resetConversation = async () => {
    console.log('[PHOENIX] 🔄 Resetting conversation...');
    
    // Save current conversation before resetting
    if (messages.length > 1) {
      await saveCurrentSession();
    }
    
    // Stop all audio
    stopAllAudio();
    
    // Clear played messages tracking
    playedMessagesRef.current.clear();
    
    // CRITICAL: Reset ALL welcome-related state
    setHasWelcomePlayed(false);
    setHasUserStartedChat(false); // Reset user interaction flag
    
    // Clear state
    setMessages([]);
    setInput('');
    setLoading(false);
    setSpeakingMessageId(null);
    setIsGeneratingAudio(false);
    
    // Generate new conversation ID for fresh session
    const newConversationId = crypto.randomUUID();
    setConversationId(newConversationId);
    
    // Small delay to ensure state is cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Reinitialize conversation with welcome messages
    // (will now work because hasWelcomePlayed is false)
    await initializeConversation();
    
    toast({
      title: "Conversation Reset",
      description: "Starting fresh conversation with Betty and Al"
    });
  };
  
  // Auto-save conversation to database
  const saveCurrentSession = async () => {
    if (!user || messages.length <= 1) return; // Skip if no real conversation
    
    try {
      console.log('[PHOENIX] 💾 Auto-saving session...');
      
      // Generate title from first user message
      const firstUserMsg = messages.find(m => m.persona === 'USER');
      const sessionTitle = firstUserMsg 
        ? firstUserMsg.content.substring(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '')
        : 'Phoenix Lab Session';
      
      // Format messages for storage
      const sessionData = {
        messages: messages
          .filter(m => !m.isWelcome && !m.isTyping)
          .map(m => ({
            role: m.persona === 'USER' ? 'user' : m.persona.toLowerCase(),
            content: m.content,
            timestamp: m.created_at,
            persona: m.persona.toLowerCase()
          }))
      };
      
      const { error } = await supabase
        .from('coach_sessions')
        .insert({
          user_id: user.id,
          session_title: sessionTitle,
          source: 'coach_portal',
          session_data: sessionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('[PHOENIX] Error saving session:', error);
      } else {
        console.log('[PHOENIX] ✅ Session saved successfully');
        refetchHistory(); // Refresh the history modal
      }
    } catch (error) {
      console.error('[PHOENIX] Exception saving session:', error);
    }
  };
  
  // Auto-save on unmount
  useEffect(() => {
    return () => {
      if (messages.length > 1) {
        saveCurrentSession();
      }
    };
  }, [messages, user]);

  const getPersonaIcon = (persona: string) => {
    switch (persona) {
      case 'USER': return '👤';
      case 'BETTY': return '🧑‍🏫';
      case 'AL': return '🎓';
      case 'CONDUCTOR': return '🎭';
      case 'NITE_OWL': return '🦉';
      default: return '💬';
    }
  };

  const getPersonaColor = (persona: string) => {
    switch (persona) {
      case 'USER': return 'bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700';
      case 'BETTY': return 'bg-purple-100 border-purple-300 dark:bg-purple-900/20 dark:border-purple-700';
      case 'AL': return 'bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700';
      case 'CONDUCTOR': return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700';
      case 'NITE_OWL': return 'bg-orange-100 border-orange-300 dark:bg-orange-900/20 dark:border-orange-700';
      default: return 'bg-muted border-border';
    }
  };

  // Welcome Screen - Show before chat starts
  if (!hasUserStartedChat) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard/admin')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin Dashboard
        </Button>
        
        <Card className="border-2 border-purple-500/20 shadow-2xl">
          <CardContent className="p-12 text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <TestTube className="w-12 h-12 text-white" />
            </div>
            
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome to Phoenix Lab
              </h1>
              <Badge variant="secondary" className="mb-4">Phase 3 - Production Ready</Badge>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Experience the future of AI-powered learning with Betty and Al, 
                your intelligent learning companions powered by advanced Socratic dialogue and direct expert support.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
              <div className="p-4 rounded-lg bg-purple-100 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700">
                <div className="text-3xl mb-2">🧑‍🏫</div>
                <h3 className="font-semibold mb-1">Betty - Socratic Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Asks thought-provoking questions to help you discover the "why" and build deep understanding
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700">
                <div className="text-3xl mb-2">🎓</div>
                <h3 className="font-semibold mb-1">Al - Direct Expert</h3>
                <p className="text-sm text-muted-foreground">
                  Provides clear, efficient answers and factual support when you need quick help
                </p>
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                size="lg"
                onClick={() => setHasUserStartedChat(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg shadow-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Conversation
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Click to begin your personalized learning journey
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-12 pb-6 max-w-6xl">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard/admin')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin Dashboard
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <TestTube className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold">Phoenix Lab</h1>
          <Badge variant="secondary" className="ml-2">Phase 3 - Production Ready</Badge>
        </div>
        <p className="text-muted-foreground">
          Admin-only testing environment for Project Phoenix AI Engine
        </p>
      </div>

      <Alert className="mb-6">
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <strong>Phase 3 Status:</strong> Modular prompts ✓ | 5-intent detection ✓ | Socratic Handoff ✓ | Streaming UI ✓ | Governor verified ✓
        </AlertDescription>
      </Alert>

      {/* Data Migration Alert */}
      {showBackfillAlert && (
        <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong className="text-amber-900 dark:text-amber-100">Analytics Data Migration Required:</strong>
              <p className="text-sm mt-1">Historical conversations need to be migrated to phoenix_* tables for analytics to display. Use the "Backfill Analytics" button in the Debug Panel.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBackfillAlert(false)}
              className="ml-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Conversation
                </CardTitle>
                <CardDescription>
                  Session: {conversationId.substring(0, 13)}...
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {/* Settings toggles */}
                <div className="flex items-center gap-3 mr-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="welcome-toggle"
                      checked={settings.showWelcomeMessage}
                      onCheckedChange={toggleWelcomeMessage}
                      disabled={settingsLoading}
                    />
                    <Label 
                      htmlFor="welcome-toggle" 
                      className="text-sm cursor-pointer"
                      title="Enable or disable the full welcome message sequence"
                    >
                      Welcome Message
                    </Label>
                  </div>
                </div>
                
                <Separator orientation="vertical" className="h-8" />
                
                {/* Audio toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    const newValue = !audioEnabled;
                    setAudioEnabled(newValue);
                    await toggleAudio();
                  }}
                  className={`${audioEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                  title={audioEnabled ? 'Disable Audio' : 'Enable Audio'}
                >
                  {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetConversation}
                  className="text-muted-foreground hover:text-foreground"
                  title="Reset Conversation"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={manuallyTriggerPodcast}
                  disabled={messages.length < 5 || generatingPodcast || loading}
                  className="text-muted-foreground hover:text-foreground"
                  title="Create Aha! Moment podcast from recent messages"
                >
                  {generatingPodcast ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Podcast className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <div className="relative">
              <ScrollArea 
                ref={scrollAreaRef}
                className="h-[500px] pr-4 mb-4"
                onScrollCapture={handleScroll}
              >
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start a conversation to test the Phoenix AI engine</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {isGeneratingAudio && (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating audio for welcome messages...</span>
                      </div>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${getPersonaColor(msg.persona)} ${
                        speakingMessageId === msg.id ? 'ring-4 ring-primary ring-opacity-50 shadow-lg scale-105' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-2xl">{getPersonaIcon(msg.persona)}</span>
                        <Badge variant="outline">{msg.persona}</Badge>
                        {msg.isStreaming && (
                          <Badge 
                            variant="default" 
                            className="animate-pulse bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 text-white font-semibold px-3 py-1"
                          >
                            ⚡ Streaming...
                          </Badge>
                        )}
                        {speakingMessageId === msg.id && (
                          <Badge variant="default" className="animate-pulse">
                            🔊 Speaking
                          </Badge>
                        )}
                        {msg.intent && (
                          <Badge variant="secondary" className="text-xs">
                            Intent: {msg.intent}
                          </Badge>
                        )}
                        {msg.sentiment && (
                          <Badge variant="secondary" className="text-xs">
                            Sentiment: {msg.sentiment}
                          </Badge>
                        )}
                        {msg.metadata?.governorChecked && msg.persona !== 'USER' && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                            ✓ Verified Safe
                          </Badge>
                        )}
                      </div>
                      {msg.isTyping ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span>typing...</span>
                        </div>
                      ) : (
                        <>
                          <div className="whitespace-pre-wrap text-sm">
                            {msg.content}
                            {msg.isStreaming && (
                              <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                            )}
                          </div>
                          {msg.audioUrl && msg.persona !== 'USER' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => playAudio(msg.audioUrl!, msg.id, true)}
                              className="mt-2"
                              disabled={!audioEnabled}
                            >
                              <Volume2 className="w-4 h-4 mr-2" />
                              Replay Audio
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
              </ScrollArea>
              
              {/* Jump to Bottom Button */}
              {isScrolledUp && messages.length > 0 && (
                <Button
                  onClick={() => scrollToBottom(true)}
                  size="icon"
                  className="absolute bottom-6 right-6 rounded-full shadow-lg z-10 animate-in fade-in slide-in-from-bottom-2"
                  title="Jump to bottom"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              )}
            </div>

            <Separator className="my-4" />

            {/* Input Area */}
            <div className="space-y-3">
              <div className="relative">
                <Textarea
                  placeholder="Type or speak your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={3}
                  disabled={loading}
                  className="pr-12"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleListening}
                  disabled={loading}
                  className={`absolute right-2 top-2 ${isListening ? 'text-red-500 animate-pulse' : ''}`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  <Mic className="w-5 h-5" />
                </Button>
              </div>
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Session</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistoryModal(true)}
                  className="h-7 w-7 p-0"
                  title="View Session History"
                >
                  <History className="h-4 w-4" />
                </Button>
              </div>
              <code className="text-xs bg-muted p-2 rounded block break-all">
                {conversationId}
              </code>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Message Count</h4>
              <p className="text-2xl font-bold">{messages.length}</p>
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Phase {currentPhase} Features</h4>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setCurrentPhase(prev => Math.max(1, prev - 1))}
                    disabled={currentPhase === 1}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setCurrentPhase(prev => Math.min(5, prev + 1))}
                    disabled={currentPhase === 5}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ul className="text-sm space-y-1">
                {PHASE_FEATURES[currentPhase as keyof typeof PHASE_FEATURES].map((feature) => {
                  const isComplete = 
                    PHASE_COMPLETION_STATUS[currentPhase as keyof typeof PHASE_COMPLETION_STATUS] === 'all';
                  
                  return (
                    <li key={feature}>
                      {isComplete ? '✅' : '⏳'} {feature}
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <Separator />
            
            {/* Data Migration Tools */}
            <div>
              <h4 className="font-semibold mb-3">Data Migration</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runBackfill}
                  disabled={isBackfilling}
                  className="w-full text-xs"
                >
                  {isBackfilling ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Migrating...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-3 w-3" />
                      Backfill Analytics
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Migrates historical data from coach_sessions to phoenix_* tables
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Flags Control Panel - Full Width */}
      <PhoenixFeatureFlags />

      {/* Analytics Dashboard */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Phoenix Analytics Dashboard
          </CardTitle>
          <CardDescription>
            Real-time performance metrics and AI behavior analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="frustration">Frustration</TabsTrigger>
              <TabsTrigger value="nite-owl">Nite Owl</TabsTrigger>
              <TabsTrigger value="intent">Intent Accuracy</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="mt-4">
              <PerformanceDashboard />
            </TabsContent>
            
            <TabsContent value="frustration" className="mt-4">
              <FrustrationHeatmap />
            </TabsContent>
            
            <TabsContent value="nite-owl" className="mt-4">
              <NiteOwlMonitor />
            </TabsContent>
            
            <TabsContent value="intent" className="mt-4">
              <IntentAccuracyChart />
            </TabsContent>
            
            <TabsContent value="features" className="mt-4">
              <FeatureFlagTelemetry />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Session History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-6xl h-[80vh] p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Session History
            </DialogTitle>
            <DialogDescription>
              Review past conversations from Phoenix Lab
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex h-[calc(80vh-120px)]">
            {/* Session List - Left Side */}
            <div className="w-80 border-r">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {!sessionHistory || sessionHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No session history yet</p>
                    </div>
                  ) : (
                    sessionHistory.map((session: any) => {
                      const firstMessage = session.session_data?.messages?.[0]?.content || 'No messages';
                      const preview = firstMessage.length > 50 
                        ? firstMessage.substring(0, 50) + '...' 
                        : firstMessage;
                      const isSelected = selectedHistorySession?.id === session.id;
                      
                      return (
                        <Card
                          key={session.id}
                          className={`cursor-pointer transition-colors hover:bg-accent ${
                            isSelected ? 'border-primary bg-accent' : ''
                          }`}
                          onClick={() => setSelectedHistorySession(session)}
                        >
                          <CardContent className="p-3">
                            <div className="text-xs text-muted-foreground mb-1">
                              {new Date(session.created_at).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </div>
                            <div className="text-sm font-medium mb-1">
                              {session.session_title || 'Untitled Session'}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {preview}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Conversation Transcript - Right Side */}
            <div className="flex-1 flex flex-col">
              {!selectedHistorySession ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <User className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p>Select a session to view the conversation</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedHistorySession.session_title || 'Untitled Session'}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(selectedHistorySession.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => loadSession(selectedHistorySession)}
                      size="sm"
                      className="gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Load This Session
                    </Button>
                  </div>
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4 max-w-3xl">
                      {selectedHistorySession.session_data?.messages?.map((msg: any, idx: number) => (
                        <div
                          key={idx}
                          className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.role !== 'user' && (
                            <div className="flex-shrink-0">
                              {msg.persona === 'betty' ? (
                                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-lg">
                                  🧑‍🏫
                                </div>
                              ) : msg.persona === 'al' ? (
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-lg">
                                  🎓
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-lg">
                                  🤖
                                </div>
                              )}
                            </div>
                          )}
                          <Card
                            className={`max-w-[80%] ${
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : msg.persona === 'betty'
                                ? 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800'
                                : msg.persona === 'al'
                                ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                                : 'bg-card'
                            }`}
                          >
                            <CardContent className="p-3">
                              {msg.persona && msg.role !== 'user' && (
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {msg.persona === 'betty' ? 'Betty' : msg.persona === 'al' ? 'Al' : 'Assistant'}
                                  </Badge>
                                  {msg.metadata?.isCoResponse && (
                                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                                      <Sparkles className="w-3 h-3" />
                                      {msg.metadata.coResponsePart === 1 ? 'Validates' : 'Deepens'}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
