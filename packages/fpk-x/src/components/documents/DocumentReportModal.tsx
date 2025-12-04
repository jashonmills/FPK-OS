import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";
import { AIAttribution } from "@/components/shared/AIAttribution";
// CRITICAL FIX #4: Standardized report data structure
// Support both database documents and analysis status documents
interface DocumentInfo {
  id: string;
  document_name?: string;
  file_name?: string;
}
interface ReportStatistics {
  documentCount: number;
  metricsExtracted: number;
  insightsGenerated: number;
  progressRecords: number;
}

interface ReportMetadata {
  focusArea: string;
  format: 'markdown' | 'pdf';
}

interface DocumentReportData {
  id?: string;
  report_content: string;
  generated_at: string;
  // Support both old and new field names for backwards compatibility
  document_count?: number;
  metrics_count?: number;
  metrics_analyzed?: number;
  insights_count?: number;
  insights_included?: number;
  progress_records_count?: number;
  focus_area?: string;
  report_format?: string;
  document_ids?: string[] | { ids: string[] };
}

interface DocumentReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: DocumentReportData | null;
  documents?: DocumentInfo[];
}

export const DocumentReportModal = ({ 
  open, 
  onOpenChange, 
  reportData,
  documents 
}: DocumentReportModalProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    if (!reportData) return;
    
    const blob = new Blob([reportData.report_content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "The report has been downloaded as a Markdown file.",
    });
  };

  const handleShare = () => {
    if (!reportData) return;
    
    navigator.clipboard.writeText(reportData.report_content);
    toast({
      title: "Report Copied",
      description: "The report content has been copied to your clipboard.",
    });
  };

  if (!reportData) return null;

  // CRITICAL FIX #4: Type-safe document ID extraction
  const documentIds = Array.isArray(reportData.document_ids) 
    ? reportData.document_ids 
    : (reportData.document_ids as any)?.ids || [];
    
  const includedDocs = documents?.filter(d => 
    documentIds.includes(d.id)
  ) || [];
  
  // Normalize statistics (support both old and new field names)
  const stats: ReportStatistics = {
    documentCount: reportData.document_count || documentIds.length || 0,
    metricsExtracted: reportData.metrics_count || reportData.metrics_analyzed || 0,
    insightsGenerated: reportData.insights_count || reportData.insights_included || 0,
    progressRecords: reportData.progress_records_count || 0
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Comprehensive Student Report
            </DialogTitle>
            <AIAttribution variant="badge" />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Report Metadata */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">ANALYSIS SUMMARY</p>
                  <p className="text-sm">
                    <strong>{stats.documentCount}</strong> documents analyzed
                  </p>
                  <p className="text-sm">
                    <strong>{stats.metricsExtracted}</strong> metrics extracted
                  </p>
                  <p className="text-sm">
                    <strong>{stats.insightsGenerated}</strong> insights generated
                  </p>
                  <p className="text-sm">
                    <strong>{stats.progressRecords}</strong> progress records
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">REPORT DETAILS</p>
                  <p className="text-sm text-muted-foreground">
                    Generated: {new Date(reportData.generated_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Focus: {reportData.focus_area || 'Comprehensive'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Format: {reportData.report_format || 'Markdown'}
                  </p>
                </div>
              </div>
              
              {includedDocs.length > 0 && (
                <details className="mt-2">
                  <summary className="text-sm font-semibold cursor-pointer">
                    View Included Documents
                  </summary>
                  <ul className="mt-2 space-y-1 text-sm">
                    {includedDocs.map(doc => (
                      <li key={doc.id} className="text-muted-foreground">
                        • {doc.document_name || doc.file_name || 'Unknown Document'}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>

            {/* Report Content */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {reportData.report_content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download as Markdown
          </Button>
          <Button onClick={handleShare} variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
          <div className="flex-1" />
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};