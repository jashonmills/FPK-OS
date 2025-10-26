import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Lock } from "lucide-react";
import CreateCircleDialog from "./CreateCircleDialog";

interface Circle {
  id: string;
  name: string;
  description: string | null;
  is_private: boolean;
}

interface CircleListProps {
  selectedCircleId: string | null;
  onSelectCircle: (circleId: string) => void;
}

const CircleList = ({ selectedCircleId, onSelectCircle }: CircleListProps) => {
  const { user } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchCircles();
  }, [user]);

  const fetchCircles = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch circles the user is a member of
      const { data, error } = await supabase
        .from("circle_members")
        .select(`
          circle_id,
          circles (
            id,
            name,
            description,
            is_private
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const circleData = data
        .map((item: any) => item.circles)
        .filter((circle: any) => circle !== null) as Circle[];

      setCircles(circleData);
    } catch (error) {
      console.error("Error fetching circles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-sidebar-border">
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Circle
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {circles.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No circles yet. Create one to get started!
            </p>
          ) : (
            circles.map((circle) => (
              <button
                key={circle.id}
                onClick={() => onSelectCircle(circle.id)}
                className={`w-full text-left p-3 rounded-lg transition-smooth hover:bg-sidebar-accent ${
                  selectedCircleId === circle.id
                    ? "bg-sidebar-accent shadow-soft"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">
                        {circle.name}
                      </h3>
                      {circle.is_private && (
                        <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                    {circle.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {circle.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      <CreateCircleDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCircleCreated={fetchCircles}
      />
    </div>
  );
};

export default CircleList;
