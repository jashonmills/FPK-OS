
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

const LearningStateCourse = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const overviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overview = overviewRef.current;
    if (!overview) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCollapsed(!entry.isIntersecting);
      },
      { 
        rootMargin: '-48px 0px 0px 0px' // Matches sticky header height
      }
    );

    observer.observe(overview);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header Bar - always visible when collapsed */}
      <div 
        className="sticky top-0 z-20 fpk-gradient transition-all duration-300 ease-in-out"
        style={{
          height: '48px',
          opacity: isCollapsed ? 1 : 0,
          visibility: isCollapsed ? 'visible' : 'hidden',
        }}
      >
        <div className="flex items-center gap-3 px-6 h-full">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">Learning State</h1>
          <Badge className="bg-white/20 text-white border-white/30">Beta</Badge>
        </div>
      </div>

      {/* Course Overview Section - slides behind header when scrolled */}
      <div 
        ref={overviewRef}
        className="bg-white border-b relative z-10 transition-all duration-300 ease-in-out"
        style={{
          opacity: isCollapsed ? 0 : 1,
          transform: isCollapsed ? 'translateY(-100%)' : 'translateY(0)',
          pointerEvents: isCollapsed ? 'none' : 'auto',
        }}
      >
        <div className="max-w-4xl mx-auto p-6">
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

      {/* Embedded Course Player - fills remaining viewport space */}
      <div 
        className="relative"
        style={{
          height: 'calc(100vh - 48px)', // Account for sticky header
          width: '100%'
        }}
      >
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
