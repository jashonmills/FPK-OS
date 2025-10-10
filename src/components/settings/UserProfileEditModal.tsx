import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  professional_title?: string;
  organization_name?: string;
  bio?: string;
}

interface UserProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  onProfileUpdated: () => void;
}

export const UserProfileEditModal = ({
  open,
  onOpenChange,
  profile,
  onProfileUpdated,
}: UserProfileEditModalProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (profile) {
      setAvatarUrl(profile.avatar_url || '');
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setProfessionalTitle(profile.professional_title || '');
      setOrganizationName(profile.organization_name || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}-${Math.random()}.${fileExt}`;

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

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    if (!profile) return;

    setIsSaving(true);
    try {
      // Use upsert to handle both new and existing profiles
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          full_name: fullName,
          avatar_url: avatarUrl || null,
          phone: phone || null,
          professional_title: professionalTitle || null,
          organization_name: organizationName || null,
          bio: bio || null,
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      toast.success('Profile updated successfully');
      onProfileUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt="Profile picture" />
              <AvatarFallback>
                <UserIcon className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Label htmlFor="avatar-upload-edit" className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent">
                <Upload className="h-4 w-4" />
                <span className="text-sm">Upload Profile Picture</span>
              </div>
              <Input
                id="avatar-upload-edit"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </Label>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-full-name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Dr. Emily Carter"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone Number</Label>
            <Input
              id="edit-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Professional Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-professional-title">Professional Title</Label>
            <Input
              id="edit-professional-title"
              value={professionalTitle}
              onChange={(e) => setProfessionalTitle(e.target.value)}
              placeholder="e.g., BCBA, Occupational Therapist, Parent"
            />
          </div>

          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-organization">Organization Name</Label>
            <Input
              id="edit-organization"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="e.g., ABC Therapy Clinic, XYZ School"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="edit-bio">Bio</Label>
            <Textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short note about yourself..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
