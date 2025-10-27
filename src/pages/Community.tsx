import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, Users, LogOut, Menu } from "lucide-react";
import CircleList from "@/components/community/CircleList";
import PostFeed from "@/components/community/PostFeed";
import CreatePersonaDialog from "@/components/community/CreatePersonaDialog";
import { ProductTour } from "@/components/tour/ProductTour";

const Community = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);
  const [hasPersona, setHasPersona] = useState(false);
  const [checkingPersona, setCheckingPersona] = useState(true);
  const [showCreatePersona, setShowCreatePersona] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleCircleSelect = (circleId: string) => {
    setSelectedCircleId(circleId);
    setSidebarOpen(false); // Close mobile menu when circle is selected
  };

  if (authLoading || checkingPersona) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="p-4 sm:p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold text-primary">FPK Nexus</h1>
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
        onSelectCircle={handleCircleSelect}
      />
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold text-primary">FPK Nexus</h1>
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
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 border-r border-border flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden mt-[57px] lg:mt-0">
        {selectedCircleId ? (
          <PostFeed circleId={selectedCircleId} />
        ) : (
          <div className="flex h-full items-center justify-center p-4 sm:p-8">
            <div className="text-center space-y-4 max-w-md animate-fade-in">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto" />
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                Welcome to FPK Nexus
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Select a circle to start connecting with your community, or create a new circle to begin your journey.
              </p>
            </div>
          </div>
        )}
      </main>

      <CreatePersonaDialog
        open={showCreatePersona}
        onOpenChange={setShowCreatePersona}
        onPersonaCreated={() => setHasPersona(true)}
      />

      {/* Product Tour */}
      <ProductTour selectedCircleId={selectedCircleId} />
    </div>
  );
};

export default Community;
