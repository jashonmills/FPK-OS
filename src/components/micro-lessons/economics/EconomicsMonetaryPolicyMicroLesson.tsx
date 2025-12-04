import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

interface EconomicsMonetaryPolicyMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EconomicsMonetaryPolicyMicroLesson: React.FC<EconomicsMonetaryPolicyMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  const lessonData: MicroLessonData = {
    id: 'economics-monetary-policy',
    moduleTitle: 'Monetary Policy',
    totalScreens: 10,
    screens: [
      {
        id: 'intro',
        type: 'concept',
        title: 'What is Monetary Policy?',
        content: `
          <h2>Monetary Policy</h2>
          <p>Monetary policy refers to the actions taken by a central bank to influence the money supply and interest rates in an economy.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <p><strong>Goal:</strong> Promote economic stability by controlling inflation and supporting full employment.</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">In the United States</h3>
            <p>The Federal Reserve (Fed) is responsible for monetary policy.</p>
          </div>
        `,
        estimatedTime: 2
      },
      {
        id: 'federal-reserve',
        type: 'concept',
        title: 'The Federal Reserve System',
        content: `
          <h2>America's Central Bank</h2>
          <p>The Federal Reserve System, created in 1913, is the central banking system of the United States.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Structure</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Board of Governors (7 members, 14-year terms)</li>
              <li>• 12 Regional Federal Reserve Banks</li>
              <li>• Federal Open Market Committee (FOMC)</li>
            </ul>
          </div>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Key Functions</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Conduct monetary policy</li>
              <li>• Supervise banks</li>
              <li>• Provide financial services</li>
              <li>• Maintain financial stability</li>
            </ul>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'money-supply',
        type: 'concept',
        title: 'Money Supply',
        content: `
          <h2>How Much Money is in the Economy?</h2>
          <p>The money supply is the total amount of money available in an economy at a given time.</p>
          <div class="space-y-3 mt-4">
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold text-green-800">M1 (Narrow Money)</h3>
              <p class="text-sm">Cash, checking accounts, and other liquid assets</p>
            </div>
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold text-blue-800">M2 (Broad Money)</h3>
              <p class="text-sm">M1 + savings accounts, CDs, and other near-money</p>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-yellow-800">Why It Matters</h3>
            <p class="text-sm">Changes in money supply affect interest rates, inflation, and economic growth.</p>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'interest-rates',
        type: 'concept',
        title: 'Interest Rates and the Economy',
        content: `
          <h2>The Price of Money</h2>
          <p>Interest rates represent the cost of borrowing money and the reward for saving it.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-red-50 p-4 rounded-lg">
              <h3 class="font-bold text-red-800">Higher Interest Rates</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Discourage borrowing</li>
                <li>• Encourage saving</li>
                <li>• Slow economic growth</li>
                <li>• Reduce inflation</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Lower Interest Rates</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Encourage borrowing</li>
                <li>• Discourage saving</li>
                <li>• Stimulate economic growth</li>
                <li>• May increase inflation</li>
              </ul>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'monetary-tools',
        type: 'concept',
        title: 'Tools of Monetary Policy',
        content: `
          <h2>How the Fed Controls the Economy</h2>
          <p>The Federal Reserve has three main tools to implement monetary policy:</p>
          <div class="space-y-4 mt-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold text-blue-800">1. Open Market Operations</h3>
              <p class="text-sm">Buying and selling government securities to control money supply</p>
              <p class="text-sm mt-1"><strong>Most frequently used tool</strong></p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">2. Discount Rate</h3>
              <p class="text-sm">Interest rate the Fed charges banks for short-term loans</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-bold text-purple-800">3. Reserve Requirements</h3>
              <p class="text-sm">Minimum amount of reserves banks must hold</p>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'expansionary-policy',
        type: 'concept',
        title: 'Expansionary Monetary Policy',
        content: `
          <h2>Stimulating the Economy</h2>
          <p>Expansionary monetary policy is used to boost economic growth during recessions.</p>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Actions Taken</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Lower interest rates (federal funds rate)</li>
              <li>• Buy government securities (increase money supply)</li>
              <li>• Lower reserve requirements</li>
            </ul>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Expected Results</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Increased borrowing and spending</li>
              <li>• Higher investment by businesses</li>
              <li>• Job creation</li>
              <li>• Economic growth</li>
            </ul>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'contractionary-policy',
        type: 'concept',
        title: 'Contractionary Monetary Policy',
        content: `
          <h2>Cooling Down the Economy</h2>
          <p>Contractionary monetary policy is used to control inflation when the economy is overheating.</p>
          <div class="bg-red-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-red-800">Actions Taken</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Raise interest rates (federal funds rate)</li>
              <li>• Sell government securities (decrease money supply)</li>
              <li>• Raise reserve requirements</li>
            </ul>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-yellow-800">Expected Results</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Decreased borrowing and spending</li>
              <li>• Lower business investment</li>
              <li>• Reduced inflation</li>
              <li>• Slower economic growth</li>
            </ul>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'transmission-mechanism',
        type: 'concept',
        title: 'How Monetary Policy Works',
        content: `
          <h2>The Transmission Mechanism</h2>
          <p>Monetary policy affects the economy through a chain of events:</p>
          <div class="space-y-3 mt-4">
            <div class="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
              <h3 class="font-bold">Step 1: Fed Action</h3>
              <p class="text-sm">Fed changes interest rates or money supply</p>
            </div>
            <div class="text-center text-2xl">↓</div>
            <div class="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
              <h3 class="font-bold">Step 2: Bank Response</h3>
              <p class="text-sm">Banks adjust lending rates and practices</p>
            </div>
            <div class="text-center text-2xl">↓</div>
            <div class="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
              <h3 class="font-bold">Step 3: Economic Impact</h3>
              <p class="text-sm">Consumers and businesses change spending/investment</p>
            </div>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: '2008-crisis-example',
        type: 'example',
        title: '2008 Financial Crisis Response',
        content: `
          <h2>Monetary Policy in Action</h2>
          <p>The Fed's response to the 2008 financial crisis demonstrates expansionary monetary policy:</p>
          <div class="space-y-3 mt-4">
            <div class="bg-red-50 p-3 rounded-lg">
              <h3 class="font-bold text-red-800">The Crisis</h3>
              <p class="text-sm">Banks failed, credit froze, unemployment soared</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <h3 class="font-bold text-blue-800">Fed's Response</h3>
              <ul class="text-sm space-y-1">
                <li>• Cut federal funds rate to near 0%</li>
                <li>• Quantitative easing (buying long-term securities)</li>
                <li>• Emergency lending programs</li>
              </ul>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">Results</h3>
              <p class="text-sm">Helped stabilize financial system and supported economic recovery</p>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'summary',
        type: 'summary',
        title: 'Monetary Policy Summary',
        content: `
          <h2>Key Takeaways</h2>
          <div class="space-y-4 mt-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold text-blue-800">Definition</h3>
              <p class="text-sm">Central bank actions to influence money supply and interest rates</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Main Tools</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Open market operations</li>
                <li>• Discount rate</li>
                <li>• Reserve requirements</li>
              </ul>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h3 class="font-bold text-yellow-800">Two Types</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Expansionary: Stimulate growth</li>
                <li>• Contractionary: Control inflation</li>
              </ul>
            </div>
          </div>
          <p class="mt-4 text-center font-medium">Monetary policy is a powerful tool for economic stability!</p>
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