import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

interface EconomicsFiscalPolicyMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EconomicsFiscalPolicyMicroLesson: React.FC<EconomicsFiscalPolicyMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  const lessonData: MicroLessonData = {
    id: 'economics-fiscal-policy',
    moduleTitle: 'Fiscal Policy',
    totalScreens: 10,
    screens: [
      {
        id: 'intro',
        type: 'concept',
        title: 'What is Fiscal Policy?',
        content: `
          <h2>Fiscal Policy</h2>
          <p>Fiscal policy refers to the government's use of spending and taxation to influence the economy.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <p><strong>Key Players:</strong> Congress and the President determine fiscal policy through the federal budget.</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Two Main Tools</h3>
            <ul class="mt-2 space-y-1">
              <li>• Government Spending</li>
              <li>• Taxation</li>
            </ul>
          </div>
        `,
        estimatedTime: 2
      },
      {
        id: 'government-spending',
        type: 'concept',
        title: 'Government Spending',
        content: `
          <h2>How Government Spends Money</h2>
          <p>Government spending directly injects money into the economy and can stimulate economic activity.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Types of Government Spending</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Infrastructure (roads, bridges, schools)</li>
              <li>• Defense and military</li>
              <li>• Social programs (healthcare, education)</li>
              <li>• Transfer payments (Social Security, unemployment)</li>
            </ul>
          </div>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Economic Impact</h3>
            <p class="text-sm">Government spending creates jobs and increases demand for goods and services.</p>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'taxation',
        type: 'concept',
        title: 'Taxation',
        content: `
          <h2>Government Revenue and Economic Impact</h2>
          <p>Taxes provide government revenue but also affect consumer spending and business investment.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-red-50 p-4 rounded-lg">
              <h3 class="font-bold text-red-800">Higher Taxes</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Reduce disposable income</li>
                <li>• Decrease consumer spending</li>
                <li>• May discourage investment</li>
                <li>• Can slow economic growth</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Lower Taxes</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Increase disposable income</li>
                <li>• Boost consumer spending</li>
                <li>• Encourage business investment</li>
                <li>• Can stimulate economic growth</li>
              </ul>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'budget-balance',
        type: 'concept',
        title: 'Government Budget',
        content: `
          <h2>Balanced, Surplus, or Deficit?</h2>
          <p>The relationship between government spending and revenue creates different budget scenarios.</p>
          <div class="space-y-3 mt-4">
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold text-green-800">Budget Surplus</h3>
              <p class="text-sm">Revenue > Spending</p>
              <p class="text-sm text-gray-600">Government takes in more than it spends</p>
            </div>
            <div class="border-l-4 border-yellow-500 pl-4">
              <h3 class="font-bold text-yellow-800">Balanced Budget</h3>
              <p class="text-sm">Revenue = Spending</p>
              <p class="text-sm text-gray-600">Government spending equals revenue</p>
            </div>
            <div class="border-l-4 border-red-500 pl-4">
              <h3 class="font-bold text-red-800">Budget Deficit</h3>
              <p class="text-sm">Spending > Revenue</p>
              <p class="text-sm text-gray-600">Government spends more than it takes in</p>
            </div>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'expansionary-fiscal',
        type: 'concept',
        title: 'Expansionary Fiscal Policy',
        content: `
          <h2>Stimulating Economic Growth</h2>
          <p>Expansionary fiscal policy is used to boost economic activity during recessions.</p>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Policy Actions</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Increase government spending</li>
              <li>• Decrease taxes</li>
              <li>• Or both simultaneously</li>
            </ul>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Expected Results</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Increased aggregate demand</li>
              <li>• Job creation</li>
              <li>• Higher economic growth</li>
              <li>• Reduced unemployment</li>
            </ul>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Trade-off:</strong> Usually results in budget deficits</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'contractionary-fiscal',
        type: 'concept',
        title: 'Contractionary Fiscal Policy',
        content: `
          <h2>Cooling Down the Economy</h2>
          <p>Contractionary fiscal policy is used to reduce inflation when the economy is overheating.</p>
          <div class="bg-red-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-red-800">Policy Actions</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Decrease government spending</li>
              <li>• Increase taxes</li>
              <li>• Or both simultaneously</li>
            </ul>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-yellow-800">Expected Results</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Decreased aggregate demand</li>
              <li>• Reduced inflation</li>
              <li>• Slower economic growth</li>
              <li>• May increase unemployment</li>
            </ul>
          </div>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <p><strong>Benefit:</strong> Can help reduce budget deficits</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'multiplier-effect',
        type: 'concept',
        title: 'The Multiplier Effect',
        content: `
          <h2>Why Fiscal Policy is Powerful</h2>
          <p>The multiplier effect means that changes in government spending or taxes have a magnified impact on the economy.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">How It Works</h3>
            <p class="text-sm">Initial government spending creates income for workers, who then spend that money, creating more income for others.</p>
          </div>
          <div class="space-y-2 mt-4 text-sm">
            <div class="bg-gray-50 p-2 rounded">
              <strong>Round 1:</strong> Government spends $1 billion on infrastructure
            </div>
            <div class="text-center">↓</div>
            <div class="bg-gray-50 p-2 rounded">
              <strong>Round 2:</strong> Construction workers earn wages and spend 80%
            </div>
            <div class="text-center">↓</div>
            <div class="bg-gray-50 p-2 rounded">
              <strong>Round 3:</strong> Shopkeepers earn money and spend 80%
            </div>
            <div class="text-center">↓</div>
            <div class="bg-green-50 p-2 rounded">
              <strong>Result:</strong> Total economic impact > $1 billion
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'automatic-stabilizers',
        type: 'concept',
        title: 'Automatic Stabilizers',
        content: `
          <h2>Built-in Economic Shock Absorbers</h2>
          <p>Automatic stabilizers are government programs that automatically adjust spending or taxes based on economic conditions.</p>
          <div class="space-y-3 mt-4">
            <div class="bg-blue-50 p-3 rounded-lg">
              <h3 class="font-bold text-blue-800">During Recessions</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Unemployment benefits increase automatically</li>
                <li>• Tax revenues decrease (people earn less)</li>
                <li>• Progressive taxes take smaller percentage</li>
              </ul>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">During Economic Booms</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Unemployment benefits decrease automatically</li>
                <li>• Tax revenues increase (people earn more)</li>
                <li>• Progressive taxes take larger percentage</li>
              </ul>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Advantage:</strong> Work automatically without new legislation</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: '2009-stimulus-example',
        type: 'example',
        title: '2009 Economic Stimulus',
        content: `
          <h2>Fiscal Policy in Action</h2>
          <p>The American Recovery and Reinvestment Act of 2009 demonstrates expansionary fiscal policy:</p>
          <div class="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold">The Crisis</h3>
            <p>Great Recession: high unemployment, falling GDP, financial system stress</p>
          </div>
          <div class="space-y-3 mt-4">
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">Government Response</h3>
              <ul class="text-sm space-y-1">
                <li>• $787 billion stimulus package</li>
                <li>• Infrastructure spending</li>
                <li>• Tax cuts for individuals and businesses</li>
                <li>• Extended unemployment benefits</li>
              </ul>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <h3 class="font-bold text-blue-800">Results</h3>
              <p class="text-sm">Helped prevent deeper recession, though debate continues about effectiveness</p>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'summary',
        type: 'summary',
        title: 'Fiscal Policy Summary',
        content: `
          <h2>Key Takeaways</h2>
          <div class="space-y-4 mt-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold text-blue-800">Definition</h3>
              <p class="text-sm">Government use of spending and taxation to influence the economy</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Two Types</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Expansionary: Increase spending or cut taxes</li>
                <li>• Contractionary: Cut spending or raise taxes</li>
              </ul>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h3 class="font-bold text-yellow-800">Key Concepts</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Multiplier effect amplifies impact</li>
                <li>• Automatic stabilizers work without legislation</li>
                <li>• Trade-offs between growth and deficits</li>
              </ul>
            </div>
          </div>
          <p class="mt-4 text-center font-medium">Fiscal policy is government's main tool for economic management!</p>
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