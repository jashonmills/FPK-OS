import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAuditLog } from "@/hooks/useAuditLog";
import { supabase } from "@/integrations/supabase/client";
import { Download, Trash2, FileText, Shield, Clock, AlertTriangle } from "lucide-react";
import { DataRetentionNotice } from "@/components/compliance/DataRetentionNotice";

export function DataManagement() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { logDataExport, logDataAccess, logDataDeletion } = useAuditLog();
  const navigate = useNavigate();

  const handleExportData = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      // Log data access for audit purposes
      await logDataAccess('user_data_export', user.id, 'GDPR Article 20 - Data Portability Request');

      // Fetch all user data comprehensively
      const [
        { data: profile },
        { data: goals },
        { data: flashcards },
        { data: enrollments },
        { data: progress },
        { data: activities },
        { data: chatSessions },
        { data: consentRecords },
        { data: auditLogs }
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('goals').select('*').eq('user_id', user.id),
        supabase.from('flashcards').select('*').eq('user_id', user.id),
        supabase.from('enrollments').select('*').eq('user_id', user.id),
        supabase.from('lesson_progress').select('*').eq('user_id', user.id),
        supabase.from('daily_activities').select('*').eq('user_id', user.id),
        supabase.from('chat_sessions').select('*').eq('user_id', user.id),
        supabase.from('user_consent').select('*').eq('user_id', user.id),
        supabase.from('audit_log').select('*').eq('user_id', user.id).limit(100)
      ]);

      // Compile comprehensive export data
      const exportData = {
        metadata: {
          export_date: new Date().toISOString(),
          export_type: 'GDPR_Data_Export',
          user_id: user.id,
          email: user.email,
          legal_basis: 'GDPR Article 20 - Right to Data Portability',
          data_controller: 'Learning Platform',
          retention_notice: 'This export contains all personal data we have collected about you.'
        },
        personal_data: {
          profile,
          goals: goals || [],
          flashcards: flashcards || [],
          enrollments: enrollments || [],
          lesson_progress: progress || [],
          daily_activities: activities || [],
          chat_sessions: chatSessions || [],
          consent_records: consentRecords || [],
          recent_audit_log: auditLogs || []
        },
        data_summary: {
          total_records: [
            goals?.length || 0,
            flashcards?.length || 0,
            enrollments?.length || 0,
            progress?.length || 0,
            activities?.length || 0,
            chatSessions?.length || 0
          ].reduce((a, b) => a + b, 0),
          export_format: 'JSON',
          data_categories: ['identification_data', 'contact_data', 'usage_data', 'performance_data']
        }
      };

      // Log the export for audit trail
      const totalRecords = exportData.data_summary.total_records;
      await logDataExport(exportData.data_summary.data_categories, totalRecords);

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gdpr-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported successfully",
        description: `${totalRecords} records exported. Download includes all your personal data.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // Log the account deletion request for audit purposes
      await logDataDeletion('user_account', user.id, 'GDPR Article 17 - Right to Erasure - User requested account deletion');

      // Delete all user data in correct order (respecting foreign keys)
      const deletionTasks = [
        supabase.from('daily_activities').delete().eq('user_id', user.id),
        supabase.from('lesson_progress').delete().eq('user_id', user.id),
        supabase.from('enrollments').delete().eq('user_id', user.id),
        supabase.from('flashcards').delete().eq('user_id', user.id),
        supabase.from('goals').delete().eq('user_id', user.id),
        supabase.from('achievements').delete().eq('user_id', user.id),
        supabase.from('analytics_metrics').delete().eq('user_id', user.id),
        supabase.from('chat_sessions').delete().eq('user_id', user.id),
        supabase.from('user_consent').delete().eq('user_id', user.id),
        // Note: audit_log entries are retained for legal compliance
        // and profiles table is deleted last
      ];

      await Promise.all(deletionTasks);
      
      // Delete profile last
      await supabase.from('profiles').delete().eq('id', user.id);

      // Sign out user
      await signOut();

      toast({
        title: "Account deleted",
        description: "Your account and all personal data have been permanently deleted. Audit logs are retained for legal compliance.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Deletion failed",
        description: "There was an error deleting your account. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
                {isExporting ? "Exporting..." : "Export My Data"}
              </Button>
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
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers. You will not be able to recover
                    your learning progress, notes, or any other information.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Yes, delete my account"}
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