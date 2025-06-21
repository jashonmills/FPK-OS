
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Image, Film } from 'lucide-react';
import { useKnowledgeBaseFiles } from '@/hooks/useKnowledgeBaseFiles';

const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/rtf',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp'
];

const maxFileSize = 50 * 1024 * 1024; // 50MB

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return Film;
  return FileText;
};

const KBUploader: React.FC = () => {
  const { uploadFile, isUploading } = useKnowledgeBaseFiles();
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        return;
      }
      
      if (file.size > maxFileSize) {
        return;
      }

      // Simulate upload progress
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      uploadFile(file);
      
      // Complete progress after upload
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
      }, 3000);
    });
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'text/csv': ['.csv'],
      'application/rtf': ['.rtf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp']
    },
    maxSize: maxFileSize,
    multiple: true
  });

  return (
    <Card className="border-2 border-dashed transition-colors duration-200 hover:border-primary/50">
      <CardContent className="p-6">
        <div 
          {...getRootProps()} 
          className={`cursor-pointer text-center space-y-4 ${
            isDragActive ? 'opacity-75' : ''
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex justify-center">
            <Upload className={`h-12 w-12 transition-colors ${
              isDragActive ? 'text-primary' : 'text-muted-foreground'
            }`} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop files here' : 'Upload Knowledge Base Files'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag & drop files or click to browse. These will enhance your AI conversations.
            </p>
            
            <div className="space-y-2 text-xs text-muted-foreground">
              <div>
                <strong>Supported:</strong> PDF, DOC, DOCX, PPT, PPTX, TXT, MD, CSV, RTF, Images
              </div>
              <div>
                <strong>Max size:</strong> {formatFileSize(maxFileSize)}
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Choose Files'}
          </Button>
        </div>

        {uploadProgress > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KBUploader;
