
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Camera } from 'lucide-react';

interface AvatarUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentUrl, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      onUpload(data.publicUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload avatar.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={currentUrl} alt="Profile picture" />
        <AvatarFallback className="fpk-gradient text-white text-xl font-bold">
          BL
        </AvatarFallback>
      </Avatar>
      
      <div>
        <Label htmlFor="avatar-upload" className="cursor-pointer">
          <Button
            variant="outline"
            size="sm"
            disabled={uploading}
            asChild
          >
            <span>
              {uploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Change Avatar
                </>
              )}
            </span>
          </Button>
        </Label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-1">
          JPG, PNG up to 5MB
        </p>
      </div>
    </div>
  );
};

export default AvatarUpload;
