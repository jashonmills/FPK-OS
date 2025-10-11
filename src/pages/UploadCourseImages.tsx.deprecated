import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadCourseImages } from '@/utils/uploadCourseImages';

export default function UploadCourseImages() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async () => {
    setUploading(true);
    try {
      const result = await uploadCourseImages();
      
      toast({
        title: "Success",
        description: "Course images uploaded successfully!"
      });
      
      console.log('Upload results:', result);
    } catch (error: any) {
      toast({
        title: "Error", 
        description: `Failed to upload images: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Course Images'}
      </Button>
    </div>
  );
}