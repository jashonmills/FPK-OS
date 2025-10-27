import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetCard } from "./WidgetCard";
import { TrendingUp, Users } from "lucide-react";

interface TrendingCircle {
  circle_id: string;
  circle_name: string;
  circle_description: string;
  activity_score: number;
  member_count: number;
}

interface TrendingCirclesWidgetProps {
  onSelectCircle: (circleId: string) => void;
}

export const TrendingCirclesWidget = ({ onSelectCircle }: TrendingCirclesWidgetProps) => {
  const [trendingCircles, setTrendingCircles] = useState<TrendingCircle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingCircles();
  }, []);

  const fetchTrendingCircles = async () => {
    try {
      const { data, error } = await supabase.rpc("get_trending_circles", {
        limit_count: 5,
      });

      if (error) throw error;
      setTrendingCircles(data || []);
    } catch (error) {
      console.error("Error fetching trending circles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <WidgetCard title="Trending Circles" icon={<TrendingUp className="h-4 w-4" />}>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </WidgetCard>
    );
  }

  if (trendingCircles.length === 0) {
    return (
      <WidgetCard title="Trending Circles" icon={<TrendingUp className="h-4 w-4" />}>
        <p className="text-sm text-muted-foreground">No trending circles yet.</p>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard
      title="Trending Circles"
      icon={<TrendingUp className="h-4 w-4" />}
    >
      <div className="space-y-3">
        {trendingCircles.map((circle) => (
          <Button
            key={circle.circle_id}
            variant="ghost"
            className="w-full justify-start h-auto p-3 hover:bg-accent"
            onClick={() => onSelectCircle(circle.circle_id)}
          >
            <div className="flex items-start gap-3 w-full text-left">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{circle.circle_name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {circle.circle_description}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {circle.member_count} members
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {circle.activity_score} posts this week
                  </span>
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </WidgetCard>
  );
};
