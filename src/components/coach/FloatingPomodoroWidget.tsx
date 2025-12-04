import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PomodoroTimer } from '@/components/coach/PomodoroTimer';
import { Timer, X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingPomodoroWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <Button
        size="icon"
        className="fixed bottom-20 right-4 z-50 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsVisible(true)}
      >
        <Timer className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-20 right-4 z-50 bg-background border rounded-lg shadow-xl transition-all duration-300",
        isExpanded ? "w-80 p-4" : "w-auto"
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Pomodoro</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-2">
          <PomodoroTimer />
        </div>
      )}
    </div>
  );
}
