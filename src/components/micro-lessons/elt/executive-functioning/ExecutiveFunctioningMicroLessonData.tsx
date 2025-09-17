import React from 'react';
import { Target, Calendar, CheckSquare, Clock, Brain, Zap, Settings, ListChecks, Timer, Focus } from 'lucide-react';

export const executiveFunctioningMicroLessons = {
  id: 'executive-functioning',
  moduleTitle: 'Mastering Executive Functioning Skills',
  totalScreens: 22,
  screens: [
    {
      id: 'executive-function-intro',
      type: 'concept' as const,
      title: 'Your Brain\'s CEO: Understanding Executive Function',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Target className="w-20 h-20 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Meet Your Inner CEO</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Executive functioning is like having a CEO in your brain who manages planning, organizing, decision-making, and getting things done. For neurodivergent learners, this CEO might work differently—and that's where we'll build systems that honor your unique style.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">The Executive Function Suite</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
                <Brain className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-semibold mb-2">Working Memory</h4>
                <p className="text-sm text-muted-foreground">Your mental workspace for holding and manipulating information</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg">
                <Zap className="w-8 h-8 text-green-600 mb-3" />
                <h4 className="font-semibold mb-2">Cognitive Flexibility</h4>
                <p className="text-sm text-muted-foreground">Your ability to switch between tasks and adapt to change</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-lg">
                <Settings className="w-8 h-8 text-purple-600 mb-3" />
                <h4 className="font-semibold mb-2">Inhibitory Control</h4>
                <p className="text-sm text-muted-foreground">Your ability to resist impulses and stay focused</p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-950/30 p-6 rounded-lg">
                <ListChecks className="w-8 h-8 text-yellow-600 mb-3" />
                <h4 className="font-semibold mb-2">Planning & Prioritizing</h4>
                <p className="text-sm text-muted-foreground">Your ability to set goals and organize steps</p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg">
                <Timer className="w-8 h-8 text-red-600 mb-3" />
                <h4 className="font-semibold mb-2">Time Management</h4>
                <p className="text-sm text-muted-foreground">Your ability to estimate and manage time effectively</p>
              </div>
              
              <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-lg">
                <Focus className="w-8 h-8 text-indigo-600 mb-3" />
                <h4 className="font-semibold mb-2">Task Initiation</h4>
                <p className="text-sm text-muted-foreground">Your ability to begin tasks and overcome procrastination</p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-center">Why This Matters for Neurodivergent Learners</h4>
            <p className="text-sm text-center max-w-4xl mx-auto">
              Many neurodivergent individuals have executive functioning differences—not deficits! Your brain might excel in some areas while needing support in others. This module will help you build external systems and internal strategies that work WITH your unique cognitive style, not against it.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'working-memory-deep-dive',
      type: 'concept' as const,
      title: 'Working Memory: Your Mental Workspace',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center mb-6">Understanding Your Mental Workspace</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">What is Working Memory?</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Working memory is like your brain's sticky notes—it temporarily holds information while you use it. It's where you mentally manipulate information, make connections, and solve problems. Many neurodivergent learners have working memory differences that require specific strategies.
            </p>
            
            <div className="bg-muted p-6 rounded-lg mb-6">
              <h5 className="font-semibold mb-3">Working Memory in Action</h5>
              <div className="space-y-3 text-sm">
                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                  <strong>Math Problem:</strong> "What's 47 + 38?"
                  <p className="text-muted-foreground mt-1">Working memory holds "47" and "38" while you calculate, carry numbers, and arrive at "85"</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                  <strong>Following Directions:</strong> "Go to your locker, get your science book, then meet at room 204"
                  <p className="text-muted-foreground mt-1">Working memory holds all three steps while you execute them in order</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                  <strong>Reading Comprehension:</strong> Understanding a paragraph
                  <p className="text-muted-foreground mt-1">Working memory holds earlier sentences while processing new ones to build meaning</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-800">
              <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">Signs of Working Memory Challenges</h5>
              <ul className="text-sm space-y-2">
                <li>• Forgetting instructions by the time you start</li>
                <li>• Losing track mid-sentence when speaking</li>
                <li>• Difficulty with mental math</li>
                <li>• Trouble following multi-step directions</li>
                <li>• Getting lost in complex reading passages</li>
                <li>• Difficulty taking notes while listening</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">Working Memory Strengths</h5>
              <ul className="text-sm space-y-2">
                <li>• Strong pattern recognition abilities</li>
                <li>• Excellent long-term memory for interests</li>
                <li>• Creative connections between ideas</li>
                <li>• Ability to see big-picture relationships</li>
                <li>• Innovative problem-solving approaches</li>
                <li>• Deep processing of meaningful information</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-primary/10 p-6 rounded-lg">
            <h5 className="font-semibold mb-3 text-center">The Good News</h5>
            <p className="text-sm text-center max-w-3xl mx-auto">
              Working memory challenges are completely manageable with the right strategies! External supports can act as extensions of your working memory, and specific techniques can help you maximize your natural cognitive strengths.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 7
    },
    {
      id: 'external-memory-systems',
      type: 'practice' as const,
      title: 'Building External Memory Systems',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center mb-6">Extending Your Brain with External Tools</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">The Philosophy: External = Internal</h4>
            <p className="text-sm text-muted-foreground mb-6">
              External memory tools aren't "cheating"—they're smart! Just like glasses help you see better, external memory systems help your working memory function better. The goal is to free up your cognitive resources for higher-level thinking and creativity.
            </p>
            
            <div className="grid gap-6">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
                <h5 className="font-semibold mb-4 text-blue-700 dark:text-blue-300">Digital External Memory</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-2">Note-Taking Apps</h6>
                    <ul className="text-sm space-y-1">
                      <li>• Notion: All-in-one workspace</li>
                      <li>• Obsidian: Connected thinking</li>
                      <li>• OneNote: Flexible digital notebook</li>
                      <li>• Google Keep: Quick capture</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-2">Task Management</h6>
                    <ul className="text-sm space-y-1">
                      <li>• Todoist: Smart task organization</li>
                      <li>• Things 3: Beautiful simplicity</li>
                      <li>• Asana: Project collaboration</li>
                      <li>• TickTick: Calendar integration</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg">
                <h5 className="font-semibold mb-4 text-green-700 dark:text-green-300">Physical External Memory</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-2">Visual Systems</h6>
                    <ul className="text-sm space-y-1">
                      <li>• Color-coded folders and binders</li>
                      <li>• Whiteboards for daily planning</li>
                      <li>• Sticky notes for quick reminders</li>
                      <li>• Visual schedules and checklists</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-2">Environmental Cues</h6>
                    <ul className="text-sm space-y-1">
                      <li>• Items placed by the door</li>
                      <li>• Alarm clocks in multiple locations</li>
                      <li>• Visual reminders on mirrors</li>
                      <li>• Designated spaces for important items</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-lg">
                <h5 className="font-semibold mb-4 text-purple-700 dark:text-purple-300">Voice and Audio Memory</h5>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <h6 className="font-medium mb-1">Voice Recording</h6>
                    <p className="text-sm text-muted-foreground">Record instructions, ideas, or important information to replay later</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <h6 className="font-medium mb-1">Text-to-Speech</h6>
                    <p className="text-sm text-muted-foreground">Have written instructions read aloud while you work</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <h6 className="font-medium mb-1">Audio Reminders</h6>
                    <p className="text-sm text-muted-foreground">Set up voice reminders with specific context and details</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h5 className="font-semibold mb-3">🏗️ Building Your System</h5>
            <div className="space-y-2 text-sm">
              <p><strong>Step 1:</strong> Choose ONE digital and ONE physical tool to start</p>
              <p><strong>Step 2:</strong> Use them consistently for 2 weeks</p>
              <p><strong>Step 3:</strong> Evaluate what's working and adjust</p>
              <p><strong>Step 4:</strong> Gradually add more tools as needed</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 8
    },
    // Continue with remaining 19 screens covering comprehensive executive functioning content...
    {
      id: 'time-blindness-solutions',
      type: 'practice' as const,
      title: 'Conquering Time Blindness',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center mb-6">Making Time Visible and Manageable</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">Understanding Time Blindness</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Time blindness is the difficulty perceiving how much time has passed or accurately estimating how long tasks will take. It's incredibly common in neurodivergent individuals and often leads to lateness, missed deadlines, and stress. The solution? Make time concrete and visible.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg">
                <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">Time Blindness Challenges</h5>
                <ul className="text-sm space-y-2">
                  <li>• "Just 5 more minutes" becomes an hour</li>
                  <li>• Underestimating how long tasks take</li>
                  <li>• Getting lost in hyperfocus</li>
                  <li>• Chronic lateness despite good intentions</li>
                  <li>• Difficulty with transitions</li>
                  <li>• Procrastination and last-minute rushing</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg">
                <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">Time Awareness Solutions</h5>
                <ul className="text-sm space-y-2">
                  <li>• Multiple timers and visual countdowns</li>
                  <li>• Time-blocking with buffer zones</li>
                  <li>• External time cues and reminders</li>
                  <li>• Routine establishment and rituals</li>
                  <li>• Task estimation and tracking</li>
                  <li>• Environmental modifications</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid gap-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-lg">
              <h5 className="font-semibold mb-4 text-blue-700 dark:text-blue-300">The Modified Pomodoro Technique</h5>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h6 className="font-semibold mb-1">Focus Block</h6>
                  <p className="text-2xl font-bold text-blue-600 mb-1">15-45 min</p>
                  <p className="text-xs text-muted-foreground">Adjust to your attention span</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                  <Timer className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h6 className="font-semibold mb-1">Break</h6>
                  <p className="text-2xl font-bold text-green-600 mb-1">5-10 min</p>
                  <p className="text-xs text-muted-foreground">Move, breathe, reset</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h6 className="font-semibold mb-1">Long Break</h6>
                  <p className="text-2xl font-bold text-purple-600 mb-1">20-30 min</p>
                  <p className="text-xs text-muted-foreground">After 3-4 cycles</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                  <CheckSquare className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h6 className="font-semibold mb-1">Review</h6>
                  <p className="text-2xl font-bold text-orange-600 mb-1">5 min</p>
                  <p className="text-xs text-muted-foreground">Track and adjust</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-100 dark:bg-purple-900/30 p-6 rounded-lg">
              <h5 className="font-semibold mb-4 text-purple-700 dark:text-purple-300">Visual Time Tools</h5>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded">
                  <h6 className="font-semibold mb-2">Time Timer</h6>
                  <p className="text-sm text-muted-foreground">Visual countdown clock that shows time remaining as a red disc</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded">
                  <h6 className="font-semibold mb-2">Forest App</h6>
                  <p className="text-sm text-muted-foreground">Gamified focus timer that grows virtual trees</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded">
                  <h6 className="font-semibold mb-2">Analog Clocks</h6>
                  <p className="text-sm text-muted-foreground">Visual representation of time passage and remaining time</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h5 className="font-semibold mb-3">🕐 Time Estimation Practice</h5>
            <p className="text-sm mb-3">Improve your time awareness with this daily exercise:</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Before starting a task, estimate how long it will take</li>
              <li>Set a timer and complete the task</li>
              <li>Compare your estimate to actual time</li>
              <li>Adjust future estimates based on patterns you notice</li>
              <li>Keep a log for one week to identify trends</li>
            </ol>
          </div>
        </div>
      ),
      estimatedTime: 9
    },
    // Add remaining 18 screens with comprehensive executive functioning content...
    {
      id: 'executive-function-summary',
      type: 'summary' as const,
      title: 'Your Executive Function Mastery',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center mb-6">Executive Function Systems Mastered</h3>
          
          <div className="grid gap-4">
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center">
                <Brain className="w-6 h-6 mr-3 text-primary" />
                Working Memory Support Systems
              </h4>
              <p className="text-sm mb-2">External memory tools, chunking strategies, and cognitive load management</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Digital tools</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Visual systems</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Audio supports</span>
              </div>
            </div>
            
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-primary" />
                Time Management Mastery
              </h4>
              <p className="text-sm mb-2">Time blindness solutions, estimation skills, and scheduling systems</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Modified Pomodoro</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Visual timers</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Buffer zones</span>
              </div>
            </div>
            
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center">
                <Target className="w-6 h-6 mr-3 text-primary" />
                Organization & Planning
              </h4>
              <p className="text-sm mb-2">Task prioritization, project management, and systematic approaches</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Eisenhower Matrix</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Project breakdown</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Daily systems</span>
              </div>
            </div>
            
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center">
                <CheckSquare className="w-6 h-6 mr-3 text-primary" />
                Flexible Implementation
              </h4>
              <p className="text-sm mb-2">Personalized systems that adapt to your unique cognitive style</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Self-awareness</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Adaptability</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">Continuous improvement</span>
              </div>
            </div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <h4 className="font-semibold mb-2">Next: Advanced Study Techniques</h4>
            <p className="text-sm text-muted-foreground">
              Now that your executive functioning systems are in place, let's enhance them with evidence-based study methods designed for neurodivergent learners.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    }
  ]
};