import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const creditDebtPlanningData: MicroLessonData = {
  id: 'credit-debt-planning',
  moduleTitle: 'Credit, Debt, and Future Planning',
  totalScreens: 10,
  screens: [
    {
      id: 'intro',
      type: 'content',
      title: 'Credit, Debt, and Your Financial Future',
      content: `
        <div class="space-y-4">
          <p class="text-lg">Understanding credit and debt is crucial for your financial future. Used wisely, credit can help you achieve goals. Used poorly, it can create years of financial stress. Let's learn how to use credit responsibly!</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">In This Final Lesson:</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>What credit is and how credit scores work</li>
              <li>Building good credit as a teenager</li>
              <li>Understanding different types of debt</li>
              <li>How to avoid common debt traps</li>
              <li>Planning for college and career expenses</li>
              <li>Setting long-term financial goals</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 2
    },
    {
      id: 'understanding-credit',
      type: 'content',
      title: 'Understanding Credit and Credit Scores',
      content: `
        <div class="space-y-4">
          <p>Credit is your reputation for paying back money you've borrowed. Your credit score is like a grade that shows how trustworthy you are with borrowed money.</p>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">💳 What Is Credit?</h3>
            <p class="text-sm mb-2">Credit is the ability to borrow money or get goods/services with the promise to pay later.</p>
            <ul class="text-sm space-y-1">
              <li>• <strong>Lender:</strong> Bank or company that loans money</li>
              <li>• <strong>Borrower:</strong> Person who receives the loan</li>
              <li>• <strong>Interest:</strong> Cost of borrowing money</li>
              <li>• <strong>Credit limit:</strong> Maximum amount you can borrow</li>
              <li>• <strong>Credit history:</strong> Record of how you've used credit</li>
            </ul>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">📊 Credit Score Ranges:</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center bg-red-100 p-2 rounded">
                <span class="text-sm font-medium">Poor (300-579)</span>
                <span class="text-sm">Hard to get approved</span>
              </div>
              <div class="flex justify-between items-center bg-orange-100 p-2 rounded">
                <span class="text-sm font-medium">Fair (580-669)</span>
                <span class="text-sm">Limited options, higher rates</span>
              </div>
              <div class="flex justify-between items-center bg-yellow-100 p-2 rounded">
                <span class="text-sm font-medium">Good (670-739)</span>
                <span class="text-sm">Decent rates and options</span>
              </div>
              <div class="flex justify-between items-center bg-blue-100 p-2 rounded">
                <span class="text-sm font-medium">Very Good (740-799)</span>
                <span class="text-sm">Great rates and benefits</span>
              </div>
              <div class="flex justify-between items-center bg-green-100 p-2 rounded">
                <span class="text-sm font-medium">Excellent (800-850)</span>
                <span class="text-sm">Best rates and perks</span>
              </div>
            </div>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🏗️ What Affects Your Credit Score:</h4>
            <ul class="text-sm space-y-1">
              <li>• <strong>Payment history (35%):</strong> Do you pay on time?</li>
              <li>• <strong>Credit utilization (30%):</strong> How much credit do you use?</li>
              <li>• <strong>Length of history (15%):</strong> How long have you had credit?</li>
              <li>• <strong>Types of credit (10%):</strong> Mix of credit cards, loans, etc.</li>
              <li>• <strong>New credit (10%):</strong> Recent applications and accounts</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'building-credit-teens',
      type: 'content',
      title: 'Building Credit as a Teen',
      content: `
        <div class="space-y-4">
          <p>Starting to build credit as a teenager gives you a huge advantage, but you need to be careful and responsible.</p>
          
          <div class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-blue-700">👨‍👩‍👧‍👦 Authorized User (Under 18)</h3>
              <p class="text-sm mb-2">Your parent adds you to their credit card account</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 class="font-medium text-green-600">Benefits:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Start building credit early</li>
                    <li>• No credit check required</li>
                    <li>• Benefit from parent's good history</li>
                    <li>• Learn responsible usage</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-red-600">Risks:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Affected by parent's bad habits</li>
                    <li>• Limited control</li>
                    <li>• May not build as much history</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-green-700">🎓 Student Credit Cards (18+)</h3>
              <p class="text-sm mb-2">Credit cards designed specifically for college students</p>
              <ul class="text-sm space-y-1 mb-2">
                <li>• Lower credit requirements</li>
                <li>• Often no annual fee</li>
                <li>• May offer student rewards</li>
                <li>• Typically lower credit limits</li>
              </ul>
              <p class="text-xs text-gray-600">Examples: Discover Student, Capital One Student cards</p>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-purple-700">🔒 Secured Credit Cards</h3>
              <p class="text-sm mb-2">You put down a deposit that becomes your credit limit</p>
              <ul class="text-sm space-y-1">
                <li>• Easier approval for beginners</li>
                <li>• Deposit acts as collateral</li>
                <li>• Builds credit like regular cards</li>
                <li>• Can graduate to unsecured cards</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">✅ Credit Building Best Practices:</h4>
            <ul class="text-sm space-y-1">
              <li>• Always pay your full balance on time</li>
              <li>• Keep utilization under 30% (preferably under 10%)</li>
              <li>• Don't close your oldest credit card</li>
              <li>• Only apply for credit when you need it</li>
              <li>• Check your credit report regularly (free at annualcreditreport.com)</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'types-of-debt',
      type: 'content',
      title: 'Understanding Different Types of Debt',
      content: `
        <div class="space-y-4">
          <p>Not all debt is created equal. Some debt can help you build wealth, while other debt can destroy it.</p>
          
          <div class="space-y-4">
            <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h3 class="font-semibold mb-2 text-green-700">✅ "Good" Debt</h3>
              <p class="text-sm mb-2">Debt that helps you build wealth or improve your earning potential</p>
              <div class="space-y-2">
                <div>
                  <h4 class="font-medium">🏠 Mortgage (Home Loan)</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Helps you own appreciating real estate</li>
                    <li>• Tax benefits available</li>
                    <li>• Typically low interest rates</li>
                    <li>• Fixed monthly payments</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium">🎓 Student Loans</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Investment in your earning potential</li>
                    <li>• Lower interest rates than credit cards</li>
                    <li>• Tax deductions available</li>
                    <li>• Flexible repayment options</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h3 class="font-semibold mb-2 text-red-700">❌ "Bad" Debt</h3>
              <p class="text-sm mb-2">Debt used to buy things that lose value or don't improve your finances</p>
              <div class="space-y-2">
                <div>
                  <h4 class="font-medium">💳 Credit Card Debt</h4>
                  <ul class="text-sm space-y-1">
                    <li>• High interest rates (15-25%+)</li>
                    <li>• Used for consumption, not investment</li>
                    <li>• Minimum payments mostly go to interest</li>
                    <li>• Can spiral out of control quickly</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium">🚗 Auto Loans (Sometimes)</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Cars depreciate rapidly</li>
                    <li>• Can be necessary for work/school</li>
                    <li>• Buy used to minimize depreciation</li>
                    <li>• Keep loan terms short</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🎯 Smart Debt Rules:</h4>
            <ul class="text-sm space-y-1">
              <li>• Avoid high-interest debt for wants</li>
              <li>• Pay off bad debt before investing</li>
              <li>• Consider the total cost, not just monthly payments</li>
              <li>• Have a plan to pay off debt quickly</li>
              <li>• Don't borrow more than you can afford to repay</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'avoiding-debt-traps',
      type: 'content',
      title: 'Avoiding Common Debt Traps',
      content: `
        <div class="space-y-4">
          <p>Many people fall into debt traps that can take years to escape. Learn to recognize and avoid these common pitfalls:</p>
          
          <div class="space-y-3">
            <div class="bg-red-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-red-700">🪤 Trap #1: Minimum Payment Mentality</h3>
              <p class="text-sm mb-1"><strong>The Problem:</strong> Only paying minimum amounts on credit cards</p>
              <div class="bg-white p-3 rounded text-sm">
                <p class="mb-1"><strong>Example:</strong> $2,000 balance at 20% APR</p>
                <ul class="space-y-1">
                  <li>• Minimum payment (~$40): Takes 94 months, costs $1,780 in interest</li>
                  <li>• $100 payment: Takes 24 months, costs $364 in interest</li>
                </ul>
              </div>
              <p class="text-sm mt-2"><strong>Solution:</strong> Always pay more than the minimum, preferably full balance</p>
            </div>
            
            <div class="bg-orange-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-orange-700">🪤 Trap #2: Lifestyle Inflation</h3>
              <p class="text-sm mb-1"><strong>The Problem:</strong> Increasing spending whenever income increases</p>
              <p class="text-sm mb-1">You get a raise or better job, but instead of saving more, you buy more expensive things.</p>
              <p class="text-sm mt-2"><strong>Solution:</strong> Increase savings rate with income, keep lifestyle stable</p>
            </div>
            
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-yellow-700">🪤 Trap #3: Payday Loans & Cash Advances</h3>
              <p class="text-sm mb-1"><strong>The Problem:</strong> Extremely high fees disguised as short-term solutions</p>
              <ul class="text-sm space-y-1">
                <li>• Payday loans: 400%+ annual interest rates</li>
                <li>• Cash advances: High fees plus immediate interest</li>
                <li>• Create cycle of borrowing to pay previous loans</li>
              </ul>
              <p class="text-sm mt-2"><strong>Solution:</strong> Build emergency fund, avoid these products entirely</p>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-purple-700">🪤 Trap #4: Keeping Up with Others</h3>
              <p class="text-sm mb-1"><strong>The Problem:</strong> Spending money to match friends' or social media lifestyles</p>
              <p class="text-sm mb-1">Using credit to buy things you can't afford to "fit in" or look successful.</p>
              <p class="text-sm mt-2"><strong>Solution:</strong> Focus on your own goals, remember social media isn't reality</p>
            </div>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">🛡️ Debt Trap Prevention:</h4>
            <ul class="text-sm space-y-1">
              <li>• Build an emergency fund before taking on debt</li>
              <li>• Understand total costs before borrowing</li>
              <li>• Have a specific payoff plan</li>
              <li>• Don't use credit for regular expenses</li>
              <li>• Live below your means, not at your credit limit</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'college-planning',
      type: 'content',
      title: 'Planning for College Expenses',
      content: `
        <div class="space-y-4">
          <p>College is expensive, but proper planning can help you minimize debt and maximize your investment in education.</p>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">💰 Understanding College Costs:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium mb-2">🏫 Direct Costs</h4>
                <ul class="text-sm space-y-1">
                  <li>• Tuition and fees</li>
                  <li>• Room and board</li>
                  <li>• Books and supplies</li>
                  <li>• Technology fees</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-2">🎯 Indirect Costs</h4>
                <ul class="text-sm space-y-1">
                  <li>• Transportation</li>
                  <li>• Personal expenses</li>
                  <li>• Entertainment</li>
                  <li>• Opportunity cost (lost wages)</li>
                </ul>
              </div>
            </div>
            <p class="text-sm mt-2"><strong>Average annual cost:</strong> Public in-state: $10k, Private: $35k+</p>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">💡 Smart College Financing Strategies:</h3>
            <div class="space-y-2">
              <div>
                <h4 class="font-medium">1. 📚 Academic Scholarships</h4>
                <p class="text-sm">Focus on grades, test scores, and extracurriculars</p>
              </div>
              <div>
                <h4 class="font-medium">2. 🏘️ Start at Community College</h4>
                <p class="text-sm">Complete general education requirements for less money</p>
              </div>
              <div>
                <h4 class="font-medium">3. 🏠 Live at Home Initially</h4>
                <p class="text-sm">Save thousands on room and board costs</p>
              </div>
              <div>
                <h4 class="font-medium">4. 💼 Work During School</h4>
                <p class="text-sm">Part-time job or work-study programs</p>
              </div>
              <div>
                <h4 class="font-medium">5. 🎯 Choose Wisely</h4>
                <p class="text-sm">Consider return on investment for your major</p>
              </div>
            </div>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">📋 Student Loan Tips:</h3>
            <ul class="text-sm space-y-1">
              <li>• Exhaust scholarships and grants first</li>
              <li>• Federal loans usually better than private</li>
              <li>• Borrow only what you truly need</li>
              <li>• Understand interest rates and repayment terms</li>
              <li>• Consider income-driven repayment plans</li>
              <li>• Make payments on interest during school if possible</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'career-financial-planning',
      type: 'content',
      title: 'Career and Financial Planning',
      content: `
        <div class="space-y-4">
          <p>Your career choices will significantly impact your financial future. Let's explore how to make smart decisions:</p>
          
          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">💼 Career Considerations:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium mb-2">💰 Financial Factors</h4>
                <ul class="text-sm space-y-1">
                  <li>• Starting salary expectations</li>
                  <li>• Long-term earning potential</li>
                  <li>• Job market stability</li>
                  <li>• Benefits packages</li>
                  <li>• Geographic flexibility</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-2">❤️ Personal Factors</h4>
                <ul class="text-sm space-y-1">
                  <li>• Your interests and passions</li>
                  <li>• Work-life balance preferences</li>
                  <li>• Skills and natural talents</li>
                  <li>• Values and purpose</li>
                  <li>• Lifestyle goals</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🎯 Early Career Financial Moves:</h3>
            <ol class="text-sm space-y-2 list-decimal list-inside">
              <li><strong>Emergency Fund:</strong> Build 3-6 months of expenses</li>
              <li><strong>Employer 401(k) Match:</strong> Always get the full match (free money!)</li>
              <li><strong>High-Interest Debt:</strong> Pay off credit cards and loans</li>
              <li><strong>Roth IRA:</strong> Start retirement savings in tax-advantaged accounts</li>
              <li><strong>Skill Development:</strong> Invest in learning and certifications</li>
              <li><strong>Network Building:</strong> Relationships are valuable career assets</li>
            </ol>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">💡 Smart Money Moves in Your 20s:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <h4 class="font-medium">🏠 Housing</h4>
                <ul class="text-sm space-y-1">
                  <li>• Keep rent under 30% of income</li>
                  <li>• Consider roommates to save money</li>
                  <li>• Don't rush into home buying</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium">🚗 Transportation</h4>
                <ul class="text-sm space-y-1">
                  <li>• Buy reliable used cars</li>
                  <li>• Avoid expensive car payments</li>
                  <li>• Consider alternatives (public transit, bike)</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-orange-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">📈 Income Growth Strategies:</h4>
            <ul class="text-sm space-y-1">
              <li>• Negotiate salary increases annually</li>
              <li>• Develop high-value skills</li>
              <li>• Consider side hustles for extra income</li>
              <li>• Change jobs strategically for better pay</li>
              <li>• Ask for promotions and additional responsibilities</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'long-term-goals',
      type: 'interactive',
      title: 'Setting Long-Term Financial Goals',
      content: `
        <div class="space-y-4">
          <p>Long-term financial goals give you direction and motivation. Let's explore major financial milestones and how to plan for them:</p>
          
          <div class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-3">🎯 Common Long-Term Goals by Life Stage:</h3>
              
              <div class="space-y-3">
                <div class="bg-white p-3 rounded">
                  <h4 class="font-medium mb-2">Teens (16-18)</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Build first $1,000 emergency fund</li>
                    <li>• Save for car down payment</li>
                    <li>• Start college savings</li>
                    <li>• Begin building credit responsibly</li>
                  </ul>
                </div>
                
                <div class="bg-white p-3 rounded">
                  <h4 class="font-medium mb-2">Early 20s</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Complete education with minimal debt</li>
                    <li>• Build 6-month emergency fund</li>
                    <li>• Start retirement savings (even $50/month)</li>
                    <li>• Build excellent credit score (750+)</li>
                  </ul>
                </div>
                
                <div class="bg-white p-3 rounded">
                  <h4 class="font-medium mb-2">Late 20s/Early 30s</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Save for house down payment (20%)</li>
                    <li>• Maximize retirement contributions</li>
                    <li>• Build investment portfolio</li>
                    <li>• Consider life insurance needs</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-3">💰 Major Purchase Planning:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium mb-2">🚗 Car ($15,000)</h4>
                  <p class="text-sm">Save $200/month = 6 years</p>
                  <p class="text-xs text-gray-600">Or work toward $3,000 down payment</p>
                </div>
                <div>
                  <h4 class="font-medium mb-2">🏠 House Down Payment ($60,000)</h4>
                  <p class="text-sm">Save $500/month = 10 years</p>
                  <p class="text-xs text-gray-600">20% down on $300,000 home</p>
                </div>
              </div>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-3">🗺️ Creating Your Financial Roadmap:</h3>
              <ol class="text-sm space-y-2 list-decimal list-inside">
                <li><strong>Dream big:</strong> What lifestyle do you want?</li>
                <li><strong>Set specific goals:</strong> Make them SMART (like we learned in budgeting)</li>
                <li><strong>Break them down:</strong> What needs to happen each year/month?</li>
                <li><strong>Start small:</strong> Take the first step today</li>
                <li><strong>Review regularly:</strong> Adjust as life changes</li>
                <li><strong>Celebrate milestones:</strong> Acknowledge progress</li>
              </ol>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'putting-it-together',
      type: 'interactive',
      title: 'Your Personal Action Plan',
      content: `
        <div class="space-y-4">
          <p>Let's create a personalized action plan based on everything you've learned in this course:</p>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🚀 Your Next 30 Days:</h3>
            <div class="space-y-2">
              <div class="flex items-start gap-3">
                <span class="font-bold text-blue-600">□</span>
                <span class="text-sm">Apply the THINK method to one purchase decision</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="font-bold text-blue-600">□</span>
                <span class="text-sm">Research and open a high-yield savings account</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="font-bold text-blue-600">□</span>
                <span class="text-sm">Create your first budget using the 50/30/20 rule</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="font-bold text-blue-600">□</span>
                <span class="text-sm">Set up one automatic savings transfer</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="font-bold text-blue-600">□</span>
                <span class="text-sm">Talk to parents about becoming an authorized user or opening a custodial investment account</span>
              </div>
            </div>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">📅 Your Next 6 Months:</h3>
            <div class="space-y-2">
              <div class="flex items-start gap-3">
                <span class="font-bold text-green-600">□</span>
                <span class="text-sm">Build $500 starter emergency fund</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="font-bold text-green-600">□</span>
                <span class="text-sm">Track expenses and refine your budget monthly</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="font-bold text-green-600">□</span>
                <span class="text-sm">Research college costs and financial aid options</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="font-bold text-green-600">□</span>
                <span class="text-sm">Start building credit responsibly</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="font-bold text-green-600">□</span>
                <span class="text-sm">Set one SMART financial goal and work toward it</span>
              </div>
            </div>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🎯 Your Financial Foundation:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium mb-2">Essential Habits</h4>
                <ul class="text-sm space-y-1">
                  <li>• Monthly budget reviews</li>
                  <li>• Automatic savings</li>
                  <li>• Smart spending decisions</li>
                  <li>• Continuous learning</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-2">Key Accounts</h4>
                <ul class="text-sm space-y-1">
                  <li>• High-yield savings account</li>
                  <li>• Credit card (used responsibly)</li>
                  <li>• Investment account (when ready)</li>
                  <li>• Emergency fund</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Remember:</h4>
            <p class="text-sm">Financial success isn't about being perfect - it's about making consistent, smart choices over time. Start where you are, use what you have, do what you can!</p>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'course-summary',
      type: 'content',
      title: 'Course Complete! Your Financial Journey Begins',
      content: `
        <div class="space-y-4">
          <h2 class="text-xl font-bold">🎉 Congratulations! You've Completed Money Management for Teens!</h2>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🏆 What You've Accomplished:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium mb-2">Knowledge Gained:</h4>
                <ul class="text-sm space-y-1">
                  <li>✅ Financial foundations and smart spending</li>
                  <li>✅ Banking and account management</li>
                  <li>✅ Budgeting and expense tracking</li>
                  <li>✅ Saving strategies and compound interest</li>
                  <li>✅ Investment basics and long-term thinking</li>
                  <li>✅ Credit building and debt management</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-2">Skills Developed:</h4>
                <ul class="text-sm space-y-1">
                  <li>✅ Decision-making with the THINK method</li>
                  <li>✅ Budget creation using 50/30/20 rule</li>
                  <li>✅ Goal setting with SMART framework</li>
                  <li>✅ Risk assessment and planning</li>
                  <li>✅ Long-term financial planning</li>
                  <li>✅ Critical thinking about money choices</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🚀 Your Competitive Advantages:</h3>
            <ul class="text-sm space-y-2">
              <li>• <strong>Time:</strong> You have decades for compound growth to work its magic</li>
              <li>• <strong>Knowledge:</strong> You understand financial concepts most adults never learned</li>
              <li>• <strong>Habits:</strong> You can build good habits before bad ones take root</li>
              <li>• <strong>Mindset:</strong> You think long-term while others focus on instant gratification</li>
              <li>• <strong>Preparation:</strong> You're ready for financial opportunities and challenges</li>
            </ul>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">📚 Continue Learning:</h3>
            <p class="text-sm mb-2">Financial education is a lifelong journey. Here's how to keep growing:</p>
            <ul class="text-sm space-y-1">
              <li>• Read financial books and blogs</li>
              <li>• Listen to personal finance podcasts</li>
              <li>• Follow reputable financial educators</li>
              <li>• Practice what you've learned consistently</li>
              <li>• Share knowledge with friends and family</li>
              <li>• Stay curious and ask questions</li>
            </ul>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🎯 Your Financial Future:</h3>
            <p class="text-sm mb-2">By applying what you've learned, you're setting yourself up for:</p>
            <ul class="text-sm space-y-1">
              <li>• Financial independence and security</li>
              <li>• The ability to pursue your dreams without money stress</li>
              <li>• Opportunities to help others and make a positive impact</li>
              <li>• Confidence in making major financial decisions</li>
              <li>• A lifetime of smart money management</li>
            </ul>
          </div>
          
          <div class="bg-green-100 p-4 rounded-lg border-2 border-green-400">
            <h3 class="font-bold mb-2 text-green-800">🌟 Final Message:</h3>
            <p class="text-sm font-medium">You now have the knowledge and tools to build a secure financial future. Remember: small, consistent actions compound into extraordinary results. Your future self will thank you for starting this journey today. Go forth and make smart money decisions!</p>
          </div>
        </div>
      `,
      estimatedTime: 4
    }
  ]
};

interface CreditDebtPlanningMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const CreditDebtPlanningMicroLesson: React.FC<CreditDebtPlanningMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={creditDebtPlanningData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};