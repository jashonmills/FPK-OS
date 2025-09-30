import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Target, TrendingUp, Loader2, CheckCircle } from 'lucide-react';
import type { SocraticSession, SocraticTurn } from '@/hooks/useSocraticSession';

interface SocraticSessionViewProps {
  session: SocraticSession;
  turns: SocraticTurn[];
  loading: boolean;
  onSendResponse: (message: string) => void;
  onEndSession: () => void;
}

export function SocraticSessionView({
  session,
  turns,
  loading,
  onSendResponse,
  onEndSession
}: SocraticSessionViewProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  const handleSend = () => {
    if (input.trim() && !loading) {
      onSendResponse(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const avgScore = session.score_history?.length
    ? (session.score_history.reduce((a, b) => a + b, 0) / session.score_history.length).toFixed(1)
    : '—';

  const isComplete = session.state === 'COMPLETED';

  return (
    <div className="flex flex-col h-full">
      {/* Session Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">{session.topic}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{session.objective}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                Avg: {avgScore}
              </Badge>
              {isComplete && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Complete
                </Badge>
              )}
            </div>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex gap-2 pt-2">
            {session.score_history?.map((score, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full ${
                  score === 3 ? 'bg-green-500' :
                  score === 2 ? 'bg-yellow-500' :
                  score === 1 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                title={`Question ${idx + 1}: Score ${score}/3`}
              />
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {turns.map((turn) => (
              <div
                key={turn.id}
                className={`flex ${turn.role === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    turn.role === 'coach'
                      ? 'bg-primary/10 text-foreground'
                      : turn.role === 'student'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground text-sm'
                  }`}
                >
                  {turn.role === 'system' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-70">Evaluation:</span>
                      <Badge variant={turn.score && turn.score >= 2 ? 'default' : 'destructive'}>
                        Score: {turn.score}/3
                      </Badge>
                      {turn.misconception && (
                        <span className="text-xs opacity-70">• {turn.misconception}</span>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap">{turn.content}</p>
                      {turn.score !== undefined && turn.role === 'coach' && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Previous: {turn.score}/3
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Evaluating your response...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <CardContent className="border-t p-4">
          {isComplete ? (
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Session complete! Great work on mastering {session.topic}.
              </p>
              <Button onClick={onEndSession}>Start New Session</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your response..."
                className="resize-none"
                rows={2}
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                size="icon"
                className="shrink-0 h-auto"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
