
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useFileUploads } from '@/hooks/useFileUploads';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle, X, Clock } from 'lucide-react';

const FileUploadSection: React.FC = () => {
  const { user } = useAuth();
  const { uploads, createUpload, updateUpload, deleteUpload } = useFileUploads();
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<Record<string, number>>({});
  const [processingTimeouts, setProcessingTimeouts] = useState<Record<string, NodeJS.Timeout>>({});

  // Enhanced file type support
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/markdown',
    'text/csv',
    'application/rtf'
  ];

  const maxFileSize = 50 * 1024 * 1024; // Increased to 50MB

  // Set up real-time subscription to file_uploads table
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('file-uploads-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'file_uploads',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('File upload updated:', payload);
          
          if (payload.new.processing_status === 'completed') {
            // Clear timeout and progress
            if (processingTimeouts[payload.new.id]) {
              clearTimeout(processingTimeouts[payload.new.id]);
            }
            
            setProcessingProgress(prev => {
              const newState = { ...prev };
              delete newState[payload.new.id];
              return newState;
            });
            
            setProcessingTimeouts(prev => {
              const newState = { ...prev };
              delete newState[payload.new.id];
              return newState;
            });
            
            toast({
              title: "✅ Flashcards generated!",
              description: `Successfully created ${payload.new.generated_flashcards_count} flashcards from ${payload.new.file_name}`,
            });
          } else if (payload.new.processing_status === 'failed') {
            // Clear timeout and progress
            if (processingTimeouts[payload.new.id]) {
              clearTimeout(processingTimeouts[payload.new.id]);
            }
            
            setProcessingProgress(prev => {
              const newState = { ...prev };
              delete newState[payload.new.id];
              return newState;
            });
            
            setProcessingTimeouts(prev => {
              const newState = { ...prev };
              delete newState[payload.new.id];
              return newState;
            });
            
            toast({
              title: "❌ Processing failed",
              description: payload.new.error_message || "Failed to generate flashcards",
              variant: "destructive"
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast, processingTimeouts]);

  // Clean up timeouts on component unmount
  useEffect(() => {
    return () => {
      Object.values(processingTimeouts).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, [processingTimeouts]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFileForFlashcards = async (file: File, uploadId: string, filePath: string) => {
    if (!user) return 0;

    try {
      console.log('Starting enhanced AI processing for file:', file.name);
      
      // Call the edge function to process the file
      const { data, error } = await supabase.functions.invoke('process-file-flashcards', {
        body: {
          uploadId,
          filePath,
          fileName: file.name,
          fileType: file.type,
          userId: user.id
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log('Edge function response:', data);
      return data.flashcardsGenerated || 0;

    } catch (error) {
      console.error('Error processing file with AI:', error);
      throw error;
    }
  };

  const simulateProgress = (uploadId: string, duration: number = 3000) => {
    const steps = 30;
    const interval = duration / steps;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / steps) * 100, 90); // Cap at 90% until real completion
      
      setProcessingProgress(prev => ({
        ...prev,
        [uploadId]: progress
      }));

      if (currentStep >= steps) {
        clearInterval(progressInterval);
      }
    }, interval);

    return progressInterval;
  };

  const getFileTypeLabel = (fileType: string) => {
    const typeMap: Record<string, string> = {
      'application/pdf': 'PDF',
      'text/plain': 'TXT',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'application/vnd.ms-powerpoint': 'PPT',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
      'text/markdown': 'MD',
      'text/csv': 'CSV',
      'application/rtf': 'RTF'
    };
    return typeMap[fileType] || 'FILE';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = async (files: FileList) => {
    if (!user || files.length === 0) return;

    setUploading(true);
    
    for (const file of Array.from(files)) {
      // Enhanced file validation
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "❌ File type not supported",
          description: `${getFileTypeLabel(file.type)} files are not supported. Please upload PDF, DOC, PPT, TXT, MD, CSV, or RTF files.`,
          variant: "destructive"
        });
        continue;
      }

      // Increased file size limit
      if (file.size > maxFileSize) {
        toast({
          title: "❌ File too large",
          description: `File size must be less than ${formatFileSize(maxFileSize)}. Your file is ${formatFileSize(file.size)}.`,
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
            title: "❌ Upload failed",
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
          title: "✅ File uploaded",
          description: `${file.name} (${formatFileSize(file.size)}) uploaded successfully. AI processing started...`,
        });

        // Process with AI immediately after upload
        setTimeout(async () => {
          try {
            // Find the upload record
            const { data: uploadRecord } = await supabase
              .from('file_uploads')
              .select('*')
              .eq('user_id', user.id)
              .eq('storage_path', filePath)
              .single();

            if (!uploadRecord) {
              throw new Error('Upload record not found');
            }

            // Update status to processing
            updateUpload({
              id: uploadRecord.id,
              processing_status: 'processing'
            });

            // Start enhanced progress animation
            simulateProgress(uploadRecord.id, 5000);

            // Set extended timeout for larger files (2 minutes)
            const timeoutDuration = Math.min(120000, Math.max(60000, file.size / 1000)); // Dynamic timeout based on file size
            const timeoutId = setTimeout(() => {
              console.log('Processing timeout for upload:', uploadRecord.id);
              updateUpload({
                id: uploadRecord.id,
                processing_status: 'failed',
                error_message: 'Processing timeout - the file may be too complex. Try breaking it into smaller sections.'
              });

              setProcessingProgress(prev => {
                const newState = { ...prev };
                delete newState[uploadRecord.id];
                return newState;
              });

              toast({
                title: "⏱️ Processing timeout",
                description: "File processing took too long. Try uploading smaller sections or simpler content.",
                variant: "destructive"
              });
            }, timeoutDuration);

            setProcessingTimeouts(prev => ({
              ...prev,
              [uploadRecord.id]: timeoutId
            }));

            // Process file with AI
            await processFileForFlashcards(file, uploadRecord.id, filePath);

          } catch (error) {
            console.error('AI processing error:', error);
            
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
                error_message: 'Failed to process file with AI - please try again'
              });

              // Clean up progress state and timeout on error
              setProcessingProgress(prev => {
                const newState = { ...prev };
                delete newState[uploadRecord.id];
                return newState;
              });

              if (processingTimeouts[uploadRecord.id]) {
                clearTimeout(processingTimeouts[uploadRecord.id]);
                setProcessingTimeouts(prev => {
                  const newState = { ...prev };
                  delete newState[uploadRecord.id];
                  return newState;
                });
              }
            }

            toast({
              title: "❌ AI processing failed",
              description: "Failed to generate flashcards. Please try again or use a simpler file.",
              variant: "destructive"
            });
          }
        }, 500);

      } catch (error) {
        console.error('File upload error:', error);
        toast({
          title: "❌ Upload error",
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
    // Clear any associated timeout
    if (processingTimeouts[id]) {
      clearTimeout(processingTimeouts[id]);
      setProcessingTimeouts(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
    
    // Clear progress state
    setProcessingProgress(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    
    deleteUpload(id);
  };

  const retryProcessing = async (upload: any) => {
    try {
      // Update status to processing
      updateUpload({
        id: upload.id,
        processing_status: 'processing',
        error_message: null
      });

      // Start progress animation
      simulateProgress(upload.id, 5000);

      // Set timeout
      const timeoutId = setTimeout(() => {
        updateUpload({
          id: upload.id,
          processing_status: 'failed',
          error_message: 'Processing timeout - please try a smaller file'
        });

        setProcessingProgress(prev => {
          const newState = { ...prev };
          delete newState[upload.id];
          return newState;
        });
      }, 120000);

      setProcessingTimeouts(prev => ({
        ...prev,
        [upload.id]: timeoutId
      }));

      // Process file with AI
      await processFileForFlashcards(
        new File([], upload.file_name, { type: upload.file_type }),
        upload.id,
        upload.storage_path
      );

    } catch (error) {
      console.error('Retry processing error:', error);
      toast({
        title: "❌ Retry failed",
        description: "Failed to retry processing. Please try uploading again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="fpk-card border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          📤 Enhanced File Upload & AI Processing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enhanced Upload Area */}
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
          <div className="text-sm sm:text-base text-gray-600 mb-4 break-words px-2 leading-relaxed space-y-2">
            <p><strong>📁 Supported formats:</strong> PDF, DOC, DOCX, PPT, PPTX, TXT, MD, CSV, RTF</p>
            <p><strong>📏 Size limit:</strong> Up to {formatFileSize(maxFileSize)} per file</p>
            <p><strong>⚡ Processing:</strong> Enhanced AI with dynamic timeout (1-2 minutes)</p>
          </div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            accept=".pdf,.txt,.doc,.docx,.ppt,.pptx,.md,.csv,.rtf"
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

        {/* Enhanced Upload Progress */}
        {uploads.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm sm:text-base">File Processing Status</h3>
            {uploads.map((upload) => (
              <div key={upload.id} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start sm:items-center justify-between mb-2 gap-2">
                  <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
                    <FileText className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-sm sm:text-base break-words leading-tight block">
                        {upload.file_name}
                      </span>
                      <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {getFileTypeLabel(upload.file_type)}
                        </Badge>
                        <span>{formatFileSize(upload.file_size)}</span>
                      </div>
                    </div>
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
                  <div className="flex gap-1">
                    {upload.processing_status === 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryProcessing(upload)}
                        className="flex-shrink-0 h-8 w-8 p-0"
                        title="Retry processing"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeUpload(upload.id)}
                      className="flex-shrink-0 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {upload.processing_status === 'processing' && (
                  <div className="space-y-2">
                    <Progress 
                      value={processingProgress[upload.id] || 0} 
                      className="h-2" 
                    />
                    <p className="text-xs text-gray-600 break-words">
                      {processingProgress[upload.id] >= 85 
                        ? '🧠 AI is finalizing flashcards...' 
                        : '📖 AI is analyzing content...'
                      }
                    </p>
                  </div>
                )}
                
                {upload.processing_status === 'completed' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">
                      ✅ Generated {upload.generated_flashcards_count} flashcards
                    </span>
                  </div>
                )}
                
                {upload.processing_status === 'failed' && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">
                      ❌ {upload.error_message || 'Processing failed'}
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
