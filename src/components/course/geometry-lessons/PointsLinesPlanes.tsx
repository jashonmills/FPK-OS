import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Compass, TrendingUp, Ruler, Grid3X3, Lightbulb } from 'lucide-react';
import pointsLinesImage from '@/assets/points-lines-planes-lesson.jpg';

export const PointsLinesPlanes: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Compass className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Module 1: Lines, Angles & Polygons</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore the fundamental concepts of geometry, focusing on lines, angles, and polygons. These concepts form the foundation of geometric understanding and are essential for all subsequent modules.
        </p>
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src={pointsLinesImage} 
          alt="Geometric diagram showing points, lines, rays, and line segments with labels"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Teaching Moment */}
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          <strong>Teaching Moment:</strong> Geometry is all around us! From the design of buildings to the patterns in nature, geometric principles govern the physical world. As you learn these concepts, try to identify them in your everyday surroundings. This connection between abstract mathematical ideas and real-world applications will deepen your understanding and appreciation of geometry.
        </AlertDescription>
      </Alert>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">By the end of this module, you will be able to:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Identify and classify different types of lines and angles</li>
            <li>Understand the properties of various polygons</li>
            <li>Apply basic geometric principles to solve problems</li>
            <li>Recognize geometric shapes in real-world contexts</li>
            <li>Develop logical reasoning through geometric proofs</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 1: Lines and Line Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ruler className="h-5 w-5 mr-2" />
            Section 1: Lines and Line Segments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">What is a Line?</h3>
            <p className="mb-4">
              A line is a straight path that extends infinitely in both directions. It has no thickness and is one-dimensional. In geometry, we often represent lines using arrows on both ends to indicate that they extend infinitely.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Key properties of lines:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>A line has no endpoints</li>
                <li>A line is straight (no curves)</li>
                <li>A line has infinite length</li>
                <li>A line has no thickness</li>
              </ul>
            </div>
            
            <Alert className="mt-4">
              <AlertDescription>
                <strong>Teaching Moment:</strong> When we draw a "line" on paper, we're actually drawing a representation of a line, not a true mathematical line. A true line would extend forever in both directions and have no width. This distinction between mathematical abstractions and their physical representations is important throughout geometry.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Line Segments</h3>
            <p className="mb-4">
              A line segment is a part of a line that has two endpoints. Unlike a line, a line segment has a definite length that can be measured.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Properties of line segments:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Has exactly two endpoints</li>
                <li>Has a definite, measurable length</li>
                <li>Is the shortest distance between two points</li>
                <li>Can be named using its endpoints (e.g., segment AB)</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Rays</h3>
            <p className="mb-4">
              A ray has one endpoint and extends infinitely in one direction. It's like half of a line.
            </p>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Properties of rays:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Has one endpoint (called the origin)</li>
                <li>Extends infinitely in one direction</li>
                <li>Named using the endpoint and another point on the ray</li>
                <li>Used to define angles</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Problems */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Practice Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 1: Identify the Elements</h4>
              <p>Look around your classroom and identify examples of points, lines, line segments, and rays.</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 2: Name the Elements</h4>
              <p>Given points A, B, and C on a line, name all possible line segments and rays.</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 3: True or False</h4>
              <p>"A line segment is part of a ray" - Explain your answer.</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 4: Classification</h4>
              <p>Classify each of the following as a point, line, line segment, or ray: corner of a desk, edge of a ruler, laser beam, horizon line.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};