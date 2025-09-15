import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Square } from 'lucide-react';
import quadrilateralsImage from '@/assets/quadrilaterals-lesson.jpg';

export const QuadrilateralsLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Quadrilaterals</h1>
        <p className="text-lg text-muted-foreground">Four-Sided Polygons and Their Properties</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={quadrilateralsImage} 
          alt="Different types of quadrilaterals including squares, rectangles, parallelograms, and trapezoids"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              A <strong>quadrilateral</strong> is a polygon with four sides, four vertices, and four angles. 
              The sum of all interior angles in any quadrilateral is always 360°. Quadrilaterals have 
              many different types, each with unique properties.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
                <Square className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quadrilateral Family</h3>
                <p className="text-gray-600">Four sides, four angles, sum = 360°</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Types of Quadrilaterals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Square</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• All four sides equal</li>
                    <li>• All angles are 90°</li>
                    <li>• Diagonals are equal and perpendicular</li>
                    <li>• Has 4 lines of symmetry</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Rectangle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Opposite sides equal and parallel</li>
                    <li>• All angles are 90°</li>
                    <li>• Diagonals are equal in length</li>
                    <li>• Has 2 lines of symmetry</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Parallelogram</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Opposite sides parallel and equal</li>
                    <li>• Opposite angles are equal</li>
                    <li>• Diagonals bisect each other</li>
                    <li>• May have no lines of symmetry</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Rhombus</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• All four sides equal</li>
                    <li>• Opposite sides parallel</li>
                    <li>• Opposite angles equal</li>
                    <li>• Diagonals perpendicular and bisect each other</li>
                  </ul>
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
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-teal-700">Kite</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Two pairs of adjacent sides equal</li>
                    <li>• One diagonal bisects the other at right angles</li>
                    <li>• Has one line of symmetry</li>
                    <li>• One pair of opposite angles equal</li>
                  </ul>
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
                  <div>
                    <h4 className="font-semibold">All squares are:</h4>
                    <p>Rectangles, rhombuses, parallelograms, and quadrilaterals</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">All rectangles are:</h4>
                    <p>Parallelograms and quadrilaterals</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">All rhombuses are:</h4>
                    <p>Parallelograms and quadrilaterals</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">All parallelograms are:</h4>
                    <p>Quadrilaterals</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-xl font-semibold mb-4">Important Properties</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-violet-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-violet-700">Angle Sum Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Sum of all interior angles = 360°</p>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">∠A + ∠B + ∠C + ∠D = 360°</p>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-amber-700">Parallel Lines Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">In parallelograms:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Consecutive angles are supplementary</li>
                    <li>• Opposite angles are equal</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-purple-200 bg-purple-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Memory Tip:</h4>
          <p>
            Think of quadrilaterals as a family tree: A square is the most "special" quadrilateral 
            because it has all the properties of rectangles, rhombuses, and parallelograms combined!
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
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. True or False:</h4>
              <p className="text-sm">"All rectangles are squares." Explain your answer.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Identify the quadrilateral:</h4>
              <p className="text-sm">A quadrilateral has four equal sides and four right angles. What is it?</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Properties:</h4>
              <p className="text-sm">List three properties that all parallelograms share.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};