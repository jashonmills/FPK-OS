import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { useOrganizationActions } from '@/hooks/useOrganizationActions';
import type { Organization } from '@/types/organization';

interface DeleteOrganizationDialogProps {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteOrganizationDialog({ organization, open, onOpenChange }: DeleteOrganizationDialogProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const { deleteOrganization } = useOrganizationActions();

  const isConfirmed = confirmationText === organization.name;

  const handleDelete = async () => {
    if (!isConfirmed) return;
    
    try {
      await deleteOrganization.mutateAsync(organization.id);
      onOpenChange(false);
      setConfirmationText('');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setConfirmationText('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Organization
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            This action will permanently delete the organization and all associated data. 
            This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <h4 className="font-medium text-destructive mb-2">What will be deleted:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Organization profile and settings</li>
              <li>• All member accounts and data</li>
              <li>• Course assignments and progress</li>
              <li>• Notes and goals</li>
              <li>• Usage analytics and logs</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-foreground">
              Type <span className="font-mono font-semibold">{organization.name}</span> to confirm deletion:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Enter "${organization.name}" to confirm`}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="border-border text-muted-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              disabled={!isConfirmed || deleteOrganization.isPending}
              variant="destructive"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteOrganization.isPending ? 'Deleting...' : 'Delete Organization'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}