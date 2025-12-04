import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, Microscope, Atom, Zap, Dna } from 'lucide-react';

export const InteractiveScienceCourseCard: React.FC = () => {
  const navigate = useNavigate();

  const handleStartCourse = () => {
    navigate('/courses/interactive-science/1');
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 border-blue-100 hover:border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            New Course
          </Badge>
          <div className="flex space-x-1">
            <Microscope className="h-4 w-4 text-green-500" />
            <Atom className="h-4 w-4 text-red-500" />
            <Zap className="h-4 w-4 text-yellow-500" />
            <Dna className="h-4 w-4 text-purple-500" />
          </div>
        </div>
        
        <CardTitle className="text-xl mb-2 text-gray-900">
          Introduction to Science
        </CardTitle>
        
        <CardDescription className="text-gray-600 leading-relaxed">
          Get to grips with the basics of biology, chemistry, and physics. Learn the scientific method and explore the building blocks of life and matter.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">12 Lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-gray-600">~6 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            <span className="text-gray-600">Beginner</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-yellow-500" />
            <span className="text-gray-600">Certificate</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-gray-900 text-sm">What you'll learn:</h4>
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>Scientific method and critical thinking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Cell structure and genetics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              <span>Atoms, molecules, and periodic table</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
              <span>Forces, motion, and energy</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleStartCourse}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-[1.02]"
        >
          Start Learning Science
        </Button>
      </CardContent>
    </Card>
  );
};