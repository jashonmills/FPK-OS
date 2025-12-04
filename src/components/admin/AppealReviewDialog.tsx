import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { Shield, CheckCircle, XCircle } from "lucide-react";

interface Appeal {
  id: string;
  ban_id: string;
  user_justification: string;
  status: string;
  created_at: string;
  ban: {
    user_id: string;
    reason: string;
    offending_message_content: string;
    severity_score: number;
    expires_at: string;
  };
}

interface AppealReviewDialogProps {
  appeal: Appeal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function AppealReviewDialog({ appeal, open, onOpenChange, onUpdate }: AppealReviewDialogProps) {
  const { user } = useAuth();
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!appeal) return null;

  const handleDecision = async (decision: 'approved' | 'denied') => {
    if (!user) return;
    
    setProcessing(true);
    
    try {
      if (decision === 'approved') {
        // Overturn ban - update status to expired
        const { error: banUpdateError } = await supabase
          .from('user_bans')
          .update({ 
            status: 'expired',
            updated_at: new Date().toISOString()
          })
          .eq('id', appeal.ban_id);
        
        if (banUpdateError) throw banUpdateError;
      }
      
      // Update appeal status
      const { error: updateError } = await supabase
        .from('ban_appeals')
        .update({
          status: decision,
          reviewed_by_admin_id: user.id,
          admin_notes: adminNotes || null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', appeal.id);
      
      if (updateError) throw updateError;
      
      // Notify user
      await supabase
        .from('notifications')
        .insert({
          user_id: appeal.ban.user_id,
          type: 'APPEAL_DECISION',
          title: `Ban Appeal ${decision === 'approved' ? 'Approved' : 'Denied'}`,
          message: decision === 'approved' 
            ? 'Your ban has been lifted. Welcome back!'
            : 'Your appeal has been reviewed and the ban will remain in effect.',
          metadata: { appeal_id: appeal.id, decision }
        });
      
      toast.success(`Appeal ${decision}`);
      onOpenChange(false);
      onUpdate();
    } catch (error) {
      toast.error("Failed to process appeal");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Ban Appeal Review
          </DialogTitle>
          <DialogDescription>
            Review the AI's decision and the user's appeal justification
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ban Details */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <h3 className="font-semibold">Ban Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Reason:</span>
                <Badge variant="destructive" className="ml-2">
                  {appeal.ban.reason}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">AI Severity:</span>
                <span className="ml-2 font-medium">{appeal.ban.severity_score}/10</span>
              </div>
              <div>
                <span className="text-muted-foreground">Expires:</span>
                <span className="ml-2">{format(new Date(appeal.ban.expires_at), 'PPp')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Appeal Submitted:</span>
                <span className="ml-2">{format(new Date(appeal.created_at), 'PPp')}</span>
              </div>
            </div>
          </div>

          {/* Blocked Message */}
          <div>
            <h3 className="font-semibold mb-2">Blocked Message</h3>
            <div className="bg-background border p-3 rounded italic text-sm">
              "{appeal.ban.offending_message_content}"
            </div>
          </div>

          {/* User's Appeal */}
          <div>
            <h3 className="font-semibold mb-2">User's Justification</h3>
            <div className="bg-background border p-3 rounded text-sm">
              {appeal.user_justification}
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <h3 className="font-semibold mb-2">Admin Notes (Optional)</h3>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any notes about your decision..."
              className="min-h-[80px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => handleDecision('denied')}
              disabled={processing}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Uphold Ban
            </Button>
            <Button
              onClick={() => handleDecision('approved')}
              disabled={processing}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Overturn Ban
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}