import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";

interface DocumentReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: {
    report_id?: string;
    report_content: string;
    generated_at: string;
    document_count: number;
    metrics_analyzed: number;
    insights_included: number;
    document_ids?: string[];
  } | null;
  documents?: any[];
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

  const includedDocs = documents?.filter(d => 
    reportData.document_ids?.includes(d.id)
  ) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Comprehensive Student Report
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Report Metadata */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Generated:</strong> {new Date(reportData.generated_at).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Documents Analyzed:</strong> {reportData.document_count || reportData.document_ids?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Data Points:</strong> {reportData.metrics_analyzed || 0} metrics, {reportData.insights_included || 0} insights
              </p>
              
              {includedDocs.length > 0 && (
                <details className="mt-2">
                  <summary className="text-sm font-semibold cursor-pointer">
                    View Included Documents
                  </summary>
                  <ul className="mt-2 space-y-1 text-sm">
                    {includedDocs.map(doc => (
                      <li key={doc.id} className="text-muted-foreground">
                        • {doc.file_name} ({doc.category}, {doc.document_date})
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