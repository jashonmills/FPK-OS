import { MicroLessonData } from '../../MicroLessonContainer';

export const interactiveWorksheetsMicroLessons: MicroLessonData = {
  id: "interactive-worksheets",
  moduleTitle: "Interactive Learning Tools & Templates",
  totalScreens: 10,
  screens: [
    {
      id: "worksheets-intro",
      type: "concept",
      title: "Welcome to Your Learning Toolkit",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Interactive Learning Tools & Templates</h2>
          <p className="text-lg leading-relaxed">
            These interactive tools will help you apply the strategies you've learned, organize your thoughts, and track your progress. Think of them as your personal learning toolkit!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-300">Planning Tools</h3>
              <p className="text-sm mt-2">Daily and weekly planners to organize your time and tasks effectively</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <div className="text-3xl mb-2">📝</div>
              <h3 className="font-semibold text-green-700 dark:text-green-300">Note-Taking Guides</h3>
              <p className="text-sm mt-2">Structured approaches to capturing and organizing information</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
              <div className="text-3xl mb-2">🤔</div>
              <h3 className="font-semibold text-purple-700 dark:text-purple-300">Reflection Prompts</h3>
              <p className="text-sm mt-2">Guided questions to help you understand your learning process</p>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-orange-700 dark:text-orange-300">Goal Setting</h3>
              <p className="text-sm mt-2">SMART goal templates to help you achieve your learning objectives</p>
            </div>
          </div>
          
          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
            <h3 className="font-semibold text-primary mb-2">💡 How to Use These Tools</h3>
            <ul className="space-y-1 text-sm">
              <li>• Choose the tools that match your learning style and current needs</li>
              <li>• Customize them to fit your personal preferences</li>
              <li>• Use them consistently to build effective learning habits</li>
              <li>• Review and adjust your approach based on what works best</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: "daily-planner-tool",
      type: "practice",
      title: "Interactive Daily Learning Planner",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Create Your Daily Learning Plan</h2>
          <p>Use this interactive planner to organize your day and set yourself up for success.</p>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">📅 Daily Learning Plan Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date:</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Top 3 Learning Priorities:</label>
                <div className="space-y-2">
                  {[1, 2, 3].map(num => (
                    <div key={num} className="flex items-center gap-2">
                      <span className="text-sm font-medium">{num}.</span>
                      <input 
                        type="text" 
                        placeholder={`Priority ${num}`}
                        className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Time Blocking Schedule:</label>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Time</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Task/Activity</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Strategy Used</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
                        "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
                      ].map(time => (
                        <tr key={time}>
                          <td className="border border-gray-300 dark:border-gray-600 p-2 font-medium">{time}</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-1">
                            <input 
                              type="text" 
                              className="w-full p-1 border-0 bg-transparent focus:bg-white dark:focus:bg-gray-600 rounded"
                              placeholder="Activity"
                            />
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 p-1">
                            <input 
                              type="text" 
                              className="w-full p-1 border-0 bg-transparent focus:bg-white dark:focus:bg-gray-600 rounded"
                              placeholder="Learning strategy"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Planned Breaks & Self-Care:</label>
                <textarea 
                  rows={3}
                  placeholder="When will you take breaks? What self-care activities will you include?"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">💡 Planning Tips</h4>
            <ul className="text-sm space-y-1">
              <li>• Schedule your most important tasks during your peak energy times</li>
              <li>• Include buffer time between tasks for transitions</li>
              <li>• Plan breaks every 25-50 minutes depending on your attention span</li>
              <li>• Match learning strategies to your learning style preferences</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: "weekly-task-breakdown",
      type: "practice",
      title: "Weekly Task Breakdown & Prioritization",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Master Your Weekly Planning</h2>
          <p>Break down large projects and prioritize tasks using the Eisenhower Matrix.</p>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">📋 Weekly Task Planner</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Week Of:</label>
                <input 
                  type="date" 
                  className="w-full max-w-xs p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Major Goals for This Week:</label>
                <div className="space-y-2">
                  {[1, 2, 3].map(num => (
                    <div key={num} className="flex items-center gap-2">
                      <span className="text-sm font-medium">{num}.</span>
                      <input 
                        type="text" 
                        placeholder={`Goal ${num}`}
                        className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Project Breakdown:</label>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Project Name"
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-medium"
                  />
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left w-12">Step</th>
                          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Task Description</th>
                          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left w-24">Time Est.</th>
                          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left w-24">Due Date</th>
                          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left w-20">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4, 5].map(step => (
                          <tr key={step}>
                            <td className="border border-gray-300 dark:border-gray-600 p-2 text-center font-medium">{step}</td>
                            <td className="border border-gray-300 dark:border-gray-600 p-1">
                              <input 
                                type="text" 
                                className="w-full p-1 border-0 bg-transparent focus:bg-white dark:focus:bg-gray-600 rounded"
                                placeholder="Describe the task..."
                              />
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 p-1">
                              <input 
                                type="text" 
                                className="w-full p-1 border-0 bg-transparent focus:bg-white dark:focus:bg-gray-600 rounded"
                                placeholder="2 hrs"
                              />
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 p-1">
                              <input 
                                type="date" 
                                className="w-full p-1 border-0 bg-transparent focus:bg-white dark:focus:bg-gray-600 rounded"
                              />
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 p-1">
                              <select className="w-full p-1 border-0 bg-transparent focus:bg-white dark:focus:bg-gray-600 rounded">
                                <option value="">Status</option>
                                <option value="not-started">Not Started</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">🔍 Task Breakdown Strategy</h4>
            <ul className="text-sm space-y-1">
              <li>• Break large projects into 2-4 hour chunks maximum</li>
              <li>• Each step should have a clear, specific outcome</li>
              <li>• Build in buffer time for unexpected challenges</li>
              <li>• Start with the most challenging or important steps</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: "eisenhower-matrix",
      type: "practice", 
      title: "Eisenhower Matrix Prioritization Tool",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Prioritize Like a President</h2>
          <p>Use the Eisenhower Matrix to categorize your tasks by urgency and importance.</p>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">🎯 Eisenhower Matrix for Task Prioritization</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Quadrant 1: Urgent & Important",
                  subtitle: "Do First!",
                  color: "red",
                  description: "Crises, emergencies, deadline-driven projects"
                },
                {
                  title: "Quadrant 2: Important, Not Urgent", 
                  subtitle: "Schedule It!",
                  color: "green",
                  description: "Prevention, planning, development, recreation"
                },
                {
                  title: "Quadrant 3: Urgent, Not Important",
                  subtitle: "Delegate/Minimize!",
                  color: "yellow",
                  description: "Interruptions, some calls/emails, some meetings"
                },
                {
                  title: "Quadrant 4: Not Urgent, Not Important",
                  subtitle: "Eliminate!",
                  color: "gray",
                  description: "Time wasters, excessive social media, mindless activities"
                }
              ].map((quadrant, index) => (
                <div key={index} className={`bg-${quadrant.color}-50 dark:bg-${quadrant.color}-950/30 p-4 rounded-lg border border-${quadrant.color}-200 dark:border-${quadrant.color}-800`}>
                  <div className="mb-3">
                    <h4 className={`font-bold text-${quadrant.color}-700 dark:text-${quadrant.color}-300`}>
                      {quadrant.title}
                    </h4>
                    <p className={`text-sm font-medium text-${quadrant.color}-600 dark:text-${quadrant.color}-400`}>
                      {quadrant.subtitle}
                    </p>
                    <p className={`text-xs text-${quadrant.color}-600 dark:text-${quadrant.color}-400 mt-1`}>
                      {quadrant.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {[1, 2, 3].map(taskNum => (
                      <textarea
                        key={taskNum}
                        rows={2}
                        placeholder={`Task ${taskNum}...`}
                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 resize-none"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">🧠 Matrix Strategy Tips</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Quadrant 2 is key:</strong> Spending more time here prevents Quadrant 1 crises</li>
              <li>• <strong>Minimize Quadrant 3:</strong> Learn to say no or delegate these tasks</li>
              <li>• <strong>Eliminate Quadrant 4:</strong> These activities don't serve your goals</li>
              <li>• <strong>Review weekly:</strong> Tasks can move between quadrants as priorities change</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: "cornell-notes-template",
      type: "practice",
      title: "Interactive Cornell Notes System",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Master the Cornell Notes Method</h2>
          <p>This structured note-taking system helps you capture, organize, and review information effectively.</p>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Topic:</label>
                <input 
                  type="text" 
                  placeholder="What are you studying today?"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Date:</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-96">
              {/* Cues Section */}
              <div className="lg:col-span-1">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 text-center">
                  📋 Cues & Questions
                </h4>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg h-full">
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                    Write key questions, vocabulary, and main ideas here
                  </p>
                  <textarea
                    className="w-full h-4/5 p-2 text-sm border border-blue-200 dark:border-blue-700 rounded bg-white dark:bg-gray-700 resize-none"
                    placeholder="• What is...?&#10;• Key term: ___&#10;• Main idea: ___&#10;• Why does...?&#10;• How can...?"
                  />
                </div>
              </div>
              
              {/* Main Notes Section */}
              <div className="lg:col-span-2">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 text-center">
                  📝 Main Notes
                </h4>
                <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg h-full">
                  <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                    Capture lecture content, reading notes, and details here
                  </p>
                  <textarea
                    className="w-full h-4/5 p-2 text-sm border border-green-200 dark:border-green-700 rounded bg-white dark:bg-gray-700 resize-none"
                    placeholder="Take your main notes here...&#10;&#10;Use:&#10;• Bullet points&#10;• Short phrases&#10;• Diagrams or symbols&#10;• Abbreviations&#10;• Leave white space for clarity"
                  />
                </div>
              </div>
            </div>
            
            {/* Summary Section */}
            <div className="mt-4">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                📋 Summary
              </h4>
              <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                <p className="text-xs text-purple-600 dark:text-purple-400 mb-2">
                  Summarize the main points in your own words (2-3 sentences)
                </p>
                <textarea
                  rows={3}
                  className="w-full p-2 text-sm border border-purple-200 dark:border-purple-700 rounded bg-white dark:bg-gray-700 resize-none"
                  placeholder="In summary, the main concepts covered were..."
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">📚 How to Use Cornell Notes</h4>
              <ol className="text-sm space-y-1">
                <li><strong>1. During class/reading:</strong> Take notes in the main section</li>
                <li><strong>2. After class:</strong> Add cues and questions in the left column</li>
                <li><strong>3. Within 24 hours:</strong> Write a summary at the bottom</li>
                <li><strong>4. For review:</strong> Cover notes, use cues to test yourself</li>
              </ol>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">💡 Cornell Notes Benefits</h4>
              <ul className="text-sm space-y-1">
                <li>• Encourages active listening and processing</li>
                <li>• Built-in review and self-testing system</li>
                <li>• Helps identify key concepts and relationships</li>
                <li>• Perfect for visual and reading/writing learners</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: "mind-map-planner",
      type: "practice",
      title: "Digital Mind Map Planning Tool",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Visual Thinking with Mind Maps</h2>
          <p>Create visual connections between ideas using this mind mapping framework.</p>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Central Topic/Concept:</label>
              <input 
                type="text" 
                placeholder="What's your main topic or subject?"
                className="w-full p-3 border-2 border-primary rounded-lg dark:bg-gray-700 dark:border-primary text-center font-semibold"
              />
            </div>
            
            {/* Mind Map Structure */}
            <div className="relative bg-gray-50 dark:bg-gray-900 p-8 rounded-lg min-h-96">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  🎨 Use this space to plan your mind map structure
                </p>
              </div>
              
              {/* Central Topic Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 bg-primary text-white rounded-full flex items-center justify-center text-center p-2">
                  <span className="text-sm font-bold">CENTRAL TOPIC</span>
                </div>
              </div>
              
              {/* Branch Planning Areas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
                {[
                  { position: "top-left", color: "bg-blue-100 dark:bg-blue-900/50", label: "Branch 1" },
                  { position: "top-right", color: "bg-green-100 dark:bg-green-900/50", label: "Branch 2" },
                  { position: "bottom-left", color: "bg-purple-100 dark:bg-purple-900/50", label: "Branch 3" },
                  { position: "bottom-right", color: "bg-orange-100 dark:bg-orange-900/50", label: "Branch 4" }
                ].map((branch, index) => (
                  <div key={index} className={`${branch.color} p-3 rounded-lg`}>
                    <h5 className="font-semibold text-sm mb-2">{branch.label}</h5>
                    <textarea
                      rows={3}
                      placeholder="Main idea for this branch..."
                      className="w-full p-2 text-xs border rounded bg-white dark:bg-gray-700 resize-none"
                    />
                    <div className="mt-2">
                      <p className="text-xs font-medium mb-1">Sub-topics:</p>
                      {[1, 2].map(subIndex => (
                        <input
                          key={subIndex}
                          type="text"
                          placeholder={`Sub-topic ${subIndex}`}
                          className="w-full p-1 mb-1 text-xs border rounded bg-white dark:bg-gray-700"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <h5 className="font-semibold">🎨 Visual Elements to Include:</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>Colors for categories</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>Images/symbols</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>Keywords only</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>Curved lines</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🧠 Mind Map Best Practices</h4>
              <ul className="text-sm space-y-1">
                <li>• Start with your central topic in the middle</li>
                <li>• Use single keywords or short phrases</li>
                <li>• Make each branch a different color</li>
                <li>• Add images, symbols, or drawings</li>
                <li>• Connect related ideas with curved lines</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">✨ When to Use Mind Maps</h4>
              <ul className="text-sm space-y-1">
                <li>• Brainstorming new ideas</li>
                <li>• Planning essays or presentations</li>
                <li>• Reviewing for exams</li>
                <li>• Understanding complex relationships</li>
                <li>• Creative problem-solving</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: "reflection-prompts",
      type: "practice",
      title: "Weekly Learning Reflection Tool",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Reflect on Your Learning Journey</h2>
          <p>Regular reflection helps you understand your learning process and identify what works best for you.</p>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">🤔 Weekly Learning Reflection</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Week Of:</label>
                <input 
                  type="date" 
                  className="w-full max-w-xs p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">📚 What I Learned This Week:</label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">List key concepts, skills, or insights</p>
                <textarea
                  rows={4}
                  placeholder="This week I learned about...&#10;• Concept 1: ...&#10;• Skill 2: ...&#10;• Insight 3: ..."
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">🛠️ Strategies I Used (and how they worked):</label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">e.g., Pomodoro, mind mapping, active recall</p>
                <textarea
                  rows={4}
                  placeholder="Strategy 1: Mind mapping - This helped me see connections between ideas&#10;Strategy 2: Pomodoro technique - Improved my focus during study sessions&#10;Strategy 3: ..."
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">💪 My Strengths as a Learner This Week:</label>
                  <textarea
                    rows={3}
                    placeholder="I was really good at...&#10;My executive functioning strength was...&#10;I felt confident when..."
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">🎯 Challenges I Faced (and how I addressed them):</label>
                  <textarea
                    rows={3}
                    placeholder="Challenge: Procrastination on big project&#10;Solution: Broke it into smaller tasks&#10;&#10;Challenge: Difficulty focusing&#10;Solution: ..."
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">🚀 What I Will Do Differently Next Week:</label>
                <textarea
                  rows={3}
                  placeholder="Based on this week's experiences, next week I will...&#10;• Try a new study technique: ...&#10;• Adjust my schedule by: ...&#10;• Focus more on: ..."
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">🌟 One Thing I Am Proud Of:</label>
                <textarea
                  rows={2}
                  placeholder="This week I'm proud that I..."
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">💡 Reflection Benefits</h4>
            <ul className="text-sm space-y-1">
              <li>• Increases self-awareness and metacognition</li>
              <li>• Helps identify effective strategies to repeat</li>
              <li>• Builds confidence by recognizing progress</li>
              <li>• Guides adjustments for continuous improvement</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: "smart-goals-template",
      type: "practice",
      title: "SMART Goals Setting Workshop",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Create Your SMART Learning Goals</h2>
          <p>Transform vague intentions into clear, actionable goals using the SMART framework.</p>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">🎯 SMART Goal Setting Worksheet</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-2">My Learning Goal:</label>
                <input 
                  type="text" 
                  placeholder="What do you want to achieve? (Start with your initial idea...)"
                  className="w-full p-3 border-2 border-primary rounded-lg dark:bg-gray-700 dark:border-primary text-lg"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {[
                  {
                    letter: "S",
                    title: "Specific",
                    question: "What exactly do I want to achieve? (Who, what, where, when, why?)",
                    placeholder: "Instead of 'get better at math,' try 'improve my algebra skills by mastering linear equations through daily practice and tutoring sessions'",
                    color: "blue"
                  },
                  {
                    letter: "M", 
                    title: "Measurable",
                    question: "How will I know when I have achieved it? (How much, how many?)",
                    placeholder: "I will know I've succeeded when I can solve 8/10 linear equation problems correctly on practice tests",
                    color: "green"
                  },
                  {
                    letter: "A",
                    title: "Achievable", 
                    question: "Is this goal realistic and attainable given my resources and time?",
                    placeholder: "Yes, this is achievable because I have access to online resources, can dedicate 30 minutes daily, and have support from my teacher",
                    color: "purple"
                  },
                  {
                    letter: "R",
                    title: "Relevant",
                    question: "Is this goal important to me and aligned with my overall objectives?", 
                    placeholder: "This goal is relevant because strong algebra skills are essential for my planned engineering studies and will boost my confidence in math",
                    color: "orange"
                  },
                  {
                    letter: "T",
                    title: "Time-bound",
                    question: "When do I want to achieve this goal by?",
                    placeholder: "I will achieve this goal by the end of next month (4 weeks from today)",
                    color: "red"
                  }
                ].map((item, index) => (
                  <div key={index} className={`bg-${item.color}-50 dark:bg-${item.color}-950/30 p-4 rounded-lg border border-${item.color}-200 dark:border-${item.color}-800`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 bg-${item.color}-600 text-white rounded-full flex items-center justify-center font-bold`}>
                        {item.letter}
                      </div>
                      <div>
                        <h4 className={`font-semibold text-${item.color}-700 dark:text-${item.color}-300`}>{item.title}</h4>
                        <p className={`text-sm text-${item.color}-600 dark:text-${item.color}-400`}>{item.question}</p>
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      placeholder={item.placeholder}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 resize-none"
                    />
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">📋 Action Steps</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">What specific steps will you take to reach this goal?</p>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(step => (
                    <div key={step} className="flex items-start gap-2">
                      <span className="text-sm font-medium mt-2">{step}.</span>
                      <input 
                        type="text" 
                        placeholder={`Action step ${step}...`}
                        className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-3">🚧 Potential Obstacles & Solutions</h4>
                  <div className="space-y-3">
                    {[1, 2].map(obs => (
                      <div key={obs} className="space-y-1">
                        <input 
                          type="text" 
                          placeholder={`Obstacle ${obs}...`}
                          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
                        />
                        <input 
                          type="text" 
                          placeholder={`Solution ${obs}...`}
                          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm bg-green-50 dark:bg-green-950/30"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">📅 Important Dates</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date Set:</label>
                      <input 
                        type="date" 
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Review Date:</label>
                      <input 
                        type="date" 
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Target Completion:</label>
                      <input 
                        type="date" 
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">🏆 SMART Goals Success Tips</h4>
            <ul className="text-sm space-y-1">
              <li>• Write your goal down and keep it visible</li>
              <li>• Break it into weekly mini-goals</li>
              <li>• Review and adjust your plan regularly</li>
              <li>• Celebrate small wins along the way</li>
              <li>• Share your goal with someone for accountability</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 7
    },
    {
      id: "worksheets-summary",
      type: "summary",
      title: "Your Complete Learning Toolkit",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">🎉 Congratulations! You've Built Your Learning Toolkit</h2>
          
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6 rounded-lg">
            <h3 className="font-bold mb-4">🛠️ Your Interactive Learning Tools</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600">📋 Planning & Organization Tools</h4>
                <ul className="text-sm space-y-1">
                  <li>✅ Daily Learning Planner</li>
                  <li>✅ Weekly Task Breakdown System</li>
                  <li>✅ Eisenhower Matrix Prioritization</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">📝 Note-Taking & Study Tools</h4>
                <ul className="text-sm space-y-1">
                  <li>✅ Cornell Notes Template</li>
                  <li>✅ Mind Map Planning System</li>
                  <li>✅ Visual Learning Framework</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-600">🤔 Reflection & Growth Tools</h4>
                <ul className="text-sm space-y-1">
                  <li>✅ Weekly Learning Reflection</li>
                  <li>✅ Metacognitive Awareness Prompts</li>
                  <li>✅ Progress Tracking System</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-600">🎯 Goal Setting & Achievement</h4>
                <ul className="text-sm space-y-1">
                  <li>✅ SMART Goals Framework</li>
                  <li>✅ Action Planning Template</li>
                  <li>✅ Obstacle & Solution Mapping</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h4 className="font-semibold text-primary mb-3">🚀 Implementation Strategy</h4>
              <ol className="text-sm space-y-2">
                <li><strong>1. Start Small:</strong> Choose 1-2 tools that match your current needs</li>
                <li><strong>2. Practice Consistently:</strong> Use them daily for 1-2 weeks</li>
                <li><strong>3. Customize:</strong> Adapt the templates to fit your style</li>
                <li><strong>4. Add More:</strong> Gradually incorporate additional tools</li>
                <li><strong>5. Evaluate:</strong> Use reflection prompts to assess effectiveness</li>
              </ol>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h4 className="font-semibold text-primary mb-3">💡 Personalization Tips</h4>
              <ul className="text-sm space-y-2">
                <li>• <strong>Visual learners:</strong> Add colors, diagrams, and symbols</li>
                <li>• <strong>Auditory learners:</strong> Read prompts aloud, discuss with others</li>
                <li>• <strong>Kinesthetic learners:</strong> Use physical planners, move while reflecting</li>
                <li>• <strong>Executive functioning challenges:</strong> Start with simple daily planning</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg text-center">
            <p className="font-medium">
              🎯 Remember: These tools work best when they become habits. 
              Start with the ones that excite you most and build from there!
            </p>
            <p className="text-sm mt-2">
              Your learning toolkit is now complete - time to put it into action! 🌟
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};