import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Calculator, MapPin, TrendingUp, Grid } from 'lucide-react';
import coordinateGeometryImage from '@/assets/coordinate-geometry-lesson.jpg';

export const CoordinateGeometryLesson: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <MapPin className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Module 7: Coordinate Geometry</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore coordinate geometry, which combines algebra and geometry to solve problems using a coordinate system. Learn to represent geometric shapes algebraically and use algebraic techniques to analyze geometric properties.
        </p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={coordinateGeometryImage} 
          alt="Coordinate plane showing points, lines, and shapes with grid lines and mathematical plotting"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Teaching Moment */}
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          <strong>Teaching Moment:</strong> Coordinate geometry, also known as analytic geometry, represents one of the most powerful unions in mathematics—the marriage of algebra and geometry. Before René Descartes and Pierre de Fermat developed coordinate systems in the 17th century, geometry and algebra were largely separate disciplines. Today, coordinate geometry is essential in fields ranging from physics and engineering to computer graphics and GPS navigation.
        </AlertDescription>
      </Alert>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">By the end of this module, you will be able to:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Understand and apply the coordinate system in two dimensions</li>
            <li>Calculate the distance between points and find midpoints of line segments</li>
            <li>Determine the equation of a line in various forms</li>
            <li>Analyze the properties of lines, including slope and parallel/perpendicular relationships</li>
            <li>Find the equations of circles, parabolas, ellipses, and hyperbolas</li>
            <li>Solve geometric problems using algebraic techniques</li>
            <li>Apply coordinate geometry to real-world situations</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 1: The Coordinate System */}
      <Card>
        <CardHeader>
          <CardTitle>Section 1: The Coordinate System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">The Cartesian Coordinate System</h3>
            <p className="mb-4">
              The Cartesian coordinate system consists of two perpendicular number lines (axes) that intersect at a point called the origin. The horizontal axis is called the x-axis, and the vertical axis is called the y-axis. The position of any point in the plane can be described by an ordered pair of numbers (x, y).
            </p>
            
            <Alert>
              <AlertDescription>
                <strong>Teaching Moment:</strong> The Cartesian coordinate system is named after René Descartes, who formalized this approach in his 1637 work "La Géométrie." The beauty of this system lies in its simplicity and power. By assigning coordinates to points, we create a one-to-one correspondence between geometric points and ordered pairs of numbers.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Plotting Points</h4>
            <p className="mb-3">To plot a point (x, y) on the coordinate plane:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Start at the origin (0, 0)</li>
              <li>Move x units horizontally (right if x is positive, left if x is negative)</li>
              <li>From there, move y units vertically (up if y is positive, down if y is negative)</li>
            </ol>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Quadrants</h4>
            <p className="mb-3">The coordinate plane is divided into four quadrants:</p>
            <ul className="space-y-2">
              <li><strong>Quadrant I:</strong> Both x and y are positive (upper right)</li>
              <li><strong>Quadrant II:</strong> x is negative, y is positive (upper left)</li>
              <li><strong>Quadrant III:</strong> Both x and y are negative (lower left)</li>
              <li><strong>Quadrant IV:</strong> x is positive, y is negative (lower right)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Distance and Midpoint Formulas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Section 2: Distance and Midpoint Formulas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Distance Formula</h3>
            <p className="mb-4">
              The distance between two points (x₁, y₁) and (x₂, y₂) is given by:
            </p>
            <div className="bg-muted p-4 rounded-lg text-center">
              <strong>d = √[(x₂ - x₁)² + (y₂ - y₁)²]</strong>
            </div>
            <Alert className="mt-4">
              <AlertDescription>
                <strong>Teaching Moment:</strong> The distance formula is a direct application of the Pythagorean theorem. If we draw a right triangle with the two points as opposite corners, the distance between the points is the length of the hypotenuse.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Midpoint Formula</h3>
            <p className="mb-4">
              The midpoint of a line segment with endpoints (x₁, y₁) and (x₂, y₂) is given by:
            </p>
            <div className="bg-muted p-4 rounded-lg text-center">
              <strong>M = ((x₁ + x₂)/2, (y₁ + y₂)/2)</strong>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3">Example Problem</h4>
            <p className="mb-3"><strong>Problem:</strong> Find the distance between points P(2, -3) and Q(-4, 5). Then find the midpoint of line segment PQ.</p>
            
            <div className="space-y-3">
              <p><strong>Solution:</strong></p>
              <p><strong>Step 1:</strong> Apply the distance formula</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>d = √[(-4 - 2)² + (5 - (-3))²]</li>
                <li>d = √[(-6)² + 8²]</li>
                <li>d = √[36 + 64] = √100 = 10</li>
              </ul>
              
              <p><strong>Step 2:</strong> Apply the midpoint formula</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>M = ((2 + (-4))/2, (-3 + 5)/2)</li>
                <li>M = (-2/2, 2/2) = (-1, 1)</li>
              </ul>
              
              <p><strong>Answer:</strong> Distance = 10 units, Midpoint = (-1, 1)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Equations of Lines */}
      <Card>
        <CardHeader>
          <CardTitle>Section 3: Equations of Lines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Slope of a Line</h3>
            <p className="mb-4">
              The slope of a line passing through points (x₁, y₁) and (x₂, y₂) is given by:
            </p>
            <div className="bg-muted p-4 rounded-lg text-center">
              <strong>m = (y₂ - y₁) / (x₂ - x₁)</strong>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Forms of Line Equations</h3>
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">1. Slope-Intercept Form</h4>
                <div className="bg-muted p-3 rounded text-center mb-2">
                  <strong>y = mx + b</strong>
                </div>
                <p className="text-sm">Where m is the slope and b is the y-intercept</p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">2. Point-Slope Form</h4>
                <div className="bg-muted p-3 rounded text-center mb-2">
                  <strong>y - y₁ = m(x - x₁)</strong>
                </div>
                <p className="text-sm">Where m is the slope and (x₁, y₁) is a point on the line</p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">3. Standard Form</h4>
                <div className="bg-muted p-3 rounded text-center mb-2">
                  <strong>Ax + By + C = 0</strong>
                </div>
                <p className="text-sm">Where A, B, and C are constants (A and B not both zero)</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Parallel and Perpendicular Lines</h3>
            <div className="grid gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Parallel Lines</h4>
                <p>Two lines are parallel if and only if they have the same slope or are both vertical.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Perpendicular Lines</h4>
                <p>Two lines are perpendicular if and only if the product of their slopes is -1, or one is vertical and the other is horizontal.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Circles */}
      <Card>
        <CardHeader>
          <CardTitle>Section 4: Circles in Coordinate Geometry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Equation of a Circle</h3>
            <p className="mb-4">
              The standard form of a circle with center (h, k) and radius r is:
            </p>
            <div className="bg-muted p-4 rounded-lg text-center">
              <strong>(x - h)² + (y - k)² = r²</strong>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">General Form</h3>
            <p className="mb-4">
              The general form of a circle equation is:
            </p>
            <div className="bg-muted p-4 rounded-lg text-center">
              <strong>x² + y² + Dx + Ey + F = 0</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Problems */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 1:</h4>
              <p>Plot the points A(3, 4), B(-2, 1), and C(-1, -3) on a coordinate plane. Identify the quadrant in which each point lies.</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 2:</h4>
              <p>Find the equation of the line passing through points (2, 3) and (4, 7). Express your answer in slope-intercept form.</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 3:</h4>
              <p>Determine if the lines y = 2x + 1 and y = -½x + 3 are parallel, perpendicular, or neither.</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 4:</h4>
              <p>Find the distance between points A(1, 2) and B(4, 6), and find their midpoint.</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 5:</h4>
              <p>Write the equation of a circle with center (2, -3) and radius 5.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};