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
import { Loader2, Send, Sparkles, Brain, TestTube, AlertCircle, ArrowLeft, Mic, Volume2 } from 'lucide-react';
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
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize conversation and speech recognition
  useEffect(() => {
    initializeConversation();
    initializeSpeechRecognition();
  }, []);

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

  const initializeConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create conversation
      await supabase.from('phoenix_conversations').insert({
        user_id: user.id,
        session_id: conversationId,
        metadata: { phase: 2, created_from: 'phoenix_lab' }
      });

      // Insert welcome messages
      const welcomeMessagesToInsert = WELCOME_MESSAGES.map(msg => ({
        conversation_id: conversationId,
        user_id: user.id,
        persona: msg.persona,
        content: msg.content,
        metadata: { is_welcome: true }
      }));

      await supabase.from('phoenix_messages').insert(welcomeMessagesToInsert);

      // Load welcome messages into UI
      const welcomeMessages: Message[] = WELCOME_MESSAGES.map(msg => ({
        ...msg,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      }));
      setMessages(welcomeMessages);

      toast({
        title: "🧪 Phoenix Lab Initialized",
        description: "Betty and Al are ready to help you learn!"
      });
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    const userMessage = input.trim();
    setInput('');

    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: crypto.randomUUID(),
      persona: 'USER',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      // Call the Conductor edge function (filter out welcome messages from history)
      const { data, error } = await supabase.functions.invoke('ai-coach-orchestrator', {
        body: {
          message: userMessage,
          conversationId,
          conversationHistory: messages
            .filter(m => !m.isWelcome)
            .map(m => ({
              persona: m.persona,
              content: m.content
            }))
        }
      });

      if (error) throw error;

      // Add AI response to UI
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        persona: data.metadata.persona || 'CONDUCTOR',
        content: data.response,
        intent: data.metadata.intent,
        sentiment: data.metadata.sentiment,
        metadata: data.metadata,
        audioUrl: data.audioUrl,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Auto-play audio if available
      if (data.audioUrl) {
        playAudio(data.audioUrl);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    }
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

  return (
    <div className="container mx-auto p-6 max-w-6xl">
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
          <Badge variant="secondary" className="ml-2">Phase 2 - AI Active</Badge>
        </div>
        <p className="text-muted-foreground">
          Admin-only testing environment for Project Phoenix AI Engine
        </p>
      </div>

      <Alert className="mb-6">
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <strong>Phase 2 Status:</strong> Real AI intent detection ✓ | Betty & Al personas active ✓ | Voice input/output enabled ✓
        </AlertDescription>
      </Alert>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Conversation
            </CardTitle>
            <CardDescription>
              Session: {conversationId.substring(0, 13)}...
            </CardDescription>
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
                  {messages.map((msg) => (
                    <div key={msg.id} className={`p-4 rounded-lg border-2 ${getPersonaColor(msg.persona)}`}>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-2xl">{getPersonaIcon(msg.persona)}</span>
                        <Badge variant="outline">{msg.persona}</Badge>
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
                      </div>
                       <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                       {msg.audioUrl && msg.persona !== 'USER' && (
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => playAudio(msg.audioUrl!)}
                           className="mt-2"
                         >
                           <Volume2 className="w-4 h-4 mr-2" />
                           Replay Audio
                         </Button>
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
            {/* Hidden audio element for playback */}
            <audio ref={audioRef} className="hidden" />
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
              <h4 className="font-semibold mb-2">Phase 2 Features</h4>
              <ul className="text-sm space-y-1">
                <li>✅ Database schema</li>
                <li>✅ Real intent detection</li>
                <li>✅ Betty AI (Socratic)</li>
                <li>✅ Al AI (Direct)</li>
                <li>✅ Voice input (STT)</li>
                <li>✅ Voice output (TTS)</li>
                <li>⏳ Governor module (pending)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
