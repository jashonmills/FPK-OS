import React from 'react';
import { MicroLessonData } from '../MicroLessonContainer';
import { ConceptScreen, TeachingMoment, ConceptSection } from '../ConceptScreen';
import { ExampleScreen } from '../ExampleScreen';
import { PracticeScreen } from '../PracticeScreen';
import { CheckCircle, MapPin, Calculator, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const coordinateGeometryMicroLessons: MicroLessonData = {
  id: 'coordinate-geometry-micro',
  moduleTitle: 'Coordinate Geometry',
  totalScreens: 8,
  screens: [
    {
      id: '1',
      type: 'concept',
      title: 'Introduction to Coordinate Geometry',
      estimatedTime: 3,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">
                Welcome to coordinate geometry - where algebra meets geometry!
              </p>
            </div>

            <ConceptSection title="What is Coordinate Geometry?" variant="blue">
              <p className="text-lg leading-relaxed mb-4">
                Coordinate geometry, also known as analytic geometry, combines algebra and geometry to solve problems using a coordinate system. We represent geometric shapes algebraically and use algebraic techniques to analyze geometric properties.
              </p>
              
              <TeachingMoment variant="blue">
                Coordinate geometry represents one of the most powerful unions in mathematics—the marriage of algebra and geometry. Before René Descartes and Pierre de Fermat developed coordinate systems in the 17th century, geometry and algebra were largely separate disciplines. This breakthrough transformed mathematics and science, making it possible to analyze curves and shapes with algebraic precision.
              </TeachingMoment>
            </ConceptSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <span>Understand the coordinate system in two dimensions</span>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>Calculate distances between points and find midpoints</span>
              </div>
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                <span>Determine equations of lines in various forms</span>
              </div>
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                <span>Analyze properties of lines and curves</span>
              </div>
            </div>
          </div>
        </ConceptScreen>
      )
    },

    {
      id: '2',
      type: 'concept',
      title: 'The Cartesian Coordinate System',
      estimatedTime: 4,
      content: (
        <ConceptScreen>
          <div className="space-y-6">
            <ConceptSection title="The Cartesian Coordinate System" variant="green">
              <p className="text-lg leading-relaxed mb-4">
                The Cartesian coordinate system consists of two perpendicular number lines (axes) that intersect at the origin. The horizontal axis is the x-axis, and the vertical axis is the y-axis. Any point in the plane can be described by an ordered pair (x, y).
              </p>

              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-3">Plotting Points</h4>
                <ol className="list-decimal list-inside space-y-2">
                  <li><strong>Start at the origin (0, 0)</strong></li>
                  <li><strong>Move x units horizontally</strong> (right if positive, left if negative)</li>
                  <li><strong>Move y units vertically</strong> (up if positive, down if negative)</li>
                </ol>
              </div>

              <TeachingMoment variant="green">
                The beauty of the coordinate system lies in its one-to-one correspondence between geometric points and ordered pairs of numbers. This allows us to translate geometric properties into algebraic relationships and vice versa, opening up new approaches to solving problems in both fields.
              </TeachingMoment>
            </ConceptSection>

            <ConceptSection title="Quadrants" variant="blue">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border-green-200 border">
                  <h5 className="font-semibold text-green-700 mb-2">Quadrant I</h5>
                  <p className="text-sm">Both x and y are positive (upper right)</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-blue-200 border">
                  <h5 className="font-semibold text-blue-700 mb-2">Quadrant II</h5>
                  <p className="text-sm">x is negative, y is positive (upper left)</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border-red-200 border">
                  <h5 className="font-semibold text-red-700 mb-2">Quadrant III</h5>
                  <p className="text-sm">Both x and y are negative (lower left)</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-purple-200 border">
                  <h5 className="font-semibold text-purple-700 mb-2">Quadrant IV</h5>
                  <p className="text-sm">x is positive, y is negative (lower right)</p>
                </div>
              </div>
            </ConceptSection>
          </div>
        </ConceptScreen>
      )
    }
  ]
};