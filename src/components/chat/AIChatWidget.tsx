import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Mic, MicOff, Volume2, VolumeX, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFamily } from "@/contexts/FamilyContext";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useAICredits } from "@/hooks/useAICredits";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { consumeCredits, getChatCredits } from "@/lib/creditUtils";
import { AIAttribution } from "@/components/shared/AIAttribution";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: any[];
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const { toast } = useToast();
  const { selectedFamily } = useFamily();
  
  // Feature flags
  const { flags, loading: flagsLoading } = useFeatureFlags([
    'enable-advanced-ai-assistant',
    'enable-ai-speech-to-text',
    'enable-ai-text-to-speech',
    'enable-ai-auto-play'
  ]);

  // Voice capabilities
  const { isRecording, isTranscribing, startRecording, stopRecording, cancelRecording } = useSpeechToText();
  const { speak, stop: stopSpeaking, isSpeaking, isLoading: isTTSLoading } = useTextToSpeech();
  
  // Credits
  const { balance, canAfford, getInsufficientCreditsMessage, getCostForAction } = useAICredits();

  useEffect(() => {
    if (isOpen && !conversationId && selectedFamily) {
      createConversation();
    }
  }, [isOpen, selectedFamily]);

  const createConversation = async () => {
    if (!selectedFamily) return;

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({
        family_id: selectedFamily.id,
        created_by: user.user.id,
        title: "New Conversation",
      })
      .select()
      .single();

    if (!error && data) {
      setConversationId(data.id);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || !conversationId || !selectedFamily) return;

    // Check if user can afford the query (assuming RAG for safety)
    const creditsRequired = getChatCredits(true);
    if (!canAfford('chat_rag', 1)) {
      toast({
        title: "Insufficient Credits",
        description: getInsufficientCreditsMessage('chat_rag', 1),
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Consume credits first
      const creditResult = await consumeCredits(
        selectedFamily.id,
        'chat_rag',
        creditsRequired,
        { question: textToSend }
      );

      if (!creditResult.success) {
        throw new Error(creditResult.error || 'Failed to consume credits');
      }

      const { data, error } = await supabase.functions.invoke("chat-with-data", {
        body: {
          question: textToSend,
          family_id: selectedFamily.id,
          conversation_id: conversationId,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Auto-play response if enabled
      if (autoPlay && flags['enable-ai-text-to-speech'] && data.answer) {
        speak(data.answer);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      try {
        const transcription = await stopRecording();
        setInput(transcription);
      } catch (error) {
        console.error('Voice input error:', error);
      }
    } else {
      startRecording();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Don't render if feature is disabled or family not selected
  if (!selectedFamily || (flagsLoading === false && !flags['enable-advanced-ai-assistant'])) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">Chat with Your Data</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Welcome Message and Credit Balance */}
          {messages.length === 0 && (
            <div className="p-4 space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="font-medium mb-2">Hi! I'm your personal AI assistant.</p>
                <p>I've studied all of your family's data. Ask me anything about:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Logs and observations</li>
                  <li>Patterns and trends</li>
                  <li>IEPs and evaluations</li>
                  <li>Clinical research</li>
                </ul>
              </div>
              
              {balance && (
                <Alert>
                  <AlertDescription className="text-sm">
                    <span className="font-semibold">{balance.total_credits} credits</span> available
                    <span className="text-muted-foreground"> • Chat queries: {getCostForAction('chat_rag')} credits each</span>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-1 mb-1">
                            <AIAttribution variant="icon" />
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {/* Text-to-speech button for assistant messages */}
                      {message.role === "assistant" && flags['enable-ai-text-to-speech'] && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => isSpeaking ? stopSpeaking() : speak(message.content)}
                          className="h-6 w-6 p-0 shrink-0"
                          title={isSpeaking ? "Stop speaking" : "Read aloud"}
                        >
                          {isSpeaking ? (
                            <VolumeX className="h-3 w-3" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-muted-foreground/20">
                        <p className="text-xs opacity-70">
                          Sources: {message.sources.length} references
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t space-y-3">
            {/* Auto-play toggle */}
            {flags['enable-ai-text-to-speech'] && (
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-play" className="text-sm">
                  Auto-play responses
                </Label>
                <Switch
                  id="auto-play"
                  checked={autoPlay}
                  onCheckedChange={setAutoPlay}
                />
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isRecording ? "Listening..." : isTranscribing ? "Transcribing..." : "Ask a question..."}
                disabled={isLoading || isRecording || isTranscribing}
                className="flex-1"
              />
              
              {/* Voice input button */}
              {flags['enable-ai-speech-to-text'] && (
                <Button
                  onClick={handleVoiceInput}
                  disabled={isLoading || isTranscribing}
                  size="icon"
                  variant={isRecording ? "destructive" : "outline"}
                  title={isRecording ? "Stop recording" : "Start voice input"}
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              )}

              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading || isRecording || isTranscribing}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
