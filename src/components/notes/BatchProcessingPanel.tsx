
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Play, Pause, X, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { BatchFile, BatchProcessingState } from '@/hooks/useBatchProcessing';

interface BatchProcessingPanelProps {
  batchState: BatchProcessingState;
  onStart: () => void;
  onPause: () => void;
  onCancel: () => void;
  onClear: () => void;
  onRemoveFile: (fileId: string) => void;
  isProcessing: boolean;
}

const BatchProcessingPanel: React.FC<BatchProcessingPanelProps> = ({
  batchState,
  onStart,
  onPause,
  onCancel,
  onClear,
  onRemoveFile,
  isProcessing
}) => {
  const getStatusColor = (status: BatchFile['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusIcon = (status: BatchFile['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'processing': return <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (batchState.files.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            Processing Queue ({batchState.files.length} files)
          </span>
          <div className="flex gap-2">
            {batchState.status === 'idle' && (
              <Button onClick={onStart} size="sm" className="h-8">
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
            {batchState.status === 'processing' && (
              <>
                <Button onClick={onPause} size="sm" variant="outline" className="h-8">
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
                <Button onClick={onCancel} size="sm" variant="destructive" className="h-8">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            )}
            {(batchState.status === 'completed' || batchState.status === 'cancelled') && (
              <Button onClick={onClear} size="sm" variant="outline" className="h-8">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        {batchState.status === 'processing' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(batchState.overallProgress)}%</span>
            </div>
            <Progress value={batchState.overallProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Processing file {batchState.currentIndex + 1} of {batchState.files.length}
            </p>
          </div>
        )}

        {/* File List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {batchState.files.map((file, index) => (
            <div
              key={file.id}
              className={`p-3 rounded-lg border ${getStatusColor(file.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {getStatusIcon(file.status)}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs opacity-75">
                      {formatFileSize(file.file.size)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {file.status}
                  </Badge>
                </div>
                {(file.status === 'pending' || file.status === 'failed') && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveFile(file.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {file.status === 'processing' && (
                <div className="mt-2">
                  <Progress value={file.progress} className="h-1" />
                </div>
              )}
              
              {file.error && (
                <p className="text-xs mt-2 text-red-600">
                  {file.error}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchProcessingPanel;
