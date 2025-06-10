
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle, Clock, User, BookOpen } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import { useEnrollmentProgress } from '@/hooks/useEnrollmentProgress';
import { useXPSystem } from '@/hooks/useXPSystem';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const DynamicCourse = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { courses } = useCourses();
  const { awardXP } = useXPSystem();
  const [currentModule, setCurrentModule] = useState<number>(1);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const course = courses.find(c => c.slug === slug);
  const { modules, loading: modulesLoading } = useModules(course?.id || '');
  const { getCourseProgress, refetch: refetchProgress } = useEnrollmentProgress();

  const progress = course ? getCourseProgress(course.id) : null;

  useEffect(() => {
    if (course && user) {
      checkEnrollment();
    }
  }, [course, user]);

  const checkEnrollment = async () => {
    if (!course || !user) return;

    const { data } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single();

    setIsEnrolled(!!data);
  };

  const handleEnroll = async () => {
    if (!course || !user) return;

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id
        });

      if (error) throw error;

      setIsEnrolled(true);
      await awardXP(25, 'Enrolled in a new course!');
      refetchProgress();
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleModuleComplete = async (moduleNumber: number) => {
    if (!course || !user || !progress) return;

    const completedModules = progress.completed_modules || [];
    const moduleId = `module-${moduleNumber}`;

    if (completedModules.includes(moduleId)) return;

    const newCompletedModules = [...completedModules, moduleId];
    const completionPercentage = Math.round((newCompletedModules.length / modules.length) * 100);
    const isCompleted = completionPercentage >= 100;

    try {
      const { error } = await supabase
        .from('enrollments')
        .update({
          progress: {
            completed: isCompleted,
            current_module: isCompleted ? null : `module-${moduleNumber + 1}`,
            completion_percentage: completionPercentage,
            completed_modules: newCompletedModules,
            ...(isCompleted && { completed_at: new Date().toISOString() })
          }
        })
        .eq('user_id', user.id)
        .eq('course_id', course.id);

      if (error) throw error;

      // Award XP for module completion
      await awardXP(50, `Completed ${course.title} - Module ${moduleNumber}`);

      // Award bonus XP for course completion
      if (isCompleted) {
        await awardXP(100, `Completed entire course: ${course.title}`);
      }

      refetchProgress();

      // Send progress event for any listening components
      window.dispatchEvent(new CustomEvent('progress_update', {
        detail: {
          courseId: course.id,
          moduleNumber,
          completed: true,
          completionPercentage
        }
      }));

    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (!slug) {
    return <Navigate to="/dashboard/learner/my-courses" replace />;
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Course Not Found</h2>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (modulesLoading) {
    return <div className="flex items-center justify-center p-8">Loading course content...</div>;
  }

  const completedModules = progress?.completed_modules || [];
  const completionPercentage = progress?.completion_percentage || 0;

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{course.title}</CardTitle>
              <CardDescription className="text-lg mt-2">
                {course.description}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {course.featured && (
                <Badge variant="default">Featured</Badge>
              )}
              <Badge variant="outline">
                {course.difficulty_level}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {course.instructor_name && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{course.instructor_name}</span>
              </div>
            )}
            {course.duration_minutes && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{course.duration_minutes} minutes</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{modules.length} modules</span>
            </div>
          </div>

          {isEnrolled ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            </div>
          ) : (
            <Button onClick={handleEnroll} className="fpk-gradient text-white">
              Enroll in Course
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Modules List */}
      {isEnrolled && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Course Modules</h2>
          {modules.map((module, index) => {
            const moduleId = `module-${module.module_number}`;
            const isCompleted = completedModules.includes(moduleId);
            const isAccessible = index === 0 || completedModules.includes(`module-${modules[index - 1]?.module_number}`);

            return (
              <Card key={module.id} className={`${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-xs font-medium">
                            {module.module_number}
                          </span>
                        )}
                        <span>{module.title}</span>
                      </CardTitle>
                      {module.description && (
                        <CardDescription className="mt-1">
                          {module.description}
                        </CardDescription>
                      )}
                    </div>
                    {isAccessible && !isCompleted && (
                      <Button
                        size="sm"
                        onClick={() => setCurrentModule(module.module_number)}
                        variant={currentModule === module.module_number ? "default" : "outline"}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        {currentModule === module.module_number ? 'Current' : 'Start'}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                {currentModule === module.module_number && isAccessible && (
                  <CardContent>
                    <div className="bg-gray-100 rounded-lg p-4 mb-4">
                      {module.metadata?.embed_url ? (
                        <iframe
                          src={module.metadata.embed_url}
                          className="w-full h-96 rounded border-0"
                          title={module.title}
                          onLoad={() => {
                            // Handle iframe load for interactive content
                            console.log(`Module ${module.module_number} loaded`);
                          }}
                        />
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600">Module content will be available soon.</p>
                        </div>
                      )}
                    </div>
                    {!isCompleted && (
                      <Button
                        onClick={() => handleModuleComplete(module.module_number)}
                        className="w-full"
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DynamicCourse;
