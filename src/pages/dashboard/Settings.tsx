
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Globe, 
  Bell, 
  Save,
  RotateCcw,
  Camera
} from 'lucide-react';
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

const demoProfile: UserProfile = {
  id: 'demo-user',
  full_name: 'Beta Learner',
  display_name: 'Beta',
  bio: 'Passionate about learning and exploring new technologies',
  learning_styles: ['Visual', 'Kinesthetic'],
  avatar_url: '',
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
  const [profile, setProfile] = useState<UserProfile>(demoProfile);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile({ ...profile, ...updates });
  };

  const saveProfile = async () => {
    setSaving(true);
    
    // Simulate saving with a delay
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    }, 1000);
  };

  const resetToDefaults = () => {
    setProfile({ ...demoProfile });
    toast({
      title: "Settings reset",
      description: "All settings have been restored to defaults.",
    });
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

    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

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
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url} alt="Profile picture" />
                  <AvatarFallback className="fpk-gradient text-white text-xl font-bold">
                    {profile.display_name?.charAt(0) || 'BL'}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Camera className="h-4 w-4 mr-2" />
                        Change Avatar
                      </span>
                    </Button>
                  </Label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        toast({
                          title: "Demo Mode",
                          description: "Avatar upload is not available in demo mode.",
                        });
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              </div>
              
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
                  checked={profile.email_notifications.new_courses}
                  onCheckedChange={(checked) => 
                    updateProfile({
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
                  checked={profile.email_notifications.weekly_summary}
                  onCheckedChange={(checked) => 
                    updateProfile({
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
