
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Book, Clock, User, CheckCircle } from 'lucide-react';
import { useCourse } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import { useEnrollmentProgress } from '@/hooks/useEnrollmentProgress';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import DualLanguageText from '@/components/DualLanguageText';

const DynamicCourse = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  const { course, isLoading: courseLoading, error: courseError } = useCourse(slug || '');
  const { modules, isLoading: modulesLoading } = useModules(course?.id || '');
  const { getCourseProgress } = useEnrollmentProgress();
  const { updateProgress } = useProgressTracking(course?.id || '');

  const progress = course ? getCourseProgress(course.id) : null;
  const loading = courseLoading || modulesLoading;

  const handleBackToCourses = () => {
    navigate('/dashboard/learner/my-courses');
  };

  const handleModuleClick = async (moduleNumber: number) => {
    if (selectedModule === moduleNumber) {
      setSelectedModule(null);
      return;
    }

    setSelectedModule(moduleNumber);
    
    // Update progress when module is started
    if (course) {
      await updateProgress({
        type: 'module_start',
        moduleId: `module-${moduleNumber}`,
        timestamp: new Date().toISOString()
      });
    }
  };

  const renderModuleContent = (module: any) => {
    const metadata = module.metadata || {};
    
    switch (module.content_type) {
      case 'interactive':
        if (metadata.embed_url) {
          return (
            <div className="w-full h-96 border rounded-lg overflow-hidden">
              <iframe
                src={metadata.embed_url}
                title={module.title}
                className="w-full h-full border-0"
                allow="clipboard-write; encrypted-media; fullscreen"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          );
        }
        break;
      
      case 'video':
        if (metadata.video_url) {
          return (
            <div className="w-full h-96 border rounded-lg overflow-hidden">
              <video 
                controls 
                className="w-full h-full"
                src={metadata.video_url}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          );
        }
        break;
      
      case 'pdf':
        if (metadata.pdf_url) {
          return (
            <div className="w-full h-96 border rounded-lg overflow-hidden">
              <iframe
                src={metadata.pdf_url}
                title={module.title}
                className="w-full h-full border-0"
              />
            </div>
          );
        }
        break;
      
      case 'text':
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: metadata.content || module.description }} />
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <Book className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Content type "{module.content_type}" not yet supported</p>
          </div>
        );
    }

    return (
      <div className="text-center py-8 text-gray-500">
        <Book className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No content available for this module</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBackToCourses}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBackToCourses}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
        <Card className="fpk-card border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Book className="h-16 w-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h3>
            <p className="text-gray-500 mb-4">
              The course you're looking for doesn't exist or isn't available.
            </p>
            <Button onClick={handleBackToCourses}>
              Return to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBackToCourses}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          <DualLanguageText translationKey="courses.backToCourses" />
        </Button>
      </div>

      {/* Course Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            {course.description && (
              <p className="text-gray-600 text-lg">{course.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {course.instructor_name && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{course.instructor_name}</span>
                </div>
              )}
              {course.duration_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration_minutes} min</span>
                </div>
              )}
              {course.difficulty_level && (
                <Badge variant="outline">{course.difficulty_level}</Badge>
              )}
            </div>
          </div>
          {course.featured && (
            <Badge className="fpk-gradient text-white">Featured</Badge>
          )}
        </div>

        {progress && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Course Progress</span>
                  <span>{progress.completion_percentage}%</span>
                </div>
                <Progress value={progress.completion_percentage} className="h-2" />
                <p className="text-xs text-gray-500">
                  {progress.completed_modules?.length || 0} of {modules.length} modules completed
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {selectedModule !== null ? (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Module {selectedModule}</span>
                  <span>•</span>
                  <span>{modules.find(m => m.module_number === selectedModule)?.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderModuleContent(modules.find(m => m.module_number === selectedModule))}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Play className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Module to Begin
                </h3>
                <p className="text-gray-500">
                  Choose a module from the sidebar to start learning.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Module List Sidebar */}
        <div className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Course Modules</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {modules.map((module) => {
                  const isCompleted = progress?.completed_modules?.includes(`module-${module.module_number}`);
                  const isSelected = selectedModule === module.module_number;
                  
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleModuleClick(module.module_number)}
                      className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-purple-50 border-purple-200' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900">
                            Module {module.module_number}: {module.title}
                          </div>
                          {module.description && (
                            <div className="text-sm text-gray-500 truncate">
                              {module.description}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {module.content_type}
                            </Badge>
                            {module.duration_minutes > 0 && (
                              <span className="text-xs text-gray-500">
                                {module.duration_minutes} min
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DynamicCourse;
