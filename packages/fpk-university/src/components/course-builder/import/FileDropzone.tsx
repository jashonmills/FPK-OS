import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle, X, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile?: File;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  disabled?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  acceptedFileTypes = ['.zip', '.json', '.csv'],
  maxFileSize = 100 * 1024 * 1024, // 100MB default
  disabled = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size must be less than ${Math.round(maxFileSize / (1024 * 1024))}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      return `File type not supported. Accepted types: ${acceptedFileTypes.join(', ')}`;
    }

    // SCORM-specific validation
    if (fileExtension === '.zip') {
      // Additional SCORM validation could be added here
      return null;
    }

    return null;
  }, [acceptedFileTypes, maxFileSize]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');
    setDragActive(false);

    if (rejectedFiles.length > 0) {
      setError('File was rejected. Please check file type and size.');
      return;
    }

    if (acceptedFiles.length === 0) {
      setError('No valid files selected.');
      return;
    }

    const file = acceptedFiles[0];
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: {
      'application/zip': ['.zip'],
      'application/json': ['.json'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    disabled
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeDescription = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'zip':
        return 'SCORM Package';
      case 'json':
        return 'Course Definition';
      case 'csv':
        return 'Course Data';
      default:
        return 'Unknown';
    }
  };

  if (selectedFile) {
    return (
      <div className="space-y-3">
        <Label>Selected File</Label>
        <Card className="border border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-green-900">{selectedFile.name}</p>
                    <p className="text-xs text-green-700">
                      {getFileTypeDescription(selectedFile.name)} • {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onFileRemove}
                    className="text-green-700 hover:text-green-900 hover:bg-green-100"
                    disabled={disabled}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label>Upload File</Label>
      <Card 
        {...getRootProps()}
        className={`border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragActive || dragActive
            ? 'border-primary bg-primary/5' 
            : disabled
              ? 'border-muted cursor-not-allowed opacity-50'
              : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <CardContent className="p-8">
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className={`p-4 rounded-full ${
              isDragActive || dragActive 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <Upload className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isDragActive || dragActive 
                  ? 'Drop your file here' 
                  : 'Drop files here or click to browse'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: {acceptedFileTypes.join(', ')} • Max size: {Math.round(maxFileSize / (1024 * 1024))}MB
              </p>
            </div>
            
            {!disabled && (
              <Button variant="outline" size="sm" type="button">
                <FileText className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};