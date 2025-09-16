import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NumeracyIntroductionLesson } from '@/components/course/numeracy-lessons/NumeracyIntroductionLesson';
import { NumeracyOptimalLearningStateLesson } from '@/components/course/numeracy-lessons/NumeracyOptimalLearningStateLesson';
import { NumeracyNumberShapesLesson } from '@/components/course/numeracy-lessons/NumeracyNumberShapesLesson';
import { NumeracyTechniqueLesson } from '@/components/course/numeracy-lessons/NumeracyTechniqueLesson';
import { NumeracyConclusionLesson } from '@/components/course/numeracy-lessons/NumeracyConclusionLesson';
import { NumeracyIntentionalityLesson } from '@/components/course/numeracy-lessons/NumeracyIntentionalityLesson';
import { NumeracyScienceLesson } from '@/components/course/numeracy-lessons/NumeracyScienceLesson';
import { NumeracyHistoryLesson } from '@/components/course/numeracy-lessons/NumeracyHistoryLesson';
import { NumeracyTriangleLesson } from '@/components/course/numeracy-lessons/NumeracyTriangleLesson';
import { NumeracyBeyondLesson } from '@/components/course/numeracy-lessons/NumeracyBeyondLesson';
import { NumeracyQuizLesson } from '@/components/course/numeracy-lessons/NumeracyQuizLesson';
import { NumeracyFinalTestLesson } from '@/components/course/numeracy-lessons/NumeracyFinalTestLesson';

const lessons = [
  { id: 1, title: 'Introduction', component: NumeracyIntroductionLesson },
  { id: 2, title: 'Optimal Learning State', component: NumeracyOptimalLearningStateLesson },
  { id: 3, title: 'Why Numbers Are Shaped The Way They Are', component: NumeracyNumberShapesLesson },
  { id: 4, title: 'The Number Triangle Technique', component: NumeracyTechniqueLesson },
  { id: 5, title: 'Conclusion', component: NumeracyConclusionLesson },
  { id: 6, title: 'Deep Dive: The Power of Intentionality', component: NumeracyIntentionalityLesson },
  { id: 7, title: 'Deep Dive: The Science of Learning', component: NumeracyScienceLesson },
  { id: 8, title: 'Deep Dive: The History of Numbers', component: NumeracyHistoryLesson },
  { id: 9, title: 'Deep Dive: The Number Triangle Technique', component: NumeracyTriangleLesson },
  { id: 10, title: 'Deep Dive: Beyond Numeracy', component: NumeracyBeyondLesson },
  { id: 11, title: 'Mini Quiz', component: NumeracyQuizLesson },
  { id: 12, title: 'Final Test', component: NumeracyFinalTestLesson }
];

export default function EmpoweringLearningNumeracyCoursePage() {
  const [currentLesson, setCurrentLesson] = useState(1);

  const CurrentLessonComponent = lessons.find(lesson => lesson.id === currentLesson)?.component || NumeracyIntroductionLesson;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Empowering Learning for Numeracy
          </h1>
          <p className="text-gray-600 mb-4">A new perspective on learning mathematics</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Lesson {currentLesson} of {lessons.length}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentLesson(Math.max(1, currentLesson - 1))}
                disabled={currentLesson === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentLesson(Math.min(lessons.length, currentLesson + 1))}
                disabled={currentLesson === lessons.length}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Course Navigation</h3>
                <div className="space-y-2">
                  {lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson.id)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        currentLesson === lesson.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {lesson.id}. {lesson.title}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <CurrentLessonComponent />
          </div>
        </div>
      </div>
    </div>
  );
}