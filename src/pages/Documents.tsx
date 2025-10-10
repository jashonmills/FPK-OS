import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import * as pdfjs from "pdfjs-dist";
import { ProductTour } from "@/components/onboarding/ProductTour";
import { documentsTourSteps } from "@/components/onboarding/tourConfigs";
import { useTourProgress } from "@/hooks/useTourProgress";

export default function Documents() {
  const { selectedFamily, selectedStudent, currentUserRole } = useFamily();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { shouldRunTour, markTourAsSeen } = useTourProgress('has_seen_documents_tour');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [analyzingDocId, setAnalyzingDocId] = useState<string | null>(null);
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents", selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return [];
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("family_id", selectedFamily.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id,
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
        .createSignedUrl(document.file_path, 60);

      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (error: any) {
      toast.error("Failed to download: " + error.message);
    }
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
        
        // Download the PDF from storage
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('family-documents')
          .download(doc.file_path);

        if (downloadError || !fileData) {
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

      // Now analyze the document
      toast.loading("Analyzing document with AI...", { id: toastId });
      const { data, error } = await supabase.functions.invoke("analyze-document", {
        body: { document_id: documentId },
      });

      if (error) throw error;

      toast.success(`Analysis complete! Found ${data.metrics_count} metrics, ${data.insights_count} insights`, { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    } catch (error: any) {
      console.error('Document analysis error:', error);
      toast.error("Failed to analyze document: " + error.message, { id: toastId });
    } finally {
      setAnalyzingDocId(null);
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

  const shouldShowAnalyzeButtons = documents && documents.length >= 5;

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
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Manage IEPs, evaluations, progress reports, and more
          </p>
          <div className="flex gap-2">
            {shouldShowAnalyzeButtons && (
              <>
                <Button 
                  onClick={handleAnalyzeAllDocuments}
                  disabled={isAnalyzingAll}
                  variant="default"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isAnalyzingAll ? "Analyzing..." : "Analyze My Documents"}
                </Button>
                <Button 
                  onClick={handleResetAnalysis}
                  variant="outline"
                  size="sm"
                >
                  Reset
                </Button>
              </>
            )}
            
            <Sheet open={guideOpen} onOpenChange={setGuideOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Document Guide
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
            
            <Button onClick={() => setUploadModalOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </div>

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
    </>
  );
}
