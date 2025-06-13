
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, AlertCircle, X, RefreshCw } from 'lucide-react';
import { FileUpload } from '@/hooks/useFileUploads';
import { useRealTimeProcessing } from '@/hooks/useRealTimeProcessing';
import RealTimeProcessingMeter from './RealTimeProcessingMeter';

interface FileUploadProgressProps {
  uploads: FileUpload[];
  processingProgress: Record<string, number>;
  onRemoveUpload: (id: string) => void;
  onRetryProcessing: (upload: FileUpload) => Promise<void>;
}

const FileUploadProgress: React.FC<FileUploadProgressProps> = ({
  uploads,
  processingProgress,
  onRemoveUpload,
  onRetryProcessing
}) => {
  const { processingStates, removeProcessing } = useRealTimeProcessing();

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

  const handleCancelProcessing = (uploadId: string) => {
    removeProcessing(uploadId);
    onRemoveUpload(uploadId);
  };

  if (uploads.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm sm:text-base">File Processing Status</h3>
      {uploads.map((upload) => {
        const processingState = processingStates[upload.id];
        
        // Use real-time processing meter for active processing
        if (upload.processing_status === 'processing' && processingState) {
          return (
            <RealTimeProcessingMeter
              key={upload.id}
              uploadId={upload.id}
              fileName={upload.file_name}
              fileSize={upload.file_size}
              stages={processingState.stages}
              currentStage={processingState.currentStage}
              overallProgress={processingState.overallProgress}
              elapsedTime={processingState.elapsedTime}
              estimatedTimeRemaining={processingState.estimatedTimeRemaining}
              onCancel={() => handleCancelProcessing(upload.id)}
            />
          );
        }

        // Fallback to simple progress for other states
        return (
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
                    onClick={() => onRetryProcessing(upload)}
                    className="flex-shrink-0 h-8 w-8 p-0"
                    title="Retry processing"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveUpload(upload.id)}
                  className="flex-shrink-0 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {upload.processing_status === 'completed' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm break-words">
                  ✅ Generated {upload.generated_flashcards_count} flashcards for preview
                </span>
              </div>
            )}
            
            {upload.processing_status === 'failed' && (
              <div className="flex items-start gap-2 text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm break-words">
                  ❌ {upload.error_message || 'Processing failed'}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FileUploadProgress;
