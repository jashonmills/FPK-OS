import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Square, BookOpen, Target } from 'lucide-react';

export const QuadrilateralsLesson: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Square className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Module 3: Quadrilaterals and Polygons</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Welcome to Module 3 of our Geometry course! In this module, we will explore quadrilaterals and polygons, which are fundamental shapes in geometry. Understanding these four-sided figures and their properties will help you analyze more complex geometric structures and solve practical problems in construction, design, and engineering.
        </p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/quadrilaterals.jpg" 
          alt="Hierarchy of quadrilaterals showing relationships between squares, rectangles, parallelograms, and other four-sided shapes"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Teaching Moment */}
      <Alert>
        <BookOpen className="h-4 w-4" />
        <AlertDescription>
          <strong>Teaching Moment:</strong> Quadrilaterals are everywhere in our daily lives—from the rectangular screens of our devices to the square tiles on floors and the trapezoidal shapes in architecture. The systematic study of these shapes began with ancient Greek mathematicians, particularly Euclid, who laid the foundations for understanding their properties and relationships. Today, understanding quadrilaterals is essential in fields ranging from computer graphics to structural engineering.
        </AlertDescription>
      </Alert>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">By the end of this module, you will be able to:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Define and identify different types of quadrilaterals</li>
            <li>Understand the hierarchical relationships between quadrilaterals</li>
            <li>Apply the properties of parallelograms, rectangles, squares, rhombuses, and trapezoids</li>
            <li>Calculate perimeters and areas of various quadrilaterals</li>
            <li>Classify polygons by their number of sides and properties</li>
            <li>Apply the angle sum formulas for polygons</li>
            <li>Solve problems involving quadrilaterals in real-world contexts</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 1: What Are Quadrilaterals? */}
      <Card>
        <CardHeader>
          <CardTitle>Section 1: What Are Quadrilaterals?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Definition and Basic Properties</h3>
            <p className="mb-4">
              A <strong>quadrilateral</strong> is a polygon with exactly four sides and four vertices (corners). The word comes from the Latin "quadri" (four) and "lateral" (side). Unlike triangles, which are always rigid, quadrilaterals can be flexible unless additional constraints are imposed.
            </p>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Key Property:</strong> The sum of interior angles in any quadrilateral is always 360°. This can be proven by dividing any quadrilateral into two triangles, each containing 180° of angles.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Parts of a Quadrilateral</h4>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Vertices:</strong> The four corner points where sides meet</li>
              <li><strong>Sides:</strong> The four line segments that form the boundary</li>
              <li><strong>Angles:</strong> The four interior angles formed at each vertex</li>
              <li><strong>Diagonals:</strong> Line segments connecting opposite vertices (every quadrilateral has exactly two diagonals)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Types of Quadrilaterals</h4>
            <p className="mb-3">Quadrilaterals can be classified into several categories based on their properties:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Convex:</strong> All interior angles are less than 180°</li>
              <li><strong>Concave:</strong> At least one interior angle is greater than 180°</li>
              <li><strong>Simple:</strong> Sides do not intersect except at vertices</li>
              <li><strong>Complex:</strong> Sides intersect at points other than vertices (self-intersecting)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Special Quadrilaterals */}
      <Card>
        <CardHeader>
          <CardTitle>Section 2: Special Quadrilaterals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-700">Parallelogram</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm"><strong>Definition:</strong> A quadrilateral with opposite sides parallel</p>
                  <div>
                    <p className="text-sm font-semibold mb-2">Properties:</p>
                    <ul className="space-y-1 text-sm list-disc list-inside">
                      <li>Opposite sides are parallel and equal in length</li>
                      <li>Opposite angles are equal</li>
                      <li>Consecutive angles are supplementary (sum to 180°)</li>
                      <li>Diagonals bisect each other</li>
                      <li>Each diagonal divides the parallelogram into two congruent triangles</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm"><strong>Area Formula:</strong> A = base × height</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-700">Rectangle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm"><strong>Definition:</strong> A parallelogram with four right angles</p>
                  <div>
                    <p className="text-sm font-semibold mb-2">Properties:</p>
                    <ul className="space-y-1 text-sm list-disc list-inside">
                      <li>All angles are 90° (right angles)</li>
                      <li>Opposite sides are parallel and equal</li>
                      <li>Diagonals are equal in length and bisect each other</li>
                      <li>Has two lines of symmetry</li>
                      <li>Most common quadrilateral in construction and design</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm"><strong>Area Formula:</strong> A = length × width</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-700">Square</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm"><strong>Definition:</strong> A rectangle with all sides equal (or a rhombus with right angles)</p>
                  <div>
                    <p className="text-sm font-semibold mb-2">Properties:</p>
                    <ul className="space-y-1 text-sm list-disc list-inside">
                      <li>All four sides are equal in length</li>
                      <li>All angles are 90°</li>
                      <li>Diagonals are equal, perpendicular, and bisect each other</li>
                      <li>Has four lines of symmetry</li>
                      <li>Most symmetric quadrilateral</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-sm"><strong>Area Formula:</strong> A = side²</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-red-700">Rhombus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm"><strong>Definition:</strong> A parallelogram with all sides equal</p>
                  <div>
                    <p className="text-sm font-semibold mb-2">Properties:</p>
                    <ul className="space-y-1 text-sm list-disc list-inside">
                      <li>All four sides are equal in length</li>
                      <li>Opposite angles are equal</li>
                      <li>Diagonals are perpendicular and bisect each other</li>
                      <li>Diagonals bisect the vertex angles</li>
                      <li>Often called a "diamond" shape</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-3 rounded">
                    <p className="text-sm"><strong>Area Formula:</strong> A = ½ × d₁ × d₂ (where d₁, d₂ are diagonal lengths)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-orange-700">Trapezoid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm"><strong>Definition:</strong> A quadrilateral with exactly one pair of parallel sides</p>
                  <div>
                    <p className="text-sm font-semibold mb-2">Properties:</p>
                    <ul className="space-y-1 text-sm list-disc list-inside">
                      <li>One pair of parallel sides (called bases)</li>
                      <li>Non-parallel sides are called legs</li>
                      <li>May be isosceles (equal legs and base angles)</li>
                      <li>Sum of angles between parallel sides is 180°</li>
                      <li>Common in architectural designs</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded">
                    <p className="text-sm"><strong>Area Formula:</strong> A = ½ × (b₁ + b₂) × h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-teal-700">Kite</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm"><strong>Definition:</strong> A quadrilateral with two pairs of adjacent sides that are equal</p>
                  <div>
                    <p className="text-sm font-semibold mb-2">Properties:</p>
                    <ul className="space-y-1 text-sm list-disc list-inside">
                      <li>Two pairs of adjacent sides are equal</li>
                      <li>One diagonal bisects the other at right angles</li>
                      <li>Has one line of symmetry</li>
                      <li>One pair of opposite angles are equal</li>
                      <li>Named after the flying toy shape</li>
                    </ul>
                  </div>
                  <div className="bg-teal-50 p-3 rounded">
                    <p className="text-sm"><strong>Area Formula:</strong> A = ½ × d₁ × d₂</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: The Quadrilateral Family Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Section 3: The Quadrilateral Family Tree</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Understanding Hierarchical Relationships</h3>
            <p className="mb-4">
              Quadrilaterals form a hierarchy based on their properties. More specific shapes inherit all the properties of more general shapes above them in the hierarchy.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2">A Square Is:</h4>
              <ul className="space-y-1 text-sm">
                <li>• A rectangle (because it has four right angles)</li>
                <li>• A rhombus (because all sides are equal)</li>
                <li>• A parallelogram (because opposite sides are parallel)</li>
                <li>• A quadrilateral (because it has four sides)</li>
              </ul>
              <p className="text-xs text-blue-600 mt-2 italic">A square has ALL the properties of these shapes!</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="font-semibold text-green-800 mb-2">A Rectangle Is:</h4>
              <ul className="space-y-1 text-sm">
                <li>• A parallelogram (because opposite sides are parallel)</li>
                <li>• A quadrilateral (because it has four sides)</li>
                <li>• NOT necessarily a square (sides may not be equal)</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-semibold text-purple-800 mb-2">A Rhombus Is:</h4>
              <ul className="space-y-1 text-sm">
                <li>• A parallelogram (because opposite sides are parallel)</li>
                <li>• A quadrilateral (because it has four sides)</li>
                <li>• NOT necessarily a square (angles may not be 90°)</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
              <h4 className="font-semibold text-gray-800 mb-2">Important Distinction:</h4>
              <p className="text-sm">
                <strong>"All squares are rectangles"</strong> is TRUE (every square has four right angles).
                <br />
                <strong>"All rectangles are squares"</strong> is FALSE (rectangles don't need equal sides).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Polygons Beyond Quadrilaterals */}
      <Card>
        <CardHeader>
          <CardTitle>Section 4: Polygons Beyond Quadrilaterals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Classification of Polygons</h3>
            <p className="mb-4">
              A <strong>polygon</strong> is a closed figure made up of line segments. Polygons are classified by the number of sides they have.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">Triangle</h4>
                <p className="text-sm text-muted-foreground">3 sides</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">Quadrilateral</h4>
                <p className="text-sm text-muted-foreground">4 sides</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">Pentagon</h4>
                <p className="text-sm text-muted-foreground">5 sides</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">Hexagon</h4>
                <p className="text-sm text-muted-foreground">6 sides</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">Octagon</h4>
                <p className="text-sm text-muted-foreground">8 sides</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">Decagon</h4>
                <p className="text-sm text-muted-foreground">10 sides</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Angle Sum Formula for Polygons</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-center font-semibold">Sum of Interior Angles = (n - 2) × 180°</p>
              <p className="text-center text-sm text-muted-foreground mt-1">where n = number of sides</p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Examples:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Triangle (n=3): (3-2) × 180° = 180°</li>
                <li>• Quadrilateral (n=4): (4-2) × 180° = 360°</li>
                <li>• Pentagon (n=5): (5-2) × 180° = 540°</li>
                <li>• Hexagon (n=6): (6-2) × 180° = 720°</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Regular vs. Irregular Polygons</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-green-700 mb-2">Regular Polygons</h4>
                <ul className="space-y-1 text-sm">
                  <li>• All sides are equal in length</li>
                  <li>• All angles are equal in measure</li>
                  <li>• Examples: equilateral triangle, square, regular hexagon</li>
                  <li>• Each interior angle = (n-2) × 180° ÷ n</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-red-700 mb-2">Irregular Polygons</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Sides may be different lengths</li>
                  <li>• Angles may be different measures</li>
                  <li>• Examples: scalene triangle, rectangle, most real-world shapes</li>
                  <li>• Still follow the angle sum formula</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problem-Solving Strategies */}
      <Alert className="border-indigo-200 bg-indigo-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Problem-Solving Strategy:</h4>
          <p className="mb-2">When working with quadrilaterals:</p>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Identify what type of quadrilateral you're dealing with</li>
            <li>List the properties that apply to that type</li>
            <li>Use the given information to find unknown values</li>
            <li>Apply appropriate formulas (area, perimeter, angle relationships)</li>
            <li>Check your answer against the properties you know</li>
          </ol>
        </AlertDescription>
      </Alert>

      {/* Practice Problems */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Practice Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 1: Angle Relationships</h4>
              <p className="text-sm mb-2">In a quadrilateral, three angles measure 85°, 95°, and 110°. What is the measure of the fourth angle?</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Solution approach:</strong> Use the fact that the sum of angles in any quadrilateral is 360°</p>
                <p><strong>Answer:</strong> 360° - (85° + 95° + 110°) = 360° - 290° = 70°</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 2: Classification</h4>
              <p className="text-sm mb-2">True or False: "All rectangles are squares." Explain your reasoning.</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Answer:</strong> FALSE. All rectangles have four right angles, but they don't necessarily have equal sides. A rectangle only becomes a square when all four sides are equal.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 3: Identification</h4>
              <p className="text-sm mb-2">A quadrilateral has four equal sides and four right angles. What type of quadrilateral is it, and what properties does it have?</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Answer:</strong> This is a square. It has all the properties of a rectangle AND a rhombus, including equal diagonals that are perpendicular and bisect each other.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 4: Area Calculation</h4>
              <p className="text-sm mb-2">A trapezoid has parallel sides (bases) of 8 cm and 12 cm, with a height of 5 cm. Find its area.</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Solution:</strong> Area = ½ × (b₁ + b₂) × h = ½ × (8 + 12) × 5 = ½ × 20 × 5 = 50 cm²</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 5: Polygon Angles</h4>
              <p className="text-sm mb-2">What is the sum of interior angles in a regular octagon? What is the measure of each interior angle?</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Solution:</strong> Sum = (8-2) × 180° = 1080°</p>
                <p>Each angle = 1080° ÷ 8 = 135°</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Summary */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-800">Module 3 Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            In this module, you've learned to identify and classify quadrilaterals, understand their hierarchical relationships, and apply their properties to solve problems. You've also explored the broader family of polygons and learned to calculate angle sums. These skills will be essential as you continue to more advanced geometric concepts in the following modules. Remember: understanding the "family tree" of quadrilaterals helps you see the connections between different shapes and their properties.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};