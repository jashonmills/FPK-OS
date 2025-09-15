import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Box, Calculator } from 'lucide-react';

const geometryImage = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/3d-geometry-complete.jpg';
const polyhedraImage = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/polyhedra-platonic-solids.jpg';
const prismsImage = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/prisms-pyramids-volume.jpg';
const cylindersImage = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/cylinders-cones-spheres.jpg';

export const ThreeDShapesLesson: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Module 6: Three-Dimensional Geometry</h1>
      </div>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Box className="h-8 w-8 text-primary" />
            Introduction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed">
            Welcome to Module 6 of our Geometry course! In this module, we will extend our understanding of geometric concepts from two dimensions to three dimensions. We will explore various three-dimensional shapes, their properties, and how to calculate their volumes and surface areas.
          </p>
          
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Teaching Moment:</strong> Three-dimensional geometry is where mathematics truly connects with our physical world. While we've been drawing shapes on flat surfaces in previous modules, we now step into the realm of objects that have length, width, and height—just like the objects we interact with daily. From the buildings we live in to the vehicles we travel in, from the containers that hold our food to the celestial bodies in space, three-dimensional geometry helps us understand and design the physical world around us. As you learn these concepts, try to visualize them in your surroundings and appreciate how mathematics helps us make sense of our three-dimensional reality.
            </AlertDescription>
          </Alert>

          <div className="mb-8">
            <img 
              src={geometryImage}
              alt="Three-dimensional geometry showing various 3D shapes including cubes, pyramids, cylinders, cones, and spheres with coordinate systems"
              className="w-full max-w-4xl mx-auto object-contain rounded-lg shadow-lg"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Learning Objectives</h3>
            <p className="mb-4">By the end of this module, you will be able to:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span>Identify and classify different types of three-dimensional shapes</span>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Understand the properties of polyhedra, including Platonic solids</span>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <span>Calculate the volume and surface area of various three-dimensional shapes</span>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                  <span>Visualize and represent three-dimensional objects in two dimensions</span>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                  <span>Apply three-dimensional geometric concepts to solve real-world problems</span>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                  <span>Recognize the connections between two-dimensional and three-dimensional geometry</span>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Introduction to Three-Dimensional Geometry */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Section 1: Introduction to Three-Dimensional Geometry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">From 2D to 3D</h3>
            <p className="text-lg leading-relaxed mb-4">
              In two-dimensional geometry, we work with flat shapes like triangles, rectangles, and circles. In three-dimensional geometry, we work with solid shapes that have length, width, and height.
            </p>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The transition from 2D to 3D can be visualized through the concept of "extrusion"—imagine pulling a flat shape up to create a solid. For example, pulling up a circle creates a cylinder, pulling up a square creates a cube, and pulling up a triangle creates a triangular prism. This connection between dimensions helps us understand how 2D properties extend to 3D objects. For instance, the perimeter of a 2D shape relates to the edges of a 3D solid, while the area of a 2D shape relates to the surface area of a 3D solid.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Coordinate System in 3D</h3>
            <p className="mb-4">
              In three-dimensional space, we use a coordinate system with three axes: x, y, and z. A point in 3D space is represented by an ordered triple (x, y, z).
            </p>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The 3D coordinate system is often visualized using the "right-hand rule": point your index finger along the positive x-axis, your middle finger along the positive y-axis, and your thumb will point approximately along the positive z-axis. This convention helps maintain consistency in how we orient the axes. In many computer graphics and engineering applications, the z-axis points upward, while in mathematics, it's common to have the y-axis point upward. Being aware of these conventions is important when working across different disciplines.
              </AlertDescription>
            </Alert>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-3">Basic Elements in 3D:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>1. Point:</strong> A location in space, represented by coordinates (x, y, z)</p>
                <p><strong>2. Line:</strong> A straight path extending infinitely in both directions</p>
              </div>
              <div className="space-y-2">
                <p><strong>3. Plane:</strong> A flat surface extending infinitely in all directions</p>
                <p><strong>4. Space:</strong> The three-dimensional extent in which objects exist</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-primary">Problem-Solving Approach: Working with 3D Coordinates</h4>
            <p className="mb-3">When solving problems involving 3D coordinates, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Visualize the situation:</strong> Draw a 3D coordinate system and plot the relevant points</li>
              <li><strong>Identify the geometric relationships:</strong> Determine how the points, lines, or planes relate to each other</li>
              <li><strong>Apply appropriate formulas:</strong> Use distance, midpoint, or other formulas as needed</li>
              <li><strong>Verify your answer:</strong> Check that your solution makes sense in the context of the problem</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-3 text-blue-800">Example Problem:</h4>
            <p className="mb-3"><strong>Find the distance between the points A(1, 2, 3) and B(4, 6, 8).</strong></p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Solution:</strong></p>
                <p><strong>Step 1:</strong> Visualize the points A(1, 2, 3) and B(4, 6, 8) in a 3D coordinate system.</p>
              </div>
              
              <div>
                <p><strong>Step 2:</strong> Identify the geometric relationship.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>We need to find the straight-line distance between the two points.</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 3:</strong> Apply the distance formula in 3D.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Distance = √[(x₂ - x₁)² + (y₂ - y₁)² + (z₂ - z₁)²]</li>
                  <li>Distance = √[(4 - 1)² + (6 - 2)² + (8 - 3)²]</li>
                  <li>Distance = √[3² + 4² + 5²]</li>
                  <li>Distance = √[9 + 16 + 25]</li>
                  <li>Distance = √50</li>
                  <li>Distance = 5√2</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 4:</strong> Verify the answer.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The distance is positive, as expected.</li>
                  <li>The value 5√2 ≈ 7.07 units seems reasonable given the coordinates.</li>
                </ul>
              </div>
              
              <p className="font-semibold">Therefore, the distance between points A and B is 5√2 units.</p>
            </div>
            
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The distance formula in 3D is a natural extension of the Pythagorean theorem. In 2D, we use the formula d = √[(x₂ - x₁)² + (y₂ - y₁)²], which represents the hypotenuse of a right triangle. In 3D, we add the squared difference of the z-coordinates, effectively applying the Pythagorean theorem twice: first to find the distance in the xy-plane, and then to find the distance from that plane to the actual point. This illustrates how mathematical principles extend naturally across dimensions.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Polyhedra */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Section 2: Polyhedra</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">What is a Polyhedron?</h3>
            <p className="text-lg leading-relaxed mb-4">
              A polyhedron is a three-dimensional solid bounded by flat polygonal faces. The faces meet at edges, and the edges meet at vertices.
            </p>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The word "polyhedron" comes from Greek, where "poly" means "many" and "hedron" means "face." Polyhedra are the 3D analogs of polygons in 2D. Just as polygons are bounded by straight line segments, polyhedra are bounded by flat polygonal faces. The study of polyhedra dates back to ancient civilizations, with the Greeks being particularly fascinated by their mathematical properties. Plato associated the five regular polyhedra (tetrahedron, cube, octahedron, dodecahedron, and icosahedron) with the classical elements (fire, earth, air, ether, and water), highlighting their significance in early scientific thought.
              </AlertDescription>
            </Alert>
          </div>

          <div className="mb-6">
            <img 
              src={polyhedraImage}
              alt="Various polyhedra including the five Platonic solids: tetrahedron, cube, octahedron, dodecahedron, and icosahedron"
              className="w-full max-w-3xl mx-auto object-contain rounded-lg shadow-lg"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Elements of a Polyhedron</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                <h5 className="font-semibold text-red-700 mb-2">1. Face</h5>
                <p className="text-sm">A flat polygonal surface that forms part of the boundary of the polyhedron</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <h5 className="font-semibold text-green-700 mb-2">2. Edge</h5>
                <p className="text-sm">A line segment where two faces meet</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <h5 className="font-semibold text-blue-700 mb-2">3. Vertex</h5>
                <p className="text-sm">A point where three or more edges meet</p>
              </Card>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h4 className="font-semibold mb-3 text-purple-800">Euler's Formula</h4>
            <p className="mb-3">
              For any simple polyhedron (one that can be deformed into a sphere), the number of faces (F), vertices (V), and edges (E) are related by the formula:
            </p>
            <div className="text-center text-3xl font-bold text-purple-700 mb-3">
              F + V - E = 2
            </div>
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> Euler's formula is one of the most elegant results in mathematics, connecting seemingly unrelated quantities in a simple equation. It works not just for polyhedra but for any network of vertices and edges drawn on a sphere (or any surface topologically equivalent to a sphere). This formula has profound implications in topology, graph theory, and other branches of mathematics. For example, it can be used to prove that there are exactly five regular polyhedra (the Platonic solids), a result known to the ancient Greeks but formalized through Euler's insight.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Types of Polyhedra</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-700 mb-2">1. Convex Polyhedron</h5>
                  <p className="text-sm">A polyhedron where any line segment connecting two points inside the polyhedron lies entirely inside the polyhedron.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="font-semibold text-green-700 mb-2">2. Regular Polyhedron</h5>
                  <p className="text-sm">A polyhedron where all faces are congruent regular polygons, and the same number of faces meet at each vertex.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h5 className="font-semibold text-purple-700 mb-2">3. Prism</h5>
                  <p className="text-sm">A polyhedron with two congruent and parallel faces (the bases) connected by rectangular faces.</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h5 className="font-semibold text-orange-700 mb-2">4. Pyramid</h5>
                  <p className="text-sm">A polyhedron formed by connecting a polygonal base to a point (the apex) with triangular faces.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Platonic Solids</h4>
            <p className="mb-4">The Platonic solids are the five regular polyhedra:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
                <h5 className="font-semibold text-yellow-700">1. Tetrahedron</h5>
                <div className="text-sm space-y-1 mt-2">
                  <p>4 triangular faces</p>
                  <p>6 edges, 4 vertices</p>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h5 className="font-semibold text-blue-700">2. Cube (Hexahedron)</h5>
                <div className="text-sm space-y-1 mt-2">
                  <p>6 square faces</p>
                  <p>12 edges, 8 vertices</p>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <h5 className="font-semibold text-green-700">3. Octahedron</h5>
                <div className="text-sm space-y-1 mt-2">
                  <p>8 triangular faces</p>
                  <p>12 edges, 6 vertices</p>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
                <h5 className="font-semibold text-purple-700">4. Dodecahedron</h5>
                <div className="text-sm space-y-1 mt-2">
                  <p>12 pentagonal faces</p>
                  <p>30 edges, 20 vertices</p>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
                <h5 className="font-semibold text-red-700">5. Icosahedron</h5>
                <div className="text-sm space-y-1 mt-2">
                  <p>20 triangular faces</p>
                  <p>30 edges, 12 vertices</p>
                </div>
              </Card>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-primary">Problem-Solving Approach: Analyzing Polyhedra</h4>
            <p className="mb-3">When analyzing polyhedra, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Identify the type of polyhedron:</strong> Determine if it's a prism, pyramid, Platonic solid, or another type</li>
              <li><strong>Count the faces, edges, and vertices:</strong> Verify that they satisfy Euler's formula (F + V - E = 2)</li>
              <li><strong>Analyze the faces:</strong> Determine the shape and number of each type of face</li>
              <li><strong>Examine the vertices:</strong> Determine how many edges meet at each vertex</li>
              <li><strong>Apply relevant formulas:</strong> Use formulas for volume, surface area, or other properties as needed</li>
            </ol>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <h4 className="font-semibold mb-3 text-orange-800">Example Problem:</h4>
            <p className="mb-3"><strong>A triangular prism has two triangular faces and three rectangular faces. How many edges and vertices does it have?</strong></p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Solution:</strong></p>
                <p><strong>Step 1:</strong> Identify the type of polyhedron.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>This is a triangular prism with 5 faces (F = 5).</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 2:</strong> Use Euler's formula to find the relationship between faces, vertices, and edges.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>F + V - E = 2</li>
                  <li>5 + V - E = 2</li>
                  <li>V - E = -3</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 3:</strong> Analyze the structure of the prism.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>A triangular prism has two triangular bases, each with 3 vertices and 3 edges.</li>
                  <li>The bases are connected by 3 edges.</li>
                  <li>Each vertex of one base is connected to the corresponding vertex of the other base.</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 4:</strong> Count the vertices and edges.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Vertices: 3 on each triangular base, for a total of V = 6.</li>
                  <li>Edges: 3 on each triangular base (6 total) plus 3 connecting the bases, for a total of E = 9.</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 5:</strong> Verify using Euler's formula.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>F + V - E = 5 + 6 - 9 = 2 ✓</li>
                </ul>
              </div>
              
              <p className="font-semibold">Therefore, a triangular prism has 9 edges and 6 vertices.</p>
            </div>
            
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> This problem illustrates how Euler's formula can be used to check our understanding of a polyhedron's structure. We could have directly counted the edges and vertices, but using Euler's formula provides a way to verify our count. This approach is particularly useful for more complex polyhedra where direct counting might be error-prone. Notice also how we broke down the prism into its component parts (the two bases and the connecting edges) to systematically count the elements. This decomposition approach is valuable for analyzing many geometric structures.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Prisms and Pyramids */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Section 3: Prisms and Pyramids</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-6">
            <img 
              src={prismsImage}
              alt="Various prisms and pyramids showing rectangular prisms, triangular prisms, and pyramids with volume formulas"
              className="w-full max-w-3xl mx-auto object-contain rounded-lg shadow-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">Prisms</h3>
              <p className="mb-4">A prism is a polyhedron with two congruent and parallel faces (the bases) connected by rectangular faces (the lateral faces).</p>
              
              <Alert className="mb-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> Prisms are named after the shape of their bases: triangular prism, rectangular prism, pentagonal prism, etc. The lateral faces are always rectangles because they connect corresponding sides of the parallel bases. Prisms are common in architecture and engineering due to their structural stability. For example, many buildings have a roughly rectangular prism shape, and beams often have triangular or I-shaped prism cross-sections for optimal strength-to-weight ratios.
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-3">Properties of Prisms</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold">1. Volume:</p>
                    <p>The volume of a prism is the area of the base multiplied by the height.</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold">2. Surface Area:</p>
                    <p>The surface area of a prism is the sum of the areas of all its faces.</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <h3 className="text-xl font-semibold text-green-700 mb-4">Pyramids</h3>
              <p className="mb-4">A pyramid is a polyhedron formed by connecting a polygonal base to a point (the apex) with triangular faces.</p>
              
              <Alert className="mb-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> Pyramids are named after the shape of their bases: triangular pyramid, square pyramid, pentagonal pyramid, etc. A triangular pyramid is also called a tetrahedron and is one of the Platonic solids. Pyramids have been significant in various cultures, most notably in ancient Egypt, where they served as monumental tombs. The stability of the pyramid shape, with its wide base narrowing to a point, has made it an enduring architectural form. The mathematical properties of pyramids, particularly their volume formula, were known to ancient civilizations and represent early achievements in geometric understanding.
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-3">Properties of Pyramids</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold">1. Volume:</p>
                    <p>The volume of a pyramid is one-third the area of the base multiplied by the height.</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold">2. Surface Area:</p>
                    <p>The surface area of a pyramid is the sum of the areas of all its faces.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-primary">Problem-Solving Approach: Calculating Volume and Surface Area</h4>
            <p className="mb-3">When calculating the volume or surface area of a prism or pyramid, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Identify the shape:</strong> Determine if it's a prism or pyramid and identify the shape of the base</li>
              <li><strong>Find the base area:</strong> Calculate the area of the base using the appropriate formula for that shape</li>
              <li><strong>Determine the height:</strong> Find the perpendicular distance from the base to the top (for prisms) or apex (for pyramids)</li>
              <li><strong>Apply the volume formula:</strong> Use V = Base Area × Height for prisms or V = (1/3) × Base Area × Height for pyramids</li>
              <li><strong>For surface area, find all face areas:</strong> Calculate the area of each face and sum them, or use the combined formulas provided above</li>
            </ol>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h4 className="font-semibold mb-3 text-red-800">Example Problem:</h4>
            <p className="mb-3"><strong>A square pyramid has a base with side length 6 cm and a height of 8 cm. Calculate its volume and surface area.</strong></p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Solution:</strong></p>
                <p><strong>Step 1:</strong> Identify the shape.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>This is a square pyramid with a square base.</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 2:</strong> Find the base area.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Base Area = side² = 6² = 36 cm²</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 3:</strong> Determine the height.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Height = 8 cm</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 4:</strong> Apply the volume formula.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Volume = (1/3) × Base Area × Height</li>
                  <li>Volume = (1/3) × 36 × 8</li>
                  <li>Volume = (1/3) × 288</li>
                  <li>Volume = 96 cm³</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 5:</strong> For surface area, we need the slant height.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>The slant height is the distance from the apex to the middle of any side of the base.</li>
                  <li>Using the Pythagorean theorem:</li>
                  <li>Slant height² = Height² + (side/2)²</li>
                  <li>Slant height² = 8² + 3²</li>
                  <li>Slant height² = 64 + 9</li>
                  <li>Slant height² = 73</li>
                  <li>Slant height = √73 cm</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 6:</strong> Calculate the surface area.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Surface Area = Base Area + (1/2) × Perimeter of Base × Slant Height</li>
                  <li>Surface Area = 36 + (1/2) × (4 × 6) × √73</li>
                  <li>Surface Area = 36 + (1/2) × 24 × √73</li>
                  <li>Surface Area = 36 + 12√73</li>
                  <li>Surface Area ≈ 36 + 12 × 8.544</li>
                  <li>Surface Area ≈ 36 + 102.528</li>
                  <li>Surface Area ≈ 138.53 cm²</li>
                </ul>
              </div>
              
              <p className="font-semibold">Therefore, the volume of the square pyramid is 96 cm³, and its surface area is approximately 138.53 cm².</p>
            </div>
            
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> This problem illustrates the step-by-step process for calculating the volume and surface area of a pyramid. Notice how we needed to find the slant height using the Pythagorean theorem—this is a common requirement when working with pyramids. The slant height is not given directly but must be calculated from the height and the base dimensions. This highlights the interconnectedness of geometric concepts: we need to use 2D principles (the Pythagorean theorem) to solve 3D problems. Also note that we kept the exact form (12√73) in our answer before approximating, which is good mathematical practice to maintain precision.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Cylinders, Cones, and Spheres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Section 4: Cylinders, Cones, and Spheres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-6">
            <img 
              src={cylindersImage}
              alt="Cylinders, cones, and spheres with their volume and surface area formulas"
              className="w-full max-w-3xl mx-auto object-contain rounded-lg shadow-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">Cylinders</h3>
              <p className="mb-4 text-sm">A cylinder is a three-dimensional solid bounded by a curved lateral surface and two parallel circular bases.</p>
              
              <Alert className="mb-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Teaching Moment:</strong> Cylinders are the 3D analogs of rectangles in 2D. Just as a rectangle has two parallel sides connected by perpendicular sides, a cylinder has two parallel circular bases connected by a curved surface. Cylinders are ubiquitous in our world—from cans and pipes to pillars and batteries.
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-3 text-sm">Properties of Cylinders</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold text-sm">1. Volume:</p>
                    <p className="text-sm">The volume of a cylinder is the area of the base multiplied by the height.</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold text-sm">2. Surface Area:</p>
                    <p className="text-sm">The surface area of a cylinder is the sum of the areas of the two circular bases and the curved lateral surface.</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
              <h3 className="text-xl font-semibold text-green-700 mb-4">Cones</h3>
              <p className="mb-4 text-sm">A cone is a three-dimensional solid with a circular base and a curved lateral surface that tapers to a point called the apex or vertex.</p>
              
              <Alert className="mb-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Teaching Moment:</strong> Cones are the 3D analogs of triangles in 2D. Just as a triangle has a base and a point (vertex) not on the base, a cone has a circular base and an apex not on the base. Cones appear in various contexts—from ice cream cones and traffic cones to volcanic formations and mathematical functions.
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-3 text-sm">Properties of Cones</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold text-sm">1. Volume:</p>
                    <p className="text-sm">The volume of a cone is one-third the area of the base multiplied by the height.</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold text-sm">2. Surface Area:</p>
                    <p className="text-sm">The surface area of a cone is the sum of the area of the circular base and the curved lateral surface.</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <h3 className="text-xl font-semibold text-purple-700 mb-4">Spheres</h3>
              <p className="mb-4 text-sm">A sphere is a three-dimensional solid where all points are equidistant from a fixed point called the center.</p>
              
              <Alert className="mb-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Teaching Moment:</strong> Spheres are the 3D analogs of circles in 2D. Just as all points on a circle are equidistant from the center, all points on a sphere are equidistant from the center. Spheres have perfect symmetry—they look the same from all directions. This symmetry gives spheres unique properties: they enclose the maximum volume for a given surface area, which is why bubbles form spheres (minimizing surface tension) and why planets are roughly spherical (minimizing gravitational potential energy).
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-3 text-sm">Properties of Spheres</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold text-sm">1. Volume:</p>
                    <p className="text-sm">The volume of a sphere is given by V = (4/3)πr³</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold text-sm">2. Surface Area:</p>
                    <p className="text-sm">The surface area of a sphere is given by SA = 4πr²</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-primary">Problem-Solving Approach: Working with Curved Solids</h4>
            <p className="mb-3">When solving problems involving cylinders, cones, or spheres, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Identify the shape:</strong> Determine if it's a cylinder, cone, sphere, or a combination</li>
              <li><strong>Note the given dimensions:</strong> Identify the radius, height, or other relevant measurements</li>
              <li><strong>Choose the appropriate formula:</strong> Select the formula for volume, surface area, or other properties as needed</li>
              <li><strong>Substitute and calculate:</strong> Insert the known values into the formula and compute the result</li>
              <li><strong>Verify your answer:</strong> Check that your solution makes sense in the context of the problem</li>
            </ol>
          </div>

          <div className="bg-violet-50 p-6 rounded-lg border border-violet-200">
            <h4 className="font-semibold mb-3 text-violet-800">Example Problem:</h4>
            <p className="mb-3"><strong>A cone has a base radius of 5 cm and a height of 12 cm. Calculate its volume and surface area.</strong></p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Solution:</strong></p>
                <p><strong>Step 1:</strong> Identify the shape.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>This is a cone with base radius r = 5 cm and height h = 12 cm.</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 2:</strong> Apply the volume formula.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Volume = (1/3) × πr² × h</li>
                  <li>Volume = (1/3) × π × 5² × 12</li>
                  <li>Volume = (1/3) × π × 25 × 12</li>
                  <li>Volume = (1/3) × 300π</li>
                  <li>Volume = 100π cm³</li>
                  <li>Volume ≈ 314.16 cm³</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 3:</strong> Calculate the slant height using the Pythagorean theorem.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>s² = h² + r²</li>
                  <li>s² = 12² + 5²</li>
                  <li>s² = 144 + 25</li>
                  <li>s² = 169</li>
                  <li>s = 13 cm</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 4:</strong> Apply the surface area formula.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Surface Area = πr² + πrs</li>
                  <li>Surface Area = π × 5² + π × 5 × 13</li>
                  <li>Surface Area = 25π + 65π</li>
                  <li>Surface Area = 90π cm²</li>
                  <li>Surface Area ≈ 282.74 cm²</li>
                </ul>
              </div>
              
              <p className="font-semibold">Therefore, the volume of the cone is 100π cm³ (approximately 314.16 cm³), and its surface area is 90π cm² (approximately 282.74 cm²).</p>
            </div>
            
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> This problem demonstrates the process for calculating the volume and surface area of a cone. Notice how we needed to find the slant height using the Pythagorean theorem, similar to what we did with the pyramid. The slant height is essential for calculating the lateral surface area of the cone. Also note that we expressed our answers both in terms of π and as decimal approximations. In mathematical contexts, keeping π in symbolic form maintains precision, while in practical applications, a decimal approximation might be more useful. This dual approach to expressing answers is common in geometry and illustrates the balance between exact and approximate representations.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Cross-Sections and Projections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Section 5: Cross-Sections and Projections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Cross-Sections</h3>
            <p className="text-lg leading-relaxed mb-4">
              A cross-section is the intersection of a three-dimensional solid with a plane.
            </p>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> Cross-sections reveal the internal structure of 3D objects and are crucial in fields like medicine (CT scans), geology (rock strata), and engineering (structural analysis). The shape of a cross-section depends on both the shape of the 3D object and the angle and position of the cutting plane. Understanding cross-sections helps us visualize and analyze complex 3D shapes by breaking them down into simpler 2D shapes. This technique is fundamental to computer-aided design (CAD), medical imaging, and many manufacturing processes.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">Common Cross-Sections</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h5 className="font-semibold text-blue-700 mb-2">1. Cube:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Parallel to a face: Square</li>
                    <li>Diagonal plane through opposite edges: Rectangle</li>
                    <li>Plane through a diagonal of one face and the opposite vertex: Triangle</li>
                    <li>Plane through the center parallel to two opposite faces: Square</li>
                    <li>Plane through the center and four vertices (not all on the same face): Regular hexagon</li>
                  </ul>
                </Card>
                
                <Card className="p-4 bg-green-50 border-green-200">
                  <h5 className="font-semibold text-green-700 mb-2">2. Cylinder:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Parallel to the base: Circle</li>
                    <li>Perpendicular to the base through the center: Rectangle</li>
                    <li>Oblique to the base: Ellipse</li>
                  </ul>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card className="p-4 bg-purple-50 border-purple-200">
                  <h5 className="font-semibold text-purple-700 mb-2">3. Cone:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Parallel to the base: Circle</li>
                    <li>Through the apex and perpendicular to the base: Triangle</li>
                    <li>Parallel to the axis: Hyperbola</li>
                    <li>Oblique to the axis: Ellipse or parabola</li>
                  </ul>
                </Card>
                
                <Card className="p-4 bg-orange-50 border-orange-200">
                  <h5 className="font-semibold text-orange-700 mb-2">4. Sphere:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Any plane: Circle</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Projections</h3>
            <p className="text-lg leading-relaxed mb-4">
              A projection is a mapping of a three-dimensional object onto a two-dimensional surface.
            </p>
            
            <Alert className="mb-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> Projections are how we represent 3D objects on 2D surfaces like paper or screens. They're fundamental to fields like cartography (map-making), technical drawing, and computer graphics. Different types of projections preserve different properties of the original object—some maintain angles, others maintain areas, and others maintain relative positions. No projection can preserve all properties simultaneously, which is why we need different projections for different purposes. This limitation is inherent to the process of reducing dimensions from 3D to 2D and has important implications for how we interpret and use 2D representations of 3D objects.
              </AlertDescription>
            </Alert>

            <div>
              <h4 className="font-semibold mb-3">Types of Projections</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h5 className="font-semibold text-blue-700 mb-2">1. Orthographic Projection</h5>
                  <p className="text-sm">A projection where the projecting lines are perpendicular to the projection plane.</p>
                </Card>
                
                <Card className="p-4 bg-green-50 border-green-200">
                  <h5 className="font-semibold text-green-700 mb-2">2. Perspective Projection</h5>
                  <p className="text-sm">A projection where the projecting lines converge at a point (the viewpoint).</p>
                </Card>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-primary">Problem-Solving Approach: Analyzing Cross-Sections and Projections</h4>
            <p className="mb-3">When analyzing cross-sections or projections, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Identify the 3D shape:</strong> Determine the three-dimensional object being cut or projected</li>
              <li><strong>Determine the cutting plane or projection type:</strong> Identify how the cross-section or projection is being created</li>
              <li><strong>Visualize the result:</strong> Use geometric principles to determine the shape of the cross-section or projection</li>
              <li><strong>Apply relevant formulas:</strong> Calculate areas, perimeters, or other properties as needed</li>
            </ol>
          </div>

          <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
            <h4 className="font-semibold mb-3 text-teal-800">Example Problem:</h4>
            <p className="mb-3"><strong>A cube with side length 4 cm is cut by a plane passing through the midpoints of three edges that meet at a vertex. Describe the shape of the cross-section and calculate its area.</strong></p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Solution:</strong></p>
                <p><strong>Step 1:</strong> Identify the 3D shape.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>This is a cube with side length 4 cm.</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 2:</strong> Determine the cutting plane.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>The plane passes through the midpoints of three edges that meet at a vertex.</li>
                  <li>Let's place the cube in a coordinate system with one vertex at the origin (0, 0, 0) and the three adjacent vertices at (4, 0, 0), (0, 4, 0), and (0, 0, 4).</li>
                  <li>The midpoints of the three edges from the origin are at (2, 0, 0), (0, 2, 0), and (0, 0, 2).</li>
                  <li>The cutting plane passes through these three points.</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 3:</strong> Visualize the result.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>The cross-section is a triangle with vertices at (2, 0, 0), (0, 2, 0), and (0, 0, 2).</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 4:</strong> Calculate the area of the triangular cross-section.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>We can use the formula for the area of a triangle in 3D space.</li>
                  <li>First, we find two sides of the triangle as vectors:</li>
                  <li>Vector from (2, 0, 0) to (0, 2, 0): (-2, 2, 0)</li>
                  <li>Vector from (2, 0, 0) to (0, 0, 2): (-2, 0, 2)</li>
                  <li>The area is half the magnitude of the cross product of these vectors:</li>
                  <li>Cross product: (-2, 2, 0) × (-2, 0, 2) = (4, 4, 4)</li>
                  <li>Magnitude: √(4² + 4² + 4²) = √48 = 4√3</li>
                  <li>Area = (1/2) × 4√3 = 2√3 cm²</li>
                </ul>
              </div>
              
              <p className="font-semibold">Therefore, the cross-section is a triangle with area 2√3 cm² (approximately 3.46 cm²).</p>
            </div>
            
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> This problem illustrates how to analyze a cross-section of a 3D shape. We used coordinate geometry to precisely define the cube and the cutting plane, then identified the resulting cross-section as a triangle. To find the area, we used the cross product method, which works for any triangle in 3D space. This approach combines concepts from coordinate geometry, vector algebra, and trigonometry to solve a problem about cross-sections. It demonstrates how different branches of mathematics integrate when solving geometric problems in three dimensions.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Practice Problems */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            Practice Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">1.</h4>
                <p className="text-sm">Find the distance between the points A(2, 3, 4) and B(5, 7, 1).</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">2.</h4>
                <p className="text-sm">A rectangular prism has a length of 5 cm, width of 3 cm, and height of 4 cm. Calculate its volume and surface area.</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">3.</h4>
                <p className="text-sm">A cone has a base radius of 6 cm and a height of 8 cm. Calculate its volume and surface area.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">4.</h4>
                <p className="text-sm">A sphere has a radius of 5 cm. Calculate its volume and surface area.</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">5.</h4>
                <p className="text-sm">A cube with side length 6 cm is cut by a plane parallel to one of its faces and 2 cm away from that face. Describe the shape of the cross-section and calculate its area.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">
            In this module, we have explored three-dimensional geometry, including polyhedra, prisms, pyramids, cylinders, cones, and spheres. We have learned about their properties, how to calculate their volumes and surface areas, and how to analyze cross-sections and projections.
          </p>
          
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Teaching Moment:</strong> Three-dimensional geometry connects abstract mathematical concepts to the physical world we live in. The formulas and principles we've learned in this module have practical applications in architecture, engineering, manufacturing, art, and many other fields. They help us design buildings, create efficient packaging, analyze medical scans, and understand the structure of molecules and crystals. As you continue your geometric journey, remember that the ability to visualize and analyze 3D shapes is a powerful skill that bridges mathematics and the real world.
            </AlertDescription>
          </Alert>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Next Steps</h3>
            <p className="mb-3">
              In the next module, we will explore coordinate geometry, which combines algebra and geometry to solve problems using coordinates. We'll learn how to represent geometric shapes algebraically and how to use algebraic techniques to analyze geometric properties.
            </p>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> As we transition from three-dimensional geometry to coordinate geometry, we'll see how the coordinate system we introduced in this module becomes a powerful tool for solving geometric problems. Coordinate geometry provides a systematic way to translate geometric relationships into algebraic equations, allowing us to apply the techniques of algebra to geometric questions. This connection between geometry and algebra is one of the most fruitful in mathematics, leading to fields like analytic geometry, vector calculus, and differential geometry, which are essential in physics, engineering, and computer graphics.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};