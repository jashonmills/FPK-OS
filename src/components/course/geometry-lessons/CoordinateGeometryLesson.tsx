import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Calculator, MapPin, TrendingUp, Grid, BookOpen, Target } from 'lucide-react';

export const CoordinateGeometryLesson: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <MapPin className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Module 6: Coordinate Geometry</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Welcome to Module 6 of our Geometry course! In this module, we will explore coordinate geometry, which combines algebra and geometry to solve problems using a coordinate system. You'll learn to represent geometric shapes algebraically and use algebraic techniques to analyze geometric properties.
        </p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/coordinate_geometry.jpg" 
          alt="Coordinate plane showing points, lines, and shapes with grid lines and mathematical plotting"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Teaching Moment */}
      <Alert>
        <BookOpen className="h-4 w-4" />
        <AlertDescription>
          <strong>Teaching Moment:</strong> Coordinate geometry, also known as analytic geometry, represents one of the most powerful unions in mathematics—the marriage of algebra and geometry. Before René Descartes and Pierre de Fermat developed coordinate systems in the 17th century, geometry and algebra were largely separate disciplines. This revolutionary approach allowed mathematicians to solve geometric problems using algebraic methods and vice versa. Today, coordinate geometry is essential in fields ranging from physics and engineering to computer graphics and GPS navigation.
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
            <li>Understand and apply the coordinate system in two dimensions</li>
            <li>Plot points and identify coordinates in all four quadrants</li>
            <li>Calculate the distance between points and find midpoints of line segments</li>
            <li>Determine the equation of a line in various forms</li>
            <li>Analyze the properties of lines, including slope and parallel/perpendicular relationships</li>
            <li>Find the equations of circles and understand conic sections</li>
            <li>Solve geometric problems using algebraic techniques</li>
            <li>Apply coordinate geometry to real-world situations</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 1: The Coordinate System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Grid className="h-5 w-5 mr-2" />
            Section 1: The Coordinate System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">The Cartesian Coordinate System</h3>
            <p className="mb-4">
              The <strong>Cartesian coordinate system</strong> consists of two perpendicular number lines (axes) that intersect at a point called the <strong>origin</strong>. The horizontal axis is called the <strong>x-axis</strong>, and the vertical axis is called the <strong>y-axis</strong>. The position of any point in the plane can be described by an ordered pair of numbers (x, y), called <strong>coordinates</strong>.
            </p>
            
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Historical Note:</strong> The Cartesian coordinate system is named after René Descartes, who formalized this approach in his 1637 work "La Géométrie." The beauty of this system lies in its simplicity and power—by assigning coordinates to points, we create a one-to-one correspondence between geometric points and ordered pairs of numbers, allowing us to use algebraic methods to solve geometric problems.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Components of the Coordinate System</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-lg p-4">
                <h5 className="font-semibold mb-2">Key Elements</h5>
                <ul className="space-y-1 text-sm list-disc list-inside">
                  <li><strong>Origin (0, 0):</strong> The intersection of the x and y axes</li>
                  <li><strong>X-axis:</strong> The horizontal number line</li>
                  <li><strong>Y-axis:</strong> The vertical number line</li>
                  <li><strong>Ordered pair (x, y):</strong> Coordinates of a point</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h5 className="font-semibold mb-2">Plotting Points</h5>
                <ol className="space-y-1 text-sm list-decimal list-inside">
                  <li>Start at the origin (0, 0)</li>
                  <li>Move x units horizontally (right if positive, left if negative)</li>
                  <li>Move y units vertically (up if positive, down if negative)</li>
                  <li>Mark the point at your final position</li>
                </ol>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">The Four Quadrants</h4>
            <p className="mb-3">The coordinate axes divide the plane into four regions called quadrants:</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded border border-green-200">
                <h5 className="font-semibold text-green-700">Quadrant I</h5>
                <p className="text-sm">x &gt; 0, y &gt; 0</p>
                <p className="text-xs text-muted-foreground">(upper right)</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded border border-blue-200">
                <h5 className="font-semibold text-blue-700">Quadrant II</h5>
                <p className="text-sm">x &lt; 0, y &gt; 0</p>
                <p className="text-xs text-muted-foreground">(upper left)</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded border border-red-200">
                <h5 className="font-semibold text-red-700">Quadrant III</h5>
                <p className="text-sm">x &lt; 0, y &lt; 0</p>
                <p className="text-xs text-muted-foreground">(lower left)</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded border border-purple-200">
                <h5 className="font-semibold text-purple-700">Quadrant IV</h5>
                <p className="text-sm">x &gt; 0, y &lt; 0</p>
                <p className="text-xs text-muted-foreground">(lower right)</p>
              </div>
            </div>
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
            <h3 className="text-xl font-semibold mb-3">The Distance Formula</h3>
            <p className="mb-4">
              The distance between two points (x₁, y₁) and (x₂, y₂) can be found using the distance formula, which is derived from the Pythagorean theorem:
            </p>
            <div className="bg-muted p-6 rounded-lg text-center border-2 border-blue-200">
              <p className="text-xl font-bold mb-2">d = √[(x₂ - x₁)² + (y₂ - y₁)²]</p>
              <p className="text-sm text-muted-foreground">where d is the distance between the two points</p>
            </div>
            
            <Alert className="mt-4">
              <Calculator className="h-4 w-4" />
              <AlertDescription>
                <strong>Why This Works:</strong> The distance formula is a direct application of the Pythagorean theorem. If we draw a right triangle with the two points as opposite corners, the horizontal leg has length |x₂ - x₁|, the vertical leg has length |y₂ - y₁|, and the distance between the points is the length of the hypotenuse.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">The Midpoint Formula</h3>
            <p className="mb-4">
              The midpoint of a line segment with endpoints (x₁, y₁) and (x₂, y₂) is the point that divides the segment into two equal parts:
            </p>
            <div className="bg-muted p-6 rounded-lg text-center border-2 border-green-200">
              <p className="text-xl font-bold mb-2">M = ((x₁ + x₂)/2, (y₁ + y₂)/2)</p>
              <p className="text-sm text-muted-foreground">The midpoint is the average of the coordinates</p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 className="text-lg font-semibold mb-3">Worked Example</h4>
            <p className="mb-3"><strong>Problem:</strong> Find the distance between points P(2, -3) and Q(-4, 5). Then find the midpoint of line segment PQ.</p>
            
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Step 1: Calculate the distance</p>
                <div className="ml-4 space-y-1 text-sm">
                  <p>d = √[(-4 - 2)² + (5 - (-3))²]</p>
                  <p>d = √[(-6)² + (8)²]</p>
                  <p>d = √[36 + 64] = √100 = 10 units</p>
                </div>
              </div>
              
              <div>
                <p className="font-semibold">Step 2: Find the midpoint</p>
                <div className="ml-4 space-y-1 text-sm">
                  <p>M = ((2 + (-4))/2, (-3 + 5)/2)</p>
                  <p>M = ((-2)/2, (2)/2) = (-1, 1)</p>
                </div>
              </div>
              
              <p className="font-semibold text-green-700">Answer: Distance = 10 units, Midpoint = (-1, 1)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Lines in Coordinate Geometry */}
      <Card>
        <CardHeader>
          <CardTitle>Section 3: Lines in Coordinate Geometry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Slope of a Line</h3>
            <p className="mb-4">
              The <strong>slope</strong> of a line measures how steeply it rises or falls as we move from left to right. For a line passing through points (x₁, y₁) and (x₂, y₂), the slope is:
            </p>
            <div className="bg-muted p-4 rounded-lg text-center border-2 border-purple-200">
              <p className="text-lg font-bold mb-2">m = (y₂ - y₁) / (x₂ - x₁) = Δy / Δx</p>
              <p className="text-sm text-muted-foreground">"rise over run"</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="border rounded-lg p-3">
                <h4 className="font-semibold mb-2">Types of Slope</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Positive slope:</strong> Line rises (goes up from left to right)</li>
                  <li>• <strong>Negative slope:</strong> Line falls (goes down from left to right)</li>
                  <li>• <strong>Zero slope:</strong> Horizontal line</li>
                  <li>• <strong>Undefined slope:</strong> Vertical line</li>
                </ul>
              </div>
              <div className="border rounded-lg p-3">
                <h4 className="font-semibold mb-2">Slope Relationships</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Parallel lines:</strong> Same slope (m₁ = m₂)</li>
                  <li>• <strong>Perpendicular lines:</strong> Slopes are negative reciprocals (m₁ × m₂ = -1)</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Equations of Lines</h3>
            <div className="grid gap-6">
              <div className="border rounded-lg p-4 border-blue-200 bg-blue-50">
                <h4 className="font-semibold text-blue-700 mb-2">1. Slope-Intercept Form</h4>
                <div className="bg-white p-3 rounded text-center mb-2 font-mono text-lg">
                  <strong>y = mx + b</strong>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• <strong>m</strong> is the slope of the line</li>
                  <li>• <strong>b</strong> is the y-intercept (where line crosses y-axis)</li>
                  <li>• Most useful for graphing and finding intercepts</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 border-green-200 bg-green-50">
                <h4 className="font-semibold text-green-700 mb-2">2. Point-Slope Form</h4>
                <div className="bg-white p-3 rounded text-center mb-2 font-mono text-lg">
                  <strong>y - y₁ = m(x - x₁)</strong>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• <strong>m</strong> is the slope</li>
                  <li>• <strong>(x₁, y₁)</strong> is a known point on the line</li>
                  <li>• Best when you know a point and the slope</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 border-red-200 bg-red-50">
                <h4 className="font-semibold text-red-700 mb-2">3. Standard Form</h4>
                <div className="bg-white p-3 rounded text-center mb-2 font-mono text-lg">
                  <strong>Ax + By = C</strong>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• <strong>A</strong>, <strong>B</strong>, and <strong>C</strong> are constants (A and B not both zero)</li>
                  <li>• Useful for finding x and y intercepts quickly</li>
                  <li>• Often preferred for linear systems</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h4 className="text-lg font-semibold mb-3">Example: Finding the Equation of a Line</h4>
            <p className="mb-3"><strong>Problem:</strong> Find the equation of the line passing through points (1, 3) and (4, 9).</p>
            
            <div className="space-y-3">
              <div>
                <p className="font-semibold">Step 1: Find the slope</p>
                <p className="text-sm ml-4">m = (9 - 3)/(4 - 1) = 6/3 = 2</p>
              </div>
              
              <div>
                <p className="font-semibold">Step 2: Use point-slope form</p>
                <p className="text-sm ml-4">y - 3 = 2(x - 1)</p>
                <p className="text-sm ml-4">y - 3 = 2x - 2</p>
                <p className="text-sm ml-4">y = 2x + 1</p>
              </div>
              
              <p className="font-semibold text-green-700">Answer: y = 2x + 1</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Circles in Coordinate Geometry */}
      <Card>
        <CardHeader>
          <CardTitle>Section 4: Circles in Coordinate Geometry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Equation of a Circle</h3>
            <p className="mb-4">
              A circle is the set of all points that are a fixed distance (radius) from a center point. The standard form equation of a circle with center (h, k) and radius r is:
            </p>
            <div className="bg-muted p-6 rounded-lg text-center border-2 border-indigo-200">
              <p className="text-xl font-bold mb-2">(x - h)² + (y - k)² = r²</p>
              <p className="text-sm text-muted-foreground">Standard form of a circle</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Key Components</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-lg p-4">
                <h5 className="font-semibold mb-2">Reading the Equation</h5>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>(h, k)</strong> is the center of the circle</li>
                  <li>• <strong>r</strong> is the radius of the circle</li>
                  <li>• If center is at origin: x² + y² = r²</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h5 className="font-semibold mb-2">General Form</h5>
                <p className="text-sm mb-2">x² + y² + Dx + Ey + F = 0</p>
                <p className="text-xs text-muted-foreground">Can be converted to standard form by completing the square</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h4 className="text-lg font-semibold mb-3">Circle Example</h4>
            <p className="mb-3"><strong>Problem:</strong> Write the equation of a circle with center (2, -3) and radius 5.</p>
            
            <div className="space-y-2">
              <p className="font-semibold">Solution:</p>
              <p className="text-sm ml-4">Center: (h, k) = (2, -3), so h = 2 and k = -3</p>
              <p className="text-sm ml-4">Radius: r = 5, so r² = 25</p>
              <p className="text-sm ml-4">Substitute into standard form: (x - 2)² + (y - (-3))² = 25</p>
              <p className="font-semibold text-purple-700 ml-4">Answer: (x - 2)² + (y + 3)² = 25</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Applications and Problem Solving */}
      <Card>
        <CardHeader>
          <CardTitle>Section 5: Applications and Problem Solving</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Real-World Applications</h3>
            <p className="mb-4">Coordinate geometry has numerous practical applications:</p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-lg p-4 border-green-200 bg-green-50">
                <h4 className="font-semibold text-green-700 mb-2">Navigation and GPS</h4>
                <ul className="text-sm space-y-1">
                  <li>• Latitude and longitude coordinates</li>
                  <li>• Distance calculations between locations</li>
                  <li>• Route optimization</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4 border-blue-200 bg-blue-50">
                <h4 className="font-semibold text-blue-700 mb-2">Computer Graphics</h4>
                <ul className="text-sm space-y-1">
                  <li>• Positioning objects on screen</li>
                  <li>• Animation paths</li>
                  <li>• 3D modeling and rendering</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4 border-red-200 bg-red-50">
                <h4 className="font-semibold text-red-700 mb-2">Architecture and Engineering</h4>
                <ul className="text-sm space-y-1">
                  <li>• Building design and blueprints</li>
                  <li>• Structural analysis</li>
                  <li>• Surveying and mapping</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4 border-purple-200 bg-purple-50">
                <h4 className="font-semibold text-purple-700 mb-2">Data Analysis</h4>
                <ul className="text-sm space-y-1">
                  <li>• Scatter plots and trend lines</li>
                  <li>• Statistical modeling</li>
                  <li>• Scientific research</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Problem-Solving Strategy</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>Identify what you're looking for:</strong> Distance, midpoint, slope, equation, etc.</li>
                <li><strong>Organize given information:</strong> List coordinates, known values, and constraints</li>
                <li><strong>Choose appropriate formulas:</strong> Select the right tool for the job</li>
                <li><strong>Substitute carefully:</strong> Pay attention to signs and order of coordinates</li>
                <li><strong>Simplify and solve:</strong> Use algebra to find the answer</li>
                <li><strong>Check your answer:</strong> Does it make sense geometrically?</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <h4 className="font-semibold mb-2">Problem 1: Plotting Points</h4>
              <p className="text-sm mb-2">Plot the points A(3, 4), B(-2, 1), and C(-1, -3) on a coordinate plane. Identify the quadrant in which each point lies.</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Solution:</strong> A(3, 4) is in Quadrant I (both coordinates positive)</p>
                <p>B(-2, 1) is in Quadrant II (x negative, y positive)</p>
                <p>C(-1, -3) is in Quadrant III (both coordinates negative)</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 2: Distance and Midpoint</h4>
              <p className="text-sm mb-2">Find the distance between points A(1, 2) and B(4, 6), and find their midpoint.</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Distance:</strong> d = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5</p>
                <p><strong>Midpoint:</strong> M = ((1+4)/2, (2+6)/2) = (2.5, 4)</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 3: Line Equations</h4>
              <p className="text-sm mb-2">Find the equation of the line passing through points (2, 3) and (4, 7). Express your answer in slope-intercept form.</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Slope:</strong> m = (7-3)/(4-2) = 4/2 = 2</p>
                <p><strong>Using point-slope form:</strong> y - 3 = 2(x - 2)</p>
                <p><strong>Slope-intercept form:</strong> y = 2x - 1</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 4: Parallel and Perpendicular Lines</h4>
              <p className="text-sm mb-2">Determine if the lines y = 2x + 1 and y = -½x + 3 are parallel, perpendicular, or neither.</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Slopes:</strong> m₁ = 2, m₂ = -½</p>
                <p><strong>Check:</strong> m₁ × m₂ = 2 × (-½) = -1</p>
                <p><strong>Answer:</strong> Perpendicular (slopes multiply to -1)</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 5: Circle Equation</h4>
              <p className="text-sm mb-2">Write the equation of a circle with center (2, -3) and radius 5.</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Standard form:</strong> (x - h)² + (y - k)² = r²</p>
                <p><strong>Substitute:</strong> (x - 2)² + (y - (-3))² = 5²</p>
                <p><strong>Answer:</strong> (x - 2)² + (y + 3)² = 25</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Summary */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-800">Module 6 Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            In this module, you've learned to work with the coordinate system to solve geometric problems algebraically. You've mastered plotting points, calculating distances and midpoints, finding equations of lines in various forms, and working with circles. You've also seen how coordinate geometry bridges the gap between algebra and geometry, enabling powerful problem-solving techniques. These skills provide the foundation for advanced topics in mathematics, including calculus, and have numerous applications in science, technology, and everyday life. In the next module, you'll explore how coordinate geometry applies to calculating areas and perimeters of complex shapes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};