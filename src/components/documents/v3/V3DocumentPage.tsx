import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { V3UploadModal } from './V3UploadModal';
import { V3DocumentList } from './V3DocumentList';
import { useFamily } from '@/contexts/FamilyContext';

export function V3DocumentPage() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { selectedFamily, selectedStudent } = useFamily();

  if (!selectedFamily) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please select a family to view documents</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your documents
          </p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <V3DocumentList 
        key={refreshKey}
        familyId={selectedFamily.id} 
        studentId={selectedStudent?.id}
      />

      <V3UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        familyId={selectedFamily.id}
        studentId={selectedStudent?.id}
        onSuccess={() => setRefreshKey(prev => prev + 1)}
      />
    </div>
  );
}
