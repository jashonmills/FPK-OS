import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../ConceptScreen';
import { ExampleScreen, StepList } from '../ExampleScreen';
import { PracticeScreen } from '../PracticeScreen';
import { MicroLessonData, MicroLessonScreen } from '../MicroLessonContainer';
import { CheckCircle, Square } from 'lucide-react';

export const quadrilateralsMicroLessons: MicroLessonData = {
  id: 'quadrilaterals-micro-lesson',
  moduleTitle: 'Module 3: Quadrilaterals and Polygons',
  totalScreens: 18,
  screens: [
    // Screen 1: Introduction & Learning Objectives
    {
      id: 'intro-objectives',
      type: 'concept',
      title: 'Introduction to Quadrilaterals',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⬛🔶◇</div>
              <h2 className="text-2xl font-semibold mb-4">Welcome to Quadrilaterals & Polygons!</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Welcome to Module 3 of our Geometry course! In this module, we will explore quadrilaterals, 
                which are four-sided polygons, and other polygons with more than four sides.
              </p>
            </div>

            <TeachingMoment>
              Quadrilaterals and polygons are everywhere in our daily lives—from the rectangular screens 
              of our devices to the hexagonal tiles in bathrooms. Understanding these shapes helps us 
              make sense of the world around us and solve practical problems in fields like architecture, 
              design, and engineering.
            </TeachingMoment>

            <div>
              <h3 className="text-xl font-semibold mb-4">Learning Objectives</h3>
              <p className="text-muted-foreground mb-3">By the end of this module, you will be able to:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Identify and classify different types of quadrilaterals</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Understand properties of various quadrilaterals</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Calculate area and perimeter of quadrilaterals</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Work with regular polygons and their properties</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Apply coordinate geometry to polygons</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Solve real-world quadrilateral problems</span>
                </div>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 2: What is a Quadrilateral?
    {
      id: 'what-is-quadrilateral',
      type: 'concept',
      title: 'What is a Quadrilateral?',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⬛</div>
              <h2 className="text-2xl font-bold mb-4">Understanding Quadrilaterals</h2>
            </div>

            <ConceptSection title="Definition" variant="blue">
              <p className="text-lg mb-4">
                A quadrilateral is a polygon with four sides, four angles, and four vertices. 
                The sum of the interior angles of a quadrilateral is always 360 degrees.
              </p>
            </ConceptSection>

            <TeachingMoment>
              The word "quadrilateral" comes from Latin, where "quadri" means "four" and "latus" 
              means "side." Unlike triangles, which are always rigid, quadrilaterals can be flexible 
              unless additional constraints are imposed. This is why triangular supports are common 
              in construction—they maintain their shape under pressure!
            </TeachingMoment>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Key Facts About Quadrilaterals</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>Always have 4 sides, 4 angles, and 4 vertices</li>
                <li>Sum of interior angles = 360°</li>
                <li>Can be regular or irregular</li>
                <li>Can be convex or concave</li>
                <li>Include squares, rectangles, parallelograms, and more</li>
              </ul>
            </div>

            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <Square className="h-16 w-16 mx-auto mb-3 text-primary" />
              <p className="text-sm text-muted-foreground">
                A simple quadrilateral with four sides and four vertices
              </p>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 3: Parallelogram
    {
      id: 'parallelogram',
      type: 'concept',
      title: 'Parallelograms',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">▱</div>
              <h2 className="text-2xl font-bold mb-4">Parallelograms</h2>
            </div>

            <ConceptSection title="Definition" variant="blue">
              <p className="text-lg mb-4">
                A parallelogram is a quadrilateral with opposite sides parallel and equal.
              </p>
            </ConceptSection>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Properties of Parallelograms</h4>
              <ul className="space-y-2 text-sm text-blue-700 list-disc list-inside ml-4">
                <li>Opposite sides are parallel and equal</li>
                <li>Opposite angles are equal</li>
                <li>Consecutive angles are supplementary (sum to 180°)</li>
                <li>Diagonals bisect each other</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-3">Visual Properties</h4>
                <div className="text-center">
                  <div className="text-4xl mb-2">▱</div>
                  <p className="text-sm text-muted-foreground">
                    AB ∥ DC and AD ∥ BC<br/>
                    AB = DC and AD = BC
                  </p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Real-World Examples</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Slanted rectangles</li>
                  <li>Some window frames</li>
                  <li>Parallelogram rulers</li>
                  <li>Certain building facades</li>
                </ul>
              </div>
            </div>

            <TeachingMoment>
              Parallelograms are the "parent" category for rectangles, squares, and rhombuses. 
              If you can prove a quadrilateral is a parallelogram, you automatically know several 
              important properties about it!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 4: Rectangle and Square
    {
      id: 'rectangle-square',
      type: 'concept',
      title: 'Rectangles & Squares',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">▭⬜</div>
              <h2 className="text-2xl font-bold mb-4">Rectangles & Squares</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ConceptSection title="Rectangle" variant="green">
                <p className="text-sm mb-3">
                  <strong>Definition:</strong> A parallelogram with four right angles.
                </p>
                <div className="bg-green-100 p-3 rounded">
                  <h5 className="font-semibold mb-2">Properties:</h5>
                  <ul className="space-y-1 text-sm list-disc list-inside">
                    <li>All angles are 90°</li>
                    <li>Opposite sides parallel and equal</li>
                    <li>Diagonals are equal and bisect each other</li>
                  </ul>
                </div>
              </ConceptSection>

              <ConceptSection title="Square" variant="purple">
                <p className="text-sm mb-3">
                  <strong>Definition:</strong> A rectangle with all sides equal.
                </p>
                <div className="bg-purple-100 p-3 rounded">
                  <h5 className="font-semibold mb-2">Properties:</h5>
                  <ul className="space-y-1 text-sm list-disc list-inside">
                    <li>All sides are equal</li>
                    <li>All angles are 90°</li>
                    <li>Diagonals equal, bisect each other at right angles</li>
                    <li>Diagonals bisect opposite angles</li>
                  </ul>
                </div>
              </ConceptSection>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Hierarchy Relationship</h4>
              <div className="text-center">
                <p className="text-sm">All squares are rectangles, but not all rectangles are squares</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Square ⊂ Rectangle ⊂ Parallelogram ⊂ Quadrilateral
                </div>
              </div>
            </div>

            <TeachingMoment>
              Rectangles and squares are special parallelograms. A square is the most "perfect" 
              quadrilateral—it has all the properties of parallelograms, rectangles, and rhombuses 
              combined!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 5: Rhombus and Kite
    {
      id: 'rhombus-kite',
      type: 'concept',
      title: 'Rhombus & Kite',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">◊🪁</div>
              <h2 className="text-2xl font-bold mb-4">Rhombus & Kite</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ConceptSection title="Rhombus" variant="red">
                <p className="text-sm mb-3">
                  <strong>Definition:</strong> A parallelogram with all sides equal.
                </p>
                <div className="bg-red-100 p-3 rounded">
                  <h5 className="font-semibold mb-2">Properties:</h5>
                  <ul className="space-y-1 text-sm list-disc list-inside">
                    <li>All sides are equal</li>
                    <li>Opposite angles are equal</li>
                    <li>Diagonals bisect each other at right angles</li>
                    <li>Diagonals bisect opposite angles</li>
                  </ul>
                </div>
              </ConceptSection>

              <ConceptSection title="Kite" variant="teal">
                <p className="text-sm mb-3">
                  <strong>Definition:</strong> A quadrilateral with two pairs of adjacent sides equal.
                </p>
                <div className="bg-teal-100 p-3 rounded">
                  <h5 className="font-semibold mb-2">Properties:</h5>
                  <ul className="space-y-1 text-sm list-disc list-inside">
                    <li>Two pairs of adjacent sides are equal</li>
                    <li>One diagonal bisects the other at right angles</li>
                    <li>One diagonal bisects opposite angles</li>
                  </ul>
                </div>
              </ConceptSection>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Key Differences</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Rhombus:</strong> All sides equal, opposite sides parallel</li>
                <li><strong>Kite:</strong> Adjacent sides equal, not necessarily parallel</li>
              </ul>
            </div>

            <TeachingMoment>
              Think of a rhombus as a "slanted square" and a kite as the shape of an actual kite! 
              Both have equal sides, but their arrangements create different properties.
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    }
  ]
};