
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Download } from 'lucide-react';
import EPUBStorageManager from './EPUBStorageManager';

const EPUBIngestionManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">EPUB Storage Management</h2>
        <p className="text-muted-foreground">
          Manage EPUB downloads and storage for the public domain book collection.
        </p>
      </div>

      <EPUBStorageManager />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            How This Works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <div>
            <strong>Download Process:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Books are downloaded from Project Gutenberg using multiple URL strategies</li>
              <li>Files are stored in Supabase Storage for fast access</li>
              <li>Download status is tracked in the database</li>
              <li>Failed downloads can be retried with improved error handling</li>
            </ul>
          </div>
          
          <div>
            <strong>Storage Benefits:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Faster loading times for users</li>
              <li>Reduced dependency on external servers</li>
              <li>Better reliability and availability</li>
              <li>Consistent download experience</li>
            </ul>
          </div>

          <div>
            <strong>Fallback System:</strong>
            <p className="mt-1">
              If a book isn't in storage, the reader will automatically fall back to 
              downloading directly from Project Gutenberg with enhanced retry logic.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EPUBIngestionManager;
