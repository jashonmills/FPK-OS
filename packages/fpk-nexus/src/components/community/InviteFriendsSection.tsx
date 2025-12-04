import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, Share2, Users, Gift, CheckCircle, Clock, Link2 } from "lucide-react";
import { format } from "date-fns";
import { APP_CONFIG } from "@/config/app";

interface InviteFriendsSectionProps {
  userId: string;
}

export const InviteFriendsSection = ({ userId }: InviteFriendsSectionProps) => {
  const queryClient = useQueryClient();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Fetch user's invite codes
  const { data: invites, isLoading: invitesLoading } = useQuery({
    queryKey: ['invites', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .eq('created_by_user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch user's referrals
  const { data: referrals, isLoading: referralsLoading } = useQuery({
    queryKey: ['referrals', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          personas:new_user_id (
            display_name,
            avatar_url
          )
        `)
        .eq('inviting_user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Generate new invite code
  const generateMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-invite-code');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites', userId] });
      toast.success('New invite code generated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate invite code');
    }
  });

  const copyToClipboard = (code: string) => {
    const inviteUrl = `${APP_CONFIG.APP_URL}/auth?invite=${code}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedCode(code);
    toast.success('Invite link copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const shareInvite = (code: string) => {
    const inviteUrl = `${APP_CONFIG.APP_URL}/auth?invite=${code}`;
    const text = `Join me on FPK Nexus! Use my invite code: ${code}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join FPK Nexus',
        text,
        url: inviteUrl
      });
    } else {
      copyToClipboard(code);
    }
  };

  const referralCount = referrals?.length || 0;
  const rewardedCount = referrals?.filter(r => r.status === 'REWARDED').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Invite Friends & Earn Rewards</h3>
            <p className="text-muted-foreground mb-4">
              Share FPK Nexus with your friends and earn <span className="font-semibold text-primary">5,000 credits</span> for each person who joins and creates their first persona!
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span><strong>{referralCount}</strong> referrals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span><strong>{rewardedCount}</strong> rewarded</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Generate Button */}
      <Button 
        onClick={() => generateMutation.mutate()} 
        disabled={generateMutation.isPending}
        size="lg"
        className="w-full"
      >
        <Share2 className="w-4 h-4 mr-2" />
        {generateMutation.isPending ? 'Generating...' : 'Generate New Invite Code'}
      </Button>

      {/* Invite Codes List */}
      {invites && invites.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Your Invite Links
          </h4>
          <div className="space-y-2">
            {invites.map((invite) => (
              <Card key={invite.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="font-mono text-sm text-primary hover:underline truncate">
                        {APP_CONFIG.APP_URL}/auth?invite={invite.invite_code}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Share this link - it takes people directly to sign-up!
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Used {invite.uses_count} {invite.max_uses ? `/ ${invite.max_uses}` : ''} times
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(invite.invite_code)}
                    >
                      {copiedCode === invite.invite_code ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareInvite(invite.invite_code)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Referrals List */}
      {referrals && referrals.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Your Referrals ({referralCount})
          </h4>
          <div className="space-y-2">
            {referrals.map((referral) => (
              <Card key={referral.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {Array.isArray(referral.personas) && referral.personas[0]?.avatar_url ? (
                        <img 
                          src={referral.personas[0].avatar_url} 
                          alt="" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {Array.isArray(referral.personas) && referral.personas[0]?.display_name || 'New User'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Joined {format(new Date(referral.created_at), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={referral.status === 'REWARDED' ? 'default' : 'secondary'}
                    className="flex items-center gap-1"
                  >
                    {referral.status === 'REWARDED' ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Rewarded
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Pending
                      </>
                    )}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!invitesLoading && !invites?.length && (
        <Card className="p-8 text-center">
          <Share2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Generate your first invite code to start earning rewards!
          </p>
        </Card>
      )}
    </div>
  );
};
