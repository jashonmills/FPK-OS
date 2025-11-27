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
    // Note: Current schema doesn't have file_url
    console.warn('Download functionality not available - file_url not in schema');
  };

  const handleView = (document: IEPDocument) => {
    // Note: Current schema doesn't have file_url
    console.warn('View functionality not available - file_url not in schema');
  };

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div key={doc.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">{doc.document_name}</h4>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Created: {new Date(doc.created_at).toLocaleDateString()}
                </div>
                {doc.medical_information && (
                  <div className="mt-2 text-xs italic">
                    {doc.medical_information}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="gap-1"
                title="View not available - awaiting file storage integration"
              >
                <Eye className="h-3 w-3" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="gap-1"
                title="Download not available - awaiting file storage integration"
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