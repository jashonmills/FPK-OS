
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import SettingsHeader from '@/components/settings/SettingsHeader';
import ProfileSection from '@/components/settings/ProfileSection';
import SecuritySection from '@/components/settings/SecuritySection';
import NotificationSection from '@/components/settings/NotificationSection';
import AccessibilitySettings from '@/components/settings/AccessibilitySettings';
import LanguageSettings from '@/components/settings/LanguageSettings';
import IntegrationSection from '@/components/settings/IntegrationSection';
import { User, Shield, Bell, Eye, Globe, Zap } from 'lucide-react';

const Settings = () => {
  return (
    <div className="mobile-section-spacing">
      <SettingsHeader />
      
      <Card className="border-0 shadow-sm">
        <CardContent className="mobile-card">
          <Tabs defaultValue="profile" className="mobile-section-spacing">
            {/* Mobile-Optimized Tab Navigation */}
            <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
              <TabsList className="mobile-tab-list min-w-max">
                <TabsTrigger value="profile" className="mobile-tab-trigger">
                  <User className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="whitespace-nowrap">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="mobile-tab-trigger">
                  <Shield className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="whitespace-nowrap">Security</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="mobile-tab-trigger">
                  <Bell className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="whitespace-nowrap">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="accessibility" className="mobile-tab-trigger">
                  <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="whitespace-nowrap">Accessibility</span>
                </TabsTrigger>
                <TabsTrigger value="language" className="mobile-tab-trigger">
                  <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="whitespace-nowrap">Language</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" className="mobile-tab-trigger">
                  <Zap className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="whitespace-nowrap">Integrations</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="mt-0">
              <ProfileSection />
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <SecuritySection />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <NotificationSection />
            </TabsContent>

            <TabsContent value="accessibility" className="mt-0">
              <AccessibilitySettings />
            </TabsContent>

            <TabsContent value="language" className="mt-0">
              <LanguageSettings />
            </TabsContent>

            <TabsContent value="integrations" className="mt-0">
              <IntegrationSection />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
