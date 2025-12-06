import React, { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Progress } from "../../components/ui/progress";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Search,
  Plus,
  Users,
  BookOpen,
  Star,
  EyeOff,
  LayoutGrid,
  List,
  ArrowDown,
  ArrowUp,
  TrendingUp,
  Zap,
  GitBranch,
} from "lucide-react";
import {
  CourseDetailsSheet,
  CourseDetailsSheetSkeleton,
} from "../../components/dashboard/CourseDetailsSheet";
import { CourseBuilder } from "../../components/dashboard/CourseBuilder";

const fpkUniversityCatalog = [
  {
    id: "FPK-NUM-01",
    name: "Empowering Learning: Numeracy (Extended)",
    subject: "Math",
    description:
      "Master mathematics through visual memory techniques and number triangles - Extended version with deep dives and assessments.",
    duration: 120,
    level: "Intermediate",
    enrolled: 88,
    completion: 23,
    rating: 4.5,
    img: "https://placehold.co/600x400/16a34a/FFFFFF/png?text=Numeracy",
    curriculum: [
      { title: "Intro to Visual Memory", type: "video" as const, duration: 15 },
      { title: "Number Triangles", type: "reading" as const, duration: 20 },
    ],
    teacherResources: [
      { name: "Lesson_Plan_Numeracy.pdf", type: "pdf" as const },
    ],
    internalReviews: [
      {
        role: "Curriculum Director, NY",
        rating: 5,
        comment: "A game-changer for our elementary students.",
      },
    ],
  },
  {
    id: "FPK-READ-01",
    name: "EL Reading",
    subject: "ELA",
    description:
      "Master reading through optimal learning states and proper positioning. A focused 4-lesson program with video and audio support.",
    duration: 60,
    level: "Beginner",
    enrolled: 152,
    completion: 78,
    rating: 4.8,
    img: "https://placehold.co/600x400/2563eb/FFFFFF/png?text=Reading",
    curriculum: [
      { title: "Optimal Learning State", type: "video" as const, duration: 10 },
      { title: "Proper Positioning", type: "reading" as const, duration: 15 },
    ],
    teacherResources: [{ name: "Reading_Guide.pdf", type: "pdf" as const }],
    internalReviews: [
      {
        role: "Literacy Coach, CA",
        rating: 4.5,
        comment: "Very effective for struggling readers.",
      },
    ],
  },
  {
    id: "FPK-SCI-8.3",
    name: "Environmental Science",
    subject: "Science",
    description:
      "Explore the intricate connections within Earth's ecosystems, understand human impact, and learn about sustainable solutions.",
    duration: 90,
    level: "Beginner",
    enrolled: 110,
    completion: 45,
    rating: 4.2,
    img: "https://placehold.co/600x400/ca8a04/FFFFFF/png?text=Enviro-Sci",
    curriculum: [
      { title: "Ecosystems 101", type: "video" as const, duration: 20 },
      { title: "Human Impact", type: "quiz" as const, duration: 10 },
    ],
    teacherResources: [{ name: "Lab_Safety.pdf", type: "pdf" as const }],
    internalReviews: [
      {
        role: "Science Dept. Head, TX",
        rating: 4,
        comment: "Good intro, could use more advanced labs.",
      },
    ],
  },
  {
    id: "FPK-CHEM-8.2",
    name: "Chemistry",
    subject: "Science",
    description:
      "Dive deeper into chemistry by exploring the periodic table, chemical reactions, and the building blocks of matter.",
    duration: 100,
    level: "Intermediate",
    enrolled: 76,
    completion: 15,
    rating: 3.9,
    img: "https://placehold.co/600x400/dc2626/FFFFFF/png?text=Chemistry",
    curriculum: [
      { title: "The Periodic Table", type: "video" as const, duration: 25 },
      { title: "Balancing Equations", type: "reading" as const, duration: 30 },
    ],
    teacherResources: [
      { name: "Periodic_Table_Chart.pdf", type: "pdf" as const },
    ],
    internalReviews: [
      {
        role: "AP Chem Teacher, FL",
        rating: 4,
        comment: "Solid foundation for our pre-AP students.",
      },
    ],
  },
];

type Course = (typeof fpkUniversityCatalog)[0];

const AnalyticsDashboardTab: React.FC<{ libraryCourses: Course[] }> = ({
  libraryCourses,
}) => {
  const totalEnrolled = libraryCourses.reduce(
    (sum, course) => sum + course.enrolled,
    0
  );
  const avgCompletion =
    libraryCourses.length > 0
      ? libraryCourses.reduce((sum, course) => sum + course.completion, 0) /
        libraryCourses.length
      : 0;
  const avgRating =
    libraryCourses.length > 0
      ? libraryCourses.reduce((sum, course) => sum + course.rating, 0) /
        libraryCourses.length
      : 0;

  const highest = [...libraryCourses]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  const lowest = [...libraryCourses]
    .sort((a, b) => a.rating - b.rating)
    .slice(0, 3);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {libraryCourses.length}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Enrollments
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {totalEnrolled.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Avg. Completion
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {avgCompletion.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Avg. Rating
            </CardTitle>
            <Star className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {avgRating.toFixed(1)}
              <span className="text-lg text-slate-400"> / 5.0</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">
              Highest Rated Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {highest.map((course) => (
              <div
                key={course.id}
                className="flex items-center rounded-md p-2 transition-colors hover:bg-slate-50"
              >
                <div className="flex-grow">
                  <p className="font-semibold text-slate-700">{course.name}</p>
                  <p className="text-sm text-slate-500">{course.subject}</p>
                </div>
                <div className="flex items-center font-bold text-green-600">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {course.rating.toFixed(1)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">
              Lowest Rated Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowest.map((course) => (
              <div
                key={course.id}
                className="flex items-center rounded-md p-2 transition-colors hover:bg-slate-50"
              >
                <div className="flex-grow">
                  <p className="font-semibold text-slate-700">{course.name}</p>
                  <p className="text-sm text-slate-500">{course.subject}</p>
                </div>
                <div className="flex items-center font-bold text-red-600">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  {course.rating.toFixed(1)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CourseListItem: React.FC<{
  course: Course;
  onRowClick: (c: Course) => void;
  onToggleFavorite: (id: string) => void;
  onHide: (id: string) => void;
  isFavorited: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}> = ({
  course,
  onRowClick,
  onToggleFavorite,
  onHide,
  isFavorited,
  isSelected,
  onToggleSelect,
}) => (
  <div
    className={`flex items-center rounded-lg border bg-white p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-lg ${
      isSelected ? "border-primary-500 shadow-md" : "border-slate-200 shadow-sm"
    }`}
  >
    <div
      className="flex items-center px-3"
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelect(course.id)}
      />
    </div>
    <div
      className="flex flex-grow cursor-pointer items-center py-1"
      onClick={() => onRowClick(course)}
    >
      <img
        src={course.img}
        alt={course.name}
        className="mr-4 h-10 w-16 rounded-md object-cover"
      />
      <div className="flex-grow">
        <h4 className="font-semibold text-slate-800">{course.name}</h4>
        <p className="text-sm text-slate-500">
          {course.subject} &bull; {course.level}
        </p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mx-4 flex items-center space-x-2">
              <Progress value={course.completion} className="h-1.5 w-24" />
              <span className="w-8 text-xs font-semibold text-slate-600">
                {course.completion}%
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Average completion rate by all students in the FPK ecosystem.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div className="flex items-center space-x-1 pr-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(course.id);
              }}
            >
              <Star
                className={`h-5 w-5 transition-colors ${
                  isFavorited
                    ? "fill-yellow-400 text-yellow-500"
                    : "text-slate-400 hover:text-yellow-400"
                }`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Favorite</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onHide(course.id);
              }}
            >
              <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hide from Catalog</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
);

const CurationWorkbench: React.FC<{
  courses: Course[];
  onRowClick: (c: Course) => void;
  favoritedIds: Set<string>;
  onToggleFavorite: (id: string) => void;
  onHide: (id: string) => void;
  title: string;
  description: string;
}> = ({
  courses,
  onRowClick,
  favoritedIds,
  onToggleFavorite,
  onHide,
  title,
  description,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleSelectAll = () => {
    if (selectedIds.size === courses.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(courses.map((c) => c.id)));
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-slate-600">{description}</p>
        </div>
      </header>
      <div className="mb-3 flex items-center justify-between rounded-lg border-b bg-slate-100/80 p-2">
        <div className="flex items-center pl-3">
          <Checkbox
            checked={selectedIds.size > 0 && selectedIds.size === courses.length}
            onCheckedChange={toggleSelectAll}
          />
        </div>
        <div className="ml-20 flex-grow">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-600">
            Course
          </p>
        </div>
        <div className="w-36">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-600">
            Avg. Completion
          </p>
        </div>
        <div className="w-28">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-600">
            Actions
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {courses.map((course) => (
          <CourseListItem
            key={course.id}
            course={course}
            onRowClick={onRowClick}
            onToggleFavorite={onToggleFavorite}
            onHide={onHide}
            isFavorited={favoritedIds.has(course.id)}
            isSelected={selectedIds.has(course.id)}
            onToggleSelect={toggleSelect}
          />
        ))}
      </div>
    </div>
  );
};

const CustomCoursesTab: React.FC<{ onLaunchBuilder: () => void }> = ({
  onLaunchBuilder,
}) => (
  <div className="animate-fade-in">
    <header className="mb-6">
      <h2 className="text-2xl font-bold text-slate-900">Authoring Studio</h2>
      <p className="mt-1 text-slate-600">
        Create your own curriculum from scratch or import existing content.
      </p>
    </header>
    <div className="mt-8 grid gap-8 md:grid-cols-2">
      <Card className="transition-all hover:-translate-y-1 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-3 h-5 w-5 text-primary-600" />
            Create a Standard Course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-slate-600">
            Build a traditional, linear course with lessons, videos, and quizzes.
            Perfect for structured learning paths.
          </p>
          <Button
            onClick={onLaunchBuilder}
            className="w-full bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Start Building
          </Button>
        </CardContent>
      </Card>
      <Card className="transition-all hover:-translate-y-1 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-3 h-5 w-5 text-amber-500" />
            Create an Adaptive Course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-slate-600">
            Design a dynamic, non-linear experience that adapts to student
            performance. (Coming Soon)
          </p>
          <Button disabled className="w-full">
            <GitBranch className="mr-2 h-4 w-4" />
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
    <div className="mt-12 rounded-lg bg-slate-100/80 p-6 text-center">
      <h3 className="font-semibold text-slate-800">
        Have existing SCORM or xAPI content?
      </h3>
      <p className="mt-2 text-slate-600">
        You can import your existing course packages directly into the FPK OS.
      </p>
      <Button className="mt-4">
        Upload a Package
      </Button>
    </div>
  </div>
);

export const CoursesPage: React.FC = () => {
  const [libraryCourseIds, setLibraryCourseIds] = useState<Set<string>>(
    new Set(["FPK-READ-01"])
  );
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(
    new Set(["FPK-NUM-01"])
  );
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isBuilding, setIsBuilding] = useState(false);

  const toggleFavorite = (id: string) =>
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const hideCourse = (id: string) =>
    setHiddenIds((prev) => new Set(prev).add(id));
  const addToLibrary = (id: string) => {
    setLibraryCourseIds((prev) => new Set(prev).add(id));
  };

  const libraryCourses = useMemo(
    () => fpkUniversityCatalog.filter((c) => libraryCourseIds.has(c.id)),
    [libraryCourseIds]
  );
  const catalogCourses = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return fpkUniversityCatalog.filter(
      (c) =>
        !hiddenIds.has(c.id) &&
        (c.name.toLowerCase().includes(term) ||
          c.subject.toLowerCase().includes(term))
    );
  }, [hiddenIds, searchTerm]);

  if (isBuilding) {
    return <CourseBuilder onClose={() => setIsBuilding(false)} />;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Courses & Curriculum
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Oversee your institution&apos;s entire curriculum ecosystem, from
            analytics to authoring.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search catalog..."
              className="w-64 bg-white pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-1 rounded-lg bg-slate-200/80 p-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button className="bg-primary-600 text-white hover:bg-primary-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </div>
      </header>
      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-lg bg-slate-100/80 p-1">
          <TabsTrigger value="analytics" className="py-2 text-sm font-semibold">
            Analytics Dashboard
          </TabsTrigger>
          <TabsTrigger value="library" className="py-2 text-sm font-semibold">
            Institution Library
          </TabsTrigger>
          <TabsTrigger value="catalog" className="py-2 text-sm font-semibold">
            FPK University Catalog
          </TabsTrigger>
          <TabsTrigger value="custom" className="py-2 text-sm font-semibold">
            Custom Course Builder
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 rounded-xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur">
          <TabsContent value="analytics">
            <AnalyticsDashboardTab libraryCourses={libraryCourses} />
          </TabsContent>

          <TabsContent value="library">
            <CurationWorkbench
              courses={libraryCourses}
              onRowClick={setSelectedCourse}
              title="Institution Library"
              description="All courses currently approved for use in your institution."
              favoritedIds={favoritedIds}
              onToggleFavorite={toggleFavorite}
              onHide={hideCourse}
            />
          </TabsContent>

          <TabsContent value="catalog">
            <CurationWorkbench
              courses={catalogCourses}
              onRowClick={setSelectedCourse}
              title="FPK University Catalog"
              description="Discover and approve ready-made courses for your library."
              favoritedIds={favoritedIds}
              onToggleFavorite={toggleFavorite}
              onHide={hideCourse}
            />
          </TabsContent>

          <TabsContent value="custom">
            <CustomCoursesTab onLaunchBuilder={() => setIsBuilding(true)} />
          </TabsContent>
        </div>
      </Tabs>

      {selectedCourse ? (
        <CourseDetailsSheet
          isOpen={!!selectedCourse}
          onOpenChange={(isOpen) => !isOpen && setSelectedCourse(null)}
          course={selectedCourse}
          onAddToLibrary={addToLibrary}
          isCourseInLibrary={libraryCourseIds.has(selectedCourse.id)}
        />
      ) : (
        <CourseDetailsSheetSkeleton isOpen={false} />
      )}
    </div>
  );
};

export default CoursesPage;
