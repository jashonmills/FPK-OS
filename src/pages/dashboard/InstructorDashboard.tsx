import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Target, FileText, BarChart3, Plus } from 'lucide-react';
import { useOrganizations, useOrganization, useOrgMembers } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import { SUBSCRIPTION_TIERS } from '@/types/organization';
import StudentsTab from '@/components/instructor/StudentsTab';
import CoursesTab from '@/components/instructor/CoursesTab';
import GoalsTab from '@/components/instructor/GoalsTab';
import NotesTab from '@/components/instructor/NotesTab';
import AnalyticsTab from '@/components/instructor/AnalyticsTab';
import CreateOrganizationDialog from '@/components/instructor/CreateOrganizationDialog';

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
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{organization.name}</h1>
              <p className="text-muted-foreground mt-1">{organization.description}</p>
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
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
  );
}