import React from 'react';
import { MicroLessonScreen } from '../MicroLessonContainer';
import { FlipHorizontal, ZoomIn, Lightbulb, BookOpen, Calculator } from 'lucide-react';
import { PracticeScreen } from '@/components/micro-lessons/PracticeScreen';

export const transformationsMicroLessonsPartTwo: MicroLessonScreen[] = [
    {
      id: '10',
      type: 'concept',
      title: 'Reflections - The Flip',
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FlipHorizontal className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-semibold">Reflections</h2>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FlipHorizontal className="h-4 w-4 text-gray-600" />
            <span className="font-semibold">Definition:</span>
          </div>
          <p>A reflection is a transformation that flips a figure over a line, called the line of reflection.</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Teaching Moment</h3>
          </div>
          <p className="text-red-700">
            Reflections are like mirror images. When you look in a mirror, what you see is a reflection of yourself across the plane of the mirror. In two-dimensional geometry, reflections occur across lines rather than planes. Reflections are fundamental to understanding symmetry in nature, art, and architecture.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Properties of Reflections</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-sm">1. Reflections preserve the size and shape of the figure.</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-sm">2. Reflections reverse the orientation of the figure.</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-sm">3. The line of reflection is the perpendicular bisector of the segment connecting any point to its reflection.</p>
            </div>
          </div>
        </div>
      </div>
    ),
    estimatedTime: 3
  },
  {
    id: 11,
    type: 'formula',
    title: 'Reflection Formulas',
    content: (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Common Reflection Formulas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <h3 className="font-semibold mb-2">Reflection over x-axis</h3>
            <p className="font-mono">(x, y) → (x, -y)</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <h3 className="font-semibold mb-2">Reflection over y-axis</h3>
            <p className="font-mono">(x, y) → (-x, y)</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <h3 className="font-semibold mb-2">Reflection over y = x</h3>
            <p className="font-mono">(x, y) → (y, x)</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <h3 className="font-semibold mb-2">Reflection over y = -x</h3>
            <p className="font-mono">(x, y) → (-y, -x)</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <h3 className="font-semibold mb-2">Reflection over y = k</h3>
            <p className="font-mono">(x, y) → (x, 2k - y)</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <h3 className="font-semibold mb-2">Reflection over x = h</h3>
            <p className="font-mono">(x, y) → (2h - x, y)</p>
          </div>
        </div>
      </div>
    ),
    estimatedTime: 4
  },
  {
    id: 12,
    type: 'teaching',
    title: 'Dilations - The Scale',
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <ZoomIn className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-semibold">Dilations</h2>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ZoomIn className="h-4 w-4 text-gray-600" />
            <span className="font-semibold">Definition:</span>
          </div>
          <p>A dilation is a transformation that changes the size of a figure without changing its shape. It is also known as a scaling.</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-800">Teaching Moment</h3>
          </div>
          <p className="text-orange-700">
            Dilations are like zooming in or out on a figure. When you zoom in on a map or photo, you're performing a dilation with a scale factor greater than 1. When you zoom out, the scale factor is between 0 and 1. Dilations are crucial in fields like cartography (map-making) and computer graphics.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Scale Factor Effects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded p-4">
              <h4 className="font-semibold">Scale factor &gt; 1</h4>
              <p className="text-sm">Figure becomes larger (enlargement)</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded p-4">
              <h4 className="font-semibold">Scale factor = 1</h4>
              <p className="text-sm">Figure stays the same size</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded p-4">
              <h4 className="font-semibold">0 &lt; Scale factor &lt; 1</h4>
              <p className="text-sm">Figure becomes smaller (reduction)</p>
            </div>
          </div>
        </div>
      </div>
    ),
    estimatedTime: 3
  },
  {
    id: 13,
    type: 'formula',
    title: 'Dilation Formulas',
    content: (
      <div className="space-y-6">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Dilation from the Origin</h3>
          <div className="bg-white p-4 rounded border text-center">
            <p className="mb-2">To dilate a point (x, y) from the origin with scale factor k:</p>
            <p className="text-lg font-mono">(x, y) → (kx, ky)</p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Dilation from Any Center (h, k)</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Translate the center of dilation to the origin: (x - h, y - k)</li>
            <li>Dilate from the origin: (s(x - h), s(y - k))</li>
            <li>Translate back: (s(x - h) + h, s(y - k) + k)</li>
          </ol>
          <div className="bg-white p-3 rounded border mt-4">
            <p className="font-mono text-center">Final formula: (s(x - h) + h, s(y - k) + k)</p>
          </div>
        </div>
      </div>
    ),
    estimatedTime: 4
  },
  {
    id: 14,
    type: 'practice',
    title: 'Practice: Translation Problem',
    content: (
      <PracticeScreen
        question={{
          id: 'trans-1',
          type: 'text',
          question: 'Translate the point (2, 5) by the vector (-3, 4). What are the coordinates of the translated point?',
          correctAnswer: '(-1, 9)',
          hints: [
            'Use the translation formula: (x + h, y + k)',
            'The vector (-3, 4) means h = -3 and k = 4',
            'Add the vector components to the original coordinates: (2 + (-3), 5 + 4)'
          ],
          explanation: 'Using the translation formula (x + h, y + k) with vector (-3, 4): (2 + (-3), 5 + 4) = (-1, 9)'
        }}
      />
    ),
    estimatedTime: 3
  },
  {
    id: 15,
    type: 'practice',
    title: 'Practice: Rotation Problem',
    content: (
      <PracticeScreen
        question={{
          id: 'rot-1',
          type: 'text',
          question: 'Rotate the point (4, 2) around the origin by 90° counterclockwise. What are the coordinates of the rotated point?',
          correctAnswer: '(-2, 4)',
          hints: [
            'For a 90° counterclockwise rotation around the origin: (x, y) → (-y, x)',
            'Switch the coordinates and negate the new x-coordinate',
            'Apply the rule: (4, 2) → (-2, 4)'
          ],
          explanation: 'For a 90° counterclockwise rotation around the origin, the rule is (x, y) → (-y, x). So (4, 2) becomes (-2, 4).'
        }}
      />
    ),
    estimatedTime: 3
  },
  {
    id: 16,
    type: 'practice',
    title: 'Practice: Reflection and Dilation',
    content: (
      <PracticeScreen
        question={{
          id: 'ref-dil-1',
          type: 'text',
          question: 'A triangle has vertices at (2, 3), (4, 1), and (6, 5). If reflected over the x-axis and then dilated by a factor of 2 from the origin, what are the new coordinates of the vertex originally at (2, 3)?',
          correctAnswer: '(4, -6)',
          hints: [
            'First, reflect over the x-axis: (x, y) → (x, -y)',
            'Then dilate by factor 2: (x, y) → (2x, 2y)',
            'Start with (2, 3), reflect to get (2, -3), then dilate to get (4, -6)'
          ],
          explanation: 'Step 1: Reflect (2, 3) over x-axis → (2, -3). Step 2: Dilate by factor 2 → (2×2, -3×2) = (4, -6).'
        }}
      />
    ),
    estimatedTime: 4
  }
];