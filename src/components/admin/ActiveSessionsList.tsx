import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ActiveSession {
  id: string;
  user_id: string;
  project_id: string;
  task_id: string | null;
  start_time: string;
  last_heartbeat: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
  projects: {
    name: string;
    color: string;
  };
}

interface ActiveSessionsListProps {
  sessions: ActiveSession[];
}

const SessionCard = ({ session }: { session: ActiveSession }) => {
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    const updateElapsed = () => {
      const start = new Date(session.start_time);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setElapsedTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [session.start_time]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={session.profiles.avatar_url || ''} />
              <AvatarFallback>{getInitials(session.profiles.full_name)}</AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          </div>
          
          <div>
            <p className="font-semibold">{session.profiles.full_name}</p>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: session.projects.color }}
              />
              <p className="text-sm text-muted-foreground">{session.projects.name}</p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <Badge variant="secondary" className="font-mono text-lg mb-1">
            <Clock className="h-4 w-4 mr-1" />
            {elapsedTime}
          </Badge>
          <p className="text-xs text-muted-foreground">
            Started {formatDistanceToNow(new Date(session.start_time), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Card>
  );
};

export const ActiveSessionsList = ({ sessions }: ActiveSessionsListProps) => {
  if (sessions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
        <p className="text-muted-foreground">No users are currently clocked in</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map(session => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
};
