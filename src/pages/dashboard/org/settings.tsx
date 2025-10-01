import React from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const orgSettingsSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  logo_url: z.string().optional(),
  plan: z.enum(['basic', 'standard', 'premium', 'beta']),
  seat_cap: z.number().min(1, 'Seat capacity must be at least 1'),
  instructor_limit: z.number().min(1, 'Instructor limit must be at least 1'),
  // Additional settings
  invites_enabled: z.boolean(),
  join_policy: z.enum(['open', 'invite_only', 'closed']),
  default_role: z.enum(['student', 'instructor']),
});

type OrgSettingsFormData = z.infer<typeof orgSettingsSchema>;

export default function OrgSettingsPage() {
  const { currentOrg, getUserRole } = useOrgContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userRole = getUserRole();

  // Sanitize organization name for display
  const sanitizeOrgName = (name: string) => {
    const firstLine = name.split(/\n|at |https?:\/\//)[0].trim();
    return firstLine;
  };

  const currentOrgName = currentOrg?.organizations?.name || '';
  const sanitizedName = sanitizeOrgName(currentOrgName);

  const form = useForm<OrgSettingsFormData>({
    resolver: zodResolver(orgSettingsSchema),
    defaultValues: {
      name: sanitizedName,
      description: '',
      logo_url: '',
      plan: (currentOrg?.organizations?.plan as any) || 'basic',
      seat_cap: 50,
      instructor_limit: 20,
      invites_enabled: true,
      join_policy: 'invite_only',
      default_role: 'student',
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<OrgSettingsFormData>) => {
      if (!currentOrg) throw new Error('No organization selected');
      
      const { error } = await supabase
        .from('organizations')
        .update({
          name: data.name,
          description: data.description,
          logo_url: data.logo_url,
          seat_cap: data.seat_cap,
          instructor_limit: data.instructor_limit,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentOrg.organization_id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-organizations'] });
      toast({
        title: "Success",
        description: "Organization settings updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update organization settings.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OrgSettingsFormData) => {
    updateSettingsMutation.mutate(data);
  };

  if (!currentOrg) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Organization Selected</h1>
          <p className="text-muted-foreground">Please select an organization to view settings.</p>
        </div>
      </div>
    );
  }

  const isOwner = userRole === 'owner';
  const canEdit = isOwner;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Organization Settings</h1>
          <p className="text-white/80 drop-shadow">Manage your organization configuration</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-orange-500/65 border-orange-400/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription className="text-white/80">
                Update your organization's basic details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Organization Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!canEdit} className="bg-white/20 border-white/30 text-white placeholder:text-white/70" placeholder="Enter organization name" />
                    </FormControl>
                    {currentOrgName !== sanitizedName && (
                      <FormDescription className="text-amber-200">
                        Current name contains error text. Please update to the correct name.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        disabled={!canEdit}
                        placeholder="Describe your organization..."
                        rows={3}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      />
                    </FormControl>
                    <FormDescription className="text-white/70">
                      A brief description of your organization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Logo URL</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={!canEdit}
                        placeholder="https://example.com/logo.png"
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      />
                    </FormControl>
                    <FormDescription className="text-white/70">
                      URL to your organization's logo image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Capacity Settings */}
          <Card className="bg-orange-500/65 border-orange-400/50">
            <CardHeader>
              <CardTitle className="text-white">Capacity & Limits</CardTitle>
              <CardDescription className="text-white/80">
                Configure seat and instructor limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="seat_cap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Student Seat Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="number"
                          disabled={!isOwner}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                        />
                      </FormControl>
                      <FormDescription className="text-white/70">
                        Maximum number of students
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instructor_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Instructor Limit</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="number"
                          disabled={!isOwner}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                        />
                      </FormControl>
                      <FormDescription className="text-white/70">
                        Maximum number of instructors
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Access Control */}
          <Card className="bg-orange-500/65 border-orange-400/50">
            <CardHeader>
              <CardTitle className="text-white">Access Control</CardTitle>
              <CardDescription className="text-white/80">
                Manage how users can join your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="invites_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/30 bg-white/10 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-white">Enable Invitations</FormLabel>
                      <FormDescription className="text-white/70">
                        Allow creating invitation links for new members
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!canEdit}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="join_policy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Join Policy</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!canEdit}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue placeholder="Select join policy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open - Anyone can join</SelectItem>
                        <SelectItem value="invite_only">Invite Only</SelectItem>
                        <SelectItem value="closed">Closed - No new members</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-white/70">
                      How new members can join your organization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="default_role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Default Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!canEdit}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue placeholder="Select default role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-white/70">
                      Default role assigned to new members
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {canEdit && (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateSettingsMutation.isPending}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Save className="h-4 w-4" />
                {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          )}

          {!canEdit && (
            <Card className="bg-orange-500/65 border-orange-400/50">
              <CardContent className="pt-6">
                <p className="text-center text-white/80">
                  Only organization owners can modify these settings.
                </p>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
}