import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Users, LogOut, Menu, MessageSquare, LayoutDashboard, Settings } from "lucide-react";
import CircleList from "@/components/community/CircleList";
import PostFeed from "@/components/community/PostFeed";
import CreatePersonaDialog from "@/components/community/CreatePersonaDialog";
import EditProfileDialog from "@/components/community/EditProfileDialog";
import { ProductTour } from "@/components/tour/ProductTour";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ProfileBanner } from "@/components/community/ProfileBanner";
import { WidgetsColumn } from "@/components/community/WidgetsColumn";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

const Community = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);
  const [hasPersona, setHasPersona] = useState(false);
  const [checkingPersona, setCheckingPersona] = useState(true);
  const [showCreatePersona, setShowCreatePersona] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [persona, setPersona] = useState<any>(null);

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
        .select("*")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (error) {
        console.error("Error checking persona:", error);
        setCheckingPersona(false);
        return;
      }

      if (data) {
        setPersona(data);
        setHasPersona(true);
      }
      setCheckingPersona(false);

      if (!data) {
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

  const isPersonalizedHomeEnabled = useFeatureFlag("personalized_home_ui");

  const refetchPersona = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("personas")
      .select("*")
      .eq("user_id", user.id)
      .limit(1)
      .single();
    
    if (data) {
      setPersona(data);
    }
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
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/community/dashboard")}
              title="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/messages")}
              title="Messages"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
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
        <p className="text-sm text-muted-foreground mt-2">
          Your safe community space
        </p>
      </div>

      <CircleList
        selectedCircleId={selectedCircleId}
        onSelectCircle={handleCircleSelect}
      />

      {/* Profile Section at Bottom */}
      {persona && (
        <div className="p-4 border-t border-sidebar-border mt-auto">
          <button
            onClick={() => setShowEditProfile(true)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-smooth"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={persona.avatar_url} alt={persona.display_name} />
              <AvatarFallback>{persona.display_name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left min-w-0">
              <p className="font-medium text-sm truncate">{persona.display_name}</p>
              <p className="text-xs text-muted-foreground">Edit Profile</p>
            </div>
            <Settings className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={`flex h-screen bg-background overflow-hidden ${
      isPersonalizedHomeEnabled 
        ? "grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_320px]" 
        : "flex"
    }`}>
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
          
          <div className="flex gap-2">
            <NotificationBell />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/community/dashboard")}
              title="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/messages")}
              title="Messages"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
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
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 border-r border-border flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden mt-[57px] lg:mt-0 flex flex-col">
        {isPersonalizedHomeEnabled && hasPersona && persona && (
          <ProfileBanner
            bannerUrl={persona.header_image_url}
            displayName={persona.display_name}
            avatarUrl={persona.avatar_url}
          />
        )}
        
        <div className="flex-1 overflow-hidden">
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
        </div>
      </main>

      {/* Right Widgets Column - Only visible on xl screens when feature flag is enabled */}
      {isPersonalizedHomeEnabled && user && (
        <aside className="hidden xl:block w-80 border-l border-border overflow-y-auto">
          <WidgetsColumn userId={user.id} onSelectCircle={handleCircleSelect} />
        </aside>
      )}

      <CreatePersonaDialog
        open={showCreatePersona}
        onOpenChange={setShowCreatePersona}
        onPersonaCreated={() => setHasPersona(true)}
      />

      {persona && (
        <EditProfileDialog
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
          persona={persona}
          onProfileUpdated={refetchPersona}
        />
      )}

      {/* Product Tour */}
      <ProductTour selectedCircleId={selectedCircleId} />
    </div>
  );
};

export default Community;
