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
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderManager } from './FolderManager';
import { useAICoachStudyMaterials } from '@/hooks/useAICoachStudyMaterials';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
          <Button variant="ghost" size="sm" className={cn(isMobile && "min-h-[44px] min-w-[44px]")}>
            <Paperclip className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn(
            "p-0 bg-background z-50",
            isMobile 
              ? "w-[calc(100vw-2rem)] max-h-[80vh]" 
              : "w-[500px]"
          )}
          side={isMobile ? "top" : "bottom"}
          align={isMobile ? "center" : "start"}
          sideOffset={isMobile ? 8 : 4}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={cn(
              "w-full grid grid-cols-2 rounded-none border-b",
              isMobile ? "h-12" : "h-10"
            )}>
              <TabsTrigger value="materials" className={isMobile ? "text-sm" : "text-sm"}>
                Study Materials
              </TabsTrigger>
              <TabsTrigger value="courses" className={isMobile ? "text-sm" : "text-sm"}>
                My Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="materials" className="p-4 m-0">
              <div className={cn(
                "flex gap-4",
                isMobile ? "flex-col" : "flex-row"
              )}>
                {/* Folder Navigation */}
                <div className={cn(
                  "flex-shrink-0",
                  isMobile ? "w-full" : "w-40"
                )}>
                  <FolderManager
                    folderType="study_material"
                    orgId={orgId}
                    selectedFolderId={selectedFolderId}
                    onSelectFolder={setSelectedFolderId}
                  />
                </div>

                {/* Materials List */}
                <ScrollArea className={cn(
                  "flex-1",
                  isMobile ? "max-h-[40vh]" : "max-h-[300px]"
                )}>
                  <div className="space-y-2 pr-4">
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
                            "rounded border cursor-pointer transition",
                            isMobile ? "p-3" : "p-2",
                            selectedMaterialIds.includes(material.id)
                              ? "bg-blue-50 border-blue-300"
                              : "hover:bg-gray-50"
                          )}
                        >
                          <p className={cn(
                            "font-medium",
                            isMobile ? "text-sm" : "text-sm"
                          )}>{material.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {material.file_type}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="p-4 m-0">
              <ScrollArea className={cn(
                isMobile ? "max-h-[60vh]" : "max-h-[350px]"
              )}>
                <div className={cn("space-y-2 pr-4", isMobile && "space-y-3")}>
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
                            "rounded-lg border cursor-pointer transition-all",
                            isMobile ? "p-4" : "p-3",
                            isSelected
                              ? "bg-blue-50 border-blue-400 shadow-sm"
                              : "hover:bg-gray-50 border-gray-200"
                          )}
                        >
                          <div className="flex gap-3">
                            {course.thumbnail_url && (
                              <div className={cn(
                                "rounded overflow-hidden flex-shrink-0 bg-gray-100",
                                isMobile ? "w-16 h-16" : "w-12 h-12"
                              )}>
                                <img
                                  src={course.thumbnail_url}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "font-semibold text-gray-900",
                                isMobile ? "text-base" : "text-sm"
                              )}>
                                {course.title}
                              </p>
                              {course.description && (
                                <p className={cn(
                                  "text-gray-600 mt-0.5",
                                  isMobile ? "text-sm line-clamp-2" : "text-xs line-clamp-1"
                                )}>
                                  {course.description}
                                </p>
                              )}
                              <div className={cn(
                                "flex items-center gap-2 mt-1",
                                isMobile ? "flex-col items-start gap-1" : "flex-row gap-3"
                              )}>
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
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
}
