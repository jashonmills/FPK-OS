import React from "react";
import { Sheet, SheetContent, SheetFooter, SheetHeader } from "../ui/sheet";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import {
  Plus,
  BookOpen,
  Clock,
  BarChart,
  Star,
  Download,
  Video,
  FileText,
  CheckCircle,
} from "lucide-react";

type Course = {
  id: string;
  name: string;
  subject: string;
  description: string;
  duration: number;
  level: string;
  enrolled: number;
  completion: number;
  rating: number;
  img: string;
  curriculum: {
    title: string;
    type: "video" | "reading" | "quiz";
    duration: number;
  }[];
  teacherResources: { name: string; type: "pdf" | "docx" }[];
  internalReviews: { role: string; rating: number; comment: string }[];
};

interface CourseDetailsSheetProps {
  course: Course | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddToLibrary: (id: string) => void;
  isCourseInLibrary: boolean;
}

export const CourseDetailsSheet: React.FC<CourseDetailsSheetProps> = ({
  course,
  isOpen,
  onOpenChange,
  onAddToLibrary,
  isCourseInLibrary,
}) => {
  if (!course) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-2xl">
        <div className="relative flex-shrink-0">
          <div
            className="h-40 w-full rounded-t-lg bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6), transparent), url(${course.img})`,
            }}
          />
          <div className="absolute bottom-0 left-0 p-6">
            <h2 className="text-2xl font-bold text-white shadow-lg">
              {course.name}
            </h2>
          </div>
        </div>
        <ScrollArea className="flex-grow px-6">
          <div className="space-y-6 pt-4 pb-6">
            <p className="text-slate-600">{course.description}</p>
            <div className="grid grid-cols-2 gap-4 border-y py-4 text-sm text-slate-600 sm:grid-cols-4">
              <div className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4 text-primary-500" />
                <div>
                  <p className="font-semibold text-slate-800">{course.subject}</p>
                  <p className="text-xs">Subject</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-primary-500" />
                <div>
                  <p className="font-semibold text-slate-800">
                    {course.duration} min
                  </p>
                  <p className="text-xs">Duration</p>
                </div>
              </div>
              <div className="flex items-center">
                <BarChart className="mr-2 h-4 w-4 text-primary-500" />
                <div>
                  <p className="font-semibold text-slate-800">{course.level}</p>
                  <p className="text-xs">Level</p>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-yellow-400" />
                <div>
                  <p className="font-semibold text-slate-800">
                    {course.rating.toFixed(1)}
                  </p>
                  <p className="text-xs">Ecosystem Rating</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-slate-800">
                Curriculum Outline
              </h4>
              <Accordion type="single" collapsible className="w-full">
                {course.curriculum.map((item, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="rounded-md px-2 hover:bg-slate-50">
                      <div className="flex items-center text-sm font-medium">
                        {item.type === "video" ? (
                          <Video className="mr-3 h-4 w-4 text-primary-600" />
                        ) : (
                          <FileText className="mr-3 h-4 w-4 text-slate-500" />
                        )}
                        {item.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-2 pb-3 text-sm">
                      <p>
                        Type: <Badge variant="outline">{item.type}</Badge>
                      </p>
                      <p className="mt-2">
                        Estimated Duration: {item.duration} minutes
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-slate-800">
                Teacher Resources
              </h4>
              <div className="space-y-2">
                {course.teacherResources.map((res, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-slate-100/80 p-3 transition-colors hover:bg-slate-200/60"
                  >
                    <div className="flex items-center text-sm font-medium text-slate-700">
                      <FileText className="mr-3 h-4 w-4 text-slate-600" />
                      {res.name}
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-slate-800">
                Internal Peer Reviews
              </h4>
              <div className="space-y-3">
                {course.internalReviews.map((review, index) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">
                        {review.role}
                      </p>
                      <div className="flex items-center text-sm font-bold">
                        <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-500" />
                        {review.rating.toFixed(1)}
                      </div>
                    </div>
                    <p className="mt-2 text-sm italic text-slate-600">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className="bg-white/80 px-6 pb-4 pt-4 backdrop-blur-sm">
          <div className="flex w-full items-center justify-between">
            <div className="space-x-2">
              <Button>Preview as Student</Button>
            </div>
            <Button
              size="lg"
              disabled={isCourseInLibrary}
              onClick={() => onAddToLibrary(course.id)}
              className="bg-primary-600 text-white hover:bg-primary-700"
            >
              {isCourseInLibrary ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  In Library
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Add to Library
                </>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const CourseDetailsSheetSkeleton: React.FC<{ isOpen: boolean }> = ({
  isOpen,
}) => (
  <Sheet open={isOpen}>
    <SheetContent className="flex w-full flex-col sm:max-w-2xl">
      <SheetHeader>
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="mt-4 h-8 w-3/4" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </SheetHeader>
      <div className="flex-grow space-y-6 py-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </SheetContent>
  </Sheet>
);
