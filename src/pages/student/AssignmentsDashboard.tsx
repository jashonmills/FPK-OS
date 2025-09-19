import React from 'react';
import { useStudentAssignments } from '@/hooks/useStudentAssignments';
import { StudentAssignmentCard } from '@/components/assignments/StudentAssignmentCard';
import { AssignmentStats } from '@/components/assignments/AssignmentStats';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

// Keep using the existing StudentAssignment interface but pass through the original assignments
export default function AssignmentsDashboard() {
  const { currentOrg } = useOrgContext();
  const { assignments, isLoading } = useStudentAssignments(currentOrg?.organization_id);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading assignments...</div>
      </div>
    );
  }

  // Work with the original assignment structure
  const activeAssignments = assignments.filter(a => a.target?.status !== 'completed');
  const completedAssignments = assignments.filter(a => a.target?.status === 'completed');
  const overdueAssignments = assignments.filter(a => {
    const dueDate = a.metadata?.due_date ? new Date(a.metadata.due_date) : null;
    return dueDate && dueDate < new Date() && a.target?.status !== 'completed';
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Assignments</h1>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {overdueAssignments.length} Overdue
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {activeAssignments.length} Active
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            {completedAssignments.length} Completed
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({activeAssignments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedAssignments.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueAssignments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeAssignments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Assignments</h3>
                <p className="text-muted-foreground">You're all caught up! Check back later for new assignments.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeAssignments.map((assignment) => (
                <StudentAssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAssignments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Completed Assignments</h3>
                <p className="text-muted-foreground">Complete some assignments to see them here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {completedAssignments.map((assignment) => (
                <StudentAssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {overdueAssignments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Overdue Assignments</h3>
                <p className="text-muted-foreground">Great job staying on top of your assignments!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {overdueAssignments.map((assignment) => (
                <StudentAssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}