import React, { useEffect, useState } from 'react';
import { Lightbulb, BookOpen, Target, Clock, Brain, FileText, ClipboardList, LayoutDashboard, Wrench, Users, Activity, MessageSquare } from 'lucide-react';
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
import { CourseContentViewer } from '@/components/ai-coach/CourseContentViewer';
import { toast } from 'sonner';
import { shouldUseNewTeacherDashboard, shouldUseAILearningCoachV2 } from '@/lib/featureFlags';
import TeacherPanel, { type TeacherTabId } from '@/components/teacher/TeacherPanel';
import StudentPanel from '@/components/student/StudentPanel';
import { motion } from 'framer-motion';

export default function AIStudyCoach() {
  const { currentOrg } = useOrgContext();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { isOrgOwner, isOrgInstructor } = useOrgPermissions();
  const [isFreeChatAllowed, setIsFreeChatAllowed] = React.useState(true);
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'chat';

  // State for V2 dashboards
  const [teacherActiveTab, setTeacherActiveTab] = useState<TeacherTabId>('overview');
  const [studentActiveTab, setStudentActiveTab] = useState('overview');

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
  const orgId = currentOrg?.organization_id;

  // Fetch organization's Free Chat setting for students
  React.useEffect(() => {
    if (!isAdmin && orgId) {
      const fetchOrgSettings = async () => {
        const { data } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', orgId)
          .maybeSingle();
        
        if (data) {
          const orgData = data as any;
          setIsFreeChatAllowed(orgData.is_ai_free_chat_enabled ?? true);
        }
      };
      fetchOrgSettings();
    }
  }, [isAdmin, orgId]);

  // Teacher Dashboard V2 tabs
  const teacherTabs = [
    { id: 'overview' as TeacherTabId, label: 'Overview', icon: LayoutDashboard },
    { id: 'tools' as TeacherTabId, label: 'AI Tools', icon: Wrench },
    { id: 'students' as TeacherTabId, label: 'Students', icon: Users },
    { id: 'activity' as TeacherTabId, label: 'Activity', icon: Activity },
    { id: 'requests' as TeacherTabId, label: 'Requests', icon: MessageSquare },
  ];

  // Student Dashboard V2 tabs
  const studentTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'learning', label: 'Learning Tools', icon: BookOpen },
  ];

  // Render Teacher Dashboard V2
  const renderTeacherV2 = () => (
    <div className="bg-background pt-4">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
              <p className="text-muted-foreground text-sm">AI-powered tools for modern educators</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mt-6 -mb-px overflow-x-auto">
            {teacherTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = teacherActiveTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTeacherActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors rounded-t-lg whitespace-nowrap ${
                    isActive
                      ? 'text-primary bg-background border border-border border-b-background -mb-px'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTeacherTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={false}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TeacherPanel activeTab={teacherActiveTab} setActiveTab={setTeacherActiveTab} orgId={orgId} />
      </div>
    </div>
  );

  // Render Student Dashboard V2 (AI Learning Coach V2)
  const renderStudentV2 = () => (
    <div className="bg-background pt-4">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Learning Coach</h1>
                <p className="text-sm text-muted-foreground">Your personalized AI-powered learning assistant</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Tabs value={studentActiveTab} onValueChange={setStudentActiveTab}>
              <TabsList className="inline-flex h-12 items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1.5 shadow-lg border border-white/20 gap-1">
                {studentTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 pb-12">
        <StudentPanel activeTab={studentActiveTab} orgId={orgId} />
      </div>
    </div>
  );

  // Render Legacy Admin Interface
  const renderLegacyAdmin = () => (
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
              orgId={orgId}
            />
            
            {attachedMaterials.length > 0 && (
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Attached Study Materials
                  </h3>
                  <Badge variant="secondary">{attachedMaterials.length}</Badge>
                </div>
                
                {activeDocument && (
                  <div className="mb-4 border rounded-lg overflow-hidden">
                    {activeDocument.type === 'course' ? (
                      <CourseContentViewer
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
              orgId={orgId}
              onViewDocument={handleViewDocument}
              attachedMaterialIds={attachedMaterialIds}
              onAttachToChat={handleAttachToChat}
            />
            
            {activeDocument && (
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Document Preview</h3>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  {activeDocument.type === 'course' ? (
                    <CourseContentViewer
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
              orgId={orgId}
              onViewDocument={handleViewDocument}
            />
            
            {activeDocument && (
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Assignment Material Preview</h3>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  {activeDocument.type === 'course' ? (
                    <CourseContentViewer
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
  );

  // Render Legacy Student Interface
  const renderLegacyStudent = () => (
    <>
      <AICoachCommandCenter
        isFreeChatAllowed={isFreeChatAllowed}
        orgId={orgId}
        orgName={currentOrg?.organizations?.name}
        initialTab={initialTab}
        onViewDocument={handleViewDocument}
      />
      
      {activeDocument && (
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="h-[600px]">
            {activeDocument.type === 'course' ? (
              <CourseContentViewer
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
  );

  return (
    <MobilePageLayout className="min-h-screen">
      {/* Only show header for legacy views */}
      {!(isAdmin && shouldUseNewTeacherDashboard()) && !(!isAdmin && shouldUseAILearningCoachV2()) && (
        <MobileSectionHeader
          title={isAdmin ? "AI Assistant" : "AI Study Coach"}
          subtitle={isAdmin 
            ? "Your administrative and educational support tool" 
            : "Your personal learning companion and study guide"}
          helpSection="ai-assistant"
        />
      )}

      <div className="flex flex-col gap-6 pb-4">
        {isAdmin ? (
          shouldUseNewTeacherDashboard() ? renderTeacherV2() : renderLegacyAdmin()
        ) : (
          shouldUseAILearningCoachV2() ? renderStudentV2() : renderLegacyStudent()
        )}
      </div>
    </MobilePageLayout>
  );
}
