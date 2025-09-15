import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import vectorBasicsImage from '@/assets/vector-basics.png';
import vectorOperationsImage from '@/assets/vector-operations.png';
import dotCrossProductImage from '@/assets/dot-cross-product.png';
import vectorGeometryImage from '@/assets/vector-geometry.png';

export const VectorsLesson: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button 
        variant="outline" 
        onClick={() => navigate('/courses/geometry')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Overview
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Module 8: Vectors and Vector Geometry</h1>
        <p className="text-lg text-muted-foreground">Mathematical Objects with Magnitude and Direction</p>
      </div>

      {/* Introduction */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <p className="text-lg leading-relaxed mb-6">
            Welcome to Module 8 of our Geometry course! In this module, we will explore vectors and vector geometry. 
            Vectors are mathematical objects that have both magnitude and direction, making them ideal for representing 
            quantities like force, velocity, and displacement. We will learn how to perform operations with vectors and 
            how to apply vector methods to solve geometric problems.
          </p>
          
          <Alert className="border-blue-200 bg-blue-50 mb-6">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <h4 className="font-bold mb-2">Teaching Moment:</h4>
              <p>
                Vectors represent one of the most powerful and versatile tools in mathematics and physics. Unlike scalars, 
                which only have magnitude, vectors capture both "how much" and "which way"—a crucial distinction in many 
                real-world scenarios. When you push an object, both the strength of your push and its direction determine 
                the outcome. When a plane flies, both its speed and heading matter. Vectors provide a natural language 
                for describing such situations.
              </p>
            </AlertDescription>
          </Alert>

          <div className="mb-8">
            <img 
              src={vectorBasicsImage} 
              alt="Vector representation with arrows showing magnitude and direction"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">By the end of this module, you will be able to:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Understand the concept of vectors and their geometric representation</li>
            <li>Perform vector operations including addition, subtraction, and scalar multiplication</li>
            <li>Calculate the dot product and cross product of vectors</li>
            <li>Apply vectors to solve problems involving distances, angles, and projections</li>
            <li>Use vector methods to analyze geometric shapes and their properties</li>
            <li>Recognize the applications of vectors in physics and engineering</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 1: Introduction to Vectors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Section 1: Introduction to Vectors</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-3">What is a Vector?</h3>
          <p className="mb-6">
            A vector is a mathematical object that has both magnitude (size) and direction. In contrast, 
            a scalar has only magnitude.
          </p>
          
          <Alert className="border-violet-200 bg-violet-50 mb-6">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <h4 className="font-bold mb-2">Teaching Moment:</h4>
              <p>
                The distinction between vectors and scalars is fundamental in mathematics and physics. 
                Temperature, mass, and time are scalars—they're completely described by a single number. 
                But displacement, velocity, and force are vectors—knowing only their magnitude isn't enough; 
                you need their direction too.
              </p>
            </AlertDescription>
          </Alert>

          <h3 className="text-lg font-semibold mb-3">Geometric Representation of Vectors</h3>
          <p className="mb-6">
            A vector can be represented geometrically as a directed line segment (an arrow). The length 
            of the arrow represents the magnitude of the vector, and the direction of the arrow represents 
            the direction of the vector.
          </p>

          <h3 className="text-lg font-semibold mb-3">Vector Notation</h3>
          <p className="mb-6">
            A vector is often denoted by a bold lowercase letter (e.g., <strong>v</strong>) or by a 
            letter with an arrow above it. The magnitude (or length) of a vector <strong>v</strong> is 
            denoted by |<strong>v</strong>| or ||<strong>v</strong>||.
          </p>

          <h3 className="text-lg font-semibold mb-3">Components of a Vector</h3>
          <p className="mb-6">
            In a coordinate system, a vector can be represented by its components along the coordinate axes. 
            In two dimensions, a vector <strong>v</strong> can be written as <strong>v</strong> = (v₁, v₂) 
            or <strong>v</strong> = v₁<strong>i</strong> + v₂<strong>j</strong>, where v₁ and v₂ are the 
            components, and <strong>i</strong> and <strong>j</strong> are the unit vectors along the x and y axes.
          </p>

          <h3 className="text-lg font-semibold mb-3">Magnitude of a Vector</h3>
          <p className="mb-4">
            The magnitude of a vector <strong>v</strong> = (v₁, v₂) in two dimensions is given by:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-center font-mono">|<strong>v</strong>| = √(v₁² + v₂²)</p>
          </div>
          <p className="mb-6">
            In three dimensions, for a vector <strong>v</strong> = (v₁, v₂, v₃), the magnitude is:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-center font-mono">|<strong>v</strong>| = √(v₁² + v₂² + v₃²)</p>
          </div>

          <h3 className="text-lg font-semibold mb-3">Unit Vectors</h3>
          <p className="mb-4">
            A unit vector is a vector with a magnitude of 1. Given a non-zero vector <strong>v</strong>, 
            the corresponding unit vector in the same direction is:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-center font-mono"><strong>û</strong> = <strong>v</strong> / |<strong>v</strong>|</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Example Problem:</h4>
            <p className="mb-2">Given a vector <strong>v</strong> = (3, 4), find its magnitude and the corresponding unit vector.</p>
            <h5 className="font-semibold">Solution:</h5>
            <p className="mb-2">Step 1: Calculate the magnitude: |<strong>v</strong>| = √(3² + 4²) = √(9 + 16) = √25 = 5</p>
            <p>Step 2: Find the unit vector: <strong>û</strong> = (3, 4) / 5 = (0.6, 0.8)</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Vector Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Section 2: Vector Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <img 
              src={vectorOperationsImage} 
              alt="Vector operations: addition, subtraction, and scalar multiplication"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>

          <h3 className="text-lg font-semibold mb-3">Vector Addition</h3>
          <p className="mb-6">
            The sum of two vectors <strong>a</strong> and <strong>b</strong> is a vector <strong>c</strong> = <strong>a</strong> + <strong>b</strong>. 
            Geometrically, vector addition follows the parallelogram law or the tip-to-tail method. In component form, 
            if <strong>a</strong> = (a₁, a₂) and <strong>b</strong> = (b₁, b₂), then <strong>a</strong> + <strong>b</strong> = (a₁ + b₁, a₂ + b₂).
          </p>

          <h3 className="text-lg font-semibold mb-3">Vector Subtraction</h3>
          <p className="mb-6">
            The difference of two vectors <strong>a</strong> and <strong>b</strong> is a vector <strong>c</strong> = <strong>a</strong> - <strong>b</strong>. 
            Geometrically, <strong>a</strong> - <strong>b</strong> is the vector from the head of <strong>b</strong> to the head of <strong>a</strong> 
            when the tails are placed at the same point. In component form: <strong>a</strong> - <strong>b</strong> = (a₁ - b₁, a₂ - b₂).
          </p>

          <h3 className="text-lg font-semibold mb-3">Scalar Multiplication</h3>
          <p className="mb-6">
            The product of a scalar k and a vector <strong>v</strong> is a vector k<strong>v</strong> that has the same 
            direction as <strong>v</strong> if k &gt; 0, the opposite direction if k &lt; 0, and is the zero vector if k = 0. 
            The magnitude of k<strong>v</strong> is |k| times the magnitude of <strong>v</strong>. In component form: k<strong>v</strong> = (kv₁, kv₂).
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Example Problem:</h4>
            <p className="mb-2">Given vectors <strong>a</strong> = (2, 3) and <strong>b</strong> = (4, -1), calculate:</p>
            <p className="mb-1">a) <strong>a</strong> + <strong>b</strong></p>
            <p className="mb-1">b) <strong>a</strong> - <strong>b</strong></p>
            <p className="mb-2">c) 2<strong>a</strong> - 3<strong>b</strong></p>
            <h5 className="font-semibold">Solution:</h5>
            <p className="mb-1">a) <strong>a</strong> + <strong>b</strong> = (2, 3) + (4, -1) = (6, 2)</p>
            <p className="mb-1">b) <strong>a</strong> - <strong>b</strong> = (2, 3) - (4, -1) = (-2, 4)</p>
            <p>c) 2<strong>a</strong> - 3<strong>b</strong> = 2(2, 3) - 3(4, -1) = (4, 6) - (12, -3) = (-8, 9)</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Dot Product and Cross Product */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Section 3: Dot Product and Cross Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <img 
              src={dotCrossProductImage} 
              alt="Dot product and cross product geometric interpretations"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>

          <h3 className="text-lg font-semibold mb-3">Definition of Dot Product</h3>
          <p className="mb-4">
            The dot product (or scalar product) of two vectors <strong>a</strong> and <strong>b</strong> is denoted by <strong>a</strong> · <strong>b</strong> and is defined as:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-center font-mono"><strong>a</strong> · <strong>b</strong> = |<strong>a</strong>| |<strong>b</strong>| cos(θ)</p>
          </div>
          <p className="mb-6">
            where θ is the angle between the vectors. In component form, if <strong>a</strong> = (a₁, a₂, a₃) and <strong>b</strong> = (b₁, b₂, b₃), then:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-center font-mono"><strong>a</strong> · <strong>b</strong> = a₁b₁ + a₂b₂ + a₃b₃</p>
          </div>

          <h3 className="text-lg font-semibold mb-3">Applications of the Dot Product</h3>
          <ul className="space-y-2 list-disc list-inside mb-6">
            <li><strong>Finding angles:</strong> cos(θ) = (<strong>a</strong> · <strong>b</strong>) / (|<strong>a</strong>| |<strong>b</strong>|)</li>
            <li><strong>Determining orthogonality:</strong> Two vectors are perpendicular if their dot product is zero</li>
            <li><strong>Calculating work:</strong> Work = Force · Displacement</li>
            <li><strong>Finding projections:</strong> Scalar projection of <strong>a</strong> onto <strong>b</strong> is (<strong>a</strong> · <strong>b</strong>) / |<strong>b</strong>|</li>
          </ul>

          <h3 className="text-lg font-semibold mb-3">Definition of Cross Product</h3>
          <p className="mb-4">
            The cross product (or vector product) of two vectors <strong>a</strong> and <strong>b</strong> is denoted by <strong>a</strong> × <strong>b</strong> 
            and is a vector perpendicular to both <strong>a</strong> and <strong>b</strong>, with magnitude:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-center font-mono">|<strong>a</strong> × <strong>b</strong>| = |<strong>a</strong>| |<strong>b</strong>| sin(θ)</p>
          </div>
          <p className="mb-6">
            The direction is determined by the right-hand rule. In component form:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-center font-mono"><strong>a</strong> × <strong>b</strong> = (a₂b₃ - a₃b₂, a₃b₁ - a₁b₃, a₁b₂ - a₂b₁)</p>
          </div>

          <h3 className="text-lg font-semibold mb-3">Applications of the Cross Product</h3>
          <ul className="space-y-2 list-disc list-inside mb-6">
            <li>Finding a vector perpendicular to two given vectors</li>
            <li>Calculating the area of a parallelogram: Area = |<strong>a</strong> × <strong>b</strong>|</li>
            <li>Determining torque in physics: Torque = Position × Force</li>
            <li>Computing normal vectors to planes</li>
          </ul>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Example Problem:</h4>
            <p className="mb-2">Given vectors <strong>a</strong> = (3, 4, 0) and <strong>b</strong> = (1, 2, 2), find:</p>
            <p className="mb-1">a) <strong>a</strong> · <strong>b</strong></p>
            <p className="mb-2">b) The angle between <strong>a</strong> and <strong>b</strong></p>
            <h5 className="font-semibold">Solution:</h5>
            <p className="mb-1">a) <strong>a</strong> · <strong>b</strong> = (3)(1) + (4)(2) + (0)(2) = 3 + 8 + 0 = 11</p>
            <p className="mb-1">b) |<strong>a</strong>| = √(3² + 4² + 0²) = 5, |<strong>b</strong>| = √(1² + 2² + 2²) = 3</p>
            <p>cos(θ) = 11/(5 × 3) = 11/15, so θ ≈ 42.8°</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Vectors in Geometry */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Section 4: Vectors in Geometry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <img 
              src={vectorGeometryImage} 
              alt="Geometric applications of vectors in lines, planes, and distances"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>

          <h3 className="text-lg font-semibold mb-3">Vector Equation of a Line</h3>
          <p className="mb-4">
            A line passing through a point <strong>p₀</strong> in the direction of a non-zero vector <strong>v</strong> can be represented parametrically as:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-center font-mono"><strong>p</strong>(t) = <strong>p₀</strong> + t<strong>v</strong></p>
          </div>

          <h3 className="text-lg font-semibold mb-3">Vector Equation of a Plane</h3>
          <p className="mb-4">
            A plane passing through a point <strong>p₀</strong> and perpendicular to a non-zero vector <strong>n</strong> (the normal vector) can be represented as:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-center font-mono"><strong>n</strong> · (<strong>p</strong> - <strong>p₀</strong>) = 0</p>
          </div>

          <h3 className="text-lg font-semibold mb-3">Distance from a Point to a Line</h3>
          <p className="mb-4">
            The distance from a point <strong>p</strong> to a line passing through point <strong>p₀</strong> in the direction of unit vector <strong>û</strong> is:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-center font-mono">d = |(<strong>p</strong> - <strong>p₀</strong>) × <strong>û</strong>|</p>
          </div>

          <h3 className="text-lg font-semibold mb-3">Distance from a Point to a Plane</h3>
          <p className="mb-4">
            The distance from a point <strong>p</strong> to a plane with normal unit vector <strong>n̂</strong> passing through point <strong>p₀</strong> is:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-center font-mono">d = |(<strong>p</strong> - <strong>p₀</strong>) · <strong>n̂</strong>|</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Example Problem:</h4>
            <p className="mb-2">Find the distance from point P(2, 3, 4) to the plane passing through Q(1, 0, 2) with normal vector <strong>n</strong> = (3, 6, 2).</p>
            <h5 className="font-semibold">Solution:</h5>
            <p className="mb-1">Step 1: Normalize the normal vector: |<strong>n</strong>| = √(3² + 6² + 2²) = 7</p>
            <p className="mb-1">Step 2: <strong>n̂</strong> = (3/7, 6/7, 2/7)</p>
            <p className="mb-1">Step 3: <strong>P</strong> - <strong>Q</strong> = (1, 3, 2)</p>
            <p>Step 4: d = |(1)(3/7) + (3)(6/7) + (2)(2/7)| = |25/7| = 25/7 ≈ 3.57 units</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Applications in Physics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Section 5: Applications of Vectors in Physics</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-3">Forces and Torques</h3>
          <p className="mb-4">
            In physics, forces are represented as vectors with magnitude (strength) and direction. The net force on an object is the vector sum of all individual forces.
          </p>
          <p className="mb-6">
            Torque, which causes rotational motion, is calculated as the cross product of the position vector and the force vector:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-center font-mono"><strong>τ</strong> = <strong>r</strong> × <strong>F</strong></p>
          </div>

          <h3 className="text-lg font-semibold mb-3">Velocity and Acceleration</h3>
          <p className="mb-6">
            In kinematics, velocity and acceleration are vector quantities. The velocity vector points in the direction of motion, 
            and its magnitude is the speed. The acceleration vector represents the rate of change of velocity.
          </p>

          <h3 className="text-lg font-semibold mb-3">Work and Energy</h3>
          <p className="mb-4">
            Work done by a force is calculated as the dot product of the force vector and the displacement vector:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-center font-mono">W = <strong>F</strong> · <strong>d</strong></p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Example Problem:</h4>
            <p className="mb-2">A force <strong>F</strong> = (3, 4, 0) N is applied to an object, causing it to move along the displacement vector <strong>d</strong> = (5, 0, 0) m. Calculate the work done.</p>
            <h5 className="font-semibold">Solution:</h5>
            <p>W = <strong>F</strong> · <strong>d</strong> = (3)(5) + (4)(0) + (0)(0) = 15 joules</p>
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
              <h4 className="font-semibold mb-2">1. Vector Operations:</h4>
              <p className="text-sm">Given vectors <strong>a</strong> = (2, -3, 1) and <strong>b</strong> = (4, 1, -2), calculate <strong>a</strong> + <strong>b</strong>, <strong>a</strong> - <strong>b</strong>, and 2<strong>a</strong> - 3<strong>b</strong>.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Dot Product and Angles:</h4>
              <p className="text-sm">Find the dot product of vectors <strong>p</strong> = (3, 0, -2) and <strong>q</strong> = (1, 4, 5), and determine the angle between them.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Cross Product:</h4>
              <p className="text-sm">Calculate the cross product <strong>a</strong> × <strong>b</strong> for vectors <strong>a</strong> = (1, 2, 3) and <strong>b</strong> = (4, 0, -1), and verify that it is perpendicular to both <strong>a</strong> and <strong>b</strong>.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Distance Calculations:</h4>
              <p className="text-sm">Find the distance from point P(3, 1, 2) to the line passing through Q(1, 0, 1) in the direction of vector <strong>v</strong> = (2, 2, 0).</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">5. Work in Physics:</h4>
              <p className="text-sm">Calculate the work done by force <strong>F</strong> = (2, 3, -1) N when it moves an object along displacement <strong>d</strong> = (4, -2, 5) m.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            In this module, we have explored vectors and vector geometry. We have learned about vector operations, 
            dot and cross products, and how to apply vectors to solve geometric and physical problems. We have seen 
            how vectors provide a powerful framework for understanding and analyzing quantities with both magnitude and direction.
          </p>
          
          <Alert className="border-purple-200 bg-purple-50">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <h4 className="font-bold mb-2">Teaching Moment:</h4>
              <p>
                Vectors represent one of mathematics' most elegant and practical innovations. They unify algebra and geometry, 
                providing both visual intuition and computational precision. The vector approach often simplifies problems 
                that would be cumbersome with traditional methods. As you continue your mathematical journey, you'll find that 
                vector thinking provides insights and techniques that extend far beyond geometry, forming a foundation for 
                understanding the physical world and creating computational models of reality.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This module completes our exploration of geometry. The concepts and techniques you have learned provide a solid 
            foundation for further study in mathematics, physics, engineering, and computer science. You can now apply these 
            geometric principles to solve a wide range of problems and deepen your understanding of the spatial world around us.
          </p>
          
          <Alert className="border-blue-200 bg-blue-50">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <h4 className="font-bold mb-2">Teaching Moment:</h4>
              <p>
                As we conclude our geometry course, it's worth reflecting on the journey we've taken. We started with basic 
                concepts and progressed through increasingly sophisticated topics, culminating in vectors. The skills you've 
                developed—spatial reasoning, logical deduction, algebraic manipulation, and vector analysis—are valuable across 
                numerous fields. Geometry is one of humanity's oldest intellectual pursuits, yet it remains vibrantly relevant 
                in our modern world.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};