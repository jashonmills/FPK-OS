import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useOrgGroups } from '@/hooks/useOrgGroups';
import { Users, MessageSquare, Info } from 'lucide-react';

interface CreateGroupDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function CreateGroupDialog({ open, onOpenChange, trigger }: CreateGroupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [messagingEnabled, setMessagingEnabled] = useState(false);
  
  const { createGroup, isCreating } = useOrgGroups();

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
    
    // Reset form when closing
    if (!newOpen) {
      setName('');
      setMessagingEnabled(false);
    }
  };

  const isDialogOpen = open !== undefined ? open : isOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    try {
      await createGroup({
        name: name.trim(),
      });
      
      // Reset form
      setName('');
      setMessagingEnabled(false);
      handleOpenChange(false);
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Create New Group
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>

          {/* Student Messaging Toggle */}
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="messaging" className="font-medium">
                  Enable Student Messaging
                </Label>
              </div>
              <Switch
                id="messaging"
                checked={messagingEnabled}
                onCheckedChange={setMessagingEnabled}
              />
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                Allow students in this group to message each other directly. 
                This can be changed later in group settings.
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating || !name.trim()}
            >
              {isCreating ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
