import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Upload, FileText, Eye, Trash2, Download, Sparkles, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from "sonner";
import { format } from "date-fns";
import { DocumentUploadModal } from "@/components/documents/DocumentUploadModal";
import { DocumentViewerModal } from "@/components/documents/DocumentViewerModal";
import { DocumentGuide } from "@/components/documents/DocumentGuide";
import { DocumentsEmptyState } from "@/components/documents/DocumentsEmptyState";
import { DocumentReportModal } from "@/components/documents/DocumentReportModal";
import { FocusAreaSelector, type FocusArea } from "@/components/documents/FocusAreaSelector";
import { HistoricalReportsAccordion } from "@/components/documents/HistoricalReportsAccordion";
import { ProjectScribe } from "@/components/documents/ProjectScribe";
import { ReAnalysisButton } from "@/components/documents/ReAnalysisButton";
import * as pdfjs from "pdfjs-dist";
import { ProductTour } from "@/components/onboarding/ProductTour";
import { documentsTourSteps } from "@/components/onboarding/tourConfigs";
import { useTourProgress } from "@/hooks/useTourProgress";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Documents() {
  const { selectedFamily, selectedStudent, currentUserRole } = useFamily();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { shouldRunTour, markTourAsSeen } = useTourProgress('has_seen_documents_tour');

  // Cleanup failed extractions on page load
  useEffect(() => {
    const cleanupFailedExtractions = async () => {
      if (!selectedFamily?.id) return;
      
      try {
        console.log('🧹 Running background cleanup of failed extractions...');
        await supabase.functions.invoke('cleanup-failed-extractions');
      } catch (error) {
        // Silent fail - this is background cleanup
        console.log('Background cleanup completed:', error);
      }
    };
    
    cleanupFailedExtractions();
  }, [selectedFamily?.id]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [analyzingDocId, setAnalyzingDocId] = useState<string | null>(null);
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [dismissedJobIds, setDismissedJobIds] = useState<string[]>([]);

  // Fetch the most recent analysis job for this family
  const { data: recentJob } = useQuery({
    queryKey: ["recent-analysis-job", selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return null;
      const { data, error } = await supabase
        .from("analysis_jobs")
        .select("*")
        .eq("family_id", selectedFamily.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      
      if (error || !data) return null;
      
      // Only show jobs from the last 24 hours
      const jobAge = Date.now() - new Date(data.created_at).getTime();
      if (jobAge > 24 * 60 * 60 * 1000) return null;
      
      return data;
    },
    enabled: !!selectedFamily?.id,
  });

  // Set activeJobId if there's a recent job that's processing or recently completed/failed
  useEffect(() => {
    if (recentJob && !activeJobId && !dismissedJobIds.includes(recentJob.id)) {
      if (recentJob.status === 'processing' || recentJob.status === 'pending') {
        setActiveJobId(recentJob.id);
      } else if (recentJob.status === 'failed' || recentJob.status === 'completed' || recentJob.status === 'completed_with_errors') {
        // Show completed/failed jobs for visibility
        setActiveJobId(recentJob.id);
      }
    }
  }, [recentJob, activeJobId, dismissedJobIds]);

  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents", selectedFamily?.id, selectedStudent?.id],
    queryFn: async () => {
      if (!selectedFamily?.id || !selectedStudent?.id) return [];
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("family_id", selectedFamily.id)
        .eq("student_id", selectedStudent.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id && !!selectedStudent?.id,
  });

  // Check if user is super admin
  const { data: isSuperAdmin } = useQuery({
    queryKey: ["is-super-admin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data, error } = await supabase
        .rpc('has_super_admin_role', { _user_id: user.id });
      
      return data || false;
    },
  });

  const { data: familyData } = useQuery({
    queryKey: ["family", selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return null;
      const { data, error } = await supabase
        .from("families")
        .select("initial_doc_analysis_status, suggested_charts_config")
        .eq("id", selectedFamily.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const doc = documents?.find((d) => d.id === documentId);
      if (!doc) throw new Error("Document not found");

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("family-documents")
        .remove([doc.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete document: " + error.message);
    },
  });

  const handleViewDocument = async (document: any) => {
    setSelectedDocument(document);
    setViewerModalOpen(true);
  };

  const handleDownload = async (document: any) => {
    try {
      const { data, error } = await supabase.storage
        .from("family-documents")
        .download(document.file_path);

      if (error) throw error;
      if (data) {
        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(data);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = document.file_name;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error: any) {
      toast.error("Failed to download: " + error.message);
    }
  };

  const handleBulkDownload = async () => {
    if (selectedDocIds.length === 0) return;
    
    setIsBulkDownloading(true);
    const toastId = toast.loading(`Preparing ${selectedDocIds.length} document${selectedDocIds.length > 1 ? 's' : ''} for download...`);
    
    try {
      const zip = new JSZip();
      const selectedDocs = documents?.filter(doc => selectedDocIds.includes(doc.id)) || [];
      
      for (let i = 0; i < selectedDocs.length; i++) {
        const doc = selectedDocs[i];
        toast.loading(`Downloading ${i + 1} of ${selectedDocs.length}...`, { id: toastId });
        
        try {
          const { data, error } = await supabase.storage
            .from("family-documents")
            .download(doc.file_path);

          if (error) throw error;
          if (data) {
            zip.file(doc.file_name, data);
          }
        } catch (error) {
          console.error(`Failed to download ${doc.file_name}:`, error);
          toast.warning(`Skipped ${doc.file_name} due to error`, { id: toastId });
        }
      }

      toast.loading("Creating ZIP archive...", { id: toastId });
      const content = await zip.generateAsync({ type: "blob" });
      
      const timestamp = format(new Date(), "yyyy-MM-dd-HH-mm-ss");
      saveAs(content, `documents-${timestamp}.zip`);
      
      toast.success(`✅ Downloaded ${selectedDocs.length} document${selectedDocs.length > 1 ? 's' : ''} as ZIP`, { id: toastId });
      setSelectedDocIds([]);
    } catch (error: any) {
      toast.error("Failed to create ZIP: " + error.message, { id: toastId });
    } finally {
      setIsBulkDownloading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDocIds.length === 0) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedDocIds.length} document${selectedDocIds.length > 1 ? 's' : ''}? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    const toastId = toast.loading(`Deleting ${selectedDocIds.length} document${selectedDocIds.length > 1 ? 's' : ''}...`);
    
    try {
      let successCount = 0;
      let failCount = 0;

      for (const docId of selectedDocIds) {
        try {
          await deleteMutation.mutateAsync(docId);
          successCount++;
        } catch (error) {
          failCount++;
        }
      }

      if (failCount === 0) {
        toast.success(`✅ Deleted ${successCount} document${successCount > 1 ? 's' : ''}`, { id: toastId });
      } else {
        toast.warning(`✅ ${successCount} deleted, ⚠️ ${failCount} failed`, { id: toastId });
      }
      
      setSelectedDocIds([]);
    } catch (error: any) {
      toast.error("Bulk delete failed: " + error.message, { id: toastId });
    }
  };

  const toggleSelectAll = () => {
    if (selectedDocIds.length === documents?.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents?.map(doc => doc.id) || []);
    }
  };

  const toggleSelectDoc = (docId: string) => {
    setSelectedDocIds(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const extractTextFromPDF = async (fileBlob: Blob): Promise<string> => {
    try {
      // Configure worker with reliable CDN
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await fileBlob.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }
      
      return fullText.trim();
    } catch (error) {
      console.error("PDF text extraction error:", error);
      throw new Error("Failed to extract text from PDF");
    }
  };

  const handleAnalyzeDocument = async (documentId: string) => {
    setAnalyzingDocId(documentId);
    const toastId = toast.loading("Preparing document for analysis...");
    
    try {
      // First check if document has extracted content
      const { data: doc } = await supabase
        .from('documents')
        .select('extracted_content, file_path, file_type')
        .eq('id', documentId)
        .single();

      // If no extracted content and it's a PDF, extract it first
      if (!doc?.extracted_content && doc?.file_type === 'application/pdf') {
        toast.loading("Extracting text from PDF...", { id: toastId });
        
        // Extract storage path from full URL if needed
        let storagePath = doc.file_path;
        if (storagePath.includes('/storage/v1/object/public/family-documents/')) {
          // Extract path after the bucket name
          const match = storagePath.match(/\/family-documents\/(.+)$/);
          storagePath = match ? match[1] : storagePath;
        }
        
        console.log('📥 Downloading document from storage path:', storagePath);
        
        // Download the PDF from storage
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('family-documents')
          .download(storagePath);

        if (downloadError || !fileData) {
          console.error('❌ Download error:', downloadError);
          throw new Error("Failed to download document");
        }

        // Extract text using PDF.js
        const extractedText = await extractTextFromPDF(fileData);
        
        // Update the document with extracted content
        const { error: updateError } = await supabase
          .from('documents')
          .update({ extracted_content: extractedText })
          .eq('id', documentId);

        if (updateError) {
          throw new Error("Failed to save extracted text");
        }
      }

      // Now analyze the document with timeout protection
      toast.loading("Analyzing document with AI...", { id: toastId });
      
      // Super admins bypass usage limits for testing
      const bypassLimit = isSuperAdmin || false;
      
      if (bypassLimit) {
        console.log('🔓 Super Admin mode: Bypassing usage limits');
      }
      
      // Client-side timeout: 90 seconds max
      const analysisPromise = (async () => {
        let retries = 0;
        const maxRetries = 3;
        let delay = 2000;
        
        while (retries < maxRetries) {
          try {
            const { data, error } = await supabase.functions.invoke("analyze-document", {
              body: { 
                document_id: documentId,
                bypass_limit: bypassLimit 
              },
            });

            if (error) {
              if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
                retries++;
                if (retries < maxRetries) {
                  toast.loading(`Rate limited, retrying in ${delay/1000}s...`, { id: toastId });
                  await new Promise(resolve => setTimeout(resolve, delay));
                  delay *= 2;
                  continue;
                }
              }
              throw error;
            }

            return data;
          } catch (innerError) {
            if (retries >= maxRetries - 1) {
              throw innerError;
            }
          }
        }
      })();
      
      // Race between analysis and timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Analysis timed out after 90 seconds')), 90000)
      );
      
      const data = await Promise.race([analysisPromise, timeoutPromise]) as any;
      
      toast.success(`Analysis complete! Found ${data.metrics_count} metrics, ${data.insights_count} insights`, { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    } catch (error: any) {
      console.error('Document analysis error:', error);
      
      // If document not found, it was cleaned up - refresh the list
      if (error.message?.includes('404') || 
          error.message?.includes('not found') || 
          error.message?.includes('Document not found')) {
        toast.info('Document was removed due to upload failure. Please try uploading again.', { id: toastId });
        queryClient.invalidateQueries({ queryKey: ["documents"] });
        setAnalyzingDocId(null);
        return;
      }
      
      // Parse error response for monthly limit
      let errorData: any = {};
      try {
        if (error.message) {
          // Try to parse JSON error message
          const jsonMatch = error.message.match(/\{.*\}/);
          if (jsonMatch) {
            errorData = JSON.parse(jsonMatch[0]);
          }
        }
      } catch (e) {
        // Not JSON, continue with regular error handling
      }
      
      // Specific error messages based on error type
      let errorMsg = "Failed to analyze document";
      
      if (errorData.error?.includes('Monthly document analysis limit reached') || 
          error.message?.includes('Monthly document analysis limit')) {
        errorMsg = `📊 Monthly limit reached (${errorData.used || 20}/${errorData.limit || 20} documents analyzed). Upgrade your subscription or wait until next month.`;
      } else if (error.message?.includes('extraction') || error.message?.includes('Text extraction')) {
        errorMsg = "Text extraction failed. The document has been removed. Please try uploading again.";
      } else if (error.message?.includes('timed out') || error.message?.includes('timeout')) {
        errorMsg = "Analysis timed out. This document may be too large or complex. Try splitting it into smaller files.";
      } else if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
        errorMsg = "🚦 Too many requests - please wait 30 seconds and try again";
      } else if (error.message?.includes('Rate limit')) {
        errorMsg = "🚦 Rate limit exceeded - please wait a moment and try again";
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      toast.error(errorMsg, { id: toastId, duration: 8000 });
      
      // Always refresh the document list to clear stale state
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    } finally {
      setAnalyzingDocId(null);
    }
  };

  const handleDeepReAnalysis = async () => {
    if (!selectedFamily?.id) return;
    
    const toastId = toast.loading("Starting deep re-analysis with Vision AI...");
    try {
      const { data, error } = await supabase.functions.invoke("re-analyze-all-documents", {
        body: { family_id: selectedFamily.id },
      });

      if (error) throw error;

      if (data?.job_id) {
        setActiveJobId(data.job_id);
        toast.success(`Processing ${data.total_documents} documents. Watch the live progress below.`, { id: toastId });
      }
    } catch (error: any) {
      console.error("Re-analysis error:", error);
      toast.error("Re-analysis failed: " + error.message, { id: toastId });
    }
  };

  const handleResetAnalysis = async () => {
    if (!selectedFamily?.id) return;
    
    const toastId = toast.loading("Resetting analysis...");
    try {
      const { error } = await supabase.functions.invoke("reset-analysis", {
        body: { family_id: selectedFamily.id },
      });

      if (error) throw error;

      toast.success("Reset complete! Click 'Analyze My Documents' to re-run.", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["family"] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    } catch (error: any) {
      console.error("Reset error:", error);
      toast.error("Reset failed: " + error.message, { id: toastId });
    }
  };

  const handleAnalyzeAllDocuments = async () => {
    if (!selectedFamily?.id) return;
    
    setIsAnalyzingAll(true);
    const toastId = toast.loading("Analyzing your documents to discover personalized insights...");
    
    try {
      const { data, error } = await supabase.functions.invoke("first-look-analysis", {
        body: { family_id: selectedFamily.id },
      });

      if (error) throw error;

      toast.success("Analysis complete! Your personalized charts are ready.", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["family"] });
      
      sessionStorage.setItem('showChartsCelebration', 'true');
      
      // Redirect to Analytics page
      setTimeout(() => {
        navigate("/analytics");
      }, 1000);
    } catch (error: any) {
      console.error("First look analysis error:", error);
      toast.error("Analysis failed: " + error.message, { id: toastId });
    } finally {
      setIsAnalyzingAll(false);
    }
  };

  const shouldShowAnalyzeButtons = documents && documents.length >= 3 && 
    familyData?.initial_doc_analysis_status === 'pending';

  const [selectedFocusArea, setSelectedFocusArea] = useState<FocusArea>('comprehensive');

  const handleGenerateReport = async () => {
    if (!selectedFamily?.id || !selectedStudent?.id) {
      toast.error("Please select a family and student");
      return;
    }

    if (!documents || documents.length === 0) {
      toast.error("No documents found to generate a report");
      return;
    }

    setIsGeneratingReport(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-document-report', {
        body: { 
          family_id: selectedFamily.id,
          student_id: selectedStudent.id,
          focusArea: selectedFocusArea
        }
      });

      // Handle insufficient credits (402 Payment Required)
      if (error) {
        if ('context' in error && error.context?.status === 402) {
          const errorBody = error.context?.body;
          if (errorBody?.error === 'insufficient_credits') {
            toast.error(
              `Insufficient AI Credits`,
              {
                description: `You need ${errorBody.credits_required} credits but only have ${errorBody.credits_available} available. Please purchase more credits to continue.`
              }
            );
            return;
          }
        }
        throw error;
      }
      
      if (!data?.success) {
        throw new Error(data?.error || 'Report generation failed');
      }

      setReportData(data);
      setIsReportModalOpen(true);
      queryClient.invalidateQueries({ queryKey: ['historical-reports'] });
      toast.success(`Report generated! Analyzed ${data.document_count} documents with ${data.metrics_analyzed} metrics.`);
    } catch (error: any) {
      console.error('Report generation error:', error);
      toast.error("Failed to generate report: " + (error.message || "Unknown error"));
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Show empty state if no documents
  if (!isLoading && (!documents || documents.length === 0)) {
    return (
      <>
        <DocumentsEmptyState onUpload={() => setUploadModalOpen(true)} />
        
        <DocumentUploadModal
          open={uploadModalOpen}
          onOpenChange={setUploadModalOpen}
        />
      </>
    );
  }

  return (
    <>
      <ProductTour 
        run={shouldRunTour} 
        onComplete={markTourAsSeen}
        tourSteps={documentsTourSteps}
        tourTitle="Welcome to Documents"
        tourDescription="Upload and analyze important documents with AI assistance. Ready to learn more?"
      />

      {isSuperAdmin && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2">
          <span className="text-lg">🔓</span>
          <div>
            <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">Super Admin Testing Mode</p>
            <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80">Unlimited document analysis • No usage restrictions</p>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Project Scribe - Live Analysis Log */}
        {activeJobId && (
          <ProjectScribe 
            jobId={activeJobId}
            onComplete={() => {
              if (activeJobId) {
                setDismissedJobIds(prev => [...prev, activeJobId]);
              }
              setActiveJobId(null);
              queryClient.invalidateQueries({ queryKey: ["documents"] });
            }}
          />
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage IEPs, evaluations, progress reports, and more
            </p>
            {selectedStudent && (
              <p className="text-xs text-muted-foreground mt-1">
                Viewing documents for: <span className="font-semibold text-foreground">{selectedStudent.student_name}</span>
              </p>
            )}
          </div>
          <div className="flex gap-4 flex-wrap items-center">
            {/* Analysis & Reporting Group - Warning colors */}
            {(shouldShowAnalyzeButtons || (documents && documents.length > 0)) && (
              <div className="flex gap-2 flex-wrap items-center border-l-2 border-amber-500/30 pl-3">
                {shouldShowAnalyzeButtons && (
                  <>
                    <Button 
                      onClick={handleAnalyzeAllDocuments}
                      disabled={isAnalyzingAll}
                      variant="secondary"
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      <Sparkles className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">{isAnalyzingAll ? "Analyzing..." : "Analyze My Documents"}</span>
                      <span className="sm:hidden">{isAnalyzingAll ? "Analyzing..." : "Analyze"}</span>
                    </Button>
                    <Button 
                      onClick={handleResetAnalysis}
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-950"
                    >
                      Reset
                    </Button>
                  </>
                )}

                {documents && documents.length > 0 && (
                  <>
                    <Button 
                      onClick={handleGenerateReport}
                      disabled={isGeneratingReport}
                      variant="secondary"
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">{isGeneratingReport ? "Generating..." : "Generate Report"}</span>
                      <span className="sm:hidden">{isGeneratingReport ? "Gen..." : "Report"}</span>
                    </Button>
                    
                    <ReAnalysisButton 
                      familyId={selectedFamily.id}
                      onJobStarted={(jobId) => {
                        setActiveJobId(jobId);
                        queryClient.invalidateQueries({ queryKey: ["documents"] });
                      }}
                    />
                  </>
                )}
              </div>
            )}
            
            {/* Document Management Group - Primary colors */}
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => setUploadModalOpen(true)} size="sm" className="text-xs sm:text-sm">
                <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Upload </span>Document
              </Button>
              
              <Sheet open={guideOpen} onOpenChange={setGuideOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    <HelpCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Document </span>Guide
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>What Should I Upload?</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <DocumentGuide />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {documents && documents.length > 0 && (
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generate Clinical Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FocusAreaSelector 
                value={selectedFocusArea}
                onChange={setSelectedFocusArea}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  250 AI credits • Comprehensive {selectedFocusArea} analysis
                </p>
                <Button 
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  size="lg"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {isGeneratingReport ? "Generating..." : "Generate Report"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading documents...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedDocIds.length === documents.length && documents.length > 0}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all documents"
                      />
                    </TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Document Date</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDocIds.includes(doc.id)}
                          onCheckedChange={() => toggleSelectDoc(doc.id)}
                          aria-label={`Select ${doc.file_name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{doc.file_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {doc.document_date
                          ? format(new Date(doc.document_date), "MMM dd, yyyy")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(doc.created_at), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{doc.file_size_kb ? `${Math.round(doc.file_size_kb)} KB` : "—"}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {!doc.last_analyzed_at && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAnalyzeDocument(doc.id)}
                              disabled={analyzingDocId === doc.id}
                            >
                              {analyzingDocId === doc.id ? "Analyzing..." : "🔍 Analyze"}
                            </Button>
                          )}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewDocument(doc)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Document</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownload(doc)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download Document</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {currentUserRole === 'owner' && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteMutation.mutate(doc.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete Document</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {selectedFamily?.id && selectedStudent?.id && (
          <HistoricalReportsAccordion 
            familyId={selectedFamily.id}
            studentId={selectedStudent.id}
          />
        )}

        {/* Floating Action Bar */}
        {selectedDocIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
            <Card className="shadow-lg border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {selectedDocIds.length} document{selectedDocIds.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleBulkDownload}
                      disabled={isBulkDownloading}
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isBulkDownloading ? "Downloading..." : "Download Selected"}
                    </Button>
                    {currentUserRole === 'owner' && (
                      <Button
                        onClick={handleBulkDelete}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Selected
                      </Button>
                    )}
                    <Button
                      onClick={() => setSelectedDocIds([])}
                      variant="outline"
                      size="sm"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <DocumentUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
      />

      <DocumentViewerModal
        open={viewerModalOpen}
        onOpenChange={setViewerModalOpen}
        document={selectedDocument}
      />

      <DocumentReportModal
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        reportData={reportData}
        documents={documents}
      />
    </>
  );
}
