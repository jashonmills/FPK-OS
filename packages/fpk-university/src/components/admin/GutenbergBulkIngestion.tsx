
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GutenbergIngestionTrigger from '@/components/library/GutenbergIngestionTrigger';

const GutenbergBulkIngestion: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Project Gutenberg Bulk Ingestion</h2>
        <p className="text-muted-foreground">
          Add carefully curated Project Gutenberg titles to the public domain collection.
        </p>
      </div>

      <GutenbergIngestionTrigger />

      <Card>
        <CardHeader>
          <CardTitle>About This Feature</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            This tool adds 30 pre-selected Project Gutenberg titles (IDs 31-60) that are 
            especially valuable for educational purposes.
          </p>
          <p>
            The ingestion process fetches metadata from the Gutendx API, validates EPUB 
            availability, and ensures proper cover images for each title.
          </p>
          <p>
            Books are marked as curated content (not user-added) and will appear in the 
            main Public Domain Collection section.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GutenbergBulkIngestion;
