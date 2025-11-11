import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useFeatureFlags } from "@/contexts/FeatureFlagContext";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, Flag, Users, Play, Loader2, AlertOctagon, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { AppealReviewDialog } from "@/components/admin/AppealReviewDialog";
import { format } from "date-fns";

interface FeatureFlag {
  id: string;
  flag_name: string;
  is_enabled: boolean;
  description: string | null;
}

export default function AdminPanel() {
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { refreshFlags } = useFeatureFlags();
  const navigate = useNavigate();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const [inviteStats, setInviteStats] = useState({ codes: 0, referrals: 0, pending: 0, rewarded: 0 });
  const [processingRewards, setProcessingRewards] = useState(false);
  const [pendingAppeals, setPendingAppeals] = useState<any[]>([]);
  const [selectedAppeal, setSelectedAppeal] = useState<any>(null);
  const [appealDialogOpen, setAppealDialogOpen] = useState(false);
  const isInviteSystemEnabled = useFeatureFlag('user_invite_system_enabled');
  const isOperationSpearheadEnabled = useFeatureFlag('operation_spearhead_enabled');

  useEffect(() => {
    // Redirect if not admin
    if (!roleLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchFlags();
      if (isInviteSystemEnabled) {
        fetchInviteStats();
      }
      if (isOperationSpearheadEnabled) {
        fetchPendingAppeals();
      }
    }
  }, [isAdmin, isInviteSystemEnabled, isOperationSpearheadEnabled]);

  const fetchPendingAppeals = async () => {
    const { data, error } = await supabase
      .from('ban_appeals')
      .select(`
        *,
        ban:user_bans(*)
      `)
      .eq('status', 'pending_review')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appeals:', error);
      return;
    }

    setPendingAppeals(data || []);
  };

  const fetchInviteStats = async () => {
    const [codes, referrals, pending, rewarded] = await Promise.all([
      supabase.from('invites').select('id', { count: 'exact', head: true }),
      supabase.from('referrals').select('id', { count: 'exact', head: true }),
      supabase.from('referrals').select('id', { count: 'exact', head: true }).eq('status', 'PENDING_REWARD'),
      supabase.from('referrals').select('id', { count: 'exact', head: true }).eq('status', 'REWARDED'),
    ]);

    setInviteStats({
      codes: codes.count || 0,
      referrals: referrals.count || 0,
      pending: pending.count || 0,
      rewarded: rewarded.count || 0,
    });
  };

  const processRewards = async () => {
    setProcessingRewards(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-referral-rewards');
      
      if (error) throw error;
      
      toast.success(`Processed ${data.summary.processed} rewards!`);
      await fetchInviteStats();
    } catch (error) {
      toast.error('Failed to process rewards');
      console.error(error);
    } finally {
      setProcessingRewards(false);
    }
  };

  const fetchFlags = async () => {
    const { data, error } = await supabase
      .from("feature_flags")
      .select("*")
      .order("flag_name");

    if (error) {
      toast.error("Failed to load feature flags");
      console.error(error);
      return;
    }

    setFlags(data || []);
  };

  const toggleFlag = async (flagId: string, currentValue: boolean) => {
    setUpdating(flagId);
    
    const { error } = await supabase
      .from("feature_flags")
      .update({ is_enabled: !currentValue })
      .eq("id", flagId);

    if (error) {
      toast.error("Failed to update feature flag");
      console.error(error);
    } else {
      toast.success(`Feature ${!currentValue ? "enabled" : "disabled"}`);
      await fetchFlags();
      await refreshFlags(); // Refresh the global context
    }

    setUpdating(null);
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-background">
      <div className="container max-w-4xl mx-auto p-6 space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="flags">
              <Flag className="h-4 w-4 mr-2" />
              Feature Flags
            </TabsTrigger>
            {isOperationSpearheadEnabled && (
              <TabsTrigger value="appeals">
                <AlertOctagon className="h-4 w-4 mr-2" />
                Ban Appeals
                {pendingAppeals.length > 0 && (
                  <Badge variant="destructive" className="ml-2">{pendingAppeals.length}</Badge>
                )}
              </TabsTrigger>
            )}
            {isInviteSystemEnabled && (
              <TabsTrigger value="invites">
                <Users className="h-4 w-4 mr-2" />
                Invite System
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>
                  Welcome to the admin panel. Use the tabs above to navigate between different admin sections.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flag className="h-5 w-5 text-primary" />
                      <span className="font-medium">Feature Flags</span>
                    </div>
                    <Badge variant="outline">{flags.length} flags</Badge>
                  </div>
                  {isOperationSpearheadEnabled && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertOctagon className="h-5 w-5 text-destructive" />
                        <span className="font-medium">Pending Appeals</span>
                      </div>
                      <Badge variant={pendingAppeals.length > 0 ? "destructive" : "outline"}>
                        {pendingAppeals.length}
                      </Badge>
                    </div>
                  )}
                  {isInviteSystemEnabled && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span className="font-medium">Total Referrals</span>
                      </div>
                      <Badge variant="outline">{inviteStats.referrals}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Feature Flags</CardTitle>
                <CardDescription>
                  Feature flags allow you to enable or disable features without deploying new code.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Changes take effect immediately for all users</p>
                <p>• User-specific overrides can be set in the database for beta testing</p>
                <p>• All flags are disabled by default for safety</p>
                <p>• Flags can be toggled on/off at any time without data loss</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flags" className="space-y-6 mt-6">
            <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-primary" />
              <CardTitle>Feature Flags</CardTitle>
            </div>
            <CardDescription>
              Control which features are enabled for all users. Changes take effect immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {flags.map((flag) => (
              <div
                key={flag.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="space-y-1 flex-1">
                  <Label
                    htmlFor={flag.flag_name}
                    className="text-base font-medium cursor-pointer"
                  >
                    {formatFlagName(flag.flag_name)}
                  </Label>
                  {flag.description && (
                    <p className="text-sm text-muted-foreground">{flag.description}</p>
                  )}
                </div>
                <Switch
                  id={flag.flag_name}
                  checked={flag.is_enabled}
                  onCheckedChange={() => toggleFlag(flag.id, flag.is_enabled)}
                  disabled={updating === flag.id}
                />
              </div>
            ))}
          </CardContent>
        </Card>
          </TabsContent>

          {isOperationSpearheadEnabled && (
            <TabsContent value="appeals" className="space-y-6 mt-6">
              <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertOctagon className="h-5 w-5 text-destructive" />
                <CardTitle className="flex items-center gap-2">
                  Ban Appeals
                  {pendingAppeals.length > 0 && (
                    <Badge variant="destructive">{pendingAppeals.length}</Badge>
                  )}
                </CardTitle>
              </div>
              <CardDescription>
                Review user appeals for AI-issued bans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingAppeals.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">No pending appeals</p>
              ) : (
                <div className="space-y-3">
                  {pendingAppeals.map((appeal) => (
                    <div
                      key={appeal.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedAppeal(appeal);
                        setAppealDialogOpen(true);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="destructive" className="mb-2">
                            {appeal.ban.reason}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            Severity: {appeal.ban.severity_score}/10
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(appeal.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2 text-muted-foreground">
                        "{appeal.user_justification}"
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppeal(appeal);
                          setAppealDialogOpen(true);
                        }}
                      >
                        Review Appeal
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
            </TabsContent>
          )}

          {isInviteSystemEnabled && (
            <TabsContent value="invites" className="space-y-6 mt-6">
              <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Invite System Stats</CardTitle>
              </div>
              <CardDescription>
                Monitor referral program performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{inviteStats.codes}</p>
                  <p className="text-sm text-muted-foreground">Invite Codes</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{inviteStats.referrals}</p>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-500">{inviteStats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending Rewards</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-500">{inviteStats.rewarded}</p>
                  <p className="text-sm text-muted-foreground">Rewarded</p>
                </div>
              </div>
              <Button 
                onClick={processRewards}
                disabled={processingRewards || inviteStats.pending === 0}
                className="w-full"
              >
                {processingRewards ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Process Pending Rewards Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
            </TabsContent>
          )}
        </Tabs>

        <AppealReviewDialog
          appeal={selectedAppeal}
          open={appealDialogOpen}
          onOpenChange={setAppealDialogOpen}
          onUpdate={fetchPendingAppeals}
        />
      </div>
    </div>
  );
}

function formatFlagName(flagName: string): string {
  return flagName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace("Enabled", "");
}
