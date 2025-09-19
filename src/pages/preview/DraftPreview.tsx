import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Clock, Edit, Eye } from 'lucide-react';
import { CourseDraftBackend } from '@/types/course-builder';
import { DraftCoursePlayer } from '@/components/course/DraftCoursePlayer';

export default function DraftPreview() {
  const { draftId } = useParams<{ draftId: string }>();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<CourseDraftBackend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    if (!draftId) {
      setError('Draft ID not provided');
      setLoading(false);
      return;
    }

    loadDraft();
  }, [draftId]);

  const loadDraft = async () => {
    try {
      // Get current user to ensure authentication
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please log in to view this draft');
        return;
      }

      const { data: draft, error } = await supabase
        .from('course_drafts')
        .select('*')
        .eq('id', draftId)
        .single();

      if (error) {
        throw error;
      }

      if (!draft) {
        setError('Draft not found');
      } else {
        // Type-safe conversion of the draft data
        const typedDraft: CourseDraftBackend = {
          ...draft,
          structure: draft.structure as any, // Safe since we know the structure from the database
          source: draft.source as 'scorm' | 'manual' | 'json' | 'csv',
          level: draft.level as 'intro' | 'intermediate' | 'advanced' | undefined,
          framework: draft.framework as 'interactive_micro_learning' | 'sequential_learning',
          status: draft.status as 'parsing' | 'ready' | 'error',
          validation: draft.validation as { errors: string[]; warnings: string[]; }
        };
        setDraft(typedDraft);
      }
    } catch (err) {
      console.error('Error loading draft:', err);
      setError('Failed to load course draft');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading draft preview...</p>
        </div>
      </div>
    );
  }

      if (error || !draft) {
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
              <p className="text-muted-foreground mb-6">
                Please log in to view this course draft.
              </p>
              <div className="space-y-2">
                <Button onClick={() => navigate('/login')} className="w-full">
                  Sign In
                </Button>
                <Button onClick={() => navigate(-1)} variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        );
      }

  if (showPlayer) {
    return <DraftCoursePlayer draft={draft} onExit={() => setShowPlayer(false)} />;
  }

  const totalLessons = draft.structure.modules?.reduce((acc: number, module: any) => acc + (module.lessons?.length || 0), 0) || 0;
  const totalSlides = draft.structure.modules?.reduce((acc: number, module: any) => 
    acc + (module.lessons?.reduce((lessonAcc: number, lesson: any) => lessonAcc + (lesson.slides?.length || 0), 0) || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                <Eye className="w-3 h-3 mr-1" />
                DRAFT PREVIEW
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/org/${draft.org_id}/course-builder/${draft.id}`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Course
            </Button>
          </div>
        </div>
      </div>

      {/* Course Hero */}
      <div className="relative">
        <div 
          className="h-64 bg-cover bg-center relative"
          style={{ 
            backgroundImage: draft.structure.backgroundImageUrl 
              ? `url(${draft.structure.backgroundImageUrl})` 
              : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-variant)) 100%)'
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="container mx-auto px-4 h-full relative z-10 flex items-end">
            <div className="text-white pb-8">
              <h1 className="text-3xl font-bold mb-2">{draft.title}</h1>
              <div className="flex items-center space-x-4 text-sm">
                {draft.duration_minutes && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{draft.duration_minutes} minutes</span>
                  </div>
                )}
                <Badge variant="secondary" className="capitalize">
                  {draft.level || 'Beginner'}
                </Badge>
                <Badge variant="outline" className="text-white border-white/50">
                  {draft.framework.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Course Overview</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {draft.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {draft.description}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{draft.structure.modules?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Modules</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{totalLessons}</div>
                  <div className="text-sm text-muted-foreground">Lessons</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{totalSlides}</div>
                  <div className="text-sm text-muted-foreground">Slides</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{draft.duration_minutes || 30}</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
              </div>

              {draft.structure.objectives && draft.structure.objectives.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Learning Objectives</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {draft.structure.objectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t pt-6">
                <div className="bg-gradient-to-r from-primary/10 to-primary-variant/10 rounded-lg p-6 text-center">
                  <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Ready to Experience Your Course?</h3>
                  <p className="text-muted-foreground mb-4">
                    Start the full course experience to see exactly how students will interact with your content.
                  </p>
                  <Button onClick={() => setShowPlayer(true)} size="lg">
                    <Eye className="w-4 h-4 mr-2" />
                    Start Course Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Structure */}
          {draft.structure.modules && draft.structure.modules.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Course Structure</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {draft.structure.modules.map((module: any, index: number) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Module {index + 1}: {module.title}</h3>
                      <Badge variant="outline">{module.lessons?.length || 0} lessons</Badge>
                    </div>
                    {module.lessons && module.lessons.length > 0 && (
                      <div className="ml-4 space-y-1">
                        {module.lessons.map((lesson: any, lessonIndex: number) => (
                          <div key={lesson.id} className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Lesson {lessonIndex + 1}: {lesson.title}</span>
                            <Badge variant="secondary" className="text-xs">
                              {lesson.slides?.length || 0} slides
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}