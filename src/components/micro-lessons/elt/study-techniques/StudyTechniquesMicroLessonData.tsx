import React from 'react';
import { BookOpen, Brain, RefreshCw, Target } from 'lucide-react';

export const studyTechniquesMicroLessons = {
  id: 'study-techniques',
  moduleTitle: 'Effective Study and Information Retention Techniques',
  totalScreens: 7,
  screens: [
    {
      id: 'intro',
      type: 'concept' as const,
      title: 'Evidence-Based Study Methods',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Study Techniques That Actually Work</h2>
            <p className="text-lg text-muted-foreground">
              Learn research-backed methods specifically adapted for neurodiverse learners.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">What Makes Study Techniques Effective?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Brain className="w-5 h-5 text-primary" />
                <span>Works with your brain type</span>
              </div>
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-primary" />
                <span>Uses spaced repetition</span>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-primary" />
                <span>Targets multiple senses</span>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>Connects to prior knowledge</span>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'active-reading',
      type: 'practice' as const,
      title: 'Active Reading Strategies',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">The SQ3R Method (Modified)</h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">S - Survey</h4>
              <p className="text-sm">Scan headings, subheadings, images, and summary first. Get the big picture!</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">Q - Question</h4>
              <p className="text-sm">Turn headings into questions. "What is photosynthesis?" instead of just "Photosynthesis"</p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">R1 - Read</h4>
              <p className="text-sm">Read actively, looking for answers to your questions. Use multiple colors for highlighting.</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">R2 - Recite</h4>
              <p className="text-sm">Say the answers out loud or write them down. Multi-sensory processing!</p>
            </div>
            
            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold mb-2 text-red-700 dark:text-red-300">R3 - Review</h4>
              <p className="text-sm">Review within 24 hours, then again in a week. Spaced repetition is key!</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'note-taking-systems',
      type: 'practice' as const,
      title: 'Note-Taking Systems',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Choose Your Note-Taking Style</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Cornell Notes (Structured)</h4>
              <div className="bg-muted p-3 rounded mb-3">
                <div className="text-xs mb-2 font-medium">Notes Section</div>
                <div className="text-xs mb-2">• Main ideas and details</div>
                <div className="text-xs mb-2">• Examples and explanations</div>
                <hr className="my-2" />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="font-medium">Cue Column</div>
                    <div>Questions, keywords</div>
                  </div>
                  <div>
                    <div className="font-medium">Summary</div>
                    <div>Main points</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Great for linear thinkers and lecture notes</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Mind Maps (Visual)</h4>
              <div className="bg-muted p-3 rounded mb-3">
                <div className="text-center mb-2">
                  <div className="inline-block bg-primary text-primary-foreground px-2 py-1 rounded text-xs">Central Topic</div>
                </div>
                <div className="flex justify-around text-xs">
                  <div>Branch 1</div>
                  <div>Branch 2</div>
                  <div>Branch 3</div>
                </div>
                <div className="flex justify-around text-xs mt-1">
                  <div>• Detail</div>
                  <div>• Detail</div>
                  <div>• Detail</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Perfect for visual learners and complex relationships</p>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">💡 Neurodiverse-Friendly Tips</h5>
            <ul className="text-sm space-y-1">
              <li>• Use colors to categorize information</li>
              <li>• Leave white space - don't crowd your notes</li>
              <li>• Include doodles and symbols if they help</li>
              <li>• Try digital tools for flexible formatting</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'memory-techniques',
      type: 'practice' as const,
      title: 'Memory Enhancement Techniques',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Make Information Stick</h3>
          
          <div className="grid gap-4">
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-3">The Method of Loci (Memory Palace)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Associate information with familiar locations in your mind.
              </p>
              <div className="bg-muted p-3 rounded">
                <p className="text-sm"><strong>Example:</strong> To remember the planets, imagine walking through your house:</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Front door: Mercury (quick to answer)</li>
                  <li>• Living room: Venus (beautiful space)</li>
                  <li>• Kitchen: Earth (where life happens)</li>
                  <li>• Bedroom: Mars (red sheets)</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-3">Acronyms & Mnemonics</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded">
                  <h5 className="font-medium mb-2">PEMDAS (Math Order)</h5>
                  <p className="text-xs">"Please Excuse My Dear Aunt Sally"</p>
                  <p className="text-xs text-muted-foreground">Parentheses, Exponents, Multiplication, Division, Addition, Subtraction</p>
                </div>
                <div className="bg-muted p-3 rounded">
                  <h5 className="font-medium mb-2">HOMES (Great Lakes)</h5>
                  <p className="text-xs">Huron, Ontario, Michigan, Erie, Superior</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-3">Chunking & Patterns</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Break large amounts of information into smaller, meaningful groups.
              </p>
              <div className="bg-muted p-3 rounded">
                <p className="text-sm"><strong>Phone Number:</strong> 555-867-5309</p>
                <p className="text-xs text-muted-foreground">Instead of: 5558675309</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'spaced-repetition',
      type: 'concept' as const,
      title: 'Spaced Repetition System',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">The Forgetting Curve</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">Why We Forget</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Without review, we forget 50% of new information within an hour, and 90% within a week!
            </p>
            
            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg mb-4">
              <h5 className="font-semibold mb-2 text-red-700 dark:text-red-300">The Problem</h5>
              <div className="text-sm space-y-1">
                <div>Day 1: Learn 100% ➜ Remember 50%</div>
                <div>Day 2: Remember 30%</div>
                <div>Day 7: Remember 10%</div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <h5 className="font-semibold mb-2 text-green-700 dark:text-green-300">The Solution: Spaced Review</h5>
              <div className="text-sm space-y-1">
                <div>• Review after 1 day</div>
                <div>• Review after 3 days</div>
                <div>• Review after 1 week</div>
                <div>• Review after 2 weeks</div>
                <div>• Review after 1 month</div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">Digital Tools for Spaced Repetition</h5>
            <ul className="text-sm space-y-1">
              <li>• Anki (advanced, customizable)</li>
              <li>• Quizlet (user-friendly)</li>
              <li>• RemNote (for linked notes)</li>
              <li>• Simple calendar reminders</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'multimodal-learning',
      type: 'practice' as const,
      title: 'Multimodal Learning Strategies',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Engage All Your Senses</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Visual + Auditory</h4>
              <ul className="text-sm space-y-2">
                <li>• Watch videos with subtitles</li>
                <li>• Read aloud while highlighting</li>
                <li>• Use colorful diagrams with verbal explanations</li>
                <li>• Create audio recordings of your notes</li>
              </ul>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Kinesthetic + Visual</h4>
              <ul className="text-sm space-y-2">
                <li>• Walk while studying (movement + learning)</li>
                <li>• Use manipulatives for math concepts</li>
                <li>• Act out historical events or processes</li>
                <li>• Build 3D models or use clay</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">The Power of Multiple Pathways</h5>
            <p className="text-sm">
              When you engage multiple senses, you create more neural pathways to the same information. 
              This makes recall easier and more reliable, especially under stress (like during tests)!
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-3">Study Session Template</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-muted rounded">
                <span>1. Preview (Visual)</span>
                <span>5 min</span>
              </div>
              <div className="flex justify-between p-2 bg-muted rounded">
                <span>2. Read + Listen (Auditory)</span>
                <span>15 min</span>
              </div>
              <div className="flex justify-between p-2 bg-muted rounded">
                <span>3. Take Notes (Kinesthetic)</span>
                <span>10 min</span>
              </div>
              <div className="flex justify-between p-2 bg-muted rounded">
                <span>4. Teach Back (All Senses)</span>
                <span>10 min</span>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'study-techniques-summary',
      type: 'summary' as const,
      title: 'Your Study Arsenal',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center mb-6">Evidence-Based Techniques You've Mastered</h3>
          
          <div className="grid gap-4">
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                Active Reading (SQ3R)
              </h4>
              <p className="text-sm">Survey, Question, Read, Recite, Review for deep comprehension</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-primary" />
                Memory Techniques
              </h4>
              <p className="text-sm">Memory palace, mnemonics, and chunking for better retention</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <RefreshCw className="w-5 h-5 mr-2 text-primary" />
                Spaced Repetition
              </h4>
              <p className="text-sm">Strategic review timing to combat the forgetting curve</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Multimodal Learning
              </h4>
              <p className="text-sm">Engaging multiple senses for stronger neural pathways</p>
            </div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <h4 className="font-semibold mb-2">Next: Turning Weaknesses into Strengths</h4>
            <p className="text-sm text-muted-foreground">
              Now let's learn how to reframe challenges and advocate for yourself!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};