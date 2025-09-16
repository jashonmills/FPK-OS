import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import type { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

const bankingAccountsData: MicroLessonData = {
  id: 'banking-accounts',
  moduleTitle: 'Banking and Accounts',
  totalScreens: 9,
  screens: [
    {
      id: 'intro',
      type: 'content',
      title: 'Introduction to Banking',
      content: `
        <div class="space-y-4">
          <p class="text-lg">Banks are financial institutions that help you manage, protect, and grow your money. Understanding how they work is essential for financial success.</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">In This Lesson You'll Learn:</h3>
            <ul class="list-disc list-inside space-y-1">
              <li>What banks do and why they're important</li>
              <li>Different types of bank accounts</li>
              <li>How to choose the right bank</li>
              <li>ATM and online banking safety</li>
              <li>Understanding fees and how to avoid them</li>
            </ul>
          </div>
        </div>
      `,
      estimatedTime: 2
    },
    {
      id: 'what-banks-do',
      type: 'content',
      title: 'What Do Banks Do?',
      content: `
        <div class="space-y-4">
          <p>Banks provide many services that make managing money easier and safer:</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🏦 Core Services:</h3>
              <ul class="space-y-2 text-sm">
                <li>• Store your money safely</li>
                <li>• Provide debit cards for purchases</li>
                <li>• Offer checking and savings accounts</li>
                <li>• Process electronic payments</li>
                <li>• Provide ATM access</li>
              </ul>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🛡️ Protection Benefits:</h3>
              <ul class="space-y-2 text-sm">
                <li>• FDIC insurance (up to $250,000)</li>
                <li>• Fraud protection</li>
                <li>• Secure online banking</li>
                <li>• Transaction monitoring</li>
                <li>• Customer support</li>
              </ul>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <p class="text-sm"><strong>Why use a bank?</strong> It's much safer than keeping cash at home, and you can access your money 24/7 through ATMs and online banking.</p>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'account-types',
      type: 'content',
      title: 'Types of Bank Accounts',
      content: `
        <div class="space-y-4">
          <p>Different accounts serve different purposes. Let's explore the main types:</p>
          <div class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h3 class="font-semibold mb-2 text-blue-700">💳 Checking Account</h3>
              <p class="text-sm mb-2">For everyday spending and bill paying</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 class="font-medium text-green-600">Pros:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Easy access to money</li>
                    <li>• Debit card included</li>
                    <li>• Online bill pay</li>
                    <li>• No withdrawal limits</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-red-600">Cons:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Usually earns no interest</li>
                    <li>• May have monthly fees</li>
                    <li>• Overdraft fees possible</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h3 class="font-semibold mb-2 text-green-700">🐷 Savings Account</h3>
              <p class="text-sm mb-2">For saving money and earning interest</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 class="font-medium text-green-600">Pros:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Earns interest on your money</li>
                    <li>• Encourages saving habits</li>
                    <li>• FDIC insured</li>
                    <li>• Separate from spending money</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-red-600">Cons:</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Limited withdrawals per month</li>
                    <li>• Lower interest rates currently</li>
                    <li>• May require minimum balance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'teen-account-options',
      type: 'content',
      title: 'Banking Options for Teens',
      content: `
        <div class="space-y-4">
          <p>As a teenager, you have several banking options depending on your age and needs:</p>
          <div class="space-y-4">
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">👨‍👩‍👧‍👦 Joint Account (Under 18)</h3>
              <ul class="text-sm space-y-1 mb-2">
                <li>• Shared with parent or guardian</li>
                <li>• Adult co-signer required</li>
                <li>• Parent can monitor transactions</li>
                <li>• Good for learning responsibility</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🎓 Student Account (18+)</h3>
              <ul class="text-sm space-y-1 mb-2">
                <li>• Your own independent account</li>
                <li>• Often have lower or no fees</li>
                <li>• May offer student benefits</li>
                <li>• Build your banking history</li>
              </ul>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">📱 Digital Banking</h3>
              <ul class="text-sm space-y-1 mb-2">
                <li>• Online-only banks (like Ally, Marcus)</li>
                <li>• Higher interest rates</li>
                <li>• Lower fees</li>
                <li>• Great mobile apps</li>
                <li>• Limited physical locations</li>
              </ul>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'choosing-a-bank',
      type: 'content',
      title: 'How to Choose the Right Bank',
      content: `
        <div class="space-y-4">
          <p>Not all banks are the same. Here's what to look for when choosing:</p>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">🔍 Key Factors to Consider:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div>
                  <h4 class="font-medium">💰 Fees</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Monthly maintenance fees</li>
                    <li>• ATM fees</li>
                    <li>• Overdraft fees</li>
                    <li>• Minimum balance requirements</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium">📍 Convenience</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Branch locations near you</li>
                    <li>• ATM network size</li>
                    <li>• Online banking features</li>
                    <li>• Mobile app quality</li>
                  </ul>
                </div>
              </div>
              <div class="space-y-3">
                <div>
                  <h4 class="font-medium">💵 Interest Rates</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Savings account APY</li>
                    <li>• CD rates (if planning ahead)</li>
                    <li>• Money market rates</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium">🎯 Special Features</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Student account benefits</li>
                    <li>• Financial education resources</li>
                    <li>• Budgeting tools</li>
                    <li>• Customer service quality</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'atm-safety',
      type: 'content',
      title: 'ATM Safety and Best Practices',
      content: `
        <div class="space-y-4">
          <p>ATMs are convenient but require caution. Follow these safety guidelines:</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-red-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-red-700">🚨 Safety First:</h3>
              <ul class="text-sm space-y-1">
                <li>• Use ATMs in well-lit, busy areas</li>
                <li>• Cover your PIN when entering it</li>
                <li>• Look for anything unusual on the ATM</li>
                <li>• Don't count money in public</li>
                <li>• Keep your receipt or dispose of it safely</li>
                <li>• Be aware of your surroundings</li>
              </ul>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2 text-blue-700">💡 Smart Tips:</h3>
              <ul class="text-sm space-y-1">
                <li>• Use your bank's ATMs to avoid fees</li>
                <li>• Check your account regularly</li>
                <li>• Report lost cards immediately</li>
                <li>• Never share your PIN with anyone</li>
                <li>• Memorize your PIN (don't write it down)</li>
                <li>• Set up account alerts</li>
              </ul>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">⚠️ Red Flags at ATMs</h4>
            <p class="text-sm">If you see loose, damaged, or unusual-looking parts on an ATM, don't use it. These could be skimming devices used to steal card information.</p>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'online-banking',
      type: 'content',
      title: 'Online Banking Security',
      content: `
        <div class="space-y-4">
          <p>Online banking is convenient and secure when you follow proper safety practices:</p>
          <div class="space-y-4">
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">✅ Best Practices:</h3>
              <ul class="text-sm space-y-1">
                <li>• Always log in from your bank's official website</li>
                <li>• Use strong, unique passwords</li>
                <li>• Enable two-factor authentication if available</li>
                <li>• Log out completely when finished</li>
                <li>• Never bank on public Wi-Fi</li>
                <li>• Keep your devices updated</li>
              </ul>
            </div>
            
            <div class="bg-red-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🚫 Never Do This:</h3>
              <ul class="text-sm space-y-1">
                <li>• Click links in emails claiming to be from your bank</li>
                <li>• Share login information with anyone</li>
                <li>• Bank from shared computers</li>
                <li>• Ignore security alerts</li>
                <li>• Save passwords on public computers</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">📱 Mobile Banking Tips</h4>
              <ul class="text-sm space-y-1">
                <li>• Download apps only from official app stores</li>
                <li>• Use biometric locks (fingerprint/face ID)</li>
                <li>• Set up account notifications</li>
                <li>• Log out after each session</li>
              </ul>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 4
    },
    {
      id: 'understanding-fees',
      type: 'content',
      title: 'Understanding and Avoiding Bank Fees',
      content: `
        <div class="space-y-4">
          <p>Banks charge various fees, but many can be avoided with smart banking habits:</p>
          <div class="space-y-3">
            <div class="bg-red-50 p-3 rounded-lg">
              <h4 class="font-medium mb-2">💸 Common Fees to Watch Out For:</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Monthly Maintenance Fee:</strong> $5-15/month
                  <br><em>How to avoid:</em> Maintain minimum balance or use direct deposit
                </div>
                <div>
                  <strong>Overdraft Fee:</strong> $25-35 per incident
                  <br><em>How to avoid:</em> Monitor balance, set up alerts
                </div>
                <div>
                  <strong>ATM Fee:</strong> $2-5 per transaction
                  <br><em>How to avoid:</em> Use your bank's ATMs
                </div>
                <div>
                  <strong>Paper Statement Fee:</strong> $1-5/month
                  <br><em>How to avoid:</em> Use electronic statements
                </div>
              </div>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">💡 Fee-Avoidance Strategies:</h4>
              <ul class="text-sm space-y-1">
                <li>• Choose accounts with no monthly fees</li>
                <li>• Set up low balance alerts</li>
                <li>• Link savings to checking for overdraft protection</li>
                <li>• Opt out of overdraft "courtesy" programs</li>
                <li>• Read all account disclosures carefully</li>
              </ul>
            </div>
          </div>
        </div>
      `,
      estimatedTime: 3
    },
    {
      id: 'lesson-summary',
      type: 'content',
      title: 'Banking Lesson Summary',
      content: `
        <div class="space-y-4">
          <h2 class="text-xl font-bold">Great Job! You've Mastered Banking Basics!</h2>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-3">Key Takeaways:</h3>
            <ul class="space-y-2 text-sm">
              <li>✅ Banks provide safe storage and convenient access to your money</li>
              <li>✅ Checking accounts are for everyday spending, savings for goals</li>
              <li>✅ Teen accounts often have special benefits and lower fees</li>
              <li>✅ ATM and online banking safety protect your money and identity</li>
              <li>✅ Understanding fees helps you choose the right bank and avoid charges</li>
            </ul>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">Next Up: Budgeting Mastery</h4>
            <p class="text-sm">In our next lesson, you'll learn how to create and maintain a budget that works for your lifestyle and goals.</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">💡 Action Challenge</h4>
            <p class="text-sm">Research 2-3 banks in your area or online. Compare their teen account offerings, fees, and features. Which would be the best choice for you?</p>
          </div>
        </div>
      `,
      estimatedTime: 3
    }
  ]
};

interface BankingAccountsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const BankingAccountsMicroLesson: React.FC<BankingAccountsMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={bankingAccountsData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};