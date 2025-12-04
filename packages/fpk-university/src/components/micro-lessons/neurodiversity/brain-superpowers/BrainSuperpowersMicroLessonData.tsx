import { MicroLessonData } from '../../MicroLessonContainer';

export const brainSuperpowersMicroLessons: MicroLessonData = {
  id: 'brain-superpowers',
  moduleTitle: 'Your Brain\'s Superpowers',
  totalScreens: 8,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Your Brain\'s Superpowers',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-blue-800 dark:text-blue-200 font-semibold">UNIT 1: A NEW WAY OF THINKING</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">LESSON 1.2: Your Brain's Superpowers</h1>
            <p className="text-xl text-muted-foreground">Reframing Traits as Strengths</p>
          </div>

          <div className="prose max-w-none text-center">
            <p className="text-lg leading-relaxed">
              It's time to flip the script. Your brain is not a weakness; it's an asset. Your unique wiring is a source of talent that many neurotypical individuals don't possess. Let's discover your superpowers!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border">
              <div className="text-3xl mb-2">👁️</div>
              <h4 className="font-semibold">Visual Thinking</h4>
              <p className="text-sm text-muted-foreground">See the big picture</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold">Hyperfocus</h4>
              <p className="text-sm text-muted-foreground">Intense concentration</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border">
              <div className="text-3xl mb-2">🔧</div>
              <h4 className="font-semibold">Systematic Thinking</h4>
              <p className="text-sm text-muted-foreground">Logical problem-solving</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'reframing-concept',
      type: 'concept',
      title: 'The Power of Reframing',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">From Deficit to Superpower</h2>
          
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              In this lesson, we reframe common neurodiverse traits as powerful strengths. The key is to stop viewing your traits through a negative lens and start seeing their potential.
            </p>

            <div className="bg-gradient-to-r from-red-50 to-green-50 dark:from-red-900/20 dark:to-green-900/20 p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-center">The Great Reframe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-700 dark:text-red-300">❌ Old Labels</h4>
                  <ul className="space-y-1 text-red-600 dark:text-red-400 text-sm">
                    <li>• Attention deficit</li>
                    <li>• Learning disability</li>
                    <li>• Social difficulties</li>
                    <li>• Inflexible thinking</li>
                    <li>• Hyperactive</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700 dark:text-green-300">✅ Superpowers</h4>
                  <ul className="space-y-1 text-green-600 dark:text-green-400 text-sm">
                    <li>• Attention variability</li>
                    <li>• Alternative learning style</li>
                    <li>• Deep focus capability</li>
                    <li>• Systematic precision</li>
                    <li>• High energy & creativity</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-lg leading-relaxed mt-6">
              Here are some examples of how common neurodiverse traits can be leveraged as superpowers in the real world:
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'dyslexia-superpower',
      type: 'example',
      title: 'Dyslexia: The Creative Visionary',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="p-4 bg-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">Dyslexia: The Creative Visionary</h2>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              While dyslexia can present challenges with decoding text, the brain often develops incredible strengths to compensate. This leads to superior abilities in key areas:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">🔍 Pattern Recognition</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Exceptional ability to spot patterns and connections that others miss
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">📐 Spatial Reasoning</h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Superior 3D thinking and understanding of spatial relationships
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🌟 Holistic Thinking</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Ability to see entire systems at once, not just parts
                </p>
              </div>
            </div>

            <div className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Case Study: The Architect Who Sees in 3D</h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                An architect with dyslexia struggles to read building codes but can walk into a room and instantly visualize it from every angle, understanding its spatial relationships and potential. When solving design problems, they don't draw 2D floor plans first—they build complex mental models and rotate them in their mind.
              </p>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">💭 Reflection Question:</h4>
                <p className="text-sm text-muted-foreground">
                  Can you remember a time when your brain seemed to skip steps and go straight to the answer? Maybe you saw a pattern without knowing the formula, or had a perfect vision of a project before knowing how to get there?
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'adhd-superpower',
      type: 'example',
      title: 'ADHD: The Hyperfocused Innovator',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="p-4 bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-300">ADHD: The Hyperfocused Innovator</h2>
          </div>
          
          <div className="prose max-w-none">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">💡 Truth Bomb</h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                The label "attention deficit" is a misnomer. A more accurate description is "attention variability." 
                Your brain doesn't have less attention—it has a different kind of attention!
              </p>
            </div>

            <p className="text-lg leading-relaxed mb-6">
              A mind with ADHD can be highly associative, making connections between seemingly unrelated ideas—a key driver of creativity and innovation:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200">
                <h4 className="font-semibold text-pink-700 dark:text-pink-300 mb-2">🎨 Creativity</h4>
                <p className="text-sm text-pink-600 dark:text-pink-400">
                  Exceptional ability to think outside the box and generate novel ideas
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🔗 Associative Thinking</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Making unexpected connections between unrelated concepts
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">🎯 Hyperfocus</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Intense, sustained attention on areas of passion and interest
                </p>
              </div>
            </div>

            <div className="border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">Case Study: The Event Planner Who Connects Everything</h3>
              <p className="text-orange-700 dark:text-orange-300 mb-4">
                An event planner with ADHD is tasked with organizing a major conference. While others might feel overwhelmed by thousands of details, the ADHD brain rapidly jumps between them—from speakers to catering to venues—seeing how each detail affects the others. Their ability to manage a seemingly chaotic system of moving parts is their greatest asset.
              </p>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-bold text-orange-800 dark:text-orange-200 mb-2">💭 Reflection Question:</h4>
                <p className="text-sm text-muted-foreground">
                  What is a topic or task that you can lose hours doing? What allows your mind to enter that state of deep, intense focus? How can you apply that same energy to other parts of your life?
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'autism-superpower',
      type: 'example',
      title: 'Autism: The Systematic Problem Solver',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="p-4 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">Autism: The Systematic Problem Solver</h2>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              You have a natural advantage in fields that require precision and logic. Your brain excels at systematic thinking and detailed analysis:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">🔍 Attention to Detail</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Exceptional ability to notice patterns and inconsistencies others miss
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🧮 Logical Systems</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Highly logical and systematic approach to problem-solving
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">🎯 Deep Focus</h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Extraordinary capacity for sustained concentration on interests
                </p>
              </div>
            </div>

            <div className="border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-900/10 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">Case Study: The Software Engineer</h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                A software engineer with autism is tasked with debugging massive, complex code. While others might get frustrated by the complexity, the autistic mind methodically breaks the problem down into a logical system. They can spot the tiny, misplaced comma or flawed line of code that others overlooked, solving problems that seemed impossible.
              </p>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">💭 Reflection Question:</h4>
                <p className="text-sm text-muted-foreground">
                  Describe a process you enjoy—building, organizing, following recipes. What about the methodical, step-by-step nature appeals to you? How does it feel to see chaos become orderly and predictable?
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'debunking-myths',
      type: 'practice',
      title: 'Debunking More Myths',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Myth vs. Fact: More Misconceptions</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10 p-6 rounded-r-lg">
              <div className="space-y-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <p className="font-semibold text-red-800 dark:text-red-200">❌ Myth:</p>
                  <p className="text-red-700 dark:text-red-300">Having ADHD means you are lazy and unmotivated.</p>
                </div>
                
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="font-semibold text-green-800 dark:text-green-200">✅ Fact:</p>
                  <p className="text-green-700 dark:text-green-300">
                    A person with ADHD is often trying to manage an overactive nervous system and an "engine with no brakes." The feeling of being "unmotivated" is often related to executive function challenges with unstimulating tasks. It has nothing to do with lack of effort or desire to succeed.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10 p-6 rounded-r-lg">
              <div className="space-y-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <p className="font-semibold text-red-800 dark:text-red-200">❌ Myth:</p>
                  <p className="text-red-700 dark:text-red-300">Autism means you lack empathy or emotion.</p>
                </div>
                
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="font-semibold text-green-800 dark:text-green-200">✅ Fact:</p>
                  <p className="text-green-700 dark:text-green-300">
                    Many people with autism feel emotions intensely, but may express them differently. Some studies suggest that autistic individuals can have heightened empathy for others they relate to, as they can more easily understand different perspectives.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-3">🎯 Challenge Exercise:</h4>
            <p className="text-muted-foreground mb-3">
              Think of a negative label you've been given or have given yourself. Now reframe it as a potential strength:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Old Label:</p>
                <p className="text-xs text-red-600 dark:text-red-400">e.g., "I'm too sensitive"</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Reframed Strength:</p>
                <p className="text-xs text-green-600 dark:text-green-400">e.g., "I have high emotional intelligence"</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'superpower-mindset',
      type: 'summary',
      title: 'Your Superpower Mindset',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">A Superpower, Not a Deficit</h2>
            <p className="text-xl text-muted-foreground">Your Unique Strengths Revealed</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-lg border">
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-center mb-6">
                The goal of this lesson is to show you how to start seeing your traits not as personal failings, but as superpowers. Your unique wiring is not a flaw; it is a source of strength that society is just beginning to fully appreciate.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-3xl mb-2">🧠</div>
                  <h4 className="font-semibold">Complex World</h4>
                  <p className="text-sm text-muted-foreground">Needs diverse thinking</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-semibold">Perfect Fit</h4>
                  <p className="text-sm text-muted-foreground">Your brain is designed for this</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-3xl mb-2">✨</div>
                  <h4 className="font-semibold">Custom Path</h4>
                  <p className="text-sm text-muted-foreground">Made for your success</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Your Superpowers Discovered</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border text-center">
                <div className="text-2xl mb-2">👁️</div>
                <h4 className="font-semibold text-purple-700 dark:text-purple-300">Visual Thinking</h4>
                <p className="text-xs text-purple-600 dark:text-purple-400">See patterns & big picture</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-semibold text-orange-700 dark:text-orange-300">Hyperfocus Power</h4>
                <p className="text-xs text-orange-600 dark:text-orange-400">Intense & creative focus</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border text-center">
                <div className="text-2xl mb-2">🔧</div>
                <h4 className="font-semibold text-green-700 dark:text-green-300">System Mastery</h4>
                <p className="text-xs text-green-600 dark:text-green-400">Logical & precise solutions</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-3 text-center">🚀 Remember This Always:</h4>
            <p className="text-center text-lg font-medium text-blue-700 dark:text-blue-300">
              "By understanding your unique strengths, you can choose a path in life—and in your education—that is custom-made for your success. Don't ever forget how truly powerful your mind is."
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'completion',
      type: 'summary',
      title: 'Superpowers Unlocked',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-purple-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">🎉 Superpowers Unlocked!</h2>
            <p className="text-xl text-muted-foreground">Your Strengths Are Your Assets</p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-900/20 dark:to-purple-900/20 p-8 rounded-lg border">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-300">You Are Powerful!</h3>
              
              <p className="text-lg leading-relaxed">
                You've discovered that your neurodiverse traits aren't limitations—they're superpowers! 
                You now see your brain through a lens of strength and possibility.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-3xl mb-2">🔄</div>
                  <h4 className="font-semibold">Mindset Shift</h4>
                  <p className="text-sm text-muted-foreground">From deficit to superpower</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-semibold">Unique Strengths</h4>
                  <p className="text-sm text-muted-foreground">Visual, focus & systematic thinking</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-3xl mb-2">🌍</div>
                  <h4 className="font-semibold">Perfect Fit</h4>
                  <p className="text-sm text-muted-foreground">Your brain for today's world</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-semibold">Custom Success</h4>
                  <p className="text-sm text-muted-foreground">Path designed for you</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200">
            <h4 className="font-semibold mb-3 text-center">Ready to Build Your Learning System?</h4>
            <p className="text-center text-muted-foreground">
              Now that you know your superpowers, it's time to learn how to build foundational learning strategies 
              that work with your unique brain, not against it!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 2
    }
  ]
};