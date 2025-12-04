import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  Star, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Rocket, 
  Heart,
  Zap,
  Trophy,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const GeometryCompletionLesson: React.FC = () => {
  const navigate = useNavigate();
  const skillsGained = [
    {
      skill: "Spatial Reasoning",
      description: "Visualize and analyze shapes in 2D and 3D space",
      icon: <Lightbulb className="w-5 h-5 text-yellow-600" />
    },
    {
      skill: "Mathematical Proof",
      description: "Use logical reasoning to prove geometric theorems",
      icon: <Target className="w-5 h-5 text-blue-600" />
    },
    {
      skill: "Problem Solving",
      description: "Apply geometric concepts to real-world challenges",
      icon: <Zap className="w-5 h-5 text-purple-600" />
    },
    {
      skill: "Analytical Thinking",
      description: "Break down complex geometric problems systematically",
      icon: <TrendingUp className="w-5 h-5 text-green-600" />
    }
  ];

  const realWorldApplications = [
    {
      field: "Architecture & Engineering",
      applications: ["Building design", "Structural analysis", "CAD modeling", "Space optimization"],
      icon: "🏗️"
    },
    {
      field: "Art & Design",
      applications: ["Graphic design", "Animation", "Photography composition", "Fashion design"],
      icon: "🎨"
    },
    {
      field: "Technology",
      applications: ["Computer graphics", "Game development", "Robotics", "GPS navigation"],
      icon: "💻"
    },
    {
      field: "Science & Research",
      applications: ["Physics modeling", "Biology visualization", "Astronomy", "Medical imaging"],
      icon: "🔬"
    }
  ];

  const nextSteps = [
    {
      title: "Interactive Algebra",
      description: "Master algebraic expressions, equations, and functions",
      level: "Next Level",
      color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
      route: "/courses/algebra"
    },
    {
      title: "Trigonometry Fundamentals",
      description: "Explore angles, triangles, and periodic functions",
      level: "Advanced",
      color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800",
      route: "/courses/trigonometry"
    },
    {
      title: "Linear Equations",
      description: "Solve systems of equations and linear relationships",
      level: "Intermediate",
      color: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
      route: "/courses/linear-equations"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Celebration */}
      <div className="text-center space-y-6 py-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Trophy className="w-12 h-12 text-yellow-500" />
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <Award className="w-12 h-12 text-yellow-500" />
        </div>
        
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent dark:from-yellow-400 dark:via-orange-400 dark:to-red-400">
          🎉 CONGRATULATIONS! 🎉
        </h1>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground dark:text-foreground">
            You've Mastered Interactive Geometry Fundamentals!
          </h2>
          <p className="text-xl text-muted-foreground dark:text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            What an incredible achievement! You've successfully completed all 10 lessons of this comprehensive geometry course. 
            You've transformed from a geometry learner into a confident geometric problem-solver with a deep understanding 
            of shapes, space, and mathematical reasoning.
          </p>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="text-lg px-6 py-3 bg-yellow-100 text-yellow-800 border-yellow-300">
            <Trophy className="w-5 h-5 mr-2" />
            Course Completed
          </Badge>
          <Badge variant="secondary" className="text-lg px-6 py-3 bg-green-100 text-green-800 border-green-300">
            <Star className="w-5 h-5 mr-2" />
            10/10 Lessons
          </Badge>
          <Badge variant="secondary" className="text-lg px-6 py-3 bg-blue-100 text-blue-800 border-blue-300">
            <Rocket className="w-5 h-5 mr-2" />
            Ready for More!
          </Badge>
        </div>
      </div>

      {/* Skills Certificate */}
      <Card className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-red-950/20 border-2 border-yellow-300 dark:border-yellow-700">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-8 h-8 text-yellow-600" />
            <CardTitle className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
              Certificate of Achievement
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-lg font-semibold text-foreground dark:text-foreground">
            This certifies that you have successfully completed
          </div>
          <div className="text-2xl font-bold text-primary dark:text-primary">
            Interactive Geometry Fundamentals
          </div>
          <div className="text-sm text-muted-foreground dark:text-muted-foreground">
            A comprehensive 10-lesson course covering points, lines, triangles, quadrilaterals, 
            circles, transformations, 3D shapes, coordinate geometry, vectors, and advanced applications
          </div>
          <div className="flex items-center justify-center gap-2 pt-4">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium">Completed with dedication and excellence</span>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
        </CardContent>
      </Card>

      {/* Skills Gained */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Zap className="w-6 h-6" />
            Powerful Skills You've Developed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {skillsGained.map((item, index) => (
              <Card key={index} className="border-2 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {item.icon}
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.skill}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-World Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Rocket className="w-6 h-6" />
            Where Your Geometry Skills Shine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground dark:text-muted-foreground mb-6">
            Your geometric knowledge opens doors to exciting career paths and everyday problem-solving:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {realWorldApplications.map((field, index) => (
              <Card key={index} className="bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <span className="text-2xl">{field.icon}</span>
                    {field.field}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {field.applications.map((app, appIndex) => (
                      <li key={appIndex} className="flex items-center gap-2 text-sm">
                        <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                        {app}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="w-6 h-6" />
            Continue Your Mathematical Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground dark:text-muted-foreground mb-6">
            You've built an incredible foundation! Here are some exciting math courses to explore next:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {nextSteps.map((step, index) => (
              <Card key={index} className={`border-2 ${step.color} hover:shadow-md transition-shadow`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">{step.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-3">{step.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(step.route)}
                  >
                    Start Course <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inspirational Closing */}
      <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border-2 border-blue-300 dark:border-blue-700">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <BookOpen className="w-8 h-8 text-blue-500" />
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Your Mathematical Adventure Continues!
          </h2>
          
          <div className="space-y-4 max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground dark:text-muted-foreground leading-relaxed">
              Mathematics is not just about formulas and calculations—it's about seeing the world through a lens of 
              logic, beauty, and infinite possibility. You've proven that with curiosity, persistence, and the right 
              guidance, you can master even the most challenging concepts.
            </p>
            
            <p className="text-lg text-muted-foreground dark:text-muted-foreground leading-relaxed">
              Every shape you analyze, every proof you construct, and every problem you solve adds to your growing 
              mathematical intuition. You're not just learning geometry—you're developing a way of thinking that 
              will serve you in countless situations throughout your life.
            </p>
            
            <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg">
              <p className="text-xl font-semibold text-primary italic">
                "The only way to learn mathematics is to do mathematics." - Paul Halmos
              </p>
              <p className="text-lg text-muted-foreground dark:text-muted-foreground mt-3">
                And you've done exactly that! Keep exploring, keep questioning, and keep discovering the 
                wonderful world of mathematics.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-4">
            <Star className="w-6 h-6 text-yellow-500" />
            <span className="text-xl font-bold text-foreground dark:text-foreground">You are a Geometry Master!</span>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};