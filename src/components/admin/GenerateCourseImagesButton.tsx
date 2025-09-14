import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Wand2 } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useNativeCourses } from '@/hooks/useNativeCourses';

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
}

interface NativeCourse {
  id: string;
  title: string;
  summary?: string;
  cover_url?: string;
}

export function GenerateCourseImagesButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { courses: regularCourses, refetch: refetchRegular } = useCourses();
  const { data: nativeCourses = [], refetch: refetchNative } = useNativeCourses();

  const handleGenerateImages = async () => {
    setIsGenerating(true);
    
    try {
      // Get all courses that need images
      const coursesNeedingImages: Course[] = regularCourses.filter(course => !course.thumbnail_url);
      const nativeCoursesNeedingImages: NativeCourse[] = nativeCourses.filter(course => !course.cover_url);
      
      const totalCourses = coursesNeedingImages.length + nativeCoursesNeedingImages.length;
      
      if (totalCourses === 0) {
        toast({
          title: "All set!",
          description: "All courses already have AI-generated images.",
        });
        setIsGenerating(false);
        return;
      }

      toast({
        title: "Generating images...",
        description: `Starting AI image generation for ${totalCourses} courses.`,
      });

      let completed = 0;

      // Generate images for regular courses
      for (const course of coursesNeedingImages) {
        try {
          const { error } = await supabase.functions.invoke('generate-course-images', {
            body: {
              courseId: course.id,
              title: course.title,
              description: course.description || '',
              courseType: 'regular'
            }
          });

          if (error) {
            console.error('Error generating image for course:', course.id, error);
          } else {
            completed++;
            toast({
              title: `Progress: ${completed}/${totalCourses}`,
              description: `Generated image for "${course.title}"`,
            });
          }
        } catch (error) {
          console.error('Error generating image for course:', course.id, error);
        }
      }

      // Generate images for native courses
      for (const course of nativeCoursesNeedingImages) {
        try {
          const { error } = await supabase.functions.invoke('generate-course-images', {
            body: {
              courseId: course.id,
              title: course.title,
              description: course.summary || '',
              courseType: 'native'
            }
          });

          if (error) {
            console.error('Error generating image for native course:', course.id, error);
          } else {
            completed++;
            toast({
              title: `Progress: ${completed}/${totalCourses}`,
              description: `Generated image for "${course.title}"`,
            });
          }
        } catch (error) {
          console.error('Error generating image for native course:', course.id, error);
        }
      }

      // Refresh both course lists
      await Promise.all([refetchRegular(), refetchNative()]);

      toast({
        title: "Image generation complete!",
        description: `Successfully generated ${completed} out of ${totalCourses} course images.`,
      });

    } catch (error) {
      console.error('Error in image generation process:', error);
      toast({
        title: "Generation failed",
        description: "There was an error generating course images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateImages}
      disabled={isGenerating}
      variant="secondary"
      className="w-full sm:w-auto min-h-[44px] touch-manipulation"
    >
      <Wand2 className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
      {isGenerating ? 'Generating Images...' : 'Generate AI Images'}
    </Button>
  );
}