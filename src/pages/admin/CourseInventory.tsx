/**
 * Phase 3: Course Inventory & Diagnostics Page
 * 
 * Admin-only page to view all courses (published, draft, archived)
 * and identify missing content or issues.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  Edit, 
  Search,
  Filter,
  AlertTriangle,
  Loader2,
  Upload
} from 'lucide-react';
import { loadCourseContent } from '@/utils/courseContentLoader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CourseValidation {
  courseId: string;
  hasManifest: boolean;
  manifestLessonCount: number;
  hasBackgroundImage: boolean;
  hasDescription: boolean;
  hasFramework: boolean;
  hasVersion: boolean;
  isReadyToPublish: boolean;
  issues: string[];
}

const CourseInventory: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [contentFilter, setContentFilter] = useState<string>('all');
  const [validationResults, setValidationResults] = useState<Map<string, CourseValidation>>(new Map());
  const [isValidating, setIsValidating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch all courses (including drafts)
  const { courses, isLoading, error, refetch } = useCourses({ 
    includeDrafts: true 
  });

  // Validate manifest-based content for all courses
  useEffect(() => {
    const validateCourses = async () => {
      if (courses.length === 0) return;
      
      setIsValidating(true);
      const results = new Map<string, CourseValidation>();

      for (const course of courses) {
        const validation: CourseValidation = {
          courseId: course.id,
          hasManifest: false,
          manifestLessonCount: 0,
          hasBackgroundImage: !!(course as any).background_image,
          hasDescription: !!course.description,
          hasFramework: !!(course as any).framework_type,
          hasVersion: !!(course as any).content_version,
          isReadyToPublish: false,
          issues: []
        };

        // For v2 courses, check manifest files
        if ((course as any).content_version === 'v2' && course.slug) {
          try {
            const manifest = await loadCourseContent(course.slug);
            if (manifest && manifest.lessons && manifest.lessons.length > 0) {
              validation.hasManifest = true;
              validation.manifestLessonCount = manifest.lessons.length;
            } else {
              validation.issues.push('No manifest content');
            }
          } catch {
            validation.issues.push('Manifest load failed');
          }
        }

        // Check for issues
        if (!validation.hasBackgroundImage) validation.issues.push('No background');
        if (!validation.hasDescription) validation.issues.push('No description');
        if (!validation.hasFramework) validation.issues.push('No framework');
        if (!validation.hasVersion) validation.issues.push('No version');
        
        // Determine if ready to publish
        validation.isReadyToPublish = 
          validation.hasManifest &&
          validation.manifestLessonCount > 0 &&
          validation.hasBackgroundImage &&
          validation.hasDescription &&
          validation.hasFramework &&
          validation.hasVersion;

        results.set(course.id, validation);
      }

      setValidationResults(results);
      setIsValidating(false);
    };

    validateCourses();
  }, [courses]);

  // Filter and search courses
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.slug?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }

    // Content validation filter
    if (contentFilter === 'missing_content') {
      filtered = filtered.filter(course => {
        const validation = validationResults.get(course.id);
        return validation && !validation.isReadyToPublish;
      });
    } else if (contentFilter === 'ready_to_publish') {
      filtered = filtered.filter(course => {
        const validation = validationResults.get(course.id);
        return validation && validation.isReadyToPublish && course.status === 'draft';
      });
    }

    return filtered;
  }, [courses, searchTerm, statusFilter, contentFilter, validationResults]);

  // Statistics
  const stats = useMemo(() => {
    const total = courses.length;
    const published = courses.filter(c => c.status === 'published').length;
    const draft = courses.filter(c => c.status === 'draft').length;
    const archived = courses.filter(c => c.status === 'archived').length;
    const readyToPublish = courses.filter(c => {
      const validation = validationResults.get(c.id);
      return validation && validation.isReadyToPublish && c.status === 'draft';
    }).length;
    const missingContent = courses.filter(c => {
      const validation = validationResults.get(c.id);
      return validation && !validation.isReadyToPublish;
    }).length;

    return { total, published, draft, archived, readyToPublish, missingContent };
  }, [courses, validationResults]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-600">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContentValidation = (course: any) => {
    const validation = validationResults.get(course.id);
    
    if (!validation) {
      return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;
    }

    if (validation.isReadyToPublish) {
      return (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-xs text-green-600 font-medium">Ready</span>
          {validation.manifestLessonCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {validation.manifestLessonCount} lessons
            </Badge>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
        <span className="text-xs text-muted-foreground">{validation.issues.join(', ')}</span>
      </div>
    );
  };

  const handleBulkPublish = async () => {
    const coursesToPublish = courses.filter(c => {
      const validation = validationResults.get(c.id);
      return validation && validation.isReadyToPublish && c.status === 'draft';
    });

    if (coursesToPublish.length === 0) {
      toast({
        title: "No courses ready",
        description: "No draft courses are ready to publish",
        variant: "destructive"
      });
      return;
    }

    setIsPublishing(true);

    try {
      const updates = coursesToPublish.map(course =>
        supabase
          .from('courses')
          .update({ status: 'published' })
          .eq('id', course.id)
      );

      const results = await Promise.all(updates);
      
      const successCount = results.filter(r => !r.error).length;
      const failCount = results.filter(r => r.error).length;

      if (successCount > 0) {
        toast({
          title: "Courses published",
          description: `Successfully published ${successCount} course(s)${failCount > 0 ? `, ${failCount} failed` : ''}`,
        });
        refetch();
      } else {
        toast({
          title: "Publish failed",
          description: "Failed to publish courses",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Bulk publish error:', error);
      toast({
        title: "Error",
        description: "An error occurred while publishing courses",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading course inventory...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
            <h2 className="text-2xl font-bold">Error Loading Inventory</h2>
            <p className="text-muted-foreground">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Course Inventory & Diagnostics</h1>
        <p className="text-muted-foreground">
          View all courses, identify issues, and manage content.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Ready to Publish</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.readyToPublish}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.archived}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.missingContent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Publish Button */}
      {stats.readyToPublish > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  {stats.readyToPublish} course{stats.readyToPublish !== 1 ? 's' : ''} ready to publish
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  All content validated and ready for production
                </p>
              </div>
              <Button 
                onClick={handleBulkPublish} 
                disabled={isPublishing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Publish All ({stats.readyToPublish})
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={contentFilter} onValueChange={setContentFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Content" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="ready_to_publish">Ready to Publish</SelectItem>
                <SelectItem value="missing_content">Missing Content</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Courses ({filteredCourses.length})</CardTitle>
          <CardDescription>
            All courses in the system with content validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slug</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No courses found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-mono text-xs">{course.slug || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{getStatusBadge(course.status || 'draft')}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {(course as any).framework_type || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {(course as any).content_version || 'N/A'}
                    </TableCell>
                    <TableCell>{getContentValidation(course)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {course.updated_at 
                        ? new Date(course.updated_at).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/courses/player/${course.slug}?preview=true`)}
                        disabled={!course.slug}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/course-manager`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseInventory;
