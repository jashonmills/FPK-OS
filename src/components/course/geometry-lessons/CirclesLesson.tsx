import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Circle } from 'lucide-react';

export const CirclesLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Circles and Circle Properties</h1>
        <p className="text-lg text-muted-foreground">Properties and Measurements of Circular Shapes</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/circle_properties.jpg" 
          alt="Circle with labeled components including radius, diameter, chord, arc, and tangent lines"
          className="w-1/2 mx-auto object-contain rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              <strong>Circles</strong> are perhaps the most perfect geometric shape, with every point on the 
              circumference equidistant from the center. This perfect symmetry has fascinated mathematicians, 
              artists, and philosophers for millennia. From the wheels on vehicles to the orbits of planets, 
              circles and their three-dimensional counterparts, spheres, are fundamental to our understanding of the universe.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border">
                <Circle className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Perfect Symmetry</h3>
                <p className="text-gray-600">Understanding circles and their unique properties</p>
              </div>
            </div>

            <Alert className="mb-6">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Definition:</strong> A circle is the set of all points in a plane that are at a fixed 
                distance (the radius) from a fixed point (the center). This property gives circles their perfect 
                symmetry and infinite rotational symmetry.
              </AlertDescription>
            </Alert>

            <h3 className="text-xl font-semibold mb-4">Parts of a Circle</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Fixed point in the middle of the circle</li>
                    <li>• All radii start from this point</li>
                    <li>• Usually labeled with capital letter O</li>
                    <li>• Equidistant from all points on circle</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Radius</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Distance from center to any point on circle</li>
                    <li>• All radii in a circle are equal</li>
                    <li>• Symbol: r</li>
                    <li>• Half the diameter length</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Diameter</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Longest chord through the center</li>
                    <li>• Twice the radius length (d = 2r)</li>
                    <li>• Divides circle into two semicircles</li>
                    <li>• Any chord through center is a diameter</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Chord</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Line segment with endpoints on circle</li>
                    <li>• Diameter is the longest chord</li>
                    <li>• Perpendicular from center bisects chord</li>
                    <li>• Creates two arcs on the circle</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-700">Arc</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Portion of circumference between two points</li>
                    <li>• Minor arc: less than semicircle (&lt; 180°)</li>
                    <li>• Major arc: greater than semicircle (&gt; 180°)</li>
                    <li>• Measured in degrees or arc length</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-teal-700">Tangent</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Line touching circle at exactly one point</li>
                    <li>• Perpendicular to radius at point of tangency</li>
                    <li>• From external point, two tangents are equal</li>
                    <li>• Used in gear design and optics</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Circle Measurements and Formulas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-700">Circumference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">C = 2πr</p>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">C = πd</p>
                    <p className="text-sm">Where π ≈ 3.14159 or 22/7</p>
                    <p className="text-xs text-muted-foreground">Distance around the circle</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-violet-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-violet-700">Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">A = πr²</p>
                    <p className="text-sm">Area measured in square units</p>
                    <p className="text-sm">r² means radius × radius</p>
                    <p className="text-xs text-muted-foreground">Space enclosed by the circle</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-pink-700">Arc Length</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">s = (θ/360°) × 2πr</p>
                    <p className="text-sm">θ is central angle in degrees</p>
                    <p className="text-xs text-muted-foreground">Length of curved portion</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-amber-700">Sector Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">A = (θ/360°) × πr²</p>
                    <p className="text-sm">Area of "pizza slice" shape</p>
                    <p className="text-xs text-muted-foreground">Fraction of total circle area</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Circle Theorems</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-emerald-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-emerald-700">Inscribed Angle Theorem</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>An inscribed angle is half the central angle that subtends the same arc.</p>
                    <p className="font-mono bg-gray-100 p-2 rounded">Inscribed angle = ½ × Central angle</p>
                    <p className="text-xs text-muted-foreground">Fundamental relationship for angle calculations</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-sky-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-sky-700">Angle in Semicircle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>Any angle inscribed in a semicircle is a right angle (90°).</p>
                    <p className="text-xs">Known as Thales' theorem</p>
                    <p className="text-xs text-muted-foreground">Useful for constructing right angles</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-rose-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-rose-700">Tangent Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Tangent ⊥ radius at point of tangency</p>
                    <p>• Equal tangents from external point</p>
                    <p className="text-xs text-muted-foreground">Key for solving tangent problems</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-lime-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-lime-700">Chord Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Equal chords equidistant from center</p>
                    <p>• Perpendicular from center bisects chord</p>
                    <p className="text-xs text-muted-foreground">Helps find chord lengths and positions</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-cyan-200 bg-cyan-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Pi (π) - The Ultimate Circle Constant:</h4>
          <p>
            Pi represents the ratio of any circle's circumference to its diameter, and it's the same for every circle! 
            This amazing constant (≈ 3.14159...) is an irrational number with infinite, non-repeating decimal places. 
            For calculations, use π ≈ 3.14 or the fraction 22/7.
          </p>
        </AlertDescription>
      </Alert>

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
              <h4 className="font-semibold mb-2">1. Find the circumference:</h4>
              <p className="text-sm">A circle has radius 7 cm. What is its circumference? (Use π = 22/7)</p>
              <p className="text-xs text-muted-foreground">Apply the formula C = 2πr</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Find the area:</h4>
              <p className="text-sm">A circle has diameter 10 inches. What is its area? (Use π = 3.14)</p>
              <p className="text-xs text-muted-foreground">First find the radius, then use A = πr²</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Reverse calculation:</h4>
              <p className="text-sm">If a circle has circumference 31.4 cm, what is its radius? (Use π = 3.14)</p>
              <p className="text-xs text-muted-foreground">Rearrange C = 2πr to solve for r</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Arc and sector:</h4>
              <p className="text-sm">Find the arc length and sector area for a 60° arc in a circle with radius 6 cm.</p>
              <p className="text-xs text-muted-foreground">Use both arc length and sector area formulas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};