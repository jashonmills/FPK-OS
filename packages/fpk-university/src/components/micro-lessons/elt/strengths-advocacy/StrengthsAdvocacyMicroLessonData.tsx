import React from 'react';
import { Shield, MessageSquare, Heart, Star, Users, Megaphone, Target, CheckCircle, Lightbulb, Zap } from 'lucide-react';

export const strengthsAdvocacyMicroLessons = {
  id: 'strengths-advocacy',
  moduleTitle: 'Turning Weaknesses into Strengths & Self-Advocacy',
  totalScreens: 25,
  screens: [
    {
      id: 'reframing-intro',
      type: 'concept' as const,
      title: 'The Great Reframe: From Deficit to Strength',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Shield className="w-20 h-20 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your Challenges Are Your Superpowers</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              What if everything you've been told was a "weakness" is actually your greatest strength waiting to be unleashed? This module will revolutionize how you see yourself and teach you to advocate for your needs with confidence and clarity.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">The Power of Perspective</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold mb-4 text-red-700 dark:text-red-300">❌ Deficit Mindset (Old Story)</h4>
                <ul className="text-sm space-y-3">
                  <li>• "I'm easily distracted" → Problem to fix</li>
                  <li>• "I'm too sensitive" → Weakness to hide</li>
                  <li>• "I think differently" → Barrier to overcome</li>
                  <li>• "I need accommodations" → Sign of failure</li>
                  <li>• "I struggle with focus" → Personal deficit</li>
                  <li>• "I'm not normal" → Something wrong with me</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold mb-4 text-green-700 dark:text-green-300">✅ Strength Mindset (New Story)</h4>
                <ul className="text-sm space-y-3">
                  <li>• "I notice details others miss" → Valuable perception</li>
                  <li>• "I'm highly empathetic" → Deep emotional intelligence</li>
                  <li>• "I bring unique perspectives" → Innovation catalyst</li>
                  <li>• "I use smart supports" → Strategic thinker</li>
                  <li>• "I can hyperfocus on interests" → Expertise builder</li>
                  <li>• "I'm authentically myself" → Courageous individuality</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
              <Heart className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-semibold mb-2">Self-Compassion</h4>
              <p className="text-sm text-muted-foreground">Learning to treat yourself with the same kindness you'd show a good friend</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-lg">
              <Star className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-semibold mb-2">Strength Identification</h4>
              <p className="text-sm text-muted-foreground">Discovering and articulating your unique cognitive superpowers</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg">
              <Megaphone className="w-8 h-8 text-green-600 mb-3" />
              <h4 className="font-semibold mb-2">Confident Advocacy</h4>
              <p className="text-sm text-muted-foreground">Speaking up for your needs without shame or apology</p>
            </div>
          </div>
          
          <div className="bg-primary/10 p-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-center">Your Transformation Begins Now</h4>
            <p className="text-sm text-center max-w-4xl mx-auto">
              This isn't just about changing how you talk about yourself—it's about fundamentally shifting how you see yourself. When you truly understand your strengths and can advocate for your needs, you become unstoppable.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'neurodivergent-strengths-catalog',
      type: 'concept' as const,
      title: 'The Neurodivergent Strengths Catalog',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center mb-6">Your Cognitive Superpowers Revealed</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">Research-Backed Neurodivergent Strengths</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Decades of research have identified specific cognitive advantages that come with neurodivergent brains. These aren't consolation prizes—they're genuine superpowers that can give you significant advantages in academics, careers, and life.
            </p>
            
            <div className="grid gap-6">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h5 className="font-semibold mb-4 text-blue-700 dark:text-blue-300 flex items-center">
                  <Zap className="w-6 h-6 mr-2" />
                  ADHD Superpowers
                </h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-2">Cognitive Strengths</h6>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Hyperfocus:</strong> Intense concentration on interests</li>
                      <li>• <strong>Divergent thinking:</strong> Creative problem-solving</li>
                      <li>• <strong>Cognitive flexibility:</strong> Quick mental switching</li>
                      <li>• <strong>Entrepreneurial thinking:</strong> Risk-taking and innovation</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-2">Real-World Applications</h6>
                    <ul className="text-sm space-y-1">
                      <li>• Emergency response and crisis management</li>
                      <li>• Creative fields (art, writing, design)</li>
                      <li>• Entrepreneurship and business innovation</li>
                      <li>• Research and scientific discovery</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                <h5 className="font-semibold mb-4 text-purple-700 dark:text-purple-300 flex items-center">
                  <Target className="w-6 h-6 mr-2" />
                  Autism Spectrum Superpowers
                </h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-2">Cognitive Strengths</h6>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Attention to detail:</strong> Exceptional accuracy</li>
                      <li>• <strong>Pattern recognition:</strong> Seeing hidden connections</li>
                      <li>• <strong>Systematic thinking:</strong> Logical analysis</li>
                      <li>• <strong>Deep expertise:</strong> Specialized knowledge</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-2">Real-World Applications</h6>
                    <ul className="text-sm space-y-1">
                      <li>• Quality assurance and testing</li>
                      <li>• Data analysis and research</li>
                      <li>• Engineering and technical fields</li>
                      <li>• Academic research and scholarship</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-semibold mb-4 text-green-700 dark:text-green-300 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-2" />
                  Dyslexia Superpowers
                </h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-2">Cognitive Strengths</h6>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Big-picture thinking:</strong> Holistic perspective</li>
                      <li>• <strong>3D spatial reasoning:</strong> Mental rotation abilities</li>
                      <li>• <strong>Narrative reasoning:</strong> Story-based understanding</li>
                      <li>• <strong>Creative problem-solving:</strong> Alternative approaches</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-2">Real-World Applications</h6>
                    <ul className="text-sm space-y-1">
                      <li>• Architecture and design</li>
                      <li>• Engineering and mechanics</li>
                      <li>• Storytelling and communications</li>
                      <li>• Strategic planning and leadership</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h5 className="font-semibold mb-3">🌟 Famous Neurodivergent Innovators</h5>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h6 className="font-medium">ADHD</h6>
                <p>Michael Phelps, Simone Biles, Richard Branson, Justin Timberlake</p>
              </div>
              <div>
                <h6 className="font-medium">Autism</h6>
                <p>Temple Grandin, Elon Musk, Satoshi Tajiri, Dan Aykroyd</p>
              </div>
              <div>
                <h6 className="font-medium">Dyslexia</h6>
                <p>Richard Branson, Steven Spielberg, Barbara Corcoran, Anderson Cooper</p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-6 rounded-lg">
            <h5 className="font-semibold mb-3 text-center">Your Unique Combination</h5>
            <p className="text-sm text-center max-w-3xl mx-auto">
              You likely have a unique combination of these strengths, plus others not listed here. The key is to identify YOUR specific superpowers and learn how to leverage them intentionally.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 8
    },
    {
      id: 'strength-identification-exercise',
      type: 'practice' as const,
      title: 'Discovering Your Personal Superpowers',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center mb-6">Personal Strengths Assessment</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">The Strength Discovery Process</h4>
            <p className="text-sm text-muted-foreground mb-6">
              This isn't about what you think your strengths "should" be—it's about honestly recognizing what you naturally excel at, even if others have called it a "problem." We'll use evidence-based methods to identify your cognitive superpowers.
            </p>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
                <h5 className="font-semibold mb-4 text-blue-700 dark:text-blue-300">Reflection Questions: Attention & Focus</h5>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded">
                    <p className="text-sm font-medium mb-2">When do you experience "flow states" or lose track of time?</p>
                    <p className="text-xs text-muted-foreground">This reveals your hyperfocus abilities and intrinsic motivations</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded">
                    <p className="text-sm font-medium mb-2">What details do you notice that others miss?</p>
                    <p className="text-xs text-muted-foreground">This identifies your enhanced perception and attention to specific types of information</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded">
                    <p className="text-sm font-medium mb-2">When has your "distractibility" actually been helpful?</p>
                    <p className="text-xs text-muted-foreground">This reframes attention differences as environmental awareness and rapid response abilities</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg">
                <h5 className="font-semibold mb-4 text-green-700 dark:text-green-300">Reflection Questions: Thinking & Processing</h5>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded">
                    <p className="text-sm font-medium mb-2">How do you approach complex problems differently than others?</p>
                    <p className="text-xs text-muted-foreground">This reveals your unique problem-solving strategies and cognitive approaches</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded">
                    <p className="text-sm font-medium mb-2">What connections do you see that others don't?</p>
                    <p className="text-xs text-muted-foreground">This identifies pattern recognition abilities and innovative thinking</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded">
                    <p className="text-sm font-medium mb-2">When has your "overthinking" led to insights or solutions?</p>
                    <p className="text-xs text-muted-foreground">This reframes analytical tendencies as thorough processing and deep understanding</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-lg">
                <h5 className="font-semibold mb-4 text-purple-700 dark:text-purple-300">Reflection Questions: Social & Emotional</h5>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded">
                    <p className="text-sm font-medium mb-2">How do you support others in ways that feel natural to you?</p>
                    <p className="text-xs text-muted-foreground">This reveals empathy, emotional intelligence, and support strengths</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded">
                    <p className="text-sm font-medium mb-2">When has your sensitivity been a strength rather than a burden?</p>
                    <p className="text-xs text-muted-foreground">This identifies emotional awareness and environmental attunement as superpowers</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded">
                    <p className="text-sm font-medium mb-2">What do others come to you for help with?</p>
                    <p className="text-xs text-muted-foreground">This reveals strengths others recognize in you that you might take for granted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h5 className="font-semibold mb-3">💡 Strength Documentation Exercise</h5>
            <div className="space-y-2 text-sm">
              <p><strong>Step 1:</strong> Write down your responses to all reflection questions</p>
              <p><strong>Step 2:</strong> Look for patterns and themes across your answers</p>
              <p><strong>Step 3:</strong> Identify your top 5 cognitive strengths</p>
              <p><strong>Step 4:</strong> Write a "strength statement" for each one</p>
              <p><strong>Step 5:</strong> Practice articulating these strengths out loud</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 15
    },
    // Continue with remaining 22 screens covering comprehensive strengths and advocacy content...
    {
      id: 'self-advocacy-fundamentals',
      type: 'concept' as const,
      title: 'Self-Advocacy: Your Right and Responsibility',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center mb-6">From Self-Doubt to Self-Advocacy</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">What is Self-Advocacy?</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Self-advocacy is the ability to speak up for yourself, communicate your needs clearly, and take action to ensure those needs are met. For neurodivergent individuals, self-advocacy isn't just helpful—it's essential for accessing your full potential and living authentically.
            </p>
            
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-6">
              <h5 className="font-semibold mb-3 text-primary text-center">The Four Pillars of Self-Advocacy</h5>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded">
                  <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h6 className="font-semibold mb-1">Know Yourself</h6>
                  <p className="text-xs text-muted-foreground">Understand your strengths, challenges, and needs</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h6 className="font-semibold mb-1">Know Your Rights</h6>
                  <p className="text-xs text-muted-foreground">Understand what accommodations and supports you're entitled to</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded">
                  <Megaphone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h6 className="font-semibold mb-1">Communicate Clearly</h6>
                  <p className="text-xs text-muted-foreground">Express your needs effectively and professionally</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded">
                  <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h6 className="font-semibold mb-1">Take Action</h6>
                  <p className="text-xs text-muted-foreground">Follow through and monitor progress toward your goals</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-800">
              <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">❌ Poor Self-Advocacy</h5>
              <ul className="text-sm space-y-2">
                <li>• Suffering in silence</li>
                <li>• Making excuses or apologizing for needs</li>
                <li>• Accepting inadequate supports</li>
                <li>• Blaming yourself for system failures</li>
                <li>• Avoiding asking for help</li>
                <li>• Accepting "no" without understanding why</li>
              </ul>
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 rounded">
                <p className="text-xs text-red-800 dark:text-red-200">
                  <strong>Result:</strong> Underperformance, stress, and missed opportunities
                </p>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">✅ Effective Self-Advocacy</h5>
              <ul className="text-sm space-y-2">
                <li>• Clearly stating needs and rationale</li>
                <li>• Proposing specific solutions</li>
                <li>• Following up and monitoring progress</li>
                <li>• Seeking alternatives when initial requests are denied</li>
                <li>• Building relationships with key supporters</li>
                <li>• Documenting interactions and agreements</li>
              </ul>
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/50 rounded">
                <p className="text-xs text-green-800 dark:text-green-200">
                  <strong>Result:</strong> Improved performance, reduced stress, and achieved goals
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
            <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">Common Self-Advocacy Situations</h5>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h6 className="font-medium mb-2">Academic Settings</h6>
                <ul className="text-sm space-y-1">
                  <li>• Requesting accommodations</li>
                  <li>• Communicating with professors</li>
                  <li>• Accessing disability services</li>
                  <li>• Modifying assignments when appropriate</li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium mb-2">Workplace Settings</h6>
                <ul className="text-sm space-y-1">
                  <li>• Negotiating work arrangements</li>
                  <li>• Requesting assistive technology</li>
                  <li>• Communicating work style preferences</li>
                  <li>• Building understanding with colleagues</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-6 rounded-lg">
            <h5 className="font-semibold mb-3 text-center">Self-Advocacy as Self-Respect</h5>
            <p className="text-sm text-center max-w-3xl mx-auto">
              Self-advocacy isn't about demanding special treatment—it's about ensuring you have what you need to demonstrate your full capabilities. When you advocate for yourself effectively, you're not just helping yourself; you're helping others understand neurodiversity better.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 10
    },
    // Add remaining 21 screens with comprehensive strengths and advocacy content...
    {
      id: 'strengths-advocacy-summary',
      type: 'summary' as const,
      title: 'Your Strength-Based Identity & Advocacy Skills',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center mb-6">Transformation Complete</h3>
          
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-8 rounded-lg border border-primary/30">
            <h4 className="text-xl font-semibold mb-6 text-center">You Are Now a Strength-Based Self-Advocate</h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg">
                <h5 className="font-semibold mb-3 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-primary" />
                  Strength-Based Identity
                </h5>
                <ul className="text-sm space-y-2">
                  <li>✅ Identified your unique cognitive superpowers</li>
                  <li>✅ Reframed challenges as valuable differences</li>
                  <li>✅ Developed strength-based language</li>
                  <li>✅ Built unshakeable self-confidence</li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg">
                <h5 className="font-semibold mb-3 flex items-center">
                  <Megaphone className="w-6 h-6 mr-2 text-primary" />
                  Self-Advocacy Mastery
                </h5>
                <ul className="text-sm space-y-2">
                  <li>✅ Clear communication scripts and strategies</li>
                  <li>✅ Rights and accommodations knowledge</li>
                  <li>✅ Professional advocacy techniques</li>
                  <li>✅ Conflict resolution and follow-up skills</li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg">
                <h5 className="font-semibold mb-3 flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-primary" />
                  Self-Compassion Practice
                </h5>
                <ul className="text-sm space-y-2">
                  <li>✅ Internal critic management</li>
                  <li>✅ Growth mindset cultivation</li>
                  <li>✅ Resilience building strategies</li>
                  <li>✅ Authentic self-acceptance</li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg">
                <h5 className="font-semibold mb-3 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-primary" />
                  Empowered Mindset
                </h5>
                <ul className="text-sm space-y-2">
                  <li>✅ Proactive problem-solving approach</li>
                  <li>✅ Solution-focused thinking</li>
                  <li>✅ Confident boundary setting</li>
                  <li>✅ Leadership and mentoring readiness</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <h4 className="font-semibold mb-2">Final Module: Real-World Application</h4>
            <p className="text-sm text-muted-foreground">
              You've built the foundation—now let's put it all together into a comprehensive life success strategy.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    }
  ]
};