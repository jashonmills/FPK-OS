import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Compass } from 'lucide-react';
import pointsLinesImage from '@/assets/points-lines-planes-lesson.jpg';

export const PointsLinesPlanes: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Points, Lines, and Planes</h1>
        <p className="text-lg text-muted-foreground">The Building Blocks of Geometry</p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={pointsLinesImage} 
          alt="Geometric diagram showing points, lines, rays, and line segments with labels"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Geometry starts with three basic undefined terms: <strong>points</strong>, <strong>lines</strong>, and <strong>planes</strong>. 
              These are the fundamental building blocks from which all other geometric concepts are built. Understanding these 
              basic elements is essential for mastering more complex geometric ideas.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                <Compass className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Geometric Foundations</h3>
                <p className="text-gray-600">Points, Lines, and Planes form the basis of all geometry</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Has no size or dimension</li>
                    <li>• Shows exact location</li>
                    <li>• Named with capital letters</li>
                    <li>• Example: Point A, Point B</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Lines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Extends infinitely in both directions</li>
                    <li>• Has no width or thickness</li>
                    <li>• Contains infinite points</li>
                    <li>• Named by two points on it</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Planes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Flat surface extending infinitely</li>
                    <li>• Has no thickness</li>
                    <li>• Contains infinite lines and points</li>
                    <li>• Named by capital letters or three points</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4">Related Concepts</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-700">Line Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Part of a line with two endpoints</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Has definite length</li>
                    <li>• Named by its endpoints</li>
                    <li>• Written as AB or BA</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">Rays</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Part of a line with one endpoint</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Extends infinitely in one direction</li>
                    <li>• Has a starting point</li>
                    <li>• Named by endpoint first, then another point</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Key Insight:</h4>
          <p>
            Remember: A point has position but no size, a line has length but no width, and a plane has 
            length and width but no thickness. These are the "undefined terms" that form the foundation 
            of all geometric definitions.
          </p>
        </AlertDescription>
      </Alert>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Practice Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Identify the geometric terms:</h4>
              <p className="text-sm">Look around your classroom and identify examples of points, lines, line segments, and rays.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Name the elements:</h4>
              <p className="text-sm">Given points A, B, and C on a line, name all possible line segments and rays.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. True or False:</h4>
              <p className="text-sm">"A line segment is part of a ray" - Explain your answer.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};