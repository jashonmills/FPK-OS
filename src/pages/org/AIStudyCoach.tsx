import React, { useEffect, useState } from 'react';
import { Lightbulb, BookOpen, Target, Clock, Brain, FileText, ClipboardList } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useAuth } from '@/hooks/useAuth';
import { useOrgPermissions } from '@/hooks/useOrgPermissions';
import { MobilePageLayout, MobileSectionHeader } from '@/components/layout/MobilePageLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { AICoachCommandCenter } from '@/components/AICoachCommandCenter';
import { AdminAIAssistant } from '@/components/admin/AdminAIAssistant';
import { MaterialsSubTab } from '@/components/ai-coach/MaterialsSubTab';
import { AssignmentsManagementTab } from '@/components/ai-coach/AssignmentsManagementTab';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';
import { DocumentReader } from '@/components/ai-coach/DocumentReader';
import { CourseTextViewer } from '@/components/ai-coach/CourseTextViewer';
import { toast } from 'sonner';

interface StudyTip {
  id: string;
  title: string;
  description: string;
  category: 'focus' | 'time-management' | 'memory' | 'motivation';
  icon: React.ComponentType<{ className?: string }>;
}

const studyTips: StudyTip[] = [
  {
    id: '1',
    title: 'Pomodoro Technique',
    description: 'Study for 25 minutes, then take a 5-minute break to maintain focus.',
    category: 'time-management',
    icon: Clock
  },
  {
    id: '2',
    title: 'Active Recall',
    description: 'Test yourself on the material without looking at your notes.',
    category: 'memory',
    icon: Brain
  },
  {
    id: '3',
    title: 'Goal Setting',
    description: 'Break down large topics into smaller, achievable learning goals.',
    category: 'motivation',
    icon: Target
  },
  {
    id: '4',
    title: 'Spaced Repetition',
    description: 'Review material at increasing intervals to improve retention.',
    category: 'memory',
    icon: BookOpen
  }
];

const categoryColors = {
  'focus': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'time-management': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'memory': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'motivation': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
};

export default function AIStudyCoach() {
  const { currentOrg } = useOrgContext();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { isOrgOwner, isOrgInstructor } = useOrgPermissions();
  const [isFreeChatAllowed, setIsFreeChatAllowed] = React.useState(true);
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'chat';

  // State for standalone document reader (below chat module)
  const [activeDocument, setActiveDocument] = useState<any>(null);
  
  // State for attached materials in AI Assistant
  const [attachedMaterialIds, setAttachedMaterialIds] = useState<string[]>([]);
  const [attachedMaterials, setAttachedMaterials] = useState<any[]>([]);

  // Handler to open document viewer
  const handleViewDocument = (material: any) => {
    console.log('[AIStudyCoach] Opening document viewer:', material.title);
    setActiveDocument(material);
    toast.success(`Now viewing: ${material.title}`);
  };

  // Handler to close document viewer
  const handleCloseDocumentViewer = () => {
    console.log('[AIStudyCoach] Closing document viewer');
    setActiveDocument(null);
  };

  // Handler to attach/detach materials to AI Assistant
  const handleAttachToChat = async (materialId: string) => {
    console.log('[AIStudyCoach] Toggle attach material:', materialId);
    
    if (attachedMaterialIds.includes(materialId)) {
      // Remove from attached
      setAttachedMaterialIds(prev => prev.filter(id => id !== materialId));
      setAttachedMaterials(prev => prev.filter(m => m.id !== materialId));
      toast.success('Material detached from AI Assistant');
    } else {
      // Add to attached - fetch full material details
      const { data } = await supabase
        .from('ai_coach_study_materials')
        .select('*')
        .eq('id', materialId)
        .single();
      
      if (data) {
        setAttachedMaterialIds(prev => [...prev, materialId]);
        setAttachedMaterials(prev => [...prev, data]);
        toast.success('Material attached to AI Assistant');
      }
    }
  };

  // Check if user is admin (owner or instructor)
  const isAdmin = isOrgOwner() || isOrgInstructor();

  // Fetch organization's Free Chat setting for students
  React.useEffect(() => {
    if (!isAdmin && currentOrg?.organization_id) {
      const fetchOrgSettings = async () => {
        const { data } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', currentOrg.organization_id)
          .maybeSingle();
        
        if (data) {
          // Use type assertion to access the new column
          const orgData = data as any;
          setIsFreeChatAllowed(orgData.is_ai_free_chat_enabled ?? true);
        }
      };
      fetchOrgSettings();
    }
  }, [isAdmin, currentOrg]);

  return (
    <MobilePageLayout className="min-h-screen">
      <MobileSectionHeader
        title={isAdmin ? "AI Assistant" : "AI Study Coach"}
        subtitle={isAdmin 
          ? "Your administrative and educational support tool" 
          : "Your personal learning companion and study guide"}
        helpSection="ai-assistant"
      />

      <div className="flex flex-col gap-6 pb-4">
        {isAdmin ? (
          /* Educator AI Command Center - Tabbed Interface */
          <Card className="w-full max-w-7xl mx-auto">
            <CardContent className="pt-6">
              <Tabs defaultValue={initialTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="chat">
                    <Brain className="w-4 h-4 mr-2" />
                    AI Assistant
                  </TabsTrigger>
                  <TabsTrigger value="materials">
                    <FileText className="w-4 h-4 mr-2" />
                    Study Materials
                  </TabsTrigger>
                  <TabsTrigger value="assignments">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Assignments
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat">
                  <AdminAIAssistant
                    userId={user?.id}
                    orgId={currentOrg?.organization_id}
                  />
                  
                  {/* Attached Materials Section - Below AI Chat */}
                  {attachedMaterials.length > 0 && (
                    <div className="mt-6 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Attached Study Materials
                        </h3>
                        <Badge variant="secondary">{attachedMaterials.length}</Badge>
                      </div>
                      
                      {/* Document Preview for Attached Materials */}
                      {activeDocument && (
                        <div className="mb-4 border rounded-lg overflow-hidden">
                          {activeDocument.type === 'course' ? (
                            <CourseTextViewer
                              course={activeDocument}
                              onClose={handleCloseDocumentViewer}
                            />
                          ) : (
                            <DocumentReader 
                              document={activeDocument} 
                              onClose={handleCloseDocumentViewer} 
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="materials">
                  <MaterialsSubTab 
                    orgId={currentOrg?.organization_id}
                    onViewDocument={handleViewDocument}
                    attachedMaterialIds={attachedMaterialIds}
                    onAttachToChat={handleAttachToChat}
                  />
                  
                  {/* Document Preview - Below Materials List */}
                  {activeDocument && (
                    <div className="mt-6 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Document Preview</h3>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        {activeDocument.type === 'course' ? (
                          <CourseTextViewer
                            course={activeDocument}
                            onClose={handleCloseDocumentViewer}
                          />
                        ) : (
                          <DocumentReader 
                            document={activeDocument} 
                            onClose={handleCloseDocumentViewer} 
                          />
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="assignments">
                  <AssignmentsManagementTab 
                    orgId={currentOrg?.organization_id}
                    onViewDocument={handleViewDocument}
                  />
                  
                  {/* Document Preview - Below Assignments List */}
                  {activeDocument && (
                    <div className="mt-6 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Assignment Material Preview</h3>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        {activeDocument.type === 'course' ? (
                          <CourseTextViewer
                            course={activeDocument}
                            onClose={handleCloseDocumentViewer}
                          />
                        ) : (
                          <DocumentReader 
                            document={activeDocument} 
                            onClose={handleCloseDocumentViewer} 
                          />
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Student AI Command Center - with org context */}
            <AICoachCommandCenter
              isFreeChatAllowed={isFreeChatAllowed}
              orgId={currentOrg?.organization_id}
              orgName={currentOrg?.organizations?.name}
              initialTab={initialTab}
              onViewDocument={handleViewDocument}
            />
            
      {/* Standalone Document Reader - Below Chat Module */}
      {activeDocument && (
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="h-[600px]">
            {activeDocument.type === 'course' ? (
              <CourseTextViewer
                course={activeDocument}
                onClose={handleCloseDocumentViewer}
              />
            ) : (
              <DocumentReader
                document={activeDocument}
                onClose={handleCloseDocumentViewer}
              />
            )}
          </div>
        </div>
      )}
          </>
        )}
      </div>
    </MobilePageLayout>
  );
}