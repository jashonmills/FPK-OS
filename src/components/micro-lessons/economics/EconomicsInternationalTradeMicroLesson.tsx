import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

interface EconomicsInternationalTradeMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EconomicsInternationalTradeMicroLesson: React.FC<EconomicsInternationalTradeMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  const lessonData: MicroLessonData = {
    id: 'economics-international-trade',
    moduleTitle: 'International Trade',
    totalScreens: 11,
    screens: [
      {
        id: 'intro',
        type: 'concept',
        title: 'Why Countries Trade',
        content: `
          <h2>International Trade</h2>
          <p>International trade is the exchange of goods and services between countries.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <p><strong>Key Insight:</strong> Countries trade because they can benefit by specializing in what they do best.</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Benefits of Trade</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Access to goods not available domestically</li>
              <li>• Lower prices for consumers</li>
              <li>• Increased variety of products</li>
              <li>• Economic efficiency</li>
            </ul>
          </div>
        `,
        estimatedTime: 2
      },
      {
        id: 'absolute-advantage',
        type: 'concept',
        title: 'Absolute Advantage',
        content: `
          <h2>Being the Best Producer</h2>
          <p>A country has absolute advantage when it can produce a good using fewer resources than another country.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Example</h3>
            <p>If Brazil can produce 100 tons of coffee with the same resources that Colombia uses to produce 80 tons, Brazil has absolute advantage in coffee production.</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Simple Rule:</strong> The country that can make more of something with the same resources has absolute advantage.</p>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'comparative-advantage',
        type: 'concept',
        title: 'Comparative Advantage',
        content: `
          <h2>The Foundation of Trade</h2>
          <p>A country has comparative advantage when it can produce a good at a lower opportunity cost than another country.</p>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Key Point</h3>
            <p class="text-sm">Even if a country has absolute advantage in everything, it can still benefit from trade by focusing on its comparative advantage.</p>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Example</h3>
            <p class="text-sm">Even if the USA can produce both cars and computers more efficiently than Mexico, if the USA's advantage is greater in computers, it should specialize in computers and trade for cars.</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'trade-example',
        type: 'example',
        title: 'USA and Japan Trade Example',
        content: `
          <h2>Comparative Advantage in Action</h2>
          <p>Let's see how the USA and Japan benefit from trade:</p>
          <div class="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold">Production Capabilities (per day)</h3>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <div>
                <h4 class="font-medium">USA</h4>
                <p class="text-sm">Computers: 100 units</p>
                <p class="text-sm">Cars: 50 units</p>
              </div>
              <div>
                <h4 class="font-medium">Japan</h4>
                <p class="text-sm">Computers: 80 units</p>
                <p class="text-sm">Cars: 60 units</p>
              </div>
            </div>
          </div>
          <div class="space-y-2 mt-4">
            <div class="bg-blue-50 p-3 rounded-lg">
              <h3 class="font-bold text-blue-800">USA's Opportunity Cost</h3>
              <p class="text-sm">1 computer = 0.5 cars | 1 car = 2 computers</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">Japan's Opportunity Cost</h3>
              <p class="text-sm">1 computer = 0.75 cars | 1 car = 1.33 computers</p>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Result:</strong> USA specializes in computers (lower opportunity cost), Japan specializes in cars.</p>
          </div>
        `,
        estimatedTime: 5
      },
      {
        id: 'exports-imports',
        type: 'concept',
        title: 'Exports and Imports',
        content: `
          <h2>The Flow of International Trade</h2>
          <p>Countries engage in international trade through exports and imports.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Exports</h3>
              <p class="text-sm">Goods and services sold to other countries</p>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Bring money into the country</li>
                <li>• Create domestic jobs</li>
                <li>• Contribute to economic growth</li>
              </ul>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold text-blue-800">Imports</h3>
              <p class="text-sm">Goods and services bought from other countries</p>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Money flows out of the country</li>
                <li>• Provide variety for consumers</li>
                <li>• Can lower domestic prices</li>
              </ul>
            </div>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'trade-balance',
        type: 'concept',
        title: 'Trade Balance',
        content: `
          <h2>Measuring Trade Flows</h2>
          <p>The trade balance measures the difference between a country's exports and imports.</p>
          <div class="space-y-3 mt-4">
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold text-green-800">Trade Surplus</h3>
              <p class="text-sm">Exports > Imports</p>
              <p class="text-sm text-gray-600">Country sells more than it buys</p>
            </div>
            <div class="border-l-4 border-yellow-500 pl-4">
              <h3 class="font-bold text-yellow-800">Balanced Trade</h3>
              <p class="text-sm">Exports = Imports</p>
              <p class="text-sm text-gray-600">Country's trade is balanced</p>
            </div>
            <div class="border-l-4 border-red-500 pl-4">
              <h3 class="font-bold text-red-800">Trade Deficit</h3>
              <p class="text-sm">Imports > Exports</p>
              <p class="text-sm text-gray-600">Country buys more than it sells</p>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Note:</strong> Trade deficits aren't necessarily bad - they can indicate strong domestic demand.</p>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'barriers-to-trade',
        type: 'concept',
        title: 'Barriers to Free Trade',
        content: `
          <h2>Restrictions on International Trade</h2>
          <p>Governments sometimes restrict trade to protect domestic industries or for other policy reasons.</p>
          <div class="space-y-3 mt-4">
            <div class="bg-red-50 p-3 rounded-lg">
              <h3 class="font-bold text-red-800">Tariffs</h3>
              <p class="text-sm">Taxes on imported goods</p>
              <p class="text-sm text-gray-600">Make foreign goods more expensive</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <h3 class="font-bold text-blue-800">Quotas</h3>
              <p class="text-sm">Limits on quantity of imports</p>
              <p class="text-sm text-gray-600">Restrict how much can be imported</p>
            </div>
            <div class="bg-purple-50 p-3 rounded-lg">
              <h3 class="font-bold text-purple-800">Embargoes</h3>
              <p class="text-sm">Complete ban on trade with certain countries</p>
              <p class="text-sm text-gray-600">Usually for political reasons</p>
            </div>
            <div class="bg-yellow-50 p-3 rounded-lg">
              <h3 class="font-bold text-yellow-800">Subsidies</h3>
              <p class="text-sm">Government payments to domestic producers</p>
              <p class="text-sm text-gray-600">Help domestic companies compete</p>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'arguments-for-protection',
        type: 'concept',
        title: 'Arguments for Trade Protection',
        content: `
          <h2>Why Countries Restrict Trade</h2>
          <p>Despite the benefits of free trade, countries sometimes choose protectionist policies.</p>
          <div class="space-y-3 mt-4">
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold">Infant Industry</h3>
              <p class="text-sm">Protect new domestic industries until they become competitive</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold">National Security</h3>
              <p class="text-sm">Maintain domestic production of strategic goods</p>
            </div>
            <div class="border-l-4 border-red-500 pl-4">
              <h3 class="font-bold">Job Protection</h3>
              <p class="text-sm">Prevent job losses in domestic industries</p>
            </div>
            <div class="border-l-4 border-purple-500 pl-4">
              <h3 class="font-bold">Anti-Dumping</h3>
              <p class="text-sm">Prevent foreign companies from selling below cost</p>
            </div>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'exchange-rates',
        type: 'concept',
        title: 'Exchange Rates',
        content: `
          <h2>The Price of Currencies</h2>
          <p>Exchange rates determine how much one currency is worth in terms of another currency.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Example</h3>
            <p class="text-sm">If 1 USD = 0.85 EUR, then $100 USD = €85 EUR</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">Strong Currency</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Imports become cheaper</li>
                <li>• Exports become more expensive</li>
                <li>• Helps consumers</li>
              </ul>
            </div>
            <div class="bg-red-50 p-3 rounded-lg">
              <h3 class="font-bold text-red-800">Weak Currency</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Exports become cheaper</li>
                <li>• Imports become more expensive</li>
                <li>• Helps exporters</li>
              </ul>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'nafta-example',
        type: 'example',
        title: 'NAFTA: Free Trade in Action',
        content: `
          <h2>North American Free Trade Agreement</h2>
          <p>NAFTA (1994-2020, replaced by USMCA) demonstrates the effects of free trade agreements:</p>
          <div class="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold">Agreement</h3>
            <p>Eliminated most tariffs between USA, Canada, and Mexico</p>
          </div>
          <div class="space-y-3 mt-4">
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">Benefits</h3>
              <ul class="text-sm space-y-1">
                <li>• Increased trade volume significantly</li>
                <li>• Lower prices for consumers</li>
                <li>• Economic integration</li>
              </ul>
            </div>
            <div class="bg-red-50 p-3 rounded-lg">
              <h3 class="font-bold text-red-800">Challenges</h3>
              <ul class="text-sm space-y-1">
                <li>• Job losses in some industries</li>
                <li>• Increased competition for workers</li>
                <li>• Environmental concerns</li>
              </ul>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Lesson:</strong> Free trade creates overall benefits but can have uneven effects across industries and regions.</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'summary',
        type: 'summary',
        title: 'International Trade Summary',
        content: `
          <h2>Key Takeaways</h2>
          <div class="space-y-4 mt-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold text-blue-800">Core Concepts</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Comparative advantage drives trade</li>
                <li>• Countries benefit by specializing</li>
                <li>• Trade increases global efficiency</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Trade Balance</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Exports bring money in</li>
                <li>• Imports send money out</li>
                <li>• Balance shows net trade flow</li>
              </ul>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h3 class="font-bold text-yellow-800">Policy Tools</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Tariffs, quotas, and subsidies affect trade</li>
                <li>• Exchange rates influence competitiveness</li>
                <li>• Free trade agreements reduce barriers</li>
              </ul>
            </div>
          </div>
          <p class="mt-4 text-center font-medium">International trade makes the global economy more efficient!</p>
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