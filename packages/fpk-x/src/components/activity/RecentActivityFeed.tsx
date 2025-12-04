import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useClient } from "@/hooks/useClient";
import { Card } from "@/components/ui/card";
import { Loader2, Calendar, AlertCircle, Eye, GraduationCap, Moon } from "lucide-react";
import { format } from "date-fns";

export const RecentActivityFeed = () => {
  const { selectedClient, isNewModel } = useClient();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activity', selectedClient?.id],
    queryFn: async () => {
      if (!selectedClient?.id || !isNewModel) return [];
      
      const { data, error } = await supabase.rpc('get_recent_activity', {
        p_client_id: selectedClient.id
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedClient && isNewModel,
  });

  if (!isNewModel) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No recent activity found. Start logging to see your history here.</p>
      </Card>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'incident': return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'parent_observation': return <Eye className="h-5 w-5 text-primary" />;
      case 'educator_note': return <GraduationCap className="h-5 w-5 text-secondary" />;
      case 'sleep_record': return <Moon className="h-5 w-5 text-accent" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'incident': return 'Incident Log';
      case 'parent_observation': return 'Parent Observation';
      case 'educator_note': return 'Educator Note';
      case 'sleep_record': return 'Sleep Record';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      {activities.map((activity: any, index: number) => (
        <Card key={`${activity.log_type}-${activity.log_date}-${index}`} className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {getIcon(activity.log_type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold">{getTypeLabel(activity.log_type)}</h4>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(activity.log_date), 'MMM d, yyyy')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {activity.summary || 'No summary available'}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
