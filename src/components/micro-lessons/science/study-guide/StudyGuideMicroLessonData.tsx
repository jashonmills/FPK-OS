import { MicroLessonData } from '../../MicroLessonContainer';
import studyGuideImage from '@/assets/study-guide-lesson.jpg';

export const studyGuideMicroLessons: MicroLessonData = {
  id: 'study-guide',
  moduleTitle: 'Complete Study Guide',
  totalScreens: 6,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Complete Study Guide',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Complete Study Guide</h1>
            <p className="text-lg text-muted-foreground">Comprehensive Review Materials</p>
          </div>

          <div className="mb-8">
            <img 
              src={studyGuideImage} 
              alt="Comprehensive study guide with organized materials and reference books"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="prose max-w-none text-center">
            <p className="text-lg leading-relaxed">
              This comprehensive study guide brings together all the key concepts, terms, and practice materials 
              you need to master the fundamentals of science. Use this as your complete reference for review and deeper study.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border">
              <div className="text-3xl mb-2">📝</div>
              <h4 className="font-semibold">Essay Questions</h4>
              <p className="text-sm text-muted-foreground">Deep-thinking prompts</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-semibold">Key Terms</h4>
              <p className="text-sm text-muted-foreground">Essential vocabulary</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'essay-question-1',
      type: 'practice',
      title: 'Essay Question 1: Scientific Method',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 text-white rounded">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Essay Question 1</h2>
            </div>
            
            <div className="p-4 border rounded-lg bg-white">
              <h3 className="font-semibold mb-3">Scientific Method Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Discuss the critical steps of the scientific method and explain how each step contributes to a comprehensive 
                and reliable scientific investigation. Use a real-world example to illustrate your points.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2">Key Points to Address:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Observation and Question Formation</li>
                <li>• Hypothesis Development</li>
                <li>• Experimental Design</li>
                <li>• Data Collection and Analysis</li>
                <li>• Conclusion and Theory Formation</li>
                <li>• Real-world example (e.g., vaccine development, climate research)</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-2">Structure Suggestion:</h4>
              <ol className="space-y-1 text-sm">
                <li>1. Introduction: Define the scientific method</li>
                <li>2. Body: Explain each step with your example</li>
                <li>3. Conclusion: Why this systematic approach matters</li>
              </ol>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'essay-question-2',
      type: 'practice',
      title: 'Essay Question 2: Falsifiability',
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500 text-white rounded">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Essay Question 2</h2>
            </div>
            
            <div className="p-4 border rounded-lg bg-white">
              <h3 className="font-semibold mb-3">Falsifiability in Science</h3>
              <p className="text-muted-foreground leading-relaxed">
                Analyse the importance of falsifiability in a scientific hypothesis. How does this characteristic differentiate 
                scientific inquiry from other forms of explanation?
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2">Key Concepts to Explore:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Definition of falsifiability</li>
                <li>• Karl Popper's contribution to science philosophy</li>
                <li>• Testable vs. untestable claims</li>
                <li>• Examples of falsifiable and non-falsifiable statements</li>
                <li>• How falsifiability strengthens scientific credibility</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2">Examples to Consider:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Falsifiable: "All swans are white" (can be disproven by finding one black swan)</li>
                <li>• Non-falsifiable: "There is an invisible force that cannot be detected"</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'essay-question-3',
      type: 'practice',
      title: 'Essay Question 3: Cell Types',
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500 text-white rounded">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Essay Question 3</h2>
            </div>
            
            <div className="p-4 border rounded-lg bg-white">
              <h3 className="font-semibold mb-3">Cell Types Comparison</h3>
              <p className="text-muted-foreground leading-relaxed">
                Compare and contrast the fundamental characteristics of prokaryotic and eukaryotic cells, including their 
                structural components and evolutionary implications.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2">Comparison Points:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-blue-700">Prokaryotic Cells:</h5>
                  <ul className="space-y-1 mt-2">
                    <li>• No nucleus</li>
                    <li>• No membrane-bound organelles</li>
                    <li>• Examples: Bacteria, archaea</li>
                    <li>• Simpler structure</li>
                    <li>• Evolved first</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-green-700">Eukaryotic Cells:</h5>
                  <ul className="space-y-1 mt-2">
                    <li>• Membrane-bound nucleus</li>
                    <li>• Complex organelles</li>
                    <li>• Examples: Plants, animals, fungi</li>
                    <li>• More complex structure</li>
                    <li>• Evolved later</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold mb-2">Evolutionary Significance:</h4>
              <p className="text-sm">
                Discuss how the evolution from prokaryotic to eukaryotic cells represents a major milestone in life's complexity, 
                enabling multicellular organisms and specialized functions.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'key-terms-glossary',
      type: 'summary',
      title: 'Key Terms Glossary',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="p-3 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Key Terms Glossary</h2>
            <p className="text-muted-foreground">Essential Scientific Vocabulary</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-2">Scientific Method</h4>
              <p className="text-sm text-blue-600">A systematic approach to inquiry involving observation, hypothesis formation, experimentation, and analysis.</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">DNA</h4>
              <p className="text-sm text-green-600">Deoxyribonucleic acid - the molecule containing genetic instructions for all living organisms.</p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-700 mb-2">Atom</h4>
              <p className="text-sm text-red-600">The basic unit of chemical elements, consisting of protons, neutrons, and electrons.</p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-700 mb-2">Energy</h4>
              <p className="text-sm text-yellow-600">The ability to do work, existing in various forms like kinetic, potential, thermal, and chemical.</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-700 mb-2">Hypothesis</h4>
              <p className="text-sm text-purple-600">A testable prediction or explanation for an observed phenomenon.</p>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-700 mb-2">Cell</h4>
              <p className="text-sm text-indigo-600">The basic structural and functional unit of all living organisms.</p>
            </div>
            
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h4 className="font-semibold text-pink-700 mb-2">Molecule</h4>
              <p className="text-sm text-pink-600">A group of atoms held together by chemical bonds.</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-700 mb-2">Force</h4>
              <p className="text-sm text-orange-600">An interaction that can change an object's motion, measured in Newtons.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-center mb-3">📚 Study Success Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">For Terms:</h4>
                <ul className="space-y-1">
                  <li>• Create flashcards</li>
                  <li>• Use in sentences</li>
                  <li>• Connect related concepts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">For Essays:</h4>
                <ul className="space-y-1">
                  <li>• Outline before writing</li>
                  <li>• Use specific examples</li>
                  <li>• Practice explaining to others</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'study-completion',
      type: 'summary',
      title: 'Study Guide Complete',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">🎓 Study Guide Mastered!</h2>
            <p className="text-xl text-muted-foreground">You're Ready for Success</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg border border-green-200">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-green-700">Comprehensive Review Complete!</h3>
              
              <p className="text-lg leading-relaxed">
                You now have access to a complete study guide covering all essential science concepts, practice questions, 
                and key terminology. You're well-prepared for any science assessment!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-3xl mb-2">📝</div>
                  <h4 className="font-semibold">Essay Questions</h4>
                  <p className="text-sm text-muted-foreground">Deep analysis practice</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-3xl mb-2">📚</div>
                  <h4 className="font-semibold">Key Vocabulary</h4>
                  <p className="text-sm text-muted-foreground">Essential terms mastered</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-semibold">Study Strategies</h4>
                  <p className="text-sm text-muted-foreground">Effective techniques</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-3 text-center">🌟 Congratulations!</h4>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">
                You have successfully completed the entire Introduction to Science course!
              </p>
              <p className="text-sm text-muted-foreground">
                From the scientific method to advanced concepts, you've built a solid foundation in scientific thinking. 
                Keep exploring, keep questioning, and keep discovering!
              </p>
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg">
                <p className="text-sm font-semibold">
                  "The important thing is not to stop questioning." - Albert Einstein
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};