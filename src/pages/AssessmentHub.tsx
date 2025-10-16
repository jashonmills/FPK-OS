import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '@/contexts/FamilyContext';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClipboardCheck, 
  FileText, 
  Brain, 
  BookOpen, 
  Puzzle, 
  Users,
  Play,
  Clock,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { WIZARD_REGISTRY } from '@/lib/wizards/registry';
import { WizardSession } from '@/lib/wizards/types';

export default function AssessmentHub() {
  const { selectedFamily, selectedStudent } = useFamily();
  const navigate = useNavigate();
  const [inProgressSessions, setInProgressSessions] = useState<WizardSession[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  
  // Get all assessment feature flags
  const flagKeys = WIZARD_REGISTRY.map(w => w.flagKey);
  const { flags, loading: flagsLoading } = useFeatureFlags(flagKeys);

  useEffect(() => {
    loadSessions();
  }, [selectedFamily, selectedStudent]);

  const loadSessions = async () => {
    if (!selectedFamily || !selectedStudent) return;

    try {
      // Load in-progress sessions
      const { data: sessions } = await supabase
        .from('wizard_sessions')
        .select('*')
        .eq('family_id', selectedFamily.id)
        .eq('student_id', selectedStudent.id)
        .eq('status', 'in_progress')
        .order('last_updated', { ascending: false });

      if (sessions) {
        setInProgressSessions(sessions as unknown as WizardSession[]);
      }

      // Count completed assessments
      const { count } = await supabase
        .from('wizard_completions')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', selectedFamily.id)
        .eq('student_id', selectedStudent.id);

      setCompletedCount(count || 0);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const startAssessment = (wizardType: string) => {
    if (!selectedFamily || !selectedStudent) {
      return;
    }
    navigate(`/assessments/${wizardType}`);
  };

  const resumeSession = (sessionId: string, wizardType: string) => {
    navigate(`/assessments/${wizardType}/${sessionId}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'educational': return FileText;
      case 'behavioral': return Brain;
      case 'autism': return Puzzle;
      case 'adhd': return Brain;
      case 'learning': return BookOpen;
      case 'developmental': return Users;
      default: return ClipboardCheck;
    }
  };

  const categories = [
    { id: 'all', label: 'All Assessments', icon: ClipboardCheck },
    { id: 'educational', label: 'Educational & Planning', icon: FileText },
    { id: 'behavioral', label: 'Behavioral', icon: Brain },
    { id: 'autism', label: 'Autism & Social', icon: Puzzle },
    { id: 'adhd', label: 'ADHD & Executive Function', icon: Brain },
    { id: 'learning', label: 'Learning & Language', icon: BookOpen },
    { id: 'developmental', label: 'Developmental', icon: Users },
  ];

  const getFilteredWizards = (category: string) => {
    if (category === 'all') return WIZARD_REGISTRY;
    return WIZARD_REGISTRY.filter(w => w.category === category);
  };

  if (flagsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading assessments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Guided Plans & Assessments
        </h1>
        <p className="text-lg text-muted-foreground">
          Professional assessment tools to guide your journey
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressSessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {WIZARD_REGISTRY.filter(w => flags[w.flagKey]).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* In Progress Sessions */}
      {inProgressSessions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Resume Your Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressSessions.map(session => {
              const wizard = WIZARD_REGISTRY.find(w => w.type === session.wizardType);
              if (!wizard) return null;
              const Icon = wizard.icon;

              return (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Icon className="h-8 w-8 text-primary" />
                      <Badge variant="outline">
                        {Math.round((session.currentStep / session.totalSteps) * 100)}%
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-4">{wizard.name}</CardTitle>
                    <CardDescription>
                      Step {session.currentStep + 1} of {session.totalSteps}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => resumeSession(session.id, wizard.type)}
                      className="w-full"
                    >
                      Continue Assessment
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Assessment Library */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Assessment Library</h2>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid grid-cols-3 lg:grid-cols-7">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <TabsTrigger key={cat.id} value={cat.id} className="gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{cat.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredWizards(category.id).map(wizard => {
                  const Icon = wizard.icon;
                  const isEnabled = flags[wizard.flagKey];
                  const inProgress = inProgressSessions.find(s => s.wizardType === wizard.type);

                  return (
                    <Card 
                      key={wizard.type}
                      className={!isEnabled ? 'opacity-60' : 'hover:shadow-lg transition-shadow'}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Icon className="h-8 w-8 text-primary" />
                          {!isEnabled && (
                            <Badge variant="secondary">Coming Soon</Badge>
                          )}
                          {wizard.requiresSubscription && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <CardTitle className="text-lg mt-4">{wizard.name}</CardTitle>
                        <CardDescription>{wizard.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>~{wizard.estimatedMinutes} minutes</span>
                        </div>
                        <Button 
                          onClick={() => startAssessment(wizard.type)}
                          disabled={!isEnabled}
                          className="w-full"
                          variant={inProgress ? 'outline' : 'default'}
                        >
                          {inProgress ? 'Start New' : 'Begin Assessment'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
