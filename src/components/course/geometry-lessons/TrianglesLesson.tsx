import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Triangle, BookOpen, Target, Calculator } from 'lucide-react';

export const TrianglesLesson: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-background">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Module 2: Triangles and Triangle Properties</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Introduction</h2>
          <p className="text-muted-foreground mb-4">
            Welcome to Module 2 of our Geometry course! In this module, we will focus on triangles, one of the most fundamental shapes in geometry. We will explore the properties of triangles, different types of triangles, and important theorems related to triangles.
          </p>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Lightbulb className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                <p className="text-sm text-amber-700">
                  Triangles are the simplest closed polygons and form the building blocks of many geometric concepts. Their rigidity makes them essential in construction and engineering—notice how many support structures, trusses, and frameworks use triangular designs. This is because a triangle cannot be deformed without changing the length of at least one of its sides, making it inherently stable.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Learning Objectives</h2>
          <p className="text-muted-foreground mb-3">By the end of this module, you will be able to:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Classify triangles based on their sides and angles</li>
            <li>Apply the properties of triangles to solve problems</li>
            <li>Understand and apply the Pythagorean theorem</li>
            <li>Calculate the area and perimeter of triangles</li>
            <li>Apply triangle congruence and similarity principles</li>
            <li>Use triangles to solve real-world problems</li>
          </ul>
        </div>
      </header>

      <div className="space-y-8">
        {/* Section 1: Triangle Basics */}
        <Card>
          <CardHeader>
            <CardTitle>Section 1: Triangle Basics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">What is a Triangle?</h3>
              <p className="mb-4">
                A triangle is a polygon with three sides, three angles, and three vertices. It is the simplest polygon and has many interesting properties.
              </p>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      The word "triangle" comes from the Latin words "tri" (three) and "angulus" (angle or corner). Every triangle has exactly three sides, three angles, and three vertices—no more, no less. This consistency makes triangles particularly useful for mathematical analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Properties of Triangles</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">1. Sum of Interior Angles</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    The sum of the interior angles of a triangle is always 180 degrees.
                  </p>
                  
                  <div className="bg-blue-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-blue-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-blue-700">
                          You can demonstrate this property by tearing off the three corners of a paper triangle and arranging them side by side. You'll notice they form a straight line, which is 180 degrees. This property is true for all triangles, regardless of their size or shape!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-400 bg-green-50 p-4">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">2. Triangle Inequality Theorem</h4>
                  <p className="text-sm text-green-700 mb-3">
                    The sum of the lengths of any two sides of a triangle must be greater than the length of the remaining side.
                  </p>
                  
                  <div className="bg-green-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-green-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-green-700">
                          This theorem explains why you can't form a triangle with just any three lengths. For example, you cannot make a triangle with sides of length 2, 3, and 6 because 2 + 3 = 5, which is less than 6. Physically, this means that the two shorter sides cannot "reach" far enough to meet and form the third side.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-400 bg-purple-50 p-4">
                  <h4 className="text-lg font-semibold text-purple-800 mb-3">3. Exterior Angle Theorem</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    The measure of an exterior angle of a triangle is equal to the sum of the measures of the two non-adjacent interior angles.
                  </p>
                  
                  <div className="bg-purple-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-purple-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-purple-700">
                          An exterior angle is formed by extending one side of the triangle. If you know two interior angles of a triangle, you can find the third by using this theorem. It's a powerful tool for solving problems involving triangles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Problem-Solving Approach: Using Triangle Properties</h3>
              <p className="mb-4">When solving problems involving triangle properties, follow these steps:</p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">1. Identify the given information:</h4>
                  <p className="text-sm text-muted-foreground">Note what angles, sides, or other properties are provided.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">2. Recall relevant properties:</h4>
                  <p className="text-sm text-muted-foreground">Determine which triangle properties apply to the problem.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">3. Set up equations:</h4>
                  <p className="text-sm text-muted-foreground">Use the properties to create equations with the unknown values.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">4. Solve the equations:</h4>
                  <p className="text-sm text-muted-foreground">Find the values of the unknowns.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">5. Verify your answer:</h4>
                  <p className="text-sm text-muted-foreground">Check that your solution satisfies all conditions of the problem.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-800">Example Problem:</h4>
              <p className="text-sm mb-3 text-blue-700">
                <strong>In triangle ABC, angles A and B measure 45° and 60° respectively. Find the measure of angle C.</strong>
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-1 text-blue-800">Solution:</p>
                  <p className="text-sm text-blue-700 mb-2">Using the property that the sum of interior angles equals 180°:</p>
                  <ul className="space-y-1 text-sm text-blue-700 list-disc list-inside ml-4">
                    <li>A + B + C = 180°</li>
                    <li>45° + 60° + C = 180°</li>
                    <li>105° + C = 180°</li>
                    <li>C = 75°</li>
                  </ul>
                </div>

                <div className="bg-blue-100 p-3 rounded mt-3">
                  <p className="text-sm font-semibold text-blue-800">Therefore, angle C measures 75°.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Types of Triangles */}
        <Card>
          <CardHeader>
            <CardTitle>Section 2: Types of Triangles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Classification Based on Sides</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">1. Equilateral Triangle</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    A triangle with all three sides of equal length. All angles in an equilateral triangle are also equal (60 degrees each).
                  </p>
                  
                  <div className="bg-blue-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-blue-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-blue-700">
                          Equilateral triangles have perfect symmetry. If you fold an equilateral triangle along any line from a vertex to the midpoint of the opposite side (a median), the two halves will match perfectly. This line is also an angle bisector and a perpendicular bisector of the side.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-400 bg-green-50 p-4">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">2. Isosceles Triangle</h4>
                  <p className="text-sm text-green-700 mb-3">
                    A triangle with two sides of equal length. The angles opposite to the equal sides are also equal.
                  </p>
                  
                  <div className="bg-green-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-green-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-green-700">
                          The word "isosceles" comes from Greek, meaning "equal legs." If you draw a line from the vertex between the two equal sides to the opposite side, perpendicular to that side, you'll create two congruent right triangles. This line is simultaneously an angle bisector, a perpendicular bisector, and a median.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-400 bg-purple-50 p-4">
                  <h4 className="text-lg font-semibold text-purple-800 mb-3">3. Scalene Triangle</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    A triangle with all three sides of different lengths. All angles in a scalene triangle are also different.
                  </p>
                  
                  <div className="bg-purple-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-purple-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-purple-700">
                          Most triangles you encounter in real life are scalene. While they lack the symmetry of equilateral or isosceles triangles, they have their own interesting properties. For instance, the longest side is always opposite to the largest angle, and the shortest side is opposite to the smallest angle.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Classification Based on Angles</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-400 bg-red-50 p-4">
                  <h4 className="text-lg font-semibold text-red-800 mb-3">1. Acute Triangle</h4>
                  <p className="text-sm text-red-700 mb-3">
                    A triangle with all three angles less than 90 degrees.
                  </p>
                  
                  <div className="bg-red-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-red-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-red-700">
                          In an acute triangle, all vertices are "pointed" rather than "blunt." The center of the circumscribed circle (the circle that passes through all three vertices) lies inside the triangle.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-orange-400 bg-orange-50 p-4">
                  <h4 className="text-lg font-semibold text-orange-800 mb-3">2. Right Triangle</h4>
                  <p className="text-sm text-orange-700 mb-3">
                    A triangle with one angle equal to 90 degrees.
                  </p>
                  
                  <div className="bg-orange-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-orange-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-orange-700">
                          The side opposite to the right angle is called the hypotenuse, and it's always the longest side of the triangle. The other two sides are called legs or catheti. Right triangles are fundamental in trigonometry and have numerous applications in construction, navigation, and physics.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-teal-400 bg-teal-50 p-4">
                  <h4 className="text-lg font-semibold text-teal-800 mb-3">3. Obtuse Triangle</h4>
                  <p className="text-sm text-teal-700 mb-3">
                    A triangle with one angle greater than 90 degrees.
                  </p>
                  
                  <div className="bg-teal-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-teal-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-teal-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-teal-700">
                          In an obtuse triangle, the center of the circumscribed circle lies outside the triangle. Also, the largest angle is the obtuse angle, and the longest side is opposite to this angle.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-800">Example Problem:</h4>
              <p className="text-sm mb-3 text-green-700">
                <strong>Classify the triangle with sides of lengths 5 cm, 5 cm, and 8 cm based on its sides and angles.</strong>
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-1 text-green-800">Solution:</p>
                  <p className="text-sm text-green-700 mb-2">Since two sides are equal (5 cm), this is an isosceles triangle.</p>
                  
                  <p className="text-sm text-green-700 mb-2">To determine the angle classification, we can use the cosine law:</p>
                  <p className="text-sm text-green-700 mb-2">cos(C) = (a² + b² - c²) / (2ab)</p>
                  <p className="text-sm text-green-700 mb-2">where C is the angle opposite to the side of length 8 cm, and a and b are both 5 cm.</p>
                  
                  <ul className="space-y-1 text-sm text-green-700 list-disc list-inside ml-4">
                    <li>cos(C) = (5² + 5² - 8²) / (2 × 5 × 5)</li>
                    <li>cos(C) = (25 + 25 - 64) / 50</li>
                    <li>cos(C) = -14 / 50</li>
                    <li>cos(C) = -0.28</li>
                  </ul>
                  
                  <p className="text-sm text-green-700 mb-2">Since cos(C) is negative, C is greater than 90°, making this an obtuse triangle.</p>
                </div>

                <div className="bg-green-100 p-3 rounded mt-3">
                  <p className="text-sm font-semibold text-green-800">Therefore, the triangle is an isosceles obtuse triangle.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: The Pythagorean Theorem */}
        <Card>
          <CardHeader>
            <CardTitle>Section 3: The Pythagorean Theorem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Statement of the Pythagorean Theorem</h3>
              <p className="mb-4">
                In a right triangle, the square of the length of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the lengths of the other two sides.
              </p>
              
              <p className="mb-4">
                If a and b are the lengths of the legs (the sides adjacent to the right angle) and c is the length of the hypotenuse, then:
              </p>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-blue-800 mb-2 text-center text-xl">c² = a² + b²</h4>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      The Pythagorean theorem is named after the ancient Greek mathematician Pythagoras, although evidence suggests it was known to several ancient civilizations. This theorem is one of the most fundamental relationships in Euclidean geometry and has countless applications in mathematics, physics, engineering, and everyday life.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      There are over 350 different proofs of the Pythagorean theorem! One intuitive way to understand it is to draw squares on each side of a right triangle. The area of the square on the hypotenuse equals the sum of the areas of the squares on the other two sides.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Applications of the Pythagorean Theorem</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">1. Finding the length of the hypotenuse</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    If you know the lengths of the two legs, you can find the length of the hypotenuse using the Pythagorean theorem.
                  </p>
                  
                  <div className="bg-blue-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-blue-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-blue-700">
                          This application is particularly useful in construction and navigation. For example, if you need to place a ladder against a wall, the Pythagorean theorem helps determine how long the ladder needs to be.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-400 bg-green-50 p-4">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">2. Finding the length of a leg</h4>
                  <p className="text-sm text-green-700 mb-3">
                    If you know the length of the hypotenuse and one leg, you can find the length of the other leg using the Pythagorean theorem.
                  </p>
                  
                  <div className="bg-green-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-green-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-green-700">
                          Rearranging the Pythagorean theorem, we get a² = c² - b² or b² = c² - a². This allows us to find either leg when we know the hypotenuse and the other leg.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-400 bg-purple-50 p-4">
                  <h4 className="text-lg font-semibold text-purple-800 mb-3">3. Checking if a triangle is a right triangle</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    If the Pythagorean theorem holds for three sides of a triangle, then the triangle is a right triangle.
                  </p>
                  
                  <div className="bg-purple-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-purple-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-purple-700">
                          This application is the basis for the 3-4-5 rule used by carpenters and builders to ensure corners are square. If a triangle has sides of lengths 3, 4, and 5 units, it must be a right triangle because 3² + 4² = 5² (9 + 16 = 25).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-800">Example Problem:</h4>
              <p className="text-sm mb-3 text-orange-700">
                <strong>A ladder 10 meters long leans against a vertical wall. If the bottom of the ladder is 6 meters from the base of the wall, how high up the wall does the ladder reach?</strong>
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-1 text-orange-800">Solution:</p>
                  <p className="text-sm text-orange-700 mb-2">Let's denote the height up the wall as h.</p>
                  <p className="text-sm text-orange-700 mb-2">The ladder forms a right triangle with the wall and the ground.</p>
                  <p className="text-sm text-orange-700 mb-2">Using the Pythagorean theorem:</p>
                  <ul className="space-y-1 text-sm text-orange-700 list-disc list-inside ml-4">
                    <li>10² = 6² + h²</li>
                    <li>100 = 36 + h²</li>
                    <li>h² = 64</li>
                    <li>h = 8</li>
                  </ul>
                </div>

                <div className="bg-orange-100 p-3 rounded mt-3">
                  <p className="text-sm font-semibold text-orange-800">Therefore, the ladder reaches 8 meters up the wall.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Triangle Congruence */}
        <Card>
          <CardHeader>
            <CardTitle>Section 4: Triangle Congruence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">What is Triangle Congruence?</h3>
              <p className="mb-4">
                Two triangles are congruent if they have the same shape and size. This means that all corresponding sides and angles are equal.
              </p>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      Congruent triangles are essentially identical copies of each other. If you cut out two congruent triangles from paper, you could place one directly on top of the other, and they would match perfectly. In mathematical terms, congruent triangles can be mapped onto each other through rigid transformations (translations, rotations, and reflections).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Triangle Congruence Criteria</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">1. Side-Side-Side (SSS)</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    If three sides of one triangle are equal to three sides of another triangle, then the triangles are congruent.
                  </p>
                  
                  <div className="bg-blue-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-blue-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-blue-700">
                          This criterion makes intuitive sense: if you have three rigid rods of specific lengths, you can only arrange them to form one unique triangle. The SSS criterion is particularly useful in construction and engineering, where structures are often built using rigid components.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-400 bg-green-50 p-4">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">2. Side-Angle-Side (SAS)</h4>
                  <p className="text-sm text-green-700 mb-3">
                    If two sides and the included angle of one triangle are equal to two sides and the included angle of another triangle, then the triangles are congruent.
                  </p>
                  
                  <div className="bg-green-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-green-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-green-700">
                          The "included angle" is the angle formed by the two sides. It's important to note that the angle must be between the two sides for this criterion to apply. SAS is often used in surveying and navigation, where distances and angles are measured.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-400 bg-purple-50 p-4">
                  <h4 className="text-lg font-semibold text-purple-800 mb-3">3. Angle-Side-Angle (ASA)</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    If two angles and the included side of one triangle are equal to two angles and the included side of another triangle, then the triangles are congruent.
                  </p>
                  
                  <div className="bg-purple-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-purple-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-purple-700">
                          Since the sum of angles in a triangle is always 180°, if two angles are equal, the third angle must also be equal. This means ASA effectively determines all three angles and one side, which is enough to fix the size and shape of the triangle.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-400 bg-red-50 p-4">
                  <h4 className="text-lg font-semibold text-red-800 mb-3">4. Angle-Angle-Side (AAS)</h4>
                  <p className="text-sm text-red-700 mb-3">
                    If two angles and a non-included side of one triangle are equal to two angles and the corresponding non-included side of another triangle, then the triangles are congruent.
                  </p>
                  
                  <div className="bg-red-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-red-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-red-700">
                          AAS is similar to ASA in that it specifies two angles (which determines the third angle as well) and one side. The difference is that in AAS, the side is not between the two given angles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-teal-400 bg-teal-50 p-4">
                  <h4 className="text-lg font-semibold text-teal-800 mb-3">5. Hypotenuse-Leg (HL)</h4>
                  <p className="text-sm text-teal-700 mb-3">
                    If the hypotenuse and one leg of a right triangle are equal to the hypotenuse and the corresponding leg of another right triangle, then the triangles are congruent.
                  </p>
                  
                  <div className="bg-teal-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-teal-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-teal-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-teal-700">
                          This criterion only applies to right triangles. It's essentially a special case of SSS or SAS, but it's useful enough to be listed separately. The right angle provides additional constraint that makes two sides sufficient for congruence.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-800">Example Problem:</h4>
              <p className="text-sm mb-3 text-blue-700">
                <strong>In the figure below, AB = DE, AC = DF, and angle A = angle D. Prove that triangles ABC and DEF are congruent.</strong>
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-1 text-blue-800">Solution:</p>
                  <p className="text-sm text-blue-700 mb-2">Given:</p>
                  <ul className="space-y-1 text-sm text-blue-700 list-disc list-inside ml-4">
                    <li>AB = DE (one pair of sides are equal)</li>
                    <li>AC = DF (another pair of sides are equal)</li>
                    <li>Angle A = Angle D (the angles between these pairs of sides are equal)</li>
                  </ul>
                  
                  <p className="text-sm text-blue-700 mb-2">
                    Since we have two sides and the included angle of one triangle equal to two sides and the included angle of another triangle, we can apply the SAS (Side-Angle-Side) congruence criterion.
                  </p>
                </div>

                <div className="bg-blue-100 p-3 rounded mt-3">
                  <p className="text-sm font-semibold text-blue-800">Therefore, triangle ABC is congruent to triangle DEF by SAS.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Triangle Similarity */}
        <Card>
          <CardHeader>
            <CardTitle>Section 5: Triangle Similarity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">What is Triangle Similarity?</h3>
              <p className="mb-4">
                Two triangles are similar if they have the same shape but not necessarily the same size. This means that all corresponding angles are equal and all corresponding sides are proportional.
              </p>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      Similar triangles appear frequently in everyday life. When you look at objects from different distances, the images formed on your retina are similar triangles. This principle is also used in photography, mapmaking, and architecture. For instance, a small-scale model of a building forms similar triangles with the actual building.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Triangle Similarity Criteria</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">1. Angle-Angle (AA)</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    If two angles of one triangle are equal to two angles of another triangle, then the triangles are similar.
                  </p>
                  
                  <div className="bg-blue-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-blue-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-blue-700">
                          Since the sum of angles in a triangle is 180°, if two angles are equal, the third angle must also be equal. This means AA effectively ensures that all three angles are equal, which guarantees similarity. Note that this only ensures the same shape, not the same size.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-400 bg-green-50 p-4">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">2. Side-Side-Side (SSS)</h4>
                  <p className="text-sm text-green-700 mb-3">
                    If the three sides of one triangle are proportional to the three sides of another triangle, then the triangles are similar.
                  </p>
                  
                  <div className="bg-green-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-green-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-green-700">
                          For triangles to be similar by SSS, the ratio of corresponding sides must be constant. For example, if one triangle has sides of 3, 4, and 5 units, and another has sides of 6, 8, and 10 units, they are similar because all sides of the second triangle are twice the length of the corresponding sides of the first triangle.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-400 bg-purple-50 p-4">
                  <h4 className="text-lg font-semibold text-purple-800 mb-3">3. Side-Angle-Side (SAS)</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    If two sides of one triangle are proportional to two sides of another triangle, and the included angles are equal, then the triangles are similar.
                  </p>
                  
                  <div className="bg-purple-100 p-3 rounded mt-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-purple-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-purple-700">
                          This criterion combines aspects of both AA and SSS. The equal angles ensure the same shape in that particular corner, while the proportional sides ensure the overall proportionality of the triangles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-800">Example Problem:</h4>
              <p className="text-sm mb-3 text-green-700">
                <strong>Triangle ABC is similar to triangle DEF. If AB = 6 cm, BC = 8 cm, AC = 10 cm, and DE = 9 cm, find EF and DF.</strong>
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-1 text-green-800">Solution:</p>
                  <p className="text-sm text-green-700 mb-2">Since the triangles are similar, corresponding sides are proportional.</p>
                  <p className="text-sm text-green-700 mb-2">The ratio of corresponding sides is:</p>
                  <p className="text-sm text-green-700 mb-2">DE / AB = 9 / 6 = 3/2</p>
                  
                  <p className="text-sm text-green-700 mb-2">Therefore:</p>
                  <ul className="space-y-1 text-sm text-green-700 list-disc list-inside ml-4">
                    <li>EF / BC = 3/2</li>
                    <li>EF = (3/2) × 8 = 12 cm</li>
                    <li>DF / AC = 3/2</li>
                    <li>DF = (3/2) × 10 = 15 cm</li>
                  </ul>
                </div>

                <div className="bg-green-100 p-3 rounded mt-3">
                  <p className="text-sm font-semibold text-green-800">Therefore, EF = 12 cm and DF = 15 cm.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Area and Perimeter of Triangles */}
        <Card>
          <CardHeader>
            <CardTitle>Section 6: Area and Perimeter of Triangles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Perimeter of a Triangle</h3>
              <p className="mb-4">
                The perimeter of a triangle is the sum of the lengths of its three sides.
              </p>
              
              <p className="mb-4">
                If a, b, and c are the lengths of the sides of a triangle, then the perimeter P is given by:
              </p>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-blue-800 mb-2 text-center text-xl">P = a + b + c</h4>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      The perimeter is essentially the distance around the triangle. If you were to walk along the boundary of a triangular field, the total distance you'd travel would be the perimeter.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Area of a Triangle</h3>
              <p className="mb-4">There are several formulas for calculating the area of a triangle:</p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">1. Base and Height Formula</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    If b is the base of the triangle and h is the height (the perpendicular distance from the base to the opposite vertex), then the area A is given by:
                  </p>
                  
                  <div className="bg-blue-100 p-3 rounded mb-3">
                    <h5 className="font-semibold text-blue-800 text-center">A = (1/2) × b × h</h5>
                  </div>
                  
                  <div className="bg-blue-100 p-3 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-blue-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-blue-700">
                          This is the most commonly used formula for triangle area. Any side of the triangle can be chosen as the base, and the height is always measured perpendicular to the base. This formula works because a triangle is half of a parallelogram with the same base and height.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-400 bg-green-50 p-4">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">2. Heron's Formula</h4>
                  <p className="text-sm text-green-700 mb-3">
                    If a, b, and c are the lengths of the sides of a triangle, and s is the semi-perimeter (s = (a + b + c) / 2), then the area A is given by:
                  </p>
                  
                  <div className="bg-green-100 p-3 rounded mb-3">
                    <h5 className="font-semibold text-green-800 text-center">A = √(s × (s - a) × (s - b) × (s - c))</h5>
                  </div>
                  
                  <div className="bg-green-100 p-3 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-green-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-green-700">
                          Heron's formula (also known as Hero's formula) is particularly useful when you know the three sides of a triangle but not the height. It was derived by Heron of Alexandria, a Greek mathematician and engineer from the 1st century AD.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-400 bg-purple-50 p-4">
                  <h4 className="text-lg font-semibold text-purple-800 mb-3">3. Trigonometric Formula</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    If a and b are two sides of a triangle, and C is the angle between them, then the area A is given by:
                  </p>
                  
                  <div className="bg-purple-100 p-3 rounded mb-3">
                    <h5 className="font-semibold text-purple-800 text-center">A = (1/2) × a × b × sin(C)</h5>
                  </div>
                  
                  <div className="bg-purple-100 p-3 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-purple-700 font-medium mb-1">Teaching Moment:</p>
                        <p className="text-xs text-purple-700">
                          This formula is derived from the base and height formula. If we choose a as the base, then the height h = b × sin(C). Substituting this into the base and height formula gives us the trigonometric formula.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-800">Example Problem:</h4>
              <p className="text-sm mb-3 text-orange-700">
                <strong>Find the area of a triangle with sides of lengths 5 cm, 12 cm, and 13 cm.</strong>
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-1 text-orange-800">Solution:</p>
                  <p className="text-sm text-orange-700 mb-2">We can use Heron's formula since we know all three sides.</p>
                  
                  <p className="text-sm text-orange-700 mb-2">First, calculate the semi-perimeter s:</p>
                  <p className="text-sm text-orange-700 mb-2">s = (a + b + c) / 2 = (5 + 12 + 13) / 2 = 30 / 2 = 15 cm</p>
                  
                  <p className="text-sm text-orange-700 mb-2">Now apply Heron's formula:</p>
                  <ul className="space-y-1 text-sm text-orange-700 list-disc list-inside ml-4">
                    <li>A = √(s × (s - a) × (s - b) × (s - c))</li>
                    <li>A = √(15 × (15 - 5) × (15 - 12) × (15 - 13))</li>
                    <li>A = √(15 × 10 × 3 × 2)</li>
                    <li>A = √(900)</li>
                    <li>A = 30 cm²</li>
                  </ul>
                </div>

                <div className="bg-orange-100 p-3 rounded mt-3">
                  <p className="text-sm font-semibold text-orange-800">Therefore, the area of the triangle is 30 square centimeters.</p>
                </div>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      Notice that this triangle is a right triangle (5² + 12² = 13²), so we could also have used the base and height formula with the legs as base and height: A = (1/2) × 5 × 12 = 30 cm². This serves as a good check on our answer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice Problems */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Practice Problems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">1.</h4>
                <p className="text-sm mb-3">Classify the triangle with sides 3 cm, 4 cm, and 5 cm based on its sides and angles.</p>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-2">
                  <p className="text-xs text-blue-700 font-medium mb-1">Problem-Solving Guidance:</p>
                  <p className="text-xs text-blue-700 mb-2">First, check if the triangle satisfies the Pythagorean theorem to determine if it's a right triangle. Then examine the sides to classify it as equilateral, isosceles, or scalene.</p>
                  
                  <p className="text-xs text-blue-700 font-medium mb-1">Step-by-Step Approach:</p>
                  <ul className="space-y-1 text-xs text-blue-700 list-disc list-inside ml-2">
                    <li>Check if 3² + 4² = 5²</li>
                    <li>9 + 16 = 25 ✓</li>
                    <li>Since the Pythagorean theorem is satisfied, it's a right triangle</li>
                    <li>Since all three sides have different lengths, it's a scalene triangle</li>
                    <li>Therefore, it's a scalene right triangle</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">2.</h4>
                <p className="text-sm mb-3">Find the length of the hypotenuse of a right triangle with legs of lengths 6 cm and 8 cm.</p>
                
                <div className="bg-green-50 border-l-4 border-green-400 p-3 mt-2">
                  <p className="text-xs text-green-700 font-medium mb-1">Problem-Solving Guidance:</p>
                  <p className="text-xs text-green-700 mb-2">Apply the Pythagorean theorem, c² = a² + b², where a and b are the legs and c is the hypotenuse.</p>
                  
                  <p className="text-xs text-green-700 font-medium mb-1">Step-by-Step Approach:</p>
                  <ul className="space-y-1 text-xs text-green-700 list-disc list-inside ml-2">
                    <li>c² = 6² + 8²</li>
                    <li>c² = 36 + 64</li>
                    <li>c² = 100</li>
                    <li>c = 10 cm</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">3.</h4>
                <p className="text-sm mb-3">Determine if two triangles with sides 3 cm, 4 cm, 5 cm and 6 cm, 8 cm, 10 cm are similar.</p>
                
                <div className="bg-purple-50 border-l-4 border-purple-400 p-3 mt-2">
                  <p className="text-xs text-purple-700 font-medium mb-1">Problem-Solving Guidance:</p>
                  <p className="text-xs text-purple-700 mb-2">Check if the corresponding sides are proportional. If the ratios of corresponding sides are equal, the triangles are similar by the SSS similarity criterion.</p>
                  
                  <p className="text-xs text-purple-700 font-medium mb-1">Step-by-Step Approach:</p>
                  <div className="text-xs text-purple-700 ml-2">
                    <p className="mb-1">Find the ratios of corresponding sides:</p>
                    <ul className="space-y-1 list-disc list-inside ml-2">
                      <li>6/3 = 2</li>
                      <li>8/4 = 2</li>
                      <li>10/5 = 2</li>
                    </ul>
                    <p className="mt-1">Since all ratios are equal (2), the triangles are similar by SSS</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">4.</h4>
                <p className="text-sm mb-3">Calculate the area of a triangle with sides 5 cm, 12 cm, and 13 cm.</p>
                
                <div className="bg-red-50 border-l-4 border-red-400 p-3 mt-2">
                  <p className="text-xs text-red-700 font-medium mb-1">Problem-Solving Guidance:</p>
                  <p className="text-xs text-red-700 mb-2">Use Heron's formula or recognize that this is a right triangle (by the Pythagorean theorem) and use the base and height formula.</p>
                  
                  <p className="text-xs text-red-700 font-medium mb-1">Step-by-Step Approach:</p>
                  <div className="text-xs text-red-700 ml-2">
                    <p className="mb-1 font-medium">Method 1 (Heron's formula):</p>
                    <ul className="space-y-1 list-disc list-inside ml-2 mb-2">
                      <li>s = (5 + 12 + 13) / 2 = 15 cm</li>
                      <li>A = √(15 × 10 × 3 × 2) = 30 cm²</li>
                    </ul>
                    
                    <p className="mb-1 font-medium">Method 2 (Base and height):</p>
                    <ul className="space-y-1 list-disc list-inside ml-2">
                      <li>Verify it's a right triangle: 5² + 12² = 13² (25 + 144 = 169) ✓</li>
                      <li>A = (1/2) × 5 × 12 = 30 cm²</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">5.</h4>
                <p className="text-sm mb-3">If two angles of a triangle are 30 degrees and 60 degrees, what is the measure of the third angle?</p>
                
                <div className="bg-teal-50 border-l-4 border-teal-400 p-3 mt-2">
                  <p className="text-xs text-teal-700 font-medium mb-1">Problem-Solving Guidance:</p>
                  <p className="text-xs text-teal-700 mb-2">Use the property that the sum of interior angles in a triangle is 180 degrees.</p>
                  
                  <p className="text-xs text-teal-700 font-medium mb-1">Step-by-Step Approach:</p>
                  <ul className="space-y-1 text-xs text-teal-700 list-disc list-inside ml-2">
                    <li>A + B + C = 180°</li>
                    <li>30° + 60° + C = 180°</li>
                    <li>90° + C = 180°</li>
                    <li>C = 90°</li>
                    <li>Therefore, the third angle is 90 degrees (a right angle)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              In this module, we have explored the properties of triangles, different types of triangles, and important theorems related to triangles. We have learned about triangle congruence and similarity, the Pythagorean theorem, and how to calculate the area and perimeter of triangles.
            </p>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                  <p className="text-sm text-amber-700">
                    Triangles are not just abstract mathematical concepts—they are fundamental to our understanding of the physical world. From architecture to navigation, from art to engineering, triangles play a crucial role in countless applications. The principles you've learned in this module will serve as building blocks for more advanced geometric concepts and real-world problem-solving.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              In the next module, we will explore quadrilaterals and their properties. We'll see how many of the concepts we've learned about triangles can be extended to four-sided shapes, and we'll discover new properties unique to quadrilaterals.
            </p>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                  <p className="text-sm text-amber-700">
                    As you move forward, remember that many quadrilaterals can be divided into triangles. This connection allows us to apply what we know about triangles to understand more complex shapes. Keep an eye out for how triangles form the foundation of other geometric concepts!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};