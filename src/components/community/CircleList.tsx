import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Lock, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CreateCircleDialog from "./CreateCircleDialog";

interface Circle {
  id: string;
  name: string;
  description: string | null;
  is_private: boolean;
  created_by: string;
  member_count?: number;
}

interface CircleListProps {
  selectedCircleId: string | null;
  onSelectCircle: (circleId: string) => void;
  isCollapsed?: boolean;
}

const CircleList = ({ selectedCircleId, onSelectCircle, isCollapsed = false }: CircleListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteCircleId, setDeleteCircleId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchCircles();
  }, [user]);

  const fetchCircles = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch circles the user is a member of with creator info
      const { data, error } = await supabase
        .from("circle_members")
        .select(`
          circle_id,
          circles (
            id,
            name,
            description,
            is_private,
            created_by
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const circleData = data
        .map((item: any) => item.circles)
        .filter((circle: any) => circle !== null) as Circle[];

      // Fetch member counts for circles created by this user
      const createdCircleIds = circleData
        .filter(c => c.created_by === user.id)
        .map(c => c.id);

      if (createdCircleIds.length > 0) {
        const { data: memberCounts } = await supabase
          .from("circle_members")
          .select("circle_id")
          .in("circle_id", createdCircleIds);

        const countMap = memberCounts?.reduce((acc, m) => {
          acc[m.circle_id] = (acc[m.circle_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        circleData.forEach(circle => {
          if (circle.created_by === user.id) {
            circle.member_count = countMap[circle.id] || 0;
          }
        });
      }

      setCircles(circleData);
    } catch (error) {
      console.error("Error fetching circles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCircle = async () => {
    if (!deleteCircleId) return;

    try {
      const { error } = await supabase
        .from("circles")
        .delete()
        .eq("id", deleteCircleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Circle deleted successfully",
      });

      // If the deleted circle was selected, clear selection
      if (selectedCircleId === deleteCircleId) {
        onSelectCircle(circles.find(c => c.id !== deleteCircleId)?.id || "");
      }

      fetchCircles();
    } catch (error: any) {
      console.error("Error deleting circle:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete circle. Make sure it has no members.",
        variant: "destructive",
      });
    } finally {
      setDeleteCircleId(null);
    }
  };

  // Auto-select first circle when circles are loaded
  useEffect(() => {
    if (circles.length > 0 && !selectedCircleId) {
      onSelectCircle(circles[0].id);
    }
  }, [circles, selectedCircleId, onSelectCircle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div id="circle-list-sidebar" className="flex-1 flex flex-col overflow-hidden">
      {!isCollapsed && (
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
      )}

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {circles.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No circles yet. Create one to get started!
            </p>
          ) : (
            circles.map((circle) => {
              const canDelete = circle.created_by === user?.id && circle.member_count === 0;
              
              return (
                <div
                  key={circle.id}
                  className={`group relative rounded-lg transition-smooth ${
                    selectedCircleId === circle.id ? "bg-sidebar-accent shadow-soft" : ""
                  }`}
                >
                  <button
                    id={circle.name === "Introductions" ? "circle-introductions" : undefined}
                    onClick={() => onSelectCircle(circle.id)}
                    className={`w-full text-left p-3 hover:bg-sidebar-accent rounded-lg ${
                      isCollapsed ? 'flex justify-center' : ''
                    }`}
                    title={isCollapsed ? circle.name : undefined}
                  >
                    {isCollapsed ? (
                      <div className="flex items-center justify-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          selectedCircleId === circle.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          {circle.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <h3 className="font-semibold text-sm break-words overflow-wrap-anywhere">
                              {circle.name}
                            </h3>
                            {circle.is_private && (
                              <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                          {circle.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 break-words">
                              {circle.description}
                            </p>
                          )}
                        </div>
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteCircleId(circle.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <CreateCircleDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCircleCreated={fetchCircles}
      />

      <AlertDialog open={!!deleteCircleId} onOpenChange={() => setDeleteCircleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Circle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this circle? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCircle} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CircleList;
