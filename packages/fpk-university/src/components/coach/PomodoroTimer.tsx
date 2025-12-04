import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Play, Pause, RotateCcw, Clock, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { trackDailyActivity } from '@/utils/analyticsTracking';

const DURATIONS = [
  { label: '15 min', minutes: 15 },
  { label: '25 min', minutes: 25 },
  { label: '45 min', minutes: 45 },
  { label: '60 min', minutes: 60 },
];

const DEFAULT_DURATION = 25;
const BREAK_DURATION = 5;

export function PomodoroTimer() {
  const { user } = useAuth();
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSiJ0fPTgjMGHm7A7+OZUQ0PXLTp6qhPEQpJot/xwWgiBS+B0O/XgjgJG2zA7d6cTgwPX7Xq6apTEgpNpuHyvGcfBS+Dz/LZfzYIHmzA7+ObTA0MX7no6KxXEwpNoODvwmgiBS+Bzv/cgUAJHWvC8d+fUg0MYrbr6axcEwpPouDvxGkhBTCDz/LahzoIHmzD8N+dUQ0NYLTq6q1fEwpPoeDwxWkhBS6Dz/PajTsIH2zE8N+gUg0NYLjr6q1jFApQo+HwyGkhBTCEz/LdkjwJIG7F8eChUw4OYrzs67FnFQtSpOLxymslBDKFz/LflD0KIXDH8eGjVA4OYrzs7LNpFgxUpeL0zG4lBTOFz/PhlT8LIXHI8uOlVQ8PZL3t7LRqFwxVpuP0zm8mBjSGz/Pjlz8LI3LJ8+SmVxAQZb7u7bVsFw1WqOT1z3EoBjSHz/TmmEEMJHPK8+WnWRAQZsDu7rZuGQ5XqeX20XIpBzaJz/TnmkIMJXXK9OanWhERaMDu77dzGQ5YquX31HMqCDiK0PTom0MMJnXL9OirWxEQacHv77h1GxBYq+b32XUqCTmL0fXqnUQNKHjN9OmtXRMSa8Lx8Lh2HBFZrOb43XUrCzqM0vXrnkUOKnnO9equXhUTbcPz8bl4HRJarub54HYtDDuN0vbtokYPLHrP9euwYBUUb8T18bp6HhNcr+j64lgwDT6P1PfwpUkRLn3R9+60YRYVcsX28rx8IBRdr+n75FoxDj6R1fjyp0oSL37T+O+2YhcWdMb48r6AIRVfsen76FwxDj+T1vn0qk0TM4DU+PG4YxgXdcj68sGCIhZhsu3862IyEECU1/r2rU4TNIPWufO6ZBkYeMr88sKEJBdjs+3+7WQzEkKW2fz5r1EVNoTV+vS8ZxoZecv98sOGJBdktOz/8GczE0SY2v3+sFEWOIfY+/W+aRsae8z/88SJJhhou+3/8WgzFESa3P7/slIXOojY+/fBaxsce83//MeMKBhovO7/8ms0FUWd3f/+tFQYO4rb/PnCbRweh87/88mOKRlpu+7/8200Fkif3//+t1YZPIzc/frEbh0ficz/9MqPKhlqvu7/9G8zGEmh3v7/ul0bPZDd/vrFcB0gjdH/9c2PKxptvO//83E0GUyj4P//vF0cPpHh/fzIcR8gjdH/9dGNLBtuvfD/9HM1GU2l4v/+vmAaQJPi/f3Jc"');
  }, []);

  // Update tab title
  useEffect(() => {
    const originalTitle = document.title;
    if (isRunning) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      document.title = `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}] AI Study Coach`;
    } else {
      document.title = originalTitle;
    }

    return () => {
      document.title = originalTitle;
    };
  }, [timeLeft, isRunning]);

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    // Play notification sound
    audioRef.current?.play().catch(err => console.error('Audio play failed:', err));
    
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Time\'s up!', {
        body: isBreak ? 'Break time over. Ready to focus again?' : 'Take a short break!',
        icon: '/favicon.ico',
      });
    }

    // Track focused study time if it was a work session
    if (!isBreak && sessionStartTime && user?.id) {
      const focusedMinutes = Math.floor((Date.now() - sessionStartTime.getTime()) / 60000);
      await trackFocusedTime(focusedMinutes);
    }

    // Suggest break or next session
    if (!isBreak) {
      setIsBreak(true);
      setDuration(BREAK_DURATION);
      setTimeLeft(BREAK_DURATION * 60);
    } else {
      setIsBreak(false);
      setDuration(DEFAULT_DURATION);
      setTimeLeft(DEFAULT_DURATION * 60);
    }
  };

  const trackFocusedTime = async (minutes: number) => {
    if (!user?.id || minutes <= 0) return;

    try {
      await trackDailyActivity('study', minutes, user.id);
    } catch (error) {
      console.error('Error tracking focused time:', error);
    }
  };

  const handleStart = () => {
    if (!isRunning) {
      setSessionStartTime(new Date());
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
    setIsRunning(true);
  };

  const handlePause = async () => {
    setIsRunning(false);
    
    // Track time spent so far
    if (!isBreak && sessionStartTime && user?.id) {
      const focusedMinutes = Math.floor((Date.now() - sessionStartTime.getTime()) / 60000);
      if (focusedMinutes > 0) {
        await trackFocusedTime(focusedMinutes);
      }
    }
    setSessionStartTime(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setSessionStartTime(null);
    setIsBreak(false);
  };

  const handleDurationChange = (minutes: number) => {
    setDuration(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
    setSessionStartTime(null);
    setIsBreak(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
      isBreak ? "bg-green-500/10 border-green-500/50" : "bg-primary/5 border-primary/20"
    )}>
      <Clock className={cn(
        "h-4 w-4",
        isBreak ? "text-green-500" : "text-primary"
      )} />
      
      <div className="font-mono text-lg font-semibold min-w-[80px] text-center">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>

      <div className="flex items-center gap-1">
        {!isRunning ? (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleStart}
          >
            <Play className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handlePause}
          >
            <Pause className="h-4 w-4" />
          </Button>
        )}

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover z-50">
            {DURATIONS.map(({ label, minutes: mins }) => (
              <DropdownMenuItem
                key={mins}
                onClick={() => handleDurationChange(mins)}
                className={cn(
                  mins === duration && "bg-accent"
                )}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isBreak && (
        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
          Break
        </span>
      )}
    </div>
  );
}
