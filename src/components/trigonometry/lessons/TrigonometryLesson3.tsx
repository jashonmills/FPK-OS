import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';
import { InCourseChatBubble } from '@/components/course/InCourseChatBubble';

interface TrigonometryLesson3Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const TrigonometryLesson3: React.FC<TrigonometryLesson3Props> = ({ onComplete, onNext, hasNext }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const lessonContentRef = useRef<HTMLDivElement>(null);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Lesson Introduction */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <PlayCircle className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Trigonometric Functions on the Unit Circle</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Discover how sine, cosine, and tangent work on the unit circle and extend beyond right triangles.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Unit Circle Coordinate System */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">The Unit Circle Coordinate System</h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Key Concept</h4>
                  <p className="text-muted-foreground">
                    On the unit circle, any point can be written as (cos θ, sin θ) where θ is the angle 
                    from the positive x-axis.
                  </p>
                  <div className="bg-white/60 p-4 rounded">
                    <p className="font-medium text-blue-700">For any angle θ:</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• x-coordinate = cos(θ)</li>
                      <li>• y-coordinate = sin(θ)</li>
                      <li>• Point = (cos θ, sin θ)</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-white/50 p-4 rounded-lg text-center">
                  <div className="text-8xl mb-2">🎯</div>
                  <p className="text-sm text-muted-foreground">
                    Unit Circle with Coordinates
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quadrants and Signs */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Quadrants and Function Signs</h3>
            <p className="text-muted-foreground">
              The unit circle is divided into four quadrants, and the signs of trig functions change in each:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-700">Quadrant I (0° to 90°)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li>• sin θ {'>'} 0 (positive)</li>
                      <li>• cos θ {'>'} 0 (positive)</li>
                      <li>• tan θ {'>'} 0 (positive)</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">All functions positive</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-700">Quadrant III (180° to 270°)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li>• sin θ {'<'} 0 (negative)</li>
                      <li>• cos θ {'<'} 0 (negative)</li>
                      <li>• tan θ {'>'} 0 (positive)</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">Only tangent positive</p>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-700">Quadrant II (90° to 180°)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li>• sin θ {'>'} 0 (positive)</li>
                      <li>• cos θ {'<'} 0 (negative)</li>
                      <li>• tan θ {'<'} 0 (negative)</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">Only sine positive</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-700">Quadrant IV (270° to 360°)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li>• sin θ {'<'} 0 (negative)</li>
                      <li>• cos θ {'>'} 0 (positive)</li>
                      <li>• tan θ {'<'} 0 (negative)</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">Only cosine positive</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Reference Angles */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Reference Angles</h3>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-3">What is a Reference Angle?</h4>
              <p className="text-muted-foreground mb-4">
                A reference angle is the acute angle (0° to 90°) that an angle makes with the x-axis. 
                It helps us find trig values for any angle.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/60 p-4 rounded">
                  <h5 className="font-medium mb-2">Finding Reference Angles:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Quadrant I: Reference angle = θ</li>
                    <li>• Quadrant II: Reference angle = 180° - θ</li>
                    <li>• Quadrant III: Reference angle = θ - 180°</li>
                    <li>• Quadrant IV: Reference angle = 360° - θ</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-4 rounded">
                  <h5 className="font-medium mb-2">Example:</h5>
                  <p className="text-sm">
                    For θ = 150° (Quadrant II):
                    <br />Reference angle = 180° - 150° = 30°
                    <br />So sin(150°) = sin(30°) = 1/2
                    <br />(but with correct sign for Quadrant II)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Special Angles on Unit Circle */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Special Angles on the Unit Circle</h3>
            <p className="text-muted-foreground">
              These angles have exact trig values that you should memorize:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="p-3 text-left">Angle (Degrees)</th>
                    <th className="p-3 text-left">Angle (Radians)</th>
                    <th className="p-3 text-left">sin θ</th>
                    <th className="p-3 text-left">cos θ</th>
                    <th className="p-3 text-left">tan θ</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="p-3">0°</td>
                    <td className="p-3">0</td>
                    <td className="p-3">0</td>
                    <td className="p-3">1</td>
                    <td className="p-3">0</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-3">30°</td>
                    <td className="p-3">π/6</td>
                    <td className="p-3">1/2</td>
                    <td className="p-3">√3/2</td>
                    <td className="p-3">√3/3</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">45°</td>
                    <td className="p-3">π/4</td>
                    <td className="p-3">√2/2</td>
                    <td className="p-3">√2/2</td>
                    <td className="p-3">1</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-3">60°</td>
                    <td className="p-3">π/3</td>
                    <td className="p-3">√3/2</td>
                    <td className="p-3">1/2</td>
                    <td className="p-3">√3</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">90°</td>
                    <td className="p-3">π/2</td>
                    <td className="p-3">1</td>
                    <td className="p-3">0</td>
                    <td className="p-3">undefined</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Periodicity */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-violet-700 mb-4">Periodicity of Trig Functions</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Trigonometric functions repeat their values in regular intervals called periods:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/60 p-4 rounded text-center">
                  <h4 className="font-semibold text-red-700">Sine</h4>
                  <p className="text-sm mt-1">Period: 360° (2π)</p>
                  <p className="text-xs text-muted-foreground mt-1">sin(θ + 360°) = sin(θ)</p>
                </div>
                <div className="bg-white/60 p-4 rounded text-center">
                  <h4 className="font-semibold text-blue-700">Cosine</h4>
                  <p className="text-sm mt-1">Period: 360° (2π)</p>
                  <p className="text-xs text-muted-foreground mt-1">cos(θ + 360°) = cos(θ)</p>
                </div>
                <div className="bg-white/60 p-4 rounded text-center">
                  <h4 className="font-semibold text-green-700">Tangent</h4>
                  <p className="text-sm mt-1">Period: 180° (π)</p>
                  <p className="text-xs text-muted-foreground mt-1">tan(θ + 180°) = tan(θ)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 3 of 7 • Unit Circle Functions
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

      {/* In-Course AI Tutor Chat Bubble */}
      <InCourseChatBubble
        courseId="interactive-trigonometry"
        lessonId={3}
        lessonTitle="Trigonometric Functions on the Unit Circle"
        lessonContentRef={lessonContentRef}
      />
    </div>
  );
};