import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const investingBasicsData: MicroLessonData = {
  id: 'investing-basics',
  moduleTitle: 'Introduction to Investing',
  totalScreens: 8,
        screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Welcome to Investing Basics',
      content: `
        <div class="space-y-4">
          <p class="text-lg">Investing is how you make your money work for you instead of working for money. While it involves some risk, it's one of the most powerful ways to build wealth over time!</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">In This Lesson You'll Discover:</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>What investing really means and why it matters</li>
              <li>The difference between saving and investing</li>
              <li>Basic investment types suitable for teens</li>
              <li>Understanding risk vs. return</li>
              <li>How to start investing as a teenager</li>
              <li>Simple strategies for long-term success</li>
            </ul>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <p class="text-sm"><strong>Important Note:</strong> This is educational information only. Always research thoroughly and consider getting advice from trusted adults before making investment decisions.</p>
          </div>
        </div>
      `,
      estimatedTime: 2
    },
    {
      id: 'what-is-investing',
      type: 'concept',
      title: 'What Is Investing?',
      content: `
        <div class="space-y-4">
          <p>Investing means putting your money into assets that you expect to grow in value over time or produce income.</p>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">💰 Saving vs. Investing:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium mb-2 text-blue-700">🏦 Saving</h4>
                <ul class="text-sm space-y-1">
                  <li>• Low risk, guaranteed returns</li>
                  <li>• Easy to access your money</li>
                  <li>• Lower returns (1-5% typically)</li>
                  <li>• Good for short-term goals</li>
                  <li>• FDIC insured up to $250k</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-2 text-purple-700">📈 Investing</h4>
                <ul class="text-sm space-y-1">
                  <li>• Higher risk, potential for higher returns</li>
                  <li>• Money tied up for longer periods</li>
                  <li>• Historical returns (7-10% annually)</li>
                  <li>• Best for long-term goals</li>
                  <li>• Not FDIC insured</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🎯 Why Teens Should Learn About Investing:</h4>
            <ul class="text-sm space-y-1">
              <li>• Time is your biggest advantage - decades for money to grow</li>
              <li>• Compound growth is most powerful over long periods</li>
              <li>• Build good financial habits early</li>
              <li>• Even small amounts can grow significantly</li>
              <li>• Learn while stakes are relatively low</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'risk-vs-return',
      type: 'concept',
      title: 'Understanding Risk vs. Return',
      content: `
        <div class="space-y-4">
          <p>The fundamental rule of investing: higher potential returns usually come with higher risk. Understanding this relationship helps you make smart decisions.</p>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">⚖️ The Risk-Return Spectrum:</h3>
            <div class="space-y-3">
              <div class="bg-green-100 p-3 rounded border-l-4 border-green-400">
                <h4 class="font-medium text-green-700">Low Risk, Low Return</h4>
                <p class="text-sm">Savings accounts, CDs, government bonds</p>
                <p class="text-xs">Expected return: 1-4% annually</p>
              </div>
              <div class="bg-blue-100 p-3 rounded border-l-4 border-blue-400">
                <h4 class="font-medium text-blue-700">Moderate Risk, Moderate Return</h4>
                <p class="text-sm">Diversified mutual funds, index funds</p>
                <p class="text-xs">Expected return: 6-8% annually</p>
              </div>
              <div class="bg-orange-100 p-3 rounded border-l-4 border-orange-400">
                <h4 class="font-medium text-orange-700">High Risk, High Potential Return</h4>
                <p class="text-sm">Individual stocks, cryptocurrency, startups</p>
                <p class="text-xs">Possible return: -50% to +100%+ (very volatile)</p>
              </div>
            </div>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🧠 Key Concepts:</h4>
            <ul class="text-sm space-y-2">
              <li>• <strong>Volatility:</strong> How much an investment's value fluctuates</li>
              <li>• <strong>Time horizon:</strong> Longer investment periods can handle more volatility</li>
              <li>• <strong>Diversification:</strong> Spreading risk across different investments</li>
              <li>• <strong>Risk tolerance:</strong> Your comfort level with potential losses</li>
            </ul>
          </div>
          
          <div class="bg-red-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">⚠️ Important Reminder:</h4>
            <p class="text-sm">Never invest money you can't afford to lose or money you'll need within the next few years!</p>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'investment-types',
      type: 'concept',
      title: 'Basic Investment Types',
      content: `
        <div class="space-y-4">
          <p>Let's explore the main types of investments and what they mean for beginner investors:</p>
          
          <div class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-blue-700">📊 Stocks (Equities)</h3>
              <p class="text-sm mb-2">Buying shares = owning a tiny piece of a company</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 class="font-medium text-green-600">Pros:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• High growth potential</li>
                    <li>• Dividends possible</li>
                    <li>• Liquid (easy to sell)</li>
                    <li>• No investment minimums</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-red-600">Cons:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Can be very volatile</li>
                    <li>• Requires research</li>
                    <li>• Individual company risk</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-green-700">🏢 Bonds</h3>
              <p class="text-sm mb-2">Loans to companies or governments that pay interest</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 class="font-medium text-green-600">Pros:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• More stable than stocks</li>
                    <li>• Regular interest payments</li>
                    <li>• Diversification benefit</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-red-600">Cons:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Lower growth potential</li>
                    <li>• Interest rate risk</li>
                    <li>• Inflation can erode value</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-purple-700">📈 Index Funds & ETFs</h3>
              <p class="text-sm mb-2">Funds that own hundreds or thousands of stocks/bonds</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 class="font-medium text-green-600">Pros:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Instant diversification</li>
                    <li>• Low fees</li>
                    <li>• Professional management</li>
                    <li>• Great for beginners</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-red-600">Cons:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Can't beat the market</li>
                    <li>• Still subject to market risk</li>
                  </ul>
                </div>
              </div>
              <p class="text-xs mt-2 text-gray-600"><strong>Best for teens:</strong> Broad market index funds (like S&P 500)</p>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'teen-investing-options',
      type: 'concept',
      title: 'How Teens Can Start Investing',
      content: `
        <div class="space-y-4">
          <p>As a teenager, you have several options to begin investing, though some require adult participation:</p>
          
          <div class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">👨‍👩‍👧‍👦 Custodial Accounts (Under 18)</h3>
              <p class="text-sm mb-2">Investment accounts managed by a parent/guardian until you reach adulthood</p>
              <ul class="text-sm space-y-1 mb-2">
                <li>• <strong>UTMA/UGMA:</strong> Flexible investment options</li>
                <li>• <strong>Custodial Roth IRA:</strong> Tax-advantaged retirement savings</li>
                <li>• <strong>529 Plans:</strong> Education-focused savings</li>
              </ul>
              <p class="text-xs text-gray-600">Money becomes yours at 18-21 (varies by state)</p>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🎓 Teen-Friendly Investment Apps</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 class="font-medium">Acorns (18+)</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Round-up spare change</li>
                    <li>• Automatic investing</li>
                    <li>• Low minimum to start</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium">Stash (18+)</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Educational content</li>
                    <li>• Fractional shares</li>
                    <li>• Theme-based investing</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🏦 Traditional Brokerages</h3>
              <p class="text-sm mb-2">Full-service investment platforms (Charles Schwab, Fidelity, Vanguard)</p>
              <ul class="text-sm space-y-1">
                <li>• Wide investment selection</li>
                <li>• Educational resources</li>
                <li>• Low or no fees on many funds</li>
                <li>• Can open custodial accounts</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🚀 Getting Started Steps:</h4>
            <ol class="text-sm space-y-1 list-decimal list-inside">
              <li>Talk to parents about opening a custodial account</li>
              <li>Start with small amounts you can afford to lose</li>
              <li>Focus on broad market index funds initially</li>
              <li>Set up automatic contributions if possible</li>
              <li>Keep learning and stay patient</li>
            </ol>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'investment-strategies',
      type: 'concept',
      title: 'Simple Investment Strategies for Beginners',
      content: `
        <div class="space-y-4">
          <p>As a beginner, keep it simple! These strategies have been proven to work well over long periods:</p>
          
          <div class="space-y-4">
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-green-700">📊 Dollar-Cost Averaging</h3>
              <p class="text-sm mb-2">Invest the same amount regularly, regardless of market conditions</p>
              <div class="bg-white p-3 rounded">
                <p class="text-sm mb-1"><strong>Example:</strong> Invest $50 every month</p>
                <ul class="text-sm space-y-1">
                  <li>• Month 1: Stock price $10, you buy 5 shares</li>
                  <li>• Month 2: Stock price $5, you buy 10 shares</li>
                  <li>• Month 3: Stock price $15, you buy 3.33 shares</li>
                  <li>• <strong>Result:</strong> Your average cost is lower than the average price!</li>
                </ul>
              </div>
              <p class="text-xs mt-2 text-gray-600">Reduces the impact of market volatility over time</p>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-blue-700">🎯 Buy and Hold</h3>
              <p class="text-sm mb-2">Buy quality investments and hold them for years or decades</p>
              <ul class="text-sm space-y-1">
                <li>• Ignore short-term market fluctuations</li>
                <li>• Benefit from long-term compound growth</li>
                <li>• Lower fees (less trading)</li>
                <li>• Less stressful than active trading</li>
              </ul>
              <p class="text-xs mt-2 text-gray-600">Warren Buffett's favorite strategy!</p>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-purple-700">🏗️ The Three-Fund Portfolio</h3>
              <p class="text-sm mb-2">Simple diversification with just three index funds</p>
              <ul class="text-sm space-y-1">
                <li>• 70% Total Stock Market Index (US stocks)</li>
                <li>• 20% International Stock Index (global stocks)</li>
                <li>• 10% Bond Index (stability)</li>
              </ul>
              <p class="text-xs mt-2 text-gray-600">Adjust percentages based on your risk tolerance</p>
            </div>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">⚠️ What NOT to Do as a Beginner:</h4>
            <ul class="text-sm space-y-1">
              <li>• Don't try to time the market</li>
              <li>• Don't put all money in one stock</li>
              <li>• Don't panic sell during market downturns</li>
              <li>• Don't invest money you need soon</li>
              <li>• Don't follow hot tips or trends blindly</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'power-of-time',
      type: 'example',
      title: 'The Power of Starting Early',
      content: `
        <div class="space-y-4">
          <p>Time is the most powerful factor in investing success. Let's see how starting early can make a huge difference:</p>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">📊 Tale of Two Investors:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-green-100 p-3 rounded">
                <h4 class="font-medium text-green-700 mb-2">Early Emma (starts at 16)</h4>
                <ul class="text-sm space-y-1">
                  <li>• Invests $100/month from 16-25</li>
                  <li>• Total invested: $12,000</li>
                  <li>• Then stops investing completely</li>
                  <li>• 7% annual return</li>
                  <li><strong>At age 65: $600,000+</strong></li>
                </ul>
              </div>
              <div class="bg-orange-100 p-3 rounded">
                <h4 class="font-medium text-orange-700 mb-2">Late Larry (starts at 26)</h4>
                <ul class="text-sm space-y-1">
                  <li>• Invests $100/month from 26-65</li>
                  <li>• Total invested: $48,000</li>
                  <li>• Invests 4x as much total</li>
                  <li>• Same 7% annual return</li>
                  <li><strong>At age 65: $540,000</strong></li>
                </ul>
              </div>
            </div>
            <p class="text-sm mt-3 font-medium">Emma invested less money but ended up with MORE because she started earlier!</p>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">⏰ Why Starting Early Matters:</h3>
            <ul class="text-sm space-y-1">
              <li>• More time for compound growth</li>
              <li>• Can ride out market volatility</li>
              <li>• Smaller amounts needed to reach big goals</li>
              <li>• Build investing habits while young</li>
              <li>• Learn from mistakes when stakes are lower</li>
            </ul>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Action Items for Teens:</h4>
            <ul class="text-sm space-y-1">
              <li>• Start with any amount, even $25/month</li>
              <li>• Focus on learning, not quick profits</li>
              <li>• Automate investments to build consistency</li>
              <li>• Think in decades, not months</li>
              <li>• Celebrate the advantage of starting young!</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: 'Investment Basics Summary',
      content: `
        <div class="space-y-4">
          <h2 class="text-xl font-bold">Congratulations! You've Learned Investment Fundamentals!</h2>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">Key Takeaways:</h3>
            <ul class="space-y-2 text-sm">
              <li>✅ Investing helps your money grow faster than traditional saving</li>
              <li>✅ Higher returns come with higher risk - understand this tradeoff</li>
              <li>✅ Index funds provide easy diversification for beginners</li>
              <li>✅ Starting early gives you a huge advantage due to compound growth</li>
              <li>✅ Simple strategies like dollar-cost averaging work well long-term</li>
              <li>✅ Never invest money you can't afford to lose or need soon</li>
            </ul>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">Next Up: Credit, Debt, and Future Planning</h4>
            <p class="text-sm">Learn how to build good credit, avoid debt traps, and plan for major financial milestones like college and career.</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Action Challenge</h4>
            <p class="text-sm">Research one investment app or talk to your parents about opening a custodial investment account. Even if you start with $25/month, you're building a valuable habit!</p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">⚠️ Remember</h4>
            <p class="text-sm">This is educational content only. Always do your own research, start small, and consider getting advice from trusted adults before making investment decisions.</p>
          </div>
        </div>
      `,
      estimatedTime: 3
    }
  ]
};

interface InvestingBasicsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const InvestingBasicsMicroLesson: React.FC<InvestingBasicsMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={investingBasicsData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};