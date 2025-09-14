import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';

interface TrigonometryLesson1Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const TrigonometryLesson1: React.FC<TrigonometryLesson1Props> = ({ onComplete, onNext, hasNext }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const lessonContentRef = useRef<HTMLDivElement>(null);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* TTS Controls */}
      <LessonTTSControls
        lessonTitle="Introduction to Trigonometry"
        lessonNumber={1}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      {/* Lesson Introduction */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Introduction to Trigonometry</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Welcome to the world of trigonometry! Learn the fundamental concepts and discover how triangles connect to circles.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* What is Trigonometry? */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">What is Trigonometry?</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-foreground leading-relaxed">
                <strong>Trigonometry</strong> is the branch of mathematics that deals with the relationships between 
                the angles and sides of triangles. The word comes from Greek: "trigonon" (triangle) + "metron" (measure).
              </p>
            </div>
            <p className="text-muted-foreground">
              Trigonometry helps us solve problems involving:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Heights and distances that are difficult to measure directly</li>
              <li>Navigation and GPS systems</li>
              <li>Engineering and architecture</li>
              <li>Sound and light waves</li>
              <li>Computer graphics and animation</li>
            </ul>
          </div>

          {/* Right Triangle Basics */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Right Triangle Basics</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  A right triangle has one 90° angle and two acute angles. The sides have special names:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Hypotenuse:</strong> The longest side, opposite the right angle</li>
                  <li><strong>Adjacent:</strong> The side next to the angle of interest</li>
                  <li><strong>Opposite:</strong> The side across from the angle of interest</li>
                </ul>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-6xl mb-2">📐</div>
                  <p className="text-sm text-muted-foreground">
                    Right Triangle Components
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The Unit Circle Introduction */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">The Unit Circle</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">What is the Unit Circle?</h4>
                  <p className="text-sm text-muted-foreground">
                    The unit circle is a circle with radius 1 centered at the origin (0,0) 
                    of a coordinate plane. It's fundamental to understanding trigonometry.
                  </p>
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Key Properties:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Radius = 1</li>
                      <li>Center at (0, 0)</li>
                      <li>Circumference = 2π</li>
                      <li>All points are at distance 1 from center</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-white/50 p-4 rounded-lg text-center">
                  <div className="text-8xl mb-2">⭕</div>
                  <p className="text-sm text-muted-foreground">
                    Unit Circle (r = 1)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Angles */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Important Angles</h3>
            <p className="text-muted-foreground">
              Some angles appear frequently in trigonometry. Let's look at the most important ones:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">0° (0 radians)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Right side of circle</p>
                  <p className="text-xs mt-1">Point: (1, 0)</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">90° (π/2 radians)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Top of circle</p>
                  <p className="text-xs mt-1">Point: (0, 1)</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">180° (π radians)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Left side of circle</p>
                  <p className="text-xs mt-1">Point: (-1, 0)</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Coming Up Next */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Coming Up Next</h3>
            <p className="text-muted-foreground mb-4">
              In the next lesson, we'll dive into the three fundamental trigonometric functions: 
              sine, cosine, and tangent, and learn the famous SOHCAHTOA mnemonic!
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Understanding sine, cosine, and tangent</li>
              <li>SOHCAHTOA memory trick</li>
              <li>Calculating trig values for common angles</li>
              <li>Interactive practice problems</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 1 of 7 • Introduction to Trigonometry
        </div>
        <div className="flex gap-2">
          {!isCompleted && (
            <Button onClick={handleComplete} className="fpk-gradient text-white">
              Mark as Complete
            </Button>
          )}
          {isCompleted && hasNext && (
            <Button onClick={onNext} className="fpk-gradient text-white">
              Next Lesson <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};