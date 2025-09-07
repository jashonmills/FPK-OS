import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Users, BookOpen, LogIn, UserPlus, Shield, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface OrganizationData {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  slug: string;
  plan: string;
  seat_cap: number;
  created_at: string;
}

export default function OrgLanding() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [memberRole, setMemberRole] = useState<string | null>(null);

  useEffect(() => {
    if (orgSlug) {
      fetchOrganization();
    }
  }, [orgSlug]);

  useEffect(() => {
    if (user && organization) {
      checkMembership();
    }
  }, [user, organization]);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, description, logo_url, slug, plan, seat_cap, created_at')
        .eq('slug', orgSlug)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Organization not found');
      }

      setOrganization(data);
    } catch (error: any) {
      console.error('Error fetching organization:', error);
      setError('Organization not found or no longer available.');
    } finally {
      setLoading(false);
    }
  };

  const checkMembership = async () => {
    if (!user || !organization) return;

    try {
      const { data } = await supabase
        .from('org_members')
        .select('role, status')
        .eq('org_id', organization.id)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (data) {
        setIsMember(true);
        setMemberRole(data.role);
      }
    } catch (error) {
      console.error('Error checking membership:', error);
    }
  };

  const handleGoToDashboard = () => {
    if (memberRole === 'owner' || memberRole === 'instructor') {
      navigate('/dashboard/instructor');
    } else {
      navigate('/dashboard/learner');
    }
  };

  const handleAuthWithOrg = (mode: 'login' | 'signup') => {
    // Store org context and redirect to auth
    sessionStorage.setItem('orgContext', JSON.stringify({
      orgId: organization?.id,
      orgSlug: organization?.slug,
      orgName: organization?.name
    }));
    navigate(`/login?org=${orgSlug}`);
  };

  const handleJoinWithCode = () => {
    navigate(`/join?org=${orgSlug}`);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fpk-purple to-fpk-amber">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="w-32 h-10 mb-8" />
          <div className="max-w-4xl mx-auto text-center">
            <Skeleton className="w-24 h-24 rounded-full mx-auto mb-6" />
            <Skeleton className="w-96 h-12 mx-auto mb-4" />
            <Skeleton className="w-64 h-6 mx-auto mb-8" />
            <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fpk-purple to-fpk-amber flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto shadow-2xl">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Organization Not Found</CardTitle>
            <CardDescription>
              The organization you're looking for doesn't exist or is no longer available.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: 'url(https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/home-page-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-fpk-purple/80 to-fpk-amber/80">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button variant="ghost" asChild className="text-white hover:bg-white/20">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to FPK University
              </Link>
            </Button>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            {/* Organization Header */}
            <div className="mb-12">
              {organization.logo_url ? (
                <img
                  src={organization.logo_url}
                  alt={`${organization.name} logo`}
                  className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white/20 shadow-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-white/20 flex items-center justify-center border-4 border-white/20">
                  <Users className="w-12 h-12 text-white" />
                </div>
              )}
              
              <h1 className="text-5xl font-bold text-white mb-4">
                {organization.name}
              </h1>
              
              {organization.description && (
                <p className="text-white/80 text-xl leading-relaxed max-w-2xl mx-auto mb-6">
                  {organization.description}
                </p>
              )}

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                  {organization.plan.charAt(0).toUpperCase() + organization.plan.slice(1)} Plan
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                  Up to {organization.seat_cap} Students
                </Badge>
              </div>
            </div>

            {/* Member Dashboard Access */}
            {user && isMember ? (
              <div className="mb-8">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm max-w-md mx-auto">
                  <CardContent className="p-6 text-center">
                    <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Welcome back!
                    </h3>
                    <p className="text-white/80 mb-4">
                      You're a {memberRole} of {organization.name}
                    </p>
                    <Button 
                      onClick={handleGoToDashboard}
                      className="bg-fpk-orange hover:bg-fpk-orange/90 text-white"
                    >
                      Go to Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Action Cards for Non-Members */
              <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto mb-12">
                {/* Sign In / Sign Up Card */}
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-2xl hover:bg-white/15 transition-colors">
                  <CardHeader className="text-center pb-4">
                    <LogIn className="w-12 h-12 text-white mx-auto mb-4" />
                    <CardTitle className="text-white text-xl">Sign In / Create Account</CardTitle>
                    <CardDescription className="text-white/80">
                      Access your account to join this organization or create a new account to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      onClick={() => handleAuthWithOrg('login')}
                      className="w-full bg-fpk-orange hover:bg-fpk-orange/90 text-white font-semibold"
                    >
                      Sign In / Sign Up
                    </Button>
                  </CardContent>
                </Card>

                {/* Join with Invite Code Card */}
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-2xl hover:bg-white/15 transition-colors">
                  <CardHeader className="text-center pb-4">
                    <UserPlus className="w-12 h-12 text-white mx-auto mb-4" />
                    <CardTitle className="text-white text-xl">Join with Invite Code</CardTitle>
                    <CardDescription className="text-white/80">
                      Have an invitation code from your instructor? Enter it here to join this organization.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      onClick={handleJoinWithCode}
                      variant="outline"
                      className="w-full border-white/30 text-white bg-white/10 hover:bg-white/20 font-semibold"
                    >
                      Enter Invite Code
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Organization Features */}
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-8 h-8 text-white mx-auto mb-3" />
                  <h4 className="text-white font-semibold mb-2">Learning Resources</h4>
                  <p className="text-white/70 text-sm">
                    Access curated courses, materials, and assignments tailored to your learning path.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-white mx-auto mb-3" />
                  <h4 className="text-white font-semibold mb-2">Community Learning</h4>
                  <p className="text-white/70 text-sm">
                    Connect with classmates and instructors in a collaborative learning environment.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-white mx-auto mb-3" />
                  <h4 className="text-white font-semibold mb-2">Progress Tracking</h4>
                  <p className="text-white/70 text-sm">
                    Monitor your learning progress with detailed analytics and goal tracking.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Footer Info */}
            <div className="mt-12 text-center">
              <p className="text-white/60 text-sm">
                Powered by FPK University • A personalized learning platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}