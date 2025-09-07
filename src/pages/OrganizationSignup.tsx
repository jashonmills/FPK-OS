import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SUBSCRIPTION_TIERS } from '@/types/organization';
import { ArrowLeft, Upload, Users, Crown, Star, Zap } from 'lucide-react';
import type { OrgSubscriptionTier } from '@/types/organization';

export default function OrganizationSignup() {
  const [orgData, setOrgData] = useState({
    name: '',
    description: '',
    selectedTier: 'beta' as OrgSubscriptionTier
  });
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect authenticated users to instructor dashboard if they already have an org
  useEffect(() => {
    if (user && !loading) {
      // Check if user already owns an organization
      checkExistingOrganization();
    }
  }, [user, loading]);

  const checkExistingOrganization = async () => {
    try {
      const { data } = await supabase
        .from('organizations')
        .select('id, slug')
        .eq('owner_id', user?.id)
        .maybeSingle();
      
      if (data) {
        toast({
          title: 'Organization exists',
          description: 'You already have an organization. Redirecting to your dashboard.',
        });
        navigate('/dashboard/instructor');
      }
    } catch (error) {
      console.error('Error checking existing organization:', error);
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `org-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  };

  const handleSignUp = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.displayName,
            display_name: signUpData.displayName,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });

      if (error) throw error;
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validation
      if (!orgData.name.trim()) {
        throw new Error('Organization name is required.');
      }

      if (!user) {
        // Validate sign up data
        if (!signUpData.email || !signUpData.password || !signUpData.displayName) {
          throw new Error('Please fill in all account fields.');
        }
        if (signUpData.password !== signUpData.confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (signUpData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }

        // Sign up the user first
        const signUpSuccess = await handleSignUp();
        if (!signUpSuccess) return;

        // Wait for auth state to update
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Upload logo if provided
      let logoUrl: string | null = null;
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
      }

      // Generate unique slug
      let slug = generateSlug(orgData.name);
      let slugCount = 0;
      
      while (true) {
        const { data: existingOrg } = await supabase
          .from('organizations')
          .select('id')
          .eq('slug', slugCount === 0 ? slug : `${slug}-${slugCount}`)
          .maybeSingle();
        
        if (!existingOrg) {
          slug = slugCount === 0 ? slug : `${slug}-${slugCount}`;
          break;
        }
        slugCount++;
      }

      // Get tier info
      const tierInfo = SUBSCRIPTION_TIERS[orgData.selectedTier];

      // Create organization using RPC function or direct insert
      const { data: orgResult, error: orgError } = await supabase.rpc('create_organization', {
        p_name: orgData.name,
        p_slug: slug,
        p_plan: orgData.selectedTier
      }).single();

      if (orgError) {
        // Fallback to direct insert if RPC doesn't exist
        const { data: newOrg, error: directError } = await supabase
          .from('organizations')
          .insert({
            name: orgData.name,
            slug: slug,
            description: orgData.description || null,
            logo_url: logoUrl,
            plan: orgData.selectedTier,
            subscription_tier: orgData.selectedTier,
            seat_cap: tierInfo.seats,
            instructor_limit: tierInfo.instructors,
            owner_id: user?.id || (await supabase.auth.getUser()).data.user?.id
          })
          .select()
          .single();

        if (directError) throw directError;

        // Create owner membership
        await supabase
          .from('org_members')
          .insert({
            org_id: newOrg.id,
            user_id: user?.id || (await supabase.auth.getUser()).data.user?.id,
            role: 'owner',
            status: 'active'
          });
      }

      toast({
        title: 'Organization created successfully!',
        description: `Welcome to ${orgData.name}! You can now manage your organization and invite members.`,
      });

      // Redirect to instructor dashboard
      navigate('/dashboard/instructor');

    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTierIcon = (tier: OrgSubscriptionTier) => {
    switch (tier) {
      case 'basic': return <Users className="w-5 h-5" />;
      case 'standard': return <Crown className="w-5 h-5" />;
      case 'premium': return <Star className="w-5 h-5" />;
      case 'beta': return <Zap className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

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

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Create Your Organization
            </h1>
            <p className="text-white/80 text-lg">
              Set up your learning organization and start managing students, instructors, and courses.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Organization Details */}
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>
                  Tell us about your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name *</Label>
                  <Input
                    id="org-name"
                    placeholder="Enter organization name"
                    value={orgData.name}
                    onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org-description">Description</Label>
                  <Textarea
                    id="org-description"
                    placeholder="Describe your organization (optional)"
                    value={orgData.description}
                    onChange={(e) => setOrgData({ ...orgData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org-logo">Organization Logo</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="org-logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    />
                    <Upload className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload a logo for your organization (optional)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Plan Selection */}
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle>Choose Your Plan</CardTitle>
                <CardDescription>
                  Select the plan that fits your organization's needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(SUBSCRIPTION_TIERS).map(([tier, info]) => (
                    <Card 
                      key={tier}
                      className={`cursor-pointer border-2 transition-colors ${
                        orgData.selectedTier === tier 
                          ? 'border-fpk-orange bg-fpk-orange/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setOrgData({ ...orgData, selectedTier: tier as OrgSubscriptionTier })}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getTierIcon(tier as OrgSubscriptionTier)}
                            <div>
                              <h3 className="font-semibold">{info.name}</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">
                                  ${info.price}
                                </span>
                                {info.price > 0 && <span className="text-muted-foreground">/month</span>}
                                {'isBeta' in info && info.isBeta && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Free Beta
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div>{info.seats} students</div>
                            <div>{info.instructors} instructors</div>
                          </div>
                        </div>
                        <ul className="text-sm space-y-1">
                          {info.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-fpk-orange rounded-full flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Section - Only show if not logged in */}
          {!user && (
            <Card className="mt-8 shadow-2xl">
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
                <CardDescription>
                  You'll be the owner of this organization. Already have an account?{' '}
                  <Link to="/login" className="text-fpk-orange hover:underline font-medium">
                    Sign in here
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="account-name">Your Name *</Label>
                  <Input
                    id="account-name"
                    placeholder="Enter your full name"
                    value={signUpData.displayName}
                    onChange={(e) => setSignUpData({ ...signUpData, displayName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-email">Email *</Label>
                  <Input
                    id="account-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-password">Password *</Label>
                  <Input
                    id="account-password"
                    type="password"
                    placeholder="Create a password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-confirm">Confirm Password *</Label>
                  <Input
                    id="account-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              size="lg"
              className="bg-fpk-orange hover:bg-fpk-orange/90 text-white px-12 py-4 text-lg font-semibold"
            >
              {isLoading ? 'Creating Organization...' : 'Create Organization'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}