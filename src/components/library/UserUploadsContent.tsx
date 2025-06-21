import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useUserUploadedBooks } from '@/hooks/useUserUploadedBooks';
import { FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import SimplifiedPDFViewer from './SimplifiedPDFViewer';
import UserUploadsListView from './UserUploadsListView';
import UserUploadsGridView from './UserUploadsGridView';
import PDFUploadComponent from './PDFUploadComponent';

type ViewMode = 'list' | 'grid';

const UserUploadsContent: React.FC = () => {
  const { userUploads, isLoadingUserUploads } = useUserUploadedBooks();
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [validatingPDF, setValidatingPDF] = useState<string | null>(null);
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('userUploads-viewMode');
    return (saved as ViewMode) || 'grid';
  });

  const handlePDFOpen = async (book: any) => {
    console.log('📖 Opening PDF with simplified viewer:', book.file_name);
    console.log('📖 PDF URL:', book.file_url);
    
    setValidatingPDF(book.id);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setSelectedPDF(book);
      
      toast({
        title: "Opening PDF",
        description: `Loading ${book.file_name} with simplified viewer...`,
      });
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
      <div className="space-y-4">
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
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <PDFUploadComponent />
        
        {userUploads.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No uploads yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first PDF to get started with your personal library.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Your personal collection with simplified PDF viewer
              </p>
              <ToggleGroup 
                type="single" 
                value={viewMode} 
                onValueChange={(value) => {
                  if (value) {
                    setViewMode(value as ViewMode);
                    localStorage.setItem('userUploads-viewMode', value);
                  }
                }}
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
      </div>

      {selectedPDF && (
        <SimplifiedPDFViewer
          fileUrl={selectedPDF.file_url}
          fileName={selectedPDF.file_name}
          onClose={() => setSelectedPDF(null)}
        />
      )}
    </>
  );
};

export default UserUploadsContent;
