import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, RotateCw } from 'lucide-react';
import anglesImage from '@/assets/angles-lesson.jpg';

export const AnglesLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Angles and Angle Relationships</h1>
        <p className="text-lg text-muted-foreground">Understanding Angular Measurements and Classifications</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={anglesImage} 
          alt="Different types of angles showing acute, right, obtuse, and straight angles with measurements"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              An <strong>angle</strong> is formed when two rays share a common endpoint, called the vertex. 
              Angles are measured in degrees (°), and understanding different types of angles and their 
              relationships is fundamental to geometry.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border">
                <RotateCw className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Angle Measurement</h3>
                <p className="text-gray-600">From 0° to 360° - understanding rotation and measurement</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Types of Angles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Acute Angle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Less than 90°</li>
                    <li>• Sharp angle</li>
                    <li>• Example: 45°, 30°, 60°</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Right Angle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Exactly 90°</li>
                    <li>• Forms square corner</li>
                    <li>• Marked with small square</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Obtuse Angle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Greater than 90°</li>
                    <li>• Less than 180°</li>
                    <li>• Example: 120°, 135°</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Straight Angle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Exactly 180°</li>
                    <li>• Forms straight line</li>
                    <li>• Half of full rotation</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Angle Relationships</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-700">Complementary Angles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Two angles that add up to 90°</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Example: 30° + 60° = 90°</li>
                    <li>• Can be adjacent or separate</li>
                    <li>• Each angle is the complement of the other</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-teal-700">Supplementary Angles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Two angles that add up to 180°</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Example: 120° + 60° = 180°</li>
                    <li>• Form a straight line when adjacent</li>
                    <li>• Each angle is the supplement of the other</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-pink-700">Vertical Angles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Opposite angles formed by intersecting lines</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Always equal in measure</li>
                    <li>• No common side</li>
                    <li>• Formed by two intersecting lines</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-amber-700">Adjacent Angles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Angles that share a common vertex and side</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Share one common ray</li>
                    <li>• Do not overlap</li>
                    <li>• Side by side</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-orange-200 bg-orange-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Remember:</h4>
          <p>
            Complementary angles "Complete" a right angle (90°), while Supplementary angles 
            form a "Straight" line (180°). Use these memory tricks to remember the difference!
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
              <h4 className="font-semibold mb-2">1. Find the complement:</h4>
              <p className="text-sm">If one angle measures 35°, what is the measure of its complement?</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Find the supplement:</h4>
              <p className="text-sm">If one angle measures 110°, what is the measure of its supplement?</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Classify the angles:</h4>
              <p className="text-sm">Classify angles measuring 45°, 90°, 135°, and 180°.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Vertical angles:</h4>
              <p className="text-sm">If vertical angles are formed by intersecting lines and one angle is 75°, what are the measures of all four angles?</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};