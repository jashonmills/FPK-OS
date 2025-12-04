
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserUploadedBooks } from '@/hooks/useUserUploadedBooks';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useCleanup } from '@/utils/cleanupManager';

const PDFUploadComponent: React.FC = () => {
  const cleanup = useCleanup('PDFUploadComponent');
  const { uploadPDF, isUploading } = useUserUploadedBooks();
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast.error('File size must be less than 50MB');
      return;
    }

    console.log('📤 Starting upload for:', file.name);
    toast.success(`Uploading ${file.name}...`);
    
    // Simulate upload progress
    let progress = 0;
    const progressIntervalId = cleanup.setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 90) {
        cleanup.cleanup(progressIntervalId);
      }
    }, 200);

    uploadPDF(file, {
      onSuccess: () => {
        cleanup.cleanup(progressIntervalId);
        setUploadProgress(100);
        toast.success('PDF uploaded successfully! It\'s now pending admin approval.');
        cleanup.setTimeout(() => setUploadProgress(0), 2000);
      },
      onError: (error) => {
        cleanup.cleanup(progressIntervalId);
        setUploadProgress(0);
        console.error('Upload error:', error);
        toast.error('Failed to upload PDF. Please try again.');
      }
    });
  }, [uploadPDF]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: isUploading
  });

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Upload Your PDF Book</h3>
            <p className="text-sm text-muted-foreground">
              Share your own PDF books with the community. Files are reviewed before becoming available to all users.
            </p>
          </div>

          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              ${isUploading ? 'cursor-not-allowed opacity-50' : 'hover:border-primary hover:bg-primary/5'}
            `}
          >
            <input {...getInputProps()} />
            
            {isUploading ? (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploading PDF...</p>
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                  <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : isDragActive ? (
              <div className="space-y-2">
                <Upload className="mx-auto h-8 w-8 text-primary" />
                <p className="text-sm font-medium">Drop your PDF here</p>
              </div>
            ) : (
              <div className="space-y-2">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Drag & drop a PDF file here</p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Select PDF File
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>PDF files only</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Max 50MB file size</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Admin review required</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFUploadComponent;
