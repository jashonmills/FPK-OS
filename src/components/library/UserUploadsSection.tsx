
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useUserUploadedBooks, UserUploadedBook } from '@/hooks/useUserUploadedBooks';
import { FileText, Clock, CheckCircle, XCircle, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import PDFViewer from './PDFViewer';

type ViewMode = 'list' | 'grid';

const UserUploadsSection: React.FC = () => {
  const { userUploads, isLoadingUserUploads } = useUserUploadedBooks();
  const [selectedPDF, setSelectedPDF] = useState<UserUploadedBook | null>(null);
  
  // Collapsible and view mode state with localStorage persistence
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('userUploads-expanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('userUploads-viewMode');
    return (saved as ViewMode) || 'list';
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('userUploads-expanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    localStorage.setItem('userUploads-viewMode', viewMode);
  }, [viewMode]);

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

  const formatFileName = (fileName: string) => {
    return fileName
      .replace('.pdf', '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .substring(0, 50) + (fileName.length > 50 ? '...' : '');
  };

  // Render items in list view (existing layout)
  const renderListView = () => (
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
  );

  // Render items in grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {userUploads.map((upload) => (
        <div key={upload.id} className="group space-y-3">
          {/* File Cover */}
          <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden flex items-center justify-center border group-hover:shadow-md transition-shadow">
            <div className="text-center p-4">
              <FileText className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <p className="text-xs text-blue-600 font-medium line-clamp-3">
                {formatFileName(upload.file_name)}
              </p>
            </div>
          </div>
          
          {/* File Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">
              {formatFileName(upload.file_name)}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Uploaded {formatDate(upload.uploaded_at)}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge 
                variant={getStatusVariant(upload.status)} 
                className="flex items-center gap-1 px-2 py-1 text-xs"
              >
                {getStatusIcon(upload.status)}
                {upload.status}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPDF(upload)}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                View
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

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
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" role="button" aria-expanded={isExpanded}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
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
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No uploads yet</p>
                  <p className="text-sm text-muted-foreground">
                    Upload your first PDF book to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* View Toggle Controls */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Your uploaded books and their review status
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
                  {viewMode === 'list' ? renderListView() : renderGridView()}
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

export default UserUploadsSection;
