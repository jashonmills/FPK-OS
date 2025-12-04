import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useAIGovernanceApprovals } from '@/hooks/useAIGovernanceApprovals';
import { useAuth } from '@/hooks/useAuth';

interface NewAIRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId?: string;
}

const CATEGORIES = [
  { value: 'Academic', label: 'Academic' },
  { value: 'Technical', label: 'Technical' },
  { value: 'Creative', label: 'Creative' },
  { value: 'Research', label: 'Research' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const NewAIRequestDialog: React.FC<NewAIRequestDialogProps> = ({
  open,
  onOpenChange,
  orgId,
}) => {
  const { user } = useAuth();
  const { createRequest } = useAIGovernanceApprovals(orgId);
  
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('Academic');
  const [priority, setPriority] = useState('medium');
  const [details, setDetails] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !task.trim()) return;

    createRequest.mutate({
      user_id: user.id,
      task: task.trim(),
      category,
      priority,
      details: details.trim() || undefined,
      org_id: orgId || null,
    }, {
      onSuccess: () => {
        setTask('');
        setCategory('Academic');
        setPriority('medium');
        setDetails('');
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New AI Request</DialogTitle>
          <DialogDescription>
            Submit a request for AI assistance. Your teacher will review and approve it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task">What do you need help with?</Label>
            <Input
              id="task"
              placeholder="e.g., Help with calculus homework"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Additional Details (optional)</Label>
            <Textarea
              id="details"
              placeholder="Provide more context about what you need..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createRequest.isPending || !task.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {createRequest.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
