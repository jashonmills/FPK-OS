import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Brain, CheckCircle, PlayCircle, Trophy, ArrowLeft, Users, Lightbulb, Target, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import CourseOverviewVideo from '@/components/course/CourseOverviewVideo';
import VideoPlaylist from '@/components/course/VideoPlaylist';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { useInteractiveCourseProgress } from '@/hooks/useInteractiveCourseProgress';
import { useInteractiveCourseEnrollmentBridge } from '@/hooks/useInteractiveCourseEnrollmentBridge';
import { ErrorBoundary, CourseFallback } from '@/components/common/ErrorBoundary';
import {
  AdditionalResourcesSection,
  StudentGuidesAccordion,
  CourseOverviewAccordion,
  EnhancedCourseInfoAccordion,
  InstructorMaterialsAccordion
} from '@/components/course/resources';

// Import micro-lesson components
import { UnderstandingNeurodiversityMicroLesson } from '@/components/micro-lessons/elt/understanding-neurodiversity/UnderstandingNeurodiversityMicroLesson';
import { ExecutiveFunctioningMicroLesson } from '@/components/micro-lessons/elt/executive-functioning/ExecutiveFunctioningMicroLesson';
import { StudyTechniquesMicroLesson } from '@/components/micro-lessons/elt/study-techniques/StudyTechniquesMicroLesson';
import { StrengthsSelfAdvocacyMicroLesson } from '@/components/micro-lessons/elt/strengths-self-advocacy/StrengthsSelfAdvocacyMicroLesson';
import { RealWorldApplicationMicroLesson } from '@/components/micro-lessons/elt/real-world-application/RealWorldApplicationMicroLesson';
import eltBackground from '@/assets/elt-background.jpg';

const InteractiveELTCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  
  // Define course videos
  const originalVideo = {
    url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/elt-course/intro-video.mp4",
    title: "ELT Course Introduction - Learning for Every Mind"
  };

  const [videos, setVideos] = useState([
    originalVideo,
    {
      url: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/elt-course/module-1-intro.mp4',
      title: 'Module 1: Understanding Your Unique Brain'
    },
    {
      url: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/elt-course/module-2-intro.mp4',
      title: 'Module 2: Executive Functioning Mastery'
    },
    {
      url: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/elt-course/module-3-intro.mp4',
      title: 'Module 3: Study Techniques That Work'
    }
  ]);

  const [currentMainVideo, setCurrentMainVideo] = useState(originalVideo);
  
  // Use analytics and progress hooks
  const courseId = 'elt-empowering-learning-techniques';
  const courseTitle = 'ELT: Empowering Learning Techniques';
  const {
    completedLessons,
    isLessonCompleted,
    calculateProgress,
    getNextLesson,
    getLearningStats,
    saveLessonCompletion
  } = useInteractiveCourseProgress(courseId);
  
  // Bridge old enrollment system with new analytics - delayed
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('🔗 Initializing ELT course enrollment bridge');
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);
  
  useInteractiveCourseEnrollmentBridge();

  // Scroll to top when lesson changes
  useEffect(() => {
    if (currentLesson !== null) {
      window.scrollTo(0, 0);
    }
  }, [currentLesson]);

  const lessons = [
    {
      id: 1,
      title: "Understanding Neurodiversity and Your Unique Brain",
      description: "Discover how your brain works differently and why that's your greatest asset",
      component: UnderstandingNeurodiversityMicroLesson,
      icon: Brain
    },
    {
      id: 2,
      title: "Mastering Executive Functioning Skills",
      description: "Build organizational systems that work with your brain, not against it",
      component: ExecutiveFunctioningMicroLesson,
      icon: Target
    },
    {
      id: 3,
      title: "Effective Study and Information Retention Techniques",
      description: "Learn evidence-based methods tailored for neurodiverse learners",
      component: StudyTechniquesMicroLesson,
      icon: BookOpen
    },
    {
      id: 4,
      title: "Turning Weaknesses into Strengths & Self-Advocacy",
      description: "Transform challenges into competitive advantages and advocate for your needs",
      component: StrengthsSelfAdvocacyMicroLesson,
      icon: Lightbulb
    },
    {
      id: 5,
      title: "Real-World Application and Lifelong Learning",
      description: "Apply your new skills across all areas of life and continue growing",
      component: RealWorldApplicationMicroLesson,
      icon: GraduationCap
    }
  ];

  const handleLessonComplete = async (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      await saveLessonCompletion(lessonId, lesson.title);
    }
  };

  const handleNextLesson = () => {
    if (currentLesson !== null && currentLesson < lessons.length) {
      setCurrentLesson(currentLesson + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToCourses = () => {
    console.log('📍 Navigating back to courses');
    navigate('/dashboard/learner/courses');
  };

  const handleDashboard = () => {
    navigate('/dashboard/learner');
  };

  const handleVideoSwap = (videoUrl: string, title: string) => {
    const clickedVideoIndex = videos.findIndex(v => v.url === videoUrl);
    if (clickedVideoIndex === -1) return;

    const newVideos = [...videos];
    const currentMainIndex = videos.findIndex(v => v.url === currentMainVideo.url);
    
    if (currentMainIndex !== -1) {
      newVideos[clickedVideoIndex] = currentMainVideo;
      newVideos[currentMainIndex] = { url: videoUrl, title };
      setVideos(newVideos);
    }
    
    setCurrentMainVideo({ url: videoUrl, title });
  };

  const isLessonAccessible = (lessonId: number) => {
    return lessonId === 1 || isLessonCompleted(lessonId - 1);
  };

  const overallProgress = calculateProgress(lessons.length);
  const isAllLessonsCompleted = completedLessons.size === lessons.length;
  const learningStats = getLearningStats();

  // Course overview (lesson selection)
  if (currentLesson === null) {
    return (
      <ErrorBoundary fallback={CourseFallback}>
        <VoiceSettingsProvider>
          <InteractiveCourseWrapper
            courseId={courseId}
            courseTitle={courseTitle}
            currentLesson={currentLesson}
            totalLessons={lessons.length}
          >
          <div 
            className="min-h-screen relative"
            style={{
              backgroundImage: `url(${eltBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            <CourseHeader 
              onDashboard={handleDashboard} 
              onBackToCourses={handleBackToCourses}
              courseTitle="ELT: Empowering Learning Techniques"
            />
           
          <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
            {/* Course Title and Description */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground drop-shadow-lg bg-background/80 backdrop-blur-sm rounded-lg p-4 mx-auto inline-block">
                ELT: Empowering Learning Techniques
              </h1>
              <p className="text-xl text-foreground max-w-3xl mx-auto bg-background/80 backdrop-blur-sm rounded-lg p-4 drop-shadow-lg">
                Master evidence-based learning strategies specifically designed for neurodiverse minds. Transform how you learn, study, and succeed in any academic environment.
              </p>
              
              {/* Course badges */}
              <div className="flex justify-center gap-4 flex-wrap">
                <Badge variant="outline" className="text-sm px-3 py-1 bg-background/80 backdrop-blur-sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  5 Modules
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1 bg-background/80 backdrop-blur-sm">
                  <Brain className="w-4 h-4 mr-2" />
                  Evidence-Based
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1 bg-background/80 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Interactive
                </Badge>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {completedLessons.size} of {lessons.length} modules completed
              </p>
              {learningStats.totalTimeSpent > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Total time spent: {Math.floor(learningStats.totalTimeSpent / 60)}h {learningStats.totalTimeSpent % 60}m
                </p>
              )}
            </div>

            {/* Course Introduction Video */}
            <div className="mb-8">
              <CourseOverviewVideo 
                videoUrl={currentMainVideo.url}
                title={currentMainVideo.title}
              />
            </div>

            {/* Video Playlist */}
            <div className="mb-8">
              <VideoPlaylist
                currentMainVideoUrl={currentMainVideo.url}
                onVideoSwap={handleVideoSwap}
                videos={videos.slice(1)}
              />
            </div>

            {/* Voice Controls */}
            <div className="mb-8">
              <CourseOverviewTTS 
                courseTitle="ELT: Empowering Learning Techniques"
                courseDescription="Master evidence-based learning strategies specifically designed for neurodiverse minds. Transform how you learn, study, and succeed in any academic environment."
                lessons={lessons}
              />
            </div>

            {/* Additional Resources Section */}
            <AdditionalResourcesSection>
              {/* StudentGuidesAccordion temporarily removed for content review */}
              {/* 
              <StudentGuidesAccordion 
                guideCount={15}
                courseId="elt-empowering-learning-techniques"
                description="Access comprehensive student guides, worksheets, and self-assessment tools designed for neurodiverse learners."
              />
              */}
              
              <CourseOverviewAccordion
                whyMasterContent={{
                  title: "Why Master ELT?",
                  description: "Master these techniques to unlock your full learning potential and succeed in any academic or professional environment."
                }}
                whatYouMasterContent={{
                  title: "What You'll Master",
                  objectives: [
                    { title: "Self-Awareness", description: "Identify your unique learning style and cognitive strengths" },
                    { title: "Executive Systems", description: "Develop personalized executive functioning systems" },
                    { title: "Study Mastery", description: "Apply evidence-based study techniques for better retention" },
                    { title: "Strength Focus", description: "Transform perceived weaknesses into competitive advantages" },
                    { title: "Self-Advocacy", description: "Build self-advocacy skills for academic and professional success" },
                    { title: "Lifelong Learning", description: "Create sustainable lifelong learning habits" }
                  ]
                }}
              />
              
              <EnhancedCourseInfoAccordion 
                introduction="This comprehensive course uses cutting-edge research in neuroscience and educational psychology to provide learning strategies that work specifically for neurodiverse minds."
                features={[
                  { title: "Evidence-Based Techniques", description: "All strategies are backed by current research in neuroscience and educational psychology" },
                  { title: "Personalized Learning Approaches", description: "Adapt methods to work with your unique brain and learning style" },
                  { title: "Real-World Applications", description: "Practical tools you can use immediately in academic and professional settings" }
                ]}
                modules={[
                  { number: 1, title: "Understanding Neurodiversity", description: "Discover your unique brain and cognitive strengths" },
                  { number: 2, title: "Executive Functioning", description: "Build organizational systems that work with your brain" },
                  { number: 3, title: "Study Techniques", description: "Master evidence-based methods for better learning" },
                  { number: 4, title: "Self-Advocacy", description: "Transform challenges into strengths and advocate effectively" },
                  { number: 5, title: "Real-World Application", description: "Apply your skills for lifelong success" }
                ]}
              />
              
              <InstructorMaterialsAccordion 
                resources={[
                  {
                    title: "Instructor Guide - ELT Teaching Methods",
                    description: "Complete guide for educators on implementing ELT strategies",
                    type: "guide",
                    content: {
                      sections: [
                        {
                          title: "Understanding Neurodiversity in the Classroom",
                          items: [
                            {
                              title: "Recognizing Neurodiverse Learners",
                              description: "Identify signs and characteristics of different learning styles and neurological differences",
                              details: [
                                "ADHD traits: difficulty with sustained attention, hyperactivity, impulsivity",
                                "Dyslexia indicators: reading challenges, phonological processing difficulties",
                                "Autism spectrum traits: sensory sensitivities, need for routine, detail-focused thinking",
                                "Executive function challenges: organization, time management, working memory"
                              ]
                            },
                            {
                              title: "Creating an Inclusive Environment",
                              description: "Strategies for building a classroom that supports all learners",
                              details: [
                                "Flexible seating arrangements and quiet zones",
                                "Clear visual schedules and expectations",
                                "Multiple ways to demonstrate learning",
                                "Sensory-friendly classroom modifications"
                              ]
                            }
                          ]
                        },
                        {
                          title: "Teaching Methodologies",
                          items: [
                            {
                              title: "Multi-Sensory Learning Approaches",
                              description: "Engage multiple senses to enhance learning retention",
                              details: [
                                "Visual: mind maps, diagrams, color-coding systems",
                                "Auditory: recordings, discussions, verbal instructions",
                                "Kinesthetic: hands-on activities, movement breaks",
                                "Tactile: manipulatives, textured materials"
                              ]
                            },
                            {
                              title: "Scaffolding and Support Systems",
                              description: "Provide appropriate levels of support that can be gradually removed",
                              details: [
                                "Break complex tasks into smaller steps",
                                "Provide templates and graphic organizers",
                                "Use peer support and collaborative learning",
                                "Offer multiple check-in points during activities"
                              ]
                            }
                          ]
                        },
                        {
                          title: "Assessment and Progress Monitoring",
                          items: [
                            {
                              title: "Alternative Assessment Methods",
                              description: "Diverse ways to measure student understanding and progress",
                              details: [
                                "Portfolio-based assessments",
                                "Oral presentations instead of written tests",
                                "Project-based demonstrations",
                                "Self-assessment and reflection tools"
                              ]
                            },
                            {
                              title: "Accommodations and Modifications",
                              description: "Adjustments to support neurodiverse learners without changing learning objectives",
                              details: [
                                "Extended time for assignments and tests",
                                "Alternative formats for materials",
                                "Assistive technology integration",
                                "Quiet testing environments"
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  },
                  {
                    title: "Assessment Rubrics and Tools",
                    description: "Comprehensive assessment materials for tracking student progress",
                    type: "resource",
                    content: {
                      rubrics: [
                        {
                          title: "Learning Strategy Implementation Rubric",
                          criteria: [
                            {
                              criterion: "Self-Awareness",
                              excellent: "Consistently identifies personal learning strengths and challenges; effectively articulates learning preferences",
                              proficient: "Usually identifies learning strengths and challenges; can describe most learning preferences", 
                              developing: "Sometimes identifies learning strengths; basic awareness of learning preferences",
                              inadequate: "Rarely identifies learning strengths; minimal awareness of learning preferences"
                            },
                            {
                              criterion: "Strategy Application",
                              excellent: "Independently selects and applies appropriate learning strategies; adapts strategies based on context",
                              proficient: "Usually selects appropriate strategies with minimal guidance; applies strategies consistently",
                              developing: "Sometimes selects appropriate strategies with guidance; inconsistent application",
                              inadequate: "Rarely selects appropriate strategies; requires significant support for application"
                            },
                            {
                              criterion: "Executive Functioning",
                              excellent: "Demonstrates strong organization and time management; effectively plans and monitors progress",
                              proficient: "Shows good organizational skills; usually manages time effectively",
                              developing: "Basic organizational skills; needs some support with time management",
                              inadequate: "Poor organizational skills; requires significant support with time management"
                            },
                            {
                              criterion: "Self-Advocacy",
                              excellent: "Confidently communicates needs; proactively seeks appropriate support and accommodations",
                              proficient: "Usually communicates needs clearly; seeks support when needed",
                              developing: "Sometimes communicates needs; occasionally seeks support",
                              inadequate: "Difficulty communicating needs; rarely seeks support"
                            }
                          ]
                        },
                        {
                          title: "Academic Progress Monitoring Rubric", 
                          criteria: [
                            {
                              criterion: "Information Processing",
                              excellent: "Efficiently processes and synthesizes information from multiple sources; demonstrates deep understanding",
                              proficient: "Processes information well; shows good understanding of material",
                              developing: "Processes information with some support; basic understanding evident",
                              inadequate: "Difficulty processing information; requires significant support for comprehension"
                            },
                            {
                              criterion: "Study Technique Mastery",
                              excellent: "Independently uses various study techniques effectively; adapts methods based on material type",
                              proficient: "Uses several study techniques effectively; some adaptation of methods",
                              developing: "Uses basic study techniques; limited adaptation",
                              inadequate: "Relies on ineffective study methods; needs guidance to use appropriate techniques"
                            },
                            {
                              criterion: "Academic Performance",
                              excellent: "Consistently meets or exceeds academic goals; shows continuous improvement",
                              proficient: "Usually meets academic goals; demonstrates steady progress",
                              developing: "Sometimes meets academic goals; shows some improvement",
                              inadequate: "Rarely meets academic goals; minimal progress evident"
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]}
              />
            </AdditionalResourcesSection>

            {/* Course Introduction */}
            <div className="bg-card p-6 rounded-lg shadow-sm border max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to Empowering Learning Techniques</h2>
              <p className="text-muted-foreground leading-relaxed">
                This comprehensive course is designed specifically for neurodiverse learners who want to unlock their full potential. 
                Based on the latest research in neuroscience and educational psychology, you'll discover evidence-based techniques 
                that work WITH your brain, not against it. Each module builds upon the previous one, creating a complete framework 
                for academic and lifelong success.
              </p>
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {lessons.map((lesson) => {
                const isCompleted = isLessonCompleted(lesson.id);
                const isAccessible = isLessonAccessible(lesson.id);
                const Icon = lesson.icon;

                return (
                  <Card 
                    key={lesson.id}
                    className={`relative transition-all duration-200 cursor-pointer hover:shadow-lg bg-card/65 backdrop-blur-sm border-border ${
                      !isAccessible ? 'opacity-50' : ''
                    } ${isCompleted ? 'border-primary/50' : 'border-border'}`}
                    onClick={() => isAccessible && setCurrentLesson(lesson.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            isCompleted 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                          </div>
                          <div>
                            <Badge variant="outline" className="text-xs">
                              Module {lesson.id}
                            </Badge>
                          </div>
                        </div>
                        {isCompleted && (
                          <Badge variant="default" className="text-xs">
                            Completed
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {lesson.description}
                      </p>
                      <Button 
                        variant={isCompleted ? "secondary" : "default"}
                        className="w-full"
                        disabled={!isAccessible}
                      >
                        {lesson.id === 1 ? "Start Module" : isCompleted ? "Review Module" : isAccessible ? "Start Module" : "Locked"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Completion Message */}
            {isAllLessonsCompleted && (
              <div className="max-w-2xl mx-auto text-center space-y-4 p-6 bg-primary/10 rounded-lg border border-primary/20">
                <Trophy className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-2xl font-bold text-primary">Congratulations! 🎉</h3>
                <p className="text-muted-foreground">
                  You've completed the ELT: Empowering Learning Techniques course. 
                  You're now equipped with evidence-based strategies to excel in any learning environment!
                </p>
                <Button onClick={handleBackToCourses} className="mt-4">
                  Back to My Courses
                </Button>
              </div>
            )}
          </div>
        </div>
        </InteractiveCourseWrapper>
        </VoiceSettingsProvider>
      </ErrorBoundary>
    );
  }

  // Individual lesson view
  const lesson = lessons.find(l => l.id === currentLesson);
  if (!lesson) return null;

  const LessonComponent = lesson.component;
  const hasNext = currentLesson < lessons.length;

  return (
    <ErrorBoundary fallback={CourseFallback}>
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId={courseId}
          courseTitle={courseTitle}
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
        <div 
          className="min-h-screen relative"
          style={{
            backgroundImage: `url(${eltBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Lesson Header */}
          <div className="bg-card/95 backdrop-blur-sm border-b sticky top-0 z-20 relative">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentLesson(null)}
                    className="flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Course
                  </Button>
                  <div>
                    <h1 className="text-xl font-bold">Module {currentLesson}: {lesson.title}</h1>
                    <p className="text-sm text-muted-foreground">ELT: Empowering Learning Techniques</p>
                  </div>
                </div>
                <Badge variant="outline">
                  {currentLesson} of {lessons.length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="container mx-auto px-4 py-8">
            <InteractiveLessonWrapper
              courseId={courseId}
              lessonId={currentLesson}
              lessonTitle={lesson.title}
              onComplete={() => handleLessonComplete(currentLesson)}
              onNext={handleNextLesson}
              hasNext={hasNext}
            >
              <LessonComponent
                onComplete={() => handleLessonComplete(currentLesson)}
                onNext={handleNextLesson}
                hasNext={hasNext}
              />
            </InteractiveLessonWrapper>
          </div>
        </div>
        </InteractiveCourseWrapper>
      </VoiceSettingsProvider>
    </ErrorBoundary>
  );
};

export default InteractiveELTCoursePage;