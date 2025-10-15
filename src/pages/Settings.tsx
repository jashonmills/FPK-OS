import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FamilyMembersTab } from "@/components/settings/FamilyMembersTab";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { SubscriptionTab } from "@/components/settings/SubscriptionTab";
import { IntegrationsTab } from "@/components/settings/IntegrationsTab";
import { CreditsTab } from "@/components/settings/CreditsTab";
import { Users, UserCircle, CreditCard, Plug, Zap } from "lucide-react";
import { useFamily } from "@/contexts/FamilyContext";
import { ProductTour } from "@/components/onboarding/ProductTour";
import { settingsTourSteps } from "@/components/onboarding/tourConfigs";
import { useTourProgress } from "@/hooks/useTourProgress";

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
      
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, family members, and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className={`grid w-full max-w-4xl ${isOwner ? 'grid-cols-5' : 'grid-cols-2'}`}>
            <TabsTrigger value="profile" className="flex items-center gap-2" data-tour="profile-tab">
              <UserCircle className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2" data-tour="members-tab">
              <Users className="h-4 w-4" />
              Family Members
            </TabsTrigger>
            {isOwner && (
              <>
                <TabsTrigger value="credits" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  AI Credits
                </TabsTrigger>
                <TabsTrigger value="subscription" className="flex items-center gap-2" data-tour="subscription-tab">
                  <CreditCard className="h-4 w-4" />
                  Subscription
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Plug className="h-4 w-4" />
                  Integrations
                </TabsTrigger>
              </>
            )}
          </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
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
