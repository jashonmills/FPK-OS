import React from 'react';
import { CheckCircle, Brain, Target, Lightbulb, Users, BookOpen, PlayCircle, Trophy, RefreshCw } from 'lucide-react';
import { MicroLessonData } from '../../MicroLessonContainer';

export const keyConceptsReviewMicroLessons: MicroLessonData = {
  id: 'key-concepts-review',
  moduleTitle: 'Key Concepts Review',
  totalScreens: 8,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Your Learning Journey So Far',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-3xl font-bold">Key Concepts Review</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive review of all core concepts and ideas
            </p>
          </div>
          <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
            <p className="text-center">
              You've covered a lot of ground! Let's review the key concepts from your 
              neurodiversity journey and reinforce how these ideas connect to create 
              a comprehensive understanding of your strengths and learning potential.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 1
    },
    {
      id: 'neurodiversity-foundations',
      type: 'concept',
      title: 'Neurodiversity Foundations',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            What Is Neurodiversity? (Lessons 1-2)
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Core Definition</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Neurodiversity is the natural variation in human brain function and behavior. 
                  It's not a deficit—it's a difference that brings unique strengths and perspectives.
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Paradigm Shift</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  From medical model (what's wrong?) to social model (how can society adapt?) 
                  to strengths-based model (what are your superpowers?).
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Your Brain's Superpowers</h4>
                <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                  <li>• Pattern recognition</li>
                  <li>• Systematic thinking</li>
                  <li>• Attention to detail</li>
                  <li>• Deep focus (hyperfocus)</li>
                  <li>• Creative problem-solving</li>
                  <li>• Authentic communication</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2">Key Takeaway</h4>
            <p className="text-sm">
              Your neurodivergent brain isn't broken or lacking—it's uniquely wired for specific 
              strengths that can be powerful advantages in learning and life.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'learning-foundations',
      type: 'concept',
      title: 'Learning Strategy Foundations',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Foundational Learning Strategies (Lesson 3)
          </h3>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-800 dark:text-red-200 text-sm mb-1">Cognitive Load</h4>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Manage your mental bandwidth by minimizing distractions and chunking information
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm mb-1">Chunking</h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Break complex information into 7±2 manageable pieces for better processing
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-sm mb-1">Spaced Repetition</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Review at increasing intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Learning Environment</h4>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  <li>✓ Consistent study location</li>
                  <li>✓ Optimal lighting and temperature</li>
                  <li>✓ Minimal visual distractions</li>
                  <li>✓ Sensory considerations</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Metacognition</h4>
                <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                  <li>• Planning: Set goals and strategies</li>
                  <li>• Monitoring: Track progress and adjust</li>
                  <li>• Evaluating: Reflect and improve</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2">Key Takeaway</h4>
            <p className="text-sm">
              Learning strategies work best when they're tailored to your brain's specific wiring. 
              Use systematic approaches that leverage your natural strengths.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'fpk-advantage-review',
      type: 'concept',
      title: 'The FPK University Advantage',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-primary" />
            Why FPK University Works for Your Brain (Lesson 4)
          </h3>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400">Universal Design for Learning</h4>
                <div className="space-y-2">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Multiple Representations</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Visual, auditory, and interactive content</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200 font-medium">Multiple Engagement</p>
                    <p className="text-xs text-green-700 dark:text-green-300">Interest-based, relevant examples</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded border border-purple-200 dark:border-purple-800">
                    <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">Multiple Expression</p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Flexible assessment formats</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400">Neurodiverse-Friendly Features</h4>
                <div className="space-y-2">
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded border border-orange-200 dark:border-orange-800">
                    <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">Micro-Learning</p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">Bite-sized, manageable chunks</p>
                  </div>
                  <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded border border-teal-200 dark:border-teal-800">
                    <p className="text-sm text-teal-800 dark:text-teal-200 font-medium">Sensory Control</p>
                    <p className="text-xs text-teal-700 dark:text-teal-300">Customizable interface and pacing</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-800 dark:text-red-200 font-medium">Strength Tracking</p>
                    <p className="text-xs text-red-700 dark:text-red-300">Focus on growth and capabilities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2">Key Takeaway</h4>
            <p className="text-sm">
              FPK University isn't just accessible—it's designed from the ground up to leverage 
              neurodiverse strengths and minimize barriers to learning.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'subject-specific-strategies',
      type: 'concept',
      title: 'Subject-Specific Strengths',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Economics &amp; Logic Excellence (Lessons 5-6)
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Economics Superpowers
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• <strong>Pattern Recognition:</strong> Spotting market trends and cycles</li>
                  <li>• <strong>Systematic Analysis:</strong> Breaking down complex economic systems</li>
                  <li>• <strong>Mathematical Modeling:</strong> Using equations and formulas</li>
                  <li>• <strong>Data Visualization:</strong> Creating and interpreting graphs</li>
                  <li>• <strong>Real-World Application:</strong> Connecting theory to daily life</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Logic &amp; Critical Thinking
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• <strong>Logical Structures:</strong> Following deductive/inductive reasoning</li>
                  <li>• <strong>Fallacy Detection:</strong> Spotting errors in arguments</li>
                  <li>• <strong>Evidence Evaluation:</strong> Assessing source credibility</li>
                  <li>• <strong>Argument Construction:</strong> Building systematic cases</li>
                  <li>• <strong>Problem Solving:</strong> Using the IDEAL method</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Study Strategy Integration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-medium">For Economics:</p>
                <p className="text-xs text-muted-foreground">
                  Use visual graphs, create formula flashcards, analyze real-world scenarios, 
                  and practice with economic data sets.
                </p>
              </div>
              <div>
                <p className="font-medium">For Logic:</p>
                <p className="text-xs text-muted-foreground">
                  Practice argument mapping, create fallacy checklists, evaluate news articles, 
                  and use systematic problem-solving frameworks.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2">Key Takeaway</h4>
            <p className="text-sm">
              Your systematic thinking, pattern recognition, and attention to detail give you 
              natural advantages in analytical subjects like economics and logic.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'integration-connections',
      type: 'example',
      title: 'Connecting All the Pieces',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            How Everything Connects
          </h3>
          
          <div className="space-y-4">
            <p>
              Let's see how all these concepts work together to create a comprehensive approach 
              to leveraging your neurodivergent strengths in learning.
            </p>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">The Integration Flow</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-medium text-sm">Understand Your Brain</p>
                    <p className="text-xs text-muted-foreground">
                      Recognize neurodiversity as strength, identify your specific superpowers
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium text-sm">Build Learning Systems</p>
                    <p className="text-xs text-muted-foreground">
                      Apply cognitive load theory, chunking, spaced repetition, metacognition
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium text-sm">Optimize Your Environment</p>
                    <p className="text-xs text-muted-foreground">
                      Use FPK's neurodiverse-friendly features and customize your learning space
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <p className="font-medium text-sm">Apply to Specific Subjects</p>
                    <p className="text-xs text-muted-foreground">
                      Use systematic thinking for economics and logic, leveraging natural strengths
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <p className="font-medium text-sm">Continuous Growth</p>
                    <p className="text-xs text-muted-foreground">
                      Regular reflection, strategy adjustment, and strength building
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">What You've Gained</h4>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  <li>• New perspective on your brain as an asset</li>
                  <li>• Systematic learning strategies</li>
                  <li>• Understanding of FPK's design advantages</li>
                  <li>• Subject-specific strength applications</li>
                  <li>• Confidence in your learning abilities</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Moving Forward</h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Continue applying these strategies</li>
                  <li>• Adapt techniques to new subjects</li>
                  <li>• Share your insights with others</li>
                  <li>• Advocate for your learning needs</li>
                  <li>• Celebrate your unique strengths</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'practical-application',
      type: 'practice',
      title: 'Practical Application Checklist',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Your Action Plan
          </h3>
          
          <div className="space-y-4">
            <p>
              Let's create a practical checklist for applying everything you've learned. 
              Use this as your ongoing reference guide.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Daily Learning Practices</h4>
                <div className="bg-card p-4 rounded border space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Set up optimal learning environment</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Break study sessions into chunks</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Use spaced repetition for review</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Practice metacognitive reflection</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Customize FPK settings for comfort</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Subject-Specific Applications</h4>
                <div className="bg-card p-4 rounded border space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Apply pattern recognition to economics</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Use systematic approach for logic</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Create visual aids for complex concepts</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Connect theory to real-world examples</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Practice critical evaluation regularly</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Weekly Review Questions</h4>
              <div className="space-y-2 text-sm">
                <p>• What learning strategies worked best this week?</p>
                <p>• Which of my neurodiverse strengths did I utilize most?</p>
                <p>• How can I better optimize my learning environment?</p>
                <p>• What connections did I make between different concepts?</p>
                <p>• What adjustments will I make for next week?</p>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <strong>Remember:</strong> This is your personalized toolkit. Adapt these strategies 
                to fit your unique brain and learning style. What works for you might be different 
                from others—and that's exactly the point!
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'reflection',
      type: 'summary',
      title: 'Your Neurodiverse Learning Foundation',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Celebrating Your Growth
          </h3>
          
          <div className="space-y-4">
            <p>
              You've built a comprehensive understanding of how to leverage your neurodiverse 
              strengths for academic success. This foundation will serve you throughout your 
              educational journey and beyond.
            </p>
            
            <div className="bg-card p-6 rounded-lg border space-y-4">
              <h4 className="font-semibold">Final Reflection Questions:</h4>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">1. Your Transformation</p>
                  <p className="text-xs text-muted-foreground">
                    How has your understanding of your brain and learning abilities changed 
                    throughout this course? What shift in perspective has been most significant?
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">2. Your Superpowers</p>
                  <p className="text-xs text-muted-foreground">
                    Which of your neurodiverse strengths are you most excited to develop further? 
                    How will you continue building on these abilities?
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">3. Your Future</p>
                  <p className="text-xs text-muted-foreground">
                    How will you apply what you've learned to your future courses and career goals? 
                    What impact do you want to make using your unique strengths?
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <strong>You are ready!</strong> You have the knowledge, strategies, and mindset to thrive 
                academically. Your neurodivergent brain is an asset that will serve you well. 
                Go forward with confidence and continue celebrating your unique strengths!
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    }
  ]
};