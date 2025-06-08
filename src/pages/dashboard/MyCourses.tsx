
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const MyCourses = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600">Manage your enrolled courses and track progress</p>
        </div>
        <Button className="fpk-gradient text-white">
          <Plus className="h-4 w-4 mr-2" />
          Enroll in Course
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search courses..."
            className="pl-10 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="fpk-card border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Yet</h3>
            <p className="text-gray-500 mb-4">You haven't enrolled in any courses. Start your learning journey today!</p>
            <Button className="fpk-gradient text-white">
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyCourses;
