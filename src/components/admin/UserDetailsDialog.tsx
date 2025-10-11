import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Ban, 
  UserX, 
  Key, 
  Mail, 
  Calendar, 
  Clock, 
  Building2, 
  BookOpen, 
  Target,
  AlertTriangle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
    createdAt: string;
    lastActiveAt: string | null;
    weeklySeconds: number;
    enrollmentCount: number;
    avgProgressPercent: number;
    goalsActive: number;
    goalsCompleted: number;
  };
  onUserUpdated?: () => void;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  open,
  onOpenChange,
  user,
  onUserUpdated
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);

  React.useEffect(() => {
    if (open && user.id) {
      loadUserOrganizations();
    }
  }, [open, user.id]);

  const loadUserOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('org_members')
        .select(`
          role,
          status,
          joined_at,
          organizations (
            id,
            name,
            slug
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  const handleSendPasswordReset = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      toast({
        title: "Password reset sent",
        description: `Password reset email sent to ${user.email}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!confirm(`Are you sure you want to ban ${user.name}? This will prevent them from logging in.`)) {
      return;
    }

    setIsLoading(true);
    try {
      // Note: Actual ban implementation would require a Supabase edge function
      // For now, we'll show a placeholder message
      toast({
        title: "Feature Coming Soon",
        description: "User ban functionality requires Supabase edge function implementation",
      });
      
      // TODO: Call edge function to ban user
      // const { error } = await supabase.functions.invoke('ban-user', {
      //   body: { userId: user.id }
      // });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to ban user",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImpersonateUser = async () => {
    toast({
      title: "Feature Coming Soon",
      description: "User impersonation requires additional security implementation",
    });
    
    // TODO: Implement secure impersonation with proper audit logging
  };

  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            User Details
            <Badge variant="outline">{user.roles[0] || 'User'}</Badge>
          </DialogTitle>
          <DialogDescription>
            Complete profile and activity information for {user.name}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Activity Information */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Activity
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {format(new Date(user.createdAt), 'PPP')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Active</p>
                  <p className="font-medium">
                    {user.lastActiveAt 
                      ? format(new Date(user.lastActiveAt), 'PPP')
                      : 'Never'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Weekly Time</p>
                  <p className="font-medium">{formatTimeSpent(user.weeklySeconds)}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Learning Progress */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learning Progress
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Enrollments</p>
                  <p className="font-medium text-lg">{user.enrollmentCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg Progress</p>
                  <p className="font-medium text-lg">{user.avgProgressPercent}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Active Goals</p>
                  <p className="font-medium text-lg">{user.goalsActive}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Completed Goals</p>
                  <p className="font-medium text-lg flex items-center gap-1">
                    {user.goalsCompleted}
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Organizations */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Organizations ({organizations.length})
              </h3>
              {organizations.length > 0 ? (
                <div className="space-y-2">
                  {organizations.map((org, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{org.organizations?.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground capitalize">{org.role}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(`/org/${org.organizations?.id}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not a member of any organizations</p>
              )}
            </div>

            <Separator />

            {/* Administrative Actions */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                Administrative Actions
              </h3>
              <Alert>
                <AlertDescription className="text-sm">
                  These actions affect the user's account. Use with caution and ensure proper authorization.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  onClick={handleSendPasswordReset}
                  disabled={isLoading}
                  className="justify-start"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Send Password Reset Email
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleImpersonateUser}
                  disabled={isLoading}
                  className="justify-start"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Impersonate User (Coming Soon)
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={handleBanUser}
                  disabled={isLoading}
                  className="justify-start"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Ban User Account (Coming Soon)
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
