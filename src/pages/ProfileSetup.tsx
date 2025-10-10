import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    // Check if profile setup is already complete
    const checkProfileSetup = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('has_completed_profile_setup')
        .eq('id', user.id)
        .single();

      if (!error && data?.has_completed_profile_setup) {
        navigate('/dashboard');
      }
    };

    checkProfileSetup();
  }, [user, navigate]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('app-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('app-assets')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
      toast.success('Avatar uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    }
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    if (!user) return;

    setIsSaving(true);
    try {
      // Use upsert to handle both new and existing profiles
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          avatar_url: avatarUrl || null,
          phone: phone || null,
          professional_title: professionalTitle || null,
          organization_name: organizationName || null,
          bio: bio || null,
          has_completed_profile_setup: true,
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      toast.success('Profile created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Welcome! Please fill out your profile information to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt="Profile picture" />
              <AvatarFallback>
                <UserIcon className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Upload Profile Picture</span>
                </div>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </Label>
              <p className="text-xs text-muted-foreground">Optional</p>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full-name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Dr. Emily Carter"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
            <p className="text-xs text-muted-foreground">Optional</p>
          </div>

          {/* Professional Title */}
          <div className="space-y-2">
            <Label htmlFor="professional-title">Professional Title</Label>
            <Input
              id="professional-title"
              value={professionalTitle}
              onChange={(e) => setProfessionalTitle(e.target.value)}
              placeholder="e.g., BCBA, Occupational Therapist, Parent"
            />
            <p className="text-xs text-muted-foreground">Optional</p>
          </div>

          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="organization">Organization Name</Label>
            <Input
              id="organization"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="e.g., ABC Therapy Clinic, XYZ School"
            />
            <p className="text-xs text-muted-foreground">Optional</p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short note about yourself..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Optional</p>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="w-full"
            size="lg"
          >
            {isSaving ? 'Saving...' : 'Save Profile & Continue'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
