import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Image, X } from "lucide-react";

interface CreatePostFormProps {
  circleId: string;
  personaId: string;
  personaName: string;
  onPostCreated: () => void;
}

const CreatePostForm = ({ circleId, personaId, personaName, onPostCreated }: CreatePostFormProps) => {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;
    
    setUploading(true);
    try {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${personaId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('post-images')
        .upload(fileName, selectedImage, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Image upload failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personaId || !content.trim()) return;

    setLoading(true);
    try {
      // Upload image if selected
      let imageUrl: string | null = null;
      if (selectedImage) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          setLoading(false);
          return; // Upload failed
        }
      }

      // Create post with optional image
      const { error } = await supabase.from("posts").insert({
        circle_id: circleId,
        author_id: personaId,
        content: content.trim(),
        image_url: imageUrl,
      });

      if (error) throw error;

      // Reset form
      setContent("");
      setSelectedImage(null);
      setImagePreview(null);
      onPostCreated();
      
      toast({
        title: "Post shared!",
        description: imageUrl 
          ? "Your message and image have been posted to the circle."
          : "Your message has been posted to the circle.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card id="post-composer" className="shadow-soft animate-fade-in">
      <CardContent className="pt-4 sm:pt-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <Textarea
            placeholder={`What's on your mind, ${personaName}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-none text-sm sm:text-base"
          />
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-48 rounded-lg border border-border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            {/* Image Upload Button */}
            <div>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
                disabled={loading || uploading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('image-upload')?.click()}
                disabled={loading || uploading || !!selectedImage}
                className="gap-2"
              >
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Add Photo</span>
              </Button>
            </div>
            
            {/* Post Button */}
            <Button 
              type="submit" 
              disabled={loading || uploading || !content.trim()} 
              size="sm" 
              className="sm:size-default"
            >
              {loading || uploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              <span className="text-sm sm:text-base">Post</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
