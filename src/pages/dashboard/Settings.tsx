
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  User, 
  Globe, 
  Bell, 
  Save,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import LivePreview from '@/components/settings/LivePreview';
import AvatarUpload from '@/components/settings/AvatarUpload';
import AccessibilitySettings from '@/components/settings/AccessibilitySettings';
import PasswordChangeForm from '@/components/settings/PasswordChangeForm';

const learningStyleOptions = [
  'Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing', 
  'Analytical', 'Global', 'Sequential', 'Intuitive'
];

const Settings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading, saving, updateProfile, changePassword } = useUserProfile();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-red-600">Failed to load user data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = (updates: Partial<typeof profile>) => {
    updateProfile(updates);
  };

  const resetToDefaults = async () => {
    await updateProfile({
      primary_language: 'English',
      dual_language_enabled: false,
      time_format: '12h',
      date_format: 'US',
      font_family: 'System',
      color_contrast: 'Standard',
      comfort_mode: 'Normal',
      text_size: 2,
      line_spacing: 2,
      email_notifications: {
        new_courses: true,
        weekly_summary: true,
        ai_prompts: false,
      },
      app_reminders: {
        study_streak: true,
        module_nudges: true,
      },
      push_notifications_enabled: false,
      two_factor_enabled: false,
      calendar_sync: {
        google: false,
        outlook: false,
      },
      speech_to_text_enabled: false,
    });
  };

  const handleAvatarUpload = (url: string) => {
    handleProfileUpdate({ avatar_url: url });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetToDefaults} disabled={saving}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restore Defaults
          </Button>
          <Button disabled={saving} className="fpk-gradient text-white">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Auto-saved'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AvatarUpload
                currentUrl={profile.avatar_url || ''}
                onUpload={handleAvatarUpload}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.full_name || ''}
                    onChange={(e) => handleProfileUpdate({ full_name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.display_name || ''}
                    onChange={(e) => handleProfileUpdate({ display_name: e.target.value })}
                    placeholder="How others see you"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio / Learning Style</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ''}
                  onChange={(e) => handleProfileUpdate({ bio: e.target.value })}
                  placeholder="Tell us about your learning preferences..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Learning Styles</Label>
                <div className="mt-2">
                  <ToggleGroup
                    type="multiple"
                    value={profile.learning_styles || []}
                    onValueChange={(value) => handleProfileUpdate({ learning_styles: value })}
                    className="grid grid-cols-2 md:grid-cols-4 gap-2"
                  >
                    {learningStyleOptions.map((style) => (
                      <ToggleGroupItem
                        key={style}
                        value={style}
                        className="text-xs"
                      >
                        {style}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>

              <PasswordChangeForm onPasswordChange={changePassword} />
            </CardContent>
          </Card>

          {/* Language & Localization */}
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Language & Localization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Primary Language</Label>
                <Select
                  value={profile.primary_language || 'English'}
                  onValueChange={(value) => handleProfileUpdate({ primary_language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Español">Español</SelectItem>
                    <SelectItem value="中文">中文</SelectItem>
                    <SelectItem value="हिंदी">हिंदी</SelectItem>
                    <SelectItem value="Français">Français</SelectItem>
                    <SelectItem value="Deutsch">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Dual-Language Mode</Label>
                  <p className="text-sm text-gray-500">Show content in Primary + English</p>
                </div>
                <Switch
                  checked={profile.dual_language_enabled || false}
                  onCheckedChange={(checked) => handleProfileUpdate({ dual_language_enabled: checked })}
                />
              </div>

              <div>
                <Label>Time Format</Label>
                <RadioGroup
                  value={profile.time_format || '12h'}
                  onValueChange={(value) => handleProfileUpdate({ time_format: value })}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12h" id="12h" />
                    <Label htmlFor="12h">12-hour (3:30 PM)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="24h" id="24h" />
                    <Label htmlFor="24h">24-hour (15:30)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Date Format</Label>
                <RadioGroup
                  value={profile.date_format || 'US'}
                  onValueChange={(value) => handleProfileUpdate({ date_format: value })}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="US" id="US" />
                    <Label htmlFor="US">US (MM/DD/YYYY)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Intl" id="Intl" />
                    <Label htmlFor="Intl">International (DD/MM/YYYY)</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Settings */}
          <AccessibilitySettings
            profile={profile}
            onUpdate={handleProfileUpdate}
          />

          {/* Notifications */}
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>New Course Notifications</Label>
                  <p className="text-sm text-gray-500">Get notified about new courses</p>
                </div>
                <Switch
                  checked={profile.email_notifications?.new_courses || false}
                  onCheckedChange={(checked) => 
                    handleProfileUpdate({
                      email_notifications: {
                        ...profile.email_notifications,
                        new_courses: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly Summary</Label>
                  <p className="text-sm text-gray-500">Weekly learning progress summary</p>
                </div>
                <Switch
                  checked={profile.email_notifications?.weekly_summary || false}
                  onCheckedChange={(checked) => 
                    handleProfileUpdate({
                      email_notifications: {
                        ...profile.email_notifications,
                        weekly_summary: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Study Reminders</Label>
                  <p className="text-sm text-gray-500">Reminders to keep your streak</p>
                </div>
                <Switch
                  checked={profile.app_reminders?.study_streak || false}
                  onCheckedChange={(checked) => 
                    handleProfileUpdate({
                      app_reminders: {
                        ...profile.app_reminders,
                        study_streak: checked
                      }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <LivePreview profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
