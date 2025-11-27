import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

interface EconomicsMarketStructuresMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EconomicsMarketStructuresMicroLesson: React.FC<EconomicsMarketStructuresMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  const lessonData: MicroLessonData = {
    id: 'economics-market-structures',
    moduleTitle: 'Market Structures',
    totalScreens: 10,
    screens: [
      {
        id: 'intro',
        type: 'concept',
        title: 'Types of Markets',
        content: `
          <h2>Market Structures</h2>
          <p>Markets vary based on the number of sellers, type of product, and barriers to entry.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <p><strong>Market Structure:</strong> The organization and characteristics of a market, including the number of firms and the nature of competition.</p>
          </div>
          <div class="mt-4">
            <p>Understanding market structure helps predict pricing, output, and efficiency.</p>
          </div>
        `,
        estimatedTime: 2
      },
      {
        id: 'perfect-competition',
        type: 'concept',
        title: 'Perfect Competition',
        content: `
          <h2>Perfect Competition</h2>
          <p>A theoretical market structure with many buyers and sellers, identical products, and no barriers to entry.</p>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Characteristics</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Many buyers and sellers</li>
              <li>• Identical (homogeneous) products</li>
              <li>• Perfect information</li>
              <li>• No barriers to entry or exit</li>
              <li>• Firms are price takers</li>
            </ul>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Examples:</strong> Agricultural markets (wheat, corn), stock markets</p>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'monopolistic-competition',
        type: 'concept',
        title: 'Monopolistic Competition',
        content: `
          <h2>Monopolistic Competition</h2>
          <p>Many sellers offering similar but slightly different products.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Characteristics</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Many sellers</li>
              <li>• Differentiated products</li>
              <li>• Some control over price</li>
              <li>• Low barriers to entry</li>
              <li>• Heavy use of advertising</li>
            </ul>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Examples:</strong> Restaurants, clothing stores, hair salons, gas stations</p>
          </div>
          <div class="mt-4">
            <p><strong>Key Feature:</strong> Product differentiation allows some pricing power</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'oligopoly',
        type: 'concept',
        title: 'Oligopoly',
        content: `
          <h2>Oligopoly</h2>
          <p>A market dominated by a few large firms.</p>
          <div class="bg-purple-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-purple-800">Characteristics</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Few large sellers (3-5 typically)</li>
              <li>• Products may be identical or differentiated</li>
              <li>• High barriers to entry</li>
              <li>• Mutual interdependence</li>
              <li>• Potential for collusion</li>
            </ul>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Examples:</strong> Airlines, cell phone companies, automobile manufacturers</p>
          </div>
          <div class="bg-red-50 p-4 rounded-lg mt-4">
            <p><strong>Key Feature:</strong> Firms must consider competitors' reactions to their decisions</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'monopoly',
        type: 'concept',
        title: 'Monopoly',
        content: `
          <h2>Monopoly</h2>
          <p>A market with only one seller and no close substitutes.</p>
          <div class="bg-red-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-red-800">Characteristics</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Single seller</li>
              <li>• No close substitutes</li>
              <li>• High barriers to entry</li>
              <li>• Price maker (not price taker)</li>
              <li>• May earn long-term profits</li>
            </ul>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Examples:</strong> Public utilities, patented drugs, local cable companies</p>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Sources of Monopoly Power</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Government franchise</li>
              <li>• Patents and copyrights</li>
              <li>• Control of essential resources</li>
              <li>• Network effects</li>
            </ul>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'barriers-entry',
        type: 'concept',
        title: 'Barriers to Entry',
        content: `
          <h2>What Prevents Competition?</h2>
          <p>Barriers to entry are obstacles that make it difficult for new firms to enter a market.</p>
          <div class="space-y-3 mt-4">
            <div class="border-l-4 border-red-500 pl-4">
              <h3 class="font-bold">Economic Barriers</h3>
              <p class="text-sm">High startup costs, economies of scale</p>
            </div>
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold">Legal Barriers</h3>
              <p class="text-sm">Patents, licenses, government regulations</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold">Strategic Barriers</h3>
              <p class="text-sm">Brand loyalty, exclusive contracts</p>
            </div>
            <div class="border-l-4 border-purple-500 pl-4">
              <h3 class="font-bold">Natural Barriers</h3>
              <p class="text-sm">Limited resources, geographic factors</p>
            </div>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'pricing-power',
        type: 'concept',
        title: 'Market Power and Pricing',
        content: `
          <h2>How Market Structure Affects Pricing</h2>
          <p>Different market structures give firms different levels of control over price.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="space-y-3">
              <div class="bg-green-50 p-3 rounded-lg">
                <h3 class="font-bold text-green-800">Perfect Competition</h3>
                <p class="text-sm">Price = Marginal Cost</p>
                <p class="text-sm">No pricing power</p>
              </div>
              <div class="bg-blue-50 p-3 rounded-lg">
                <h3 class="font-bold text-blue-800">Monopolistic Competition</h3>
                <p class="text-sm">Limited pricing power</p>
                <p class="text-sm">Price > Marginal Cost</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="bg-purple-50 p-3 rounded-lg">
                <h3 class="font-bold text-purple-800">Oligopoly</h3>
                <p class="text-sm">Moderate pricing power</p>
                <p class="text-sm">Strategic pricing</p>
              </div>
              <div class="bg-red-50 p-3 rounded-lg">
                <h3 class="font-bold text-red-800">Monopoly</h3>
                <p class="text-sm">Maximum pricing power</p>
                <p class="text-sm">Price >> Marginal Cost</p>
              </div>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'airline-example',
        type: 'example',
        title: 'Airline Industry Analysis',
        content: `
          <h2>Airlines: A Classic Oligopoly</h2>
          <p>The airline industry demonstrates oligopoly characteristics:</p>
          <div class="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold">Market Structure</h3>
            <p>Dominated by a few major carriers: American, Delta, United, Southwest</p>
          </div>
          <div class="space-y-3 mt-4">
            <div class="bg-red-50 p-3 rounded-lg">
              <h3 class="font-bold text-red-800">High Barriers</h3>
              <p class="text-sm">Expensive aircraft, airport slots, safety regulations</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <h3 class="font-bold text-blue-800">Interdependence</h3>
              <p class="text-sm">Airlines match competitors' prices and routes</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">Differentiation</h3>
              <p class="text-sm">Service quality, loyalty programs, route networks</p>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'practice-identification',
        type: 'practice',
        title: 'Identify Market Structures',
        content: `
          <h2>Match the Market Structure</h2>
          <p>Identify the market structure for each industry:</p>
          <div class="space-y-4 mt-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold">1. Local Pizza Delivery</h3>
              <p class="text-sm">Many competitors, slightly different products, easy entry</p>
              <p class="text-sm text-green-600 mt-2"><strong>Answer:</strong> Monopolistic Competition</p>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h3 class="font-bold">2. Operating System Software</h3>
              <p class="text-sm">Microsoft Windows dominates, high barriers, network effects</p>
              <p class="text-sm text-green-600 mt-2"><strong>Answer:</strong> Monopoly (or near-monopoly)</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-bold">3. Wheat Farming</h3>
              <p class="text-sm">Many farmers, identical product, price takers</p>
              <p class="text-sm text-green-600 mt-2"><strong>Answer:</strong> Perfect Competition</p>
            </div>
          </div>
        `,
        estimatedTime: 5
      },
      {
        id: 'summary',
        type: 'summary',
        title: 'Market Structures Summary',
        content: `
          <h2>Key Takeaways</h2>
          <div class="space-y-4 mt-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold text-blue-800">Four Main Types</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Perfect Competition: Many firms, identical products</li>
                <li>• Monopolistic Competition: Many firms, differentiated products</li>
                <li>• Oligopoly: Few large firms, strategic behavior</li>
                <li>• Monopoly: One firm, no close substitutes</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Key Factors</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Number of sellers and buyers</li>
                <li>• Product differentiation</li>
                <li>• Barriers to entry and exit</li>
                <li>• Information availability</li>
              </ul>
            </div>
          </div>
          <p class="mt-4 text-center font-medium">Market structure determines competition level and pricing power!</p>
        `,
        estimatedTime: 3
      }
    ]
  };

  return (
    <MicroLessonContainer
      lessonData={lessonData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};