import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

interface EconomicsIntroductionMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EconomicsIntroductionMicroLesson: React.FC<EconomicsIntroductionMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  const lessonData: MicroLessonData = {
    id: 'economics-introduction',
    moduleTitle: 'Introduction to Economics',
    totalScreens: 10,
    screens: [
      {
        id: 'welcome',
        type: 'concept',
        title: 'Welcome to Economics',
        content: `
          <h2>What is Economics?</h2>
          <p>Economics is the social science that studies how people, businesses, and governments make choices about using limited resources to satisfy their wants and needs.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <p><strong>Key Insight:</strong> Economics affects every aspect of our daily lives - from the price of coffee to career choices!</p>
          </div>
        `,
        estimatedTime: 2
      },
      {
        id: 'scarcity',
        type: 'concept',
        title: 'The Problem of Scarcity',
        content: `
          <h2>Scarcity: The Foundation of Economics</h2>
          <p>Scarcity means that resources are limited while human wants are unlimited. This creates the need to make choices.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-red-50 p-4 rounded-lg">
              <h3 class="font-bold text-red-800">Limited Resources</h3>
              <ul class="mt-2 text-sm">
                <li>• Time</li>
                <li>• Money</li>
                <li>• Natural resources</li>
                <li>• Labor</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Unlimited Wants</h3>
              <ul class="mt-2 text-sm">
                <li>• Better housing</li>
                <li>• Education</li>
                <li>• Entertainment</li>
                <li>• Healthcare</li>
              </ul>
            </div>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'opportunity-cost',
        type: 'concept',
        title: 'Opportunity Cost',
        content: `
          <h2>Every Choice Has a Cost</h2>
          <p>Opportunity cost is the value of the next best alternative that you give up when making a choice.</p>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-yellow-800">Example</h3>
            <p>If you spend $10 on a movie ticket, the opportunity cost might be the book you could have bought instead.</p>
          </div>
          <div class="mt-4">
            <p><strong>Formula:</strong> Opportunity Cost = Value of Next Best Alternative</p>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'economic-thinking',
        type: 'concept',
        title: 'Economic Thinking',
        content: `
          <h2>How Economists Think</h2>
          <p>Economists use specific principles to analyze choices and behavior:</p>
          <div class="space-y-3 mt-4">
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold">1. Marginal Analysis</h3>
              <p class="text-sm">Compare additional benefits vs. additional costs</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold">2. Trade-offs</h3>
              <p class="text-sm">Recognize that every choice involves giving something up</p>
            </div>
            <div class="border-l-4 border-purple-500 pl-4">
              <h3 class="font-bold">3. Incentives Matter</h3>
              <p class="text-sm">People respond to rewards and penalties</p>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'microeconomics',
        type: 'concept',
        title: 'Microeconomics',
        content: `
          <h2>Microeconomics: The Small Picture</h2>
          <p>Microeconomics studies individual consumers, firms, and markets.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Focus Areas:</h3>
            <ul class="mt-2 space-y-1">
              <li>• How consumers make purchasing decisions</li>
              <li>• How firms decide what to produce</li>
              <li>• How prices are determined in markets</li>
              <li>• Supply and demand interactions</li>
            </ul>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'macroeconomics',
        type: 'concept',
        title: 'Macroeconomics',
        content: `
          <h2>Macroeconomics: The Big Picture</h2>
          <p>Macroeconomics studies the economy as a whole, including national and global economic trends.</p>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Focus Areas:</h3>
            <ul class="mt-2 space-y-1">
              <li>• Gross Domestic Product (GDP)</li>
              <li>• Inflation and unemployment rates</li>
              <li>• Government fiscal policy</li>
              <li>• International trade</li>
            </ul>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'example-decision',
        type: 'example',
        title: 'Real-World Economic Decision',
        content: `
          <h2>Sarah's College Decision</h2>
          <p>Let's see how economic principles apply to a real decision:</p>
          <div class="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold">The Situation</h3>
            <p>Sarah has $50,000 saved and is deciding between:</p>
            <ul class="mt-2">
              <li><strong>Option A:</strong> Attend college (costs $50,000)</li>
              <li><strong>Option B:</strong> Start working (earn $30,000/year)</li>
            </ul>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-yellow-800">Economic Analysis</h3>
            <p><strong>Opportunity Cost of College:</strong> $30,000/year in lost wages + $50,000 tuition</p>
            <p><strong>Expected Benefit:</strong> Higher lifetime earnings potential</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'factors-production',
        type: 'concept',
        title: 'Factors of Production',
        content: `
          <h2>The Building Blocks of Economics</h2>
          <p>All economic activity requires four basic factors of production:</p>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="bg-red-50 p-3 rounded-lg">
              <h3 class="font-bold text-red-800">1. Land</h3>
              <p class="text-sm">Natural resources</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <h3 class="font-bold text-blue-800">2. Labor</h3>
              <p class="text-sm">Human effort and skills</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">3. Capital</h3>
              <p class="text-sm">Tools, machines, buildings</p>
            </div>
            <div class="bg-purple-50 p-3 rounded-lg">
              <h3 class="font-bold text-purple-800">4. Entrepreneurship</h3>
              <p class="text-sm">Innovation and risk-taking</p>
            </div>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'practice-opportunity-cost',
        type: 'practice',
        title: 'Calculate Opportunity Cost',
        content: `
          <h2>Practice Problem</h2>
          <p>You have 2 hours of free time. Your options are:</p>
          <ul class="mt-2 space-y-1">
            <li><strong>A:</strong> Study (improves grades, worth $100 to you)</li>
            <li><strong>B:</strong> Work part-time (earn $20/hour)</li>
            <li><strong>C:</strong> Watch Netflix (entertainment value $30)</li>
          </ul>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold">Question</h3>
            <p>If you choose to study, what is your opportunity cost?</p>
            <div class="mt-2">
              <p><strong>Answer:</strong> $40 (the value of working part-time, your next best alternative)</p>
            </div>
          </div>
        `,
        estimatedTime: 5
      },
      {
        id: 'summary',
        type: 'summary',
        title: 'Chapter Summary',
        content: `
          <h2>Key Takeaways</h2>
          <div class="space-y-4 mt-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold text-blue-800">Core Concepts</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Economics studies how we make choices with limited resources</li>
                <li>• Scarcity creates the need for economic decisions</li>
                <li>• Every choice has an opportunity cost</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Two Main Branches</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Microeconomics: Individual markets and consumers</li>
                <li>• Macroeconomics: The economy as a whole</li>
              </ul>
            </div>
          </div>
          <p class="mt-4 text-center font-medium">You're now ready to explore specific economic concepts!</p>
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