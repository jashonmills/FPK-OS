
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useUserUploadedBooks } from '@/hooks/useUserUploadedBooks';
import { FileText, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import OptimizedPDFViewer from './OptimizedPDFViewer';
import CommunityBooksListView from './CommunityBooksListView';
import CommunityBooksGridView from './CommunityBooksGridView';

type ViewMode = 'list' | 'grid';

const ApprovedStorageBooksSection: React.FC = () => {
  const { approvedUploads, isLoadingApproved } = useUserUploadedBooks();
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [validatingPDF, setValidatingPDF] = useState<string | null>(null);
  const { toast } = useToast();

  // Collapsible and view mode state with localStorage persistence - defaulting to closed
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('communityLibrary-expanded');
    return saved !== null ? JSON.parse(saved) : false; // Changed from true to false
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
    console.log('📖 Opening PDF with optimized viewer:', book.file_name);
    setValidatingPDF(book.id);
    
    try {
      // Add a small delay to show validation state
      await new Promise(resolve => setTimeout(resolve, 500));
      setSelectedPDF(book);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open PDF viewer",
        variant: "destructive"
      });
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

      {/* Optimized PDF Viewer Modal */}
      {selectedPDF && (
        <OptimizedPDFViewer
          fileUrl={selectedPDF.file_url}
          fileName={selectedPDF.file_name}
          onClose={() => setSelectedPDF(null)}
        />
      )}
    </>
  );
};

export default ApprovedStorageBooksSection;
