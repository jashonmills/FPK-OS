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
import { Loader2, Send, Sparkles, Brain, TestTube, AlertCircle, ArrowLeft, Mic, Volume2, VolumeX, RotateCcw, History, User, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { usePhoenixSettings } from '@/hooks/usePhoenixSettings';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

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

const WELCOME_MESSAGES: Omit<Message, 'id' | 'created_at'>[] = [
  {
    persona: 'AL',
    content: "System online. Welcome. I'm Al, your direct support expert.",
    isWelcome: true
  },
  {
    persona: 'BETTY',
    content: "And I'm Betty, your Socratic guide! We're both here to help you learn in the best way possible.",
    isWelcome: true
  },
  {
    persona: 'AL',
    content: "My approach is to give you clear, efficient answers. If you ask 'what' or 'how-to', I'll provide the facts...",
    isWelcome: true
  },
  {
    persona: 'BETTY',
    content: "...and my approach is to help you discover the 'why'. I'll ask questions that challenge you to think critically and build a deeper understanding.",
    isWelcome: true
  },
  {
    persona: 'AL',
    content: "So you get the best of both worlds: direct help when you need it...",
    isWelcome: true
  },
  {
    persona: 'BETTY',
    content: "...and deep learning when you're ready for it. We're excited to start. What would you like to tackle first?",
    isWelcome: true
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
  4: 'partial', // Some features complete
} as const;

const PHASE_4_COMPLETED = [
  'Podcast Generation',
  'Aha Moment Detection',
  'Multi-Speaker Audio',
  'Analytics Dashboard',
];

export default function PhoenixLab() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [hasWelcomePlayed, setHasWelcomePlayed] = useState(false); // CRITICAL: Prevents welcome replay
  const [hasUserStartedChat, setHasUserStartedChat] = useState(false); // Start chat trigger
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistorySession, setSelectedHistorySession] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState(4); // Start at current phase
  const activeAudioElements = React.useRef<Set<HTMLAudioElement>>(new Set());
  const audioLockRef = React.useRef(false);
  const playedMessagesRef = React.useRef<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    
    // CRITICAL FIX: Only run welcome sequence if user has clicked Start Chat AND it hasn't been played yet
    if (hasUserStartedChat && !hasWelcomePlayed && messages.length === 0) {
      console.log('[PHOENIX] 🎬 Starting welcome sequence (showWelcome:', settings.showWelcomeMessage, ')');
      initializeConversation();
    } else {
      console.log('[PHOENIX] ⏭️ Skipping welcome - not started, already played, or messages exist');
    }
    initializeSpeechRecognition();
  }, [hasUserStartedChat, settingsLoading, settings.showWelcomeMessage]); // Trigger when user starts chat or settings load

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

  const getCachedAudio = (text: string, persona: 'AL' | 'BETTY' | 'NITE_OWL'): string | null => {
    // Use a hash of the full text for better uniqueness
    const textHash = btoa(encodeURIComponent(text)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
    const cacheKey = `phoenix-welcome-${persona}-${textHash}`;
    return localStorage.getItem(cacheKey);
  };

  const setCachedAudio = (text: string, persona: 'AL' | 'BETTY' | 'NITE_OWL', audioUrl: string) => {
    const textHash = btoa(encodeURIComponent(text)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
    const cacheKey = `phoenix-welcome-${persona}-${textHash}`;
    try {
      localStorage.setItem(cacheKey, audioUrl);
      console.log(`[PHOENIX] 💾 Cached audio for ${persona}: ${cacheKey}`);
    } catch (e) {
      console.warn('[PHOENIX] Failed to cache audio:', e);
    }
  };

  const generateWelcomeAudio = async (text: string, persona: 'AL' | 'BETTY' | 'NITE_OWL'): Promise<string | null> => {
    try {
      // Check cache first
      const cached = getCachedAudio(text, persona);
      if (cached) {
        console.log(`[PHOENIX] ✅ Using cached audio for ${persona}: "${text.substring(0, 30)}..."`);
        return cached;
      }

      console.log(`[PHOENIX] 🎵 Generating audio for ${persona}: "${text.substring(0, 40)}..."`);
      
      const { data, error } = await supabase.functions.invoke('generate-welcome-audio', {
        body: { text, persona }
      });

      if (error) {
        console.error(`[PHOENIX] ❌ Audio generation failed for ${persona}:`, error);
        return null;
      }
      
      if (data?.audioContent) {
        const provider = data.provider || 'unknown';
        const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
        console.log(`[PHOENIX] ✅ Audio ready for ${persona} via ${provider}: "${text.substring(0, 40)}..."`);
        
        // Cache for next time
        setCachedAudio(text, persona, audioUrl);
        return audioUrl;
      }
      
      console.warn(`[PHOENIX] ⚠️ No audio content returned for ${persona}: "${text.substring(0, 40)}..."`);
      return null;
    } catch (error) {
      console.error(`[PHOENIX] ❌ Exception generating audio for ${persona}: "${text.substring(0, 40)}..."`, error);
      return null;
    }
  };

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
      
      // Create conversation record
      await supabase.from('phoenix_conversations').insert({
        user_id: authUser.id,
        session_id: conversationId,
        metadata: { phase: 2, created_from: 'phoenix_lab', welcome_skipped: true }
      });
      
      // Generate audio for welcome back message
      const userName = user?.user_metadata?.full_name || 'there';
      const welcomeText = `Welcome back, ${userName}. What would you like to work on today?`;
      
      console.log('[PHOENIX] 🎵 Generating audio for welcome back message...');
      const audioUrl = await generateWelcomeAudio(welcomeText, 'AL');
      
      const simpleWelcome: Message = {
        id: crypto.randomUUID(),
        persona: 'AL',
        content: welcomeText,
        created_at: new Date().toISOString(),
        isWelcome: true,
        audioUrl: audioUrl || undefined
      };
      
      setMessages([simpleWelcome]);
      setHasWelcomePlayed(true);
      
      // Play audio if available and enabled
      if (audioUrl && audioEnabled) {
        await playAudioWithHighlight(audioUrl, simpleWelcome.id);
      }
      
      toast({
        title: "🧪 Phoenix Lab Ready",
        description: "Let's continue learning!"
      });
      
      return;
    }
    
    try {
      console.log('[PHOENIX] 🎬 Initializing conversation with welcome sequence');
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      setIsGeneratingAudio(true);

      // Create conversation
      await supabase.from('phoenix_conversations').insert({
        user_id: authUser.id,
        session_id: conversationId,
        metadata: { phase: 2, created_from: 'phoenix_lab' }
      });

      // Insert welcome messages
      const welcomeMessagesToInsert = WELCOME_MESSAGES.map(msg => ({
        conversation_id: conversationId,
        persona: msg.persona,
        content: msg.content,
        metadata: { is_welcome: true }
      }));

      await supabase.from('phoenix_messages').insert(welcomeMessagesToInsert);

      // Generate ALL audio in parallel (much faster!)
      console.log('[PHOENIX] 🚀 Generating all 6 welcome audios in parallel...');
      const audioPromises = WELCOME_MESSAGES.map((msg, index) => {
        console.log(`[PHOENIX] Starting audio ${index + 1}/6 for ${msg.persona}`);
        return generateWelcomeAudio(msg.content, msg.persona as 'AL' | 'BETTY');
      });
      
      const audioUrls = await Promise.all(audioPromises);
      
      // Log results
      const successCount = audioUrls.filter(url => url !== null).length;
      console.log(`[PHOENIX] ✅ Audio generation complete: ${successCount}/6 succeeded`);
      audioUrls.forEach((url, i) => {
        if (!url) {
          console.error(`[PHOENIX] ❌ Message ${i + 1} (${WELCOME_MESSAGES[i].persona}) has NO AUDIO`);
        }
      });

      setIsGeneratingAudio(false);

      // Create all messages with audio URLs
      const messagesWithAudio: Message[] = WELCOME_MESSAGES.map((msg, i) => ({
        ...msg,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        audioUrl: audioUrls[i] || undefined
      }));

      // Display messages with typing effect and play audio sequentially
      for (let i = 0; i < messagesWithAudio.length; i++) {
        await new Promise(resolve => setTimeout(resolve, i === 0 ? 500 : 800));
        
        // Show typing indicator
        if (i > 0) {
          setMessages(prev => [...prev, {
            id: `typing-${i}`,
            persona: messagesWithAudio[i].persona,
            content: '',
            created_at: new Date().toISOString(),
            isWelcome: true,
            isTyping: true
          }]);
          
          await new Promise(resolve => setTimeout(resolve, 600));
        }
        
        // Remove typing indicator and add actual message
        if (i > 0) {
          setMessages(prev => prev.filter(m => !m.isTyping).concat(messagesWithAudio[i]));
        } else {
          setMessages([messagesWithAudio[i]]);
        }
        
        // Play audio immediately if available and enabled
        if (audioUrls[i] && audioEnabled) {
          await playAudioWithHighlight(audioUrls[i], messagesWithAudio[i].id);
        } else {
          // If no audio, just wait a bit before next message
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      // CRITICAL: Mark welcome as played to prevent replay
      setHasWelcomePlayed(true);
      console.log('[PHOENIX] ✅ Welcome sequence complete and locked');

      toast({
        title: "🧪 Phoenix Lab Initialized",
        description: "Betty and Al are ready to help you learn!"
      });
    } catch (error) {
      console.error('Error initializing conversation:', error);
      setIsGeneratingAudio(false);
    }
  };

  const sendMessage = async () => {
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
      // Call the Conductor edge function with streaming
      const response = await fetch(
        `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/ai-coach-orchestrator`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
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

      if (!response.ok) throw new Error('Failed to get response');

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

      // Remove typing indicator and add initial streaming message
      setMessages(prev => prev.filter(m => m.id !== typingId));

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
              } else if (data.type === 'done') {
                console.log('[PHOENIX] Stream done event:', data.metadata);
                isStreamingActive = false;
                
                // Remove streaming indicator
                setMessages(prev => prev.map(m => 
                  m.id === aiMessageId 
                    ? { ...m, isStreaming: false, audioUrl: data.audioUrl }
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

      } catch (streamError) {
        console.error('[PHOENIX] Stream reading error:', streamError);
        throw streamError;
      }

    } catch (error) {
      console.error('Error sending message:', error);
      // Remove typing indicator on error
      setMessages(prev => prev.filter(m => m.id !== typingId));
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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

  const playAudio = async (audioUrl: string, messageId?: string): Promise<void> => {
    console.log('[PHOENIX] 🔊 playAudio called - messageId:', messageId, 'audioEnabled:', audioEnabled);
    
    // Check if audio is enabled FIRST
    if (!audioEnabled) {
      console.log('[PHOENIX] ⛔ Audio disabled, aborting playback');
      return;
    }
    
    // Prevent duplicate plays of the same message
    if (messageId && playedMessagesRef.current.has(messageId)) {
      console.log('[PHOENIX] ⏭️ Message already played, skipping:', messageId);
      return;
    }
    
    // Wait for lock to be released (prevent concurrent playback)
    let waitCount = 0;
    while (audioLockRef.current) {
      // Check if audio was disabled while waiting
      if (!audioEnabled) {
        console.log('[PHOENIX] ⛔ Audio disabled during wait, aborting');
        return;
      }
      
      if (waitCount++ > 50) { // Max 5 seconds wait
        console.warn('[PHOENIX] ⏰ Audio lock timeout, forcing release');
        audioLockRef.current = false;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
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
    
    // Stop all audio
    stopAllAudio();
    
    // Clear played messages tracking
    playedMessagesRef.current.clear();
    
    // CRITICAL: Reset welcome flag to allow replay on reset
    setHasWelcomePlayed(false);
    
    // Clear state
    setMessages([]);
    setInput('');
    setLoading(false);
    setSpeakingMessageId(null);
    setIsGeneratingAudio(false);
    
    // Reinitialize conversation with welcome messages
    // (will now work because hasWelcomePlayed is false)
    await initializeConversation();
    
    toast({
      title: "Conversation Reset",
      description: "Starting fresh conversation with Betty and Al"
    });
  };

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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <ScrollArea className="h-[500px] pr-4 mb-4">
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
                              onClick={() => playAudio(msg.audioUrl!, msg.id)}
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
                onClick={sendMessage}
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
                    onClick={() => setCurrentPhase(prev => Math.min(4, prev + 1))}
                    disabled={currentPhase === 4}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ul className="text-sm space-y-1">
                {PHASE_FEATURES[currentPhase as keyof typeof PHASE_FEATURES].map((feature) => {
                  const isComplete = 
                    PHASE_COMPLETION_STATUS[currentPhase as keyof typeof PHASE_COMPLETION_STATUS] === 'all' ||
                    (currentPhase === 4 && PHASE_4_COMPLETED.includes(feature));
                  
                  return (
                    <li key={feature}>
                      {isComplete ? '✅' : '⏳'} {feature}
                    </li>
                  );
                })}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

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
                                <Badge variant="secondary" className="mb-2 text-xs">
                                  {msg.persona === 'betty' ? 'Betty' : msg.persona === 'al' ? 'Al' : 'Assistant'}
                                </Badge>
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
