
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Clock, FileText, Brain, Sparkles, Loader } from 'lucide-react';

export interface ProcessingStage {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'pending' | 'active' | 'completed' | 'error';
  progress?: number;
  errorMessage?: string;
}

interface RealTimeProcessingMeterProps {
  uploadId: string;
  fileName: string;
  fileSize: number;
  stages: ProcessingStage[];
  currentStage: string;
  overallProgress: number;
  elapsedTime: number;
  estimatedTimeRemaining?: number;
  onCancel?: () => void;
}

const RealTimeProcessingMeter: React.FC<RealTimeProcessingMeterProps> = ({
  uploadId,
  fileName,
  fileSize,
  stages,
  currentStage,
  overallProgress,
  elapsedTime,
  estimatedTimeRemaining,
  onCancel
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const currentStageData = stages.find(stage => stage.id === currentStage);
  const hasError = stages.some(stage => stage.status === 'error');
  const isCompleted = stages.every(stage => stage.status === 'completed');

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{fileName}</h4>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(fileSize)} • {formatTime(elapsedTime)} elapsed
              {estimatedTimeRemaining && (
                <> • {formatTime(estimatedTimeRemaining)} remaining</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasError && (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Error
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="default" className="text-xs bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            )}
            {!hasError && !isCompleted && (
              <Badge variant="secondary" className="text-xs">
                <Loader className="h-3 w-3 mr-1 animate-spin" />
                Processing
              </Badge>
            )}
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Current Stage Description */}
        {currentStageData && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <currentStageData.icon className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="text-sm text-blue-800">{currentStageData.description}</span>
          </div>
        )}

        {/* Stages List */}
        <div className="space-y-2">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center gap-3">
              {/* Stage Icon */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                stage.status === 'completed' ? 'bg-green-100 text-green-600' :
                stage.status === 'active' ? 'bg-blue-100 text-blue-600' :
                stage.status === 'error' ? 'bg-red-100 text-red-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                {stage.status === 'completed' ? (
                  <CheckCircle className="h-3 w-3" />
                ) : stage.status === 'error' ? (
                  <AlertCircle className="h-3 w-3" />
                ) : stage.status === 'active' ? (
                  <Loader className="h-3 w-3 animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>

              {/* Stage Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    stage.status === 'active' ? 'text-blue-700' :
                    stage.status === 'completed' ? 'text-green-700' :
                    stage.status === 'error' ? 'text-red-700' :
                    'text-gray-500'
                  }`}>
                    {stage.name}
                  </span>
                  {stage.progress !== undefined && stage.status === 'active' && (
                    <span className="text-xs text-muted-foreground">
                      {Math.round(stage.progress)}%
                    </span>
                  )}
                </div>
                
                {/* Stage Progress Bar */}
                {stage.status === 'active' && stage.progress !== undefined && (
                  <Progress value={stage.progress} className="h-1 mt-1" />
                )}
                
                {/* Error Message */}
                {stage.status === 'error' && stage.errorMessage && (
                  <p className="text-xs text-red-600 mt-1">{stage.errorMessage}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {!isCompleted && onCancel && (
          <div className="flex justify-end pt-2 border-t">
            <button
              onClick={onCancel}
              className="text-xs text-muted-foreground hover:text-red-600 transition-colors"
            >
              Cancel Processing
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeProcessingMeter;
