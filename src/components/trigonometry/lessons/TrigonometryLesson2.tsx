import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Triangle, Target } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';
import { InCourseChatBubble } from '@/components/course/InCourseChatBubble';

export const TrigonometryLesson2: React.FC = () => {
  const lessonContentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Sine, Cosine, and Tangent</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Master the three fundamental trigonometric functions and the powerful SOHCAHTOA mnemonic for solving right triangles.
          </p>
          
          <LessonTTSControls 
            contentRef={lessonContentRef} 
            lessonTitle="Sine, Cosine, and Tangent"
            lessonNumber={2}
            totalLessons={7}
          />
        </CardHeader>
        <CardContent className="space-y-8">
          {/* SOHCAHTOA Introduction */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">The SOHCAHTOA Method</h3>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border-2 border-red-200">
              <div className="text-center mb-4">
                <h4 className="text-2xl font-bold text-red-700 mb-2">SOH-CAH-TOA</h4>
                <p className="text-lg text-red-600">The most important mnemonic in trigonometry!</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h5 className="font-bold text-red-700 text-center mb-2">SOH</h5>
                  <p className="text-center text-sm">
                    <strong>S</strong>ine = <strong>O</strong>pposite / <strong>H</strong>ypotenuse
                  </p>
                  <p className="text-center text-xs mt-2 text-red-600">sin θ = opp/hyp</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h5 className="font-bold text-red-700 text-center mb-2">CAH</h5>
                  <p className="text-center text-sm">
                    <strong>C</strong>osine = <strong>A</strong>djacent / <strong>H</strong>ypotenuse
                  </p>
                  <p className="text-center text-xs mt-2 text-red-600">cos θ = adj/hyp</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h5 className="font-bold text-red-700 text-center mb-2">TOA</h5>
                  <p className="text-center text-sm">
                    <strong>T</strong>angent = <strong>O</strong>pposite / <strong>A</strong>djacent
                  </p>
                  <p className="text-center text-xs mt-2 text-red-600">tan θ = opp/adj</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sine Function */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-700">The Sine Function</h3>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-lg font-medium">sin θ = opposite / hypotenuse</p>
                  <p>
                    The sine of an angle is the ratio of the length of the opposite side to the hypotenuse.
                    It tells us the "height" component of an angle.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-700">Key Properties:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Range: -1 ≤ sin θ ≤ 1</li>
                      <li>Period: 2π (360°)</li>
                      <li>sin 0° = 0, sin 90° = 1</li>
                      <li>Measures vertical component</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-700">Common Values:</h4>
                  <div className="space-y-1 text-sm">
                    <p>sin 30° = 1/2 = 0.5</p>
                    <p>sin 45° = √2/2 ≈ 0.707</p>
                    <p>sin 60° = √3/2 ≈ 0.866</p>
                  </div>
                  <div className="mt-4 p-3 bg-blue-100 rounded">
                    <p className="text-xs font-medium text-blue-800">
                      Memory Tip: Sine starts at 0 and reaches its maximum of 1 at 90°
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cosine Function */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-green-700">The Cosine Function</h3>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-lg font-medium">cos θ = adjacent / hypotenuse</p>
                  <p>
                    The cosine of an angle is the ratio of the length of the adjacent side to the hypotenuse.
                    It tells us the "width" component of an angle.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-700">Key Properties:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Range: -1 ≤ cos θ ≤ 1</li>
                      <li>Period: 2π (360°)</li>
                      <li>cos 0° = 1, cos 90° = 0</li>
                      <li>Measures horizontal component</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700">Common Values:</h4>
                  <div className="space-y-1 text-sm">
                    <p>cos 30° = √3/2 ≈ 0.866</p>
                    <p>cos 45° = √2/2 ≈ 0.707</p>
                    <p>cos 60° = 1/2 = 0.5</p>
                  </div>
                  <div className="mt-4 p-3 bg-green-100 rounded">
                    <p className="text-xs font-medium text-green-800">
                      Memory Tip: Cosine starts at 1 and decreases to 0 at 90°
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tangent Function */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-orange-700">The Tangent Function</h3>
            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-lg font-medium">tan θ = opposite / adjacent</p>
                  <p>
                    The tangent of an angle is the ratio of the opposite side to the adjacent side.
                    It can also be calculated as sine divided by cosine.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-700">Key Properties:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Range: -∞ to +∞</li>
                      <li>Period: π (180°)</li>
                      <li>tan 0° = 0, tan 45° = 1</li>
                      <li>Undefined at 90°, 270°, etc.</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-700">Common Values:</h4>
                  <div className="space-y-1 text-sm">
                    <p>tan 30° = √3/3 ≈ 0.577</p>
                    <p>tan 45° = 1</p>
                    <p>tan 60° = √3 ≈ 1.732</p>
                  </div>
                  <div className="mt-4 p-3 bg-orange-100 rounded">
                    <p className="text-xs font-medium text-orange-800">
                      Alternative: tan θ = sin θ / cos θ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Relationships */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-purple-700">Important Relationships</h3>
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-700">Quotient Identity:</h4>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-center text-lg font-mono">tan θ = sin θ / cos θ</p>
                  </div>
                  <p className="text-sm">
                    This shows that tangent can always be calculated from sine and cosine.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-700">Pythagorean Identity:</h4>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-center text-lg font-mono">sin²θ + cos²θ = 1</p>
                  </div>
                  <p className="text-sm">
                    This fundamental relationship comes from the Pythagorean theorem applied to the unit circle.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-World Uses */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-indigo-700">Real-World Applications</h3>
            <div className="bg-indigo-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-indigo-700 flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Navigation
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>GPS coordinates</li>
                    <li>Ship and plane navigation</li>
                    <li>Satellite positioning</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-indigo-700 flex items-center gap-1">
                    <Triangle className="h-4 w-4" />
                    Engineering
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Bridge design</li>
                    <li>Roof angles</li>
                    <li>Force calculations</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-indigo-700 flex items-center gap-1">
                    <Calculator className="h-4 w-4" />
                    Science
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Wave mechanics</li>
                    <li>Optics and light</li>
                    <li>Signal processing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <InCourseChatBubble 
        courseId="trigonometry-fundamentals"
        lessonId={2}
        lessonContentRef={lessonContentRef}
        lessonTitle="Sine, Cosine, and Tangent"
      />
    </div>
  );
};