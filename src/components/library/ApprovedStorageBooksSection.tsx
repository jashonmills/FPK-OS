
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserUploadedBooks } from '@/hooks/useUserUploadedBooks';
import { FileText, Eye, Calendar, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import PDFViewer from './PDFViewer';

const ApprovedStorageBooksSection: React.FC = () => {
  const { approvedUploads, isLoadingApproved } = useUserUploadedBooks();
  const [selectedPDF, setSelectedPDF] = useState<any>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileName = (fileName: string) => {
    return fileName
      .replace('.pdf', '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .substring(0, 50) + (fileName.length > 50 ? '...' : '');
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Library ({approvedUploads.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Books uploaded by the community and approved by our moderation team
          </p>
        </CardHeader>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {approvedUploads.map((book) => (
                <div key={book.id} className="group space-y-3">
                  {/* Book Cover */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-green-50 to-green-100 rounded-lg overflow-hidden flex items-center justify-center border group-hover:shadow-md transition-shadow">
                    <div className="text-center p-4">
                      <FileText className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <p className="text-xs text-green-600 font-medium line-clamp-3">
                        {formatFileName(book.file_name)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Book Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                      {formatFileName(book.file_name)}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Added {formatDate(book.uploaded_at)}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPDF(book)}
                      className="w-full flex items-center gap-1 hover:bg-green-50"
                    >
                      <Eye className="h-3 w-3" />
                      Read Book
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
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
