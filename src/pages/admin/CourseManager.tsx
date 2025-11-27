
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit2, Trash2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useUserRole } from '@/hooks/useUserRole';
import { useQueryClient } from '@tanstack/react-query';
import { validateCourseForPublishing } from '@/utils/courseValidation';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const CourseManager = () => {
  const { t } = useTranslation();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { courses, isLoading, error, createCourse, updateCourse, deleteCourse, togglePublish, refetch } = useCourses();
  const navigate = useNavigate();
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [courseToToggle, setCourseToToggle] = useState<{ id: string; slug: string; title: string; currentStatus: string } | null>(null);

  // Force refresh courses cache on component mount to get latest slug data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['courses'] });
  }, [queryClient]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['courses'] });
    await refetch();
    setIsRefreshing(false);
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    instructor_name: '',
    difficulty_level: 'beginner',
    duration_minutes: 0,
    featured: false,
    status: 'draft' as 'draft' | 'published' | 'archived'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse.id, ...formData });
      } else {
        await createCourse(formData);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      slug: '',
      instructor_name: '',
      difficulty_level: 'beginner',
      duration_minutes: 0,
      featured: false,
      status: 'draft'
    });
    setEditingCourse(null);
    setIsCreating(false);
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      slug: course.slug || '',
      instructor_name: course.instructor_name || '',
      difficulty_level: course.difficulty_level || 'beginner',
      duration_minutes: course.duration_minutes || 0,
      featured: course.featured || false,
      status: course.status || 'draft'
    });
    setIsCreating(true);
    
    // Scroll to form after state updates
    setTimeout(() => {
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDelete = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleTogglePublish = async (course: any) => {
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    
    // If publishing, validate first
    if (newStatus === 'published') {
      setCourseToToggle({
        id: course.id,
        slug: course.slug || '',
        title: course.title || '',
        currentStatus: course.status || 'draft'
      });
      setPublishDialogOpen(true);
    } else {
      // Unpublishing doesn't need validation
      togglePublish({ courseId: course.id, newStatus });
    }
  };

  const confirmPublish = async () => {
    if (!courseToToggle) return;

    // Validate before publishing
    const validation = await validateCourseForPublishing(
      courseToToggle.slug,
      courseToToggle.title
    );

    if (!validation.isValid) {
      toast({
        title: "Cannot Publish Course",
        description: (
          <div className="space-y-2">
            <p className="font-semibold">The following issues must be fixed:</p>
            <ul className="list-disc list-inside space-y-1">
              {validation.errors.map((error, idx) => (
                <li key={idx} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        ),
        variant: "destructive",
      });
      setPublishDialogOpen(false);
      setCourseToToggle(null);
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      console.warn('Course validation warnings:', validation.warnings);
    }

    // Proceed with publishing
    togglePublish({ courseId: courseToToggle.id, newStatus: 'published' });
    setPublishDialogOpen(false);
    setCourseToToggle(null);
  };

  if (roleLoading) {
    return <div className="flex items-center justify-center p-4 md:p-8">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-sm md:text-base text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-4 md:p-8">Loading courses...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-semibold text-red-600">Error</h2>
          <p className="text-sm md:text-base text-gray-600">{error.message || 'Failed to load courses'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('admin.courses.title')}</h1>
          <p className="text-sm md:text-base text-gray-600">{t('admin.courses.description')}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/course-inventory')}
            className="w-full sm:w-auto min-h-[44px] touch-manipulation"
          >
            Course Inventory
          </Button>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full sm:w-auto min-h-[44px] touch-manipulation"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsCreating(true)} className="w-full sm:w-auto min-h-[44px] touch-manipulation">
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </Button>
        </div>
      </div>

      {isCreating && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  {editingCourse ? (
                    <>
                      <Badge variant="outline" className="bg-primary/10">Editing</Badge>
                      {editingCourse.title}
                    </>
                  ) : (
                    'Create New Course'
                  )}
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  {editingCourse ? 'Update course information' : 'Add a new course to the platform'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm md:text-base">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="mt-1 min-h-[44px] text-sm md:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="text-sm md:text-base">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="course-url-slug"
                    required
                    className="mt-1 min-h-[44px] text-sm md:text-base"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm md:text-base">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 text-sm md:text-base"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="instructor" className="text-sm md:text-base">Instructor</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor_name}
                    onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                    className="mt-1 min-h-[44px] text-sm md:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty" className="text-sm md:text-base">Difficulty</Label>
                  <Select value={formData.difficulty_level} onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}>
                    <SelectTrigger className="mt-1 min-h-[44px] text-sm md:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration" className="text-sm md:text-base">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                    className="mt-1 min-h-[44px] text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured" className="text-sm md:text-base">Featured Course</Label>
                </div>
                <div>
                  <Label htmlFor="status" className="text-sm md:text-base">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'draft' | 'published' | 'archived') => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="mt-1 min-h-[44px] text-sm md:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm} className="min-h-[44px] text-sm md:text-base touch-manipulation">
                  Cancel
                </Button>
                <Button type="submit" className="min-h-[44px] text-sm md:text-base touch-manipulation">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-base md:text-lg leading-tight break-words">{course.title}</CardTitle>
                    <Badge 
                      variant={course.status === 'published' ? 'default' : 'secondary'} 
                      className="text-xs flex items-center gap-1"
                    >
                      {course.status === 'published' ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          Draft
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs md:text-sm mt-1 line-clamp-2">{course.description}</CardDescription>
                </div>
                <div className="flex space-x-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(course)} className="h-8 w-8 p-0 touch-manipulation">
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(course.id)} className="h-8 w-8 p-0 touch-manipulation">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {course.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <Switch
                    checked={course.status === 'published'}
                    onCheckedChange={() => handleTogglePublish(course)}
                    aria-label="Toggle publish status"
                  />
                </div>
                {course.instructor_name && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600">Instructor:</span>
                    <span className="text-xs md:text-sm truncate ml-2">{course.instructor_name}</span>
                  </div>
                )}
                {course.duration_minutes && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600">Duration:</span>
                    <span className="text-xs md:text-sm">{course.duration_minutes} mins</span>
                  </div>
                )}
                {course.featured && (
                  <Badge variant="outline" className="w-full justify-center text-xs">
                    Featured
                  </Badge>
                )}
              </div>
              <div className="pt-3 space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full min-h-[36px] text-xs md:text-sm touch-manipulation"
                  onClick={() => {
                    if (!course.slug) {
                      alert('Course slug is missing. Please edit the course and add a slug first.');
                      return;
                    }
                    navigate(`/dashboard/admin/courses/${course.slug}/modules`);
                  }}
                >
                  Manage Modules
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full min-h-[36px] text-xs md:text-sm touch-manipulation"
                  onClick={() => {
                    if (!course.slug) {
                      alert('Course slug is missing. Please edit the course and add a slug first.');
                      return;
                    }
                    navigate(`/dashboard/admin/courses/${course.slug}/lessons`);
                  }}
                >
                  Manage Lessons
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full min-h-[36px] text-xs md:text-sm touch-manipulation"
                  onClick={() => {
                    if (!course.slug) {
                      toast({
                        title: 'Error',
                        description: 'Course slug is missing',
                        variant: 'destructive',
                      });
                      return;
                    }
                    // Phase 1: Use preview mode for draft courses
                    const isDraft = course.status === 'draft';
                    const route = `/courses/player/${course.slug}${isDraft ? '?preview=true' : ''}`;
                    console.log('[CourseManager] Preview:', route, 'isDraft:', isDraft);
                    navigate(route);
                  }}
                >
                  Preview Course
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-sm md:text-base text-gray-600 mb-4">Get started by creating your first course.</p>
          <Button onClick={() => setIsCreating(true)} className="min-h-[44px] text-sm md:text-base touch-manipulation">
            <Plus className="h-4 w-4 mr-2" />
            Create First Course
          </Button>
        </div>
      )}

      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Course?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish "{courseToToggle?.title}"? 
              <br /><br />
              The system will validate that the course has all required content before publishing.
              Once published, the course will be visible to all learners.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCourseToToggle(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPublish}>Publish Course</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseManager;
