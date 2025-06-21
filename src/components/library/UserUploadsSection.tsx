import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useUserUploadedBooks } from '@/hooks/useUserUploadedBooks';
import { FileText, Upload, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import OptimizedPDFViewer from './OptimizedPDFViewer';
import UserUploadsListView from './UserUploadsListView';
import UserUploadsGridView from './UserUploadsGridView';
import PDFUploadComponent from './PDFUploadComponent';

interface UserUploadsSectionProps {
  viewMode?: 'grid' | 'list';
}

const UserUploadsSection: React.FC<UserUploadsSectionProps> = ({ viewMode: parentViewMode = 'grid' }) => {
  const { userUploads, isLoadingUserUploads } = useUserUploadedBooks();
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [validatingPDF, setValidatingPDF] = useState<string | null>(null);
  const { toast } = useToast();

  // Collapsible state with localStorage persistence
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('userUploads-expanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  // Use parent viewMode or fallback to localStorage
  const [localViewMode, setLocalViewMode] = useState<'list' | 'grid'>(() => {
    const saved = localStorage.getItem('userUploads-viewMode');
    return (saved as 'list' | 'grid') || parentViewMode;
  });

  const viewMode = parentViewMode || localViewMode;

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('userUploads-expanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    localStorage.setItem('userUploads-viewMode', viewMode);
  }, [viewMode]);

  const handlePDFOpen = async (book: any) => {
    console.log('📖 Opening PDF with optimized viewer:', book.file_name);
    setValidatingPDF(book.id);
    
    try {
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

  if (isLoadingUserUploads) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Your Uploads
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Loading your uploaded books...
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
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
                  <Upload className="h-5 w-5" />
                  Your Uploads ({userUploads.length})
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
              {userUploads.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No uploads yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Upload your first PDF book to get started with your personal library.
                  </p>
                  <PDFUploadComponent />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Upload Component */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Your uploaded books and documents
                    </p>
                    <PDFUploadComponent />
                  </div>

                  {/* Content based on view mode */}
                  {viewMode === 'list' ? (
                    <UserUploadsListView 
                      uploads={userUploads} 
                      onView={handlePDFOpen}
                      validatingPDF={validatingPDF}
                    />
                  ) : (
                    <UserUploadsGridView 
                      uploads={userUploads} 
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

export default UserUploadsSection;
