import { WizardStepProps } from '@/lib/wizards/types';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, TrendingUp, Calendar, MapPin, Thermometer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Finding {
  category: 'temporal' | 'antecedent' | 'consequence' | 'environmental';
  finding: string;
  confidence: 'high' | 'medium' | 'low';
  supporting_data: string;
  clinical_note?: string;
}

interface AnalysisResult {
  findings: Finding[];
  total_incidents_analyzed: number;
  date_range: string;
}

const CONFIDENCE_COLORS = {
  high: 'bg-green-500',
  medium: 'bg-yellow-500',
  low: 'bg-orange-500',
};

const CATEGORY_ICONS = {
  temporal: Calendar,
  antecedent: TrendingUp,
  consequence: AlertCircle,
  environmental: Thermometer,
};

export const DirectObservationStep = ({ data, onUpdate }: WizardStepProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { selectedFamily, selectedStudent } = useFamily();

  useEffect(() => {
    const performAnalysis = async () => {
      if (!selectedFamily || !selectedStudent || !data.behaviorName) {
        setLoading(false);
        return;
      }

      // Check if we already have analysis cached
      if (data.directObservation) {
        setAnalysis(data.directObservation);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: result, error: fnError } = await supabase.functions.invoke('analyze-bfa-patterns', {
          body: {
            family_id: selectedFamily.id,
            student_id: selectedStudent.id,
            behavior_name: data.behaviorName,
            operational_definition: data.operationalDefinition,
          },
        });

        if (fnError) throw fnError;

        setAnalysis(result);
        onUpdate({ ...data, directObservation: result });
      } catch (err: any) {
        console.error('Analysis error:', err);
        setError(err.message || 'Failed to analyze incident data');
      } finally {
        setLoading(false);
      }
    };

    performAnalysis();
  }, [selectedFamily, selectedStudent, data.behaviorName]);

  if (loading) {
    return (
      <div className="space-y-6">
        <AdvocateCommentary
          what="Analyze objective data from your incident logs."
          why="This AI-powered analysis reviews every incident log to find patterns that might not be obvious to the human eye."
          how="Sit back while I scan your logs, calculate correlations, and identify the most significant patterns."
        />
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground animate-pulse">
            🔍 Scanning incident logs...
          </p>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <AdvocateCommentary
          what="Analyze objective data from your incident logs."
          why="This AI-powered analysis reviews every incident log to find patterns."
          how="Unfortunately, we encountered an error during analysis."
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!analysis || analysis.total_incidents_analyzed < 3) {
    return (
      <div className="space-y-6">
        <AdvocateCommentary
          what="Analyze objective data from your incident logs."
          why="The AI needs sufficient data to identify reliable patterns."
          how="We'll proceed with your interview responses as the primary data source. Consider logging more incidents to strengthen future analyses."
        />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {analysis?.total_incidents_analyzed === 0 
              ? "No matching incident logs found. The hypothesis will rely on your interview responses."
              : `Only ${analysis.total_incidents_analyzed} incident(s) found. We recommend at least 5 incidents for statistical reliability. The analysis will rely more heavily on your interview data.`
            }
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="Review AI-powered data synthesis from your incident logs."
        why="Objective data analysis reveals patterns that validate or challenge our assumptions from the interview."
        how="Read through each finding. The AI has identified the most statistically significant patterns and translated them into actionable insights."
      />

      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Analysis Summary
          </CardTitle>
          <CardDescription>
            Analyzed <strong>{analysis.total_incidents_analyzed}</strong> incidents over <strong>{analysis.date_range}</strong>
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Key Findings</h3>
        {analysis.findings.map((finding, index) => {
          const Icon = CATEGORY_ICONS[finding.category];
          return (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Finding #{index + 1}</CardTitle>
                  </div>
                  <Badge className={CONFIDENCE_COLORS[finding.confidence]}>
                    {finding.confidence} confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base font-medium">{finding.finding}</p>
                <p className="text-sm text-muted-foreground">
                  <strong>Supporting Data:</strong> {finding.supporting_data}
                </p>
                {finding.clinical_note && (
                  <p className="text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-3">
                    {finding.clinical_note}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
