import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, RotateCw, Move, FlipHorizontal, ZoomIn, BookOpen, Target, Calculator, Compass, MapPin } from 'lucide-react';

export const TransformationsLesson: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="mb-8">
          <img 
            src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/transformations_types.png" 
            alt="Various geometric transformations showing translation, rotation, reflection, and dilation on a coordinate plane"
            className="w-full max-w-4xl mx-auto object-contain rounded-lg shadow-lg"
          />
        </div>

        <h1 className="text-4xl font-bold mb-4">Module 5: Transformations in Geometry</h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Explore geometric transformations, operations that change the position, size, or shape of geometric figures. 
          Study different types of transformations and their properties.
        </p>
      </div>

      {/* Introduction */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800 flex items-center gap-2">
            <RotateCw className="h-6 w-6" />
            Introduction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-300 bg-blue-50 mb-4">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Teaching Moment:</strong> Transformations are the "verbs" of geometry—they describe how shapes move, stretch, flip, and turn. While previous modules focused on static properties of shapes, transformations introduce dynamism into geometry. They help us understand symmetry, congruence, and similarity in a deeper way. From the patterns in Islamic art to the animations in computer graphics, transformations are essential tools for creating and analyzing movement and change in geometric contexts.
            </AlertDescription>
          </Alert>

          <h3 className="text-xl font-semibold mb-4">Learning Objectives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Understand and apply different types of transformations</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Identify the properties of each transformation</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Perform transformations on geometric figures</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Describe transformations using coordinates</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Recognize symmetry in geometric figures</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Apply transformations to solve real-world problems</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Introduction to Transformations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Section 1: Introduction to Transformations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What are Transformations?</h3>
              <Alert className="mb-4">
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                  <strong>Definition:</strong> A transformation is a function that takes a geometric figure and changes its position, size, or shape to create a new figure. The original figure is called the pre-image, and the resulting figure is called the image.
                </AlertDescription>
              </Alert>

              <Alert className="border-blue-300 bg-blue-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> Think of transformations as instructions for moving points in a plane. Every point in the original figure (pre-image) gets mapped to a corresponding point in the new figure (image) according to specific rules. This correspondence between points is what mathematicians call a "function." Understanding transformations as functions helps connect geometry to algebra and calculus, where functions are central concepts.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Types of Transformations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-700">1. Rigid Transformations (Isometries)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">Transformations that preserve the size and shape of the figure.</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Translation (Slide)</li>
                      <li>Rotation (Turn)</li>
                      <li>Reflection (Flip)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-700">2. Non-Rigid Transformations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">Transformations that change the size or shape of the figure.</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Dilation (Scaling)</li>
                      <li>Shear</li>
                      <li>Stretch</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Problem-Solving Approach: Identifying Transformations
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>Compare corresponding points:</strong> Match points in the pre-image to their corresponding points in the image.</li>
                <li><strong>Check for preservation of distance:</strong> Measure distances between corresponding points to determine if the transformation is rigid.</li>
                <li><strong>Look for patterns in movement:</strong> Observe how points have moved to identify the specific transformation.</li>
                <li><strong>Verify with properties:</strong> Confirm your identification by checking if the transformation satisfies all properties of that type.</li>
              </ol>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Example Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4"><strong>Problem:</strong> Figure A is a triangle with vertices at (1, 1), (3, 1), and (2, 3). Figure B is a triangle with vertices at (4, 1), (6, 1), and (5, 3). Identify the transformation that maps Figure A to Figure B.</p>
                
                <div className="bg-white rounded p-4 border">
                  <p className="font-semibold mb-2">Solution:</p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p><strong>Step 1:</strong> Compare corresponding vertices.</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>(1, 1) → (4, 1): Moved 3 units right, 0 units up</li>
                        <li>(3, 1) → (6, 1): Moved 3 units right, 0 units up</li>
                        <li>(2, 3) → (5, 3): Moved 3 units right, 0 units up</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p><strong>Step 2:</strong> Check for preservation of distance.</p>
                      <p className="ml-4">All distances between vertices are preserved, so this is a rigid transformation.</p>
                    </div>
                    
                    <div>
                      <p><strong>Step 3:</strong> Look for patterns in movement.</p>
                      <p className="ml-4">All points moved 3 units in the positive x-direction and 0 units in the y-direction.</p>
                    </div>
                    
                    <div>
                      <p><strong>Step 4:</strong> Verify with properties.</p>
                      <p className="ml-4">Translation preserves orientation, distance, and angle measure. The translation vector is (3, 0).</p>
                    </div>
                  </div>
                </div>

                <Alert className="mt-4 border-blue-300 bg-blue-50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Teaching Moment:</strong> In this problem, we identified a translation by recognizing that all points moved the same distance in the same direction. This is the defining characteristic of a translation. Notice how we verified our answer by checking that distances between corresponding points were preserved, confirming that it's a rigid transformation. This methodical approach—comparing corresponding points, checking for preservation of properties, identifying patterns, and verifying—is effective for identifying any type of transformation.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Translations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Move className="h-6 w-6 text-green-600" />
            Section 2: Translations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="mb-6">
              <img 
                src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/transformations_examples.jpg" 
                alt="Examples of geometric transformations including translations, rotations, reflections, and dilations"
                className="w-full max-w-3xl mx-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">What is a Translation?</h3>
              <Alert className="mb-4">
                <Move className="h-4 w-4" />
                <AlertDescription>
                  <strong>Definition:</strong> A translation is a transformation that moves every point of a figure the same distance in the same direction. It is also known as a slide.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-300 bg-green-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> Translations are perhaps the simplest transformations to visualize—they're like sliding a shape across a surface without rotating or flipping it. In everyday life, translations occur when you slide a book across a table or when an elevator moves up and down. In mathematics, translations are represented by vectors, which specify both the distance and direction of the movement.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Properties of Translations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-blue-200">
                  <CardContent className="pt-4">
                    <p className="text-sm">1. Translations preserve the size and shape of the figure.</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200">
                  <CardContent className="pt-4">
                    <p className="text-sm">2. Translations preserve the orientation of the figure.</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200">
                  <CardContent className="pt-4">
                    <p className="text-sm">3. The distance between any two points in the pre-image is the same as the distance between the corresponding points in the image.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Performing Translations</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="font-semibold mb-2">Translation Formula:</p>
                <p className="text-lg font-mono text-center mb-2">To translate a point (x, y) by a vector (h, k), the new coordinates are (x + h, y + k).</p>
              </div>

              <Alert className="border-green-300 bg-green-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> This simple formula encapsulates the essence of translation: add the translation vector components to the coordinates of each point. The h value tells you how far to move horizontally (positive for right, negative for left), and the k value tells you how far to move vertically (positive for up, negative for down). This algebraic representation allows us to precisely describe and perform translations in coordinate geometry.
                </AlertDescription>
              </Alert>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Example Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4"><strong>Problem:</strong> Translate the triangle with vertices at (1, 2), (3, 4), and (2, 5) by the vector (2, -3).</p>
                
                <div className="bg-white rounded p-4 border">
                  <p className="font-semibold mb-2">Solution:</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Step 1:</strong> Identify the translation vector: (h, k) = (2, -3)</p>
                    
                    <p><strong>Step 2:</strong> Apply the translation formula to each vertex:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Vertex 1: (1, 2) → (1 + 2, 2 + (-3)) = (3, -1)</li>
                      <li>Vertex 2: (3, 4) → (3 + 2, 4 + (-3)) = (5, 1)</li>
                      <li>Vertex 3: (2, 5) → (2 + 2, 5 + (-3)) = (4, 2)</li>
                    </ul>
                    
                    <p><strong>Step 3:</strong> The translated triangle has vertices at (3, -1), (5, 1), and (4, 2).</p>
                    
                    <p><strong>Step 4:</strong> Verify: Each point has moved 2 units right and 3 units down.</p>
                  </div>
                </div>

                <Alert className="mt-4 border-blue-300 bg-blue-50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Teaching Moment:</strong> This problem demonstrates the straightforward nature of translations in coordinate geometry. By simply adding the components of the translation vector to each coordinate, we move every point of the figure the same distance in the same direction. Notice how we verified our answer by checking that each vertex moved exactly according to the translation vector. This verification step is important to ensure accuracy in geometric transformations.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Rotations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <RotateCw className="h-6 w-6 text-purple-600" />
            Section 3: Rotations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What is a Rotation?</h3>
              <Alert className="mb-4">
                <RotateCw className="h-4 w-4" />
                <AlertDescription>
                  <strong>Definition:</strong> A rotation is a transformation that turns a figure around a fixed point, called the center of rotation, by a specified angle.
                </AlertDescription>
              </Alert>

              <Alert className="border-purple-300 bg-purple-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> Rotations are like spinning a figure around a pivot point. In everyday life, rotations occur when a wheel turns, when a door swings open, or when the hands of a clock move. In mathematics, rotations are specified by three components: the center of rotation (the fixed point), the angle of rotation (how far to turn), and the direction (clockwise or counterclockwise, with counterclockwise being the standard positive direction).
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Properties of Rotations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-purple-200">
                  <CardContent className="pt-4">
                    <p className="text-sm">1. Rotations preserve the size and shape of the figure.</p>
                  </CardContent>
                </Card>
                <Card className="border-purple-200">
                  <CardContent className="pt-4">
                    <p className="text-sm">2. Rotations preserve the orientation of the figure.</p>
                  </CardContent>
                </Card>
                <Card className="border-purple-200">
                  <CardContent className="pt-4">
                    <p className="text-sm">3. The distance from any point in the pre-image to the center of rotation is the same as the distance from the corresponding point in the image to the center of rotation.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Performing Rotations</h3>
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="font-semibold mb-2">Rotation Around the Origin:</p>
                  <div className="space-y-2 text-sm">
                    <p>To rotate a point (x, y) around the origin by an angle θ in the counterclockwise direction:</p>
                    <p className="font-mono">x' = x cos(θ) - y sin(θ)</p>
                    <p className="font-mono">y' = x sin(θ) + y cos(θ)</p>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="font-semibold mb-2">Rotation Around Any Point (h, k):</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Translate the center of rotation to the origin: (x - h, y - k)</li>
                    <li>Rotate around the origin</li>
                    <li>Translate back: add (h, k) to the result</li>
                  </ol>
                </div>
              </div>

              <Alert className="border-purple-300 bg-purple-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> These formulas may look complex, but they have a beautiful geometric interpretation. The rotation formulas use sine and cosine functions because these trigonometric functions naturally describe circular motion. When we rotate around a point other than the origin, we use a three-step process: first translate to make the center of rotation the origin, then perform the rotation around the origin, and finally translate back. This approach simplifies the mathematics and illustrates how transformations can be composed (combined) to create more complex movements.
                </AlertDescription>
              </Alert>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Example Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4"><strong>Problem:</strong> Rotate the point (3, 4) around the origin by 90 degrees counterclockwise.</p>
                
                <div className="bg-white rounded p-4 border">
                  <p className="font-semibold mb-2">Solution:</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Step 1:</strong> Center of rotation: Origin (0, 0), Angle: 90° counterclockwise</p>
                    
                    <p><strong>Step 2:</strong> For θ = 90°, cos(90°) = 0 and sin(90°) = 1</p>
                    
                    <p><strong>Step 3:</strong> Apply the rotation formula:</p>
                    <ul className="list-disc list-inside ml-4">
                      <li>x' = 3 × 0 - 4 × 1 = -4</li>
                      <li>y' = 3 × 1 + 4 × 0 = 3</li>
                    </ul>
                    
                    <p><strong>Step 4:</strong> The rotated point is at (-4, 3).</p>
                    
                    <p><strong>Step 5:</strong> Verify: Both points are 5 units from origin, angle difference is 90°.</p>
                  </div>
                </div>

                <Alert className="mt-4 border-blue-300 bg-blue-50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Teaching Moment:</strong> This problem illustrates how to use the rotation formulas for a specific case: a 90° counterclockwise rotation around the origin. Notice how the coordinates transform: (3, 4) becomes (-4, 3). There's a pattern here—for a 90° counterclockwise rotation around the origin, (x, y) always becomes (-y, x). This special case is worth remembering as it appears frequently in geometry and physics.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Reflections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FlipHorizontal className="h-6 w-6 text-red-600" />
            Section 4: Reflections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What is a Reflection?</h3>
              <Alert className="mb-4">
                <FlipHorizontal className="h-4 w-4" />
                <AlertDescription>
                  <strong>Definition:</strong> A reflection is a transformation that flips a figure over a line, called the line of reflection.
                </AlertDescription>
              </Alert>

              <Alert className="border-red-300 bg-red-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> Reflections are like mirror images. When you look in a mirror, what you see is a reflection of yourself across the plane of the mirror. In two-dimensional geometry, reflections occur across lines rather than planes. Reflections are fundamental to understanding symmetry in nature, art, and architecture. Many natural objects, from butterflies to human faces, exhibit approximate reflectional symmetry.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Properties of Reflections</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-red-200">
                  <CardContent className="pt-4">
                    <p className="text-sm">1. Reflections preserve the size and shape of the figure.</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200">
                  <CardContent className="pt-4">
                    <p className="text-sm">2. Reflections reverse the orientation of the figure.</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200">
                  <CardContent className="pt-4">
                    <p className="text-sm">3. The line of reflection is the perpendicular bisector of the line segment connecting any point in the pre-image to its corresponding point in the image.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Performing Reflections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Reflection over x-axis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono">(x, y) → (x, -y)</p>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Reflection over y-axis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono">(x, y) → (-x, y)</p>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Reflection over y = x</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono">(x, y) → (y, x)</p>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Reflection over y = -x</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono">(x, y) → (-y, -x)</p>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Reflection over y = k</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono">(x, y) → (x, 2k - y)</p>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Reflection over x = h</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono">(x, y) → (2h - x, y)</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Example Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4"><strong>Problem:</strong> Reflect the line segment from (1, 2) to (3, 4) over the x-axis.</p>
                
                <div className="bg-white rounded p-4 border">
                  <p className="font-semibold mb-2">Solution:</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Step 1:</strong> Line of reflection: x-axis (y = 0)</p>
                    
                    <p><strong>Step 2:</strong> For reflection over the x-axis: (x, y) → (x, -y)</p>
                    
                    <p><strong>Step 3:</strong> Apply to each endpoint:</p>
                    <ul className="list-disc list-inside ml-4">
                      <li>Endpoint 1: (1, 2) → (1, -2)</li>
                      <li>Endpoint 2: (3, 4) → (3, -4)</li>
                    </ul>
                    
                    <p><strong>Step 4:</strong> The reflected line segment goes from (1, -2) to (3, -4).</p>
                    
                    <p><strong>Step 5:</strong> Verify: The x-axis is the perpendicular bisector of lines connecting original points to their reflections.</p>
                  </div>
                </div>

                <Alert className="mt-4 border-blue-300 bg-blue-50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Teaching Moment:</strong> This problem demonstrates the straightforward nature of reflections over the coordinate axes. For reflection over the x-axis, we simply negate the y-coordinates while keeping the x-coordinates the same. Notice how we verified our answer by checking that the x-axis is indeed the perpendicular bisector of the lines connecting each original point to its reflection. This verification step ensures that our reflection satisfies the fundamental property of reflections.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Dilations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ZoomIn className="h-6 w-6 text-orange-600" />
            Section 5: Dilations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="mb-6">
              <img 
                src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/transformations_math.jpg" 
                alt="Mathematical representations of geometric transformations with coordinate rules and formulas"
                className="w-full max-w-3xl mx-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">What is a Dilation?</h3>
              <Alert className="mb-4">
                <ZoomIn className="h-4 w-4" />
                <AlertDescription>
                  <strong>Definition:</strong> A dilation is a transformation that changes the size of a figure without changing its shape. It is also known as a scaling.
                </AlertDescription>
              </Alert>

              <Alert className="border-orange-300 bg-orange-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> Dilations are like zooming in or out on a figure. When you zoom in on a map or photo, you're performing a dilation with a scale factor greater than 1. When you zoom out, the scale factor is between 0 and 1. Dilations are crucial in fields like cartography (map-making), where real-world features need to be scaled to fit on a page, and in computer graphics, where objects need to be resized while maintaining their proportions.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Properties of Dilations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-orange-200">
                  <CardContent className="pt-4">
                    <p className="text-sm">1. Dilations preserve the shape of the figure but change its size.</p>
                  </CardContent>
                </Card>
                <Card className="border-orange-200">
                  <CardContent className="pt-4">
                    <p className="text-sm">2. Dilations preserve the orientation of the figure.</p>
                  </CardContent>
                </Card>
                <Card className="border-orange-200">
                  <CardContent className="pt-4">
                    <p className="text-sm">3. The ratio of the distance between any two points in the image to the distance between the corresponding points in the pre-image is equal to the scale factor.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Performing Dilations</h3>
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="font-semibold mb-2">Dilation from the Origin:</p>
                  <p className="text-lg font-mono text-center">To dilate a point (x, y) from the origin with a scale factor k: (kx, ky)</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="font-semibold mb-2">Dilation from Any Center (h, k):</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Translate the center of dilation to the origin: (x - h, y - k)</li>
                    <li>Dilate from the origin: (s(x - h), s(y - k))</li>
                    <li>Translate back: (s(x - h) + h, s(y - k) + k)</li>
                  </ol>
                </div>
              </div>

              <Alert className="border-orange-300 bg-orange-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> These formulas capture the essence of dilation: multiply coordinates by the scale factor to resize the figure. When dilating from a point other than the origin, we use a three-step process similar to what we did with rotations: translate to make the center of dilation the origin, perform the dilation, and translate back. This approach ensures that the center of dilation remains fixed while all other points move along rays emanating from the center.
                </AlertDescription>
              </Alert>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Example Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4"><strong>Problem:</strong> Dilate the rectangle with vertices at (1, 1), (4, 1), (4, 3), and (1, 3) from the origin with a scale factor of 2.</p>
                
                <div className="bg-white rounded p-4 border">
                  <p className="font-semibold mb-2">Solution:</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Step 1:</strong> Center of dilation: Origin (0, 0), Scale factor: k = 2</p>
                    
                    <p><strong>Step 2:</strong> Apply (x, y) → (kx, ky) to each vertex:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Vertex 1: (1, 1) → (2, 2)</li>
                      <li>Vertex 2: (4, 1) → (8, 2)</li>
                      <li>Vertex 3: (4, 3) → (8, 6)</li>
                      <li>Vertex 4: (1, 3) → (2, 6)</li>
                    </ul>
                    
                    <p><strong>Step 3:</strong> The dilated rectangle has vertices at (2, 2), (8, 2), (8, 6), and (2, 6).</p>
                    
                    <p><strong>Step 4:</strong> Verify: Original dimensions 3×2, dilated dimensions 6×4 (both doubled).</p>
                  </div>
                </div>

                <Alert className="mt-4 border-blue-300 bg-blue-50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Teaching Moment:</strong> This problem illustrates how dilations affect the size of a figure while preserving its shape. Notice that the dilated rectangle is still a rectangle (same shape) but with dimensions twice as large (different size). Also note that the distance from the origin to each vertex has doubled, which is a key characteristic of dilation. For example, the distance from the origin to (1, 1) is √2, and the distance to the corresponding dilated point (2, 2) is 2√2, which is exactly 2 times the original distance.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Composite Transformations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Calculator className="h-6 w-6 text-indigo-600" />
            Section 6: Composite Transformations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What are Composite Transformations?</h3>
              <Alert className="mb-4">
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  <strong>Definition:</strong> A composite transformation is a sequence of two or more transformations applied one after the other.
                </AlertDescription>
              </Alert>

              <Alert className="border-indigo-300 bg-indigo-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> Composite transformations are like following a series of directions: "Go north for 2 miles, then turn east for 3 miles." In geometry, we might say "Reflect across the x-axis, then rotate 90° around the origin." The order of transformations matters—changing the order often leads to different results. This concept connects to function composition in algebra and to the mathematical structure of groups, which studies how operations combine.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Properties of Composite Transformations</h3>
              <div className="grid grid-cols-1 gap-4">
                <Card className="border-indigo-200">
                  <CardContent className="pt-4">
                    <p className="text-sm"><strong>1.</strong> The order of transformations matters. In general, A followed by B is not the same as B followed by A.</p>
                  </CardContent>
                </Card>
                <Card className="border-indigo-200">
                  <CardContent className="pt-4">
                    <p className="text-sm"><strong>2.</strong> The composition of two or more isometries is an isometry.</p>
                  </CardContent>
                </Card>
                <Card className="border-indigo-200">
                  <CardContent className="pt-4">
                    <p className="text-sm"><strong>3.</strong> The composition of two or more dilations is a dilation.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Examples of Composite Transformations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-700">1. Glide Reflection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">A translation followed by a reflection, or vice versa.</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-700">2. Half-Turn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">A rotation by 180 degrees, which is equivalent to a reflection over a line followed by a reflection over a perpendicular line.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Example Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4"><strong>Problem:</strong> Apply the following sequence of transformations to the point (3, 2): 1) Reflection over the x-axis 2) Translation by the vector (1, -1)</p>
                
                <div className="bg-white rounded p-4 border">
                  <p className="font-semibold mb-2">Solution:</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Step 1:</strong> Original point: (3, 2)</p>
                    
                    <p><strong>Step 2:</strong> Apply reflection over x-axis: (3, 2) → (3, -2)</p>
                    
                    <p><strong>Step 3:</strong> Apply translation by (1, -1): (3, -2) → (4, -3)</p>
                    
                    <p><strong>Step 4:</strong> Final position: (4, -3)</p>
                    
                    <p><strong>Step 5:</strong> Verify: Reflection negated y-coordinate, translation added vector components.</p>
                  </div>
                </div>

                <Alert className="mt-4 border-blue-300 bg-blue-50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Teaching Moment:</strong> This problem demonstrates the step-by-step process of applying a composite transformation. Notice that we applied the transformations in the specified order: first the reflection, then the translation. If we had reversed the order (translation first, then reflection), we would have gotten a different result: (3, 2) → (4, 1) → (4, -1). This illustrates the non-commutative nature of geometric transformations—the order matters!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Symmetry */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Compass className="h-6 w-6 text-teal-600" />
            Section 7: Symmetry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="mb-6">
              <img 
                src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/geometric_transformations.png" 
                alt="Geometric transformations demonstrating various types of symmetry in regular polygons and other shapes"
                className="w-full max-w-3xl mx-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">What is Symmetry?</h3>
              <Alert className="mb-4">
                <Compass className="h-4 w-4" />
                <AlertDescription>
                  <strong>Definition:</strong> Symmetry is a property of a figure that remains unchanged under certain transformations.
                </AlertDescription>
              </Alert>

              <Alert className="border-teal-300 bg-teal-50 mb-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> Symmetry is all around us—in the patterns of snowflakes, the structure of flowers, the design of buildings, and even in the laws of physics. When we say a figure has symmetry, we mean that there's a transformation (like a reflection or rotation) that maps the figure onto itself, leaving it looking unchanged. Symmetry is not just aesthetically pleasing; it's a fundamental concept in mathematics, science, and art that helps us understand structure and pattern.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Types of Symmetry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-700">1. Reflectional Symmetry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">A figure has reflectional symmetry if there is a line such that the reflection of the figure over that line results in the same figure.</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-700">2. Rotational Symmetry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">A figure has rotational symmetry if there is a point such that a rotation of the figure around that point by a certain angle results in the same figure.</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-700">3. Translational Symmetry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">A figure has translational symmetry if there is a translation that maps the figure onto itself.</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-700">4. Point Symmetry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">A figure has point symmetry if there is a point such that a rotation of the figure around that point by 180 degrees results in the same figure.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Example Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4"><strong>Problem:</strong> Determine the type of symmetry in the following figures: a square, an equilateral triangle, a regular hexagon.</p>
                
                <div className="bg-white rounded p-4 border">
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-semibold">For a square:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Reflectional symmetry: Yes, 4 lines of symmetry</li>
                        <li>Rotational symmetry: Yes, order 4 (90°, 180°, 270°, 360°)</li>
                        <li>Point symmetry: Yes (180° rotational symmetry)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-semibold">For an equilateral triangle:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Reflectional symmetry: Yes, 3 lines of symmetry</li>
                        <li>Rotational symmetry: Yes, order 3 (120°, 240°, 360°)</li>
                        <li>Point symmetry: No (no 180° rotational symmetry)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-semibold">For a regular hexagon:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Reflectional symmetry: Yes, 6 lines of symmetry</li>
                        <li>Rotational symmetry: Yes, order 6 (60°, 120°, 180°, 240°, 300°, 360°)</li>
                        <li>Point symmetry: Yes (180° rotational symmetry)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Alert className="mt-4 border-blue-300 bg-blue-50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Teaching Moment:</strong> This problem illustrates how regular polygons possess both reflectional and rotational symmetry. Notice the pattern: an n-sided regular polygon has n lines of symmetry and rotational symmetry of order n. Also note that point symmetry (180° rotational symmetry) is present in regular polygons with an even number of sides but absent in those with an odd number of sides. These symmetry properties are fundamental in the classification and analysis of geometric figures.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Practice Problems */}
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
              <p className="text-sm">Translate the triangle with vertices at (1, 2), (3, 4), and (2, 5) by the vector (2, -3).</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Rotation:</h4>
              <p className="text-sm">Rotate the point (3, 4) around the origin by 90 degrees counterclockwise.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Reflection:</h4>
              <p className="text-sm">Reflect the line segment from (1, 2) to (3, 4) over the x-axis.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Dilation:</h4>
              <p className="text-sm">Dilate the rectangle with vertices at (1, 1), (4, 1), (4, 3), and (1, 3) from the origin with a scale factor of 2.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">5. Symmetry:</h4>
              <p className="text-sm">Determine the type of symmetry in a square, an equilateral triangle, and a regular hexagon.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            In this module, we have explored geometric transformations, including translations, rotations, reflections, and dilations. 
            We have learned about the properties of each transformation and how to perform them. We have also studied composite 
            transformations and symmetry in geometric figures.
          </p>

          <Alert className="border-blue-300 bg-blue-50 mb-4">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Teaching Moment:</strong> Transformations provide a dynamic perspective on geometry, allowing us to see how shapes can move, turn, flip, and resize while preserving certain properties. This perspective is not just mathematically elegant; it's practically useful in fields ranging from computer graphics to physics, from architecture to biology. The concepts of transformation and symmetry help us understand patterns in nature and create designs in art and engineering. As you continue your geometric journey, remember that transformations connect different areas of mathematics and provide powerful tools for solving a wide range of problems.
            </AlertDescription>
          </Alert>

          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Next Steps</h4>
            <p className="text-sm mb-2">
              In the next module, we will explore three-dimensional geometry. We'll extend our understanding of geometric shapes and 
              transformations to the third dimension, exploring polyhedra, prisms, pyramids, cylinders, cones, and spheres.
            </p>
            
            <Alert className="border-blue-300 bg-blue-50">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Teaching Moment:</strong> As we move from two dimensions to three, many of the transformation concepts we've learned will extend naturally. For example, reflections will occur across planes rather than lines, and rotations will occur around axes rather than points. The added dimension brings new challenges and insights, but the fundamental principles remain the same. This connection between dimensions is a beautiful aspect of geometry that reveals the underlying unity of mathematical concepts.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};