import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOrgCatalog } from '@/hooks/useOrgCatalog';
import { useOrgGroupCourseAssignments } from '@/hooks/useOrgGroupCourseAssignments';
import { Card } from '@/components/ui/card';
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface GroupCourseAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
}

export function GroupCourseAssignmentDialog({
  open,
  onOpenChange,
  groupId,
  groupName,
}: GroupCourseAssignmentDialogProps) {
  const { platformCourses, orgCourses, isLoading: catalogLoading } = useOrgCatalog();
  const { groupCourses, assignCourseToGroup, isAssigning } = useOrgGroupCourseAssignments(groupId);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const availableCourses = [...platformCourses, ...orgCourses];
  const assignedCourseIds = new Set(groupCourses.map(gc => gc.course_id));

  const handleAssign = () => {
    if (!selectedCourse) return;
    
    assignCourseToGroup(
      { groupId, courseId: selectedCourse },
      {
        onSuccess: () => {
          setSelectedCourse(null);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Course to {groupName}</DialogTitle>
          <DialogDescription>
            Select a course to assign to all members of this group. Members will automatically receive this course assignment.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-2">
            {catalogLoading ? (
              <p className="text-sm text-muted-foreground">Loading courses...</p>
            ) : availableCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No courses available</p>
            ) : (
              availableCourses.map((course) => {
                const isAssigned = assignedCourseIds.has(course.id);
                const isSelected = selectedCourse === course.id;

                return (
                  <Card
                    key={course.id}
                    className={`p-3 cursor-pointer transition-colors ${
                      isAssigned
                        ? 'opacity-50 cursor-not-allowed bg-muted'
                        : isSelected
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => {
                      if (!isAssigned) {
                        setSelectedCourse(isSelected ? null : course.id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isAssigned ? (
                          <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {course.title}
                          {isAssigned && (
                            <span className="ml-2 text-xs text-muted-foreground">(Already Assigned)</span>
                          )}
                        </h4>
                        {course.description && (
                          <p className="text-xs text-muted-foreground mt-1">{course.description}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedCourse || isAssigning}
          >
            {isAssigning ? 'Assigning...' : 'Assign Course'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
