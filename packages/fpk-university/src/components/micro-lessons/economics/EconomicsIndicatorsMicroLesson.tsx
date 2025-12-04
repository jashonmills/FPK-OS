import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

interface EconomicsIndicatorsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EconomicsIndicatorsMicroLesson: React.FC<EconomicsIndicatorsMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  const lessonData: MicroLessonData = {
    id: 'economics-indicators',
    moduleTitle: 'Economic Indicators',
    totalScreens: 11,
    screens: [
      {
        id: 'intro',
        type: 'concept',
        title: 'Measuring the Economy',
        content: `
          <h2>Economic Indicators</h2>
          <p>Economic indicators are statistics that help us understand how well an economy is performing.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <p><strong>Why They Matter:</strong> Governments, businesses, and investors use these indicators to make informed decisions.</p>
          </div>
          <div class="mt-4">
            <p>Think of economic indicators as the "vital signs" of an economy - like a doctor checking your pulse and temperature.</p>
          </div>
        `,
        estimatedTime: 2
      },
      {
        id: 'gdp-concept',
        type: 'concept',
        title: 'Gross Domestic Product (GDP)',
        content: `
          <h2>GDP: The Economy's Report Card</h2>
          <p>GDP measures the total value of all goods and services produced in a country during a specific period.</p>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">GDP Formula</h3>
            <p class="text-center text-lg">GDP = C + I + G + (X - M)</p>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• C = Consumer Spending</li>
              <li>• I = Investment</li>
              <li>• G = Government Spending</li>
              <li>• (X - M) = Net Exports</li>
            </ul>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Key Point:</strong> GDP only counts final goods and services to avoid double counting.</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'gdp-types',
        type: 'concept',
        title: 'Types of GDP',
        content: `
          <h2>Nominal vs. Real GDP</h2>
          <p>There are two ways to measure GDP, each telling us something different.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold text-blue-800">Nominal GDP</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Uses current year prices</li>
                <li>• Affected by inflation</li>
                <li>• Shows current dollar value</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Real GDP</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Uses constant base year prices</li>
                <li>• Adjusted for inflation</li>
                <li>• Shows true economic growth</li>
              </ul>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Which is better?</strong> Real GDP for comparing across time periods; Nominal GDP for current economic size.</p>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'unemployment',
        type: 'concept',
        title: 'Unemployment Rate',
        content: `
          <h2>Measuring Joblessness</h2>
          <p>The unemployment rate shows the percentage of the labor force that is actively seeking work but unable to find it.</p>
          <div class="bg-red-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-red-800">Unemployment Rate Formula</h3>
            <p class="text-center">Unemployment Rate = (Unemployed ÷ Labor Force) × 100</p>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Who Counts as Unemployed?</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Must be 16 or older</li>
              <li>• Available for work</li>
              <li>• Actively looking for work</li>
              <li>• Currently without a job</li>
            </ul>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Note:</strong> People who have stopped looking for work are not counted as unemployed.</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'types-unemployment',
        type: 'concept',
        title: 'Types of Unemployment',
        content: `
          <h2>Why People Are Unemployed</h2>
          <p>Understanding different types of unemployment helps policymakers choose appropriate solutions.</p>
          <div class="space-y-3 mt-4">
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold text-blue-800">Frictional Unemployment</h3>
              <p class="text-sm">Short-term unemployment during job transitions</p>
              <p class="text-sm text-gray-600">Example: Recent graduates looking for their first job</p>
            </div>
            <div class="border-l-4 border-red-500 pl-4">
              <h3 class="font-bold text-red-800">Structural Unemployment</h3>
              <p class="text-sm">Long-term unemployment due to economic changes</p>
              <p class="text-sm text-gray-600">Example: Coal miners when the economy shifts to renewable energy</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold text-green-800">Cyclical Unemployment</h3>
              <p class="text-sm">Unemployment due to economic downturns</p>
              <p class="text-sm text-gray-600">Example: Job losses during a recession</p>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'inflation',
        type: 'concept',
        title: 'Inflation',
        content: `
          <h2>Rising Prices</h2>
          <p>Inflation is the general increase in prices over time, reducing the purchasing power of money.</p>
          <div class="bg-red-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-red-800">How It's Measured</h3>
            <p><strong>Consumer Price Index (CPI):</strong> Tracks the cost of a "market basket" of goods and services</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-yellow-50 p-3 rounded-lg">
              <h3 class="font-bold text-yellow-800">Moderate Inflation</h3>
              <p class="text-sm">2-3% annually - generally healthy</p>
            </div>
            <div class="bg-red-50 p-3 rounded-lg">
              <h3 class="font-bold text-red-800">High Inflation</h3>
              <p class="text-sm">Above 5% - can harm the economy</p>
            </div>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Deflation</h3>
            <p class="text-sm">Falling prices - can signal economic problems</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'causes-inflation',
        type: 'concept',
        title: 'What Causes Inflation?',
        content: `
          <h2>Sources of Rising Prices</h2>
          <p>Inflation can come from different sources, requiring different solutions.</p>
          <div class="space-y-3 mt-4">
            <div class="border-l-4 border-red-500 pl-4">
              <h3 class="font-bold text-red-800">Demand-Pull Inflation</h3>
              <p class="text-sm">Too much demand chasing too few goods</p>
              <p class="text-sm text-gray-600">Example: Economic boom increases spending</p>
            </div>
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold text-blue-800">Cost-Push Inflation</h3>
              <p class="text-sm">Rising production costs increase prices</p>
              <p class="text-sm text-gray-600">Example: Oil price increases raise transportation costs</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold text-green-800">Built-in Inflation</h3>
              <p class="text-sm">Expected inflation becomes self-fulfilling</p>
              <p class="text-sm text-gray-600">Example: Workers demand higher wages expecting inflation</p>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'other-indicators',
        type: 'concept',
        title: 'Other Key Indicators',
        content: `
          <h2>Additional Economic Measures</h2>
          <p>Several other indicators provide insights into economic health.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="space-y-3">
              <div class="bg-blue-50 p-3 rounded-lg">
                <h3 class="font-bold text-blue-800">Interest Rates</h3>
                <p class="text-sm">Cost of borrowing money</p>
              </div>
              <div class="bg-green-50 p-3 rounded-lg">
                <h3 class="font-bold text-green-800">Stock Market Indices</h3>
                <p class="text-sm">Overall stock market performance</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="bg-purple-50 p-3 rounded-lg">
                <h3 class="font-bold text-purple-800">Consumer Confidence</h3>
                <p class="text-sm">How optimistic consumers feel</p>
              </div>
              <div class="bg-yellow-50 p-3 rounded-lg">
                <h3 class="font-bold text-yellow-800">Business Investment</h3>
                <p class="text-sm">Companies' spending on equipment and expansion</p>
              </div>
            </div>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'recession-example',
        type: 'example',
        title: '2008 Financial Crisis Indicators',
        content: `
          <h2>Economic Indicators During Crisis</h2>
          <p>Let's examine how key indicators behaved during the 2008 financial crisis:</p>
          <div class="space-y-3 mt-4">
            <div class="bg-red-50 p-3 rounded-lg">
              <h3 class="font-bold text-red-800">GDP</h3>
              <p class="text-sm">Declined sharply in 2008-2009, signaling recession</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <h3 class="font-bold text-blue-800">Unemployment</h3>
              <p class="text-sm">Rose from 5% to over 10% as companies laid off workers</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">Inflation</h3>
              <p class="text-sm">Initially fell due to reduced demand and economic contraction</p>
            </div>
            <div class="bg-purple-50 p-3 rounded-lg">
              <h3 class="font-bold text-purple-800">Stock Market</h3>
              <p class="text-sm">Dow Jones fell from 14,000 to below 7,000</p>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Lesson:</strong> Multiple indicators together provide a clearer picture than any single measure.</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'practice-calculation',
        type: 'practice',
        title: 'Calculate Unemployment Rate',
        content: `
          <h2>Practice Problem</h2>
          <p>Calculate the unemployment rate using the following data:</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold">Country X Data</h3>
            <ul class="mt-2 space-y-1">
              <li>• Total Population: 100 million</li>
              <li>• Under 16 years old: 20 million</li>
              <li>• Not in labor force: 30 million</li>
              <li>• Employed: 45 million</li>
              <li>• Unemployed: 5 million</li>
            </ul>
          </div>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Solution</h3>
            <p>Labor Force = Employed + Unemployed = 45 + 5 = 50 million</p>
            <p>Unemployment Rate = (5 ÷ 50) × 100 = 10%</p>
          </div>
        `,
        estimatedTime: 5
      },
      {
        id: 'summary',
        type: 'summary',
        title: 'Economic Indicators Summary',
        content: `
          <h2>Key Takeaways</h2>
          <div class="space-y-4 mt-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold text-blue-800">Major Indicators</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• GDP: Total economic output</li>
                <li>• Unemployment Rate: Percentage of jobless workers</li>
                <li>• Inflation Rate: Price level changes</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Why They Matter</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Guide government policy decisions</li>
                <li>• Help businesses plan for the future</li>
                <li>• Inform investment choices</li>
              </ul>
            </div>
          </div>
          <p class="mt-4 text-center font-medium">Economic indicators are the dashboard of the economy!</p>
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