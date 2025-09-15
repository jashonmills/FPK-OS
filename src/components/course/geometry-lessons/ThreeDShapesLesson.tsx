import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Box } from 'lucide-react';
import threeDShapesImage from '@/assets/3d-shapes-volume.jpg';

export const ThreeDShapesLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">3D Shapes and Volume</h1>
        <p className="text-lg text-muted-foreground">Three-Dimensional Geometry and Space Calculations</p>
      </div>

      <div className="mb-8">
        <img 
          src={threeDShapesImage}
          alt="3D shapes and volume formulas showing cubes, spheres, cylinders, cones, pyramids with calculations"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Three-dimensional shapes have length, width, and height. <strong>Volume</strong> measures 
              the space inside a 3D shape, while <strong>Surface Area</strong> measures the total 
              area of all faces.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border">
                <Box className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">3D Geometry</h3>
                <p className="text-gray-600">Length × Width × Height</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Cube</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">Volume: V = s³</p>
                    <p className="font-semibold">Surface Area: SA = 6s²</p>
                    <p>s = side length</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Rectangular Prism</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">Volume: V = lwh</p>
                    <p className="font-semibold">SA = 2(lw + lh + wh)</p>
                    <p>l = length, w = width, h = height</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Cylinder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">Volume: V = πr²h</p>
                    <p className="font-semibold">SA = 2πr² + 2πrh</p>
                    <p>r = radius, h = height</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Sphere</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">Volume: V = (4/3)πr³</p>
                    <p className="font-semibold">SA = 4πr²</p>
                    <p>r = radius</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};