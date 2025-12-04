import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const financialFoundationsData: MicroLessonData = {
  id: 'financial-foundations',
  moduleTitle: 'Financial Foundations',
  totalScreens: 16,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Welcome to Financial Foundations',
      content: (
        <div className="space-y-4">
          <p className="text-lg">Welcome to your first lesson in financial literacy! Today we'll explore the basic concepts that form the foundation of smart money management.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What You'll Learn:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>What money really represents</li>
              <li>The difference between needs and wants</li>
              <li>How to make smart spending decisions</li>
              <li>Basic money vocabulary</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'what-is-money',
      type: 'concept',
      title: 'What Is Money?',
      content: (
        <div className="space-y-4">
          <p>Money is more than just coins and bills. It's a tool that represents <strong>value</strong> and allows us to trade for goods and services.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Money Functions As:</h3>
              <ul className="space-y-2">
                <li>💰 Medium of exchange</li>
                <li>📏 Unit of measurement</li>
                <li>🏦 Store of value</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Forms of Money:</h3>
              <ul className="space-y-2">
                <li>💵 Cash (bills and coins)</li>
                <li>💳 Digital payments</li>
                <li>📱 Mobile payments</li>
                <li>🏛️ Bank accounts</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'money-values',
      type: 'concept',
      title: 'Understanding Money Values',
      content: (
        <div className="space-y-4">
          <p>Understanding the value of money helps you make better financial decisions.</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Common Denominations:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Coins:</h4>
                <ul className="text-sm space-y-1">
                  <li>Penny: $0.01</li>
                  <li>Nickel: $0.05</li>
                  <li>Dime: $0.10</li>
                  <li>Quarter: $0.25</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Bills:</h4>
                <ul className="text-sm space-y-1">
                  <li>$1, $5, $10, $20</li>
                  <li>$50, $100</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Quick Tip</h4>
            <p className="text-sm">Always count your money carefully and understand the value of what you're spending!</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'needs-vs-wants-intro',
      type: 'concept',
      title: 'Needs vs. Wants: The Foundation of Smart Spending',
      content: (
        <div className="space-y-4">
          <p>One of the most important financial skills is learning to tell the difference between what you <em>need</em> and what you <em>want</em>.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h3 className="font-semibold mb-2 text-red-700">🏠 NEEDS</h3>
              <p className="text-sm mb-2">Things you must have to survive and be healthy</p>
              <ul className="text-sm space-y-1">
                <li>• Food and water</li>
                <li>• Shelter/housing</li>
                <li>• Basic clothing</li>
                <li>• Healthcare</li>
                <li>• Transportation (to work/school)</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h3 className="font-semibold mb-2 text-blue-700">🎮 WANTS</h3>
              <p className="text-sm mb-2">Things that would be nice to have but aren't essential</p>
              <ul className="text-sm space-y-1">
                <li>• Designer clothes</li>
                <li>• Latest smartphone</li>
                <li>• Video games</li>
                <li>• Eating out frequently</li>
                <li>• Entertainment subscriptions</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'needs-wants-exercise',
      type: 'practice',
      title: 'Practice: Needs vs. Wants',
      content: (
        <div className="space-y-4">
          <p>Let's practice! Look at these scenarios and decide: Is it a NEED or a WANT?</p>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Scenario 1:</h4>
              <p className="text-sm mb-2">You need to get to school every day, but the bus doesn't run to your area.</p>
              <p className="text-xs text-gray-600">Transportation to school = <strong>NEED</strong></p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Scenario 2:</h4>
              <p className="text-sm mb-2">Your friends are getting the newest $200 sneakers, and you want to fit in.</p>
              <p className="text-xs text-gray-600">Expensive sneakers for fashion = <strong>WANT</strong></p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Scenario 3:</h4>
              <p className="text-sm mb-2">You work part-time and need lunch every day at work.</p>
              <p className="text-xs text-gray-600">Food for nutrition = <strong>NEED</strong></p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Remember:</strong> Sometimes wants can feel like needs, but asking "Will this help me survive and be healthy?" helps clarify the difference.</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'smart-spending-decisions',
      type: 'concept',
      title: 'Making Smart Spending Decisions',
      content: (
        <div className="space-y-4">
          <p>Now that you understand needs vs. wants, let's learn how to make smart spending decisions.</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">The THINK Method:</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="font-bold text-green-600">T</span>
                <div>
                  <strong>Time:</strong> Do I have time to think about this purchase?
                </div>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-green-600">H</span>
                <div>
                  <strong>How much:</strong> How much does it cost? Do I have enough money?
                </div>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-green-600">I</span>
                <div>
                  <strong>Is it needed:</strong> Is this a need or a want?
                </div>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-green-600">N</span>
                <div>
                  <strong>Now or later:</strong> Should I buy this now, or can it wait?
                </div>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-green-600">K</span>
                <div>
                  <strong>Keep track:</strong> Will this fit in my budget?
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'opportunity-cost',
      type: 'concept',
      title: 'Understanding Opportunity Cost',
      content: (
        <div className="space-y-4">
          <p>Every time you spend money on one thing, you give up the opportunity to spend it on something else. This is called <strong>opportunity cost</strong>.</p>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Example:</h3>
            <p className="mb-2">You have $50 and are deciding between:</p>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>A new video game ($50)</li>
              <li>Saving for a bicycle ($200 total needed)</li>
            </ul>
            <p className="text-sm">If you buy the game, your opportunity cost is getting closer to your bicycle goal.</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Questions to Ask:</h4>
            <ul className="text-sm space-y-1">
              <li>• What else could I do with this money?</li>
              <li>• What am I giving up by making this purchase?</li>
              <li>• Which option will make me happier in the long run?</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'money-vocabulary',
      type: 'concept',
      title: 'Essential Money Vocabulary',
      content: (
        <div className="space-y-4">
          <p>Let's learn some key financial terms you'll hear throughout this course:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <strong>Income:</strong> Money you receive (from jobs, allowance, gifts)
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Expense:</strong> Money you spend
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Budget:</strong> A plan for how you'll spend your money
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Savings:</strong> Money you set aside for later
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <strong>Interest:</strong> Money earned on savings or paid on loans
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Goal:</strong> Something you're saving money to achieve
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Emergency Fund:</strong> Money saved for unexpected expenses
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Investment:</strong> Using money to potentially earn more money
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'real-world-application',
      type: 'example',
      title: 'Real-World Application',
      content: (
        <div className="space-y-4">
          <p>Let's put it all together! Here's a realistic scenario:</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Your Situation:</h3>
            <ul className="text-sm space-y-1 mb-3">
              <li>• You earn $80/month from a part-time job</li>
              <li>• Your parents give you $20/month allowance</li>
              <li>• Total monthly income: $100</li>
            </ul>
            <h4 className="font-medium mb-2">This month, you want to buy:</h4>
            <ul className="text-sm space-y-1">
              <li>• New headphones: $60 (want)</li>
              <li>• School lunch money: $40 (need)</li>
              <li>• Save for a laptop: $200 goal (need for school)</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Smart Decision Process:</h4>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li><strong>Cover needs first:</strong> School lunch ($40)</li>
              <li><strong>Save for important goals:</strong> Put $40 toward laptop</li>
              <li><strong>Remaining:</strong> $20 left - not enough for $60 headphones</li>
              <li><strong>Decision:</strong> Wait and save for headphones next month</li>
            </ol>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: 'Lesson Summary',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Congratulations! You've completed Financial Foundations!</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Money is a tool that represents value and enables trade</li>
              <li>✅ Understanding the difference between needs and wants is crucial</li>
              <li>✅ Use the THINK method for smart spending decisions</li>
              <li>✅ Every purchase has an opportunity cost</li>
              <li>✅ Learning financial vocabulary helps you communicate about money</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Up: Banking and Accounts</h4>
            <p className="text-sm">In our next lesson, you'll learn about different types of bank accounts, how to choose a bank, and how to manage your accounts safely.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Action Challenge</h4>
            <p className="text-sm">This week, practice the THINK method before making any purchase. Keep track of your decisions and see how it helps!</p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'financial-psychology',
      type: 'concept',
      title: 'The Psychology of Money',
      content: `
        <div class="space-y-4">
          <p>Understanding how your mind affects your money decisions is crucial for financial success.</p>
          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🧠 Common Money Mindsets:</h3>
            <div class="space-y-3">
              <div class="bg-red-100 p-3 rounded">
                <h4 class="font-medium text-red-700">Scarcity Mindset</h4>
                <p class="text-sm">"There's never enough money" - leads to hoarding or overspending</p>
              </div>
              <div class="bg-green-100 p-3 rounded">
                <h4 class="font-medium text-green-700">Abundance Mindset</h4>
                <p class="text-sm">"I can create wealth" - leads to smart investing and opportunities</p>
              </div>
            </div>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Money Decision Triggers:</h4>
            <ul class="text-sm space-y-1">
              <li>• <strong>Emotional spending:</strong> Buying when stressed, sad, or excited</li>
              <li>• <strong>Social pressure:</strong> Spending to fit in or impress others</li>
              <li>• <strong>Instant gratification:</strong> Choosing immediate pleasure over long-term goals</li>
              <li>• <strong>Fear of missing out:</strong> Making impulsive purchases</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'family-money-conversations',
      type: 'practice',
      title: 'Having Money Conversations with Family',
      content: `
        <div class="space-y-4">
          <p>Learning to talk about money with family helps you understand your financial values and get support for your goals.</p>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🗣️ Conversation Starters:</h3>
            <ul class="text-sm space-y-2">
              <li>• "How did you learn about money management?"</li>
              <li>• "What financial mistakes did you make when you were young?"</li>
              <li>• "What's the best money advice you can give me?"</li>
              <li>• "Can we talk about my financial goals and how to reach them?"</li>
              <li>• "Would you help me open a savings account?"</li>
            </ul>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">📋 Topics to Discuss:</h4>
            <ul class="text-sm space-y-1">
              <li>• Family values about money and spending</li>
              <li>• How to handle peer pressure around money</li>
              <li>• Setting up allowance or payment for chores</li>
              <li>• College savings strategies</li>
              <li>• First job and paycheck management</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'teen-entrepreneur-basics',
      type: 'concept',
      title: 'Teen Entrepreneurship Basics',
      content: `
        <div class="space-y-4">
          <p>Many successful entrepreneurs started as teenagers. Learn how to turn your skills and interests into income!</p>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">💡 Teen Business Ideas:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium mb-2">Service-Based:</h4>
                <ul class="text-sm space-y-1">
                  <li>• Tutoring younger students</li>
                  <li>• Pet sitting/dog walking</li>
                  <li>• Lawn care/snow removal</li>
                  <li>• Social media management</li>
                  <li>• Photography for events</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-2">Product-Based:</h4>
                <ul class="text-sm space-y-1">
                  <li>• Handmade crafts/jewelry</li>
                  <li>• Baked goods</li>
                  <li>• Digital products (apps, designs)</li>
                  <li>• Reselling thrift finds</li>
                  <li>• Custom t-shirts/merchandise</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🚀 Getting Started Steps:</h4>
            <ol class="text-sm space-y-1 list-decimal list-inside">
              <li>Identify your skills and interests</li>
              <li>Research your local market and competition</li>
              <li>Start small with minimal investment</li>
              <li>Keep detailed records of income and expenses</li>
              <li>Learn from customers and adapt quickly</li>
            </ol>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'money-management-apps',
      type: 'concept',
      title: 'Essential Money Management Apps for Teens',
      content: `
        <div class="space-y-4">
          <p>Technology can be your best ally in managing money effectively. Here are the top apps for teenage money management:</p>
          <div class="space-y-3">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">📱 Banking & Spending:</h3>
              <ul class="text-sm space-y-2">
                <li>• <strong>Greenlight:</strong> Debit card for teens with parental controls</li>
                <li>• <strong>Copper:</strong> Teen bank account with spending insights</li>
                <li>• <strong>GoHenry:</strong> Prepaid card with spending controls</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">💰 Saving & Investing:</h3>
              <ul class="text-sm space-y-2">
                <li>• <strong>Acorns:</strong> Round-up spare change investing</li>
                <li>• <strong>Qapital:</strong> Automatic savings with goals</li>
                <li>• <strong>Stockpile:</strong> Teen-friendly stock investing</li>
              </ul>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">📊 Budgeting & Tracking:</h3>
              <ul class="text-sm space-y-2">
                <li>• <strong>YNAB:</strong> Comprehensive budgeting (free for students)</li>
                <li>• <strong>PocketGuard:</strong> Simple spending limits</li>
                <li>• <strong>Goodbudget:</strong> Digital envelope method</li>
              </ul>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'financial-goal-setting',
      type: 'practice',
      title: 'Setting and Achieving Financial Goals',
      content: `
        <div class="space-y-4">
          <p>Clear financial goals give you direction and motivation. Let's learn how to set goals you'll actually achieve!</p>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🎯 Types of Financial Goals:</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 class="font-medium text-green-700">Short-term (1-12 months)</h4>
                <ul class="text-sm space-y-1">
                  <li>• New phone</li>
                  <li>• Concert tickets</li>
                  <li>• Emergency fund</li>
                  <li>• Driving lessons</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium text-blue-700">Medium-term (1-5 years)</h4>
                <ul class="text-sm space-y-1">
                  <li>• Car purchase</li>
                  <li>• College expenses</li>
                  <li>• Study abroad trip</li>
                  <li>• Business startup</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium text-purple-700">Long-term (5+ years)</h4>
                <ul class="text-sm space-y-1">
                  <li>• House down payment</li>
                  <li>• Retirement savings</li>
                  <li>• Financial independence</li>
                  <li>• Dream vacation</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Goal Achievement Strategy:</h4>
            <ol class="text-sm space-y-1 list-decimal list-inside">
              <li>Write down specific, measurable goals</li>
              <li>Calculate exactly how much you need to save</li>
              <li>Set a realistic timeline</li>
              <li>Break it into monthly/weekly targets</li>
              <li>Track progress visually (charts, apps)</li>
              <li>Celebrate milestones along the way</li>
            </ol>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'financial-literacy-resources',
      type: 'concept',
      title: 'Building Your Financial Education',
      content: `
        <div class="space-y-4">
          <p>Your financial education doesn't stop here! Here are excellent resources to continue learning:</p>
          <div class="space-y-3">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">📚 Books for Teens:</h3>
              <ul class="text-sm space-y-1">
                <li>• "The Richest Man in Babylon" by George Clason</li>
                <li>• "Rich Dad Poor Dad for Teens" by Robert Kiyosaki</li>
                <li>• "The Total Money Makeover" by Dave Ramsey</li>
                <li>• "Your Money or Your Life" by Vicki Robin</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🎬 YouTube Channels:</h3>
              <ul class="text-sm space-y-1">
                <li>• Two Cents (PBS Digital)</li>
                <li>• Ben Felix</li>
                <li>• The Financial Diet</li>
                <li>• Khan Academy Personal Finance</li>
              </ul>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🌐 Websites & Tools:</h3>
              <ul class="text-sm space-y-1">
                <li>• Investopedia (financial dictionary)</li>
                <li>• JumpStart Coalition (teen financial literacy)</li>
                <li>• Practical Money Skills by Visa</li>
                <li>• National Endowment for Financial Education</li>
              </ul>
            </div>
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