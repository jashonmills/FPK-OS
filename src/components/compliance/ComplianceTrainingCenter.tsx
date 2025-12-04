import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Award,
  Calendar,
  Users,
  Download,
  Play
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface TrainingModule {
  id: string;
  module_name: string;
  description: string;
  duration_minutes: number;
  mandatory: boolean;
  compliance_framework: string;
  passing_score: number;
  content_url?: string;
}

interface TrainingCompletion {
  id: string;
  training_module_id: string;
  completion_date: string;
  score?: number;
  passed: boolean;
  expires_at?: string;
  training_modules: TrainingModule;
}

export function ComplianceTrainingCenter() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  // Fetch training modules
  const { data: trainingModules } = useQuery({
    queryKey: ['training-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_modules')
        .select('*')
        .order('mandatory', { ascending: false });
      
      if (error) throw error;
      return data as TrainingModule[];
    },
  });

  // Fetch user's training completions
  const { data: completions } = useQuery({
    queryKey: ['training-completions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_training_completions')
        .select(`
          *,
          training_modules:training_module_id (*)
        `)
        .eq('user_id', user.id)
        .order('completion_date', { ascending: false });
      
      if (error) throw error;
      return data as TrainingCompletion[];
    },
    enabled: !!user,
  });

  // Complete training mutation
  const completeTraining = useMutation({
    mutationFn: async (moduleData: {
      training_module_id: string;
      score: number;
    }) => {
      const passed = moduleData.score >= (selectedModule?.passing_score || 80);
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year expiry

      const { data, error } = await supabase
        .from('user_training_completions')
        .insert({
          user_id: user?.id,
          training_module_id: moduleData.training_module_id,
          score: moduleData.score,
          passed,
          expires_at: expiryDate.toISOString(),
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-completions'] });
      toast.success('Training completed successfully!');
      setSelectedModule(null);
    },
    onError: (error) => {
      toast.error('Failed to record training completion: ' + error.message);
    },
  });

  const getCompletionStatus = (moduleId: string) => {
    const completion = completions?.find(c => c.training_module_id === moduleId);
    if (!completion) return { status: 'not_started', completion: null };
    
    const isExpired = completion.expires_at && new Date(completion.expires_at) < new Date();
    if (isExpired) return { status: 'expired', completion };
    if (completion.passed) return { status: 'completed', completion };
    return { status: 'failed', completion };
  };

  const getStatusBadge = (status: string, mandatory: boolean = false) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'expired':
        return <Badge className="bg-orange-100 text-orange-800">Expired</Badge>;
      case 'not_started':
        return mandatory ? 
          <Badge className="bg-red-100 text-red-800">Required</Badge> :
          <Badge variant="outline">Available</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getOverallProgress = () => {
    if (!trainingModules || !completions) return 0;
    
    const mandatoryModules = trainingModules.filter(m => m.mandatory);
    const completedMandatory = mandatoryModules.filter(m => {
      const status = getCompletionStatus(m.id);
      return status.status === 'completed';
    });
    
    return mandatoryModules.length > 0 ? 
      (completedMandatory.length / mandatoryModules.length) * 100 : 100;
  };

  const getExpiringTraining = () => {
    if (!completions) return [];
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return completions.filter(c => 
      c.expires_at && 
      new Date(c.expires_at) <= thirtyDaysFromNow &&
      new Date(c.expires_at) > new Date()
    );
  };

  const startTraining = (module: TrainingModule) => {
    setSelectedModule(module);
  };

  const simulateTrainingCompletion = (score: number) => {
    if (selectedModule) {
      completeTraining.mutate({
        training_module_id: selectedModule.id,
        score,
      });
    }
  };

  const mandatoryModules = trainingModules?.filter(m => m.mandatory) || [];
  const optionalModules = trainingModules?.filter(m => !m.mandatory) || [];
  const expiringTraining = getExpiringTraining();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compliance Training Center</h2>
          <p className="text-muted-foreground">Complete required training and stay up-to-date</p>
        </div>
        <Button onClick={() => setShowCertificate(true)} variant="outline">
          <Award className="h-4 w-4 mr-2" />
          View Certificates
        </Button>
      </div>

      {/* Training Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(getOverallProgress())}%</span>
              </div>
              <Progress value={getOverallProgress()} />
              <p className="text-xs text-muted-foreground">
                Mandatory training completion
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{mandatoryModules.length}</p>
                <p className="text-sm text-muted-foreground">Required Modules</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{expiringTraining.length}</p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Training Alert */}
      {expiringTraining.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have {expiringTraining.length} training module(s) expiring within 30 days. Please renew them to maintain compliance.
          </AlertDescription>
        </Alert>
      )}

      {/* Mandatory Training */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-700">Required Training</h3>
        <div className="grid gap-4">
          {mandatoryModules.map((module) => {
            const statusInfo = getCompletionStatus(module.id);
            return (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{module.module_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(statusInfo.status, module.mandatory)}
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {module.compliance_framework}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {module.duration_minutes} minutes
                      </span>
                      <span>Passing Score: {module.passing_score}%</span>
                      {statusInfo.completion && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Completed: {new Date(statusInfo.completion.completion_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {statusInfo.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Award className="h-4 w-4 mr-1" />
                          Certificate
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        onClick={() => startTraining(module)}
                        disabled={statusInfo.status === 'completed' && !statusInfo.completion?.expires_at}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        {statusInfo.status === 'not_started' ? 'Start Training' : 
                         statusInfo.status === 'expired' ? 'Retake Training' :
                         statusInfo.status === 'failed' ? 'Retry Training' : 'Review'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Optional Training */}
      {optionalModules.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Training</h3>
          <div className="grid gap-4">
            {optionalModules.map((module) => {
              const statusInfo = getCompletionStatus(module.id);
              return (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-green-600" />
                        <div>
                          <CardTitle className="text-lg">{module.module_name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(statusInfo.status, module.mandatory)}
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {module.compliance_framework}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {module.duration_minutes} minutes
                        </span>
                        <span>Passing Score: {module.passing_score}%</span>
                      </div>
                      <Button size="sm" onClick={() => startTraining(module)}>
                        <Play className="h-4 w-4 mr-1" />
                        Start Training
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Training Module Dialog */}
      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedModule?.module_name}</DialogTitle>
          </DialogHeader>
          {selectedModule && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">{selectedModule.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Duration: {selectedModule.duration_minutes} minutes</span>
                  <span>Passing Score: {selectedModule.passing_score}%</span>
                  <span>Framework: {selectedModule.compliance_framework}</span>
                </div>
              </div>
              
              <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">
                  Training content would be displayed here
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  This is a demo. In a real implementation, training content would be loaded from the content_url.
                </p>
                
                {/* Simulate training completion */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Simulate Training Completion:</p>
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" onClick={() => simulateTrainingCompletion(95)}>
                      Pass (95%)
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => simulateTrainingCompletion(70)}>
                      Fail (70%)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Certificates Dialog */}
      <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Training Certificates</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {completions?.filter(c => c.passed).map((completion) => (
              <Card key={completion.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="h-8 w-8 text-yellow-600" />
                      <div>
                        <h4 className="font-medium">{completion.training_modules.module_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Completed: {new Date(completion.completion_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Score: {completion.score}%
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}