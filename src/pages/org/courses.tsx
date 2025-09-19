import React, { useState } from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext';
// Card imports removed - using OrgCard components
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  BookOpen, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  Play,
  Pause,
  BarChart,
  Sparkles
} from 'lucide-react';
import { useOrgCourses, OrgCourse } from '@/hooks/useOrgCourses';
import { usePlatformCourses } from '@/hooks/usePlatformCourses';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CourseCreationWizard } from '@/components/course-builder/CourseCreationWizard';
import { featureFlagService } from '@/services/FeatureFlagService';
import { getActiveOrgId } from '@/lib/org/context';

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CoursesPage() {
  const { currentOrg, getUserRole } = useOrgContext();
  const userRole = getUserRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<OrgCourse | null>(null);
  const [showCourseWizard, setShowCourseWizard] = useState(false);

  const isWizardEnabled = featureFlagService.isEnabled('orgCourseWizard');

  // Get organization ID directly from URL
  const orgId = getActiveOrgId();
  
  // Fetch platform and organization courses separately
  const { courses: platformCourses, isLoading: isLoadingPlatform } = usePlatformCourses();
  
  const {
    courses: orgCourses,
    isLoading: isLoadingOrg,
    createCourse,
    updateCourse,
    deleteCourse,
    togglePublish,
    isCreating,
    isUpdating,
    isDeleting,
    isTogglingPublish,
  } = useOrgCourses(orgId);

  // Debug logging
  console.log('Debug - URL Org ID:', orgId);
  console.log('Debug - CurrentOrg:', currentOrg);
  console.log('Debug - Organization courses:', orgCourses);
  console.log('Debug - Platform courses:', platformCourses);
  console.log('Debug - Loading states:', { isLoadingOrg, isLoadingPlatform });

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      level: 'beginner',
    },
  });

  if (!currentOrg) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Organization Selected</h1>
          <p className="text-muted-foreground">Please select an organization to view courses.</p>
        </div>
      </div>
    );
  }

  const canManageCourses = userRole === 'owner' || userRole === 'instructor';
  
  // Filter courses based on search
  const filteredPlatformCourses = platformCourses.filter(course => {
    const title = course.title || '';
    const description = course.description || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredOrgCourses = orgCourses.filter(course => {
    const title = course.title || '';
    const description = course.description || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const isLoading = isLoadingPlatform || isLoadingOrg;
  const totalCourses = platformCourses.length + orgCourses.length;
  
  // Helper functions to safely get course properties
  const getCourseDescription = (course: any) => course.description || 'No description provided';
  const getCourseDifficulty = (course: any) => course.difficulty_level || course.level;
  const isCoursePublished = (course: any) => course.published === true;
  const isOrgCourse = (course: any): course is OrgCourse => 'org_id' in course;

  const handleCreateCourse = (data: CourseFormData) => {
    createCourse({
      title: data.title,
      description: data.description,
      level: data.level,
      published: false,
    });
    
    form.reset();
    setShowCreateDialog(false);
  };

  const handleEditCourse = (course: OrgCourse) => {
    setEditingCourse(course);
    form.reset({
      title: course.title,
      description: course.description || '',
      level: (course.level as any) || 'beginner',
    });
  };

  const handleUpdateCourse = (data: CourseFormData) => {
    if (!editingCourse) return;
    
    updateCourse({
      id: editingCourse.id,
      title: data.title,
      description: data.description,
      level: data.level,
    });
    
    form.reset();
    setEditingCourse(null);
  };

  const handleTogglePublish = (course: OrgCourse) => {
    togglePublish({
      courseId: course.id,
      published: !course.published,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Courses</h1>
            <p className="text-muted-foreground">
              Manage your organization's courses
            </p>
          </div>
        </div>
        
        {canManageCourses && (
          <div className="flex items-center gap-2">
            {isWizardEnabled && (
              <Button 
                onClick={() => setShowCourseWizard(true)} 
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Create Interactive Course
              </Button>
            )}
            <Button 
              onClick={() => setShowCreateDialog(true)} 
              variant={isWizardEnabled ? "outline" : "default"}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Quick Course
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-purple-100">Total Courses</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-white">{totalCourses}</div>
            <p className="text-xs text-purple-200">Platform + Organization</p>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-purple-100">Platform Courses</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-white">{platformCourses.length}</div>
            <p className="text-xs text-purple-200">From FPK University</p>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-purple-100">Organization Courses</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-white">{orgCourses.length}</div>
            <p className="text-xs text-purple-200">Created by organization</p>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-purple-100">Published Org Courses</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-white">{orgCourses.filter(c => isCoursePublished(c)).length}</div>
            <p className="text-xs text-purple-200">Ready for students</p>
          </OrgCardContent>
        </OrgCard>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        ) : (
          <>
            {/* Platform Courses Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Platform Courses</h2>
                <Badge variant="outline">{filteredPlatformCourses.length}</Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Courses available from FPK University platform
              </p>
              
              {filteredPlatformCourses.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-muted rounded-lg">
                  <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No platform courses match your search.' : 'No platform courses available.'}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlatformCourses.map((course) => (
                    <OrgCard key={`platform-${course.id}`} className="hover:shadow-md transition-shadow">
                      <OrgCardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <OrgCardTitle className="line-clamp-2 text-white">{course.title}</OrgCardTitle>
                            <OrgCardDescription className="line-clamp-3 mt-2 text-purple-200">
                              {getCourseDescription(course)}
                            </OrgCardDescription>
                          </div>
                        </div>
                      </OrgCardHeader>
                      <OrgCardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Platform</Badge>
                            {getCourseDifficulty(course) && (
                              <Badge variant="outline" className="capitalize">
                                {getCourseDifficulty(course)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-purple-200">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              0
                            </div>
                          </div>
                        </div>
                      </OrgCardContent>
                    </OrgCard>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-muted"></div>

            {/* Organization Courses Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Organization Courses</h2>
                <Badge variant="outline">{filteredOrgCourses.length}</Badge>
              </div>
                {canManageCourses && (
                  <div className="flex items-center gap-2">
                    {isWizardEnabled && (
                      <Button onClick={() => setShowCourseWizard(true)} size="sm">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Create Interactive Course
                      </Button>
                    )}
                    <Button 
                      onClick={() => setShowCreateDialog(true)} 
                      variant={isWizardEnabled ? "outline" : "default"}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Quick Course
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                Courses created by your organization
              </p>
              
              {filteredOrgCourses.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Organization Courses</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'No organization courses match your search.' : 'Start by creating your first course.'}
                  </p>
                  {canManageCourses && !searchQuery && (
                    <div className="flex items-center justify-center gap-2">
                      {isWizardEnabled && (
                        <Button onClick={() => setShowCourseWizard(true)}>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Create Interactive Course
                        </Button>
                      )}
                      <Button onClick={() => setShowCreateDialog(true)} variant={isWizardEnabled ? "outline" : "default"}>
                        <Plus className="h-4 w-4 mr-2" />
                        Quick Course
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrgCourses.map((course) => (
                    <OrgCard key={`org-${course.id}`} className="hover:shadow-md transition-shadow">
                      <OrgCardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <OrgCardTitle className="line-clamp-2 text-white">{course.title}</OrgCardTitle>
                            <OrgCardDescription className="line-clamp-3 mt-2 text-purple-200">
                              {getCourseDescription(course)}
                            </OrgCardDescription>
                          </div>
                          {canManageCourses && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-purple-100 hover:bg-purple-800/50">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => isOrgCourse(course) && handleEditCourse(course)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Course
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => isOrgCourse(course) && handleTogglePublish(course)}>
                                  {isCoursePublished(course) ? (
                                    <>
                                      <Pause className="h-4 w-4 mr-2" />
                                      Unpublish
                                    </>
                                  ) : (
                                    <>
                                      <Play className="h-4 w-4 mr-2" />
                                      Publish
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteCourse(course.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Course
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </OrgCardHeader>
                      <OrgCardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={isCoursePublished(course) ? "default" : "secondary"}>
                              {isCoursePublished(course) ? 'Published' : 'Draft'}
                            </Badge>
                            {getCourseDifficulty(course) && (
                              <Badge variant="outline" className="capitalize">
                                {getCourseDifficulty(course)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-purple-200">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              0
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart className="h-3 w-3" />
                              0%
                            </div>
                          </div>
                        </div>
                      </OrgCardContent>
                    </OrgCard>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Course Dialog */}
      <Dialog 
        open={showCreateDialog || !!editingCourse} 
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingCourse(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </DialogTitle>
            <DialogDescription>
              {editingCourse ? 'Update course information.' : 'Add a new course to your organization.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(editingCourse ? handleUpdateCourse : handleCreateCourse)} 
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter course title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe the course content..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    setEditingCourse(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {editingCourse 
                    ? (isUpdating ? 'Updating...' : 'Update Course')
                    : (isCreating ? 'Creating...' : 'Create Course')
                  }
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Course Creation Wizard */}
      {isWizardEnabled && currentOrg && (
        <CourseCreationWizard
          open={showCourseWizard}
          onOpenChange={setShowCourseWizard}
          orgId={currentOrg.organization_id}
        />
      )}
    </div>
  );
}