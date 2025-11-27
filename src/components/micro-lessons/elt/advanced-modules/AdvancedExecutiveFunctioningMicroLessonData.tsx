import React from 'react';
import { MicroLessonData } from '../../MicroLessonContainer';

export const advancedExecutiveFunctioningMicroLessons: MicroLessonData = {
  id: 'advanced-executive-functioning',
  moduleTitle: 'Advanced Executive Functioning Mastery',
  totalScreens: 18,
  screens: [
    {
      id: 'planning-organization-intro',
      type: 'concept',
      title: 'Planning and Organization Mastery',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-6 rounded-lg border border-blue-500/20">
            <h3 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">Executive Functions: Command Center of Learning</h3>
            <p className="text-muted-foreground mb-4">
              Executive functions are the command-and-control center of the brain, responsible for essential skills 
              in learning and daily life. For many neurodiverse individuals, these skills require intentional development.
            </p>
            <div className="bg-background/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Core Executive Functions</h4>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl mb-2">🧠</div>
                  <h5 className="font-medium">Working Memory</h5>
                  <p className="text-xs text-muted-foreground">Hold & manipulate information</p>
                </div>
                <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <div className="text-2xl mb-2">🎯</div>
                  <h5 className="font-medium">Cognitive Flexibility</h5>
                  <p className="text-xs text-muted-foreground">Adapt thinking & switch tasks</p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl mb-2">🚫</div>
                  <h5 className="font-medium">Inhibitory Control</h5>
                  <p className="text-xs text-muted-foreground">Control impulses & focus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'breaking-down-tasks',
      type: 'practice',
      title: 'Breaking Down Large Tasks',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 p-6 rounded-lg border border-green-500/20">
            <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">Task Decomposition Strategy</h3>
            <p className="text-muted-foreground mb-4">
              The key to overcoming overwhelming projects is breaking them into manageable steps. 
              This creates clear roadmaps and reduces anxiety.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">Real-World Example: Research Paper</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span>Choose a topic and research question</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span>Conduct preliminary research and gather sources</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span>Create detailed outline with main arguments</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <span>Write first draft section by section</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
                  <span>Revise, edit, and polish the content</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">6</div>
                  <span>Finalize bibliography and formatting</span>
                </div>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Pro Tips</h4>
              <ul className="space-y-1 text-sm">
                <li>• Estimate time for each step</li>
                <li>• Set mini-deadlines for accountability</li>
                <li>• Celebrate completion of each step</li>
                <li>• Build in buffer time for unexpected challenges</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 7
    },
    {
      id: 'planning-tools',
      type: 'practice',
      title: 'Effective Planning Tools',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-lg border border-purple-500/20">
            <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">Digital & Physical Planning Systems</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">📱</span>
                  Digital Tools
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <h5 className="font-medium">Google Calendar</h5>
                    <p className="text-xs text-muted-foreground">Time-blocking, reminders, shared calendars</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <h5 className="font-medium">Trello</h5>
                    <p className="text-xs text-muted-foreground">Visual boards, task cards, progress tracking</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <h5 className="font-medium">Asana</h5>
                    <p className="text-xs text-muted-foreground">Project management, team collaboration</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">📔</span>
                  Physical Planners
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded">
                    <h5 className="font-medium">Bullet Journal</h5>
                    <p className="text-xs text-muted-foreground">Customizable, rapid logging, collections</p>
                  </div>
                  <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded">
                    <h5 className="font-medium">Weekly Planners</h5>
                    <p className="text-xs text-muted-foreground">Week-at-a-glance, color coding</p>
                  </div>
                  <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded">
                    <h5 className="font-medium">Daily Agenda</h5>
                    <p className="text-xs text-muted-foreground">Hour-by-hour scheduling</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🎨 Color-Coding System</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Urgent/Deadline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Academic Work</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Personal/Health</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span>Social/Fun</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'workspace-organization',
      type: 'example',
      title: 'Organizing Your Workspace',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 rounded-lg border border-orange-500/20">
            <h3 className="text-xl font-semibold mb-4 text-orange-700 dark:text-orange-300">Environment Shapes Mind</h3>
            <p className="text-muted-foreground mb-4">
              A cluttered workspace leads to a cluttered mind. Organized environments significantly 
              improve focus, reduce stress, and boost productivity.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🏠</span>
                  Physical Space
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Dedicated study area with good lighting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Everything has a designated place</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Folders, binders, and labeling systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Minimize visual distractions</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">💻</span>
                  Digital Space
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span>Logical folder structure for files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span>Consistent file naming conventions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span>Close unnecessary tabs and apps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span>Regular desktop and download cleanup</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📁 File Naming Convention Example</h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium text-green-600">✅ Good Examples:</p>
                  <ul className="text-xs space-y-1 font-mono">
                    <li>2024-09-15_History_Research-Draft</li>
                    <li>Math_Homework_Ch3-Problems</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-red-600">❌ Avoid:</p>
                  <ul className="text-xs space-y-1 font-mono">
                    <li>untitled document (1)</li>
                    <li>homework thing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'pomodoro-technique',
      type: 'practice',
      title: 'The Pomodoro Technique',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 p-6 rounded-lg border border-red-500/20">
            <h3 className="text-xl font-semibold mb-4 text-red-700 dark:text-red-300">Time Boxing for Focus</h3>
            <p className="text-muted-foreground mb-4">
              The Pomodoro Technique uses focused 25-minute work intervals to combat procrastination, 
              improve concentration, and prevent burnout.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">🍅 How It Works</h4>
              <div className="grid md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl mb-2">⏱️</div>
                  <h5 className="font-medium text-sm">25 Minutes</h5>
                  <p className="text-xs text-muted-foreground">Focused work</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl mb-2">☕</div>
                  <h5 className="font-medium text-sm">5 Minutes</h5>
                  <p className="text-xs text-muted-foreground">Short break</p>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl mb-2">🔁</div>
                  <h5 className="font-medium text-sm">Repeat</h5>
                  <p className="text-xs text-muted-foreground">3 more cycles</p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl mb-2">🏖️</div>
                  <h5 className="font-medium text-sm">30 Minutes</h5>
                  <p className="text-xs text-muted-foreground">Long break</p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-600">✅ Benefits</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Reduces overwhelm and procrastination</li>
                  <li>• Improves focus and concentration</li>
                  <li>• Prevents mental fatigue</li>
                  <li>• Creates sense of accomplishment</li>
                  <li>• Helps track time usage</li>
                </ul>
              </div>
              
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-600">📱 Recommended Apps</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Forest (gamification with trees)</li>
                  <li>• Be Focused (simple Mac/iOS timer)</li>
                  <li>• PomoDone (integrates with task lists)</li>
                  <li>• Focus Keeper (customizable intervals)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'eisenhower-matrix',
      type: 'practice',
      title: 'The Eisenhower Matrix',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-lg border border-indigo-500/20">
            <h3 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">Priority-Based Task Management</h3>
            <p className="text-muted-foreground mb-4">
              This decision-making framework helps you prioritize tasks based on urgency and importance, 
              ensuring you focus energy on what truly matters.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">📊 The Four Quadrants</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <h5 className="font-semibold text-red-700 dark:text-red-300">Urgent & Important</h5>
                  </div>
                  <p className="text-sm mb-2 font-medium">DO IT NOW</p>
                  <ul className="text-xs space-y-1">
                    <li>• Crisis situations</li>
                    <li>• Deadline-driven projects</li>
                    <li>• Emergency problems</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <h5 className="font-semibold text-blue-700 dark:text-blue-300">Important, Not Urgent</h5>
                  </div>
                  <p className="text-sm mb-2 font-medium">SCHEDULE IT</p>
                  <ul className="text-xs space-y-1">
                    <li>• Planning and preparation</li>
                    <li>• Skill development</li>
                    <li>• Relationship building</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <h5 className="font-semibold text-yellow-700 dark:text-yellow-300">Urgent, Not Important</h5>
                  </div>
                  <p className="text-sm mb-2 font-medium">DELEGATE IT</p>
                  <ul className="text-xs space-y-1">
                    <li>• Interruptions</li>
                    <li>• Some emails/calls</li>
                    <li>• Certain meetings</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border-2 border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <h5 className="font-semibold text-gray-700 dark:text-gray-300">Neither Urgent nor Important</h5>
                  </div>
                  <p className="text-sm mb-2 font-medium">ELIMINATE IT</p>
                  <ul className="text-xs space-y-1">
                    <li>• Time wasters</li>
                    <li>• Excessive social media</li>
                    <li>• Trivial activities</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Pro Tip: Weekly Review</h4>
              <p className="text-sm text-muted-foreground">
                Start each week by categorizing all your tasks using this matrix. 
                Focus 60-70% of your time on Quadrant 2 (Important, Not Urgent) for maximum long-term success.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 7
    },
    {
      id: 'working-memory-intro',
      type: 'concept',
      title: 'Understanding Working Memory',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 p-6 rounded-lg border border-teal-500/20">
            <h3 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">Your Mental Workspace</h3>
            <p className="text-muted-foreground mb-4">
              Working memory is like your mental workspace - the ability to hold and manipulate information 
              while performing cognitive tasks. It's crucial for following instructions, problem-solving, and comprehension.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">🧠 How Working Memory Works</h4>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <div className="text-2xl mb-2">📥</div>
                  <h5 className="font-medium">Input</h5>
                  <p className="text-xs text-muted-foreground">Receive information</p>
                </div>
                <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                  <div className="text-2xl mb-2">⚙️</div>
                  <h5 className="font-medium">Process</h5>
                  <p className="text-xs text-muted-foreground">Manipulate & organize</p>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl mb-2">📤</div>
                  <h5 className="font-medium">Output</h5>
                  <p className="text-xs text-muted-foreground">Apply to tasks</p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-600">Working Memory in Action</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Following multi-step instructions</li>
                  <li>• Mental math calculations</li>
                  <li>• Reading comprehension</li>
                  <li>• Problem-solving strategies</li>
                  <li>• Note-taking while listening</li>
                </ul>
              </div>
              
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-orange-600">Common Challenges</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Forgetting instructions mid-task</li>
                  <li>• Difficulty with complex problems</li>
                  <li>• Getting lost in reading passages</li>
                  <li>• Trouble following conversations</li>
                  <li>• Mental fatigue from overload</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'chunking-technique',
      type: 'practice',
      title: 'Chunking: Breaking Information Into Manageable Pieces',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-6 rounded-lg border border-emerald-500/20">
            <h3 className="text-xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">Chunking Strategy</h3>
            <p className="text-muted-foreground mb-4">
              Chunking breaks down complex information into smaller, more manageable groups. 
              This reduces cognitive load and improves both memory and understanding.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">📱 Phone Number Example</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h5 className="font-medium text-red-600 mb-2">❌ Hard to Remember</h5>
                  <p className="font-mono text-lg">5551234567</p>
                  <p className="text-xs text-muted-foreground">10 individual digits</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h5 className="font-medium text-green-600 mb-2">✅ Easy to Remember</h5>
                  <p className="font-mono text-lg">(555) 123-4567</p>
                  <p className="text-xs text-muted-foreground">3 meaningful chunks</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">🧮 Academic Applications</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2 text-blue-600">Math Problems</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Break equations into steps</li>
                      <li>• Group similar operations</li>
                      <li>• Solve one part at a time</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2 text-purple-600">Reading Comprehension</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Read paragraph by paragraph</li>
                      <li>• Identify main ideas in sections</li>
                      <li>• Summarize chunks before moving on</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Chunking Strategies</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div className="text-xl mb-1">👥</div>
                    <h5 className="font-medium text-sm">Logical Grouping</h5>
                    <p className="text-xs">Related concepts together</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-xl mb-1">🎯</div>
                    <h5 className="font-medium text-sm">Size Limiting</h5>
                    <p className="text-xs">3-7 items per chunk</p>
                  </div>
                  <div className="text-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <div className="text-xl mb-1">🔗</div>
                    <h5 className="font-medium text-sm">Meaningful Connections</h5>
                    <p className="text-xs">Link to existing knowledge</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'visualization-techniques',
      type: 'practice',
      title: 'Visualization for Memory Enhancement',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 p-6 rounded-lg border border-pink-500/20">
            <h3 className="text-xl font-semibold mb-4 text-pink-700 dark:text-pink-300">Mental Imagery Techniques</h3>
            <p className="text-muted-foreground mb-4">
              Creating mental pictures of information leverages our brain's powerful visual processing abilities. 
              This is especially effective for visual learners and spatial thinkers.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">🎨 Visualization Methods</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <h5 className="font-medium text-pink-600 mb-1">Memory Palace</h5>
                    <p className="text-xs">Associate information with familiar locations</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h5 className="font-medium text-purple-600 mb-1">Story Visualization</h5>
                    <p className="text-xs">Create narratives with vivid mental scenes</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="font-medium text-blue-600 mb-1">Concept Mapping</h5>
                    <p className="text-xs">Draw connections between ideas visually</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h5 className="font-medium text-green-600 mb-1">Color Coding</h5>
                    <p className="text-xs">Assign colors to different types of information</p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h5 className="font-medium text-orange-600 mb-1">Symbolic Representation</h5>
                    <p className="text-xs">Use symbols and icons to represent concepts</p>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <h5 className="font-medium text-teal-600 mb-1">Flowchart Thinking</h5>
                    <p className="text-xs">Visualize processes as step-by-step diagrams</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">🧠 Memory Palace Example</h4>
              <div className="space-y-2">
                <p className="text-sm"><strong>Goal:</strong> Remember the planets in our solar system</p>
                <p className="text-sm"><strong>Method:</strong> Walk through your house, placing each planet in a room:</p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Front door: Mercury (small, quick delivery)</li>
                  <li>• Living room: Venus (beautiful, like a goddess)</li>
                  <li>• Kitchen: Earth (where life is nourished)</li>
                  <li>• Bedroom: Mars (red like anger, war)</li>
                  <li>• And so on through your familiar space...</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'active-recall-practice',
      type: 'practice',
      title: 'Active Recall: Testing Your Knowledge',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-6 rounded-lg border border-violet-500/20">
            <h3 className="text-xl font-semibold mb-4 text-violet-700 dark:text-violet-300">Strengthening Neural Pathways</h3>
            <p className="text-muted-foreground mb-4">
              Active recall forces your brain to retrieve information from memory, strengthening neural pathways 
              and significantly improving long-term retention compared to passive review.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">🎯 Active Recall Techniques</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                    <h5 className="font-medium text-violet-600 mb-1">Flashcards</h5>
                    <p className="text-xs">Question on one side, answer on the other</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h5 className="font-medium text-purple-600 mb-1">Self-Testing</h5>
                    <p className="text-xs">Close books and write what you remember</p>
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <h5 className="font-medium text-indigo-600 mb-1">Teach Others</h5>
                    <p className="text-xs">Explain concepts to friends or family</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="font-medium text-blue-600 mb-1">Practice Questions</h5>
                    <p className="text-xs">Work through problem sets without answers</p>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <h5 className="font-medium text-teal-600 mb-1">Summary Writing</h5>
                    <p className="text-xs">Write summaries from memory first</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h5 className="font-medium text-green-600 mb-1">Verbal Rehearsal</h5>
                    <p className="text-xs">Say key concepts out loud</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-600">✅ Effective Practice</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Test yourself frequently</li>
                  <li>• Focus on areas you struggle with</li>
                  <li>• Use spaced repetition schedules</li>
                  <li>• Mix different types of problems</li>
                  <li>• Review mistakes carefully</li>
                </ul>
              </div>
              
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-red-600">❌ Passive Habits to Avoid</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Just re-reading notes</li>
                  <li>• Highlighting without purpose</li>
                  <li>• Looking at answers too quickly</li>
                  <li>• Studying only easy material</li>
                  <li>• Cramming before tests</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 7
    },
    {
      id: 'environmental-control',
      type: 'example',
      title: 'Focus Through Environmental Control',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6 rounded-lg border border-cyan-500/20">
            <h3 className="text-xl font-semibold mb-4 text-cyan-700 dark:text-cyan-300">Optimizing Your Environment</h3>
            <p className="text-muted-foreground mb-4">
              Your environment has a massive impact on your ability to focus. Small changes to your physical 
              and digital surroundings can dramatically improve concentration and reduce distractions.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">📱</span>
                  Digital Environment
                </h4>
                <div className="space-y-2">
                  <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded">
                    <h5 className="font-medium text-sm">Notification Management</h5>
                    <p className="text-xs text-muted-foreground">Turn off non-essential alerts during study time</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <h5 className="font-medium text-sm">Website Blockers</h5>
                    <p className="text-xs text-muted-foreground">Use tools like Cold Turkey or Freedom</p>
                  </div>
                  <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
                    <h5 className="font-medium text-sm">Single-Tab Rule</h5>
                    <p className="text-xs text-muted-foreground">Keep only necessary tabs open</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🏠</span>
                  Physical Environment
                </h4>
                <div className="space-y-2">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <h5 className="font-medium text-sm">Lighting</h5>
                    <p className="text-xs text-muted-foreground">Natural light or good desk lamp</p>
                  </div>
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <h5 className="font-medium text-sm">Temperature</h5>
                    <p className="text-xs text-muted-foreground">Slightly cool (68-72°F) for alertness</p>
                  </div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <h5 className="font-medium text-sm">Noise Control</h5>
                    <p className="text-xs text-muted-foreground">Quiet space or white noise/focus music</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">🔧 Focus Enhancement Tools</h4>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                  <div className="text-xl mb-1">🎧</div>
                  <h5 className="font-medium text-sm">Noise-Canceling</h5>
                  <p className="text-xs">Headphones for distraction blocking</p>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-xl mb-1">📵</div>
                  <h5 className="font-medium text-sm">Phone Away</h5>
                  <p className="text-xs">In another room or drawer</p>
                </div>
                <div className="text-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <div className="text-xl mb-1">🚪</div>
                  <h5 className="font-medium text-sm">Study Signal</h5>
                  <p className="text-xs">Let others know you're focusing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'mindfulness-focus',
      type: 'practice',
      title: 'Mindfulness for Attention Training',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-6 rounded-lg border border-amber-500/20">
            <h3 className="text-xl font-semibold mb-4 text-amber-700 dark:text-amber-300">Training Your Attention Muscle</h3>
            <p className="text-muted-foreground mb-4">
              Mindfulness practices train your ability to notice when your mind wanders and gently bring attention 
              back to the present moment. This skill directly transfers to improved focus during study sessions.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">👁️ Simple Mindfulness Exercises</h4>
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <h5 className="font-medium text-amber-600 mb-1">Focused Breathing (5 minutes)</h5>
                  <ol className="text-xs space-y-1 list-decimal list-inside">
                    <li>Sit comfortably and close your eyes</li>
                    <li>Focus on your breath going in and out</li>
                    <li>When mind wanders, gently return to breath</li>
                    <li>Don't judge yourself - wandering is normal</li>
                  </ol>
                </div>
                
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h5 className="font-medium text-orange-600 mb-1">Body Scan (10 minutes)</h5>
                  <ol className="text-xs space-y-1 list-decimal list-inside">
                    <li>Lie down and close your eyes</li>
                    <li>Focus attention on toes, then feet</li>
                    <li>Slowly move attention up your body</li>
                    <li>Notice sensations without changing them</li>
                  </ol>
                </div>
                
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h5 className="font-medium text-yellow-600 mb-1">Mindful Study Breaks</h5>
                  <ol className="text-xs space-y-1 list-decimal list-inside">
                    <li>Between study sessions, pause</li>
                    <li>Take 3 deep, conscious breaths</li>
                    <li>Notice how your body feels</li>
                    <li>Set intention for next session</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-600">📱 Recommended Apps</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Headspace (guided meditations)</li>
                  <li>• Calm (sleep stories & meditation)</li>
                  <li>• Insight Timer (free community content)</li>
                  <li>• Ten Percent Happier (practical approach)</li>
                </ul>
              </div>
              
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-600">⏰ Building the Habit</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Start with just 2-3 minutes daily</li>
                  <li>• Same time each day for consistency</li>
                  <li>• Link to existing habits (after coffee)</li>
                  <li>• Track progress with a simple calendar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'hyperfocus-management',
      type: 'example',
      title: 'Managing Hyperfocus as a Superpower',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-6 rounded-lg border border-purple-500/20">
            <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">Hyperfocus: Gift and Challenge</h3>
            <p className="text-muted-foreground mb-4">
              For many neurodivergent individuals, hyperfocus can be a superpower - enabling deep work and 
              incredible productivity. However, it can also lead to time blindness and neglect of other needs.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-green-600">✅ Hyperfocus Benefits</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Exceptional depth of work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>High-quality output</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Complete immersion in topics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Breakthrough insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Intrinsic motivation</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-orange-600">⚠️ Potential Challenges</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Time blindness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Neglecting basic needs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Difficulty transitioning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Social isolation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Burnout from intensity</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">🎯 Hyperfocus Management Strategies</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2 text-purple-600">Entry Strategies</h5>
                  <ul className="space-y-1 text-sm">
                    <li>• Set up the ideal environment first</li>
                    <li>• Remove potential distractions</li>
                    <li>• Have water and snacks nearby</li>
                    <li>• Set multiple alarms/reminders</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2 text-indigo-600">Exit Strategies</h5>
                  <ul className="space-y-1 text-sm">
                    <li>• Use vibrating reminders</li>
                    <li>• Ask someone to check on you</li>
                    <li>• Set transition rituals</li>
                    <li>• Plan rewarding breaks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'executive-function-integration',
      type: 'summary',
      title: 'Integrating Executive Function Strategies',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-lg border border-indigo-500/20">
            <h3 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">Building Your Executive Function Toolkit</h3>
            <p className="text-muted-foreground mb-4">
              Executive functioning improvement is a gradual process. Start with one or two strategies that 
              resonate with you, practice them consistently, then gradually add more tools to your toolkit.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">📋 Your Personal Action Plan</h4>
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <h5 className="font-medium text-indigo-600 mb-2">Week 1-2: Foundation</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Choose ONE planning tool (digital or physical)</li>
                    <li>• Set up a basic organizational system</li>
                    <li>• Practice daily review and planning</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h5 className="font-medium text-purple-600 mb-2">Week 3-4: Time Management</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Implement Pomodoro Technique</li>
                    <li>• Practice task prioritization</li>
                    <li>• Create time estimates for activities</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h5 className="font-medium text-blue-600 mb-2">Week 5-6: Memory & Focus</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Apply chunking to study materials</li>
                    <li>• Practice active recall techniques</li>
                    <li>• Optimize environment for focus</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-600">Success Indicators</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Reduced stress about deadlines</li>
                  <li>• Improved task completion rates</li>
                  <li>• Better time estimation abilities</li>
                  <li>• Increased confidence in learning</li>
                  <li>• More consistent daily routines</li>
                </ul>
              </div>
              
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-600">Remember</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Progress is not always linear</li>
                  <li>• Adapt strategies to your unique needs</li>
                  <li>• Celebrate small victories</li>
                  <li>• Be patient with yourself</li>
                  <li>• Seek support when needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'real-world-application',
      type: 'practice',
      title: 'Real-World Applications & Next Steps',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 rounded-lg border border-emerald-500/20">
            <h3 className="text-xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">Taking Action in Your Academic Life</h3>
            <p className="text-muted-foreground mb-4">
              The ultimate test of executive functioning strategies is how well they work in your real academic 
              and personal situations. Let's create a concrete plan for implementation.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">🎯 Subject-Specific Applications</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <h5 className="font-medium text-emerald-600 mb-1">Mathematics</h5>
                    <ul className="text-xs space-y-1">
                      <li>• Break complex problems into steps</li>
                      <li>• Use visualization for geometry</li>
                      <li>• Practice active recall with formulas</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <h5 className="font-medium text-teal-600 mb-1">Literature/English</h5>
                    <ul className="text-xs space-y-1">
                      <li>• Chunk reading assignments</li>
                      <li>• Create character/theme maps</li>
                      <li>• Use essay planning templates</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="font-medium text-blue-600 mb-1">Sciences</h5>
                    <ul className="text-xs space-y-1">
                      <li>• Visualize processes and systems</li>
                      <li>• Create concept connection maps</li>
                      <li>• Use spaced repetition for facts</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h5 className="font-medium text-purple-600 mb-1">History/Social Studies</h5>
                    <ul className="text-xs space-y-1">
                      <li>• Create timeline visualizations</li>
                      <li>• Connect events to personal experience</li>
                      <li>• Use story-telling for memory</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-orange-600">⚡ Quick Daily Wins</h4>
                <ul className="space-y-1 text-sm">
                  <li>• 5-minute morning planning session</li>
                  <li>• Use timers for focused work blocks</li>
                  <li>• End-of-day reflection and organization</li>
                  <li>• Weekly review of strategies and progress</li>
                </ul>
              </div>
              
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-pink-600">🤝 Support System</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Share strategies with study partners</li>
                  <li>• Ask family for accountability help</li>
                  <li>• Connect with disability services</li>
                  <li>• Join neurodiverse student groups</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 bg-background/20 p-4 rounded-lg border-2 border-dashed border-emerald-300">
              <h4 className="font-semibold mb-2 text-emerald-700 dark:text-emerald-300">🚀 Your Next Action</h4>
              <p className="text-sm text-muted-foreground">
                Choose ONE strategy from this module that resonates most with you. 
                Commit to trying it for the next week. Track how it works and adjust as needed. 
                Remember: small, consistent changes lead to transformational results.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    }
  ]
};