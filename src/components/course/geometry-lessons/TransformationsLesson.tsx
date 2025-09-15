import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, RotateCw, Move, FlipHorizontal, ZoomIn, BookOpen, Target } from 'lucide-react';

export const TransformationsLesson: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <RotateCw className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Module 4: Transformations in Geometry</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Welcome to Module 4 of our Geometry course! In this module, we will explore geometric transformations, which describe how shapes move, change size, and change orientation in the coordinate plane. Understanding transformations is crucial for analyzing symmetry, congruence, similarity, and motion in geometric contexts.
        </p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/transformations_types.png" 
          alt="Various geometric transformations showing translation, rotation, reflection, and dilation on a coordinate plane"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Teaching Moment */}
      <Alert>
        <BookOpen className="h-4 w-4" />
        <AlertDescription>
          <strong>Teaching Moment:</strong> Transformations are the "verbs" of geometry—they describe how shapes move, stretch, flip, and turn. While previous modules focused on static properties of shapes, transformations introduce dynamism into geometry. The concept of geometric transformations was formalized in the 19th century by mathematicians like Felix Klein, who showed that different geometries could be characterized by their transformation groups. Today, transformations are essential in computer graphics, robotics, crystallography, and art.
        </AlertDescription>
      </Alert>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">By the end of this module, you will be able to:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Define and identify the four basic types of transformations</li>
            <li>Understand the difference between rigid and non-rigid transformations</li>
            <li>Apply coordinate rules for reflections and rotations</li>
            <li>Perform translations using vectors</li>
            <li>Calculate dilations and understand scale factors</li>
            <li>Compose multiple transformations and understand their effects</li>
            <li>Recognize and create symmetrical designs using transformations</li>
            <li>Apply transformations to solve real-world problems</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 1: Introduction to Transformations */}
      <Card>
        <CardHeader>
          <CardTitle>Section 1: Introduction to Transformations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">What is a Transformation?</h3>
            <p className="mb-4">
              A <strong>transformation</strong> is a function that takes a geometric figure (the pre-image) and changes its position, size, or shape to create a new figure (the image). Think of transformations as instructions for moving or changing shapes in precise, mathematical ways.
            </p>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Key Vocabulary:</strong>
                <ul className="mt-2 space-y-1">
                  <li><strong>Pre-image:</strong> The original figure before transformation</li>
                  <li><strong>Image:</strong> The figure after transformation</li>
                  <li><strong>Mapping:</strong> The relationship between pre-image and image points</li>
                  <li><strong>Invariant:</strong> A property that remains unchanged during transformation</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Notation</h4>
            <p className="mb-3">We use arrow notation to show transformations:</p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li><strong>A → A'</strong> (read as "A maps to A prime")</li>
              <li>The original point A becomes the new point A'</li>
              <li>Sometimes we use A'' (A double prime) for a second transformation</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Categories of Transformations</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-lg p-4 border-green-200 bg-green-50">
                <h5 className="font-semibold text-green-700 mb-2">Rigid Transformations (Isometries)</h5>
                <p className="text-sm mb-2">Preserve size and shape—create congruent figures</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Translation (slide)</li>
                  <li>Reflection (flip)</li>
                  <li>Rotation (turn)</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4 border-blue-200 bg-blue-50">
                <h5 className="font-semibold text-blue-700 mb-2">Non-Rigid Transformation</h5>
                <p className="text-sm mb-2">Changes size but preserves shape—creates similar figures</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Dilation (scale)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: The Four Basic Transformations */}
      <Card>
        <CardHeader>
          <CardTitle>Section 2: The Four Basic Transformations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                  <Move className="h-5 w-5" />
                  Translation (Slide)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm"><strong>Definition:</strong> Moves every point of a figure the same distance in the same direction</p>
                  <div>
                    <p className="text-sm font-semibold mb-2">Properties:</p>
                    <ul className="space-y-1 text-sm list-disc list-inside">
                      <li>Preserves size, shape, and orientation</li>
                      <li>Like sliding a shape across the plane</li>
                      <li>Described by a translation vector ⟨h, k⟩</li>
                      <li>All corresponding segments are parallel and equal</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm font-mono"><strong>Rule:</strong> (x, y) → (x + h, y + k)</p>
                  </div>
                </div>
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
                <div className="space-y-3">
                  <p className="text-sm"><strong>Definition:</strong> Flips a figure over a line to create a mirror image</p>
                  <div>
                    <p className="text-sm font-semibold mb-2">Properties:</p>
                    <ul className="space-y-1 text-sm list-disc list-inside">
                      <li>Preserves size and shape</li>
                      <li>Reverses orientation (clockwise ↔ counterclockwise)</li>
                      <li>Line of reflection is the perpendicular bisector of segments connecting corresponding points</li>
                      <li>Points on the line of reflection map to themselves</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-xs"><strong>Common reflections:</strong></p>
                    <p className="text-xs font-mono">Over x-axis: (x, y) → (x, -y)</p>
                    <p className="text-xs font-mono">Over y-axis: (x, y) → (-x, y)</p>
                  </div>
                </div>
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
                <div className="space-y-3">
                  <p className="text-sm"><strong>Definition:</strong> Turns a figure around a fixed point (center of rotation)</p>
                  <div>
                    <p className="text-sm font-semibold mb-2">Properties:</p>
                    <ul className="space-y-1 text-sm list-disc list-inside">
                      <li>Preserves size, shape, and orientation</li>
                      <li>Measured in degrees (positive = counterclockwise)</li>
                      <li>Center point maps to itself</li>
                      <li>All points rotate by the same angle</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-xs"><strong>Common rotations about origin:</strong></p>
                    <p className="text-xs font-mono">90° CCW: (x, y) → (-y, x)</p>
                    <p className="text-xs font-mono">180°: (x, y) → (-x, -y)</p>
                    <p className="text-xs font-mono">270° CCW: (x, y) → (y, -x)</p>
                  </div>
                </div>
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
                <div className="space-y-3">
                  <p className="text-sm"><strong>Definition:</strong> Changes the size of a figure while preserving its shape</p>
                  <div>
                    <p className="text-sm font-semibold mb-2">Properties:</p>
                    <ul className="space-y-1 text-sm list-disc list-inside">
                      <li>Uses a scale factor (k) from a center point</li>
                      <li>k &gt; 1: enlargement (bigger)</li>
                      <li>0 &lt; k &lt; 1: reduction (smaller)</li>
                      <li>k = 1: no change (identity)</li>
                      <li>Creates similar figures, not congruent</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-3 rounded">
                    <p className="text-xs font-mono"><strong>Rule (center at origin):</strong> (x, y) → (kx, ky)</p>
                    <p className="text-xs">Distance from center multiplied by scale factor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Coordinate Rules and Formulas */}
      <Card>
        <CardHeader>
          <CardTitle>Section 3: Coordinate Rules and Formulas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Reflection Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Over Coordinate Axes</h4>
                <div className="space-y-2 text-sm font-mono">
                  <p className="bg-gray-100 p-2 rounded">Over x-axis: (x, y) → (x, -y)</p>
                  <p className="bg-gray-100 p-2 rounded">Over y-axis: (x, y) → (-x, y)</p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Over Other Lines</h4>
                <div className="space-y-2 text-sm font-mono">
                  <p className="bg-gray-100 p-2 rounded">Over y = x: (x, y) → (y, x)</p>
                  <p className="bg-gray-100 p-2 rounded">Over y = -x: (x, y) → (-y, -x)</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Rotation Rules (About Origin)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold text-sm">90° CCW</h4>
                <p className="text-xs font-mono">(x, y) → (-y, x)</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold text-sm">180°</h4>
                <p className="text-xs font-mono">(x, y) → (-x, -y)</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold text-sm">270° CCW</h4>
                <p className="text-xs font-mono">(x, y) → (y, -x)</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <h4 className="font-semibold text-sm">360°</h4>
                <p className="text-xs font-mono">(x, y) → (x, y)</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">CCW = Counterclockwise (positive direction)</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Working with Transformations</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Step-by-Step Approach:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Identify the type of transformation</li>
                <li>Determine the key information (vector, line of reflection, center and angle of rotation, scale factor)</li>
                <li>Apply the appropriate rule to each point</li>
                <li>Plot the image points and connect them</li>
                <li>Verify that properties are preserved as expected</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Composition of Transformations */}
      <Card>
        <CardHeader>
          <CardTitle>Section 4: Composition of Transformations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Combining Transformations</h3>
            <p className="mb-4">
              When we apply one transformation followed by another, we create a <strong>composition of transformations</strong>. The order of operations usually matters!
            </p>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Generally, transformation A followed by transformation B ≠ transformation B followed by transformation A. Always perform transformations in the order given.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Special Composition Rules</h4>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 border-green-200 bg-green-50">
                <h5 className="font-semibold text-green-700 mb-2">Translation Compositions</h5>
                <ul className="space-y-1 text-sm">
                  <li>• Two translations = one translation</li>
                  <li>• Translation vectors add: ⟨h₁, k₁⟩ + ⟨h₂, k₂⟩ = ⟨h₁+h₂, k₁+k₂⟩</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4 border-purple-200 bg-purple-50">
                <h5 className="font-semibold text-purple-700 mb-2">Reflection Compositions</h5>
                <ul className="space-y-1 text-sm">
                  <li>• Two reflections over parallel lines = translation</li>
                  <li>• Two reflections over intersecting lines = rotation</li>
                  <li>• Reflection over the same line twice = identity (no change)</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4 border-blue-200 bg-blue-50">
                <h5 className="font-semibold text-blue-700 mb-2">Inverse Transformations</h5>
                <ul className="space-y-1 text-sm">
                  <li>• Every transformation has an inverse that "undoes" it</li>
                  <li>• Translation ⟨h, k⟩ inverse: ⟨-h, -k⟩</li>
                  <li>• Rotation θ° inverse: rotation -θ°</li>
                  <li>• Reflection inverse: same reflection</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Symmetry and Transformations */}
      <Card>
        <CardHeader>
          <CardTitle>Section 5: Symmetry and Transformations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Types of Symmetry</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 mb-2">Line Symmetry (Reflection)</h4>
                <p className="text-sm mb-2">A figure has line symmetry if it looks the same after reflection over a line.</p>
                <ul className="space-y-1 text-sm list-disc list-inside">
                  <li>The line of reflection is called the axis of symmetry</li>
                  <li>Examples: butterfly, letter A, regular polygons</li>
                  <li>A figure can have multiple lines of symmetry</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-green-700 mb-2">Rotational Symmetry</h4>
                <p className="text-sm mb-2">A figure has rotational symmetry if it looks the same after rotation by less than 360°.</p>
                <ul className="space-y-1 text-sm list-disc list-inside">
                  <li>The center of rotation is usually the center of the figure</li>
                  <li>Order of rotational symmetry = number of identical positions</li>
                  <li>Examples: regular star, pinwheel, letter S</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Applications in Art and Design</h4>
            <p className="text-sm mb-3">
              Transformations and symmetry are fundamental in creating beautiful designs, patterns, and artwork:
            </p>
            <ul className="space-y-1 text-sm list-disc list-inside">
              <li><strong>Tessellations:</strong> Patterns that cover a plane using transformations of a basic shape</li>
              <li><strong>Islamic Art:</strong> Complex geometric patterns using rotations and reflections</li>
              <li><strong>Kaleidoscopes:</strong> Create symmetric patterns through multiple reflections</li>
              <li><strong>Architecture:</strong> Buildings often exhibit various types of symmetry</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Problem-Solving Strategy */}
      <Alert className="border-emerald-200 bg-emerald-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Memory Device - "SRRT":</h4>
          <p className="mb-2">
            Remember the four basic transformations: <strong>S</strong>lide (translation), 
            <strong>R</strong>eflect (flip), <strong>R</strong>otate (turn), and <strong>R</strong>esize (dilation).
          </p>
          <p>The first three are rigid transformations that preserve congruence—they create identical copies of the original shape!</p>
        </AlertDescription>
      </Alert>

      {/* Practice Problems */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Practice Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 1: Translation</h4>
              <p className="text-sm mb-2">Point A(2, 3) is translated 4 units right and 2 units down. What are the coordinates of A'?</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Solution:</strong> Translation vector ⟨4, -2⟩</p>
                <p>A'(2 + 4, 3 + (-2)) = A'(6, 1)</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 2: Reflection</h4>
              <p className="text-sm mb-2">Point B(5, -1) is reflected over the x-axis. Find the coordinates of B'.</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Solution:</strong> Reflection over x-axis: (x, y) → (x, -y)</p>
                <p>B'(5, -(-1)) = B'(5, 1)</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 3: Rotation</h4>
              <p className="text-sm mb-2">Point C(3, 2) is rotated 90° counterclockwise about the origin. Find C'.</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Solution:</strong> 90° CCW rotation: (x, y) → (-y, x)</p>
                <p>C'(-2, 3)</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 4: Dilation</h4>
              <p className="text-sm mb-2">Triangle with vertices (0,0), (2,0), (1,2) is dilated by scale factor 3 about the origin. Find the new vertices.</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Solution:</strong> Multiply each coordinate by 3</p>
                <p>New vertices: (0,0), (6,0), (3,6)</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Problem 5: Composition</h4>
              <p className="text-sm mb-2">Point D(-1, 4) is first reflected over the y-axis, then rotated 180° about the origin. Find the final position.</p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Step 1:</strong> Reflect over y-axis: (-1, 4) → (1, 4)</p>
                <p><strong>Step 2:</strong> Rotate 180°: (1, 4) → (-1, -4)</p>
                <p><strong>Final position:</strong> (-1, -4)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Summary */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-800">Module 4 Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            In this module, you've learned to perform and analyze geometric transformations. You've mastered the four basic transformations—translation, reflection, rotation, and dilation—and understand how they preserve or change geometric properties. You've also explored transformation compositions and symmetry. These concepts are fundamental to understanding congruence, similarity, and the dynamic aspects of geometry. In the next modules, you'll apply these transformation concepts to analyze three-dimensional shapes and coordinate geometry.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};