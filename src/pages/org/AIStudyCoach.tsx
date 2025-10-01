import React from 'react';
import { Lightbulb, BookOpen, Target, Clock, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useAuth } from '@/hooks/useAuth';
import { MobilePageLayout, MobileSectionHeader } from '@/components/layout/MobilePageLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { EnhancedAIStudyCoach } from '@/components/chat/EnhancedAIStudyCoach';

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

  return (
    <MobilePageLayout className="min-h-screen">
      <MobileSectionHeader
        title="AI Study Coach"
        subtitle="Your personal learning companion and study guide"
      />

      <div className={`
        flex flex-col gap-4
        ${isMobile 
          ? 'pb-4' 
          : 'grid grid-cols-1 lg:grid-cols-3 gap-6'
        }
      `}>
        {/* Enhanced AI Study Coach with Socratic Mode */}
        <div className={`
          flex flex-col overflow-hidden
          ${isMobile 
            ? 'h-[70vh]' 
            : 'lg:col-span-2 h-[calc(100vh-12rem)]'
          }
        `}>
          <EnhancedAIStudyCoach
            userId={user?.id}
            orgId={currentOrg?.organization_id}
            chatMode="general"
            showHeader={true}
            fixedHeight={true}
          />
        </div>

        {/* Study Tips - Mobile Responsive */}
        <div className={`
          flex flex-col
          ${isMobile 
            ? 'max-h-[40vh] overflow-y-auto' 
            : 'space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto'
          }
        `}>
          <Card className={isMobile ? 'mobile-card' : ''}>
            <CardHeader className={isMobile ? 'mobile-card-compact' : ''}>
              <CardTitle className={`flex items-center space-x-2 ${isMobile ? 'mobile-heading-md' : ''}`}>
                <Lightbulb className={`${isMobile ? 'h-5 w-5' : 'h-5 w-5'}`} />
                <span className="mobile-safe-text">Study Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className={`${isMobile ? 'mobile-card-compact space-y-3' : 'space-y-4'}`}>
              {studyTips.map((tip) => (
                <div key={tip.id} className={`border rounded-lg mobile-safe-text ${isMobile ? 'p-3' : 'p-4'}`}>
                  <div className={`flex items-start ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
                    <div className={`bg-primary/10 rounded-lg ${isMobile ? 'p-1.5' : 'p-2'}`}>
                      <tip.icon className={`text-primary ${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center space-x-2 ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
                        <h4 className={`font-semibold mobile-safe-text ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {tip.title}
                        </h4>
                        {!isMobile && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${categoryColors[tip.category]}`}
                          >
                            {tip.category.replace('-', ' ')}
                          </Badge>
                        )}
                      </div>
                      <p className={`text-muted-foreground mobile-safe-text ${isMobile ? 'text-xs leading-tight' : 'text-xs'}`}>
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {!isMobile && (
            <Card>
              <CardHeader>
                <CardTitle>Learning Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Use the Structured Mode toggle to start a focused Socratic learning session with guided questions and progress tracking.</p>
                <p>Or continue with Free Chat mode for open-ended study support and questions.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MobilePageLayout>
  );
}