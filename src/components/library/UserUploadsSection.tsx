
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useUserUploadedBooks } from '@/hooks/useUserUploadedBooks';
import { Upload, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import OptimizedPDFViewer from './OptimizedPDFViewer';
import UserUploadsListView from './UserUploadsListView';
import UserUploadsGridView from './UserUploadsGridView';
import PDFUploadComponent from './PDFUploadComponent';

type ViewMode = 'list' | 'grid';

const UserUploadsSection: React.FC = () => {
  const { userUploads, isLoadingUser, refetchUserUploads } = useUserUploadedBooks();
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [validatingPDF, setValidatingPDF] = useState<string | null>(null);
  const { toast } = useToast();

  // Collapsible and view mode state with localStorage persistence
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('userUploads-expanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('userUploads-viewMode');
    return (saved as ViewMode) || 'grid';
  });

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

  const handleUploadSuccess = () => {
    refetchUserUploads();
    toast({
      title: "Upload Successful",
      description: "Your PDF has been uploaded and is ready to read.",
    });
  };

  if (isLoadingUser) {
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
            {Array.from({ length: 6 }).map((_, index) => (
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
            </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent>
              <PDFUploadComponent onUploadSuccess={handleUploadSuccess} />
              
              {userUploads.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No uploads yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your first PDF to get started with your personal library.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mt-6">
                  {/* View Toggle Controls */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Your personal collection of uploaded documents
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
                    <UserUploadsListView 
                      books={userUploads} 
                      onView={handlePDFOpen}
                      validatingPDF={validatingPDF}
                    />
                  ) : (
                    <UserUploadsGridView 
                      books={userUploads} 
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
