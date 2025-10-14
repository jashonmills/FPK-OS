import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Sparkles, Brain, TestTube, AlertCircle, ArrowLeft, Mic, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  id: string;
  persona: 'USER' | 'BETTY' | 'AL' | 'CONDUCTOR';
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

export default function PhoenixLab() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [hasWelcomePlayed, setHasWelcomePlayed] = useState(false); // CRITICAL: Prevents welcome replay
  const [hasUserStartedChat, setHasUserStartedChat] = useState(false); // Start chat trigger
  const activeAudioElements = React.useRef<Set<HTMLAudioElement>>(new Set());
  const audioLockRef = React.useRef(false);
  const playedMessagesRef = React.useRef<Set<string>>(new Set());
  const { toast } = useToast();

  // Stop all audio when audio is disabled - use immediate effect
  useEffect(() => {
    if (!audioEnabled) {
      console.log('[PHOENIX] 🔴 Audio toggle disabled - force stopping all audio');
      stopAllAudio();
    }
  }, [audioEnabled]);

  // Initialize conversation and speech recognition - ONLY ONCE
  useEffect(() => {
    console.log('[PHOENIX] 🔍 useEffect triggered - hasUserStartedChat:', hasUserStartedChat, 'hasWelcomePlayed:', hasWelcomePlayed, 'messages.length:', messages.length);
    
    // CRITICAL FIX: Only run welcome sequence if user has clicked Start Chat AND it hasn't been played yet
    if (hasUserStartedChat && !hasWelcomePlayed && messages.length === 0) {
      console.log('[PHOENIX] 🎬 Starting one-time welcome sequence');
      initializeConversation();
    } else {
      console.log('[PHOENIX] ⏭️ Skipping welcome - not started, already played, or messages exist');
    }
    initializeSpeechRecognition();
  }, [hasUserStartedChat]); // Trigger when user starts chat

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

  const getCachedAudio = (text: string, persona: 'AL' | 'BETTY'): string | null => {
    // Use a hash of the full text for better uniqueness
    const textHash = btoa(encodeURIComponent(text)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
    const cacheKey = `phoenix-welcome-${persona}-${textHash}`;
    return localStorage.getItem(cacheKey);
  };

  const setCachedAudio = (text: string, persona: 'AL' | 'BETTY', audioUrl: string) => {
    const textHash = btoa(encodeURIComponent(text)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
    const cacheKey = `phoenix-welcome-${persona}-${textHash}`;
    try {
      localStorage.setItem(cacheKey, audioUrl);
      console.log(`[PHOENIX] 💾 Cached audio for ${persona}: ${cacheKey}`);
    } catch (e) {
      console.warn('[PHOENIX] Failed to cache audio:', e);
    }
  };

  const generateWelcomeAudio = async (text: string, persona: 'AL' | 'BETTY'): Promise<string | null> => {
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
    
    try {
      console.log('[PHOENIX] 🎬 Initializing conversation with welcome sequence');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setIsGeneratingAudio(true);

      // Create conversation
      await supabase.from('phoenix_conversations').insert({
        user_id: user.id,
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
      default: return '💬';
    }
  };

  const getPersonaColor = (persona: string) => {
    switch (persona) {
      case 'USER': return 'bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700';
      case 'BETTY': return 'bg-purple-100 border-purple-300 dark:bg-purple-900/20 dark:border-purple-700';
      case 'AL': return 'bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700';
      case 'CONDUCTOR': return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700';
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAudioEnabled(!audioEnabled)}
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
              <h4 className="font-semibold mb-2">Session</h4>
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
              <h4 className="font-semibold mb-2">Phase 3 Features</h4>
              <ul className="text-sm space-y-1">
                <li>✅ Modular Prompt Architecture</li>
                <li>✅ Betty (Socratic + AVCQ)</li>
                <li>✅ Al (Direct Expert)</li>
                <li>✅ Al Socratic Support</li>
                <li>✅ 5-Intent Detection</li>
                <li>✅ Socratic Handoff</li>
                <li>✅ Streaming UI</li>
                <li>✅ Voice I/O (STT/TTS)</li>
                <li>✅ Governor Verification</li>
                <li>✅ Audio Caching</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
