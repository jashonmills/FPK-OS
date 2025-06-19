import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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
  Check,
  Globe,
  RotateCcw
} from 'lucide-react';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import EnhancedAvatarUpload from '@/components/settings/EnhancedAvatarUpload';
import LearningStyleTags from '@/components/settings/LearningStyleTags';
import LivePreview from '@/components/settings/LivePreview';
import LanguageSettings from '@/components/settings/LanguageSettings';
import AccessibilitySettings from '@/components/settings/AccessibilitySettings';
import PasswordChangeForm from '@/components/settings/PasswordChangeForm';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

const Settings = () => {
  // Use the 'settings' namespace for all translations
  const { t, tString, renderText } = useGlobalTranslation('settings');
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, saving, updateProfile, changePassword } = useUserProfile();
  const { getAccessibilityClasses } = useAccessibility();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Apply accessibility classes throughout the component
  const containerClasses = getAccessibilityClasses('container');
  const textClasses = getAccessibilityClasses('text');
  const cardClasses = getAccessibilityClasses('card');

  console.log('🎨 Settings: Applied accessibility classes:', { containerClasses, textClasses, cardClasses });

  // Refs to track state and prevent infinite loops
  const isInitializing = useRef(true);
  const lastSavedData = useRef<any>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

    // Check if data has actually changed
    if (!hasDataChanged(formData, lastSavedData.current)) return;

    console.log('🔄 Form data changed, scheduling auto-save...');

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save with immediate effect for accessibility settings
    const isAccessibilityChange = ['font_family', 'text_size', 'line_spacing', 'color_contrast', 'comfort_mode'].some(
      key => formData[key as keyof typeof formData] !== lastSavedData.current?.[key]
    );
    
    const delay = isAccessibilityChange ? 100 : 1000; // Immediate for accessibility changes
    
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
      } as any, true); // Pass true for silent auto-save

      // Update last saved data
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

  // Check if there are unsaved changes
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-amber-600 bg-clip-text text-transparent ${textClasses}`}>
              {renderText(t('title'))}
            </h1>
            <p className={`text-gray-600 mt-1 text-sm md:text-base ${textClasses}`}>{renderText(t('subtitle'))}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            {saving && (
              <div className={`flex items-center gap-2 text-sm text-blue-600 ${textClasses}`}>
                <Loader2 className="h-4 w-4 animate-spin" />
                {renderText(t('saving'))}
              </div>
            )}
            {!saving && hasUnsavedChanges && (
              <div className={`flex items-center gap-2 text-sm text-amber-600 ${textClasses}`}>
                <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
                {renderText(t('autoSavePending'))}
              </div>
            )}
            {!saving && !hasUnsavedChanges && !isInitializing.current && (
              <div className={`flex items-center gap-2 text-sm text-green-600 ${textClasses}`}>
                <Check className="h-4 w-4" />
                {renderText(t('allChangesSaved'))}
              </div>
            )}
            <Button
              variant="outline"
              size={isMobile ? "default" : "sm"}
              onClick={handleRestoreDefaults}
              className={`gap-2 w-full sm:w-auto ${textClasses}`}
            >
              <RotateCcw className="h-4 w-4" />
              {renderText(t('restoreDefaults'))}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className={`w-full ${containerClasses}`} orientation={isMobile ? "vertical" : "horizontal"}>
          <TabsList className={`w-full ${isMobile ? 'flex-col h-auto gap-1 p-1' : 'h-10'} ${textClasses}`}>
            <TabsTrigger 
              value="profile" 
              className={`flex items-center gap-2 ${isMobile ? 'justify-start py-3 px-4 w-full' : ''} ${textClasses}`}
            >
              <User className="h-4 w-4" />
              <span className={isMobile ? 'text-sm' : 'hidden sm:inline'}>{tString('tabs.profile')}</span>
              <span className={isMobile ? 'hidden' : 'inline sm:hidden'}>{tString('tabs.profile')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="language" 
              className={`flex items-center gap-2 ${isMobile ? 'justify-start py-3 px-4 w-full' : ''} ${textClasses}`}
            >
              <Globe className="h-4 w-4" />
              <span className={isMobile ? 'text-sm' : 'hidden sm:inline'}>{tString('tabs.language')}</span>
              <span className={isMobile ? 'hidden' : 'inline sm:hidden'}>{tString('tabs.languageShort')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="accessibility" 
              className={`flex items-center gap-2 ${isMobile ? 'justify-start py-3 px-4 w-full' : ''} ${textClasses}`}
            >
              <Eye className="h-4 w-4" />
              <span className={isMobile ? 'text-sm' : 'hidden sm:inline'}>{tString('tabs.accessibility')}</span>
              <span className={isMobile ? 'hidden' : 'inline sm:hidden'}>{tString('tabs.accessibilityShort')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className={`flex items-center gap-2 ${isMobile ? 'justify-start py-3 px-4 w-full' : ''} ${textClasses}`}
            >
              <Bell className="h-4 w-4" />
              <span className={isMobile ? 'text-sm' : 'hidden sm:inline'}>{tString('tabs.notifications')}</span>
              <span className={isMobile ? 'hidden' : 'inline sm:hidden'}>{tString('tabs.notificationsShort')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className={`flex items-center gap-2 ${isMobile ? 'justify-start py-3 px-4 w-full' : ''} ${textClasses}`}
            >
              <Shield className="h-4 w-4" />
              <span className={isMobile ? 'text-sm' : 'hidden sm:inline'}>{tString('tabs.security')}</span>
              <span className={isMobile ? 'hidden' : 'inline sm:hidden'}>{tString('tabs.securityShort')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className={`flex items-center gap-2 ${isMobile ? 'justify-start py-3 px-4 w-full' : ''} ${textClasses}`}
            >
              <Link className="h-4 w-4" />
              <span className={isMobile ? 'text-sm' : 'hidden sm:inline'}>{tString('tabs.integrations')}</span>
              <span className={isMobile ? 'hidden' : 'inline sm:hidden'}>{tString('tabs.integrationsShort')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className={`fpk-card border-0 shadow-lg ${cardClasses}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
                    <User className="h-5 w-5 text-purple-600" />
                    {renderText(t('profile.title'))}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <EnhancedAvatarUpload
                    currentUrl={formData.avatar_url}
                    onUpload={(url) => handleFormChange('avatar_url', url)}
                    userName={formData.full_name || formData.display_name || 'User'}
                  />

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className={textClasses}>{renderText(t('profile.fullName'))}</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleFormChange('full_name', e.target.value)}
                        placeholder={tString('profile.fullNamePlaceholder')}
                        className={textClasses}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="display_name" className={textClasses}>{renderText(t('profile.displayName'))}</Label>
                      <Input
                        id="display_name"
                        value={formData.display_name}
                        onChange={(e) => handleFormChange('display_name', e.target.value)}
                        placeholder={tString('profile.displayNamePlaceholder')}
                        className={textClasses}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className={textClasses}>{renderText(t('profile.email'))}</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      readOnly
                      className={`bg-gray-50 ${textClasses}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className={textClasses}>{renderText(t('profile.bio'))}</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleFormChange('bio', e.target.value)}
                      placeholder={tString('profile.bioPlaceholder')}
                      rows={3}
                      className={textClasses}
                    />
                  </div>

                  <LearningStyleTags
                    selectedStyles={formData.learning_styles}
                    onChange={(styles) => handleFormChange('learning_styles', styles)}
                  />
                </CardContent>
              </Card>

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
            <Card className={`fpk-card border-0 shadow-lg ${cardClasses}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
                  <Bell className="h-5 w-5 text-amber-600" />
                  {renderText(t('notifications.emailTitle'))}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="new_courses" className={textClasses}>{renderText(t('notifications.newCourses'))}</Label>
                    <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('notifications.newCoursesDesc'))}</p>
                  </div>
                  <Switch
                    id="new_courses"
                    checked={formData.email_notifications.new_courses}
                    onCheckedChange={(checked) => handleEmailNotificationChange('new_courses', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly_summary" className={textClasses}>{renderText(t('notifications.weeklySum'))}</Label>
                    <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('notifications.weeklySumDesc'))}</p>
                  </div>
                  <Switch
                    id="weekly_summary"
                    checked={formData.email_notifications.weekly_summary}
                    onCheckedChange={(checked) => handleEmailNotificationChange('weekly_summary', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai_prompts" className={textClasses}>{renderText(t('notifications.aiPrompts'))}</Label>
                    <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('notifications.aiPromptsDesc'))}</p>
                  </div>
                  <Switch
                    id="ai_prompts"
                    checked={formData.email_notifications.ai_prompts}
                    onCheckedChange={(checked) => handleEmailNotificationChange('ai_prompts', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className={`fpk-card border-0 shadow-lg ${cardClasses}`}>
              <CardHeader>
                <CardTitle className={textClasses}>{renderText(t('notifications.appTitle'))}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push_notifications" className={textClasses}>{renderText(t('notifications.pushNotifications'))}</Label>
                    <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('notifications.pushNotificationsDesc'))}</p>
                  </div>
                  <Switch
                    id="push_notifications"
                    checked={formData.push_notifications_enabled}
                    onCheckedChange={(checked) => handleFormChange('push_notifications_enabled', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="study_streak" className={textClasses}>{renderText(t('notifications.studyStreak'))}</Label>
                    <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('notifications.studyStreakDesc'))}</p>
                  </div>
                  <Switch
                    id="study_streak"
                    checked={formData.app_reminders.study_streak}
                    onCheckedChange={(checked) => handleAppReminderChange('study_streak', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="module_nudges" className={textClasses}>{renderText(t('notifications.moduleNudges'))}</Label>
                    <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('notifications.moduleNudgesDesc'))}</p>
                  </div>
                  <Switch
                    id="module_nudges"
                    checked={formData.app_reminders.module_nudges}
                    onCheckedChange={(checked) => handleAppReminderChange('module_nudges', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <Card className={`fpk-card border-0 shadow-lg ${cardClasses}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
                  <Shield className="h-5 w-5 text-red-600" />
                  {renderText(t('security.title'))}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <PasswordChangeForm onPasswordChange={changePassword} />
                
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two_factor" className={textClasses}>{renderText(t('security.twoFactor'))}</Label>
                    <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('security.twoFactorDesc'))}</p>
                  </div>
                  <Switch
                    id="two_factor"
                    checked={formData.two_factor_enabled}
                    onCheckedChange={(checked) => handleFormChange('two_factor_enabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <Card className={`fpk-card border-0 shadow-lg ${cardClasses}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
                  <Link className="h-5 w-5 text-blue-600" />
                  {renderText(t('integrations.title'))}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="google_calendar" className={textClasses}>{renderText(t('integrations.googleCalendar'))}</Label>
                    <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('integrations.googleDesc'))}</p>
                  </div>
                  <Switch
                    id="google_calendar"
                    checked={formData.calendar_sync.google}
                    onCheckedChange={(checked) => handleCalendarSyncChange('google', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="outlook_calendar" className={textClasses}>{renderText(t('integrations.outlookCalendar'))}</Label>
                    <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('integrations.outlookDesc'))}</p>
                  </div>
                  <Switch
                    id="outlook_calendar"
                    checked={formData.calendar_sync.outlook}
                    onCheckedChange={(checked) => handleCalendarSyncChange('outlook', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default Settings;
