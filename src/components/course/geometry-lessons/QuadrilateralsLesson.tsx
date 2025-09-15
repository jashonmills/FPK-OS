import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Square, BookOpen, Target, Calculator } from 'lucide-react';

export const QuadrilateralsLesson: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-background">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Module 3: Quadrilaterals and Polygons</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Introduction</h2>
          <p className="text-muted-foreground mb-4">
            Welcome to Module 3 of our Geometry course! In this module, we will explore quadrilaterals, which are four-sided polygons, and other polygons with more than four sides. We will study their properties, classifications, and applications.
          </p>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Lightbulb className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                <p className="text-sm text-amber-700">
                  Quadrilaterals and polygons are everywhere in our daily lives—from the rectangular screens of our devices to the hexagonal tiles in bathrooms. Understanding these shapes helps us make sense of the world around us and solve practical problems in fields like architecture, design, and engineering. As you learn about these shapes, try to identify them in your surroundings and consider how their properties influence their uses.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Learning Objectives</h2>
          <p className="text-muted-foreground mb-3">By the end of this module, you will be able to:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Identify and classify different types of quadrilaterals</li>
            <li>Understand the properties of various quadrilaterals</li>
            <li>Calculate the area and perimeter of quadrilaterals</li>
            <li>Recognize and apply the properties of regular polygons</li>
            <li>Solve problems involving quadrilaterals and other polygons</li>
            <li>Apply geometric principles to real-world situations</li>
          </ul>
        </div>
      </header>

      <div className="space-y-8">
        {/* Section 1: Quadrilaterals */}
        <Card>
          <CardHeader>
            <CardTitle>Section 1: Quadrilaterals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">What is a Quadrilateral?</h3>
              <p className="mb-4">
                A quadrilateral is a polygon with four sides, four angles, and four vertices. The sum of the interior angles of a quadrilateral is always 360 degrees.
              </p>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      The word "quadrilateral" comes from Latin, where "quadri" means "four" and "latus" means "side." Unlike triangles, which are always rigid, quadrilaterals can be flexible unless additional constraints are imposed. This is why triangular supports are common in construction—they maintain their shape under pressure, while quadrilaterals might deform.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Types of Quadrilaterals</h3>
              
              <div className="space-y-8">
                {/* 1. Parallelogram */}
                <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">1. Parallelogram</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    <strong>Definition:</strong> A quadrilateral with opposite sides parallel and equal.
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2 text-blue-800">Properties:</p>
                    <ul className="space-y-1 text-sm text-blue-700 list-disc list-inside ml-4">
                      <li>Opposite sides are parallel and equal</li>
                      <li>Opposite angles are equal</li>
                      <li>Consecutive angles are supplementary (sum to 180 degrees)</li>
                      <li>Diagonals bisect each other</li>
                    </ul>
                  </div>
                </div>

                {/* 2. Rectangle */}
                <div className="border-l-4 border-green-400 bg-green-50 p-4">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">2. Rectangle</h4>
                  <p className="text-sm text-green-700 mb-3">
                    <strong>Definition:</strong> A parallelogram with four right angles.
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2 text-green-800">Properties:</p>
                    <ul className="space-y-1 text-sm text-green-700 list-disc list-inside ml-4">
                      <li>All angles are 90 degrees</li>
                      <li>Opposite sides are parallel and equal</li>
                      <li>Diagonals are equal and bisect each other</li>
                    </ul>
                  </div>
                </div>

                {/* 3. Square */}
                <div className="border-l-4 border-purple-400 bg-purple-50 p-4">
                  <h4 className="text-lg font-semibold text-purple-800 mb-3">3. Square</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    <strong>Definition:</strong> A rectangle with all sides equal.
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2 text-purple-800">Properties:</p>
                    <ul className="space-y-1 text-sm text-purple-700 list-disc list-inside ml-4">
                      <li>All sides are equal</li>
                      <li>All angles are 90 degrees</li>
                      <li>Diagonals are equal, bisect each other, and intersect at right angles</li>
                      <li>Diagonals bisect the opposite angles</li>
                    </ul>
                  </div>
                </div>

                {/* 4. Rhombus */}
                <div className="border-l-4 border-red-400 bg-red-50 p-4">
                  <h4 className="text-lg font-semibold text-red-800 mb-3">4. Rhombus</h4>
                  <p className="text-sm text-red-700 mb-3">
                    <strong>Definition:</strong> A parallelogram with all sides equal.
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2 text-red-800">Properties:</p>
                    <ul className="space-y-1 text-sm text-red-700 list-disc list-inside ml-4">
                      <li>All sides are equal</li>
                      <li>Opposite angles are equal</li>
                      <li>Diagonals bisect each other at right angles</li>
                      <li>Diagonals bisect the opposite angles</li>
                    </ul>
                  </div>
                </div>

                {/* 5. Trapezoid */}
                <div className="border-l-4 border-orange-400 bg-orange-50 p-4">
                  <h4 className="text-lg font-semibold text-orange-800 mb-3">5. Trapezoid (or Trapezium)</h4>
                  <p className="text-sm text-orange-700 mb-3">
                    <strong>Definition:</strong> A quadrilateral with exactly one pair of parallel sides.
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2 text-orange-800">Properties:</p>
                    <ul className="space-y-1 text-sm text-orange-700 list-disc list-inside ml-4">
                      <li>The parallel sides are called the bases</li>
                      <li>The non-parallel sides are called the legs</li>
                    </ul>
                  </div>
                </div>

                {/* 6. Kite */}
                <div className="border-l-4 border-teal-400 bg-teal-50 p-4">
                  <h4 className="text-lg font-semibold text-teal-800 mb-3">6. Kite</h4>
                  <p className="text-sm text-teal-700 mb-3">
                    <strong>Definition:</strong> A quadrilateral with two pairs of adjacent sides equal.
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2 text-teal-800">Properties:</p>
                    <ul className="space-y-1 text-sm text-teal-700 list-disc list-inside ml-4">
                      <li>Two pairs of adjacent sides are equal</li>
                      <li>One diagonal bisects the other diagonal at right angles</li>
                      <li>One diagonal bisects a pair of opposite angles</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Problem-Solving Approach: Identifying Quadrilaterals</h3>
              <p className="mb-4">When identifying the type of quadrilateral, follow these steps:</p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">1. Check for parallel sides:</h4>
                  <p className="text-sm text-muted-foreground mb-2">Determine if any sides are parallel to each other.</p>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                    <li>If two pairs of opposite sides are parallel, it's a parallelogram (or a more specific type).</li>
                    <li>If exactly one pair of sides is parallel, it's a trapezoid.</li>
                    <li>If no sides are parallel, it's an irregular quadrilateral.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">2. Check for equal sides:</h4>
                  <p className="text-sm text-muted-foreground mb-2">Determine if any sides have equal lengths.</p>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                    <li>If all sides are equal, it's either a rhombus or a square.</li>
                    <li>If two pairs of adjacent sides are equal, it's a kite.</li>
                    <li>If opposite sides are equal, it's a parallelogram (or a more specific type).</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">3. Check for right angles:</h4>
                  <p className="text-sm text-muted-foreground mb-2">Determine if any angles are 90 degrees.</p>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                    <li>If all angles are 90 degrees, it's a rectangle or a square.</li>
                    <li>If no angles are 90 degrees, it can't be a rectangle or a square.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">4. Apply the hierarchy:</h4>
                  <p className="text-sm text-muted-foreground mb-2">Remember that some quadrilaterals are special cases of others:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                    <li>A square is a special type of rectangle and rhombus.</li>
                    <li>A rectangle is a special type of parallelogram.</li>
                    <li>A rhombus is a special type of parallelogram.</li>
                    <li>A parallelogram is a special type of quadrilateral.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-800">Example Problem:</h4>
              <p className="text-sm mb-3 text-blue-700">
                <strong>Identify the type of quadrilateral with vertices at (0,0), (3,0), (4,3), and (1,3).</strong>
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-1 text-blue-800">Solution:</p>
                  <p className="text-sm text-blue-700 mb-2"><strong>Step 1:</strong> Calculate the lengths of all sides.</p>
                  <ul className="space-y-1 text-sm text-blue-700 list-disc list-inside ml-4">
                    <li>Side from (0,0) to (3,0): √((3-0)² + (0-0)²) = 3</li>
                    <li>Side from (3,0) to (4,3): √((4-3)² + (3-0)²) = √10</li>
                    <li>Side from (4,3) to (1,3): √((1-4)² + (3-3)²) = 3</li>
                    <li>Side from (1,3) to (0,0): √((0-1)² + (0-3)²) = √10</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-blue-700 mb-2"><strong>Step 2:</strong> Check for parallel sides.</p>
                  <ul className="space-y-1 text-sm text-blue-700 list-disc list-inside ml-4">
                    <li>Side from (0,0) to (3,0) and side from (4,3) to (1,3) both have slope 0, so they are parallel.</li>
                    <li>Side from (3,0) to (4,3) and side from (1,3) to (0,0) both have slope 3, so they are parallel.</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-blue-700 mb-2"><strong>Step 3:</strong> Check for equal sides.</p>
                  <ul className="space-y-1 text-sm text-blue-700 list-disc list-inside ml-4">
                    <li>Two opposite sides have length 3.</li>
                    <li>Two opposite sides have length √10.</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-blue-700 mb-2"><strong>Step 4:</strong> Check for right angles.</p>
                  <ul className="space-y-1 text-sm text-blue-700 list-disc list-inside ml-4">
                    <li>Calculate the dot product of adjacent sides to check if they're perpendicular.</li>
                    <li>The sides are not all perpendicular to each other.</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-blue-700 mb-2"><strong>Step 5:</strong> Apply the hierarchy.</p>
                  <ul className="space-y-1 text-sm text-blue-700 list-disc list-inside ml-4">
                    <li>The quadrilateral has two pairs of parallel sides, so it's a parallelogram.</li>
                    <li>Opposite sides are equal, but adjacent sides are not all equal, so it's not a rhombus or a square.</li>
                    <li>The angles are not all 90 degrees, so it's not a rectangle.</li>
                  </ul>
                </div>

                <div className="bg-blue-100 p-3 rounded mt-3">
                  <p className="text-sm font-semibold text-blue-800">Therefore, the quadrilateral is a parallelogram (but not a rectangle, rhombus, or square).</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Area and Perimeter of Quadrilaterals */}
        <Card>
          <CardHeader>
            <CardTitle>Section 2: Area and Perimeter of Quadrilaterals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Perimeter</h3>
              <p className="mb-4">
                The perimeter of a quadrilateral is the sum of the lengths of its four sides.
              </p>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      Perimeter is a one-dimensional measurement that represents the total distance around a shape. If you were to walk around the boundary of a quadrilateral, the total distance you'd travel would be its perimeter. In practical applications, perimeter might represent the amount of fencing needed to enclose a quadrilateral-shaped field or the length of trim needed for a rectangular window.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Area Formulas</h3>
              
              <div className="grid gap-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">1. Rectangle:</h4>
                  <p className="text-sm text-green-700">Area = length × width</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">2. Square:</h4>
                  <p className="text-sm text-purple-700">Area = side² (side squared)</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">3. Parallelogram:</h4>
                  <p className="text-sm text-blue-700">Area = base × height</p>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">4. Rhombus:</h4>
                  <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                    <li>Area = base × height</li>
                    <li>Area = (1/2) × product of diagonals</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">5. Trapezoid:</h4>
                  <p className="text-sm text-orange-700">Area = (1/2) × (sum of parallel sides) × height</p>
                </div>

                <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-teal-800 mb-2">6. Kite:</h4>
                  <p className="text-sm text-teal-700">Area = (1/2) × product of diagonals</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Problem-Solving Approach: Finding Area and Perimeter</h3>
              <p className="mb-4">When calculating the area or perimeter of a quadrilateral, follow these steps:</p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">1. Identify the type of quadrilateral:</h4>
                  <p className="text-sm text-muted-foreground">Determine which specific formulas apply.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">2. Gather the necessary measurements:</h4>
                  <p className="text-sm text-muted-foreground">Identify which dimensions you need for the formula.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">3. Apply the appropriate formula:</h4>
                  <p className="text-sm text-muted-foreground">Substitute the values into the formula.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">4. Calculate and verify:</h4>
                  <p className="text-sm text-muted-foreground">Perform the calculations and check if the answer makes sense.</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-orange-800">Example Problem:</h4>
              <p className="text-sm mb-3 text-orange-700">
                <strong>Find the area of a trapezoid with parallel sides of lengths 8 cm and 12 cm, and a height of 5 cm.</strong>
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-1 text-orange-800">Solution:</p>
                  <p className="text-sm text-orange-700 mb-2"><strong>Step 1:</strong> Identify the type of quadrilateral.</p>
                  <p className="text-sm text-orange-700 ml-4">• This is a trapezoid with parallel sides of 8 cm and 12 cm.</p>
                </div>

                <div>
                  <p className="text-sm text-orange-700 mb-2"><strong>Step 2:</strong> Gather the necessary measurements.</p>
                  <ul className="space-y-1 text-sm text-orange-700 list-disc list-inside ml-4">
                    <li>Parallel sides: a = 8 cm, b = 12 cm</li>
                    <li>Height: h = 5 cm</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-orange-700 mb-2"><strong>Step 3:</strong> Apply the appropriate formula.</p>
                  <ul className="space-y-1 text-sm text-orange-700 list-disc list-inside ml-4">
                    <li>Area of a trapezoid = (1/2) × (sum of parallel sides) × height</li>
                    <li>Area = (1/2) × (8 + 12) × 5</li>
                    <li>Area = (1/2) × 20 × 5</li>
                    <li>Area = 10 × 5</li>
                    <li>Area = 50 cm²</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-orange-700 mb-2"><strong>Step 4:</strong> Verify the answer.</p>
                  <ul className="space-y-1 text-sm text-orange-700 list-disc list-inside ml-4">
                    <li>The area is positive and has square units, which is appropriate for an area measurement.</li>
                    <li>The magnitude seems reasonable given the dimensions of the trapezoid.</li>
                  </ul>
                </div>

                <div className="bg-orange-100 p-3 rounded mt-3">
                  <p className="text-sm font-semibold text-orange-800">Therefore, the area of the trapezoid is 50 square centimeters.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Regular Polygons */}
        <Card>
          <CardHeader>
            <CardTitle>Section 3: Regular Polygons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">What is a Regular Polygon?</h3>
              <p className="mb-4">
                A regular polygon is a polygon with all sides equal and all angles equal.
              </p>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      Regular polygons have perfect symmetry and have fascinated mathematicians and artists throughout history. They appear in nature (like hexagonal honeycomb cells), architecture (like octagonal stop signs), and art (like pentagonal patterns in Islamic designs). The study of regular polygons connects geometry with algebra, trigonometry, and even group theory in advanced mathematics.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Properties of Regular Polygons</h3>
              
              <div className="grid gap-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Basic Properties:</h4>
                  <ul className="space-y-1 text-sm text-blue-700 list-disc list-inside ml-4">
                    <li>All sides have the same length</li>
                    <li>All interior angles have the same measure</li>
                    <li>All exterior angles have the same measure</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Angle Formulas:</h4>
                  <ul className="space-y-1 text-sm text-green-700 list-disc list-inside ml-4">
                    <li>The sum of interior angles = (n - 2) × 180 degrees, where n is the number of sides</li>
                    <li>Each interior angle = ((n - 2) × 180) / n degrees</li>
                    <li>Each exterior angle = 360 / n degrees</li>
                    <li>The sum of exterior angles is always 360 degrees</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Area and Perimeter of Regular Polygons</h3>
              
              <div className="grid gap-4">
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">1. Perimeter:</h4>
                  <p className="text-sm text-purple-700">Perimeter = n × s, where n is the number of sides and s is the length of each side</p>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">2. Area:</h4>
                  <ul className="space-y-1 text-sm text-red-700 list-disc list-inside ml-4">
                    <li>Area = (1/2) × n × s × a, where a is the apothem (the perpendicular distance from the center to any side)</li>
                    <li>Alternatively, Area = (1/4) × n × s² × cot(π/n)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-800">Example Problem:</h4>
              <p className="text-sm mb-3 text-purple-700">
                <strong>Find the area of a regular hexagon with side length 6 cm.</strong>
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-1 text-purple-800">Solution:</p>
                  <p className="text-sm text-purple-700 mb-2"><strong>Step 1:</strong> Identify the given information.</p>
                  <ul className="space-y-1 text-sm text-purple-700 list-disc list-inside ml-4">
                    <li>Regular hexagon (n = 6)</li>
                    <li>Side length s = 6 cm</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-purple-700 mb-2"><strong>Step 2:</strong> Recall relevant formulas.</p>
                  <p className="text-sm text-purple-700 ml-4">• Area = (1/4) × n × s² × cot(π/n)</p>
                </div>

                <div>
                  <p className="text-sm text-purple-700 mb-2"><strong>Step 3:</strong> Substitute and solve.</p>
                  <ul className="space-y-1 text-sm text-purple-700 list-disc list-inside ml-4">
                    <li>Area = (1/4) × 6 × 6² × cot(π/6)</li>
                    <li>Area = (1/4) × 6 × 36 × cot(30°)</li>
                    <li>Area = (1/4) × 6 × 36 × √3</li>
                    <li>Area = (1/4) × 216 × √3</li>
                    <li>Area = 54 × √3</li>
                    <li>Area ≈ 93.53 cm²</li>
                  </ul>
                </div>

                <div className="bg-purple-100 p-3 rounded mt-3">
                  <p className="text-sm font-semibold text-purple-800">Therefore, the area of the regular hexagon is 54√3 square centimeters, or approximately 93.53 square centimeters.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Polygon Diagonals and Interior Angles */}
        <Card>
          <CardHeader>
            <CardTitle>Section 4: Polygon Diagonals and Interior Angles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Diagonals</h3>
              <p className="mb-4">
                A diagonal of a polygon is a line segment that connects two non-adjacent vertices.
              </p>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      Diagonals are important in geometry because they help us analyze and understand the properties of polygons. For instance, diagonals can be used to triangulate a polygon (divide it into triangles), which is useful for calculating areas and proving theorems. In computer graphics, triangulation is essential for rendering complex shapes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Formula for Number of Diagonals:</h4>
                <p className="text-sm text-blue-700">Number of diagonals = n(n - 3) / 2</p>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      This formula can be derived by considering that from each vertex, you can draw diagonals to all other vertices except the adjacent ones and itself. That's (n-3) diagonals per vertex. Multiplying by n gives n(n-3), but this counts each diagonal twice (once from each end), so we divide by 2 to get the final formula.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Interior and Exterior Angles</h3>
              
              <div className="grid gap-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">1. Sum of Interior Angles:</h4>
                  <p className="text-sm text-green-700">The sum of the interior angles of a polygon with n sides is (n - 2) × 180 degrees</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">2. Measure of Each Interior Angle (Regular Polygon):</h4>
                  <p className="text-sm text-blue-700">((n - 2) × 180) / n degrees</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">3. Sum of Exterior Angles:</h4>
                  <p className="text-sm text-purple-700">The sum of the exterior angles of any polygon is always 360 degrees</p>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">4. Measure of Each Exterior Angle (Regular Polygon):</h4>
                  <p className="text-sm text-red-700">360 / n degrees</p>
                </div>
              </div>
            </div>

            <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-teal-800">Example Problem:</h4>
              <p className="text-sm mb-3 text-teal-700">
                <strong>Find the number of diagonals in a decagon (10-sided polygon).</strong>
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-1 text-teal-800">Solution:</p>
                  <p className="text-sm text-teal-700 mb-2"><strong>Step 1:</strong> Identify the type of polygon.</p>
                  <p className="text-sm text-teal-700 ml-4">• Decagon (n = 10)</p>
                </div>

                <div>
                  <p className="text-sm text-teal-700 mb-2"><strong>Step 2:</strong> Apply the appropriate formula.</p>
                  <p className="text-sm text-teal-700 ml-4">• Number of diagonals = n(n - 3) / 2</p>
                </div>

                <div>
                  <p className="text-sm text-teal-700 mb-2"><strong>Step 3:</strong> Solve for the unknown.</p>
                  <ul className="space-y-1 text-sm text-teal-700 list-disc list-inside ml-4">
                    <li>Number of diagonals = 10(10 - 3) / 2</li>
                    <li>Number of diagonals = 10 × 7 / 2</li>
                    <li>Number of diagonals = 70 / 2</li>
                    <li>Number of diagonals = 35</li>
                  </ul>
                </div>

                <div className="bg-teal-100 p-3 rounded mt-3">
                  <p className="text-sm font-semibold text-teal-800">Therefore, a decagon has 35 diagonals.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Coordinate Geometry of Polygons */}
        <Card>
          <CardHeader>
            <CardTitle>Section 5: Coordinate Geometry of Polygons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Coordinates of Vertices</h3>
              <p className="mb-4">
                The coordinates of the vertices of a polygon can be used to calculate various properties of the polygon.
              </p>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      Coordinate geometry provides a powerful way to analyze polygons using algebraic methods. By assigning coordinates to the vertices, we can use formulas to calculate distances, slopes, areas, and other properties. This approach bridges the gap between geometry and algebra, allowing us to solve geometric problems using algebraic techniques.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Area of a Polygon Using Coordinates</h3>
              <p className="mb-4">
                The area of a polygon with vertices (x₁, y₁), (x₂, y₂), ..., (xₙ, yₙ) can be calculated using the Shoelace formula:
              </p>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">Shoelace Formula:</h4>
                <p className="text-sm text-blue-700">Area = (1/2) × |[(x₁y₂ - x₂y₁) + (x₂y₃ - x₃y₂) + ... + (xₙy₁ - x₁yₙ)]|</p>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                    <p className="text-sm text-amber-700">
                      The Shoelace formula (also known as the Surveyor's formula or the Gauss's area formula) gets its name from the crisscrossing pattern of multiplications that resembles lacing a shoe. It works for any simple polygon (one without self-intersections). The formula calculates the signed area, so we take the absolute value to ensure a positive result.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-800">Example Problem:</h4>
              <p className="text-sm mb-3 text-green-700">
                <strong>Find the area of the quadrilateral with vertices at (0, 0), (4, 0), (4, 3), and (0, 3).</strong>
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-1 text-green-800">Solution:</p>
                  <p className="text-sm text-green-700 mb-2"><strong>Step 1:</strong> Plot the vertices.</p>
                  <p className="text-sm text-green-700 ml-4">• The vertices form a rectangle with width 4 and height 3.</p>
                </div>

                <div>
                  <p className="text-sm text-green-700 mb-2"><strong>Step 2:</strong> Apply the appropriate formula.</p>
                  <p className="text-sm text-green-700 ml-4">• We can use the Shoelace formula:
                  Area = (1/2) × |[(x₁y₂ - x₂y₁) + (x₂y₃ - x₃y₂) + (x₃y₄ - x₄y₃) + (x₄y₁ - x₁y₄)]|</p>
                </div>

                <div>
                  <p className="text-sm text-green-700 mb-2"><strong>Step 3:</strong> Perform the calculations.</p>
                  <ul className="space-y-1 text-sm text-green-700 list-disc list-inside ml-4">
                    <li>Area = (1/2) × |[(0×0 - 4×0) + (4×3 - 4×0) + (4×3 - 0×3) + (0×0 - 0×3)]|</li>
                    <li>Area = (1/2) × |[0 + 12 + 12 + 0]|</li>
                    <li>Area = (1/2) × |24|</li>
                    <li>Area = (1/2) × 24</li>
                    <li>Area = 12</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-green-700 mb-2"><strong>Step 4:</strong> Interpret the result.</p>
                  <p className="text-sm text-green-700 ml-4">• The area is 12 square units, which matches what we'd expect for a 4×3 rectangle.</p>
                </div>

                <div className="bg-green-100 p-3 rounded mt-3">
                  <p className="text-sm font-semibold text-green-800">Therefore, the area of the quadrilateral is 12 square units.</p>
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
                    We could have solved this more directly by recognizing the shape as a rectangle and using the formula Area = length × width = 4 × 3 = 12. However, the Shoelace formula is powerful because it works for any simple polygon, not just rectangles or other regular shapes.
                  </p>
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
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">1.</h4>
                <p className="text-sm">Identify the type of quadrilateral with vertices at (0, 0), (3, 0), (3, 4), and (0, 4).</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">2.</h4>
                <p className="text-sm">Calculate the area of a rhombus with diagonals of lengths 6 cm and 8 cm.</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">3.</h4>
                <p className="text-sm">Find the number of diagonals in a decagon (10-sided polygon).</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">4.</h4>
                <p className="text-sm">Calculate the measure of each interior angle of a regular octagon.</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">5.</h4>
                <p className="text-sm">A regular hexagon has a side length of 4 cm. Calculate its perimeter and area.</p>
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
              In this module, we have explored quadrilaterals and other polygons. We have learned about their properties, classifications, and how to calculate their areas and perimeters. We have also studied the properties of regular polygons and how to work with polygons in coordinate geometry.
            </p>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                  <p className="text-sm text-amber-700">
                    Quadrilaterals and polygons are not just abstract mathematical concepts—they are fundamental shapes that appear throughout our world. From the rectangular screens of our devices to the hexagonal cells of a honeycomb, these shapes serve specific purposes based on their unique properties. Understanding these properties allows us to design more efficient structures, create more appealing art, and solve a wide range of practical problems.
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
              In the next module, we will explore circles and their properties. We will learn about the parts of a circle, how to calculate its circumference and area, and various theorems related to circles.
            </p>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700 font-medium mb-1">Teaching Moment:</p>
                  <p className="text-sm text-amber-700">
                    As we transition from polygons to circles, consider that a circle can be thought of as a regular polygon with an infinite number of sides. This connection helps explain why the formula for the perimeter of a regular polygon approaches 2πr (the circumference of a circle) as the number of sides increases. Keep this relationship in mind as we delve into the fascinating world of circles!
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