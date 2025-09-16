import React from 'react';
import { MicroLessonScreen } from '../MicroLessonContainer';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../ConceptScreen';
import { ExampleScreen } from '../ExampleScreen';
import { PracticeScreen } from '../PracticeScreen';
import { Calculator, Target, ArrowRight } from 'lucide-react';

export const vectorsMicroLessonsPartTwo: MicroLessonScreen[] = [
  {
    id: '3',
    type: 'concept',
    title: 'Vector Components and Magnitude',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <ConceptSection title="Components of a Vector" variant="orange">
            <p className="text-lg leading-relaxed mb-4">
              In a coordinate system, a vector <strong>v</strong> can be represented by its components along the coordinate axes. In two dimensions, <strong>v</strong> = (v₁, v₂) or <strong>v</strong> = v₁<strong>i</strong> + v₂<strong>j</strong>, where v₁ and v₂ are the components.
            </p>

            <TeachingMoment variant="orange">
              The component representation connects the geometric view (arrows) with the algebraic view (ordered pairs). The components tell us "how much" of the vector points in each coordinate direction. For example, vector (3, 4) means "3 units in the x-direction and 4 units in the y-direction."
            </TeachingMoment>
          </ConceptSection>

          <ConceptSection title="Magnitude Formula" variant="red">
            <p className="text-lg leading-relaxed mb-4">
              The magnitude of a vector <strong>v</strong> = (v₁, v₂) in two dimensions is:
            </p>
            
            <div className="text-center text-2xl font-bold text-red-600 mb-4 p-6 bg-red-50 rounded-lg border-2 border-red-200">
              |v| = √(v₁² + v₂²)
            </div>

            <p className="text-lg leading-relaxed mb-4">
              In three dimensions, for <strong>v</strong> = (v₁, v₂, v₃):
            </p>
            
            <div className="text-center text-2xl font-bold text-red-600 mb-4 p-6 bg-red-50 rounded-lg border-2 border-red-200">
              |v| = √(v₁² + v₂² + v₃²)
            </div>
          </ConceptSection>
        </div>
      </ConceptScreen>
    )
  },

  {
    id: '4',
    type: 'concept',
    title: 'Unit Vectors',
    estimatedTime: 3,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <ConceptSection title="Unit Vector Definition" variant="teal">
            <p className="text-lg leading-relaxed mb-4">
              A unit vector is a vector with a magnitude of 1. Given a non-zero vector <strong>v</strong>, the corresponding unit vector in the same direction is:
            </p>
            
            <div className="text-center text-2xl font-bold text-teal-600 mb-4 p-6 bg-teal-50 rounded-lg border-2 border-teal-200">
              û = v / |v|
            </div>

            <TeachingMoment variant="teal">
              Unit vectors are like the "direction indicators" of vector geometry. They preserve the direction of a vector while standardizing its length to 1. This normalization is useful when we want to focus on direction rather than magnitude. The process of finding a unit vector is called "normalization."
            </TeachingMoment>
          </ConceptSection>
        </div>
      </ConceptScreen>
    )
  },

  {
    id: '5',
    type: 'example',
    title: 'Vector Magnitude and Unit Vector Example',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Finding Magnitude and Unit Vector"
        problem="Given vector v = (3, 4), find its magnitude and the corresponding unit vector."
        variant="blue"
        solution={
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Step 1: Calculate the magnitude</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>|v| = √(v₁² + v₂²)</li>
                <li>|v| = √(3² + 4²)</li>
                <li>|v| = √(9 + 16)</li>
                <li>|v| = √25 = 5</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Step 2: Find the unit vector</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>û = v / |v|</li>
                <li>û = (3, 4) / 5</li>
                <li>û = (3/5, 4/5)</li>
                <li>û = (0.6, 0.8)</li>
              </ul>
            </div>
          </div>
        }
        answer="The magnitude of vector v is 5, and the corresponding unit vector is û = (0.6, 0.8)."
      />
    )
  },

  {
    id: '6',
    type: 'concept',
    title: 'Vector Addition',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <ConceptSection title="Vector Addition Rules" variant="purple">
            <p className="text-lg leading-relaxed mb-4">
              The sum of two vectors <strong>a</strong> and <strong>b</strong> is a vector <strong>c</strong> = <strong>a</strong> + <strong>b</strong>. Geometrically, vector addition follows the parallelogram law or the tip-to-tail method.
            </p>

            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">Component Form Addition</h4>
              <p>If <strong>a</strong> = (a₁, a₂) and <strong>b</strong> = (b₁, b₂), then:</p>
              <div className="text-center text-lg font-bold text-purple-600 mt-2">
                <strong>a</strong> + <strong>b</strong> = (a₁ + b₁, a₂ + b₂)
              </div>
            </div>

            <TeachingMoment variant="purple">
              Vector addition has a clear geometric interpretation: place the tail of the second vector at the head of the first vector. The sum vector goes from the tail of the first to the head of the second. This "tip-to-tail" method reflects how vectors naturally combine in physical situations.
            </TeachingMoment>
          </ConceptSection>
        </div>
      </ConceptScreen>
    )
  },

  {
    id: '7',
    type: 'practice',
    title: 'Vector Magnitude Practice',
    estimatedTime: 5,
    content: (
      <PracticeScreen
        question={{
          id: 'vector-magnitude-practice-1',
          question: "Find the magnitude of vector w = (-5, 12). Round to the nearest whole number if necessary.",
          type: 'number',
          correctAnswer: 13,
          hints: ["Use the magnitude formula: |v| = √(v₁² + v₂²)"],
          explanation: "|w| = √((-5)² + 12²) = √(25 + 144) = √169 = 13"
        }}
        allowMultipleAttempts={true}
        maxAttempts={3}
      />
    )
  },

  {
    id: '8',
    type: 'summary',
    title: 'Vectors Summary',
    estimatedTime: 3,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <Target className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-4">Vector Concepts Review</h2>
          </div>

          <ConceptSection title="What We've Learned" variant="blue">
            <div className="grid gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">Vector Definition</h4>
                <p className="text-sm">Mathematical objects with both magnitude and direction</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Magnitude Formula</h4>
                <p className="text-sm">|v| = √(v₁² + v₂²) for 2D vectors</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-2">Unit Vectors</h4>
                <p className="text-sm">û = v / |v| (vectors with magnitude 1)</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-2">Vector Addition</h4>
                <p className="text-sm">Add components: (a₁ + b₁, a₂ + b₂)</p>
              </div>
            </div>
          </ConceptSection>

          <TeachingMoment variant="blue">
            Vectors are fundamental tools that bridge mathematics and physics, providing a natural language for describing quantities that have both magnitude and direction. They're essential in fields from engineering to computer graphics.
          </TeachingMoment>
        </div>
      </ConceptScreen>
    )
  }
];