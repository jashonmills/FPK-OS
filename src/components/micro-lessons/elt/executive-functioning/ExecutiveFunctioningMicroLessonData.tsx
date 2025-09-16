import React from 'react';
import { Target, Calendar, CheckSquare, Clock } from 'lucide-react';

export const executiveFunctioningMicroLessons = {
  id: 'executive-functioning',
  moduleTitle: 'Mastering Executive Functioning Skills',
  totalScreens: 6,
  screens: [
    {
      id: 'intro',
      type: 'concept' as const,
      title: 'What is Executive Functioning?',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Target className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your Brain's CEO Skills</h2>
            <p className="text-lg text-muted-foreground">
              Executive functioning is like having a CEO in your brain that manages planning, organization, and decision-making.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Core Executive Functions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <CheckSquare className="w-5 h-5 text-primary" />
                <span>Working Memory</span>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-primary" />
                <span>Cognitive Flexibility</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary" />
                <span>Inhibitory Control</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Planning & Prioritizing</span>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'time-management',
      type: 'practice' as const,
      title: 'Time Management Systems',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Building Your Time Management System</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              The Pomodoro Technique (Modified for Neurodiverse Learners)
            </h4>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <h5 className="font-semibold mb-2">Focus Session</h5>
                <p className="text-2xl font-bold text-primary mb-1">15-25 min</p>
                <p className="text-sm text-muted-foreground">Adjust based on your attention span</p>
              </div>
              
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg text-center">
                <h5 className="font-semibold mb-2">Short Break</h5>
                <p className="text-2xl font-bold text-green-600 mb-1">5 min</p>
                <p className="text-sm text-muted-foreground">Move, breathe, reset</p>
              </div>
              
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg text-center">
                <h5 className="font-semibold mb-2">Long Break</h5>
                <p className="text-2xl font-bold text-blue-600 mb-1">15-30 min</p>
                <p className="text-sm text-muted-foreground">After 4 sessions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h5 className="font-semibold mb-2">💡 Pro Tip</h5>
            <p className="text-sm">Use timers with visual components, not just sound. Many neurodiverse learners respond better to visual time representations.</p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'organization-systems',
      type: 'practice' as const,
      title: 'Organization Systems That Work',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Create Your Personal Organization System</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Physical Organization</h4>
              <ul className="space-y-2 text-sm">
                <li>• Color-coded folders for each subject</li>
                <li>• Designated spaces for supplies</li>
                <li>• Visual labels on everything</li>
                <li>• Clear containers for visibility</li>
                <li>• Daily reset routine</li>
              </ul>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Digital Organization</h4>
              <ul className="space-y-2 text-sm">
                <li>• Consistent file naming system</li>
                <li>• Cloud storage for accessibility</li>
                <li>• App consolidation (fewer is better)</li>
                <li>• Automated reminders</li>
                <li>• Regular digital decluttering</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">The 2-Minute Rule</h5>
            <p className="text-sm">If a task takes less than 2 minutes, do it now. If it takes longer, schedule it or delegate it.</p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'task-prioritization',
      type: 'practice' as const,
      title: 'Task Prioritization Matrix',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">The Eisenhower Matrix (Simplified)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold mb-2 text-red-700 dark:text-red-300">Urgent + Important</h4>
              <p className="text-sm mb-2">DO FIRST</p>
              <p className="text-xs text-muted-foreground">Crises, emergencies, deadline-driven projects</p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">Not Urgent + Important</h4>
              <p className="text-sm mb-2">SCHEDULE</p>
              <p className="text-xs text-muted-foreground">Prevention, planning, skill development</p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Urgent + Not Important</h4>
              <p className="text-sm mb-2">DELEGATE</p>
              <p className="text-xs text-muted-foreground">Interruptions, some calls, some emails</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-950/30 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Not Urgent + Not Important</h4>
              <p className="text-sm mb-2">ELIMINATE</p>
              <p className="text-xs text-muted-foreground">Time wasters, excessive social media</p>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">Practice Exercise</h5>
            <p className="text-sm">List 5 current tasks and categorize them using this matrix. Focus most energy on the "Schedule" quadrant!</p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'working-memory-support',
      type: 'concept' as const,
      title: 'Supporting Working Memory',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Boosting Your Mental Workspace</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">What is Working Memory?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Working memory is like your brain's sticky notes - it holds information temporarily while you use it. 
              Many neurodiverse learners have challenges here, but there are great workarounds!
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-semibold mb-2">External Memory Aids</h5>
                <ul className="text-sm space-y-1">
                  <li>• Written checklists and templates</li>
                  <li>• Voice recordings of instructions</li>
                  <li>• Visual diagrams and mind maps</li>
                  <li>• Step-by-step guides</li>
                </ul>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Memory Strategies</h5>
                <ul className="text-sm space-y-1">
                  <li>• Chunk information into smaller pieces</li>
                  <li>• Use acronyms and mnemonics</li>
                  <li>• Connect new info to existing knowledge</li>
                  <li>• Repeat back information aloud</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'executive-function-summary',
      type: 'summary' as const,
      title: 'Your Executive Function Toolkit',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center mb-6">Tools You've Mastered</h3>
          
          <div className="grid gap-4">
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Time Management
              </h4>
              <p className="text-sm">Modified Pomodoro technique and visual time tracking</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Organization Systems
              </h4>
              <p className="text-sm">Physical and digital organization that works with your brain</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckSquare className="w-5 h-5 mr-2 text-primary" />
                Task Prioritization
              </h4>
              <p className="text-sm">Eisenhower Matrix for clear decision-making</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Working Memory Support
              </h4>
              <p className="text-sm">External aids and strategies to boost mental workspace</p>
            </div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <h4 className="font-semibold mb-2">Next: Study Techniques</h4>
            <p className="text-sm text-muted-foreground">
              Now let's learn how to apply these executive function skills to effective studying!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};