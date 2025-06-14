
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useUserUploadedBooks } from '@/hooks/useUserUploadedBooks';
import { FileText, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import PDFViewer from './PDFViewer';
import CommunityBooksListView from './CommunityBooksListView';
import CommunityBooksGridView from './CommunityBooksGridView';
import { validatePDFUrl } from '@/utils/pdfUtils';

type ViewMode = 'list' | 'grid';

const ApprovedStorageBooksSection: React.FC = () => {
  const { approvedUploads, isLoadingApproved } = useUserUploadedBooks();
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [validatingPDF, setValidatingPDF] = useState<string | null>(null);
  const { toast } = useToast();

  // Collapsible and view mode state with localStorage persistence
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('communityLibrary-expanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('communityLibrary-viewMode');
    return (saved as ViewMode) || 'grid';
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('communityLibrary-expanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    localStorage.setItem('communityLibrary-viewMode', viewMode);
  }, [viewMode]);

  const handlePDFOpen = async (book: any) => {
    setValidatingPDF(book.id);
    
    try {
      console.log('🔍 Validating PDF before opening:', book.file_name);
      
      const validation = await validatePDFUrl(book.file_url);
      
      if (!validation.isValid) {
        toast({
          title: "PDF Error",
          description: validation.error || "The PDF file cannot be loaded.",
          variant: "destructive"
        });
        return;
      }

      // Update the book with the processed URL if it was modified
      const bookToOpen = validation.processedUrl !== book.file_url 
        ? { ...book, file_url: validation.processedUrl }
        : book;
        
      setSelectedPDF(bookToOpen);
      
    } catch (error) {
      console.error('❌ PDF validation failed:', error);
      toast({
        title: "Validation Error",
        description: "Could not validate the PDF file. It may still load.",
        variant: "destructive"
      });
      
      // Still try to open the PDF
      setSelectedPDF(book);
    } finally {
      setValidatingPDF(null);
    }
  };

  if (isLoadingApproved) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Library
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Loading community books...
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" role="button" aria-expanded={isExpanded}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community Library ({approvedUploads.length})
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent>
              {approvedUploads.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No community books yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Community books will appear here once they are uploaded and approved by our team.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* View Toggle Controls */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Books uploaded by the community and approved by our moderation team
                    </p>
                    <ToggleGroup 
                      type="single" 
                      value={viewMode} 
                      onValueChange={(value) => value && setViewMode(value as ViewMode)}
                      className="border rounded-md"
                    >
                      <ToggleGroupItem value="list" aria-label="List view" size="sm">
                        <span className="text-xs">List</span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="grid" aria-label="Grid view" size="sm">
                        <span className="text-xs">Grid</span>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Content based on view mode */}
                  {viewMode === 'list' ? (
                    <CommunityBooksListView 
                      books={approvedUploads} 
                      onView={handlePDFOpen}
                      validatingPDF={validatingPDF}
                    />
                  ) : (
                    <CommunityBooksGridView 
                      books={approvedUploads} 
                      onView={handlePDFOpen}
                      validatingPDF={validatingPDF}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* PDF Viewer Modal */}
      {selectedPDF && (
        <PDFViewer
          fileUrl={selectedPDF.file_url}
          fileName={selectedPDF.file_name}
          onClose={() => setSelectedPDF(null)}
        />
      )}
    </>
  );
};

export default ApprovedStorageBooksSection;
