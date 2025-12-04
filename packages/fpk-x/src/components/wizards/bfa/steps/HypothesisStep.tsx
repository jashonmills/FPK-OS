import { WizardStepProps } from '@/lib/wizards/types';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, AlertCircle, Edit, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface Hypothesis {
  function: 'escape_avoidance' | 'attention' | 'tangible' | 'sensory' | 'multiple';
  antecedent: string;
  behavior: string;
  consequence: string;
  function_statement: string;
  confidence: 'high' | 'medium' | 'low';
  confidence_explanation: string;
}

interface HypothesisResult {
  primary_hypothesis: Hypothesis;
  secondary_hypothesis?: Hypothesis;
  supporting_evidence: string[];
}

const FUNCTION_COLORS = {
  escape_avoidance: 'bg-blue-500',
  attention: 'bg-purple-500',
  tangible: 'bg-green-500',
  sensory: 'bg-orange-500',
  multiple: 'bg-slate-500',
};

const FUNCTION_LABELS = {
  escape_avoidance: 'Escape/Avoidance',
  attention: 'Attention',
  tangible: 'Tangible',
  sensory: 'Sensory',
  multiple: 'Multiple Functions',
};

const CONFIDENCE_SCORE = {
  high: 85,
  medium: 60,
  low: 35,
};

export const HypothesisStep = ({ data, onUpdate }: WizardStepProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hypothesis, setHypothesis] = useState<HypothesisResult | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const { selectedFamily, selectedStudent } = useFamily();

  useEffect(() => {
    const generateHypothesis = async () => {
      if (!selectedFamily || !selectedStudent) {
        setLoading(false);
        return;
      }

      // Check if we already have hypothesis cached
      if (data.hypothesis) {
        setHypothesis(data.hypothesis);
        setConfirmed(data.hypothesisConfirmed || false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: result, error: fnError } = await supabase.functions.invoke('generate-bfa-hypothesis', {
          body: {
            family_id: selectedFamily.id,
            student_id: selectedStudent.id,
            behavior_definition: {
              behaviorName: data.behaviorName,
              operationalDefinition: data.operationalDefinition,
            },
            indirect_assessment: {
              settingLocations: data.settingLocations,
              settingTimes: data.settingTimes,
              settingPeople: data.settingPeople,
              antecedentDemands: data.antecedentDemands,
              antecedentSocial: data.antecedentSocial,
              antecedentEnvironmental: data.antecedentEnvironmental,
              antecedentInternal: data.antecedentInternal,
              consequenceAttention: data.consequenceAttention,
              consequenceEscape: data.consequenceEscape,
              consequenceTangible: data.consequenceTangible,
              consequenceSensory: data.consequenceSensory,
              skillsDeficit: data.skillsDeficit,
            },
            direct_observation: data.directObservation,
          },
        });

        if (fnError) throw fnError;

        setHypothesis(result);
        onUpdate({ ...data, hypothesis: result });
      } catch (err: any) {
        console.error('Hypothesis generation error:', err);
        setError(err.message || 'Failed to generate hypothesis');
      } finally {
        setLoading(false);
      }
    };

    generateHypothesis();
  }, [selectedFamily, selectedStudent]);

  const handleConfirm = () => {
    setConfirmed(true);
    onUpdate({ ...data, hypothesisConfirmed: true });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdvocateCommentary
          what="Synthesize all data into a functional hypothesis."
          why="A clear hypothesis is essential for creating an effective intervention plan."
          how="The AI is combining your interview responses with the data analysis to formulate the most likely function(s) of the behavior."
        />
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground animate-pulse">
            🧠 Formulating hypothesis based on ABC analysis...
          </p>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <AdvocateCommentary
          what="Synthesize all data into a functional hypothesis."
          why="A clear hypothesis guides intervention planning."
          how="Unfortunately, we encountered an error."
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hypothesis) return null;

  const renderHypothesisCard = (hyp: Hypothesis, isPrimary: boolean) => (
    <Card className={`border-2 ${isPrimary ? 'border-primary' : 'border-muted'}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {isPrimary ? 'Primary' : 'Secondary'} Hypothesis
            </CardTitle>
            <CardDescription>ABC Functional Analysis</CardDescription>
          </div>
          <Badge className={FUNCTION_COLORS[hyp.function]}>
            {FUNCTION_LABELS[hyp.function]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">WHEN (Antecedent):</p>
            <p className="text-base">{hyp.antecedent}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">THE CHILD (Behavior):</p>
            <p className="text-base">{hyp.behavior}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">WHICH RESULTS IN (Consequence):</p>
            <p className="text-base">{hyp.consequence}</p>
          </div>
        </div>

        <div className="p-4 bg-primary/5 border-l-4 border-primary rounded">
          <p className="text-sm font-semibold mb-2">Function Statement:</p>
          <p className="text-base">{hyp.function_statement}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Confidence Level:</p>
            <Badge variant="outline" className="uppercase">
              {hyp.confidence}
            </Badge>
          </div>
          <Progress value={CONFIDENCE_SCORE[hyp.confidence]} className="h-2" />
          <p className="text-sm text-muted-foreground italic">{hyp.confidence_explanation}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="Review the functional hypothesis synthesized from all data sources."
        why="This hypothesis represents our best understanding of WHY the behavior is occurring, which is essential for creating an effective intervention."
        how="Review the ABC analysis carefully. You can confirm this hypothesis to proceed, or contact your behavior team if you have concerns about the formulation."
      />

      {renderHypothesisCard(hypothesis.primary_hypothesis, true)}

      {hypothesis.secondary_hypothesis && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            A secondary function was also identified. This behavior may serve multiple purposes:
          </p>
          {renderHypothesisCard(hypothesis.secondary_hypothesis, false)}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supporting Evidence</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {hypothesis.supporting_evidence.map((evidence, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{evidence}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {!confirmed && (
        <div className="flex justify-center pt-4">
          <Button onClick={handleConfirm} size="lg" className="gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Confirm Hypothesis
          </Button>
        </div>
      )}

      {confirmed && (
        <Alert className="bg-green-500/10 border-green-500/20">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Hypothesis confirmed. You can now proceed to generate your comprehensive BFA report.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
