import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Clock, CheckCircle, XCircle, FileText, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow, format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface Appeal {
  id: string;
  ban_id: string;
  status: string;
  user_justification: string;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  ban: {
    reason: string;
    offending_message_content: string;
    severity_score: number;
    expires_at: string;
    status: string;
  };
}

export default function MyAppeals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchAppeals();
  }, [user, navigate]);

  const fetchAppeals = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('ban_appeals')
      .select(`
        *,
        ban:user_bans(*)
      `)
      .eq('ban.user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching appeals:', error);
      setLoading(false);
      return;
    }
    
    setAppeals(data as any || []);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Pending Review
        </Badge>;
      case 'approved':
        return <Badge className="flex items-center gap-1 bg-green-500">
          <CheckCircle className="w-3 h-3" />
          Approved
        </Badge>;
      case 'denied':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Denied
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading your appeals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/community')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              My Ban Appeals
            </h1>
            <p className="text-muted-foreground mt-1">
              Track the status of your submitted ban appeals
            </p>
          </div>
        </div>

        {/* Appeals List */}
        {appeals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Appeals Submitted</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You haven't submitted any ban appeals. If you're currently banned, visit the banned page to submit an appeal.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appeals.map((appeal) => (
              <Card key={appeal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>Appeal #{appeal.id.slice(0, 8)}</CardTitle>
                        {getStatusBadge(appeal.status)}
                      </div>
                      <CardDescription>
                        Submitted {formatDistanceToNow(new Date(appeal.created_at), { addSuffix: true })}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ban Details */}
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ban Reason:</span>
                      <Badge variant="destructive">{appeal.ban.reason}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">AI Severity Score:</span>
                      <span className="font-medium">{appeal.ban.severity_score}/10</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ban Status:</span>
                      <Badge variant={appeal.ban.status === 'active' ? 'destructive' : 'secondary'}>
                        {appeal.ban.status}
                      </Badge>
                    </div>
                    {appeal.ban.status === 'active' && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Expires:</span>
                        <span>{formatDistanceToNow(new Date(appeal.ban.expires_at), { addSuffix: true })}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Flagged Message */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Flagged Message</h4>
                    <div className="bg-background border p-3 rounded italic text-sm">
                      "{appeal.ban.offending_message_content}"
                    </div>
                  </div>

                  {/* Your Justification */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Your Justification</h4>
                    <div className="bg-background border p-3 rounded text-sm">
                      {appeal.user_justification}
                    </div>
                  </div>

                  {/* Admin Response */}
                  {appeal.reviewed_at && (
                    <>
                      <Separator />
                      <div className={`p-4 rounded-lg ${
                        appeal.status === 'approved' 
                          ? 'bg-green-500/10 border border-green-500/20' 
                          : 'bg-destructive/10 border border-destructive/20'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {appeal.status === 'approved' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive" />
                          )}
                          <h4 className="font-semibold">
                            {appeal.status === 'approved' ? 'Appeal Approved' : 'Appeal Denied'}
                          </h4>
                        </div>
                        <p className="text-sm mb-2">
                          Reviewed {format(new Date(appeal.reviewed_at), 'PPp')}
                        </p>
                        {appeal.admin_notes && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium mb-1">Admin Notes:</p>
                            <p className="text-sm">{appeal.admin_notes}</p>
                          </div>
                        )}
                        {appeal.status === 'approved' && appeal.ban.status !== 'active' && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                              ✓ Your ban has been lifted. Welcome back!
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Pending Status */}
                  {appeal.status === 'pending_review' && (
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-primary mb-1">Under Review</h4>
                          <p className="text-sm text-muted-foreground">
                            Your appeal is being reviewed by our human moderation team. 
                            We typically respond within 24 hours. You'll receive a notification 
                            when a decision has been made.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">About Appeals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• All appeals are reviewed by human moderators, not AI</p>
            <p>• Review typically takes 24 hours or less</p>
            <p>• You can only submit one appeal per ban</p>
            <p>• Approved appeals result in immediate ban removal</p>
            <p>• Denied appeals mean the original ban remains in effect</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
