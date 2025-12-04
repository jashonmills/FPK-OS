import React from 'react';
import { PlayCircle, Monitor, Headphones, Brain, CheckCircle, Users, Zap, Target } from 'lucide-react';
import { MicroLessonData } from '../../MicroLessonContainer';

export const fpkAdvantageMicroLessons: MicroLessonData = {
  id: 'fpk-university-advantage',
  moduleTitle: 'The FPK University Advantage',
  totalScreens: 8,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Learning Designed for Your Brain',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <PlayCircle className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-3xl font-bold">The FPK University Advantage</h2>
            <p className="text-lg text-muted-foreground">
              Discover how our platform is designed specifically for your brain
            </p>
          </div>
          <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
            <p className="text-center">
              FPK University isn't just adapted for neurodiverse learners—it's built from the ground up 
              with neurodiversity as a core design principle. Let's explore what makes us different!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 1
    },
    {
      id: 'universal-design',
      type: 'concept',
      title: 'Universal Design for Learning',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Built for All Minds, Optimized for Yours
          </h3>
          
          <div className="space-y-4">
            <p>
              Universal Design for Learning (UDL) means creating education that works for everyone 
              from the start, rather than retrofitting accommodations later.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Multiple Means of Representation
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Visual, auditory, and text formats</li>
                  <li>• Customizable display options</li>
                  <li>• Multiple language support</li>
                  <li>• Adjustable pacing</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Multiple Means of Engagement
                </h4>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  <li>• Interest-based content</li>
                  <li>• Relevant real-world examples</li>
                  <li>• Choice and autonomy</li>
                  <li>• Strength-based approach</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Multiple Means of Expression
                </h4>
                <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                  <li>• Various assessment formats</li>
                  <li>• Flexible submission options</li>
                  <li>• Progress tracking tools</li>
                  <li>• Self-reflection opportunities</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>The FPK Difference:</strong> While many platforms add accessibility features as an afterthought, 
                we designed every aspect of FPK University with neurodiversity in mind from day one.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'micro-learning',
      type: 'concept',
      title: 'Micro-Learning Architecture',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Bite-Sized Learning That Works
          </h3>
          
          <div className="space-y-4">
            <p>
              Our micro-learning approach breaks complex concepts into digestible chunks 
              that align perfectly with how neurodiverse brains process information.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600 dark:text-green-400">Why Micro-Learning Works</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Reduces cognitive overload</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Fits natural attention spans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Allows for frequent breaks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Enables mastery-based progression</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Provides immediate feedback</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card p-4 rounded-lg border">
                <h4 className="font-semibold mb-3">Our Micro-Learning Structure</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <span className="text-sm">Hook (1-2 minutes)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-sm">Core Concept (3-5 minutes)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <span className="text-sm">Practice (2-3 minutes)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    <span className="text-sm">Reflection (1-2 minutes)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Perfect for ADHD and Autism:</strong> Short modules prevent hyperfocus fatigue 
                while supporting the need for routine and predictable structure.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'multimodal-content',
      type: 'example',
      title: 'Multimodal Content Delivery',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Headphones className="w-5 h-5 text-primary" />
            Learning Through Multiple Channels
          </h3>
          
          <div className="space-y-4">
            <p>
              Every concept is presented through multiple sensory channels, 
              allowing you to learn in the way that works best for your brain.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
                <Monitor className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Visual</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Diagrams, infographics, mind maps, color coding
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 text-center">
                <Headphones className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">Auditory</h4>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Narration, music, sound effects, discussions
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 text-center">
                <Target className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">Kinesthetic</h4>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  Interactive simulations, drag-and-drop, hands-on activities
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800 text-center">
                <Brain className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">Cognitive</h4>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Pattern recognition, logical sequences, systematic thinking
                </p>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Personalized Learning Paths</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Our AI adapts content delivery based on your preferences and performance:
              </p>
              <ul className="text-sm space-y-1">
                <li>• Strengthens your preferred learning modalities</li>
                <li>• Gradually introduces challenging formats</li>
                <li>• Provides alternative explanations when needed</li>
                <li>• Adjusts pacing based on your progress</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'sensory-considerations',
      type: 'concept',
      title: 'Sensory-Friendly Design',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Designed for Sensory Sensitivity
          </h3>
          
          <div className="space-y-4">
            <p>
              We understand that sensory processing differences can impact learning. 
              FPK University includes extensive customization options for sensory comfort.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Visual Customization</h4>
                <div className="bg-card p-3 rounded border space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Dark/Light Mode</span>
                    <div className="w-8 h-4 bg-muted rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>High Contrast Mode</span>
                    <div className="w-8 h-4 bg-muted rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Reduced Motion</span>
                    <div className="w-8 h-4 bg-muted rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Font Size</span>
                    <div className="text-xs bg-muted px-2 py-1 rounded">A+ A-</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Audio Controls</h4>
                <div className="bg-card p-3 rounded border space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Narration Speed</span>
                    <div className="text-xs bg-muted px-2 py-1 rounded">0.5x - 2x</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Background Music</span>
                    <div className="w-8 h-4 bg-muted rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Sound Effects</span>
                    <div className="w-8 h-4 bg-muted rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Auto-play</span>
                    <div className="w-8 h-4 bg-muted rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">Sensory Break Reminders</h4>
              <p className="text-sm">
                Our platform includes built-in break reminders and offers guided sensory regulation 
                exercises when you need them. Learning should feel comfortable, not overwhelming.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'progress-tracking',
      type: 'concept',
      title: 'Strength-Based Progress Tracking',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Celebrating Your Unique Learning Journey
          </h3>
          
          <div className="space-y-4">
            <p>
              Traditional education often focuses on deficits. FPK University tracks and celebrates 
              your strengths, helping you build confidence and recognize your growth.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">What We Track</h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Learning preferences and patterns</li>
                  <li>• Areas of exceptional performance</li>
                  <li>• Improvement trajectories</li>
                  <li>• Time-to-mastery metrics</li>
                  <li>• Engagement levels by content type</li>
                  <li>• Self-reflection insights</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">How We Present It</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Visual progress dashboards</li>
                  <li>• Strength spotlight reports</li>
                  <li>• Personal learning analytics</li>
                  <li>• Achievement celebrations</li>
                  <li>• Growth story narratives</li>
                  <li>• Peer comparison (optional)</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Example: Your Learning Superpowers Report</h4>
              <div className="bg-muted/50 p-3 rounded text-sm space-y-1">
                <p><strong>🧠 Pattern Recognition:</strong> You excel at identifying economic trends - 95th percentile!</p>
                <p><strong>🔍 Detail Orientation:</strong> Your attention to detail caught 3 errors others missed.</p>
                <p><strong>⚡ Deep Focus:</strong> You can maintain concentration 40% longer than average.</p>
                <p><strong>🎯 Systematic Thinking:</strong> You solve logic problems with exceptional accuracy.</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'community-support',
      type: 'practice',
      title: 'Neurodiversity-Affirming Community',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Learning Together, Growing Together
          </h3>
          
          <div className="space-y-4">
            <p>
              FPK University isn't just a learning platform—it's a community where neurodiversity 
              is celebrated and every learner can find their tribe.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Community Features</h4>
                <div className="space-y-2">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm mb-1">Study Groups</h5>
                    <p className="text-xs text-muted-foreground">
                      Connect with learners who share your learning style and interests
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm mb-1">Peer Mentorship</h5>
                    <p className="text-xs text-muted-foreground">
                      Learn from and support fellow neurodiverse students
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm mb-1">Success Stories</h5>
                    <p className="text-xs text-muted-foreground">
                      Read about others' journeys and share your own achievements
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Support Resources</h4>
                <div className="space-y-2">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm mb-1">Learning Coaches</h5>
                    <p className="text-xs text-muted-foreground">
                      Trained professionals who understand neurodiverse learning needs
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm mb-1">Self-Advocacy Tools</h5>
                    <p className="text-xs text-muted-foreground">
                      Resources to help you communicate your needs and strengths
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm mb-1">Crisis Support</h5>
                    <p className="text-xs text-muted-foreground">
                      24/7 access to mental health resources and crisis intervention
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">Safe Space Principles</h4>
              <ul className="text-sm space-y-1">
                <li>• Neurodiversity is celebrated, not just accommodated</li>
                <li>• No judgment about learning differences or challenges</li>
                <li>• Respect for communication styles and social needs</li>
                <li>• Zero tolerance for ableism or discrimination</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'reflection',
      type: 'summary',
      title: 'Your FPK University Experience',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Making FPK University Work for You
          </h3>
          
          <div className="space-y-4">
            <p>
              Now that you understand how FPK University is designed with your brain in mind, 
              let's think about how to optimize your experience here.
            </p>
            
            <div className="bg-card p-6 rounded-lg border space-y-4">
              <h4 className="font-semibold">Reflection Questions:</h4>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">1. Learning Modalities</p>
                  <p className="text-xs text-muted-foreground">
                    Which of our multimodal features excite you most? 
                    How will you customize your learning experience?
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">2. Sensory Needs</p>
                  <p className="text-xs text-muted-foreground">
                    What sensory accommodations will help you learn most effectively? 
                    Which customization options will you explore first?
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">3. Community Connection</p>
                  <p className="text-xs text-muted-foreground">
                    How do you want to engage with the FPK University community? 
                    What kind of support would be most valuable to you?
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <strong>Welcome to FPK University!</strong> You're not just a student here—
                you're a valued member of a community that sees your neurodivergence as a strength. 
                We're excited to support your unique learning journey!
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    }
  ]
};