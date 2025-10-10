import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, FileText, Eye, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { DocumentUploadModal } from "@/components/documents/DocumentUploadModal";
import { DocumentViewerModal } from "@/components/documents/DocumentViewerModal";
import * as pdfjs from "pdfjs-dist";

export default function Documents() {
  const { selectedFamily, selectedStudent } = useFamily();
  const queryClient = useQueryClient();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [analyzingDocId, setAnalyzingDocId] = useState<string | null>(null);

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
    try {
      // First check if document has extracted content
      const { data: doc } = await supabase
        .from('documents')
        .select('extracted_content, file_path, file_type')
        .eq('id', documentId)
        .single();

      // If no extracted content and it's a PDF, extract it first
      if (!doc?.extracted_content && doc?.file_type === 'application/pdf') {
        toast.info("Extracting text from PDF...");
        
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

        toast.success("Text extracted successfully!");
      }

      // Now analyze the document
      toast.info("Analyzing document...");
      const { data, error } = await supabase.functions.invoke("analyze-document", {
        body: { document_id: documentId },
      });

      if (error) throw error;

      toast.success(`Analysis complete! Found ${data.metrics_count} metrics, ${data.insights_count} insights`);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    } catch (error: any) {
      console.error('Document analysis error:', error);
      toast.error("Failed to analyze document: " + error.message);
    } finally {
      setAnalyzingDocId(null);
    }
  };
  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Manage IEPs, evaluations, progress reports, and more
          </p>
          <Button onClick={() => setUploadModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading documents...</div>
            ) : !documents || documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No documents uploaded yet</p>
                <Button onClick={() => setUploadModalOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Document
                </Button>
              </div>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
