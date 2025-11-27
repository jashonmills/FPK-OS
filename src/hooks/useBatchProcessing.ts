
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface BatchFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  error?: string;
}

export interface BatchProcessingState {
  files: BatchFile[];
  status: 'idle' | 'processing' | 'paused' | 'completed' | 'cancelled';
  currentIndex: number;
  overallProgress: number;
}

export const useBatchProcessing = () => {
  const [batchState, setBatchState] = useState<BatchProcessingState>({
    files: [],
    status: 'idle',
    currentIndex: -1,
    overallProgress: 0
  });
  
  const { toast } = useToast();
  const processingRef = useRef<boolean>(false);
  const cancelledRef = useRef<boolean>(false);

  const addFiles = useCallback((files: File[]) => {
    const batchFiles: BatchFile[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      status: 'pending',
      progress: 0
    }));

    setBatchState(prev => ({
      ...prev,
      files: [...prev.files, ...batchFiles],
      status: prev.files.length === 0 ? 'idle' : prev.status
    }));

    return batchFiles.map(f => f.id);
  }, []);

  const updateFileStatus = useCallback((fileId: string, status: BatchFile['status'], progress: number = 0, error?: string) => {
    setBatchState(prev => {
      const updatedFiles = prev.files.map(file => 
        file.id === fileId ? { ...file, status, progress, error } : file
      );
      
      const completedFiles = updatedFiles.filter(f => f.status === 'completed').length;
      const totalFiles = updatedFiles.length;
      const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0;

      return {
        ...prev,
        files: updatedFiles,
        overallProgress
      };
    });
  }, []);

  const processBatch = useCallback(async (
    processFunction: (file: File, fileId: string) => Promise<void>
  ) => {
    if (processingRef.current) return;
    
    processingRef.current = true;
    cancelledRef.current = false;

    setBatchState(prev => ({
      ...prev,
      status: 'processing',
      currentIndex: 0
    }));

    const filesToProcess = batchState.files.filter(f => f.status === 'pending' || f.status === 'failed');
    let completedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < filesToProcess.length; i++) {
      if (cancelledRef.current) {
        setBatchState(prev => ({
          ...prev,
          status: 'cancelled',
          currentIndex: -1
        }));
        break;
      }

      const file = filesToProcess[i];
      
      setBatchState(prev => ({
        ...prev,
        currentIndex: i
      }));

      updateFileStatus(file.id, 'processing', 0);

      try {
        await processFunction(file.file, file.id);
        updateFileStatus(file.id, 'completed', 100);
        completedCount++;
      } catch (error) {
        updateFileStatus(file.id, 'failed', 0, error instanceof Error ? error.message : 'Processing failed');
        failedCount++;
      }
    }

    processingRef.current = false;

    if (!cancelledRef.current) {
      setBatchState(prev => ({
        ...prev,
        status: 'completed',
        currentIndex: -1
      }));

      // Single completion toast
      if (completedCount > 0) {
        toast({
          title: "Batch Processing Complete",
          description: `Successfully processed ${completedCount} files${failedCount > 0 ? `, ${failedCount} failed` : ''}.`,
        });
      }
    }
  }, [batchState.files, updateFileStatus, toast]);

  const pauseProcessing = useCallback(() => {
    setBatchState(prev => ({
      ...prev,
      status: 'paused'
    }));
  }, []);

  const cancelProcessing = useCallback(() => {
    cancelledRef.current = true;
    processingRef.current = false;
    
    setBatchState(prev => ({
      ...prev,
      status: 'cancelled',
      currentIndex: -1,
      files: prev.files.map(file => 
        file.status === 'processing' || file.status === 'pending'
          ? { ...file, status: 'cancelled' }
          : file
      )
    }));

    toast({
      title: "Processing Cancelled",
      description: "File processing has been cancelled.",
      variant: "destructive"
    });
  }, [toast]);

  const clearBatch = useCallback(() => {
    setBatchState({
      files: [],
      status: 'idle',
      currentIndex: -1,
      overallProgress: 0
    });
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setBatchState(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  }, []);

  return {
    batchState,
    addFiles,
    updateFileStatus,
    processBatch,
    pauseProcessing,
    cancelProcessing,
    clearBatch,
    removeFile,
    isProcessing: processingRef.current
  };
};
