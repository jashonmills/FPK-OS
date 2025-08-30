import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, FileText, CheckCircle, XCircle, 
  AlertCircle, ArrowLeft, Package 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'parsing' | 'success' | 'error';
  error?: string;
  packageId?: string;
}

export const ScormUpload: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip']
    },
    multiple: false,
    disabled: isUploading
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (fileData: UploadFile, index: number) => {
    try {
      // Update status to uploading
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'uploading', progress: 10 } : f
      ));

      // Upload to storage
      const fileName = `${Date.now()}_${fileData.file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('scorm-packages')
        .upload(fileName, fileData.file);

      if (uploadError) throw uploadError;

      // Update progress
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, progress: 50 } : f
      ));

      // Create package record
      const packageData = {
        title: title || fileData.file.name.replace('.zip', ''),
        description: description || '',
        zip_path: uploadData.path,
        manifest_path: '',
        extract_path: '',
        status: 'uploading' as const,
        is_public: isPublic,
        metadata: {
          originalFileName: fileData.file.name,
          fileSize: fileData.file.size,
          uploadedAt: new Date().toISOString()
        }
      };

      const { data: packageResult, error: packageError } = await supabase
        .from('scorm_packages')
        .insert([packageData])
        .select()
        .single();

      if (packageError) throw packageError;

      // Update progress
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          progress: 70, 
          status: 'parsing',
          packageId: packageResult.id 
        } : f
      ));

      // Parse the package
      const { data: parseResult, error: parseError } = await supabase.functions
        .invoke('scorm-parser-production', {
          body: {
            packageId: packageResult.id,
            filePath: uploadData.path
          }
        });

      if (parseError) throw parseError;

      // Final success
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          progress: 100, 
          status: 'success'
        } : f
      ));

      toast({
        title: "Upload Successful",
        description: `${fileData.file.name} has been uploaded and parsed successfully.`,
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          status: 'error',
          error: error.message 
        } : f
      ));

      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select a SCORM package to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload all files
      await Promise.all(
        files.map((file, index) => uploadFile(file, index))
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'uploading':
      case 'parsing':
        return <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const allSuccess = files.length > 0 && files.every(f => f.status === 'success');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Upload SCORM Package</h1>
              <p className="text-muted-foreground">Upload and parse your SCORM content packages</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Select SCORM Package
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
              >
                <input {...getInputProps()} />
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-lg font-medium">Drop the SCORM package here...</p>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-2">
                      Drop your SCORM package here, or click to select
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports ZIP files containing SCORM 1.2 or SCORM 2004 content
                    </p>
                  </>
                )}
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  {files.map((fileData, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      {getStatusIcon(fileData.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{fileData.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {fileData.status === 'uploading' || fileData.status === 'parsing' ? (
                          <Progress value={fileData.progress} className="mt-2" />
                        ) : null}
                        {fileData.error && (
                          <p className="text-sm text-red-600 mt-1">{fileData.error}</p>
                        )}
                      </div>
                      {fileData.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter package title (optional)"
                  disabled={isUploading}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter package description (optional)"
                  rows={3}
                  disabled={isUploading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public">Make Public</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to view and launch this package
                  </p>
                </div>
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  disabled={isUploading}
                />
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={handleUpload}
                  disabled={files.length === 0 || isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Package
                    </>
                  )}
                </Button>

                {allSuccess && (
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => navigate('/dashboard/scorm/studio')}
                  >
                    Return to Studio
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Upload Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Ensure your SCORM package is a valid ZIP file with imsmanifest.xml</li>
              <li>• Maximum file size is 500MB per package</li>
              <li>• Supports both SCORM 1.2 and SCORM 2004 specifications</li>
              <li>• Package parsing may take a few minutes for large files</li>
              <li>• Public packages can be viewed by anyone with the link</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};