import React from 'react';
import { MicroLessonData } from '../MicroLessonContainer';
import { RotateCw, Move, FlipHorizontal, ZoomIn, Lightbulb, BookOpen } from 'lucide-react';

export const transformationsMicroLessons: MicroLessonData = {
  id: 'transformations-micro',
  moduleTitle: 'Transformations in Geometry',
  totalScreens: 9,
  screens: [
    {
      id: '1',
      type: 'concept',
      title: 'Introduction to Transformations',
      content: (
        <div className="space-y-6">
          <div className="mb-6">
            <img 
              src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/transformations_types.png" 
              alt="Various geometric transformations showing translation, rotation, reflection, and dilation on a coordinate plane"
              className="w-full max-w-4xl mx-auto object-contain rounded-lg shadow-lg"
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">Teaching Moment</h3>
            </div>
            <p className="text-blue-700">
              Transformations are the "verbs" of geometry—they describe how shapes move, stretch, flip, and turn. 
              They help us understand symmetry, congruence, and similarity in a deeper way.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">What are Transformations?</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p>A transformation is a function that takes a geometric figure and changes its position, size, or shape to create a new figure.</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: '2',
      type: 'concept',
      title: 'Types of Transformations',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-700 mb-4">Rigid Transformations</h3>
              <p className="text-sm mb-3">Preserve size and shape</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Translation (Slide)</li>
                <li>Rotation (Turn)</li>
                <li>Reflection (Flip)</li>
              </ul>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-700 mb-4">Non-Rigid Transformations</h3>
              <p className="text-sm mb-3">Change size or shape</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Dilation (Scaling)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    }
  ]
};