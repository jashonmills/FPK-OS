import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(2, 'Title/Position is required'),
  bio: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupWithInvitation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [inviteToken, setInviteToken] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [orgName, setOrgName] = useState<string>('');

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: '',
      title: '',
      bio: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  useEffect(() => {
    // Retrieve invitation context from localStorage
    const token = localStorage.getItem('pendingInvite');
    const invitedEmail = localStorage.getItem('pendingInviteEmail');
    const organization = localStorage.getItem('pendingInviteOrgName');

    if (!token || !invitedEmail) {
      toast({ 
        title: 'Invalid Access', 
        description: 'No invitation found. Please use the invitation link from your email.', 
        variant: 'destructive' 
      });
      navigate('/login');
      return;
    }

    setInviteToken(token);
    setEmail(invitedEmail);
    setOrgName(organization || 'the organization');
  }, [navigate, toast]);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/org/join?token=${inviteToken}`,
          data: {
            full_name: data.full_name,
            title: data.title,
            bio: data.bio,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Step 2: Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: data.full_name,
          display_name: data.full_name.split(' ')[0], // Use first name as display name
          job_title: data.title,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue even if profile creation fails - it might already exist
      }

      // Step 3: Accept the organization invitation
      const { data: inviteData, error: inviteError } = await supabase.functions.invoke('accept-org-invite', {
        body: { token: inviteToken }
      });

      if (inviteError) throw inviteError;
      if (!inviteData.success) throw new Error(inviteData.error || 'Failed to join organization');

      // Clear localStorage
      localStorage.removeItem('pendingInvite');
      localStorage.removeItem('pendingInviteEmail');
      localStorage.removeItem('pendingInviteOrgName');

      // Success! Redirect to org dashboard
      toast({
        title: 'Welcome!',
        description: `Your account has been created and you've joined ${orgName}.`,
      });

      navigate(`/org/${inviteData.org_id}`, { 
        state: { 
          showWelcomeToast: true,
          isFirstLogin: true 
        } 
      });

    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'There was an error creating your account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <UserPlus className="h-6 w-6" />
            <CardTitle className="text-2xl">Join {orgName}</CardTitle>
          </div>
          <CardDescription>
            Create your account to join the organization
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              You've been invited to join <strong>{orgName}</strong> as a staff member.
              Complete this form to create your account and start collaborating.
            </AlertDescription>
          </Alert>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                This email is from your invitation and cannot be changed.
              </p>
            </div>

            {/* Account Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  {...form.register('full_name')}
                  placeholder="John Doe"
                />
                {form.formState.errors.full_name && (
                  <p className="text-sm text-destructive">{form.formState.errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title/Position *</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  placeholder="e.g., Math Instructor"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio (Optional)</Label>
              <Textarea
                id="bio"
                {...form.register('bio')}
                placeholder="Tell us a bit about yourself..."
                rows={3}
              />
            </div>

            <Separator className="my-4" />

            {/* Password */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register('password')}
                  placeholder="••••••••"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...form.register('confirmPassword')}
                  placeholder="••••••••"
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={form.watch('agreeToTerms')}
                onCheckedChange={(checked) => form.setValue('agreeToTerms', checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the <a href="/terms" target="_blank" className="underline">Terms of Service</a> and{' '}
                <a href="/privacy" target="_blank" className="underline">Privacy Policy</a>
              </label>
            </div>
            {form.formState.errors.agreeToTerms && (
              <p className="text-sm text-destructive">{form.formState.errors.agreeToTerms.message}</p>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account & Join Organization'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
