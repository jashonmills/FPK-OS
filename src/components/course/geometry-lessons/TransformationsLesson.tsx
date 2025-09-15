import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, RotateCw } from 'lucide-react';
import transformationsImage from '@/assets/transformations-lesson.jpg';

export const TransformationsLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Transformations</h1>
        <p className="text-lg text-muted-foreground">Moving and Changing Shapes in the Plane</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={transformationsImage} 
          alt="Geometric transformations showing reflection, rotation, translation, and scaling on coordinate plane"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              <strong>Transformations</strong> are ways to move or change shapes in the coordinate plane. 
              There are four basic types: translation (slide), reflection (flip), rotation (turn), 
              and dilation (resize). Each transformation follows specific rules.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border">
                <RotateCw className="h-16 w-16 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Shape Movement</h3>
                <p className="text-gray-600">Slide, Flip, Turn, and Resize</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Types of Transformations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Translation (Slide)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Moves shape without rotating or flipping</li>
                    <li>• Every point moves the same distance</li>
                    <li>• Same direction for all points</li>
                    <li>• Shape and size remain unchanged</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Reflection (Flip)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Flips shape over a line (line of reflection)</li>
                    <li>• Creates mirror image</li>
                    <li>• Each point same distance from line</li>
                    <li>• Size and shape unchanged</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Rotation (Turn)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Turns shape around a center point</li>
                    <li>• Measured in degrees</li>
                    <li>• Can be clockwise or counterclockwise</li>
                    <li>• Size and shape unchanged</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Dilation (Resize)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Changes size but not shape</li>
                    <li>• Uses a scale factor</li>
                    <li>• Factor &gt; 1: enlargement</li>
                    <li>• Factor &lt; 1: reduction</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Properties of Transformations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-700">Rigid Transformations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Preserve size and shape (isometries)</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Translation</li>
                    <li>• Reflection</li>
                    <li>• Rotation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-teal-700">Non-Rigid Transformation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Changes size but preserves shape</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Dilation</li>
                    <li>• Creates similar figures</li>
                    <li>• Angles remain the same</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-pink-200 bg-pink-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Memory Tip:</h4>
          <p>
            Remember "SRRT" - Slide (translation), Reflect (flip), Rotate (turn), 
            and Resize (dilation). The first three keep the same size and shape!
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
              <h4 className="font-semibold mb-2">1. Translation:</h4>
              <p className="text-sm">Point A(2, 3) is translated 4 units right and 2 units up. What are the new coordinates?</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Reflection:</h4>
              <p className="text-sm">Point B(5, -1) is reflected over the x-axis. What are the new coordinates?</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Rotation:</h4>
              <p className="text-sm">Describe what happens when a square is rotated 90° clockwise around its center.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Dilation:</h4>
              <p className="text-sm">A triangle with vertices at (0,0), (2,0), (1,2) is dilated by scale factor 3. Find the new vertices.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};