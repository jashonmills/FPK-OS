import React, { useState } from 'react';
import { ClipboardList, Users, Calendar, BarChart3, Trash2, Eye, MoreVertical, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useOrgAssignments } from '@/hooks/useOrgAssignments';
import { useAssignmentTargetCounts } from '@/hooks/useAssignmentTargetCounts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AssignmentsManagementTabProps {
  orgId?: string;
  onViewDocument?: (material: any) => void;
}

export function AssignmentsManagementTab({ orgId, onViewDocument }: AssignmentsManagementTabProps) {
  const { assignments, isLoading, deleteAssignment, isDeleting } = useOrgAssignments();
  const { getCountsForAssignment } = useAssignmentTargetCounts();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter for study material assignments
  const studyMaterialAssignments = assignments.filter(a => a.type === 'study_material');

  // Calculate summary stats
  const totalAssignments = studyMaterialAssignments.length;
  const activeAssignments = studyMaterialAssignments.filter(a => {
    const counts = getCountsForAssignment(a.id);
    return counts.pending_count > 0 || counts.started_count > 0;
  }).length;
  
  const dueThisWeek = studyMaterialAssignments.filter(a => {
    if (!a.metadata?.due_date) return false;
    const dueDate = new Date(a.metadata.due_date);
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return dueDate <= weekFromNow && dueDate >= new Date();
  }).length;

  const totalCompletions = studyMaterialAssignments.reduce((sum, a) => {
    const counts = getCountsForAssignment(a.id);
    return sum + counts.completed_count;
  }, 0);

  const avgCompletion = totalAssignments > 0
    ? Math.round((totalCompletions / studyMaterialAssignments.reduce((sum, a) => {
        const counts = getCountsForAssignment(a.id);
        return sum + counts.total_targets;
      }, 0)) * 100)
    : 0;

  const handleDeleteAssignment = (assignmentId: string) => {
    deleteAssignment(assignmentId);
    setDeleteConfirmId(null);
  };

  const handleViewMaterial = async (resourceId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_coach_study_materials')
        .select('*')
        .eq('id', resourceId)
        .single();
      
      if (error) throw error;
      
      if (data && onViewDocument) {
        onViewDocument(data);
        toast.success('Opening material preview');
      }
    } catch (error) {
      console.error('[AssignmentsManagementTab] Error fetching material:', error);
      toast.error('Failed to load material preview');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
            <p className="text-xs text-muted-foreground">Study materials assigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAssignments}</div>
            <p className="text-xs text-muted-foreground">With pending work</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dueThisWeek}</div>
            <p className="text-xs text-muted-foreground">Upcoming deadlines</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletion}%</div>
            <p className="text-xs text-muted-foreground">Overall progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Assignment List */}
      {studyMaterialAssignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Assignments Yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Create your first assignment by going to the "Study Materials" tab and clicking "Assign to Students" on any material.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {studyMaterialAssignments.map((assignment) => {
              const counts = getCountsForAssignment(assignment.id);
              const metadata = assignment.metadata || {};
              const dueDate = metadata.due_date ? new Date(metadata.due_date) : null;
              const isOverdue = dueDate && dueDate < new Date();

              return (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {metadata.ai_instructions && (
                            <span className="text-sm line-clamp-2">
                              <strong>AI Instructions:</strong> {metadata.ai_instructions}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewMaterial(assignment.resource_id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Material
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteConfirmId(assignment.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Assignment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 items-center">
                      {/* Due Date */}
                      {dueDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className={`text-sm ${isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                            Due: {format(dueDate, 'MMM d, yyyy')}
                            {isOverdue && ' (Overdue)'}
                          </span>
                        </div>
                      )}

                      {/* Student Count */}
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {counts.total_targets} {counts.total_targets === 1 ? 'student' : 'students'}
                        </span>
                      </div>

                      {/* Status Badges */}
                      <div className="flex gap-2 ml-auto">
                        {counts.pending_count > 0 && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            {counts.pending_count} pending
                          </Badge>
                        )}
                        {counts.started_count > 0 && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {counts.started_count} in progress
                          </Badge>
                        )}
                        {counts.completed_count > 0 && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {counts.completed_count} completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this assignment and remove it from all assigned students. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDeleteAssignment(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Assignment'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
