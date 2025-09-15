import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, RotateCw } from 'lucide-react';

export const AnglesLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Angles and Angle Relationships</h1>
        <p className="text-lg text-muted-foreground">Understanding Angles and Their Properties</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/angles_in_polygons.jpg" 
          alt="Various types of angles and their relationships illustrated with geometric diagrams"
          className="w-1/2 mx-auto object-contain rounded-lg shadow-lg"
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

            <Alert className="mb-6">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Key Insight:</strong> Angles are fundamental to geometry because they describe how lines and rays relate to each other. 
                Every polygon can be broken down into triangles, and understanding angles helps us analyze these relationships.
              </AlertDescription>
            </Alert>

            <h3 className="text-xl font-semibold mb-4">Types of Angles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Acute Angle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Less than 90°</li>
                    <li>• Sharp, pointed angle</li>
                    <li>• Example: 45°, 30°, 60°</li>
                    <li>• Found in most triangles</li>
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
                    <li>• Forms perfect corner</li>
                    <li>• Marked with small square</li>
                    <li>• Basis for perpendicular lines</li>
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
                    <li>• Wider than right angle</li>
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
                    <li>• Two opposite rays</li>
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
                    <li>• Each angle "completes" the other to make a right angle</li>
                    <li>• Found in right triangles</li>
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
                    <li>• Each angle "supplements" the other</li>
                    <li>• Linear pairs are supplementary</li>
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
                    <li>• Useful in geometric proofs</li>
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
                    <li>• Side by side arrangement</li>
                    <li>• Can form linear pairs</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Angle Problem-Solving Strategies</h3>
            
            <Card className="border-gray-200 mb-8">
              <CardHeader>
                <CardTitle className="text-lg text-gray-700">Step-by-Step Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold text-blue-700">1. Identify Given Information</h4>
                    <p>Look for known angle measures, parallel lines, or special relationships</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700">2. Recognize Angle Relationships</h4>
                    <p>Determine if angles are complementary, supplementary, vertical, or adjacent</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700">3. Set Up Equations</h4>
                    <p>Use angle relationships to create algebraic equations</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-700">4. Solve and Verify</h4>
                    <p>Calculate unknown angles and check that your answer makes geometric sense</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-orange-200 bg-orange-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Memory Device:</h4>
          <p>
            <strong>C</strong>omplementary angles <strong>C</strong>omplete a right angle (90°), while 
            <strong>S</strong>upplementary angles form a <strong>S</strong>traight line (180°). 
            Use these memory tricks to never confuse them!
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
              <p className="text-xs text-muted-foreground">Hint: Complementary angles sum to 90°</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Find the supplement:</h4>
              <p className="text-sm">If one angle measures 110°, what is the measure of its supplement?</p>
              <p className="text-xs text-muted-foreground">Hint: Supplementary angles sum to 180°</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Classify angles:</h4>
              <p className="text-sm">Classify angles measuring 45°, 90°, 135°, and 180° as acute, right, obtuse, or straight.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Vertical angles:</h4>
              <p className="text-sm">If two lines intersect forming four angles, and one angle measures 75°, find all four angle measures.</p>
              <p className="text-xs text-muted-foreground">Remember: Vertical angles are equal, adjacent angles are supplementary</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};