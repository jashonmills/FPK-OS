import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Link, 
  Save, 
  Loader2,
  Upload,
  HelpCircle
} from 'lucide-react';
import AccessibilitySettings from '@/components/settings/AccessibilitySettings';
import PasswordChangeForm from '@/components/settings/PasswordChangeForm';

const Settings = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, saving, updateProfile, changePassword } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    text_size: 2,
    line_spacing: 2,
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

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      const emailNotifications = profile.email_notifications as any || {};
      const appReminders = profile.app_reminders as any || {};
      const calendarSync = profile.calendar_sync as any || {};

      setFormData({
        full_name: profile.full_name || '',
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        primary_language: profile.primary_language || 'English',
        avatar_url: profile.avatar_url || '',
        learning_styles: profile.learning_styles || [],
        comfort_mode: profile.comfort_mode || 'Normal',
        time_format: profile.time_format || '12h',
        date_format: profile.date_format || 'US',
        font_family: profile.font_family || 'System',
        color_contrast: profile.color_contrast || 'Standard',
        dual_language_enabled: profile.dual_language_enabled || false,
        text_size: profile.text_size || 2,
        line_spacing: profile.line_spacing || 2,
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
      });
    }
  }, [profile]);

  // Auto-save when form data changes
  useEffect(() => {
    if (!profile) return;

    const timeoutId = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const handleSave = async () => {
    if (!profile) return;

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
      push_notifications_enabled: formData.push_notifications_enabled,
      two_factor_enabled: formData.two_factor_enabled,
      speech_to_text_enabled: formData.speech_to_text_enabled,
      email_notifications: formData.email_notifications,
      app_reminders: formData.app_reminders,
      calendar_sync: formData.calendar_sync,
      updated_at: new Date().toISOString()
    });
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

  const handleAccessibilityChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (authLoading || profileLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>
        {saving && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Auto-saving...
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Accessibility
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                    placeholder="How others see your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Primary Language</Label>
                <Select 
                  value={formData.primary_language} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, primary_language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-600" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new_courses">New Course Announcements</Label>
                  <p className="text-sm text-gray-500">Get notified about new courses</p>
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
                  <Label htmlFor="weekly_summary">Weekly Progress Summary</Label>
                  <p className="text-sm text-gray-500">Weekly learning progress reports</p>
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
                  <Label htmlFor="ai_prompts">AI Study Prompts</Label>
                  <p className="text-sm text-gray-500">Smart study reminders from AI</p>
                </div>
                <Switch
                  id="ai_prompts"
                  checked={formData.email_notifications.ai_prompts}
                  onCheckedChange={(checked) => handleEmailNotificationChange('ai_prompts', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle>App Reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="study_streak">Study Streak Reminders</Label>
                  <p className="text-sm text-gray-500">Keep your learning streak alive</p>
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
                  <Label htmlFor="module_nudges">Module Completion Nudges</Label>
                  <p className="text-sm text-gray-500">Gentle reminders to complete modules</p>
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

        <TabsContent value="accessibility" className="space-y-6">
          {profile && (
            <AccessibilitySettings
              profile={profile}
              onUpdate={(updates) => updateProfile(updates)}
            />
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <PasswordChangeForm onPasswordChange={changePassword} />
              
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two_factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <Switch
                  id="two_factor"
                  checked={formData.two_factor_enabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, two_factor_enabled: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5 text-blue-600" />
                Calendar Sync
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="google_calendar">Google Calendar</Label>
                  <p className="text-sm text-gray-500">Sync study sessions with Google Calendar</p>
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
                  <Label htmlFor="outlook_calendar">Outlook Calendar</Label>
                  <p className="text-sm text-gray-500">Sync study sessions with Outlook Calendar</p>
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
  );
};

export default Settings;
