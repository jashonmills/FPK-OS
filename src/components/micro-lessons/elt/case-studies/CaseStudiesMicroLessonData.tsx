import { MicroLessonData } from '../../MicroLessonContainer';

export const caseStudiesMicroLessons: MicroLessonData = {
  id: "case-studies-success-stories",
  moduleTitle: "Real Stories of Neurodiverse Success",
  totalScreens: 14,
  screens: [
    {
      id: "intro-case-studies",
      type: "concept",
      title: "Learning from Real Success Stories",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Real Stories, Real Strategies, Real Success</h2>
          <p className="text-lg leading-relaxed">
            These case studies showcase how neurodiverse learners have transformed challenges into strengths, applied course strategies in real life, and achieved remarkable success.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-center">
              <div className="text-4xl mb-2">🧠</div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-300">ADHD Success</h3>
              <p className="text-sm mt-2">Alex transforms hyperfocus into engineering excellence</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg text-center">
              <div className="text-4xl mb-2">📚</div>
              <h3 className="font-semibold text-purple-700 dark:text-purple-300">Dyslexia Triumph</h3>
              <p className="text-sm mt-2">Maya discovers her visual storytelling superpower</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg text-center">
              <div className="text-4xl mb-2">🔬</div>
              <h3 className="font-semibold text-green-700 dark:text-green-300">Autism Excellence</h3>
              <p className="text-sm mt-2">Ben leverages precision thinking in scientific research</p>
            </div>
          </div>
          
          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
            <h3 className="font-semibold text-primary mb-2">💡 What You'll Discover</h3>
            <ul className="space-y-1 text-sm">
              <li>• How course strategies work in real academic situations</li>
              <li>• Creative problem-solving approaches for common challenges</li>
              <li>• The power of self-advocacy and accommodation requests</li>
              <li>• How neurodiverse traits become competitive advantages</li>
              <li>• Practical examples you can adapt for your own situation</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Remember:</strong> These stories are about real people who faced real challenges. Their success came from understanding their brains, applying the right strategies, and never giving up on themselves.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: "alex-background",
      type: "example",
      title: "Meet Alex: The Hyperfocused Engineer (ADHD)",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">A</div>
              <div>
                <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">Alex Chen</h2>
                <p className="text-blue-600 dark:text-blue-400">First-Year Engineering Student • ADHD</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">🎯 Alex's Superpower</h3>
              <p className="text-sm">
                <strong>Incredible hyperfocus ability</strong> - When Alex finds something fascinating, he can work for hours with laser-sharp concentration, diving deeper into complex problems than most of his peers.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold">📚 Alex's Academic Situation</h3>
            <p>
              Alex is passionate about engineering and loves subjects like advanced physics and calculus. However, his ADHD creates some significant challenges that were affecting his grades and confidence.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">✅ Alex's Strengths</h4>
                <ul className="text-sm space-y-1">
                  <li>• Incredible hyperfocus on interesting subjects</li>
                  <li>• Creative problem-solving abilities</li>
                  <li>• High energy and enthusiasm</li>
                  <li>• Ability to see unique solutions</li>
                  <li>• Strong performance in engaging courses</li>
                </ul>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border-l-4 border-red-400">
                <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">⚠️ Alex's Challenges</h4>
                <ul className="text-sm space-y-1">
                  <li>• Severe procrastination on "boring" assignments</li>
                  <li>• Poor time estimation skills</li>
                  <li>• Chaotic note organization across courses</li>
                  <li>• Inconsistent grades (A's and D's)</li>
                  <li>• Last-minute panic on deadlines</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💭 Alex's Biggest Frustration</h4>
            <blockquote className="italic text-sm text-blue-700 dark:text-blue-300">
              "I know I'm smart. When something interests me, I can outperform anyone. But when it's boring or unclear, 
              I just... can't. I sit there for hours, accomplishing nothing, then hate myself for wasting time. 
              My grades don't reflect what I'm capable of, and that's devastating."
            </blockquote>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: "alex-strategies",
      type: "example",
      title: "Alex's Transformation: Strategies That Changed Everything",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">🛠️ How Alex Applied Course Strategies</h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h3 className="font-bold text-green-700 dark:text-green-300">Executive Functioning: The Pomodoro Revolution</h3>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg mb-3">
                <h4 className="font-semibold mb-2">📍 The Challenge:</h4>
                <p className="text-sm">Alex would either hyperfocus for 6+ hours or avoid tasks entirely. No middle ground.</p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🎯 The Solution: Modified Pomodoro Technique</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>25-minute focused bursts</strong> with 5-minute breaks</li>
                  <li>• <strong>Task initiation ritual:</strong> "Just one Pomodoro" to start</li>
                  <li>• <strong>Hyperfocus management:</strong> Timer prevents 6-hour sessions</li>
                  <li>• <strong>Reward system:</strong> Video game time after 4 Pomodoros</li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <h3 className="font-bold text-purple-700 dark:text-purple-300">Digital Organization System</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">📅 Google Calendar Magic</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Color-coded by course</li>
                    <li>• Time-blocking for study sessions</li>
                    <li>• Deadline reminders 1 week + 3 days early</li>
                    <li>• Buffer time between commitments</li>
                  </ul>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">📱 Task Management</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Todoist for breaking down projects</li>
                    <li>• Separate lists per course</li>
                    <li>• Priority levels and due dates</li>
                    <li>• Completion dopamine hits</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <h3 className="font-bold text-blue-700 dark:text-blue-300">Revolutionary Note-Taking System</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">🗺️ Mind Maps for Physics</h4>
                  <p className="text-xs mb-2">Visual connections between complex concepts</p>
                  <ul className="text-xs space-y-1">
                    <li>• Central topic in the middle</li>
                    <li>• Color-coded branches for themes</li>
                    <li>• Formulas and examples on branches</li>
                    <li>• Perfect for his visual brain</li>
                  </ul>
                </div>
                <div className="bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">📋 Modified Cornell Notes</h4>
                  <p className="text-xs mb-2">Structured approach for linear subjects</p>
                  <ul className="text-xs space-y-1">
                    <li>• Key formulas in main section</li>
                    <li>• Problem-solving steps clearly outlined</li>
                    <li>• Questions for active recall in cue column</li>
                    <li>• Summary for quick review</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">💪 Self-Advocacy Breakthrough</h4>
            <p className="text-sm">
              Alex learned to proactively communicate with professors about his ADHD, requesting accommodations like 
              extended time on assignments and quiet testing environments. He discovered that being upfront about his needs 
              actually impressed professors with his self-awareness and maturity.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: "alex-outcome",
      type: "summary",
      title: "Alex's Amazing Results: From Chaos to Engineering Success",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">🎉 Alex's Transformation Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">📉 Before (First Semester)</h3>
                <ul className="text-sm space-y-2">
                  <li>• <strong>GPA:</strong> 2.4 (inconsistent grades)</li>
                  <li>• <strong>Stress Level:</strong> Extremely high</li>
                  <li>• <strong>Study Habits:</strong> Chaotic, all-or-nothing</li>
                  <li>• <strong>Confidence:</strong> Very low</li>
                  <li>• <strong>Time Management:</strong> Constantly missing deadlines</li>
                  <li>• <strong>Self-Perception:</strong> "I'm not cut out for engineering"</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">📈 After (End of First Year)</h3>
                <ul className="text-sm space-y-2">
                  <li>• <strong>GPA:</strong> 3.6 (stable, strong performance)</li>
                  <li>• <strong>Stress Level:</strong> Manageable and productive</li>
                  <li>• <strong>Study Habits:</strong> Structured, sustainable routines</li>
                  <li>• <strong>Confidence:</strong> High and growing</li>
                  <li>• <strong>Time Management:</strong> Consistently meeting deadlines</li>
                  <li>• <strong>Self-Perception:</strong> "My ADHD is my engineering superpower"</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
            <h3 className="font-bold mb-4 text-primary">🚀 Alex's Key Breakthroughs</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-semibold mb-1">Hyperfocus = Superpower</h4>
                <p className="text-sm">Learned to channel intense focus into complex engineering problems, often solving them faster than peers</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold mb-1">Systems That Stick</h4>
                <p className="text-sm">Developed sustainable organization systems that work WITH his ADHD brain, not against it</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">🗣️</div>
                <h4 className="font-semibold mb-1">Confident Advocacy</h4>
                <p className="text-sm">Became comfortable asking for what he needs and explaining how his brain works differently</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-100 dark:bg-blue-900/50 p-5 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">💬 Alex's Reflection</h4>
            <blockquote className="italic text-sm text-blue-700 dark:text-blue-300 mb-3">
              "I used to think ADHD was this horrible thing that made me broken or lazy. Now I realize it's actually 
              my secret weapon. When I hyperfocus on an engineering problem, I can see solutions that others miss. 
              The Pomodoro technique helped me learn to control my focus instead of being controlled by it. 
              My professors now see me as the guy who dives deep and finds innovative approaches."
            </blockquote>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded border">
              <p className="text-xs font-medium">🎓 Current Status: Dean's List, Research Assistant Position, Confident in Engineering Future</p>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">📝 Strategies You Can Adapt</h4>
            <ul className="text-sm space-y-1 text-amber-800 dark:text-amber-200">
              <li>• Use timers to manage hyperfocus (both starting AND stopping)</li>
              <li>• Color-code your organization systems for visual clarity</li>
              <li>• Break large projects into "dopamine-sized" chunks</li>
              <li>• Communicate your learning style to instructors proactively</li>
              <li>• Turn your neurodiverse traits into academic advantages</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: "maya-background",
      type: "example",
      title: "Meet Maya: The Visual Storyteller (Dyslexia)",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">M</div>
              <div>
                <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200">Maya Rodriguez</h2>
                <p className="text-purple-600 dark:text-purple-400">High School Senior • Dyslexia • Future English Major</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">🎨 Maya's Superpower</h3>
              <p className="text-sm">
                <strong>Incredible visual-spatial reasoning and creative thinking</strong> - Maya sees stories, themes, and connections in ways that amaze her teachers. Her ideas are brilliant and original.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold">📖 Maya's Academic Journey</h3>
            <p>
              Maya has always loved literature and creative writing, but dyslexia made reading and writing a constant uphill battle. Despite her brilliant ideas, her grades didn't reflect her true capabilities.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">✨ Maya's Gifts</h4>
                <ul className="text-sm space-y-1">
                  <li>• Exceptional creative and original thinking</li>
                  <li>• Strong visual-spatial reasoning</li>
                  <li>• Deep understanding of themes and symbolism</li>
                  <li>• Empathetic character analysis</li>
                  <li>• Innovative storytelling approaches</li>
                </ul>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border-l-4 border-red-400">
                <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">📚 Maya's Struggles</h4>
                <ul className="text-sm space-y-1">
                  <li>• Reading long texts caused severe fatigue</li>
                  <li>• Spelling and grammar errors despite understanding</li>
                  <li>• Extreme time pressure during timed essays</li>
                  <li>• Self-consciousness about written work</li>
                  <li>• Grades that didn't reflect her brilliant ideas</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">💔 Maya's Daily Reality</h4>
            <blockquote className="italic text-sm text-purple-700 dark:text-purple-300">
              "I would spend three times longer than my classmates reading the same chapter, and I'd be exhausted afterward. 
              Then I'd write these amazing analyses full of insights my teacher had never heard before, but they'd be 
              covered in red ink because of spelling mistakes. I felt like I had so much to say but no way to say it properly."
            </blockquote>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🎭 The Creative Paradox</h4>
            <p className="text-sm">
              Maya could visualize entire story arcs, see symbolic connections across different works, and create original interpretations that impressed her teachers. But the mechanics of reading and writing made it nearly impossible to demonstrate these abilities effectively.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: "maya-strategies",
      type: "example", 
      title: "Maya's Creative Solutions: Visual Learning Unleashed",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">🎨 How Maya Transformed Her Learning Experience</h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h3 className="font-bold text-blue-700 dark:text-blue-300">Audio Learning Revolution</h3>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg mb-3">
                <h4 className="font-semibold mb-2">🔊 Text-to-Speech Technology</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm mb-2"><strong>Tools Maya Used:</strong></p>
                    <ul className="text-xs space-y-1">
                      <li>• Immersive Reader in Microsoft Word</li>
                      <li>• Voice Dream Reader app</li>
                      <li>• Chrome extension Read&Write</li>
                      <li>• Audiobooks from library</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm mb-2"><strong>Game-Changing Results:</strong></p>
                    <ul className="text-xs space-y-1">
                      <li>• Reading fatigue reduced by 80%</li>
                      <li>• Could process complex literature</li>
                      <li>• Better retention and comprehension</li>
                      <li>• More time for analysis and thinking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <h3 className="font-bold text-purple-700 dark:text-purple-300">Visual Note-Taking: Sketchnoting Magic</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">🎨 What Maya Drew</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Character relationship maps</li>
                    <li>• Visual symbols for themes</li>
                    <li>• Plot progression timelines</li>
                    <li>• Color-coded mood charts</li>
                    <li>• Metaphor visualization diagrams</li>
                  </ul>
                </div>
                <div className="bg-pink-50 dark:bg-pink-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">✨ Why It Worked</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Matched her visual-spatial strengths</li>
                    <li>• Made abstract themes concrete</li>
                    <li>• Easier to review than text notes</li>
                    <li>• Enhanced memory through dual coding</li>
                    <li>• Sparked creative essay ideas</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <h3 className="font-bold text-green-700 dark:text-green-300">Self-Advocacy & Accommodations</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">🗣️ How Maya Advocated for Herself</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Met with learning support specialist to understand her rights</li>
                    <li>• Requested extended time on written assignments (time-and-a-half)</li>
                    <li>• Got permission to use grammar/spell-checking software during exams</li>
                    <li>• Arranged to demonstrate understanding through alternative methods when needed</li>
                    <li>• Educated her English teacher about dyslexia strengths</li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">💡 Maya's Key Insight</h4>
                  <blockquote className="text-xs italic">
                    "I learned to explain to my teacher that my spelling might be imperfect, but my ideas are strong. 
                    I could demonstrate my understanding of literature through discussion, visual presentations, or 
                    creative projects just as well as through traditional essays."
                  </blockquote>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <h3 className="font-bold text-orange-700 dark:text-orange-300">Mindset Revolution: Dyslexia as Advantage</h3>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
                <p className="text-sm mb-3">
                  Understanding her dyslexia as a different way of processing information - not a deficit - 
                  completely transformed Maya's confidence and approach to learning.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h5 className="font-semibold text-xs mb-1">Old Mindset:</h5>
                    <p className="text-xs">"I'm broken and can't read like normal people."</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs mb-1">New Mindset:</h5>
                    <p className="text-xs">"My brain processes information visually and creatively, which gives me unique insights."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: "maya-outcome",
      type: "summary",
      title: "Maya's Literary Success: From Struggle to Strength",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">🌟 Maya's Incredible Transformation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="font-semibold text-red-700 dark:text-red-300 mb-3">😔 Before: The Struggle</h3>
              <ul className="text-sm space-y-2">
                <li>• <strong>Reading Speed:</strong> 3x slower than peers</li>
                <li>• <strong>Essay Grades:</strong> C's and D's despite brilliant ideas</li>
                <li>• <strong>Self-Confidence:</strong> "I'm not smart enough for English"</li>
                <li>• <strong>Study Time:</strong> 4+ hours just to read one chapter</li>
                <li>• <strong>Writing Process:</strong> Painful, avoided when possible</li>
                <li>• <strong>Class Participation:</strong> Afraid to share ideas</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3">🚀 After: The Triumph</h3>
              <ul className="text-sm space-y-2">
                <li>• <strong>Reading Efficiency:</strong> Audiobooks = faster comprehension</li>
                <li>• <strong>Essay Grades:</strong> A's and B's consistently</li>
                <li>• <strong>Self-Confidence:</strong> "My dyslexia is my creative advantage"</li>
                <li>• <strong>Study Quality:</strong> Focused on analysis, not decoding</li>
                <li>• <strong>Writing Process:</strong> Assistive tech made it enjoyable</li>
                <li>• <strong>Class Leadership:</strong> Most insightful contributor</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 p-6 rounded-lg">
            <h3 className="font-bold mb-4 text-purple-800 dark:text-purple-200">🎨 Maya's Creative Breakthroughs</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl mb-2">👁️</div>
                <h4 className="font-semibold mb-1">Visual Literature Analysis</h4>
                <p className="text-sm">Created mind maps and visual symbols that revealed connections teachers had never considered</p>
              </div>
              
              <div className="text-center bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl mb-2">🎭</div>
                <h4 className="font-semibold mb-1">Creative Expression</h4>
                <p className="text-sm">Used sketchnoting to capture character development and thematic elements in unique ways</p>
              </div>
              
              <div className="text-center bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl mb-2">🏆</div>
                <h4 className="font-semibold mb-1">Academic Recognition</h4>
                <p className="text-sm">Won school's creative writing contest and earned scholarship for English major</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">💬 Maya's Reflection</h4>
            <blockquote className="italic text-sm text-purple-700 dark:text-purple-300 mb-3">
              "I used to think dyslexia meant I could never be good at English. Now I realize it's actually what makes me 
              exceptional at English. I see stories and themes in ways that my teachers describe as 'refreshingly original' 
              and 'deeply insightful.' My sketchnotes have become so popular that other students ask to see them for study help. 
              Text-to-speech didn't just help me read faster - it freed up my brain to do what it does best: think creatively and make unique connections."
            </blockquote>
            
            <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded">
              <p className="text-xs font-medium">📚 Current Status: Accepted to Dream College English Program, Creative Writing Scholarship Recipient, Peer Tutor for Visual Learning Strategies</p>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">🎯 Strategies You Can Try</h4>
            <ul className="text-sm space-y-1 text-amber-800 dark:text-amber-200">
              <li>• Embrace text-to-speech technology for faster, less tiring reading</li>
              <li>• Use visual note-taking methods like sketchnoting or mind mapping</li>
              <li>• Request accommodations confidently - they level the playing field</li>
              <li>• Focus on your unique analytical strengths rather than mechanical struggles</li>
              <li>• Find ways to demonstrate knowledge beyond traditional writing when possible</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: "ben-background",
      type: "example",
      title: "Meet Ben: The Detail-Oriented Scientist (Autism)",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">B</div>
              <div>
                <h2 className="text-xl font-bold text-green-800 dark:text-green-200">Ben Kumar</h2>
                <p className="text-green-600 dark:text-green-400">College Biology Major • Autism Spectrum Disorder • Future Research Scientist</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">🔬 Ben's Superpower</h3>
              <p className="text-sm">
                <strong>Exceptional attention to detail and systematic thinking</strong> - Ben notices patterns and inconsistencies that others completely miss, making him incredibly valuable in scientific research and analysis.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold">🧬 Ben's Academic Profile</h3>
            <p>
              Ben is a meticulous and highly intelligent student who excels in subjects requiring precision, logical thinking, and systematic analysis. His professors recognize his exceptional contributions to lab work and research projects.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">🌟 Ben's Exceptional Abilities</h4>
                <ul className="text-sm space-y-1">
                  <li>• Incredible attention to detail and pattern recognition</li>
                  <li>• Systematic, logical approach to problem-solving</li>
                  <li>• Deep focus and concentration abilities</li>
                  <li>• Honest, direct communication style</li>
                  <li>• Exceptional memory for scientific facts and procedures</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">⚠️ Ben's Challenges</h4>
                <ul className="text-sm space-y-1">
                  <li>• Group projects cause significant stress</li>
                  <li>• Difficulty with unspoken social expectations</li>
                  <li>• Anxiety around unexpected changes or ambiguity</li>
                  <li>• Sensory overload in busy environments</li>
                  <li>• Struggles with transitions between tasks</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🧪 Ben's Lab Excellence</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                In individual lab work, Ben consistently produces the most accurate results and catches experimental errors 
                that others miss. His methodical approach and attention to protocol details make him invaluable for research accuracy.
              </p>
            </div>
            
            <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">😰 Ben's Group Project Anxiety</h4>
              <blockquote className="italic text-sm text-red-700 dark:text-red-300">
                "Group projects are my nightmare. People say things like 'let's meet up sometime this week' without specifying when or where. 
                They assume I know what they mean by 'casual presentation' or 'just wing it.' I need clear instructions and defined roles, 
                but I'm afraid to ask because people think I'm being difficult or controlling."
              </blockquote>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">⚡ Sensory Challenges</h4>
            <p className="text-sm">
              Ben found that fluorescent lights, background chatter, and unexpected loud noises in lecture halls and labs 
              made it difficult to concentrate, despite his natural ability for deep focus in quiet, organized environments.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: "ben-strategies",
      type: "example",
      title: "Ben's Scientific Approach: Systems That Work",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">🔬 How Ben Applied Scientific Thinking to Learning Success</h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h3 className="font-bold text-blue-700 dark:text-blue-300">Communication & Self-Advocacy Mastery</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🗣️ Clear Communication Scripts</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium mb-2">For Group Projects:</p>
                      <ul className="text-xs space-y-1">
                        <li>• "Could we set specific meeting times and locations?"</li>
                        <li>• "I work best with clearly defined roles. Could we create a task list?"</li>
                        <li>• "I'd like written outlines for presentations. Is that possible?"</li>
                        <li>• "I excel at data analysis and detailed research. Can that be my focus?"</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">For Professors:</p>
                      <ul className="text-xs space-y-1">
                        <li>• "I process information very thoroughly. Could I get assignment details in writing?"</li>
                        <li>• "I work better in quieter spaces. Are there alternative lab times?"</li>
                        <li>• "I notice small details others might miss. How can I contribute this strength?"</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">💪 Ben's Confidence-Building Approach</h4>
                  <p className="text-xs">
                    Instead of apologizing for his needs, Ben learned to frame them as contributions: 
                    "My systematic approach catches errors others might miss, and I'd like to work in a way that maximizes that strength."
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <h3 className="font-bold text-green-700 dark:text-green-300">Structured Routine & Transition Management</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">📅 Visual Schedule System</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Detailed daily schedule with exact times</li>
                    <li>• Color-coded by activity type (lecture, lab, study, break)</li>
                    <li>• 10-minute "buffer zones" between activities</li>
                    <li>• Backup plans for schedule changes</li>
                    <li>• Visual cues for important tasks</li>
                  </ul>
                </div>
                
                <div className="bg-teal-50 dark:bg-teal-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">🔄 Transition Strategies</h4>
                  <ul className="text-xs space-y-1">
                    <li>• 5-minute "wrap-up" ritual before transitions</li>
                    <li>• Checklist to ensure nothing is forgotten</li>
                    <li>• Specific routes planned between buildings</li>
                    <li>• Calming breathing exercises during buffer time</li>
                    <li>• "Preview" of next activity to reduce anxiety</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <h3 className="font-bold text-purple-700 dark:text-purple-300">Sensory Environment Optimization</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">🎧 Sensory Tools & Accommodations</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium mb-1">Tools Ben Used:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Noise-canceling headphones</li>
                        <li>• Fidget tools for focus</li>
                        <li>• Preferred seating (front corner, near exit)</li>
                        <li>• Blue light filtering glasses</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1">Environmental Requests:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Early morning lab sessions (quieter)</li>
                        <li>• Written instructions for experiments</li>
                        <li>• Permission to step out briefly if overwhelmed</li>
                        <li>• Study room access for group work</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <h3 className="font-bold text-orange-700 dark:text-orange-300">Leveraging Autistic Strengths</h3>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🧠 How Ben Reframed His Differences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-sm mb-2">Research Advantages:</h5>
                    <ul className="text-xs space-y-1">
                      <li>• Catches experimental errors others miss</li>
                      <li>• Follows protocols with perfect precision</li>
                      <li>• Notices subtle patterns in data</li>
                      <li>• Provides honest, unbiased observations</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm mb-2">Academic Contributions:</h5>
                    <ul className="text-xs space-y-1">
                      <li>• Asks clarifying questions that help everyone</li>
                      <li>• Provides detailed, accurate lab reports</li>
                      <li>• Offers systematic problem-solving approaches</li>
                      <li>• Maintains focus during long research sessions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: "ben-outcome",
      type: "summary",
      title: "Ben's Research Success: From Anxiety to Excellence",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">🏆 Ben's Scientific Achievement Story</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="font-semibold text-red-700 dark:text-red-300 mb-3">😟 Before: Struggling in Silence</h3>
              <ul className="text-sm space-y-2">
                <li>• <strong>Group Projects:</strong> Extreme anxiety, avoided when possible</li>
                <li>• <strong>Communication:</strong> Assumed others understood his needs</li>
                <li>• <strong>Environment:</strong> Overwhelmed by sensory input in labs</li>
                <li>• <strong>Transitions:</strong> High anxiety during schedule changes</li>
                <li>• <strong>Self-Perception:</strong> "I'm too different to succeed"</li>
                <li>• <strong>Performance:</strong> Inconsistent despite high ability</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3">🌟 After: Thriving as a Scientist</h3>
              <ul className="text-sm space-y-2">
                <li>• <strong>Group Projects:</strong> Confident contributor with clear role</li>
                <li>• <strong>Communication:</strong> Proactively advocates for optimal conditions</li>
                <li>• <strong>Environment:</strong> Optimized sensory experience for peak performance</li>
                <li>• <strong>Transitions:</strong> Smooth with structured buffer times</li>
                <li>• <strong>Self-Perception:</strong> "My autism is my scientific advantage"</li>
                <li>• <strong>Performance:</strong> Consistently excellent, recognized by faculty</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 p-6 rounded-lg">
            <h3 className="font-bold mb-4 text-green-800 dark:text-green-200">🔬 Ben's Research Excellence</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold mb-1">Precision Master</h4>
                <p className="text-sm">His attention to detail led to discovering a critical error in a major research protocol</p>
              </div>
              
              <div className="text-center bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl mb-2">👥</div>
                <h4 className="font-semibold mb-1">Team Asset</h4>
                <p className="text-sm">Became the go-to person for data accuracy and systematic analysis in group projects</p>
              </div>
              
              <div className="text-center bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl mb-2">🏅</div>
                <h4 className="font-semibold mb-1">Academic Recognition</h4>
                <p className="text-sm">Graduated with honors, accepted to competitive graduate research programs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">💬 Ben's Success Story</h4>
            <blockquote className="italic text-sm text-green-700 dark:text-green-300 mb-4">
              "I used to think my need for clear instructions and detailed systems made me 'high maintenance.' 
              Now I realize these same traits make me an exceptional scientist. My professors tell me that my 
              systematic approach and attention to detail are exactly what research requires. I've learned that 
              asking for what I need isn't being difficult - it's ensuring I can contribute my best work."
            </blockquote>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg mb-3">
              <h5 className="font-semibold text-sm mb-2">🎓 Career Impact</h5>
              <p className="text-xs">
                Ben's research mentor noted: "Ben's methodical approach and keen eye for detail have elevated 
                the quality of our entire lab's work. He catches things the rest of us miss and asks questions 
                that make us all think more carefully about our methods."
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded">
              <p className="text-xs font-medium">🚀 Current Status: Graduate Research Assistant, Published Co-Author, Future PhD Candidate in Molecular Biology</p>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">🎯 Strategies You Can Adapt</h4>
            <ul className="text-sm space-y-1 text-amber-800 dark:text-amber-200">
              <li>• Frame your needs as contributions rather than accommodations</li>
              <li>• Create detailed schedules with buffer time for transitions</li>
              <li>• Advocate for sensory-friendly environments proactively</li>
              <li>• Develop clear communication scripts for common situations</li>
              <li>• Identify and leverage your systematic thinking strengths</li>
              <li>• Build routines that support your optimal performance</li>
            </ul>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: "reflection-questions",
      type: "practice",
      title: "Your Success Story Reflection",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">🤔 Reflect on Your Own Learning Journey</h2>
          <p>
            After reading these success stories, take time to reflect on your own experiences and potential strategies.
          </p>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <h3 className="font-semibold mb-4">🧠 Connecting with the Stories</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Which story resonated most with you and why?</label>
                  <textarea
                    rows={3}
                    placeholder="Think about similarities in challenges, strengths, or learning style..."
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">What specific strategy from these stories could you try in your own learning?</label>
                  <textarea
                    rows={3}
                    placeholder="Consider the Pomodoro technique, visual note-taking, self-advocacy scripts, etc..."
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <h3 className="font-semibold mb-4">🎯 Your Challenge-to-Strength Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Learning Challenge:</label>
                  <textarea
                    rows={4}
                    placeholder="What's one learning challenge you face regularly? Be specific about the situation and how it affects you..."
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Potential Strategies to Try:</label>
                  <textarea
                    rows={4}
                    placeholder="Based on the case studies, what strategies could you adapt for this challenge? Think about tools, accommodations, or approaches..."
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <h3 className="font-semibold mb-4">💪 Your Unique Strengths Discovery</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">What unique strengths do you bring to learning and group work?</label>
                  <textarea
                    rows={3}
                    placeholder="Think about what you're naturally good at - attention to detail, creative thinking, pattern recognition, empathy, etc..."
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">How could you better advocate for yourself in academic settings?</label>
                  <textarea
                    rows={3}
                    placeholder="What would you say to teachers, peers, or support staff? What accommodations or changes would help you succeed?"
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border">
              <h3 className="font-semibold mb-4">🚀 Your Action Plan</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">One strategy you commit to trying this week:</label>
                  <input
                    type="text"
                    placeholder="Be specific about what you'll do and when..."
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">How you'll measure success with this strategy:</label>
                  <input
                    type="text"
                    placeholder="What will tell you it's working? How will you track progress?"
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Who could support you in implementing this change?</label>
                  <input
                    type="text"
                    placeholder="Teachers, family, friends, support staff, counselors..."
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">💡 Remember</h4>
            <p className="text-sm">
              Every success story started with someone who faced challenges similar to yours. The difference wasn't 
              in their problems disappearing - it was in finding the right strategies, tools, and support systems 
              that worked with their brain, not against it. Your story is just beginning!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 8
    },
    {
      id: "case-studies-summary",
      type: "summary",
      title: "Your Inspiration Toolkit: Real Success, Real Strategies",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">🎉 You've Discovered Your Success Roadmap!</h2>
          
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6 rounded-lg">
            <h3 className="font-bold mb-4">🌟 Key Success Patterns from Real Stories</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl mb-2 text-center">🧠</div>
                <h4 className="font-semibold text-blue-600 mb-2 text-center">Alex's ADHD Success</h4>
                <ul className="text-sm space-y-1">
                  <li>✅ Pomodoro Technique for focus management</li>
                  <li>✅ Digital organization systems</li>
                  <li>✅ Hyperfocus as competitive advantage</li>
                  <li>✅ Proactive professor communication</li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl mb-2 text-center">🎨</div>
                <h4 className="font-semibold text-purple-600 mb-2 text-center">Maya's Dyslexia Triumph</h4>
                <ul className="text-sm space-y-1">
                  <li>✅ Text-to-speech technology</li>
                  <li>✅ Visual note-taking (sketchnoting)</li>
                  <li>✅ Accommodations as level playing field</li>
                  <li>✅ Creative strengths recognition</li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl mb-2 text-center">🔬</div>
                <h4 className="font-semibold text-green-600 mb-2 text-center">Ben's Autism Excellence</h4>
                <ul className="text-sm space-y-1">
                  <li>✅ Structured communication scripts</li>
                  <li>✅ Sensory environment optimization</li>
                  <li>✅ Detail-oriented strengths leveraged</li>
                  <li>✅ Systematic thinking as advantage</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h4 className="font-semibold text-primary mb-3">🎯 Universal Success Strategies</h4>
              <ul className="text-sm space-y-2">
                <li><strong>Self-Advocacy:</strong> All three learned to communicate their needs confidently</li>
                <li><strong>Strength Focus:</strong> Each reframed challenges as unique advantages</li>
                <li><strong>Tool Adoption:</strong> Found and used technology/systems that worked</li>
                <li><strong>Support Networks:</strong> Built relationships with understanding mentors</li>
                <li><strong>Systematic Approach:</strong> Applied course strategies consistently</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h4 className="font-semibold text-primary mb-3">💡 Common Breakthrough Moments</h4>
              <ul className="text-sm space-y-2">
                <li><strong>Mindset Shift:</strong> From "I'm broken" to "I'm different and valuable"</li>
                <li><strong>Tool Discovery:</strong> Finding the right assistive technology</li>
                <li><strong>Accommodation Success:</strong> Experiencing how accommodations work</li>
                <li><strong>Strength Recognition:</strong> Others acknowledging their unique contributions</li>
                <li><strong>Confidence Building:</strong> Academic success reinforcing new strategies</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 p-6 rounded-lg">
            <h4 className="font-bold text-green-800 dark:text-green-200 mb-4">🚀 Your Success Action Plan</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold mb-2">This Week, Try:</h5>
                <ul className="text-sm space-y-1">
                  <li>• Choose ONE strategy from the case studies</li>
                  <li>• Identify one person who could support you</li>
                  <li>• Practice self-advocacy language</li>
                  <li>• Focus on your unique strengths daily</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold mb-2">This Month, Build:</h5>
                <ul className="text-sm space-y-1">
                  <li>• A support network of understanding people</li>
                  <li>• Consistent use of helpful tools/techniques</li>
                  <li>• Confidence in your accommodation needs</li>
                  <li>• Recognition of your growing success</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg text-center">
            <p className="font-medium">
              🌟 These success stories prove that with the right strategies, support, and mindset, 
              neurodiverse learners don't just survive - they thrive and excel! 
            </p>
            <p className="text-sm mt-2">
              Your unique brain is not a limitation - it's your pathway to extraordinary success. 💪
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};