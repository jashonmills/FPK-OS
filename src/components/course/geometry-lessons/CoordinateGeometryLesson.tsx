import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Grid } from 'lucide-react';
import coordinateGeometryImage from '@/assets/coordinate-geometry-lesson.jpg';

export const CoordinateGeometryLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Coordinate Geometry</h1>
        <p className="text-lg text-muted-foreground">Geometry on the Coordinate Plane</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={coordinateGeometryImage} 
          alt="Coordinate plane showing points, lines, and shapes with grid lines and mathematical plotting"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              <strong>Coordinate geometry</strong> combines algebra and geometry by placing geometric 
              figures on the coordinate plane. We can use coordinates to find distances, midpoints, 
              slopes, and equations of lines.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border">
                <Grid className="h-16 w-16 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Coordinate System</h3>
                <p className="text-gray-600">Using (x, y) coordinates to describe position</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Key Concepts</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Distance Formula</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">d = √[(x₂-x₁)² + (y₂-y₁)²]</p>
                    <p className="text-sm">Distance between two points</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Midpoint Formula</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">M = ((x₁+x₂)/2, (y₁+y₂)/2)</p>
                    <p className="text-sm">Point halfway between two points</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Slope Formula</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">m = (y₂-y₁)/(x₂-x₁)</p>
                    <p className="text-sm">Steepness of a line</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Point-Slope Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">y - y₁ = m(x - x₁)</p>
                    <p className="text-sm">Equation of a line</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Types of Lines</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-700">Parallel Lines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Same slope</li>
                    <li>• Never intersect</li>
                    <li>• Same steepness</li>
                    <li>• Different y-intercepts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-teal-700">Perpendicular Lines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Slopes are negative reciprocals</li>
                    <li>• Intersect at 90°</li>
                    <li>• If m₁ = 2, then m₂ = -1/2</li>
                    <li>• Product of slopes = -1</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-teal-200 bg-teal-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Remember:</h4>
          <p>
            For perpendicular lines, flip the fraction and change the sign! 
            If one slope is 3/4, the perpendicular slope is -4/3.
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
              <h4 className="font-semibold mb-2">1. Distance:</h4>
              <p className="text-sm">Find the distance between points A(1, 2) and B(4, 6).</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Midpoint:</h4>
              <p className="text-sm">Find the midpoint between C(-2, 3) and D(6, -1).</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Slope:</h4>
              <p className="text-sm">Find the slope of the line passing through E(0, 2) and F(3, 8).</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};