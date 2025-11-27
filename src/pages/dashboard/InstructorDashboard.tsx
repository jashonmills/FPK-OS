import React, { useState } from 'react';
import PageShell from "@/components/dashboard/PageShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Target, FileText, BarChart3, Plus, TrendingUp, Clock } from 'lucide-react';
import { useOrganizations, useOrganization, useOrgMembers } from '@/hooks/useOrganization';
import { useOrgStatistics } from '@/hooks/useOrgStatistics';
import { useRealtimeOrgAnalytics } from '@/hooks/useRealtimeOrgAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import { SUBSCRIPTION_TIERS } from '@/types/organization';
import StudentsTab from '@/components/instructor/StudentsTab';
import CoursesTab from '@/components/instructor/CoursesTab';
import GoalsTab from '@/components/instructor/GoalsTab';
import NotesTab from '@/components/instructor/NotesTab';
import AnalyticsTab from '@/components/instructor/AnalyticsTab';
import CreateOrganizationDialog from '@/components/instructor/CreateOrganizationDialog';
import { OrgBanner } from '@/components/branding/OrgBanner';
import { OrgLogo } from '@/components/branding/OrgLogo';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const { data: organizations, isLoading } = useOrganizations();
  const [searchParams] = useSearchParams();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Get organization ID from URL params or find user's owned organization
  const orgIdFromUrl = searchParams.get('org');
  const ownedOrg = organizations?.find(org => org.owner_id === user?.id);
  const orgId = orgIdFromUrl || ownedOrg?.id || '';

  const { data: organization } = useOrganization(orgId);
  const { data: members } = useOrgMembers(orgId);
  const { data: statistics } = useOrgStatistics(orgId);
  const { analytics } = useRealtimeOrgAnalytics(orgId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your instructor dashboard...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <div className="mb-6">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Create Your Organization</h2>
            <p className="text-muted-foreground">
              Start managing students by creating your first organization.
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Create Organization
          </Button>
        </Card>
        
        <CreateOrganizationDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    );
  }

  const tierInfo = SUBSCRIPTION_TIERS[organization.plan];
  const studentCount = members?.filter(m => m.role === 'student' && m.status === 'active').length || 0;

  return (
    <PageShell>
      <div className="p-6">
        {/* Organization Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <OrgLogo size="lg" />
            <div>
              <h1 className="text-2xl font-semibold">{organization.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{organization.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <Badge variant="secondary" className="mb-1">
                {tierInfo.name} Plan
              </Badge>
              <div className="text-sm text-muted-foreground">
                {studentCount} / {organization.seat_cap} seats used
              </div>
            </div>
            <div className="w-2 h-12 bg-primary/20 rounded-full overflow-hidden">
              <div 
                className="w-full bg-primary transition-all duration-300"
                style={{ 
                  height: `${Math.min((studentCount / organization.seat_cap) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Branded Hero Section */}
        <OrgBanner className="rounded-lg min-h-[160px] mb-6" overlay={false} />

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <KpiCard 
            title="Active Students (7d)" 
            value={studentCount.toString()} 
            icon={<Users className="h-5 w-5 text-blue-600" />}
          />
          <KpiCard 
            title="Total Courses" 
            value={statistics?.totalCourses?.toString() || '0'} 
            icon={<BookOpen className="h-5 w-5 text-green-600" />}
          />
          <KpiCard 
            title="Avg Progress" 
            value={`${statistics?.averageProgress || 0}%`} 
            icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
          />
          <KpiCard 
            title="Learning Hours" 
            value={`${analytics?.totalLearningHours || 0}h`}
            icon={<Clock className="h-5 w-5 text-orange-600" />}
          />
          <KpiCard 
            title="Goals Completed" 
            value={statistics?.completedGoals?.toString() || '0'}
            icon={<Target className="h-5 w-5 text-emerald-600" />}
          />
        </div>

        {/* Tabs with translucent panel background */}
        <div className="rounded-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/10 p-4">
          <Tabs defaultValue="students" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Students
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students">
              <StudentsTab organizationId={orgId} />
            </TabsContent>

            <TabsContent value="courses">
              <CoursesTab organizationId={orgId} />
            </TabsContent>

            <TabsContent value="goals">
              <GoalsTab organizationId={orgId} />
            </TabsContent>

            <TabsContent value="notes">
              <NotesTab organizationId={orgId} />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsTab organizationId={orgId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageShell>
  );
}