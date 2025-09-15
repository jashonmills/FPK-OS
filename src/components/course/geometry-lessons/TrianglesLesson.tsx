import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Triangle, Calculator, Lightbulb, TrendingUp, ArrowRight, Compass, Zap } from 'lucide-react';

export const TrianglesLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Triangle className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold">Module 2: Triangles and Triangle Properties</h1>
        </div>
        <p className="text-lg text-muted-foreground">Properties, Classifications, and Relationships</p>
      </div>

      {/* Introduction */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Introduction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">
            Welcome to Module 2 of our Geometry course! In this module, we will focus on triangles, one of the most fundamental shapes in geometry. We will explore the properties of triangles, different types of triangles, and important theorems related to triangles.
          </p>
        </CardContent>
      </Card>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/triangle_lesson.jpg" 
          alt="Various types of triangles showing different classifications by sides and angles"
          className="w-1/2 mx-auto object-contain rounded-lg shadow-lg"
        />
      </div>

      {/* Teaching Moment */}
      <Alert className="border-blue-200 bg-blue-50">
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          <strong>Teaching Moment:</strong> Triangles are the simplest closed polygons and form the building blocks of many geometric concepts. Their rigidity makes them essential in construction and engineering—notice how many support structures, trusses, and frameworks use triangular designs. This is because a triangle cannot be deformed without changing the length of at least one of its sides, making it inherently stable.
        </AlertDescription>
      </Alert>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Classify triangles based on their sides and angles</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Apply the properties of triangles to solve problems</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Understand and apply the Pythagorean theorem</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Calculate the area and perimeter of triangles</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Apply triangle congruence and similarity principles</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Use triangles to solve real-world problems</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Triangle Basics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
            Triangle Basics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is a Triangle?</h3>
              <p>A triangle is a polygon with three sides, three angles, and three vertices. It is the simplest polygon and has many interesting properties.</p>
              
              <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> The word "triangle" comes from the Latin words "tri" (three) and "angulus" (angle or corner). Every triangle has exactly three sides, three angles, and three vertices—no more, no less. This consistency makes triangles particularly useful for mathematical analysis.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Properties of Triangles</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">1. Sum of Interior Angles</h4>
                  <p>The sum of the interior angles of a triangle is always 180 degrees.</p>
                  <Alert className="mt-2 border-blue-200 bg-blue-50">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Teaching Moment:</strong> You can demonstrate this property by tearing off the three corners of a paper triangle and arranging them side by side. You'll notice they form a straight line, which is 180 degrees. This property is true for all triangles, regardless of their size or shape!
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">2. Triangle Inequality Theorem</h4>
                  <p>The sum of the lengths of any two sides of a triangle must be greater than the length of the remaining side.</p>
                  <Alert className="mt-2 border-green-200 bg-green-50">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Teaching Moment:</strong> This theorem explains why you can't form a triangle with just any three lengths. For example, you cannot make a triangle with sides of length 2, 3, and 6 because 2 + 3 = 5, which is less than 6. Physically, this means that the two shorter sides cannot "reach" far enough to meet and form the third side.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold">3. Exterior Angle Theorem</h4>
                  <p>The measure of an exterior angle of a triangle is equal to the sum of the measures of the two non-adjacent interior angles.</p>
                  <Alert className="mt-2 border-purple-200 bg-purple-50">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Teaching Moment:</strong> An exterior angle is formed by extending one side of the triangle. If you know two interior angles of a triangle, you can find the third by using this theorem. It's a powerful tool for solving problems involving triangles.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                Problem-Solving Approach: Using Triangle Properties
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li><strong>Identify the given information:</strong> Note what angles, sides, or other properties are provided.</li>
                <li><strong>Recall relevant properties:</strong> Determine which triangle properties apply to the problem.</li>
                <li><strong>Set up equations:</strong> Use the properties to create equations with the unknown values.</li>
                <li><strong>Solve the equations:</strong> Find the values of the unknowns.</li>
                <li><strong>Verify your answer:</strong> Check that your solution satisfies all conditions of the problem.</li>
              </ol>
              
              <div className="mt-4 p-3 bg-white border rounded">
                <h5 className="font-semibold mb-2">Example Problem:</h5>
                <p className="text-sm mb-2">In triangle ABC, angles A and B measure 45° and 60° respectively. Find the measure of angle C.</p>
                <p className="text-sm mb-2"><strong>Solution:</strong></p>
                <p className="text-sm">Using the property that the sum of interior angles equals 180°:</p>
                <p className="text-sm">A + B + C = 180°</p>
                <p className="text-sm">45° + 60° + C = 180°</p>
                <p className="text-sm">105° + C = 180°</p>
                <p className="text-sm font-semibold">C = 75°</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Types of Triangles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
            Types of Triangles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Classification Based on Sides</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-blue-600 mb-2">Equilateral Triangle</h4>
                  <p className="text-sm mb-2">All three sides of equal length. All angles are 60°.</p>
                  <Alert className="border-blue-200 bg-blue-50">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Teaching Moment:</strong> Equilateral triangles have perfect symmetry. Any line from a vertex to the midpoint of the opposite side is simultaneously a median, angle bisector, and perpendicular bisector.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Isosceles Triangle</h4>
                  <p className="text-sm mb-2">Two sides of equal length. The angles opposite to the equal sides are also equal.</p>
                  <Alert className="border-green-200 bg-green-50">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Teaching Moment:</strong> The word "isosceles" comes from Greek, meaning "equal legs." The line from the vertex between equal sides to the opposite side creates two congruent right triangles.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-purple-600 mb-2">Scalene Triangle</h4>
                  <p className="text-sm mb-2">All three sides of different lengths. All angles are also different.</p>
                  <Alert className="border-purple-200 bg-purple-50">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Teaching Moment:</strong> Most real-life triangles are scalene. The longest side is always opposite the largest angle, and the shortest side opposite the smallest angle.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Classification Based on Angles</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">Acute Triangle</h4>
                  <p className="text-sm mb-2">All three angles less than 90°.</p>
                  <Alert className="border-orange-200 bg-orange-50">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Teaching Moment:</strong> In an acute triangle, all vertices are "pointed." The circumscribed circle's center lies inside the triangle.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-red-600 mb-2">Right Triangle</h4>
                  <p className="text-sm mb-2">One angle equal to 90°.</p>
                  <Alert className="border-red-200 bg-red-50">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Teaching Moment:</strong> The side opposite the right angle is the hypotenuse—always the longest side. Right triangles are fundamental in trigonometry.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-indigo-600 mb-2">Obtuse Triangle</h4>
                  <p className="text-sm mb-2">One angle greater than 90°.</p>
                  <Alert className="border-indigo-200 bg-indigo-50">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Teaching Moment:</strong> The circumscribed circle's center lies outside an obtuse triangle. The obtuse angle is always the largest angle.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: The Pythagorean Theorem */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <span className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
            The Pythagorean Theorem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
              <h3 className="text-2xl font-bold mb-2">c² = a² + b²</h3>
              <p className="text-gray-600">The fundamental relationship in right triangles</p>
            </div>

            <Alert className="border-purple-200 bg-purple-50">
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The Pythagorean theorem is named after the ancient Greek mathematician Pythagoras, although evidence suggests it was known to several ancient civilizations. This theorem is one of the most fundamental relationships in Euclidean geometry and has countless applications in mathematics, physics, engineering, and everyday life.
              </AlertDescription>
            </Alert>

            <div>
              <h3 className="text-lg font-semibold mb-3">Applications of the Pythagorean Theorem</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">Finding the Hypotenuse</h4>
                  <p className="text-sm">When you know both legs, use c² = a² + b² to find the hypotenuse.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">Finding a Leg</h4>
                  <p className="text-sm">When you know the hypotenuse and one leg, use a² = c² - b² to find the other leg.</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold">Checking Right Triangles</h4>
                  <p className="text-sm">If c² = a² + b², then the triangle is a right triangle (like the 3-4-5 rule).</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                Example Problem: Ladder Against a Wall
              </h4>
              <div className="p-3 bg-white border rounded">
                <p className="text-sm mb-2"><strong>Problem:</strong> A ladder 10 meters long leans against a vertical wall. If the bottom of the ladder is 6 meters from the base of the wall, how high up the wall does the ladder reach?</p>
                <p className="text-sm mb-2"><strong>Solution:</strong></p>
                <p className="text-sm">Let h = height up the wall</p>
                <p className="text-sm">Using Pythagorean theorem: 10² = 6² + h²</p>
                <p className="text-sm">100 = 36 + h²</p>
                <p className="text-sm">h² = 64</p>
                <p className="text-sm font-semibold">h = 8 meters</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Triangle Congruence */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <span className="bg-red-100 text-red-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
            Triangle Congruence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is Triangle Congruence?</h3>
              <p>Two triangles are congruent if they have the same shape and size. This means that all corresponding sides and angles are equal.</p>
              
              <Alert className="mt-4 border-blue-200 bg-blue-50">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> Congruent triangles are essentially identical copies of each other. If you cut out two congruent triangles from paper, you could place one directly on top of the other, and they would match perfectly.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Triangle Congruence Criteria</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-blue-600 mb-2">SSS (Side-Side-Side)</h4>
                  <p className="text-sm">If three sides of one triangle equal three sides of another triangle, the triangles are congruent.</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">SAS (Side-Angle-Side)</h4>
                  <p className="text-sm">If two sides and the included angle of one triangle equal those of another, the triangles are congruent.</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-purple-600 mb-2">ASA (Angle-Side-Angle)</h4>
                  <p className="text-sm">If two angles and the included side of one triangle equal those of another, the triangles are congruent.</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">AAS (Angle-Angle-Side)</h4>
                  <p className="text-sm">If two angles and a non-included side of one triangle equal those of another, the triangles are congruent.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Problems */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Zap className="h-6 w-6 mr-2" />
            Practice Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Problem 1: Triangle Classification</h4>
              <p className="text-sm mb-2">Classify a triangle with sides of lengths 5 cm, 5 cm, and 8 cm.</p>
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                <strong>Problem-Solving Guidance:</strong> First classify by sides (equal lengths?), then use the cosine law to determine angle classification.
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Problem 2: Pythagorean Application</h4>
              <p className="text-sm mb-2">A right triangle has legs of 9 cm and 12 cm. Find the hypotenuse.</p>
              <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                <strong>Problem-Solving Guidance:</strong> Use c² = a² + b² where a = 9 and b = 12.
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Problem 3: Triangle Inequality</h4>
              <p className="text-sm mb-2">Can a triangle be formed with sides of lengths 3, 7, and 12?</p>
              <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
                <strong>Problem-Solving Guidance:</strong> Check if the sum of any two sides is greater than the third side.
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Problem 4: Angle Sum Property</h4>
              <p className="text-sm mb-2">In triangle XYZ, angle X = 50° and angle Y = 70°. Find angle Z.</p>
              <div className="mt-2 p-2 bg-orange-50 rounded text-xs">
                <strong>Problem-Solving Guidance:</strong> Use the fact that interior angles sum to 180°.
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Problem 5: Congruence Criteria</h4>
              <p className="text-sm mb-2">Triangle ABC has sides AB = 5 cm, BC = 7 cm, CA = 9 cm. Triangle DEF has sides DE = 7 cm, EF = 9 cm, FD = 5 cm. Are the triangles congruent?</p>
              <div className="mt-2 p-2 bg-red-50 rounded text-xs">
                <strong>Problem-Solving Guidance:</strong> Check if the three sides match (SSS criterion).
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Module Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            In this module, we have explored triangles and their fundamental properties. We have learned about triangle classification, the Pythagorean theorem, and congruence criteria. These concepts form the foundation for understanding more complex geometric relationships.
          </p>
          
          <Alert className="border-green-200 bg-green-50">
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              <strong>Next Steps:</strong> In the next module, we will explore quadrilaterals and other polygons, building upon the triangle concepts you've learned here. The properties and relationships you've mastered will be essential for understanding more complex polygonal shapes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};