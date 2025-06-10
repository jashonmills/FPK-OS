
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

const FileUploadCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-5 w-5" />
          Upload Homework or Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            Drag and drop files here, or click to select
          </p>
          <p className="text-xs text-muted-foreground">
            Supported: PDF, JPG, PNG, DOCX (Max 10MB)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;
