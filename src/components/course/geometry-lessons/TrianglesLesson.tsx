import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Triangle, Calculator, Lightbulb } from 'lucide-react';

export const TrianglesLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Triangles and Triangle Properties</h1>
        <p className="text-lg text-muted-foreground">Properties, Classifications, and Relationships</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/triangle_lesson.jpg" 
          alt="Various types of triangles showing different classifications by sides and angles"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              <strong>Triangles</strong> are the simplest closed polygons and form the building blocks of many 
              geometric concepts. Their rigidity makes them essential in construction and engineering—notice how 
              many support structures, trusses, and frameworks use triangular designs. This is because a triangle 
              cannot be deformed without changing the length of at least one of its sides, making it inherently stable.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                <Triangle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Triangle Properties</h3>
                <p className="text-gray-600">Understanding the fundamental relationships in triangles</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Basic Properties of Triangles</h3>
            
            <Alert className="mb-6">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Sum of Interior Angles:</strong> The sum of the interior angles of any triangle is always 180 degrees. 
                You can demonstrate this by tearing off the three corners of a paper triangle and arranging them side by side—they form a straight line!
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Triangle Inequality</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">The sum of any two sides must be greater than the third side</p>
                  <p className="text-xs text-muted-foreground">This explains why you can't form a triangle with sides 2, 3, and 6</p>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-2">a + b > c</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-700">Exterior Angle Theorem</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">An exterior angle equals the sum of the two non-adjacent interior angles</p>
                  <p className="text-xs text-muted-foreground">Useful for finding unknown angles in triangles</p>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-2">Exterior ∠ = ∠A + ∠B</p>
                </CardContent>
              </Card>
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
                    <li>• Perfect symmetry - 3 lines of symmetry</li>
                    <li>• Also called "regular triangle"</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Isosceles Triangle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Exactly two sides equal</li>
                    <li>• Two base angles equal</li>
                    <li>• One line of symmetry</li>
                    <li>• Vertex angle may differ from base angles</li>
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
                    <li>• Most general type of triangle</li>
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
                    <li>• All vertices are "sharp"</li>
                    <li>• Circumcenter lies inside triangle</li>
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
                    <li>• One angle equals exactly 90°</li>
                    <li>• Hypotenuse is longest side</li>
                    <li>• Pythagorean theorem applies</li>
                    <li>• Foundation of trigonometry</li>
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
                    <li>• Largest angle is obtuse</li>
                    <li>• Circumcenter lies outside triangle</li>
                    <li>• Example: 120°, 40°, 20°</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">The Pythagorean Theorem</h3>
            
            <Card className="border-indigo-200 mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-700 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Most Famous Theorem in Mathematics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.</p>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-lg font-mono text-center">a² + b² = c²</p>
                    <p className="text-xs text-center text-muted-foreground mt-2">where c is the hypotenuse</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-blue-700">Applications:</h4>
                      <ul className="space-y-1">
                        <li>• Finding unknown side lengths</li>
                        <li>• Verifying right triangles</li>
                        <li>• Distance calculations</li>
                        <li>• Construction and engineering</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700">Famous Example:</h4>
                      <ul className="space-y-1">
                        <li>• 3-4-5 triangle</li>
                        <li>• 3² + 4² = 9 + 16 = 25</li>
                        <li>• √25 = 5 ✓</li>
                        <li>• Used by carpenters for square corners</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-xl font-semibold mb-4">Problem-Solving Approach</h3>
            
            <Card className="border-gray-200 mb-8">
              <CardHeader>
                <CardTitle className="text-lg text-gray-700">Triangle Problem Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold text-blue-700">1. Identify the Triangle Type</h4>
                    <p>Classify by sides and angles to determine which properties and theorems apply</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700">2. List Known Information</h4>
                    <p>Record all given side lengths, angles, and special relationships</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700">3. Apply Relevant Theorems</h4>
                    <p>Use angle sum, Pythagorean theorem, or triangle inequality as appropriate</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-700">4. Verify Your Answer</h4>
                    <p>Check that angles sum to 180° and sides satisfy triangle inequality</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-green-200 bg-green-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Quick Triangle Check:</h4>
          <p>
            To verify if three lengths can form a triangle, check that the sum of any two sides 
            is greater than the third side. This must be true for <strong>all three combinations!</strong>
            If any combination fails, no triangle can be formed.
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
              <p className="text-xs text-muted-foreground">Hint: All angles in a triangle sum to 180°</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Classify the triangle:</h4>
              <p className="text-sm">A triangle has sides of length 6, 8, and 10. Classify by sides and angles.</p>
              <p className="text-xs text-muted-foreground">Check if it's a right triangle using the Pythagorean theorem</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Triangle inequality:</h4>
              <p className="text-sm">Can sides of length 3, 4, and 8 form a triangle? Explain why or why not.</p>
              <p className="text-xs text-muted-foreground">Test all three combinations: 3+4&gt;8? 3+8&gt;4? 4+8&gt;3?</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Isosceles triangle problem:</h4>
              <p className="text-sm">In an isosceles triangle, the vertex angle is 40°. What are the measures of the base angles?</p>
              <p className="text-xs text-muted-foreground">Remember: Base angles in isosceles triangles are equal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};