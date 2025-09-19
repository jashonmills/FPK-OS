import React, { useState } from 'react';
import { CourseDraft } from '@/types/course-builder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Book, FileText, Clock, Target, CheckCircle, Users } from 'lucide-react';
import { useOrgCourses } from '@/hooks/useOrgCourses';
import { toast } from 'sonner';

interface ReviewStepProps {
  draft: CourseDraft;
  orgId: string;
  onPublish: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  draft,
  orgId,
  onPublish
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const { createCourse } = useOrgCourses(orgId);

  const totalLessons = draft.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const totalSlides = draft.modules.reduce((acc, module) => 
    acc + module.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.slides.length, 0), 0
  );

  const estimatedDuration = draft.durationEstimateMins || 
    (totalSlides * 2); // Rough estimate of 2 minutes per slide

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await createCourse({
        title: draft.title,
        description: draft.description || '',
        published: false, // Start as draft
        background_image_url: draft.backgroundImageUrl,
        framework: draft.framework,
        lesson_structure: JSON.stringify(draft.modules),
        micro_lesson_data: JSON.stringify({
          objectives: draft.objectives,
          prerequisites: draft.prerequisites,
          level: draft.level,
          slides: draft.modules.flatMap(m => 
            m.lessons.flatMap(l => 
              l.slides.map(s => ({ ...s, moduleId: m.id, lessonId: l.id }))
            )
          )
        }),
        duration_estimate_mins: estimatedDuration,
        objectives: JSON.stringify(draft.objectives || []),
        prerequisites: JSON.stringify(draft.prerequisites || [])
      });

      toast.success('Course created successfully!');
      onPublish();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Review Your Course</h3>
        <p className="text-muted-foreground">
          Review all the details before publishing your interactive micro-learning course.
        </p>
      </div>

      {/* Course Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="w-5 h-5" />
            <span>Course Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg">{draft.title}</h4>
            {draft.description && (
              <p className="text-muted-foreground mt-1">{draft.description}</p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {draft.level && <Badge variant="outline">Level: {draft.level}</Badge>}
            <Badge variant="secondary">
              <Clock className="w-3 h-3 mr-1" />
              {estimatedDuration} minutes
            </Badge>
            <Badge variant="secondary">
              <Book className="w-3 h-3 mr-1" />
              {draft.modules.length} modules
            </Badge>
            <Badge variant="secondary">
              <FileText className="w-3 h-3 mr-1" />
              {totalLessons} lessons
            </Badge>
            <Badge variant="secondary">
              {totalSlides} slides
            </Badge>
          </div>

          {draft.backgroundImageUrl && (
            <div>
              <h5 className="font-medium mb-2">Background Image</h5>
              <div 
                className="w-full h-24 rounded-lg bg-cover bg-center bg-no-repeat border"
                style={{ backgroundImage: `url(${draft.backgroundImageUrl})` }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      {draft.objectives && draft.objectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Learning Objectives</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {draft.objectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-primary" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Prerequisites */}
      {draft.prerequisites && draft.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {draft.prerequisites.map((prerequisite, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Users className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <span>{prerequisite}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Course Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Course Structure</CardTitle>
          <CardDescription>
            Complete structure with {draft.modules.length} modules, {totalLessons} lessons, and {totalSlides} slides
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {draft.modules.map((module, moduleIndex) => (
            <div key={module.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center space-x-2">
                  <Book className="w-4 h-4" />
                  <span>Module {moduleIndex + 1}: {module.title}</span>
                </h4>
                <Badge variant="outline">{module.lessons.length} lessons</Badge>
              </div>
              
              <div className="ml-6 space-y-1">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-3 h-3 text-muted-foreground" />
                      <span>{lesson.title}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {lesson.slides.length} slides
                    </Badge>
                  </div>
                ))}
              </div>
              
              {moduleIndex < draft.modules.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Publish Button */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">Ready to Publish</CardTitle>
          <CardDescription>
            Your course will be created as a draft and will only be visible to your organization. 
            You can publish it later when you're ready for students to access it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handlePublish} 
            disabled={isPublishing}
            size="lg"
            className="w-full"
          >
            {isPublishing ? 'Creating Course...' : 'Create Course'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};