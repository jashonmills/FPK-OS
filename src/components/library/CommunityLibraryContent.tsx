
import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useUserUploadedBooks } from '@/hooks/useUserUploadedBooks';
import { FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import OptimizedPDFViewer from './OptimizedPDFViewer';
import CommunityBooksListView from './CommunityBooksListView';
import CommunityBooksGridView from './CommunityBooksGridView';
import { safeLocalStorage } from '@/utils/safeStorage';
import { useCleanup } from '@/utils/cleanupManager';

interface SelectedPDF {
  id: string;
  title?: string;
  file_name?: string;
  file_url?: string;
}

type ViewMode = 'list' | 'grid';

const CommunityLibraryContent: React.FC = () => {
  const { approvedUploads, isLoadingApproved } = useUserUploadedBooks();
  const [selectedPDF, setSelectedPDF] = useState<SelectedPDF | null>(null);
  const [validatingPDF, setValidatingPDF] = useState<string | null>(null);
  const { toast } = useToast();
  const cleanup = useCleanup('CommunityLibraryContent');

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = safeLocalStorage.getItem<string>('communityLibrary-viewMode', {
      fallbackValue: 'grid',
      logErrors: false
    });
    return (saved as ViewMode) || 'grid';
  });

  const handlePDFOpen = async (book: SelectedPDF) => {
    console.log('📖 Opening PDF with optimized viewer:', book.file_name);
    setValidatingPDF(book.id);
    
    try {
      await new Promise(resolve => {
        cleanup.setTimeout(() => resolve(undefined), 300);
      });
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
      <div className="space-y-4">
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
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
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
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Books uploaded by the community and approved by our moderation team
              </p>
              <ToggleGroup 
                type="single" 
                value={viewMode} 
                onValueChange={(value) => {
                  if (value) {
                    setViewMode(value as ViewMode);
                    safeLocalStorage.setItem('communityLibrary-viewMode', value);
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
      </div>

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

export default CommunityLibraryContent;
