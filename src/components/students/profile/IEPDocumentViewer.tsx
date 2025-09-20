import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Calendar } from 'lucide-react';
import { IEPDocument } from '@/hooks/useStudentIEP';

interface IEPDocumentViewerProps {
  documents: IEPDocument[];
}

export function IEPDocumentViewer({ documents }: IEPDocumentViewerProps) {
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No IEP documents available yet</p>
      </div>
    );
  }

  const handleDownload = (document: IEPDocument) => {
    // Create a link element and trigger download
    const link = window.document.createElement('a');
    link.href = document.file_url;
    link.download = document.file_name;
    link.target = '_blank';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleView = (document: IEPDocument) => {
    // Open document in new tab
    window.open(document.file_url, '_blank');
  };

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div key={doc.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">{doc.file_name}</h4>
                {doc.document_category && (
                  <Badge variant="outline" className="text-xs">
                    {doc.document_category}
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Uploaded: {new Date(doc.upload_date).toLocaleDateString()}
                </div>
                <div>
                  Type: {doc.file_type.toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleView(doc)}
                className="gap-1"
              >
                <Eye className="h-3 w-3" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(doc)}
                className="gap-1"
              >
                <Download className="h-3 w-3" />
                Download
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}