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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, Shield, Flag, Users, Play, Loader2, AlertOctagon, LayoutDashboard, FileText, Search, Download, UserCog, Ban, CheckCircle, CheckSquare, Square, TrendingUp, MessageSquare, Heart } from "lucide-react";
import { toast } from "sonner";
import { AppealReviewDialog } from "@/components/admin/AppealReviewDialog";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart } from "recharts";

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
  const [users, setUsers] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState("24");
  const [banningUser, setBanningUser] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [bulkBanDialogOpen, setBulkBanDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'ban' | 'unban'>('ban');
  const [processingBulk, setProcessingBulk] = useState(false);
  const [userStatusFilter, setUserStatusFilter] = useState<string>("all");
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<string>("all");
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
      fetchUsers();
      fetchOverviewStats();
      if (isInviteSystemEnabled) {
        fetchInviteStats();
      }
      if (isOperationSpearheadEnabled) {
        fetchPendingAppeals();
      }
    }
  }, [isAdmin, isInviteSystemEnabled, isOperationSpearheadEnabled]);

  useEffect(() => {
    if (isAdmin) {
      fetchOverviewStats();
    }
  }, [timeRange, isAdmin]);

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

  const fetchOverviewStats = async () => {
    try {
      // Calculate date range
      const now = new Date();
      let startDate: Date | null = null;
      let previousStartDate: Date | null = null;
      let previousEndDate: Date | null = null;
      
      switch (timeRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          previousStartDate = new Date(startDate);
          previousStartDate.setDate(startDate.getDate() - 1);
          previousEndDate = new Date(startDate);
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          previousStartDate = new Date(startDate);
          previousStartDate.setDate(startDate.getDate() - 7);
          previousEndDate = new Date(startDate);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          previousStartDate = new Date(startDate);
          previousStartDate.setMonth(startDate.getMonth() - 1);
          previousEndDate = new Date(startDate);
          break;
        case 'all':
        default:
          startDate = null;
          previousStartDate = null;
          previousEndDate = null;
          break;
      }

      // Build queries with optional date filtering
      const postsQuery = supabase.from('posts').select('id, author_id, created_at', { count: 'exact', head: false });
      const commentsQuery = supabase.from('post_comments').select('id, author_id, created_at', { count: 'exact', head: false });
      const messagesQuery = supabase.from('messages').select('id, sender_id, created_at', { count: 'exact', head: false });
      const supportsQuery = supabase.from('post_supports').select('id, user_id, created_at', { count: 'exact', head: false });

      if (startDate) {
        postsQuery.gte('created_at', startDate.toISOString());
        commentsQuery.gte('created_at', startDate.toISOString());
        messagesQuery.gte('created_at', startDate.toISOString());
        supportsQuery.gte('created_at', startDate.toISOString());
      }

      // Fetch user profiles with created_at for growth chart
      const profilesQuery = supabase.from('profiles').select('id, created_at', { count: 'exact', head: false });
      if (startDate) {
        profilesQuery.gte('created_at', startDate.toISOString());
      }

      const [posts, comments, messages, supports, profiles, bannedUsers] = await Promise.all([
        postsQuery,
        commentsQuery,
        messagesQuery,
        supportsQuery,
        profilesQuery,
        supabase.from('user_bans').select('id', { count: 'exact', head: true }).eq('status', 'active')
      ]);

      const totalUsers = profiles.count || 0;

      // Fetch previous period data for comparison
      let previousPosts = 0, previousComments = 0, previousMessages = 0, previousSupports = 0;
      
      if (previousStartDate && previousEndDate) {
        const [prevPosts, prevComments, prevMessages, prevSupports] = await Promise.all([
          supabase.from('posts').select('id', { count: 'exact', head: true })
            .gte('created_at', previousStartDate.toISOString())
            .lt('created_at', previousEndDate.toISOString()),
          supabase.from('post_comments').select('id', { count: 'exact', head: true })
            .gte('created_at', previousStartDate.toISOString())
            .lt('created_at', previousEndDate.toISOString()),
          supabase.from('messages').select('id', { count: 'exact', head: true })
            .gte('created_at', previousStartDate.toISOString())
            .lt('created_at', previousEndDate.toISOString()),
          supabase.from('post_supports').select('id', { count: 'exact', head: true })
            .gte('created_at', previousStartDate.toISOString())
            .lt('created_at', previousEndDate.toISOString())
        ]);

        previousPosts = prevPosts.count || 0;
        previousComments = prevComments.count || 0;
        previousMessages = prevMessages.count || 0;
        previousSupports = prevSupports.count || 0;
      }

      // Calculate percentage changes
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      const currentPosts = posts.count || 0;
      const currentComments = comments.count || 0;
      const currentMessages = messages.count || 0;
      const currentSupports = supports.count || 0;

      // Generate trend data for the chart
      let trendData: any[] = [];
      let userGrowthData: any[] = [];
      if (startDate) {
        // Fetch all data for the period at once
        const allPeriodPosts = posts.data || [];
        const allPeriodComments = comments.data || [];
        const allPeriodMessages = messages.data || [];
        const allPeriodProfiles = profiles.data || [];
        
        const days = timeRange === 'today' ? 24 : timeRange === 'week' ? 7 : 30;
        const isHourly = timeRange === 'today';
        
        // Group data by time period
        const dataByPeriod: { [key: string]: { posts: number; comments: number; messages: number; newUsers: number } } = {};
        
        for (let i = days - 1; i >= 0; i--) {
          const periodStart = new Date(now);
          
          if (isHourly) {
            periodStart.setHours(now.getHours() - i, 0, 0, 0);
          } else {
            periodStart.setDate(now.getDate() - i);
            periodStart.setHours(0, 0, 0, 0);
          }
          
          const key = isHourly ? format(periodStart, 'ha') : format(periodStart, 'MMM d');
          dataByPeriod[key] = { posts: 0, comments: 0, messages: 0, newUsers: 0 };
          
          // Count posts for this period
          allPeriodPosts.forEach((post: any) => {
            const postDate = new Date(post.created_at);
            let postKey: string;
            
            if (isHourly) {
              postKey = format(new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate(), postDate.getHours()), 'ha');
            } else {
              postKey = format(new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate()), 'MMM d');
            }
            
            if (postKey === key) {
              dataByPeriod[key].posts++;
            }
          });
          
          // Count comments for this period
          allPeriodComments.forEach((comment: any) => {
            const commentDate = new Date(comment.created_at);
            let commentKey: string;
            
            if (isHourly) {
              commentKey = format(new Date(commentDate.getFullYear(), commentDate.getMonth(), commentDate.getDate(), commentDate.getHours()), 'ha');
            } else {
              commentKey = format(new Date(commentDate.getFullYear(), commentDate.getMonth(), commentDate.getDate()), 'MMM d');
            }
            
            if (commentKey === key) {
              dataByPeriod[key].comments++;
            }
          });
          
          // Count messages for this period
          allPeriodMessages.forEach((message: any) => {
            const messageDate = new Date(message.created_at);
            let messageKey: string;
            
            if (isHourly) {
              messageKey = format(new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate(), messageDate.getHours()), 'ha');
            } else {
              messageKey = format(new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate()), 'MMM d');
            }
            
            if (messageKey === key) {
              dataByPeriod[key].messages++;
            }
          });
          
          // Count new users for this period
          allPeriodProfiles.forEach((profile: any) => {
            const profileDate = new Date(profile.created_at);
            let profileKey: string;
            
            if (isHourly) {
              profileKey = format(new Date(profileDate.getFullYear(), profileDate.getMonth(), profileDate.getDate(), profileDate.getHours()), 'ha');
            } else {
              profileKey = format(new Date(profileDate.getFullYear(), profileDate.getMonth(), profileDate.getDate()), 'MMM d');
            }
            
            if (profileKey === key) {
              dataByPeriod[key].newUsers++;
            }
          });
        }
        
        // Convert to array for chart
        trendData = Object.keys(dataByPeriod).map(key => ({
          date: key,
          posts: dataByPeriod[key].posts,
          comments: dataByPeriod[key].comments,
          messages: dataByPeriod[key].messages,
          total: dataByPeriod[key].posts + dataByPeriod[key].comments + dataByPeriod[key].messages
        }));
        
        // Create cumulative user growth data
        let cumulativeUsers = 0;
        userGrowthData = Object.keys(dataByPeriod).map(key => {
          cumulativeUsers += dataByPeriod[key].newUsers;
          return {
            date: key,
            newUsers: dataByPeriod[key].newUsers,
            totalUsers: cumulativeUsers
          };
        });
      }

      // Calculate top contributors by posts
      const postsByAuthor = (posts.data || []).reduce((acc: any, post: any) => {
        acc[post.author_id] = (acc[post.author_id] || 0) + 1;
        return acc;
      }, {});

      const commentsByAuthor = (comments.data || []).reduce((acc: any, comment: any) => {
        acc[comment.author_id] = (acc[comment.author_id] || 0) + 1;
        return acc;
      }, {});

      const messagesBySender = (messages.data || []).reduce((acc: any, message: any) => {
        acc[message.sender_id] = (acc[message.sender_id] || 0) + 1;
        return acc;
      }, {});

      // Get all unique persona IDs
      const personaIds = new Set([
        ...Object.keys(postsByAuthor),
        ...Object.keys(commentsByAuthor),
        ...Object.keys(messagesBySender)
      ]);

      // Fetch persona details for top contributors
      const { data: personas } = await supabase
        .from('personas')
        .select('id, display_name, user_id')
        .in('id', Array.from(personaIds));

      // Calculate total activity per persona
      const activityByPersona = Array.from(personaIds).map(personaId => {
        const persona = personas?.find(p => p.id === personaId);
        return {
          personaId,
          displayName: persona?.display_name || 'Unknown',
          posts: postsByAuthor[personaId] || 0,
          comments: commentsByAuthor[personaId] || 0,
          messages: messagesBySender[personaId] || 0,
          total: (postsByAuthor[personaId] || 0) + (commentsByAuthor[personaId] || 0) + (messagesBySender[personaId] || 0)
        };
      }).sort((a, b) => b.total - a.total).slice(0, 10);

      setOverviewStats({
        totalPosts: currentPosts,
        totalComments: currentComments,
        totalMessages: currentMessages,
        totalSupports: currentSupports,
        totalUsers,
        activeBans: bannedUsers.count || 0,
        postsChange: calculateChange(currentPosts, previousPosts),
        commentsChange: calculateChange(currentComments, previousComments),
        messagesChange: calculateChange(currentMessages, previousMessages),
        supportsChange: calculateChange(currentSupports, previousSupports),
        trendData,
        userGrowthData,
        topContributors: activityByPersona,
        activityBreakdown: [
          { name: 'Posts', value: currentPosts, color: 'hsl(var(--primary))' },
          { name: 'Comments', value: currentComments, color: '#3b82f6' },
          { name: 'Messages', value: currentMessages, color: '#10b981' },
          { name: 'Supports', value: currentSupports, color: '#a855f7' }
        ]
      });
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      toast.error('Failed to load overview statistics');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const usersWithDetails = await Promise.all(
        (profilesData || []).map(async (profile) => {
          // First fetch persona and basic info
          const [personas, activeBan, banHistory, moderationHistory] = await Promise.all([
            supabase
              .from('personas')
              .select('*')
              .eq('user_id', profile.user_id)
              .limit(1)
              .single(),
            supabase
              .from('user_bans')
              .select('*')
              .eq('user_id', profile.user_id)
              .eq('status', 'active')
              .single(),
            supabase
              .from('user_bans')
              .select('*')
              .eq('user_id', profile.user_id)
              .order('created_at', { ascending: false }),
            supabase
              .from('ai_moderation_log')
              .select('*')
              .eq('sender_id', profile.user_id)
              .order('created_at', { ascending: false })
              .limit(10)
          ]);

          // Then fetch activity stats using persona ID
          const personaId = personas.data?.id || '';
          const [posts, comments, messages, supports] = await Promise.all([
            supabase
              .from('posts')
              .select('id', { count: 'exact', head: true })
              .eq('author_id', personaId),
            supabase
              .from('post_comments')
              .select('id', { count: 'exact', head: true })
              .eq('author_id', personaId),
            supabase
              .from('messages')
              .select('id', { count: 'exact', head: true })
              .eq('sender_id', personaId),
            supabase
              .from('post_supports')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', profile.user_id)
          ]);

          const activityStats = {
            posts: posts.count || 0,
            comments: comments.count || 0,
            messages: messages.count || 0,
            supports: supports.count || 0,
            total: (posts.count || 0) + (comments.count || 0) + (messages.count || 0) + (supports.count || 0)
          };

          return {
            ...profile,
            persona: personas.data,
            activeBan: activeBan.data,
            banHistory: banHistory.data || [],
            moderationHistory: moderationHistory.data || [],
            activityStats
          };
        })
      );

      setUsers(usersWithDetails);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleManualBan = async () => {
    if (!selectedUser || !banReason.trim()) {
      toast.error('Please provide a ban reason');
      return;
    }

    setBanningUser(true);
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + parseInt(banDuration));

      const { error } = await supabase
        .from('user_bans')
        .insert({
          user_id: selectedUser.user_id,
          reason: banReason,
          offending_message_content: 'Manual ban by admin',
          severity_score: 10,
          expires_at: expiresAt.toISOString(),
          status: 'active',
          is_ai_ban: false,
          banned_by_user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast.success('User banned successfully');
      setBanDialogOpen(false);
      setBanReason('');
      setBanDuration('24');
      await fetchUsers();
      await fetchModerationLogs();
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user');
    } finally {
      setBanningUser(false);
    }
  };

  const handleUnban = async (userId: string, banId: string) => {
    try {
      const { error } = await supabase
        .from('user_bans')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('id', banId);

      if (error) throw error;

      toast.success('User unbanned successfully');
      await fetchUsers();
      await fetchModerationLogs();
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user');
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const toggleAllUsers = () => {
    if (selectedUserIds.size === filteredUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUsers.map(u => u.user_id)));
    }
  };

  const handleBulkAction = async () => {
    if (selectedUserIds.size === 0) {
      toast.error('No users selected');
      return;
    }

    if (bulkAction === 'ban' && !banReason.trim()) {
      toast.error('Please provide a ban reason');
      return;
    }

    setProcessingBulk(true);
    try {
      if (bulkAction === 'ban') {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + parseInt(banDuration));
        const currentUserId = (await supabase.auth.getUser()).data.user?.id;

        const bansToInsert = Array.from(selectedUserIds).map(userId => ({
          user_id: userId,
          reason: banReason,
          offending_message_content: 'Bulk ban by admin',
          severity_score: 10,
          expires_at: expiresAt.toISOString(),
          status: 'active',
          is_ai_ban: false,
          banned_by_user_id: currentUserId
        }));

        const { error } = await supabase
          .from('user_bans')
          .insert(bansToInsert);

        if (error) throw error;
        toast.success(`Successfully banned ${selectedUserIds.size} users`);
      } else {
        // Bulk unban
        const selectedUsers = users.filter(u => selectedUserIds.has(u.user_id) && u.activeBan);
        const banIds = selectedUsers.map(u => u.activeBan.id);

        if (banIds.length === 0) {
          toast.error('No banned users selected');
          setProcessingBulk(false);
          return;
        }

        const { error } = await supabase
          .from('user_bans')
          .update({ status: 'expired', updated_at: new Date().toISOString() })
          .in('id', banIds);

        if (error) throw error;
        toast.success(`Successfully unbanned ${banIds.length} users`);
      }

      setBulkBanDialogOpen(false);
      setBanReason('');
      setBanDuration('24');
      setSelectedUserIds(new Set());
      await fetchUsers();
      await fetchModerationLogs();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error(`Failed to ${bulkAction} users`);
    } finally {
      setProcessingBulk(false);
    }
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

  const filteredUsers = users.filter(user => {
    if (!userSearchQuery) return true;
    const query = userSearchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(query) ||
      user.persona?.display_name?.toLowerCase().includes(query) ||
      user.user_id?.toLowerCase().includes(query)
    );
  }).filter(user => {
    // Apply status filter
    switch (userStatusFilter) {
      case 'banned':
        return user.activeBan !== null;
      case 'active':
        return user.activeBan === null;
      case 'with_history':
        return user.moderationHistory.length > 0 || user.banHistory.length > 0;
      case 'no_history':
        return user.moderationHistory.length === 0 && user.banHistory.length === 0;
      default:
        return true;
    }
  });

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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <UserCog className="h-4 w-4 mr-2" />
              Users
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Activity Overview</h3>
                <p className="text-sm text-muted-foreground">Platform statistics and analytics</p>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {overviewStats ? (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{overviewStats.totalUsers}</div>
                      <p className="text-xs text-muted-foreground">
                        {overviewStats.activeBans} active bans
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{overviewStats.totalPosts}</div>
                      {timeRange !== 'all' && (
                        <p className="text-xs flex items-center gap-1">
                          <TrendingUp className={`h-3 w-3 ${overviewStats.postsChange >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                          <span className={overviewStats.postsChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {overviewStats.postsChange >= 0 ? '+' : ''}{overviewStats.postsChange}%
                          </span>
                          <span className="text-muted-foreground">from previous period</span>
                        </p>
                      )}
                      {timeRange === 'all' && (
                        <p className="text-xs text-muted-foreground">Across all circles</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{overviewStats.totalMessages}</div>
                      {timeRange !== 'all' && (
                        <p className="text-xs flex items-center gap-1">
                          <TrendingUp className={`h-3 w-3 ${overviewStats.messagesChange >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                          <span className={overviewStats.messagesChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {overviewStats.messagesChange >= 0 ? '+' : ''}{overviewStats.messagesChange}%
                          </span>
                          <span className="text-muted-foreground">from previous period</span>
                        </p>
                      )}
                      {timeRange === 'all' && (
                        <p className="text-xs text-muted-foreground">{overviewStats.totalComments} comments</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Supports</CardTitle>
                      <Heart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{overviewStats.totalSupports}</div>
                      {timeRange !== 'all' && (
                        <p className="text-xs flex items-center gap-1">
                          <TrendingUp className={`h-3 w-3 ${overviewStats.supportsChange >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                          <span className={overviewStats.supportsChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {overviewStats.supportsChange >= 0 ? '+' : ''}{overviewStats.supportsChange}%
                          </span>
                          <span className="text-muted-foreground">from previous period</span>
                        </p>
                      )}
                      {timeRange === 'all' && (
                        <p className="text-xs text-muted-foreground">Reactions given</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {timeRange !== 'all' && overviewStats.trendData && overviewStats.trendData.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Activity Trends</CardTitle>
                        <CardDescription>
                          {timeRange === 'today' ? 'Hourly activity for today' : 
                           timeRange === 'week' ? 'Daily activity for the last 7 days' :
                           'Daily activity for the last 30 days'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={overviewStats.trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="posts" fill="hsl(var(--primary))" name="Posts" stackId="a" />
                            <Bar dataKey="comments" fill="#3b82f6" name="Comments" stackId="a" />
                            <Bar dataKey="messages" fill="#10b981" name="Messages" stackId="a" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  {timeRange !== 'all' && overviewStats.userGrowthData && overviewStats.userGrowthData.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>
                          {timeRange === 'today' ? 'New registrations today' : 
                           timeRange === 'week' ? 'New registrations over the last 7 days' :
                           'New registrations over the last 30 days'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={overviewStats.userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="totalUsers" 
                              stroke="hsl(var(--primary))" 
                              fill="hsl(var(--primary))" 
                              fillOpacity={0.6}
                              name="Total Users" 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="newUsers" 
                              stroke="#10b981" 
                              fill="#10b981" 
                              fillOpacity={0.4}
                              name="New Users" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Breakdown</CardTitle>
                      <CardDescription>Distribution of user activity across platform</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={overviewStats.activityBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {overviewStats.activityBreakdown.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Contributors</CardTitle>
                      <CardDescription>Users with most activity</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={overviewStats.topContributors}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="displayName" angle={-45} textAnchor="end" height={100} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="posts" fill="hsl(var(--primary))" name="Posts" />
                          <Bar dataKey="comments" fill="#3b82f6" name="Comments" />
                          <Bar dataKey="messages" fill="#10b981" name="Messages" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Top 10 Contributors</CardTitle>
                    <CardDescription>Most active users on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {overviewStats.topContributors.map((contributor: any, index: number) => (
                        <div key={contributor.personaId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="font-mono">
                              #{index + 1}
                            </Badge>
                            <div>
                              <p className="font-medium">{contributor.displayName}</p>
                              <p className="text-xs text-muted-foreground">
                                {contributor.posts} posts • {contributor.comments} comments • {contributor.messages} messages
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="font-bold">{contributor.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserCog className="h-5 w-5 text-primary" />
                  <CardTitle>User Management</CardTitle>
                </div>
                <CardDescription>
                  Search users, view profiles, and manage bans
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by email, username, or ID..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                    <SelectTrigger className="w-full md:w-[220px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users ({users.length})</SelectItem>
                      <SelectItem value="active">Active Users ({users.filter(u => !u.activeBan).length})</SelectItem>
                      <SelectItem value="banned">Banned Users ({users.filter(u => u.activeBan).length})</SelectItem>
                      <SelectItem value="with_history">With Mod History ({users.filter(u => u.moderationHistory.length > 0 || u.banHistory.length > 0).length})</SelectItem>
                      <SelectItem value="no_history">Clean Record ({users.filter(u => u.moderationHistory.length === 0 && u.banHistory.length === 0).length})</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedUserIds.size > 0 && (
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setBulkAction('ban');
                          setBulkBanDialogOpen(true);
                        }}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Ban ({selectedUserIds.size})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBulkAction('unban');
                          setBulkBanDialogOpen(true);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Unban ({selectedUserIds.size})
                      </Button>
                    </div>
                  )}
                </div>

                {filteredUsers.length > 0 && (
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedUserIds.size === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={toggleAllUsers}
                        id="select-all"
                      />
                      <Label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                        Select all ({filteredUsers.length} users)
                      </Label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredUsers.length} of {users.length} users
                    </div>
                  </div>
                )}

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No users found</p>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.user_id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedUserIds.has(user.user_id)}
                            onCheckedChange={() => toggleUserSelection(user.user_id)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">
                                {user.persona?.display_name || 'No Persona'}
                              </h3>
                              {user.activeBan && (
                                <Badge variant="destructive">
                                  <Ban className="h-3 w-3 mr-1" />
                                  Banned
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              ID: {user.user_id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Joined: {format(new Date(user.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            {user.activeBan ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnban(user.user_id, user.activeBan.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Unban
                              </Button>
                            ) : (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setBanDialogOpen(true);
                                }}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Ban
                              </Button>
                            )}
                          </div>
                        </div>

                        {user.activeBan && (
                          <div className="bg-destructive/10 border border-destructive/20 rounded p-3 space-y-1">
                            <p className="text-sm font-medium text-destructive">Active Ban</p>
                            <p className="text-sm">Reason: {user.activeBan.reason}</p>
                            <p className="text-xs text-muted-foreground">
                              Expires: {format(new Date(user.activeBan.expires_at), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                        )}

                        {user.moderationHistory.length > 0 && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              Moderation History ({user.moderationHistory.length} events)
                            </summary>
                            <div className="mt-2 space-y-2 pl-4">
                              {user.moderationHistory.slice(0, 5).map((event: any) => (
                                <div key={event.id} className="text-xs space-y-1 border-l-2 border-muted pl-3">
                                  <div className="flex items-center gap-2">
                                    {getSeverityBadge(event.severity_score)}
                                    <span className="text-muted-foreground">
                                      {format(new Date(event.created_at), 'MMM d, h:mm a')}
                                    </span>
                                  </div>
                                  <p>{event.action_taken}</p>
                                  {event.violation_category && (
                                    <p className="text-muted-foreground">
                                      Category: {event.violation_category}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </details>
                        )}

                        {user.banHistory.length > 0 && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              Ban History ({user.banHistory.length} bans)
                            </summary>
                            <div className="mt-2 space-y-2 pl-4">
                              {user.banHistory.slice(0, 5).map((ban: any) => (
                                <div key={ban.id} className="text-xs space-y-1 border-l-2 border-destructive/50 pl-3">
                                  <div className="flex items-center gap-2">
                                    <Badge variant={ban.status === 'active' ? 'destructive' : 'outline'}>
                                      {ban.status}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                      {format(new Date(ban.created_at), 'MMM d, h:mm a')}
                                    </span>
                                  </div>
                                  <p>{ban.reason}</p>
                                  <p className="text-muted-foreground">
                                    {ban.is_ai_ban ? 'AI Ban' : 'Manual Ban'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}

                        {user.activityStats && (
                          <div className="bg-muted/50 rounded-lg p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">Activity Statistics</p>
                              <Badge variant="secondary">
                                Total: {user.activityStats.total}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Posts</span>
                                  <span className="font-medium">{user.activityStats.posts}</span>
                                </div>
                                <div className="h-2 bg-background rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${Math.min((user.activityStats.posts / Math.max(user.activityStats.total, 1)) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Comments</span>
                                  <span className="font-medium">{user.activityStats.comments}</span>
                                </div>
                                <div className="h-2 bg-background rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 transition-all"
                                    style={{ width: `${Math.min((user.activityStats.comments / Math.max(user.activityStats.total, 1)) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Messages</span>
                                  <span className="font-medium">{user.activityStats.messages}</span>
                                </div>
                                <div className="h-2 bg-background rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-green-500 transition-all"
                                    style={{ width: `${Math.min((user.activityStats.messages / Math.max(user.activityStats.total, 1)) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Supports</span>
                                  <span className="font-medium">{user.activityStats.supports}</span>
                                </div>
                                <div className="h-2 bg-background rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-purple-500 transition-all"
                                    style={{ width: `${Math.min((user.activityStats.supports / Math.max(user.activityStats.total, 1)) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
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

        <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ban User</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to manually ban {selectedUser?.persona?.display_name || selectedUser?.email}.
                This action will prevent them from accessing messaging features.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="banReason">Ban Reason *</Label>
                <Textarea
                  id="banReason"
                  placeholder="Enter the reason for this ban..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banDuration">Duration (hours)</Label>
                <Select value={banDuration} onValueChange={setBanDuration}>
                  <SelectTrigger id="banDuration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="72">3 days</SelectItem>
                    <SelectItem value="168">1 week</SelectItem>
                    <SelectItem value="720">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={banningUser}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleManualBan}
                disabled={banningUser || !banReason.trim()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {banningUser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Banning...
                  </>
                ) : (
                  <>
                    <Ban className="mr-2 h-4 w-4" />
                    Ban User
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={bulkBanDialogOpen} onOpenChange={setBulkBanDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {bulkAction === 'ban' ? 'Bulk Ban Users' : 'Bulk Unban Users'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                You are about to {bulkAction} {selectedUserIds.size} selected user{selectedUserIds.size !== 1 ? 's' : ''}.
                {bulkAction === 'ban' && ' This action will prevent them from accessing messaging features.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            {bulkAction === 'ban' && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="bulkBanReason">Ban Reason *</Label>
                  <Textarea
                    id="bulkBanReason"
                    placeholder="Enter the reason for these bans..."
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bulkBanDuration">Duration (hours)</Label>
                  <Select value={banDuration} onValueChange={setBanDuration}>
                    <SelectTrigger id="bulkBanDuration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="72">3 days</SelectItem>
                      <SelectItem value="168">1 week</SelectItem>
                      <SelectItem value="720">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={processingBulk}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkAction}
                disabled={processingBulk || (bulkAction === 'ban' && !banReason.trim())}
                className={bulkAction === 'ban' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
              >
                {processingBulk ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {bulkAction === 'ban' ? (
                      <><Ban className="mr-2 h-4 w-4" />Ban {selectedUserIds.size} Users</>
                    ) : (
                      <><CheckCircle className="mr-2 h-4 w-4" />Unban {selectedUserIds.size} Users</>
                    )}
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
