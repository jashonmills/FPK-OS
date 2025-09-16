import React from 'react';
import { MicroLessonScreen } from '../MicroLessonContainer';
import { Calculator, Lightbulb, BookOpen } from 'lucide-react';
import { PracticeScreen } from '@/components/micro-lessons/PracticeScreen';

// Import generated images
import curvedSolids from '@/assets/curved-solids.png';

export const threeDShapesMicroLessonsPartTwo: MicroLessonScreen[] = [
  {
    id: 9,
    type: 'example',
    title: 'Prism Volume Calculation',
    content: (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Example: Rectangular Prism Volume</h3>
          <p className="mb-4"><strong>Find the volume of a rectangular prism with length 6 cm, width 4 cm, and height 3 cm.</strong></p>
          
          <div className="bg-white rounded p-4 border">
            <p className="font-semibold mb-2">Solution:</p>
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Step 1:</strong> Identify the base area.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Base area = length × width = 6 × 4 = 24 cm²</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 2:</strong> Apply the volume formula.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Volume = Base area × Height</li>
                  <li>Volume = 24 × 3 = 72 cm³</li>
                </ul>
              </div>
              
              <p className="font-semibold">Answer: The volume is 72 cubic centimeters.</p>
            </div>
          </div>
        </div>
      </div>
    ),
    estimatedTime: 3
  },
  {
    id: 10,
    type: 'teaching',
    title: 'Introduction to Pyramids',
    content: (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-700 mb-4">Pyramids</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-gray-600" />
              <span className="font-semibold">Definition:</span>
            </div>
            <p>A pyramid is a polyhedron formed by connecting a polygonal base to a point (the apex) with triangular faces.</p>
          </div>
          
          <div className="bg-green-100 border border-green-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-green-600" />
              <h4 className="text-lg font-semibold text-green-800">Teaching Moment</h4>
            </div>
            <p className="text-green-700">
              Pyramids are named after the shape of their bases: triangular pyramid, square pyramid, pentagonal pyramid, etc. A triangular pyramid is also called a tetrahedron and is one of the Platonic solids. Pyramids have been significant in various cultures, most notably in ancient Egypt.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Properties of Pyramids</h3>
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="font-semibold">1. Volume:</p>
              <p>V = (1/3) × Area of base × Height</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="font-semibold">2. Surface Area:</p>
              <p>SA = Area of base + Sum of areas of triangular faces</p>
            </div>
          </div>
        </div>
      </div>
    ),
    estimatedTime: 4
  },
  {
    id: 11,
    type: 'example',
    title: 'Pyramid Volume and Surface Area',
    content: (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Example Problem</h3>
          <p className="mb-4"><strong>A square pyramid has a base with side length 6 cm and a height of 8 cm. Calculate its volume and surface area.</strong></p>
          
          <div className="bg-white rounded p-4 border">
            <p className="font-semibold mb-2">Solution:</p>
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Step 1:</strong> Calculate the volume.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Base Area = 6² = 36 cm²</li>
                  <li>Volume = (1/3) × 36 × 8 = 96 cm³</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 2:</strong> Find the slant height for surface area.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Slant height² = Height² + (side/2)²</li>
                  <li>Slant height² = 8² + 3² = 64 + 9 = 73</li>
                  <li>Slant height = √73 ≈ 8.54 cm</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 3:</strong> Calculate surface area.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>SA = Base Area + (1/2) × Perimeter × Slant Height</li>
                  <li>SA = 36 + (1/2) × 24 × √73</li>
                  <li>SA = 36 + 12√73 ≈ 138.5 cm²</li>
                </ul>
              </div>
              
              <p className="font-semibold">Answer: Volume = 96 cm³, Surface Area ≈ 138.5 cm²</p>
            </div>
          </div>
        </div>
      </div>
    ),
    estimatedTime: 5
  },
  {
    id: 12,
    type: 'teaching',
    title: 'Curved Solids: Cylinders, Cones, and Spheres',
    content: (
      <div className="space-y-6">
        <div className="mb-6">
          <img 
            src={curvedSolids}
            alt="Cylinders, cones, and spheres with their volume and surface area formulas"
            className="w-full max-w-3xl mx-auto object-contain rounded-lg shadow-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Cylinders</h3>
            <p className="text-sm mb-4">A cylinder has two parallel circular bases connected by a curved lateral surface.</p>
            
            <div className="space-y-2">
              <div className="bg-white p-2 rounded border">
                <p className="font-semibold text-xs">Volume:</p>
                <p className="text-xs font-mono">V = πr²h</p>
              </div>
              <div className="bg-white p-2 rounded border">
                <p className="font-semibold text-xs">Surface Area:</p>
                <p className="text-xs font-mono">SA = 2πr² + 2πrh</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-700 mb-3">Cones</h3>
            <p className="text-sm mb-4">A cone has a circular base and a curved surface that meets at a single point (apex).</p>
            
            <div className="space-y-2">
              <div className="bg-white p-2 rounded border">
                <p className="font-semibold text-xs">Volume:</p>
                <p className="text-xs font-mono">V = (1/3)πr²h</p>
              </div>
              <div className="bg-white p-2 rounded border">
                <p className="font-semibold text-xs">Surface Area:</p>
                <p className="text-xs font-mono">SA = πr² + πrl</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-700 mb-3">Spheres</h3>
            <p className="text-sm mb-4">A sphere is perfectly round with all points equidistant from the center.</p>
            
            <div className="space-y-2">
              <div className="bg-white p-2 rounded border">
                <p className="font-semibold text-xs">Volume:</p>
                <p className="text-xs font-mono">V = (4/3)πr³</p>
              </div>
              <div className="bg-white p-2 rounded border">
                <p className="font-semibold text-xs">Surface Area:</p>
                <p className="text-xs font-mono">SA = 4πr²</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    estimatedTime: 5
  },
  {
    id: 13,
    type: 'example',
    title: 'Cylinder Volume Example',
    content: (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Example: Cylinder Volume</h3>
          <p className="mb-4"><strong>Find the volume of a cylinder with radius 3 cm and height 10 cm.</strong></p>
          
          <div className="bg-white rounded p-4 border">
            <p className="font-semibold mb-2">Solution:</p>
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Step 1:</strong> Identify the given values.</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Radius (r) = 3 cm</li>
                  <li>Height (h) = 10 cm</li>
                </ul>
              </div>
              
              <div>
                <p><strong>Step 2:</strong> Apply the volume formula.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Volume = πr²h</li>
                  <li>Volume = π × 3² × 10</li>
                  <li>Volume = π × 9 × 10</li>
                  <li>Volume = 90π ≈ 282.7 cm³</li>
                </ul>
              </div>
              
              <p className="font-semibold">Answer: The volume is 90π cm³ or approximately 282.7 cm³.</p>
            </div>
          </div>
        </div>
      </div>
    ),
    estimatedTime: 3
  },
  {
    id: 14,
    type: 'practice',
    title: 'Practice: Cube Volume',
    content: (
      <PracticeScreen
        question={{
          id: '3d-1',
          type: 'text',
          question: 'What is the volume of a cube with side length 5 cm?',
          correctAnswer: '125',
          hints: [
            'The volume of a cube is side³',
            'All sides of a cube are equal',
            'Calculate 5³ = 5 × 5 × 5'
          ],
          explanation: 'For a cube with side length 5 cm: Volume = side³ = 5³ = 5 × 5 × 5 = 125 cm³'
        }}
      />
    ),
    estimatedTime: 3
  },
  {
    id: 15,
    type: 'practice',
    title: 'Practice: Pyramid Volume',
    content: (
      <PracticeScreen
        question={{
          id: '3d-2',
          type: 'text',
          question: 'A square pyramid has a base area of 36 cm² and a height of 9 cm. What is its volume in cm³?',
          correctAnswer: '108',
          hints: [
            'The volume of a pyramid is (1/3) × base area × height',
            'Base area = 36 cm², height = 9 cm',
            'Volume = (1/3) × 36 × 9'
          ],
          explanation: 'Volume of pyramid = (1/3) × base area × height = (1/3) × 36 × 9 = (1/3) × 324 = 108 cm³'
        }}
      />
    ),
    estimatedTime: 3
  },
  {
    id: 16,
    type: 'practice',
    title: 'Practice: Euler\'s Formula',
    content: (
      <PracticeScreen
        question={{
          id: '3d-3',
          type: 'text',
          question: 'A polyhedron has 8 faces and 6 vertices. Using Euler\'s formula (F + V - E = 2), how many edges does it have?',
          correctAnswer: '12',
          hints: [
            'Use Euler\'s formula: F + V - E = 2',
            'Substitute F = 8 and V = 6',
            'Solve for E: 8 + 6 - E = 2'
          ],
          explanation: 'Using Euler\'s formula F + V - E = 2: 8 + 6 - E = 2, so 14 - E = 2, therefore E = 12 edges.'
        }}
      />
    ),
    estimatedTime: 3
  }
];