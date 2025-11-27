import React from 'react';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../ConceptScreen';
import { ExampleScreen, StepList } from '../ExampleScreen';
import { PracticeScreen } from '../PracticeScreen';
import { MicroLessonScreen } from '../MicroLessonContainer';
import { CheckCircle, Calculator } from 'lucide-react';

export const quadrilateralsMicroLessonsPartTwo: MicroLessonScreen[] = [
  // Screen 6: Trapezoid
  {
    id: 'trapezoid',
    type: 'concept',
    title: 'Trapezoids',
    estimatedTime: 3,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">⏢</div>
            <h2 className="text-2xl font-bold mb-4">Trapezoids</h2>
          </div>

          <ConceptSection title="Definition" variant="orange">
            <p className="text-lg mb-4">
              A trapezoid (or trapezium) is a quadrilateral with exactly one pair of parallel sides.
            </p>
          </ConceptSection>

          <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
            <h4 className="font-semibold text-orange-800 mb-3">Properties of Trapezoids</h4>
            <ul className="space-y-2 text-sm text-orange-700 list-disc list-inside ml-4">
              <li>The parallel sides are called the <strong>bases</strong></li>
              <li>The non-parallel sides are called the <strong>legs</strong></li>
              <li>Can be isosceles (equal legs) or scalene (unequal legs)</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Isosceles Trapezoid</h4>
              <ul className="text-sm space-y-1">
                <li>• Equal legs (non-parallel sides)</li>
                <li>• Equal base angles</li>
                <li>• Diagonals are equal</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Real-World Examples</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Bucket shape</li>
                <li>Airplane wings</li>
                <li>Some rooftops</li>
                <li>Certain table designs</li>
              </ul>
            </div>
          </div>

          <TeachingMoment>
            Trapezoids are unique among quadrilaterals because they break the "opposite sides" 
            pattern. They have exactly one pair of parallel sides, making them useful in 
            engineering applications where you need a tapered shape.
          </TeachingMoment>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 7: Quadrilateral Classification Example
  {
    id: 'classification-example',
    type: 'example',
    title: 'Classifying Quadrilaterals',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Quadrilateral Classification Strategy"
        problem="Identify the type of quadrilateral with vertices at (0,0), (3,0), (4,3), and (1,3)."
        solution={
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Step-by-Step Analysis</h4>
              <StepList 
                steps={[
                  "Calculate side lengths: (0,0)→(3,0)=3, (3,0)→(4,3)=√10, (4,3)→(1,3)=3, (1,3)→(0,0)=√10",
                  "Check parallel sides: Top and bottom both horizontal (slope=0), left and right both have slope=3",
                  "Check equal sides: Two opposite sides = 3, two opposite sides = √10",
                  "Check angles: Not all perpendicular (not 90° angles)",
                  "Apply hierarchy: Two pairs parallel sides → parallelogram, but not rectangle or rhombus"
                ]}
                variant="blue"
              />
            </div>
            
            <div className="bg-blue-100 p-3 rounded">
              <p className="text-sm font-semibold text-blue-800">Conclusion: This is a parallelogram (but not a rectangle, rhombus, or square).</p>
            </div>
          </div>
        }
        answer="Parallelogram - has two pairs of parallel sides with opposite sides equal, but no right angles"
        variant="blue"
      />
    )
  },

  // Screen 8: Area Formulas Introduction  
  {
    id: 'area-formulas-intro',
    type: 'concept',
    title: 'Area Formulas Overview',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📐📏</div>
            <h2 className="text-2xl font-bold mb-4">Quadrilateral Area Formulas</h2>
          </div>

          <div className="grid gap-4">
            <ConceptSection title="Rectangle" variant="green">
              <p className="text-lg font-mono">Area = length × width</p>
            </ConceptSection>

            <ConceptSection title="Square" variant="purple">
              <p className="text-lg font-mono">Area = side²</p>
            </ConceptSection>

            <ConceptSection title="Parallelogram" variant="blue">
              <p className="text-lg font-mono">Area = base × height</p>
            </ConceptSection>

            <ConceptSection title="Rhombus" variant="red">
              <div className="space-y-2">
                <p className="text-lg font-mono">Area = base × height</p>
                <p className="text-lg font-mono">Area = ½ × d₁ × d₂</p>
                <p className="text-xs text-muted-foreground">(d₁, d₂ are diagonal lengths)</p>
              </div>
            </ConceptSection>

            <ConceptSection title="Trapezoid" variant="orange">
              <p className="text-lg font-mono">Area = ½ × (b₁ + b₂) × h</p>
              <p className="text-xs text-muted-foreground">(b₁, b₂ are parallel sides, h is height)</p>
            </ConceptSection>

            <ConceptSection title="Kite" variant="teal">
              <p className="text-lg font-mono">Area = ½ × d₁ × d₂</p>
              <p className="text-xs text-muted-foreground">(d₁, d₂ are diagonal lengths)</p>
            </ConceptSection>
          </div>

          <TeachingMoment>
            Notice how some formulas use base × height (like parallelograms) while others use 
            diagonal products (like rhombus and kite). The key is choosing the right measurements 
            based on what information you have!
          </TeachingMoment>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 9: Area Calculation Example
  {
    id: 'area-example',
    type: 'example',
    title: 'Calculating Trapezoid Area',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Trapezoid Area Calculation"
        problem="Find the area of a trapezoid with parallel sides of lengths 8 cm and 12 cm, and a height of 5 cm."
        solution={
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Solution Steps</h4>
              <StepList 
                steps={[
                  "Identify: Trapezoid with parallel sides a=8cm, b=12cm, height h=5cm",
                  "Formula: Area = ½ × (sum of parallel sides) × height",
                  "Substitute: Area = ½ × (8 + 12) × 5",
                  "Calculate: Area = ½ × 20 × 5 = 10 × 5 = 50 cm²",
                  "Verify: Positive result with square units ✓"
                ]}
                variant="orange"
              />
            </div>
            
            <div className="bg-orange-100 p-3 rounded">
              <p className="text-sm font-semibold text-orange-800">Answer: The area is 50 square centimeters.</p>
            </div>
          </div>
        }
        answer="50 cm² using the trapezoid area formula"
        variant="orange"
      />
    )
  },

  // Screen 10: Perimeter and Practice
  {
    id: 'perimeter-practice',
    type: 'practice',
    title: 'Perimeter Practice',
    estimatedTime: 3,
    content: (
      <PracticeScreen
        question={{
          id: 'perimeter-calculation',
          question: 'A rectangular garden has length 12 meters and width 8 meters. What is its perimeter?',
          correctAnswer: '40',
          hints: [
            'Perimeter = sum of all four sides',
            'For rectangles: P = 2(length + width)',
            'Substitute the given values and calculate'
          ],
          explanation: 'Perimeter = 2(12 + 8) = 2(20) = 40 meters. The perimeter is the total distance around the garden.',
          type: 'number'
        }}
      />
    )
  },

  // Screen 11: Regular Polygons Introduction
  {
    id: 'regular-polygons-intro',
    type: 'concept',
    title: 'Regular Polygons',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">⬢⬟🛑</div>
            <h2 className="text-2xl font-bold mb-4">Regular Polygons</h2>
          </div>

          <ConceptSection title="Definition" variant="green">
            <p className="text-lg mb-4">
              A regular polygon is a polygon with all sides equal and all angles equal.
            </p>
          </ConceptSection>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Basic Properties:</h4>
              <ul className="space-y-1 text-sm text-blue-700 list-disc list-inside ml-4">
                <li>All sides have the same length</li>
                <li>All interior angles equal</li>
                <li>All exterior angles equal</li>
                <li>Perfect rotational symmetry</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Angle Formulas:</h4>
              <ul className="space-y-1 text-sm text-green-700 list-disc list-inside">
                <li><strong>Sum of interior angles:</strong> (n-2) × 180°</li>
                <li><strong>Each interior angle:</strong> (n-2) × 180° / n</li>
                <li><strong>Each exterior angle:</strong> 360° / n</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Common Regular Polygons</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>Triangle (3 sides)</div>
              <div>Square (4 sides)</div>
              <div>Pentagon (5 sides)</div>
              <div>Hexagon (6 sides)</div>
              <div>Heptagon (7 sides)</div>
              <div>Octagon (8 sides)</div>
              <div>Nonagon (9 sides)</div>
              <div>Decagon (10 sides)</div>
            </div>
          </div>

          <TeachingMoment>
            Regular polygons have perfect symmetry and appear throughout nature and human design. 
            Hexagonal honeycomb cells, octagonal stop signs, and pentagonal patterns in flowers 
            all showcase the beauty and efficiency of regular polygons!
          </TeachingMoment>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 12: Regular Polygon Calculations
  {
    id: 'regular-polygon-example',
    type: 'example',
    title: 'Regular Hexagon Calculation',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Regular Hexagon Area"
        problem="Find the area of a regular hexagon with side length 6 cm."
        solution={
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Step-by-Step Solution</h4>
              <StepList 
                steps={[
                  "Given: Regular hexagon (n=6), side length s=6cm",
                  "Formula: Area = ¼ × n × s² × cot(π/n)",
                  "Substitute: Area = ¼ × 6 × 6² × cot(π/6)",
                  "Simplify: Area = ¼ × 6 × 36 × cot(30°) = ¼ × 6 × 36 × √3",
                  "Calculate: Area = 54√3 ≈ 93.53 cm²"
                ]}
                variant="purple"
              />
            </div>
            
            <div className="bg-purple-100 p-3 rounded">
              <p className="text-sm font-semibold text-purple-800">Answer: 54√3 square centimeters (approximately 93.53 cm²)</p>
            </div>
          </div>
        }
        answer="54√3 cm² or approximately 93.53 cm²"
        variant="purple"
      />
    )
  },

  // Screen 13: Polygon Diagonals
  {
    id: 'polygon-diagonals',
    type: 'concept',
    title: 'Polygon Diagonals',
    estimatedTime: 3,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">⬢↗️</div>
            <h2 className="text-2xl font-bold mb-4">Polygon Diagonals</h2>
          </div>

          <ConceptSection title="Definition" variant="teal">
            <p className="text-lg mb-4">
              A diagonal of a polygon is a line segment that connects two non-adjacent vertices.
            </p>
          </ConceptSection>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Formula for Number of Diagonals:</h4>
            <p className="text-lg font-mono text-blue-700">Number of diagonals = n(n - 3) / 2</p>
            <p className="text-sm text-blue-600 mt-2">where n = number of sides</p>
          </div>

          <TeachingMoment>
            This formula works because from each vertex, you can draw diagonals to all other 
            vertices except the adjacent ones and itself. That's (n-3) diagonals per vertex. 
            Multiplying by n gives n(n-3), but this counts each diagonal twice, so we divide by 2!
          </TeachingMoment>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Examples</h4>
              <ul className="text-sm space-y-1">
                <li><strong>Triangle:</strong> 3(3-3)/2 = 0 diagonals</li>
                <li><strong>Square:</strong> 4(4-3)/2 = 2 diagonals</li>
                <li><strong>Pentagon:</strong> 5(5-3)/2 = 5 diagonals</li>
                <li><strong>Hexagon:</strong> 6(6-3)/2 = 9 diagonals</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Applications</h4>
              <ul className="text-sm space-y-1">
                <li>Triangulation algorithms</li>
                <li>Computer graphics</li>
                <li>Structural engineering</li>
                <li>Network topology</li>
              </ul>
            </div>
          </div>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 14: Diagonals Practice
  {
    id: 'diagonals-example',
    type: 'example',
    title: 'Counting Diagonals',
    estimatedTime: 3,
    content: (
      <ExampleScreen
        title="Diagonal Calculation"
        problem="Find the number of diagonals in a decagon (10-sided polygon)."
        solution={
          <div className="space-y-4">
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Solution</h4>
              <StepList 
                steps={[
                  "Identify: Decagon has n = 10 sides",
                  "Formula: Number of diagonals = n(n-3)/2",
                  "Substitute: Number of diagonals = 10(10-3)/2",
                  "Calculate: = 10 × 7 / 2 = 70 / 2 = 35"
                ]}
                variant="teal"
              />
            </div>
            
            <div className="bg-teal-100 p-3 rounded">
              <p className="text-sm font-semibold text-teal-800">Answer: A decagon has 35 diagonals.</p>
            </div>
          </div>
        }
        answer="35 diagonals using the formula n(n-3)/2"
        variant="teal"
      />
    )
  },

  // Screen 15: Coordinate Geometry Introduction
  {
    id: 'coordinate-geometry-intro',
    type: 'concept',
    title: 'Coordinate Geometry of Polygons',
    estimatedTime: 4,
    content: (
      <ConceptScreen>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📊🔢</div>
            <h2 className="text-2xl font-bold mb-4">Coordinate Geometry</h2>
          </div>

          <ConceptSection title="Using Coordinates" variant="green">
            <p className="text-lg mb-4">
              The coordinates of polygon vertices can be used to calculate various properties 
              using algebraic methods.
            </p>
          </ConceptSection>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Shoelace Formula for Area:</h4>
            <p className="text-sm text-blue-700 mb-2">For vertices (x₁,y₁), (x₂,y₂), ..., (xₙ,yₙ):</p>
            <p className="font-mono text-sm text-blue-700">
              Area = ½|[(x₁y₂ - x₂y₁) + (x₂y₃ - x₃y₂) + ... + (xₙy₁ - x₁yₙ)]|
            </p>
          </div>

          <TeachingMoment>
            Coordinate geometry bridges abstract geometry with algebra! By assigning coordinates 
            to vertices, we can use formulas to calculate distances, slopes, areas, and other 
            properties. This approach is essential in computer graphics and GPS systems.
          </TeachingMoment>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">What You Can Calculate</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Side lengths (distance formula)</li>
                <li>Slopes of sides</li>
                <li>Area (Shoelace formula)</li>
                <li>Perimeter</li>
                <li>Whether sides are parallel</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Applications</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Computer graphics</li>
                <li>GPS navigation</li>
                <li>Engineering design</li>
                <li>Architecture</li>
                <li>Game development</li>
              </ul>
            </div>
          </div>
        </div>
      </ConceptScreen>
    )
  },

  // Screen 16: Shoelace Formula Example
  {
    id: 'shoelace-example',
    type: 'example',
    title: 'Shoelace Formula Application',
    estimatedTime: 4,
    content: (
      <ExampleScreen
        title="Area Using Coordinates"
        problem="Find the area of the quadrilateral with vertices at (0,0), (4,0), (4,3), and (0,3)."
        solution={
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Using Shoelace Formula</h4>
              <StepList 
                steps={[
                  "Vertices: (0,0), (4,0), (4,3), (0,3) - forms a rectangle",
                  "Apply Shoelace: Area = ½|[(x₁y₂-x₂y₁) + (x₂y₃-x₃y₂) + (x₃y₄-x₄y₃) + (x₄y₁-x₁y₄)]|",
                  "Substitute: Area = ½|[(0×0-4×0) + (4×3-4×0) + (4×3-0×3) + (0×0-0×3)]|",
                  "Calculate: Area = ½|[0 + 12 + 12 + 0]| = ½ × 24 = 12",
                  "Verify: 4×3 rectangle should have area 12 ✓"
                ]}
                variant="green"
              />
            </div>
            
            <div className="bg-green-100 p-3 rounded">
              <p className="text-sm font-semibold text-green-800">Answer: The area is 12 square units.</p>
            </div>

            <TeachingMoment>
              We could solve this more simply as a 4×3 rectangle (Area = 12), but the Shoelace 
              formula works for ANY simple polygon, making it incredibly powerful!
            </TeachingMoment>
          </div>
        }
        answer="12 square units using the Shoelace formula"
        variant="green"
      />
    )
  },

  // Screen 17: Practice Problems
  {
    id: 'practice-problems',
    type: 'practice',
    title: 'Mixed Practice',
    estimatedTime: 4,
    content: (
      <PracticeScreen
        question={{
          id: 'rhombus-area',
          question: 'Calculate the area of a rhombus with diagonals of lengths 6 cm and 8 cm.',
          correctAnswer: '24',
          hints: [
            'For a rhombus: Area = ½ × d₁ × d₂',
            'The diagonals are d₁ = 6 cm and d₂ = 8 cm',
            'Substitute and calculate: Area = ½ × 6 × 8'
          ],
          explanation: 'Area = ½ × diagonal₁ × diagonal₂ = ½ × 6 × 8 = ½ × 48 = 24 cm². This formula works because a rhombus can be divided into 4 right triangles by its perpendicular diagonals.',
          type: 'number'
        }}
      />
    )
  },

  // Screen 18: Module Summary
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
            <p className="text-lg text-muted-foreground">You've mastered quadrilaterals and polygons!</p>
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
                  <span className="text-sm">Quadrilateral types and properties</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Area and perimeter calculations</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Regular polygon formulas</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Diagonal counting formulas</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Coordinate geometry applications</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Shoelace formula mastery</span>
                </div>
              </div>
            </div>
          </div>

          <TeachingMoment>
            Quadrilaterals and polygons aren't just abstract concepts—they're fundamental shapes 
            that appear throughout our world. From rectangular screens to hexagonal tiles, these 
            shapes serve specific purposes based on their unique properties. Understanding these 
            properties helps us design better structures and solve real-world problems!
          </TeachingMoment>

          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <h4 className="font-semibold mb-2">Up Next: Circles!</h4>
            <p className="text-sm text-muted-foreground">
              Ready to explore the perfect curve? In the next module, we'll dive into circles—
              their properties, formulas, and the fascinating relationships they create!
            </p>
          </div>
        </div>
      </ConceptScreen>
    )
  }
];