import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useOrganizationCourseAssignments } from '@/hooks/useOrganizationCourseAssignments';
import type { AssignmentSummary } from '@/types/enhanced-course-card';

export interface CourseActionsConfig {
  onCourseCreated?: (course: any) => void;
  onCourseEdited?: (courseId: string) => void;
  onCourseDeleted?: (courseId: string) => void;
}

export function useCourseActions(config: CourseActionsConfig = {}) {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { toast } = useToast();
  const { assignCourse } = useOrganizationCourseAssignments(orgId);

  const preview = useCallback((courseId: string, route?: string) => {
    console.log('Preview course:', courseId);
    if (route) {
      window.open(route, '_blank');
    } else {
      toast({
        title: "Course Preview",
        description: "Opening course preview...",
      });
    }
  }, [toast]);

  const assign = useCallback(async (courseId: string, options?: { groups?: string[]; students?: string[] }) => {
    try {
      await assignCourse(courseId);
      toast({
        title: "Course Assigned",
        description: "Course has been assigned successfully.",
      });
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "Failed to assign course. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [assignCourse, toast]);

  const edit = useCallback((courseId: string) => {
    console.log('Edit course:', courseId);
    if (config.onCourseEdited) {
      config.onCourseEdited(courseId);
    } else {
      toast({
        title: "Edit Course",
        description: "Opening course editor...",
      });
    }
  }, [config, toast]);

  const duplicate = useCallback(async (courseId: string) => {
    console.log('Duplicate to org:', courseId);
    // TODO: Implement actual duplication logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Course Duplicated",
      description: "Cloned to your organization. Opening editor with attribution banner...",
    });
    
    // Navigate to edit with cloned flag
    if (orgId) {
      navigate(`/org/${orgId}/courses/edit/${courseId}?cloned=true`);
    }
  }, [navigate, orgId, toast]);

  const publish = useCallback(async (courseId: string): Promise<AssignmentSummary> => {
    console.log('Publishing course:', courseId);
    // TODO: Implement actual publish logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const impact = { groupCount: 0, studentCount: 0 };
    toast({
      title: "Course Published",
      description: `Published successfully. Impact: ${impact.groupCount} groups, ${impact.studentCount} students.`,
    });
    return impact;
  }, [toast]);

  const unpublish = useCallback(async (courseId: string): Promise<AssignmentSummary> => {
    console.log('Unpublishing course:', courseId);
    // TODO: Implement actual unpublish logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const impact = { groupCount: 0, studentCount: 0 };
    toast({
      title: "Course Unpublished",
      description: "Unpublished—students keep access until end of day.",
    });
    return impact;
  }, [toast]);

  const remove = useCallback(async (courseId: string): Promise<AssignmentSummary> => {
    console.log('Deleting course:', courseId);
    // TODO: Implement actual delete logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const impact = { groupCount: 0, studentCount: 0 };
    toast({
      title: "Course Deleted",
      description: "Course deleted. Analytics retained.",
    });
    
    if (config.onCourseDeleted) {
      config.onCourseDeleted(courseId);
    }
    
    return impact;
  }, [config, toast]);

  const viewAnalytics = useCallback((courseId: string) => {
    console.log('View analytics:', courseId);
    if (orgId) {
      navigate(`/org/${orgId}/analytics/courses/${courseId}`);
    } else {
      toast({
        title: "Analytics",
        description: "Opening course analytics...",
      });
    }
  }, [navigate, orgId, toast]);

  const sharePreview = useCallback(async (courseId: string) => {
    console.log('Share preview:', courseId);
    // TODO: Generate actual preview link
    const previewLink = `${window.location.origin}/preview/${courseId}`;
    
    try {
      await navigator.clipboard.writeText(previewLink);
      toast({
        title: "Preview Link Copied",
        description: "Preview link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Preview Link Generated",
        description: previewLink,
      });
    }
  }, [toast]);

  const addToCollection = useCallback((courseId: string) => {
    console.log('Add to collection:', courseId);
    toast({
      title: "Add to Collection",
      description: "Collection selection modal would open...",
    });
  }, [toast]);

  return {
    preview,
    assign,
    edit,
    duplicate,
    publish,
    unpublish,
    remove,
    viewAnalytics,
    sharePreview,
    addToCollection,
  };
}