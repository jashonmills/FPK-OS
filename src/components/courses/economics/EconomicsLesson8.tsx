import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Sprout, TrendingUp, Users, Factory } from 'lucide-react';

interface EconomicsLesson8Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  isCompleted?: boolean;
  trackInteraction?: (type: string, data: any) => void;
  lessonId?: number;
  lessonTitle?: string;
}

export const EconomicsLesson8: React.FC<EconomicsLesson8Props> = ({ 
  onComplete, 
  onNext, 
  hasNext,
  isCompleted = false,
  trackInteraction,
  lessonId = 8,
  lessonTitle = "Economic Growth & Development"
}) => {
  const handleComplete = () => {
    trackInteraction?.('lesson_complete_click', {
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      action: 'complete_button_clicked'
    });
    onComplete?.();
  };

  const handleConceptClick = (concept: string) => {
    trackInteraction?.('concept_interaction', {
      lesson_id: lessonId,
      concept,
      action: 'concept_viewed'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Lesson Introduction */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-primary" />
            <CardTitle>Economic Growth & Development</CardTitle>
            <Badge variant="outline">Lesson 8</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Economic growth and development are fundamental goals for nations worldwide. 
            Understanding the factors that drive long-term prosperity helps explain differences 
            in living standards between countries.
          </p>
        </CardContent>
      </Card>

      {/* Economic Growth vs Development */}
      <Card>
        <CardHeader>
          <CardTitle>Growth vs Development</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Economic Growth
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Definition:</strong> Increase in real GDP over time</p>
                <p><strong>Measurement:</strong> GDP growth rate, per capita income</p>
                <p><strong>Focus:</strong> Quantitative expansion of the economy</p>
                <p><strong>Indicators:</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• Real GDP growth</li>
                  <li>• Productivity improvements</li>
                  <li>• Capital accumulation</li>
                  <li>• Labor force expansion</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Economic Development
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Definition:</strong> Improvement in quality of life and living standards</p>
                <p><strong>Measurement:</strong> HDI, life expectancy, education levels</p>
                <p><strong>Focus:</strong> Qualitative improvements in society</p>
                <p><strong>Indicators:</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• Health and education</li>
                  <li>• Income distribution</li>
                  <li>• Environmental sustainability</li>
                  <li>• Social progress</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Factors of Economic Growth */}
      <Card>
        <CardHeader>
          <CardTitle>Drivers of Economic Growth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              Economic growth depends on the efficient use and expansion of key economic resources 
              and factors of production.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300 flex items-center">
                  <Factory className="w-5 h-5 mr-2" />
                  Capital Formation
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• Physical capital (machinery, infrastructure)</li>
                  <li>• Human capital (education, skills)</li>
                  <li>• Financial capital (savings, investment)</li>
                  <li>• Technology and innovation</li>
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold mb-2 text-orange-700 dark:text-orange-300 flex items-center">
                  <Sprout className="w-5 h-5 mr-2" />
                  Natural Resources
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• Land and raw materials</li>
                  <li>• Energy resources</li>
                  <li>• Climate and geography</li>
                  <li>• Sustainable resource management</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">Institutional Factors:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <ul className="space-y-1">
                  <li>• Property rights protection</li>
                  <li>• Rule of law</li>
                  <li>• Political stability</li>
                  <li>• Low corruption</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Efficient government</li>
                  <li>• Open markets</li>
                  <li>• Financial system development</li>
                  <li>• Education system quality</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Measuring Development</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              While GDP measures economic output, development requires broader indicators 
              that capture human welfare and sustainability.
            </p>
            
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">Human Development Index (HDI)</h4>
              <p className="text-sm mb-2">
                Composite measure combining three dimensions of human development:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-green-900/20 p-2 rounded">
                  <p className="font-medium">Health</p>
                  <p className="text-xs">Life expectancy at birth</p>
                </div>
                <div className="bg-white dark:bg-green-900/20 p-2 rounded">
                  <p className="font-medium">Education</p>
                  <p className="text-xs">Years of schooling</p>
                </div>
                <div className="bg-white dark:bg-green-900/20 p-2 rounded">
                  <p className="font-medium">Income</p>
                  <p className="text-xs">GNI per capita</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Other Development Indicators:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <ul className="space-y-1">
                  <li>• Poverty rates</li>
                  <li>• Income inequality (Gini coefficient)</li>
                  <li>• Infant mortality rate</li>
                  <li>• Literacy rates</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Access to clean water</li>
                  <li>• Environmental quality</li>
                  <li>• Gender equality measures</li>
                  <li>• Social mobility indices</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Stages */}
      <Card>
        <CardHeader>
          <CardTitle>Stages of Economic Development</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              Countries typically progress through different stages of development, 
              each characterized by distinct economic structures and challenges.
            </p>
            
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold mb-2 text-red-700 dark:text-red-300">1. Traditional Economy</h4>
                <p className="text-sm">Agriculture-based, subsistence farming, limited technology, low productivity</p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold mb-2 text-orange-700 dark:text-orange-300">2. Transitional Stage</h4>
                <p className="text-sm">Infrastructure development, improved agriculture, population growth, early industrialization</p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">3. Industrial Development</h4>
                <p className="text-sm">Manufacturing growth, urbanization, technology adoption, capital accumulation</p>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">4. Mature Economy</h4>
                <p className="text-sm">Service sector dominance, high technology, innovation-driven, high living standards</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenges and Solutions */}
      <Card>
        <CardHeader>
          <CardTitle>Development Challenges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold mb-2 text-red-700 dark:text-red-300">Common Challenges:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Poverty and inequality</li>
                <li>• Lack of infrastructure</li>
                <li>• Poor governance</li>
                <li>• Limited access to capital</li>
                <li>• Brain drain</li>
                <li>• Environmental degradation</li>
                <li>• Population pressures</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">Development Strategies:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Education investment</li>
                <li>• Infrastructure development</li>
                <li>• Healthcare improvements</li>
                <li>• Good governance</li>
                <li>• Foreign investment attraction</li>
                <li>• Technology transfer</li>
                <li>• Sustainable practices</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-World Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Success Stories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="font-medium mb-2">East Asian Tigers:</p>
              <p className="text-sm mb-2">
                South Korea, Taiwan, Singapore, and Hong Kong achieved rapid economic growth 
                from the 1960s-1990s through:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <ul className="space-y-1">
                  <li>• Export-oriented industrialization</li>
                  <li>• Heavy investment in education</li>
                  <li>• Strong government planning</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Technology adoption</li>
                  <li>• High savings rates</li>
                  <li>• Political stability</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="font-medium mb-2">China and India:</p>
              <p className="text-sm">
                Recent examples of large countries achieving sustained growth through 
                market reforms, technology adoption, and integration into global economy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sustainable Development */}
      <Card>
        <CardHeader>
          <CardTitle>Sustainable Development Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              The UN's 17 Sustainable Development Goals provide a framework for balanced 
              economic, social, and environmental progress.
            </p>
            
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">Key Principles:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="font-medium">Economic</p>
                  <p>Growth, innovation, decent work</p>
                </div>
                <div>
                  <p className="font-medium">Social</p>
                  <p>Equity, health, education</p>
                </div>
                <div>
                  <p className="font-medium">Environmental</p>
                  <p>Climate action, clean energy</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Completion */}
      <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {isCompleted ? (
                <div className="relative">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                  <div className="absolute -top-2 -right-2">
                    🎉
                  </div>
                </div>
              ) : (
                <CheckCircle className="w-12 h-12 text-primary" />
              )}
            </div>
            
            {isCompleted ? (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">
                  🎓 Course Completed! 🎉
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Congratulations! You've completed the entire Introduction to Modern Economics course. 
                  You now have a solid foundation in economic principles, from basic supply and demand 
                  to complex macroeconomic policies and international trade.
                </p>
                <div className="bg-white dark:bg-card p-4 rounded-lg border max-w-md mx-auto">
                  <h4 className="font-semibold mb-2">What You've Learned:</h4>
                  <ul className="text-sm space-y-1 text-left">
                    <li>✓ Basic economic principles</li>
                    <li>✓ Supply and demand analysis</li>
                    <li>✓ Market structures</li>
                    <li>✓ Economic indicators</li>
                    <li>✓ Monetary and fiscal policy</li>
                    <li>✓ International trade</li>
                    <li>✓ Economic growth and development</li>
                  </ul>
                </div>
                <Button onClick={() => window.location.href = '/dashboard/learner/courses'} size="lg" className="mx-auto">
                  Return to My Courses
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Complete Your Economics Journey!</h3>
                <p className="text-muted-foreground">
                  You've learned about economic growth, development indicators, and sustainable development. 
                  Ready to complete the course?
                </p>
                <Button onClick={handleComplete} size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  Complete Final Lesson
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};