import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Users, LogOut } from "lucide-react";
import CircleList from "@/components/community/CircleList";
import PostFeed from "@/components/community/PostFeed";
import CreatePersonaDialog from "@/components/community/CreatePersonaDialog";

const Community = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);
  const [hasPersona, setHasPersona] = useState(false);
  const [checkingPersona, setCheckingPersona] = useState(true);
  const [showCreatePersona, setShowCreatePersona] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkPersona = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("personas")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (error) {
        console.error("Error checking persona:", error);
        setCheckingPersona(false);
        return;
      }

      setHasPersona(data && data.length > 0);
      setCheckingPersona(false);

      // Show create persona dialog if no persona exists
      if (!data || data.length === 0) {
        setShowCreatePersona(true);
      }
    };

    checkPersona();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (authLoading || checkingPersona) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-80 border-r border-border bg-sidebar flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-primary">FPK Nexus</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Your safe community space
          </p>
        </div>

        <CircleList
          selectedCircleId={selectedCircleId}
          onSelectCircle={setSelectedCircleId}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {selectedCircleId ? (
          <PostFeed circleId={selectedCircleId} />
        ) : (
          <div className="flex h-full items-center justify-center p-8">
            <div className="text-center space-y-4 max-w-md animate-fade-in">
              <Users className="h-16 w-16 text-muted-foreground mx-auto" />
              <h2 className="text-2xl font-semibold text-foreground">
                Welcome to FPK Nexus
              </h2>
              <p className="text-muted-foreground">
                Select a circle from the sidebar to start connecting with your community,
                or create a new circle to begin your journey.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Create Persona Dialog */}
      <CreatePersonaDialog
        open={showCreatePersona}
        onOpenChange={setShowCreatePersona}
        onPersonaCreated={() => setHasPersona(true)}
      />
    </div>
  );
};

export default Community;
