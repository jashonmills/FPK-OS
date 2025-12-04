import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Clock, Mail, RefreshCw } from 'lucide-react';

interface ConsentPendingNoticeProps {
  parentEmail: string;
  onResend: () => Promise<void>;
  isResending: boolean;
}

export const ConsentPendingNotice: React.FC<ConsentPendingNoticeProps> = ({
  parentEmail,
  onResend,
  isResending
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-amber-100">
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold">Waiting for Parent Approval</h2>
        <p className="text-sm text-muted-foreground">
          Your account is almost ready! We're waiting for your parent or guardian to approve.
        </p>
      </div>

      <Alert className="border-amber-200 bg-amber-50">
        <Mail className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Consent request sent to:</strong>
          <br />
          <span className="font-mono text-sm">{parentEmail}</span>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="p-4 rounded-lg border bg-muted/30">
          <h3 className="font-medium mb-2">What can you do now?</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Ask your parent to check their email (including spam folder)</li>
            <li>• They have 7 days to respond</li>
            <li>• Once approved, you'll get full access</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn't receive the email?
          </p>
          <Button
            variant="outline"
            onClick={onResend}
            disabled={isResending}
            className="gap-2"
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Resend Consent Request
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
