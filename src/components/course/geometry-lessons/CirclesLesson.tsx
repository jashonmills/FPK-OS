import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Circle } from 'lucide-react';
import circlesImage from '@/assets/circles-lesson.jpg';

export const CirclesLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Circles</h1>
        <p className="text-lg text-muted-foreground">Understanding Circle Properties and Measurements</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={circlesImage} 
          alt="Circle diagram showing radius, diameter, chord, arc, and circumference with measurement tools"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              A <strong>circle</strong> is the set of all points that are the same distance from a center point. 
              This distance is called the radius. Circles have many important parts and properties that 
              are essential in geometry and real-world applications.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border">
                <Circle className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Perfect Shape</h3>
                <p className="text-gray-600">All points equidistant from the center</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Parts of a Circle</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• The point in the middle of the circle</li>
                    <li>• All radii start from this point</li>
                    <li>• Usually labeled with a capital letter</li>
                    <li>• Fixed point of reference</li>
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
                    <li>• Half the length of diameter</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Diameter</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Distance across circle through center</li>
                    <li>• Longest chord in a circle</li>
                    <li>• Symbol: d</li>
                    <li>• Twice the length of radius (d = 2r)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Chord</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Line segment with both endpoints on circle</li>
                    <li>• Diameter is the longest chord</li>
                    <li>• Can be any length up to diameter</li>
                    <li>• Creates two arcs</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-700">Arc</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Part of the circle between two points</li>
                    <li>• Measured in degrees or arc length</li>
                    <li>• Minor arc: less than 180°</li>
                    <li>• Major arc: greater than 180°</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-teal-700">Circumference</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Distance around the entire circle</li>
                    <li>• Perimeter of a circle</li>
                    <li>• Formula: C = 2πr or C = πd</li>
                    <li>• Uses the constant π ≈ 3.14159</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Circle Formulas</h3>
            
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
                    <p className="text-sm">Area is measured in square units</p>
                    <p className="text-sm">r² means radius × radius</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-pink-700">Arc Length</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">Arc Length = (θ/360°) × 2πr</p>
                    <p className="text-sm">θ is the central angle in degrees</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-amber-700">Sector Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">Sector Area = (θ/360°) × πr²</p>
                    <p className="text-sm">Area of a "slice" of the circle</p>
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
          <h4 className="font-bold mb-2">Remember π (Pi):</h4>
          <p>
            Pi is the ratio of circumference to diameter for any circle. It's approximately 3.14159, 
            but it's actually an infinite, non-repeating decimal. Use 3.14 or 22/7 for calculations!
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
              <p className="text-sm">A circle has a radius of 7 cm. What is its circumference? (Use π = 22/7)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Find the area:</h4>
              <p className="text-sm">A circle has a diameter of 10 inches. What is its area? (Use π = 3.14)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Find the radius:</h4>
              <p className="text-sm">If a circle has a circumference of 31.4 cm, what is its radius? (Use π = 3.14)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Arc length:</h4>
              <p className="text-sm">Find the arc length of a 60° arc in a circle with radius 6 cm.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};