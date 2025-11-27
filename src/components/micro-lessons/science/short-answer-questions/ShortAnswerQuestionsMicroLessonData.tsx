import { MicroLessonData } from '../../MicroLessonContainer';
import shortAnswerQuestionsImage from '@/assets/short-answer-questions-lesson.jpg';

export const shortAnswerQuestionsMicroLessons: MicroLessonData = {
  id: 'short-answer-questions',
  moduleTitle: 'Short-Answer Questions',
  totalScreens: 8,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Short-Answer Questions',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Short-Answer Questions</h1>
            <p className="text-lg text-muted-foreground">Test Your Understanding</p>
          </div>

          <div className="mb-8">
            <img 
              src={shortAnswerQuestionsImage} 
              alt="Student studying science with textbooks and materials"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500 text-white rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Instructions</h3>
            </div>
            <p className="text-muted-foreground text-lg">
              Answer each question in 2-3 sentences. Take your time to think through each question and provide complete, thoughtful answers.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'question-1',
      type: 'practice',
      title: 'Question 1: Scientific Method',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-bold mb-4">Question 1</h2>
            <p className="text-lg font-medium mb-6">
              What is the purpose of the scientific method in scientific inquiry?
            </p>
            
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-6">
              <p className="text-muted-foreground text-sm mb-2">Think about:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• What does the scientific method provide to researchers?</li>
                <li>• How does it help ensure reliable results?</li>
                <li>• Why is a systematic approach important?</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="font-bold mb-3 text-green-800">Sample Answer:</h3>
            <p className="text-green-800 leading-relaxed">
              The scientific method is a systematic process designed to explore observations and answer questions. It provides a reliable framework for reaching conclusions based on evidence rather than guesswork, guiding discovery and decision-making.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'question-2',
      type: 'practice',
      title: 'Question 2: Falsifiability',
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h2 className="text-xl font-bold mb-4">Question 2</h2>
            <p className="text-lg font-medium mb-6">
              What makes a hypothesis "falsifiable," and why is this quality important?
            </p>
            
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-6">
              <p className="text-muted-foreground text-sm mb-2">Think about:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• What does it mean for something to be falsifiable?</li>
                <li>• How does this relate to testing hypotheses?</li>
                <li>• Why is this important for scientific validity?</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="font-bold mb-3 text-green-800">Sample Answer:</h3>
            <p className="text-green-800 leading-relaxed">
              A hypothesis is falsifiable if it can be proven wrong through experimentation or observation. This is crucial because it ensures the hypothesis can be tested and disproved, preventing untestable claims from being considered scientific.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'question-3',
      type: 'practice',
      title: 'Question 3: Cell Types',
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-bold mb-4">Question 3</h2>
            <p className="text-lg font-medium mb-6">
              Describe the key structural difference between prokaryotic and eukaryotic cells.
            </p>
            
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-6">
              <p className="text-muted-foreground text-sm mb-2">Think about:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• What defines prokaryotic cells?</li>
                <li>• What defines eukaryotic cells?</li>
                <li>• What are examples of each type?</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="font-bold mb-3 text-green-800">Sample Answer:</h3>
            <p className="text-green-800 leading-relaxed">
              Prokaryotic cells are simpler and lack a nucleus and other specialised organelles, like bacteria. Eukaryotic cells, on the other hand, are more complex and possess a nucleus, along with various organelles, characteristic of animal and plant cells.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'question-4',
      type: 'practice',
      title: 'Question 4: DNA and Genes',
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h2 className="text-xl font-bold mb-4">Question 4</h2>
            <p className="text-lg font-medium mb-6">
              What is the primary function of DNA, and how are genes related to it?
            </p>
            
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-6">
              <p className="text-muted-foreground text-sm mb-2">Think about:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• What does DNA store or contain?</li>
                <li>• What are genes exactly?</li>
                <li>• How do genes relate to DNA structure?</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="font-bold mb-3 text-green-800">Sample Answer:</h3>
            <p className="text-green-800 leading-relaxed">
              DNA (Deoxyribonucleic acid) is the molecule that holds the genetic instructions for all living things. Genes are specific segments of DNA that contain the code for a particular protein or function, thereby carrying hereditary information.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'question-5',
      type: 'practice',
      title: 'Question 5: Atomic Models',
      content: (
        <div className="space-y-6">
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h2 className="text-xl font-bold mb-4">Question 5</h2>
            <p className="text-lg font-medium mb-6">
              How does the electron cloud model differ from the planetary model in describing atomic structure?
            </p>
            
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-6">
              <p className="text-muted-foreground text-sm mb-2">Think about:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• How does the planetary model describe electrons?</li>
                <li>• How does the electron cloud model describe electrons?</li>
                <li>• What's the key difference in how electrons are located?</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="font-bold mb-3 text-green-800">Sample Answer:</h3>
            <p className="text-green-800 leading-relaxed">
              The planetary model visualises electrons orbiting the nucleus in neat, predictable paths, similar to planets around a sun. In contrast, the electron cloud model suggests that electrons exist in a probability cloud around the nucleus, meaning their exact location cannot be known, only where they are most likely to be found.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'practice-tips',
      type: 'example',
      title: 'Answering Tips',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Tips for Great Science Answers</h2>
          
          <div className="space-y-4">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500 text-white rounded">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.578v.684a1 1 0 11-2 0v-.684L7.754 9.868a1 1 0 01-.372-1.364zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Be Specific</h3>
              </div>
              <p className="text-blue-800">
                Use scientific terminology and be precise in your explanations. Avoid vague statements.
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500 text-white rounded">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Use Examples</h3>
              </div>
              <p className="text-green-800">
                When possible, include real-world examples to illustrate your points and show understanding.
              </p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500 text-white rounded">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Structure Your Answer</h3>
              </div>
              <p className="text-purple-800">
                Start with a clear statement, then explain or expand with supporting details.
              </p>
            </div>

            <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-500 text-white rounded">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Check Your Understanding</h3>
              </div>
              <p className="text-orange-800">
                Make sure your answer actually addresses what the question is asking for.
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
      title: 'Practice Complete',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="p-4 bg-green-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="currentcolor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">🎉 Great Work!</h2>
            <p className="text-xl text-muted-foreground">Practice Questions Complete</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg border border-green-200">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-green-700">You've Mastered the Key Concepts!</h3>
              
              <p className="text-lg leading-relaxed">
                You've successfully worked through practice questions covering all the major topics from this science course.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl mb-1">🔬</div>
                  <div className="text-sm font-medium">Scientific Method</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl mb-1">🧬</div>
                  <div className="text-sm font-medium">Biology Concepts</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl mb-1">⚛️</div>
                  <div className="text-sm font-medium">Chemistry Basics</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl mb-1">📝</div>
                  <div className="text-sm font-medium">Answer Techniques</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-3 text-center">Keep Practicing!</h4>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                The more you practice explaining scientific concepts, the better you'll understand them.
              </p>
              <p className="text-sm font-medium">
                Ready for the comprehensive study guide? 📚
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 2
    }
  ]
};