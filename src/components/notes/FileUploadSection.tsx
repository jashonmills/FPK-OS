import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFileUploads } from '@/hooks/useFileUploads';
import { useFlashcardPreview } from '@/hooks/useFlashcardPreview';
import { useRealTimeProcessing } from '@/hooks/useRealTimeProcessing';
import { useFileUploadSubscription } from '@/hooks/useFileUploadSubscription';
import { useToast } from '@/hooks/use-toast';
import FileUploadDropzone from './FileUploadDropzone';
import FileUploadProgress from './FileUploadProgress';
import { allowedTypes, maxFileSize, formatFileSize } from './FileUploadUtils';

const FileUploadSection: React.FC = () => {
  const { user } = useAuth();
  const { uploads, createUpload, updateUpload, deleteUpload } = useFileUploads();
  const { addPreviewCards } = useFlashcardPreview();
  const { startProcessing, completeStage, errorStage } = useRealTimeProcessing();
  const { subscribe, unsubscribe } = useFileUploadSubscription();
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<Record<string, number>>({});
  const [processingTimeouts, setProcessingTimeouts] = useState<Record<string, NodeJS.Timeout>>({});
  const subscriptionIdRef = useRef<string>(`notes-upload-${Date.now()}`);

  // Set up centralized subscription
  useEffect(() => {
    if (!user?.id) return;

    const subscriptionId = subscriptionIdRef.current;
    console.log(`📡 Setting up notes file upload handler: ${subscriptionId}`);

    const handleFileUploadUpdate = async (payload: any) => {
      console.log('🔄 Notes file upload updated:', payload);
      
      if (payload.new.processing_status === 'completed') {
        console.log('✅ Processing completed:', payload.new.id);
        
        completeStage(payload.new.id, 'generation');
        
        // Clear timeout and progress
        setProcessingProgress(prev => {
          const newState = { ...prev };
          delete newState[payload.new.id];
          return newState;
        });
        
        setProcessingTimeouts(prev => {
          if (prev[payload.new.id]) {
            clearTimeout(prev[payload.new.id]);
          }
          const newState = { ...prev };
          delete newState[payload.new.id];
          return newState;
        });

        // Fetch flashcards and add to preview
        try {
          const { data, error } = await supabase.functions.invoke('process-file-flashcards', {
            body: {
              uploadId: payload.new.id,
              filePath: payload.new.storage_path,
              fileName: payload.new.file_name,
              fileType: payload.new.file_type,
              userId: user.id,
              previewMode: true,
              fetchOnly: true
            }
          });

          if (error) {
            console.error('❌ Error fetching flashcards:', error);
            toast({
              title: "⚠️ Processing complete",
              description: `${payload.new.file_name} processed but couldn't retrieve flashcards.`,
            });
          } else if (data?.flashcards?.length > 0) {
            const previewCards = data.flashcards.map((card: any, index: number) => ({
              front_content: card.front_content || card.front || '',
              back_content: card.back_content || card.back || '',
              title: `${payload.new.file_name} - Card ${index + 1}`,
              source: 'upload' as const,
              status: 'new' as const,
              session_id: payload.new.id
            }));

            addPreviewCards(previewCards);
            
            toast({
              title: "🎉 Flashcards ready!",
              description: `Generated ${data.flashcards.length} flashcards from ${payload.new.file_name}. Check the preview above!`,
            });
          }
        } catch (error) {
          console.error('💥 Error in completion handling:', error);
        }
      } else if (payload.new.processing_status === 'failed') {
        console.log('❌ Processing failed:', payload.new.id);
        
        errorStage(payload.new.id, 'generation', payload.new.error_message || 'Processing failed');
        
        // Clean up
        setProcessingProgress(prev => {
          const newState = { ...prev };
          delete newState[payload.new.id];
          return newState;
        });
        
        setProcessingTimeouts(prev => {
          if (prev[payload.new.id]) {
            clearTimeout(prev[payload.new.id]);
          }
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
    };

    subscribe(subscriptionId, handleFileUploadUpdate);

    return () => {
      console.log(`🔌 Cleaning up notes file upload handler: ${subscriptionId}`);
      unsubscribe(subscriptionId);
      
      // Clean up timeouts
      Object.values(processingTimeouts).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, [user?.id, subscribe, unsubscribe]);

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
      console.log('🤖 Starting AI processing for file:', file.name);
      
      startProcessing(uploadId, file.name, file.size);
      
      setTimeout(() => completeStage(uploadId, 'download'), 2000);
      setTimeout(() => completeStage(uploadId, 'extraction'), 4000);
      
      const { data, error } = await supabase.functions.invoke('process-file-flashcards', {
        body: {
          uploadId,
          filePath,
          fileName: file.name,
          fileType: file.type,
          userId: user.id,
          previewMode: true
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        errorStage(uploadId, 'generation', error.message || 'AI processing failed');
        throw error;
      }

      console.log('🎯 Processing response:', data);

      if (data?.flashcards?.length > 0) {
        const previewCards = data.flashcards.map((card: any, index: number) => ({
          front_content: card.front_content || card.front || '',
          back_content: card.back_content || card.back || '',
          title: `${file.name} - Card ${index + 1}`,
          source: 'upload' as const,
          status: 'new' as const,
          session_id: uploadId
        }));

        addPreviewCards(previewCards);
        
        toast({
          title: "🎉 Cards ready for preview!",
          description: `${data.flashcards.length} flashcards generated and added to preview. Review them above!`,
        });
      }

      return data.flashcardsGenerated || 0;

    } catch (error) {
      console.error('Processing error:', error);
      errorStage(uploadId, 'generation', error instanceof Error ? error.message : 'Processing failed');
      throw error;
    }
  };

  const handleFiles = async (files: FileList) => {
    if (!user || files.length === 0) return;

    setUploading(true);
    
    for (const file of Array.from(files)) {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "❌ File type not supported",
          description: `${file.type} files are not supported. Please upload PDF, DOC, PPT, TXT, MD, CSV, or RTF files.`,
          variant: "destructive"
        });
        continue;
      }

      if (file.size > maxFileSize) {
        toast({
          title: "❌ File too large",
          description: `File size must be less than ${formatFileSize(maxFileSize)}. Your file is ${formatFileSize(file.size)}.`,
          variant: "destructive"
        });
        continue;
      }

      try {
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

        createUpload({
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: filePath
        });

        toast({
          title: "✅ File uploaded",
          description: `${file.name} uploaded successfully. Starting AI processing...`,
        });

        setTimeout(async () => {
          try {
            const { data: uploadRecord } = await supabase
              .from('file_uploads')
              .select('*')
              .eq('user_id', user.id)
              .eq('storage_path', filePath)
              .single();

            if (!uploadRecord) {
              throw new Error('Upload record not found');
            }

            const baseTimeout = 180000;
            const sizeMultiplier = Math.min(file.size / (10 * 1024 * 1024), 2.5);
            const timeoutDuration = Math.min(baseTimeout * (1 + sizeMultiplier), 480000);

            const timeoutId = setTimeout(() => {
              console.log('Processing timeout for upload:', uploadRecord.id);
              updateUpload({
                id: uploadRecord.id,
                processing_status: 'failed',
                error_message: 'Processing timeout - file may be too complex. Try breaking into smaller sections.'
              });

              errorStage(uploadRecord.id, 'generation', 'Processing timeout');

              setProcessingProgress(prev => {
                const newState = { ...prev };
                delete newState[uploadRecord.id];
                return newState;
              });

              toast({
                title: "⏱️ Processing timeout",
                description: "File processing took too long. Try uploading smaller sections.",
                variant: "destructive"
              });
            }, timeoutDuration);

            setProcessingTimeouts(prev => ({
              ...prev,
              [uploadRecord.id]: timeoutId
            }));

            await processFileForFlashcards(file, uploadRecord.id, filePath);

          } catch (error) {
            console.error('AI processing error:', error);
            
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
                error_message: 'Failed to process file - please try again'
              });

              errorStage(uploadRecord.id, 'generation', 'Processing failed');

              setProcessingProgress(prev => {
                const newState = { ...prev };
                delete newState[uploadRecord.id];
                return newState;
              });

              setProcessingTimeouts(prev => {
                if (prev[uploadRecord.id]) {
                  clearTimeout(prev[uploadRecord.id]);
                }
                const newState = { ...prev };
                delete newState[uploadRecord.id];
                return newState;
              });
            }

            toast({
              title: "❌ Processing failed",
              description: "Failed to generate flashcards. Please try again.",
              variant: "destructive"
            });
          }
        }, 1000);

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
    setProcessingTimeouts(prev => {
      if (prev[id]) {
        clearTimeout(prev[id]);
      }
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    
    setProcessingProgress(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    
    deleteUpload(id);
  };

  const retryProcessing = async (upload: any) => {
    try {
      updateUpload({
        id: upload.id,
        processing_status: 'processing',
        error_message: null
      });

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
      }, 300000);

      setProcessingTimeouts(prev => ({
        ...prev,
        [upload.id]: timeoutId
      }));

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
        <FileUploadDropzone
          dragActive={dragActive}
          uploading={uploading}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onFileInput={handleFileInput}
          maxFileSize={maxFileSize}
        />

        <FileUploadProgress
          uploads={uploads}
          processingProgress={processingProgress}
          onRemoveUpload={removeUpload}
          onRetryProcessing={retryProcessing}
        />
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;
