import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Star,
  Play,
  MoreHorizontal,
  Calendar,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MyCourses = () => {
  const { t, renderText, tString } = useGlobalTranslation('dashboard');
  const navigate = useNavigate();
  const { getAccessibilityClasses } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Apply accessibility classes
  const containerClasses = getAccessibilityClasses('container');
  const textClasses = getAccessibilityClasses('text');
  const cardClasses = getAccessibilityClasses('card');

  const mockCourses = [
    {
      id: '1',
      title: 'Introduction to React',
      description: 'Learn the basics of React and build your first application.',
      progress: 60,
      status: 'in-progress',
      duration: '4h 30m',
      rating: 4.5,
      students: 120,
    },
    {
      id: '2',
      title: 'Advanced JavaScript Concepts',
      description: 'Dive deep into advanced JavaScript concepts like closures, prototypes, and asynchronous programming.',
      progress: 95,
      status: 'completed',
      duration: '6h 0m',
      rating: 4.8,
      students: 85,
    },
    {
      id: '3',
      title: 'Node.js for Beginners',
      description: 'Get started with Node.js and build server-side applications.',
      progress: 30,
      status: 'in-progress',
      duration: '5h 15m',
      rating: 4.2,
      students: 150,
    },
    {
      id: '4',
      title: 'Python Data Analysis',
      description: 'Explore data analysis with Python using libraries like Pandas and NumPy.',
      progress: 0,
      status: 'not-started',
      duration: '8h 0m',
      rating: 4.7,
      students: 90,
    },
  ];

  return (
    <div className={`p-3 md:p-6 space-y-4 md:space-y-6 ${containerClasses}`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-amber-600 bg-clip-text text-transparent ${textClasses}`}>
            {renderText(t('myCourses.title'))}
          </h1>
          <p className={`text-gray-600 mt-1 text-sm md:text-base ${textClasses}`}>
            {renderText(t('myCourses.description'))}
          </p>
        </div>
        
        <Button className={`gap-2 ${textClasses}`}>
          <BookOpen className="h-4 w-4" />
          Browse Library
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={tString('common.searchPlaceholder', 'Search courses...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 ${textClasses}`}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`gap-2 ${textClasses}`}>
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterStatus('all')}>
              All Courses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('in-progress')}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('not-started')}>
              Not Started
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`fpk-card ${cardClasses}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium text-gray-600 ${textClasses}`}>
                  {renderText(t('stats.activeCourses'))}
                </p>
                <p className={`text-2xl font-bold ${textClasses}`}>3</p>
              </div>
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={`fpk-card ${cardClasses}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium text-gray-600 ${textClasses}`}>
                  {renderText(t('stats.completedCourses'))}
                </p>
                <p className={`text-2xl font-bold ${textClasses}`}>12</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={`fpk-card ${cardClasses}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium text-gray-600 ${textClasses}`}>
                  {renderText(t('stats.studyTime'))}
                </p>
                <p className={`text-2xl font-bold ${textClasses}`}>47h</p>
              </div>
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {mockCourses.map((course) => (
          <Card key={course.id} className={`fpk-card hover:shadow-lg transition-shadow cursor-pointer ${cardClasses}`}>
            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className={`text-lg leading-tight ${textClasses}`}>
                  {course.title}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => navigate(`/dashboard/learner/course/${course.id}`)}>
                      Continue Learning
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Download Materials
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={course.status === 'completed' ? 'default' : 'secondary'} className={textClasses}>
                  {course.status}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span className={textClasses}>{course.duration}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className={`text-sm text-gray-600 line-clamp-2 ${textClasses}`}>
                {course.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={`text-gray-600 ${textClasses}`}>Progress</span>
                  <span className={`font-medium ${textClasses}`}>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className={`text-sm ${textClasses}`}>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className={`text-sm text-gray-600 ${textClasses}`}>{course.students}</span>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  onClick={() => navigate(`/dashboard/learner/course/${course.id}`)}
                  className={`gap-2 ${textClasses}`}
                >
                  <Play className="h-3 w-3" />
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockCourses.length === 0 && (
        <Card className={`fpk-card text-center py-12 ${cardClasses}`}>
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${textClasses}`}>No courses found</h3>
            <p className={`text-gray-600 mb-4 ${textClasses}`}>
              Start your learning journey by browsing our course library.
            </p>
            <Button onClick={() => navigate('/dashboard/learner/library')} className={textClasses}>
              Browse Library
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyCourses;
