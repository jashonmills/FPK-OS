import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Download, Trash2, FileText, Shield } from "lucide-react";

export function DataManagement() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleExportData = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      // Fetch all user data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);

      const { data: notes } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id);

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id);

      const { data: progress } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id);

      const { data: activities } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', user.id);

      // Compile all data
      const userData = {
        export_date: new Date().toISOString(),
        user_id: user.id,
        email: user.email,
        profile,
        goals,
        flashcards: notes,
        enrollments,
        lesson_progress: progress,
        daily_activities: activities
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported successfully",
        description: "Your data has been downloaded as a JSON file.",
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
      // Delete all user data in correct order (respecting foreign keys)
      await supabase.from('daily_activities').delete().eq('user_id', user.id);
      await supabase.from('lesson_progress').delete().eq('user_id', user.id);
      await supabase.from('enrollments').delete().eq('user_id', user.id);
      await supabase.from('flashcards').delete().eq('user_id', user.id);
      await supabase.from('goals').delete().eq('user_id', user.id);
      await supabase.from('achievements').delete().eq('user_id', user.id);
      await supabase.from('analytics_metrics').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);

      // Sign out user
      await signOut();

      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been permanently deleted.",
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
        <h2 className="text-2xl font-bold mb-2">Data Management</h2>
        <p className="text-muted-foreground">
          Manage your personal data and exercise your rights under GDPR.
        </p>
      </div>

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
              <CardTitle>Data Access Request</CardTitle>
            </div>
            <CardDescription>
              Request detailed information about how we process your data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>
                  You can request a detailed report of how we collect, use, and share your personal data. 
                  We'll respond within 30 days.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('mailto:privacy@company.com?subject=Data Access Request')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Request Data Report
              </Button>
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