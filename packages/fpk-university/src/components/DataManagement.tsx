import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAuditLog } from "@/hooks/useAuditLog";
import { supabase } from "@/integrations/supabase/client";
import { Download, Trash2, FileText, Shield, Clock, AlertTriangle } from "lucide-react";
import { logger } from '@/utils/logger';
import { DataRetentionNotice } from "@/components/compliance/DataRetentionNotice";

const SUPABASE_URL = "https://zgcegkmqfgznbpdplscz.supabase.co";

export function DataManagement() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [exportError, setExportError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { logDataExport, logDataAccess, logDataDeletion } = useAuditLog();
  const navigate = useNavigate();
  
  const isDeleteConfirmValid = deleteConfirmText === "DELETE";

  const handleExportData = async () => {
    if (!user) return;
    
    setIsExporting(true);
    setExportError(null);
    
    try {
      // Get current user's JWT token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      // Call the deployed Edge Function
      const response = await fetch(`${SUPABASE_URL}/functions/v1/export-user-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to export data');
      }

      // Download the JSON file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `fpk-university-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Log data access for audit purposes (client-side tracking)
      await logDataAccess('user_data_export', user.id, 'GDPR Article 20 - Data Portability Request');
      
      toast({
        title: "Data exported successfully",
        description: "Your complete data export has been downloaded. This includes all your personal information, learning progress, and activity history.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error('Export error', 'DATA_EXPORT', error);
      setExportError(errorMessage);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      // Get current user's JWT token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      // Log the account deletion request for audit purposes (client-side tracking)
      await logDataDeletion('user_account', user.id, 'GDPR Article 17 - Right to Erasure - User requested account deletion');

      // Call the deployed Edge Function
      const response = await fetch(`${SUPABASE_URL}/functions/v1/delete-user-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete data');
      }

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Account deleted successfully",
          description: "Your account and all personal data have been permanently deleted. You will be redirected to the homepage.",
        });
        
        // Sign out and redirect after 3 seconds
        setTimeout(async () => {
          await signOut();
          window.location.href = '/';
        }, 3000);
      } else {
        throw new Error(result.error || 'Deletion failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error('Delete error', 'DATA_DELETE', error);
      setDeleteError(errorMessage);
      toast({
        title: "Deletion failed",
        description: "There was an error deleting your account. Please contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmText(""); // Reset confirmation text
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Data Management & Privacy Rights</h2>
        <p className="text-muted-foreground">
          Exercise your rights under GDPR and manage your personal data with full transparency and control.
        </p>
      </div>

      {/* Data Retention Information */}
      <DataRetentionNotice />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              <CardTitle>Export Your Data</CardTitle>
            </div>
            <CardDescription>
              Download a complete copy of all your personal data in JSON format.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Your export will include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Profile information and settings</li>
                  <li>Learning goals and progress</li>
                  <li>Flashcards and notes</li>
                  <li>Course enrollments and completions</li>
                  <li>Activity history and analytics</li>
                </ul>
              </div>
              <Button 
                onClick={handleExportData} 
                disabled={isExporting}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Preparing Export..." : "Export My Data"}
              </Button>
              {exportError && (
                <p className="text-xs text-destructive bg-destructive/10 p-2 rounded mt-2">
                  Error: {exportError}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Data Subject Rights</CardTitle>
            </div>
            <CardDescription>
              Exercise your rights under GDPR Articles 15-22
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Submit formal requests for:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Access to your personal data (Article 15)</li>
                  <li>Rectification of inaccurate data (Article 16)</li>
                  <li>Erasure of your data (Article 17)</li>
                  <li>Data portability (Article 20)</li>
                  <li>Restriction of processing (Article 18)</li>
                  <li>Objection to processing (Article 21)</li>
                </ul>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/dashboard/learner/privacy/requests')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Submit Data Subject Request
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>We respond within 30 days as required by GDPR</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Delete Account</CardTitle>
          </div>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">This will permanently delete:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your account and profile information</li>
                <li>All learning progress and achievements</li>
                <li>Personal notes and flashcards</li>
                <li>Course enrollments and history</li>
                <li>Analytics and activity data</li>
              </ul>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete My Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-4">
                    <p>
                      This action <strong>cannot be undone</strong>. This will permanently delete your account
                      and remove all your data from our servers, including:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>All course progress and completions</li>
                      <li>IEP documents and therapy notes</li>
                      <li>Personal profile information</li>
                      <li>Learning analytics and achievements</li>
                      <li>All flashcards and study materials</li>
                    </ul>
                    <p className="text-xs text-muted-foreground">
                      Note: Audit logs will be retained for 7 years for legal compliance (GDPR Article 17(3)(b)).
                    </p>
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="delete-confirm" className="text-sm font-semibold text-destructive">
                        To confirm deletion, type <span className="font-mono bg-destructive/10 px-1 rounded">DELETE</span> below:
                      </Label>
                      <Input
                        id="delete-confirm"
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="font-mono"
                      />
                    </div>
                    {deleteError && (
                      <p className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                        Error: {deleteError}
                      </p>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel 
                    onClick={() => {
                      setDeleteConfirmText("");
                      setDeleteError(null);
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    disabled={!isDeleteConfirmValid || isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Confirm Deletion"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}