import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Circle {
  id: string;
  name: string;
  description: string;
  member_count?: number;
}

interface WelcomeOnboardingProps {
  onCircleJoined: () => void;
}

export const WelcomeOnboarding = ({ onCircleJoined }: WelcomeOnboardingProps) => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningCircles, setJoiningCircles] = useState<Set<string>>(new Set());
  const [joinedCircles, setJoinedCircles] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchDefaultCircles();
  }, []);

  const fetchDefaultCircles = async () => {
    try {
      const { data, error } = await supabase
        .from("circles")
        .select(`
          id,
          name,
          description,
          circle_members(count)
        `)
        .eq("is_default_circle", true)
        .eq("is_private", false);

      if (error) throw error;

      const circlesWithCount = data.map((circle: any) => ({
        id: circle.id,
        name: circle.name,
        description: circle.description,
        member_count: circle.circle_members[0]?.count || 0,
      }));

      setCircles(circlesWithCount);
    } catch (error) {
      console.error("Error fetching default circles:", error);
      toast({
        title: "Error",
        description: "Failed to load community circles. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCircle = async (circleId: string) => {
    if (!user) return;

    setJoiningCircles(prev => new Set(prev).add(circleId));

    try {
      const { error } = await supabase
        .from("circle_members")
        .insert({
          circle_id: circleId,
          user_id: user.id,
          role: "MEMBER",
        });

      if (error) {
        // Check if already a member
        if (error.code === "23505") {
          setJoinedCircles(prev => new Set(prev).add(circleId));
        } else {
          throw error;
        }
      } else {
        setJoinedCircles(prev => new Set(prev).add(circleId));
        toast({
          title: "Success!",
          description: "You've joined the circle.",
        });
        onCircleJoined();
      }
    } catch (error) {
      console.error("Error joining circle:", error);
      toast({
        title: "Error",
        description: "Failed to join circle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setJoiningCircles(prev => {
        const next = new Set(prev);
        next.delete(circleId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full items-start justify-center p-4 sm:p-8 overflow-y-auto">
      <div className="w-full max-w-3xl space-y-6 sm:space-y-8 animate-fade-in py-4">
        {/* Header */}
        <div className="text-center space-y-3">
          <Users className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome to FPK Nexus!
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's get you connected. Join a few of our most popular circles to start your journey.
          </p>
        </div>

        {/* Circles Grid */}
        <div className="grid gap-4 sm:gap-6">
          {circles.map((circle) => {
            const isJoining = joiningCircles.has(circle.id);
            const isJoined = joinedCircles.has(circle.id);

            return (
              <Card key={circle.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl">{circle.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {circle.description}
                      </CardDescription>
                      {circle.member_count !== undefined && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {circle.member_count} {circle.member_count === 1 ? "member" : "members"}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => handleJoinCircle(circle.id)}
                      disabled={isJoining || isJoined}
                      size="lg"
                      className="flex-shrink-0"
                    >
                      {isJoining ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Joining...
                        </>
                      ) : isJoined ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Joined
                        </>
                      ) : (
                        "Join Circle"
                      )}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Progress Indicator */}
        {joinedCircles.size > 0 && (
          <div className="text-center space-y-4 p-6 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Great! You've joined {joinedCircles.size} of {circles.length} circles.
            </p>
            <p className="text-xs text-muted-foreground">
              Your feed will automatically update with content from the circles you've joined.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};