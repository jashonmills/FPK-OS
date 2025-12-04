import { MicroLessonData } from '../../MicroLessonContainer';

export const selfAssessmentMicroLessons: MicroLessonData = {
  id: "self-assessments",
  moduleTitle: "Self-Assessment Tools & Learning Discovery",
  totalScreens: 12,
  screens: [
    {
      id: "intro-assessments",
      type: "concept",
      title: "Welcome to Your Learning Discovery Journey",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Understanding Yourself as a Learner</h2>
          <p className="text-lg leading-relaxed">
            Self-assessment is the foundation of empowered learning. These tools will help you understand your unique learning style, executive functioning strengths, and areas for growth.
          </p>
          
          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
            <h3 className="font-semibold text-primary mb-2">🎯 What You'll Discover</h3>
            <ul className="space-y-2 text-sm">
              <li>• Your dominant learning preferences (visual, auditory, kinesthetic)</li>
              <li>• Executive functioning strengths and challenges</li>
              <li>• Metacognitive awareness through self-reflection</li>
              <li>• Knowledge gaps to guide your learning journey</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Remember:</strong> There are no right or wrong answers in these assessments. They're designed to help you understand how your brain works best, not to judge or categorize you.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: "learning-style-intro",
      type: "concept", 
      title: "Learning Style Inventory Introduction",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Discover How You Learn Best</h2>
          <p>Your learning style represents your preferred way of receiving and processing information. Understanding this helps you choose the most effective study strategies.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">👁️</div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-300">Visual Learners</h3>
              <p className="text-sm mt-2">Learn best through seeing information - diagrams, charts, colors, and spatial organization</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">👂</div>
              <h3 className="font-semibold text-green-700 dark:text-green-300">Auditory Learners</h3>
              <p className="text-sm mt-2">Learn best through hearing information - lectures, discussions, reading aloud</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">✋</div>
              <h3 className="font-semibold text-purple-700 dark:text-purple-300">Kinesthetic Learners</h3>
              <p className="text-sm mt-2">Learn best through doing - hands-on activities, movement, and tactile experiences</p>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📝 Instructions for the Next Screen</h4>
            <p className="text-sm">Rate each statement from 1 to 5, where:</p>
            <ul className="text-sm mt-2 space-y-1">
              <li><strong>1 = Rarely/Never applies</strong></li>
              <li><strong>3 = Sometimes applies</strong></li>
              <li><strong>5 = Always/Strongly applies</strong></li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: "visual-learning-assessment",
      type: "practice",
      title: "Visual Learning Style Assessment",
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border-l-4 border-blue-400">
            <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">👁️ Visual Learner Traits</h2>
            <p className="text-sm mb-4">Rate each statement from 1 (rarely) to 5 (always):</p>
          </div>
          
          <div className="space-y-4">
            {[
              "I understand information best when I see it (diagrams, charts, videos)",
              "I prefer to read instructions rather than hear them",
              "I use color-coding in my notes or study materials", 
              "I remember faces more easily than names",
              "I often use gestures when I speak"
            ].map((statement, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <p className="mb-3 font-medium">{index + 1}. {statement}</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map(value => (
                    <label key={value} className="flex flex-col items-center gap-1 cursor-pointer">
                      <input 
                        type="radio" 
                        name={`visual-${index}`} 
                        value={value}
                        className="form-radio text-blue-600"
                      />
                      <span className="text-sm">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg">
            <p className="text-sm"><strong>After completing:</strong> Add up your scores (5-25 total). Higher scores indicate stronger visual learning preferences.</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: "auditory-learning-assessment", 
      type: "practice",
      title: "Auditory Learning Style Assessment",
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border-l-4 border-green-400">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4">👂 Auditory Learner Traits</h2>
            <p className="text-sm mb-4">Rate each statement from 1 (rarely) to 5 (always):</p>
          </div>
          
          <div className="space-y-4">
            {[
              "I understand information best when I hear it (lectures, discussions, podcasts)",
              "I prefer to listen to instructions rather than read them",
              "I often talk to myself or read aloud to understand concepts",
              "I remember names more easily than faces", 
              "I enjoy group discussions and debates"
            ].map((statement, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <p className="mb-3 font-medium">{index + 1}. {statement}</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map(value => (
                    <label key={value} className="flex flex-col items-center gap-1 cursor-pointer">
                      <input 
                        type="radio" 
                        name={`auditory-${index}`} 
                        value={value}
                        className="form-radio text-green-600"
                      />
                      <span className="text-sm">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg">
            <p className="text-sm"><strong>After completing:</strong> Add up your scores (5-25 total). Higher scores indicate stronger auditory learning preferences.</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: "kinesthetic-learning-assessment",
      type: "practice", 
      title: "Kinesthetic Learning Style Assessment",
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border-l-4 border-purple-400">
            <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-4">✋ Kinesthetic Learner Traits</h2>
            <p className="text-sm mb-4">Rate each statement from 1 (rarely) to 5 (always):</p>
          </div>
          
          <div className="space-y-4">
            {[
              "I understand information best when I do it (hands-on activities, experiments)",
              "I learn best by practicing or trying things out",
              "I find it hard to sit still for long periods and prefer to move around",
              "I use physical objects or models to understand concepts",
              "I often use hand movements or fidget when I think"
            ].map((statement, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <p className="mb-3 font-medium">{index + 1}. {statement}</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map(value => (
                    <label key={value} className="flex flex-col items-center gap-1 cursor-pointer">
                      <input 
                        type="radio" 
                        name={`kinesthetic-${index}`} 
                        value={value}
                        className="form-radio text-purple-600"
                      />
                      <span className="text-sm">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-lg">
            <p className="text-sm"><strong>After completing:</strong> Add up your scores (5-25 total). Higher scores indicate stronger kinesthetic learning preferences.</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: "learning-style-results",
      type: "summary",
      title: "Your Learning Style Profile",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Understanding Your Results</h2>
          
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
            <h3 className="font-bold mb-4">🎯 Interpreting Your Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600">Visual Score: ___/25</div>
                <p className="mt-1">20-25: Strong visual preference</p>
                <p>15-19: Moderate visual preference</p>
                <p>Below 15: Less visual preference</p>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">Auditory Score: ___/25</div>
                <p className="mt-1">20-25: Strong auditory preference</p>
                <p>15-19: Moderate auditory preference</p>
                <p>Below 15: Less auditory preference</p>
              </div>
              <div className="text-center">
                <div className="font-semibold text-purple-600">Kinesthetic Score: ___/25</div>
                <p className="mt-1">20-25: Strong kinesthetic preference</p>
                <p>15-19: Moderate kinesthetic preference</p>
                <p>Below 15: Less kinesthetic preference</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">📝 Reflection Questions</h4>
              <ul className="text-sm space-y-2">
                <li>• Which category had your highest score? What does this tell you?</li>
                <li>• How can you incorporate more of your preferred style into studying?</li>
                <li>• Which areas scored lower? How might you develop these skills?</li>
                <li>• Do you have a multimodal learning style (high scores in multiple areas)?</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: "executive-functioning-intro",
      type: "concept",
      title: "Executive Functioning Self-Assessment Introduction", 
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Understanding Your Executive Functions</h2>
          <p className="leading-relaxed">
            Executive functioning skills are the mental processes that help us plan, focus attention, remember instructions, and manage multiple tasks successfully.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">🧠 Core Skills Include:</h3>
              <ul className="text-sm space-y-1">
                <li>• Planning & Organization</li>
                <li>• Time Management</li>
                <li>• Working Memory</li>
                <li>• Task Initiation</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">💪 Also Including:</h3>
              <ul className="text-sm space-y-1">
                <li>• Self-Regulation</li>
                <li>• Cognitive Flexibility</li>
                <li>• Attention Control</li>
                <li>• Problem Solving</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">🎯 Assessment Goals</h4>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              This assessment will help you identify your executive functioning strengths and areas for growth. Be honest with yourself - this information will guide your personal learning strategy development.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: "executive-functioning-assessment",
      type: "practice",
      title: "Executive Functioning Checklist",
      content: (
        <div className="space-y-6">
          <div className="bg-primary/10 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Executive Functioning Self-Assessment</h2>
            <p className="text-sm mb-4">For each statement, select how often it describes you: Never (N), Sometimes (S), Often (O), Always (A)</p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                category: "Planning",
                items: [
                  "I can break down large tasks into smaller, manageable steps",
                  "I can anticipate potential problems and plan for them"
                ]
              },
              {
                category: "Organization", 
                items: [
                  "My workspace (physical and digital) is generally tidy and organized",
                  "I can easily find my notes and materials when I need them"
                ]
              },
              {
                category: "Time Management",
                items: [
                  "I usually complete tasks by their deadlines",
                  "I can accurately estimate how long tasks will take"
                ]
              },
              {
                category: "Task Initiation",
                items: [
                  "I can start tasks without excessive procrastination", 
                  "I feel motivated to begin new assignments"
                ]
              },
              {
                category: "Working Memory",
                items: [
                  "I can hold multiple pieces of information in my mind to complete a task",
                  "I can follow multi-step instructions without getting lost"
                ]
              },
              {
                category: "Self-Regulation",
                items: [
                  "I can manage my emotions and impulses effectively",
                  "I can stay focused on a task despite distractions"
                ]
              }
            ].map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h3 className="font-bold text-primary mb-3">{section.category}</h3>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <p className="mb-2 text-sm">{item}</p>
                      <div className="flex gap-4">
                        {[
                          { label: "N", value: "never" },
                          { label: "S", value: "sometimes" }, 
                          { label: "O", value: "often" },
                          { label: "A", value: "always" }
                        ].map(option => (
                          <label key={option.value} className="flex items-center gap-1 cursor-pointer">
                            <input 
                              type="radio" 
                              name={`ef-${sectionIndex}-${itemIndex}`}
                              value={option.value}
                              className="form-radio text-primary"
                            />
                            <span className="text-xs">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: "ef-results-analysis",
      type: "summary",
      title: "Executive Functioning Results & Action Planning",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Your Executive Functioning Profile</h2>
          
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
            <h3 className="font-bold mb-4">🎯 Understanding Your Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">✅ Your Strengths</h4>
                <p className="text-sm mb-2">Areas where you answered "Often" or "Always":</p>
                <ul className="text-sm space-y-1">
                  <li>• Planning: ___/2 strong responses</li>
                  <li>• Organization: ___/2 strong responses</li>
                  <li>• Time Management: ___/2 strong responses</li>
                  <li>• Task Initiation: ___/2 strong responses</li>
                  <li>• Working Memory: ___/2 strong responses</li>
                  <li>• Self-Regulation: ___/2 strong responses</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">🎯 Growth Areas</h4>
                <p className="text-sm mb-2">Areas where you answered "Never" or "Sometimes":</p>
                <div className="space-y-2 text-sm">
                  <div>Priority 1: ________________</div>
                  <div>Priority 2: ________________</div>
                  <div>Priority 3: ________________</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">📋 Action Planning</h4>
            <div className="space-y-3 text-sm">
              <div>
                <strong>This Week I Will Focus On:</strong>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded border">
                  ________________________________
                </div>
              </div>
              
              <div>
                <strong>Specific Strategy I'll Try:</strong>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded border">
                  ________________________________
                </div>
              </div>
              
              <div>
                <strong>How I'll Measure Success:</strong>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded border">
                  ________________________________
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: "knowledge-check-intro",
      type: "concept",
      title: "Module Knowledge Checks",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Checking Your Understanding</h2>
          <p className="leading-relaxed">
            Knowledge check quizzes help you identify what you've learned and what areas might need more attention. These are for self-assessment, not grading.
          </p>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">📚 Available Module Quizzes</h3>
            <ul className="space-y-2 text-sm">
              <li>• Module 1: Understanding Neurodiversity</li>
              <li>• Module 2: Executive Functioning Skills</li>
              <li>• Module 3: Study Techniques & Memory</li>
              <li>• Module 4: Strengths & Self-Advocacy</li>
              <li>• Module 5: Real-World Applications</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">💡 How to Use These Quizzes</h4>
              <ul className="text-sm space-y-1">
                <li>• Take them after completing each module</li>
                <li>• Use results to identify knowledge gaps</li>
                <li>• Review areas where you scored low</li>
                <li>• Retake after additional study</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">🎯 Success Tips</h4>
              <ul className="text-sm space-y-1">
                <li>• Read each question carefully</li>
                <li>• Think about real examples</li>
                <li>• Don't overthink the answers</li>
                <li>• Focus on understanding, not memorizing</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: "module1-knowledge-check",
      type: "practice",
      title: "Module 1 Knowledge Check: Understanding Neurodiversity",
      content: (
        <div className="space-y-6">
          <div className="bg-primary/10 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Module 1 Knowledge Check</h2>
            <p className="text-sm">Choose the best answer for each question.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h3 className="font-semibold mb-3">1. Which of the following best describes neurodiversity?</h3>
              <div className="space-y-2">
                {[
                  "a) A medical condition that needs to be cured",
                  "b) The idea that neurological differences are natural human variations",
                  "c) A term only used for individuals with severe learning disabilities", 
                  "d) A new theory that lacks scientific evidence"
                ].map((option, index) => (
                  <label key={index} className="flex items-start gap-2 cursor-pointer">
                    <input type="radio" name="q1" value={option[0]} className="form-radio text-primary mt-1" />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h3 className="font-semibold mb-3">2. What is metacognition?</h3>
              <div className="space-y-2">
                {[
                  "a) The ability to memorize large amounts of information quickly",
                  "b) The process of thinking about your own thinking and learning",
                  "c) A specific type of learning disability",
                  "d) The ability to multitask effectively"
                ].map((option, index) => (
                  <label key={index} className="flex items-start gap-2 cursor-pointer">
                    <input type="radio" name="q2" value={option[0]} className="form-radio text-primary mt-1" />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h3 className="font-semibold mb-3">3. Identifying your personal learning style helps you to:</h3>
              <div className="space-y-2">
                {[
                  "a) Only use one type of study method",
                  "b) Choose the most effective study strategies for yourself", 
                  "c) Prove that one learning style is superior to others",
                  "d) Avoid subjects that don't match your learning style"
                ].map((option, index) => (
                  <label key={index} className="flex items-start gap-2 cursor-pointer">
                    <input type="radio" name="q3" value={option[0]} className="form-radio text-primary mt-1" />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
            <p className="text-sm"><strong>Answer Key:</strong> 1. b, 2. b, 3. b</p>
            <p className="text-sm mt-2">After selecting your answers, check them against the key above to see how well you understood the concepts.</p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: "assessment-summary",
      type: "summary", 
      title: "Your Complete Learning Assessment Profile",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Congratulations on Completing Your Self-Assessment!</h2>
          
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6 rounded-lg">
            <h3 className="font-bold mb-4">🎯 Your Personal Learning Profile Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">Learning Style Preferences</h4>
                  <div className="text-sm space-y-1">
                    <div>Visual: ___/25 ({Math.round(0/25 * 100)}%)</div>
                    <div>Auditory: ___/25 ({Math.round(0/25 * 100)}%)</div>
                    <div>Kinesthetic: ___/25 ({Math.round(0/25 * 100)}%)</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Executive Functioning Strengths</h4>
                  <div className="text-sm">
                    <div>Top 3 Areas:</div>
                    <div>1. _________________</div>
                    <div>2. _________________</div>
                    <div>3. _________________</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-orange-600 mb-2">Growth Focus Areas</h4>
                  <div className="text-sm">
                    <div>Priority 1: _________________</div>
                    <div>Priority 2: _________________</div>
                    <div>Priority 3: _________________</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">Knowledge Check Results</h4>
                  <div className="text-sm">
                    <div>Module 1: ___/3 correct</div>
                    <div>Areas to review: _____________</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">🚀 Next Steps in Your Learning Journey</h4>
            <ul className="text-sm space-y-2">
              <li>• Use your learning style preferences to guide study strategy selection</li>
              <li>• Focus on developing your identified growth areas using course strategies</li>
              <li>• Revisit these assessments periodically to track your progress</li>
              <li>• Apply your self-knowledge to create personalized learning plans</li>
            </ul>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg text-center">
            <p className="text-sm font-medium">
              🎉 You now have a comprehensive understanding of your learning profile! 
              Use this knowledge to make the most of the remaining course modules.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};