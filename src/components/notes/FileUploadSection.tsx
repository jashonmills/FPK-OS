
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFlashcards } from '@/hooks/useFlashcards';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

interface FileUpload {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  generated_flashcards_count: number;
  error_message: string | null;
  created_at: string;
}

const FileUploadSection: React.FC = () => {
  const { user } = useAuth();
  const { createFlashcard } = useFlashcards();
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFileForFlashcards = async (file: File) => {
    // Simulate AI processing - in real implementation, this would call an AI service
    const sampleFlashcards = [
      {
        front_content: `Key concept from ${file.name}`,
        back_content: `Important definition or explanation related to the uploaded content.`
      },
      {
        front_content: `Main idea from the document`,
        back_content: `Detailed explanation of the main concept discussed in the file.`
      }
    ];

    // Create flashcards
    for (const card of sampleFlashcards) {
      createFlashcard(card);
    }

    return sampleFlashcards.length;
  };

  const handleFiles = async (files: FileList) => {
    if (!user || files.length === 0) return;

    setUploading(true);
    
    for (const file of Array.from(files)) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported. Please upload PDF, TXT, or DOC files.`);
        continue;
      }

      try {
        // Upload file to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('study-files')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        // Record upload in database
        const { data: uploadRecord, error: dbError } = await supabase
          .from('file_uploads')
          .insert({
            user_id: user.id,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            storage_path: filePath,
            processing_status: 'processing'
          })
          .select()
          .single();

        if (dbError) {
          console.error('Database error:', dbError);
          continue;
        }

        setUploads(prev => [...prev, uploadRecord]);

        // Simulate processing and generate flashcards
        setTimeout(async () => {
          try {
            const flashcardCount = await processFileForFlashcards(file);
            
            // Update upload status
            await supabase
              .from('file_uploads')
              .update({
                processing_status: 'completed',
                generated_flashcards_count: flashcardCount
              })
              .eq('id', uploadRecord.id);

            setUploads(prev => 
              prev.map(upload => 
                upload.id === uploadRecord.id 
                  ? { ...upload, processing_status: 'completed', generated_flashcards_count: flashcardCount }
                  : upload
              )
            );
          } catch (error) {
            console.error('Processing error:', error);
            await supabase
              .from('file_uploads')
              .update({
                processing_status: 'failed',
                error_message: 'Failed to process file'
              })
              .eq('id', uploadRecord.id);

            setUploads(prev => 
              prev.map(upload => 
                upload.id === uploadRecord.id 
                  ? { ...upload, processing_status: 'failed', error_message: 'Failed to process file' }
                  : upload
              )
            );
          }
        }, 3000); // Simulate 3 second processing time

      } catch (error) {
        console.error('File upload error:', error);
      }
    }
    
    setUploading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  };

  return (
    <Card className="fpk-card border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📤 Upload to Generate Flashcards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">
            Drop your files here or click to browse
          </h3>
          <p className="text-gray-600 mb-4">
            Support for PDF, TXT, and DOC files up to 10MB
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileInput}
            disabled={uploading}
          />
          <Button asChild disabled={uploading}>
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileText className="h-4 w-4 mr-2" />
              {uploading ? 'Processing...' : 'Choose Files'}
            </label>
          </Button>
        </div>

        {/* Upload Progress */}
        {uploads.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Recent Uploads</h3>
            {uploads.map((upload) => (
              <div key={upload.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{upload.file_name}</span>
                    <Badge 
                      variant={
                        upload.processing_status === 'completed' ? 'default' :
                        upload.processing_status === 'failed' ? 'destructive' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {upload.processing_status}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeUpload(upload.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {upload.processing_status === 'processing' && (
                  <div className="space-y-2">
                    <Progress value={66} className="h-2" />
                    <p className="text-xs text-gray-600">Generating flashcards...</p>
                  </div>
                )}
                
                {upload.processing_status === 'completed' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">
                      Generated {upload.generated_flashcards_count} flashcards
                    </span>
                  </div>
                )}
                
                {upload.processing_status === 'failed' && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">
                      {upload.error_message || 'Processing failed'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;
