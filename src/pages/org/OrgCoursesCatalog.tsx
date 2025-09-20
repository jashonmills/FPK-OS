import React, { useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { OrgRequireRole } from '@/components/organizations/OrgRequireRole';
import { useOrgCatalog } from '@/hooks/useOrgCatalog';
import { useOrgPermissions } from '@/hooks/useOrgPermissions';
import { useStudentAssignments } from '@/hooks/useStudentAssignments';
import { EnhancedCourseCard } from '@/components/courses/enhanced/EnhancedCourseCard';
import { EmptyState } from '@/components/courses/enhanced/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  Search, 
  Building2, 
  Users, 
  Star, 
  Plus,
  Upload,
  Grid3X3, 
  List,
  AlignJustify,
  GraduationCap,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import PageShell from '@/components/dashboard/PageShell';
import { CourseCreationWizard } from '@/components/course-builder/CourseCreationWizard';
import { CollectionSelectionModal } from '@/components/collections/CollectionSelectionModal';
import { CollectionsDropdown } from '@/components/collections/CollectionsDropdown';
import { useCourseActions } from '@/hooks/useCourseActions';
import { toCourseCardModel } from '@/models/courseCatalog';
import type { CourseCardActions } from '@/types/enhanced-course-card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type ViewType = 'grid' | 'list' | 'compact';

export default function OrgCoursesCatalog() {
  const { orgId } = useParams<{ orgId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [viewType, setViewType] = useState<ViewType>(() => {
    const saved = localStorage.getItem('courses-view-type');
    return (saved as ViewType) || (isMobile ? 'list' : 'grid');
  });
  const { toast } = useToast();

  // Responsive grid classes for different screen sizes and view types
  const getResponsiveGridClasses = (type: ViewType) => {
    if (type === 'list') return "space-y-4";
    if (type === 'compact') return "space-y-1";
    
    // Optimized grid layout for better course card display
    if (isMobile) {
      return "grid grid-cols-1 gap-4"; // Single column on mobile
    }
    
    return cn(
      "grid gap-4 sm:gap-5 md:gap-6",
      "grid-cols-1",           // 1 column on xs (< 640px)
      "sm:grid-cols-2",        // 2 columns on sm (640px - 768px)  
      "lg:grid-cols-3",        // 3 columns on lg (1024px - 1280px)
      "2xl:grid-cols-4"        // 4 columns on 2xl (1536px+)
    );
  };

  const { isOrgStudent } = useOrgPermissions();
  const { 
    catalog, 
    isLoading, 
    platformCourses, 
    orgCourses,
    error 
  } = useOrgCatalog();
  
  const { assignments, isLoading: assignmentsLoading } = useStudentAssignments(orgId);

  const courseActions = useCourseActions({
    onCourseCreated: (course) => {
      toast({
        title: "Course Created",
        description: `${course.title} has been created successfully.`,
      });
    },
  });

  // Show loading state while orgId loads
  if (!orgId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground text-sm">Loading organization...</p>
        </div>
      </div>
    );
  }

  // Course Actions for Enhanced Cards
  const createCourseActions = (isOrgCourse: boolean): CourseCardActions => {
    if (isOrgStudent()) {
      // Student actions - limited to preview and start/continue
      return {
        onPreview: (courseId: string) => {
          const course = [...platformCourses, ...orgCourses].find(c => c.id === courseId);
          courseActions.preview(courseId, course?.route);
        },
        onStart: (courseId: string) => {
          // For students, "Start Course" navigates to course
          const course = [...platformCourses, ...orgCourses].find(c => c.id === courseId);
          courseActions.preview(courseId, course?.route);
        }
      };
    }
    
    // Instructor/Owner actions - full functionality
    return {
      onPreview: (courseId: string) => {
        const course = [...platformCourses, ...orgCourses].find(c => c.id === courseId);
        courseActions.preview(courseId, course?.route);
      },
      
      onStart: courseActions.assign,

      ...(isOrgCourse && {
        onEdit: courseActions.edit,
        onPublish: courseActions.publish,
        onUnpublish: courseActions.unpublish,
        onDelete: courseActions.remove,
      }),

      ...(!isOrgCourse && {
        onDuplicateToOrg: courseActions.duplicate,
      }),

      onViewAnalytics: courseActions.viewAnalytics,
      onSharePreview: courseActions.sharePreview,
      onAddToCollection: (courseId: string, courseTitle?: string) => {
        courseActions.addToCollection(courseId, courseTitle);
      },
    };
  };

  const handleCreateCourse = () => {
    setShowCreateWizard(true);
  };

  const handleUploadScorm = () => {
    setShowImportDialog(true);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'zip') {
      handleSCORMImport(file);
    } else if (fileExtension === 'json') {
      handleJSONImport(file);
    } else {
      toast({
        title: "Unsupported File Type",
        description: "Please upload a ZIP (SCORM) or JSON file.",
        variant: "destructive",
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowImportDialog(false);
  };

  const handleSCORMImport = async (file: File) => {
    try {
      // First, check if this is a native course format
      const JSZip = (await import('jszip')).default;
      const arrayBuffer = await file.arrayBuffer();
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(arrayBuffer);
      
      const fileNames = Object.keys(zipContent.files);
      const hasManifest = fileNames.some(name => name.toLowerCase().includes('imsmanifest.xml'));
      const hasCourseJson = fileNames.some(name => name.endsWith('course.json'));
      
      if (hasCourseJson && !hasManifest) {
        // Native course format
        toast({
          title: "Importing Course",
          description: "Processing native course format...",
        });
        
        const formData = new FormData();
        formData.append('course_package', file);
        formData.append('org_id', orgId!);
        formData.append('framework', 'Framework2'); // Default to Framework2
        
        const { data, error } = await supabase.functions.invoke('import-native-course', {
          body: formData,
        });
        
        if (error) throw error;
        
        toast({
          title: "Import Started",
          description: `${data.courseStructure?.title || 'Course'} import initiated successfully!`,
        });
      } else {
        // SCORM format
        toast({
          title: "Importing SCORM",
          description: "Processing SCORM package...",
        });
        
        const formData = new FormData();
        formData.append('scorm_package', file);
        formData.append('org_id', orgId!);
        
        const { data, error } = await supabase.functions.invoke('import-scorm', {
          body: formData,
        });
        
        if (error) throw error;
        
        toast({
          title: "Import Started",
          description: "SCORM package import initiated successfully!",
        });
      }
      
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to process the uploaded file.",
        variant: "destructive",
      });
    }
  };

  const handleJSONImport = async (file: File) => {
    try {
      const text = await file.text();
      const courseData = JSON.parse(text);
      
      toast({
        title: "JSON Import",
        description: "JSON course import functionality coming soon!",
      });
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to parse JSON file. Please check the format.",
        variant: "destructive",
      });
    }
  };

  const handleViewTypeChange = (type: ViewType) => {
    setViewType(type);
    localStorage.setItem('courses-view-type', type);
  };

  // Filter courses based on search
  const filteredPlatformCourses = platformCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrgCourses = orgCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics based on user role
  const getStatistics = () => {
    if (isOrgStudent()) {
      const assignedCourses = assignments.length;
      const completedAssignments = assignments.filter(a => a.target.status === 'completed').length;
      const pendingAssignments = assignments.filter(a => a.target.status === 'pending').length;
      const inProgressAssignments = assignments.filter(a => a.target.status === 'started').length;
      
      return {
        assignedCourses,
        completedAssignments,
        pendingAssignments,
        inProgressAssignments,
        progressPercentage: assignedCourses > 0 ? Math.round((completedAssignments / assignedCourses) * 100) : 0
      };
    } else {
      const totalCourses = platformCourses.length + orgCourses.length;
      const publishedCourses = [...platformCourses, ...orgCourses].filter(
        course => course.status === 'published'
      ).length;
      
      return {
        totalCourses,
        platformCoursesCount: platformCourses.length,
        orgCoursesCount: orgCourses.length,
        publishedCourses
      };
    }
  };

  const statistics = getStatistics();

  if (isLoading) {
    return (
      <OrgRequireRole roles={['instructor', 'owner', 'student']}>
        <PageShell>
          <div className="p-6 bg-orange-500/65 border border-orange-400/50 rounded-lg">
            <div className="flex justify-center items-center min-h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/80">Loading course catalog...</p>
              </div>
            </div>
          </div>
        </PageShell>
      </OrgRequireRole>
    );
  }

  if (error) {
    return (
      <OrgRequireRole roles={['instructor', 'owner', 'student']}>
        <PageShell>
          <div className="p-6 bg-orange-500/65 border border-orange-400/50 rounded-lg">
            <div className="text-center">
              <p className="text-white">Error loading catalog: {error.message}</p>
            </div>
          </div>
        </PageShell>
      </OrgRequireRole>
    );
  }

  return (
    <OrgRequireRole roles={['instructor', 'owner', 'student']}>
      <PageShell>
        <div className="p-6 bg-orange-500/65 border border-orange-400/50 rounded-lg">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {isOrgStudent() ? 'My Courses' : 'Course Catalog'}
              </h1>
              <p className="text-white/80">
                {isOrgStudent() 
                  ? 'View your assigned courses and explore available content'
                  : 'Discover and assign courses from our platform and your organization'
                }
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 border border-white/20 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewType === 'grid' ? 'secondary' : 'ghost'}
                  onClick={() => handleViewTypeChange('grid')}
                  className={viewType === 'grid' 
                    ? "h-8 w-8 p-0 bg-white text-orange-600 hover:bg-white/90" 
                    : "h-8 w-8 p-0 bg-transparent text-white hover:bg-white/20"
                  }
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewType === 'list' ? 'secondary' : 'ghost'}
                  onClick={() => handleViewTypeChange('list')}
                  className={viewType === 'list' 
                    ? "h-8 w-8 p-0 bg-white text-orange-600 hover:bg-white/90" 
                    : "h-8 w-8 p-0 bg-transparent text-white hover:bg-white/20"
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewType === 'compact' ? 'secondary' : 'ghost'}
                  onClick={() => handleViewTypeChange('compact')}
                  className={viewType === 'compact' 
                    ? "h-8 w-8 p-0 bg-white text-orange-600 hover:bg-white/90" 
                    : "h-8 w-8 p-0 bg-transparent text-white hover:bg-white/20"
                  }
                >
                  <AlignJustify className="w-4 h-4" />
                </Button>
              </div>
              {!isOrgStudent() && (
                <>
                  <CollectionsDropdown orgId={orgId} />
                  <Button 
                    onClick={handleCreateCourse}
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Course
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleUploadScorm}
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </>
              )}
            </div>
          </header>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {isOrgStudent() ? (
              <>
                <Card className="bg-orange-500/65 border-orange-400/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-white" />
                      <div>
                        <p className="text-sm font-medium text-white">My Assigned Courses</p>
                        <p className="text-2xl font-semibold text-white">{statistics.assignedCourses}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/65 border-orange-400/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-white" />
                      <div>
                        <p className="text-sm font-medium text-white">My Progress</p>
                        <p className="text-2xl font-semibold text-white">{statistics.progressPercentage}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/65 border-orange-400/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-white" />
                      <div>
                        <p className="text-sm font-medium text-white">Pending Assignments</p>
                        <p className="text-2xl font-semibold text-white">{statistics.pendingAssignments}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/65 border-orange-400/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-white" />
                      <div>
                        <p className="text-sm font-medium text-white">Completed</p>
                        <p className="text-2xl font-semibold text-white">{statistics.completedAssignments}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="bg-orange-500/65 border-orange-400/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-white" />
                      <div>
                        <p className="text-sm font-medium text-white">Total Courses</p>
                        <p className="text-2xl font-semibold text-white">{statistics.totalCourses}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/65 border-orange-400/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-white" />
                      <div>
                        <p className="text-sm font-medium text-white">Platform Courses</p>
                        <p className="text-2xl font-semibold text-white">{statistics.platformCoursesCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/65 border-orange-400/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-white" />
                      <div>
                        <p className="text-sm font-medium text-white">Organization Courses</p>
                        <p className="text-2xl font-semibold text-white">{statistics.orgCoursesCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/65 border-orange-400/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-white" />
                      <div>
                        <p className="text-sm font-medium text-white">Published</p>
                        <p className="text-2xl font-semibold text-white">{statistics.publishedCourses}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Search */}
          <div className="flex items-center gap-4 max-w-md mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-8">
          {isOrgStudent() ? (
            <>
              {/* My Assigned Courses */}
              {assignments.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">My Assigned Courses</h2>
                    <Badge variant="secondary">{assignments.length}</Badge>
                  </div>
                  
                  <div className={getResponsiveGridClasses(viewType)}>
                    {assignments.map((assignment) => {
                      // Find the course data from our catalog
                      const course = [...platformCourses, ...orgCourses].find(c => c.id === assignment.resource_id);
                      if (!course) return null;
                      
                      return (
                        <EnhancedCourseCard
                          key={assignment.id}
                          course={toCourseCardModel(course)}
                          actions={createCourseActions(false)}
                          viewType={viewType}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Separator */}
              {assignments.length > 0 && <Separator />}
              
              {/* Available Platform Courses */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Available Platform Courses</h2>
                  <Badge variant="secondary">{filteredPlatformCourses.length}</Badge>
                </div>
                
                {filteredPlatformCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No platform courses available.</p>
                  </div>
                ) : (
                  <div className={
                    viewType === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : viewType === 'list'
                      ? "space-y-4"
                      : "space-y-1"
                  }>
                    {filteredPlatformCourses.map((course) => (
                      <EnhancedCourseCard
                        key={course.id}
                        course={toCourseCardModel(course)}
                        actions={createCourseActions(false)}
                        viewType={viewType}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Platform Courses */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Platform Courses</h2>
                  <Badge variant="secondary">{filteredPlatformCourses.length}</Badge>
                </div>
                
                {filteredPlatformCourses.length === 0 && platformCourses.length > 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No platform courses match your search.</p>
                  </div>
                ) : filteredPlatformCourses.length === 0 ? (
                  <EmptyState type="platform" />
                ) : (
                  <div className={getResponsiveGridClasses(viewType)}>
                    {filteredPlatformCourses.map((course) => (
                      <EnhancedCourseCard
                        key={course.id}
                        course={toCourseCardModel(course)}
                        actions={createCourseActions(false)}
                        viewType={viewType}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <Separator />

              {/* Organization Courses */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Organization Courses</h2>
                  <Badge variant="default">{filteredOrgCourses.length}</Badge>
                </div>
                
                {filteredOrgCourses.length === 0 && orgCourses.length > 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No organization courses match your search.</p>
                  </div>
                ) : filteredOrgCourses.length === 0 ? (
                  <EmptyState 
                    type="organization" 
                    onCreateCourse={handleCreateCourse}
                    onUploadScorm={handleUploadScorm}
                  />
                ) : (
                  <div className={getResponsiveGridClasses(viewType)}>
                    {filteredOrgCourses.map((course) => (
                      <EnhancedCourseCard
                        key={course.id}
                        course={toCourseCardModel(course)}
                        actions={createCourseActions(true)}
                        viewType={viewType}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Course Creation Wizard */}
        {showCreateWizard && !isOrgStudent() && (
          <CourseCreationWizard
            open={showCreateWizard}
            onOpenChange={setShowCreateWizard}
            orgId={orgId}
          />
        )}

        {/* Collection Selection Modal */}
        <CollectionSelectionModal
          isOpen={courseActions.showCollectionModal}
          onClose={() => courseActions.setShowCollectionModal(false)}
          courseId={courseActions.selectedCourse?.id || ''}
          courseTitle={courseActions.selectedCourse?.title || ''}
        />

        {/* Import Dialog */}
        {showImportDialog && !isOrgStudent() && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20">
            <div className="bg-card rounded-lg p-6 w-96 max-w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Import Courses</h3>
              <p className="text-muted-foreground mb-4">
                Upload a ZIP file containing either a SCORM package or native course structure.
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileImport}
                className="hidden"
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowImportDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Debug - Course Statistics:</h3>
            <p className="text-sm text-muted-foreground">
              Platform: {platformCourses.length} | Organization: {orgCourses.length} | Total: {platformCourses.length + orgCourses.length}
              {isOrgStudent() && ` | Assignments: ${assignments.length}`}
            </p>
          </div>
        )}
      </PageShell>
    </OrgRequireRole>
  );
}