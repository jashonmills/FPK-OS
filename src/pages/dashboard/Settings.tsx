
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Link, 
  Loader2,
  Globe
} from 'lucide-react';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import LanguageSettings from '@/components/settings/LanguageSettings';
import AccessibilitySettings from '@/components/settings/AccessibilitySettings';
import LivePreview from '@/components/settings/LivePreview';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import SettingsHeader from '@/components/settings/SettingsHeader';
import ProfileSection from '@/components/settings/ProfileSection';
import NotificationSection from '@/components/settings/NotificationSection';
import SecuritySection from '@/components/settings/SecuritySection';
import IntegrationSection from '@/components/settings/IntegrationSection';

const Settings = () => {
  const { t, tString, renderText } = useGlobalTranslation('settings');
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, saving, updateProfile, changePassword } = useUserProfile();
  const { getAccessibilityClasses } = useAccessibility();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const containerClasses = getAccessibilityClasses('container');

  // Refs to track state and prevent infinite loops
  const isInitializing = useRef(true);
  const lastSavedData = useRef<any>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>();
  const isSaving = useRef(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Local state for form data
  const [formData, setFormData] = useState({
    full_name: '',
    display_name: '',
    bio: '',
    primary_language: 'English',
    avatar_url: '',
    learning_styles: [] as string[],
    comfort_mode: 'Normal',
    time_format: '12h',
    date_format: 'US',
    font_family: 'System',
    color_contrast: 'Standard',
    dual_language_enabled: false,
    text_size: 3,
    line_spacing: 3,
    timezone: 'UTC',
    push_notifications_enabled: false,
    two_factor_enabled: false,
    speech_to_text_enabled: false,
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

  // Deep comparison function to check if data has changed
  const hasDataChanged = (newData: any, savedData: any) => {
    if (!savedData) return true;
    return JSON.stringify(newData) !== JSON.stringify(savedData);
  };

  // Update form data when profile loads (only initially)
  useEffect(() => {
    if (profile && isInitializing.current) {
      console.log('🔄 Initializing form data from profile:', profile);
      
      const emailNotifications = profile.email_notifications as any || {};
      const appReminders = profile.app_reminders as any || {};
      const calendarSync = profile.calendar_sync as any || {};

      const newFormData = {
        full_name: profile.full_name || '',
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        primary_language: profile.primary_language || 'English',
        avatar_url: profile.avatar_url || '',
        learning_styles: Array.isArray(profile.learning_styles) ? profile.learning_styles : [],
        comfort_mode: profile.comfort_mode || 'Normal',
        time_format: profile.time_format || '12h',
        date_format: profile.date_format || 'US',
        font_family: profile.font_family || 'System',
        color_contrast: profile.color_contrast || 'Standard',
        dual_language_enabled: profile.dual_language_enabled || false,
        text_size: profile.text_size || 3,
        line_spacing: profile.line_spacing || 3,
        timezone: profile.timezone || 'UTC',
        push_notifications_enabled: profile.push_notifications_enabled || false,
        two_factor_enabled: profile.two_factor_enabled || false,
        speech_to_text_enabled: profile.speech_to_text_enabled || false,
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

      console.log('🔄 Form data initialized:', newFormData);
      setFormData(newFormData);
      lastSavedData.current = newFormData;
      isInitializing.current = false;
    }
  }, [profile]);

  // Auto-save with debouncing and change detection
  useEffect(() => {
    if (isInitializing.current || !profile || isSaving.current) return;

    if (!hasDataChanged(formData, lastSavedData.current)) return;

    console.log('🔄 Form data changed, scheduling auto-save...');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    const isAccessibilityChange = ['font_family', 'text_size', 'line_spacing', 'color_contrast', 'comfort_mode'].some(
      key => formData[key as keyof typeof formData] !== lastSavedData.current?.[key]
    );
    
    const delay = isAccessibilityChange ? 100 : 1000;
    
    saveTimeoutRef.current = setTimeout(() => {
      handleAutoSave();
    }, delay);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, profile]);

  const handleAutoSave = async () => {
    if (!profile || isSaving.current) return;

    console.log('💾 Auto-saving form data:', formData);
    isSaving.current = true;
    
    try {
      await updateProfile({
        full_name: formData.full_name,
        display_name: formData.display_name,
        bio: formData.bio,
        primary_language: formData.primary_language,
        avatar_url: formData.avatar_url,
        learning_styles: formData.learning_styles,
        comfort_mode: formData.comfort_mode,
        time_format: formData.time_format,
        date_format: formData.date_format,
        font_family: formData.font_family,
        color_contrast: formData.color_contrast,
        dual_language_enabled: formData.dual_language_enabled,
        text_size: formData.text_size,
        line_spacing: formData.line_spacing,
        timezone: formData.timezone,
        push_notifications_enabled: formData.push_notifications_enabled,
        two_factor_enabled: formData.two_factor_enabled,
        speech_to_text_enabled: formData.speech_to_text_enabled,
        email_notifications: formData.email_notifications,
        app_reminders: formData.app_reminders,
        calendar_sync: formData.calendar_sync,
        updated_at: new Date().toISOString()
      } as any, true);

      lastSavedData.current = { ...formData };
      console.log('✅ Auto-save completed');
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
    } finally {
      isSaving.current = false;
    }
  };

  const handleFormChange = (key: string, value: any) => {
    console.log(`🔧 Form change: ${key} =`, value);
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleEmailNotificationChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      email_notifications: {
        ...prev.email_notifications,
        [key]: value
      }
    }));
  };

  const handleAppReminderChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      app_reminders: {
        ...prev.app_reminders,
        [key]: value
      }
    }));
  };

  const handleCalendarSyncChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      calendar_sync: {
        ...prev.calendar_sync,
        [key]: value
      }
    }));
  };

  const handleRestoreDefaults = () => {
    const defaultData = {
      full_name: '',
      display_name: '',
      bio: '',
      primary_language: 'English',
      avatar_url: '',
      learning_styles: [],
      comfort_mode: 'Normal',
      time_format: '12h',
      date_format: 'US',
      font_family: 'System',
      color_contrast: 'Standard',
      dual_language_enabled: false,
      text_size: 3,
      line_spacing: 3,
      timezone: 'UTC',
      push_notifications_enabled: false,
      two_factor_enabled: false,
      speech_to_text_enabled: false,
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
    
    setFormData(defaultData);
    toast({
      title: renderText(t('settingsRestored')),
      description: renderText(t('defaultsMessage')),
    });
  };

  const hasUnsavedChanges = hasDataChanged(formData, lastSavedData.current);

  if (authLoading || profileLoading) {
    return (
      <div className={`p-6 flex items-center justify-center ${containerClasses}`}>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className={`p-3 md:p-6 max-w-6xl mx-auto space-y-4 md:space-y-6 ${containerClasses} accessibility-mobile-override`}>
        <SettingsHeader
          saving={saving}
          hasUnsavedChanges={hasUnsavedChanges}
          isInitializing={isInitializing.current}
          onRestoreDefaults={handleRestoreDefaults}
        />

        <Tabs defaultValue="profile" className={`w-full ${containerClasses}`} orientation={isMobile ? "vertical" : "horizontal"}>
          <TabsList className={`w-full ${isMobile ? 'flex-col h-auto gap-1 p-1' : 'h-10'}`}>
            <TabsTrigger 
              value="profile" 
              className={`flex items-center gap-2 ${isMobile ? 'justify-start py-3 px-4 w-full' : ''}`}
            >
              <User className="h-4 w-4" />
              <span className={isMobile ? 'text-sm' : 'hidden sm:inline'}>Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="language" 
              className={`flex items-center gap-2 ${isMobile ? 'justify-start py-3 px-4 w-full' : ''}`}
            >
              <Globe className="h-4 w-4" />
              <span className={isMobile ? 'text-sm' : 'hidden sm:inline'}>Language</span>
            </TabsTrigger>
            <TabsTrigger 
              value="accessibility" 
              className={`flex items-center gap-2 ${isMobile ? 'justify-start py-3 px-4 w-full' : ''}`}
            >
              <Eye className="h-4 w-4" />
              <span className={isMobile ? 'text-sm' : 'hidden sm:inline'}>Accessibility</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className={`flex items-center gap-2 ${isMobile ? 'justify-start py-3 px-4 w-full' : ''}`}
            >
              <Bell className="h-4 w-4" />
              <span className={isMobile ? 'text-sm' : 'hidden sm:inline'}>Notifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className={`flex items-center gap-2 ${isMobile ? 'justify-start py-3 px-4 w-full' : ''}`}
            >
              <Shield className="h-4 w-4" />
              <span className={isMobile ? 'text-sm' : 'hidden sm:inline'}>Security</span>
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className={`flex items-center gap-2 ${isMobile ? 'justify-start py-3 px-4 w-full' : ''}`}
            >
              <Link className="h-4 w-4" />
              <span className={isMobile ? 'text-sm' : 'hidden sm:inline'}>Integrations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <ProfileSection
                formData={{
                  full_name: formData.full_name,
                  display_name: formData.display_name,
                  bio: formData.bio,
                  avatar_url: formData.avatar_url,
                  learning_styles: formData.learning_styles
                }}
                userEmail={user?.email || ''}
                onFormChange={handleFormChange}
              />

              <LivePreview
                fontFamily={formData.font_family}
                textSize={formData.text_size}
                lineSpacing={formData.line_spacing}
                colorContrast={formData.color_contrast}
                comfortMode={formData.comfort_mode}
              />
            </div>
          </TabsContent>

          <TabsContent value="language" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <LanguageSettings
              primaryLanguage={formData.primary_language}
              dualLanguageEnabled={formData.dual_language_enabled}
              timeFormat={formData.time_format}
              dateFormat={formData.date_format}
              timezone={formData.timezone}
              onChange={handleFormChange}
            />
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <AccessibilitySettings
                fontFamily={formData.font_family}
                textSize={formData.text_size}
                lineSpacing={formData.line_spacing}
                colorContrast={formData.color_contrast}
                comfortMode={formData.comfort_mode}
                speechToTextEnabled={formData.speech_to_text_enabled}
                onChange={handleFormChange}
              />

              <LivePreview
                fontFamily={formData.font_family}
                textSize={formData.text_size}
                lineSpacing={formData.line_spacing}
                colorContrast={formData.color_contrast}
                comfortMode={formData.comfort_mode}
              />
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <NotificationSection
              formData={{
                push_notifications_enabled: formData.push_notifications_enabled,
                email_notifications: formData.email_notifications,
                app_reminders: formData.app_reminders
              }}
              onFormChange={handleFormChange}
              onEmailNotificationChange={handleEmailNotificationChange}
              onAppReminderChange={handleAppReminderChange}
            />
          </TabsContent>

          <TabsContent value="security" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <SecuritySection
              formData={{
                two_factor_enabled: formData.two_factor_enabled
              }}
              onFormChange={handleFormChange}
              onPasswordChange={changePassword}
            />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <IntegrationSection
              formData={{
                calendar_sync: formData.calendar_sync
              }}
              onCalendarSyncChange={handleCalendarSyncChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default Settings;
