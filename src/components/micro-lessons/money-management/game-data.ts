export interface ScenarioOption {
  text: string;
  impact?: string;
  feedback: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  options: ScenarioOption[];
}

export const ALL_SCENARIOS: Scenario[] = [
  {
    id: 'weekend-plans',
    title: 'Weekend Plans',
    description: "Friends want to go out for dinner. Your Wants envelope has enough money.",
    category: 'social',
    options: [
      {
        text: 'Fancy place ($38)',
        impact: 'wants: -38, balance: -38',
        feedback: "That was an expensive meal! While it was fun, this is a discretionary expense that hit your 'Wants' budget hard. Learning to budget for social events is key to staying on track."
      },
      {
        text: 'Suggest tacos ($14)',
        impact: 'wants: -14, balance: -14, score: 5',
        feedback: "You showed great financial discipline by suggesting a cheaper option. This is how you can enjoy time with friends while still being mindful of your budget."
      },
      {
        text: 'Host movie night ($8 snacks)',
        impact: 'wants: -8, balance: -8, score: 10',
        feedback: "Excellent choice! You found a way to have fun without overspending. Small, smart choices like this add up to big savings over time."
      },
      {
        text: 'Use credit card for fancy place ($38)',
        impact: 'creditCard: 38, credit: -3',
        feedback: "You used your credit card for the expensive meal. While convenient, remember that credit card debt accumulates interest. Plan to pay this off quickly to avoid fees."
      }
    ]
  },
  {
    id: 'new-phone-release',
    title: 'New Phone Release',
    description: "A new phone came out for $600. Your old phone works fine.",
    category: 'tech',
    options: [
      {
        text: 'Buy the new phone ($600)',
        impact: 'balance: -600, credit: -15',
        feedback: "This was a major impulse purchase. Buying something you don't need, especially at such a high cost, can seriously derail your financial goals and put you into debt."
      },
      {
        text: 'Finance with credit card ($600)',
        impact: 'creditCard: 600, credit: -20',
        feedback: "You put a $600 phone on credit. This is a significant debt that will accumulate interest quickly. At 18% APR, this could cost you much more than $600 if not paid off quickly."
      },
      {
        text: 'Wait for a price drop',
        impact: 'score: 10, savings: 25',
        feedback: "Patience pays off! Waiting for a price drop or a better deal is a great strategy to avoid overspending and make a smarter purchase later on."
      },
      {
        text: 'Stick with your current phone',
        impact: 'score: 15, savings: 50',
        feedback: "You made a very wise decision. By avoiding an unnecessary upgrade, you are building a habit of financial discipline that will serve you well in the future."
      }
    ]
  },
  {
    id: 'side-hustle-opportunity',
    title: 'Side Hustle Opportunity',
    description: "A neighbor offers you yard work. You can earn an extra $50.",
    category: 'income',
    options: [
      {
        text: 'Do the yard work',
        impact: 'income: 50',
        feedback: "Taking on a side job is a fantastic way to boost your income and build a strong work ethic. You've earned some extra cash to help you reach your goals!"
      },
      {
        text: 'Decline, you have plans',
        impact: 'score: -5',
        feedback: "While it's good to manage your time, you missed a chance to increase your income. Remember to look for opportunities to earn extra cash when you can."
      }
    ]
  },
  {
    id: 'unexpected-expense',
    title: 'Unexpected Expense',
    description: "Your laptop's screen suddenly cracks and you need to pay for repairs ($150).",
    category: 'emergency',
    options: [
      {
        text: 'Use your emergency fund ($150)',
        impact: 'emergency: -150, credit: 15',
        feedback: "This is exactly what an emergency fund is for! You avoided stress and debt by being prepared. Being able to handle unexpected costs is a sign of great financial health."
      },
      {
        text: 'Pay from your balance ($150)',
        impact: 'balance: -150',
        feedback: "You were able to pay for the repair, but it was an unplanned expense that reduced your cash balance. An emergency fund is meant for these situations to protect your main budget."
      },
      {
        text: 'Put it on credit card ($150)',
        impact: 'creditCard: 150, credit: -5',
        feedback: "You put the repair on your credit card. Remember to pay it off as soon as possible to avoid interest fees and to build a strong credit history."
      }
    ]
  },
  {
    id: 'clothing-sale',
    title: 'Clothing Store Sale',
    description: "There's a big sale at your favorite clothing store. You find a few items you like that cost $75.",
    category: 'shopping',
    options: [
      {
        text: 'Buy the clothes ($75)',
        impact: 'wants: -75, balance: -75',
        feedback: "This was a discretionary expense. While a sale is tempting, it's important to remember if this purchase aligns with your overall financial plan before you buy."
      },
      {
        text: 'Use credit card for clothes ($75)',
        impact: 'creditCard: 75, credit: -2',
        feedback: "You used your credit card for the sale. While you got the items, remember that credit card purchases accumulate interest if not paid off quickly."
      },
      {
        text: 'Walk away and don\'t buy anything',
        impact: 'savings: 25, score: 10',
        feedback: "You showed great financial discipline by walking away from a tempting sale. That money can be used for a more important financial goal, which is a great habit to build."
      }
    ]
  },
  {
    id: 'gaming-console',
    title: 'New Gaming Console',
    description: "A new gaming console just came out for $500. Your old one is still fine.",
    category: 'tech',
    options: [
      {
        text: 'Buy the new console ($500)',
        impact: 'wants: -500, credit: -15',
        feedback: "This was a major impulse purchase. Buying something you don't need, especially at such a high cost, can seriously derail your financial goals. It's crucial to consider if this purchase aligns with your long-term goals."
      },
      {
        text: 'Finance console with credit card ($500)',
        impact: 'creditCard: 500, credit: -18',
        feedback: "You put a $500 gaming console on credit. This is significant debt that will accumulate interest quickly. At 18% APR, this could cost you much more if not paid off promptly."
      },
      {
        text: 'Wait for a sale or price drop',
        impact: 'score: 10, savings: 50',
        feedback: "You showed incredible patience and discipline. Waiting for a price drop is a great strategy to save money on big purchases. That money can be used for a more important financial goal."
      }
    ]
  },
  {
    id: 'lawn-mowing',
    title: 'Mow Lawns',
    description: "Neighbors in your area need their lawns mowed. You can earn an extra $40.",
    category: 'income',
    options: [
      {
        text: 'Mow the lawns',
        impact: 'income: 40',
        feedback: "You found a great way to earn extra cash in your neighborhood. Every small bit of extra income helps you get closer to your financial goals."
      },
      {
        text: 'Decline, you\'re too busy',
        impact: 'score: -5',
        feedback: "You passed on a good opportunity to earn extra money. Remember that a side income can dramatically accelerate your savings."
      }
    ]
  },
  {
    id: 'phone-repair',
    title: 'Phone Repair',
    description: "You dropped your phone, and the screen is cracked. The repair costs $80.",
    category: 'emergency',
    options: [
      {
        text: 'Use your emergency fund ($80)',
        impact: 'emergency: -80, credit: 15',
        feedback: "You used your emergency fund to pay for the repair. This is a great example of being prepared and avoiding financial stress from an unexpected expense."
      },
      {
        text: 'Pay from your balance ($80)',
        impact: 'balance: -80',
        feedback: "You were able to pay for the repair, but it was an unplanned expense that reduced your cash balance. An emergency fund is a great way to prevent this."
      },
      {
        text: 'Pay with credit card ($80)',
        impact: 'creditCard: 80, credit: -5',
        feedback: "You put the repair on your credit card. Remember to pay it off as soon as possible to avoid interest fees and to build a strong credit history."
      }
    ]
  },
  {
    id: 'dinner-with-friends',
    title: 'Dinner with Friends',
    description: "Friends want to go out for a celebratory dinner. The cost is $30.",
    category: 'social',
    options: [
      {
        text: 'Go to the dinner ($30)',
        impact: 'wants: -30, balance: -30',
        feedback: "You used your wants budget to go out with friends. A good budget allows you to plan for fun things like this while still staying on track."
      },
      {
        text: 'Use credit card for dinner ($30)',
        impact: 'creditCard: 30, credit: -1',
        feedback: "You used your credit card for dinner with friends. While convenient, remember to pay this off quickly to avoid interest charges and maintain good credit habits."
      },
      {
        text: 'Suggest cooking dinner at home ($10)',
        impact: 'wants: -10, balance: -10, score: 5',
        feedback: "You found a cheaper way to have fun with your friends. This is a great example of being resourceful and sticking to your budget."
      }
    ]
  },
  {
    id: 'new-smartwatch',
    title: 'New Smartwatch',
    description: "A new smartwatch you've been eyeing costs $200. You don't have one now.",
    category: 'tech',
    options: [
      {
        text: 'Buy the watch ($200)',
        impact: 'wants: -200, balance: -200',
        feedback: "This was a discretionary purchase. While a smartwatch is nice, it's important to consider if this purchase aligns with your bigger financial goals before buying."
      },
      {
        text: 'Finance watch with credit card ($200)',
        impact: 'creditCard: 200, credit: -8',
        feedback: "You put the smartwatch on your credit card. This is a significant purchase that will accumulate interest if not paid off quickly. Consider if this was necessary."
      },
      {
        text: 'Wait for a sale',
        impact: 'score: 5, savings: 20',
        feedback: "You showed great patience. Waiting for a sale or a better deal is a fantastic way to save money and get what you want later."
      }
    ]
  },
  {
    id: 'tutoring-gig',
    title: 'Tutoring Gig',
    description: "A family friend needs a tutor for their younger child. You can earn an extra $60 for the week.",
    category: 'income',
    options: [
      {
        text: 'Take the tutoring gig',
        impact: 'income: 60',
        feedback: "Taking on a tutoring gig is a great way to leverage your skills to earn extra income. This is a smart way to get closer to your financial goals."
      },
      {
        text: 'Decline, you have other commitments',
        impact: 'score: -5',
        feedback: "You're prioritizing your time, which is important. But remember, a side hustle can help you reach your goals much faster."
      }
    ]
  },
  {
    id: 'unexpected-travel',
    title: 'Unexpected Travel',
    description: "A close relative is sick, and you need to pay for a last-minute train ticket home. The cost is $60.",
    category: 'emergency',
    options: [
      {
        text: 'Use your emergency fund ($60)',
        impact: 'emergency: -60, credit: 15',
        feedback: "This is exactly what your emergency fund is for. You were able to handle an unexpected, essential expense without disrupting your main budget, which is a great financial habit."
      },
      {
        text: 'Pay from your balance ($60)',
        impact: 'balance: -60',
        feedback: "You were able to pay for the trip, but it was an unplanned expense that reduced your cash balance. An emergency fund is meant for these situations to protect your main budget."
      },
      {
        text: 'Use credit card for travel ($60)',
        impact: 'creditCard: 60, credit: -2',
        feedback: "You used your credit card for the emergency travel. While necessary, try to pay this off quickly to avoid interest charges and maintain good financial habits."
      }
    ]
  },
  {
    id: 'concert-tickets',
    title: 'Concert Tickets',
    description: "Your favorite artist is performing locally. Tickets cost $85.",
    category: 'entertainment',
    options: [
      {
        text: 'Buy the tickets ($85)',
        impact: 'wants: -85, balance: -85',
        feedback: "You enjoyed the concert, but this was a significant entertainment expense. Make sure this fits within your wants budget and doesn't compromise other financial goals."
      },
      {
        text: 'Use credit card for tickets ($85)',
        impact: 'creditCard: 85, credit: -3',
        feedback: "You used your credit card for concert tickets. While you got to see your favorite artist, remember to pay this off quickly to avoid interest charges."
      },
      {
        text: 'Skip the concert',
        impact: 'score: 5, savings: 25',
        feedback: "It was hard to pass up, but you made a financially responsible choice. That money can now go toward a more important financial goal."
      },
      {
        text: 'Look for discounted tickets',
        impact: 'wants: -45, balance: -45, score: 10',
        feedback: "Great thinking! You found a way to enjoy the experience while being budget-conscious. Looking for deals is a smart financial habit."
      }
    ]
  },
  {
    id: 'car-maintenance',
    title: 'Car Maintenance',
    description: "Your car needs an oil change and basic maintenance. The cost is $75.",
    category: 'necessity',
    options: [
      {
        text: 'Get the maintenance done ($75)',
        impact: 'needs: -75, balance: -75, score: 5',
        feedback: "Good choice! Regular maintenance prevents bigger, more expensive problems later. This is a necessary expense that protects your investment."
      },
      {
        text: 'Use credit card for maintenance ($75)',
        impact: 'creditCard: 75, credit: -3',
        feedback: "You used your credit card for necessary car maintenance. While it's important to keep your car running, try to pay this off quickly to avoid interest charges."
      },
      {
        text: 'Wait until next month',
        impact: 'score: -10',
        feedback: "Delaying necessary maintenance can lead to more expensive repairs later. It's better to handle these expenses promptly to avoid bigger problems."
      }
    ]
  },
  {
    id: 'food-delivery',
    title: 'Food Delivery',
    description: "You're tired after a long day and considering ordering food delivery for $25.",
    category: 'convenience',
    options: [
      {
        text: 'Order delivery ($25)',
        impact: 'wants: -25, balance: -25',
        feedback: "Convenience comes with a cost. Occasional delivery is fine, but frequent ordering can add up quickly and impact your budget."
      },
      {
        text: 'Use credit card for delivery ($25)',
        impact: 'creditCard: 25, credit: -1',
        feedback: "You used your credit card for convenience food. While occasionally okay, frequent use of credit for non-essential purchases can add up quickly."
      },
      {
        text: 'Cook something simple at home ($8)',
        impact: 'needs: -8, balance: -8, score: 8',
        feedback: "You saved money and probably ate healthier too! Cooking at home is one of the best ways to stretch your food budget."
      }
    ]
  },
  {
    id: 'gym-membership',
    title: 'Gym Membership',
    description: "A local gym is offering a special membership deal for $45/month.",
    category: 'health',
    options: [
      {
        text: 'Sign up for the gym ($45)',
        impact: 'needs: -45, balance: -45, score: 5',
        feedback: "Investing in your health is important, but make sure you'll actually use the membership. Consider if there are cheaper alternatives like home workouts or outdoor activities."
      },
      {
        text: 'Try free outdoor activities',
        impact: 'score: 10, savings: 20',
        feedback: "Excellent choice! You found a way to stay healthy without the monthly expense. Walking, running, and bodyweight exercises can be just as effective."
      },
      {
        text: 'Use credit card for gym ($45)',
        impact: 'creditCard: 45, credit: -2',
        feedback: "You used your credit card for the gym membership. While investing in health is important, make sure you'll use it enough to justify the ongoing cost and interest if you carry a balance."
      },
      {
        text: 'Look for a cheaper alternative',
        impact: 'needs: -25, balance: -25, score: 8',
        feedback: "Smart shopping! You prioritized your health while being budget-conscious. Finding good deals on essential services is a valuable skill."
      }
    ]
  },
  {
    id: 'textbook-purchase',
    title: 'Textbook Purchase',
    description: "You need a textbook for class that costs $120 new, but you found a used copy for $45.",
    category: 'education',
    options: [
      {
        text: 'Buy the new textbook ($120)',
        impact: 'needs: -120, balance: -120',
        feedback: "The new book is nice, but you could have saved significantly. For textbooks that you'll only use for one semester, used copies are usually just as good."
      },
      {
        text: 'Buy the used textbook ($45)',
        impact: 'needs: -45, balance: -45, score: 15',
        feedback: "Excellent choice! You saved $75 without compromising your education. Used textbooks are a smart way to reduce education costs."
      },
      {
        text: 'Use credit card for new textbook ($120)',
        impact: 'creditCard: 120, credit: -5',
        feedback: "You put the expensive new textbook on credit. This is a significant expense for something you could have gotten used or borrowed. Try to pay this off quickly."
      },
      {
        text: 'Use credit card for used textbook ($45)',
        impact: 'creditCard: 45, credit: -2',
        feedback: "You used credit for the used textbook, which was the smarter choice than new. Still, try to pay this off quickly to avoid interest charges."
      },
      {
        text: 'Check if the library has a copy',
        impact: 'score: 20, savings: 30',
        feedback: "Brilliant! You found a way to access the material for free. Always explore free resources before making purchases - your future self will thank you."
      }
    ]
  },
  {
    id: 'streaming-service',
    title: 'Streaming Service',
    description: "A new streaming service launched with exclusive shows you want to watch. It costs $12/month.",
    category: 'entertainment',
    options: [
      {
        text: 'Subscribe to the service ($12)',
        impact: 'wants: -12, balance: -12',
        feedback: "Another monthly subscription can add up over time. Make sure you're getting good value and consider canceling other services you don't use much."
      },
      {
        text: 'Use credit card for subscription ($12)',
        impact: 'creditCard: 12, credit: -1',
        feedback: "You used credit for a monthly entertainment subscription. Remember that this will be a recurring charge, so make sure you can pay it off each month."
      },
      {
        text: 'Stick with current entertainment',
        impact: 'score: 8, savings: 12',
        feedback: "You showed great self-control. With so many subscription services available, it's important to be selective about which ones truly add value to your life."
      }
    ]
  },
  {
    id: 'birthday-gift',
    title: 'Birthday Gift',
    description: "Your best friend's birthday is coming up. You want to get them something special for around $50.",
    category: 'social',
    options: [
      {
        text: 'Buy an expensive gift ($50)',
        impact: 'wants: -50, balance: -50',
        feedback: "It's wonderful to show you care, but the most meaningful gifts aren't always the most expensive. Your friend will appreciate the thought regardless of the cost."
      },
      {
        text: 'Use credit card for expensive gift ($50)',
        impact: 'creditCard: 50, credit: -2',
        feedback: "You used your credit card for a generous gift. While it shows you care, consider if taking on debt for gifts aligns with your financial goals."
      },
      {
        text: 'Plan a fun, free activity together',
        impact: 'score: 15, savings: 20',
        feedback: "Experiences often matter more than things! Planning a special day together shows thoughtfulness and creates lasting memories without breaking your budget."
      }
    ]
  },
  {
    id: 'coffee-habit',
    title: 'Daily Coffee',
    description: "You've been buying coffee every morning for $4.50. That's $31.50 per week.",
    category: 'habit',
    options: [
      {
        text: 'Continue buying coffee ($31.50/week)',
        impact: 'wants: -31.50, balance: -31.50',
        feedback: "Daily coffee purchases can really add up - that's over $1,600 per year! Consider if this habit aligns with your financial goals."
      },
      {
        text: 'Use credit card for daily coffee ($31.50/week)',
        impact: 'creditCard: 31.50, credit: -2',
        feedback: "Using credit for daily expenses like coffee can quickly add up to significant debt. This habit could cost you much more with interest charges."
      },
      {
        text: 'Buy coffee 2-3 times per week ($15/week)',
        impact: 'wants: -15, balance: -15, score: 8',
        feedback: "A good compromise! You're still enjoying your coffee ritual but cutting costs significantly. Moderation is key to sustainable budgeting."
      }
    ]
  }
];