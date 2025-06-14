
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserUploadedBook } from '@/hooks/useUserUploadedBooks';
import { FileText, Eye, Calendar } from 'lucide-react';

interface CommunityBookItemProps {
  book: UserUploadedBook;
  onView: (book: UserUploadedBook) => void;
  validatingPDF: string | null;
  viewMode: 'list' | 'grid';
}

const CommunityBookItem: React.FC<CommunityBookItemProps> = ({
  book,
  onView,
  validatingPDF,
  viewMode
}) => {
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

  if (viewMode === 'list') {
    return (
      <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center justify-between">
          {/* Left section: filename and metadata */}
          <div className="flex-1 min-w-0 pr-4">
            <h4 className="font-medium truncate mb-1">{formatFileName(book.file_name)}</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Added {formatDate(book.uploaded_at)}</span>
              </div>
            </div>
          </div>
          
          {/* Right section: action button */}
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(book)}
              disabled={validatingPDF === book.id}
              className="flex items-center gap-1 flex-shrink-0"
            >
              {validatingPDF === book.id ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                  Validating...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Read Book
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="group space-y-3">
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
          onClick={() => onView(book)}
          disabled={validatingPDF === book.id}
          className="w-full flex items-center gap-1 hover:bg-green-50"
        >
          {validatingPDF === book.id ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
              Validating...
            </>
          ) : (
            <>
              <Eye className="h-3 w-3" />
              Read Book
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CommunityBookItem;
