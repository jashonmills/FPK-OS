
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useFileUploads } from '@/hooks/useFileUploads';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

const FileUploadSection: React.FC = () => {
  const { user } = useAuth();
  const { createFlashcard } = useFlashcards();
  const { uploads, createUpload, updateUpload, deleteUpload } = useFileUploads();
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
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

  const processFileForFlashcards = async (file: File, uploadId: string) => {
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
        toast({
          title: "File type not supported",
          description: `File type ${file.type} is not supported. Please upload PDF, TXT, or DOC files.`,
          variant: "destructive"
        });
        continue;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size must be less than 10MB.",
          variant: "destructive"
        });
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
          toast({
            title: "Upload failed",
            description: "Failed to upload file to storage.",
            variant: "destructive"
          });
          continue;
        }

        // Record upload in database
        createUpload({
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: filePath
        });

        toast({
          title: "File uploaded",
          description: `${file.name} uploaded successfully. Processing flashcards...`,
        });

        // Simulate processing and generate flashcards
        setTimeout(async () => {
          try {
            // Find the upload record by file name and storage path
            const { data: uploadRecord } = await supabase
              .from('file_uploads')
              .select('*')
              .eq('user_id', user.id)
              .eq('storage_path', filePath)
              .single();

            if (!uploadRecord) return;

            // Update status to processing
            updateUpload({
              id: uploadRecord.id,
              processing_status: 'processing'
            });

            const flashcardCount = await processFileForFlashcards(file, uploadRecord.id);
            
            // Update upload status to completed
            updateUpload({
              id: uploadRecord.id,
              processing_status: 'completed',
              generated_flashcards_count: flashcardCount
            });

            toast({
              title: "Flashcards generated",
              description: `Generated ${flashcardCount} flashcards from ${file.name}`,
            });

          } catch (error) {
            console.error('Processing error:', error);
            
            // Find and update the upload record with error status
            const { data: uploadRecord } = await supabase
              .from('file_uploads')
              .select('*')
              .eq('user_id', user.id)
              .eq('storage_path', filePath)
              .single();

            if (uploadRecord) {
              updateUpload({
                id: uploadRecord.id,
                processing_status: 'failed',
                error_message: 'Failed to process file'
              });
            }

            toast({
              title: "Processing failed",
              description: "Failed to generate flashcards from the file.",
              variant: "destructive"
            });
          }
        }, 3000); // Simulate 3 second processing time

      } catch (error) {
        console.error('File upload error:', error);
        toast({
          title: "Upload error",
          description: "An unexpected error occurred during upload.",
          variant: "destructive"
        });
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
    deleteUpload(id);
  };

  return (
    <Card className="fpk-card border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          📤 Upload to Generate Flashcards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
          <h3 className="text-base sm:text-lg font-medium mb-2 break-words px-2">
            Drop your files here or click to browse
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 break-words px-2 leading-relaxed">
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
          <Button asChild disabled={uploading} size="sm" className="text-xs sm:text-sm">
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {uploading ? 'Processing...' : 'Choose Files'}
            </label>
          </Button>
        </div>

        {/* Upload Progress */}
        {uploads.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm sm:text-base">Recent Uploads</h3>
            {uploads.map((upload) => (
              <div key={upload.id} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start sm:items-center justify-between mb-2 gap-2">
                  <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
                    <FileText className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="font-medium text-sm sm:text-base break-words leading-tight">{upload.file_name}</span>
                    <Badge 
                      variant={
                        upload.processing_status === 'completed' ? 'default' :
                        upload.processing_status === 'failed' ? 'destructive' : 'secondary'
                      }
                      className="text-xs flex-shrink-0"
                    >
                      {upload.processing_status}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeUpload(upload.id)}
                    className="flex-shrink-0 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {upload.processing_status === 'processing' && (
                  <div className="space-y-2">
                    <Progress value={66} className="h-2" />
                    <p className="text-xs text-gray-600 break-words">Generating flashcards...</p>
                  </div>
                )}
                
                {upload.processing_status === 'completed' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">
                      Generated {upload.generated_flashcards_count} flashcards
                    </span>
                  </div>
                )}
                
                {upload.processing_status === 'failed' && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">
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
