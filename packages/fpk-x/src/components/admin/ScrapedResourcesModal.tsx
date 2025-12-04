import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScrapedResource {
  id: string;
  title: string | null;
  source_url: string | null;
  document_type: string;
  focus_areas: string[] | null;
  created_at: string;
}

interface ScrapedResourcesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceName: string;
  resources: ScrapedResource[];
}

export function ScrapedResourcesModal({
  open,
  onOpenChange,
  sourceName,
  resources,
}: ScrapedResourcesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resources Scraped from {sourceName}
          </DialogTitle>
          <DialogDescription>
            {resources.length} {resources.length === 1 ? 'document' : 'documents'} ingested from this source
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {resources.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No resources found for this source</p>
              </div>
            ) : (
              resources.map((resource) => (
                <div
                  key={resource.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors space-y-3"
                >
                  {/* Title */}
                  <div className="font-medium">
                    {resource.title || 'Untitled Document'}
                  </div>

                  {/* URL */}
                  {resource.source_url && (
                    <a
                      href={resource.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {resource.source_url}
                    </a>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {resource.document_type}
                    </Badge>
                    
                    {resource.focus_areas && resource.focus_areas.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex flex-wrap gap-1">
                          {resource.focus_areas.map((area) => (
                            <Badge key={area} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                    
                    <span>•</span>
                    <span>
                      Ingested: {new Date(resource.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
