
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Image, Film } from 'lucide-react';
import { useKnowledgeBaseFiles } from '@/hooks/useKnowledgeBaseFiles';
import { useBatchProcessing } from '@/hooks/useBatchProcessing';
import BatchProcessingPanel from './BatchProcessingPanel';

const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/rtf',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp'
];

const maxFileSize = 50 * 1024 * 1024; // 50MB

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return Film;
  return FileText;
};

const KBUploader: React.FC = () => {
  const { uploadAndProcessFile } = useKnowledgeBaseFiles();
  const {
    batchState,
    addFiles,
    updateFileStatus,
    processBatch,
    pauseProcessing,
    cancelProcessing,
    clearBatch,
    removeFile,
    isProcessing
  } = useBatchProcessing();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        return false;
      }
      
      if (file.size > maxFileSize) {
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      addFiles(validFiles);
    }
  }, [addFiles]);

  const handleStartProcessing = useCallback(async () => {
    await processBatch(async (file: File, fileId: string) => {
      try {
        updateFileStatus(fileId, 'processing', 50);
        await uploadAndProcessFile(file);
        updateFileStatus(fileId, 'completed', 100);
      } catch (error) {
        throw error;
      }
    });
  }, [processBatch, updateFileStatus, uploadAndProcessFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'text/csv': ['.csv'],
      'application/rtf': ['.rtf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp']
    },
    maxSize: maxFileSize,
    multiple: true,
    disabled: isProcessing
  });

  return (
    <div className="space-y-4">
      <Card className="border-2 border-dashed transition-colors duration-200 hover:border-primary/50">
        <CardContent className="p-6">
          <div 
            {...getRootProps()} 
            className={`cursor-pointer text-center space-y-4 ${
              isDragActive ? 'opacity-75' : ''
            } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            
            <div className="flex justify-center">
              <Upload className={`h-12 w-12 transition-colors ${
                isDragActive ? 'text-primary' : 'text-muted-foreground'
              }`} />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {isDragActive ? 'Drop files here' : 'Upload Knowledge Base Files'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop files or click to browse. These will enhance your AI conversations.
              </p>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>
                  <strong>Supported:</strong> PDF, DOC, DOCX, PPT, PPTX, TXT, MD, CSV, RTF, Images
                </div>
                <div>
                  <strong>Max size:</strong> {formatFileSize(maxFileSize)}
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Choose Files'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <BatchProcessingPanel
        batchState={batchState}
        onStart={handleStartProcessing}
        onPause={pauseProcessing}
        onCancel={cancelProcessing}
        onClear={clearBatch}
        onRemoveFile={removeFile}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default KBUploader;
