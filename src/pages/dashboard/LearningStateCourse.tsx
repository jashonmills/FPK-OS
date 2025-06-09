
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

const LearningStateCourse = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Course Overview Section */}
      <div className="bg-white border-b p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Learning State</h1>
              <Badge className="fpk-gradient text-white">Beta</Badge>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 mb-6">
            Master your learning mindset and develop effective study strategies with our flagship beta course.
          </p>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Outline</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Introduction to Learning State
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Cognitive Load Theory
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Attention and Focus
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Memory and Retention
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Metacognition
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Embedded Course Player */}
      <div className="flex-1 relative">
        <iframe
          src="https://preview--course-start-kit-react.lovable.app/"
          title="Learning State Course Player"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default LearningStateCourse;
