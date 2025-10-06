import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Code, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function OrgInviteDebug() {
  const { orgId } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [emailInvites, setEmailInvites] = useState<any[]>([]);
  const [codeInvites, setCodeInvites] = useState<any[]>([]);

  useEffect(() => {
    loadInvites();
  }, [orgId]);

  const loadInvites = async () => {
    try {
      // Load email invites
      const { data: emails } = await supabase
        .from('user_invites')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      // Load code invites
      const { data: codes } = await supabase
        .from('org_invites')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      setEmailInvites(emails || []);
      setCodeInvites(codes || []);
    } catch (error) {
      console.error('Error loading invites:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  const testInvite = (token: string, type: 'email' | 'code') => {
    const url = `${window.location.origin}/org/join?token=${token}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Invitation Debug Panel</h1>
        <p className="text-muted-foreground">View and test all invitations for this organization</p>
      </div>

      {/* Email Invitations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <CardTitle>Email Invitations (user_invites)</CardTitle>
            </div>
            <Badge>{emailInvites.length}</Badge>
          </div>
          <CardDescription>
            Token-based invitations sent via email
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailInvites.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No email invitations found</p>
          ) : (
            <div className="space-y-4">
              {emailInvites.map((invite) => (
                <div key={invite.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{invite.invited_email}</span>
                      <Badge variant={invite.is_used ? 'secondary' : 'default'}>
                        {invite.is_used ? 'Used' : 'Active'}
                      </Badge>
                      <Badge variant="outline" className="capitalize">{invite.role}</Badge>
                    </div>
                    {invite.is_used && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Token: <code className="text-xs">{invite.invite_token}</code></p>
                    <p>Expires: {format(new Date(invite.expires_at), 'PPp')}</p>
                    {invite.used_at && <p>Used: {format(new Date(invite.used_at), 'PPp')}</p>}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(invite.invite_token, 'Token')}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Token
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testInvite(invite.invite_token, 'email')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Test Link
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(
                        `${window.location.origin}/org/join?token=${invite.invite_token}`,
                        'Full URL'
                      )}
                    >
                      Copy Full URL
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Code Invitations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              <CardTitle>Code Invitations (org_invites)</CardTitle>
            </div>
            <Badge>{codeInvites.length}</Badge>
          </div>
          <CardDescription>
            Shareable codes for multiple users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {codeInvites.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No code invitations found</p>
          ) : (
            <div className="space-y-4">
              {codeInvites.map((invite) => (
                <div key={invite.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{invite.code}</span>
                      <Badge variant={invite.uses_count >= invite.max_uses ? 'secondary' : 'default'}>
                        {invite.uses_count}/{invite.max_uses} uses
                      </Badge>
                      <Badge variant="outline" className="capitalize">{invite.role}</Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Code: <code className="text-xs">{invite.code}</code></p>
                    <p>Expires: {format(new Date(invite.expires_at), 'PPp')}</p>
                    <p>Status: {invite.status}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(invite.code, 'Code')}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Code
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testInvite(invite.code, 'code')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Test Link
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(
                        `${window.location.origin}/org/join?token=${invite.code}`,
                        'Full URL'
                      )}
                    >
                      Copy Full URL
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-sm">Quick Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>Email Invitations:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Click "Copy Full URL" for any active email invite</li>
            <li>Open in incognito/private window</li>
            <li>Should redirect to /org/join with token pre-filled</li>
            <li>Login with the invited email address</li>
            <li>Click "Join Organization"</li>
          </ol>
          
          <p className="mt-4"><strong>Code Invitations:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Click "Copy Code" for any active code invite</li>
            <li>Navigate to /org/join</li>
            <li>Paste code into the input field</li>
            <li>Click "Join Organization"</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
