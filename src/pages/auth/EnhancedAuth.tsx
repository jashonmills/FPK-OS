import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { GraduationCap, Users, BookOpen, Eye, EyeOff } from 'lucide-react';
import type { Role } from '@/types/user';

interface InviteLinkData {
  organization_id: string;
  organization_name: string;
  invited_by: string;
  invitation_code: string;
}

export default function EnhancedAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('learner');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteData, setInviteData] = useState<InviteLinkData | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Check for invite link in URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const inviteCode = searchParams.get('invite');
    
    if (inviteCode) {
      // Validate invite code and get organization info
      validateInviteCode(inviteCode);
    }
  }, [location.search]);

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateInviteCode = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('org_invitations')
        .select(`
          organization_id,
          invitation_code,
          invited_by,
          organizations (name)
        `)
        .eq('invitation_code', code)
        .eq('status', 'pending')
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        toast({
          title: "Invalid Invite",
          description: "This invitation link is invalid or has expired.",
          variant: "destructive"
        });
        return;
      }

      setInviteData({
        organization_id: data.organization_id,
        organization_name: data.organizations?.name || 'Unknown Organization',
        invited_by: data.invited_by,
        invitation_code: code
      });
      
      // Auto-set role to student for invited users
      setSelectedRole('learner');
      
      toast({
        title: "Invitation Found!",
        description: `You've been invited to join ${data.organizations?.name}`,
      });
    } catch (error) {
      console.error('Error validating invite code:', error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Email not confirmed') {
          toast({
            title: "Email Not Confirmed",
            description: "Please check your email and click the confirmation link before signing in.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign In Failed",
            description: error.message,
            variant: "destructive"
          });
        }
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback${inviteData ? `?invite=${inviteData.invitation_code}` : ''}`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            display_name: displayName,
            pending_role: selectedRole,
            invitation_code: inviteData?.invitation_code || null
          }
        }
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Check Your Email",
        description: "We sent you a confirmation email. Please click the link to verify your account.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'learner' as Role,
      title: 'Student/Learner',
      description: 'I want to learn and take courses',
      icon: GraduationCap,
      color: 'bg-blue-500'
    },
    {
      value: 'instructor' as Role,
      title: 'Instructor/Parent',
      description: 'I want to teach or manage students',
      icon: Users,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold">FPK University</h1>
          </div>
          
          {inviteData && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-4 w-4 text-blue-600 mr-2" />
                <Badge variant="secondary">Organization Invite</Badge>
              </div>
              <p className="text-sm text-blue-800">
                You're invited to join <strong>{inviteData.organization_name}</strong>
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <CardHeader className="px-0">
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your FPK University account
                  </CardDescription>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <CardHeader className="px-0">
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    {inviteData 
                      ? `Join ${inviteData.organization_name} on FPK University`
                      : 'Get started with FPK University'
                    }
                  </CardDescription>
                </CardHeader>

                <div className="space-y-4">
                  {!inviteData && (
                    <>
                      <div>
                        <Label>I am a...</Label>
                        <RadioGroup
                          value={selectedRole}
                          onValueChange={(value) => setSelectedRole(value as Role)}
                          className="mt-2"
                        >
                          {roleOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                <RadioGroupItem value={option.value} id={option.value} />
                                <div className={`p-2 rounded-md ${option.color} text-white`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <Label htmlFor={option.value} className="cursor-pointer font-medium">
                                    {option.title}
                                  </Label>
                                  <p className="text-sm text-gray-600">{option.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      </div>
                      <Separator />
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm">
            <Link to="/" className="text-primary hover:underline">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}