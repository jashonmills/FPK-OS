import { MicroLessonData } from '../../MicroLessonContainer';
import reviewSummaryImage from '@/assets/review-summary-lesson.jpg';

export const reviewSummaryMicroLessons: MicroLessonData = {
  id: 'review-summary',
  moduleTitle: 'Review and Summary',
  totalScreens: 6,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Review and Summary',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Review and Summary</h1>
            <p className="text-lg text-muted-foreground">Putting It All Together</p>
          </div>

          <div className="mb-8">
            <img 
              src={reviewSummaryImage} 
              alt="Comprehensive science overview showing interconnected fields of biology, chemistry, and physics"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="prose max-w-none text-center">
            <p className="text-lg leading-relaxed">
              In this course, you've been introduced to the basics of science. From the tiniest parts of an atom to the biggest ecosystems, 
              science is a way of understanding the world. You've learned how to think like a scientist and to see the links between the 
              different fields of study.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'course-overview',
      type: 'concept',
      title: 'Course Overview',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Your Scientific Journey</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-blue-200 text-center p-6 rounded-lg bg-blue-50">
              <div className="p-3 bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-blue-700 mb-2">Scientific Method</h3>
              <p className="text-sm text-gray-600">Universal tool for inquiry</p>
            </div>

            <div className="border border-green-200 text-center p-6 rounded-lg bg-green-50">
              <div className="p-3 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-green-700 mb-2">Biology</h3>
              <p className="text-sm text-gray-600">Study of life and living organisms</p>
            </div>

            <div className="border border-red-200 text-center p-6 rounded-lg bg-red-50">
              <div className="p-3 bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-red-700 mb-2">Chemistry</h3>
              <p className="text-sm text-gray-600">Building blocks of matter</p>
            </div>

            <div className="border border-yellow-200 text-center p-6 rounded-lg bg-yellow-50">
              <div className="p-3 bg-yellow-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-yellow-700 mb-2">Physics</h3>
              <p className="text-sm text-gray-600">Forces and energy in motion</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
            <p className="text-center text-lg font-semibold">
              🌟 These four pillars form the foundation of scientific understanding
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'scientific-method-biology',
      type: 'example',
      title: 'Scientific Method & Biology',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">What You've Learned</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500 text-white rounded">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-900">The Scientific Method</h3>
              </div>
              <p className="text-blue-800 leading-relaxed">
                A systematic process for exploring observations and answering questions through observation, hypothesis, 
                experimentation, analysis, and conclusion. This is your toolkit for understanding the world scientifically!
              </p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                <div className="bg-white p-2 rounded text-center font-medium">Observe</div>
                <div className="bg-white p-2 rounded text-center font-medium">Question</div>
                <div className="bg-white p-2 rounded text-center font-medium">Hypothesize</div>
                <div className="bg-white p-2 rounded text-center font-medium">Experiment</div>
                <div className="bg-white p-2 rounded text-center font-medium">Conclude</div>
              </div>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500 text-white rounded">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-900">Biology</h3>
              </div>
              <p className="text-green-800 leading-relaxed">
                The study of life, from tiny cells with their specialized organelles to the complex genetic code stored in DNA 
                that makes each living thing unique. You've explored the building blocks of life itself!
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Cell Structure</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">DNA & Genetics</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Organelles</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Heredity</span>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'chemistry-physics',
      type: 'example',
      title: 'Chemistry & Physics',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Chemistry & Physics Mastery</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-red-50 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-500 text-white rounded">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-900">Chemistry</h3>
              </div>
              <p className="text-red-800 leading-relaxed">
                The study of matter and its building blocks - atoms and molecules - and how they're organized in the periodic table 
                to show relationships between elements. You now understand the fundamental building blocks of everything around us!
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Atoms</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Molecules</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Periodic Table</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Elements</span>
              </div>
            </div>

            <div className="p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-yellow-500 text-white rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-yellow-900">Physics</h3>
              </div>
              <p className="text-yellow-800 leading-relaxed">
                The study of forces, motion, and energy, including Newton's laws and the conservation of energy that governs 
                how objects move and interact. You've mastered the fundamental forces that shape our universe!
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Forces & Motion</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Energy & Work</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Conservation Laws</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Newton's Laws</span>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'interdisciplinary',
      type: 'concept',
      title: 'Interdisciplinary Science',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">The Sciences Connect</h2>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-500 text-white rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.578v.684a1 1 0 11-2 0v-.684L7.754 9.868a1 1 0 01-.372-1.364zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">Deeper Dive: Interdisciplinary Science</h3>
                <p className="text-green-800">
                  The different fields of science aren't separate islands—they are all interconnected. For example, <strong>biochemistry</strong> 
                  combines biology and chemistry to study the chemical processes within living organisms. <strong>Astrophysics</strong> combines 
                  physics and astronomy to study the physical properties of stars and galaxies. As you continue your scientific journey, 
                  you'll discover more and more ways that these fields overlap.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h4 className="font-semibold text-purple-900">Biochemistry</h4>
              </div>
              <p className="text-sm text-purple-800">
                Biology + Chemistry: Studies chemical processes in living organisms
              </p>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <h4 className="font-semibold text-indigo-900">Biophysics</h4>
              </div>
              <p className="text-sm text-indigo-800">
                Biology + Physics: Applies physics principles to biological systems
              </p>
            </div>
            
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <h4 className="font-semibold text-pink-900">Physical Chemistry</h4>
              </div>
              <p className="text-sm text-pink-800">
                Chemistry + Physics: Studies chemical phenomena using physics principles
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border">
            <p className="text-center font-semibold">
              🔬 Science is like a web - everything connects to everything else!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'completion',
      type: 'summary',
      title: 'Course Completion',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="p-4 bg-green-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">🎉 Congratulations!</h2>
            <p className="text-xl text-muted-foreground">Course Summary</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg border border-green-200">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-green-700">You've Completed the Course!</h3>
              
              <p className="text-lg leading-relaxed">
                You've completed an introduction to the fundamental concepts of science.
              </p>
              
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  You now have a solid foundation in scientific thinking and understand how biology, chemistry, and physics 
                  work together to explain the natural world around us.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-2xl mb-1">🔬</div>
                    <div className="text-sm font-medium">Scientific Method</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-2xl mb-1">🧬</div>
                    <div className="text-sm font-medium">Biology</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-2xl mb-1">⚛️</div>
                    <div className="text-sm font-medium">Chemistry</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-sm font-medium">Physics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-3 text-center">What's Next?</h4>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Continue your scientific journey by exploring advanced topics and real-world applications.
              </p>
              <p className="text-sm font-medium">
                Keep asking questions, stay curious, and never stop learning! 🌟
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};