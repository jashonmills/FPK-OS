import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../ConceptScreen';
import { ExampleScreen, StepList } from '../ExampleScreen';
import { PracticeScreen } from '../PracticeScreen';
import { MicroLessonData, MicroLessonScreen } from '../MicroLessonContainer';
import { CheckCircle, Circle, Target } from 'lucide-react';

export const circlesMicroLessons: MicroLessonData = {
  id: 'circles-micro-lesson',
  moduleTitle: 'Module 4: Circles and Circle Properties',
  totalScreens: 20,
  screens: [
    // Screen 1: Introduction & Learning Objectives
    {
      id: 'intro-objectives',
      type: 'concept',
      title: 'Introduction to Circles',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⭕🌎🎯</div>
              <h2 className="text-2xl font-semibold mb-4">Welcome to Circles!</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Explore circles, one of the most fundamental and important shapes in geometry. 
                Study their properties, parts, and relationships with other geometric figures.
              </p>
            </div>

            <TeachingMoment>
              Circles are perhaps the most perfect geometric shape, with every point on the 
              circumference equidistant from the center. This perfect symmetry has fascinated 
              mathematicians, artists, and philosophers for millennia. From the wheels on vehicles 
              to the orbits of planets, circles are fundamental to our understanding of the universe!
            </TeachingMoment>

            <div>
              <h3 className="text-xl font-semibold mb-4">Learning Objectives</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Understand basic properties of circles</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Identify and describe parts of a circle</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Calculate circumference and area</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Apply circle theorems and properties</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Work with circles in coordinate geometry</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Solve real-world circle problems</span>
                </div>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 2: What is a Circle?
    {
      id: 'circle-definition',
      type: 'concept',
      title: 'What is a Circle?',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⭕</div>
              <h2 className="text-2xl font-bold mb-4">Understanding Circles</h2>
            </div>

            <ConceptSection title="Definition" variant="blue">
              <p className="text-lg mb-4">
                A circle is the set of all points in a plane that are at a fixed distance 
                (called the radius) from a fixed point (called the center).
              </p>
            </ConceptSection>

            <TeachingMoment>
              This definition highlights the fundamental property of a circle: every point on the 
              circle is exactly the same distance from the center. This property gives circles 
              their perfect symmetry and makes them unique among geometric shapes. If you were 
              to rotate a circle around its center by any angle, it would look exactly the same!
            </TeachingMoment>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-3">Key Properties</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>All points equidistant from center</li>
                  <li>Perfect rotational symmetry</li>
                  <li>Infinite lines of symmetry through center</li>
                  <li>No corners or edges</li>
                  <li>Constant curvature</li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Real-World Examples</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Wheels and tires</li>
                  <li>Clock faces</li>
                  <li>Planetary orbits</li>
                  <li>Ripples in water</li>
                  <li>Pizza and plates</li>
                </ul>
              </div>
            </div>

            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <Circle className="h-16 w-16 mx-auto mb-3 text-primary" />
              <p className="text-sm text-muted-foreground">
                Every point on this circle is exactly the same distance from the center
              </p>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 3: Parts of a Circle - Basic Components
    {
      id: 'circle-parts-basic',
      type: 'concept',
      title: 'Basic Parts of a Circle',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯⭕📐</div>
              <h2 className="text-2xl font-bold mb-4">Basic Circle Components</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ConceptSection title="Center" variant="blue">
                <p className="text-sm">
                  The fixed point from which all points on the circle are equidistant.
                </p>
                <div className="text-center mt-3">
                  <div className="text-2xl">•</div>
                  <p className="text-xs text-muted-foreground">Center point</p>
                </div>
              </ConceptSection>

              <ConceptSection title="Radius" variant="green">
                <p className="text-sm">
                  The distance from the center to any point on the circle.
                </p>
                <div className="text-center mt-3">
                  <div className="text-2xl">•———</div>
                  <p className="text-xs text-muted-foreground">From center to edge</p>
                </div>
              </ConceptSection>

              <ConceptSection title="Diameter" variant="purple">
                <p className="text-sm">
                  A line segment that passes through the center with endpoints on the circle. 
                  The diameter is twice the radius.
                </p>
                <div className="text-center mt-3">
                  <div className="text-2xl">———•———</div>
                  <p className="text-xs text-muted-foreground">d = 2r</p>
                </div>
              </ConceptSection>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Key Relationships</h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Diameter = 2 × Radius</strong> (d = 2r)</li>
                <li><strong>Radius = Diameter ÷ 2</strong> (r = d/2)</li>
                <li>All radii of the same circle are equal</li>
                <li>The diameter is the longest chord of a circle</li>
              </ul>
            </div>

            <TeachingMoment>
              The radius is like the "reach" of a circle - it determines how big the circle is. 
              The diameter, being twice the radius, gives us the "width" of the circle. These 
              simple relationships are the foundation for all circle calculations!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 4: More Parts of a Circle
    {
      id: 'circle-parts-advanced',
      type: 'concept',
      title: 'More Circle Components',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">📏🏹🎯</div>
              <h2 className="text-2xl font-bold mb-4">Advanced Circle Components</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ConceptSection title="Chord" variant="red">
                <p className="text-sm mb-2">A line segment with both endpoints on the circle.</p>
                <div className="bg-red-100 p-2 rounded text-xs">
                  The diameter is the longest possible chord
                </div>
              </ConceptSection>

              <ConceptSection title="Arc" variant="orange">
                <p className="text-sm mb-2">A portion of the circumference of a circle.</p>
                <div className="bg-orange-100 p-2 rounded text-xs">
                  Can be major (&gt;180°) or minor (&lt;180°)
                </div>
              </ConceptSection>

              <ConceptSection title="Sector" variant="teal">
                <p className="text-sm mb-2">A region bounded by two radii and an arc.</p>
                <div className="bg-teal-100 p-2 rounded text-xs">
                  Like a "slice of pie"
                </div>
              </ConceptSection>

              <ConceptSection title="Segment" variant="purple">
                <p className="text-sm mb-2">A region bounded by a chord and an arc.</p>
                <div className="bg-purple-100 p-2 rounded text-xs">
                  The area "cut off" by a chord
                </div>
              </ConceptSection>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ConceptSection title="Tangent" variant="blue">
                <p className="text-sm mb-2">A line that touches the circle at exactly one point.</p>
                <div className="bg-blue-100 p-2 rounded text-xs">
                  Always perpendicular to the radius at point of contact
                </div>
              </ConceptSection>

              <ConceptSection title="Secant" variant="green">
                <p className="text-sm mb-2">A line that intersects the circle at exactly two points.</p>
                <div className="bg-green-100 p-2 rounded text-xs">
                  Extends beyond the circle on both sides
                </div>
              </ConceptSection>
            </div>

            <TeachingMoment>
              Each of these circle parts serves different purposes in geometry and real-world 
              applications. Chords appear in bridge construction, arcs in architecture, sectors 
              in pie charts, and tangents in gear design. Understanding these components opens 
              up a world of practical applications!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 5: Circle Parts Example
    {
      id: 'circle-parts-example',
      type: 'example',
      title: 'Identifying Circle Parts',
      estimatedTime: 4,
      content: (
        <ExampleScreen
          title="Circle Component Analysis"
          problem="In a circle with center O, points A and B lie on the circle. If the length of chord AB equals the radius, what is the measure of central angle AOB?"
          solution={
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Step-by-Step Solution</h4>
                <StepList 
                  steps={[
                    "Draw circle with center O and points A, B on circumference",
                    "Draw radii OA and OB, and chord AB",
                    "Since OA and OB are radii, they have equal length r",
                    "Given: chord AB also has length r",
                    "Triangle AOB is equilateral (all sides equal to r)",
                    "In equilateral triangle, all angles = 60°",
                    "Therefore, central angle AOB = 60°"
                  ]}
                  variant="blue"
                />
              </div>
              
              <div className="bg-blue-100 p-3 rounded">
                <p className="text-sm font-semibold text-blue-800">Answer: The central angle AOB is 60°</p>
              </div>

              <TeachingMoment>
                This problem illustrates an important relationship: when a chord has the same 
                length as the radius, it subtends a 60° angle at the center. This happens 
                because the triangle formed is equilateral!
              </TeachingMoment>
            </div>
          }
          answer="60° - forms an equilateral triangle"
          variant="blue"
        />
      )
    }
  ]
};