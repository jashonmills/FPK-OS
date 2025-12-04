
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserUploadedBook } from '@/hooks/useUserUploadedBooks';
import { FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

interface UserUploadItemProps {
  upload: UserUploadedBook;
  onView: (upload: UserUploadedBook) => void;
  viewMode: 'list' | 'grid';
}

const UserUploadItem: React.FC<UserUploadItemProps> = ({ upload, onView, viewMode }) => {
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

  if (viewMode === 'list') {
    return (
      <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center justify-between">
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
              onClick={() => onView(upload)}
              className="flex items-center gap-1 flex-shrink-0"
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="group space-y-3">
      <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden flex items-center justify-center border group-hover:shadow-md transition-shadow">
        <div className="text-center p-4">
          <FileText className="h-12 w-12 text-blue-500 mx-auto mb-2" />
          <p className="text-xs text-blue-600 font-medium line-clamp-3">
            {formatFileName(upload.file_name)}
          </p>
        </div>
      </div>
      
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
            onClick={() => onView(upload)}
            className="flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserUploadItem;
