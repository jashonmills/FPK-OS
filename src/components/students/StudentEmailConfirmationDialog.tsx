import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StudentEmailConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
  parentEmail?: string;
  orgId: string;
}

export function StudentEmailConfirmationDialog({
  open,
  onOpenChange,
  studentId,
  studentName,
  parentEmail,
  orgId,
}: StudentEmailConfirmationDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = async () => {
    if (!parentEmail) {
      toast({
        title: 'No Email Address',
        description: 'This student does not have a parent email address on file.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-student-invite-email', {
        body: {
          studentId,
          orgId,
          recipientEmail: parentEmail,
        },
      });

      if (error) throw error;

      toast({
        title: 'Invitation Sent!',
        description: `Email sent to ${parentEmail}`,
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error('Error sending student invitation email:', error);
      toast({
        title: 'Failed to send email',
        description: error.message || 'There was an error sending the invitation email.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Student Added Successfully!
          </DialogTitle>
          <DialogDescription>
            {studentName} has been added to your roster.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Would you like to automatically send an activation email invitation?
              {parentEmail && (
                <div className="mt-2 text-sm">
                  <strong>Recipient:</strong> {parentEmail}
                </div>
              )}
              {!parentEmail && (
                <div className="mt-2 text-sm text-muted-foreground">
                  No parent email address is on file for this student.
                </div>
              )}
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Not Now
            </Button>
            <Button
              className="flex-1"
              onClick={handleSendEmail}
              disabled={!parentEmail || isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invitation Email
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
