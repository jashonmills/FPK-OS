import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Ban {
  id: string;
  reason: string;
  expires_at: string;
  offending_message_content: string;
  severity_score: number;
}

export default function Banned() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ban, setBan] = useState<Ban | null>(null);
  const [appeal, setAppeal] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [appealSubmitted, setAppealSubmitted] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const fetchBan = async () => {
      const { data } = await supabase
        .from('user_bans')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();
      
      if (!data) {
        // No active ban, redirect to messages
        navigate('/messages');
        return;
      }
      
      setBan(data as Ban);
      
      // Check if appeal already submitted
      const { data: existingAppeal } = await supabase
        .from('ban_appeals')
        .select('id')
        .eq('ban_id', data.id)
        .maybeSingle();
      
      if (existingAppeal) {
        setAppealSubmitted(true);
      }
    };
    
    fetchBan();
  }, [user, navigate]);

  const handleSubmitAppeal = async () => {
    if (!appeal.trim() || submitting || !ban) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('ban_appeals')
        .insert({
          ban_id: ban.id,
          user_justification: appeal.trim()
        });
      
      if (error) throw error;
      
      setAppealSubmitted(true);
      toast.success("Appeal submitted successfully");
    } catch (error) {
      toast.error("Failed to submit appeal. Please try again.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!ban) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <Shield className="w-10 h-10 text-destructive" />
          </div>
          
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Account Temporarily Suspended</h1>
            <p className="text-muted-foreground">
              Your account has been automatically suspended for violating community guidelines.
            </p>
          </div>
          
          {/* Ban Details */}
          <div className="w-full bg-muted p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="font-semibold">Reason:</span>
              </div>
              <span className="text-destructive font-medium">
                {ban.reason.replace(/_/g, ' ')}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Expires:</span>
              </div>
              <span>
                {formatDistanceToNow(new Date(ban.expires_at), { addSuffix: true })}
              </span>
            </div>
            
            {/* Show the blocked message */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                The message that triggered this suspension:
              </p>
              <div className="bg-background p-3 rounded border italic text-sm">
                "{ban.offending_message_content}"
              </div>
            </div>
          </div>
          
          {/* Appeal Section */}
          <div className="w-full space-y-4">
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-2">Believe this was a mistake?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                You can submit an appeal for review by our human moderation team.
              </p>
              
              {!appealSubmitted ? (
                <>
                  <Textarea
                    value={appeal}
                    onChange={(e) => setAppeal(e.target.value)}
                    placeholder="Explain why you believe this suspension was an error..."
                    className="min-h-[120px] mb-4"
                  />
                  <Button
                    onClick={handleSubmitAppeal}
                    disabled={!appeal.trim() || submitting}
                    className="w-full"
                  >
                    {submitting ? "Submitting..." : "Submit Appeal"}
                  </Button>
                </>
              ) : (
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-primary font-medium">Appeal Submitted</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your appeal is under review. Our team will respond within 24 hours.
                  </p>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/my-appeals')}
            >
              View My Appeals History
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Appeals are reviewed by human moderators, not AI. We take every case seriously.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}