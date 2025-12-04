import React from 'react';
import { MicroLessonData } from '../MicroLessonContainer';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../ConceptScreen';
import { ExampleScreen } from '../ExampleScreen';
import { PracticeScreen } from '../PracticeScreen';
import { ArrowRight, Navigation, Target } from 'lucide-react';

export const vectorsMicroLessons: MicroLessonData = {
  id: 'vectors-micro',
  moduleTitle: 'Vectors and Vector Geometry',
  totalScreens: 8,
  screens: [
    {
      id: '1',
      type: 'concept',
      title: 'Introduction to Vectors',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <Navigation className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">
                Discover the power of vectors - mathematical objects with both magnitude and direction!
              </p>
            </div>

            <ConceptSection title="What is a Vector?" variant="blue">
              <p className="text-lg leading-relaxed mb-4">
                A vector is a mathematical object that has both magnitude (size) and direction. In contrast, a scalar has only magnitude. Vectors are essential for representing quantities like force, velocity, and displacement.
              </p>
              
              <TeachingMoment variant="blue">
                Vectors represent one of the most powerful and versatile tools in mathematics and physics. Unlike scalars, which only have magnitude, vectors capture both "how much" and "which way"—a crucial distinction in many real-world scenarios. When you push an object, both the strength of your push and its direction determine the outcome.
              </TeachingMoment>
            </ConceptSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border-blue-200 border">
                <h4 className="font-semibold text-blue-700 mb-2">Vector Examples</h4>
                <ul className="text-sm space-y-1">
                  <li>• Force (strength + direction)</li>
                  <li>• Velocity (speed + direction)</li>
                  <li>• Displacement (distance + direction)</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-green-200 border">
                <h4 className="font-semibold text-green-700 mb-2">Scalar Examples</h4>
                <ul className="text-sm space-y-1">
                  <li>• Temperature (just magnitude)</li>
                  <li>• Mass (just magnitude)</li>
                  <li>• Time (just magnitude)</li>
                </ul>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    {
      id: '2',
      type: 'concept',
      title: 'Vector Representation',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="Geometric Representation" variant="green">
              <p className="text-lg leading-relaxed mb-4">
                A vector can be represented geometrically as a directed line segment (an arrow). The length of the arrow represents the magnitude of the vector, and the direction of the arrow represents the direction of the vector.
              </p>

              <TeachingMoment variant="green">
                The arrow representation provides intuitive visual understanding. The starting point is called the "tail" and the endpoint is called the "head." A key insight is that vectors with the same length and direction are considered equal, regardless of their position in space—this is the "free vector" concept.
              </TeachingMoment>
            </ConceptSection>

            <ConceptSection title="Vector Notation" variant="purple">
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  A vector is often denoted by:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Bold lowercase letter: <strong>v</strong></li>
                  <li>Letter with arrow: v⃗</li>
                  <li>Component form: (v₁, v₂) or v₁<strong>i</strong> + v₂<strong>j</strong></li>
                </ul>
                <p className="text-lg leading-relaxed">
                  The magnitude of vector <strong>v</strong> is denoted by |v| or ||v||.
                </p>
              </div>
            </ConceptSection>
          </div>
        </ConceptScreen>
      )
    }
  ]
};