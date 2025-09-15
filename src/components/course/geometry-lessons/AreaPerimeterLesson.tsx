import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Calculator } from 'lucide-react';
import areaPerimeterImage from '@/assets/area-perimeter-lesson.jpg';

export const AreaPerimeterLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Area and Perimeter</h1>
        <p className="text-lg text-muted-foreground">Calculating Space and Boundaries</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={areaPerimeterImage} 
          alt="Various shapes with area and perimeter formulas and calculations"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              <strong>Perimeter</strong> is the distance around the outside of a shape, while <strong>Area</strong> 
              is the amount of space inside a shape. Understanding how to calculate both is essential for 
              solving real-world problems involving space and materials.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border">
                <Calculator className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Measurement Formulas</h3>
                <p className="text-gray-600">Perimeter (distance around) vs Area (space inside)</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Rectangle Formulas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Rectangle Perimeter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">P = 2l + 2w</p>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">P = 2(l + w)</p>
                    <p className="text-sm">l = length, w = width</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Rectangle Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">A = l × w</p>
                    <p className="text-sm">Area in square units</p>
                    <p className="text-sm">Length times width</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">More Shape Formulas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Square</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">Perimeter: P = 4s</p>
                    <p className="font-semibold">Area: A = s²</p>
                    <p>s = side length</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Triangle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">Perimeter: P = a + b + c</p>
                    <p className="font-semibold">Area: A = ½bh</p>
                    <p>b = base, h = height</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-700">Circle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">Circumference: C = 2πr</p>
                    <p className="font-semibold">Area: A = πr²</p>
                    <p>r = radius</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <h4 className="font-semibold mb-2">1. Rectangle:</h4>
              <p className="text-sm">Find the perimeter and area of a rectangle with length 8 cm and width 5 cm.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Square:</h4>
              <p className="text-sm">A square has a perimeter of 20 inches. What is its area?</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};