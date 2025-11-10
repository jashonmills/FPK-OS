import React, { useState } from 'react';
import { Paperclip, X, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderManager } from './FolderManager';
import { useAICoachStudyMaterials } from '@/hooks/useAICoachStudyMaterials';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface AttachContextButtonProps {
  orgId?: string;
  selectedMaterialIds: string[];
  onMaterialsChange: (materialIds: string[]) => void;
  selectedCourseSlug?: string;
  onCourseChange?: (courseSlug: string | undefined) => void;
}

export function AttachContextButton({
  orgId,
  selectedMaterialIds,
  onMaterialsChange,
  selectedCourseSlug,
  onCourseChange
}: AttachContextButtonProps) {
  const { studyMaterials } = useAICoachStudyMaterials(orgId);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('materials');

  // Fetch enrolled courses
  const { data: enrolledCourses = [] } = useQuery({
    queryKey: ['enrolled-courses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Fetch enrollments
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('interactive_course_enrollments')
        .select('course_id, course_title, completion_percentage, last_accessed_at')
        .eq('user_id', user.id)
        .order('last_accessed_at', { ascending: false });

      if (enrollmentError) {
        console.error('Error fetching enrollments:', enrollmentError);
        return [];
      }

      if (!enrollments || enrollments.length === 0) return [];

      // Fetch course details separately
      const courseIds = enrollments.map(e => e.course_id);
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, slug, title, thumbnail_url, description')
        .in('id', courseIds);

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        return enrollments.map(e => ({ ...e, course: null }));
      }

      // Merge enrollments with course data
      return enrollments.map(enrollment => {
        const course = courses?.find(c => c.id === enrollment.course_id);
        return {
          ...enrollment,
          course
        };
      });
    },
    enabled: isOpen,
  });

  const filteredMaterials = selectedFolderId === null
    ? studyMaterials
    : studyMaterials.filter((m: any) => m.folder_id === selectedFolderId);

  const toggleMaterial = (materialId: string) => {
    if (selectedMaterialIds.includes(materialId)) {
      onMaterialsChange(selectedMaterialIds.filter(id => id !== materialId));
    } else {
      onMaterialsChange([...selectedMaterialIds, materialId]);
    }
  };

  const handleCourseSelect = (courseSlug: string) => {
    if (onCourseChange) {
      onCourseChange(selectedCourseSlug === courseSlug ? undefined : courseSlug);
    }
  };

  const getSelectedMaterials = () => {
    return studyMaterials.filter((m: any) => selectedMaterialIds.includes(m.id));
  };

  const getSelectedCourse = () => {
    if (!selectedCourseSlug) return null;
    return enrolledCourses.find((e: any) => e.course?.slug === selectedCourseSlug);
  };

  const selectedCourse = getSelectedCourse();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Selected Course Tag */}
      {selectedCourse && (
        <Badge variant="default" className="gap-1 bg-blue-600">
          <BookOpen className="w-3 h-3" />
          {selectedCourse.course?.title || selectedCourse.course_title}
          <button
            onClick={() => onCourseChange?.(undefined)}
            className="ml-1 hover:bg-blue-700 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      )}

      {/* Selected Materials Tags */}
      {getSelectedMaterials().map((material: any) => (
        <Badge key={material.id} variant="secondary" className="gap-1">
          {material.title}
          <button
            onClick={() => toggleMaterial(material.id)}
            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}

      {/* Attach Button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0 bg-background z-50" align="start">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
              <TabsTrigger value="materials">Study Materials</TabsTrigger>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="materials" className="p-4 m-0">
              <div className="flex gap-4">
                {/* Folder Navigation */}
                <div className="w-40 flex-shrink-0">
                  <FolderManager
                    folderType="study_material"
                    orgId={orgId}
                    selectedFolderId={selectedFolderId}
                    onSelectFolder={setSelectedFolderId}
                  />
                </div>

                {/* Materials List */}
                <div className="flex-1 max-h-[300px] overflow-y-auto space-y-2">
                  {filteredMaterials.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No study materials available
                    </p>
                  ) : (
                    filteredMaterials.map((material: any) => (
                      <div
                        key={material.id}
                        onClick={() => toggleMaterial(material.id)}
                        className={cn(
                          "p-2 rounded border cursor-pointer transition",
                          selectedMaterialIds.includes(material.id)
                            ? "bg-blue-50 border-blue-300"
                            : "hover:bg-gray-50"
                        )}
                      >
                        <p className="text-sm font-medium">{material.title}</p>
                        <p className="text-xs text-gray-500">
                          {material.file_type}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="p-4 m-0">
              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {enrolledCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No enrolled courses found
                  </p>
                ) : (
                  enrolledCourses.map((enrollment: any) => {
                    const course = enrollment.course;
                    if (!course) return null;
                    
                    const isSelected = selectedCourseSlug === course.slug;
                    
                    return (
                      <div
                        key={enrollment.course_id}
                        onClick={() => handleCourseSelect(course.slug)}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all",
                          isSelected
                            ? "bg-blue-50 border-blue-400 shadow-sm"
                            : "hover:bg-gray-50 border-gray-200"
                        )}
                      >
                        <div className="flex gap-3">
                          {course.thumbnail_url && (
                            <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                              <img
                                src={course.thumbnail_url}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {course.title}
                            </p>
                            {course.description && (
                              <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                                {course.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500">
                                {Math.round(enrollment.completion_percentage || 0)}% complete
                              </span>
                              {enrollment.last_accessed_at && (
                                <span className="text-xs text-gray-400">
                                  Last accessed {new Date(enrollment.last_accessed_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
}
