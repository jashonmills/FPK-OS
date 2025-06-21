
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Database } from 'lucide-react';
import KBUploader from './KBUploader';
import KBFileManager from './KBFileManager';
import { useKnowledgeBaseFiles } from '@/hooks/useKnowledgeBaseFiles';

const KnowledgeBaseSection: React.FC = () => {
  const { files } = useKnowledgeBaseFiles();
  const processedCount = files.filter(f => f.processed).length;
  const totalCount = files.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5 text-blue-600" />
            Knowledge Base
          </CardTitle>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Upload reference materials to enhance your AI conversations.</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                {processedCount} of {totalCount} files processed for AI
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <KBUploader />
        </CardContent>
      </Card>

      <KBFileManager />
    </div>
  );
};

export default KnowledgeBaseSection;
