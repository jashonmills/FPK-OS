import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Square } from 'lucide-react';

export const QuadrilateralsLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Quadrilaterals and Polygons</h1>
        <p className="text-lg text-muted-foreground">Four-Sided Polygons and Their Properties</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/quadrilaterals.jpg" 
          alt="Hierarchy of quadrilaterals showing relationships between squares, rectangles, parallelograms, and other four-sided shapes"
          className="w-1/2 mx-auto object-contain rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              <strong>Quadrilaterals</strong> and polygons are everywhere in our daily lives—from the rectangular 
              screens of our devices to the hexagonal tiles in bathrooms. Understanding these shapes helps us make 
              sense of the world around us and solve practical problems in fields like architecture, design, and engineering.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
                <Square className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Four-Sided Shapes</h3>
                <p className="text-gray-600">Exploring the family of quadrilaterals</p>
              </div>
            </div>

            <Alert className="mb-6">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Key Property:</strong> The sum of interior angles in any quadrilateral is always 360 degrees. 
                Unlike triangles, which are always rigid, quadrilaterals can be flexible unless additional constraints are imposed.
              </AlertDescription>
            </Alert>

            <h3 className="text-xl font-semibold mb-4">Types of Quadrilaterals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Parallelogram</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Opposite sides parallel and equal</li>
                    <li>• Opposite angles are equal</li>
                    <li>• Consecutive angles are supplementary</li>
                    <li>• Diagonals bisect each other</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Foundation shape for other quadrilaterals</p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Rectangle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• All angles are 90° (right angles)</li>
                    <li>• Opposite sides parallel and equal</li>
                    <li>• Diagonals are equal and bisect each other</li>
                    <li>• Most common quadrilateral in construction</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Special parallelogram with right angles</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Square</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• All four sides equal</li>
                    <li>• All angles are 90°</li>
                    <li>• Diagonals equal, perpendicular, bisect each other</li>
                    <li>• Has 4 lines of symmetry</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Most symmetric quadrilateral</p>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Rhombus</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• All four sides equal</li>
                    <li>• Opposite angles equal</li>
                    <li>• Diagonals perpendicular and bisect each other</li>
                    <li>• Diagonals bisect vertex angles</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Diamond shape with equal sides</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-700">Trapezoid</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Exactly one pair of parallel sides</li>
                    <li>• Parallel sides called bases</li>
                    <li>• Non-parallel sides called legs</li>
                    <li>• May be isosceles (equal legs)</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Most general quadrilateral with parallel sides</p>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-teal-700">Kite</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Two pairs of adjacent sides equal</li>
                    <li>• One diagonal bisects other at right angles</li>
                    <li>• Has one line of symmetry</li>
                    <li>• One pair of opposite angles equal</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Named after the flying toy shape</p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Quadrilateral Hierarchy</h3>
            
            <Card className="border-indigo-200 mb-8">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-700">Family Tree Relationships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800">A square is:</h4>
                    <p>• A rectangle (all angles are 90°)</p>
                    <p>• A rhombus (all sides are equal)</p>
                    <p>• A parallelogram (opposite sides parallel)</p>
                    <p>• A quadrilateral (four sides)</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800">A rectangle is:</h4>
                    <p>• A parallelogram (opposite sides parallel)</p>
                    <p>• A quadrilateral (four sides)</p>
                    <p>• NOT necessarily a square (sides may not be equal)</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800">A rhombus is:</h4>
                    <p>• A parallelogram (opposite sides parallel)</p>
                    <p>• A quadrilateral (four sides)</p>
                    <p>• NOT necessarily a square (angles may not be 90°)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-xl font-semibold mb-4">Area Formulas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-violet-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-violet-700">Rectangle & Square</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-mono bg-gray-100 p-2 rounded">Rectangle: A = length × width</p>
                    <p className="font-mono bg-gray-100 p-2 rounded">Square: A = side²</p>
                    <p className="text-xs text-muted-foreground">Most straightforward area calculations</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-amber-700">Parallelogram & Rhombus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-mono bg-gray-100 p-2 rounded">A = base × height</p>
                    <p className="font-mono bg-gray-100 p-2 rounded">Rhombus: A = ½ × d₁ × d₂</p>
                    <p className="text-xs text-muted-foreground">Height is perpendicular distance between parallel sides</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-rose-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-rose-700">Trapezoid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-mono bg-gray-100 p-2 rounded">A = ½ × (b₁ + b₂) × h</p>
                    <p className="text-xs">b₁, b₂ are parallel sides (bases)</p>
                    <p className="text-xs">h is height (perpendicular distance between bases)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-cyan-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-cyan-700">Kite</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-mono bg-gray-100 p-2 rounded">A = ½ × d₁ × d₂</p>
                    <p className="text-xs">d₁, d₂ are lengths of diagonals</p>
                    <p className="text-xs text-muted-foreground">Diagonals are perpendicular in a kite</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-purple-200 bg-purple-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Memory Strategy:</h4>
          <p>
            Think of quadrilaterals as a family tree: A <strong>square</strong> is the most "special" because 
            it has all the properties of rectangles, rhombuses, and parallelograms combined! Each shape 
            inherits properties from more general shapes above it in the hierarchy.
          </p>
        </AlertDescription>
      </Alert>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Practice Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Find the missing angle:</h4>
              <p className="text-sm">In a quadrilateral, three angles measure 85°, 95°, and 110°. What is the fourth angle?</p>
              <p className="text-xs text-muted-foreground">Remember: All angles in a quadrilateral sum to 360°</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. True or False:</h4>
              <p className="text-sm">"All rectangles are squares." Explain your reasoning.</p>
              <p className="text-xs text-muted-foreground">Think about the hierarchy relationships</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Identify the quadrilateral:</h4>
              <p className="text-sm">A quadrilateral has four equal sides and four right angles. What type is it?</p>
              <p className="text-xs text-muted-foreground">Consider which properties uniquely identify this shape</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Area calculation:</h4>
              <p className="text-sm">A trapezoid has parallel sides of 8 cm and 12 cm, with height 5 cm. Find its area.</p>
              <p className="text-xs text-muted-foreground">Use the trapezoid area formula</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};