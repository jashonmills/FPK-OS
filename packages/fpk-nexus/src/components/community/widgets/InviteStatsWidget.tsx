import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetCard } from "./WidgetCard";
import { Gift, Copy, Check, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { APP_CONFIG } from "@/config/app";

interface InviteData {
  invite_code: string;
  uses_count: number;
  created_at: string;
}

export const InviteStatsWidget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInviteData();
    }
  }, [user]);

  const fetchInviteData = async () => {
    if (!user) return;
    
    try {
      // Fetch user's invite code
      const { data: inviteCode, error: inviteError } = await supabase
        .from("invites")
        .select("invite_code, uses_count, created_at")
        .eq("created_by_user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (inviteError) throw inviteError;

      if (inviteCode) {
        setInviteData(inviteCode);
      }
    } catch (error) {
      console.error("Error fetching invite data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!user || generating) return;

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-invite-code', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      toast({
        title: "Invite code generated!",
        description: "Your personal invite code is ready to share.",
      });

      // Refresh the data
      await fetchInviteData();
    } catch (error: any) {
      console.error("Error generating invite code:", error);
      toast({
        title: "Error generating code",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    if (!inviteData) return;

    try {
      const inviteUrl = `${APP_CONFIG.APP_URL}/auth?invite=${inviteData.invite_code}`;
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard.",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try copying manually.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <WidgetCard title="My Invite Code" icon={<Gift className="h-4 w-4" />}>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-20" />
        </div>
      </WidgetCard>
    );
  }

  if (!inviteData) {
    return (
      <WidgetCard title="My Invite Code" icon={<Gift className="h-4 w-4" />}>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Generate your personal invite code to invite friends to join FPK Nexus!
          </p>
          <Button 
            onClick={handleGenerateCode} 
            disabled={generating}
            className="w-full"
            size="sm"
          >
            {generating && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
            {generating ? "Generating..." : "Generate Invite Code"}
          </Button>
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard
      title="My Invite Code"
      icon={<Gift className="h-4 w-4" />}
    >
      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Your personal invite code:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-muted rounded-md font-mono text-xs break-all">
              {APP_CONFIG.APP_URL}/auth?invite={inviteData.invite_code}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyCode}
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Successful Invites</p>
              <p className="text-2xl font-bold text-primary">{inviteData.uses_count}</p>
            </div>
            <Gift className="h-8 w-8 text-primary/20" />
          </div>
          {inviteData.uses_count > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Thank you for growing our community! 🎉
            </p>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Share this link - it takes people directly to sign-up!
        </div>
      </div>
    </WidgetCard>
  );
};
