import React from 'react';
import { Brain, Lightbulb, Users, CheckCircle } from 'lucide-react';

export const understandingNeurodiversityMicroLessons = {
  id: 'understanding-neurodiversity',
  moduleTitle: 'Understanding Neurodiversity and Your Unique Brain',
  totalScreens: 8,
  screens: [
    {
      id: 'intro',
      type: 'concept' as const,
      title: 'Welcome to Your Learning Journey',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Understanding Your Unique Brain</h2>
            <p className="text-lg text-muted-foreground">
              Every brain is wired differently, and that's exactly what makes you uniquely powerful as a learner.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">What You'll Discover</h3>
            <ul className="space-y-2">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-primary mr-3" />What neurodiversity really means</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-primary mr-3" />How your brain's differences are strengths</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-primary mr-3" />Practical ways to leverage your cognitive style</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'what-is-neurodiversity',
      type: 'concept' as const,
      title: 'What is Neurodiversity?',
      content: (
        <div className="space-y-6">
          <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
            <h3 className="text-xl font-semibold mb-3 text-primary">Neurodiversity Definition</h3>
            <p className="text-lg">
              Neurodiversity is the idea that neurological differences like ADHD, autism, dyslexia, and others 
              are natural variations of the human brain rather than disorders to be "fixed."
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Medical Model (Old)
              </h4>
              <p className="text-sm text-muted-foreground">
                Views differences as deficits that need treatment or correction.
              </p>
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                Social Model (New)
              </h4>
              <p className="text-sm text-muted-foreground">
                Views differences as natural variations that offer unique strengths.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'brain-variations',
      type: 'concept' as const,
      title: 'Common Brain Variations',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Your Brain Might Process Differently</h3>
          
          <div className="grid gap-4">
            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-semibold mb-2">ADHD</h4>
              <p className="text-sm text-muted-foreground">Enhanced creativity, hyperfocus abilities, and innovative thinking</p>
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Autism</h4>
              <p className="text-sm text-muted-foreground">Deep focus, pattern recognition, and systematic thinking</p>
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Dyslexia</h4>
              <p className="text-sm text-muted-foreground">Big-picture thinking, problem-solving, and spatial reasoning</p>
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Processing Differences</h4>
              <p className="text-sm text-muted-foreground">Unique learning styles and information processing approaches</p>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg text-center">
            <p className="text-sm"><strong>Remember:</strong> These are thinking styles, not limitations!</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'strengths-focus',
      type: 'concept' as const,
      title: 'Focusing on Strengths',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Your Brain's Superpowers</h3>
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
            <h4 className="font-semibold mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-primary" />
              Reframe Your Thinking
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-2 text-red-600">❌ Old Thinking</h5>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>"I'm easily distracted"</li>
                  <li>"I'm too sensitive"</li>
                  <li>"I think differently"</li>
                  <li>"I struggle with focus"</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2 text-primary">✅ New Thinking</h5>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>"I notice details others miss"</li>
                  <li>"I'm highly empathetic"</li>
                  <li>"I bring unique perspectives"</li>
                  <li>"I can hyperfocus on interests"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'learning-styles',
      type: 'practice' as const,
      title: 'Identify Your Learning Style',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">How Do You Learn Best?</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">Self-Assessment Exercise</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Think about when you learn most effectively. Which scenarios resonate with you?
            </p>
            
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <h5 className="font-medium">Visual Learner</h5>
                <p className="text-sm text-muted-foreground">You prefer diagrams, colors, mind maps, and visual organization</p>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h5 className="font-medium">Auditory Learner</h5>
                <p className="text-sm text-muted-foreground">You learn through listening, discussions, and verbal explanations</p>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h5 className="font-medium">Kinesthetic Learner</h5>
                <p className="text-sm text-muted-foreground">You need movement, hands-on activities, and physical engagement</p>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h5 className="font-medium">Reading/Writing Learner</h5>
                <p className="text-sm text-muted-foreground">You prefer text-based learning, lists, and written materials</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'cognitive-strengths',
      type: 'concept' as const,
      title: 'Cognitive Strengths Assessment',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Discover Your Cognitive Superpowers</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-600">Creative Thinking</h4>
              <p className="text-sm text-muted-foreground">
                Do you come up with innovative solutions and see connections others miss?
              </p>
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-600">Pattern Recognition</h4>
              <p className="text-sm text-muted-foreground">
                Are you good at spotting patterns, trends, and underlying structures?
              </p>
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-purple-600">Hyperfocus</h4>
              <p className="text-sm text-muted-foreground">
                Can you become deeply absorbed in topics that interest you for hours?
              </p>
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-orange-600">Systems Thinking</h4>
              <p className="text-sm text-muted-foreground">
                Do you naturally think about how parts relate to the whole?
              </p>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg text-center">
            <p className="text-sm">
              <strong>Your Assignment:</strong> Identify your top 2-3 cognitive strengths to focus on in this course.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'accommodation-vs-modification',
      type: 'concept' as const,
      title: 'Accommodations vs. Modifications',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Understanding Academic Support</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">Accommodations</h4>
              <p className="text-sm mb-3">Changes in HOW you access content, not WHAT you learn</p>
              <ul className="text-sm space-y-1">
                <li>• Extended time on tests</li>
                <li>• Quiet testing environment</li>
                <li>• Audio versions of texts</li>
                <li>• Note-taking assistance</li>
                <li>• Flexible seating</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-700 dark:text-green-300">Modifications</h4>
              <p className="text-sm mb-3">Changes in WHAT you're expected to learn or do</p>
              <ul className="text-sm space-y-1">
                <li>• Reduced number of problems</li>
                <li>• Alternative assignments</li>
                <li>• Different grading criteria</li>
                <li>• Simplified instructions</li>
                <li>• Alternative curricula</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-sm text-center">
              <strong>Goal:</strong> Use accommodations to access your full potential, not to lower expectations!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'key-takeaways',
      type: 'summary' as const,
      title: 'Key Takeaways',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center mb-6">What You've Learned</h3>
          
          <div className="grid gap-4">
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                Neurodiversity is Natural
              </h4>
              <p className="text-sm">Your brain differences are natural variations, not deficits to fix.</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                Focus on Strengths
              </h4>
              <p className="text-sm">Reframe challenges as unique perspectives and cognitive advantages.</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                Know Your Learning Style
              </h4>
              <p className="text-sm">Understanding how you learn best is the foundation of academic success.</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                Accommodations Help Access
              </h4>
              <p className="text-sm">The right supports help you show your true abilities, not lower expectations.</p>
            </div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <h4 className="font-semibold mb-2">Ready for Module 2?</h4>
            <p className="text-sm text-muted-foreground">
              Next, we'll build executive functioning systems that work WITH your brain.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};