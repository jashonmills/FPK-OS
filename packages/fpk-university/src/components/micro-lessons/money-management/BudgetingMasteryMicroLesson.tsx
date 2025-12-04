import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const budgetingMasteryData: MicroLessonData = {
  id: 'budgeting-mastery',
  moduleTitle: 'Budgeting Mastery',
  totalScreens: 16,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Welcome to Budgeting Mastery',
      content: `
        <div class="space-y-4">
          <p class="text-lg">A budget is your financial roadmap - it tells your money where to go instead of wondering where it went! Let's learn how to create and stick to a budget that works.</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">In This Lesson You'll Master:</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>What a budget is and why it's powerful</li>
              <li>The 50/30/20 budgeting rule</li>
              <li>How to track income and expenses</li>
              <li>Creating your first budget</li>
              <li>Budgeting apps and tools</li>
              <li>Staying motivated and adjusting your budget</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 2
    },
    {
      id: 'what-is-budget',
      type: 'concept',
      title: 'What Is a Budget?',
      content: `
        <div class="space-y-4">
          <p>A budget is simply a plan that shows how much money you have coming in (income) and how you plan to spend it (expenses).</p>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🎯 Why Budget?</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium mb-2">Benefits:</h4>
                <ul class="text-sm space-y-1">
                  <li>• Control where your money goes</li>
                  <li>• Reach your goals faster</li>
                  <li>• Avoid overspending</li>
                  <li>• Reduce money stress</li>
                  <li>• Build good financial habits</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-2">Without a Budget:</h4>
                <ul class="text-sm space-y-1">
                  <li>• Money "disappears" mysteriously</li>
                  <li>• Hard to save for goals</li>
                  <li>• Overspend frequently</li>
                  <li>• Financial stress increases</li>
                  <li>• Miss opportunities</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Budget Myth Buster</h4>
            <p class="text-sm">Budgets aren't about restricting fun - they're about making sure you can afford the things that matter to you!</p>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: '50-30-20-rule',
      type: 'concept',
      title: 'The 50/30/20 Budget Rule',
      content: `
        <div class="space-y-4">
          <p>The 50/30/20 rule is a simple budgeting framework that's perfect for beginners:</p>
          <div class="space-y-4">
            <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h3 class="font-semibold mb-2 text-red-700">🏠 50% - NEEDS</h3>
              <p class="text-sm mb-2">Essential expenses you can't avoid</p>
              <ul class="text-sm space-y-1">
                <li>• Housing (rent/mortgage)</li>
                <li>• Food and groceries</li>
                <li>• Transportation</li>
                <li>• Basic phone plan</li>
                <li>• Insurance</li>
                <li>• Minimum debt payments</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h3 class="font-semibold mb-2 text-blue-700">🎮 30% - WANTS</h3>
              <p class="text-sm mb-2">Fun stuff that makes life enjoyable</p>
              <ul class="text-sm space-y-1">
                <li>• Entertainment (movies, games, concerts)</li>
                <li>• Dining out</li>
                <li>• Hobbies</li>
                <li>• Shopping for non-essentials</li>
                <li>• Subscriptions (Netflix, Spotify)</li>
                <li>• Social activities with friends</li>
              </ul>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h3 class="font-semibold mb-2 text-green-700">💰 20% - SAVINGS & GOALS</h3>
              <p class="text-sm mb-2">Building your future financial security</p>
              <ul class="text-sm space-y-1">
                <li>• Emergency fund</li>
                <li>• Long-term savings goals</li>
                <li>• Retirement savings (even small amounts)</li>
                <li>• Extra debt payments</li>
                <li>• Investment accounts</li>
              </ul>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'teen-budget-example',
      type: 'example',
      title: 'Teen Budget Example',
      content: `
        <div class="space-y-4">
          <p>Let's see how the 50/30/20 rule works for a typical teen with a part-time job:</p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">📊 Monthly Income: $400</h3>
            <p class="text-sm mb-3">(Part-time job + allowance)</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-red-50 p-4 rounded-lg">
              <h4 class="font-semibold text-red-700 mb-2">NEEDS: $200 (50%)</h4>
              <ul class="text-sm space-y-1">
                <li>• Gas for car: $80</li>
                <li>• Phone bill: $40</li>
                <li>• School lunch: $60</li>
                <li>• Personal care: $20</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold text-blue-700 mb-2">WANTS: $120 (30%)</h4>
              <ul class="text-sm space-y-1">
                <li>• Movies/entertainment: $40</li>
                <li>• Eating out: $50</li>
                <li>• Gaming/apps: $15</li>
                <li>• Clothes: $15</li>
              </ul>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <h4 class="font-semibold text-green-700 mb-2">SAVINGS: $80 (20%)</h4>
              <ul class="text-sm space-y-1">
                <li>• Emergency fund: $30</li>
                <li>• Car fund: $30</li>
                <li>• College fund: $20</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <p class="text-sm"><strong>Pro Tip:</strong> If your needs are more than 50%, look for ways to reduce expenses or increase income. If they're less, you can save more or have more fun money!</p>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'tracking-income-expenses',
      type: 'concept',
      title: 'Tracking Your Income and Expenses',
      content: `
        <div class="space-y-4">
          <p>Before you can budget effectively, you need to know exactly how much money comes in and goes out:</p>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">💵 Tracking Income (Money Coming In):</h3>
            <ul class="text-sm space-y-1">
              <li>• Part-time job wages</li>
              <li>• Allowance from parents</li>
              <li>• Gifts (birthday, holidays)</li>
              <li>• Side hustles (tutoring, pet sitting, etc.)</li>
              <li>• Money from selling items</li>
            </ul>
            <p class="text-xs mt-2 text-gray-600">Track for at least one month to get accurate averages</p>
          </div>
          
          <div class="bg-orange-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">💸 Tracking Expenses (Money Going Out):</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <h4 class="font-medium mb-1">Fixed Expenses (same each month):</h4>
                <ul class="text-sm space-y-1">
                  <li>• Phone bill</li>
                  <li>• Subscriptions</li>
                  <li>• Insurance</li>
                  <li>• Gym membership</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-1">Variable Expenses (change monthly):</h4>
                <ul class="text-sm space-y-1">
                  <li>• Gas</li>
                  <li>• Food/eating out</li>
                  <li>• Entertainment</li>
                  <li>• Shopping</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">📱 Tracking Methods:</h4>
            <ul class="text-sm space-y-1">
              <li>• Bank/credit card statements</li>
              <li>• Receipt collection</li>
              <li>• Spending apps (Mint, YNAB, PocketGuard)</li>
              <li>• Simple notebook or spreadsheet</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'creating-your-budget',
      type: 'practice',
      title: 'Creating Your First Budget',
      content: `
        <div class="space-y-4">
          <p>Let's walk through creating a budget step-by-step:</p>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🚀 Budget Creation Steps:</h3>
            <ol class="space-y-3">
              <li class="flex gap-3">
                <span class="font-bold text-blue-600">1.</span>
                <div>
                  <strong>Calculate Monthly Income</strong>
                  <p class="text-sm">Add up all money sources (job, allowance, etc.)</p>
                </div>
              </li>
              <li class="flex gap-3">
                <span class="font-bold text-blue-600">2.</span>
                <div>
                  <strong>List All Expenses</strong>
                  <p class="text-sm">Write down everything you spend money on</p>
                </div>
              </li>
              <li class="flex gap-3">
                <span class="font-bold text-blue-600">3.</span>
                <div>
                  <strong>Categorize as Needs/Wants</strong>
                  <p class="text-sm">Be honest about what's essential vs. nice-to-have</p>
                </div>
              </li>
              <li class="flex gap-3">
                <span class="font-bold text-blue-600">4.</span>
                <div>
                  <strong>Apply the 50/30/20 Rule</strong>
                  <p class="text-sm">Allocate income to needs, wants, and savings</p>
                </div>
              </li>
              <li class="flex gap-3">
                <span class="font-bold text-blue-600">5.</span>
                <div>
                  <strong>Adjust as Needed</strong>
                  <p class="text-sm">Make cuts if expenses exceed income</p>
                </div>
              </li>
              <li class="flex gap-3">
                <span class="font-bold text-blue-600">6.</span>
                <div>
                  <strong>Track and Review</strong>
                  <p class="text-sm">Monitor spending and adjust monthly</p>
                </div>
              </li>
            </ol>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">⚡ Quick Budget Formula:</h4>
            <p class="text-sm">Income - Expenses = Surplus (should be positive!) If negative, reduce wants or increase income.</p>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'budgeting-tools',
      type: 'concept',
      title: 'Budgeting Apps and Tools',
      content: `
        <div class="space-y-4">
          <p>Technology can make budgeting easier and more effective. Here are some great options:</p>
          
          <div class="space-y-3">
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">📱 Beginner-Friendly Apps:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium">Mint (Free)</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Connects to bank accounts</li>
                    <li>• Automatic categorization</li>
                    <li>• Bill reminders</li>
                    <li>• Credit score monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium">PocketGuard (Free/Premium)</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Shows "safe to spend" amount</li>
                    <li>• Prevents overspending</li>
                    <li>• Simple interface</li>
                    <li>• Goal tracking</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">💪 Advanced Tools:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium">YNAB ($84/year)</h4>
                  <ul class="text-sm space-y-1">
                    <li>• "Give every dollar a job"</li>
                    <li>• Excellent for goal setting</li>
                    <li>• Educational resources</li>
                    <li>• Strong community</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium">EveryDollar (Free/Premium)</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Zero-based budgeting</li>
                    <li>• Dave Ramsey method</li>
                    <li>• Simple setup</li>
                    <li>• Debt payoff tools</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">📝 DIY Options:</h4>
              <ul class="text-sm space-y-1">
                <li>• Google Sheets or Excel templates</li>
                <li>• Simple notebook and pen</li>
                <li>• Envelope method (cash in labeled envelopes)</li>
                <li>• Bank's built-in budgeting tools</li>
              </ul>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'staying-motivated',
      type: 'concept',
      title: 'Staying Motivated and Adjusting Your Budget',
      content: `
        <div class="space-y-4">
          <p>Creating a budget is easy - sticking to it is the challenge! Here's how to stay on track:</p>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">💪 Motivation Strategies:</h3>
            <ul class="text-sm space-y-2">
              <li>• <strong>Set specific goals:</strong> "Save $500 for a laptop" vs. "save money"</li>
              <li>• <strong>Celebrate small wins:</strong> Reward yourself when you hit milestones</li>
              <li>• <strong>Visualize your goals:</strong> Keep photos of what you're saving for</li>
              <li>• <strong>Track progress:</strong> Seeing improvement keeps you motivated</li>
              <li>• <strong>Find an accountability partner:</strong> Friend or family member to check in with</li>
              <li>• <strong>Remember your "why":</strong> Why did you start budgeting?</li>
            </ul>
          </div>
          
          <div class="bg-orange-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🔄 When to Adjust Your Budget:</h3>
            <ul class="text-sm space-y-1">
              <li>• Income changes (new job, raise, etc.)</li>
              <li>• Major expenses change</li>
              <li>• Goals change or are achieved</li>
              <li>• Consistently overspending in a category</li>
              <li>• Life circumstances change</li>
              <li>• Every 3-6 months as a regular review</li>
            </ul>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🎯 Budget Success Tips:</h4>
            <ul class="text-sm space-y-1">
              <li>• Start with realistic amounts</li>
              <li>• Leave room for fun (the 30%!)</li>
              <li>• Don't be too hard on yourself if you mess up</li>
              <li>• Review and adjust monthly</li>
              <li>• Focus on progress, not perfection</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'common-budgeting-mistakes',
      type: 'concept',
      title: 'Common Budgeting Mistakes to Avoid',
      content: `
        <div class="space-y-4">
          <p>Learn from others' mistakes! Here are the most common budgeting pitfalls and how to avoid them:</p>
          
          <div class="space-y-3">
            <div class="bg-red-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-red-700">🚫 Mistake #1: Being Too Restrictive</h3>
              <p class="text-sm mb-1"><strong>Problem:</strong> Cutting out all fun spending</p>
              <p class="text-sm"><strong>Solution:</strong> Budget for entertainment and treats - you'll be more likely to stick to your budget</p>
            </div>
            
            <div class="bg-red-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-red-700">🚫 Mistake #2: Forgetting Irregular Expenses</h3>
              <p class="text-sm mb-1"><strong>Problem:</strong> Not planning for things like car repairs, gifts, or annual fees</p>
              <p class="text-sm"><strong>Solution:</strong> Create a "miscellaneous" category or save monthly for these expenses</p>
            </div>
            
            <div class="bg-red-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-red-700">🚫 Mistake #3: Set It and Forget It</h3>
              <p class="text-sm mb-1"><strong>Problem:</strong> Creating a budget but never checking it</p>
              <p class="text-sm"><strong>Solution:</strong> Weekly check-ins and monthly reviews to stay on track</p>
            </div>
            
            <div class="bg-red-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-red-700">🚫 Mistake #4: Perfectionism</h3>
              <p class="text-sm mb-1"><strong>Problem:</strong> Giving up after one month of overspending</p>
              <p class="text-sm"><strong>Solution:</strong> Expect a learning curve - budgeting is a skill that improves with practice</p>
            </div>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">✅ Remember:</h4>
            <p class="text-sm">A budget that's 80% followed is infinitely better than a perfect budget that's ignored!</p>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'lesson-summary',
      type: 'summary',
      title: 'Budgeting Mastery Summary',
      content: `
        <div class="space-y-4">
          <h2 class="text-xl font-bold">Excellent Work! You're Now a Budgeting Master!</h2>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">Key Takeaways:</h3>
            <ul class="space-y-2 text-sm">
              <li>✅ A budget is a plan that gives every dollar a purpose</li>
              <li>✅ The 50/30/20 rule provides a simple framework for beginners</li>
              <li>✅ Tracking income and expenses is essential for accurate budgeting</li>
              <li>✅ Budgeting apps can simplify the process and keep you motivated</li>
              <li>✅ Regular reviews and adjustments keep your budget realistic and effective</li>
              <li>✅ Progress over perfection - it's a skill that improves with practice</li>
            </ul>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">Next Up: Smart Saving Strategies</h4>
            <p class="text-sm">Now that you can budget, let's learn how to make your savings work harder through smart strategies and compound interest.</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Action Challenge</h4>
            <p class="text-sm">Create your first budget using the 50/30/20 rule! Track your spending for one week and see how close you come to your budgeted amounts.</p>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'envelope-budgeting-method',
      type: 'concept',
      title: 'The Envelope Budgeting Method',
      content: `
        <div class="space-y-4">
          <p>The envelope method is a simple, visual way to control spending by using physical or digital "envelopes" for each budget category.</p>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">📮 How It Works:</h3>
            <ol class="text-sm space-y-2 list-decimal list-inside">
              <li>Divide your after-tax income into budget categories</li>
              <li>Put cash in physical envelopes (or use app "envelopes")</li>
              <li>When an envelope is empty, you're done spending in that category</li>
              <li>No borrowing from other envelopes during the month</li>
            </ol>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Digital Envelope Apps:</h4>
            <ul class="text-sm space-y-1">
              <li>• <strong>Goodbudget:</strong> Digital envelope system</li>
              <li>• <strong>YNAB:</strong> "Give every dollar a job" method</li>
              <li>• <strong>Mvelopes:</strong> Automatic envelope funding</li>
              <li>• <strong>EveryDollar:</strong> Zero-based budgeting</li>
            </ul>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🎯 Best Categories for Envelopes:</h4>
            <ul class="text-sm space-y-1">
              <li>• Food/groceries • Entertainment • Clothing</li>
              <li>• Gas • Personal care • Gifts</li>
              <li>• Hobbies • Eating out • Miscellaneous</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'zero-based-budgeting',
      type: 'concept',
      title: 'Zero-Based Budgeting',
      content: `
        <div class="space-y-4">
          <p>Zero-based budgeting means every dollar has a specific purpose before you spend it. Income minus expenses should equal zero!</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🧮 The Formula:</h3>
            <div class="text-center text-lg font-bold bg-white p-3 rounded">
              Income - Expenses - Savings = $0
            </div>
            <p class="text-sm mt-2">If you have money left over, assign it to a category (more savings, paying off debt, or a specific goal).</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">✅ Benefits:</h4>
            <ul class="text-sm space-y-1">
              <li>• Every dollar has a purpose</li>
              <li>• Prevents mindless spending</li>
              <li>• Forces you to prioritize</li>
              <li>• Maximizes savings potential</li>
              <li>• Creates intentional spending habits</li>
            </ul>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">📝 Step-by-Step Process:</h4>
            <ol class="text-sm space-y-1 list-decimal list-inside">
              <li>List your monthly income</li>
              <li>List all fixed expenses (rent, insurance, etc.)</li>
              <li>Assign amounts to variable categories</li>
              <li>Allocate remaining money to savings/goals</li>
              <li>Adjust until income minus all assignments equals zero</li>
            </ol>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'budgeting-for-irregular-income',
      type: 'concept',
      title: 'Budgeting with Irregular Income',
      content: `
        <div class="space-y-4">
          <p>Many teens have irregular income from part-time jobs, gigs, or seasonal work. Here's how to budget when your income varies:</p>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">📊 Strategy #1: Use Your Lowest Month</h3>
            <p class="text-sm mb-2">Base your budget on the lowest amount you earn in a typical month.</p>
            <ul class="text-sm space-y-1">
              <li>• Ensures you can always meet your budget</li>
              <li>• Extra money in good months goes to savings</li>
              <li>• Creates a natural emergency buffer</li>
            </ul>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">📊 Strategy #2: Percentage-Based Budgeting</h3>
            <p class="text-sm mb-2">Instead of fixed dollar amounts, use percentages of whatever you earn.</p>
            <div class="bg-white p-3 rounded text-sm">
              <p><strong>Example:</strong> Earn $200 one month, $400 the next</p>
              <ul class="space-y-1">
                <li>• Month 1: 50% needs ($100), 30% wants ($60), 20% savings ($40)</li>
                <li>• Month 2: 50% needs ($200), 30% wants ($120), 20% savings ($80)</li>
              </ul>
            </div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Tips for Success:</h4>
            <ul class="text-sm space-y-1">
              <li>• Build a larger emergency fund (2-3 months expenses)</li>
              <li>• Track income patterns to predict slow periods</li>
              <li>• Have a list of expenses you can cut during lean months</li>
              <li>• Consider picking up extra work during busy seasons</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'budget-review-process',
      type: 'practice',
      title: 'Monthly Budget Review Process',
      content: `
        <div class="space-y-4">
          <p>Regular budget reviews help you stay on track and improve your financial habits. Here's your monthly checklist:</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">📋 Monthly Review Checklist:</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" class="rounded">
                Compare actual spending to budgeted amounts
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" class="rounded">
                Identify categories where you overspent
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" class="rounded">
                Look for categories where you underspent
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" class="rounded">
                Review and update financial goals
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" class="rounded">
                Adjust next month's budget based on learnings
              </label>
            </div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🔍 Key Questions to Ask:</h4>
            <ul class="text-sm space-y-1">
              <li>• What surprised me about my spending?</li>
              <li>• Which purchases brought me the most joy/value?</li>
              <li>• What would I do differently next month?</li>
              <li>• Am I making progress toward my goals?</li>
              <li>• Do any budget categories need adjustment?</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'behavioral-budgeting-tricks',
      type: 'concept',
      title: 'Psychological Budgeting Tricks',
      content: `
        <div class="space-y-4">
          <p>Use psychology to make budgeting easier and more successful with these proven behavioral techniques:</p>
          <div class="space-y-3">
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🧠 Trick #1: Pay Yourself First</h3>
              <p class="text-sm">Move money to savings immediately when you get paid, before any other spending.</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">⏰ Trick #2: The 24-Hour Rule</h3>
              <p class="text-sm">Wait 24 hours before making any non-essential purchase over $25.</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">💳 Trick #3: Use Cash for Discretionary Spending</h3>
              <p class="text-sm">Physical cash makes spending feel more "real" than card payments.</p>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🎯 Trick #4: Visual Progress Tracking</h3>
              <p class="text-sm">Use charts, apps, or jars to visually see your progress toward goals.</p>
            </div>
            <div class="bg-orange-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🏆 Trick #5: Reward Milestones</h3>
              <p class="text-sm">Celebrate budget successes with small, planned rewards that don't break your budget.</p>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'advanced-budgeting-strategies',
      type: 'concept',
      title: 'Advanced Budgeting Strategies',
      content: `
        <div class="space-y-4">
          <p>Once you've mastered basic budgeting, these advanced strategies can help optimize your financial management:</p>
          <div class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-blue-700">📊 Anti-Budget (Reverse Budgeting)</h3>
              <p class="text-sm mb-2">Focus only on savings goals, spend freely on everything else</p>
              <ul class="text-sm space-y-1">
                <li>• Set automatic savings transfers first</li>
                <li>• Spend remaining money however you want</li>
                <li>• Great for disciplined savers who hate detailed tracking</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-green-700">🎯 Priority-Based Budgeting</h3>
              <p class="text-sm mb-2">Rank all expenses by importance, fund in priority order</p>
              <ul class="text-sm space-y-1">
                <li>• List everything you want to spend money on</li>
                <li>• Rank from most to least important</li>
                <li>• Fund items in order until money runs out</li>
              </ul>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-purple-700">💰 Value-Based Budgeting</h3>
              <p class="text-sm mb-2">Align spending with your personal values and life goals</p>
              <ul class="text-sm space-y-1">
                <li>• Identify your top 3-5 life values</li>
                <li>• Spend generously on things that align with values</li>
                <li>• Cut ruthlessly on things that don't matter to you</li>
              </ul>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 4
    }
  ]
};

interface BudgetingMasteryMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const BudgetingMasteryMicroLesson: React.FC<BudgetingMasteryMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={budgetingMasteryData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};