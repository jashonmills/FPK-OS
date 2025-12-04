import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  ChevronDown,
  FileText,
  Layers,
  Zap,
  Image,
  BarChart3,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ImportStep {
  step: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
  timestamp: string;
}

interface ImportProcessingScreenProps {
  importId: string;
  onComplete: (result: any) => void;
  onError: (error: string) => void;
}

const PROCESSING_STEPS = [
  { 
    key: 'uploading', 
    label: 'Uploading file', 
    icon: Upload,
    description: 'Uploading your SCORM package to secure storage'
  },
  { 
    key: 'validating', 
    label: 'Validating package', 
    icon: CheckCircle2,
    description: 'Checking manifest and package structure'
  },
  { 
    key: 'extracting', 
    label: 'Extracting structure', 
    icon: FileText,
    description: 'Reading SCOs, pages, and sequencing rules'
  },
  { 
    key: 'mapping', 
    label: 'Mapping to Framework 2', 
    icon: Layers,
    description: 'Converting to Interactive Micro-Learning format'
  },
  { 
    key: 'converting', 
    label: 'Converting assets', 
    icon: Image,
    description: 'Processing images, videos, and generating alt text'
  },
  { 
    key: 'building_preview', 
    label: 'Building preview', 
    icon: Eye,
    description: 'Creating course preview and structure tree'
  }
];

export const ImportProcessingScreen: React.FC<ImportProcessingScreenProps> = ({
  importId,
  onComplete,
  onError
}) => {
  const [importStatus, setImportStatus] = useState<any>(null);
  const [isLogsExpanded, setIsLogsExpanded] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchImportStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(`import-scorm-status/${importId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;

      setImportStatus(data);

      // Check if processing is complete
      if (data.status === 'ready' || data.status === 'partial') {
        if (pollingInterval) {
          clearTimeout(pollingInterval);
          setPollingInterval(null);
        }
        onComplete(data);
      } else if (data.status === 'failed') {
        if (pollingInterval) {
          clearTimeout(pollingInterval);
          setPollingInterval(null);
        }
        onError(data.error_message || 'Import failed');
      }
    } catch (error) {
      console.error('Error fetching import status:', error);
      if (pollingInterval) {
        clearTimeout(pollingInterval);
        setPollingInterval(null);
      }
      onError('Failed to fetch import status');
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchImportStatus();

    // Set up polling
    const interval = setInterval(fetchImportStatus, 2000); // Poll every 2 seconds
    setPollingInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [importId]);

  const getStepStatus = (stepKey: string): 'pending' | 'processing' | 'completed' | 'failed' => {
    if (!importStatus?.steps_log) return 'pending';
    
    const step = importStatus.steps_log.find((s: ImportStep) => s.step === stepKey);
    return step?.status || 'pending';
  };

  const getStepIcon = (step: any, status: string) => {
    const IconComponent = step.icon;
    
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <IconComponent className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    if (!importStatus) return null;

    switch (importStatus.status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Partial Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Processing...</Badge>;
    }
  };

  if (!importStatus) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Initializing import...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Importing Your Course</h2>
          <p className="text-muted-foreground">
            Converting your SCORM package to Interactive Micro-Learning format
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Import Progress</CardTitle>
            <span className="text-sm text-muted-foreground">
              {importStatus.progress_percentage || 0}% complete
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={importStatus.progress_percentage || 0} className="h-3" />
          
          {/* Processing Steps */}
          <div className="space-y-3">
            {PROCESSING_STEPS.map((step, index) => {
              const status = getStepStatus(step.key);
              const isActive = status === 'processing';
              const isCompleted = status === 'completed';
              const isFailed = status === 'failed';
              
              return (
                <div 
                  key={step.key}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-blue-50 border border-blue-200' 
                      : isCompleted 
                        ? 'bg-green-50 border border-green-200'
                        : isFailed
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-muted/30'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getStepIcon(step, status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium text-sm ${
                        isActive ? 'text-blue-900' : 
                        isCompleted ? 'text-green-900' : 
                        isFailed ? 'text-red-900' : 
                        'text-muted-foreground'
                      }`}>
                        {step.label}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        Step {index + 1}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {importStatus.warnings && importStatus.warnings.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {importStatus.warnings.map((warning: string, index: number) => (
                <p key={index} className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                  {warning}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Logs */}
      <Collapsible open={isLogsExpanded} onOpenChange={setIsLogsExpanded}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Processing Logs</CardTitle>
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  isLogsExpanded ? 'rotate-180' : ''
                }`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {importStatus.steps_log?.map((step: ImportStep, index: number) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-muted-foreground text-xs mt-0.5 font-mono">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`font-medium ${
                      step.status === 'completed' ? 'text-green-600' :
                      step.status === 'failed' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      [{step.step}]
                    </span>
                    <span className="text-muted-foreground">{step.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};