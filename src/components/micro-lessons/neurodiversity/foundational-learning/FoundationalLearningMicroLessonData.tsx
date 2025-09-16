import React from 'react';
import { BookOpen, Brain, Target, Lightbulb, CheckCircle, Users, Timer, Zap } from 'lucide-react';
import { MicroLessonData } from '../../MicroLessonContainer';

export const foundationalLearningMicroLessons: MicroLessonData = {
  id: 'foundational-learning-strategies',
  moduleTitle: 'Foundational Learning Strategies',
  totalScreens: 8,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Building Your Learning Operating System',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <Brain className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-3xl font-bold">Foundational Learning Strategies</h2>
            <p className="text-lg text-muted-foreground">
              Build your personal operating system for effective learning
            </p>
          </div>
          <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
            <p className="text-center">
              Just like your computer needs an operating system to run programs efficiently, 
              your brain needs learning strategies to process information effectively. 
              Let's build your personalized learning OS!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 1
    },
    {
      id: 'understanding-systems',
      type: 'concept',
      title: 'Understanding Learning Systems',
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                What Are Learning Systems?
              </h3>
              <p>
                Learning systems are structured approaches that help you:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Process information more efficiently</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Retain knowledge longer</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Reduce cognitive overload</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Build on your natural strengths</span>
                </li>
              </ul>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Your Unique Brain Advantage</h4>
              <p className="text-sm text-muted-foreground">
                Neurodiverse brains often excel at pattern recognition, 
                systematic thinking, and deep focus. We'll use these 
                strengths as the foundation of your learning system.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'cognitive-load-theory',
      type: 'concept',
      title: 'Managing Cognitive Load',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Understanding Your Mental Bandwidth
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Extraneous Load</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Unnecessary mental effort caused by poor presentation or distractions
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Intrinsic Load</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Mental effort required by the complexity of the material itself
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Germane Load</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Productive mental effort that builds understanding and creates schemas
              </p>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <p className="text-sm">
              <strong>Key Strategy:</strong> Minimize extraneous load, manage intrinsic load through chunking, 
              and maximize germane load through active learning techniques.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'chunking-strategies',
      type: 'example',
      title: 'The Power of Chunking',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Breaking Information Into Digestible Pieces
          </h3>
          
          <div className="space-y-4">
            <p>Chunking is breaking complex information into smaller, manageable pieces. Here's how:</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Before Chunking:</h4>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200 font-mono">
                    SUPPLYDEMANDEQUILIBRIUMELASTICITYCONSUMERPRODUCERSURPLUS
                  </p>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400">Overwhelming and hard to process</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">After Chunking:</h4>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800 space-y-1">
                  <div className="text-sm text-green-800 dark:text-green-200 font-mono">SUPPLY | DEMAND</div>
                  <div className="text-sm text-green-800 dark:text-green-200 font-mono">EQUILIBRIUM | ELASTICITY</div>
                  <div className="text-sm text-green-800 dark:text-green-200 font-mono">CONSUMER | PRODUCER | SURPLUS</div>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">Clear, organized, and manageable</p>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Try This: The 7±2 Rule</h4>
              <p className="text-sm text-muted-foreground">
                Your working memory can hold about 7 (±2) pieces of information at once. 
                Use this as your chunking guideline!
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'spaced-repetition',
      type: 'concept',
      title: 'Spaced Repetition System',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Timer className="w-5 h-5 text-primary" />
            The Science of Forgetting and Remembering
          </h3>
          
          <div className="space-y-4">
            <p>
              The forgetting curve shows we lose information rapidly without reinforcement. 
              Spaced repetition counters this by reviewing information at increasing intervals.
            </p>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Optimal Review Schedule:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span className="text-sm">Review after 1 day</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-sm">Review after 3 days</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">7</div>
                  <span className="text-sm">Review after 1 week</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">14</div>
                  <span className="text-sm">Review after 2 weeks</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">30</div>
                  <span className="text-sm">Review after 1 month</span>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Pro Tip:</strong> Use active recall during reviews. Don't just re-read—
                test yourself on the material without looking at your notes first.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'learning-environment',
      type: 'practice',
      title: 'Optimizing Your Learning Environment',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Creating Your Ideal Learning Space
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600 dark:text-green-400">✓ Environment Enhancers</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Consistent study location</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Adequate lighting (preferably natural)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Comfortable temperature (68-72°F)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Minimal visual distractions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Background noise that helps you focus</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>All materials within reach</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-red-600 dark:text-red-400">✗ Environment Detractors</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  <span>Social media notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  <span>Cluttered or messy space</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  <span>Inconsistent study locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  <span>Poor lighting or glare</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  <span>Uncomfortable seating</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  <span>Distracting conversations nearby</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Sensory Considerations for Neurodiverse Learners</h4>
            <p className="text-sm text-muted-foreground">
              Pay special attention to sensory factors like texture, sound levels, and lighting. 
              What might be minor distractions for others can be major barriers for neurodiverse brains.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'metacognition',
      type: 'concept',
      title: 'Metacognitive Strategies',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Thinking About Your Thinking
          </h3>
          
          <div className="space-y-4">
            <p>
              Metacognition is awareness and understanding of your own thought processes. 
              It's like having a "thinking about thinking" superpower!
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Planning</h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Set learning goals</li>
                  <li>• Choose strategies</li>
                  <li>• Allocate time</li>
                  <li>• Predict challenges</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Monitoring</h4>
                <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Track progress</li>
                  <li>• Notice confusion</li>
                  <li>• Assess understanding</li>
                  <li>• Adjust strategies</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Evaluating</h4>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  <li>• Reflect on results</li>
                  <li>• Identify what worked</li>
                  <li>• Learn from mistakes</li>
                  <li>• Plan improvements</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">Self-Questioning Technique</h4>
              <p className="text-sm mb-2">Use these questions to develop metacognitive awareness:</p>
              <ul className="text-sm space-y-1">
                <li>• "What do I already know about this topic?"</li>
                <li>• "What strategy should I use here?"</li>
                <li>• "Am I understanding this correctly?"</li>
                <li>• "How can I check my understanding?"</li>
                <li>• "What would I do differently next time?"</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'reflection',
      type: 'summary',
      title: 'Building Your Personal Learning System',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Your Learning Strategy Toolkit
          </h3>
          
          <div className="space-y-4">
            <p>
              Now that you've learned about foundational learning strategies, 
              it's time to create your personalized learning system.
            </p>
            
            <div className="bg-card p-6 rounded-lg border space-y-4">
              <h4 className="font-semibold">Reflection Questions:</h4>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">1. Cognitive Load Management</p>
                  <p className="text-xs text-muted-foreground">
                    Which cognitive load strategies resonate most with how your brain works? 
                    How will you implement chunking in your daily learning?
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">2. Learning Environment</p>
                  <p className="text-xs text-muted-foreground">
                    What does your ideal learning environment look like? 
                    What changes will you make to optimize your current space?
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">3. Metacognitive Awareness</p>
                  <p className="text-xs text-muted-foreground">
                    Which self-questioning techniques will you practice? 
                    How will you monitor your learning progress?
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <strong>Remember:</strong> Your learning system should be as unique as your brain. 
                Experiment with these strategies and adapt them to work best for you!
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    }
  ]
};