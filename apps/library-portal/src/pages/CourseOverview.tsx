import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { fetchCourseDetail, type CourseDetail, type Lesson } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Streamdown } from "streamdown";

export default function CourseOverview() {
  const params = useParams<{ id: string }>();
  const courseId = params.id!;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await fetchCourseDetail(courseId);
        setCourse(data.course);
        setLessons(data.lessons || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Course</h2>
          <p className="text-muted-foreground mb-4">{error || 'Course not found'}</p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = lessons.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container py-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              {totalLessons} lessons
            </div>
            {course.featured && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Featured
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-5xl">
        {/* Course Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About This Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <Streamdown>{course.description}</Streamdown>
            </div>
          </CardContent>
        </Card>



        {/* Lessons */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Course Content</h2>
          {lessons.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No lessons available for this course yet.
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {lessons.map((lesson) => (
                    <Link key={lesson.id} href={`/course/${courseId}/lesson/${lesson.id}`}>
                      <div className="flex items-center justify-between p-4 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            {lesson.lesson_number}
                          </div>
                          <span className="font-medium">{lesson.title}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
