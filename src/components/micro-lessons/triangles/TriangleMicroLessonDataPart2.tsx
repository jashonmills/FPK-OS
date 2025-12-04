import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../ConceptScreen';
import { ExampleScreen, StepList } from '../ExampleScreen';
import { PracticeScreen } from '../PracticeScreen';
import { MicroLessonScreen } from '../MicroLessonContainer';
import { Lightbulb } from 'lucide-react';

export const additionalTriangleScreens: MicroLessonScreen[] = [
  // Screen 16: Pythagorean Theorem Statement
  {
    id: 'pythagorean-theorem',
    type: 'concept',
    title: 'The Pythagorean Theorem',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Statement of the Pythagorean Theorem</h3>
            <p className="mb-4 leading-relaxed">
              In a right triangle, the square of the length of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the lengths of the other two sides.
            </p>
            
            <p className="mb-4">
              If a and b are the lengths of the legs (the sides adjacent to the right angle) and c is the length of the hypotenuse, then:
            </p>
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-800 mb-2 text-center text-xl">c² = a² + b²</h4>
            </div>
          </div>
          
          <TeachingMoment>
            The Pythagorean theorem is named after the ancient Greek mathematician Pythagoras, although evidence suggests it was known to several ancient civilizations. This theorem is one of the most fundamental relationships in Euclidean geometry and has countless applications in mathematics, physics, engineering, and everyday life.
          </TeachingMoment>
          
          <TeachingMoment>
            There are over 350 different proofs of the Pythagorean theorem! One intuitive way to understand it is to draw squares on each side of a right triangle. The area of the square on the hypotenuse equals the sum of the areas of the squares on the other two sides.
          </TeachingMoment>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 17: Pythagorean Applications
  {
    id: 'pythagorean-applications',
    type: 'concept',
    title: 'Applications of the Pythagorean Theorem',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-3">Applications</h3>
          
          <ConceptSection title="1. Finding the length of the hypotenuse" variant="blue">
            <p className="mb-3">
              If you know the lengths of the two legs, you can find the length of the hypotenuse using the Pythagorean theorem.
            </p>
            
            <TeachingMoment variant="blue">
              This application is particularly useful in construction and navigation. For example, if you need to place a ladder against a wall, the Pythagorean theorem helps determine how long the ladder needs to be.
            </TeachingMoment>
          </ConceptSection>

          <ConceptSection title="2. Finding the length of a leg" variant="green">
            <p className="mb-3">
              If you know the length of the hypotenuse and one leg, you can find the length of the other leg using the Pythagorean theorem.
            </p>
            
            <TeachingMoment variant="green">
              Rearranging the Pythagorean theorem, we get a² = c² - b² or b² = c² - a². This allows us to find either leg when we know the hypotenuse and the other leg.
            </TeachingMoment>
          </ConceptSection>

          <ConceptSection title="3. Checking if a triangle is a right triangle" variant="purple">
            <p className="mb-3">
              If the Pythagorean theorem holds for three sides of a triangle, then the triangle is a right triangle.
            </p>
            
            <TeachingMoment variant="purple">
              This application is the basis for the 3-4-5 rule used by carpenters and builders to ensure corners are square. If a triangle has sides of lengths 3, 4, and 5 units, it must be a right triangle because 3² + 4² = 5² (9 + 16 = 25).
            </TeachingMoment>
          </ConceptSection>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 18: Pythagorean Example
  {
    id: 'pythagorean-example',
    type: 'example',
    title: 'Pythagorean Theorem Example',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Ladder Problem"
        problem="A ladder 10 meters long leans against a vertical wall. If the bottom of the ladder is 6 meters from the base of the wall, how high up the wall does the ladder reach?"
        variant="orange"
        solution={
          <div>
            <p className="mb-2">Let's denote the height up the wall as h.</p>
            <p className="mb-2">The ladder forms a right triangle with the wall and the ground.</p>
            <p className="mb-2">Using the Pythagorean theorem:</p>
            <StepList 
              steps={[
                '10² = 6² + h²',
                '100 = 36 + h²',
                'h² = 64',
                'h = 8'
              ]}
              variant="orange"
            />
          </div>
        }
        answer="Therefore, the ladder reaches 8 meters up the wall."
      />
    )
  },

  // Screen 19: Triangle Congruence
  {
    id: 'triangle-congruence',
    type: 'concept',
    title: 'Triangle Congruence',
    estimatedTime: 3,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">What is Triangle Congruence?</h3>
            <p className="mb-4 leading-relaxed">
              Two triangles are congruent if they have the same shape and size. This means that all corresponding sides and angles are equal.
            </p>
          </div>
          
          <TeachingMoment>
            Congruent triangles are essentially identical copies of each other. If you cut out two congruent triangles from paper, you could place one directly on top of the other, and they would match perfectly. In mathematical terms, congruent triangles can be mapped onto each other through rigid transformations (translations, rotations, and reflections).
          </TeachingMoment>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 20: Congruence Criteria SSS & SAS
  {
    id: 'congruence-sss-sas',
    type: 'concept',
    title: 'Congruence Criteria: SSS & SAS',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-3">Triangle Congruence Criteria</h3>
          
          <ConceptSection title="1. Side-Side-Side (SSS)" variant="blue">
            <p className="mb-3">
              If three sides of one triangle are equal to three sides of another triangle, then the triangles are congruent.
            </p>
            
            <TeachingMoment variant="blue">
              This criterion makes intuitive sense: if you have three rigid rods of specific lengths, you can only arrange them to form one unique triangle. The SSS criterion is particularly useful in construction and engineering, where structures are often built using rigid components.
            </TeachingMoment>
          </ConceptSection>

          <ConceptSection title="2. Side-Angle-Side (SAS)" variant="green">
            <p className="mb-3">
              If two sides and the included angle of one triangle are equal to two sides and the included angle of another triangle, then the triangles are congruent.
            </p>
            
            <TeachingMoment variant="green">
              The "included angle" is the angle formed by the two sides. It's important to note that the angle must be between the two sides for this criterion to apply. SAS is often used in surveying and navigation, where distances and angles are measured.
            </TeachingMoment>
          </ConceptSection>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 21: Congruence Criteria ASA & AAS
  {
    id: 'congruence-asa-aas',
    type: 'concept',
    title: 'Congruence Criteria: ASA & AAS',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <ConceptSection title="3. Angle-Side-Angle (ASA)" variant="purple">
            <p className="mb-3">
              If two angles and the included side of one triangle are equal to two angles and the included side of another triangle, then the triangles are congruent.
            </p>
            
            <TeachingMoment variant="purple">
              Since the sum of angles in a triangle is always 180°, if two angles are equal, the third angle must also be equal. This means ASA effectively determines all three angles and one side, which is enough to fix the size and shape of the triangle.
            </TeachingMoment>
          </ConceptSection>

          <ConceptSection title="4. Angle-Angle-Side (AAS)" variant="red">
            <p className="mb-3">
              If two angles and a non-included side of one triangle are equal to two angles and the corresponding non-included side of another triangle, then the triangles are congruent.
            </p>
            
            <TeachingMoment variant="red">
              AAS is similar to ASA in that it specifies two angles (which determines the third angle as well) and one side. The difference is that in AAS, the side is not between the two given angles.
            </TeachingMoment>
          </ConceptSection>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 22: Congruence Example
  {
    id: 'congruence-example',
    type: 'example',
    title: 'Triangle Congruence Example',
    estimatedTime: 3,
    content: (
      <ExampleScreen
        title="Congruence Problem"
        problem="Triangle ABC has sides AB = 5 cm, BC = 7 cm, and AC = 9 cm. Triangle DEF has sides DE = 5 cm, EF = 7 cm, and DF = 9 cm. Are these triangles congruent?"
        variant="blue"
        solution={
          <div>
            <p className="mb-2">Compare the corresponding sides:</p>
            <StepList 
              steps={[
                'AB = DE = 5 cm',
                'BC = EF = 7 cm', 
                'AC = DF = 9 cm'
              ]}
              variant="blue"
            />
            <p className="mt-2">Since all three pairs of corresponding sides are equal, we can use the SSS congruence criterion.</p>
          </div>
        }
        answer="Yes, the triangles are congruent by SSS."
      />
    )
  },

  // Screen 23: Triangle Similarity
  {
    id: 'triangle-similarity',
    type: 'concept',
    title: 'Triangle Similarity',
    estimatedTime: 3,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">What is Triangle Similarity?</h3>
            <p className="mb-4 leading-relaxed">
              Two triangles are similar if they have the same shape but not necessarily the same size. This means that all corresponding angles are equal and all corresponding sides are proportional.
            </p>
          </div>
          
          <TeachingMoment>
            Similar triangles appear frequently in everyday life. When you look at objects from different distances, the images formed on your retina are similar triangles. This principle is also used in photography, mapmaking, and architecture. For instance, a small-scale model of a building forms similar triangles with the actual building.
          </TeachingMoment>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 24: Similarity Criteria
  {
    id: 'similarity-criteria',
    type: 'concept',
    title: 'Triangle Similarity Criteria',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-3">Triangle Similarity Criteria</h3>
          
          <ConceptSection title="1. Angle-Angle (AA)" variant="blue">
            <p className="mb-3">
              If two angles of one triangle are equal to two angles of another triangle, then the triangles are similar.
            </p>
            
            <TeachingMoment variant="blue">
              Since the sum of angles in a triangle is 180°, if two angles are equal, the third angle must also be equal. This means AA effectively ensures that all three angles are equal, which guarantees similarity. Note that this only ensures the same shape, not the same size.
            </TeachingMoment>
          </ConceptSection>

          <ConceptSection title="2. Side-Side-Side (SSS)" variant="green">
            <p className="mb-3">
              If the three sides of one triangle are proportional to the three sides of another triangle, then the triangles are similar.
            </p>
            
            <TeachingMoment variant="green">
              For triangles to be similar by SSS, the ratio of corresponding sides must be constant. For example, if one triangle has sides of 3, 4, and 5 units, and another has sides of 6, 8, and 10 units, they are similar because all sides of the second triangle are twice the length of the corresponding sides of the first triangle.
            </TeachingMoment>
          </ConceptSection>

          <ConceptSection title="3. Side-Angle-Side (SAS)" variant="purple">
            <p className="mb-3">
              If two sides of one triangle are proportional to two sides of another triangle, and the included angles are equal, then the triangles are similar.
            </p>
            
            <TeachingMoment variant="purple">
              This criterion combines aspects of both AA and SSS. The equal angles ensure the same shape in that particular corner, while the proportional sides ensure the overall proportionality of the triangles.
            </TeachingMoment>
          </ConceptSection>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 25: Similarity Example
  {
    id: 'similarity-example',
    type: 'example',
    title: 'Triangle Similarity Example',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Similarity Problem"
        problem="Triangle ABC is similar to triangle DEF. If AB = 6 cm, BC = 8 cm, AC = 10 cm, and DE = 9 cm, find EF and DF."
        variant="green"
        solution={
          <div>
            <p className="mb-2">Since the triangles are similar, corresponding sides are proportional.</p>
            <p className="mb-2">The ratio of corresponding sides is:</p>
            <p className="mb-2">DE / AB = 9 / 6 = 3/2</p>
            <p className="mb-2">Therefore:</p>
            <StepList 
              steps={[
                'EF / BC = 3/2',
                'EF = (3/2) × 8 = 12 cm',
                'DF / AC = 3/2',
                'DF = (3/2) × 10 = 15 cm'
              ]}
              variant="green"
            />
          </div>
        }
        answer="Therefore, EF = 12 cm and DF = 15 cm."
      />
    )
  },

  // Screen 26: Area and Perimeter
  {
    id: 'area-perimeter',
    type: 'concept',
    title: 'Area and Perimeter of Triangles',
    estimatedTime: 5,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Perimeter of a Triangle</h3>
            <p className="mb-4">
              The perimeter of a triangle is the sum of the lengths of its three sides.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-800 mb-2 text-center text-xl">P = a + b + c</h4>
            </div>
            
            <TeachingMoment>
              The perimeter is essentially the distance around the triangle. If you were to walk along the boundary of a triangular field, the total distance you'd travel would be the perimeter.
            </TeachingMoment>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Area Formulas</h3>
            
            <ConceptSection title="1. Base and Height Formula" variant="blue">
              <p className="mb-3">
                If b is the base of the triangle and h is the height (the perpendicular distance from the base to the opposite vertex), then:
              </p>
              
              <div className="bg-blue-100 p-3 rounded mb-3">
                <h5 className="font-semibold text-blue-800 text-center">A = (1/2) × b × h</h5>
              </div>
              
              <TeachingMoment variant="blue">
                This is the most commonly used formula for triangle area. Any side of the triangle can be chosen as the base, and the height is always measured perpendicular to the base. This formula works because a triangle is half of a parallelogram with the same base and height.
              </TeachingMoment>
            </ConceptSection>
          </div>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 27: Area Calculation Example
  {
    id: 'area-example',
    type: 'example',
    title: 'Area Calculation Example',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Area Problem"
        problem="Find the area of a triangle with sides of lengths 5 cm, 12 cm, and 13 cm."
        variant="orange"
        solution={
          <div>
            <p className="mb-2">We can use Heron's formula since we know all three sides.</p>
            <p className="mb-2">First, calculate the semi-perimeter s:</p>
            <p className="mb-2">s = (a + b + c) / 2 = (5 + 12 + 13) / 2 = 30 / 2 = 15 cm</p>
            <p className="mb-2">Now apply Heron's formula:</p>
            <StepList 
              steps={[
                'A = √(s × (s - a) × (s - b) × (s - c))',
                'A = √(15 × (15 - 5) × (15 - 12) × (15 - 13))',
                'A = √(15 × 10 × 3 × 2)',
                'A = √(900)',
                'A = 30 cm²'
              ]}
              variant="orange"
            />
            
            <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
              <div className="flex">
                <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-amber-700 font-medium mb-1">Teaching Moment:</p>
                  <p className="text-xs text-amber-700">
                    Notice that this triangle is a right triangle (5² + 12² = 13²), so we could also have used the base and height formula with the legs as base and height: A = (1/2) × 5 × 12 = 30 cm². This serves as a good check on our answer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
        answer="Therefore, the area of the triangle is 30 square centimeters."
      />
    )
  },

  // Screen 28: Summary & Next Steps
  {
    id: 'summary-next-steps',
    type: 'summary',
    title: 'Summary & Next Steps',
    estimatedTime: 3,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Module Summary</h3>
            <p className="leading-relaxed mb-4">
              In this module, we have explored the properties of triangles, different types of triangles, and important theorems related to triangles. We have learned about triangle congruence and similarity, the Pythagorean theorem, and how to calculate the area and perimeter of triangles.
            </p>
            
            <TeachingMoment>
              Triangles are not just abstract mathematical concepts—they are fundamental to our understanding of the physical world. From architecture to navigation, from art to engineering, triangles play a crucial role in countless applications. The principles you've learned in this module will serve as building blocks for more advanced geometric concepts and real-world problem-solving.
            </TeachingMoment>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
            <p className="mb-4 leading-relaxed">
              In the next module, we will explore quadrilaterals and their properties. We'll see how many of the concepts we've learned about triangles can be extended to four-sided shapes, and we'll discover new properties unique to quadrilaterals.
            </p>
            
            <TeachingMoment>
              As you move forward, remember that many quadrilaterals can be divided into triangles. This connection allows us to apply what we know about triangles to understand more complex shapes. Keep an eye out for how triangles form the foundation of other geometric concepts!
            </TeachingMoment>
          </div>
        </div>
      </ConceptScreen>
    )
  }
];