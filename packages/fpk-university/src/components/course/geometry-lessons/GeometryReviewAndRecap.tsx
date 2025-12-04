import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, BookOpen, Calculator, Ruler, Compass, RotateCw, Box, MapPin, ArrowRight } from 'lucide-react';

export const GeometryReviewAndRecap: React.FC = () => {
  const journeyLessons = [
    {
      id: 1,
      title: "Points, Lines, and Planes",
      description: "Foundation concepts of geometry",
      icon: <Ruler className="w-5 h-5" />,
      keyTopics: ["Basic geometric elements", "Line segments and rays", "Angle measurements", "Parallel and perpendicular lines"],
      unit: "Foundations",
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: 2,
      title: "Triangles",
      description: "Properties and theorems of triangles",
      icon: <Compass className="w-5 h-5" />,
      keyTopics: ["Triangle classification", "Angle sum theorem", "Congruence criteria", "Special right triangles"],
      unit: "Polygons",
      color: "bg-green-50 text-green-700 border-green-200"
    },
    {
      id: 3,
      title: "Quadrilaterals",
      description: "Four-sided polygons and their properties",
      icon: <BookOpen className="w-5 h-5" />,
      keyTopics: ["Rectangle, square, parallelogram", "Rhombus and trapezoid", "Properties and theorems", "Area formulas"],
      unit: "Polygons",
      color: "bg-green-50 text-green-700 border-green-200"
    },
    {
      id: 4,
      title: "Circles",
      description: "Circle properties and calculations",
      icon: <span className="w-5 h-5 border-2 border-current rounded-full" />,
      keyTopics: ["Circumference and area", "Chords and arcs", "Central and inscribed angles", "Circle theorems"],
      unit: "Circles",
      color: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      id: 5,
      title: "Transformations",
      description: "Geometric movements and changes",
      icon: <RotateCw className="w-5 h-5" />,
      keyTopics: ["Reflection and rotation", "Translation and scaling", "Symmetry", "Transformation combinations"],
      unit: "Transformations",
      color: "bg-red-50 text-red-700 border-red-200"
    },
    {
      id: 6,
      title: "3D Shapes and Volume",
      description: "Three-dimensional geometry",
      icon: <Box className="w-5 h-5" />,
      keyTopics: ["Prisms and pyramids", "Cylinders and cones", "Surface area calculations", "Volume formulas"],
      unit: "Measurements",
      color: "bg-orange-50 text-orange-700 border-orange-200"
    },
    {
      id: 7,
      title: "Coordinate Geometry",
      description: "Geometry in the coordinate plane",
      icon: <MapPin className="w-5 h-5" />,
      keyTopics: ["Distance and midpoint", "Slope and equations", "Geometric proofs", "Coordinate transformations"],
      unit: "Transformations",
      color: "bg-red-50 text-red-700 border-red-200"
    },
    {
      id: 8,
      title: "Vectors and Vector Geometry",
      description: "Advanced vector concepts",
      icon: <ArrowRight className="w-5 h-5" />,
      keyTopics: ["Vector operations", "Dot and cross products", "Vector applications", "Geometric interpretations"],
      unit: "Advanced Concepts",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200"
    }
  ];

  const essentialFormulas = [
    {
      category: "Basic Shapes",
      formulas: [
        { name: "Triangle Area", formula: "A = ½bh", description: "Base times height divided by 2" },
        { name: "Rectangle Area", formula: "A = lw", description: "Length times width" },
        { name: "Circle Area", formula: "A = πr²", description: "Pi times radius squared" },
        { name: "Circle Circumference", formula: "C = 2πr", description: "2 pi times radius" }
      ]
    },
    {
      category: "3D Shapes",
      formulas: [
        { name: "Rectangular Prism Volume", formula: "V = lwh", description: "Length times width times height" },
        { name: "Cylinder Volume", formula: "V = πr²h", description: "Pi times radius squared times height" },
        { name: "Sphere Volume", formula: "V = ⁴⁄₃πr³", description: "Four-thirds pi times radius cubed" },
        { name: "Cone Volume", formula: "V = ⅓πr²h", description: "One-third pi times radius squared times height" }
      ]
    },
    {
      category: "Coordinate Geometry",
      formulas: [
        { name: "Distance Formula", formula: "d = √[(x₂-x₁)² + (y₂-y₁)²]", description: "Distance between two points" },
        { name: "Midpoint Formula", formula: "M = ((x₁+x₂)/2, (y₁+y₂)/2)", description: "Midpoint between two points" },
        { name: "Slope Formula", formula: "m = (y₂-y₁)/(x₂-x₁)", description: "Rise over run" }
      ]
    }
  ];

  const skillsAssessment = [
    "Identify and classify geometric shapes and their properties",
    "Calculate areas, perimeters, and volumes of various shapes",
    "Apply geometric theorems and proofs",
    "Perform transformations and analyze symmetry",
    "Work with coordinate geometry and vectors",
    "Solve real-world problems using geometric concepts",
    "Understand relationships between 2D and 3D shapes",
    "Apply mathematical reasoning to geometric situations"
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <h1 className="text-4xl font-bold text-foreground">Geometry Journey Complete!</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Congratulations! You've successfully completed all 8 lessons of Interactive Geometry Fundamentals. 
          Let's review your amazing learning journey and celebrate the geometric concepts you've mastered.
        </p>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <BookOpen className="w-5 h-5 mr-2" />
          Complete Course Review
        </Badge>
      </div>

      {/* Journey Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Compass className="w-6 h-6" />
            Your Geometry Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {journeyLessons.map((lesson) => (
              <Card key={lesson.id} className={`border-2 ${lesson.color}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-current text-white">
                      <span className="text-sm font-bold">{lesson.id}</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">{lesson.unit}</Badge>
                    </div>
                    {lesson.icon}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>
                  <ul className="space-y-1">
                    {lesson.keyTopics.map((topic, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Essential Formulas Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="w-6 h-6" />
            Essential Formulas Mastered
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {essentialFormulas.map((category) => (
              <div key={category.category}>
                <h3 className="font-semibold text-lg mb-3 text-primary">{category.category}</h3>
                <div className="space-y-3">
                  {category.formulas.map((formula, index) => (
                    <div key={index} className="bg-muted/50 p-3 rounded-lg">
                      <div className="font-medium text-sm">{formula.name}</div>
                      <div className="font-mono text-lg my-1 text-primary">{formula.formula}</div>
                      <div className="text-xs text-muted-foreground">{formula.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CheckCircle className="w-6 h-6" />
            Skills You've Developed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Through this comprehensive journey, you've developed these essential geometric skills:
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {skillsAssessment.map((skill, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Practice Problems Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="w-6 h-6" />
            Quick Skills Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Test your knowledge with these mixed problems covering all the concepts you've learned:
          </p>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 1: Area Calculation</h4>
              <p className="text-sm">Find the area of a triangle with base 12 cm and height 8 cm.</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 2: Circle Properties</h4>
              <p className="text-sm">A circle has a radius of 5 units. Calculate both its circumference and area.</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 3: 3D Volume</h4>
              <p className="text-sm">Find the volume of a rectangular prism with dimensions 6 × 4 × 3 units.</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem 4: Coordinate Geometry</h4>
              <p className="text-sm">Find the distance between points A(2, 3) and B(6, 7).</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Congratulations */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border-green-200 dark:border-green-800">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
            Excellent Work!
          </h2>
          <p className="text-green-700 dark:text-green-300 max-w-2xl mx-auto">
            You've successfully reviewed all the essential concepts from your geometry journey. 
            You're now ready for the final celebration of your achievement!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};