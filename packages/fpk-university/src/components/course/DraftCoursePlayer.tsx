import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, X, Eye, BookOpen, FileText } from 'lucide-react';
import { CourseDraftBackend } from '@/types/course-builder';
import { Progress } from '@/components/ui/progress';

interface DraftCoursePlayerProps {
  draft: CourseDraftBackend;
  onExit: () => void;
}

interface ParsedModule {
  id: string;
  title: string;
  lessons: ParsedLesson[];
}

interface ParsedLesson {
  id: string;
  title: string;
  description?: string;
  slides: ParsedSlide[];
}

interface ParsedSlide {
  id: string;
  kind: string;
  title?: string;
  html?: string;
  mediaUrl?: string;
}

export const DraftCoursePlayer: React.FC<DraftCoursePlayerProps> = ({ draft, onExit }) => {
  const [modules] = useState<ParsedModule[]>(draft.structure.modules || []);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentModule = modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];
  const currentSlide = currentLesson?.slides[currentSlideIndex];

  const totalSlides = modules.reduce((acc, module) => 
    acc + module.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.slides.length, 0), 0
  );

  const getCurrentSlidePosition = () => {
    let position = 0;
    for (let m = 0; m < currentModuleIndex; m++) {
      for (let l = 0; l < modules[m].lessons.length; l++) {
        position += modules[m].lessons[l].slides.length;
      }
    }
    for (let l = 0; l < currentLessonIndex; l++) {
      position += currentModule.lessons[l].slides.length;
    }
    return position + currentSlideIndex + 1;
  };

  const canGoNext = () => {
    if (!currentLesson || !currentModule) return false;
    
    // Check if there's a next slide in current lesson
    if (currentSlideIndex < currentLesson.slides.length - 1) return true;
    
    // Check if there's a next lesson in current module
    if (currentLessonIndex < currentModule.lessons.length - 1) return true;
    
    // Check if there's a next module
    if (currentModuleIndex < modules.length - 1) return true;
    
    return false;
  };

  const canGoPrevious = () => {
    return currentModuleIndex > 0 || currentLessonIndex > 0 || currentSlideIndex > 0;
  };

  const goNext = () => {
    if (!canGoNext()) return;

    // Try next slide first
    if (currentSlideIndex < currentLesson.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      return;
    }

    // Try next lesson
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentSlideIndex(0);
      return;
    }

    // Go to next module
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
      setCurrentSlideIndex(0);
    }
  };

  const goPrevious = () => {
    if (!canGoPrevious()) return;

    // Try previous slide first
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      return;
    }

    // Try previous lesson
    if (currentLessonIndex > 0) {
      const prevLessonIndex = currentLessonIndex - 1;
      const prevLesson = currentModule.lessons[prevLessonIndex];
      setCurrentLessonIndex(prevLessonIndex);
      setCurrentSlideIndex(prevLesson.slides.length - 1);
      return;
    }

    // Go to previous module
    if (currentModuleIndex > 0) {
      const prevModuleIndex = currentModuleIndex - 1;
      const prevModule = modules[prevModuleIndex];
      const lastLesson = prevModule.lessons[prevModule.lessons.length - 1];
      setCurrentModuleIndex(prevModuleIndex);
      setCurrentLessonIndex(prevModule.lessons.length - 1);
      setCurrentSlideIndex(lastLesson.slides.length - 1);
    }
  };

  const currentPosition = getCurrentSlidePosition();
  const progressPercentage = (currentPosition / totalSlides) * 100;

  if (!currentModule || !currentLesson || !currentSlide) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Content Available</h2>
          <p className="text-muted-foreground mb-4">This draft doesn't have any content to preview yet.</p>
          <Button onClick={onExit} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Preview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onExit}>
              <X className="w-4 h-4 mr-2" />
              Exit Preview
            </Button>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
              <Eye className="w-3 h-3 mr-1" />
              DRAFT PREVIEW
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {currentPosition} of {totalSlides}
            </div>
            <div className="w-32">
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Course Info Bar */}
      <div className="bg-muted/30 px-4 py-2 border-b">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="font-medium">{draft.title}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Module {currentModuleIndex + 1}: {currentModule.title}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Lesson {currentLessonIndex + 1}: {currentLesson.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Content Area */}
        <div className="flex-1 p-6">
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <div className="h-full flex flex-col">
                {/* Slide Header */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      {currentSlide.kind}
                    </Badge>
                  </div>
                  {currentSlide.title && (
                    <h1 className="text-2xl font-bold mb-2">{currentSlide.title}</h1>
                  )}
                </div>

                {/* Slide Content */}
                <div className="flex-1 overflow-auto">
                  {currentSlide.html ? (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: currentSlide.html }} 
                    />
                  ) : currentSlide.mediaUrl ? (
                    <div className="flex items-center justify-center h-full">
                      {currentSlide.kind === 'image' ? (
                        <img 
                          src={currentSlide.mediaUrl} 
                          alt={currentSlide.title || 'Slide content'}
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      ) : currentSlide.kind === 'video' ? (
                        <video 
                          src={currentSlide.mediaUrl} 
                          controls 
                          className="max-w-full max-h-full rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">Media content: {currentSlide.mediaUrl}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No content available for this slide.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-muted/20 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Course Structure</h3>
              <div className="space-y-2">
                {modules.map((module, moduleIdx) => (
                  <div key={module.id} className="space-y-1">
                    <div className={`text-sm font-medium p-2 rounded ${
                      moduleIdx === currentModuleIndex ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    }`}>
                      Module {moduleIdx + 1}: {module.title}
                    </div>
                    {moduleIdx === currentModuleIndex && (
                      <div className="ml-4 space-y-1">
                        {module.lessons.map((lesson, lessonIdx) => (
                          <div 
                            key={lesson.id} 
                            className={`text-xs p-1 rounded cursor-pointer ${
                              lessonIdx === currentLessonIndex ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'
                            }`}
                            onClick={() => {
                              setCurrentLessonIndex(lessonIdx);
                              setCurrentSlideIndex(0);
                            }}
                          >
                            Lesson {lessonIdx + 1}: {lesson.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t bg-card p-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={goPrevious} 
            disabled={!canGoPrevious()}
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Slide {currentSlideIndex + 1} of {currentLesson.slides.length} in this lesson
          </div>
          
          <Button 
            onClick={goNext} 
            disabled={!canGoNext()}
            size="sm"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};