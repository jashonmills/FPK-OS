import { MicroLessonData } from '../../MicroLessonContainer';
import humanBrainForestImage from '@/assets/human-brain-forest.jpg';

export const whatIsNeurodiversityMicroLessons: MicroLessonData = {
  id: 'what-is-neurodiversity',
  moduleTitle: 'What is Neurodiversity?',
  totalScreens: 8,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'What is Neurodiversity?',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="text-blue-800 dark:text-blue-200 font-semibold">UNIT 1: A NEW WAY OF THINKING</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">LESSON 1.1: What is Neurodiversity?</h1>
            <p className="text-xl text-muted-foreground">A New Lens for Understanding the Brain</p>
          </div>

          <div className="prose max-w-none text-center">
            <p className="text-lg leading-relaxed">
              Welcome to a revolutionary way of thinking about the human brain. In this lesson, we'll explore how neurodiversity 
              challenges traditional views and opens up a world of possibilities for understanding our minds.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'concept-definition',
      type: 'concept',
      title: 'A New Lens for Understanding',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">A New Lens for Understanding the Brain</h2>
          
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Neurodiversity is a concept that challenges the traditional view of neurological differences as disorders. Instead, it proposes that variations in brain function—from how we learn and socialize to how we pay attention—are a natural and valuable part of human diversity.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-200">Think of it like biodiversity</h3>
              <p className="text-blue-700 dark:text-blue-300">
                A healthy, robust ecosystem isn't one with just a single type of tree; it's one with a wide variety of plants and animals that interact in complex ways. In the same way, a diverse society is a more resilient and innovative one.
              </p>
            </div>

            <p className="text-lg leading-relaxed mt-6">
              This represents a profound shift from seeing neurological differences as problems to be "fixed" to recognizing them as natural variations that contribute to human diversity.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'paradigm-shift',
      type: 'concept',
      title: 'From Medical to Social Model',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">A Profound Paradigm Shift</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
              <h3 className="text-xl font-semibold mb-3 text-red-700 dark:text-red-300">❌ Old Medical Model</h3>
              <ul className="space-y-2 text-red-600 dark:text-red-400">
                <li>• Viewed differences as medical problems</li>
                <li>• Focus on "curing" or "fixing"</li>
                <li>• Deficit-based approach</li>
                <li>• Individual is the problem</li>
              </ul>
            </div>

            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold mb-3 text-green-700 dark:text-green-300">✅ New Social Model</h3>
              <ul className="space-y-2 text-green-600 dark:text-green-400">
                <li>• Recognizes natural brain variations</li>
                <li>• Focus on environmental support</li>
                <li>• Strengths-based approach</li>
                <li>• Society adapts to support diversity</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">The Key Question Changes:</h3>
            <div className="space-y-2">
              <p className="text-red-600 line-through">❌ "What's wrong with this person?"</p>
              <p className="text-green-600 font-semibold">✅ "What can our environment do to support people?"</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'case-study',
      type: 'example',
      title: 'The Human Brain Forest',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Case Study: The Human Brain Forest</h2>
          
          <div className="w-full mb-6">
            <img 
              src={humanBrainForestImage} 
              alt="The Human Brain Forest - A metaphorical illustration showing different types of thinking as different trees in a diverse forest ecosystem" 
              className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
            />
          </div>

          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-4">
              Imagine a team working on a new app:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">🌳 The Developer</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Highly logical and systematic, prefers clear, step-by-step processes. Like a strong, straight trunk providing structure.
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">🍃 The Designer</h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Dyslexic, thinks creatively and non-linearly, visualizes the entire user experience. Like a broad canopy providing creative cover.
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🌿 The Marketer</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Has ADHD, jumps between ideas, connects unrelated concepts. Like vibrant undergrowth linking everything together.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border mt-6">
              <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3">💭 Moment of Reflection:</h4>
              <p className="text-muted-foreground leading-relaxed">
                Think about a time you had a group project. Did you notice people approaching the problem differently? Was there a "tree" that felt different from yours? How did that difference contribute to the final project, even if it felt confusing at the time?
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'key-terms',
      type: 'concept',
      title: 'Key Terms and History',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Key Terms and Their History</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-l-green-500 pl-6 py-4 bg-green-50 dark:bg-green-900/20 rounded-r-lg">
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">Neurodiversity</h3>
              <p className="text-muted-foreground leading-relaxed">
                The term was coined in 1998 by Australian sociologist Judy Singer. She used it to advocate for the rights of autistic people and to promote the idea that neurological differences are a form of human biodiversity.
              </p>
            </div>

            <div className="border-l-4 border-l-blue-500 pl-6 py-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">Neurodiverse</h3>
              <p className="text-muted-foreground leading-relaxed">
                An individual whose brain functions in a way that diverges significantly from the neurotypical majority. This term was created to be more empowering and inclusive than older clinical labels.
              </p>
            </div>

            <div className="border-l-4 border-l-purple-500 pl-6 py-4 bg-purple-50 dark:bg-purple-900/20 rounded-r-lg">
              <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">Neurotypical</h3>
              <p className="text-muted-foreground leading-relaxed">
                An individual whose brain functions in a way that aligns with the societal norm. It is a necessary term to highlight the diversity that exists and to avoid pathologizing differences.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg border">
            <h4 className="font-semibold mb-2">📚 Historical Context</h4>
            <p className="text-sm text-muted-foreground">
              The neurodiversity movement has existed for over two decades and continues to grow with scientific research and advocacy, promoting dignity and empowerment for all individuals.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'myths-vs-facts',
      type: 'practice',
      title: 'Myth vs. Fact',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Myth vs. Fact: Unpacking Misconceptions</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10 p-6 rounded-r-lg">
              <div className="space-y-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <p className="font-semibold text-red-800 dark:text-red-200">❌ Myth:</p>
                  <p className="text-red-700 dark:text-red-300">Neurodiversity is a new, trendy concept that romanticizes disabilities.</p>
                </div>
                
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="font-semibold text-green-800 dark:text-green-200">✅ Fact:</p>
                  <p className="text-green-700 dark:text-green-300">
                    The concept has existed for over two decades and is supported by a growing body of scientific research and advocacy. It doesn't deny the challenges associated with neurodiversity; instead, it reframes them in a way that promotes dignity and empowers individuals to seek appropriate support without shame.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10 p-6 rounded-r-lg">
              <div className="space-y-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <p className="font-semibold text-red-800 dark:text-red-200">❌ Myth:</p>
                  <p className="text-red-700 dark:text-red-300">It's just a way to avoid getting a diagnosis.</p>
                </div>
                
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="font-semibold text-green-800 dark:text-green-200">✅ Fact:</p>
                  <p className="text-green-700 dark:text-green-300">
                    The neurodiversity movement does not discourage diagnoses. For many people, a formal diagnosis provides access to accommodations and a community of people with similar experiences. The movement simply wants to ensure that a diagnosis is not seen as a label of inferiority.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200">
            <h4 className="font-semibold mb-2">🤔 Think About It:</h4>
            <p className="text-muted-foreground">
              What other misconceptions about neurodiversity have you encountered? How might understanding these facts change the way you think about neurological differences?
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'self-discovery',
      type: 'practice',
      title: 'Your Journey of Self-Discovery',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Building a Foundation of Understanding</h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-lg border">
            <div className="text-center space-y-4">
              <div className="p-3 bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">Your First Step Toward Self-Discovery</h3>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              At its core, this lesson is your first step toward self-discovery. For a long time, the world may have made you feel like you were trying to fit into a box that was too small.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3">❌ Old Mindset</h4>
                <ul className="space-y-2 text-red-600 dark:text-red-400 text-sm">
                  <li>• "I'm broken"</li>
                  <li>• "I need to be fixed"</li>
                  <li>• "I don't fit in"</li>
                  <li>• "Something's wrong with me"</li>
                </ul>
              </div>

              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">✅ New Understanding</h4>
                <ul className="space-y-2 text-green-600 dark:text-green-400 text-sm">
                  <li>• "I'm uniquely designed"</li>
                  <li>• "I have valuable strengths"</li>
                  <li>• "I belong in this diverse world"</li>
                  <li>• "My brain is an asset"</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 mt-6">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">🎯 Your Mission</h4>
              <p className="text-purple-600 dark:text-purple-400 leading-relaxed">
                This course is about throwing that old box away. It's about recognizing that every brain has its own unique architecture. You are not a broken version of a neurotypical person. You are a unique and valuable human being.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'completion',
      type: 'summary',
      title: 'Your Journey Begins',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">🌟 Lesson Complete!</h2>
            <p className="text-xl text-muted-foreground">The Foundation is Set</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-lg border">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">Your Journey Starts Now</h3>
              
              <p className="text-lg leading-relaxed">
                You now understand that neurodiversity is not about deficits—it's about the beautiful variety of human minds. 
                You've learned that your unique brain architecture is an asset, not a limitation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-3xl mb-2">🧠</div>
                  <h4 className="font-semibold">New Perspective</h4>
                  <p className="text-sm text-muted-foreground">From medical to social model</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-3xl mb-2">🌳</div>
                  <h4 className="font-semibold">Brain Forest</h4>
                  <p className="text-sm text-muted-foreground">Every mind contributes uniquely</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-3xl mb-2">✨</div>
                  <h4 className="font-semibold">Self-Discovery</h4>
                  <p className="text-sm text-muted-foreground">Your journey has begun</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200">
            <h4 className="font-semibold mb-3 text-center">Ready for the Next Step?</h4>
            <p className="text-center text-muted-foreground">
              Now that you understand what neurodiversity is, it's time to discover your brain's unique superpowers! 
              Let's explore how to reframe your traits as strengths.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 2
    }
  ]
};