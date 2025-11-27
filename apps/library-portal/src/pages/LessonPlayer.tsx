import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { fetchLessonDetail, type LessonDetail } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Streamdown } from "streamdown";
import { parseTranscript } from "@/lib/transcriptParser";

export default function LessonPlayer() {
  const params = useParams<{ id: string; lessonId: string }>();
  const courseId = params.id!;
  const lessonId = params.lessonId!;

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [allLessons, setAllLessons] = useState<Array<{ id: string; title: string; lesson_number: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLesson() {
      try {
        const data = await fetchLessonDetail(courseId, lessonId);
        setLesson(data.lesson);
        setCourseTitle(data.course.title);
        setAllLessons(data.allLessons);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Lesson</h2>
          <p className="text-muted-foreground mb-4">{error || 'Lesson not found'}</p>
          <Link href={`/course/${courseId}`}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/course/${courseId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
              <div className="hidden md:block">
                <p className="text-sm text-muted-foreground">{courseTitle}</p>
                <h1 className="font-semibold">{lesson.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="pt-6">
                {/* Mobile title */}
                <div className="md:hidden mb-6">
                  <p className="text-sm text-muted-foreground mb-1">{courseTitle}</p>
                  <h1 className="text-2xl font-bold">{lesson.title}</h1>
                </div>

                {/* Lesson Content */}
                <div className="prose prose-sm max-w-none">
                  <Streamdown>{parseTranscript(lesson.transcript)}</Streamdown>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  {prevLesson ? (
                    <Link href={`/course/${courseId}/lesson/${prevLesson.id}`}>
                      <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {nextLesson ? (
                    <Link href={`/course/${courseId}/lesson/${nextLesson.id}`}>
                      <Button>
                        Next
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/course/${courseId}`}>
                      <Button>
                        Complete Course
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Course Lessons
                </h3>
                <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {allLessons.map((l) => (
                    <Link key={l.id} href={`/course/${courseId}/lesson/${l.id}`}>
                      <div
                        className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                          l.id === lessonId
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {l.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
