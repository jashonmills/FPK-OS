import React from 'react';
import { MicroLessonScreen } from '../MicroLessonContainer';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../ConceptScreen';
import { ExampleScreen } from '../ExampleScreen';
import { PracticeScreen } from '../PracticeScreen';
import { Calculator, Lightbulb, TrendingUp } from 'lucide-react';

export const coordinateGeometryMicroLessonsPartTwo: MicroLessonScreen[] = [
  {
    id: '3',
    type: 'example',
    title: 'Plotting Points Example',
    estimatedTime: 3,
    content: (
      <ExampleScreen
        title="Plotting Points on the Coordinate Plane"
        problem="Plot the points A(3, 4), B(-2, 1), and C(-1, -3) on a coordinate plane. Identify the quadrant in which each point lies."
        variant="blue"
        solution={
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Step 1: Plot the points</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Point A(3, 4): Move 3 units right and 4 units up from the origin</li>
                <li>Point B(-2, 1): Move 2 units left and 1 unit up from the origin</li>
                <li>Point C(-1, -3): Move 1 unit left and 3 units down from the origin</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Step 2: Identify quadrants</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Point A(3, 4): Both coordinates positive → Quadrant I</li>
                <li>Point B(-2, 1): x negative, y positive → Quadrant II</li>
                <li>Point C(-1, -3): Both coordinates negative → Quadrant III</li>
              </ul>
            </div>
          </div>
        }
        answer="Point A is in Quadrant I, point B is in Quadrant II, and point C is in Quadrant III."
      />
    )
  },

  {
    id: '4',
    type: 'concept',
    title: 'Distance Formula',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <ConceptSection title="Distance Between Two Points" variant="purple">
            <p className="text-lg leading-relaxed mb-4">
              The distance between two points (x₁, y₁) and (x₂, y₂) is given by:
            </p>
            
            <div className="text-center text-2xl font-bold text-purple-600 mb-4 p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
              d = √[(x₂ - x₁)² + (y₂ - y₁)²]
            </div>

            <TeachingMoment variant="purple">
              The distance formula is a direct application of the Pythagorean theorem. If we draw a right triangle with the two points as opposite corners, the distance between the points is the length of the hypotenuse. This connection illustrates how coordinate geometry builds on earlier geometric principles.
            </TeachingMoment>
          </ConceptSection>
        </div>
      </ConceptScreen>
    )
  },

  {
    id: '5',
    type: 'concept',
    title: 'Midpoint Formula',
    estimatedTime: 3,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <ConceptSection title="Midpoint of a Line Segment" variant="green">
            <p className="text-lg leading-relaxed mb-4">
              The midpoint of a line segment with endpoints (x₁, y₁) and (x₂, y₂) is:
            </p>
            
            <div className="text-center text-2xl font-bold text-green-600 mb-4 p-6 bg-green-50 rounded-lg border-2 border-green-200">
              M = ((x₁ + x₂)/2, (y₁ + y₂)/2)
            </div>

            <TeachingMoment variant="green">
              The midpoint formula finds the point exactly halfway between two given points. It's essentially averaging the x-coordinates and y-coordinates separately. This formula is used extensively in geometry for finding centers, creating bisectors, and solving optimization problems.
            </TeachingMoment>
          </ConceptSection>
        </div>
      </ConceptScreen>
    )
  },

  {
    id: '6',
    type: 'example',
    title: 'Distance and Midpoint Example',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Calculating Distance and Midpoint"
        problem="Given points P(1, 2) and Q(7, 10), find the distance between them and the midpoint of segment PQ."
        variant="orange"
        solution={
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Step 1: Calculate the distance</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>d = √[(x₂ - x₁)² + (y₂ - y₁)²]</li>
                <li>d = √[(7 - 1)² + (10 - 2)²]</li>
                <li>d = √[6² + 8²]</li>
                <li>d = √[36 + 64] = √100 = 10</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Step 2: Find the midpoint</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>M = ((x₁ + x₂)/2, (y₁ + y₂)/2)</li>
                <li>M = ((1 + 7)/2, (2 + 10)/2)</li>
                <li>M = (8/2, 12/2)</li>
                <li>M = (4, 6)</li>
              </ul>
            </div>
          </div>
        }
        answer="The distance between P and Q is 10 units, and the midpoint is (4, 6)."
      />
    )
  },

  {
    id: '7',
    type: 'practice',
    title: 'Distance Formula Practice',
    estimatedTime: 5,
    content: (
      <PracticeScreen
        question={{
          id: 'distance-practice-1',
          question: "Find the distance between points A(-3, 4) and B(5, -2). Round to the nearest tenth.",
          type: 'number',
          correctAnswer: 10,
          hints: ["Use the distance formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²]"],
          explanation: "d = √[(5 - (-3))² + (-2 - 4)²] = √[8² + (-6)²] = √[64 + 36] = √100 = 10"
        }}
        allowMultipleAttempts={true}
        maxAttempts={3}
      />
    )
  },

  {
    id: '8',
    type: 'summary',
    title: 'Coordinate Geometry Summary',
    estimatedTime: 3,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <Calculator className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-4">Key Concepts Review</h2>
          </div>

          <ConceptSection title="What We've Learned" variant="blue">
            <div className="grid gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">Coordinate System</h4>
                <p className="text-sm">Two perpendicular axes forming four quadrants for locating points</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Distance Formula</h4>
                <p className="text-sm">d = √[(x₂ - x₁)² + (y₂ - y₁)²]</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-2">Midpoint Formula</h4>
                <p className="text-sm">M = ((x₁ + x₂)/2, (y₁ + y₂)/2)</p>
              </div>
            </div>
          </ConceptSection>

          <TeachingMoment variant="blue">
            Coordinate geometry bridges the gap between algebra and geometry, providing powerful tools for analyzing shapes and solving problems. These fundamental concepts form the foundation for more advanced topics in mathematics, physics, and engineering.
          </TeachingMoment>
        </div>
      </ConceptScreen>
    )
  }
];