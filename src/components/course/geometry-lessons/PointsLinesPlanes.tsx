import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Compass, CheckCircle, Lightbulb, ArrowRight, Calculator } from 'lucide-react';
import pointsLinesImage from '@/assets/points-lines-planes.jpg';

export const PointsLinesPlanes: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Compass className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold">Module 1: Lines, Angles & Polygons</h1>
        </div>
        <p className="text-lg text-muted-foreground">Foundation concepts in geometry</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={pointsLinesImage}
          alt="Points, lines, and planes geometric concepts with clear labels and examples" 
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Teaching Moment */}
      <Alert className="border-blue-200 bg-blue-50">
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          <strong>Teaching Moment:</strong> Geometry is all around us! From the design of buildings to the patterns in nature, geometric principles govern the physical world. As you learn these concepts, try to identify them in your everyday surroundings. This connection between abstract mathematical ideas and real-world applications will deepen your understanding and appreciation of geometry.
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
              <span>Identify and classify different types of lines and angles</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Understand the properties of various polygons</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Apply basic geometric principles to solve problems</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Recognize geometric shapes in real-world contexts</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Develop logical reasoning through geometric proofs</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Lines and Line Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Section 1: Lines and Line Segments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">What is a Line?</h3>
            <p className="text-muted-foreground mb-4">
              A line is a straight path that extends infinitely in both directions. It has no thickness and is one-dimensional. 
              In geometry, we often represent lines using arrows on both ends to indicate that they extend infinitely.
            </p>
            
            <Alert className="border-amber-200 bg-amber-50 mb-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> When we draw a "line" on paper, we're actually drawing a representation of a line, not a true mathematical line. A true line would extend forever in both directions and have no width. This distinction between mathematical abstractions and their physical representations is important throughout geometry.
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Key Properties of Lines:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>A line has no endpoints</li>
                <li>A line is straight (no curves)</li>
                <li>A line has infinite length</li>
                <li>A line has no thickness</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Line Segments</h3>
            <p className="text-muted-foreground mb-4">
              A line segment is a portion of a line that has two endpoints. Unlike a line, a line segment has a definite length.
            </p>
            
            <Alert className="border-amber-200 bg-amber-50 mb-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> To name a line segment, we use the letters of its endpoints with a line segment symbol above them. For example, a line segment with endpoints A and B is written as AB̄. This is different from how we name a line, which would be written as AB↔.
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Key Properties of Line Segments:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>A line segment has two endpoints</li>
                <li>A line segment has a measurable length</li>
                <li>A line segment is straight</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Rays</h3>
            <p className="text-muted-foreground mb-4">
              A ray is a portion of a line that has one endpoint and extends infinitely in one direction.
            </p>
            
            <Alert className="border-amber-200 bg-amber-50 mb-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> Think of a ray like a beam of light from a flashlight. It starts at a specific point (the flashlight) and continues indefinitely in one direction. We name a ray using its endpoint first, followed by any other point on the ray, with a ray symbol above them.
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Key Properties of Rays:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>A ray has one endpoint</li>
                <li>A ray extends infinitely in one direction</li>
                <li>A ray is straight</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Problem-Solving Approach: Identifying Lines, Line Segments, and Rays</h3>
            <p className="text-muted-foreground mb-4">When faced with a problem involving lines, line segments, or rays, follow these steps:</p>
            
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">1</span>
                  <span className="font-semibold">Identify the key elements</span>
                </div>
                <p className="text-sm text-muted-foreground ml-8">Look for endpoints or lack thereof.</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">2</span>
                  <span className="font-semibold">Apply the definitions</span>
                </div>
                <ul className="text-sm text-muted-foreground ml-8 list-disc list-inside space-y-1">
                  <li>If it extends infinitely in both directions, it's a line</li>
                  <li>If it has two endpoints, it's a line segment</li>
                  <li>If it has one endpoint and extends infinitely in one direction, it's a ray</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">3</span>
                  <span className="font-semibold">Use proper notation</span>
                </div>
                <p className="text-sm text-muted-foreground ml-8">Label lines, line segments, and rays using the appropriate symbols.</p>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Example Problem:</h4>
              <p className="text-sm mb-2">In the figure below, identify and label all lines, line segments, and rays.</p>
              <div className="bg-white p-3 rounded border font-mono text-sm">
                <div className="text-center">
                  <div>C</div>
                  <div>|</div>
                  <div>|</div>
                  <div>A------B------D</div>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <strong>Solution:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>ABD↔ is a line (extends infinitely in both directions)</li>
                  <li>AB̄ is a line segment (has endpoints A and B)</li>
                  <li>BD̄ is a line segment (has endpoints B and D)</li>
                  <li>BC→ is a ray (has endpoint B and extends upward through C)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Angles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Section 2: Angles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">What is an Angle?</h3>
            <p className="text-muted-foreground mb-4">
              An angle is formed when two rays share a common endpoint. The common endpoint is called the vertex of the angle, and the rays are called the sides of the angle.
            </p>
            
            <Alert className="border-amber-200 bg-amber-50 mb-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The word "angle" comes from the Latin word "angulus," meaning "corner." You can think of an angle as the corner formed by two rays meeting at a point. The size of an angle is determined by the amount of rotation needed to move from one ray to the other, not by the length of the rays.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Types of Angles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-700 mb-2">Acute Angle</h4>
                <p className="text-sm mb-2">Less than 90 degrees</p>
                <Alert className="border-red-100 bg-red-50 p-2">
                  <p className="text-xs">"Acute" means sharp - like the letter V</p>
                </Alert>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">Right Angle</h4>
                <p className="text-sm mb-2">Exactly 90 degrees</p>
                <Alert className="border-blue-100 bg-blue-50 p-2">
                  <p className="text-xs">Often marked with a small square in the corner</p>
                </Alert>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Obtuse Angle</h4>
                <p className="text-sm mb-2">Greater than 90° but less than 180°</p>
                <Alert className="border-green-100 bg-green-50 p-2">
                  <p className="text-xs">"Obtuse" means blunt or dull</p>
                </Alert>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-2">Straight Angle</h4>
                <p className="text-sm mb-2">Exactly 180 degrees</p>
                <Alert className="border-purple-100 bg-purple-50 p-2">
                  <p className="text-xs">Forms a straight line</p>
                </Alert>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Angle Relationships</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-2 flex items-center">
                  Complementary Angles
                  <ArrowRight className="h-4 w-4 ml-2" />
                </h4>
                <p className="text-sm mb-2">Sum = 90°</p>
                <p className="text-xs text-muted-foreground">Two angles that "complete" each other to form a right angle</p>
                <div className="bg-orange-100 p-2 rounded text-xs mt-2">
                  Example: 30° + 60° = 90°
                </div>
              </div>
              
              <div className="bg-teal-50 p-4 rounded-lg">
                <h4 className="font-semibold text-teal-700 mb-2 flex items-center">
                  Supplementary Angles
                  <ArrowRight className="h-4 w-4 ml-2" />
                </h4>
                <p className="text-sm mb-2">Sum = 180°</p>
                <p className="text-xs text-muted-foreground">Two angles that "supplement" each other to form a straight angle</p>
                <div className="bg-teal-100 p-2 rounded text-xs mt-2">
                  Example: 110° + 70° = 180°
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Polygons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Section 3: Polygons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">What is a Polygon?</h3>
            <p className="text-muted-foreground mb-4">
              A polygon is a closed figure made up of line segments. The line segments are called the sides of the polygon, 
              and the points where the sides meet are called the vertices.
            </p>
            
            <Alert className="border-amber-200 bg-amber-50 mb-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The word "polygon" comes from Greek, where "poly" means "many" and "gon" means "angle." So, a polygon is literally a shape with many angles. Every polygon has the same number of sides as angles.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-700 flex items-center">
                  <Calculator className="h-4 w-4 mr-2" />
                  Sum of Interior Angles
                </h4>
                <p className="text-sm mb-2">Formula: (n-2) × 180°</p>
                <p className="text-xs text-muted-foreground">where n = number of sides</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-700">Sum of Exterior Angles</h4>
                <p className="text-sm mb-2">Always equals 360°</p>
                <p className="text-xs text-muted-foreground">for any polygon</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Types of Polygons</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-sm">Triangle</div>
                <div className="text-xs text-muted-foreground">3 sides</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-sm">Quadrilateral</div>
                <div className="text-xs text-muted-foreground">4 sides</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-sm">Pentagon</div>
                <div className="text-xs text-muted-foreground">5 sides</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-sm">Hexagon</div>
                <div className="text-xs text-muted-foreground">6 sides</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-sm">Heptagon</div>
                <div className="text-xs text-muted-foreground">7 sides</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-sm">Octagon</div>
                <div className="text-xs text-muted-foreground">8 sides</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-sm">Nonagon</div>
                <div className="text-xs text-muted-foreground">9 sides</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold text-sm">Decagon</div>
                <div className="text-xs text-muted-foreground">10 sides</div>
              </div>
            </div>
          </div>

          <Alert className="border-amber-200 bg-amber-50">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Teaching Moment:</strong> Many everyday objects are shaped like polygons. Stop signs are octagons, most rooms are quadrilaterals, and many sports fields are rectangles. Recognizing these shapes in the world around you helps reinforce geometric concepts.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Practice Problems */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Practice Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 1: Angle Classification</h4>
              <p className="text-sm mb-2">Identify the type of angle: 45 degrees.</p>
              <p className="text-xs text-muted-foreground italic">
                Problem-Solving Guidance: Compare the angle measure to the benchmark values (90°, 180°, etc.) to determine its classification.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 2: Complementary Angles</h4>
              <p className="text-sm mb-2">If two angles are complementary and one of them is 35 degrees, what is the measure of the other angle?</p>
              <p className="text-xs text-muted-foreground italic">
                Problem-Solving Guidance: Use the complementary angles formula: a + b = 90°. Substitute the known value and solve for the unknown.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 3: Polygon Angles</h4>
              <p className="text-sm mb-2">Calculate the sum of interior angles of a hexagon.</p>
              <p className="text-xs text-muted-foreground italic">
                Problem-Solving Guidance: Apply the formula for the sum of interior angles: (n-2) × 180°, where n is the number of sides.
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 4: Regular Polygons</h4>
              <p className="text-sm mb-2">Identify whether a square is a regular polygon or an irregular polygon.</p>
              <p className="text-xs text-muted-foreground italic">
                Problem-Solving Guidance: Check the definition of a regular polygon (all sides and all angles equal) and determine if a square meets these criteria.
              </p>
            </div>
            
            <div className="p-4 bg-pink-50 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 5: Polygon Diagonals</h4>
              <p className="text-sm mb-2">If a polygon has 7 sides, how many diagonals does it have?</p>
              <p className="text-xs text-muted-foreground italic">
                Problem-Solving Guidance: Use the formula for the number of diagonals: n(n-3)/2, where n is the number of sides.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Module Summary:</strong> In this module, we have covered the fundamental concepts of lines, angles, and polygons. We have learned about different types of lines, angles, and polygons, as well as their properties. These concepts form the foundation of geometric understanding and will be essential for all subsequent modules.
        </AlertDescription>
      </Alert>

      <Alert className="border-blue-200 bg-blue-50">
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          <strong>Next Steps:</strong> In the next module, we will explore more advanced concepts related to triangles and their properties. We'll build upon the foundation established in this module to delve deeper into geometric principles and problem-solving techniques.
        </AlertDescription>
      </Alert>
    </div>
  );
};