import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateTaskDialog } from '@/components/kanban/CreateTaskDialog';
import { cn } from '@/lib/utils';

interface CreateTaskButtonProps {
  projectId: string;
  variant?: 'fab' | 'button';
  projectColor?: string;
}

export const CreateTaskButton = ({ projectId, variant = 'button', projectColor }: CreateTaskButtonProps) => {
  const [open, setOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    // Show pulse animation on first load (only for FAB)
    if (variant === 'fab') {
      const hasSeenPulse = localStorage.getItem('fpk-pulse-create-task-seen');
      if (!hasSeenPulse) {
        setShowPulse(true);
        setTimeout(() => {
          setShowPulse(false);
          localStorage.setItem('fpk-pulse-create-task-seen', 'true');
        }, 3000);
      }
    }
  }, [variant]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (variant === 'fab') {
    return (
      <>
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className={cn(
            'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50',
            showPulse && 'animate-pulse'
          )}
          style={projectColor ? { backgroundColor: projectColor } : undefined}
          title="Create Task (⌘K / Ctrl+K)"
        >
          <Plus className="h-6 w-6" />
        </Button>
        <CreateTaskDialog open={open} onOpenChange={setOpen} projectId={projectId} />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="default"
        className="gap-2"
        title="Create Task (⌘K / Ctrl+K)"
      >
        <Plus className="h-4 w-4" />
        <span>New Task</span>
      </Button>
      <CreateTaskDialog open={open} onOpenChange={setOpen} projectId={projectId} />
    </>
  );
};
