import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import empoweringHandwritingBg from '@/assets/empowering-handwriting-bg.jpg';

const EmpoweringLearningHandwritingCoursePage = () => {
  const courseStats = {
    duration: "3 hours",
    students: "1,200+",
    lessons: 10
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div 
        className="relative min-h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${empoweringHandwritingBg})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20">
              <BookOpen className="h-4 w-4" />
              <span>Comprehensive Handwriting Course</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Empowering Learning: <span className="text-blue-300">Handwriting</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Master handwriting techniques through systematic practice and understanding. 
              Develop fluency, readability, and confidence in written communication.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-300" />
                <span>{courseStats.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-300" />
                <span>{courseStats.students} students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-300" />
                <span>{courseStats.lessons} lessons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link 
              to="/dashboard/learner/courses" 
              className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Courses</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <span className="text-white/80 text-sm">Progress: 0%</span>
              <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Course Coming Soon */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="p-8 text-center text-white">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-blue-300" />
              <h2 className="text-2xl font-bold mb-4">Handwriting Course Content</h2>
              <p className="text-gray-200 mb-6">
                Complete handwriting curriculum is being prepared. This will include:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-300">Core Topics:</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Optimal Learning State for Handwriting</li>
                    <li>• Letter Formation Techniques</li>
                    <li>• Spacing and Alignment</li>
                    <li>• Speed and Fluency Development</li>
                    <li>• Legibility Enhancement</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-300">Practice Components:</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Interactive Exercises</li>
                    <li>• Progress Tracking</li>
                    <li>• Assessment Tools</li>
                    <li>• Personalized Feedback</li>
                    <li>• Skill Building Activities</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmpoweringLearningHandwritingCoursePage;