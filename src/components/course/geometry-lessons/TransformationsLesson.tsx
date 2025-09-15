import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, RotateCw, Move, FlipHorizontal, ZoomIn } from 'lucide-react';

export const TransformationsLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Transformations in Geometry</h1>
        <p className="text-lg text-muted-foreground">Moving and Changing Shapes in the Coordinate Plane</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/transformations_types.png" 
          alt="Various geometric transformations showing translation, rotation, reflection, and dilation on a coordinate plane"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              <strong>Transformations</strong> are the "verbs" of geometry—they describe how shapes move, stretch, 
              flip, and turn. While previous modules focused on static properties of shapes, transformations introduce 
              dynamism into geometry. They help us understand symmetry, congruence, and similarity in a deeper way. 
              From the patterns in Islamic art to the animations in computer graphics, transformations are essential 
              tools for creating and analyzing movement and change in geometric contexts.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border">
                <RotateCw className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Shape Transformations</h3>
                <p className="text-gray-600">Moving, flipping, and changing geometric figures</p>
              </div>
            </div>

            <Alert className="mb-6">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Key Concept:</strong> A transformation is a function that takes a geometric figure and 
                changes its position, size, or shape. The original figure is the pre-image, and the resulting 
                figure is the image.
              </AlertDescription>
            </Alert>

            <h3 className="text-xl font-semibold mb-4">Types of Transformations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                    <Move className="h-5 w-5" />
                    Translation (Slide)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Moves every point same distance, same direction</li>
                    <li>• Preserves size, shape, and orientation</li>
                    <li>• Like sliding a shape across the plane</li>
                    <li>• Described by a translation vector (h, k)</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Formula: (x, y) → (x + h, y + k)</p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                    <FlipHorizontal className="h-5 w-5" />
                    Reflection (Flip)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Flips shape over a line of reflection</li>
                    <li>• Creates mirror image</li>
                    <li>• Preserves size and shape</li>
                    <li>• Reverses orientation (clockwise ↔ counterclockwise)</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Common: over x-axis, y-axis, or y = x</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
                    <RotateCw className="h-5 w-5" />
                    Rotation (Turn)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Turns shape around a center point</li>
                    <li>• Measured in degrees (90°, 180°, 270°, etc.)</li>
                    <li>• Preserves size, shape, and orientation</li>
                    <li>• Counterclockwise is positive direction</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Common rotations: 90°, 180°, 270° about origin</p>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                    <ZoomIn className="h-5 w-5" />
                    Dilation (Scale)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Changes size but preserves shape</li>
                    <li>• Uses scale factor from center point</li>
                    <li>• Factor &gt; 1: enlargement</li>
                    <li>• Factor &lt; 1: reduction</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Creates similar figures, not congruent</p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Transformation Properties</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-700">Rigid Transformations (Isometries)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">Preserve size and shape - create congruent figures</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Move className="h-4 w-4 text-blue-600" />
                      <span><strong>Translation:</strong> Slide without turning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FlipHorizontal className="h-4 w-4 text-green-600" />
                      <span><strong>Reflection:</strong> Mirror image</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCw className="h-4 w-4 text-purple-600" />
                      <span><strong>Rotation:</strong> Turn around point</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Distance and angles preserved</p>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-teal-700">Non-Rigid Transformation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">Changes size but preserves shape - creates similar figures</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <ZoomIn className="h-4 w-4 text-red-600" />
                      <span><strong>Dilation:</strong> Resize uniformly</span>
                    </div>
                    <div>
                      <span><strong>Properties preserved:</strong></span>
                      <ul className="ml-4 mt-1">
                        <li>• Angle measures</li>
                        <li>• Shape (proportions)</li>
                        <li>• Parallelism</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Lengths scaled by factor, areas scaled by factor²</p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Coordinate Rules for Common Transformations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-700">Reflection Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-mono bg-gray-100 p-2 rounded">Over x-axis: (x, y) → (x, -y)</p>
                    <p className="font-mono bg-gray-100 p-2 rounded">Over y-axis: (x, y) → (-x, y)</p>
                    <p className="font-mono bg-gray-100 p-2 rounded">Over y = x: (x, y) → (y, x)</p>
                    <p className="font-mono bg-gray-100 p-2 rounded">Over y = -x: (x, y) → (-y, -x)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-700">Rotation Rules (about origin)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-mono bg-gray-100 p-2 rounded">90° CCW: (x, y) → (-y, x)</p>
                    <p className="font-mono bg-gray-100 p-2 rounded">180°: (x, y) → (-x, -y)</p>
                    <p className="font-mono bg-gray-100 p-2 rounded">270° CCW: (x, y) → (y, -x)</p>
                    <p className="text-xs text-muted-foreground">CCW = counterclockwise</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Transformation Compositions</h3>
            
            <Card className="border-gray-200 mb-8">
              <CardHeader>
                <CardTitle className="text-lg text-gray-700">Combining Transformations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-blue-700">Order Matters!</h4>
                    <p>Generally, transformation A followed by transformation B ≠ transformation B followed by transformation A</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700">Special Cases:</h4>
                    <ul className="space-y-1 ml-4">
                      <li>• Two translations = one translation</li>
                      <li>• Two reflections over parallel lines = translation</li>
                      <li>• Two reflections over intersecting lines = rotation</li>
                      <li>• Reflection + reflection over same line = identity</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-700">Inverse Transformations:</h4>
                    <p>Every transformation has an inverse that "undoes" the original transformation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-emerald-200 bg-emerald-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Memory Device - "SRRT":</h4>
          <p>
            Remember the four basic transformations: <strong>S</strong>lide (translation), 
            <strong>R</strong>eflect (flip), <strong>R</strong>otate (turn), and <strong>R</strong>esize (dilation). 
            The first three are rigid transformations that preserve congruence!
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
              <p className="text-xs text-muted-foreground">Use the translation formula: (x, y) → (x + h, y + k)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Reflection:</h4>
              <p className="text-sm">Point B(5, -1) is reflected over the x-axis. What are the new coordinates?</p>
              <p className="text-xs text-muted-foreground">Remember: reflection over x-axis changes sign of y-coordinate</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Rotation:</h4>
              <p className="text-sm">Point C(3, 2) is rotated 90° counterclockwise about the origin. Find the new coordinates.</p>
              <p className="text-xs text-muted-foreground">Use the rotation rule: (x, y) → (-y, x)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Dilation:</h4>
              <p className="text-sm">Triangle with vertices (0,0), (2,0), (1,2) is dilated by scale factor 3 about the origin. Find new vertices.</p>
              <p className="text-xs text-muted-foreground">Multiply each coordinate by the scale factor</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};