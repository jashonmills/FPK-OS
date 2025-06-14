
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserUploadedBooks, UserUploadedBook } from '@/hooks/useUserUploadedBooks';
import { FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import PDFViewer from './PDFViewer';

const UserUploadsSection: React.FC = () => {
  const { userUploads, isLoadingUserUploads } = useUserUploadedBooks();
  const [selectedPDF, setSelectedPDF] = useState<UserUploadedBook | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoadingUserUploads) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Uploads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-16" />
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
            <FileText className="h-5 w-5" />
            Your Uploads ({userUploads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userUploads.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No uploads yet</p>
              <p className="text-sm text-muted-foreground">
                Upload your first PDF book to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userUploads.map((upload) => (
                <div
                  key={upload.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Flex container with left content and right actions */}
                  <div className="flex items-center justify-between">
                    {/* Left section: filename and metadata */}
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="font-medium truncate mb-1">{upload.file_name}</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Uploaded {formatDate(upload.uploaded_at)}</p>
                        {upload.reviewed_at && (
                          <p>Reviewed {formatDate(upload.reviewed_at)}</p>
                        )}
                        {upload.notes && upload.status === 'rejected' && (
                          <p className="text-red-600 mt-1">Note: {upload.notes}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Right section: status badge and view button */}
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={getStatusVariant(upload.status)} 
                        className="flex items-center gap-1 px-2 py-1 text-sm"
                      >
                        {getStatusIcon(upload.status)}
                        {upload.status}
                      </Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPDF(upload)}
                        className="flex items-center gap-1 flex-shrink-0"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
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

export default UserUploadsSection;
