import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Triangle, RotateCcw } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';
import { InCourseChatBubble } from '@/components/course/InCourseChatBubble';

export const TrigonometryLesson1: React.FC = () => {
  const lessonContentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Triangle className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Introduction to Trigonometry</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Welcome to the fascinating world of trigonometry! Learn the fundamental concepts that connect geometry, algebra, and real-world applications.
          </p>
          
          <LessonTTSControls 
            contentRef={lessonContentRef} 
            lessonTitle="Introduction to Trigonometry"
            lessonNumber={1}
            totalLessons={7}
          />
        </CardHeader>
        <CardContent className="space-y-8">
          {/* What is Trigonometry? */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">What is Trigonometry?</h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <p className="text-lg mb-4">
                <strong>Trigonometry</strong> is the branch of mathematics that studies the relationships between angles and sides in triangles. 
                The word comes from Greek: "trigonon" (triangle) + "metron" (measure).
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-700">Key Applications:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Architecture and Engineering</li>
                    <li>Navigation and GPS</li>
                    <li>Physics and Waves</li>
                    <li>Computer Graphics</li>
                    <li>Music and Sound</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-700">Core Concepts:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Angles and their measurement</li>
                    <li>Triangle relationships</li>
                    <li>Trigonometric functions</li>
                    <li>The unit circle</li>
                    <li>Periodic patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Triangle Basics */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-green-700">Right Triangle Basics</h3>
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="mb-4">
                Right triangles are the foundation of trigonometry. They have one 90° angle and two acute angles that sum to 90°.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700">Triangle Parts:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Hypotenuse</Badge>
                      <span>The longest side (opposite the 90° angle)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Adjacent</Badge>
                      <span>Side next to the angle of interest</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Opposite</Badge>
                      <span>Side across from the angle of interest</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700">Key Relationships:</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Pythagorean Theorem:</strong> a² + b² = c²</p>
                    <p><strong>Angle sum:</strong> Acute angles sum to 90°</p>
                    <p><strong>Similarity:</strong> All right triangles with the same acute angles are similar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Unit Circle */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-purple-700">The Unit Circle</h3>
            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="mb-4">
                The unit circle is a circle with radius 1 centered at the origin. It's the key to understanding trigonometric functions beyond right triangles.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-700">Circle Properties:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Radius = 1 unit</li>
                    <li>Center at origin (0,0)</li>
                    <li>Circumference = 2π</li>
                    <li>Any point is (cos θ, sin θ)</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-700">Angle Measurement:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Degrees: 0° to 360°</li>
                    <li>Radians: 0 to 2π</li>
                    <li>1 radian ≈ 57.3°</li>
                    <li>π radians = 180°</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Important Angles */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-orange-700">Important Angles</h3>
            <div className="bg-orange-50 p-6 rounded-lg">
              <p className="mb-4">
                Certain angles appear frequently in trigonometry. Memorizing their values will save you time and build intuition.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-orange-200">
                      <th className="text-left p-2">Degrees</th>
                      <th className="text-left p-2">Radians</th>
                      <th className="text-left p-2">sin θ</th>
                      <th className="text-left p-2">cos θ</th>
                      <th className="text-left p-2">tan θ</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    <tr className="border-b border-orange-100">
                      <td className="p-2">0°</td>
                      <td className="p-2">0</td>
                      <td className="p-2">0</td>
                      <td className="p-2">1</td>
                      <td className="p-2">0</td>
                    </tr>
                    <tr className="border-b border-orange-100">
                      <td className="p-2">30°</td>
                      <td className="p-2">π/6</td>
                      <td className="p-2">1/2</td>
                      <td className="p-2">√3/2</td>
                      <td className="p-2">√3/3</td>
                    </tr>
                    <tr className="border-b border-orange-100">
                      <td className="p-2">45°</td>
                      <td className="p-2">π/4</td>
                      <td className="p-2">√2/2</td>
                      <td className="p-2">√2/2</td>
                      <td className="p-2">1</td>
                    </tr>
                    <tr className="border-b border-orange-100">
                      <td className="p-2">60°</td>
                      <td className="p-2">π/3</td>
                      <td className="p-2">√3/2</td>
                      <td className="p-2">1/2</td>
                      <td className="p-2">√3</td>
                    </tr>
                    <tr className="border-b border-orange-100">
                      <td className="p-2">90°</td>
                      <td className="p-2">π/2</td>
                      <td className="p-2">1</td>
                      <td className="p-2">0</td>
                      <td className="p-2">undefined</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <InCourseChatBubble 
        lessonContentRef={lessonContentRef}
        lessonTitle="Introduction to Trigonometry"
      />
    </div>
  );
};