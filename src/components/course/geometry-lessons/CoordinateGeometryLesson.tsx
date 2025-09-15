import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, MapPin, Calculator, TrendingUp, Target } from 'lucide-react';

// Import generated images
import coordinateSystem from '@/assets/coordinate-system.png';
import distanceMidpoint from '@/assets/distance-midpoint.png';
import lineEquations from '@/assets/line-equations.png';
import conicSections from '@/assets/conic-sections.png';

// Use existing storage image
const existingCoordinateImage = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/coordinate_geometry.png';

export const CoordinateGeometryLesson: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Module 7: Coordinate Geometry</h1>
      </div>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <MapPin className="h-8 w-8 text-primary" />
            Introduction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed">
            Welcome to Module 7 of our Geometry course! In this module, we will explore coordinate geometry, which combines algebra and geometry to solve problems using a coordinate system. We will learn how to represent geometric shapes algebraically and how to use algebraic techniques to analyze geometric properties.
          </p>
          
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Teaching Moment:</strong> Coordinate geometry, also known as analytic geometry, represents one of the most powerful unions in mathematics—the marriage of algebra and geometry. Before René Descartes and Pierre de Fermat developed coordinate systems in the 17th century, geometry and algebra were largely separate disciplines. Coordinate geometry bridges these fields by assigning numbers (coordinates) to points, allowing us to translate geometric problems into algebraic equations and vice versa. This breakthrough transformed mathematics and science, making it possible to analyze curves and shapes with algebraic precision. Today, coordinate geometry is essential in fields ranging from physics and engineering to computer graphics and GPS navigation. As you learn these concepts, you're following in the footsteps of mathematical pioneers who forever changed how we understand space.
            </AlertDescription>
          </Alert>

          <div className="mb-8">
            <img 
              src={existingCoordinateImage}
              alt="Coordinate geometry illustration showing coordinate plane with axes, quadrants, and plotted points"
              className="w-full max-w-4xl mx-auto object-contain rounded-lg shadow-lg"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Learning Objectives</h3>
            <p className="mb-4">By the end of this module, you will be able to:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span>Understand and apply the coordinate system in two dimensions</span>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Calculate the distance between points and find midpoints of line segments</span>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <span>Determine the equation of a line in various forms</span>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                  <span>Analyze the properties of lines, including slope and parallel/perpendicular relationships</span>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                  <span>Find the equations of circles, parabolas, ellipses, and hyperbolas</span>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                  <span>Solve geometric problems using algebraic techniques</span>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <span>Apply coordinate geometry to real-world situations</span>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: The Coordinate System */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Section 1: The Coordinate System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">The Cartesian Coordinate System</h3>
            <p className="text-lg leading-relaxed mb-4">
              The Cartesian coordinate system consists of two perpendicular number lines (axes) that intersect at a point called the origin. The horizontal axis is called the x-axis, and the vertical axis is called the y-axis. The position of any point in the plane can be described by an ordered pair of numbers (x, y).
            </p>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The Cartesian coordinate system is named after René Descartes, who formalized this approach in his 1637 work "La Géométrie." The beauty of this system lies in its simplicity and power. By assigning coordinates to points, we create a one-to-one correspondence between geometric points and ordered pairs of numbers. This correspondence allows us to translate geometric properties into algebraic relationships. For example, the distance between points becomes a formula involving coordinates, and a line becomes an equation relating x and y values. This translation between geometry and algebra opens up new approaches to solving problems in both fields. It's worth noting that while we typically use perpendicular axes with the same scale, other coordinate systems (like polar coordinates) and non-standard scales can be useful for specific applications.
              </AlertDescription>
            </Alert>
          </div>

          <div className="mb-6">
            <img 
              src={coordinateSystem}
              alt="Cartesian coordinate system showing x and y axes with four quadrants labeled and sample points plotted"
              className="w-full max-w-3xl mx-auto object-contain rounded-lg shadow-lg"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Plotting Points</h4>
            <p className="mb-3">To plot a point (x, y) on the coordinate plane:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Start at the origin (0, 0).</strong></li>
              <li><strong>Move x units horizontally</strong> (right if x is positive, left if x is negative).</li>
              <li><strong>From there, move y units vertically</strong> (up if y is positive, down if y is negative).</li>
            </ol>
            
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> Plotting points is the foundation of coordinate geometry. When we plot points, we're creating a visual representation of numerical data. This visualization helps us identify patterns and relationships that might not be obvious from the numbers alone. For example, plotting the points (1, 1), (2, 4), (3, 9), and (4, 16) reveals a parabolic pattern, suggesting a quadratic relationship (y = x²). The ability to move between numerical and visual representations is a powerful skill in mathematics and science. It's also worth noting that the convention of putting the x-coordinate first and the y-coordinate second is arbitrary but widely adopted. Some specialized fields use different conventions, so always check the context when interpreting coordinate pairs.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Quadrants</h4>
            <p className="mb-4">The coordinate plane is divided into four quadrants:</p>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <h5 className="font-semibold text-green-700 mb-2">Quadrant I</h5>
                <p className="text-sm">Both x and y are positive (upper right)</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <h5 className="font-semibold text-blue-700 mb-2">Quadrant II</h5>
                <p className="text-sm">x is negative, y is positive (upper left)</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                <h5 className="font-semibold text-red-700 mb-2">Quadrant III</h5>
                <p className="text-sm">Both x and y are negative (lower left)</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <h5 className="font-semibold text-purple-700 mb-2">Quadrant IV</h5>
                <p className="text-sm">x is positive, y is negative (lower right)</p>
              </Card>
            </div>
            
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The quadrant system provides a quick way to identify the general location of a point based on the signs of its coordinates. This classification is useful in many applications, from graphing functions to analyzing physical systems. For example, in physics, the four quadrants of position-velocity graphs represent different states of motion: moving forward and speeding up (I), moving forward but slowing down (II), moving backward and speeding up (III), or moving backward but slowing down (IV). Points that lie exactly on an axis don't belong to any quadrant—they form the boundaries between quadrants. Understanding quadrants helps us develop spatial intuition and organize our thinking about coordinate relationships.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-primary">Problem-Solving Approach: Working with Coordinates</h4>
            <p className="mb-3">When solving problems involving coordinates, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Identify the given points:</strong> Note the coordinates of all relevant points</li>
              <li><strong>Visualize the situation:</strong> Plot the points on a coordinate plane (mentally or on paper)</li>
              <li><strong>Apply appropriate formulas:</strong> Use distance, midpoint, or other formulas as needed</li>
              <li><strong>Interpret the results:</strong> Relate the numerical answer back to the geometric context</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-3 text-blue-800">Example Problem:</h4>
            <p className="mb-3"><strong>Plot the points A(3, 4), B(-2, 1), and C(-1, -3) on a coordinate plane. Identify the quadrant in which each point lies.</strong></p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Solution:</strong></p>
                <p><strong>Step 1:</strong> Plot the points on a coordinate plane.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Point A(3, 4): Move 3 units right and 4 units up from the origin.</li>
                  <li>Point B(-2, 1): Move 2 units left and 1 unit up from the origin.</li>
                  <li>Point C(-1, -3): Move 1 unit left and 3 units down from the origin.</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 2:</strong> Identify the quadrant for each point.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Point A(3, 4): Both coordinates are positive, so A is in Quadrant I.</li>
                  <li>Point B(-2, 1): x is negative and y is positive, so B is in Quadrant II.</li>
                  <li>Point C(-1, -3): x is negative and y is negative, so C is in Quadrant III.</li>
                </ul>
              </div>
              
              <p className="font-semibold">Therefore, point A is in Quadrant I, point B is in Quadrant II, and point C is in Quadrant III.</p>
            </div>
            
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> This problem illustrates the basic skill of plotting points and identifying quadrants. Notice how the signs of the coordinates immediately tell us which quadrant a point lies in. This connection between algebra (the signs of the coordinates) and geometry (the location in the plane) is a fundamental aspect of coordinate geometry. As you become more comfortable with the coordinate system, you'll develop the ability to visualize points and their relationships without always needing to draw them. This spatial intuition is valuable in more advanced mathematical and scientific contexts.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Distance and Midpoint Formulas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Section 2: Distance and Midpoint Formulas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Distance Formula</h3>
            <p className="text-lg leading-relaxed mb-4">
              The distance between two points (x₁, y₁) and (x₂, y₂) is given by:
            </p>
            <div className="text-center text-3xl font-bold text-primary mb-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
              d = √[(x₂ - x₁)² + (y₂ - y₁)²]
            </div>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The distance formula is a direct application of the Pythagorean theorem. If we draw a right triangle with the two points as opposite corners, the distance between the points is the length of the hypotenuse. The legs of the triangle have lengths |x₂ - x₁| and |y₂ - y₁|, representing the horizontal and vertical distances between the points. Applying the Pythagorean theorem (a² + b² = c²) gives us the distance formula. This connection illustrates how coordinate geometry builds on earlier geometric principles. The distance formula is used in countless applications, from calculating the length of a path to determining how far apart objects are in physical or abstract spaces. It's also the foundation for more advanced concepts like the equation of a circle and the definition of an ellipse.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Midpoint Formula</h3>
            <p className="text-lg leading-relaxed mb-4">
              The midpoint of a line segment with endpoints (x₁, y₁) and (x₂, y₂) is given by:
            </p>
            <div className="text-center text-3xl font-bold text-primary mb-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
              M = ((x₁ + x₂)/2, (y₁ + y₂)/2)
            </div>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The midpoint formula represents the average of the coordinates of the two endpoints. This makes intuitive sense: to find a point halfway between two others, we take the average of their positions. The formula works because coordinates measure distances from the axes, and the average gives us a point that's equidistant from both endpoints. The midpoint formula is useful not only for finding the center of a line segment but also in more complex applications like finding the center of a circle given its diameter endpoints or locating the centroid of a triangle (by averaging the coordinates of the three vertices). The concept of averaging coordinates extends to finding points that divide a line segment in any ratio, not just in half.
              </AlertDescription>
            </Alert>
          </div>

          <div className="mb-6">
            <img 
              src={distanceMidpoint}
              alt="Distance and midpoint formulas visualization showing two points connected by a line segment with formulas"
              className="w-full max-w-3xl mx-auto object-contain rounded-lg shadow-lg"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-primary">Problem-Solving Approach: Using Distance and Midpoint Formulas</h4>
            <p className="mb-3">When solving problems involving distances and midpoints, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Identify the coordinates:</strong> Note the coordinates of all relevant points</li>
              <li><strong>Choose the appropriate formula:</strong> Determine whether you need the distance or midpoint formula</li>
              <li><strong>Substitute the values:</strong> Insert the coordinates into the formula</li>
              <li><strong>Calculate the result:</strong> Perform the arithmetic operations</li>
              <li><strong>Verify your answer:</strong> Check that your solution makes sense in the context of the problem</li>
            </ol>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h4 className="font-semibold mb-3 text-green-800">Example Problem:</h4>
            <p className="mb-3"><strong>Find the distance between the points P(2, -3) and Q(-4, 5). Then find the midpoint of the line segment PQ.</strong></p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Solution:</strong></p>
                <p><strong>Step 1:</strong> Identify the coordinates.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>P(2, -3) and Q(-4, 5)</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 2:</strong> Apply the distance formula.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>d = √[(x₂ - x₁)² + (y₂ - y₁)²]</li>
                  <li>d = √[(-4 - 2)² + (5 - (-3))²]</li>
                  <li>d = √[(-6)² + 8²]</li>
                  <li>d = √[36 + 64]</li>
                  <li>d = √100</li>
                  <li>d = 10</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 3:</strong> Apply the midpoint formula.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>M = ((x₁ + x₂)/2, (y₁ + y₂)/2)</li>
                  <li>M = ((2 + (-4))/2, (-3 + 5)/2)</li>
                  <li>M = (-2/2, 2/2)</li>
                  <li>M = (-1, 1)</li>
                </ul>
              </div>
              
              <p className="font-semibold">Therefore, the distance between points P and Q is 10 units, and the midpoint of line segment PQ is (-1, 1).</p>
            </div>
            
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> This problem demonstrates the straightforward application of the distance and midpoint formulas. Notice how we carefully substituted the coordinates, paying attention to signs. The distance formula always gives a positive result (the square root of a sum of squares), which makes sense because distance is always positive. The midpoint coordinates can be positive, negative, or zero, depending on the locations of the endpoints. In this case, the midpoint (-1, 1) lies in Quadrant II, even though one endpoint is in Quadrant IV and the other is in Quadrant II. This illustrates how the midpoint doesn't necessarily lie in the same quadrant as either endpoint.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Equations of Lines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Section 3: Equations of Lines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Slope of a Line</h3>
            <p className="text-lg leading-relaxed mb-4">
              The slope of a line passing through points (x₁, y₁) and (x₂, y₂) is given by:
            </p>
            <div className="text-center text-3xl font-bold text-primary mb-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
              m = (y₂ - y₁) / (x₂ - x₁)
            </div>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The slope measures the steepness and direction of a line—it tells us how much the y-coordinate changes for a given change in the x-coordinate. A positive slope means the line rises as x increases, while a negative slope means it falls. The larger the absolute value of the slope, the steeper the line. The slope formula represents the ratio of "rise" (vertical change) to "run" (horizontal change), which is why it's often remembered as "rise over run." This concept connects to rates of change in calculus and to proportional relationships in algebra. It's worth noting that vertical lines have undefined slope (since the denominator would be zero), while horizontal lines have zero slope. These special cases remind us that the slope is fundamentally about the relationship between changes in x and changes in y.
              </AlertDescription>
            </Alert>
          </div>

          <div className="mb-6">
            <img 
              src={lineEquations}
              alt="Linear equations and slope visualization showing different forms of line equations"
              className="w-full max-w-3xl mx-auto object-contain rounded-lg shadow-lg"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Forms of Line Equations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <h5 className="font-semibold text-blue-700 mb-3">1. Slope-Intercept Form:</h5>
                <div className="text-center text-2xl font-bold text-blue-800 mb-3 p-3 bg-white rounded">
                  y = mx + b
                </div>
                <ul className="text-sm space-y-1">
                  <li>• <strong>m</strong> is the slope of the line</li>
                  <li>• <strong>b</strong> is the y-intercept (the y-coordinate where the line crosses the y-axis)</li>
                </ul>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <h5 className="font-semibold text-green-700 mb-3">2. Point-Slope Form:</h5>
                <div className="text-center text-2xl font-bold text-green-800 mb-3 p-3 bg-white rounded">
                  y - y₁ = m(x - x₁)
                </div>
                <ul className="text-sm space-y-1">
                  <li>• <strong>m</strong> is the slope of the line</li>
                  <li>• <strong>(x₁, y₁)</strong> is a point on the line</li>
                </ul>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <h5 className="font-semibold text-purple-700 mb-3">3. Standard Form:</h5>
                <div className="text-center text-2xl font-bold text-purple-800 mb-3 p-3 bg-white rounded">
                  Ax + By + C = 0
                </div>
                <ul className="text-sm space-y-1">
                  <li>• <strong>A</strong>, <strong>B</strong>, and <strong>C</strong> are constants</li>
                  <li>• A and B are not both zero</li>
                </ul>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <h5 className="font-semibold text-orange-700 mb-3">4. Two-Point Form:</h5>
                <div className="text-center text-xl font-bold text-orange-800 mb-3 p-3 bg-white rounded">
                  (y - y₁) / (y₂ - y₁) = (x - x₁) / (x₂ - x₁)
                </div>
                <ul className="text-sm space-y-1">
                  <li>• <strong>(x₁, y₁)</strong> and <strong>(x₂, y₂)</strong> are two distinct points on the line</li>
                </ul>
              </Card>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Parallel and Perpendicular Lines</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
                <h5 className="font-semibold text-cyan-700 mb-2">1. Parallel Lines</h5>
                <p className="text-sm">Two lines are parallel if and only if they have the same slope or are both vertical.</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                <h5 className="font-semibold text-red-700 mb-2">2. Perpendicular Lines</h5>
                <p className="text-sm">Two lines are perpendicular if and only if the product of their slopes is -1, or one is vertical and the other is horizontal.</p>
              </Card>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-primary">Problem-Solving Approach: Working with Line Equations</h4>
            <p className="mb-3">When solving problems involving line equations, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Identify what is given:</strong> Note the slope, points, or other information about the line</li>
              <li><strong>Determine what form of the line equation is most appropriate:</strong> Choose based on the given information and what you need to find</li>
              <li><strong>Substitute the values:</strong> Insert the known values into the appropriate formula</li>
              <li><strong>Solve for any unknown parameters:</strong> Find the values of constants like m, b, A, B, or C</li>
              <li><strong>Write the final equation:</strong> Express the line equation in the required form</li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h4 className="font-semibold mb-3 text-yellow-800">Example Problem:</h4>
            <p className="mb-3"><strong>Find the equation of the line passing through the points (2, 3) and (4, 7). Express your answer in slope-intercept form.</strong></p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Solution:</strong></p>
                <p><strong>Step 1:</strong> Calculate the slope using the slope formula.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>m = (y₂ - y₁) / (x₂ - x₁)</li>
                  <li>m = (7 - 3) / (4 - 2)</li>
                  <li>m = 4 / 2</li>
                  <li>m = 2</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 2:</strong> Use the point-slope form with one of the given points, say (2, 3).</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>y - y₁ = m(x - x₁)</li>
                  <li>y - 3 = 2(x - 2)</li>
                  <li>y - 3 = 2x - 4</li>
                  <li>y = 2x - 4 + 3</li>
                  <li>y = 2x - 1</li>
                </ul>
              </div>
              
              <p className="font-semibold">Therefore, the equation of the line in slope-intercept form is y = 2x - 1.</p>
            </div>
            
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> This problem demonstrates the process of finding a line equation from two points. We first calculated the slope using the slope formula, then used the point-slope form to find the equation. Finally, we rearranged to get the slope-intercept form. Notice that we could have used either of the given points in the point-slope form—the resulting equation would be the same. This consistency reflects the fact that a unique line passes through any two distinct points. The slope-intercept form y = 2x - 1 tells us that the line has a slope of 2 (rises 2 units for every 1 unit to the right) and crosses the y-axis at the point (0, -1). This visual interpretation helps connect the algebraic equation to the geometric reality of the line.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Circles in Coordinate Geometry */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Section 4: Circles in Coordinate Geometry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Equation of a Circle</h3>
            <p className="text-lg leading-relaxed mb-4">
              The standard form of the equation of a circle with center (h, k) and radius r is:
            </p>
            <div className="text-center text-3xl font-bold text-primary mb-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
              (x - h)² + (y - k)² = r²
            </div>
            <p className="text-lg leading-relaxed mb-4">
              If the center is at the origin (0, 0), the equation simplifies to:
            </p>
            <div className="text-center text-3xl font-bold text-primary mb-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
              x² + y² = r²
            </div>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The circle equation is a direct application of the distance formula. It states that a point (x, y) is on the circle if and only if its distance from the center (h, k) equals the radius r. This definition translates the geometric concept of a circle (all points equidistant from a center) into an algebraic equation. The standard form clearly shows the center and radius, making it easy to graph the circle and understand its position and size. The special case of a circle centered at the origin simplifies the equation, but the underlying principle remains the same. The circle equation is fundamental in many applications, from designing circular structures to analyzing orbital motion in physics. It also serves as the simplest example of a conic section, connecting to ellipses, parabolas, and hyperbolas.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">General Form of the Equation of a Circle</h4>
            <p className="text-lg leading-relaxed mb-4">
              The general form of the equation of a circle is:
            </p>
            <div className="text-center text-2xl font-bold text-primary mb-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
              x² + y² + 2gx + 2fy + c = 0
            </div>
            <p className="mb-4">where the center is at (-g, -f) and the radius is √(g² + f² - c).</p>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The general form is obtained by expanding the standard form and collecting like terms. To convert from general to standard form, you complete the square for both x and y terms. This process of "completing the square" is a fundamental algebraic technique that allows us to identify the center and radius from the general equation. For example, x² + y² + 6x - 4y + 9 = 0 can be rewritten as (x + 3)² + (y - 2)² = 4, revealing a circle with center (-3, 2) and radius 2. The ability to move between these forms is crucial for solving problems involving circles in coordinate geometry. The general form is often more convenient for algebraic manipulations, while the standard form provides clearer geometric insight.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-primary">Problem-Solving Approach: Working with Circle Equations</h4>
            <p className="mb-3">When working with equations of circles, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Identify the form of the equation:</strong> Determine if it's in standard form, general form, or needs to be converted</li>
              <li><strong>Extract the key information:</strong> Find the center and radius from the equation</li>
              <li><strong>Apply geometric principles:</strong> Use the center and radius to solve the problem</li>
              <li><strong>Verify your answer:</strong> Check that your solution satisfies all conditions of the problem</li>
            </ol>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h4 className="font-semibold mb-3 text-purple-800">Example Problem:</h4>
            <p className="mb-3"><strong>Find the center and radius of the circle with equation x² + y² - 6x + 4y - 12 = 0.</strong></p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Solution:</strong></p>
                <p><strong>Step 1:</strong> Rearrange to group x and y terms.</p>
                <p className="ml-4">x² - 6x + y² + 4y - 12 = 0</p>
              </div>
              
              <div>
                <p><strong>Step 2:</strong> Complete the square for x terms.</p>
                <p className="ml-4">(x² - 6x + 9) + y² + 4y - 12 - 9 = 0</p>
                <p className="ml-4">(x - 3)² + y² + 4y - 21 = 0</p>
              </div>
              
              <div>
                <p><strong>Step 3:</strong> Complete the square for y terms.</p>
                <p className="ml-4">(x - 3)² + (y² + 4y + 4) - 21 - 4 = 0</p>
                <p className="ml-4">(x - 3)² + (y + 2)² - 25 = 0</p>
                <p className="ml-4">(x - 3)² + (y + 2)² = 25</p>
              </div>
              
              <div>
                <p><strong>Step 4:</strong> Identify the center and radius from the standard form.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Center: (3, -2)</li>
                  <li>Radius: 5</li>
                </ul>
              </div>
              
              <p className="font-semibold">Therefore, the circle has center (3, -2) and radius 5.</p>
            </div>
            
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> This problem illustrates the technique of completing the square to convert a circle equation from general to standard form. This is a powerful method in coordinate geometry that reveals the geometric properties (center and radius) from the algebraic representation. Notice how we carefully tracked the constants during the completion of squares, ensuring that the equation remained equivalent throughout the transformations. The ability to move fluently between algebraic and geometric interpretations is a hallmark of mathematical thinking. In this case, we transformed an equation that didn't immediately reveal its geometric meaning into one that clearly describes a circle with center (3, -2) and radius 5.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Conic Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Section 5: Conic Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-6">
            <img 
              src={conicSections}
              alt="Conic sections showing circle, parabola, ellipse, and hyperbola with their equations"
              className="w-full max-w-4xl mx-auto object-contain rounded-lg shadow-lg"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Parabolas</h3>
            <p className="text-lg leading-relaxed mb-4">
              A parabola is the set of all points in a plane that are equidistant from a fixed point (the focus) and a fixed line (the directrix).
            </p>
            <p className="mb-4">The standard form of the equation of a parabola with vertex at the origin is:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="text-center text-lg font-bold text-primary p-3 bg-primary/5 rounded-lg border border-primary/20">
                y = ax² (opens upward if a &gt; 0, downward if a &lt; 0)
              </div>
              <div className="text-center text-lg font-bold text-primary p-3 bg-primary/5 rounded-lg border border-primary/20">
                x = ay² (opens rightward if a &gt; 0, leftward if a &lt; 0)
              </div>
            </div>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> Parabolas are fascinating curves with numerous applications. The reflective property of parabolas—that light rays emanating from the focus reflect off the parabola in parallel lines—is used in the design of flashlights, satellite dishes, and telescope mirrors. In physics, the path of a projectile under constant gravity follows a parabolic trajectory. The standard form y = ax² represents the simplest parabola, with its vertex at the origin and its axis of symmetry along the y-axis. The coefficient a determines both the direction of opening and the "width" of the parabola—larger |a| values create narrower parabolas. More generally, a parabola with vertex at (h, k) has the form y - k = a(x - h)² or x - h = a(y - k)². Understanding parabolas in coordinate geometry provides insights into quadratic functions in algebra and into physical phenomena like projectile motion.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Ellipses</h3>
            <p className="text-lg leading-relaxed mb-4">
              An ellipse is the set of all points in a plane such that the sum of the distances from any point on the ellipse to two fixed points (the foci) is constant.
            </p>
            <p className="mb-4">The standard form of the equation of an ellipse with center at the origin is:</p>
            <div className="text-center text-2xl font-bold text-primary mb-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
              x²/a² + y²/b² = 1 (where a and b are the semi-major and semi-minor axes)
            </div>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> Ellipses appear throughout nature and human design. Planetary orbits are elliptical, with the sun at one focus—a discovery made by Johannes Kepler that revolutionized astronomy. The "whispering gallery" effect, where sound travels unusually well between the foci of an elliptical room, is used in architectural acoustics. In the standard form x²/a² + y²/b² = 1, the values a and b determine the shape of the ellipse: if a &gt; b, the ellipse is stretched horizontally; if b &gt; a, it's stretched vertically; if a = b, it's a circle (a special case of an ellipse). The foci are located at (±c, 0) where c² = a² - b² (assuming a &gt; b). Understanding ellipses in coordinate geometry connects to concepts in astronomy, optics, and engineering, where elliptical shapes serve specific functional purposes.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Hyperbolas</h3>
            <p className="text-lg leading-relaxed mb-4">
              A hyperbola is the set of all points in a plane such that the absolute difference of the distances from any point on the hyperbola to two fixed points (the foci) is constant.
            </p>
            <p className="mb-4">The standard form of the equation of a hyperbola with center at the origin is:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="text-center text-lg font-bold text-primary p-3 bg-primary/5 rounded-lg border border-primary/20">
                x²/a² - y²/b² = 1 (opens left and right)
              </div>
              <div className="text-center text-lg font-bold text-primary p-3 bg-primary/5 rounded-lg border border-primary/20">
                y²/a² - x²/b² = 1 (opens up and down)
              </div>
            </div>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> Hyperbolas have distinctive properties that make them useful in various applications. The reflective property of hyperbolas—that rays emanating from one focus reflect toward the other focus—is used in certain telescope designs. Hyperbolic navigation was a system used before GPS, based on the principle that the difference in distances from two fixed points determines a hyperbola. In the standard form x²/a² - y²/b² = 1, the hyperbola has its transverse axis along the x-axis and opens to the left and right. The asymptotes of this hyperbola are the lines y = ±(b/a)x, which the curves approach but never touch as x approaches infinity. Understanding hyperbolas in coordinate geometry provides insights into rational functions in algebra and into physical phenomena like sonic booms and gravitational lensing.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-primary">Problem-Solving Approach: Working with Conic Sections</h4>
            <p className="mb-3">When solving problems involving conic sections, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Identify the type of conic section:</strong> Determine if it's a parabola, ellipse, or hyperbola based on the equation or given information</li>
              <li><strong>Convert to standard form if necessary:</strong> Rearrange the equation to match the standard form for that conic section</li>
              <li><strong>Identify key features:</strong> Find the center, vertices, foci, or other important points</li>
              <li><strong>Apply relevant formulas or properties:</strong> Use the specific characteristics of the conic section to solve the problem</li>
              <li><strong>Verify your answer:</strong> Check that your solution satisfies all conditions of the problem</li>
            </ol>
          </div>

          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
            <h4 className="font-semibold mb-3 text-indigo-800">Example Problem:</h4>
            <p className="mb-3"><strong>Identify the type of conic section represented by the equation 4x² + 9y² = 36, and find its key features.</strong></p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Solution:</strong></p>
                <p><strong>Step 1:</strong> Rearrange the equation to standard form.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>4x² + 9y² = 36</li>
                  <li>x²/(36/4) + y²/(36/9) = 1</li>
                  <li>x²/9 + y²/4 = 1</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 2:</strong> Identify the type of conic section.</p>
                <p className="ml-4">This is in the form x²/a² + y²/b² = 1, which represents an ellipse.</p>
              </div>
              
              <div>
                <p><strong>Step 3:</strong> Identify the key features.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>a² = 9, so a = 3</li>
                  <li>b² = 4, so b = 2</li>
                  <li>The semi-major axis is a = 3, and the semi-minor axis is b = 2</li>
                  <li>The ellipse is centered at the origin (0, 0)</li>
                  <li>The ellipse is stretched horizontally (since a &gt; b)</li>
                  <li>The vertices are at (±a, 0) = (±3, 0)</li>
                  <li>The co-vertices are at (0, ±b) = (0, ±2)</li>
                  <li>To find the foci, calculate c = √(a² - b²) = √(9 - 4) = √5</li>
                  <li>The foci are at (±c, 0) = (±√5, 0)</li>
                </ul>
              </div>
              
              <p className="font-semibold">Therefore, the equation represents an ellipse with center (0, 0), semi-major axis 3, semi-minor axis 2, vertices at (±3, 0), co-vertices at (0, ±2), and foci at (±√5, 0).</p>
            </div>
            
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> This problem demonstrates how to analyze a conic section equation to identify its type and key features. We recognized it as an ellipse by comparing it to the standard form x²/a² + y²/b² = 1. The values of a and b tell us about the shape and size of the ellipse, while the absence of linear terms in x and y indicates that the center is at the origin. The fact that a &gt; b means the ellipse is stretched horizontally rather than vertically. The locations of the vertices, co-vertices, and foci are determined by the values of a, b, and c. Understanding these features helps us visualize the ellipse and analyze its properties. This approach of identifying standard forms and extracting geometric meaning from algebraic expressions is central to coordinate geometry.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Applications of Coordinate Geometry */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Section 6: Applications of Coordinate Geometry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Finding Areas of Polygons</h3>
            <p className="text-lg leading-relaxed mb-4">
              The area of a polygon can be calculated using the coordinates of its vertices. For a polygon with vertices (x₁, y₁), (x₂, y₂), ..., (xₙ, yₙ) (in order), the area is given by:
            </p>
            <div className="text-center text-lg font-bold text-primary mb-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
              Area = (1/2) × |[(x₁y₂ - x₂y₁) + (x₂y₃ - x₃y₂) + ... + (xₙy₁ - x₁yₙ)]|
            </div>
            <p className="mb-4">This is known as the <strong>Shoelace formula</strong> or the <strong>Surveyor's formula</strong>.</p>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The Shoelace formula provides an elegant way to calculate the area of any simple polygon (one without self-intersections) using only the coordinates of its vertices. The name "Shoelace" comes from the crisscrossing pattern of multiplications that resembles lacing a shoe. This formula is particularly useful in computer graphics, geographic information systems (GIS), and surveying, where polygonal areas need to be calculated from coordinate data. The formula works by dividing the polygon into triangles and summing their signed areas, which is why we take the absolute value of the final result. This approach illustrates how coordinate geometry can simplify complex geometric calculations by translating them into systematic algebraic operations.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Determining if Points are Collinear</h3>
            <p className="text-lg leading-relaxed mb-4">
              Three or more points are collinear (lie on the same straight line) if and only if the slope between any two points is the same.
            </p>
            <p className="mb-4">
              For three points (x₁, y₁), (x₂, y₂), and (x₃, y₃), they are collinear if:
            </p>
            <div className="text-center text-lg font-bold text-primary mb-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
              (y₂ - y₁) / (x₂ - x₁) = (y₃ - y₂) / (x₃ - x₂)
            </div>
            <p className="mb-4">Alternatively, three points are collinear if the area of the triangle formed by them is zero.</p>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> Collinearity is a fundamental concept in geometry, and coordinate geometry provides multiple ways to test for it. The slope-based approach checks if the rate of change between consecutive points is constant, which is true only if they lie on the same line. The area-based approach uses the fact that three collinear points form a "degenerate" triangle with zero area. These methods extend to checking if multiple points lie on the same line, which is useful in pattern recognition, computer vision, and data analysis. For example, in image processing, detecting collinear points can help identify straight edges in objects. The ability to translate the geometric property of collinearity into algebraic conditions exemplifies the power of coordinate geometry in solving practical problems.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Checking if a Point Lies Inside a Polygon</h3>
            <p className="text-lg leading-relaxed mb-4">
              To determine if a point lies inside a polygon, we can use the ray casting algorithm:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4 mb-4">
              <li>Draw a ray (half-line) from the point in any fixed direction.</li>
              <li>Count the number of times the ray intersects the edges of the polygon.</li>
              <li>If the count is odd, the point is inside the polygon; if even, it's outside.</li>
            </ol>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The point-in-polygon problem is fundamental in computer graphics, geographic information systems, and computational geometry. The ray casting algorithm, also known as the even-odd rule, provides an elegant solution based on a simple principle: if you start outside a region and cross its boundary an odd number of times, you end up inside; if you cross it an even number of times, you end up outside. This approach works for any simple polygon, whether convex or concave. In practice, implementations need to handle special cases, like when the ray passes exactly through a vertex or runs along an edge. Alternative methods include the winding number algorithm and barycentric coordinates for triangles. These techniques illustrate how coordinate geometry enables computers to perform spatial reasoning tasks that are intuitive for humans but need precise mathematical formulation for machines.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-primary">Problem-Solving Approach: Applying Coordinate Geometry</h4>
            <p className="mb-3">When applying coordinate geometry to solve problems, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Represent the geometric situation using coordinates:</strong> Assign coordinates to relevant points, possibly using a convenient coordinate system</li>
              <li><strong>Translate geometric properties into algebraic conditions:</strong> Express relationships like distance, collinearity, or area in terms of coordinates</li>
              <li><strong>Apply appropriate formulas and techniques:</strong> Use the tools of coordinate geometry to analyze the situation</li>
              <li><strong>Interpret the results geometrically:</strong> Translate the algebraic conclusions back into geometric insights</li>
            </ol>
          </div>

          <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
            <h4 className="font-semibold mb-3 text-teal-800">Example Problem:</h4>
            <p className="mb-3"><strong>Find the area of the triangle with vertices A(1, 2), B(4, 3), and C(2, 5).</strong></p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Solution:</strong></p>
                <p><strong>Step 1:</strong> We can use the Shoelace formula to find the area.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Area = (1/2) × |[(x₁y₂ - x₂y₁) + (x₂y₃ - x₃y₂) + (x₃y₁ - x₁y₃)]|</li>
                  <li>Area = (1/2) × |[(1 × 3 - 4 × 2) + (4 × 5 - 2 × 3) + (2 × 2 - 1 × 5)]|</li>
                  <li>Area = (1/2) × |[(3 - 8) + (20 - 6) + (4 - 5)]|</li>
                  <li>Area = (1/2) × |[-5 + 14 - 1]|</li>
                  <li>Area = (1/2) × |8|</li>
                  <li>Area = 4</li>
                </ul>
              </div>
              
              <p className="font-semibold">Therefore, the area of the triangle is 4 square units.</p>
            </div>
            
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> This problem demonstrates the application of the Shoelace formula to calculate the area of a triangle. While we could have used other methods (like the formula Area = (1/2) × base × height), the Shoelace formula works directly with the coordinates without requiring additional constructions. Notice how we carefully tracked the terms in the formula, making sure to match each x-coordinate with the next vertex's y-coordinate in the cyclic order. The absolute value ensures that we get a positive area regardless of the orientation of the vertices (clockwise or counterclockwise). This coordinate-based approach is particularly valuable when working with irregular polygons or when the vertices are given as coordinates rather than as distances and angles.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Practice Problems */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            Practice Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <p className="font-semibold mb-2">1. Distance and Midpoint</p>
              <p className="text-sm">Find the distance between the points A(3, -2) and B(-1, 5).</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <p className="font-semibold mb-2">2. Midpoint Formula</p>
              <p className="text-sm">Find the midpoint of the line segment with endpoints P(2, 8) and Q(-4, -6).</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
              <p className="font-semibold mb-2">3. Line Equations</p>
              <p className="text-sm">Find the equation of the line passing through the point (3, 4) with slope -2. Express your answer in slope-intercept form.</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
              <p className="font-semibold mb-2">4. Collinearity</p>
              <p className="text-sm">Determine if the points A(1, 3), B(4, 9), and C(7, 15) are collinear.</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
              <p className="font-semibold mb-2">5. Circle Equations</p>
              <p className="text-sm">Find the center and radius of the circle with equation x² + y² + 6x - 8y + 9 = 0.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed mb-4">
            In this module, we have explored coordinate geometry, which combines algebra and geometry to solve problems using a coordinate system. We have learned about the distance and midpoint formulas, equations of lines, circles, and conic sections, and various applications of coordinate geometry.
          </p>
          
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Teaching Moment:</strong> Coordinate geometry represents one of the most powerful unifications in mathematics—the marriage of algebra and geometry. By assigning coordinates to points, we can translate geometric problems into algebraic equations and vice versa. This approach provides a systematic way to solve geometric problems and reveals connections between seemingly different mathematical concepts. The techniques we've learned in this module—from the distance formula to the equations of conic sections—have applications in fields ranging from physics and engineering to computer graphics and navigation. As you continue your mathematical journey, you'll find that coordinate geometry serves as a bridge between various branches of mathematics and provides a foundation for more advanced topics like vector calculus and differential geometry.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed mb-4">
            In the next module, we will explore vectors and vector geometry. We'll learn how vectors can be used to represent quantities with both magnitude and direction, and how vector operations can simplify many geometric problems.
          </p>
          
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Teaching Moment:</strong> As we transition from coordinate geometry to vector geometry, we'll build on the coordinate system we've been using but add new tools and perspectives. Vectors extend the concept of coordinates by treating ordered pairs or triples as directed quantities rather than just positions. This approach allows us to represent and analyze forces, velocities, and other directional quantities in a natural way. Vector geometry provides elegant solutions to many problems that would be cumbersome using traditional coordinate geometry. The connection between these approaches illustrates the richness of mathematics—how the same underlying reality can be viewed through different lenses, each offering unique insights and advantages.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};