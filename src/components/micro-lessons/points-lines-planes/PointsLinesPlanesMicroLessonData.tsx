import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../ConceptScreen';
import { ExampleScreen, StepList } from '../ExampleScreen';
import { PracticeScreen } from '../PracticeScreen';
import { MicroLessonData, MicroLessonScreen } from '../MicroLessonContainer';
import { CheckCircle } from 'lucide-react';

export const pointsLinesPlanesMicroLessons: MicroLessonData = {
  id: 'points-lines-planes',
  moduleTitle: 'Points, Lines & Planes',
  totalScreens: 15,
  screens: [
    // Screen 1: Introduction
    {
      id: 'intro',
      type: 'concept',
      title: 'Welcome to Geometry Fundamentals',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🔺📐📏</div>
              <h2 className="text-2xl font-bold mb-4">Welcome to Module 1: Lines, Angles & Polygons</h2>
              <p className="text-lg text-muted-foreground">Foundation concepts in geometry</p>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">What You'll Learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Identify different types of lines and angles</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Understand polygon properties</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Apply geometric principles</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Recognize shapes in real world</span>
                </div>
              </div>
            </div>

            <TeachingMoment>
              Geometry is all around us! From building designs to nature patterns, geometric principles 
              govern our physical world. As you learn, try to spot these concepts in your daily life!
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 2: What is a Line?
    {
      id: 'lines-intro',
      type: 'concept',
      title: 'What is a Line?',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">↔️</div>
              <h2 className="text-2xl font-bold mb-4">Understanding Lines</h2>
            </div>

            <ConceptSection title="Definition" variant="blue">
              <p className="text-lg mb-4">
                A line is a straight path that extends infinitely in both directions. 
                It has no thickness and is one-dimensional.
              </p>
            </ConceptSection>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Key Properties of Lines</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>A line has no endpoints</li>
                <li>A line is perfectly straight (no curves)</li>
                <li>A line has infinite length</li>
                <li>A line has no thickness</li>
              </ul>
            </div>

            <TeachingMoment>
              When we draw a "line" on paper, we're actually drawing a representation! 
              A true mathematical line would extend forever and have no width.
            </TeachingMoment>

            <div className="text-center bg-white p-6 rounded-lg border">
              <div className="font-mono text-lg">
                ←————————————————————→
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Arrows show the line extends infinitely in both directions
              </p>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 3: Line Segments and Rays
    {
      id: 'segments-rays',
      type: 'concept',
      title: 'Line Segments & Rays',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">📏🔦</div>
              <h2 className="text-2xl font-bold mb-4">Line Segments & Rays</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ConceptSection title="Line Segments" variant="green">
                <p className="mb-3">A portion of a line with TWO endpoints</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Has two endpoints</li>
                  <li>Has measurable length</li>
                  <li>Is straight</li>
                </ul>
                <div className="text-center mt-4">
                  <div className="font-mono text-lg">A●————————●B</div>
                  <p className="text-xs text-muted-foreground">Line segment AB</p>
                </div>
              </ConceptSection>

              <ConceptSection title="Rays" variant="orange">
                <p className="mb-3">A portion of a line with ONE endpoint</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Has one endpoint</li>
                  <li>Extends infinitely in one direction</li>
                  <li>Is straight</li>
                </ul>
                <div className="text-center mt-4">
                  <div className="font-mono text-lg">A●————————→</div>
                  <p className="text-xs text-muted-foreground">Ray starting at A</p>
                </div>
              </ConceptSection>
            </div>

            <TeachingMoment>
              Think of a ray like a flashlight beam! It starts at a point (the flashlight) 
              and continues forever in one direction.
            </TeachingMoment>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Naming Convention</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Line segment AB:</strong> Uses endpoints with segment symbol</li>
                <li><strong>Ray AB:</strong> Uses starting point first, then any point on ray</li>
                <li><strong>Line AB:</strong> Uses any two points with line symbol</li>
              </ul>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 4: Practice with Lines
    {
      id: 'lines-practice',
      type: 'practice',
      title: 'Identify Lines, Segments & Rays',
      estimatedTime: 3,
      content: (
        <PracticeScreen
          problem="Look at the figure below and identify all the lines, line segments, and rays."
          hint="Remember: Lines extend infinitely, segments have two endpoints, rays have one endpoint and extend infinitely."
          solution="Line ABD: Extends infinitely in both directions | Line segment AB: Has endpoints A and B | Line segment BD: Has endpoints B and D | Ray BC: Starts at B, extends through C"
        >
          <div className="bg-white p-6 rounded border text-center font-mono text-lg mb-4">
            <div>C</div>
            <div>|</div>
            <div>|</div>
            <div>A————————B————————D</div>
          </div>
        </PracticeScreen>
      )
    },

    // Screen 5: Introduction to Angles
    {
      id: 'angles-intro',
      type: 'concept',
      title: 'What is an Angle?',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">📐</div>
              <h2 className="text-2xl font-bold mb-4">Understanding Angles</h2>
            </div>

            <ConceptSection title="Definition" variant="purple">
              <p className="text-lg mb-4">
                An angle is formed when two rays share a common endpoint. 
                The common endpoint is the <strong>vertex</strong>, and the rays are the <strong>sides</strong>.
              </p>
            </ConceptSection>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-3">Angle Parts</h4>
                <div className="text-center">
                  <div className="text-4xl mb-2">∠</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-left">
                    <li><strong>Vertex:</strong> Common endpoint</li>
                    <li><strong>Sides:</strong> The two rays</li>
                    <li><strong>Measure:</strong> Amount of rotation</li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Key Facts</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Angles are measured in degrees (°)</li>
                  <li>A full rotation = 360°</li>
                  <li>Half rotation = 180°</li>
                  <li>Quarter rotation = 90°</li>
                </ul>
              </div>
            </div>

            <TeachingMoment>
              "Angle" comes from Latin "angulus" meaning "corner"! 
              The size depends on rotation amount, not ray length.
            </TeachingMoment>
          </div>
        </ConceptScreen>
      )
    },

    // Screen 6: Types of Angles
    {
      id: 'angle-types',
      type: 'concept',
      title: 'Types of Angles',
      estimatedTime: 5,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">📐📏📊</div>
              <h2 className="text-2xl font-bold mb-4">Types of Angles</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2">Acute Angle</h4>
                <p className="text-sm mb-2"><strong>Less than 90°</strong></p>
                <div className="text-center text-2xl mb-2">⟨</div>
                <p className="text-xs text-red-600">"Acute" means sharp - like the letter V</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-2">Right Angle</h4>
                <p className="text-sm mb-2"><strong>Exactly 90°</strong></p>
                <div className="text-center text-2xl mb-2">⟂</div>
                <p className="text-xs text-blue-600">Often marked with a small square</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-700 mb-2">Obtuse Angle</h4>
                <p className="text-sm mb-2"><strong>90° to 180°</strong></p>
                <div className="text-center text-2xl mb-2">⟩</div>
                <p className="text-xs text-green-600">"Obtuse" means blunt or dull</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-700 mb-2">Straight Angle</h4>
                <p className="text-sm mb-2"><strong>Exactly 180°</strong></p>
                <div className="text-center text-2xl mb-2">—</div>
                <p className="text-xs text-purple-600">Forms a straight line</p>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-indigo-700 mb-2">Reflex Angle</h4>
                <p className="text-sm mb-2"><strong>180° to 360°</strong></p>
                <div className="text-center text-2xl mb-2">↻</div>
                <p className="text-xs text-indigo-600">The larger "reflex" angle</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-700 mb-2">Full Angle</h4>
                <p className="text-sm mb-2"><strong>Exactly 360°</strong></p>
                <div className="text-center text-2xl mb-2">○</div>
                <p className="text-xs text-yellow-600">A complete rotation</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Quick Memory Tips</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Acute:</strong> "A-cute" = small and sharp</li>
                <li><strong>Right:</strong> "Right" = correct, perfect 90°</li>
                <li><strong>Obtuse:</strong> "Obtuse" = dull, wide angle</li>
                <li><strong>Straight:</strong> Makes a straight line</li>
              </ul>
            </div>
          </div>
        </ConceptScreen>
      )
    }
  ]
};