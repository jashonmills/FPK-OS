import React from 'react';
import { Lightbulb, MessageSquare, Shield, Trophy } from 'lucide-react';

export const strengthsSelfAdvocacyMicroLessons = {
  id: 'strengths-self-advocacy',
  moduleTitle: 'Turning Weaknesses into Strengths & Self-Advocacy',
  totalScreens: 6,
  screens: [
    {
      id: 'intro',
      type: 'concept' as const,
      title: 'Reframing Your Narrative',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Lightbulb className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your Challenges Are Your Superpowers</h2>
            <p className="text-lg text-muted-foreground">
              What others see as weaknesses, successful neurodiverse people see as competitive advantages.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">The Reframing Process</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-red-700 dark:text-red-300">❌ Old Story</h4>
                <ul className="text-sm space-y-1">
                  <li>"I can't focus"</li>
                  <li>"I'm disorganized"</li>
                  <li>"I think too differently"</li>
                  <li>"I need too much help"</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">✅ New Story</h4>
                <ul className="text-sm space-y-1">
                  <li>"I have selective attention"</li>
                  <li>"I think creatively"</li>
                  <li>"I bring unique perspectives"</li>
                  <li>"I know how to get support"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'strength-identification',
      type: 'practice' as const,
      title: 'Identifying Your Hidden Strengths',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Strength Discovery Exercise</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">Common Neurodivergent Superpowers</h4>
            
            <div className="grid gap-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h5 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Hyperfocus → Deep Work Mastery</h5>
                <p className="text-sm">When interested, you can work with intensity and focus that others envy.</p>
                <p className="text-xs text-muted-foreground mt-1"><strong>Career advantage:</strong> Research, programming, artistic work</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-semibold mb-2 text-green-700 dark:text-green-300">Pattern Recognition → Innovation</h5>
                <p className="text-sm">You see connections and patterns others miss, leading to creative solutions.</p>
                <p className="text-xs text-muted-foreground mt-1"><strong>Career advantage:</strong> Data analysis, design, strategic planning</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h5 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">Systems Thinking → Big Picture Vision</h5>
                <p className="text-sm">You naturally understand how parts relate to wholes and see systemic issues.</p>
                <p className="text-xs text-muted-foreground mt-1"><strong>Career advantage:</strong> Management, consulting, architecture</p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <h5 className="font-semibold mb-2 text-orange-700 dark:text-orange-300">Nonlinear Thinking → Creative Problem-Solving</h5>
                <p className="text-sm">Your brain makes unexpected connections that lead to breakthrough solutions.</p>
                <p className="text-xs text-muted-foreground mt-1"><strong>Career advantage:</strong> Entrepreneurship, marketing, invention</p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">Personal Strength Inventory</h5>
            <p className="text-sm">Think of a time when you solved a problem in an unusual way. What strengths did you use?</p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'challenge-reframing',
      type: 'practice' as const,
      title: 'The Challenge Reframe Workshop',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Transform Your Challenges</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">Step-by-Step Reframing Process</h4>
            
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Step 1: Identify the Challenge</h5>
                <p className="text-sm">What specific behavior or trait do you or others see as problematic?</p>
                <div className="bg-white dark:bg-gray-800 p-2 rounded mt-2 text-xs italic">
                  Example: "I get distracted easily during lectures"
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Step 2: Find the Hidden Function</h5>
                <p className="text-sm">What positive purpose might this behavior serve?</p>
                <div className="bg-white dark:bg-gray-800 p-2 rounded mt-2 text-xs italic">
                  Example: "My brain is scanning for more interesting or relevant information"
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Step 3: Identify When It's Helpful</h5>
                <p className="text-sm">In what situations is this trait actually an advantage?</p>
                <div className="bg-white dark:bg-gray-800 p-2 rounded mt-2 text-xs italic">
                  Example: "During research, I notice connections others miss because I'm not tunnel-visioned"
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Step 4: Create Your New Narrative</h5>
                <p className="text-sm">Rewrite the story in strength-based language</p>
                <div className="bg-white dark:bg-gray-800 p-2 rounded mt-2 text-xs italic">
                  Example: "I have a highly active pattern-recognition system that helps me make innovative connections"
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 7
    },
    {
      id: 'self-advocacy-basics',
      type: 'concept' as const,
      title: 'Self-Advocacy Fundamentals',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Speaking Up for Your Needs</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" />
              What is Self-Advocacy?
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Self-advocacy is the ability to speak up for yourself, communicate your needs clearly, 
              and take action to ensure you get the support necessary to succeed.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <h5 className="font-semibold mb-2 text-green-700 dark:text-green-300">Self-Advocacy IS:</h5>
                <ul className="text-sm space-y-1">
                  <li>• Knowing your strengths and needs</li>
                  <li>• Asking for reasonable accommodations</li>
                  <li>• Communicating clearly and respectfully</li>
                  <li>• Taking responsibility for your learning</li>
                </ul>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                <h5 className="font-semibold mb-2 text-red-700 dark:text-red-300">Self-Advocacy is NOT:</h5>
                <ul className="text-sm space-y-1">
                  <li>• Making excuses or avoiding responsibility</li>
                  <li>• Demanding special treatment</li>
                  <li>• Expecting others to read your mind</li>
                  <li>• Being aggressive or entitled</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h5 className="font-semibold mb-2 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Your Rights as a Learner
            </h5>
            <ul className="text-sm space-y-1">
              <li>• Right to equal access to education</li>
              <li>• Right to reasonable accommodations</li>
              <li>• Right to privacy about your diagnosis</li>
              <li>• Right to be treated with respect and dignity</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'advocacy-scripts',
      type: 'practice' as const,
      title: 'Self-Advocacy Scripts & Strategies',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">What to Say and How to Say It</h3>
          
          <div className="space-y-4">
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-3">Scenario 1: Requesting Accommodations</h4>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Script Template:</p>
                <p className="text-sm italic">
                  "I'm registered with the disability services office and have documentation for [condition]. 
                  To succeed in your class, I need [specific accommodation]. This doesn't change the content 
                  I'm learning, just how I access it. Could we set up a time to discuss how to implement this?"
                </p>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-3">Scenario 2: Explaining Your Learning Style</h4>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Script Template:</p>
                <p className="text-sm italic">
                  "I learn best when [describe your optimal conditions]. When [describe challenging situation], 
                  I struggle because [explain briefly]. Would it be possible to [suggest solution]? 
                  This would help me show my true understanding of the material."
                </p>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-3">Scenario 3: Addressing Misunderstandings</h4>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Script Template:</p>
                <p className="text-sm italic">
                  "I think there might be a misunderstanding about my capabilities. While I do need support 
                  in [specific area], I'm very capable of [list strengths]. I'm not looking for easier work, 
                  just different ways to access the same challenging content."
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h5 className="font-semibold mb-2">💡 Pro Tips for Effective Advocacy</h5>
            <ul className="text-sm space-y-1">
              <li>• Come prepared with specific examples and solutions</li>
              <li>• Focus on your needs, not your diagnosis</li>
              <li>• Be collaborative, not confrontational</li>
              <li>• Follow up in writing to document agreements</li>
              <li>• Know who to contact if initial advocacy doesn't work</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'advocacy-summary',
      type: 'summary' as const,
      title: 'Your Advocacy Toolkit',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center mb-6">From Challenges to Competitive Advantages</h3>
          
          <div className="grid gap-4">
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                Strength Reframing
              </h4>
              <p className="text-sm">Transform perceived weaknesses into recognized superpowers</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-primary" />
                Hidden Strengths Discovery
              </h4>
              <p className="text-sm">Identify and articulate your unique cognitive advantages</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                Self-Advocacy Skills
              </h4>
              <p className="text-sm">Scripts and strategies for getting the support you need</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary" />
                Rights & Responsibilities
              </h4>
              <p className="text-sm">Know your rights as a learner and how to protect them</p>
            </div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <h4 className="font-semibold mb-2">Final Module: Real-World Application</h4>
            <p className="text-sm text-muted-foreground">
              Let's put everything together and create your personalized success plan!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};