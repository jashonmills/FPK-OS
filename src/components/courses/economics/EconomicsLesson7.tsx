import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, TrendingUp, ArrowRight, Globe, ArrowUpDown, Shield } from 'lucide-react';

interface EconomicsLesson7Props {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  isCompleted?: boolean;
  trackInteraction?: (type: string, data: any) => void;
  lessonId?: number;
  lessonTitle?: string;
}

export const EconomicsLesson7: React.FC<EconomicsLesson7Props> = ({ 
  onComplete, 
  onNext, 
  hasNext,
  isCompleted = false,
  trackInteraction,
  lessonId = 7,
  lessonTitle = "International Trade"
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
            <TrendingUp className="w-6 h-6 text-primary" />
            <CardTitle>International Trade</CardTitle>
            <Badge variant="outline">Lesson 7</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            International trade involves the exchange of goods and services between countries. 
            It's driven by comparative advantage and creates economic benefits for all trading partners.
          </p>
        </CardContent>
      </Card>

      {/* Comparative Advantage */}
      <Card>
        <CardHeader>
          <CardTitle>Comparative Advantage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              Comparative advantage is the ability of a country to produce a good at a lower 
              opportunity cost than another country. This principle explains why trade benefits all parties.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Key Concepts:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Absolute Advantage:</strong> Ability to produce more of a good with same resources</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Comparative Advantage:</strong> Lower opportunity cost in production</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Specialization:</strong> Focus on producing goods with comparative advantage</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Gains from Trade:</strong> Both countries benefit from specialization and exchange</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">Simple Example:</h4>
              <p className="text-sm mb-2">
                Even if Country A can produce both cars and computers more efficiently than Country B, 
                both countries can benefit if Country A specializes in cars (where it has the greatest advantage) 
                and Country B specializes in computers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits of Trade */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits of International Trade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Economic Benefits
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Increased efficiency through specialization</li>
                <li>• Access to larger markets</li>
                <li>• Lower prices for consumers</li>
                <li>• Greater variety of products</li>
                <li>• Economies of scale</li>
                <li>• Technology transfer</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300 flex items-center">
                <ArrowUpDown className="w-5 h-5 mr-2" />
                Social Benefits
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Cultural exchange</li>
                <li>• Improved living standards</li>
                <li>• Innovation and competition</li>
                <li>• Job creation in export industries</li>
                <li>• Economic development</li>
                <li>• Peace through interdependence</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade Barriers */}
      <Card>
        <CardHeader>
          <CardTitle>Trade Barriers and Protection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              Despite the benefits of free trade, countries sometimes implement trade barriers 
              to protect domestic industries or for strategic reasons.
            </p>
            
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold mb-2 text-red-700 dark:text-red-300 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Types of Trade Barriers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-1">Tariffs:</p>
                  <p className="mb-2">Taxes on imported goods</p>
                  <p className="font-semibold mb-1">Quotas:</p>
                  <p>Limits on quantity of imports</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Subsidies:</p>
                  <p className="mb-2">Government support for domestic producers</p>
                  <p className="font-semibold mb-1">Standards:</p>
                  <p>Technical or safety requirements</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold mb-2 text-orange-700 dark:text-orange-300">Arguments for Protection:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Protect domestic jobs</li>
                <li>• National security concerns</li>
                <li>• Infant industry support</li>
                <li>• Unfair foreign competition</li>
                <li>• Environmental standards</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exchange Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Exchange Rates and Trade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>
              Exchange rates determine the relative value of currencies and significantly 
              affect international trade flows.
            </p>
            
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">Exchange Rate Effects:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Currency Appreciation:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Makes exports more expensive</li>
                    <li>• Makes imports cheaper</li>
                    <li>• Can hurt export industries</li>
                    <li>• Benefits consumers buying imports</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Currency Depreciation:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Makes exports cheaper</li>
                    <li>• Makes imports more expensive</li>
                    <li>• Can boost export industries</li>
                    <li>• May increase inflation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade Organizations */}
      <Card>
        <CardHeader>
          <CardTitle>International Trade Organizations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">World Trade Organization (WTO)</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Facilitates global trade</li>
                  <li>• Resolves trade disputes</li>
                  <li>• Promotes free trade</li>
                  <li>• Sets international trade rules</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">Regional Trade Agreements</h4>
                <ul className="space-y-1 text-sm">
                  <li>• NAFTA/USMCA (North America)</li>
                  <li>• European Union</li>
                  <li>• ASEAN (Southeast Asia)</li>
                  <li>• MERCOSUR (South America)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-World Example */}
      <Card>
        <CardHeader>
          <CardTitle>Case Study: US-China Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="font-medium mb-2">Trade Relationship Dynamics:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">US Exports to China:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Agricultural products (soybeans, corn)</li>
                    <li>• Aircraft and machinery</li>
                    <li>• Technology products</li>
                    <li>• Services</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Chinese Exports to US:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Electronics and computers</li>
                    <li>• Textiles and clothing</li>
                    <li>• Toys and games</li>
                    <li>• Furniture</li>
                  </ul>
                </div>
              </div>
              <p className="mt-3 text-sm">
                Recent trade tensions have highlighted the complex relationship between trade 
                policy, domestic politics, and global economic integration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade Balance */}
      <Card>
        <CardHeader>
          <CardTitle>Balance of Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-950/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold mb-2">Trade Balance Concepts:</h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-green-600 dark:text-green-400">Trade Surplus:</p>
                  <p className="text-sm">Exports {'>'}  Imports (positive balance)</p>
                </div>
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Trade Deficit:</p>
                  <p className="text-sm">Imports {'>'}  Exports (negative balance)</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600 dark:text-gray-400">Balanced Trade:</p>
                  <p className="text-sm">Exports = Imports</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Completion */}
      <Card className="border-2 border-dashed border-primary/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {isCompleted ? (
                <CheckCircle className="w-12 h-12 text-green-500" />
              ) : (
                <TrendingUp className="w-12 h-12 text-primary" />
              )}
            </div>
            
            {isCompleted ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">
                  Lesson Completed! 🎉
                </h3>
                <p className="text-muted-foreground">
                  Outstanding! You now understand international trade principles and their global impact.
                </p>
                {hasNext && onNext && (
                  <Button onClick={onNext} className="mx-auto flex items-center">
                    Next Lesson: Economic Growth & Development
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Ready to Continue?</h3>
                <p className="text-muted-foreground">
                  You've learned about comparative advantage, trade barriers, and global economics.
                </p>
                <Button onClick={handleComplete} size="lg">
                  Complete Lesson 7
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};