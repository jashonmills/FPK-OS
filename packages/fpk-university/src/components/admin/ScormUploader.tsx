import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Package, Archive, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ScormUploaderProps {
  courseId: string;
  onUploadComplete?: (lessonId: string) => void;
}

interface ScormPackageInfo {
  fileName: string;
  size: number;
  isValid: boolean;
  error?: string;
}

const ScormUploader: React.FC<ScormUploaderProps> = ({ courseId, onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [packageInfo, setPackageInfo] = useState<ScormPackageInfo | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessonNumber, setLessonNumber] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const { toast } = useToast();

  const validateScormPackage = useCallback((file: File): ScormPackageInfo => {
    const info: ScormPackageInfo = {
      fileName: file.name,
      size: file.size,
      isValid: false
    };

    // Check if it's a ZIP file
    if (!file.name.toLowerCase().endsWith('.zip')) {
      info.error = 'SCORM package must be a ZIP file';
      return info;
    }

    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      info.error = 'File size must be less than 100MB';
      return info;
    }

    // Basic validation passed
    info.isValid = true;
    return info;
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPackageInfo(null);
      return;
    }

    const info = validateScormPackage(file);
    setSelectedFile(file);
    setPackageInfo(info);

    // Auto-populate title from filename if empty
    if (!title && info.isValid) {
      const nameWithoutExt = file.name.replace(/\.zip$/i, '');
      setTitle(nameWithoutExt.replace(/[_-]/g, ' '));
    }
  }, [validateScormPackage, title]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const input = document.createElement('input');
      input.type = 'file';
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });
      const fakeEvent = {
        target: input,
        currentTarget: input,
        nativeEvent: event.nativeEvent,
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        defaultPrevented: event.defaultPrevented,
        eventPhase: event.eventPhase,
        isTrusted: event.isTrusted,
        preventDefault: () => {},
        isDefaultPrevented: () => false,
        stopPropagation: () => {},
        isPropagationStopped: () => false,
        persist: () => {},
        timeStamp: event.timeStamp,
        type: 'change'
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSaveScormPackage = async () => {
    if (!selectedFile || !packageInfo?.isValid || !title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select a valid SCORM package and provide a title.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress('Preparing upload...');

    try {
      // Create FormData for the upload
      const formData = new FormData();
      formData.append('scorm_package', selectedFile);
      formData.append('course_id', courseId);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('lesson_number', lessonNumber.toString());

      setUploadProgress('Uploading SCORM package...');

      // Call the edge function to process the SCORM package
      const { data, error } = await supabase.functions.invoke('process-scorm-package', {
        body: formData
      });

      if (error) {
        console.error('SCORM upload error:', error);
        throw new Error(error.message || 'Failed to upload SCORM package');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to process SCORM package');
      }

      setUploadProgress('SCORM package processed successfully!');
      
      toast({
        title: "Success",
        description: "SCORM package uploaded and lesson created successfully!",
      });

      // Reset form
      setSelectedFile(null);
      setPackageInfo(null);
      setTitle('');
      setDescription('');
      setLessonNumber(lessonNumber + 1);

      // Clear file input
      const fileInput = document.getElementById('scorm-file-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      // Notify parent component
      if (onUploadComplete && data.lesson?.id) {
        onUploadComplete(data.lesson.id);
      }

    } catch (error) {
      console.error('Error uploading SCORM package:', error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Upload Error",
        description: message,
        variant: "destructive"
      });
      
      setUploadProgress('');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Upload SCORM Package
        </CardTitle>
        <CardDescription>
          Upload a SCORM-compliant learning package as a ZIP file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div>
          <Label htmlFor="scorm-file-input" className="text-sm font-medium">
            SCORM Package (ZIP)
          </Label>
          <div
            className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              id="scorm-file-input"
              type="file"
              accept=".zip"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <Archive className="h-10 w-10 text-muted-foreground" />
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('scorm-file-input')?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose SCORM Package
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Or drag and drop a ZIP file here
              </p>
            </div>
          </div>
        </div>

        {/* Package Info */}
        {packageInfo && (
          <Alert className={packageInfo.isValid ? "border-green-200 bg-green-50" : "border-destructive bg-destructive/10"}>
            {packageInfo.isValid ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            <AlertDescription>
              {packageInfo.isValid ? (
                <div className="space-y-1">
                  <p><strong>File:</strong> {packageInfo.fileName}</p>
                  <p><strong>Size:</strong> {formatFileSize(packageInfo.size)}</p>
                  <p className="text-green-600">✓ Valid SCORM package format</p>
                </div>
              ) : (
                <p className="text-destructive">{packageInfo.error}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Lesson Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lesson-title">Lesson Title *</Label>
            <Input
              id="lesson-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter lesson title"
              disabled={isUploading}
              required
            />
          </div>
          <div>
            <Label htmlFor="lesson-number">Lesson Number</Label>
            <Input
              id="lesson-number"
              type="number"
              value={lessonNumber}
              onChange={(e) => setLessonNumber(parseInt(e.target.value) || 1)}
              min={1}
              disabled={isUploading}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="lesson-description">Description</Label>
          <Textarea
            id="lesson-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter lesson description (optional)"
            rows={3}
            disabled={isUploading}
          />
        </div>

        {/* Upload Progress */}
        {isUploading && uploadProgress && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>{uploadProgress}</AlertDescription>
          </Alert>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSaveScormPackage}
          disabled={!selectedFile || !packageInfo?.isValid || !title.trim() || isUploading}
          className="w-full"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing SCORM Package...
            </>
          ) : (
            <>
              <Package className="h-4 w-4 mr-2" />
              Save SCORM Package
            </>
          )}
        </Button>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Requirements:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Package must be a ZIP file containing SCORM content</li>
            <li>Should include imsmanifest.xml in the root directory</li>
            <li>Maximum file size: 100MB</li>
            <li>Supported SCORM versions: 1.2 and 2004</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScormUploader;