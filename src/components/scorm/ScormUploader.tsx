import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, File, CheckCircle, AlertCircle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScormUploaderProps {
  onUploadComplete?: () => void;
}

interface UploadedFile {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  packageId?: string;
}

export function ScormUploader({ onUploadComplete }: ScormUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [packageInfo, setPackageInfo] = useState({
    title: "",
    description: "",
    category: "general"
  });
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const scormFiles = acceptedFiles.filter(file => {
      return file.name.toLowerCase().endsWith('.zip') && file.size <= 300 * 1024 * 1024; // 300MB limit
    });

    if (scormFiles.length !== acceptedFiles.length) {
      toast({
        title: "Invalid files detected",
        description: "Only ZIP files under 300MB are allowed for SCORM packages.",
        variant: "destructive"
      });
    }

    const newFiles: UploadedFile[] = scormFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Auto-fill title from filename if empty
    if (!packageInfo.title && scormFiles.length > 0) {
      const fileName = scormFiles[0].name.replace('.zip', '');
      setPackageInfo(prev => ({ ...prev, title: fileName }));
    }

    // Start upload process for each file
    newFiles.forEach((fileInfo, index) => {
      uploadScormPackage(fileInfo, index + uploadedFiles.length);
    });
  }, [uploadedFiles.length, packageInfo.title, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip']
    },
    multiple: false,
    maxSize: 300 * 1024 * 1024 // 300MB
  });

  const uploadScormPackage = async (fileInfo: UploadedFile, fileIndex: number) => {
    try {
      const { file } = fileInfo;
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Step 1: Upload ZIP to storage
      const storageKey = `scorm-packages/${Date.now()}-${file.name}`;
      
      updateFileProgress(fileIndex, 10, 'uploading');
      
      const { error: uploadError } = await supabase.storage
        .from('scorm-packages')
        .upload(storageKey, file);

      if (uploadError) throw uploadError;

      updateFileProgress(fileIndex, 50, 'processing');

      // Step 2: Create package record
      const { data: packageData, error: packageError } = await supabase
        .from('scorm_packages')
        .insert({
          title: packageInfo.title || file.name.replace('.zip', ''),
          description: packageInfo.description,
          zip_path: storageKey,
          status: 'uploading',
          created_by: user.id,
          metadata: {
            originalFileName: file.name,
            fileSize: file.size,
            uploadedAt: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (packageError) throw packageError;

      // Step 3: Process package with edge function
      const { data, error: processError } = await supabase.functions.invoke('scorm-parser-production', {
        body: {
          packageId: packageData.id,
          fileName: file.name,
          fileSize: file.size
        }
      });

      if (processError) throw processError;

      updateFileProgress(fileIndex, 100, 'completed');
      
      setUploadedFiles(prev => 
        prev.map((f, i) => 
          i === fileIndex ? { ...f, packageId: packageData.id } : f
        )
      );

      toast({
        title: "SCORM package uploaded successfully",
        description: `${file.name} has been processed and is ready to use.`
      });

      if (onUploadComplete) {
        onUploadComplete();
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      updateFileProgress(fileIndex, 0, 'error', error.message);
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload SCORM package",
        variant: "destructive"
      });
    }
  };

  const updateFileProgress = (
    fileIndex: number, 
    progress: number, 
    status: UploadedFile['status'],
    error?: string
  ) => {
    setUploadedFiles(prev => 
      prev.map((file, i) => 
        i === fileIndex ? { ...file, progress, status, error } : file
      )
    );
  };

  const removeFile = (fileIndex: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== fileIndex));
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Upload className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Package Information Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Package Title</Label>
          <Input
            id="title"
            placeholder="Enter package title"
            value={packageInfo.title}
            onChange={(e) => setPackageInfo(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            placeholder="e.g., Training, Compliance"
            value={packageInfo.category}
            onChange={(e) => setPackageInfo(prev => ({ ...prev, category: e.target.value }))}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the learning content"
          value={packageInfo.description}
          onChange={(e) => setPackageInfo(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      {/* Upload Area */}
      <Card 
        {...getRootProps()} 
        className={`cursor-pointer border-2 border-dashed transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <input {...getInputProps()} />
          <File className={`h-12 w-12 mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop your SCORM package here' : 'Upload SCORM Package'}
            </p>
            <p className="text-muted-foreground mb-4">
              Drag and drop a ZIP file containing your SCORM package, or click to browse
            </p>
            <Button type="button">
              Choose File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Upload Progress</h3>
          {uploadedFiles.map((file, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(file.status)}
                    <span className="font-medium">{file.file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={file.status === 'uploading' || file.status === 'processing'}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {file.status !== 'completed' && file.status !== 'error' && (
                  <Progress value={file.progress} className="mb-2" />
                )}
                
                <p className="text-sm text-muted-foreground">
                  {file.status === 'uploading' && 'Uploading file...'}
                  {file.status === 'processing' && 'Processing SCORM package...'}
                  {file.status === 'completed' && `Successfully processed (Package ID: ${file.packageId})`}
                  {file.status === 'error' && `Error: ${file.error}`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Help Information */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>SCORM Package Requirements:</strong>
          <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
            <li>ZIP file containing imsmanifest.xml in the root</li>
            <li>SCORM 1.2 or 2004 standard supported</li>
            <li>Maximum file size: 300MB</li>
            <li>All referenced files must be included in the ZIP</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}