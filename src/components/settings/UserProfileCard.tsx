import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Edit, Save, X, Mail } from 'lucide-react';

interface UserProfileCardProps {
  user: {
    id: string;
    email?: string;
  };
}

export const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          phone: phone,
        },
      });

      if (error) throw error;

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName('');
    setPhone('');
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </div>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Click Edit to add more profile information like display name and phone number.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
