
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Camera, Crop } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface EnhancedAvatarUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  userName?: string;
}

const EnhancedAvatarUpload: React.FC<EnhancedAvatarUploadProps> = ({ 
  currentUrl, 
  onUpload, 
  userName = "User" 
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
        setShowCropDialog(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);

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
      setShowCropDialog(false);
      setPreviewUrl(null);
      
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

  const handleCropConfirm = async () => {
    if (fileInputRef.current?.files?.[0]) {
      await uploadAvatar(fileInputRef.current.files[0]);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={currentUrl} alt="Profile picture" />
        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-amber-500 text-white text-xl font-bold">
          {getInitials(userName)}
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
          ref={fileInputRef}
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-1">
          JPG, PNG up to 5MB
        </p>
      </div>

      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Preview Avatar</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {previewUrl && (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Avatar preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCropDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCropConfirm} disabled={uploading}>
                {uploading ? "Uploading..." : "Confirm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedAvatarUpload;
