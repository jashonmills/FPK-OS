
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { useUserRole } from '@/hooks/useUserRole';
import DualLanguageText from '@/components/DualLanguageText';

const CourseManager = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { courses, isLoading, error, refetch } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect if not admin
  if (!roleLoading && !isAdmin) {
    return (
      <div className="p-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-500 mb-4">
              You don't have permission to access the admin panel.
            </p>
            <Button onClick={() => navigate('/dashboard/learner')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={variants[status] || variants.draft}>
        {status || 'draft'}
      </Badge>
    );
  };

  if (roleLoading || isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Manager</h1>
          <p className="text-gray-600">
            Manage courses, modules, and content for your learning platform
          </p>
        </div>
        <Button 
          className="fpk-gradient text-white"
          onClick={() => navigate('/admin/courses/new')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white"
        />
      </div>

      {/* Courses Grid */}
      {error ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Courses</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      ) : filteredCourses.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No Matching Courses' : 'No Courses Yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first course to get started'
              }
            </p>
            {!searchTerm && (
              <Button 
                className="fpk-gradient text-white"
                onClick={() => navigate('/admin/courses/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Course
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(course.status || 'draft')}
                      {course.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {course.thumbnail_url && (
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                
                {course.description && (
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {course.description}
                  </p>
                )}
                
                <div className="space-y-2 text-sm text-gray-500">
                  {course.instructor_name && (
                    <div>Instructor: {course.instructor_name}</div>
                  )}
                  {course.duration_minutes && (
                    <div>Duration: {course.duration_minutes} minutes</div>
                  )}
                  {course.difficulty_level && (
                    <div>Level: {course.difficulty_level}</div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/courses/${course.slug || course.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/courses/${course.slug || course.id}/modules`)}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Modules
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/learner/course/${course.slug || course.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseManager;
