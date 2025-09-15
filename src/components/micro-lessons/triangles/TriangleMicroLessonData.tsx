import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../ConceptScreen';
import { ExampleScreen, StepList } from '../ExampleScreen';
import { PracticeScreen } from '../PracticeScreen';
import { MicroLessonData, MicroLessonScreen } from '../MicroLessonContainer';
import { CheckCircle } from 'lucide-react';

export const triangleMicroLessonData: MicroLessonData = {
  id: 'triangles-micro-lesson',
  moduleTitle: 'Module 2: Triangles and Triangle Properties',
  totalScreens: 28,
  screens: [
    // Screen 1: Introduction & Learning Objectives
    {
      id: 'intro-objectives',
      type: 'concept',
      title: 'Introduction & Learning Objectives',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Welcome to Triangles!</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Welcome to Module 2 of our Geometry course! In this module, we will focus on triangles, one of the most fundamental shapes in geometry. We will explore the properties of triangles, different types of triangles, and important theorems related to triangles.
              </p>
            </div>

            <TeachingMoment>
              Triangles are the simplest closed polygons and form the building blocks of many geometric concepts. Their rigidity makes them essential in construction and engineering—notice how many support structures, trusses, and frameworks use triangular designs. This is because a triangle cannot be deformed without changing the length of at least one of its sides, making it inherently stable.
            </TeachingMoment>

            <div>
              <h3 className="text-xl font-semibold mb-4">Learning Objectives</h3>
              <p className="text-muted-foreground mb-3">By the end of this module, you will be able to:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Classify triangles based on their sides and angles</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Apply the properties of triangles to solve problems</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Understand and apply the Pythagorean theorem</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Calculate the area and perimeter of triangles</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Apply triangle congruence and similarity principles</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Use triangles to solve real-world problems</span>
                </div>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 2: What is a Triangle?
    {
      id: 'triangle-definition',
      type: 'concept',
      title: 'What is a Triangle?',
      estimatedTime: 2,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Definition</h3>
              <p className="mb-4 leading-relaxed">
                A triangle is a polygon with three sides, three angles, and three vertices. It is the simplest polygon and has many interesting properties.
              </p>
            </div>
            
            <TeachingMoment>
              The word "triangle" comes from the Latin words "tri" (three) and "angulus" (angle or corner). Every triangle has exactly three sides, three angles, and three vertices—no more, no less. This consistency makes triangles particularly useful for mathematical analysis.
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 3: Sum of Interior Angles
    {
      id: 'sum-interior-angles',
      type: 'concept',
      title: 'Sum of Interior Angles',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <ConceptSection title="Sum of Interior Angles" variant="blue">
            <p className="mb-3">
              The sum of the interior angles of a triangle is always 180 degrees.
            </p>
            
            <TeachingMoment variant="blue">
              You can demonstrate this property by tearing off the three corners of a paper triangle and arranging them side by side. You'll notice they form a straight line, which is 180 degrees. This property is true for all triangles, regardless of their size or shape!
            </TeachingMoment>
          </ConceptSection>
        </ConceptScreen>
      )
    },

    // Screen 4: Sum of Interior Angles Practice
    {
      id: 'sum-angles-practice',
      type: 'practice',
      title: 'Practice: Sum of Interior Angles',
      estimatedTime: 3,
      content: (
        <PracticeScreen
          question={{
            id: 'sum-angles-1',
            question: 'In triangle ABC, angles A and B measure 45° and 60° respectively. Find the measure of angle C.',
            correctAnswer: 75,
            type: 'number',
            hints: [
              'Remember that the sum of all angles in a triangle equals 180°',
              'Set up the equation: A + B + C = 180°',
              'Substitute the known values: 45° + 60° + C = 180°'
            ],
            explanation: 'Using the property that the sum of interior angles equals 180°: 45° + 60° + C = 180°, so 105° + C = 180°, therefore C = 75°.'
          }}
        />
      )
    },

    // Screen 5: Triangle Inequality Theorem
    {
      id: 'triangle-inequality',
      type: 'concept',
      title: 'Triangle Inequality Theorem',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <ConceptSection title="Triangle Inequality Theorem" variant="green">
            <p className="mb-3">
              The sum of the lengths of any two sides of a triangle must be greater than the length of the remaining side.
            </p>
            
            <TeachingMoment variant="green">
              This theorem explains why you can't form a triangle with just any three lengths. For example, you cannot make a triangle with sides of length 2, 3, and 6 because 2 + 3 = 5, which is less than 6. Physically, this means that the two shorter sides cannot "reach" far enough to meet and form the third side.
            </TeachingMoment>
          </ConceptSection>
        </ConceptScreen>
      )
    },

    // Screen 6: Exterior Angle Theorem
    {
      id: 'exterior-angle',
      type: 'concept',
      title: 'Exterior Angle Theorem',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <ConceptSection title="Exterior Angle Theorem" variant="purple">
            <p className="mb-3">
              The measure of an exterior angle of a triangle is equal to the sum of the measures of the two non-adjacent interior angles.
            </p>
            
            <TeachingMoment variant="purple">
              An exterior angle is formed by extending one side of the triangle. If you know two interior angles of a triangle, you can find the third by using this theorem. It's a powerful tool for solving problems involving triangles.
            </TeachingMoment>
          </ConceptSection>
        </ConceptScreen>
      )
    },

    // Screen 7: Problem-Solving Approach
    {
      id: 'problem-solving-approach',
      type: 'concept',
      title: 'Problem-Solving with Triangle Properties',
      estimatedTime: 2,
      content: (
        <ConceptScreen>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-3">Problem-Solving Approach</h3>
            <p className="mb-4">When solving problems involving triangle properties, follow these steps:</p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">1. Identify the given information:</h4>
                <p className="text-sm text-muted-foreground">Note what angles, sides, or other properties are provided.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">2. Recall relevant properties:</h4>
                <p className="text-sm text-muted-foreground">Determine which triangle properties apply to the problem.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">3. Set up equations:</h4>
                <p className="text-sm text-muted-foreground">Use the properties to create equations with the unknown values.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">4. Solve the equations:</h4>
                <p className="text-sm text-muted-foreground">Find the values of the unknowns.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">5. Verify your answer:</h4>
                <p className="text-sm text-muted-foreground">Check that your solution satisfies all conditions of the problem.</p>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 8: Equilateral Triangles
    {
      id: 'equilateral-triangles',
      type: 'concept',
      title: 'Equilateral Triangles',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <ConceptSection title="Equilateral Triangle" variant="blue">
            <p className="mb-3">
              A triangle with all three sides of equal length. All angles in an equilateral triangle are also equal (60 degrees each).
            </p>
            
            <TeachingMoment variant="blue">
              Equilateral triangles have perfect symmetry. If you fold an equilateral triangle along any line from a vertex to the midpoint of the opposite side (a median), the two halves will match perfectly. This line is also an angle bisector and a perpendicular bisector of the side.
            </TeachingMoment>
          </ConceptSection>
        </ConceptScreen>
      )
    },

    // Screen 9: Isosceles Triangles
    {
      id: 'isosceles-triangles',
      type: 'concept',
      title: 'Isosceles Triangles',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <ConceptSection title="Isosceles Triangle" variant="green">
            <p className="mb-3">
              A triangle with two sides of equal length. The angles opposite to the equal sides are also equal.
            </p>
            
            <TeachingMoment variant="green">
              The word "isosceles" comes from Greek, meaning "equal legs." If you draw a line from the vertex between the two equal sides to the opposite side, perpendicular to that side, you'll create two congruent right triangles. This line is simultaneously an angle bisector, a perpendicular bisector, and a median.
            </TeachingMoment>
          </ConceptSection>
        </ConceptScreen>
      )
    },

    // Screen 10: Scalene Triangles
    {
      id: 'scalene-triangles',
      type: 'concept',
      title: 'Scalene Triangles',
      estimatedTime: 2,
      content: (
        <ConceptScreen>
          <ConceptSection title="Scalene Triangle" variant="purple">
            <p className="mb-3">
              A triangle with all three sides of different lengths. All angles in a scalene triangle are also different.
            </p>
            
            <TeachingMoment variant="purple">
              Most triangles you encounter in real life are scalene. While they lack the symmetry of equilateral or isosceles triangles, they have their own interesting properties. For instance, the longest side is always opposite to the largest angle, and the shortest side is opposite to the smallest angle.
            </TeachingMoment>
          </ConceptSection>
        </ConceptScreen>
      )
    },

    // Screen 11: Classification by Sides Practice
    {
      id: 'classify-sides-practice',
      type: 'practice',
      title: 'Practice: Classifying by Sides',
      estimatedTime: 3,
      content: (
        <PracticeScreen
          question={{
            id: 'classify-sides-1',
            question: 'A triangle has sides of lengths 5 cm, 5 cm, and 8 cm. How would you classify this triangle based on its sides?',
            correctAnswer: 'isosceles',
            type: 'text',
            hints: [
              'Look at the side lengths: 5 cm, 5 cm, and 8 cm',
              'How many sides are equal?',
              'If two sides are equal, what type of triangle is it?'
            ],
            explanation: 'Since two sides are equal (both 5 cm), this is an isosceles triangle. An isosceles triangle has exactly two sides of equal length.'
          }}
        />
      )
    },

    // Screen 12: Acute Triangles
    {
      id: 'acute-triangles',
      type: 'concept',
      title: 'Acute Triangles',
      estimatedTime: 2,
      content: (
        <ConceptScreen>
          <ConceptSection title="Acute Triangle" variant="red">
            <p className="mb-3">
              A triangle with all three angles less than 90 degrees.
            </p>
            
            <TeachingMoment variant="red">
              In an acute triangle, all vertices are "pointed" rather than "blunt." The center of the circumscribed circle (the circle that passes through all three vertices) lies inside the triangle.
            </TeachingMoment>
          </ConceptSection>
        </ConceptScreen>
      )
    },

    // Screen 13: Right Triangles
    {
      id: 'right-triangles',
      type: 'concept',
      title: 'Right Triangles',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <ConceptSection title="Right Triangle" variant="orange">
            <p className="mb-3">
              A triangle with one angle equal to 90 degrees.
            </p>
            
            <TeachingMoment variant="orange">
              The side opposite to the right angle is called the hypotenuse, and it's always the longest side of the triangle. The other two sides are called legs or catheti. Right triangles are fundamental in trigonometry and have numerous applications in construction, navigation, and physics.
            </TeachingMoment>
          </ConceptSection>
        </ConceptScreen>
      )
    },

    // Screen 14: Obtuse Triangles
    {
      id: 'obtuse-triangles',
      type: 'concept',
      title: 'Obtuse Triangles',
      estimatedTime: 2,
      content: (
        <ConceptScreen>
          <ConceptSection title="Obtuse Triangle" variant="teal">
            <p className="mb-3">
              A triangle with one angle greater than 90 degrees.
            </p>
            
            <TeachingMoment variant="teal">
              In an obtuse triangle, the center of the circumscribed circle lies outside the triangle. Also, the largest angle is the obtuse angle, and the longest side is opposite to this angle.
            </TeachingMoment>
          </ConceptSection>
        </ConceptScreen>
      )
    },

    // Screen 15: Classification Example
    {
      id: 'classification-example',
      type: 'example',
      title: 'Triangle Classification Example',
      estimatedTime: 4,
      content: (
        <ExampleScreen
          title="Classification Example"
          problem="Classify the triangle with sides of lengths 5 cm, 5 cm, and 8 cm based on its sides and angles."
          variant="green"
          solution={
            <div>
              <p className="mb-2">Since two sides are equal (5 cm), this is an isosceles triangle.</p>
              <p className="mb-2">To determine the angle classification, we can use the cosine law:</p>
              <p className="mb-2">cos(C) = (a² + b² - c²) / (2ab)</p>
              <p className="mb-2">where C is the angle opposite to the side of length 8 cm, and a and b are both 5 cm.</p>
              <StepList 
                steps={[
                  'cos(C) = (5² + 5² - 8²) / (2 × 5 × 5)',
                  'cos(C) = (25 + 25 - 64) / 50',
                  'cos(C) = -14 / 50',
                  'cos(C) = -0.28'
                ]}
                variant="green"
              />
              <p className="mt-2">Since cos(C) is negative, C is greater than 90°, making this an obtuse triangle.</p>
            </div>
          }
          answer="Therefore, the triangle is an isosceles obtuse triangle."
        />
      )
    },

    // Continue with remaining screens...
    // I'll add more screens in the next function call to keep this manageable

  ]
};

// Export a function to get additional screens (screens 16-28)
// Import the additional screens from the second part
import { additionalTriangleScreens } from './TriangleMicroLessonDataPart2';

// Combine all screens into the complete lesson data
triangleMicroLessonData.screens = [...triangleMicroLessonData.screens, ...additionalTriangleScreens];
