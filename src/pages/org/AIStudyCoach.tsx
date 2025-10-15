import React from 'react';
import { Lightbulb, BookOpen, Target, Clock, Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useAuth } from '@/hooks/useAuth';
import { useOrgPermissions } from '@/hooks/useOrgPermissions';
import { MobilePageLayout, MobileSectionHeader } from '@/components/layout/MobilePageLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { EnhancedAIStudyCoach } from '@/components/chat/EnhancedAIStudyCoach';
import { AdminAIAssistant } from '@/components/admin/AdminAIAssistant';
import { supabase } from '@/integrations/supabase/client';

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
          /* Admin AI Assistant */
          <AdminAIAssistant
            userId={user?.id}
            orgId={currentOrg?.organization_id}
          />
        ) : (
          <>
            {/* Study Tips - Responsive Grid for Students */}
            <div className="w-full">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Study Tips</h3>
          </div>
          <div className={`
            grid gap-4
            ${isMobile 
              ? 'grid-cols-1' 
              : 'grid-cols-2 lg:grid-cols-4'
            }
          `}>
            {studyTips.map((tip) => (
              <Card 
                key={tip.id} 
                className="flex-1"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 rounded-lg p-2 flex-shrink-0">
                      <tip.icon className="text-primary h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="font-semibold text-sm">
                          {tip.title}
                        </h4>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${categoryColors[tip.category]}`}
                        >
                          {tip.category.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced AI Study Coach - Full Width */}
        <div className="flex flex-col min-h-[600px] h-[calc(100vh-16rem)] max-w-7xl mx-auto w-full px-2 sm:px-4">
          <EnhancedAIStudyCoach
            userId={user?.id}
            orgId={currentOrg?.organization_id}
            chatMode="general"
            showHeader={true}
            fixedHeight={true}
            isFreeChatAllowed={isFreeChatAllowed}
          />
            </div>
          </>
        )}
      </div>
    </MobilePageLayout>
  );
}