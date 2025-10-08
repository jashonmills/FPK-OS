import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Loader2 } from 'lucide-react';

interface ManualStaffAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  onSuccess?: () => void;
}

export function ManualStaffAddDialog({
  open,
  onOpenChange,
  organizationId,
  onSuccess,
}: ManualStaffAddDialogProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'instructor' | 'instructor-aide' | 'viewer'>('instructor');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call edge function to manually add staff member
      const { data, error } = await supabase.functions.invoke('add-staff-member', {
        body: {
          orgId: organizationId,
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role,
        },
      });

      if (error) {
        console.error('Function invocation error:', error);
        throw error;
      }

      if (!data?.success) {
        const errorMessage = data?.code === 'ALREADY_MEMBER' 
          ? 'This user is already a member of the organization'
          : data?.error || 'Failed to add staff member';
        throw new Error(errorMessage);
      }

      toast({
        title: 'Staff member added',
        description: `${firstName} ${lastName} has been added as ${role === 'instructor-aide' ? 'an Instructor Aide' : `a${role === 'instructor' ? 'n Instructor' : ' Viewer'}`}.`,
      });

      // Track analytics
      await supabase.from('activity_log').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        org_id: organizationId,
        event: 'staff_added_manually',
        metadata: {
          role,
          email: email.trim(),
          method: 'manual',
        },
      });

      // Reset form
      setEmail('');
      setFirstName('');
      setLastName('');
      setRole('instructor');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error adding staff member:', error);
      toast({
        title: 'Failed to add staff member',
        description: error.message || 'There was an error adding the staff member.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setFirstName('');
      setLastName('');
      setRole('instructor');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Staff Member Manually
          </DialogTitle>
          <DialogDescription>
            Directly add a staff member to your organization. They will receive a welcome email with access instructions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as 'instructor' | 'instructor-aide' | 'viewer')}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instructor">Instructor</SelectItem>
                <SelectItem value="instructor-aide">Instructor Aide</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {role === 'instructor' && 'Can create/assign courses and view analytics for their students'}
              {role === 'instructor-aide' && 'Can assist instructors but cannot modify organization settings'}
              {role === 'viewer' && 'Read-only access to analytics and rosters'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Staff Member
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
