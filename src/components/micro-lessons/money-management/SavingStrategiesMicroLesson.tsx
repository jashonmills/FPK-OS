import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const savingStrategiesData: MicroLessonData = {
  id: 'saving-strategies',
  moduleTitle: 'Smart Saving Strategies',
  totalScreens: 14,
        screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Welcome to Smart Saving Strategies',
      content: `
        <div class="space-y-4">
          <p class="text-lg">Saving money isn't just about putting cash in a jar - it's about making smart choices that help your money grow over time. Let's explore strategies that will maximize your savings potential!</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">You'll Learn How To:</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>Set SMART savings goals</li>
              <li>Understand compound interest and make it work for you</li>
              <li>Choose the right type of savings account</li>
              <li>Build an emergency fund</li>
              <li>Use savings challenges to stay motivated</li>
              <li>Automate your savings for success</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 2
    },
    {
      id: 'why-save',
      type: 'concept',
      title: 'Why Saving Matters',
      content: `
        <div class="space-y-4">
          <p>Saving money gives you freedom, security, and opportunities. Here's why it's one of the best habits you can develop:</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-green-700">🛡️ Security Benefits</h3>
              <ul class="space-y-2 text-sm">
                <li>• Emergency fund for unexpected expenses</li>
                <li>• Peace of mind knowing you're prepared</li>
                <li>• Protection against job loss or income reduction</li>
                <li>• Avoid debt when unexpected costs arise</li>
              </ul>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-purple-700">🚀 Opportunity Benefits</h3>
              <ul class="space-y-2 text-sm">
                <li>• Buy things you want without going into debt</li>
                <li>• Take advantage of investment opportunities</li>
                <li>• Start a business or side hustle</li>
                <li>• Travel and have experiences</li>
              </ul>
            </div>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💎 The Power of Starting Early</h4>
            <p class="text-sm">Every dollar you save in your teens has more time to grow than money saved later. Starting early is one of the biggest advantages you can give yourself!</p>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'smart-goals',
      type: 'concept',
      title: 'Setting SMART Savings Goals',
      content: `
        <div class="space-y-4">
          <p>Vague goals like "save money" rarely work. SMART goals give you a clear target and plan:</p>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🎯 SMART Goals Framework:</h3>
            <div class="space-y-3">
              <div class="flex gap-3">
                <span class="font-bold text-yellow-600">S</span>
                <div>
                  <strong>Specific:</strong> Exactly what are you saving for?
                </div>
              </div>
              <div class="flex gap-3">
                <span class="font-bold text-yellow-600">M</span>
                <div>
                  <strong>Measurable:</strong> How much money do you need?
                </div>
              </div>
              <div class="flex gap-3">
                <span class="font-bold text-yellow-600">A</span>
                <div>
                  <strong>Achievable:</strong> Is this realistic with your income?
                </div>
              </div>
              <div class="flex gap-3">
                <span class="font-bold text-yellow-600">R</span>
                <div>
                  <strong>Relevant:</strong> Does this matter to you personally?
                </div>
              </div>
              <div class="flex gap-3">
                <span class="font-bold text-yellow-600">T</span>
                <div>
                  <strong>Time-bound:</strong> When do you want to achieve this?
                </div>
              </div>
            </div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">Examples:</h4>
            <div class="space-y-2 text-sm">
              <div>
                <strong>❌ Vague:</strong> "Save money for a car"
              </div>
              <div>
                <strong>✅ SMART:</strong> "Save $3,000 for a used car down payment by graduation (18 months from now)"
              </div>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'compound-interest',
      type: 'concept',
      title: 'The Magic of Compound Interest',
      content: `
        <div class="space-y-4">
          <p>Compound interest is when you earn interest not just on your original money, but also on the interest you've already earned. It's like a snowball rolling downhill, getting bigger and bigger!</p>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🧮 How It Works:</h3>
            <div class="space-y-2 text-sm">
              <p><strong>Year 1:</strong> You save $1,000 at 5% interest</p>
              <p>End of year 1: $1,000 + ($1,000 × 0.05) = $1,050</p>
              <p><strong>Year 2:</strong> You earn interest on $1,050 (not just the original $1,000)</p>
              <p>End of year 2: $1,050 + ($1,050 × 0.05) = $1,102.50</p>
              <p><strong>The extra $2.50 is compound interest!</strong></p>
            </div>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">💰 Real-World Example:</h3>
            <p class="text-sm mb-2">If you save $100/month starting at age 16 with 6% annual returns:</p>
            <ul class="text-sm space-y-1">
              <li>• By age 25 (9 years): $14,207 (you contributed $10,800)</li>
              <li>• By age 35 (19 years): $36,786 (you contributed $22,800)</li>
              <li>• By age 65 (49 years): $287,175 (you contributed $58,800)</li>
            </ul>
            <p class="text-xs mt-2 text-gray-600">The power of time and compound growth!</p>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">⏰ Time is Your Superpower</h4>
            <p class="text-sm">Starting to save at 16 vs. 26 could mean hundreds of thousands of dollars more by retirement, even with the same monthly contributions!</p>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'types-of-savings-accounts',
      type: 'concept',
      title: 'Types of Savings Accounts',
      content: `
        <div class="space-y-4">
          <p>Not all savings accounts are created equal. Here's how to choose the right one for your goals:</p>
          
          <div class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h3 class="font-semibold mb-2 text-blue-700">🏦 Traditional Savings Account</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 class="font-medium text-green-600">Pros:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Easy access to your money</li>
                    <li>• Available at most banks</li>
                    <li>• Low or no minimum balance</li>
                    <li>• FDIC insured</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-red-600">Cons:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Very low interest rates (0.01-0.5%)</li>
                    <li>• May have monthly fees</li>
                    <li>• Interest doesn't keep up with inflation</li>
                  </ul>
                </div>
              </div>
              <p class="text-xs mt-2"><strong>Best for:</strong> Emergency funds and short-term goals</p>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h3 class="font-semibold mb-2 text-green-700">💻 High-Yield Online Savings</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 class="font-medium text-green-600">Pros:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Much higher interest rates (3-5%)</li>
                    <li>• Often no monthly fees</li>
                    <li>• Great mobile apps</li>
                    <li>• FDIC insured</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-red-600">Cons:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• No physical branches</li>
                    <li>• May take 1-3 days to transfer money</li>
                    <li>• Rates can change</li>
                  </ul>
                </div>
              </div>
              <p class="text-xs mt-2"><strong>Best for:</strong> Medium to long-term savings goals</p>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h3 class="font-semibold mb-2 text-purple-700">📅 Certificates of Deposit (CDs)</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 class="font-medium text-green-600">Pros:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Higher interest rates</li>
                    <li>• Guaranteed returns</li>
                    <li>• Forces you to save (can't withdraw easily)</li>
                    <li>• FDIC insured</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-red-600">Cons:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Money locked up for months/years</li>
                    <li>• Penalties for early withdrawal</li>
                    <li>• Higher minimum deposits</li>
                  </ul>
                </div>
              </div>
              <p class="text-xs mt-2"><strong>Best for:</strong> Long-term goals with known timelines</p>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'emergency-fund',
      type: 'concept',
      title: 'Building Your Emergency Fund',
      content: `
        <div class="space-y-4">
          <p>An emergency fund is money set aside for unexpected expenses or financial emergencies. It's your financial safety net!</p>
          
          <div class="bg-red-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3 text-red-700">🚨 What Counts as an Emergency?</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium text-green-600">✅ True Emergencies:</h4>
                <ul class="text-sm space-y-1">
                  <li>• Car repairs needed to get to work</li>
                  <li>• Medical expenses not covered by insurance</li>
                  <li>• Job loss or reduced hours</li>
                  <li>• Essential appliance breaks</li>
                  <li>• Family emergency requiring travel</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium text-red-600">❌ Not Emergencies:</h4>
                <ul class="text-sm space-y-1">
                  <li>• Black Friday sale you can't miss</li>
                  <li>• Friend's birthday party</li>
                  <li>• New video game release</li>
                  <li>• Vacation opportunity</li>
                  <li>• Upgrading to latest phone</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">💰 How Much to Save:</h3>
            <div class="space-y-2 text-sm">
              <p><strong>As a teen living at home:</strong> $500-1,000 starter emergency fund</p>
              <p><strong>When you move out:</strong> 3-6 months of living expenses</p>
              <p><strong>Example teen emergency fund uses:</strong></p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>Car repair: $300</li>
                <li>Replace broken phone: $200</li>
                <li>Emergency dental work: $150</li>
                <li>Last-minute school expense: $75</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🏗️ Building Your Emergency Fund:</h4>
            <ol class="text-sm space-y-1 list-decimal list-inside">
              <li>Start small - even $25 is a beginning!</li>
              <li>Set up automatic transfers</li>
              <li>Keep it in a separate, easily accessible account</li>
              <li>Don't invest emergency funds - keep them safe and liquid</li>
              <li>Replace money immediately after using it</li>
            </ol>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'savings-challenges',
      type: 'practice',
      title: 'Fun Savings Challenges',
      content: `
        <div class="space-y-4">
          <p>Savings challenges make building your savings account fun and engaging. Pick one that matches your lifestyle!</p>
          
          <div class="space-y-4">
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🗓️ 52-Week Challenge</h3>
              <p class="text-sm mb-2">Save $1 in week 1, $2 in week 2, $3 in week 3, etc.</p>
              <p class="text-sm"><strong>Result:</strong> $1,378 saved by year-end!</p>
              <p class="text-xs text-gray-600">Tip: Start with higher amounts when motivation is high</p>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">💵 $5 Challenge</h3>
              <p class="text-sm mb-2">Every time you get a $5 bill, save it instead of spending it.</p>
              <p class="text-sm"><strong>Average result:</strong> $300-600 per year</p>
              <p class="text-xs text-gray-600">Works great if you use cash frequently</p>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🪙 Spare Change Challenge</h3>
              <p class="text-sm mb-2">Round up all purchases to the nearest dollar and save the difference.</p>
              <p class="text-sm"><strong>Example:</strong> Coffee costs $3.75, pay $4, save $0.25</p>
              <p class="text-xs text-gray-600">Many banks offer automatic round-up programs</p>
            </div>
            
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🎯 No-Spend Challenge</h3>
              <p class="text-sm mb-2">Pick a timeframe (week, month) and only spend on necessities.</p>
              <p class="text-sm"><strong>Benefits:</strong> Save money + break spending habits</p>
              <p class="text-xs text-gray-600">Start small with a weekend or single week</p>
            </div>
          </div>
          
          <div class="bg-orange-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Challenge Success Tips:</h4>
            <ul class="text-sm space-y-1">
              <li>• Make it visual - use a chart or jar</li>
              <li>• Tell friends/family for accountability</li>
              <li>• Celebrate milestones along the way</li>
              <li>• Choose a challenge that fits your lifestyle</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'automate-savings',
      type: 'concept',
      title: 'Automating Your Savings',
      content: `
        <div class="space-y-4">
          <p>The easiest way to save consistently is to make it automatic. When saving happens without thinking about it, you're much more likely to succeed!</p>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🤖 Automation Strategies:</h3>
            <div class="space-y-3">
              <div>
                <h4 class="font-medium">💰 Direct Deposit Split</h4>
                <p class="text-sm">Have your paycheck automatically split between checking and savings</p>
                <p class="text-xs text-gray-600">Example: 80% to checking, 20% to savings</p>
              </div>
              <div>
                <h4 class="font-medium">📅 Automatic Transfers</h4>
                <p class="text-sm">Set up weekly or monthly transfers from checking to savings</p>
                <p class="text-xs text-gray-600">Schedule right after payday when money is available</p>
              </div>
              <div>
                <h4 class="font-medium">🪙 Round-Up Programs</h4>
                <p class="text-sm">Apps like Acorns or bank programs automatically invest spare change</p>
                <p class="text-xs text-gray-600">Small amounts add up over time</p>
              </div>
              <div>
                <h4 class="font-medium">🎯 Goal-Based Savings</h4>
                <p class="text-sm">Many banks let you create sub-accounts for different goals</p>
                <p class="text-xs text-gray-600">Separate accounts for car, college, emergency fund, etc.</p>
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">⚙️ Setting Up Automation:</h3>
            <ol class="text-sm space-y-2 list-decimal list-inside">
              <li><strong>Calculate your savings rate:</strong> Start with 10-20% of income</li>
              <li><strong>Choose the right timing:</strong> Right after you get paid</li>
              <li><strong>Start small:</strong> Begin with an amount you won't miss</li>
              <li><strong>Set up the transfers:</strong> Use your bank's app or website</li>
              <li><strong>Monitor and adjust:</strong> Review monthly, increase gradually</li>
            </ol>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🧠 The Psychology of Automation</h4>
            <p class="text-sm">When you don't see the money in your checking account, you don't miss it. Automation removes the temptation to spend instead of save!</p>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: 'Smart Saving Strategies Summary',
      content: `
        <div class="space-y-4">
          <h2 class="text-xl font-bold">Fantastic! You're Now a Smart Saver!</h2>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">Key Takeaways:</h3>
            <ul class="space-y-2 text-sm">
              <li>✅ SMART goals give you clear, achievable savings targets</li>
              <li>✅ Compound interest makes your money grow faster over time</li>
              <li>✅ High-yield online savings accounts maximize your returns</li>
              <li>✅ Emergency funds protect you from financial setbacks</li>
              <li>✅ Savings challenges make building your account fun and engaging</li>
              <li>✅ Automation removes willpower from the equation</li>
            </ul>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">Next Up: Introduction to Investing</h4>
            <p class="text-sm">Ready to take the next step? Learn how investing can help your money grow even faster than traditional savings accounts.</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Action Challenge</h4>
            <p class="text-sm">This week: 1) Set up a high-yield savings account, 2) Create one SMART savings goal, 3) Automate a small weekly transfer to your savings. Even $10/week is a great start!</p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🎯 Pro Tip</h4>
            <p class="text-sm">The best savings strategy is the one you'll actually stick with. Start small, be consistent, and increase your savings rate as your income grows!</p>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'high-yield-savings-deep-dive',
      type: 'concept',
      title: 'Maximizing High-Yield Savings Accounts',
      content: `
        <div class="space-y-4">
          <p>High-yield savings accounts can significantly boost your savings growth. Let's explore how to find and maximize them:</p>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🔍 What to Look For:</h3>
            <ul class="text-sm space-y-2">
              <li>• <strong>APY over 4%:</strong> Much higher than traditional banks (0.01%)</li>
              <li>• <strong>No monthly fees:</strong> Fees can eat into your interest earnings</li>
              <li>• <strong>Low minimum balance:</strong> $1 or less to start earning interest</li>
              <li>• <strong>FDIC insured:</strong> Your money is protected up to $250,000</li>
              <li>• <strong>Easy transfers:</strong> Quick access to your money when needed</li>
            </ul>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💰 Impact Example:</h4>
            <div class="bg-white p-3 rounded text-sm">
              <p class="mb-1"><strong>$1,000 saved for one year:</strong></p>
              <ul class="space-y-1">
                <li>• Traditional savings (0.01%): Earn $0.10</li>
                <li>• High-yield savings (4.5%): Earn $45</li>
                <li>• <strong>Difference: $44.90 more!</strong></li>
              </ul>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🏦 Top Online Banks for Teens:</h4>
            <ul class="text-sm space-y-1">
              <li>• Marcus by Goldman Sachs</li>
              <li>• Ally Bank</li>
              <li>• Capital One 360</li>
              <li>• Discover Bank</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'advanced-saving-techniques',
      type: 'concept',
      title: 'Advanced Saving Techniques',
      content: `
        <div class="space-y-4">
          <p>Take your savings to the next level with these advanced strategies used by successful savers:</p>
          <div class="space-y-3">
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🎯 The 1% Rule</h3>
              <p class="text-sm mb-2">Increase your savings rate by 1% every month until you reach your target.</p>
              <p class="text-sm">Example: Start saving 10%, next month 11%, then 12%, etc.</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">💸 Expense Shaving</h3>
              <p class="text-sm mb-2">Systematically reduce expenses by small amounts across all categories.</p>
              <ul class="text-sm space-y-1">
                <li>• Cancel unused subscriptions</li>
                <li>• Switch to generic brands</li>
                <li>• Use energy-efficient habits</li>
                <li>• Find free entertainment alternatives</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🔄 Income Replacement Strategy</h3>
              <p class="text-sm mb-2">When you get a raise or bonus, save the extra money instead of increasing lifestyle.</p>
              <p class="text-sm">This prevents lifestyle inflation while boosting savings significantly.</p>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'savings-psychology',
      type: 'concept',
      title: 'The Psychology of Successful Savers',
      content: `
        <div class="space-y-4">
          <p>Understanding the mental side of saving helps you build lasting habits and overcome common obstacles:</p>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🧠 Saver Mindset Traits:</h3>
            <ul class="text-sm space-y-2">
              <li>• <strong>Future-focused:</strong> Value future benefits over immediate gratification</li>
              <li>• <strong>Goal-oriented:</strong> Have specific targets to work toward</li>
              <li>• <strong>Patient:</strong> Understand that wealth building takes time</li>
              <li>• <strong>Optimistic:</strong> Believe their financial situation can improve</li>
              <li>• <strong>Disciplined:</strong> Stick to plans even when it's difficult</li>
            </ul>
          </div>
          <div class="bg-red-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🚫 Mental Traps to Avoid:</h4>
            <ul class="text-sm space-y-1">
              <li>• "I don't earn enough to save" (any amount helps)</li>
              <li>• "I'll start saving when I'm older" (time is crucial)</li>
              <li>• "Small amounts don't matter" (they compound)</li>
              <li>• "I deserve this purchase" (emotional spending)</li>
            </ul>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Motivation Techniques:</h4>
            <ul class="text-sm space-y-1">
              <li>• Visualize your goals daily</li>
              <li>• Celebrate small wins</li>
              <li>• Find an accountability partner</li>
              <li>• Track progress visually</li>
              <li>• Remind yourself of your "why"</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'opportunity-cost-thinking',
      type: 'concept',
      title: 'Understanding Opportunity Cost',
      content: `
        <div class="space-y-4">
          <p>Every spending decision means giving up something else. Understanding opportunity cost helps you make better financial choices:</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🤔 What is Opportunity Cost?</h3>
            <p class="text-sm mb-2">The value of the next best alternative you give up when making a choice.</p>
            <div class="bg-white p-3 rounded text-sm">
              <p class="mb-1"><strong>Example:</strong> You have $100 to spend</p>
              <ul class="space-y-1">
                <li>• Option A: New video game</li>
                <li>• Option B: Save and invest it</li>
                <li>• <strong>Opportunity cost of buying the game:</strong> The future value of that $100 invested</li>
              </ul>
            </div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💰 Long-term Thinking Exercise:</h4>
            <p class="text-sm mb-2">Before big purchases, calculate what that money could be worth if invested:</p>
            <ul class="text-sm space-y-1">
              <li>• $500 invested at 7% for 10 years = $983</li>
              <li>• $500 invested at 7% for 20 years = $1,935</li>
              <li>• $500 invested at 7% for 30 years = $3,811</li>
            </ul>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🎯 Smart Questions to Ask:</h4>
            <ul class="text-sm space-y-1">
              <li>• Will this purchase matter in 5 years?</li>
              <li>• What else could I do with this money?</li>
              <li>• Am I buying this for the right reasons?</li>
              <li>• How many hours did I work to earn this?</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'building-multiple-income-streams',
      type: 'concept',
      title: 'Building Multiple Income Streams',
      content: `
        <div class="space-y-4">
          <p>Relying on one source of income is risky. Smart savers build multiple income streams to accelerate their savings goals:</p>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">💼 Types of Income Streams:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium mb-2">Active Income:</h4>
                <ul class="text-sm space-y-1">
                  <li>• Part-time job</li>
                  <li>• Freelance services</li>
                  <li>• Tutoring</li>
                  <li>• Odd jobs/gigs</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-2">Passive Income:</h4>
                <ul class="text-sm space-y-1">
                  <li>• Investment dividends</li>
                  <li>• Interest from savings</li>
                  <li>• Selling digital products</li>
                  <li>• Rental income (future)</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🚀 Getting Started as a Teen:</h4>
            <ol class="text-sm space-y-1 list-decimal list-inside">
              <li>Perfect your primary income source first</li>
              <li>Identify skills you can monetize</li>
              <li>Start small with one additional stream</li>
              <li>Reinvest earnings to grow each stream</li>
              <li>Gradually add more streams over time</li>
            </ol>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Teen-Friendly Side Hustles:</h4>
            <ul class="text-sm space-y-1">
              <li>• Social media management for local businesses</li>
              <li>• Creating and selling digital art/designs</li>
              <li>• Tutoring younger students online</li>
              <li>• Pet sitting through apps like Rover</li>
              <li>• Selling handmade crafts on Etsy</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    }
  ]
};

interface SavingStrategiesMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const SavingStrategiesMicroLesson: React.FC<SavingStrategiesMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={savingStrategiesData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};