import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, Target, Clock, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Session {
  id: string;
  topic?: string;
  objective?: string;
  created_at: string;
  state?: string;
  type: 'socratic' | 'free';
  score_avg?: number;
}

interface SessionHistoryProps {
  onSelectSession: (sessionId: string, type: 'socratic' | 'free') => void;
  onNewSession: () => void;
  selectedSessionId?: string;
}

export function SessionHistory({ onSelectSession, onNewSession, selectedSessionId }: SessionHistoryProps) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function loadSessions() {
      setLoading(true);
      try {
        // Fetch both Socratic and free chat sessions
        const [socraticResult, freeResult] = await Promise.all([
          supabase
            .from('socratic_sessions')
            .select('id, topic, objective, created_at, state, score_history')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20),
          supabase
            .from('coach_sessions')
            .select('id, session_title, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20)
        ]);

        const socraticSessions: Session[] = (socraticResult.data || []).map(s => ({
          id: s.id,
          topic: s.topic,
          objective: s.objective,
          created_at: s.created_at,
          state: s.state,
          type: 'socratic' as const,
          score_avg: s.score_history?.length > 0 
            ? s.score_history.reduce((a: number, b: number) => a + b, 0) / s.score_history.length 
            : undefined
        }));

        const freeSessions: Session[] = (freeResult.data || []).map(s => ({
          id: s.id,
          topic: s.session_title,
          created_at: s.created_at,
          type: 'free' as const
        }));

        // Merge and sort by date
        const allSessions = [...socraticSessions, ...freeSessions].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setSessions(allSessions);
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, [user?.id]);

  return (
    <div className="h-full flex flex-col bg-background border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <Button 
          onClick={onNewSession}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Button>
      </div>

      {/* Session List */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No sessions yet</p>
            <p className="text-xs mt-1">Start a new session to begin learning</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  "p-3 cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
                  selectedSessionId === session.id && "border-primary bg-primary/5"
                )}
                onClick={() => onSelectSession(session.id, session.type)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {session.type === 'socratic' ? (
                      <Target className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    )}
                    <span className="font-medium text-sm truncate">
                      {session.topic || 'Untitled Session'}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>

                {session.objective && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {session.objective}
                  </p>
                )}

                <div className="flex items-center justify-between gap-2 mt-2">
                  <Badge 
                    variant={session.type === 'socratic' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {session.type === 'socratic' ? 'Structured' : 'Free Chat'}
                  </Badge>

                  {session.score_avg !== undefined && (
                    <Badge variant="outline" className="text-xs">
                      {session.score_avg.toFixed(1)}/3
                    </Badge>
                  )}

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}