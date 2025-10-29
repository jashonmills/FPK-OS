import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Users, LogOut, Menu, MessageSquare, LayoutDashboard, Settings, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import CircleList from "@/components/community/CircleList";
import PostFeed from "@/components/community/PostFeed";
import { GeneralChatTab } from "@/components/community/GeneralChatTab";
import CreatePersonaDialog from "@/components/community/CreatePersonaDialog";
import EditProfileDialog from "@/components/community/EditProfileDialog";
import { ProductTour } from "@/components/tour/ProductTour";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ProfileBanner } from "@/components/community/ProfileBanner";
import { WidgetsColumn } from "@/components/community/WidgetsColumn";
import { WelcomeOnboarding } from "@/components/community/WelcomeOnboarding";
import { useUserRole } from "@/contexts/UserRoleContext";
import { DiscoverPeopleDrawer } from "@/components/community/DiscoverPeopleDrawer";

const Community = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);
  const [hasPersona, setHasPersona] = useState(false);
  const [checkingPersona, setCheckingPersona] = useState(true);
  const [showCreatePersona, setShowCreatePersona] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [persona, setPersona] = useState<any>(null);
  const [circles, setCircles] = useState<any[]>([]);

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
        .maybeSingle();

      if (error) {
        console.error("Error checking persona:", error);
        setCheckingPersona(false);
        setShowCreatePersona(true);
        return;
      }

      if (data) {
        setPersona(data);
        setHasPersona(true);
      } else {
        setShowCreatePersona(true);
      }
      
      setCheckingPersona(false);
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

  const fetchCircles = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("circle_members")
      .select("circle_id")
      .eq("user_id", user.id);
    
    if (data) {
      setCircles(data);
    }
  };

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

  useEffect(() => {
    fetchCircles();
  }, [user]);

  if (authLoading || checkingPersona) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="p-4 sm:p-6 border-b border-sidebar-border flex-shrink-0">
        {!sidebarCollapsed ? (
          <>
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
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/admin")}
                    title="Admin Panel"
                  >
                    <Shield className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/messages")}
                  title="Messages"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Your safe community space
            </p>
          </>
        ) : (
          <div className="flex justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <CircleList
          selectedCircleId={selectedCircleId}
          onSelectCircle={handleCircleSelect}
          isCollapsed={sidebarCollapsed}
        />
      </div>

      {/* Profile Section at Bottom */}
      {persona && (
        <div className="p-4 border-t border-sidebar-border flex-shrink-0">
          {!sidebarCollapsed ? (
            <>
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
              
              {/* Sign Out Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start mt-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              
              {/* Collapse Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(true)}
                className="w-full justify-center mt-2"
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Avatar 
                className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowEditProfile(true)}
              >
                <AvatarImage src={persona.avatar_url} alt={persona.display_name} />
                <AvatarFallback>{persona.display_name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(false)}
                title="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={`grid h-screen bg-background overflow-hidden ${
      hasPersona && persona
        ? `grid-cols-1 grid-rows-[auto_1fr_auto] ${
            sidebarCollapsed 
              ? "md:grid-cols-[80px_1fr] lg:grid-cols-[80px_1fr_minmax(280px,320px)]"
              : "md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr_minmax(280px,320px)]"
          } lg:grid-rows-[auto_1fr]`
        : `grid-cols-1 grid-rows-[auto_1fr_auto] ${
            sidebarCollapsed 
              ? "md:grid-cols-[80px_1fr_320px]"
              : "md:grid-cols-[280px_1fr_320px]"
          }`
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
            <DiscoverPeopleDrawer />
            {persona && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditProfile(true)}
                title="Edit Profile"
              >
                <Settings className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/community/dashboard")}
              title="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Button>
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin")}
                title="Admin Panel"
              >
                <Shield className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/messages")}
              title="Messages"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - spans both rows when banner exists */}
      <aside className={`hidden md:flex border-r border-border flex-col ${
        hasPersona && persona ? "lg:row-span-2" : ""
      } transition-all duration-300 ${
        sidebarCollapsed ? "w-20" : ""
      }`}>
        <SidebarContent />
      </aside>

      {/* Banner - Only on LG+ screens, spans center and right columns */}
      {hasPersona && persona && (
        <div className="hidden lg:block lg:col-span-2">
          <ProfileBanner
            bannerUrl={persona.header_image_url}
            displayName={persona.display_name}
            avatarUrl={persona.avatar_url}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="overflow-hidden mt-[57px] lg:mt-0 flex flex-col">
        {/* Banner for smaller screens (shown inline within main) */}
        {hasPersona && persona && (
          <div className="lg:hidden">
            <ProfileBanner
              bannerUrl={persona.header_image_url}
              displayName={persona.display_name}
              avatarUrl={persona.avatar_url}
            />
          </div>
        )}
        
        <div className="flex-1 overflow-hidden">
          {selectedCircleId === "general-chat" ? (
            <div className="h-full p-4 overflow-y-auto">
              <GeneralChatTab />
            </div>
          ) : selectedCircleId ? (
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

      {/* Widgets Column - Responsive: stacked on mobile, side column on desktop */}
      {user && (
        <>
          {/* Mobile/Tablet: Stacked below main content */}
          <div className="md:hidden border-t border-border bg-muted/30 overflow-y-auto">
            <WidgetsColumn userId={user.id} onSelectCircle={handleCircleSelect} />
          </div>

          {/* Desktop: Side column - spans full height when no banner, starts at row 2 when banner exists */}
          <aside className={`hidden md:flex flex-col border-l border-border overflow-y-auto ${
            hasPersona && persona 
              ? "lg:col-start-3 lg:row-start-2" 
              : "md:row-span-2"
          }`}>
            <WidgetsColumn userId={user.id} onSelectCircle={handleCircleSelect} />
          </aside>
        </>
      )}

      <CreatePersonaDialog
        open={showCreatePersona}
        onOpenChange={setShowCreatePersona}
        onPersonaCreated={(newPersona) => {
          setHasPersona(true);
          setPersona(newPersona);
          fetchCircles();
        }}
      />

      {persona && (
        <EditProfileDialog
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
          persona={persona}
          onProfileUpdated={refetchPersona}
        />
      )}

      {/* Product Tour - Only show after user has joined circles */}
      {circles.length > 0 && <ProductTour selectedCircleId={selectedCircleId} />}
    </div>
  );
};

export default Community;
