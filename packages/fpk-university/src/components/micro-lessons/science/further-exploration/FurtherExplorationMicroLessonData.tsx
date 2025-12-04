import { MicroLessonData } from '../../MicroLessonContainer';
import furtherExplorationImage from '@/assets/further-exploration-lesson.jpg';

export const furtherExplorationMicroLessons: MicroLessonData = {
  id: 'further-exploration',
  moduleTitle: 'Further Exploration',
  totalScreens: 7,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Further Exploration',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Further Exploration</h1>
            <p className="text-lg text-muted-foreground">Your Next Steps in Science</p>
          </div>

          <div className="mb-8">
            <img 
              src={furtherExplorationImage} 
              alt="Future science careers showing space exploration, medical research, and emerging technologies"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="prose max-w-none text-center">
            <p className="text-lg leading-relaxed">
              This course is just the beginning of the road. The world of science is massive and full of opportunities. 
              Whether you're thinking of a career as a doctor, an engineer, a researcher, or a teacher, a solid foundation 
              in science is key.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'science-careers',
      type: 'concept',
      title: 'Science Career Paths',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Exciting Science Careers</h2>
          
          <div className="prose max-w-none mb-6">
            <p className="text-lg leading-relaxed">
              You can keep learning by diving into more advanced topics in any of the fields we've touched on. 
              The journey of scientific discovery is a lifelong one, so it is.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-blue-200 text-center p-6 rounded-lg bg-blue-50">
              <div className="p-3 bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-blue-700 mb-2">Medicine & Healthcare</h3>
              <p className="text-sm text-gray-600">Doctor, nurse, researcher, pharmacist</p>
            </div>

            <div className="border border-green-200 text-center p-6 rounded-lg bg-green-50">
              <div className="p-3 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-green-700 mb-2">Engineering & Technology</h3>
              <p className="text-sm text-gray-600">Software, mechanical, electrical engineer</p>
            </div>

            <div className="border border-purple-200 text-center p-6 rounded-lg bg-purple-50">
              <div className="p-3 bg-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-purple-700 mb-2">Research & Academia</h3>
              <p className="text-sm text-gray-600">Scientist, professor, lab researcher</p>
            </div>

            <div className="border border-yellow-200 text-center p-6 rounded-lg bg-yellow-50">
              <div className="p-3 bg-yellow-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-yellow-700 mb-2">Environmental Science</h3>
              <p className="text-sm text-gray-600">Climate researcher, conservationist</p>
            </div>

            <div className="border border-red-200 text-center p-6 rounded-lg bg-red-50">
              <div className="p-3 bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-red-700 mb-2">Biotechnology</h3>
              <p className="text-sm text-gray-600">Genetic engineer, biotech researcher</p>
            </div>

            <div className="border border-orange-200 text-center p-6 rounded-lg bg-orange-50">
              <div className="p-3 bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-orange-700 mb-2">Space & Astronomy</h3>
              <p className="text-sm text-gray-600">Astronaut, astrophysicist, mission control</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'future-of-science',
      type: 'concept',
      title: 'The Future of Science',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">The Future of Science</h2>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-500 text-white rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.578v.684a1 1 0 11-2 0v-.684L7.754 9.868a1 1 0 01-.372-1.364zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">Deeper Dive: The Future of Science</h3>
                <p className="text-green-800">
                  Science is constantly evolving. Breakthroughs in quantum computing could change the way we process information. 
                  Advancements in genetic engineering could help us cure diseases. And as we continue to explore space, we'll uncover 
                  new mysteries about the universe. The future of science is a blank canvas, and the next big discovery could be made by 
                  someone just like you.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
            <p className="text-center text-lg font-semibold">
              🚀 The next breakthrough could come from you!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'emerging-fields',
      type: 'example',
      title: 'Emerging Scientific Fields',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Cutting-Edge Science</h2>
          
          <div className="space-y-4">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-blue-900">Quantum Computing</h3>
              </div>
              <p className="text-blue-800 leading-relaxed">
                Using quantum mechanics to process information in revolutionary ways. Imagine computers that can solve problems 
                in seconds that would take today's computers thousands of years!
              </p>
            </div>
            
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-green-900">CRISPR Gene Editing</h3>
              </div>
              <p className="text-green-800 leading-relaxed">
                Precisely editing DNA to treat genetic diseases and enhance crops. This technology could eliminate hereditary diseases 
                and help feed the world's growing population.
              </p>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-purple-900">Artificial Intelligence</h3>
              </div>
              <p className="text-purple-800 leading-relaxed">
                Creating machines that can learn and make decisions like humans. AI is already transforming medicine, transportation, 
                and countless other fields.
              </p>
            </div>
            
            <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-orange-900">Space Exploration</h3>
              </div>
              <p className="text-orange-800 leading-relaxed">
                Missions to Mars, asteroid mining, and the search for life beyond Earth. We're on the verge of becoming 
                a multi-planetary species!
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'next-steps',
      type: 'practice',
      title: 'Continue Your Science Journey',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">How to Continue Your Science Journey</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border">
              <div className="p-2 bg-green-500 text-white rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Take Advanced Courses</h4>
                <p className="text-muted-foreground">
                  Dive deeper into biology, chemistry, physics, or explore new fields like environmental science
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border">
              <div className="p-2 bg-green-500 text-white rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Join Science Clubs</h4>
                <p className="text-muted-foreground">
                  Connect with other science enthusiasts and participate in experiments and competitions
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border">
              <div className="p-2 bg-green-500 text-white rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Read Scientific Literature</h4>
                <p className="text-muted-foreground">
                  Stay updated with the latest discoveries through science magazines and journals
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border">
              <div className="p-2 bg-green-500 text-white rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Consider STEM Education</h4>
                <p className="text-muted-foreground">
                  Pursue degrees in science, technology, engineering, or mathematics
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'scientific-thinking',
      type: 'concept',
      title: 'Scientific Thinking Skills',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Your Scientific Adventure</h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg border border-blue-200">
            <div className="text-center space-y-4">
              <div className="p-3 bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-blue-700">Your Scientific Adventure Awaits</h3>
              
              <p className="text-lg leading-relaxed">
                Science is not just a subject—it's a way of thinking, questioning, and understanding the world around us.
              </p>
              
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  The curiosity and scientific thinking skills you've developed in this course will serve you well in any field you choose. 
                  Keep asking questions, keep experimenting, and keep discovering!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border">
              <div className="text-3xl mb-2">🤔</div>
              <h4 className="font-semibold">Keep Questioning</h4>
              <p className="text-sm text-muted-foreground">Always ask "Why?" and "How?"</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border">
              <div className="text-3xl mb-2">🧪</div>
              <h4 className="font-semibold">Keep Experimenting</h4>
              <p className="text-sm text-muted-foreground">Test your ideas and hypotheses</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border">
              <div className="text-3xl mb-2">🔍</div>
              <h4 className="font-semibold">Keep Discovering</h4>
              <p className="text-sm text-muted-foreground">There's always more to learn</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'inspiration',
      type: 'summary',
      title: 'Your Future in Science',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">🌟 The Future is Yours!</h2>
            <p className="text-xl text-muted-foreground">Ready to Change the World?</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg border border-purple-200">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-purple-700">Your Science Journey Continues</h3>
              
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  You now have the foundation to explore any scientific field that interests you. Whether you become a doctor saving lives, 
                  an engineer building the future, or a researcher making groundbreaking discoveries, your scientific thinking will guide you.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                    <div className="text-3xl mb-2">🔬</div>
                    <h4 className="font-semibold">Scientific Method</h4>
                    <p className="text-sm text-muted-foreground">Your toolkit for discovery</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                    <div className="text-3xl mb-2">🧠</div>
                    <h4 className="font-semibold">Critical Thinking</h4>
                    <p className="text-sm text-muted-foreground">Questioning everything</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                    <div className="text-3xl mb-2">🌍</div>
                    <h4 className="font-semibold">Global Perspective</h4>
                    <p className="text-sm text-muted-foreground">Science impacts everyone</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                    <div className="text-3xl mb-2">🚀</div>
                    <h4 className="font-semibold">Limitless Potential</h4>
                    <p className="text-sm text-muted-foreground">The sky's not the limit!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="text-center">
              <h4 className="font-semibold mb-3">Remember</h4>
              <p className="text-lg font-medium text-blue-700">
                "Science is not only a disciple of reason but, also, one of romance and passion." - Stephen Hawking
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Let your curiosity lead you to amazing discoveries! 🌟
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    }
  ]
};