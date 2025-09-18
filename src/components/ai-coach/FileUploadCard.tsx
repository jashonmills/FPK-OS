import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FileUploadPayload } from '@/types/common-interfaces';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFileUploads, FileUpload } from '@/hooks/useFileUploads';
import { useFileUploadSubscription } from '@/hooks/useFileUploadSubscription';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle, X, RefreshCw, Brain } from 'lucide-react';
import { useCleanup } from '@/utils/cleanupManager';
import { logger } from '@/utils/logger';

const FileUploadCard: React.FC = () => {
  const cleanup = useCleanup('FileUploadCard');
  const { user } = useAuth();
  const { uploads, createUpload, updateUpload, deleteUpload } = useFileUploads();
  const { subscribe, unsubscribe, isConnected, startPolling, stopPolling } = useFileUploadSubscription();
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<Record<string, number>>({});
  const [processingTimeouts, setProcessingTimeouts] = useState<Record<string, string>>({});
  const subscriptionIdRef = useRef<string>(`ai-coach-upload-${Date.now()}`);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

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

  const maxFileSize = 100 * 1024 * 1024; // 100MB

  // Define the handler function in the component scope with error handling
  const handleFileUploadUpdate = useCallback((payload: FileUploadPayload) => {
    try {
      
      if (payload.new.processing_status === 'completed') {
        // Clear timeout and progress
        if (processingTimeouts[payload.new.id]) {
          cleanup.cleanup(processingTimeouts[payload.new.id]);
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

        // Stop polling if it was running
        stopPolling(payload.new.id);
        
        toast({
          title: "🧠 AI Coach Ready!",
          description: `Generated ${payload.new.generated_flashcards_count} flashcards from ${payload.new.file_name}. Your AI coach can now provide guidance based on this content!`,
        });
      } else if (payload.new.processing_status === 'failed') {
        // Clear timeout and progress
        if (processingTimeouts[payload.new.id]) {
          cleanup.cleanup(processingTimeouts[payload.new.id]);
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

        // Stop polling if it was running
        stopPolling(payload.new.id);
        
        toast({
          title: "❌ Processing failed",
          description: payload.new.error_message || "Failed to process your study material",
          variant: "destructive"
        });
      }
    } catch (error) {
      logger.error('Error handling file upload update', 'FILE_UPLOAD', error);
      setSubscriptionError('Error processing upload update');
    }
  }, [processingTimeouts, stopPolling, toast]);

  // Set up centralized subscription with improved error handling
  useEffect(() => {
    if (!user?.id) return;

    const subscriptionId = subscriptionIdRef.current;

    try {
      subscribe(subscriptionId, handleFileUploadUpdate);
      setSubscriptionError(null);
    } catch (error) {
      logger.error('Error setting up subscription', 'FILE_UPLOAD', error);
      setSubscriptionError('Failed to set up real-time updates');
      // Continue without real-time updates instead of crashing
      return;
    }

    return () => {
      try {
        unsubscribe(subscriptionId);
      } catch (error) {
        logger.error('Error cleaning up subscription', 'FILE_UPLOAD', error);
      }
      
      // Clean up timeouts via cleanup manager
      Object.keys(processingTimeouts).forEach(uploadId => {
        const timeoutId = processingTimeouts[uploadId];
        if (timeoutId) {
          try {
            cleanup.cleanup(timeoutId);
          } catch (error) {
            logger.warn('Error clearing timeout via cleanup manager', 'FILE_UPLOAD', { error, uploadId });
          }
        }
      });
    };
  }, [user?.id, subscribe, unsubscribe]); // Added missing dependencies

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
        logger.api('Edge function error', error);
        throw error;
      }

      return data.flashcardsGenerated || 0;

    } catch (error) {
      logger.error('Error processing file for AI coach', 'FILE_PROCESSING', error);
      throw error;
    }
  };

  const simulateProgress = (uploadId: string, duration: number = 4000) => { // Reduced from 6000ms
    const steps = 30; // Reduced from 40
    const interval = duration / steps;
    let currentStep = 0;

    const progressIntervalId = cleanup.setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / steps) * 85, 85);
      
      setProcessingProgress(prev => ({
        ...prev,
        [uploadId]: progress
      }));

      if (currentStep >= steps) {
        cleanup.cleanup(progressIntervalId);
      }
    }, interval);

    // Auto-cleanup after duration + buffer
    cleanup.setTimeout(() => {
      cleanup.cleanup(progressIntervalId);
    }, duration + 1000);

    return progressIntervalId;
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
          description: `${getFileTypeLabel(file.type)} files are not supported for AI coaching. Please upload PDF, DOC, PPT, TXT, MD, CSV, or RTF files.`,
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
        // Upload file to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('study-files')
          .upload(filePath, file);

        if (uploadError) {
          logger.error('Upload error', 'FILE_UPLOAD', uploadError);
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
          title: "✅ File uploaded for AI coaching",
          description: `${file.name} uploaded successfully. AI is now analyzing your study material...`,
        });

        // Process with AI after upload
        cleanup.setTimeout(async () => {
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

            // Start progress animation
            simulateProgress(uploadRecord.id, 7000);

            // Set timeout for AI processing - reduced max timeout
            const baseTimeout = 120000; // 2 minutes base (reduced from 3)
            const sizeMultiplier = Math.min(file.size / (10 * 1024 * 1024), 1.5); // Reduced multiplier
            const timeoutDuration = Math.min(baseTimeout * (1 + sizeMultiplier), 300000); // Max 5 minutes (reduced from 8)

            const timeoutId = cleanup.setTimeout(() => {
              updateUpload({
                id: uploadRecord.id,
                processing_status: 'failed',
                error_message: 'AI processing timeout - try breaking your content into smaller sections.'
              });

              setProcessingProgress(prev => {
                const newState = { ...prev };
                delete newState[uploadRecord.id];
                return newState;
              });

              toast({
                title: "⏱️ AI processing timeout",
                description: "Content processing took too long. Try uploading smaller sections.",
                variant: "destructive"
              });
            }, timeoutDuration);

            setProcessingTimeouts(prev => ({
              ...prev,
              [uploadRecord.id]: timeoutId
            }));

            // Process file with AI
            await processFileForFlashcards(file, uploadRecord.id, filePath);

            // Start polling as fallback if real-time isn't connected
            if (!isConnected || subscriptionError) {
              startPolling(uploadRecord.id, (updatedUpload) => {
                if (updatedUpload.processing_status === 'completed' || updatedUpload.processing_status === 'failed') {
                  handleFileUploadUpdate({ new: updatedUpload, old: uploadRecord });
                }
              });
            }

          } catch (error) {
            logger.error('AI processing error', 'AI_PROCESSING', error);
            
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
                error_message: 'Failed to process with AI - please try again'
              });

              setProcessingProgress(prev => {
                const newState = { ...prev };
                delete newState[uploadRecord.id];
                return newState;
              });

              if (processingTimeouts[uploadRecord.id]) {
                cleanup.cleanup(processingTimeouts[uploadRecord.id]);
                setProcessingTimeouts(prev => {
                  const newState = { ...prev };
                  delete newState[uploadRecord.id];
                  return newState;
                });
              }
            }

            toast({
              title: "❌ AI processing failed",
              description: "Failed to process your study material. Please try again.",
              variant: "destructive"
            });
          }
        }, 1000);

      } catch (error) {
        logger.error('File upload error', 'FILE_UPLOAD', error);
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
    if (processingTimeouts[id]) {
      cleanup.cleanup(processingTimeouts[id]);
      setProcessingTimeouts(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
    
    setProcessingProgress(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    
    deleteUpload(id);
  };

  const retryProcessing = async (upload: FileUpload) => {
    try {
      updateUpload({
        id: upload.id,
        processing_status: 'processing',
        error_message: null
      });

      simulateProgress(upload.id, 7000);

      const timeoutId = cleanup.setTimeout(() => {
        updateUpload({
          id: upload.id,
          processing_status: 'failed',
          error_message: 'AI processing timeout - please try a smaller file'
        });

        setProcessingProgress(prev => {
          const newState = { ...prev };
          delete newState[upload.id];
          return newState;
        });
      }, 300000); // 5 minutes for retry

      setProcessingTimeouts(prev => ({
        ...prev,
        [upload.id]: timeoutId
      }));

      await processFileForFlashcards(
        new File([], upload.file_name as string, { type: upload.file_type as string }),
        upload.id,
        upload.storage_path as string
      );

    } catch (error) {
      logger.error('Retry processing error', 'FILE_PROCESSING', error);
      toast({
        title: "❌ Retry failed",
        description: "Failed to retry AI processing. Please try uploading again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-purple-600" />
          Upload Study Materials for AI Coaching
          {!isConnected && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded ml-2">
              {subscriptionError ? 'Error Mode' : 'Backup Mode'}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscriptionError && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                Real-time updates temporarily unavailable. Using polling fallback.
              </span>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-purple-400 bg-purple-50' 
              : 'border-muted-foreground/25 hover:border-purple-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-purple-600" />
          <h3 className="font-medium mb-2">
            Upload your homework, notes, or textbooks
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            AI will analyze your content and generate flashcards for personalized coaching
          </p>
          <div className="text-xs text-muted-foreground mb-4 space-y-1">
            <p><strong>📁 Supported:</strong> PDF, DOC, DOCX, PPT, PPTX, TXT, MD, CSV, RTF</p>
            <p><strong>📏 Max size:</strong> {formatFileSize(maxFileSize)}</p>
          </div>
          <input
            type="file"
            id="ai-coach-file-upload"
            className="hidden"
            multiple
            accept=".pdf,.txt,.doc,.docx,.ppt,.pptx,.md,.csv,.rtf"
            onChange={handleFileInput}
            disabled={uploading}
          />
          <Button asChild disabled={uploading} size="sm">
            <label htmlFor="ai-coach-file-upload" className="cursor-pointer">
              <FileText className="h-4 w-4 mr-2" />
              {uploading ? 'Processing...' : 'Choose Files'}
            </label>
          </Button>
        </div>

        {/* Upload Progress */}
        {uploads.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">AI Processing Status</h4>
            {uploads.slice(0, 3).map((upload) => (
              <div key={upload.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-sm truncate block">
                        {upload.file_name}
                      </span>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
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
                        className="h-8 w-8 p-0"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeUpload(upload.id)}
                      className="h-8 w-8 p-0"
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
                    <p className="text-xs text-muted-foreground">
                      {processingProgress[upload.id] >= 70 
                        ? '🧠 AI is generating flashcards for coaching...' 
                        : '📖 AI is analyzing your study content...'
                      }
                    </p>
                  </div>
                )}
                
                {upload.processing_status === 'completed' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs">
                      ✅ Ready for AI coaching! Generated {upload.generated_flashcards_count} flashcards
                    </span>
                  </div>
                )}
                
                {upload.processing_status === 'failed' && (
                  <div className="flex items-start gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="text-xs">
                      ❌ {upload.error_message || 'AI processing failed'}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {uploads.length > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                Showing latest 3 uploads. All processed content is available to your AI coach.
              </p>
            )}
          </div>
        )}

        {uploads.filter(u => u.processing_status === 'completed').length > 0 && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 text-purple-700">
              <Brain className="h-4 w-4" />
              <span className="text-sm font-medium">
                🎯 Your AI coach can now provide personalized guidance based on your uploaded study materials!
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;
