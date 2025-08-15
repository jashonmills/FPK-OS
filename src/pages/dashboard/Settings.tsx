
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SettingsHeader from '@/components/settings/SettingsHeader';
import ProfileSection from '@/components/settings/ProfileSection';
import SecuritySection from '@/components/settings/SecuritySection';
import NotificationSection from '@/components/settings/NotificationSection';
import AccessibilitySettings from '@/components/settings/AccessibilitySettings';
import LanguageSettings from '@/components/settings/LanguageSettings';
import IntegrationSection from '@/components/settings/IntegrationSection';
import { DataManagement } from '@/components/DataManagement';
import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';
import { User, Shield, Bell, Eye, Globe, Zap, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { user } = useAuth();
  const { profile, loading, saving, updateProfile, changePassword } = useUserProfile();
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // Video storage hook
  const { shouldShowAuto, markVideoAsSeen } = useFirstVisitVideo('settings_intro_seen');

  // Show video modal on first visit (only when not loading)
  useEffect(() => {
    if (shouldShowAuto() && !loading && profile) {
      setShowVideoModal(true);
    }
  }, [shouldShowAuto, loading, profile]);

  const handleCloseVideo = () => {
    setShowVideoModal(false);
    markVideoAsSeen();
  };

  const handleShowVideoManually = () => {
    setShowVideoModal(true);
  };

  // Load profile data into local state for form management
  useEffect(() => {
    if (profile) {
      setHasUnsavedChanges(false);
    }
  }, [profile]);

  // Auto-save function with debouncing
  useEffect(() => {
    if (!hasUnsavedChanges || !profile) return;

    const timeoutId = setTimeout(async () => {
      try {
        await updateProfile({}, true); // Silent update
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [hasUnsavedChanges, profile, updateProfile]);

  const handleFormChange = async (key: string, value: any) => {
    setHasUnsavedChanges(true);
    try {
      await updateProfile({ [key]: value }, true);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEmailNotificationChange = async (key: string, value: boolean) => {
    const currentNotifications = (profile?.email_notifications as any) || {};
    const updates = {
      email_notifications: {
        ...currentNotifications,
        [key]: value
      }
    };
    setHasUnsavedChanges(true);
    try {
      await updateProfile(updates, true);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to update notifications:', error);
      toast({
        title: "Error",
        description: "Failed to save notification settings.",
        variant: "destructive"
      });
    }
  };

  const handleAppReminderChange = async (key: string, value: boolean) => {
    const currentReminders = (profile?.app_reminders as any) || {};
    const updates = {
      app_reminders: {
        ...currentReminders,
        [key]: value
      }
    };
    setHasUnsavedChanges(true);
    try {
      await updateProfile(updates, true);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to update reminders:', error);
      toast({
        title: "Error",
        description: "Failed to save reminder settings.",
        variant: "destructive"
      });
    }
  };

  const handleCalendarSyncChange = async (key: string, value: boolean) => {
    const currentSync = (profile?.calendar_sync as any) || {};
    const updates = {
      calendar_sync: {
        ...currentSync,
        [key]: value
      }
    };
    setHasUnsavedChanges(true);
    try {
      await updateProfile(updates, true);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to update calendar sync:', error);
      toast({
        title: "Error",
        description: "Failed to save calendar settings.",
        variant: "destructive"
      });
    }
  };

  const handleAccessibilityChange = async (key: string, value: any) => {
    setHasUnsavedChanges(true);
    try {
      await updateProfile({ [key]: value }, true);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to update accessibility:', error);
      toast({
        title: "Error",
        description: "Failed to save accessibility settings.",
        variant: "destructive"
      });
    }
  };

  const handleLanguageChange = async (key: string, value: any) => {
    setHasUnsavedChanges(true);
    try {
      await updateProfile({ [key]: value }, true);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to update language:', error);
      toast({
        title: "Error",
        description: "Failed to save language settings.",
        variant: "destructive"
      });
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await changePassword(currentPassword, newPassword);
      toast({
        title: "Success",
        description: "Password changed successfully.",
      });
      return true;
    } catch (error) {
      console.error('Password change failed:', error);
      toast({
        title: "Error",
        description: "Failed to change password. Please check your current password.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleRestoreDefaults = async () => {
    try {
      const defaultSettings = {
        font_family: 'System',
        text_size: 3,
        line_spacing: 3,
        color_contrast: 'Standard',
        comfort_mode: 'Normal',
        speech_to_text_enabled: false,
        primary_language: 'English',
        dual_language_enabled: false,
        time_format: '12h',
        date_format: 'US',
        timezone: 'America/New_York',
        push_notifications_enabled: true,
        email_notifications: {
          new_courses: true,
          weekly_summary: true,
          ai_prompts: false
        },
        app_reminders: {
          study_streak: true,
          module_nudges: true
        },
        calendar_sync: {
          google: false,
          outlook: false
        }
      };
      
      await updateProfile(defaultSettings);
      setHasUnsavedChanges(false);
      toast({
        title: "Settings Restored",
        description: "All settings have been restored to their default values.",
      });
    } catch (error) {
      console.error('Failed to restore defaults:', error);
      toast({
        title: "Error",
        description: "Failed to restore default settings.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="mobile-page-container">
        <div className="mobile-section-spacing">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Provide safe defaults for all data
  const emailNotifications = (profile?.email_notifications as any) || {};
  const appReminders = (profile?.app_reminders as any) || {};
  const calendarSync = (profile?.calendar_sync as any) || {};
  
  const profileData = {
    full_name: profile?.full_name || '',
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
    learning_styles: profile?.learning_styles || [],
    two_factor_enabled: profile?.two_factor_enabled || false,
    push_notifications_enabled: profile?.push_notifications_enabled ?? true,
    email_notifications: {
      new_courses: emailNotifications.new_courses ?? true,
      weekly_summary: emailNotifications.weekly_summary ?? true,
      ai_prompts: emailNotifications.ai_prompts ?? false
    },
    app_reminders: {
      study_streak: appReminders.study_streak ?? true,
      module_nudges: appReminders.module_nudges ?? true
    },
    calendar_sync: {
      google: calendarSync.google ?? false,
      outlook: calendarSync.outlook ?? false
    }
  };

  return (
    <div className="mobile-page-container">
      <div className="mobile-section-spacing">
        <div className="flex flex-col items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <PageHelpTrigger onOpen={handleShowVideoManually} />
        </div>
        <p className="text-muted-foreground text-center mb-6">
          Customize your learning experience and account preferences
        </p>

        <FirstVisitVideoModal
          isOpen={showVideoModal}
          onClose={handleCloseVideo}
          title="How to Use Settings"
          videoUrl="https://www.youtube.com/embed/IjLiH-NWIto?si=UaS_tXWSHzaizyZB"
        />
        
        <Card className="mobile-card border-0 shadow-sm">
          <CardContent className="mobile-card-padding">
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
                  <TabsTrigger value="data" className="mobile-tab-trigger">
                    <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="whitespace-nowrap">Data</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="profile" className="mt-0">
                <ProfileSection
                  formData={profileData}
                  userEmail={user?.email || ''}
                  onFormChange={handleFormChange}
                />
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <SecuritySection
                  formData={profileData}
                  onFormChange={handleFormChange}
                  onPasswordChange={handlePasswordChange}
                />
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <NotificationSection
                  formData={profileData}
                  onFormChange={handleFormChange}
                  onEmailNotificationChange={handleEmailNotificationChange}
                  onAppReminderChange={handleAppReminderChange}
                />
              </TabsContent>

              <TabsContent value="accessibility" className="mt-0">
                <AccessibilitySettings
                  fontFamily={profile?.font_family || 'System'}
                  textSize={profile?.text_size || 3}
                  lineSpacing={profile?.line_spacing || 3}
                  colorContrast={profile?.color_contrast || 'Standard'}
                  comfortMode={profile?.comfort_mode || 'Normal'}
                  speechToTextEnabled={profile?.speech_to_text_enabled || false}
                  onChange={handleAccessibilityChange}
                />
              </TabsContent>

              <TabsContent value="language" className="mt-0">
                <LanguageSettings
                  primaryLanguage={profile?.primary_language || 'English'}
                  dualLanguageEnabled={profile?.dual_language_enabled || false}
                  timeFormat={profile?.time_format || '12h'}
                  dateFormat={profile?.date_format || 'US'}
                  timezone={profile?.timezone || 'America/New_York'}
                  onChange={handleLanguageChange}
                />
              </TabsContent>

              <TabsContent value="integrations" className="mt-0">
                <IntegrationSection
                  formData={profileData}
                  onCalendarSyncChange={handleCalendarSyncChange}
                />
              </TabsContent>

              <TabsContent value="data" className="mt-0">
                <DataManagement />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
