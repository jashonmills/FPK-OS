import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { PlatformCourse } from '@/hooks/usePlatformCourses';
import type { Course } from '@/hooks/useCourses';
import { groupCoursesByHierarchy } from '@/hooks/usePlatformCourses';
import { StyledCourseCard } from '@/components/common/StyledCourseCard';

// Union type to accept both PlatformCourse and Course
type DisplayCourse = PlatformCourse | Course;

interface Props {
  courses: DisplayCourse[];
  onEnroll: (courseId: string) => void;
  enrollingCourseIds?: Set<string>;
}

export function HierarchicalCourseCatalog({ courses, onEnroll, enrollingCourseIds = new Set() }: Props) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set(['Senior Cycle']));
  const [expandedGrades, setExpandedGrades] = useState<Set<number>>(new Set());
  
  const hierarchy = groupCoursesByHierarchy(courses as PlatformCourse[]);
  const specialCourses = courses.filter(c => !('grade_level_id' in c) || c.grade_level_id == null);
  
  const toggleStage = (stage: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(stage)) next.delete(stage);
      else next.add(stage);
      return next;
    });
  };
  
  const toggleGrade = (gradeId: number) => {
    setExpandedGrades(prev => {
      const next = new Set(prev);
      if (next.has(gradeId)) next.delete(gradeId);
      else next.add(gradeId);
      return next;
    });
  };
  
  const renderCourseCard = (course: DisplayCourse) => {
    // Derive course type from grade level and subject
    const getCourseType = () => {
      if ('grade_level' in course && course.grade_level) {
        const gradeName = course.grade_level.us_name || course.grade_level.irish_name;
        return course.subject ? `${gradeName} - ${course.subject}` : gradeName;
      }
      return 'K-12 Course';
    };
    
    return (
      <StyledCourseCard
        key={course.id}
        id={course.id}
        title={course.title}
        description={course.description || ''}
        courseType={getCourseType()}
        isEnrolled={false}
        duration={course.duration_minutes}
        instructor="FPK University"
        thumbnail_url={course.thumbnail_url}
        onEnroll={() => onEnroll(course.id)}
        isEnrolling={enrollingCourseIds.has(course.id)}
      />
    );
  };
  
  return (
    <div className="space-y-8">
      {/* Life Skills Collection (Special) */}
      {specialCourses.length > 0 && (
        <div className="mb-12">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-lg p-6 border border-border mb-6">
            <h2 className="text-2xl font-bold text-foreground drop-shadow-lg mb-2">
              Life Skills Collection
            </h2>
            <p className="text-muted-foreground text-sm">
              Foundational courses designed to transform your learning approach
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {specialCourses.map(renderCourseCard)}
          </div>
        </div>
      )}
      
      {/* Hierarchical Course Structure */}
      {hierarchy.map((stageGroup) => (
        <div key={stageGroup.stage} className="mb-8">
          <Collapsible
            open={expandedStages.has(stageGroup.stage)}
            onOpenChange={() => toggleStage(stageGroup.stage)}
          >
            <CollapsibleTrigger asChild>
              <button className="w-full bg-gradient-to-r from-blue-600/80 to-indigo-600/80 backdrop-blur-md rounded-lg p-5 border border-border hover:from-blue-600/90 hover:to-indigo-600/90 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {expandedStages.has(stageGroup.stage) ? (
                      <ChevronDown className="h-6 w-6 text-white" />
                    ) : (
                      <ChevronUp className="h-6 w-6 text-white" />
                    )}
                    <h2 className="text-xl font-bold text-white drop-shadow-lg">
                      {stageGroup.stage}
                    </h2>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {stageGroup.gradeLevels.reduce((acc, gl) => 
                      acc + gl.subjects.reduce((acc2, s) => acc2 + s.courses.length, 0), 0
                    )} Courses
                  </Badge>
                </div>
              </button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4 space-y-4">
              {stageGroup.gradeLevels.map((gradeLevel) => (
                <div key={gradeLevel.id} className="ml-4">
                  <Collapsible
                    open={expandedGrades.has(gradeLevel.id)}
                    onOpenChange={() => toggleGrade(gradeLevel.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <button className="w-full bg-card/30 backdrop-blur-md rounded-lg p-4 border border-border hover:bg-card/40 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {expandedGrades.has(gradeLevel.id) ? (
                              <ChevronDown className="h-5 w-5 text-foreground" />
                            ) : (
                              <ChevronUp className="h-5 w-5 text-foreground" />
                            )}
                            <h3 className="text-lg font-bold text-foreground">
                              {gradeLevel.heading}
                            </h3>
                          </div>
                          <Badge variant="outline" className="bg-card/40">
                            {gradeLevel.subjects.reduce((acc, s) => acc + s.courses.length, 0)} Courses
                          </Badge>
                        </div>
                      </button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="mt-4 space-y-6">
                      {gradeLevel.subjects.map((subject) => (
                        <div key={subject.name} className="ml-4">
                          <h4 className="text-md font-semibold text-foreground mb-3 bg-card/20 backdrop-blur-sm rounded-lg p-3 border border-border">
                            {subject.name}
                          </h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {subject.courses.map(renderCourseCard)}
                          </div>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  );
}
