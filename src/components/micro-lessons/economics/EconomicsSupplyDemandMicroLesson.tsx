import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

interface EconomicsSupplyDemandMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EconomicsSupplyDemandMicroLesson: React.FC<EconomicsSupplyDemandMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  const lessonData: MicroLessonData = {
    id: 'economics-supply-demand',
    moduleTitle: 'Supply and Demand',
    totalScreens: 11,
    screens: [
      {
        id: 'intro',
        type: 'concept',
        title: 'Market Forces',
        content: `
          <h2>Supply and Demand: The Heart of Markets</h2>
          <p>Supply and demand are the fundamental forces that determine prices in a market economy.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <p><strong>Market:</strong> Any place where buyers and sellers come together to exchange goods or services.</p>
          </div>
          <div class="mt-4 text-center">
            <p class="text-lg font-medium">Price = Where Supply Meets Demand</p>
          </div>
        `,
        estimatedTime: 2
      },
      {
        id: 'demand-concept',
        type: 'concept',
        title: 'Understanding Demand',
        content: `
          <h2>What is Demand?</h2>
          <p>Demand is the quantity of a good or service that consumers are willing and able to buy at different prices.</p>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Key Requirements for Demand</h3>
            <ul class="mt-2 space-y-1">
              <li>• <strong>Willingness:</strong> Consumer wants the product</li>
              <li>• <strong>Ability:</strong> Consumer can afford the product</li>
            </ul>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Note:</strong> Just wanting something isn't demand - you must also be able to pay for it!</p>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'law-demand',
        type: 'concept',
        title: 'Law of Demand',
        content: `
          <h2>The Law of Demand</h2>
          <p>As the price of a good increases, the quantity demanded decreases (all else being equal).</p>
          <div class="bg-red-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-red-800">Why This Happens</h3>
            <ul class="mt-2 space-y-2">
              <li><strong>Substitution Effect:</strong> Higher prices make alternatives more attractive</li>
              <li><strong>Income Effect:</strong> Higher prices reduce your purchasing power</li>
            </ul>
          </div>
          <div class="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <p class="text-center"><strong>Demand Curve:</strong> Slopes downward from left to right</p>
            <p class="text-center text-sm text-gray-600">Higher Price → Lower Quantity Demanded</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'supply-concept',
        type: 'concept',
        title: 'Understanding Supply',
        content: `
          <h2>What is Supply?</h2>
          <p>Supply is the quantity of a good or service that producers are willing and able to offer at different prices.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Producer Considerations</h3>
            <ul class="mt-2 space-y-1">
              <li>• Cost of production</li>
              <li>• Available technology</li>
              <li>• Number of sellers</li>
              <li>• Government regulations</li>
            </ul>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'law-supply',
        type: 'concept',
        title: 'Law of Supply',
        content: `
          <h2>The Law of Supply</h2>
          <p>As the price of a good increases, the quantity supplied increases (all else being equal).</p>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Why This Happens</h3>
            <ul class="mt-2 space-y-2">
              <li><strong>Profit Motive:</strong> Higher prices mean higher profits</li>
              <li><strong>Production Incentive:</strong> More profitable to produce more</li>
            </ul>
          </div>
          <div class="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <p class="text-center"><strong>Supply Curve:</strong> Slopes upward from left to right</p>
            <p class="text-center text-sm text-gray-600">Higher Price → Higher Quantity Supplied</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'market-equilibrium',
        type: 'concept',
        title: 'Market Equilibrium',
        content: `
          <h2>Where Supply Meets Demand</h2>
          <p>Market equilibrium occurs where the quantity supplied equals the quantity demanded.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-red-50 p-4 rounded-lg">
              <h3 class="font-bold text-red-800">Shortage</h3>
              <p class="text-sm">Demand > Supply</p>
              <p class="text-sm">Prices tend to rise</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold text-blue-800">Surplus</h3>
              <p class="text-sm">Supply > Demand</p>
              <p class="text-sm">Prices tend to fall</p>
            </div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Equilibrium</h3>
            <p>The market "clears" - no shortage or surplus</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'demand-shifters',
        type: 'concept',
        title: 'What Shifts Demand?',
        content: `
          <h2>Demand Curve Shifters</h2>
          <p>Several factors can shift the entire demand curve left or right:</p>
          <div class="space-y-3 mt-4">
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold">Income Changes</h3>
              <p class="text-sm">More income usually increases demand for normal goods</p>
            </div>
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold">Consumer Preferences</h3>
              <p class="text-sm">Trends and tastes affect demand</p>
            </div>
            <div class="border-l-4 border-purple-500 pl-4">
              <h3 class="font-bold">Price of Related Goods</h3>
              <p class="text-sm">Substitutes and complements affect demand</p>
            </div>
            <div class="border-l-4 border-orange-500 pl-4">
              <h3 class="font-bold">Future Expectations</h3>
              <p class="text-sm">Expected price changes affect current demand</p>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'supply-shifters',
        type: 'concept',
        title: 'What Shifts Supply?',
        content: `
          <h2>Supply Curve Shifters</h2>
          <p>These factors can shift the entire supply curve:</p>
          <div class="space-y-3 mt-4">
            <div class="border-l-4 border-red-500 pl-4">
              <h3 class="font-bold">Production Costs</h3>
              <p class="text-sm">Lower costs increase supply</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold">Technology</h3>
              <p class="text-sm">Better technology increases supply</p>
            </div>
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold">Number of Sellers</h3>
              <p class="text-sm">More producers increase market supply</p>
            </div>
            <div class="border-l-4 border-yellow-500 pl-4">
              <h3 class="font-bold">Government Policy</h3>
              <p class="text-sm">Regulations and taxes affect supply</p>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'coffee-example',
        type: 'example',
        title: 'Coffee Market Analysis',
        content: `
          <h2>The Global Coffee Market</h2>
          <p>Let's analyze how supply and demand work in the coffee market:</p>
          <div class="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold">Recent Scenario</h3>
            <p>A frost destroys 30% of Brazil's coffee crop (Brazil is the world's largest coffee producer).</p>
          </div>
          <div class="space-y-3 mt-4">
            <div class="bg-red-50 p-3 rounded-lg">
              <h3 class="font-bold text-red-800">Supply Effect</h3>
              <p class="text-sm">Supply decreases (curve shifts left)</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <h3 class="font-bold text-blue-800">Price Effect</h3>
              <p class="text-sm">Coffee prices increase worldwide</p>
            </div>
            <div class="bg-yellow-50 p-3 rounded-lg">
              <h3 class="font-bold text-yellow-800">Consumer Response</h3>
              <p class="text-sm">Some consumers switch to tea (substitute goods)</p>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'practice-problem',
        type: 'practice',
        title: 'Market Analysis Practice',
        content: `
          <h2>Analyze This Market Change</h2>
          <p>The government announces a new study showing that eating apples significantly improves health.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold">Questions to Consider:</h3>
            <ol class="mt-2 space-y-2">
              <li>1. What happens to the demand for apples?</li>
              <li>2. What happens to the price of apples?</li>
              <li>3. What might happen to the demand for oranges?</li>
            </ol>
          </div>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Answers:</h3>
            <ol class="mt-2 space-y-1 text-sm">
              <li>1. Demand increases (curve shifts right)</li>
              <li>2. Price increases due to higher demand</li>
              <li>3. Demand for oranges might decrease (substitutes)</li>
            </ol>
          </div>
        `,
        estimatedTime: 5
      },
      {
        id: 'summary',
        type: 'summary',
        title: 'Supply and Demand Summary',
        content: `
          <h2>Key Takeaways</h2>
          <div class="space-y-4 mt-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold text-blue-800">The Laws</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Law of Demand: Higher price → Lower quantity demanded</li>
                <li>• Law of Supply: Higher price → Higher quantity supplied</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Market Equilibrium</h3>
              <p class="text-sm">Where supply and demand curves intersect - determines market price</p>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h3 class="font-bold text-yellow-800">Curve Shifts</h3>
              <p class="text-sm">Changes in non-price factors shift entire curves, creating new equilibrium points</p>
            </div>
          </div>
          <p class="mt-4 text-center font-medium">You now understand the fundamental forces driving all markets!</p>
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