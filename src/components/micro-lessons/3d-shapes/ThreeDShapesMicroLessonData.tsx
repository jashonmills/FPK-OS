import React from 'react';
import { MicroLessonData } from '../MicroLessonContainer';
import { Box, Calculator, Lightbulb, BookOpen, CheckCircle } from 'lucide-react';

export const threeDShapesMicroLessons: MicroLessonData = {
  id: '3d-shapes-micro',
  moduleTitle: 'Three-Dimensional Geometry',
  totalScreens: 8,
  screens: [
    {
      id: '1',
      type: 'concept',
      title: 'Introduction to 3D Geometry',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">Teaching Moment</h3>
            </div>
            <p className="text-blue-700">
              Three-dimensional geometry connects mathematics with our physical world. We now work with objects that have length, width, and height—just like the objects we interact with daily.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">From 2D to 3D</h3>
            <p>In 3D geometry, we work with solid shapes that have three dimensions.</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: '2',
      type: 'concept',
      title: 'Polyhedra and Euler\'s Formula',
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p>A polyhedron is a 3D solid bounded by flat polygonal faces.</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Euler's Formula</h3>
            <div className="text-center text-3xl font-bold text-purple-700 mb-3 bg-white p-4 rounded border">
              F + V - E = 2
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    }
  ]
};