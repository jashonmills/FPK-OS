import React, { useState } from 'react';
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
import { useOrgBranding } from '@/hooks/useOrgBranding';
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
  const { data: branding } = useOrgBranding(orgId);

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
  const bannerUrl = branding?.banner_url;

  return (
    <div className="pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Hero Banner with Org Info */}
        <div 
          className="relative rounded-xl overflow-hidden min-h-[180px] sm:min-h-[200px]"
          style={{
            backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.7) 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between h-full min-h-[180px] sm:min-h-[200px]">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                <OrgLogo size="lg" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{organization.name}</h1>
                <p className="text-white/80 text-sm sm:text-base mt-1 max-w-md">{organization.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="text-right">
                <Badge variant="secondary" className="mb-1 bg-white/20 text-white border-white/30">
                  {tierInfo.name} Plan
                </Badge>
                <div className="text-sm text-white/80">
                  {studentCount} / {organization.seat_cap} seats
                </div>
              </div>
              <div className="w-2 h-12 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="w-full bg-white transition-all duration-300"
                  style={{ 
                    height: `${Math.min((studentCount / organization.seat_cap) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* KPI Row - 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard 
            title="Active Students" 
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
            title="Goals Done" 
            value={statistics?.completedGoals?.toString() || '0'}
            icon={<Target className="h-5 w-5 text-emerald-600" />}
          />
        </div>

        {/* Tabs with pill style */}
        <div className="rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/10 p-4 sm:p-6">
          <Tabs defaultValue="students" className="w-full">
            {/* Pill-style tabs with horizontal scroll on mobile */}
            <div className="flex justify-center overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              <TabsList className="inline-flex h-12 items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1.5 shadow-lg border border-white/20 gap-1 whitespace-nowrap">
                <TabsTrigger 
                  value="students" 
                  className="rounded-full px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Students</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="courses" 
                  className="rounded-full px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Courses</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="goals" 
                  className="rounded-full px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md flex items-center gap-2"
                >
                  <Target className="h-4 w-4" />
                  <span className="hidden sm:inline">Goals</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="notes" 
                  className="rounded-full px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Notes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="rounded-full px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </div>

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
    </div>
  );
}
