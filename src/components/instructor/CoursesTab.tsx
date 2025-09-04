import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Users, Clock, Plus } from 'lucide-react';

interface CoursesTabProps {
  organizationId: string;
}

export default function CoursesTab({ organizationId }: CoursesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data - will be replaced with real data hooks
  const courses = [
    {
      id: '1',
      title: 'Introduction to Mathematics',
      description: 'Basic math concepts for beginners',
      enrolled: 5,
      duration: 120,
      difficulty: 'Beginner'
    },
    {
      id: '2', 
      title: 'Advanced Reading Comprehension',
      description: 'Improve reading skills and comprehension',
      enrolled: 3,
      duration: 180,
      difficulty: 'Intermediate'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Management</h2>
          <p className="text-muted-foreground">Assign and manage courses for your students</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Assign Course
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <BookOpen className="h-8 w-8 text-primary" />
                <Badge variant="secondary">{course.difficulty}</Badge>
              </div>
              <CardTitle className="text-lg">{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {course.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{course.enrolled} students enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.duration} minutes</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Assign to Students
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {courses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Courses Available</h3>
            <p className="text-muted-foreground mb-4">
              Browse and assign courses to help your students learn effectively.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Browse Course Library
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}