import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Compass, CheckCircle, Lightbulb, ArrowRight, Calculator, Zap } from 'lucide-react';

export const PointsLinesPlanes: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Compass className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold">Module 1: Lines, Angles & Polygons</h1>
        </div>
        <p className="text-lg text-muted-foreground">Foundation concepts in geometry</p>
      </header>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/angles_in_polygons.jpg"
          alt="Lines, angles, and polygons geometric concepts with clear labels and examples" 
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Introduction */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Introduction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed mb-4">
            Welcome to Module 1 of our Geometry course! In this module, we will explore the fundamental concepts of geometry, focusing on lines, angles, and polygons. These concepts form the foundation of geometric understanding and will be essential for all subsequent modules.
          </p>
          
          <Alert className="border-blue-200 bg-blue-50">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Teaching Moment:</strong> Geometry is all around us! From the design of buildings to the patterns in nature, geometric principles govern the physical world. As you learn these concepts, try to identify them in your everyday surroundings. This connection between abstract mathematical ideas and real-world applications will deepen your understanding and appreciation of geometry.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">By the end of this module, you will be able to:</p>
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
            
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Key properties of lines:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>A line has no endpoints</li>
                <li>A line is straight (no curves)</li>
                <li>A line has infinite length</li>
                <li>A line has no thickness</li>
              </ul>
            </div>

            <Alert className="border-amber-200 bg-amber-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> When we draw a "line" on paper, we're actually drawing a representation of a line, not a true mathematical line. A true line would extend forever in both directions and have no width. This distinction between mathematical abstractions and their physical representations is important throughout geometry.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Line Segments</h3>
            <p className="text-muted-foreground mb-4">
              A line segment is a portion of a line that has two endpoints. Unlike a line, a line segment has a definite length.
            </p>
            
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Key properties of line segments:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>A line segment has two endpoints</li>
                <li>A line segment has a measurable length</li>
                <li>A line segment is straight</li>
              </ul>
            </div>

            <Alert className="border-amber-200 bg-amber-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> To name a line segment, we use the letters of its endpoints with a line segment symbol above them. For example, a line segment with endpoints A and B is written as "line segment AB". This is different from how we name a line, which would be written as "line AB".
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Rays</h3>
            <p className="text-muted-foreground mb-4">
              A ray is a portion of a line that has one endpoint and extends infinitely in one direction.
            </p>
            
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Key properties of rays:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>A ray has one endpoint</li>
                <li>A ray extends infinitely in one direction</li>
                <li>A ray is straight</li>
              </ul>
            </div>

            <Alert className="border-amber-200 bg-amber-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> Think of a ray like a beam of light from a flashlight. It starts at a specific point (the flashlight) and continues indefinitely in one direction. We name a ray using its endpoint first, followed by any other point on the ray, with a ray symbol above them. For example, a ray starting at point A and passing through point B is written as "ray AB".
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Problem-Solving Approach: Identifying Lines, Line Segments, and Rays</h3>
            <p className="text-muted-foreground mb-4">When faced with a problem involving lines, line segments, or rays, follow these steps:</p>
            
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">1</span>
                  <span className="font-semibold">Identify the key elements</span>
                </div>
                <p className="text-sm text-muted-foreground ml-8">Look for endpoints or lack thereof.</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
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
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center mb-2">
                  <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">3</span>
                  <span className="font-semibold">Use proper notation</span>
                </div>
                <p className="text-sm text-muted-foreground ml-8">Label lines, line segments, and rays using the appropriate symbols.</p>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Example Problem:</h4>
              <p className="text-sm mb-2">In the figure below, identify and label all lines, line segments, and rays.</p>
              <div className="bg-white p-4 rounded border font-mono text-sm text-center">
                <div>C</div>
                <div>|</div>
                <div>|</div>
                <div>A——————B——————D</div>
              </div>
              <div className="mt-3 text-sm">
                <strong>Solution:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Line ABD is a line (extends infinitely in both directions)</li>
                  <li>Line segment AB is a line segment (has endpoints A and B)</li>
                  <li>Line segment BD is a line segment (has endpoints B and D)</li>
                  <li>Ray BC is a ray (has endpoint B and extends upward through C)</li>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-700 mb-2">Reflex Angle</h4>
                <p className="text-sm mb-2">Greater than 180° but less than 360°</p>
                <Alert className="border-indigo-100 bg-indigo-50 p-2">
                  <p className="text-xs">The larger "reflex" of the two possible angles</p>
                </Alert>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-700 mb-2">Full Angle</h4>
                <p className="text-sm mb-2">Exactly 360 degrees</p>
                <Alert className="border-yellow-100 bg-yellow-50 p-2">
                  <p className="text-xs">A complete rotation</p>
                </Alert>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Problem-Solving Approach: Identifying and Measuring Angles</h4>
              <p className="text-sm text-muted-foreground mb-4">When working with angles, follow these steps:</p>
              
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">1</span>
                    <span className="font-semibold text-sm">Identify the vertex and sides</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">The vertex is the point where the two rays meet, and the sides are the rays themselves.</p>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">2</span>
                    <span className="font-semibold text-sm">Determine the type of angle</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">Based on the measure, classify the angle as acute, right, obtuse, straight, reflex, or full.</p>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">3</span>
                    <span className="font-semibold text-sm">Use a protractor if needed</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">Place the center of the protractor on the vertex and align the 0-degree mark with one side of the angle.</p>
                </div>
              </div>

              <div className="mt-4 bg-white p-4 rounded border">
                <h5 className="font-semibold text-sm mb-2">Example Problem: Classify the following angles:</h5>
                <div className="text-xs space-y-1">
                  <p>a) 45° b) 90° c) 120° d) 180° e) 270°</p>
                </div>
                <div className="mt-3 text-xs">
                  <strong>Solution:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>45° is an acute angle (less than 90°)</li>
                    <li>90° is a right angle (exactly 90°)</li>
                    <li>120° is an obtuse angle (between 90° and 180°)</li>
                    <li>180° is a straight angle (exactly 180°)</li>
                    <li>270° is a reflex angle (between 180° and 360°)</li>
                  </ul>
                </div>
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

              <div className="bg-pink-50 p-4 rounded-lg">
                <h4 className="font-semibold text-pink-700 mb-2 flex items-center">
                  Vertical Angles
                  <Zap className="h-4 w-4 ml-2" />
                </h4>
                <p className="text-sm mb-2">Opposite angles are equal</p>
                <p className="text-xs text-muted-foreground">Formed by two intersecting lines</p>
                <div className="bg-pink-100 p-2 rounded text-xs mt-2">
                  If two lines intersect, opposite angles are congruent
                </div>
              </div>

              <div className="bg-cyan-50 p-4 rounded-lg">
                <h4 className="font-semibold text-cyan-700 mb-2 flex items-center">
                  Adjacent Angles
                  <ArrowRight className="h-4 w-4 ml-2" />
                </h4>
                <p className="text-sm mb-2">Share a vertex and side</p>
                <p className="text-xs text-muted-foreground">Next to each other without overlapping</p>
                <div className="bg-cyan-100 p-2 rounded text-xs mt-2">
                  Common vertex + common side + no overlap
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Problem-Solving Approach: Working with Angle Relationships</h4>
              <p className="text-sm text-muted-foreground mb-4">When solving problems involving angle relationships, follow these steps:</p>
              
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">1</span>
                    <span className="font-semibold text-sm">Identify the relationship</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">Determine if the angles are complementary, supplementary, vertical, or adjacent.</p>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">2</span>
                    <span className="font-semibold text-sm">Apply the appropriate equation</span>
                  </div>
                  <ul className="text-xs text-muted-foreground ml-8 list-disc list-inside space-y-1">
                    <li>Complementary angles: a + b = 90°</li>
                    <li>Supplementary angles: a + b = 180°</li>
                    <li>Vertical angles: a = c and b = d</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">3</span>
                    <span className="font-semibold text-sm">Solve for the unknown angle(s)</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-8">Use algebraic methods to find missing measurements.</p>
                </div>
              </div>

              <div className="mt-4 bg-white p-4 rounded border">
                <h5 className="font-semibold text-sm mb-2">Example Problem:</h5>
                <p className="text-xs mb-2">If two angles are supplementary and one of them is 65°, what is the measure of the other angle?</p>
                <div className="mt-3 text-xs">
                  <strong>Solution:</strong>
                  <div className="mt-1 space-y-1">
                    <p>Since the angles are supplementary, their sum is 180°.</p>
                    <p>Let x be the unknown angle.</p>
                    <p>65° + x = 180°</p>
                    <p>x = 180° - 65°</p>
                    <p>x = 115°</p>
                    <p><strong>Therefore, the other angle measures 115°.</strong></p>
                  </div>
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

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Properties of Polygons</h4>
              
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

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Problem-Solving Approach: Finding Polygon Angles</h4>
                <p className="text-sm text-muted-foreground mb-4">When solving problems involving polygon angles, follow these steps:</p>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">1</span>
                      <span className="font-semibold text-sm">Identify the type of polygon</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-8">Determine the number of sides.</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">2</span>
                      <span className="font-semibold text-sm">Apply the appropriate formula</span>
                    </div>
                    <ul className="text-xs text-muted-foreground ml-8 list-disc list-inside space-y-1">
                      <li>Sum of interior angles: (n-2) × 180°</li>
                      <li>Sum of exterior angles: 360°</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">3</span>
                      <span className="font-semibold text-sm">Calculate individual angles</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-8">For regular polygons, divide the sum by the number of sides.</p>
                  </div>
                </div>

                <div className="mt-4 bg-white p-4 rounded border">
                  <h5 className="font-semibold text-sm mb-2">Example Problem:</h5>
                  <p className="text-xs mb-2">Find the sum of the interior angles of a hexagon. If the hexagon is regular, what is the measure of each interior angle?</p>
                  <div className="mt-3 text-xs">
                    <strong>Solution:</strong>
                    <div className="mt-1 space-y-1">
                      <p>A hexagon has 6 sides.</p>
                      <p>Sum of interior angles = (n-2) × 180° = (6-2) × 180° = 4 × 180° = 720°</p>
                      <p>If the hexagon is regular, all interior angles are equal.</p>
                      <p>Each interior angle = 720° ÷ 6 = 120°</p>
                    </div>
                  </div>
                </div>
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
            
            <Alert className="border-amber-200 bg-amber-50 mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> Many everyday objects are shaped like polygons. Stop signs are octagons, most rooms are quadrilaterals, and many sports fields are rectangles. Recognizing these shapes in the world around you helps reinforce geometric concepts.
              </AlertDescription>
            </Alert>

            {/* Polygon Types Visual */}
            <div className="mt-6">
              <img 
                src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/polygons.jpg" 
                alt="Various types of polygons including triangles, quadrilaterals, pentagons, hexagons, and octagons showing their properties"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            </div>

            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">Special Polygons</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-emerald-700">Regular Polygon</h4>
                  <p className="text-sm mb-2">All sides and all angles equal</p>
                  <p className="text-xs text-muted-foreground">Perfect symmetry in both dimensions</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-orange-700">Irregular Polygon</h4>
                  <p className="text-sm mb-2">Unequal sides or angles</p>
                  <p className="text-xs text-muted-foreground">Most real-world polygons are irregular</p>
                </div>

                <div className="bg-sky-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sky-700">Convex Polygon</h4>
                  <p className="text-sm mb-2">All interior angles &lt; 180°</p>
                  <p className="text-xs text-muted-foreground">No "dents" or indentations</p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-700">Concave Polygon</h4>
                  <p className="text-sm mb-2">At least one angle &gt; 180°</p>
                  <p className="text-xs text-muted-foreground">Has "dents" that point inward</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Problem-Solving Approach: Classifying Polygons</h4>
                <p className="text-sm text-muted-foreground mb-4">When classifying polygons, follow these steps:</p>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">1</span>
                      <span className="font-semibold text-sm">Count the sides</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-8">Determine if it's a triangle, quadrilateral, pentagon, etc.</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">2</span>
                      <span className="font-semibold text-sm">Check for regularity</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-8">Measure the sides and angles to see if they're all equal.</p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">3</span>
                      <span className="font-semibold text-sm">Test for convexity</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-8">Check if any interior angle is greater than 180°.</p>
                  </div>
                </div>

                <div className="mt-4 bg-white p-4 rounded border">
                  <h5 className="font-semibold text-sm mb-2">Example Problem:</h5>
                  <p className="text-xs mb-2">Classify the following polygon: A pentagon with all sides equal but one interior angle of 200°.</p>
                  <div className="mt-3 text-xs">
                    <strong>Solution:</strong>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li>It's a pentagon because it has 5 sides.</li>
                      <li>It's irregular because, although all sides are equal, not all angles are equal (one is 200°).</li>
                      <li>It's concave because it has an interior angle greater than 180° (200°).</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Problems */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Practice Problems</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Problem 1: Angle Classification</h4>
            <p className="text-sm mb-2">Identify the type of angle: 45 degrees.</p>
            <Alert className="border-blue-100 bg-blue-50 p-2 mb-3">
              <p className="text-xs"><strong>Problem-Solving Guidance:</strong> Compare the angle measure to the benchmark values (90°, 180°, etc.) to determine its classification.</p>
            </Alert>
            <div className="bg-white p-3 rounded border">
              <p className="text-xs"><strong>Answer:</strong> 45° is an acute angle because it is less than 90°.</p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Problem 2: Complementary Angles</h4>
            <p className="text-sm mb-2">If two angles are complementary and one of them is 35 degrees, what is the measure of the other angle?</p>
            <Alert className="border-green-100 bg-green-50 p-2 mb-3">
              <p className="text-xs"><strong>Problem-Solving Guidance:</strong> Use the complementary angles formula: a + b = 90°. Substitute the known value and solve for the unknown.</p>
            </Alert>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs space-y-1">
                <p><strong>Solution:</strong></p>
                <p>Since the angles are complementary: a + b = 90°</p>
                <p>35° + b = 90°</p>
                <p>b = 90° - 35° = 55°</p>
                <p><strong>Answer:</strong> The other angle is 55°.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Problem 3: Polygon Angles</h4>
            <p className="text-sm mb-2">Calculate the sum of interior angles of a hexagon.</p>
            <Alert className="border-purple-100 bg-purple-50 p-2 mb-3">
              <p className="text-xs"><strong>Problem-Solving Guidance:</strong> Apply the formula for the sum of interior angles: (n-2) × 180°, where n is the number of sides.</p>
            </Alert>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs space-y-1">
                <p><strong>Solution:</strong></p>
                <p>A hexagon has n = 6 sides</p>
                <p>Sum = (n-2) × 180° = (6-2) × 180° = 4 × 180° = 720°</p>
                <p><strong>Answer:</strong> The sum of interior angles is 720°.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Problem 4: Regular Polygons</h4>
            <p className="text-sm mb-2">Identify whether a square is a regular polygon or an irregular polygon.</p>
            <Alert className="border-orange-100 bg-orange-50 p-2 mb-3">
              <p className="text-xs"><strong>Problem-Solving Guidance:</strong> Check the definition of a regular polygon (all sides and all angles equal) and determine if a square meets these criteria.</p>
            </Alert>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs space-y-1">
                <p><strong>Analysis:</strong></p>
                <p>• All sides of a square are equal ✓</p>
                <p>• All angles of a square are 90° (equal) ✓</p>
                <p><strong>Answer:</strong> A square is a regular polygon.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Problem 5: Polygon Diagonals</h4>
            <p className="text-sm mb-2">If a polygon has 7 sides, how many diagonals does it have?</p>
            <Alert className="border-red-100 bg-red-50 p-2 mb-3">
              <p className="text-xs"><strong>Problem-Solving Guidance:</strong> Use the formula for the number of diagonals: n(n-3)/2, where n is the number of sides.</p>
            </Alert>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs space-y-1">
                <p><strong>Solution:</strong></p>
                <p>For a heptagon, n = 7</p>
                <p>Number of diagonals = n(n-3)/2 = 7(7-3)/2 = 7×4/2 = 28/2 = 14</p>
                <p><strong>Answer:</strong> A heptagon has 14 diagonals.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-bold">Module Summary</h3>
            </div>
            <p className="text-muted-foreground">
              In this module, we have covered the fundamental concepts of lines, angles, and polygons. 
              We have learned about different types of lines, angles, and polygons, as well as their properties. 
              These concepts form the foundation of geometric understanding and will be essential for all subsequent modules.
            </p>
            <Alert className="border-amber-200 bg-amber-50 mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> Geometry is a subject that builds upon itself. The concepts of lines, angles, and polygons that we've learned in this module will be used extensively in future modules. Make sure you have a solid understanding of these fundamentals before moving on.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-secondary/5 to-primary/5">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-2">
              <ArrowRight className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">Next Steps</h3>
            </div>
            <p className="text-muted-foreground">
              In the next module, we will explore more advanced concepts related to triangles and their properties. 
              We'll build upon the foundation established in this module to delve deeper into geometric principles 
              and problem-solving techniques.
            </p>
            <Alert className="border-amber-200 bg-amber-50 mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> As you prepare for the next module, try to identify triangles in your surroundings and think about their properties. Are they acute, right, or obtuse? Are they equilateral, isosceles, or scalene? This practice will help reinforce the concepts you'll learn next.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};