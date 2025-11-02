import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Clock, GraduationCap } from 'lucide-react';
import type { PlatformCourse } from '@/hooks/usePlatformCourses';
import type { Course } from '@/hooks/useCourses';
import { groupCoursesByHierarchy } from '@/hooks/usePlatformCourses';
import { Loader2 } from 'lucide-react';

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
    const courseImage = course.thumbnail_url || 
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8';
    
    return (
      <Card 
        key={course.id} 
        className="flex flex-col h-full hover:shadow-xl transition-all duration-300 bg-card/40 backdrop-blur-md border-border"
      >
        <div 
          className="relative h-32 bg-cover bg-center rounded-t-lg overflow-hidden"
          style={{ backgroundImage: `url(${courseImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 p-3 h-full flex flex-col justify-end">
            <CardTitle className="text-card-foreground font-bold text-sm leading-tight drop-shadow-2xl">
              {course.title}
            </CardTitle>
          </div>
        </div>
        
        <CardContent className="flex-1 flex flex-col p-4">
          <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
            {course.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{course.duration_minutes ? `${Math.ceil(course.duration_minutes / 60)}h` : '2h'}</span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              <span className="capitalize">{course.difficulty_level || 'Beginner'}</span>
            </div>
          </div>
          
          <Button
            onClick={() => onEnroll(course.id)}
            className="w-full text-xs py-2 mt-auto"
            disabled={enrollingCourseIds.has(course.id)}
          >
            {enrollingCourseIds.has(course.id) ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Enrolling...
              </>
            ) : (
              'Enroll Now'
            )}
          </Button>
        </CardContent>
      </Card>
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
