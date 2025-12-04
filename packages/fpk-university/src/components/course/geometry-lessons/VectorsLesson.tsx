import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import vector geometry images
import vectorsGeometryImg from '@/assets/vectors-geometry.png';
import vectorsIntroImg from '@/assets/vectors-intro.png';
import vectorOperationsImg from '@/assets/vector-operations.png';
import crossProductImg from '@/assets/cross-product.png';

export const VectorsLesson: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button 
        variant="outline" 
        onClick={() => {
          console.log('🔄 Back button clicked - navigating to /courses/geometry');
          navigate('/courses/geometry');
        }}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Course Overview
      </Button>

      {/* Module Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-6">Module 8: Vectors and Vector Geometry</h1>
        <div className="mb-6">
          <img 
            src={vectorsGeometryImg} 
            alt="Vectors and Vector Geometry illustration" 
            className="mx-auto rounded-lg shadow-lg max-w-md w-full"
          />
        </div>
      </div>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Introduction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed mb-4">
            Welcome to Module 8 of our Geometry course! In this module, we will explore vectors and vector geometry. Vectors are mathematical objects that have both magnitude and direction, making them ideal for representing quantities like force, velocity, and displacement. We will learn how to perform operations with vectors and how to apply vector methods to solve geometric problems.
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mb-4">
            <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
            <p className="text-sm leading-relaxed">
              Vectors represent one of the most powerful and versatile tools in mathematics and physics. Unlike scalars, which only have magnitude, vectors capture both "how much" and "which way"—a crucial distinction in many real-world scenarios. When you push an object, both the strength of your push and its direction determine the outcome. When a plane flies, both its speed and heading matter. Vectors provide a natural language for describing such situations. The concept of vectors emerged from multiple mathematical traditions, including the work of mathematicians like Hamilton, Grassmann, and Gibbs in the 19th century. Today, vectors are fundamental not just in geometry and physics, but also in computer graphics, machine learning, and countless other fields. As you learn about vectors, you're acquiring a tool that bridges pure mathematics and practical applications in a uniquely powerful way.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">By the end of this module, you will be able to:</p>
          <ul className="list-disc list-inside space-y-2 text-sm">
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
          <CardTitle className="text-2xl text-primary">Section 1: Introduction to Vectors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <h3 className="text-xl font-semibold mb-3">What is a Vector?</h3>
            <p className="mb-4">
              A vector is a mathematical object that has both magnitude (size) and direction. In contrast, a scalar has only magnitude.
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mb-4">
              <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
              <p className="text-sm leading-relaxed">
                The distinction between vectors and scalars is fundamental in mathematics and physics. Temperature, mass, and time are scalars—they're completely described by a single number. But displacement, velocity, and force are vectors—knowing only their magnitude isn't enough; you need their direction too. This distinction becomes clear when you consider a simple example: walking 5 miles north versus 5 miles south. The distance (5 miles) is the same in both cases, but the destinations are very different because the directions differ. Vectors capture this essential directional quality that scalars cannot. This conceptual leap—from one-dimensional quantities to directed quantities—was a significant advancement in mathematical thinking, enabling more precise descriptions of physical phenomena and more powerful problem-solving techniques.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Geometric Representation of Vectors</h3>
            <p className="mb-4">
              A vector can be represented geometrically as a directed line segment (an arrow). The length of the arrow represents the magnitude of the vector, and the direction of the arrow represents the direction of the vector.
            </p>
            
            <div className="mb-6">
              <img 
                src={vectorsIntroImg} 
                alt="Vector geometric representation showing arrows with magnitude and direction" 
                className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mb-4">
              <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
              <p className="text-sm leading-relaxed">
                The arrow representation of vectors provides an intuitive visual understanding that complements the algebraic definition. The starting point of the arrow is called the "tail" or "initial point," and the endpoint is called the "head" or "terminal point." A key insight is that vectors with the same length and direction are considered equal, regardless of their position in space. This is known as the "free vector" concept—vectors are defined by their magnitude and direction, not by their specific location. This property distinguishes vectors from points and allows us to move vectors around (parallel to themselves) without changing their essential nature. This freedom to translate vectors while preserving their identity is crucial for many applications, from force diagrams in physics to geometric transformations in computer graphics.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Vector Notation</h3>
            <p className="mb-4">
              A vector is often denoted by a bold lowercase letter (e.g., <strong>v</strong>) or by a letter with an arrow above it (e.g., <span className="font-mono">v⃗</span>). The magnitude (or length) of a vector v is denoted by |v| or ||v||.
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mb-4">
              <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
              <p className="text-sm leading-relaxed">
                The notation for vectors has evolved over time and varies across disciplines. In handwritten work, vectors are often indicated with an arrow above the symbol, while in printed text, bold typeface is common. In physics, unit vectors (vectors with magnitude 1) in the coordinate directions are often denoted by î, ĵ, and k̂, with the "hat" indicating a unit vector. The magnitude notation |v| emphasizes that we're extracting a scalar (the length) from a vector quantity. These notational conventions help distinguish vectors from scalars and points, preventing confusion in complex expressions. Being fluent with vector notation is essential for reading and communicating mathematical ideas across various scientific and engineering fields.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Components of a Vector</h3>
            <p className="mb-4">
              In a coordinate system, a vector can be represented by its components along the coordinate axes. In two dimensions, a vector <strong>v</strong> can be written as <strong>v</strong> = (v₁, v₂) or <strong>v</strong> = v₁<strong>i</strong> + v₂<strong>j</strong>, where v₁ and v₂ are the components, and <strong>i</strong> and <strong>j</strong> are the unit vectors along the x and y axes, respectively.
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mb-4">
              <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
              <p className="text-sm leading-relaxed">
                The component representation of vectors connects the geometric view (arrows) with the algebraic view (ordered pairs or triples). This connection is a powerful example of the algebraic-geometric synthesis that characterizes modern mathematics. The components tell us "how much" of the vector points in each coordinate direction. For example, a vector (3, 4) means "3 units in the x-direction and 4 units in the y-direction." The unit vectors <strong>i</strong> and <strong>j</strong> represent the standard basis—vectors of length 1 pointing along the positive x and y axes. Any vector can be expressed as a linear combination of these basis vectors, which is why the expression v₁<strong>i</strong> + v₂<strong>j</strong> is equivalent to (v₁, v₂). This component representation facilitates calculations and connects vectors to matrices and linear transformations in more advanced mathematics.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Magnitude of a Vector</h3>
            <p className="mb-4">
              The magnitude of a vector <strong>v</strong> = (v₁, v₂) in two dimensions is given by:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <p className="text-center font-mono text-lg">|v| = √(v₁² + v₂²)</p>
            </div>
            <p className="mb-4">
              In three dimensions, for a vector <strong>v</strong> = (v₁, v₂, v₃), the magnitude is:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <p className="text-center font-mono text-lg">|v| = √(v₁² + v₂² + v₃²)</p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mb-4">
              <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
              <p className="text-sm leading-relaxed">
                The magnitude formula is a direct application of the Pythagorean theorem. In two dimensions, we can visualize the vector as the hypotenuse of a right triangle, with the components forming the other two sides. The formula |v| = √(v₁² + v₂²) is just the Pythagorean theorem applied to this triangle. In three dimensions, the formula extends this concept using the distance formula in 3D space. This connection to the Pythagorean theorem illustrates how vector geometry builds on earlier geometric principles. The magnitude formula is used in countless applications, from calculating the resultant force in physics to determining the speed of an object given its velocity components. It's also the foundation for defining the distance between points in vector spaces, which is crucial in fields ranging from quantum mechanics to machine learning.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Unit Vectors</h3>
            <p className="mb-4">
              A unit vector is a vector with a magnitude of 1. Given a non-zero vector <strong>v</strong>, the corresponding unit vector in the same direction is:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <p className="text-center font-mono text-lg">û = v / |v|</p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mb-4">
              <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
              <p className="text-sm leading-relaxed">
                Unit vectors are like the "direction indicators" of vector geometry. They preserve the direction of a vector while standardizing its length to 1. This normalization is useful in many contexts where we want to focus on direction rather than magnitude. For example, in physics, we might use unit vectors to specify the direction of a force or the orientation of an axis. In computer graphics, unit vectors are essential for calculating reflections and lighting effects. The process of finding a unit vector—dividing by the magnitude—is called "normalization." This operation is so common that many programming libraries include a "normalize" function specifically for this purpose. Unit vectors also play a crucial role in defining coordinate systems and in the study of vector spaces, where they form the basis for more complex structures.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Problem-Solving Approach: Working with Vector Basics</h3>
            <p className="mb-4">When solving problems involving basic vector concepts, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li><strong>Identify the vectors:</strong> Determine which quantities are vectors and which are scalars.</li>
              <li><strong>Represent vectors appropriately:</strong> Use component form, magnitude-direction form, or geometric representation as needed.</li>
              <li><strong>Apply relevant formulas:</strong> Use formulas for magnitude, unit vectors, or other properties as required.</li>
              <li><strong>Interpret the results:</strong> Relate the mathematical solution back to the original problem context.</li>
            </ol>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Example Problem:</h4>
              <p className="mb-2">Given a vector <strong>v</strong> = (3, 4), find its magnitude and the corresponding unit vector.</p>
              
              <h5 className="font-medium mt-4 mb-2">Solution:</h5>
              <p className="mb-2"><strong>Step 1:</strong> Calculate the magnitude using the formula |v| = √(v₁² + v₂²).</p>
              <ul className="list-disc list-inside ml-4 mb-3">
                <li>|v| = √(3² + 4²)</li>
                <li>|v| = √(9 + 16)</li>
                <li>|v| = √25</li>
                <li>|v| = 5</li>
              </ul>
              
              <p className="mb-2"><strong>Step 2:</strong> Find the unit vector using the formula û = v / |v|.</p>
              <ul className="list-disc list-inside ml-4 mb-3">
                <li>û = (3, 4) / 5</li>
                <li>û = (3/5, 4/5)</li>
                <li>û = (0.6, 0.8)</li>
              </ul>
              
              <p className="font-medium">Therefore, the magnitude of vector <strong>v</strong> is 5, and the corresponding unit vector is û = (0.6, 0.8).</p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mt-4">
              <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
              <p className="text-sm leading-relaxed">
                This problem illustrates the basic process of finding a vector's magnitude and normalizing it to create a unit vector. The magnitude calculation is a straightforward application of the Pythagorean theorem. Notice that the resulting unit vector (0.6, 0.8) points in exactly the same direction as the original vector (3, 4), but has a length of 1. We can verify this by calculating its magnitude: √(0.6² + 0.8²) = √(0.36 + 0.64) = √1 = 1. This example demonstrates how unit vectors preserve direction while standardizing magnitude, a property that makes them valuable in many applications where only the directional aspect of a vector is relevant.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Vector Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Section 2: Vector Operations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Vector Addition</h3>
            <p className="mb-4">
              The sum of two vectors <strong>a</strong> and <strong>b</strong> is a vector <strong>c</strong> = <strong>a</strong> + <strong>b</strong>. Geometrically, vector addition follows the parallelogram law or the tip-to-tail method.
            </p>
            <p className="mb-4">
              In component form, if <strong>a</strong> = (a₁, a₂) and <strong>b</strong> = (b₁, b₂), then <strong>a</strong> + <strong>b</strong> = (a₁ + b₁, a₂ + b₂).
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mb-4">
              <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
              <p className="text-sm leading-relaxed">
                Vector addition has a beautiful geometric interpretation: if you place the tail of vector <strong>b</strong> at the head of vector <strong>a</strong>, the sum <strong>a</strong> + <strong>b</strong> is the vector from the tail of <strong>a</strong> to the head of <strong>b</strong>. This "tip-to-tail" method visually demonstrates why vector addition is the appropriate operation for combining displacements, forces, or velocities. For example, if you walk 3 miles east and then 4 miles north, your total displacement is the vector sum of these two movements—a single vector pointing northeast with magnitude 5 miles. The component-wise addition (a₁ + b₁, a₂ + b₂) provides an algebraic method that's equivalent to this geometric process. This equivalence between geometric and algebraic approaches is a hallmark of vector mathematics and illustrates why vectors are so powerful for modeling physical phenomena.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Vector Subtraction</h3>
            <p className="mb-4">
              The difference of two vectors <strong>a</strong> and <strong>b</strong> is a vector <strong>c</strong> = <strong>a</strong> - <strong>b</strong>. Geometrically, <strong>a</strong> - <strong>b</strong> is the vector from the head of <strong>b</strong> to the head of <strong>a</strong> when the tails of <strong>a</strong> and <strong>b</strong> are placed at the same point.
            </p>
            <p className="mb-4">
              In component form, if <strong>a</strong> = (a₁, a₂) and <strong>b</strong> = (b₁, b₂), then <strong>a</strong> - <strong>b</strong> = (a₁ - b₁, a₂ - b₂).
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mb-4">
              <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
              <p className="text-sm leading-relaxed">
                Vector subtraction can be understood as "what vector do I need to add to <strong>b</strong> to get <strong>a</strong>?" Geometrically, if we place the tails of <strong>a</strong> and <strong>b</strong> at the same point, then <strong>a</strong> - <strong>b</strong> is the vector from the head of <strong>b</strong> to the head of <strong>a</strong>. This interpretation is useful in many contexts, such as finding the relative position or velocity between two objects. For example, if two ships are at positions <strong>a</strong> and <strong>b</strong>, then <strong>a</strong> - <strong>b</strong> gives the displacement vector from the second ship to the first. The component-wise subtraction (a₁ - b₁, a₂ - b₂) provides a straightforward computational method. Note that vector subtraction is not commutative: <strong>a</strong> - <strong>b</strong> is generally not the same as <strong>b</strong> - <strong>a</strong>. In fact, <strong>a</strong> - <strong>b</strong> = -(<strong>b</strong> - <strong>a</strong>), which means these vectors have the same magnitude but opposite directions.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Scalar Multiplication</h3>
            <p className="mb-4">
              The product of a scalar k and a vector <strong>v</strong> is a vector k<strong>v</strong> that has the same direction as <strong>v</strong> if k &gt; 0, the opposite direction if k &lt; 0, and is the zero vector if k = 0. The magnitude of k<strong>v</strong> is |k| times the magnitude of <strong>v</strong>.
            </p>
            <p className="mb-4">
              In component form, if <strong>v</strong> = (v₁, v₂), then k<strong>v</strong> = (kv₁, kv₂).
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mb-4">
              <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
              <p className="text-sm leading-relaxed">
                Scalar multiplication "scales" a vector—stretching or shrinking it, and possibly reversing its direction. This operation is fundamental in physics for representing quantities like force (mass × acceleration) or momentum (mass × velocity). It's also essential in computer graphics for operations like scaling objects. The effect of scalar multiplication depends on the value of k: if k &gt; 1, the vector is stretched; if 0 &lt; k &lt; 1, it's shrunk; if k &lt; 0, it's both scaled by |k| and reversed in direction; if k = 0, it becomes the zero vector. The component-wise multiplication (kv₁, kv₂) provides a simple computational method. An important special case is k = -1, which gives the negative of a vector: -<strong>v</strong> = (-1)<strong>v</strong> = (-v₁, -v₂). The negative of a vector has the same magnitude as the original but points in the opposite direction, which is useful for representing opposing forces or reverse movements.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Linear Combination of Vectors</h3>
            <p className="mb-4">
              A linear combination of vectors <strong>v₁</strong>, <strong>v₂</strong>, ..., <strong>vₙ</strong> is an expression of the form c₁<strong>v₁</strong> + c₂<strong>v₂</strong> + ... + cₙ<strong>vₙ</strong>, where c₁, c₂, ..., cₙ are scalars.
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mb-4">
              <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
              <p className="text-sm leading-relaxed">
                Linear combinations are a fundamental concept in linear algebra and vector geometry. They represent the idea of "mixing" vectors in different proportions. For example, if <strong>i</strong> and <strong>j</strong> are the standard unit vectors along the x and y axes, then any vector in the xy-plane can be written as a linear combination a<strong>i</strong> + b<strong>j</strong>, where a and b are scalars. This concept extends to higher dimensions and more general vector spaces. Linear combinations are crucial for understanding concepts like span, linear independence, and basis in linear algebra. They also have practical applications in physics (combining forces or velocities), computer graphics (blending colors or shapes), and statistics (weighted averages). The ability to express complex vectors as combinations of simpler ones is a powerful analytical tool that simplifies many problems in mathematics and its applications.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Example Problem:</h4>
            <p className="mb-2">Given vectors <strong>a</strong> = (2, 3) and <strong>b</strong> = (4, -1), calculate:</p>
            <p className="mb-2">a) <strong>a</strong> + <strong>b</strong></p>
            <p className="mb-2">b) <strong>a</strong> - <strong>b</strong></p>
            <p className="mb-2">c) 2<strong>a</strong> - 3<strong>b</strong></p>
            
             <div className="mb-4">
               <img 
                 src={vectorOperationsImg} 
                 alt="Vector operations diagram showing addition, subtraction, and scalar multiplication" 
                 className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
               />
             </div>
            
            <h5 className="font-medium mt-4 mb-2">Solution:</h5>
            <p className="mb-2">a) <strong>a</strong> + <strong>b</strong> = (2, 3) + (4, -1) = (2 + 4, 3 + (-1)) = (6, 2)</p>
            <p className="mb-2">b) <strong>a</strong> - <strong>b</strong> = (2, 3) - (4, -1) = (2 - 4, 3 - (-1)) = (-2, 4)</p>
            <p className="mb-2">c) 2<strong>a</strong> - 3<strong>b</strong> = 2(2, 3) - 3(4, -1) = (4, 6) - (12, -3) = (4 - 12, 6 - (-3)) = (-8, 9)</p>
            
            <p className="font-medium mt-2">Therefore, <strong>a</strong> + <strong>b</strong> = (6, 2), <strong>a</strong> - <strong>b</strong> = (-2, 4), and 2<strong>a</strong> - 3<strong>b</strong> = (-8, 9).</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Dot Product */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Section 3: Dot Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Definition of Dot Product</h3>
            <p className="mb-4">
              The dot product (or scalar product) of two vectors <strong>a</strong> and <strong>b</strong> is denoted by <strong>a</strong> · <strong>b</strong> and is defined as:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <p className="text-center font-mono text-lg"><strong>a</strong> · <strong>b</strong> = |a| |b| cos(θ)</p>
            </div>
            <p className="mb-4">where θ is the angle between the vectors.</p>
            <p className="mb-4">
              In component form, if <strong>a</strong> = (a₁, a₂, a₃) and <strong>b</strong> = (b₁, b₂, b₃), then:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <p className="text-center font-mono text-lg"><strong>a</strong> · <strong>b</strong> = a₁b₁ + a₂b₂ + a₃b₃</p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mb-4">
              <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
              <p className="text-sm leading-relaxed">
                The dot product is a remarkable operation that converts two vectors into a scalar. This transformation captures how much the vectors are aligned with each other. The formula <strong>a</strong> · <strong>b</strong> = |a| |b| cos(θ) reveals that the dot product is positive when the vectors point in generally the same direction (angle less than 90°), zero when they're perpendicular, and negative when they point in generally opposite directions (angle more than 90°). This geometric interpretation makes the dot product invaluable in physics for calculating work (force · displacement) and in computer graphics for determining lighting effects based on surface orientation. The component form a₁b₁ + a₂b₂ + a₃b₃ provides a computational method that doesn't require knowing the angle explicitly. This duality—having both geometric and algebraic interpretations—is what makes the dot product such a powerful and versatile tool in mathematics and its applications.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Properties of the Dot Product</h3>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li><strong>Commutative:</strong> <strong>a</strong> · <strong>b</strong> = <strong>b</strong> · <strong>a</strong></li>
              <li><strong>Distributive over addition:</strong> <strong>a</strong> · (<strong>b</strong> + <strong>c</strong>) = <strong>a</strong> · <strong>b</strong> + <strong>a</strong> · <strong>c</strong></li>
              <li><strong>Scalar multiplication:</strong> (k<strong>a</strong>) · <strong>b</strong> = k(<strong>a</strong> · <strong>b</strong>) = <strong>a</strong> · (k<strong>b</strong>)</li>
              <li><strong>Self-dot product:</strong> <strong>a</strong> · <strong>a</strong> = |a|²</li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Applications of the Dot Product</h3>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li><strong>Finding the angle between vectors:</strong> cos(θ) = (<strong>a</strong> · <strong>b</strong>) / (|a| |b|)</li>
              <li><strong>Determining orthogonality:</strong> Two vectors are perpendicular (orthogonal) if and only if their dot product is zero.</li>
              <li><strong>Calculating work in physics:</strong> Work = Force · Displacement</li>
              <li><strong>Finding the projection of one vector onto another:</strong> The scalar projection of <strong>a</strong> onto <strong>b</strong> is (<strong>a</strong> · <strong>b</strong>) / |b|</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Example Problem:</h4>
            <p className="mb-2">Given vectors <strong>a</strong> = (3, 4, 0) and <strong>b</strong> = (1, 2, 2), find:</p>
            <p className="mb-2">a) <strong>a</strong> · <strong>b</strong></p>
            <p className="mb-2">b) The angle between <strong>a</strong> and <strong>b</strong></p>
            <p className="mb-2">c) The scalar projection of <strong>a</strong> onto <strong>b</strong></p>
            
            <h5 className="font-medium mt-4 mb-2">Solution:</h5>
            <p className="mb-2"><strong>a)</strong> Calculate the dot product using the component formula.</p>
            <ul className="list-disc list-inside ml-4 mb-3">
              <li><strong>a</strong> · <strong>b</strong> = (3)(1) + (4)(2) + (0)(2) = 3 + 8 + 0 = 11</li>
            </ul>
            
            <p className="mb-2"><strong>b)</strong> Find the angle using the formula cos(θ) = (<strong>a</strong> · <strong>b</strong>) / (|a| |b|).</p>
            <ul className="list-disc list-inside ml-4 mb-3">
              <li>|a| = √(3² + 4² + 0²) = √(9 + 16) = √25 = 5</li>
              <li>|b| = √(1² + 2² + 2²) = √(1 + 4 + 4) = √9 = 3</li>
              <li>cos(θ) = 11 / (5 × 3) = 11 / 15</li>
              <li>θ = cos⁻¹(11/15) ≈ 42.8°</li>
            </ul>
            
            <p className="mb-2"><strong>c)</strong> Calculate the scalar projection of <strong>a</strong> onto <strong>b</strong> using the formula (<strong>a</strong> · <strong>b</strong>) / |b|.</p>
            <ul className="list-disc list-inside ml-4 mb-3">
              <li>Scalar projection = 11 / 3 ≈ 3.67</li>
            </ul>
            
            <p className="font-medium mt-2">Therefore, <strong>a</strong> · <strong>b</strong> = 11, the angle between <strong>a</strong> and <strong>b</strong> is approximately 42.8°, and the scalar projection of <strong>a</strong> onto <strong>b</strong> is approximately 3.67.</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Cross Product */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Section 4: Cross Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Definition of Cross Product</h3>
            <p className="mb-4">
              The cross product (or vector product) of two vectors <strong>a</strong> and <strong>b</strong> is denoted by <strong>a</strong> × <strong>b</strong> and is a vector perpendicular to both <strong>a</strong> and <strong>b</strong>, with magnitude:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <p className="text-center font-mono text-lg">|<strong>a</strong> × <strong>b</strong>| = |a| |b| sin(θ)</p>
            </div>
            <p className="mb-4">where θ is the angle between the vectors.</p>
            <p className="mb-4">
              The direction of <strong>a</strong> × <strong>b</strong> is determined by the right-hand rule: if you curl the fingers of your right hand from <strong>a</strong> to <strong>b</strong>, your thumb points in the direction of <strong>a</strong> × <strong>b</strong>.
            </p>
            <p className="mb-4">
              In component form, if <strong>a</strong> = (a₁, a₂, a₃) and <strong>b</strong> = (b₁, b₂, b₃), then:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <p className="text-center font-mono text-lg"><strong>a</strong> × <strong>b</strong> = (a₂b₃ - a₃b₂, a₃b₁ - a₁b₃, a₁b₂ - a₂b₁)</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Properties of the Cross Product</h3>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li><strong>Anti-commutative:</strong> <strong>a</strong> × <strong>b</strong> = -(<strong>b</strong> × <strong>a</strong>)</li>
              <li><strong>Distributive over addition:</strong> <strong>a</strong> × (<strong>b</strong> + <strong>c</strong>) = <strong>a</strong> × <strong>b</strong> + <strong>a</strong> × <strong>c</strong></li>
              <li><strong>Scalar multiplication:</strong> (k<strong>a</strong>) × <strong>b</strong> = k(<strong>a</strong> × <strong>b</strong>) = <strong>a</strong> × (k<strong>b</strong>)</li>
              <li><strong>Not associative:</strong> (<strong>a</strong> × <strong>b</strong>) × <strong>c</strong> ≠ <strong>a</strong> × (<strong>b</strong> × <strong>c</strong>)</li>
              <li><strong>Self-cross product:</strong> <strong>a</strong> × <strong>a</strong> = <strong>0</strong> (the zero vector)</li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Applications of the Cross Product</h3>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li>Finding a vector perpendicular to two given vectors</li>
              <li><strong>Calculating the area of a parallelogram:</strong> Area = |<strong>a</strong> × <strong>b</strong>|</li>
              <li><strong>Determining the torque in physics:</strong> Torque = Position × Force</li>
              <li>Computing the normal vector to a plane</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Example Problem:</h4>
            <p className="mb-2">Given vectors <strong>a</strong> = (2, 0, 3) and <strong>b</strong> = (1, 4, 2), find:</p>
            <p className="mb-2">a) <strong>a</strong> × <strong>b</strong></p>
            <p className="mb-2">b) The area of the parallelogram formed by <strong>a</strong> and <strong>b</strong></p>
            <p className="mb-2">c) A unit vector perpendicular to both <strong>a</strong> and <strong>b</strong></p>
            
            <div className="mb-4">
              <img 
                src={crossProductImg} 
                alt="Cross product visualization showing perpendicular result vector and right-hand rule" 
                className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
            
            <h5 className="font-medium mt-4 mb-2">Solution:</h5>
            <p className="mb-2"><strong>a)</strong> Calculate the cross product using the component formula.</p>
            <ul className="list-disc list-inside ml-4 mb-3">
              <li><strong>a</strong> × <strong>b</strong> = (a₂b₃ - a₃b₂, a₃b₁ - a₁b₃, a₁b₂ - a₂b₁)</li>
              <li><strong>a</strong> × <strong>b</strong> = ((0)(2) - (3)(4), (3)(1) - (2)(2), (2)(4) - (0)(1))</li>
              <li><strong>a</strong> × <strong>b</strong> = (0 - 12, 3 - 4, 8 - 0)</li>
              <li><strong>a</strong> × <strong>b</strong> = (-12, -1, 8)</li>
            </ul>
            
            <p className="mb-2"><strong>b)</strong> Calculate the area of the parallelogram using the magnitude of the cross product.</p>
            <ul className="list-disc list-inside ml-4 mb-3">
              <li>Area = |<strong>a</strong> × <strong>b</strong>| = √((-12)² + (-1)² + 8²) = √(144 + 1 + 64) = √209 ≈ 14.46 square units</li>
            </ul>
            
            <p className="mb-2"><strong>c)</strong> Find a unit vector perpendicular to both <strong>a</strong> and <strong>b</strong> by normalizing the cross product.</p>
            <ul className="list-disc list-inside ml-4 mb-3">
              <li>|<strong>a</strong> × <strong>b</strong>| = √209</li>
              <li>Unit vector = (<strong>a</strong> × <strong>b</strong>) / |<strong>a</strong> × <strong>b</strong>| = (-12, -1, 8) / √209 ≈ (-0.83, -0.07, 0.55)</li>
            </ul>
            
            <p className="font-medium mt-2">Therefore, <strong>a</strong> × <strong>b</strong> = (-12, -1, 8), the area of the parallelogram is approximately 14.46 square units, and a unit vector perpendicular to both <strong>a</strong> and <strong>b</strong> is approximately (-0.83, -0.07, 0.55).</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Vectors in Geometry */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Section 5: Vectors in Geometry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Vector Equation of a Line</h3>
            <p className="mb-4">
              A line passing through a point p₀ in the direction of a non-zero vector <strong>v</strong> can be represented parametrically as:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <p className="text-center font-mono text-lg">p(t) = p₀ + t<strong>v</strong></p>
            </div>
            <p className="mb-4">where t is a parameter that varies over all real numbers.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Vector Equation of a Plane</h3>
            <p className="mb-4">
              A plane passing through a point p₀ and perpendicular to a non-zero vector <strong>n</strong> (the normal vector) can be represented as:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <p className="text-center font-mono text-lg"><strong>n</strong> · (p - p₀) = 0</p>
            </div>
            <p className="mb-4">where p represents any point on the plane.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Distance from a Point to a Line</h3>
            <p className="mb-4">
              The distance from a point p to a line passing through point p₀ in the direction of unit vector û is:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <p className="text-center font-mono text-lg">d = |(p - p₀) × û|</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Distance from a Point to a Plane</h3>
            <p className="mb-4">
              The distance from a point p to a plane with normal unit vector n̂ passing through point p₀ is:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <p className="text-center font-mono text-lg">d = |(p - p₀) · n̂|</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Example Problem:</h4>
            <p className="mb-2">Find the distance from the point P(2, 3, 4) to the plane passing through the point Q(1, 0, 2) with normal vector <strong>n</strong> = (3, 6, 2).</p>
            
            <h5 className="font-medium mt-4 mb-2">Solution:</h5>
            <p className="mb-2"><strong>Step 1:</strong> Normalize the normal vector to get a unit normal vector.</p>
            <ul className="list-disc list-inside ml-4 mb-3">
              <li>|<strong>n</strong>| = √(3² + 6² + 2²) = √(9 + 36 + 4) = √49 = 7</li>
              <li>n̂ = <strong>n</strong> / |<strong>n</strong>| = (3, 6, 2) / 7 = (3/7, 6/7, 2/7)</li>
            </ul>
            
            <p className="mb-2"><strong>Step 2:</strong> Calculate the vector from Q to P.</p>
            <ul className="list-disc list-inside ml-4 mb-3">
              <li>P - Q = (2, 3, 4) - (1, 0, 2) = (1, 3, 2)</li>
            </ul>
            
            <p className="mb-2"><strong>Step 3:</strong> Calculate the distance using the formula d = |(P - Q) · n̂|.</p>
            <ul className="list-disc list-inside ml-4 mb-3">
              <li>(P - Q) · n̂ = (1)(3/7) + (3)(6/7) + (2)(2/7) = 3/7 + 18/7 + 4/7 = 25/7</li>
              <li>d = |25/7| = 25/7 ≈ 3.57</li>
            </ul>
            
            <p className="font-medium mt-2">Therefore, the distance from point P to the plane is 25/7 (approximately 3.57) units.</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Applications of Vectors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Section 6: Applications of Vectors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Forces and Torques in Physics</h3>
            <p className="mb-4">
              In physics, forces are represented as vectors with magnitude (strength) and direction. The net force on an object is the vector sum of all individual forces.
            </p>
            <p className="mb-4">
              Torque, which causes rotational motion, is calculated as the cross product of the position vector and the force vector:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <p className="text-center font-mono text-lg">τ = <strong>r</strong> × <strong>F</strong></p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Velocity and Acceleration</h3>
            <p className="mb-4">
              In kinematics, velocity and acceleration are vector quantities. The velocity vector points in the direction of motion, and its magnitude is the speed. The acceleration vector represents the rate of change of velocity.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Work and Energy</h3>
            <p className="mb-4">
              Work done by a force is calculated as the dot product of the force vector and the displacement vector:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <p className="text-center font-mono text-lg">W = <strong>F</strong> · <strong>d</strong></p>
            </div>
            <p className="mb-4">
              This represents the component of force in the direction of displacement multiplied by the magnitude of displacement.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Example Problem:</h4>
            <p className="mb-2">A force <strong>F</strong> = (3, 4, 0) N is applied to an object, causing it to move along the displacement vector <strong>d</strong> = (5, 0, 0) m. Calculate the work done by the force.</p>
            
            <h5 className="font-medium mt-4 mb-2">Solution:</h5>
            <p className="mb-2"><strong>Step 1:</strong> Calculate the work using the dot product formula W = <strong>F</strong> · <strong>d</strong>.</p>
            <ul className="list-disc list-inside ml-4 mb-3">
              <li><strong>F</strong> · <strong>d</strong> = (3)(5) + (4)(0) + (0)(0) = 15 + 0 + 0 = 15</li>
            </ul>
            
            <p className="font-medium mt-2">Therefore, the work done by the force is 15 joules.</p>
          </div>
        </CardContent>
      </Card>

      {/* Practice Problems */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Practice Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-3 text-sm">
            <li>Given vectors <strong>a</strong> = (2, -3, 1) and <strong>b</strong> = (4, 1, -2), calculate <strong>a</strong> + <strong>b</strong>, <strong>a</strong> - <strong>b</strong>, and 2<strong>a</strong> - 3<strong>b</strong>.</li>
            <li>Find the dot product of vectors <strong>p</strong> = (3, 0, -2) and <strong>q</strong> = (1, 4, 5), and determine the angle between them.</li>
            <li>Calculate the cross product <strong>a</strong> × <strong>b</strong> for vectors <strong>a</strong> = (1, 2, 3) and <strong>b</strong> = (4, 0, -1), and verify that it is perpendicular to both <strong>a</strong> and <strong>b</strong>.</li>
            <li>Find the distance from the point P(3, 1, 2) to the line passing through the point Q(1, 0, 1) in the direction of the vector <strong>v</strong> = (2, 2, 0).</li>
            <li>Calculate the work done by a force <strong>F</strong> = (2, 3, -1) N when it moves an object along the displacement vector <strong>d</strong> = (4, -2, 5) m.</li>
          </ol>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            In this module, we have explored vectors and vector geometry. We have learned about vector operations, dot and cross products, and how to apply vectors to solve geometric and physical problems. We have seen how vectors provide a powerful framework for understanding and analyzing quantities with both magnitude and direction.
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary mb-4">
            <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
            <p className="text-sm leading-relaxed">
              Vectors represent one of mathematics' most elegant and practical innovations. They unify algebra and geometry, providing both visual intuition and computational precision. The operations we've studied—addition, subtraction, dot product, and cross product—each capture fundamental geometric relationships while enabling algebraic manipulation. This dual nature makes vectors indispensable across disciplines. In physics, they model forces, velocities, and fields; in computer graphics, they define positions, directions, and transformations; in machine learning, they represent features and patterns in high-dimensional spaces. The vector approach often simplifies problems that would be cumbersome with traditional methods. For instance, finding the area of a parallelogram becomes a simple cross product, and calculating work done by a force becomes a straightforward dot product. As you continue your mathematical journey, you'll find that vector thinking provides insights and techniques that extend far beyond geometry, forming a foundation for understanding the physical world and creating computational models of reality.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This module completes our exploration of geometry. The concepts and techniques you have learned provide a solid foundation for further study in mathematics, physics, engineering, and computer science. You can now apply these geometric principles to solve a wide range of problems and deepen your understanding of the spatial world around us.
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
            <p className="text-sm font-semibold text-primary mb-2">Teaching Moment:</p>
            <p className="text-sm leading-relaxed">
              As we conclude our geometry course, it's worth reflecting on the journey we've taken. We started with basic concepts of lines, angles, and polygons, then progressed through increasingly sophisticated topics: triangles, quadrilaterals, circles, transformations, three-dimensional shapes, coordinate geometry, and finally vectors. Each module built upon the previous ones, creating a comprehensive framework for understanding space and shape. The skills you've developed—spatial reasoning, logical deduction, algebraic manipulation, and vector analysis—are valuable across numerous fields. Whether you pursue further studies in mathematics, apply these concepts in science or engineering, or simply appreciate the geometric patterns in the world around you, the principles of geometry will continue to provide insights and tools for solving problems. Geometry is one of humanity's oldest intellectual pursuits, yet it remains vibrantly relevant in our modern world, from the algorithms that power computer graphics to the principles that guide architectural design. The geometric journey doesn't end here—it branches into differential geometry, topology, non-Euclidean geometries, and other fascinating areas that continue to expand our understanding of space and form.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};