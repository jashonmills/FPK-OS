
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useUserRole } from '@/hooks/useUserRole';
import { useQueryClient } from '@tanstack/react-query';

const CourseManager = () => {
  const { t } = useTranslation();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { courses, isLoading, error, createCourse, updateCourse, deleteCourse, refetch } = useCourses();
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{editingCourse ? 'Edit Course' : 'Create New Course'}</CardTitle>
            <CardDescription className="text-sm md:text-base">
              {editingCourse ? 'Update course information' : 'Add a new course to the platform'}
            </CardDescription>
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
                  <CardTitle className="text-base md:text-lg leading-tight break-words">{course.title}</CardTitle>
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
              <div className="space-y-2 flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm text-gray-600">Status:</span>
                  <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                    {course.status}
                  </Badge>
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
                    window.location.href = `/dashboard/admin/courses/${course.slug}/modules`;
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
                    window.location.href = `/dashboard/admin/courses/${course.slug}/lessons`;
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
                      alert('Course slug is missing. Please edit the course and add a slug first.');
                      return;
                    }
                    window.location.href = `/dashboard/learner/course/${course.slug}`;
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
    </div>
  );
};

export default CourseManager;
