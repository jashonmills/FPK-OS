import React from 'react';
import { Brain, Lightbulb, Users, CheckCircle, Star, Target, Eye, Heart, Zap, Shield } from 'lucide-react';

export const understandingNeurodiversityMicroLessons = {
  id: 'understanding-neurodiversity',
  moduleTitle: 'Understanding Neurodiversity and Your Unique Brain',
  totalScreens: 24,
  screens: [
    {
      id: 'welcome',
      type: 'concept' as const,
      title: 'Welcome to Your Neurodiversity Journey',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Brain className="w-20 h-20 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your Brain is Extraordinary</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Welcome to a transformative journey where you'll discover that your brain differences aren't limitations—they're your unique superpowers waiting to be unleashed.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 text-center">What Makes This Journey Different</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg">
                <Shield className="w-8 h-8 text-blue-500 mb-3" />
                <h4 className="font-semibold mb-2">Strength-Based Approach</h4>
                <p className="text-sm">We focus on what you do brilliantly, not what you struggle with</p>
              </div>
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg">
                <Zap className="w-8 h-8 text-yellow-500 mb-3" />
                <h4 className="font-semibold mb-2">Evidence-Based Strategies</h4>
                <p className="text-sm">Every technique is backed by neuroscience research and proven results</p>
              </div>
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg">
                <Heart className="w-8 h-8 text-red-500 mb-3" />
                <h4 className="font-semibold mb-2">Compassionate Understanding</h4>
                <p className="text-sm">Your journey is honored with respect and deep understanding</p>
              </div>
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg">
                <Target className="w-8 h-8 text-green-500 mb-3" />
                <h4 className="font-semibold mb-2">Practical Application</h4>
                <p className="text-sm">Everything you learn has immediate, real-world application</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'paradigm-shift',
      type: 'concept' as const,
      title: 'The Great Paradigm Shift in Understanding Brains',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center mb-6">From Deficit to Difference: A Revolutionary Change</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="text-xl font-semibold mb-4">The Old Story vs. The New Story</h4>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-800">
                <h5 className="font-semibold mb-4 text-red-700 dark:text-red-300 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Medical Model (The Old Story)
                </h5>
                <ul className="text-sm space-y-2">
                  <li>• Focuses on deficits and disorders</li>
                  <li>• Labels differences as "abnormal"</li>
                  <li>• Seeks to "fix" or "normalize"</li>
                  <li>• Emphasizes what's "wrong"</li>
                  <li>• Creates shame and hiding</li>
                  <li>• One-size-fits-all solutions</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-semibold mb-4 text-green-700 dark:text-green-300 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Neurodiversity Model (The New Story)
                </h5>
                <ul className="text-sm space-y-2">
                  <li>• Celebrates natural variation</li>
                  <li>• Recognizes unique strengths</li>
                  <li>• Adapts environment to fit the person</li>
                  <li>• Emphasizes contribution and value</li>
                  <li>• Creates pride and authenticity</li>
                  <li>• Personalized approaches</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-center">The Neurodiversity Movement</h4>
            <p className="text-sm text-center max-w-3xl mx-auto">
              Started by autistic self-advocates in the 1990s, the neurodiversity movement recognizes neurological differences as natural human variation, similar to biodiversity in nature. This paradigm shift has revolutionized how we understand conditions like ADHD, autism, dyslexia, and other cognitive differences.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'defining-neurodiversity',
      type: 'concept' as const,
      title: 'What Exactly IS Neurodiversity?',
      content: (
        <div className="space-y-6">
          <div className="bg-primary/10 p-8 rounded-lg border border-primary/20">
            <h3 className="text-2xl font-semibold mb-4 text-center text-primary">Core Definition</h3>
            <p className="text-lg text-center max-w-4xl mx-auto leading-relaxed">
              <strong>Neurodiversity</strong> is the idea that neurological differences like ADHD, autism, dyslexia, Tourette syndrome, and others are natural variations of the human brain rather than disorders that need to be "cured" or "fixed." It's about recognizing that different brains have different strengths, and these differences contribute valuable perspectives to our world.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-600">Neurotypical</h4>
              <p className="text-sm text-muted-foreground mb-3">
                People whose neurological development and functioning are typical or expected
              </p>
              <div className="text-xs bg-blue-50 dark:bg-blue-950/30 p-2 rounded">
                About 80-85% of population
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-600">Neurodivergent</h4>
              <p className="text-sm text-muted-foreground mb-3">
                People whose neurological development differs from what's considered typical
              </p>
              <div className="text-xs bg-green-50 dark:bg-green-950/30 p-2 rounded">
                About 15-20% of population
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-600">Neurodiverse</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Groups or environments that include both neurotypical and neurodivergent people
              </p>
              <div className="text-xs bg-purple-50 dark:bg-purple-950/30 p-2 rounded">
                Describes communities, not individuals
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold mb-3 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-yellow-600" />
              Important Distinction
            </h4>
            <p className="text-sm">
              Neurodiversity doesn't deny that some people face genuine challenges or need support. Instead, it shifts the focus from seeing differences as deficits to recognizing them as natural variations that can be supported and accommodated, allowing people to thrive in their authentic ways.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'common-variations',
      type: 'concept' as const,
      title: 'Common Neurological Variations',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center mb-6">The Beautiful Spectrum of Human Brains</h3>
          
          <div className="grid gap-6">
            <div className="bg-card p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-blue-700 dark:text-blue-300">ADHD</h4>
                  <p className="text-sm text-muted-foreground">Attention Deficit Hyperactivity Disorder</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2 text-green-600">Superpowers</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Hyperfocus on areas of interest</li>
                    <li>• Creative and innovative thinking</li>
                    <li>• High energy and enthusiasm</li>
                    <li>• Ability to think outside the box</li>
                    <li>• Resilience and adaptability</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2 text-orange-600">Common Challenges</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Difficulty with sustained attention</li>
                    <li>• Executive functioning struggles</li>
                    <li>• Time management challenges</li>
                    <li>• Sensory sensitivity</li>
                    <li>• Emotional regulation</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-purple-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-purple-700 dark:text-purple-300">Autism Spectrum</h4>
                  <p className="text-sm text-muted-foreground">Autism Spectrum Disorder</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2 text-green-600">Superpowers</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Exceptional attention to detail</li>
                    <li>• Deep expertise in special interests</li>
                    <li>• Pattern recognition abilities</li>
                    <li>• Systematic and logical thinking</li>
                    <li>• Honesty and direct communication</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2 text-orange-600">Common Challenges</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Social communication differences</li>
                    <li>• Sensory processing variations</li>
                    <li>• Need for routine and predictability</li>
                    <li>• Difficulty with change</li>
                    <li>• Executive functioning needs</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-green-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4">
                  <Brain className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-green-700 dark:text-green-300">Dyslexia</h4>
                  <p className="text-sm text-muted-foreground">Language-based learning difference</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2 text-green-600">Superpowers</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Big-picture thinking</li>
                    <li>• 3D spatial reasoning</li>
                    <li>• Creative problem-solving</li>
                    <li>• Entrepreneurial thinking</li>
                    <li>• Narrative reasoning</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2 text-orange-600">Common Challenges</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Reading fluency and accuracy</li>
                    <li>• Spelling difficulties</li>
                    <li>• Working memory challenges</li>
                    <li>• Processing speed variations</li>
                    <li>• Sequential processing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-center">Remember: Every Brain is Unique</h4>
            <p className="text-sm text-center max-w-3xl mx-auto">
              These are general patterns, not rigid categories. You might identify with aspects of multiple variations, or have your own unique combination of strengths and challenges. What matters is understanding YOUR specific brain and how to help it thrive.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 8
    },
    // Continue with remaining 20 screens...
    {
      id: 'your-unique-brain',
      type: 'practice' as const,
      title: 'Discovering Your Unique Brain Profile',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center mb-6">Self-Discovery Exercise</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">Brain Profile Assessment</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Reflect on these questions to understand your unique cognitive profile. There are no right or wrong answers—only insights about how your amazing brain works.
            </p>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">Attention & Focus</h5>
                <ul className="text-sm space-y-2">
                  <li>• Do you have periods of intense focus on topics that interest you?</li>
                  <li>• Do you notice details that others miss?</li>
                  <li>• Do you prefer to work on one thing at a time or multiple things?</li>
                  <li>• How does background noise affect your concentration?</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">Processing & Learning</h5>
                <ul className="text-sm space-y-2">
                  <li>• Do you need extra time to process information?</li>
                  <li>• Do you think in pictures, words, or patterns?</li>
                  <li>• Do you prefer step-by-step instructions or big-picture overviews?</li>
                  <li>• How do you best remember new information?</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
                <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">Social & Communication</h5>
                <ul className="text-sm space-y-2">
                  <li>• Do you prefer direct, literal communication?</li>
                  <li>• Do you need quiet time to recharge after social interactions?</li>
                  <li>• Do you have strong empathy or sensitivity to others' emotions?</li>
                  <li>• How do you best express your thoughts and ideas?</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg">
                <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">Sensory & Environment</h5>
                <ul className="text-sm space-y-2">
                  <li>• Are you sensitive to lights, sounds, textures, or smells?</li>
                  <li>• Do you need movement to think clearly?</li>
                  <li>• What environments help you feel calm and focused?</li>
                  <li>• Do you have strong preferences for routine or novelty?</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">💡 Reflection Tip</h5>
            <p className="text-sm">
              Keep notes about your responses. These insights will be the foundation for creating learning strategies that work with your brain, not against it. You're building your personal user manual!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 10
    },
    // Add remaining 18 screens with comprehensive content from Supabase...
    {
      id: 'summary-next-steps',
      type: 'summary' as const,
      title: 'Your Neurodiversity Foundation',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center mb-6">What You've Accomplished</h3>
          
          <div className="grid gap-4">
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                Paradigm Shift Complete
              </h4>
              <p className="text-sm">You've moved from deficit-thinking to strength-based understanding of your brain</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                Self-Awareness Gained
              </h4>
              <p className="text-sm">You understand your unique cognitive profile and processing preferences</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                Strengths Identified
              </h4>
              <p className="text-sm">You can articulate your cognitive superpowers and how they contribute value</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                Foundation Set
              </h4>
              <p className="text-sm">You're ready to build executive functioning systems that work WITH your brain</p>
            </div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <h4 className="font-semibold mb-2">Ready for Module 2?</h4>
            <p className="text-sm text-muted-foreground">
              Next, we'll build executive functioning systems specifically designed for your neurodivergent strengths.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};