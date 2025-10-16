import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Database } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AIAttribution } from "@/components/shared/AIAttribution";

interface HistoricalReportsAccordionProps {
  familyId: string;
  studentId: string;
}

export const HistoricalReportsAccordion = ({ familyId, studentId }: HistoricalReportsAccordionProps) => {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['historical-reports', familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_reports')
        .select('*')
        .eq('family_id', familyId)
        .eq('student_id', studentId)
        .order('generated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!familyId && !!studentId,
  });

  const handlePrint = (reportContent: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Report - ${new Date().toLocaleDateString()}</title>
          <style>
            @media print {
              body { font-family: Georgia, serif; line-height: 1.6; color: #000; }
              h1, h2, h3 { page-break-after: avoid; }
              table { page-break-inside: avoid; }
              .page-break { page-break-before: always; }
            }
            body { max-width: 8.5in; margin: 0 auto; padding: 1in; }
            h1 { font-size: 24pt; border-bottom: 2px solid #000; padding-bottom: 10px; }
            h2 { font-size: 18pt; margin-top: 20pt; color: #333; }
            h3 { font-size: 14pt; color: #555; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; font-weight: bold; }
          </style>
        </head>
        <body>
          ${reportContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center p-6 bg-muted rounded-lg">
        <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No historical reports yet. Generate your first report above!
        </p>
      </div>
    );
  }

  const focusAreaLabels: Record<string, string> = {
    comprehensive: 'Comprehensive',
    behavioral: 'Behavioral',
    skill: 'Skill Acquisition',
    intervention: 'Intervention',
    sensory: 'Sensory',
    environmental: 'Environmental'
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Historical Reports ({reports.length})
      </h3>

      <Accordion type="single" collapsible className="space-y-2">
        {reports.map((report, index) => (
          <AccordionItem 
            key={report.id} 
            value={report.id}
            className="border rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-col items-start gap-2 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="capitalize">
                    {focusAreaLabels[report.focus_area || 'comprehensive']}
                  </Badge>
                  <AIAttribution variant="icon" />
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(report.generated_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Database className="h-3 w-3" />
                    {report.metrics_count} metrics, {report.insights_count} insights
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="pt-4">
              <div className="flex justify-end mb-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handlePrint(report.report_content)}
                >
                  Print Report
                </Button>
              </div>
              
              <div className="prose prose-sm dark:prose-invert max-w-none print-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {report.report_content}
                </ReactMarkdown>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
