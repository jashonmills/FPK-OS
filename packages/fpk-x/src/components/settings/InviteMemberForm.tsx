import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["contributor", "viewer"], {
    required_error: "Please select a role",
  }),
});

interface InviteMemberFormProps {
  familyId: string;
  familyName: string;
}

export const InviteMemberForm = ({ familyId, familyName }: InviteMemberFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "contributor",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check for existing pending invite
      const { data: existingInvite } = await supabase
        .from('invites')
        .select('id')
        .eq('family_id', familyId)
        .eq('invitee_email', values.email)
        .eq('status', 'pending')
        .single();

      if (existingInvite) {
        // Update existing invite with new role and reset expiration
        const { error: updateError } = await supabase
          .from('invites')
          .update({
            role: values.role,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq('id', existingInvite.id);

        if (updateError) throw updateError;
      } else {
        // Create new invite
        const { error: inviteError } = await supabase
          .from('invites')
          .insert({
            family_id: familyId,
            inviter_id: user.id,
            invitee_email: values.email,
            role: values.role,
          });

        if (inviteError) throw inviteError;
      }

      // Call the edge function to send the email
      const { data: emailResponse, error: functionError } = await supabase.functions.invoke('send-invitation', {
        body: {
          email: values.email,
          role: values.role,
          familyId,
          familyName,
        },
      });

      if (functionError) {
        console.error('Email sending error:', functionError);
        console.log('Email response data:', emailResponse);
        
        // Check if it's a subscription limit error
        // When there's an HTTP error, the response body is still in the data field
        if (emailResponse?.upgradeRequired) {
          toast.error(emailResponse.message || 'User limit reached. Please upgrade your plan.', {
            duration: 6000,
            action: {
              label: 'Upgrade',
              onClick: () => window.location.href = '/pricing',
            },
          });
        } else {
          // Email sending failed
          toast.error("Invitation created but email failed to send. Please contact support if this persists.");
        }
      } else {
        toast.success("Invitation sent successfully!");
      }

      // Invalidate queries to refresh the lists
      queryClient.invalidateQueries({ queryKey: ['pending-invites', familyId] });
      queryClient.invalidateQueries({ queryKey: ['family-members', familyId] });
      
      form.reset();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(error.message || "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="colleague@example.com" {...field} />
              </FormControl>
              <FormDescription>
                Enter the email address of the person you'd like to invite
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Role</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-start space-x-3 space-y-0 p-4 border rounded-lg">
                    <FormControl>
                      <RadioGroupItem value="contributor" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-medium">
                        Contributor
                      </FormLabel>
                      <FormDescription>
                        Can view all data, create and edit logs, but cannot delete others' entries or manage settings
                      </FormDescription>
                    </div>
                  </FormItem>
                  <FormItem className="flex items-start space-x-3 space-y-0 p-4 border rounded-lg">
                    <FormControl>
                      <RadioGroupItem value="viewer" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-medium">
                        Viewer
                      </FormLabel>
                      <FormDescription>
                        Can only view data and reports. Cannot create, edit, or delete anything
                      </FormDescription>
                    </div>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Invitation
        </Button>
      </form>
    </Form>
  );
};
