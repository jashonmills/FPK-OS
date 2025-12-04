import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FamilyMembersTab } from "@/components/settings/FamilyMembersTab";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { SubscriptionTab } from "@/components/settings/SubscriptionTab";
import { IntegrationsTab } from "@/components/settings/IntegrationsTab";
import { CreditsTab } from "@/components/settings/CreditsTab";
import { ResetAnalysisCard } from "@/components/settings/ResetAnalysisCard";
import { Users, UserCircle, CreditCard, Plug, Zap } from "lucide-react";
import { useFamily } from "@/contexts/FamilyContext";
import { ProductTour } from "@/components/onboarding/ProductTour";
import { settingsTourSteps } from "@/components/onboarding/tourConfigs";
import { useTourProgress } from "@/hooks/useTourProgress";
import { UserIdDisplay } from "@/components/settings/UserIdDisplay";

const Settings = () => {
  const { familyMembership } = useFamily();
  const isOwner = familyMembership?.role === 'owner';
  const { shouldRunTour, markTourAsSeen } = useTourProgress('has_seen_settings_tour');

  return (
    <>
      <ProductTour 
        run={shouldRunTour} 
        onComplete={markTourAsSeen}
        tourSteps={settingsTourSteps}
        tourTitle="Welcome to Settings"
        tourDescription="Manage your profile, team members, and subscription here. Let me show you around!"
      />
      
      <div className="container mx-auto py-4 sm:py-8 px-4 max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account, family members, and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className={`grid w-full ${isOwner ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' : 'grid-cols-2'} gap-1 h-auto sm:h-10 p-1`}>
            <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5" data-tour="profile-tab">
              <UserCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="truncate">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5" data-tour="members-tab">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="truncate hidden sm:inline">Family Members</span>
              <span className="truncate sm:hidden">Members</span>
            </TabsTrigger>
            {isOwner && (
              <>
                <TabsTrigger value="credits" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5">
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="truncate">Credits</span>
                </TabsTrigger>
                <TabsTrigger value="subscription" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5" data-tour="subscription-tab">
                  <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="truncate hidden sm:inline">Subscription</span>
                  <span className="truncate sm:hidden">Plan</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-1.5">
                  <Plug className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="truncate hidden sm:inline">Integrations</span>
                  <span className="truncate sm:hidden">Apps</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileTab />
          <UserIdDisplay />
          {isOwner && <ResetAnalysisCard />}
        </TabsContent>

        <TabsContent value="members">
          <FamilyMembersTab />
        </TabsContent>

        {isOwner && (
          <>
            <TabsContent value="credits">
              <CreditsTab />
            </TabsContent>

            <TabsContent value="subscription">
              <SubscriptionTab />
            </TabsContent>

            <TabsContent value="integrations">
              <IntegrationsTab />
            </TabsContent>
          </>
        )}
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
