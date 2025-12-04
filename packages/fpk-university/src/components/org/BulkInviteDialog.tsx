import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, AlertCircle, CheckCircle, XCircle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface BulkInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

interface InviteRow {
  email: string;
  full_name: string;
  role: string;
  status?: 'pending' | 'success' | 'error';
  error?: string;
}

const VALID_ROLES = ['student', 'instructor', 'instructor_aide', 'admin', 'viewer'];
const ROLE_DESCRIPTIONS = {
  student: 'Access assigned courses',
  instructor: 'Create/assign courses, view analytics',
  instructor_aide: 'Assist instructors',
  admin: 'Full organization management',
  viewer: 'Read-only access'
};

export function BulkInviteDialog({ open, onOpenChange, organizationId }: BulkInviteDialogProps) {
  const { toast } = useToast();
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateRow = (row: InviteRow, index: number): string | null => {
    if (!row.email || !validateEmail(row.email)) {
      return `Row ${index + 1}: Invalid email address`;
    }
    if (!row.full_name || row.full_name.trim().length < 2) {
      return `Row ${index + 1}: Full name is required (minimum 2 characters)`;
    }
    if (!row.role || !VALID_ROLES.includes(row.role.toLowerCase())) {
      return `Row ${index + 1}: Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`;
    }
    return null;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        const errors: string[] = [];
        
        const parsedInvites: InviteRow[] = data.map((row, index) => {
          const invite: InviteRow = {
            email: (row.email || row.Email || '').trim().toLowerCase(),
            full_name: (row.full_name || row.name || row.Name || row['Full Name'] || '').trim(),
            role: (row.role || row.Role || 'student').trim().toLowerCase(),
            status: 'pending'
          };

          const error = validateRow(invite, index);
          if (error) {
            errors.push(error);
          }

          return invite;
        });

        if (parsedInvites.length === 0) {
          toast({
            title: 'No Data Found',
            description: 'The CSV file appears to be empty',
            variant: 'destructive',
          });
          return;
        }

        if (errors.length > 0) {
          setValidationErrors(errors);
        } else {
          setValidationErrors([]);
          toast({
            title: 'File Loaded',
            description: `${parsedInvites.length} invitations ready to send`,
          });
        }

        setInvites(parsedInvites);
      },
      error: (error) => {
        toast({
          title: 'Parse Error',
          description: `Failed to parse CSV: ${error.message}`,
          variant: 'destructive',
        });
      },
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const downloadTemplate = () => {
    const template = 'email,full_name,role\njohn.doe@example.com,John Doe,student\njane.smith@example.com,Jane Smith,instructor\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_invite_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const processBulkInvites = async () => {
    if (invites.length === 0 || validationErrors.length > 0) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('bulk-invite', {
        body: {
          org_id: organizationId,
          invites: invites.map(inv => ({
            email: inv.email,
            full_name: inv.full_name,
            role: inv.role
          }))
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to process invitations');
      }

      const results = response.data?.results || [];
      
      // Update invite statuses
      const updatedInvites = invites.map((invite, index) => {
        const result = results[index];
        return {
          ...invite,
          status: result?.success ? 'success' : 'error',
          error: result?.error
        } as InviteRow;
      });

      setInvites(updatedInvites);

      const successCount = results.filter((r: any) => r.success).length;
      const failCount = results.length - successCount;

      toast({
        title: 'Bulk Invite Complete',
        description: `${successCount} invitation${successCount !== 1 ? 's' : ''} sent successfully${failCount > 0 ? `, ${failCount} failed` : ''}`,
      });

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const handleClose = () => {
    setInvites([]);
    setValidationErrors([]);
    setProgress(0);
    onOpenChange(false);
  };

  const successCount = invites.filter(inv => inv.status === 'success').length;
  const errorCount = invites.filter(inv => inv.status === 'error').length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Invite Members
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to invite multiple members at once
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Upload Area */}
          {invites.length === 0 && (
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-colors duration-200
                  ${isDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                  }
                `}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? 'Drop CSV file here' : 'Drag & drop CSV file here'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <p className="text-xs text-muted-foreground">
                  CSV should include: email, full_name, role
                </p>
              </div>

              <div className="flex items-center justify-center">
                <Button variant="outline" onClick={downloadTemplate} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download CSV Template
                </Button>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Accepted Roles</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    {VALID_ROLES.map(role => (
                      <div key={role} className="text-xs">
                        <span className="font-medium">{role}</span>: {ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS]}
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Preview & Results */}
          {invites.length > 0 && (
            <div className="flex-1 overflow-hidden flex flex-col gap-4">
              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Validation Errors</AlertTitle>
                  <AlertDescription>
                    <ScrollArea className="h-24 mt-2">
                      {validationErrors.map((error, idx) => (
                        <div key={idx} className="text-xs py-1">{error}</div>
                      ))}
                    </ScrollArea>
                  </AlertDescription>
                </Alert>
              )}

              {/* Status Summary */}
              {(successCount > 0 || errorCount > 0) && (
                <div className="flex gap-4 items-center justify-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">{successCount} Successful</span>
                  </div>
                  {errorCount > 0 && (
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-destructive" />
                      <span className="font-medium">{errorCount} Failed</span>
                    </div>
                  )}
                </div>
              )}

              {/* Invites List */}
              <ScrollArea className="flex-1 rounded-lg border">
                <div className="p-4 space-y-2">
                  {invites.map((invite, idx) => (
                    <div
                      key={idx}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border
                        ${invite.status === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900' : ''}
                        ${invite.status === 'error' ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900' : ''}
                        ${invite.status === 'pending' ? 'bg-background' : ''}
                      `}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{invite.full_name}</p>
                          <Badge variant="outline" className="text-xs">
                            {invite.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{invite.email}</p>
                        {invite.error && (
                          <p className="text-xs text-destructive mt-1">{invite.error}</p>
                        )}
                      </div>
                      {invite.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                      {invite.status === 'error' && (
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Progress */}
              {isProcessing && progress < 100 && (
                <Progress value={progress} className="w-full" />
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <div>
            {invites.length > 0 && !isProcessing && (
              <Button variant="outline" onClick={() => setInvites([])}>
                Clear & Upload New File
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              {invites.some(inv => inv.status === 'success' || inv.status === 'error') ? 'Close' : 'Cancel'}
            </Button>
            {invites.length > 0 && validationErrors.length === 0 && !invites.some(inv => inv.status) && (
              <Button
                onClick={processBulkInvites}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Send ${invites.length} Invitation${invites.length !== 1 ? 's' : ''}`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
