import { Document, Page } from "react-pdf";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ThumbnailSidebarProps {
  pdfUrl: string;
  numPages: number;
  currentPage: number;
  onPageSelect: (page: number) => void;
  rotation: number;
}

export function ThumbnailSidebar({ pdfUrl, numPages, currentPage, onPageSelect, rotation }: ThumbnailSidebarProps) {
  return (
    <div className="w-32 border-r bg-muted/30">
      <ScrollArea className="h-full">
        <div className="p-2 space-y-2">
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageSelect(pageNum)}
              className={cn(
                "w-full border rounded overflow-hidden transition-all hover:ring-2 hover:ring-primary",
                currentPage === pageNum && "ring-2 ring-primary shadow-lg"
              )}
            >
              <div className="relative bg-white">
                <Document file={pdfUrl} loading={<div className="h-24 flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin" /></div>}>
                  <Page
                    pageNumber={pageNum}
                    width={112}
                    rotate={rotation}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center">
                  {pageNum}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
