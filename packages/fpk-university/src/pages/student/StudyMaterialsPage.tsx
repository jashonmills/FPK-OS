import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MaterialsSubTab } from '@/components/ai-coach/MaterialsSubTab';
import { AssignedMaterialsTab } from '@/components/ai-coach/AssignedMaterialsTab';
import { DocumentReader } from '@/components/ai-coach/DocumentReader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderOpen, ClipboardCheck, BookOpen } from 'lucide-react';
import type { StudentAssignment } from '@/hooks/useStudentAssignments';

const StudyMaterialsPage = () => {
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get('org') || undefined;
  const [activeDocument, setActiveDocument] = useState<any>(null);

  const handleViewDocument = (material: any) => {
    setActiveDocument(material);
  };

  const handleStartStudying = (assignment: StudentAssignment) => {
    // Convert assignment to document format for viewing
    // resource_id contains the study material ID for type='study_material'
    setActiveDocument({
      id: assignment.resource_id,
      title: assignment.title,
      type: assignment.type,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-6 pt-20">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <FolderOpen className="w-7 h-7 text-primary" />
            Study Materials
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your study materials and assignments
          </p>
        </div>

        {/* Document Viewer (when a document is selected) */}
        {activeDocument ? (
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <DocumentReader
              document={activeDocument}
              onClose={() => setActiveDocument(null)}
            />
          </div>
        ) : (
          /* Main Content with Tabs */
          <Tabs defaultValue="materials" className="w-full">
            <TabsList className="mb-4 bg-muted/50">
              <TabsTrigger value="materials" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                My Materials
              </TabsTrigger>
              <TabsTrigger value="assigned" className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                Assigned
              </TabsTrigger>
            </TabsList>

            <TabsContent value="materials">
              <div className="bg-card/80 backdrop-blur rounded-xl p-4 shadow-sm border border-border">
                <MaterialsSubTab
                  orgId={orgId}
                  onViewDocument={handleViewDocument}
                />
              </div>
            </TabsContent>

            <TabsContent value="assigned">
              <div className="bg-card/80 backdrop-blur rounded-xl p-4 shadow-sm border border-border">
                <AssignedMaterialsTab 
                  orgId={orgId} 
                  onStartStudying={handleStartStudying}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default StudyMaterialsPage;
