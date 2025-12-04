import React, { useState } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OrgStudent } from '@/hooks/useOrgStudents';

interface GenerateActivationLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: OrgStudent | null;
  orgSlug: string;
}

export function GenerateActivationLinkDialog({
  open,
  onOpenChange,
  student,
  orgSlug,
}: GenerateActivationLinkDialogProps) {
  const [activationUrl, setActivationUrl] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateActivationLink = async () => {
    if (!student) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-student-activation', {
        body: {
          student_id: student.id,
          org_slug: orgSlug,
        },
      });

      if (error) throw error;

      setActivationUrl(data.activation_url);
      setExpiresAt(data.expires_at);

      toast.success('Activation link generated successfully');
    } catch (error: any) {
      console.error('Error generating activation link:', error);
      toast.error(error.message || 'Failed to generate activation link');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!activationUrl) return;

    try {
      await navigator.clipboard.writeText(activationUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  const openInNewTab = () => {
    if (activationUrl) {
      window.open(activationUrl, '_blank');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setActivationUrl('');
      setExpiresAt('');
      setCopied(false);
    }
    onOpenChange(newOpen);
  };

  React.useEffect(() => {
    if (open && student && !activationUrl) {
      generateActivationLink();
    }
  }, [open, student]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Student Activation Link</DialogTitle>
          <DialogDescription>
            Generate a one-time activation link for {student?.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activationUrl ? (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This link expires in 48 hours and can only be used once. The student will set their
                  own 6-digit PIN during activation.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Activation Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={activationUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={openInNewTab}
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expiresAt && (
                <div className="text-sm text-muted-foreground">
                  Expires: {new Date(expiresAt).toLocaleString()}
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Instructions for Student:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Click the activation link</li>
                  <li>Confirm your name matches the account</li>
                  <li>Create a secure 6-digit PIN</li>
                  <li>Use your name and PIN to login in the future</li>
                </ol>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleOpenChange(false)}>
                  Close
                </Button>
                <Button onClick={generateActivationLink} disabled={isGenerating}>
                  Generate New Link
                </Button>
              </div>
            </>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to generate activation link. Please try again.</AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
