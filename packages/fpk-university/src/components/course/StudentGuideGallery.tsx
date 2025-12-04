import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye, X } from 'lucide-react';
import { toast } from 'sonner';

// Import ELT guide images
import selfAssessmentLearningStyles from '@/assets/elt-guides/self-assessment-learning-styles.jpg';
import cognitiveStrengthsWorksheet from '@/assets/elt-guides/cognitive-strengths-worksheet.jpg';
import brainDifferencesReframing from '@/assets/elt-guides/brain-differences-reframing.jpg';
import pomodoroTemplate from '@/assets/elt-guides/pomodoro-template.jpg';
import organizationSystemsChecklist from '@/assets/elt-guides/organization-systems-checklist.jpg';
import prioritizationMatrix from '@/assets/elt-guides/prioritization-matrix.jpg';
import sq3rMethodGuide from '@/assets/elt-guides/sq3r-method-guide.jpg';
import noteTakingTemplates from '@/assets/elt-guides/note-taking-templates.jpg';
import memoryTechniquesWorkbook from '@/assets/elt-guides/memory-techniques-workbook.jpg';
import spacedRepetitionCalendar from '@/assets/elt-guides/spaced-repetition-calendar.jpg';
import strengthReframingWorksheet from '@/assets/elt-guides/strength-reframing-worksheet.jpg';
import selfAdvocacyScripts from '@/assets/elt-guides/self-advocacy-scripts.jpg';
import academicSuccessPlanner from '@/assets/elt-guides/academic-success-planner.jpg';
import workplaceSkillsGuide from '@/assets/elt-guides/workplace-skills-guide.jpg';
import lifelongLearningTemplate from '@/assets/elt-guides/lifelong-learning-template.jpg';

interface StudentGuide {
  name: string;
  url: string;
  moduleReference: string;
}

// Course-specific student guides
const courseGuides: Record<string, StudentGuide[]> = {
  'geometry': [
    {
      name: "Screenshot 2025-09-15 155424.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 155424.jpg",
      moduleReference: "Module 1 - Lines, Angles & Polygons"
    },
    {
      name: "Screenshot 2025-09-15 155443.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 155443.jpg",
      moduleReference: "Module 1 - Lines, Angles & Polygons"
    },
    {
      name: "Screenshot 2025-09-15 155501.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 155501.jpg",
      moduleReference: "Module 2 - Triangles and Properties"
    },
    {
      name: "Screenshot 2025-09-15 155521.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 155521.jpg",
      moduleReference: "Module 2 - Triangles and Properties"
    },
    {
      name: "Screenshot 2025-09-15 155539.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 155539.jpg",
      moduleReference: "Module 3 - Quadrilaterals and Polygons"
    },
    {
      name: "Screenshot 2025-09-15 155556.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 155556.jpg",
      moduleReference: "Module 3 - Quadrilaterals and Polygons"
    },
    {
      name: "Screenshot 2025-09-15 155640.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 155640.jpg",
      moduleReference: "Module 3 - Quadrilaterals and Polygons"
    },
    {
      name: "Screenshot 2025-09-15 155710.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 155710.jpg",
      moduleReference: "Module 4 - Circles and Circle Properties"
    },
    {
      name: "Screenshot 2025-09-15 155732.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 155732.jpg",
      moduleReference: "Module 4 - Circles and Circle Properties"
    },
    {
      name: "Screenshot 2025-09-15 155751.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 155751.jpg",
      moduleReference: "Module 5 - Transformations in Geometry"
    },
    {
      name: "Screenshot 2025-09-15 160003.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 160003.jpg",
      moduleReference: "Module 5 - Transformations in Geometry"
    },
    {
      name: "Screenshot 2025-09-15 160017.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 160017.jpg",
      moduleReference: "Module 5 - Transformations in Geometry"
    },
    {
      name: "Screenshot 2025-09-15 160035.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 160035.jpg",
      moduleReference: "Module 6 - Three-Dimensional Geometry"
    },
    {
      name: "Screenshot 2025-09-15 160107.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 160107.jpg",
      moduleReference: "Module 6 - Three-Dimensional Geometry"
    },
    {
      name: "Screenshot 2025-09-15 160126.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 160126.jpg",
      moduleReference: "Module 6 - Three-Dimensional Geometry"
    },
    {
      name: "Screenshot 2025-09-15 160146.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 160146.jpg",
      moduleReference: "Module 7 - Coordinate Geometry"
    },
    {
      name: "Screenshot 2025-09-15 160206.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 160206.jpg",
      moduleReference: "Module 7 - Coordinate Geometry"
    },
    {
      name: "Screenshot 2025-09-15 160224.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 160224.jpg",
      moduleReference: "Module 7 - Coordinate Geometry"
    },
    {
      name: "Screenshot 2025-09-15 160456.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 160456.jpg",
      moduleReference: "Module 8 - Vectors and Vector Geometry"
    },
    {
      name: "Screenshot 2025-09-15 160520.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 160520.jpg",
      moduleReference: "Module 8 - Vectors and Vector Geometry"
    },
    {
      name: "Screenshot 2025-09-15 160546.jpg",
      url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/student-guides/Screenshot 2025-09-15 160546.jpg",
      moduleReference: "Module 8 - Vectors and Vector Geometry"
    }
  ],
  'elt-empowering-learning-techniques': [
    {
      name: "Self-Assessment Learning Styles",
      url: selfAssessmentLearningStyles,
      moduleReference: "Module 1 - Understanding Neurodiversity and Your Unique Brain"
    },
    {
      name: "Cognitive Strengths Identification Worksheet",
      url: cognitiveStrengthsWorksheet,
      moduleReference: "Module 1 - Understanding Neurodiversity and Your Unique Brain"
    },
    {
      name: "Brain Differences Reframing Guide",
      url: brainDifferencesReframing,
      moduleReference: "Module 1 - Understanding Neurodiversity and Your Unique Brain"
    },
    {
      name: "Time Management Pomodoro Template",
      url: pomodoroTemplate,
      moduleReference: "Module 2 - Mastering Executive Functioning Skills"
    },
    {
      name: "Organization Systems Checklist",
      url: organizationSystemsChecklist,
      moduleReference: "Module 2 - Mastering Executive Functioning Skills"
    },
    {
      name: "Task Prioritization Matrix Worksheet",
      url: prioritizationMatrix,
      moduleReference: "Module 2 - Mastering Executive Functioning Skills"
    },
    {
      name: "SQ3R Reading Method Guide",
      url: sq3rMethodGuide,
      moduleReference: "Module 3 - Effective Study and Information Retention Techniques"
    },
    {
      name: "Note-Taking Templates (Cornell & Mind Maps)",
      url: noteTakingTemplates,
      moduleReference: "Module 3 - Effective Study and Information Retention Techniques"
    },
    {
      name: "Memory Enhancement Techniques Workbook",
      url: memoryTechniquesWorkbook,
      moduleReference: "Module 3 - Effective Study and Information Retention Techniques"
    },
    {
      name: "Spaced Repetition Planning Calendar",
      url: spacedRepetitionCalendar,
      moduleReference: "Module 3 - Effective Study and Information Retention Techniques"
    },
    {
      name: "Strength Reframing Exercise Worksheet",
      url: strengthReframingWorksheet,
      moduleReference: "Module 4 - Turning Weaknesses into Strengths & Self-Advocacy"
    },
    {
      name: "Self-Advocacy Scripts Template",
      url: selfAdvocacyScripts,
      moduleReference: "Module 4 - Turning Weaknesses into Strengths & Self-Advocacy"
    },
    {
      name: "Academic Success Strategy Planner",
      url: academicSuccessPlanner,
      moduleReference: "Module 5 - Real-World Application and Lifelong Learning"
    },
    {
      name: "Workplace Skills Translation Guide",
      url: workplaceSkillsGuide,
      moduleReference: "Module 5 - Real-World Application and Lifelong Learning"
    },
    {
      name: "Lifelong Learning Plan Template",
      url: lifelongLearningTemplate,
      moduleReference: "Module 5 - Real-World Application and Lifelong Learning"
    }
  ]
};

interface StudentGuideGalleryProps {
  className?: string;
  courseId?: string;
}

export const StudentGuideGallery: React.FC<StudentGuideGalleryProps> = ({ 
  className,
  courseId = 'geometry' // Default to geometry for backward compatibility
}) => {
  const [selectedImage, setSelectedImage] = useState<StudentGuide | null>(null);
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});

  // Get the appropriate guides for this course
  const studentGuides = courseGuides[courseId] || courseGuides['geometry'];

  const handleImageClick = (guide: StudentGuide) => {
    setSelectedImage(guide);
  };

  const handleOpenInNewTab = (guide: StudentGuide) => {
    window.open(guide.url, '_blank');
    toast.success('Student guide opened in new tab');
  };

  const handleImageLoad = (guideName: string) => {
    setImageLoading(prev => ({ ...prev, [guideName]: false }));
  };

  const handleImageLoadStart = (guideName: string) => {
    setImageLoading(prev => ({ ...prev, [guideName]: true }));
  };

  return (
    <>
      <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
        {studentGuides.map((guide) => (
          <div
            key={guide.name}
            className="group relative bg-card rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
              {imageLoading[guide.name] && (
                <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              )}
              <img
                src={guide.url}
                alt={guide.moduleReference}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                onClick={() => handleImageClick(guide)}
                onLoadStart={() => handleImageLoadStart(guide.name)}
                onLoad={() => handleImageLoad(guide.name)}
                onError={() => handleImageLoad(guide.name)}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(guide);
                    }}
                    className="bg-white/90 text-gray-900 hover:bg-white"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenInNewTab(guide);
                    }}
                    className="bg-white/90 text-gray-900 hover:bg-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    New Tab
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-medium text-sm text-foreground mb-1 truncate">
                {guide.moduleReference}
              </h3>
              <p className="text-xs text-muted-foreground">
                Student Guide Resource
              </p>
              
              {/* Action buttons for mobile */}
              <div className="flex gap-2 mt-3 md:hidden">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleImageClick(guide)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenInNewTab(guide)}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  New Tab
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                {selectedImage?.moduleReference}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectedImage && handleOpenInNewTab(selectedImage)}
                className="ml-4"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open in New Tab
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 p-4 pt-2 overflow-hidden">
            {selectedImage && (
              <div className="h-full flex items-center justify-center">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.moduleReference}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};