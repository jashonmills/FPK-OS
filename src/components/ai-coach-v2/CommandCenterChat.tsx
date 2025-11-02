import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Mic, Volume2, VolumeX } from 'lucide-react';
import { useCommandCenterChat } from '@/hooks/useCommandCenterChat';
import { CoachPersona } from '@/hooks/useCoachSelection';
import { CoachSwitchButton } from './CoachSwitchButton';
import { MessageBubble } from './MessageBubble';

interface CommandCenterChatProps {
  userId?: string;
  selectedCoach: CoachPersona;
  onSwitchCoach: () => void;
}

export function CommandCenterChat({ userId, selectedCoach, onSwitchCoach }: CommandCenterChatProps) {
  const {
    messages,
    loading,
    audioEnabled,
    setAudioEnabled,
    sendMessage
  } = useCommandCenterChat(userId);

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const messageText = input;
    setInput('');
    await sendMessage(messageText, selectedCoach);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const coachName = selectedCoach === 'BETTY' ? 'Betty' : 'Al';
  const coachColor = selectedCoach === 'BETTY' ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-cyan-500';

  return (
    <Card className="flex flex-col flex-1 min-h-0">
      <CardHeader className="border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${coachColor} flex items-center justify-center text-white font-bold`}>
              {coachName[0]}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {coachName} - Your AI Coach
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedCoach === 'BETTY' ? 'Socratic Guide' : 'Direct Expert'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            
            <CoachSwitchButton
              currentCoach={selectedCoach}
              onSwitch={onSwitchCoach}
              disabled={loading}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 flex flex-col p-0">
        <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground p-8">
              <div>
                <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${coachColor} mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold`}>
                  {coachName[0]}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Welcome to your AI Command Center
                </h3>
                <p className="text-sm">
                  {selectedCoach === 'BETTY' 
                    ? "Betty will guide you through questions to help you discover concepts and think deeply."
                    : "Al will provide clear, direct answers to help you learn efficiently."
                  }
                </p>
                <p className="text-sm mt-2">Start by asking a question or sharing what you'd like to learn.</p>
              </div>
            </div>
          ) : (
            <div>
              {messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {loading && (
                <div className="flex gap-3 mb-4">
                  <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${coachColor} flex items-center justify-center text-white flex-shrink-0`}>
                    {coachName[0]}
                  </div>
                  <div className="flex items-center gap-2 bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-4 flex-shrink-0">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${coachName} anything...`}
              className="min-h-[60px] resize-none"
              disabled={loading}
            />
            <div className="flex flex-col gap-2">
              {recognitionRef.current && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleListening}
                  disabled={loading}
                  className={isListening ? 'bg-red-500 text-white hover:bg-red-600' : ''}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
