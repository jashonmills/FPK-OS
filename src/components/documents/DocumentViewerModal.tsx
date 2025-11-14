import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Loader2, RotateCw, MessageSquare, FileText, ZoomIn, ZoomOut, Maximize2, Image, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Document, Page, pdfjs } from "react-pdf";
import { TeamDiscussion } from "@/components/shared/TeamDiscussion";
import { ThumbnailSidebar } from "./ThumbnailSidebar";
import { DocumentAnnotations } from "./DocumentAnnotations";
import { DocumentInsightsTab } from "./bedrock/DocumentInsightsTab";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configure PDF.js worker with reliable CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
}

export function DocumentViewerModal({ open, onOpenChange, document }: DocumentViewerModalProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [pageWidth, setPageWidth] = useState(700);
  const [pageHeight, setPageHeight] = useState(900);

  useEffect(() => {
    if (document && open) {
      fetchSignedUrl();
    } else {
      setSignedUrl(null);
      setPageNumber(1);
    }
  }, [document, open]);

  const fetchSignedUrl = async () => {
    setLoading(true);
    try {
      // Extract the storage path from file_path
      // file_path can be either:
      // 1. Full URL: https://...supabase.co/storage/v1/object/public/bedrock-storage/path/to/file.pdf
      // 2. Storage path: e5c4f130-ffcb-4a0c-8dbc-d8089eb6f976/file-id-file.pdf
      let storagePath = document.file_path;
      
      // If it's a full URL, extract just the path portion
      if (storagePath.includes('/storage/v1/object/public/bedrock-storage/')) {
        storagePath = storagePath.split('/storage/v1/object/public/bedrock-storage/')[1];
      } else if (storagePath.includes('/storage/v1/object/bedrock-storage/')) {
        // Handle private URLs without 'public'
        storagePath = storagePath.split('/storage/v1/object/bedrock-storage/')[1];
      }

      console.log('Fetching signed URL for storage path:', storagePath);

      const { data, error } = await supabase.storage
        .from("bedrock-storage")
        .createSignedUrl(storagePath, 3600); // 1 hour

      if (error) {
        console.error('Signed URL error:', error);
        throw error;
      }
      
      console.log('Successfully fetched signed URL');
      setSignedUrl(data.signedUrl);
    } catch (error: any) {
      console.error('Document viewer error:', error);
      toast.error("Failed to load document: " + error.message);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (signedUrl) {
      window.open(signedUrl, "_blank");
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = (page: any) => {
    const { width, height } = page;
    setPageWidth(width);
    setPageHeight(height);
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && pageNumber > 1) {
        setPageNumber((prev) => prev - 1);
      } else if (e.key === 'ArrowRight' && pageNumber < numPages) {
        setPageNumber((prev) => prev + 1);
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === 'r' || e.key === 'R') {
        handleRotate();
      } else if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, pageNumber, numPages, onOpenChange]);

  if (!document) return null;

  const isPDF = document.file_type === "application/pdf" || document.file_name.endsWith(".pdf");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{document.file_name}</DialogTitle>
            <div className="flex items-center gap-2">
              {isPDF && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowThumbnails(!showThumbnails)}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    {showThumbnails ? "Hide" : "Show"} Pages
                  </Button>
                  <div className="w-px h-6 bg-border" />
                  <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={scale <= 0.5}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={scale >= 3.0}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleResetZoom}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRotate}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="preview" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">
              <FileText className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Sparkles className="mr-2 h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="discussion">
              <MessageSquare className="mr-2 h-4 w-4" />
              Discussion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 overflow-hidden mt-0 flex">
            {loading ? (
              <div className="flex items-center justify-center h-full w-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : isPDF && signedUrl ? (
              <>
                {showThumbnails && numPages > 1 && (
                  <ThumbnailSidebar
                    pdfUrl={signedUrl}
                    numPages={numPages}
                    currentPage={pageNumber}
                    onPageSelect={setPageNumber}
                    rotation={rotation}
                  />
                )}
                <div className="flex-1 overflow-auto">
                  <div 
                    className="flex flex-col items-center py-4"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <div className="relative">
                      <Document
                        file={signedUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<Loader2 className="h-8 w-8 animate-spin" />}
                      >
                        <Page 
                          pageNumber={pageNumber} 
                          scale={scale} 
                          rotate={rotation}
                          onLoadSuccess={onPageLoadSuccess}
                        />
                      </Document>
                      
                      <DocumentAnnotations
                        pageNumber={pageNumber}
                        scale={scale}
                        rotation={rotation}
                        width={pageWidth}
                        height={pageHeight}
                      />
                    </div>
                    
                    {numPages > 1 && (
                      <div className="flex items-center gap-4 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                          disabled={pageNumber <= 1}
                        >
                          Previous
                        </Button>
                        <span className="text-sm">
                          Page {pageNumber} of {numPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                          disabled={pageNumber >= numPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-muted-foreground">Preview not available for this file type</p>
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download to View
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="flex-1 overflow-hidden mt-0 flex flex-col items-start">
            <div className="w-full max-w-4xl mx-auto">
              <DocumentInsightsTab
                documentId={document.id}
                analysisData={document.analysis_data}
                category={document.category}
              />
            </div>
          </TabsContent>

          <TabsContent value="discussion" className="flex-1 overflow-auto mt-0 flex flex-col items-start">
            <div className="w-full max-w-4xl mx-auto py-6 px-4">
              <TeamDiscussion 
                entityType="document"
                entityId={document.id}
                familyId={document.family_id}
                placeholder="Ask questions, discuss findings, or share insights about this document..."
                noPadding={true}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
