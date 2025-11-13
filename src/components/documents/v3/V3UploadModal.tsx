import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Loader2 } from 'lucide-react';

interface V3UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  familyId: string;
  studentId?: string;
  onSuccess?: () => void;
}

export function V3UploadModal({ open, onOpenChange, familyId, studentId, onSuccess }: V3UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('general');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('family_id', familyId);
      if (studentId) formData.append('student_id', studentId);
      formData.append('category', category);

      const { data, error } = await supabase.functions.invoke('v3-upload-document', {
        body: formData
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      toast({
        title: 'Upload successful',
        description: `${file.name} has been uploaded successfully`
      });

      // Reset form
      setFile(null);
      setCategory('general');
      onOpenChange(false);
      onSuccess?.();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'An error occurred during upload',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({Math.round(file.size / 1024)}KB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={uploading}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="iep">IEP</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="progress_report">Progress Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
