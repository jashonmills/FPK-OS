import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useOrganizationCourseAssignments } from '@/hooks/useOrganizationCourseAssignments';
import { useCourseDuplication } from '@/hooks/useCourseDuplication';
import { useContextAwareNavigation } from '@/hooks/useContextAwareNavigation';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
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
  const { duplicateCourse } = useCourseDuplication(orgId);
  const { goToCoursePreview, goToCourse } = useContextAwareNavigation();
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{ id: string; title: string } | null>(null);

  const preview = useCallback((courseId: string, route?: string) => {
    logger.courses.debug('Preview course', { courseId });
    goToCoursePreview(courseId);
  }, [goToCoursePreview]);

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
    logger.courses.debug('Edit course', { courseId });
    if (config.onCourseEdited) {
      config.onCourseEdited(courseId);
    } else {
      toast({
        title: "Edit Course",
        description: "Opening course editor...",
      });
    }
  }, [config, toast]);

  const duplicate = useCallback(async (courseId: string, courseTitle?: string) => {
    try {
      await duplicateCourse.mutateAsync({ 
        courseId, 
        title: courseTitle,
        attribution: {
          source: 'platform',
          cloned_from: courseId,
          cloned_at: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.courses.error('Course duplication failed', { courseId, error });
    }
  }, [duplicateCourse]);

  const publish = useCallback(async (courseId: string): Promise<AssignmentSummary> => {
    logger.courses.info('Publishing course', { courseId });
    
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: 'published' })
        .eq('id', courseId);
      
      if (error) throw error;
      
      // Count affected students
      const { count: studentCount } = await supabase
        .from('interactive_course_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId);
      
      const impact = { groupCount: 0, studentCount: studentCount || 0 };
      
      toast({
        title: "Course Published",
        description: studentCount ? `Published successfully. ${studentCount} students enrolled.` : "Published successfully.",
      });
      
      return impact;
    } catch (error) {
      logger.courses.error('Failed to publish course', { courseId, error });
      toast({
        title: "Publish Failed",
        description: "Failed to publish course. Please try again.",
        variant: "destructive",
      });
      return { groupCount: 0, studentCount: 0 };
    }
  }, [toast]);

  const unpublish = useCallback(async (courseId: string): Promise<AssignmentSummary> => {
    logger.courses.info('Unpublishing course', { courseId });
    
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: 'draft' })
        .eq('id', courseId);
      
      if (error) throw error;
      
      // Count affected students for impact summary
      const { count: studentCount } = await supabase
        .from('interactive_course_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId);
      
      const impact = { groupCount: 0, studentCount: studentCount || 0 };
      
      toast({
        title: "Course Unpublished",
        description: "Unpublished—students keep access until end of day.",
      });
      
      return impact;
    } catch (error) {
      logger.courses.error('Failed to unpublish course', { courseId, error });
      toast({
        title: "Unpublish Failed",
        description: "Failed to unpublish course. Please try again.",
        variant: "destructive",
      });
      return { groupCount: 0, studentCount: 0 };
    }
  }, [toast]);

  const remove = useCallback(async (courseId: string): Promise<AssignmentSummary> => {
    logger.courses.info('Deleting course (soft delete)', { courseId });
    
    try {
      // Soft delete: set status to 'deleted' to preserve analytics
      const { error } = await supabase
        .from('courses')
        .update({ status: 'deleted' })
        .eq('id', courseId);
      
      if (error) throw error;
      
      // Count affected students for impact summary
      const { count: studentCount } = await supabase
        .from('interactive_course_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId);
      
      const impact = { groupCount: 0, studentCount: studentCount || 0 };
      
      toast({
        title: "Course Deleted",
        description: "Course deleted. Analytics retained.",
      });
      
      if (config.onCourseDeleted) {
        config.onCourseDeleted(courseId);
      }
      
      return impact;
    } catch (error) {
      logger.courses.error('Failed to delete course', { courseId, error });
      toast({
        title: "Delete Failed",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      });
      return { groupCount: 0, studentCount: 0 };
    }
  }, [config, toast]);

  const viewAnalytics = useCallback((courseId: string) => {
    logger.courses.debug('View course analytics', { courseId, orgId });
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
    logger.courses.debug('Share course preview', { courseId });
    const previewLink = `${window.location.origin}/courses/player/${courseId}`;
    
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

  const addToCollection = useCallback((courseId: string, courseTitle?: string) => {
    setSelectedCourse({ id: courseId, title: courseTitle || 'Unknown Course' });
    setShowCollectionModal(true);
  }, []);

  const assignToStudents = useCallback((courseId: string, courseTitle?: string) => {
    setSelectedCourse({ id: courseId, title: courseTitle || 'Unknown Course' });
    setShowAssignmentModal(true);
  }, []);

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

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
    assignToStudents,
    // Modal state
    showCollectionModal,
    setShowCollectionModal,
    showAssignmentModal,
    setShowAssignmentModal,
    selectedCourse,
  };
}