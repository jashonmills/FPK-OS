import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Triangle } from 'lucide-react';
import trianglesImage from '@/assets/triangles-lesson.jpg';

export const TrianglesLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Triangles</h1>
        <p className="text-lg text-muted-foreground">Exploring Triangle Types, Properties, and Theorems</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={trianglesImage} 
          alt="Various types of triangles showing equilateral, isosceles, scalene, and right triangles with measurements"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              A <strong>triangle</strong> is a polygon with three sides, three vertices, and three angles. 
              The sum of all angles in any triangle is always 180°. Triangles can be classified by 
              their side lengths and angle measures.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border">
                <Triangle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Triangle Properties</h3>
                <p className="text-gray-600">Three sides, three angles, sum = 180°</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Classification by Sides</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Equilateral Triangle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• All three sides equal</li>
                    <li>• All three angles equal (60° each)</li>
                    <li>• Most symmetric triangle</li>
                    <li>• Example: sides 5, 5, 5</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Isosceles Triangle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Two sides equal</li>
                    <li>• Two base angles equal</li>
                    <li>• Has line of symmetry</li>
                    <li>• Example: sides 5, 5, 3</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Scalene Triangle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• All sides different lengths</li>
                    <li>• All angles different measures</li>
                    <li>• No line of symmetry</li>
                    <li>• Example: sides 3, 4, 5</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Classification by Angles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Acute Triangle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• All angles less than 90°</li>
                    <li>• All angles are acute</li>
                    <li>• Example: 70°, 60°, 50°</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-700">Right Triangle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• One angle equals 90°</li>
                    <li>• Has a right angle</li>
                    <li>• Other two angles are acute</li>
                    <li>• Example: 90°, 60°, 30°</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-pink-700">Obtuse Triangle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• One angle greater than 90°</li>
                    <li>• Has an obtuse angle</li>
                    <li>• Other two angles are acute</li>
                    <li>• Example: 120°, 40°, 20°</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Important Triangle Theorems</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-700">Angle Sum Theorem</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">The sum of angles in any triangle equals 180°</p>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">∠A + ∠B + ∠C = 180°</p>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-teal-700">Triangle Inequality</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Sum of any two sides must be greater than the third side</p>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">a + b &gt; c</p>
                </CardContent>
              </Card>

              <Card className="border-violet-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-violet-700">Exterior Angle Theorem</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">An exterior angle equals the sum of the two non-adjacent interior angles</p>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">Exterior ∠ = ∠A + ∠B</p>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-amber-700">Pythagorean Theorem</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">In a right triangle: a² + b² = c²</p>
                  <p className="text-sm">Where c is the hypotenuse</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-green-200 bg-green-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Quick Check:</h4>
          <p>
            To verify if three lengths can form a triangle, check that the sum of any two sides 
            is greater than the third side. This must be true for all three combinations!
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
              <p className="text-sm">In a triangle, two angles measure 65° and 45°. What is the third angle?</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Classify the triangle:</h4>
              <p className="text-sm">A triangle has sides of length 6, 8, and 10. Classify by sides and angles.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Triangle inequality:</h4>
              <p className="text-sm">Can sides of length 3, 4, and 8 form a triangle? Explain why or why not.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Isosceles triangle:</h4>
              <p className="text-sm">In an isosceles triangle, the vertex angle is 40°. What are the measures of the base angles?</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};