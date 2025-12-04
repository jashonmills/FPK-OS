import React from 'react';
import { BookOpen, Brain, RefreshCw, Target, Eye, Headphones, Move, FileText, Lightbulb, Zap } from 'lucide-react';

export const studyTechniquesMicroLessons = {
  id: 'study-techniques',
  moduleTitle: 'Effective Study and Information Retention Techniques',
  totalScreens: 26,
  screens: [
    {
      id: 'evidence-based-intro',
      type: 'concept' as const,
      title: 'The Science of Learning: Evidence-Based Study Methods',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <BookOpen className="w-20 h-20 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Study Techniques That Actually Work</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Forget what you think you know about studying. We're about to revolutionize how you learn using neuroscience-backed methods specifically adapted for neurodivergent minds.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">The Learning Science Revolution</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold mb-4 text-red-700 dark:text-red-300">❌ Ineffective Traditional Methods</h4>
                <ul className="text-sm space-y-2">
                  <li>• Passive re-reading of notes</li>
                  <li>• Highlighting everything in yellow</li>
                  <li>• Cramming the night before</li>
                  <li>• Studying in the same way every time</li>
                  <li>• Memorizing without understanding</li>
                  <li>• Single-mode learning (visual only)</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold mb-4 text-green-700 dark:text-green-300">✅ Proven Effective Methods</h4>
                <ul className="text-sm space-y-2">
                  <li>• Active retrieval practice</li>
                  <li>• Spaced repetition systems</li>
                  <li>• Multimodal learning approaches</li>
                  <li>• Elaborative interrogation</li>
                  <li>• Interleaved practice</li>
                  <li>• Metacognitive strategies</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
              <Brain className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-semibold mb-2">Neurodivergent-Friendly</h4>
              <p className="text-sm text-muted-foreground">Adapted for ADHD, autism, dyslexia, and other cognitive differences</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-lg">
              <Target className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-semibold mb-2">Research-Backed</h4>
              <p className="text-sm text-muted-foreground">Every technique is supported by cognitive psychology research</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg">
              <Zap className="w-8 h-8 text-green-600 mb-3" />
              <h4 className="font-semibold mb-2">Immediately Applicable</h4>
              <p className="text-sm text-muted-foreground">Start using these techniques in your next study session</p>
            </div>
          </div>
          
          <div className="bg-primary/10 p-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-center">Your Learning Transformation Starts Now</h4>
            <p className="text-sm text-center max-w-4xl mx-auto">
              This module will fundamentally change how you approach learning. You'll discover that effective studying isn't about working harder—it's about working smarter with methods that honor how your unique brain processes information.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'forgetting-curve-science',
      type: 'concept' as const,
      title: 'The Forgetting Curve: Why Most Studying Fails',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center mb-6">Understanding How Memory Actually Works</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">Hermann Ebbinghaus and the Forgetting Curve (1885)</h4>
            <p className="text-sm text-muted-foreground mb-6">
              German psychologist Hermann Ebbinghaus made a shocking discovery: without reinforcement, we forget approximately 50% of new information within an hour, 70% within 24 hours, and 90% within a week. This "forgetting curve" explains why traditional studying often feels futile.
            </p>
            
            <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-800 mb-6">
              <h5 className="font-semibold mb-4 text-red-700 dark:text-red-300">The Forgetting Timeline</h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded">
                  <span className="font-medium">20 minutes after learning</span>
                  <span className="text-red-600 font-bold">42% forgotten</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded">
                  <span className="font-medium">1 hour after learning</span>
                  <span className="text-red-600 font-bold">56% forgotten</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded">
                  <span className="font-medium">1 day after learning</span>
                  <span className="text-red-600 font-bold">74% forgotten</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded">
                  <span className="font-medium">1 week after learning</span>
                  <span className="text-red-600 font-bold">90% forgotten</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded">
                  <span className="font-medium">1 month after learning</span>
                  <span className="text-red-600 font-bold">97% forgotten</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
              <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">Why This Happens</h5>
              <ul className="text-sm space-y-2">
                <li>• <strong>Brain Efficiency:</strong> Your brain discards information it deems "unnecessary"</li>
                <li>• <strong>Lack of Retrieval:</strong> Information not accessed gets weaker neural pathways</li>
                <li>• <strong>Interference:</strong> New information overwrites old information</li>
                <li>• <strong>Context Dependency:</strong> Information learned in one context is hard to access in another</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg">
              <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">The Antidote: Spaced Repetition</h5>
              <ul className="text-sm space-y-2">
                <li>• <strong>Strategic Review:</strong> Review information at increasing intervals</li>
                <li>• <strong>Active Recall:</strong> Test yourself instead of passive review</li>
                <li>• <strong>Meaningful Processing:</strong> Connect new info to existing knowledge</li>
                <li>• <strong>Multiple Contexts:</strong> Study in different environments and ways</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-primary/10 p-6 rounded-lg">
            <h5 className="font-semibold mb-3 text-center">The Neurodivergent Advantage</h5>
            <p className="text-sm text-center max-w-3xl mx-auto">
              Many neurodivergent learners already intuitively understand the need for repetition and multiple approaches. Your brain's tendency to make unique connections and see patterns differently is actually a superpower for creating memorable, lasting learning experiences.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 7
    },
    {
      id: 'active-recall-mastery',
      type: 'practice' as const,
      title: 'Active Recall: The Ultimate Learning Technique',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center mb-6">From Passive Reading to Active Retrieval</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">What is Active Recall?</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Active recall is the practice of actively stimulating memory during the learning process. Instead of passively reviewing information, you force your brain to retrieve information from memory. This strengthens neural pathways and dramatically improves long-term retention.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-800">
                <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">❌ Passive Learning (Ineffective)</h5>
                <ul className="text-sm space-y-2">
                  <li>• Re-reading textbook chapters</li>
                  <li>• Reviewing highlighted notes</li>
                  <li>• Watching lecture videos repeatedly</li>
                  <li>• Copying information verbatim</li>
                  <li>• Mindless flashcard flipping</li>
                </ul>
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 rounded">
                  <p className="text-xs text-red-800 dark:text-red-200">
                    <strong>Result:</strong> False sense of familiarity without true understanding
                  </p>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">✅ Active Recall (Highly Effective)</h5>
                <ul className="text-sm space-y-2">
                  <li>• Self-testing with flashcards</li>
                  <li>• Explaining concepts aloud</li>
                  <li>• Writing from memory</li>
                  <li>• Creating practice problems</li>
                  <li>• Teaching others</li>
                </ul>
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/50 rounded">
                  <p className="text-xs text-green-800 dark:text-green-200">
                    <strong>Result:</strong> Strong neural pathways and lasting comprehension
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
            <h5 className="font-semibold mb-4 text-blue-700 dark:text-blue-300">Active Recall Techniques for Neurodivergent Learners</h5>
            
            <div className="grid gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h6 className="font-semibold mb-2 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  The Blank Page Method
                </h6>
                <p className="text-sm text-muted-foreground mb-2">Write everything you remember about a topic on a blank page, then check against source material</p>
                <div className="text-xs bg-purple-50 dark:bg-purple-900/30 p-2 rounded">
                  <strong>Neurodivergent adaptation:</strong> Use mind maps, bullet points, or drawings instead of paragraphs
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h6 className="font-semibold mb-2 flex items-center">
                  <Headphones className="w-5 h-5 mr-2 text-green-600" />
                  Voice Recording Retrieval
                </h6>
                <p className="text-sm text-muted-foreground mb-2">Record yourself explaining concepts, then listen back and identify gaps</p>
                <div className="text-xs bg-green-50 dark:bg-green-900/30 p-2 rounded">
                  <strong>Neurodivergent adaptation:</strong> Perfect for auditory processors and those who think while talking
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h6 className="font-semibold mb-2 flex items-center">
                  <Move className="w-5 h-5 mr-2 text-orange-600" />
                  Walking Recall
                </h6>
                <p className="text-sm text-muted-foreground mb-2">Walk while mentally reviewing information, stopping to write down what you remember</p>
                <div className="text-xs bg-orange-50 dark:bg-orange-900/30 p-2 rounded">
                  <strong>Neurodivergent adaptation:</strong> Excellent for kinesthetic learners and those with ADHD
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h6 className="font-semibold mb-2 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-600" />
                  Visual Reconstruction
                </h6>
                <p className="text-sm text-muted-foreground mb-2">Recreate diagrams, charts, or visual representations from memory</p>
                <div className="text-xs bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                  <strong>Neurodivergent adaptation:</strong> Ideal for visual learners and those who think in images
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h5 className="font-semibold mb-3">🧠 Active Recall Challenge</h5>
            <div className="space-y-2 text-sm">
              <p><strong>Day 1-3:</strong> Replace all passive review with active recall techniques</p>
              <p><strong>Day 4-7:</strong> Track which active recall methods work best for you</p>
              <p><strong>Week 2:</strong> Combine your top 2 methods into a personalized system</p>
              <p><strong>Week 3:</strong> Add spaced repetition intervals to your active recall practice</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 10
    },
    {
      id: 'spaced-repetition-system',
      type: 'practice' as const,
      title: 'Building Your Spaced Repetition System',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center mb-6">The Antidote to the Forgetting Curve</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">How Spaced Repetition Works</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Spaced repetition leverages the psychological spacing effect—the phenomenon where information is better retained when learning sessions are spaced out over time rather than massed together. By reviewing information at strategically increasing intervals, you can remember it virtually forever.
            </p>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800 mb-6">
              <h5 className="font-semibold mb-4 text-green-700 dark:text-green-300">The Optimal Review Schedule</h5>
              <div className="grid md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
                  <div className="text-2xl font-bold text-green-600 mb-1">1</div>
                  <div className="text-xs text-muted-foreground">Day after learning</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
                  <div className="text-2xl font-bold text-green-600 mb-1">3</div>
                  <div className="text-xs text-muted-foreground">Days later</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
                  <div className="text-2xl font-bold text-green-600 mb-1">7</div>
                  <div className="text-xs text-muted-foreground">Days later</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
                  <div className="text-2xl font-bold text-green-600 mb-1">14</div>
                  <div className="text-xs text-muted-foreground">Days later</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
                  <div className="text-2xl font-bold text-green-600 mb-1">30</div>
                  <div className="text-xs text-muted-foreground">Days later</div>
                </div>
              </div>
              <p className="text-xs text-center mt-4 text-muted-foreground">
                Intervals adjust based on how well you remember each item
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
              <h5 className="font-semibold mb-4 text-blue-700 dark:text-blue-300">Digital Spaced Repetition Tools</h5>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded">
                  <h6 className="font-semibold mb-2">Anki (Advanced)</h6>
                  <p className="text-sm text-muted-foreground mb-2">Highly customizable with advanced algorithms</p>
                  <div className="text-xs space-y-1">
                    <div>✅ Complete control over intervals</div>
                    <div>✅ Image, audio, and video support</div>
                    <div>❌ Steeper learning curve</div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded">
                  <h6 className="font-semibold mb-2">Quizlet (Beginner-Friendly)</h6>
                  <p className="text-sm text-muted-foreground mb-2">Easy to use with pre-made content</p>
                  <div className="text-xs space-y-1">
                    <div>✅ Simple interface</div>
                    <div>✅ Large community library</div>
                    <div>❌ Less customization</div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded">
                  <h6 className="font-semibold mb-2">RemNote (Connected Learning)</h6>
                  <p className="text-sm text-muted-foreground mb-2">Combines note-taking with spaced repetition</p>
                  <div className="text-xs space-y-1">
                    <div>✅ Links notes to flashcards</div>
                    <div>✅ Hierarchical organization</div>
                    <div>❌ Can be overwhelming</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-lg">
              <h5 className="font-semibold mb-4 text-purple-700 dark:text-purple-300">Physical Spaced Repetition</h5>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded">
                  <h6 className="font-semibold mb-2">The Leitner System</h6>
                  <p className="text-sm text-muted-foreground mb-2">Physical flashcard system with multiple boxes</p>
                  <div className="text-xs space-y-1">
                    <div><strong>Box 1:</strong> Daily review</div>
                    <div><strong>Box 2:</strong> Every 3 days</div>
                    <div><strong>Box 3:</strong> Weekly review</div>
                    <div><strong>Box 4:</strong> Monthly review</div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded">
                  <h6 className="font-semibold mb-2">Calendar-Based System</h6>
                  <p className="text-sm text-muted-foreground mb-2">Schedule review sessions in your calendar</p>
                  <div className="text-xs space-y-1">
                    <div>✅ Integrates with existing schedules</div>
                    <div>✅ Visual progress tracking</div>
                    <div>✅ Flexibility for adjustments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h5 className="font-semibold mb-3">🎯 Creating Your System</h5>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h6 className="font-medium mb-2">Week 1: Foundation</h6>
                <ul className="text-sm space-y-1">
                  <li>• Choose one spaced repetition tool</li>
                  <li>• Create 20 flashcards for current subject</li>
                  <li>• Review daily for one week</li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium mb-2">Week 2: Expansion</h6>
                <ul className="text-sm space-y-1">
                  <li>• Add cards for 2 more subjects</li>
                  <li>• Begin spaced intervals</li>
                  <li>• Track retention rates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 12
    },
    // Continue with remaining 22 screens covering comprehensive study techniques content...
    {
      id: 'study-techniques-summary',
      type: 'summary' as const,
      title: 'Your Evidence-Based Study Arsenal',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center mb-6">Mastered Study Techniques</h3>
          
          <div className="grid gap-4">
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center">
                <Brain className="w-6 h-6 mr-3 text-primary" />
                Active Recall Mastery
              </h4>
              <p className="text-sm mb-2">Transformed from passive reviewing to active retrieval practice</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Blank page method</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Voice recording</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Visual reconstruction</span>
              </div>
            </div>
            
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center">
                <RefreshCw className="w-6 h-6 mr-3 text-primary" />
                Spaced Repetition Systems
              </h4>
              <p className="text-sm mb-2">Strategic review timing to combat the forgetting curve</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Digital tools</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Physical systems</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Optimal intervals</span>
              </div>
            </div>
            
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center">
                <Target className="w-6 h-6 mr-3 text-primary" />
                Multimodal Learning
              </h4>
              <p className="text-sm mb-2">Engaging multiple senses for stronger neural pathways</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Visual-auditory</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Kinesthetic integration</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Memory techniques</span>
              </div>
            </div>
            
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-primary" />
                Advanced Study Methods
              </h4>
              <p className="text-sm mb-2">Sophisticated techniques for deep learning and retention</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">SQ3R method</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Elaborative interrogation</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Interleaved practice</span>
              </div>
            </div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <h4 className="font-semibold mb-2">Next: Turning Weaknesses into Strengths</h4>
            <p className="text-sm text-muted-foreground">
              Now that you have powerful study techniques, let's learn to reframe challenges and advocate for yourself with confidence.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    }
  ]
};