import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useStudentAssignments } from '@/hooks/useStudentAssignments';
import { useAssignmentActions } from '@/hooks/useAssignmentActions';
import { StudentAssignmentCard } from '@/components/assignments/StudentAssignmentCard';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { Search, BookOpen, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AssignmentsDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentOrg } = useOrgContext();
  const { assignments, isLoading } = useStudentAssignments(currentOrg?.organization_id);
  const { startAssignment } = useAssignmentActions();

  // Filter assignments based on search query
  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.metadata?.course_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Categorize assignments
  const pendingAssignments = filteredAssignments.filter(a => a.target.status === 'pending');
  const inProgressAssignments = filteredAssignments.filter(a => a.target.status === 'started');
  const completedAssignments = filteredAssignments.filter(a => a.target.status === 'completed');
  const overdueAssignments = filteredAssignments.filter(a => {
    const dueDate = a.metadata?.due_date ? new Date(a.metadata.due_date) : null;
    return dueDate && dueDate < new Date() && a.target.status !== 'completed';
  });

  const handleStartAssignment = (assignmentId: string) => {
    startAssignment(assignmentId);
  };

  const handleContinueAssignment = (assignmentId: string) => {
    // Navigate to the course or assignment content
    console.log('Continue assignment:', assignmentId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading assignments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Assignments</h1>
          <p className="text-muted-foreground">
            Track and complete your assigned courses and activities
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedAssignments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueAssignments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search assignments..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Assignments Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingAssignments.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {pendingAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="relative">
            In Progress
            {inProgressAssignments.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {inProgressAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="relative">
            Completed
            {completedAssignments.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {completedAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="overdue" className="relative">
            Overdue
            {overdueAssignments.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {overdueAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">No pending assignments</h3>
                <p className="text-muted-foreground text-center">
                  Great job! You don't have any pending assignments right now.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingAssignments.map((assignment) => (
                <StudentAssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onStart={handleStartAssignment}
                  onContinue={handleContinueAssignment}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">No assignments in progress</h3>
                <p className="text-muted-foreground text-center">
                  Start working on your pending assignments to see them here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {inProgressAssignments.map((assignment) => (
                <StudentAssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onStart={handleStartAssignment}
                  onContinue={handleContinueAssignment}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">No completed assignments</h3>
                <p className="text-muted-foreground text-center">
                  Complete some assignments to see your achievements here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completedAssignments.map((assignment) => (
                <StudentAssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onStart={handleStartAssignment}
                  onContinue={handleContinueAssignment}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {overdueAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="font-medium text-lg mb-2">No overdue assignments</h3>
                <p className="text-muted-foreground text-center">
                  Excellent! You're keeping up with all your deadlines.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {overdueAssignments.map((assignment) => (
                <StudentAssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onStart={handleStartAssignment}
                  onContinue={handleContinueAssignment}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}