import { WizardStepProps } from '@/lib/wizards/types';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const SummaryReportStep = ({ data, onUpdate }: WizardStepProps) => {
  const [generating, setGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(data.reportPdfUrl || null);
  const { selectedFamily, selectedStudent } = useFamily();

  const generateReport = async () => {
    if (!selectedFamily || !selectedStudent) return;

    try {
      setGenerating(true);

      const { data: result, error: fnError } = await supabase.functions.invoke('generate-bfa-report', {
        body: {
          family_id: selectedFamily.id,
          student_id: selectedStudent.id,
          wizard_data: data,
        },
      });

      if (fnError) throw fnError;

      setPdfUrl(result.pdf_url);
      onUpdate({ ...data, reportPdfUrl: result.pdf_url, documentId: result.document_id });
      toast.success('Report generated successfully!');
    } catch (err: any) {
      console.error('Report generation error:', err);
      toast.error(err.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="Generate and export your comprehensive FBA report."
        why="This professional report documents your analysis and can be shared with your child's educational or clinical team."
        how="Click to generate a clinical-grade PDF report. You can download it, email it, or save it to your documents library."
      />

      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            FPX-BFA™ Comprehensive Report
          </CardTitle>
          <CardDescription>
            Professional Functional Behavior Assessment for {selectedStudent?.student_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Behavior Definition & Operational Criteria</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Indirect Assessment Summary (Structured Interview)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Direct Observation Data Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Functional Hypothesis (ABC Format)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Evidence-Based Intervention Recommendations</span>
            </div>
          </div>

          {!pdfUrl && (
            <Button 
              onClick={generateReport} 
              disabled={generating}
              className="w-full gap-2"
              size="lg"
            >
              {generating ? (
                <>
                  <Skeleton className="h-4 w-4" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate PDF Report
                </>
              )}
            </Button>
          )}

          {pdfUrl && (
            <div className="space-y-3">
              <Alert className="bg-green-500/10 border-green-500/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Report successfully generated and saved to your documents!
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button onClick={handleDownload} className="flex-1 gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-blue-600" />
            Next Step: Create a Behavior Intervention Plan
          </CardTitle>
          <CardDescription>
            Now that you have a clear hypothesis about the function of the behavior, 
            the next step is to create a proactive support plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full gap-2" disabled>
            <ArrowRight className="h-4 w-4" />
            Build FPX-BIP™ (Coming Soon)
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            The BIP wizard will automatically import your FBA findings
          </p>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          This report has been saved to your Documents library and can be accessed anytime.
        </p>
      </div>
    </div>
  );
};
