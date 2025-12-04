import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, MessageSquare, Info } from 'lucide-react';

interface EditGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
  groupDescription?: string;
  messagingEnabled?: boolean;
  onUpdate: (data: { id: string; name: string; description?: string; messaging_enabled?: boolean }) => void;
  isUpdating: boolean;
}

export function EditGroupDialog({
  open,
  onOpenChange,
  groupId,
  groupName,
  groupDescription,
  messagingEnabled = false,
  onUpdate,
  isUpdating,
}: EditGroupDialogProps) {
  const [name, setName] = useState(groupName);
  const [description, setDescription] = useState(groupDescription || '');
  const [messaging, setMessaging] = useState(messagingEnabled);

  // Update form when props change
  useEffect(() => {
    setName(groupName);
    setDescription(groupDescription || '');
    setMessaging(messagingEnabled);
  }, [groupName, groupDescription, messagingEnabled, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onUpdate({
        id: groupId,
        name: name.trim(),
        description: description.trim() || undefined,
        messaging_enabled: messaging,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>
              Update the group name, description, and messaging settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
                required
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter group description (optional)"
                rows={3}
              />
            </div>

            {/* Student Messaging Toggle */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="messaging" className="font-medium">
                    Student-to-Student Messaging
                  </Label>
                </div>
                <Switch
                  id="messaging"
                  checked={messaging}
                  onCheckedChange={setMessaging}
                />
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  When enabled, students in this group can send direct messages to each other.
                  When disabled, students can only message educators (instructors, admins, owners).
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating || !name.trim()}>
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Group'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
