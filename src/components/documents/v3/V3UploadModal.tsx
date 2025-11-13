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
  const [category, setCategory] = useState('');
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
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]);
        };
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;

      const { error } = await supabase.functions.invoke('v3-upload-document', {
        body: {
          file_name: file.name,
          file_size_kb: Math.round(file.size / 1024),
          file_type: file.type,
          category: category || null,
          family_id: familyId,
          student_id: studentId,
          file_data: base64
        }
      });

      if (error) throw error;

      toast({
        title: 'Upload successful',
        description: category 
          ? `${file.name} has been uploaded and classified`
          : `${file.name} has been uploaded. Please classify it to enable analysis.`
      });

      // Reset form
      setFile(null);
      setCategory('');
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
            <Label htmlFor="category">Category (Optional)</Label>
            <Select value={category} onValueChange={setCategory} disabled={uploading}>
              <SelectTrigger id="category">
                <SelectValue placeholder="I'll classify later (recommended)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">I'll classify later (recommended)</SelectItem>
                <SelectItem value="IEP">IEP - Individualized Education Program</SelectItem>
                <SelectItem value="BIP">BIP - Behavior Intervention Plan</SelectItem>
                <SelectItem value="FBA">FBA - Functional Behavior Assessment</SelectItem>
                <SelectItem value="Progress_Report">Progress Report</SelectItem>
                <SelectItem value="Evaluation_Report">Evaluation Report</SelectItem>
                <SelectItem value="504_Plan">504 Plan</SelectItem>
                <SelectItem value="Medical_Record">Medical Record</SelectItem>
                <SelectItem value="Incident_Report">Incident Report</SelectItem>
                <SelectItem value="General_Document">General Document</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              You can classify the document after upload for better accuracy
            </p>
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
