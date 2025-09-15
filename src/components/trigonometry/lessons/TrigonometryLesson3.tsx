import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Circle, RotateCcw, Target } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';
import { InCourseChatBubble } from '@/components/course/InCourseChatBubble';

export const TrigonometryLesson3: React.FC = () => {
  const lessonContentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Circle className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Trigonometric Functions on the Unit Circle</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Discover how sine, cosine, and tangent work on the unit circle and extend beyond right triangles.
          </p>
          
          <LessonTTSControls 
            contentRef={lessonContentRef} 
            lessonTitle="Trigonometric Functions on the Unit Circle"
            lessonNumber={3}
            totalLessons={7}
          />
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Unit Circle Coordinate System */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">The Unit Circle Coordinate System</h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-lg">
                    The unit circle is a circle with <strong>radius = 1</strong> centered at the origin (0,0).
                    Every point on this circle can be written as <strong>(cos θ, sin θ)</strong>.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-700">Key Properties:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>x-coordinate = cos θ</li>
                      <li>y-coordinate = sin θ</li>
                      <li>Distance from origin = 1</li>
                      <li>Angle θ measured from positive x-axis</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-center mb-3">Unit Circle Equation</h4>
                  <p className="text-center text-2xl font-mono mb-2">x² + y² = 1</p>
                  <p className="text-center text-lg font-mono">cos²θ + sin²θ = 1</p>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    This is the Pythagorean identity!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Angles and Coordinates */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-green-700">Standard Angle Coordinates</h3>
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="mb-4">
                Memorizing the coordinates of key angles on the unit circle is essential for quick calculations.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-green-300">
                      <th className="text-left p-3">Angle (Degrees)</th>
                      <th className="text-left p-3">Angle (Radians)</th>
                      <th className="text-left p-3">Coordinates (x, y)</th>
                      <th className="text-left p-3">cos θ</th>
                      <th className="text-left p-3">sin θ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-green-200">
                      <td className="p-3">0°</td>
                      <td className="p-3">0</td>
                      <td className="p-3">(1, 0)</td>
                      <td className="p-3">1</td>
                      <td className="p-3">0</td>
                    </tr>
                    <tr className="border-b border-green-200">
                      <td className="p-3">30°</td>
                      <td className="p-3">π/6</td>
                      <td className="p-3">(√3/2, 1/2)</td>
                      <td className="p-3">√3/2</td>
                      <td className="p-3">1/2</td>
                    </tr>
                    <tr className="border-b border-green-200">
                      <td className="p-3">45°</td>
                      <td className="p-3">π/4</td>
                      <td className="p-3">(√2/2, √2/2)</td>
                      <td className="p-3">√2/2</td>
                      <td className="p-3">√2/2</td>
                    </tr>
                    <tr className="border-b border-green-200">
                      <td className="p-3">60°</td>
                      <td className="p-3">π/3</td>
                      <td className="p-3">(1/2, √3/2)</td>
                      <td className="p-3">1/2</td>
                      <td className="p-3">√3/2</td>
                    </tr>
                    <tr className="border-b border-green-200">
                      <td className="p-3">90°</td>
                      <td className="p-3">π/2</td>
                      <td className="p-3">(0, 1)</td>
                      <td className="p-3">0</td>
                      <td className="p-3">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quadrant Analysis */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-purple-700">Quadrant Signs and Behavior</h3>
            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="mb-4">
                The unit circle is divided into four quadrants, each with distinct sign patterns for sine and cosine.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded border text-center">
                      <h4 className="font-bold text-purple-700 mb-2">Quadrant II</h4>
                      <p className="text-sm">90° to 180°</p>
                      <p className="text-sm">π/2 to π</p>
                      <div className="mt-2 text-xs">
                        <p>cos θ: <span className="text-red-600">negative</span></p>
                        <p>sin θ: <span className="text-green-600">positive</span></p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded border text-center">
                      <h4 className="font-bold text-purple-700 mb-2">Quadrant I</h4>
                      <p className="text-sm">0° to 90°</p>
                      <p className="text-sm">0 to π/2</p>
                      <div className="mt-2 text-xs">
                        <p>cos θ: <span className="text-green-600">positive</span></p>
                        <p>sin θ: <span className="text-green-600">positive</span></p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded border text-center">
                      <h4 className="font-bold text-purple-700 mb-2">Quadrant III</h4>
                      <p className="text-sm">180° to 270°</p>
                      <p className="text-sm">π to 3π/2</p>
                      <div className="mt-2 text-xs">
                        <p>cos θ: <span className="text-red-600">negative</span></p>
                        <p>sin θ: <span className="text-red-600">negative</span></p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded border text-center">
                      <h4 className="font-bold text-purple-700 mb-2">Quadrant IV</h4>
                      <p className="text-sm">270° to 360°</p>
                      <p className="text-sm">3π/2 to 2π</p>
                      <div className="mt-2 text-xs">
                        <p>cos θ: <span className="text-green-600">positive</span></p>
                        <p>sin θ: <span className="text-red-600">negative</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-700">Memory Device: "All Students Take Calculus"</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>All</strong> functions positive (Quadrant I)</li>
                    <li><strong>Students</strong> - Sine positive (Quadrant II)</li>
                    <li><strong>Take</strong> - Tangent positive (Quadrant III)</li>
                    <li><strong>Calculus</strong> - Cosine positive (Quadrant IV)</li>
                  </ul>
                  <div className="mt-3 p-3 bg-purple-100 rounded">
                    <p className="text-xs font-medium text-purple-800">
                      This helps remember which trig functions are positive in each quadrant!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Angles */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-orange-700">Reference Angles</h3>
            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p>
                    A <strong>reference angle</strong> is the acute angle between the terminal side of an angle and the x-axis.
                    It's always between 0° and 90°.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-700">Finding Reference Angles:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Quadrant I:</strong> Reference angle = θ</li>
                      <li><strong>Quadrant II:</strong> Reference angle = 180° - θ</li>
                      <li><strong>Quadrant III:</strong> Reference angle = θ - 180°</li>
                      <li><strong>Quadrant IV:</strong> Reference angle = 360° - θ</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-700">Examples:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded border">
                      <p><strong>150°</strong> (Quadrant II)</p>
                      <p>Reference angle = 180° - 150° = 30°</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p><strong>225°</strong> (Quadrant III)</p>
                      <p>Reference angle = 225° - 180° = 45°</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p><strong>315°</strong> (Quadrant IV)</p>
                      <p>Reference angle = 360° - 315° = 45°</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extending Beyond Right Triangles */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-indigo-700">Beyond Right Triangles</h3>
            <div className="bg-indigo-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-indigo-700">Why the Unit Circle Matters:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Works for any angle, not just 0° to 90°</li>
                    <li>Handles negative angles</li>
                    <li>Explains periodicity of trig functions</li>
                    <li>Foundation for advanced mathematics</li>
                    <li>Essential for calculus and engineering</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-indigo-700">Real Applications:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Circular motion and rotation</li>
                    <li>Wave functions and oscillations</li>
                    <li>Computer graphics and animation</li>
                    <li>Signal processing</li>
                    <li>Physics simulations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <InCourseChatBubble 
        courseId="trigonometry-fundamentals"
        lessonId={3}
        lessonContentRef={lessonContentRef}
        lessonTitle="Trigonometric Functions on the Unit Circle"
      />
    </div>
  );
};