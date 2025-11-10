import React, { useEffect, useState } from 'react';
import { Lightbulb, BookOpen, Target, Clock, Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useAuth } from '@/hooks/useAuth';
import { useOrgPermissions } from '@/hooks/useOrgPermissions';
import { MobilePageLayout, MobileSectionHeader } from '@/components/layout/MobilePageLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { AICoachCommandCenter } from '@/components/AICoachCommandCenter';
import { AdminAIAssistant } from '@/components/admin/AdminAIAssistant';
import { OrgNavigation } from '@/components/organizations/OrgNavigation';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';
import { DocumentReader } from '@/components/ai-coach/DocumentReader';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for standalone document reader (below chat module)
  const [activeDocument, setActiveDocument] = useState<any>(null);

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
        showMenuButton={isMobile}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <OrgNavigation 
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={setIsMobileMenuOpen}
      />

      <div className="flex flex-col gap-6 pb-4">
        {isAdmin ? (
          /* Admin AI Assistant */
          <AdminAIAssistant
            userId={user?.id}
            orgId={currentOrg?.organization_id}
          />
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
            <DocumentReader
              document={activeDocument}
              onClose={handleCloseDocumentViewer}
            />
          </div>
        </div>
      )}
          </>
        )}
      </div>
    </MobilePageLayout>
  );
}