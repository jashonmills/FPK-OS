import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Link } from "wouter";
import type { Course } from "@/lib/api";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/course/${course.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        {course.asset_path && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={course.asset_path}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2">{course.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {course.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {course.featured && (
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Featured
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
