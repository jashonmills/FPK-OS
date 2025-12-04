import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, BookOpen, Star } from 'lucide-react';
import geometryReviewImage from '@/assets/geometry-review-lesson.jpg';

export const GeometryReviewLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Geometry Review and Practice</h1>
        <p className="text-lg text-muted-foreground">Comprehensive Review of All Geometry Concepts</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={geometryReviewImage} 
          alt="Review of geometric concepts with various shapes, formulas, and mathematical symbols"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              This lesson reviews all the key concepts we've learned in geometry. Use this as a 
              comprehensive study guide to reinforce your understanding and prepare for assessments.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border">
                <Star className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Complete Review</h3>
                <p className="text-gray-600">All geometry concepts in one place</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Key Topics Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Basic Elements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Points, lines, and planes</li>
                    <li>• Line segments and rays</li>
                    <li>• Parallel and perpendicular lines</li>
                    <li>• Intersections and angles</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Angles</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Acute, right, obtuse, straight</li>
                    <li>• Complementary and supplementary</li>
                    <li>• Vertical angles</li>
                    <li>• Adjacent angles</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Triangles</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Equilateral, isosceles, scalene</li>
                    <li>• Acute, right, obtuse triangles</li>
                    <li>• Angle sum theorem (180°)</li>
                    <li>• Triangle inequality</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Quadrilaterals</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Square, rectangle, parallelogram</li>
                    <li>• Rhombus, trapezoid, kite</li>
                    <li>• Properties and relationships</li>
                    <li>• Angle sum theorem (360°)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-700">Circles</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Radius, diameter, chord</li>
                    <li>• Circumference: C = 2πr</li>
                    <li>• Area: A = πr²</li>
                    <li>• Arcs and sectors</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-teal-700">Measurements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Perimeter and area formulas</li>
                    <li>• Volume of 3D shapes</li>
                    <li>• Surface area calculations</li>
                    <li>• Units and conversions</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Essential Formulas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-700">2D Shape Formulas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Rectangle:</strong> A = lw, P = 2(l + w)</p>
                    <p><strong>Square:</strong> A = s², P = 4s</p>
                    <p><strong>Triangle:</strong> A = ½bh</p>
                    <p><strong>Circle:</strong> A = πr², C = 2πr</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-violet-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-violet-700">3D Shape Formulas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Cube:</strong> V = s³, SA = 6s²</p>
                    <p><strong>Rectangular Prism:</strong> V = lwh</p>
                    <p><strong>Cylinder:</strong> V = πr²h</p>
                    <p><strong>Sphere:</strong> V = (4/3)πr³</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Coordinate Geometry</h3>
            
            <Card className="border-pink-200 mb-8">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-pink-700">Key Formulas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Distance:</strong> d = √[(x₂-x₁)² + (y₂-y₁)²]</p>
                    <p><strong>Midpoint:</strong> M = ((x₁+x₂)/2, (y₁+y₂)/2)</p>
                  </div>
                  <div>
                    <p><strong>Slope:</strong> m = (y₂-y₁)/(x₂-x₁)</p>
                    <p><strong>Point-Slope:</strong> y - y₁ = m(x - x₁)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-amber-200 bg-amber-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Study Tips:</h4>
          <p>
            Practice drawing and labeling shapes. Create your own formula reference sheet. 
            Work through problems step-by-step, showing all your work!
          </p>
        </AlertDescription>
      </Alert>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Comprehensive Practice Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Mixed Angles:</h4>
              <p className="text-sm">In a triangle, one angle is 45° and another is 2x + 15°. If the third angle is x, find all three angles.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Area and Perimeter:</h4>
              <p className="text-sm">A rectangle has length 12 cm and width 8 cm. Find its area and perimeter.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Circle Calculations:</h4>
              <p className="text-sm">A circle has radius 5 inches. Find its circumference and area. (Use π = 3.14)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Coordinate Geometry:</h4>
              <p className="text-sm">Find the distance and midpoint between points A(2, 3) and B(8, 11).</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">5. 3D Volume:</h4>
              <p className="text-sm">A cube has edge length 6 cm. Find its volume and surface area.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Congratulations!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            You've completed the Interactive Geometry Fundamentals course! You now have a solid foundation in 
            geometric concepts, from basic shapes and measurements to advanced coordinate geometry 
            and proof techniques. Keep practicing and applying these concepts to strengthen your 
            mathematical reasoning skills.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};