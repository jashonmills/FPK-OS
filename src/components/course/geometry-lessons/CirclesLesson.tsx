import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Circle, Target, Calculator, BookOpen, Compass } from 'lucide-react';

export const CirclesLesson: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="mb-8">
          <img 
            src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/circle_properties.jpg" 
            alt="Circle with labeled components including radius, diameter, chord, arc, and tangent lines"
            className="w-full max-w-2xl mx-auto object-contain rounded-lg shadow-lg"
          />
        </div>

        <h1 className="text-4xl font-bold mb-4">Module 4: Circles and Circle Properties</h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Explore circles, one of the most fundamental and important shapes in geometry. Study their properties, 
          parts, and relationships with other geometric figures.
        </p>
      </div>

      {/* Introduction */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800 flex items-center gap-2">
            <Circle className="h-6 w-6" />
            Introduction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-300 bg-blue-50 mb-4">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Teaching Moment:</strong> Circles are perhaps the most perfect geometric shape, with every point on the circumference equidistant from the center. This perfect symmetry has fascinated mathematicians, artists, and philosophers for millennia. From the wheels on vehicles to the orbits of planets, circles and their three-dimensional counterparts, spheres, are fundamental to our understanding of the universe. As you learn about circles, consider how their unique properties make them ideal for countless applications in engineering, architecture, art, and nature.
            </AlertDescription>
          </Alert>

          <h3 className="text-xl font-semibold mb-4">Learning Objectives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Understand the basic properties of circles</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Identify and describe the parts of a circle</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Calculate the circumference and area of a circle</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Apply theorems related to circles</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Solve problems involving circles and their properties</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Recognize applications in real-world contexts</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Circle Basics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Section 1: Circle Basics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What is a Circle?</h3>
              <Alert className="mb-4">
                <Circle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Definition:</strong> A circle is the set of all points in a plane that are at a fixed distance (called the radius) from a fixed point (called the center).
                </AlertDescription>
              </Alert>

              <Alert className="border-blue-300 bg-blue-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> This definition highlights the fundamental property of a circle: every point on the circle is exactly the same distance from the center. This property gives circles their perfect symmetry and makes them unique among geometric shapes. If you were to rotate a circle around its center by any angle, it would look exactly the same—this is called rotational symmetry of infinite order.
                </AlertDescription>
              </Alert>
            </div>

            <h3 className="text-xl font-semibold mb-4">Parts of a Circle</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">The fixed point from which all points on the circle are equidistant.</p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Radius</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">The distance from the center to any point on the circle.</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Diameter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">A line segment that passes through the center and has its endpoints on the circle. The diameter is twice the radius.</p>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Chord</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">A line segment with both endpoints on the circle.</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-700">Arc</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">A portion of the circumference of a circle.</p>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-teal-700">Sector</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">A region bounded by two radii and an arc.</p>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-pink-700">Segment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">A region bounded by a chord and an arc.</p>
                </CardContent>
              </Card>

              <Card className="border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-700">Tangent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">A line that touches the circle at exactly one point.</p>
                </CardContent>
              </Card>

              <Card className="border-cyan-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-cyan-700">Secant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">A line that intersects the circle at exactly two points.</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Problem-Solving Approach: Identifying Parts of a Circle
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>Visualize or draw the circle:</strong> Create a clear diagram showing the center and the relevant parts.</li>
                <li><strong>Label key points and measurements:</strong> Mark the center, radii, chords, angles, etc.</li>
                <li><strong>Identify relationships:</strong> Determine how the various parts relate to each other.</li>
                <li><strong>Apply definitions and properties:</strong> Use the specific properties of each part to solve the problem.</li>
              </ol>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Example Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4"><strong>Problem:</strong> In a circle with center O, points A and B lie on the circle. If the length of chord AB is equal to the radius of the circle, what is the measure of the central angle AOB?</p>
                
                <div className="bg-white rounded p-4 border">
                  <p className="font-semibold mb-2">Solution:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Draw a circle with center O and points A and B on the circumference.</li>
                    <li>Draw radii OA and OB, and chord AB.</li>
                    <li>Since OA and OB are radii, they have equal length r.</li>
                    <li>We're told that chord AB also has length r.</li>
                    <li>Triangle AOB is therefore equilateral (all sides equal to r).</li>
                    <li>In an equilateral triangle, all angles are equal to 60°.</li>
                    <li>Therefore, the central angle AOB is 60°.</li>
                  </ol>
                </div>

                <Alert className="mt-4 border-blue-300 bg-blue-50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Teaching Moment:</strong> This problem illustrates an important relationship: when a chord has the same length as the radius, it subtends a 60° angle at the center. This is because the triangle formed by the chord and the two radii is equilateral. This relationship is useful in various geometric constructions and proofs.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Circle Measurements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Calculator className="h-6 w-6 text-green-600" />
            Section 2: Circle Measurements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Circumference</h3>
              <p className="mb-4">The circumference of a circle is the distance around the circle. It is given by:</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-lg font-mono text-center mb-2"><strong>Circumference = 2πr = πd</strong></p>
                <p className="text-sm text-center">where r is the radius, d is the diameter, and π (pi) is approximately 3.14159.</p>
              </div>

              <Alert className="border-blue-300 bg-blue-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> The ratio of a circle's circumference to its diameter is always the same value, which we call π (pi). This remarkable constant appears throughout mathematics and physics. It's an irrational number, meaning its decimal representation never ends or repeats. Throughout history, mathematicians have developed increasingly precise approximations of π, from the ancient Egyptians' 256/81 (≈ 3.16) to modern computer calculations with trillions of digits.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Area</h3>
              <p className="mb-4">The area of a circle is given by:</p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-lg font-mono text-center mb-2"><strong>Area = πr²</strong></p>
                <p className="text-sm text-center">where r is the radius.</p>
              </div>

              <Alert className="border-green-300 bg-green-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> The area formula can be intuitively understood by thinking of a circle as composed of many thin concentric rings. If you were to cut these rings and lay them out, they would approximate a triangle with base 2πr (the circumference) and height r. The area of this triangle is (1/2) × 2πr × r = πr², which is the area of the circle. This visualization helps explain why the area depends on the square of the radius.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Arc Length</h3>
              <p className="mb-4">The length of an arc is a portion of the circumference. If the arc subtends a central angle of θ degrees, then:</p>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <p className="text-lg font-mono text-center mb-2"><strong>Arc Length = (θ/360) × 2πr = (θ/360) × Circumference</strong></p>
              </div>

              <Alert className="border-purple-300 bg-purple-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> This formula reflects the proportional relationship between angles and arc lengths. If an arc subtends 1/4 of the full circle (90°), its length is 1/4 of the circumference. This relationship is crucial in applications like gear design, where the arc length determines how far a gear tooth travels during rotation.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Sector Area</h3>
              <p className="mb-4">The area of a sector is a portion of the circle's area. If the sector subtends a central angle of θ degrees, then:</p>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-lg font-mono text-center mb-2"><strong>Sector Area = (θ/360) × πr² = (θ/360) × Circle Area</strong></p>
              </div>

              <Alert className="border-orange-300 bg-orange-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> Similar to arc length, the area of a sector is proportional to its central angle. This makes intuitive sense: if a sector represents 1/3 of the full circle (120°), its area is 1/3 of the circle's total area. This relationship is used in applications ranging from pie charts in statistics to designing circular architectural features.
                </AlertDescription>
              </Alert>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Problem-Solving Approach: Calculating Circle Measurements
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>Identify what is given and what is asked:</strong> Determine which measurements you know and which you need to find.</li>
                <li><strong>Select the appropriate formula:</strong> Choose the formula that relates the known and unknown quantities.</li>
                <li><strong>Substitute the values:</strong> Insert the known values into the formula.</li>
                <li><strong>Calculate and verify:</strong> Perform the calculations and check if the answer makes sense.</li>
              </ol>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Example Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4"><strong>Problem:</strong> A circular garden has a radius of 5 meters. A path runs from the center to the edge and then a quarter of the way around the circumference. What is the total length of the path?</p>
                
                <div className="bg-white rounded p-4 border">
                  <p className="font-semibold mb-2">Solution:</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Step 1:</strong> Identify what is given and what is asked.</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Radius of the circle: r = 5 meters</li>
                      <li>Path consists of a radius and a quarter-circle arc</li>
                      <li>Need to find the total length of the path</li>
                    </ul>
                    
                    <p><strong>Step 2:</strong> Select the appropriate formulas.</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Length of radius = r = 5 meters</li>
                      <li>Arc length = (θ/360) × 2πr, where θ = 90° (a quarter of the circle)</li>
                    </ul>
                    
                    <p><strong>Step 3:</strong> Substitute the values.</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Length of radius = 5 meters</li>
                      <li>Arc length = (90/360) × 2π × 5 = (1/4) × 2π × 5 = (π × 5) / 2 = 5π / 2 meters</li>
                    </ul>
                    
                    <p><strong>Step 4:</strong> Calculate and verify.</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Total path length = radius + arc length = 5 + 5π / 2 meters</li>
                      <li>Total path length = 5 + 5π / 2 ≈ 5 + 7.85 ≈ 12.85 meters</li>
                    </ul>
                  </div>
                </div>

                <Alert className="mt-4 border-blue-300 bg-blue-50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Teaching Moment:</strong> This problem combines two different parts of a circle: a radius (straight line) and an arc (curved line). Notice how we express the exact answer in terms of π rather than using an approximation. In mathematical contexts, it's often preferable to keep π in symbolic form for precision, while in practical applications, a decimal approximation might be more useful.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Circle Theorems */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Compass className="h-6 w-6 text-purple-600" />
            Section 3: Circle Theorems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="mb-8">
              <img 
                src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/circle_theorems1.jpg" 
                alt="Circle theorems showing inscribed angles, central angles, and tangent properties"
                className="w-full max-w-3xl mx-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Angle Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-700">1. Inscribed Angle Theorem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">An inscribed angle is half the central angle that subtends the same arc.</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-700">2. Angles in the Same Segment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Angles in the same segment of a circle are equal.</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-700">3. Angle in a Semicircle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">An angle inscribed in a semicircle is a right angle.</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-700">4. Cyclic Quadrilateral</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">The opposite angles of a cyclic quadrilateral are supplementary (sum to 180 degrees).</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Chord Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="border-red-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-700">1. Equal Chords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Equal chords are equidistant from the center.</p>
                  </CardContent>
                </Card>

                <Card className="border-teal-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-teal-700">2. Perpendicular from Center</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">A perpendicular from the center of a circle to a chord bisects the chord.</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-700">3. Chord-Chord Power Theorem</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">If two chords AB and CD intersect at point P, then PA × PB = PC × PD.</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Tangent Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="border-pink-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-pink-700">1. Perpendicular Tangent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">A tangent to a circle is perpendicular to the radius at the point of tangency.</p>
                  </CardContent>
                </Card>

                <Card className="border-lime-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-lime-700">2. Equal Tangents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Tangents to a circle from an external point are equal in length.</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-amber-700">3. Tangent-Secant Power Theorem</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">If a tangent PT and a secant PA are drawn to a circle from an external point P, and the secant cuts the circle at points A and B, then PT² = PA × PB.</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Problem-Solving Approach: Applying Circle Theorems
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>Identify the relevant theorem:</strong> Determine which circle theorem applies to the given situation.</li>
                <li><strong>Draw a clear diagram:</strong> Illustrate the problem, labeling all relevant points and measurements.</li>
                <li><strong>Apply the theorem:</strong> Use the specific relationships established by the theorem.</li>
                <li><strong>Solve for the unknown:</strong> Use algebraic or geometric reasoning to find the required value.</li>
                <li><strong>Verify your answer:</strong> Check that your solution satisfies all conditions of the problem.</li>
              </ol>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Example Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4"><strong>Problem:</strong> In a circle, chord AB has length 8 cm and is 3 cm away from the center. Find the radius of the circle.</p>
                
                <div className="bg-white rounded p-4 border">
                  <p className="font-semibold mb-2">Solution:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Draw a circle with center O and chord AB.</li>
                    <li>Draw the perpendicular from O to AB, meeting AB at point M.</li>
                    <li>Let the radius be r cm. The distance from O to AB is 3 cm, so OM = 3 cm.</li>
                    <li>Since the perpendicular from the center to a chord bisects the chord, AM = MB = 4 cm.</li>
                    <li>Apply the Pythagorean theorem in triangle OAM:<br/>
                        OA² = OM² + AM²<br/>
                        r² = 3² + 4²<br/>
                        r² = 9 + 16<br/>
                        r² = 25<br/>
                        r = 5</li>
                  </ol>
                  <p className="text-sm mt-2"><strong>Therefore, the radius of the circle is 5 cm.</strong></p>
                </div>

                <Alert className="mt-4 border-blue-300 bg-blue-50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Teaching Moment:</strong> This problem illustrates how the perpendicular bisector property of chords can be combined with the Pythagorean theorem to find unknown measurements. The perpendicular from the center to a chord creates a right triangle, which allows us to use the Pythagorean relationship. This approach is common in problems involving chords and radii.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Circles in Coordinate Geometry */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            Section 4: Circles in Coordinate Geometry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Equation of a Circle</h3>
              <p className="mb-4">The standard form of the equation of a circle with center (h, k) and radius r is:</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-lg font-mono text-center mb-2"><strong>(x - h)² + (y - k)² = r²</strong></p>
                <p className="text-sm text-center">If the center is at the origin (0, 0), the equation simplifies to:</p>
                <p className="text-lg font-mono text-center"><strong>x² + y² = r²</strong></p>
              </div>

              <Alert className="border-blue-300 bg-blue-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> This equation is derived directly from the definition of a circle: the set of points at a fixed distance (the radius) from a fixed point (the center). The left side of the equation represents the square of the distance between any point (x, y) on the circle and the center (h, k), using the distance formula. This equation allows us to analyze circles using algebraic methods, bridging geometry and algebra.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">General Form of the Equation of a Circle</h3>
              <p className="mb-4">The general form of the equation of a circle is:</p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-lg font-mono text-center mb-2"><strong>x² + y² + 2gx + 2fy + c = 0</strong></p>
                <p className="text-sm text-center">where the center is at (-g, -f) and the radius is √(g² + f² - c).</p>
              </div>

              <Alert className="border-green-300 bg-green-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> This form is obtained by expanding the standard form and collecting like terms. To convert from general to standard form, you complete the square for both x and y terms. This process of "completing the square" is a fundamental algebraic technique that allows us to identify the center and radius from the general equation. The ability to move between these forms is crucial for solving problems involving circles in coordinate geometry.
                </AlertDescription>
              </Alert>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Example Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4"><strong>Problem:</strong> Find the center and radius of the circle with equation x² + y² - 6x + 4y - 12 = 0.</p>
                
                <div className="bg-white rounded p-4 border">
                  <p className="font-semibold mb-2">Solution:</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Step 1:</strong> Rearrange to group x and y terms.</p>
                    <p className="ml-4 font-mono">x² - 6x + y² + 4y - 12 = 0</p>
                    
                    <p><strong>Step 2:</strong> Complete the square for x terms.</p>
                    <p className="ml-4 font-mono">(x² - 6x + 9) + y² + 4y - 12 - 9 = 0</p>
                    <p className="ml-4 font-mono">(x - 3)² + y² + 4y - 21 = 0</p>
                    
                    <p><strong>Step 3:</strong> Complete the square for y terms.</p>
                    <p className="ml-4 font-mono">(x - 3)² + (y² + 4y + 4) - 21 - 4 = 0</p>
                    <p className="ml-4 font-mono">(x - 3)² + (y + 2)² - 25 = 0</p>
                    <p className="ml-4 font-mono">(x - 3)² + (y + 2)² = 25</p>
                    
                    <p><strong>Step 4:</strong> Identify the center and radius from the standard form.</p>
                    <p className="ml-4">Center: (3, -2)</p>
                    <p className="ml-4">Radius: 5</p>
                  </div>
                </div>

                <Alert className="mt-4 border-blue-300 bg-blue-50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Teaching Moment:</strong> This problem demonstrates the technique of completing the square to convert a circle equation from general to standard form. This is a powerful method in coordinate geometry that reveals the geometric properties (center and radius) from the algebraic representation. The ability to move fluently between algebraic and geometric interpretations is a hallmark of mathematical thinking.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Inscribed and Circumscribed Circles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="h-6 w-6 text-red-600" />
            Section 5: Circles and Other Shapes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="mb-8">
              <img 
                src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/angles_in_circle.png" 
                alt="Circle with inscribed and circumscribed triangles showing geometric relationships"
                className="w-full max-w-3xl mx-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Inscribed and Circumscribed Circles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-700">1. Inscribed Circle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">A circle that fits inside a polygon and touches each side of the polygon at exactly one point.</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-700">2. Circumscribed Circle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">A circle that passes through all the vertices of a polygon.</p>
                  </CardContent>
                </Card>
              </div>

              <h4 className="text-lg font-semibold mb-3">Special Cases</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-700">Inscribed Circle of a Triangle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">The center of the inscribed circle of a triangle is the incenter, which is the point of intersection of the angle bisectors.</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-700">Circumscribed Circle of a Triangle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">The center of the circumscribed circle of a triangle is the circumcenter, which is the point of intersection of the perpendicular bisectors of the sides.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Example Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4"><strong>Problem:</strong> A triangle has sides of lengths 5 cm, 12 cm, and 13 cm. Find the radius of its inscribed circle.</p>
                
                <div className="bg-white rounded p-4 border">
                  <p className="font-semibold mb-2">Solution:</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Step 1:</strong> Identify the type of triangle.</p>
                    <ul className="list-disc list-inside ml-4">
                      <li>Using the Pythagorean theorem: 5² + 12² = 13² (25 + 144 = 169)</li>
                      <li>This is a right triangle.</li>
                    </ul>
                    
                    <p><strong>Step 2:</strong> Calculate the semi-perimeter s.</p>
                    <p className="ml-4 font-mono">s = (a + b + c) / 2 = (5 + 12 + 13) / 2 = 30 / 2 = 15 cm</p>
                    
                    <p><strong>Step 3:</strong> Calculate the area of the triangle.</p>
                    <p className="ml-4 font-mono">Area = (1/2) × base × height = (1/2) × 5 × 12 = 30 cm²</p>
                    
                    <p><strong>Step 4:</strong> Calculate the radius of the inscribed circle using the formula:</p>
                    <p className="ml-4 font-mono">r = Area / s = 30 / 15 = 2 cm</p>
                  </div>
                  <p className="text-sm mt-2"><strong>Therefore, the radius of the inscribed circle is 2 cm.</strong></p>
                </div>

                <Alert className="mt-4 border-blue-300 bg-blue-50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Teaching Moment:</strong> This problem illustrates the relationship between the area of a triangle, its semi-perimeter, and the radius of its inscribed circle: r = Area / s. This elegant formula works for any triangle and connects the concepts of area, perimeter, and incircle in a simple way. It's derived from the fact that the incircle divides the triangle into three smaller triangles, each with base equal to one side of the original triangle and height equal to the inradius.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
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
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Find the circumference and area:</h4>
              <p className="text-sm">Find the circumference and area of a circle with radius 5 cm.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Calculate arc length:</h4>
              <p className="text-sm">Calculate the length of an arc that subtends a central angle of 60 degrees in a circle with radius 10 cm.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Find sector area:</h4>
              <p className="text-sm">Find the area of a sector with a central angle of 45 degrees in a circle with radius 8 cm.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Circle equation:</h4>
              <p className="text-sm">Determine the equation of a circle with center (3, 4) and radius 5.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">5. Chord intersection:</h4>
              <p className="text-sm">Two chords AB and CD of a circle intersect at point P. If PA = 3 cm, PB = 4 cm, and PC = 2 cm, find PD.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            In this module, we have explored circles and their properties. We have learned about the parts of a circle, 
            how to calculate the circumference and area of a circle, and various theorems related to circles. We have also 
            studied circles in coordinate geometry and the relationships between circles and other shapes.
          </p>

          <Alert className="border-blue-300 bg-blue-50 mb-4">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Teaching Moment:</strong> Circles are not just mathematical abstractions—they are fundamental to our understanding of the physical world. From the orbits of planets to the ripples in a pond, circular patterns appear throughout nature. The properties of circles that we've studied in this module provide the mathematical foundation for understanding these natural phenomena, as well as for designing everything from wheels to satellite dishes. The elegance and symmetry of circles continue to inspire mathematicians, scientists, engineers, and artists alike.
            </AlertDescription>
          </Alert>

          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Next Steps</h4>
            <p className="text-sm mb-2">
              In the next module, we will explore transformations in geometry. We will learn about translations, rotations, 
              reflections, and dilations, and how these transformations affect geometric figures.
            </p>
            
            <Alert className="border-blue-300 bg-blue-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Teaching Moment:</strong> As we transition from circles to transformations, consider how circles behave under various transformations. A circle remains a circle under translations and rotations, but it can become an ellipse under certain other transformations. This connection between circles and transformations highlights the dynamic nature of geometry and sets the stage for our exploration of how shapes can be moved, resized, and reshaped while preserving certain properties.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};