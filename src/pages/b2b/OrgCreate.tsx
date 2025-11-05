import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Building2, Loader2 } from 'lucide-react';

const orgSchema = z.object({
  orgName: z.string().min(2, 'Organization name must be at least 2 characters'),
  orgType: z.enum(['school', 'district', 'clinic', 'therapy_center'], {
    required_error: 'Please select an organization type',
  }),
});

type OrgFormData = z.infer<typeof orgSchema>;

export const OrgCreate = () => {
  const navigate = useNavigate();
  const { refreshOrganizations } = useOrganization();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrgFormData>({
    resolver: zodResolver(orgSchema),
  });

  const onSubmit = async (data: OrgFormData) => {
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create an organization');
        return;
      }

      // Step 1: Create the organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          org_name: data.orgName,
          org_type: data.orgType,
          created_by: user.id,
          subscription_tier: 'free',
          is_active: true,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Step 2: Create organization membership for current user as org_owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: 'org_owner',
          is_active: true,
          permissions: {
            can_invite: true,
            can_manage_students: true,
            can_view_analytics: true,
          },
        });

      if (memberError) throw memberError;

      // Step 3: Mark profile setup as complete
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ has_completed_profile_setup: true })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        // Non-fatal - don't throw
      }

      toast.success('Organization created successfully!');

      // Refresh the organization context
      await refreshOrganizations();

      // Redirect to dashboard
      navigate('/org/dashboard');
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast.error(error.message || 'Failed to create organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create Your Organization</CardTitle>
          <CardDescription>
            Let's get started by setting up your organization profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                placeholder="e.g., Springfield Elementary School"
                {...register('orgName')}
                disabled={isSubmitting}
              />
              {errors.orgName && (
                <p className="text-sm text-destructive">{errors.orgName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgType">Organization Type</Label>
              <Select
                onValueChange={(value) => setValue('orgType', value as any)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="orgType">
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="district">District</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="therapy_center">Therapy Center</SelectItem>
                </SelectContent>
              </Select>
              {errors.orgType && (
                <p className="text-sm text-destructive">{errors.orgType.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Organization...
                </>
              ) : (
                'Create Organization'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
