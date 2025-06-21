
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Grid, 
  List, 
  FileText, 
  Image, 
  Film, 
  MoreVertical,
  Download,
  Trash2,
  Calendar,
  HardDrive
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useKnowledgeBaseFiles, type KnowledgeBaseFile } from '@/hooks/useKnowledgeBaseFiles';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type ViewMode = 'grid' | 'list';
type SortField = 'uploaded_at' | 'file_name' | 'file_size' | 'processed';

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return Film;
  return FileText;
};

const getFileTypeLabel = (mimeType: string): string => {
  const typeMap: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'text/plain': 'TXT',
    'text/markdown': 'MD',
    'text/csv': 'CSV',
    'application/rtf': 'RTF',
    'image/png': 'PNG',
    'image/jpeg': 'JPG',
    'image/gif': 'GIF',
    'image/webp': 'WEBP'
  };
  return typeMap[mimeType] || 'FILE';
};

interface FileItemProps {
  file: KnowledgeBaseFile;
  viewMode: ViewMode;
  onDownload: (file: KnowledgeBaseFile) => void;
  onDelete: (fileId: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, viewMode, onDownload, onDelete }) => {
  const Icon = getFileIcon(file.mime_type);

  if (viewMode === 'grid') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon className="h-8 w-8 text-muted-foreground" />
              <Badge variant="outline" className="text-xs">
                {getFileTypeLabel(file.mime_type)}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onDownload(file)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(file.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm line-clamp-2" title={file.file_name}>
              {file.file_name}
            </h4>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatFileSize(file.file_size)}</span>
              <Badge 
                variant={file.processed ? "default" : "secondary"}
                className="text-xs"
              >
                {file.processed ? "Processed" : "Pending"}
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {formatDate(file.uploaded_at)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50">
      <Icon className="h-6 w-6 text-muted-foreground flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h4 className="font-medium text-sm truncate" title={file.file_name}>
            {file.file_name}
          </h4>
          <Badge variant="outline" className="text-xs flex-shrink-0">
            {getFileTypeLabel(file.mime_type)}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span className="flex items-center space-x-1">
            <HardDrive className="h-3 w-3" />
            <span>{formatFileSize(file.file_size)}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(file.uploaded_at)}</span>
          </span>
        </div>
      </div>

      <Badge 
        variant={file.processed ? "default" : "secondary"}
        className="text-xs flex-shrink-0"
      >
        {file.processed ? "Processed" : "Pending"}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onDownload(file)}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete(file.id)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const KBFileManager: React.FC = () => {
  const { user } = useAuth();
  const { files, isLoading, deleteFile } = useKnowledgeBaseFiles();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('uploaded_at');

  const handleDownload = async (file: KnowledgeBaseFile) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.storage
        .from('kb_files')
        .download(file.storage_path);

      if (error) {
        console.error('Download failed:', error);
        return;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const sortedFiles = [...files].sort((a, b) => {
    switch (sortField) {
      case 'file_name':
        return a.file_name.localeCompare(b.file_name);
      case 'file_size':
        return b.file_size - a.file_size;
      case 'processed':
        return Number(b.processed) - Number(a.processed);
      case 'uploaded_at':
      default:
        return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading your files...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Knowledge Base Files</span>
            <Badge variant="outline">{files.length}</Badge>
          </CardTitle>
          
          {files.length > 0 && (
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && setViewMode(value as ViewMode)}
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No files uploaded yet.</p>
            <p className="text-sm">Upload reference documents to enhance your AI conversations.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sort controls */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Sort by:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortField('uploaded_at')}
                className={sortField === 'uploaded_at' ? 'bg-muted' : ''}
              >
                Date
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortField('file_name')}
                className={sortField === 'file_name' ? 'bg-muted' : ''}
              >
                Name
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortField('file_size')}
                className={sortField === 'file_size' ? 'bg-muted' : ''}
              >
                Size
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortField('processed')}
                className={sortField === 'processed' ? 'bg-muted' : ''}
              >
                Status
              </Button>
            </div>

            {/* Files display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedFiles.map((file) => (
                  <FileItem
                    key={file.id}
                    file={file}
                    viewMode={viewMode}
                    onDownload={handleDownload}
                    onDelete={deleteFile}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {sortedFiles.map((file) => (
                  <FileItem
                    key={file.id}
                    file={file}
                    viewMode={viewMode}
                    onDownload={handleDownload}
                    onDelete={deleteFile}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KBFileManager;
