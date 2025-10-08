import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import EnhancedAvatarUpload from '@/components/settings/EnhancedAvatarUpload';
import { Loader2 } from 'lucide-react';

interface ProfileData {
  display_name: string;
  full_name: string;
  job_title: string;
  department: string;
  subject_taught: string;
  phone_number: string;
  phone_extension: string;
  avatar_url: string;
}

export function InstructorProfileSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    display_name: '',
    full_name: '',
    job_title: '',
    department: '',
    subject_taught: '',
    phone_number: '',
    phone_extension: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, full_name, job_title, department, subject_taught, phone_number, phone_extension, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfileData({
          display_name: data.display_name || '',
          full_name: data.full_name || '',
          job_title: data.job_title || '',
          department: data.department || '',
          subject_taught: data.subject_taught || '',
          phone_number: data.phone_number || '',
          phone_extension: data.phone_extension || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profileData.display_name,
          full_name: profileData.full_name,
          job_title: profileData.job_title,
          department: profileData.department,
          subject_taught: profileData.subject_taught,
          phone_number: profileData.phone_number,
          phone_extension: profileData.phone_extension,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile Updated',
        description: 'Your instructor profile has been saved successfully.',
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (url: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', user.id);

      if (error) throw error;

      setProfileData(prev => ({ ...prev, avatar_url: url }));
      
      toast({
        title: 'Avatar Updated',
        description: 'Your profile picture has been updated.',
      });
    } catch (error: any) {
      console.error('Error updating avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to update avatar',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrgCard className="bg-orange-500/65 border-orange-400/50">
        <OrgCardHeader>
          <OrgCardTitle className="text-white">Profile Picture</OrgCardTitle>
          <OrgCardDescription className="text-white/80">
            Upload a profile picture to personalize your instructor account
          </OrgCardDescription>
        </OrgCardHeader>
        <OrgCardContent>
          <EnhancedAvatarUpload
            currentUrl={profileData.avatar_url}
            onUpload={handleAvatarUpload}
            userName={profileData.display_name || profileData.full_name}
          />
        </OrgCardContent>
      </OrgCard>

      <OrgCard className="bg-orange-500/65 border-orange-400/50">
        <OrgCardHeader>
          <OrgCardTitle className="text-white">Basic Information</OrgCardTitle>
          <OrgCardDescription className="text-white/80">
            Your name and display preferences
          </OrgCardDescription>
        </OrgCardHeader>
        <OrgCardContent className="space-y-4">
          <div>
            <Label htmlFor="full-name" className="text-white">Full Name</Label>
            <Input
              id="full-name"
              value={profileData.full_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="John Smith"
              className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="display-name" className="text-white">Display Name</Label>
            <Input
              id="display-name"
              value={profileData.display_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder="Mr. Smith"
              className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
            />
            <p className="text-xs text-white/60 mt-1">
              This is how your name will appear to students
            </p>
          </div>
        </OrgCardContent>
      </OrgCard>

      <OrgCard className="bg-orange-500/65 border-orange-400/50">
        <OrgCardHeader>
          <OrgCardTitle className="text-white">Professional Details</OrgCardTitle>
          <OrgCardDescription className="text-white/80">
            Your role and areas of expertise
          </OrgCardDescription>
        </OrgCardHeader>
        <OrgCardContent className="space-y-4">
          <div>
            <Label htmlFor="job-title" className="text-white">Job Title / Role</Label>
            <Input
              id="job-title"
              value={profileData.job_title}
              onChange={(e) => setProfileData(prev => ({ ...prev, job_title: e.target.value }))}
              placeholder="e.g., 6th Grade Math Teacher, Principal, Admin"
              className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="department" className="text-white">Department</Label>
            <Input
              id="department"
              value={profileData.department}
              onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
              placeholder="e.g., Mathematics, Science, Administration"
              className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="subject-taught" className="text-white">Subject(s) Taught</Label>
            <Input
              id="subject-taught"
              value={profileData.subject_taught}
              onChange={(e) => setProfileData(prev => ({ ...prev, subject_taught: e.target.value }))}
              placeholder="e.g., Algebra, Chemistry, Special Education"
              className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
            />
          </div>
        </OrgCardContent>
      </OrgCard>

      <OrgCard className="bg-orange-500/65 border-orange-400/50">
        <OrgCardHeader>
          <OrgCardTitle className="text-white">Contact Information</OrgCardTitle>
          <OrgCardDescription className="text-white/80">
            Phone number for organizational communication
          </OrgCardDescription>
        </OrgCardHeader>
        <OrgCardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="phone-number" className="text-white">Phone Number</Label>
              <Input
                id="phone-number"
                type="tel"
                value={profileData.phone_number}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone_number: e.target.value }))}
                placeholder="(555) 123-4567"
                className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label htmlFor="phone-extension" className="text-white">Extension</Label>
              <Input
                id="phone-extension"
                value={profileData.phone_extension}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone_extension: e.target.value }))}
                placeholder="1234"
                className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
              />
            </div>
          </div>
        </OrgCardContent>
      </OrgCard>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="bg-white text-orange-600 hover:bg-white/90"
        >
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Profile
        </Button>
      </div>
    </div>
  );
}
