import React from 'react';
import { useContextAwareNavigation } from '@/hooks/useContextAwareNavigation';
import CourseHeader from '@/components/course/CourseHeader';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export const VideoProductionCoursePage: React.FC = () => {
  const { goToCourses } = useContextAwareNavigation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <CourseHeader courseTitle="Introduction to Video Production" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={goToCourses}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Introduction to Video Production</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Learn the fundamentals of video production from start to finish in this introductory lesson.
          </p>
        </div>

        {/* Video Player Container */}
        <div className="max-w-6xl mx-auto">
          <div 
            className="rounded-lg overflow-hidden shadow-2xl"
            style={{ padding: '56.25% 0 0 0', position: 'relative' }}
          >
            <iframe 
              src="https://player.vimeo.com/video/798011937?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              title="Introduction to Video Production"
            />
          </div>
        </div>

        {/* Course Info */}
        <div className="max-w-6xl mx-auto mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Duration: ~20 minutes | Provider: FPK University
          </p>
        </div>
      </div>

      {/* Vimeo Player API Script */}
      <script src="https://player.vimeo.com/api/player.js" async />
    </div>
  );
};

export default VideoProductionCoursePage;
