import React, { useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { OrgRequireRole } from '@/components/organizations/OrgRequireRole';
import { useOrgCatalog } from '@/hooks/useOrgCatalog';
import { EnhancedCourseCard } from '@/components/courses/enhanced/EnhancedCourseCard';
import { EmptyState } from '@/components/courses/enhanced/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Search, 
  Building2, 
  Users, 
  Star, 
  Plus,
  Upload,
  Grid3X3, 
  List
} from 'lucide-react';
import PageShell from '@/components/dashboard/PageShell';
import { CourseCreationWizard } from '@/components/course-builder/CourseCreationWizard';
import { CollectionSelectionModal } from '@/components/collections/CollectionSelectionModal';
import { CollectionsDropdown } from '@/components/collections/CollectionsDropdown';
import { useCourseActions } from '@/hooks/useCourseActions';
import { toCourseCardModel } from '@/models/courseCatalog';
import type { CourseCardActions } from '@/types/enhanced-course-card';

type ViewType = 'grid' | 'list';

export default function OrgCoursesCatalog() {
  const { orgId } = useParams<{ orgId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewType, setViewType] = useState<ViewType>(() => {
    const saved = localStorage.getItem('courses-view-type');
    return (saved as ViewType) || 'grid';
  });
  const { toast } = useToast();

  const { 
    catalog, 
    isLoading, 
    platformCourses, 
    orgCourses,
    error 
  } = useOrgCatalog();

  const courseActions = useCourseActions({
    onCourseCreated: (course) => {
      toast({
        title: "Course Created",
        description: `${course.title} has been created successfully.`,
      });
    },
  });

  // Redirect if no orgId
  if (!orgId) {
    return <Navigate to="/dashboard" replace />;
  }

  // Course Actions for Enhanced Cards
  const createCourseActions = (isOrgCourse: boolean): CourseCardActions => ({
    onPreview: (courseId: string) => {
      const course = [...platformCourses, ...orgCourses].find(c => c.id === courseId);
      courseActions.preview(courseId, course?.route);
    },
    
    onAssign: courseActions.assign,

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
  });

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
    toast({
      title: "SCORM Import",
      description: "SCORM import functionality coming soon!",
    });
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

  const totalCourses = platformCourses.length + orgCourses.length;
  const publishedCourses = [...platformCourses, ...orgCourses].filter(
    course => course.status === 'published'
  ).length;

  if (isLoading) {
    return (
      <OrgRequireRole roles={['instructor', 'owner']}>
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
      <OrgRequireRole roles={['instructor', 'owner']}>
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
    <OrgRequireRole roles={['instructor', 'owner']}>
      <PageShell>
        <div className="p-6 bg-orange-500/65 border border-orange-400/50 rounded-lg">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Course Catalog</h1>
              <p className="text-white/80">
                Discover and assign courses from our platform and your organization
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 border border-white/20 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewType === 'grid' ? 'default' : 'ghost'}
                  onClick={() => handleViewTypeChange('grid')}
                  className="h-8 w-8 p-0 bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewType === 'list' ? 'default' : 'ghost'}
                  onClick={() => handleViewTypeChange('list')}
                  className="h-8 w-8 p-0 bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
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
            </div>
          </header>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-orange-500/65 border-orange-400/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-sm font-medium text-white">Total Courses</p>
                    <p className="text-2xl font-semibold text-white">{totalCourses}</p>
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
                    <p className="text-2xl font-semibold text-white">{platformCourses.length}</p>
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
                    <p className="text-2xl font-semibold text-white">{orgCourses.length}</p>
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
                    <p className="text-2xl font-semibold text-white">{publishedCourses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlatformCourses.map((course) => (
                  <EnhancedCourseCard
                    key={course.id}
                    course={toCourseCardModel(course)}
                    actions={createCourseActions(false)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredOrgCourses.map((course) => (
                  <EnhancedCourseCard
                    key={course.id}
                    course={toCourseCardModel(course)}
                    actions={createCourseActions(true)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Course Creation Wizard */}
        {showCreateWizard && (
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
        {showImportDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 w-96 mx-4">
              <h3 className="text-lg font-semibold mb-4">Import Courses</h3>
              <p className="text-muted-foreground mb-4">
                Upload a SCORM package (.zip) or course definition (.json) file to import courses.
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,.json"
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
              Platform: {platformCourses.length} | Organization: {orgCourses.length} | Total: {totalCourses}
            </p>
          </div>
        )}
      </PageShell>
    </OrgRequireRole>
  );
}