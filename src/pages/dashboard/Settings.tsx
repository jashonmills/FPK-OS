
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Globe, 
  Eye, 
  Bell, 
  Shield, 
  Link, 
  HelpCircle,
  Upload,
  Save,
  RotateCcw,
  Info
} from 'lucide-react';
import AvatarUpload from '@/components/settings/AvatarUpload';
import LivePreview from '@/components/settings/LivePreview';

interface UserProfile {
  id: string;
  full_name?: string;
  display_name?: string;
  bio?: string;
  learning_styles?: string[];
  avatar_url?: string;
  primary_language: string;
  dual_language_enabled: boolean;
  time_format: string;
  date_format: string;
  font_family: string;
  color_contrast: string;
  comfort_mode: string;
  text_size: number;
  line_spacing: number;
  email_notifications: {
    new_courses: boolean;
    weekly_summary: boolean;
    ai_prompts: boolean;
  };
  app_reminders: {
    study_streak: boolean;
    module_nudges: boolean;
  };
  push_notifications_enabled: boolean;
  two_factor_enabled: boolean;
  calendar_sync: {
    google: boolean;
    outlook: boolean;
  };
  speech_to_text_enabled: boolean;
}

const defaultProfile: Partial<UserProfile> = {
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
};

const learningStyleOptions = [
  'Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing', 
  'Analytical', 'Global', 'Sequential', 'Intuitive'
];

const Settings = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (!data) {
        // Create default profile if none exists
        const newProfile = { ...defaultProfile, id: user.id };
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          return;
        }
        setProfile(newProfile as UserProfile);
      } else {
        // Transform the Supabase data to match our interface
        const transformedProfile: UserProfile = {
          id: data.id,
          full_name: data.full_name || undefined,
          display_name: data.display_name || undefined,
          bio: data.bio || undefined,
          learning_styles: data.learning_styles || undefined,
          avatar_url: data.avatar_url || undefined,
          primary_language: data.primary_language || 'English',
          dual_language_enabled: data.dual_language_enabled || false,
          time_format: data.time_format || '12h',
          date_format: data.date_format || 'US',
          font_family: data.font_family || 'System',
          color_contrast: data.color_contrast || 'Standard',
          comfort_mode: data.comfort_mode || 'Normal',
          text_size: data.text_size || 2,
          line_spacing: data.line_spacing || 2,
          email_notifications: (data.email_notifications as any) || defaultProfile.email_notifications,
          app_reminders: (data.app_reminders as any) || defaultProfile.app_reminders,
          push_notifications_enabled: data.push_notifications_enabled || false,
          two_factor_enabled: data.two_factor_enabled || false,
          calendar_sync: (data.calendar_sync as any) || defaultProfile.calendar_sync,
          speech_to_text_enabled: data.speech_to_text_enabled || false,
        };
        setProfile(transformedProfile);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const saveProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (profile) {
      setProfile({ ...profile, ...defaultProfile });
      toast({
        title: "Settings reset",
        description: "All settings have been restored to defaults.",
      });
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    }
  };

  if (loading || !profile) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restore Defaults
          </Button>
          <Button onClick={saveProfile} disabled={saving} className="fpk-gradient text-white">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2">
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AvatarUpload 
                currentUrl={profile.avatar_url}
                onUpload={(url) => updateProfile({ avatar_url: url })}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.full_name || ''}
                    onChange={(e) => updateProfile({ full_name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.display_name || ''}
                    onChange={(e) => updateProfile({ display_name: e.target.value })}
                    placeholder="How others see you"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio / Learning Style</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ''}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
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
                    onValueChange={(value) => updateProfile({ learning_styles: value })}
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

              <div>
                <Label>Change Password</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={changePassword} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  Update Password
                </Button>
              </div>
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
                  value={profile.primary_language}
                  onValueChange={(value) => updateProfile({ primary_language: value })}
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
                  checked={profile.dual_language_enabled}
                  onCheckedChange={(checked) => updateProfile({ dual_language_enabled: checked })}
                />
              </div>

              <div>
                <Label>Time Format</Label>
                <RadioGroup
                  value={profile.time_format}
                  onValueChange={(value) => updateProfile({ time_format: value })}
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
                  value={profile.date_format}
                  onValueChange={(value) => updateProfile({ date_format: value })}
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

          {/* Accessibility & Display */}
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Accessibility & Display
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Font Family</Label>
                <RadioGroup
                  value={profile.font_family}
                  onValueChange={(value) => updateProfile({ font_family: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="System" id="system" />
                    <Label htmlFor="system">System Default</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OpenDyslexic" id="dyslexic" />
                    <Label htmlFor="dyslexic" className="flex items-center gap-2">
                      OpenDyslexic
                      <Info className="h-4 w-4 text-gray-400" />
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Color Contrast</Label>
                <RadioGroup
                  value={profile.color_contrast}
                  onValueChange={(value) => updateProfile({ color_contrast: value })}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Standard" id="standard" />
                    <Label htmlFor="standard">Standard</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="High" id="high" />
                    <Label htmlFor="high">High Contrast</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Comfort Mode</Label>
                <RadioGroup
                  value={profile.comfort_mode}
                  onValueChange={(value) => updateProfile({ comfort_mode: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Normal" id="normal" />
                    <Label htmlFor="normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Low-Stimulus" id="low-stimulus" />
                    <Label htmlFor="low-stimulus">Low-Stimulus</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Focus" id="focus" />
                    <Label htmlFor="focus">Focus Mode</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Text Size: {['Small', 'Medium', 'Large'][profile.text_size - 1]}</Label>
                <Slider
                  value={[profile.text_size]}
                  onValueChange={([value]) => updateProfile({ text_size: value })}
                  max={3}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Line Spacing: {['Compact', 'Comfortable', 'Airy'][profile.line_spacing - 1]}</Label>
                <Slider
                  value={[profile.line_spacing]}
                  onValueChange={([value]) => updateProfile({ line_spacing: value })}
                  max={3}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications & Reminders */}
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-600" />
                Notifications & Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Email Notifications</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-courses">New Courses</Label>
                    <Checkbox
                      id="new-courses"
                      checked={profile.email_notifications.new_courses}
                      onCheckedChange={(checked) => 
                        updateProfile({
                          email_notifications: {
                            ...profile.email_notifications,
                            new_courses: checked as boolean
                          }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weekly-summary">Weekly Summary</Label>
                    <Checkbox
                      id="weekly-summary"
                      checked={profile.email_notifications.weekly_summary}
                      onCheckedChange={(checked) => 
                        updateProfile({
                          email_notifications: {
                            ...profile.email_notifications,
                            weekly_summary: checked as boolean
                          }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ai-prompts">AI Study Prompts</Label>
                    <Checkbox
                      id="ai-prompts"
                      checked={profile.email_notifications.ai_prompts}
                      onCheckedChange={(checked) => 
                        updateProfile({
                          email_notifications: {
                            ...profile.email_notifications,
                            ai_prompts: checked as boolean
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">In-App Reminders</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <Label>Study Streak Reminders</Label>
                    <Switch
                      checked={profile.app_reminders.study_streak}
                      onCheckedChange={(checked) => 
                        updateProfile({
                          app_reminders: {
                            ...profile.app_reminders,
                            study_streak: checked
                          }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Module Progress Nudges</Label>
                    <Switch
                      checked={profile.app_reminders.module_nudges}
                      onCheckedChange={(checked) => 
                        updateProfile({
                          app_reminders: {
                            ...profile.app_reminders,
                            module_nudges: checked
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-500">Available when app is installed</p>
                </div>
                <Switch
                  checked={profile.push_notifications_enabled}
                  onCheckedChange={(checked) => updateProfile({ push_notifications_enabled: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">SMS or authenticator app</p>
                </div>
                <Switch
                  checked={profile.two_factor_enabled}
                  onCheckedChange={(checked) => updateProfile({ two_factor_enabled: checked })}
                />
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button variant="outline" size="sm">
                  View Active Sessions
                </Button>
                <Button variant="outline" size="sm">
                  Sign Out Everywhere
                </Button>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button variant="outline" size="sm">
                  Request Data Export
                </Button>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5 text-indigo-600" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Calendar Sync</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <Label>Google Calendar</Label>
                    <Switch
                      checked={profile.calendar_sync.google}
                      onCheckedChange={(checked) => 
                        updateProfile({
                          calendar_sync: {
                            ...profile.calendar_sync,
                            google: checked
                          }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Outlook Calendar</Label>
                    <Switch
                      checked={profile.calendar_sync.outlook}
                      onCheckedChange={(checked) => 
                        updateProfile({
                          calendar_sync: {
                            ...profile.calendar_sync,
                            outlook: checked
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Speech-to-Text</Label>
                  <p className="text-sm text-gray-500">Voice input for notes and assignments</p>
                </div>
                <Switch
                  checked={profile.speech_to_text_enabled}
                  onCheckedChange={(checked) => updateProfile({ speech_to_text_enabled: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* About & Support */}
          <Card className="fpk-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-gray-600" />
                About & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>App Version</Label>
                  <p className="text-sm text-gray-500">v2.1.0 (Build 2024.6.8)</p>
                </div>
                <Button variant="outline" size="sm">
                  View Release Notes
                </Button>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Send Feedback
                </Button>
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
