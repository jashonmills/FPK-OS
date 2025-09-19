import React, { useState } from 'react';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, Plus, Search, Filter, MoreHorizontal, Users, Clock, ChevronDown, Edit, Trash2, Eye, Globe, FileText, Play, Send } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgCourses } from '@/hooks/useOrgCourses';
import { getCourseImage } from '@/utils/courseImages';
import { CourseCreationWizard } from '@/components/course-builder/CourseCreationWizard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AssignmentCreateDialog } from '@/components/assignments/AssignmentCreateDialog';

export default function CoursesManagement() {
  const { currentOrg } = useOrgContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isDraftSectionOpen, setIsDraftSectionOpen] = useState(false);
  const [previewCourse, setPreviewCourse] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<'outline' | 'published'>('outline');
  const { courses: allCourses, isLoading, togglePublish, deleteCourse, isTogglingPublish, isDeleting } = useOrgCourses(currentOrg?.organization_id);

  if (!currentOrg) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <OrgCard>
          <OrgCardContent className="p-8 text-center">
            <p className="text-muted-foreground">No organization selected</p>
          </OrgCardContent>
        </OrgCard>
      </div>
    );
  }

  // Filter courses by search query
  const filteredCourses = allCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCourses = filteredCourses.filter(c => c.published);
  const draftCourses = filteredCourses.filter(c => !c.published);
  const totalEnrollments = filteredCourses.reduce((sum, c) => sum + (c.enrollments_count || 0), 0);
  const avgCompletion = filteredCourses.length > 0 
    ? filteredCourses.reduce((sum, c) => sum + (c.completion_rate || 0), 0) / filteredCourses.length 
    : 0;

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Courses</h1>
          <p className="text-white/80 mt-2 drop-shadow">
            Manage and monitor your organization's learning content
          </p>
        </div>
        <Button onClick={() => setIsWizardOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-white/70" />
              <span className="text-sm font-medium text-white">Total Courses</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-white">{filteredCourses.length}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Published</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-300">{publishedCourses.length}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-white/70" />
              <span className="text-sm font-medium text-white">Total Enrollments</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-white">{totalEnrollments}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Avg Completion</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-white">{Math.round(avgCompletion)}%</div>
          </OrgCardContent>
        </OrgCard>
      </div>

      {/* Search and Filters */}
      <OrgCard className="bg-orange-500/65 border-orange-400/50">
        <OrgCardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
              <Input 
              placeholder="Search courses..." 
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-border text-foreground hover:bg-accent">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </OrgCardHeader>
      </OrgCard>

      {/* Content Development Hub - Collapsible Draft Courses */}
      {draftCourses.length > 0 && (
        <Collapsible open={isDraftSectionOpen} onOpenChange={setIsDraftSectionOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-4 h-auto bg-orange-500/30 border border-orange-400/50 text-white hover:bg-orange-500/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-lg font-medium">Content Development Hub</span>
                </div>
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  {draftCourses.length} In Progress
                </Badge>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isDraftSectionOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <p className="text-white/70 text-sm px-2">
              Courses in development that are ready to be published or need further work.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onTogglePublish={() => togglePublish({ courseId: course.id, published: !course.published })}
                onDelete={() => deleteCourse(course.id)}
                onPreview={setPreviewCourse}
                isTogglingPublish={isTogglingPublish}
                isDeleting={isDeleting}
                isDraft={true}
              />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Published Courses */}
      {publishedCourses.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Published Courses</h2>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              {publishedCourses.length} Live
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onTogglePublish={() => togglePublish({ courseId: course.id, published: !course.published })}
                onDelete={() => deleteCourse(course.id)}
                onPreview={setPreviewCourse}
                isTogglingPublish={isTogglingPublish}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Empty state */}
      {filteredCourses.length === 0 && !isLoading && (
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-white/70 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">No Courses Found</h3>
            <p className="text-white/80 mb-4">
              {searchQuery ? 'No courses match your search.' : 'Create your first course to get started.'}
            </p>
            <Button className="bg-orange-600/80 hover:bg-orange-600 text-white border-orange-500/60" onClick={() => setIsWizardOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </OrgCardContent>
        </OrgCard>
      )}
      
      <CourseCreationWizard
        open={isWizardOpen}
        onOpenChange={setIsWizardOpen}
        orgId={currentOrg.organization_id}
      />

      {/* Course Preview Modal */}
      <Dialog open={!!previewCourse} onOpenChange={() => setPreviewCourse(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-background border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewMode === 'outline' ? <FileText className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {previewCourse?.title} - {previewMode === 'outline' ? 'Course Outline' : 'Published Preview'}
            </DialogTitle>
            <div className="flex gap-2 mt-2">
              <Button 
                variant={previewMode === 'outline' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setPreviewMode('outline')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Outline View
              </Button>
              <Button 
                variant={previewMode === 'published' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setPreviewMode('published')}
              >
                <Play className="w-4 h-4 mr-2" />
                Published View
              </Button>
            </div>
          </DialogHeader>
          {previewCourse && (
            <CoursePreviewContent course={previewCourse} mode={previewMode} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Course Card Component
interface CourseCardProps {
  course: any;
  onTogglePublish: () => void;
  onDelete: () => void;
  onPreview: (course: any) => void;
  isTogglingPublish: boolean;
  isDeleting: boolean;
  isDraft?: boolean;
}

function CourseCard({ course, onTogglePublish, onDelete, onPreview, isTogglingPublish, isDeleting, isDraft = false }: CourseCardProps) {
  return (
    <OrgCard className="overflow-hidden bg-orange-500/65 border-orange-400/50 flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${getCourseImage(course.id, course.title)})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <BookOpen className="w-8 h-8 text-white mb-2 drop-shadow-lg" />
          <h3 className="text-white font-semibold text-lg drop-shadow-md break-words">{course.title}</h3>
        </div>
      </div>
      <OrgCardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <OrgCardTitle className="text-lg text-white break-words leading-tight">{course.title}</OrgCardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-orange-500/30">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border-border shadow-lg z-50">
              <DropdownMenuItem onClick={onTogglePublish} disabled={isTogglingPublish}>
                <Globe className="w-4 h-4 mr-2" />
                {course.published ? 'Unpublish Course' : 'Publish Course'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPreview(course)}>
                <Eye className="w-4 h-4 mr-2" />
                Preview Course
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Course
              </DropdownMenuItem>
              <AssignmentCreateDialog 
                course={{
                  id: course.id,
                  title: course.title,
                  description: course.description,
                  thumbnail_url: getCourseImage(course.id, course.title),
                  instructor_name: course.instructor_name,
                  source: 'builder',
                  status: course.published ? 'published' : 'draft',
                  discoverable: course.published,
                  source_table: 'org_courses',
                  org_id: course.org_id,
                  badges: [],
                  route: `/courses/${course.id}`
                }}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Send className="w-4 h-4 mr-2" />
                    Assign Course
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem onClick={onDelete} disabled={isDeleting} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <OrgCardDescription className="text-white/80 text-sm leading-relaxed">
          {course.description}
        </OrgCardDescription>
      </OrgCardHeader>
      <OrgCardContent className="pt-0 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <Badge 
              variant={course.published ? 'default' : 'secondary'} 
              className={course.published 
                ? "bg-green-500/80 text-white border-green-400/60" 
                : "bg-yellow-500/80 text-white border-yellow-400/60"
              }
            >
              {course.published ? 'Published' : 'Draft'}
            </Badge>
            <div className="flex items-center text-sm text-white/70">
              <Clock className="w-3 h-3 mr-1" />
              {course.duration_estimate_mins || course.duration_minutes || 0}min
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-white">{course.enrollments_count || 0}</div>
              <div className="text-white/70">Enrolled</div>
            </div>
            <div>
              <div className="font-medium text-white">{Math.round(course.completion_rate || 0)}%</div>
              <div className="text-white/70">Completed</div>
            </div>
          </div>
        </div>
        
        <Button 
          className={`w-full mt-auto ${
            isDraft 
              ? 'bg-green-600/80 hover:bg-green-600 text-white border-green-500/60' 
              : 'bg-orange-600/80 hover:bg-orange-600 text-white border-orange-500/60'
          }`}
          size="sm"
          onClick={onTogglePublish}
          disabled={isTogglingPublish}
        >
          {isTogglingPublish ? 'Updating...' : (course.published ? 'Unpublish' : 'Publish Course')}
        </Button>
      </OrgCardContent>
    </OrgCard>
  );
}

// Course Preview Content Component
interface CoursePreviewContentProps {
  course: any;
  mode: 'outline' | 'published';
}

function CoursePreviewContent({ course, mode }: CoursePreviewContentProps) {
  if (mode === 'outline') {
    return (
      <div className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Course Overview</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Framework:</span> {course.framework || 'Standard'}
            </div>
            <div>
              <span className="font-medium">Duration:</span> {course.duration_estimate_mins || 'Not set'}min
            </div>
            <div>
              <span className="font-medium">Level:</span> {course.level || 'Not specified'}
            </div>
            <div>
              <span className="font-medium">Status:</span> {course.published ? 'Published' : 'Draft'}
            </div>
          </div>
          {course.description && (
            <div className="mt-3">
              <span className="font-medium">Description:</span>
              <p className="text-muted-foreground mt-1">{course.description}</p>
            </div>
          )}
        </div>

        {course.objectives && course.objectives.length > 0 && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Learning Objectives</h3>
            <ul className="list-disc list-inside space-y-1">
              {course.objectives.map((objective: string, index: number) => (
                <li key={index} className="text-sm">{objective}</li>
              ))}
            </ul>
          </div>
        )}

        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Prerequisites</h3>
            <ul className="list-disc list-inside space-y-1">
              {course.prerequisites.map((prereq: string, index: number) => (
                <li key={index} className="text-sm">{prereq}</li>
              ))}
            </ul>
          </div>
        )}

        {course.lesson_structure && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Course Structure</h3>
            <div className="space-y-2">
              {Array.isArray(course.lesson_structure) ? (
                course.lesson_structure.map((lesson: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-background rounded border">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{lesson.title || lesson.name || `Lesson ${index + 1}`}</span>
                    {lesson.description && (
                      <span className="text-muted-foreground text-sm">- {lesson.description}</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Course structure data is not in expected format</p>
              )}
            </div>
          </div>
        )}

        {course.micro_lesson_data && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Micro-Lesson Content</h3>
            <p className="text-sm text-muted-foreground">Interactive micro-lesson content is configured for this course.</p>
          </div>
        )}
      </div>
    );
  }

  // Published view - simulates how the course would look when live
  return (
    <div className="space-y-6">
      <div className="relative">
        <div 
          className="w-full h-48 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${getCourseImage(course.id, course.title)})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-white/90">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
            {course.objectives && course.objectives.length > 0 ? (
              <ul className="space-y-2">
                {course.objectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mt-0.5">
                      ✓
                    </div>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Learning objectives will be displayed here once configured.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Course Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">{course.duration_estimate_mins || 'TBD'}min</span>
              </div>
              <div className="flex justify-between">
                <span>Level:</span>
                <span className="font-medium">{course.level || 'All levels'}</span>
              </div>
              <div className="flex justify-between">
                <span>Framework:</span>
                <span className="font-medium">{course.framework || 'Standard'}</span>
              </div>
            </div>
          </div>

          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Prerequisites</h3>
              <ul className="text-sm space-y-1">
                {course.prerequisites.map((prereq: string, index: number) => (
                  <li key={index}>• {prereq}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Course Content</h2>
        {course.lesson_structure && Array.isArray(course.lesson_structure) ? (
          <div className="space-y-3">
            {course.lesson_structure.map((lesson: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-background rounded border">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{lesson.title || lesson.name || `Lesson ${index + 1}`}</h4>
                  {lesson.description && (
                    <p className="text-muted-foreground text-sm">{lesson.description}</p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {lesson.duration || '~5'} min
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Course content will be displayed here once lessons are configured.</p>
        )}
      </div>
    </div>
  );
}