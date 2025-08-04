
import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Form data state
  const [formData, setFormData] = useState({
    full_name: '',
    display_name: '',
    bio: '',
    avatar_url: '',
    learning_styles: [] as string[],
    two_factor_enabled: false,
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
  });

  // Accessibility settings state
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    font_family: 'System',
    text_size: 3,
    line_spacing: 3,
    color_contrast: 'Standard',
    comfort_mode: 'Normal',
    speech_to_text_enabled: false
  });

  // Language settings state
  const [languageSettings, setLanguageSettings] = useState({
    primary_language: 'English',
    dual_language_enabled: false,
    time_format: '12h',
    date_format: 'US',
    timezone: 'America/New_York'
  });

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setIsInitializing(false);
    }, 1000);
  }, []);

  const handleFormChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleEmailNotificationChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      email_notifications: { ...prev.email_notifications, [key]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const handleAppReminderChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      app_reminders: { ...prev.app_reminders, [key]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const handleCalendarSyncChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      calendar_sync: { ...prev.calendar_sync, [key]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const handleAccessibilityChange = (key: string, value: any) => {
    setAccessibilitySettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleLanguageChange = (key: string, value: any) => {
    setLanguageSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setSaving(true);
    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreDefaults = () => {
    // Reset to defaults
    setFormData({
      full_name: '',
      display_name: '',
      bio: '',
      avatar_url: '',
      learning_styles: [],
      two_factor_enabled: false,
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
    });
    setAccessibilitySettings({
      font_family: 'System',
      text_size: 3,
      line_spacing: 3,
      color_contrast: 'Standard',
      comfort_mode: 'Normal',
      speech_to_text_enabled: false
    });
    setLanguageSettings({
      primary_language: 'English',
      dual_language_enabled: false,
      time_format: '12h',
      date_format: 'US',
      timezone: 'America/New_York'
    });
    setHasUnsavedChanges(false);
  };

  return (
    <div className="mobile-page-container">
      <div className="mobile-section-spacing">
        <SettingsHeader
          saving={saving}
          hasUnsavedChanges={hasUnsavedChanges}
          isInitializing={isInitializing}
          onRestoreDefaults={handleRestoreDefaults}
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
                </TabsList>
              </div>

              <TabsContent value="profile" className="mt-0">
                <ProfileSection
                  formData={formData}
                  userEmail={user?.email || ''}
                  onFormChange={handleFormChange}
                />
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <SecuritySection
                  formData={formData}
                  onFormChange={handleFormChange}
                  onPasswordChange={handlePasswordChange}
                />
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <NotificationSection
                  formData={formData}
                  onFormChange={handleFormChange}
                  onEmailNotificationChange={handleEmailNotificationChange}
                  onAppReminderChange={handleAppReminderChange}
                />
              </TabsContent>

              <TabsContent value="accessibility" className="mt-0">
                <AccessibilitySettings
                  fontFamily={accessibilitySettings.font_family}
                  textSize={accessibilitySettings.text_size}
                  lineSpacing={accessibilitySettings.line_spacing}
                  colorContrast={accessibilitySettings.color_contrast}
                  comfortMode={accessibilitySettings.comfort_mode}
                  speechToTextEnabled={accessibilitySettings.speech_to_text_enabled}
                  onChange={handleAccessibilityChange}
                />
              </TabsContent>

              <TabsContent value="language" className="mt-0">
                <LanguageSettings
                  primaryLanguage={languageSettings.primary_language}
                  dualLanguageEnabled={languageSettings.dual_language_enabled}
                  timeFormat={languageSettings.time_format}
                  dateFormat={languageSettings.date_format}
                  timezone={languageSettings.timezone}
                  onChange={handleLanguageChange}
                />
              </TabsContent>

              <TabsContent value="integrations" className="mt-0">
                <IntegrationSection
                  formData={formData}
                  onCalendarSyncChange={handleCalendarSyncChange}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
