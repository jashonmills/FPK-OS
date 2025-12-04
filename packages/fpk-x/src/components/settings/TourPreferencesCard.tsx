import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RotateCcw, Compass } from 'lucide-react';

export const TourPreferencesCard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: tourProgress, isLoading } = useQuery({
    queryKey: ['tour-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_tour_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        const { data: newProgress, error: insertError } = await supabase
          .from('user_tour_progress')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        return newProgress;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  const toggleToursMutation = useMutation({
    mutationFn: async (disabled: boolean) => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('user_tour_progress')
        .update({ tours_disabled: disabled })
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-progress', user?.id] });
      toast.success('Tour preferences updated');
    },
    onError: () => {
      toast.error('Failed to update tour preferences');
    },
  });

  const resetToursMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('user_tour_progress')
        .update({
          has_seen_dashboard_tour: false,
          has_seen_activities_tour: false,
          has_seen_goals_tour: false,
          has_seen_analytics_tour: false,
          has_seen_settings_tour: false,
          has_seen_documents_tour: false,
          tours_disabled: false,
        })
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-progress', user?.id] });
      toast.success('All tours have been reset. Refresh the page to see them again.');
    },
    onError: () => {
      toast.error('Failed to reset tours');
    },
  });

  const handleToggleTours = async (checked: boolean) => {
    setIsUpdating(true);
    await toggleToursMutation.mutateAsync(!checked);
    setIsUpdating(false);
  };

  const handleResetTours = async () => {
    setIsUpdating(true);
    await resetToursMutation.mutateAsync();
    setIsUpdating(false);
  };

  const toursEnabled = !tourProgress?.tours_disabled;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" />
          <CardTitle>Onboarding Tours</CardTitle>
        </div>
        <CardDescription>
          Manage guided tours that help you learn the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="tours-enabled" className="text-base">
              Enable Tours
            </Label>
            <p className="text-sm text-muted-foreground">
              Show guided tours when visiting pages for the first time
            </p>
          </div>
          <Switch
            id="tours-enabled"
            checked={toursEnabled}
            onCheckedChange={handleToggleTours}
            disabled={isLoading || isUpdating}
          />
        </div>

        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleResetTours}
            disabled={isLoading || isUpdating}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All Tours
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This will mark all tours as not seen and re-enable them
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
