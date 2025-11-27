import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../ConceptScreen';
import { ExampleScreen, StepList } from '../ExampleScreen';
import { PracticeScreen } from '../PracticeScreen';
import { MicroLessonScreen } from '../MicroLessonContainer';
import { CheckCircle } from 'lucide-react';

export const pointsLinesPlanesMicroLessonsPartTwo: MicroLessonScreen[] = [
  // Screen 7: Angle Classification Practice
  {
    id: 'angle-classification',
    type: 'example',
    title: 'Classify These Angles',
    estimatedTime: 3,
    content: (
      <ExampleScreen
        title="Angle Classification Examples"
        problem="Classify each of the following angles by type:"
        solution={
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <p><strong>45°</strong> → Acute angle</p>
                <p className="text-sm text-muted-foreground">Less than 90°</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p><strong>90°</strong> → Right angle</p>
                <p className="text-sm text-muted-foreground">Exactly 90°</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p><strong>120°</strong> → Obtuse angle</p>
                <p className="text-sm text-muted-foreground">Between 90° and 180°</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p><strong>180°</strong> → Straight angle</p>
                <p className="text-sm text-muted-foreground">Exactly 180°</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p><strong>270°</strong> → Reflex angle</p>
                <p className="text-sm text-muted-foreground">Between 180° and 360°</p>
              </div>
            </div>
          </div>
        }
        answer="Compare each angle to key benchmarks: 90°, 180°, 360°"
        variant="blue"
      />
    )
  },

  // Screen 8: Angle Relationships
  {
    id: 'angle-relationships',
    type: 'concept',
    title: 'Angle Relationships',
    estimatedTime: 5,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🔗📐</div>
            <h2 className="text-2xl font-bold mb-4">Angle Relationships</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConceptSection title="Complementary Angles" variant="orange">
              <p className="text-sm mb-2"><strong>Sum = 90°</strong></p>
              <p className="text-xs text-muted-foreground mb-2">Two angles that "complete" each other to form a right angle</p>
              <div className="bg-orange-100 p-2 rounded text-xs">
                Example: 30° + 60° = 90°
              </div>
            </ConceptSection>
            
            <ConceptSection title="Supplementary Angles" variant="teal">
              <p className="text-sm mb-2"><strong>Sum = 180°</strong></p>
              <p className="text-xs text-muted-foreground mb-2">Two angles that "supplement" each other to form a straight angle</p>
              <div className="bg-teal-100 p-2 rounded text-xs">
                Example: 110° + 70° = 180°
              </div>
            </ConceptSection>

            <ConceptSection title="Vertical Angles" variant="red">
              <p className="text-sm mb-2"><strong>Opposite angles are equal</strong></p>
              <p className="text-xs text-muted-foreground mb-2">Formed by two intersecting lines</p>
              <div className="bg-red-100 p-2 rounded text-xs">
                If two lines intersect, opposite angles are congruent
              </div>
            </ConceptSection>

            <ConceptSection title="Adjacent Angles" variant="blue">
              <p className="text-sm mb-2"><strong>Share a vertex and side</strong></p>
              <p className="text-xs text-muted-foreground mb-2">Next to each other without overlapping</p>
              <div className="bg-blue-100 p-2 rounded text-xs">
                Common vertex + common side + no overlap
              </div>
            </ConceptSection>
          </div>

          <TeachingMoment>
            These angle relationships are fundamental building blocks in geometry. They appear everywhere - 
            from the corners of your room to the angles in complex geometric proofs!
          </TeachingMoment>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 9: Complementary and Supplementary Practice
  {
    id: 'complementary-supplementary-example',
    type: 'example',
    title: 'Complementary & Supplementary Practice',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Angle Relationships Examples"
        problem="Solve these angle relationship problems:"
        solution={
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 1: Complementary Angles</h4>
              <p className="text-sm mb-2">If two angles are complementary and one is 35°, find the other.</p>
              <StepList 
                steps={[
                  "Complementary angles sum to 90°",
                  "35° + x = 90°",
                  "x = 90° - 35°",
                  "x = 55°"
                ]}
                variant="green"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 2: Supplementary Angles</h4>
              <p className="text-sm mb-2">If two angles are supplementary and one is 125°, find the other.</p>
              <StepList 
                steps={[
                  "Supplementary angles sum to 180°",
                  "125° + x = 180°",
                  "x = 180° - 125°",
                  "x = 55°"
                ]}
                variant="blue"
              />
            </div>
          </div>
        }
        answer="Use the sum formulas: Complementary = 90°, Supplementary = 180°"
        variant="purple"
      />
    )
  },

  // Screen 10: Introduction to Polygons
  {
    id: 'polygons-intro',
    type: 'concept',
    title: 'What is a Polygon?',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">⬢🔷🔶</div>
            <h2 className="text-2xl font-bold mb-4">Understanding Polygons</h2>
          </div>

          <ConceptSection title="Definition" variant="green">
            <p className="text-lg mb-4">
              A polygon is a closed figure made up of line segments. The line segments are called 
              <strong> sides</strong>, and the points where sides meet are called <strong>vertices</strong>.
            </p>
          </ConceptSection>

          <TeachingMoment>
            The word "polygon" comes from Greek: "poly" means "many" and "gon" means "angle." 
            So a polygon is literally a shape with many angles. Every polygon has the same number of sides as angles!
          </TeachingMoment>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="font-semibold text-sm">Triangle</div>
              <div className="text-xs text-muted-foreground">3 sides</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="font-semibold text-sm">Quadrilateral</div>
              <div className="text-xs text-muted-foreground">4 sides</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="font-semibold text-sm">Pentagon</div>
              <div className="text-xs text-muted-foreground">5 sides</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="font-semibold text-sm">Hexagon</div>
              <div className="text-xs text-muted-foreground">6 sides</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="font-semibold text-sm">Heptagon</div>
              <div className="text-xs text-muted-foreground">7 sides</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="font-semibold text-sm">Octagon</div>
              <div className="text-xs text-muted-foreground">8 sides</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="font-semibold text-sm">Nonagon</div>
              <div className="text-xs text-muted-foreground">9 sides</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="font-semibold text-sm">Decagon</div>
              <div className="text-xs text-muted-foreground">10 sides</div>
            </div>
          </div>

          <TeachingMoment>
            Many everyday objects are polygons! Stop signs are octagons, most rooms are quadrilaterals, 
            and many sports fields are rectangles. Spotting these shapes helps reinforce geometric concepts.
          </TeachingMoment>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 11: Polygon Angle Formulas
  {
    id: 'polygon-angles',
    type: 'concept',
    title: 'Polygon Angle Formulas',
    estimatedTime: 5,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📐🧮</div>
            <h2 className="text-2xl font-bold mb-4">Polygon Angle Formulas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConceptSection title="Sum of Interior Angles" variant="blue">
              <p className="text-lg mb-2"><strong>Formula: (n-2) × 180°</strong></p>
              <p className="text-sm text-muted-foreground">where n = number of sides</p>
              <div className="bg-blue-100 p-3 rounded mt-3">
                <p className="text-sm"><strong>Example:</strong></p>
                <p className="text-xs">Pentagon: (5-2) × 180° = 540°</p>
              </div>
            </ConceptSection>
            
            <ConceptSection title="Sum of Exterior Angles" variant="green">
              <p className="text-lg mb-2"><strong>Always equals 360°</strong></p>
              <p className="text-sm text-muted-foreground">for any polygon</p>
              <div className="bg-green-100 p-3 rounded mt-3">
                <p className="text-sm"><strong>Why?</strong></p>
                <p className="text-xs">Walking around any polygon = one full turn</p>
              </div>
            </ConceptSection>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">For Regular Polygons</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Each interior angle:</strong> (n-2) × 180° ÷ n</li>
              <li><strong>Each exterior angle:</strong> 360° ÷ n</li>
            </ul>
          </div>

          <TeachingMoment>
            These formulas work because any polygon can be divided into triangles from one vertex. 
            A polygon with n sides creates (n-2) triangles, each contributing 180° to the total!
          </TeachingMoment>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 12: Polygon Angles Example
  {
    id: 'polygon-angles-example',
    type: 'example',
    title: 'Calculating Polygon Angles',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Polygon Angle Calculations"
        problem="Find the sum of interior angles and each interior angle for a regular hexagon."
        solution={
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Step-by-Step Solution</h4>
              <StepList 
                steps={[
                  "Identify: A hexagon has n = 6 sides",
                  "Sum of interior angles = (n-2) × 180°",
                  "Sum = (6-2) × 180° = 4 × 180° = 720°",
                  "For regular hexagon: Each angle = 720° ÷ 6 = 120°"
                ]}
                variant="purple"
              />
            </div>
            
            <div className="bg-green-100 p-3 rounded">
              <p className="text-sm"><strong>Answer:</strong> Sum = 720°, Each angle = 120°</p>
            </div>
          </div>
        }
        answer="Sum of interior angles = 720°, Each interior angle = 120°"
        variant="green"
      />
    )
  },

  // Screen 13: Types of Polygons
  {
    id: 'polygon-types',
    type: 'concept',
    title: 'Types of Polygons',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">⚡🔄⭐</div>
            <h2 className="text-2xl font-bold mb-4">Classifying Polygons</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConceptSection title="Regular Polygon" variant="green">
              <p className="text-sm mb-2"><strong>All sides and angles equal</strong></p>
              <p className="text-xs text-muted-foreground mb-2">Perfect symmetry in both dimensions</p>
              <div className="bg-green-100 p-2 rounded text-xs">
                Examples: Equilateral triangle, square, regular pentagon
              </div>
            </ConceptSection>
            
            <ConceptSection title="Irregular Polygon" variant="orange">
              <p className="text-sm mb-2"><strong>Unequal sides or angles</strong></p>
              <p className="text-xs text-muted-foreground mb-2">Most real-world polygons are irregular</p>
              <div className="bg-orange-100 p-2 rounded text-xs">
                Examples: Most triangles, rectangles, house shapes
              </div>
            </ConceptSection>

            <ConceptSection title="Convex Polygon" variant="blue">
              <p className="text-sm mb-2"><strong>All interior angles &lt; 180°</strong></p>
              <p className="text-xs text-muted-foreground mb-2">No "dents" or indentations</p>
              <div className="bg-blue-100 p-2 rounded text-xs">
                All vertices point "outward"
              </div>
            </ConceptSection>

            <ConceptSection title="Concave Polygon" variant="red">
              <p className="text-sm mb-2"><strong>At least one angle &gt; 180°</strong></p>
              <p className="text-xs text-muted-foreground mb-2">Has "dents" that point inward</p>
              <div className="bg-red-100 p-2 rounded text-xs">
                At least one vertex points "inward"
              </div>
            </ConceptSection>
          </div>

          <TeachingMoment>
            You can test if a polygon is convex by extending each side into a line. 
            If all other vertices are on the same side of each extended line, it's convex!
          </TeachingMoment>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 14: Polygon Classification Example
  {
    id: 'polygon-classification-example',
    type: 'example',
    title: 'Classify This Polygon',
    estimatedTime: 3,
    content: (
      <ExampleScreen
        title="Polygon Classification"
        problem="Classify this polygon: A pentagon with all sides equal but one interior angle of 200°."
        solution={
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Classification Analysis</h4>
              <StepList 
                steps={[
                  "Number of sides: 5 → Pentagon",
                  "All sides equal, but angles unequal → Irregular",
                  "One angle > 180° (200°) → Concave"
                ]}
                variant="red"
              />
            </div>
            
            <div className="bg-red-100 p-3 rounded">
              <p className="text-sm"><strong>Answer:</strong> Irregular, concave pentagon</p>
            </div>
          </div>
        }
        answer="Irregular, concave pentagon"
        variant="red"
      />
    )
  },

  // Screen 15: Module Summary
  {
    id: 'module-summary',
    type: 'concept',
    title: 'Module Summary',
    estimatedTime: 3,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉🏆📚</div>
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="text-lg text-muted-foreground">You've mastered the fundamentals of geometry!</p>
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              What You've Learned
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Lines, line segments, and rays</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Six types of angles</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Angle relationships</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Polygon properties and formulas</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Polygon classification</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Problem-solving strategies</span>
                </div>
              </div>
            </div>
          </div>

          <TeachingMoment>
            These fundamental concepts are the building blocks for all of geometry. As you move forward, 
            you'll see how lines, angles, and polygons combine to create complex geometric relationships 
            and beautiful mathematical patterns!
          </TeachingMoment>

          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h4 className="font-semibold mb-2">Up Next: Triangles!</h4>
            <p className="text-sm text-muted-foreground">
              Ready to explore one of geometry's most important shapes? 
              In the next module, we'll dive deep into triangle properties, theorems, and applications!
            </p>
          </div>
        </div>
      </ConceptScreen>
    )
  }
];