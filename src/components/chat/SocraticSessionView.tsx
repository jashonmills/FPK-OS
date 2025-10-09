import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader } from '@/components/ui/card';
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
  const [isInputFocused, setIsInputFocused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (!isInputFocused) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [turns, isInputFocused]);

  const handleSend = () => {
    if (input.trim() && !loading && !isSubmittingRef.current) {
      isSubmittingRef.current = true;
      onSendResponse(input.trim());
      setInput('');
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 500);
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
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {/* Session Header */}
      <Card className="mb-3 sm:mb-4 flex-shrink-0">
        <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0">
            <div className="space-y-1 flex-1 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Target className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <h3 className="font-semibold text-sm sm:text-base">{session.topic}</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">{session.objective}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2">
                <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                Avg: {avgScore}
              </Badge>
              {isComplete && (
                <Badge variant="default" className="gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2">
                  <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  Complete
                </Badge>
              )}
            </div>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex gap-1.5 sm:gap-2 pt-2">
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
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 overscroll-contain scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="space-y-3 sm:space-y-4">
            {turns.map((turn) => (
              <div
                key={turn.id}
                className={`flex ${turn.role === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2.5 sm:p-3 ${
                    turn.role === 'coach'
                      ? 'bg-primary/10 text-foreground'
                      : turn.role === 'student'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground text-xs sm:text-sm'
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
                      <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">{turn.content}</p>
                      {turn.score !== undefined && turn.role === 'coach' && (
                        <Badge variant="outline" className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs">
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
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t p-3 sm:p-4 bg-card pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4" style={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'hsl(var(--background))',
          zIndex: 10
        }}>
          {isComplete ? (
            <div className="text-center space-y-3">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Session complete! Great work on mastering {session.topic}.
              </p>
              <Button onClick={onEndSession} className="min-h-[44px]">Start New Session</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => {
                  setIsInputFocused(true);
                }}
                onBlur={() => {
                  setIsInputFocused(false);
                }}
                placeholder="Type your response..."
                className="resize-none text-sm"
                rows={3}
                disabled={loading}
                style={{ 
                  fontSize: '16px' // Prevent zoom on iOS
                }}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                size="icon"
                className="shrink-0 h-auto min-h-[44px] min-w-[44px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
