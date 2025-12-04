import { useState } from 'react';
import { Sparkles, MessageSquare, CheckSquare, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AISummaryCard } from './AISummaryCard';
import { AISubTasksDialog } from './AISubTasksDialog';
import { AIBlockersCard } from './AIBlockersCard';

interface AIAssistButtonProps {
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  onSubTasksAdded?: () => void;
}

export const AIAssistButton = ({ 
  taskId, 
  taskTitle, 
  taskDescription,
  onSubTasksAdded 
}: AIAssistButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [blockers, setBlockers] = useState<string | null>(null);
  const [showSubTasksDialog, setShowSubTasksDialog] = useState(false);
  const { toast } = useToast();

  const callAIAssist = async (action: string) => {
    setIsLoading(true);
    setSummary(null);
    setBlockers(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-task-assist', {
        body: { 
          action, 
          taskId,
          title: taskTitle,
          description: taskDescription
        }
      });

      if (error) throw error;

      if (action === 'summarize') {
        setSummary(data.summary);
      } else if (action === 'suggest-subtasks') {
        setSuggestions(data.suggestions || []);
        setShowSubTasksDialog(true);
      } else if (action === 'identify-blockers') {
        setBlockers(data.blockers);
      }
    } catch (error: any) {
      console.error('AI Assist error:', error);
      toast({
        title: "AI Assist Error",
        description: error.message || "Failed to process AI request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isLoading ? 'Processing...' : 'AI Assist'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem 
              onClick={() => callAIAssist('summarize')}
              disabled={isLoading}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Summarize Comments
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => callAIAssist('suggest-subtasks')}
              disabled={isLoading}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Suggest Sub-Tasks
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => callAIAssist('identify-blockers')}
              disabled={isLoading}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Identify Blockers
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {summary && <AISummaryCard summary={summary} onClose={() => setSummary(null)} />}
        {blockers && <AIBlockersCard blockers={blockers} onClose={() => setBlockers(null)} />}
      </div>

      <AISubTasksDialog
        open={showSubTasksDialog}
        onOpenChange={setShowSubTasksDialog}
        suggestions={suggestions}
        taskId={taskId}
        onSubTasksAdded={onSubTasksAdded}
      />
    </>
  );
};
