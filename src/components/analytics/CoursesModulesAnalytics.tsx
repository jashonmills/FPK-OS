import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface CoursesModulesAnalyticsProps {
  enrollments?: any[];
}

const CoursesModulesAnalytics: React.FC<CoursesModulesAnalyticsProps> = ({ enrollments }) => {
  // Check if user has any enrollments to show analytics
  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                No Course Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Start a course to see your progress analytics here.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Show general progress for enrolled courses
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {enrollments.slice(0, 6).map((enrollment, index) => {
        const progress = enrollment.progress?.completion_percentage || 0;
        return (
          <Card key={enrollment.course_id || index} className="p-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4" />
                {enrollment.course_id?.replace(/-/g, ' ')?.replace(/\b\w/g, l => l.toUpperCase()) || 'Course'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CoursesModulesAnalytics;