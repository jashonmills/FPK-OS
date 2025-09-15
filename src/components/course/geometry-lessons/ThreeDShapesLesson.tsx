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
        <p className="text-xl text-muted-foreground">Extending Geometric Concepts to the Third Dimension</p>
      </div>

      <div className="mb-8">
        <img 
          src={geometryImage}
          alt="Three-dimensional geometry showing various 3D shapes including cubes, pyramids, cylinders, cones, and spheres with coordinate systems"
          className="w-full max-w-4xl mx-auto object-contain rounded-lg shadow-lg"
        />
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
              <strong>Teaching Moment:</strong> Three-dimensional geometry is where mathematics truly connects with our physical world. While we've been drawing shapes on flat surfaces in previous modules, we now step into the realm of objects that have length, width, and height—just like the objects we interact with daily. From the buildings we live in to the vehicles we travel in, from the containers that hold our food to the celestial bodies in space, three-dimensional geometry helps us understand and design the physical world around us.
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Learning Objectives</h3>
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
                  <span>Apply three-dimensional geometric concepts to solve real-world problems</span>
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
                <strong>Teaching Moment:</strong> The transition from 2D to 3D can be visualized through the concept of "extrusion"—imagine pulling a flat shape up to create a solid. For example, pulling up a circle creates a cylinder, pulling up a square creates a cube, and pulling up a triangle creates a triangular prism.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Coordinate System in 3D</h3>
            <p className="mb-4">
              In three-dimensional space, we use a coordinate system with three axes: x, y, and z. A point in 3D space is represented by an ordered triple (x, y, z).
            </p>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border">
              <h4 className="font-semibold mb-3">Basic Elements in 3D:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><strong>Point:</strong> A location in space, represented by coordinates (x, y, z)</p>
                  <p><strong>Line:</strong> A straight path extending infinitely in both directions</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Plane:</strong> A flat surface extending infinitely in all directions</p>
                  <p><strong>Space:</strong> The three-dimensional extent in which objects exist</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-3 text-blue-800">Example Problem: 3D Distance</h4>
            <p className="mb-3"><strong>Problem:</strong> Find the distance between points A(1, 2, 3) and B(4, 6, 8).</p>
            <div className="space-y-2 text-sm">
              <p><strong>Solution:</strong></p>
              <p>Using the 3D distance formula: d = √[(x₂ - x₁)² + (y₂ - y₁)² + (z₂ - z₁)²]</p>
              <p>Distance = √[(4-1)² + (6-2)² + (8-3)²] = √[9 + 16 + 25] = √50 = 5√2 units</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Polyhedra */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Section 2: Polyhedra</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-6">
            <img 
              src={polyhedraImage}
              alt="Various polyhedra including the five Platonic solids: tetrahedron, cube, octahedron, dodecahedron, and icosahedron"
              className="w-full max-w-3xl mx-auto object-contain rounded-lg shadow-lg"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">What is a Polyhedron?</h3>
            <p className="text-lg leading-relaxed mb-4">
              A polyhedron is a three-dimensional solid bounded by flat polygonal faces. The faces meet at edges, and the edges meet at vertices.
            </p>
            
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> The word "polyhedron" comes from Greek, where "poly" means "many" and "hedron" means "face." Polyhedra are the 3D analogs of polygons in 2D. The study of polyhedra dates back to ancient civilizations, with the Greeks being particularly fascinated by their mathematical properties.
              </AlertDescription>
            </Alert>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <h4 className="font-semibold text-red-700 mb-2">Face</h4>
              <p className="text-sm">A flat polygonal surface that forms part of the boundary of the polyhedron</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">Edge</h4>
              <p className="text-sm">A line segment where two faces meet</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-2">Vertex</h4>
              <p className="text-sm">A point where three or more edges meet</p>
            </Card>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h4 className="font-semibold mb-3 text-purple-800">Euler's Formula</h4>
            <p className="mb-3">For any simple polyhedron, the number of faces (F), vertices (V), and edges (E) are related by:</p>
            <div className="text-center text-2xl font-bold text-purple-700 mb-3">
              F + V - E = 2
            </div>
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Teaching Moment:</strong> Euler's formula is one of the most elegant results in mathematics, connecting seemingly unrelated quantities in a simple equation. It can be used to prove that there are exactly five regular polyhedra (the Platonic solids).
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-primary">The Five Platonic Solids</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
                <h5 className="font-semibold text-yellow-700">Tetrahedron</h5>
                <div className="text-sm space-y-1 mt-2">
                  <p>4 triangular faces</p>
                  <p>6 edges, 4 vertices</p>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h5 className="font-semibold text-blue-700">Cube</h5>
                <div className="text-sm space-y-1 mt-2">
                  <p>6 square faces</p>
                  <p>12 edges, 8 vertices</p>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <h5 className="font-semibold text-green-700">Octahedron</h5>
                <div className="text-sm space-y-1 mt-2">
                  <p>8 triangular faces</p>
                  <p>12 edges, 6 vertices</p>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
                <h5 className="font-semibold text-purple-700">Dodecahedron</h5>
                <div className="text-sm space-y-1 mt-2">
                  <p>12 pentagonal faces</p>
                  <p>30 edges, 20 vertices</p>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
                <h5 className="font-semibold text-red-700">Icosahedron</h5>
                <div className="text-sm space-y-1 mt-2">
                  <p>20 triangular faces</p>
                  <p>30 edges, 12 vertices</p>
                </div>
              </Card>
            </div>
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
              <p className="mb-4">A prism is a polyhedron with two congruent and parallel faces (the bases) connected by rectangular faces.</p>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <p className="font-semibold">Volume Formula:</p>
                  <p className="text-lg">V = Base Area × Height</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-semibold">Surface Area:</p>
                  <p>SA = 2 × Base Area + Perimeter × Height</p>
                </div>
              </div>

              <Alert className="mt-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> Prisms are named after the shape of their bases: triangular prism, rectangular prism, pentagonal prism, etc. They're common in architecture due to their structural stability.
                </AlertDescription>
              </Alert>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <h3 className="text-xl font-semibold text-green-700 mb-4">Pyramids</h3>
              <p className="mb-4">A pyramid is a polyhedron formed by connecting a polygonal base to a point (the apex) with triangular faces.</p>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <p className="font-semibold">Volume Formula:</p>
                  <p className="text-lg">V = (1/3) × Base Area × Height</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-semibold">Surface Area:</p>
                  <p>SA = Base Area + (1/2) × Perimeter × Slant Height</p>
                </div>
              </div>

              <Alert className="mt-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Teaching Moment:</strong> The pyramid shape has been significant in various cultures, most notably in ancient Egypt. The stability of the pyramid shape makes it an enduring architectural form.
                </AlertDescription>
              </Alert>
            </Card>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <h4 className="font-semibold mb-3 text-orange-800">Example Problem: Square Pyramid</h4>
            <p className="mb-3"><strong>Problem:</strong> A square pyramid has a base with side length 6 cm and a height of 8 cm. Calculate its volume and surface area.</p>
            <div className="space-y-2 text-sm">
              <p><strong>Solution:</strong></p>
              <p>Base Area = 6² = 36 cm²</p>
              <p>Volume = (1/3) × 36 × 8 = 96 cm³</p>
              <p>Slant height = √(8² + 3²) = √73 cm</p>
              <p>Surface Area = 36 + (1/2) × 24 × √73 ≈ 138.53 cm²</p>
            </div>
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
              <p className="mb-4 text-sm">A cylinder is bounded by a curved lateral surface and two parallel circular bases.</p>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <p className="font-semibold text-sm">Volume:</p>
                  <p className="text-lg">V = πr²h</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-semibold text-sm">Surface Area:</p>
                  <p>SA = 2πr² + 2πrh</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
              <h3 className="text-xl font-semibold text-green-700 mb-4">Cones</h3>
              <p className="mb-4 text-sm">A cone has a circular base and a curved lateral surface that tapers to an apex.</p>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <p className="font-semibold text-sm">Volume:</p>
                  <p className="text-lg">V = (1/3)πr²h</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-semibold text-sm">Surface Area:</p>
                  <p>SA = πr² + πrs</p>
                  <p className="text-xs">(s = slant height)</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <h3 className="text-xl font-semibold text-purple-700 mb-4">Spheres</h3>
              <p className="mb-4 text-sm">A sphere is where all points are equidistant from a fixed center point.</p>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <p className="font-semibold text-sm">Volume:</p>
                  <p className="text-lg">V = (4/3)πr³</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-semibold text-sm">Surface Area:</p>
                  <p>SA = 4πr²</p>
                </div>
              </div>
            </Card>
          </div>

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Teaching Moment:</strong> Spheres have perfect symmetry and unique properties: they enclose the maximum volume for a given surface area, which is why bubbles form spheres and planets are roughly spherical.
            </AlertDescription>
          </Alert>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h4 className="font-semibold mb-3 text-red-800">Example Problem: Cone Calculations</h4>
            <p className="mb-3"><strong>Problem:</strong> A cone has a base radius of 5 cm and height of 12 cm. Calculate its volume and surface area.</p>
            <div className="space-y-2 text-sm">
              <p><strong>Solution:</strong></p>
              <p>Volume = (1/3) × π × 5² × 12 = 100π cm³ ≈ 314.16 cm³</p>
              <p>Slant height = √(12² + 5²) = √169 = 13 cm</p>
              <p>Surface Area = π × 5² + π × 5 × 13 = 25π + 65π = 90π cm² ≈ 282.74 cm²</p>
            </div>
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
                <strong>Teaching Moment:</strong> Cross-sections reveal the internal structure of 3D objects and are crucial in fields like medicine (CT scans), geology (rock strata), and engineering (structural analysis).
              </AlertDescription>
            </Alert>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-3">Common Cross-Sections</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Cube:</strong> Square, rectangle, triangle, or hexagon</p>
                <p><strong>Cylinder:</strong> Circle, rectangle, or ellipse</p>
                <p><strong>Cone:</strong> Circle, triangle, hyperbola, ellipse, or parabola</p>
                <p><strong>Sphere:</strong> Always a circle</p>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <h4 className="font-semibold text-green-700 mb-3">Projections</h4>
              <p className="text-sm mb-3">A projection maps a 3D object onto a 2D surface.</p>
              <div className="space-y-2 text-sm">
                <p><strong>Orthographic:</strong> Projecting lines perpendicular to plane</p>
                <p><strong>Perspective:</strong> Projecting lines converge at viewpoint</p>
              </div>
            </Card>
          </div>

          <div className="bg-violet-50 p-6 rounded-lg border border-violet-200">
            <h4 className="font-semibold mb-3 text-violet-800">Example Problem: Cube Cross-Section</h4>
            <p className="mb-3"><strong>Problem:</strong> A cube with side length 4 cm is cut by a plane passing through the midpoints of three edges meeting at a vertex. Describe and calculate the area of the cross-section.</p>
            <div className="space-y-2 text-sm">
              <p><strong>Solution:</strong></p>
              <p>The cross-section is a triangle with vertices at (2,0,0), (0,2,0), and (0,0,2)</p>
              <p>Using the cross product method: Area = 2√3 cm² ≈ 3.46 cm²</p>
            </div>
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
                <h4 className="font-semibold text-blue-800 mb-2">Problem 1</h4>
                <p className="text-sm">Find the distance between points A(2, 3, 4) and B(5, 7, 1).</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Problem 2</h4>
                <p className="text-sm">A rectangular prism has length 5 cm, width 3 cm, and height 4 cm. Calculate its volume and surface area.</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Problem 3</h4>
                <p className="text-sm">A cone has base radius 6 cm and height 8 cm. Calculate its volume and surface area.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">Problem 4</h4>
                <p className="text-sm">A sphere has radius 5 cm. Calculate its volume and surface area.</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">Problem 5</h4>
                <p className="text-sm">A cube with side length 6 cm is cut by a plane parallel to one face and 2 cm away. Describe the cross-section and calculate its area.</p>
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
              <strong>Teaching Moment:</strong> Three-dimensional geometry connects abstract mathematical concepts to the physical world we live in. The formulas and principles we've learned have practical applications in architecture, engineering, manufacturing, art, and many other fields.
            </AlertDescription>
          </Alert>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Next Steps</h3>
            <p>In the next module, we will explore coordinate geometry, which combines algebra and geometry to solve problems using coordinates. We'll learn how to represent geometric shapes algebraically and use algebraic techniques to analyze geometric properties.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};