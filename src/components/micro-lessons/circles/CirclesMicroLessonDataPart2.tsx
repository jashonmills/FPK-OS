import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../ConceptScreen';
import { ExampleScreen, StepList } from '../ExampleScreen';
import { PracticeScreen } from '../PracticeScreen';
import { MicroLessonScreen } from '../MicroLessonContainer';
import { CheckCircle, Calculator, Compass } from 'lucide-react';

export const circlesMicroLessonsPartTwo: MicroLessonScreen[] = [
  // Screen 6: Circumference Formula
  {
    id: 'circumference-formula',
    type: 'concept',
    title: 'Circle Circumference',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📏⭕</div>
            <h2 className="text-2xl font-bold mb-4">Circle Circumference</h2>
          </div>

          <ConceptSection title="Definition" variant="blue">
            <p className="text-lg mb-4">
              The circumference of a circle is the distance around the circle.
            </p>
          </ConceptSection>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-lg font-mono text-center mb-2"><strong>C = 2πr = πd</strong></p>
            <p className="text-sm text-center">where r is radius, d is diameter, and π ≈ 3.14159</p>
          </div>

          <TeachingMoment>
            The ratio of a circle's circumference to its diameter is always the same value, 
            which we call π (pi). This remarkable constant appears throughout mathematics and 
            physics. It's an irrational number, meaning its decimal representation never ends 
            or repeats!
          </TeachingMoment>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Formula Variations</h4>
              <ul className="space-y-2 text-sm font-mono">
                <li><strong>C = 2πr</strong> (using radius)</li>
                <li><strong>C = πd</strong> (using diameter)</li>
                <li><strong>r = C/(2π)</strong> (solve for radius)</li>
                <li><strong>d = C/π</strong> (solve for diameter)</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">About π (Pi)</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>π ≈ 3.14159265...</li>
                <li>Irrational number (never ends)</li>
                <li>Ratio of circumference to diameter</li>
                <li>Appears in many mathematical formulas</li>
                <li>Discovered by ancient civilizations</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold mb-2">Memory Tip</h4>
            <p className="text-sm">
              Think "C-2πr" as "Circumference = 2 π r" - you go around (2) the circle 
              using π times the radius!
            </p>
          </div>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 7: Area Formula
  {
    id: 'area-formula',
    type: 'concept',
    title: 'Circle Area',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯📐</div>
            <h2 className="text-2xl font-bold mb-4">Circle Area</h2>
          </div>

          <ConceptSection title="Area Formula" variant="green">
            <p className="text-lg mb-4">
              The area of a circle is the space enclosed by the circumference.
            </p>
          </ConceptSection>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-lg font-mono text-center mb-2"><strong>A = πr²</strong></p>
            <p className="text-sm text-center">where r is the radius</p>
          </div>

          <TeachingMoment>
            The area formula can be understood by thinking of a circle as composed of many 
            thin concentric rings. If you cut these rings and lay them out, they would 
            approximate a triangle with base 2πr (the circumference) and height r. 
            The area of this triangle is ½ × 2πr × r = πr²!
          </TeachingMoment>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Formula Variations</h4>
              <ul className="space-y-2 text-sm font-mono">
                <li><strong>A = πr²</strong> (using radius)</li>
                <li><strong>A = π(d/2)²</strong> (using diameter)</li>
                <li><strong>A = πd²/4</strong> (diameter form)</li>
                <li><strong>r = √(A/π)</strong> (solve for radius)</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Key Points</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Area depends on radius squared</li>
                <li>Doubling radius quadruples area</li>
                <li>Always expressed in square units</li>
                <li>π makes the formula work perfectly</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Why r²?</h4>
            <p className="text-sm">
              Area is 2-dimensional, so it grows with the square of linear dimensions. 
              If you double the radius, you get 4 times the area!
            </p>
          </div>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 8: Circumference and Area Practice
  {
    id: 'circumference-area-example',
    type: 'example',
    title: 'Calculating Circumference & Area',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Circle Measurements"
        problem="A circular garden has a radius of 5 meters. Find its circumference and area."
        solution={
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Step-by-Step Solution</h4>
              <StepList 
                steps={[
                  "Given: radius r = 5 meters",
                  "Circumference formula: C = 2πr",
                  "Substitute: C = 2π(5) = 10π meters",
                  "Approximate: C ≈ 10 × 3.14159 ≈ 31.42 meters",
                  "Area formula: A = πr²",
                  "Substitute: A = π(5)² = 25π square meters",
                  "Approximate: A ≈ 25 × 3.14159 ≈ 78.54 square meters"
                ]}
                variant="green"
              />
            </div>
            
            <div className="bg-green-100 p-3 rounded">
              <p className="text-sm"><strong>Exact answers:</strong> C = 10π m, A = 25π m²</p>
              <p className="text-sm"><strong>Approximate:</strong> C ≈ 31.42 m, A ≈ 78.54 m²</p>
            </div>
          </div>
        }
        answer="Circumference = 10π meters, Area = 25π square meters"
        variant="green"
      />
    )
  },

  // Screen 9: Arc Length and Sector Area
  {
    id: 'arc-sector-formulas',
    type: 'concept',
    title: 'Arc Length & Sector Area',
    estimatedTime: 5,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🏹🥧</div>
            <h2 className="text-2xl font-bold mb-4">Arc Length & Sector Area</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ConceptSection title="Arc Length" variant="purple">
              <p className="text-sm mb-3">Length of a portion of the circumference</p>
              <div className="bg-purple-50 p-3 rounded">
                <p className="font-mono text-sm"><strong>Arc Length = (θ/360°) × 2πr</strong></p>
                <p className="text-xs mt-1">where θ is the central angle in degrees</p>
              </div>
            </ConceptSection>

            <ConceptSection title="Sector Area" variant="orange">
              <p className="text-sm mb-3">Area of a "slice" of the circle</p>
              <div className="bg-orange-50 p-3 rounded">
                <p className="font-mono text-sm"><strong>Sector Area = (θ/360°) × πr²</strong></p>
                <p className="text-xs mt-1">where θ is the central angle in degrees</p>
              </div>
            </ConceptSection>
          </div>

          <TeachingMoment>
            Both formulas use the same logic: they're proportional to the central angle! 
            If an arc subtends ¼ of the circle (90°), its length is ¼ of the circumference, 
            and the sector area is ¼ of the circle's area.
          </TeachingMoment>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Key Relationships</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Quarter circle (90°):</strong> Arc = πr/2, Sector = πr²/4</li>
              <li><strong>Semicircle (180°):</strong> Arc = πr, Sector = πr²/2</li>
              <li><strong>Three-quarters (270°):</strong> Arc = 3πr/2, Sector = 3πr²/4</li>
              <li><strong>Full circle (360°):</strong> Arc = 2πr, Sector = πr²</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Radian Form</h4>
              <p className="text-xs mb-2">If angle θ is in radians:</p>
              <ul className="text-xs space-y-1 font-mono">
                <li>Arc Length = θr</li>
                <li>Sector Area = ½θr²</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2">Remember</h4>
              <p className="text-xs">
                Arc length is 1-dimensional (units: m, cm)<br/>
                Sector area is 2-dimensional (units: m², cm²)
              </p>
            </div>
          </div>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 10: Arc and Sector Example
  {
    id: 'arc-sector-example',
    type: 'example',
    title: 'Arc Length & Sector Calculations',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Arc and Sector Problem"
        problem="A circular garden path has radius 5m. A path runs from the center to the edge and then a quarter of the way around. What is the total path length?"
        solution={
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Step-by-Step Solution</h4>
              <StepList 
                steps={[
                  "Given: radius r = 5 meters, quarter circle = 90°",
                  "Path has two parts: radius + arc",
                  "Length of radius = r = 5 meters",
                  "Arc length formula: (θ/360°) × 2πr",
                  "Arc length = (90°/360°) × 2π(5) = ¼ × 10π = 2.5π meters",
                  "Total path = radius + arc = 5 + 2.5π meters",
                  "Approximate: 5 + 2.5(3.14159) ≈ 5 + 7.85 ≈ 12.85 meters"
                ]}
                variant="purple"
              />
            </div>
            
            <div className="bg-purple-100 p-3 rounded">
              <p className="text-sm font-semibold text-purple-800">Answer: 5 + 2.5π meters (≈ 12.85 meters)</p>
            </div>

            <TeachingMoment>
              This problem combines straight (radius) and curved (arc) distances. Notice how 
              we keep π in the exact answer for precision, but provide a decimal approximation 
              for practical use!
            </TeachingMoment>
          </div>
        }
        answer="5 + 2.5π meters (approximately 12.85 meters)"
        variant="purple"
      />
    )
  },

  // Screen 11: Circle Measurements Practice
  {
    id: 'measurements-practice',
    type: 'practice',
    title: 'Circle Measurements Practice',
    estimatedTime: 3,
    content: (
      <PracticeScreen
        question={{
          id: 'circumference-calculation',
          question: 'A circle has a diameter of 14 cm. What is its circumference? (Use π ≈ 3.14)',
          correctAnswer: '43.96',
          hints: [
            'Circumference formula: C = πd (when using diameter)',
            'Given: diameter d = 14 cm',
            'Substitute: C = π × 14 = 14π',
            'Approximate: C ≈ 14 × 3.14'
          ],
          explanation: 'Using C = πd with d = 14 cm: C = π × 14 = 14π ≈ 14 × 3.14 = 43.96 cm',
          type: 'number'
        }}
      />
    )
  },

  // Screen 12: Introduction to Circle Theorems
  {
    id: 'circle-theorems-intro',
    type: 'concept',
    title: 'Circle Theorems Introduction',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🧮📐</div>
            <h2 className="text-2xl font-bold mb-4">Circle Theorems</h2>
          </div>

          <ConceptSection title="What are Circle Theorems?" variant="blue">
            <p className="text-lg mb-4">
              Circle theorems are fundamental relationships and properties that help us 
              solve problems involving circles, angles, and chords.
            </p>
          </ConceptSection>

          <div className="grid md:grid-cols-2 gap-4">
            <ConceptSection title="Angle Properties" variant="green">
              <ul className="text-sm space-y-1">
                <li>• Inscribed angle theorem</li>
                <li>• Angles in same segment</li>
                <li>• Angle in semicircle</li>
                <li>• Cyclic quadrilateral</li>
              </ul>
            </ConceptSection>

            <ConceptSection title="Line Properties" variant="red">
              <ul className="text-sm space-y-1">
                <li>• Chord properties</li>
                <li>• Tangent properties</li>
                <li>• Secant relationships</li>
                <li>• Power theorems</li>
              </ul>
            </ConceptSection>
          </div>

          <TeachingMoment>
            Circle theorems reveal the beautiful relationships hidden within circles. 
            These aren't just abstract mathematical rules—they're practical tools used 
            in engineering, architecture, and design. Understanding them unlocks the 
            ability to solve complex geometric problems elegantly!
          </TeachingMoment>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Why Study Circle Theorems?</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Solve complex angle problems quickly</li>
              <li>Understand geometric relationships</li>
              <li>Apply to real-world engineering</li>
              <li>Build logical reasoning skills</li>
              <li>Connect different areas of mathematics</li>
            </ul>
          </div>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 13: Key Circle Theorems
  {
    id: 'key-circle-theorems',
    type: 'concept',
    title: 'Essential Circle Theorems',
    estimatedTime: 5,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">⭕📐🔍</div>
            <h2 className="text-2xl font-bold mb-4">Essential Circle Theorems</h2>
          </div>

          <div className="grid gap-4">
            <ConceptSection title="1. Inscribed Angle Theorem" variant="blue">
              <p className="text-sm mb-2">
                An inscribed angle is half the central angle that subtends the same arc.
              </p>
              <div className="bg-blue-100 p-2 rounded text-xs">
                If central angle = 100°, then inscribed angle = 50°
              </div>
            </ConceptSection>

            <ConceptSection title="2. Angle in Semicircle" variant="purple">
              <p className="text-sm mb-2">
                An angle inscribed in a semicircle is always a right angle (90°).
              </p>
              <div className="bg-purple-100 p-2 rounded text-xs">
                Any triangle with diameter as one side has a right angle opposite the diameter
              </div>
            </ConceptSection>

            <ConceptSection title="3. Perpendicular to Chord" variant="green">
              <p className="text-sm mb-2">
                A perpendicular from the center of a circle to a chord bisects the chord.
              </p>
              <div className="bg-green-100 p-2 rounded text-xs">
                Creates two equal segments and enables Pythagorean theorem applications
              </div>
            </ConceptSection>

            <ConceptSection title="4. Tangent Perpendicular" variant="red">
              <p className="text-sm mb-2">
                A tangent to a circle is perpendicular to the radius at the point of tangency.
              </p>
              <div className="bg-red-100 p-2 rounded text-xs">
                Creates right angles for problem-solving
              </div>
            </ConceptSection>

            <ConceptSection title="5. Equal Tangents" variant="orange">
              <p className="text-sm mb-2">
                Tangents to a circle from an external point are equal in length.
              </p>
              <div className="bg-orange-100 p-2 rounded text-xs">
                Two tangent segments from same point have equal length
              </div>
            </ConceptSection>
          </div>

          <TeachingMoment>
            These theorems work together like tools in a toolkit. Often, solving a circle 
            problem requires combining multiple theorems. The key is recognizing which 
            theorem applies to each part of the problem!
          </TeachingMoment>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 14: Circle Theorem Example
  {
    id: 'circle-theorem-example',
    type: 'example',
    title: 'Applying Circle Theorems',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Chord and Radius Problem"
        problem="In a circle, chord AB has length 8 cm and is 3 cm away from the center. Find the radius of the circle."
        solution={
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Using Circle Theorems</h4>
              <StepList 
                steps={[
                  "Draw circle with center O and chord AB",
                  "Draw perpendicular from O to AB, meeting AB at point M",
                  "Given: AB = 8 cm, distance from center = OM = 3 cm",
                  "Perpendicular from center bisects chord: AM = MB = 4 cm",
                  "Apply Pythagorean theorem in right triangle OAM:",
                  "OA² = OM² + AM² = 3² + 4² = 9 + 16 = 25",
                  "Therefore: OA = √25 = 5 cm = radius"
                ]}
                variant="blue"
              />
            </div>
            
            <div className="bg-blue-100 p-3 rounded">
              <p className="text-sm font-semibold text-blue-800">Answer: The radius is 5 cm</p>
            </div>

            <TeachingMoment>
              This problem combines the perpendicular bisector property with the Pythagorean 
              theorem. The perpendicular from center to chord creates a right triangle, 
              allowing us to find the radius!
            </TeachingMoment>
          </div>
        }
        answer="5 cm using perpendicular bisector theorem and Pythagorean theorem"
        variant="blue"
      />
    )
  },

  // Screen 15: Module Summary
  {
    id: 'module-summary',
    type: 'concept',
    title: 'Circles Module Summary',
    estimatedTime: 3,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉🏆📚</div>
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="text-lg text-muted-foreground">You've mastered the wonderful world of circles!</p>
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              What You've Accomplished
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Circle definitions and components</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Circumference and area calculations</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Arc length and sector area</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Essential circle theorems</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Problem-solving strategies</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Real-world applications</span>
                </div>
              </div>
            </div>
          </div>

          <TeachingMoment>
            Circles aren't just mathematical abstractions—they're fundamental to our 
            understanding of the physical world! From planetary orbits to ripples in water, 
            from wheels to satellite dishes, the properties you've learned provide the 
            mathematical foundation for countless real-world phenomena and technologies.
          </TeachingMoment>

          <div className="bg-red-50 p-4 rounded-lg text-center">
            <h4 className="font-semibold mb-2">Up Next: Transformations!</h4>
            <p className="text-sm text-muted-foreground">
              Ready to explore how shapes move and change? In the next module, we'll discover 
              translations, rotations, reflections, and dilations—the geometric transformations 
              that bring shapes to life!
            </p>
          </div>
        </div>
      </ConceptScreen>
    )
  }
];