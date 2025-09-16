import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const financialFoundationsData: MicroLessonData = {
  id: 'financial-foundations',
  moduleTitle: 'Financial Foundations',
  totalScreens: 10,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Welcome to Financial Foundations',
      content: `
        <div class="space-y-4">
          <p class="text-lg">Welcome to your first lesson in financial literacy! Today we'll explore the basic concepts that form the foundation of smart money management.</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">What You'll Learn:</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>What money really represents</li>
              <li>The difference between needs and wants</li>
              <li>How to make smart spending decisions</li>
              <li>Basic money vocabulary</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 2
    },
    {
      id: 'what-is-money',
      type: 'content',
      title: 'What Is Money?',
      content: `
        <div class="space-y-4">
          <p>Money is more than just coins and bills. It's a tool that represents <strong>value</strong> and allows us to trade for goods and services.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">Money Functions As:</h3>
              <ul class="space-y-2">
                <li>💰 Medium of exchange</li>
                <li>📏 Unit of measurement</li>
                <li>🏦 Store of value</li>
              </ul>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">Forms of Money:</h3>
              <ul class="space-y-2">
                <li>💵 Cash (bills and coins)</li>
                <li>💳 Digital payments</li>
                <li>📱 Mobile payments</li>
                <li>🏛️ Bank accounts</li>
              </ul>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'money-values',
      type: 'content',
      title: 'Understanding Money Values',
      content: `
        <div class="space-y-4">
          <p>Understanding the value of money helps you make better financial decisions.</p>
          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">Common Denominations:</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium mb-2">Coins:</h4>
                <ul class="text-sm space-y-1">
                  <li>Penny: $0.01</li>
                  <li>Nickel: $0.05</li>
                  <li>Dime: $0.10</li>
                  <li>Quarter: $0.25</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-2">Bills:</h4>
                <ul class="text-sm space-y-1">
                  <li>$1, $5, $10, $20</li>
                  <li>$50, $100</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Quick Tip</h4>
            <p class="text-sm">Always count your money carefully and understand the value of what you're spending!</p>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'needs-vs-wants-intro',
      type: 'content',
      title: 'Needs vs. Wants: The Foundation of Smart Spending',
      content: `
        <div class="space-y-4">
          <p>One of the most important financial skills is learning to tell the difference between what you <em>need</em> and what you <em>want</em>.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h3 class="font-semibold mb-2 text-red-700">🏠 NEEDS</h3>
              <p class="text-sm mb-2">Things you must have to survive and be healthy</p>
              <ul class="text-sm space-y-1">
                <li>• Food and water</li>
                <li>• Shelter/housing</li>
                <li>• Basic clothing</li>
                <li>• Healthcare</li>
                <li>• Transportation (to work/school)</li>
              </ul>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h3 class="font-semibold mb-2 text-blue-700">🎮 WANTS</h3>
              <p class="text-sm mb-2">Things that would be nice to have but aren't essential</p>
              <ul class="text-sm space-y-1">
                <li>• Designer clothes</li>
                <li>• Latest smartphone</li>
                <li>• Video games</li>
                <li>• Eating out frequently</li>
                <li>• Entertainment subscriptions</li>
              </ul>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'needs-wants-exercise',
      type: 'interactive',
      title: 'Practice: Needs vs. Wants',
      content: `
        <div class="space-y-4">
          <p>Let's practice! Look at these scenarios and decide: Is it a NEED or a WANT?</p>
          <div class="space-y-3">
            <div class="p-4 bg-gray-50 rounded-lg">
              <h4 class="font-medium">Scenario 1:</h4>
              <p class="text-sm mb-2">You need to get to school every day, but the bus doesn't run to your area.</p>
              <p class="text-xs text-gray-600">Transportation to school = <strong>NEED</strong></p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <h4 class="font-medium">Scenario 2:</h4>
              <p class="text-sm mb-2">Your friends are getting the newest $200 sneakers, and you want to fit in.</p>
              <p class="text-xs text-gray-600">Expensive sneakers for fashion = <strong>WANT</strong></p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <h4 class="font-medium">Scenario 3:</h4>
              <p class="text-sm mb-2">You work part-time and need lunch every day at work.</p>
              <p class="text-xs text-gray-600">Food for nutrition = <strong>NEED</strong></p>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <p class="text-sm"><strong>Remember:</strong> Sometimes wants can feel like needs, but asking "Will this help me survive and be healthy?" helps clarify the difference.</p>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'smart-spending-decisions',
      type: 'content',
      title: 'Making Smart Spending Decisions',
      content: `
        <div class="space-y-4">
          <p>Now that you understand needs vs. wants, let's learn how to make smart spending decisions.</p>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">The THINK Method:</h3>
            <div class="space-y-3">
              <div class="flex gap-3">
                <span class="font-bold text-green-600">T</span>
                <div>
                  <strong>Time:</strong> Do I have time to think about this purchase?
                </div>
              </div>
              <div class="flex gap-3">
                <span class="font-bold text-green-600">H</span>
                <div>
                  <strong>How much:</strong> How much does it cost? Do I have enough money?
                </div>
              </div>
              <div class="flex gap-3">
                <span class="font-bold text-green-600">I</span>
                <div>
                  <strong>Is it needed:</strong> Is this a need or a want?
                </div>
              </div>
              <div class="flex gap-3">
                <span class="font-bold text-green-600">N</span>
                <div>
                  <strong>Now or later:</strong> Should I buy this now, or can it wait?
                </div>
              </div>
              <div class="flex gap-3">
                <span class="font-bold text-green-600">K</span>
                <div>
                  <strong>Keep track:</strong> Will this fit in my budget?
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'opportunity-cost',
      type: 'content',
      title: 'Understanding Opportunity Cost',
      content: `
        <div class="space-y-4">
          <p>Every time you spend money on one thing, you give up the opportunity to spend it on something else. This is called <strong>opportunity cost</strong>.</p>
          <div class="bg-orange-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">Example:</h3>
            <p class="mb-2">You have $50 and are deciding between:</p>
            <ul class="list-disc list-inside space-y-1 mb-3">
              <li>A new video game ($50)</li>
              <li>Saving for a bicycle ($200 total needed)</li>
            </ul>
            <p class="text-sm">If you buy the game, your opportunity cost is getting closer to your bicycle goal.</p>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">Questions to Ask:</h4>
            <ul class="text-sm space-y-1">
              <li>• What else could I do with this money?</li>
              <li>• What am I giving up by making this purchase?</li>
              <li>• Which option will make me happier in the long run?</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'money-vocabulary',
      type: 'content',
      title: 'Essential Money Vocabulary',
      content: `
        <div class="space-y-4">
          <p>Let's learn some key financial terms you'll hear throughout this course:</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="bg-gray-50 p-3 rounded">
                <strong>Income:</strong> Money you receive (from jobs, allowance, gifts)
              </div>
              <div class="bg-gray-50 p-3 rounded">
                <strong>Expense:</strong> Money you spend
              </div>
              <div class="bg-gray-50 p-3 rounded">
                <strong>Budget:</strong> A plan for how you'll spend your money
              </div>
              <div class="bg-gray-50 p-3 rounded">
                <strong>Savings:</strong> Money you set aside for later
              </div>
            </div>
            <div class="space-y-3">
              <div class="bg-gray-50 p-3 rounded">
                <strong>Interest:</strong> Money earned on savings or paid on loans
              </div>
              <div class="bg-gray-50 p-3 rounded">
                <strong>Goal:</strong> Something you're saving money to achieve
              </div>
              <div class="bg-gray-50 p-3 rounded">
                <strong>Emergency Fund:</strong> Money saved for unexpected expenses
              </div>
              <div class="bg-gray-50 p-3 rounded">
                <strong>Investment:</strong> Using money to potentially earn more money
              </div>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'real-world-application',
      type: 'interactive',
      title: 'Real-World Application',
      content: `
        <div class="space-y-4">
          <p>Let's put it all together! Here's a realistic scenario:</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">Your Situation:</h3>
            <ul class="text-sm space-y-1 mb-3">
              <li>• You earn $80/month from a part-time job</li>
              <li>• Your parents give you $20/month allowance</li>
              <li>• Total monthly income: $100</li>
            </ul>
            <h4 class="font-medium mb-2">This month, you want to buy:</h4>
            <ul class="text-sm space-y-1">
              <li>• New headphones: $60 (want)</li>
              <li>• School lunch money: $40 (need)</li>
              <li>• Save for a laptop: $200 goal (need for school)</li>
            </ul>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">Smart Decision Process:</h4>
            <ol class="text-sm space-y-2 list-decimal list-inside">
              <li><strong>Cover needs first:</strong> School lunch ($40)</li>
              <li><strong>Save for important goals:</strong> Put $40 toward laptop</li>
              <li><strong>Remaining:</strong> $20 left - not enough for $60 headphones</li>
              <li><strong>Decision:</strong> Wait and save for headphones next month</li>
            </ol>
          </div>
        </div>
      `,
      estimatedTime: 5
    },
    {
      id: 'lesson-summary',
      type: 'content',
      title: 'Lesson Summary',
      content: `
        <div class="space-y-4">
          <h2 class="text-xl font-bold">Congratulations! You've completed Financial Foundations!</h2>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">Key Takeaways:</h3>
            <ul class="space-y-2 text-sm">
              <li>✅ Money is a tool that represents value and enables trade</li>
              <li>✅ Understanding the difference between needs and wants is crucial</li>
              <li>✅ Use the THINK method for smart spending decisions</li>
              <li>✅ Every purchase has an opportunity cost</li>
              <li>✅ Learning financial vocabulary helps you communicate about money</li>
            </ul>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">Next Up: Banking and Accounts</h4>
            <p class="text-sm">In our next lesson, you'll learn about different types of bank accounts, how to choose a bank, and how to manage your accounts safely.</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Action Challenge</h4>
            <p class="text-sm">This week, practice the THINK method before making any purchase. Keep track of your decisions and see how it helps!</p>
          </div>
        </div>
      `,
      estimatedTime: 3
    }
  ]
};

interface FinancialFoundationsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const FinancialFoundationsMicroLesson: React.FC<FinancialFoundationsMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={financialFoundationsData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};