import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Package, 
  Video, 
  FileAudio, 
  FileText,
  PlayCircle,
  AlertCircle
} from 'lucide-react';
import { useCourse } from '@/hooks/useCourses';
import { useLessons, useLessonMutations } from '@/hooks/useLessons';
import { useUserRole } from '@/hooks/useUserRole';
import ScormUploader from './ScormUploader';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LessonManager = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { roles, isAdmin, isLoading: roleLoading } = useUserRole();
  const { course, isLoading: courseLoading } = useCourse(slug || '');
  const { data: lessons = [], isLoading: lessonsLoading, refetch } = useLessons(course?.id || '');
  const { deleteLesson, isDeleting } = useLessonMutations();
  
  const [activeTab, setActiveTab] = useState('list');

  // Loading states
  if (roleLoading || courseLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Access control
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center p-8">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Admin privileges required to manage lessons.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Course not found
  if (!course && !courseLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/admin/courses')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Course not found. Please check the URL or select a different course.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleDelete = async (lessonId: string, lessonTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${lessonTitle}"? This action cannot be undone.`)) {
      deleteLesson.mutate(lessonId);
      refetch();
    }
  };

  const handleUploadComplete = (lessonId: string) => {
    refetch();
    setActiveTab('list');
  };

  const getContentTypeIcon = (contentType: string | null) => {
    switch (contentType) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <FileAudio className="h-4 w-4" />;
      case 'scorm':
        return <Package className="h-4 w-4" />;
      case 'pdf':
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return <PlayCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/admin/courses')}
          className="w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">Lesson Management</h1>
          {course && (
            <p className="text-sm md:text-base text-muted-foreground">
              Managing lessons for: <span className="font-semibold">{course.title}</span>
            </p>
          )}
        </div>
      </div>

      {course && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lessons</TabsTrigger>
            <TabsTrigger value="upload">Upload SCORM</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Lessons List */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Course Lessons</CardTitle>
                    <CardDescription>
                      Manage lessons for this course
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setActiveTab('upload')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Lesson
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {lessonsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading lessons...</p>
                  </div>
                ) : lessons.length > 0 ? (
                  <div className="space-y-4">
                    {lessons.map((lesson) => (
                      <Card key={lesson.id} className="border border-muted">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                {getContentTypeIcon(lesson.content_type)}
                                <h3 className="font-semibold truncate">
                                  {lesson.lesson_number}. {lesson.title}
                                </h3>
                                <Badge variant={lesson.is_published ? "default" : "secondary"}>
                                  {lesson.is_published ? "Published" : "Draft"}
                                </Badge>
                                {lesson.content_type && (
                                  <Badge variant="outline">
                                    {lesson.content_type.toUpperCase()}
                                  </Badge>
                                )}
                              </div>
                              {lesson.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {lesson.description}
                                </p>
                              )}
                              <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                                {lesson.duration_minutes && (
                                  <span>Duration: {lesson.duration_minutes} min</span>
                                )}
                                {lesson.scorm_package_url && (
                                  <span>SCORM Package Available</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // TODO: Implement lesson preview
                                  console.log('Preview lesson:', lesson.id);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // TODO: Implement lesson editing
                                  console.log('Edit lesson:', lesson.id);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(lesson.id, lesson.title)}
                                disabled={isDeleting}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No lessons yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first lesson to start building course content.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('upload')}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add First Lesson
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <ScormUploader 
              courseId={course.id} 
              onUploadComplete={handleUploadComplete}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default LessonManager;