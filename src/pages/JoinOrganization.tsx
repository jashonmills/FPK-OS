import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Users, Shield, BookOpen } from 'lucide-react';

export default function JoinOrganization() {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for URL parameters and prefill code
  useEffect(() => {
    const tokenParam = searchParams.get('token') || searchParams.get('code');
    if (tokenParam) {
      setInviteCode(tokenParam);
      // Auto-validate if user is logged in
      if (user && !loading) {
        validateAndJoin(tokenParam);
      }
    }
  }, [searchParams, user, loading]);

  const validateAndJoin = async (code: string) => {
    if (!code.trim()) {
      setError('Please enter an invitation code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if user is authenticated
      if (!user) {
        setShowAuthModal(true);
        return;
      }

      // Find the invitation by code
      const { data: invitation, error: inviteError } = await supabase
        .from('org_invites')
        .select(`
          *,
          organizations (
            id,
            name,
            description,
            logo_url,
            slug
          )
        `)
        .eq('code', code.trim())
        .gt('expires_at', new Date().toISOString())
        .single();

      if (inviteError || !invitation) {
        throw new Error('Invalid invitation code or expired invitation.');
      }

      // Check if invitation has reached max uses
      if (invitation.uses_count >= invitation.max_uses) {
        throw new Error('This invitation code has reached its maximum usage limit.');
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('org_members')
        .select('id, role, status')
        .eq('org_id', invitation.org_id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingMember) {
        if (existingMember.status === 'active') {
          toast({
            title: 'Already a member',
            description: `You are already a member of ${invitation.organizations.name}.`,
          });
          navigate(`/dashboard/learner`);
          return;
        }
      }

      // Check seat availability
      const { data: members } = await supabase
        .from('org_members')
        .select('id')
        .eq('org_id', invitation.org_id)
        .eq('status', 'active')
        .eq('role', 'student');

      const { data: orgData } = await supabase
        .from('organizations')
        .select('seat_cap')
        .eq('id', invitation.org_id)
        .single();

      if (orgData && members && members.length >= orgData.seat_cap) {
        throw new Error('This organization has reached its maximum capacity. Please contact your instructor.');
      }

      // Add user as member
      const { error: memberError } = await supabase
        .from('org_members')
        .insert({
          org_id: invitation.org_id,
          user_id: user.id,
          role: (invitation.role || 'student') as 'owner' | 'instructor' | 'student',
          status: 'active'
        });

      if (memberError) {
        throw memberError;
      }

      // Update invitation usage
      await supabase
        .from('org_invites')
        .update({
          uses_count: invitation.uses_count + 1
        })
        .eq('id', invitation.id);

      toast({
        title: 'Successfully joined!',
        description: `Welcome to ${invitation.organizations.name}. You can now access your learning dashboard.`,
      });

      // Navigate to learner dashboard
      navigate('/dashboard/learner');

    } catch (error: any) {
      setError(error.message || 'Unable to join organization. Please check your invitation code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    await validateAndJoin(inviteCode);
  };

  const handleAuthAndJoin = () => {
    // Store the invite code in localStorage and redirect to login
    if (inviteCode) {
      localStorage.setItem('pendingInviteCode', inviteCode);
    }
    navigate('/login');
  };

  // If user is not logged in, show auth prompt
  if (!loading && !user && showAuthModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fpk-purple to-fpk-amber flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-fpk-orange mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              You need to sign in to join this organization. Don't worry, we'll remember your invitation code!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-fpk-orange/10 border border-fpk-orange/20 rounded-lg p-4">
              <p className="text-sm text-fpk-orange font-medium">
                Invitation Code: <span className="font-mono">{inviteCode}</span>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={handleAuthAndJoin} className="w-full">
                Sign In / Create Account
              </Button>
              <Button variant="outline" onClick={() => setShowAuthModal(false)} className="w-full">
                Enter Different Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fpk-purple to-fpk-amber">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="text-white hover:bg-white/20">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Join an Organization
            </h1>
            <p className="text-white/80 text-lg">
              Enter your invitation code to join a learning organization and start your educational journey.
            </p>
          </div>

          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center">Enter Invitation Code</CardTitle>
              <CardDescription className="text-center">
                You should have received an invitation code from your instructor or organization administrator.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleJoinOrg} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invitation Code</Label>
                  <Input
                    id="inviteCode"
                    type="text"
                    placeholder="Enter your invitation code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    disabled={isLoading}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    The code is usually 8-12 characters long and may contain letters and numbers.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || !inviteCode.trim()}>
                  {isLoading ? 'Joining Organization...' : 'Join Organization'}
                </Button>
              </form>

              {!user && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Don't have an account yet?
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login">Create Account / Sign In</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Information Cards */}
          <div className="mt-8 grid gap-4">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-white flex-shrink-0" />
                <div className="text-white text-sm">
                  <div className="font-medium">Access Learning Materials</div>
                  <div className="text-white/80">Get instant access to courses, assignments, and resources.</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="w-5 h-5 text-white flex-shrink-0" />
                <div className="text-white text-sm">
                  <div className="font-medium">Connect with Classmates</div>
                  <div className="text-white/80">Join your learning community and collaborate with peers.</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}