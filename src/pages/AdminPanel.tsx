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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Shield, Flag, Users, Play, Loader2, AlertOctagon, LayoutDashboard, FileText, Search, Download } from "lucide-react";
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
  const [moderationLogs, setModerationLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [logTypeFilter, setLogTypeFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
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
      fetchModerationLogs();
      if (isInviteSystemEnabled) {
        fetchInviteStats();
      }
      if (isOperationSpearheadEnabled) {
        fetchPendingAppeals();
      }
    }
  }, [isAdmin, isInviteSystemEnabled, isOperationSpearheadEnabled]);

  const fetchModerationLogs = async () => {
    try {
      const [aiLogs, bans, appeals] = await Promise.all([
        supabase
          .from('ai_moderation_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('user_bans')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('ban_appeals')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100)
      ]);

      const combinedLogs = [
        ...(aiLogs.data || []).map(log => ({ ...log, log_type: 'ai_moderation' })),
        ...(bans.data || []).map(ban => ({ ...ban, log_type: 'ban' })),
        ...(appeals.data || []).map(appeal => ({ ...appeal, log_type: 'appeal' }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setModerationLogs(combinedLogs);
    } catch (error) {
      console.error('Error fetching moderation logs:', error);
      toast.error('Failed to load moderation logs');
    }
  };

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

  const filteredLogs = moderationLogs.filter(log => {
    const matchesSearch = searchQuery === "" || 
      JSON.stringify(log).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = logTypeFilter === "all" || log.log_type === logTypeFilter;
    
    const matchesSeverity = severityFilter === "all" || 
      (log.severity_score && log.severity_score >= parseInt(severityFilter));

    return matchesSearch && matchesType && matchesSeverity;
  });

  const getLogTypeBadge = (type: string) => {
    switch (type) {
      case 'ai_moderation':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">AI Action</Badge>;
      case 'ban':
        return <Badge variant="destructive">Ban</Badge>;
      case 'appeal':
        return <Badge variant="secondary">Appeal</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getSeverityBadge = (score?: number) => {
    if (!score) return null;
    if (score >= 8) return <Badge variant="destructive">High ({score}/10)</Badge>;
    if (score >= 5) return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Medium ({score}/10)</Badge>;
    return <Badge variant="outline">Low ({score}/10)</Badge>;
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `moderation-logs-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Logs exported as JSON');
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Type', 'Severity', 'Action/Status', 'Reason/Category', 'Content', 'Notes'];
    const rows = filteredLogs.map(log => {
      const timestamp = format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss');
      const type = log.log_type;
      const severity = log.severity_score || '';
      
      let action = '';
      let reason = '';
      let content = '';
      let notes = '';

      if (log.log_type === 'ai_moderation') {
        action = log.action_taken || '';
        reason = log.violation_category || '';
        content = log.message_content || '';
        notes = log.de_escalation_message || '';
      } else if (log.log_type === 'ban') {
        action = log.status || '';
        reason = log.reason || '';
        content = log.offending_message_content || '';
        notes = `Expires: ${format(new Date(log.expires_at), 'yyyy-MM-dd HH:mm')}`;
      } else if (log.log_type === 'appeal') {
        action = log.status || '';
        reason = '';
        content = log.user_justification || '';
        notes = log.admin_notes || '';
      }

      return [
        timestamp,
        type,
        severity,
        action,
        reason,
        content.replace(/"/g, '""'), // Escape quotes
        notes.replace(/"/g, '""')
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `moderation-logs-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Logs exported as CSV');
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="flags">
              <Flag className="h-4 w-4 mr-2" />
              Flags
            </TabsTrigger>
            <TabsTrigger value="logs">
              <FileText className="h-4 w-4 mr-2" />
              Logs
            </TabsTrigger>
            {isOperationSpearheadEnabled && (
              <TabsTrigger value="appeals">
                <AlertOctagon className="h-4 w-4 mr-2" />
                Appeals
                {pendingAppeals.length > 0 && (
                  <Badge variant="destructive" className="ml-2">{pendingAppeals.length}</Badge>
                )}
              </TabsTrigger>
            )}
            {isInviteSystemEnabled && (
              <TabsTrigger value="invites">
                <Users className="h-4 w-4 mr-2" />
                Invites
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

          <TabsContent value="logs" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle>Moderation Logs</CardTitle>
                    </div>
                    <CardDescription className="mt-2">
                      View all AI moderation actions, ban history, and appeal outcomes
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportToJSON}>
                      <Download className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={logTypeFilter} onValueChange={setLogTypeFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Log Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="ai_moderation">AI Actions</SelectItem>
                      <SelectItem value="ban">Bans</SelectItem>
                      <SelectItem value="appeal">Appeals</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="8">High (8+)</SelectItem>
                      <SelectItem value="5">Medium (5+)</SelectItem>
                      <SelectItem value="1">Low (1+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredLogs.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No logs found</p>
                  ) : (
                    filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            {getLogTypeBadge(log.log_type)}
                            {getSeverityBadge(log.severity_score)}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>

                        {log.log_type === 'ai_moderation' && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Action: {log.action_taken}
                            </p>
                            {log.violation_category && (
                              <p className="text-sm text-muted-foreground">
                                Category: {log.violation_category}
                              </p>
                            )}
                            {log.message_content && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                Message: "{log.message_content}"
                              </p>
                            )}
                            {log.de_escalation_message && (
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                De-escalation: {log.de_escalation_message}
                              </p>
                            )}
                          </div>
                        )}

                        {log.log_type === 'ban' && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Status: {log.status}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Reason: {log.reason}
                            </p>
                            {log.offending_message_content && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                Message: "{log.offending_message_content}"
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Expires: {format(new Date(log.expires_at), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                        )}

                        {log.log_type === 'appeal' && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Status: {log.status}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              Justification: "{log.user_justification}"
                            </p>
                            {log.admin_notes && (
                              <p className="text-sm text-green-600 dark:text-green-400">
                                Admin notes: {log.admin_notes}
                              </p>
                            )}
                            {log.reviewed_at && (
                              <p className="text-xs text-muted-foreground">
                                Reviewed: {format(new Date(log.reviewed_at), 'MMM d, yyyy h:mm a')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
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
