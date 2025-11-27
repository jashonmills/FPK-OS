import { MicroLessonData } from '../../MicroLessonContainer';
import energyWorkImage from '@/assets/energy-work-lesson.jpg';

export const energyWorkMicroLessons: MicroLessonData = {
  id: 'energy-work',
  moduleTitle: 'Energy and Work',
  totalScreens: 8,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Energy and Work',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Energy and Work</h1>
            <p className="text-lg text-muted-foreground">The Currency of Change</p>
          </div>

          <div className="mb-8">
            <img 
              src={energyWorkImage} 
              alt="Energy transformation demonstration with roller coaster showing potential and kinetic energy"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="prose max-w-none text-center">
            <p className="text-lg leading-relaxed">
              Welcome to the fascinating world of energy and work! In this lesson, you'll discover how energy 
              powers everything around us and learn about the fundamental law that governs all energy transformations.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 2
    },
    {
      id: 'what-is-energy',
      type: 'concept',
      title: 'What is Energy and Work?',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Understanding Energy and Work</h2>
          
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              <strong>Energy</strong> is the ability to get work done. Work is done when a force is applied to an object and it moves 
              a certain distance. The <strong>Law of Conservation of Energy</strong> tells us that energy can't be created or destroyed, 
              only changed from one form to another.
            </p>

            <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
              <p className="text-center text-lg font-semibold mb-2">
                Energy = The Ability to Do Work
              </p>
              <p className="text-center text-muted-foreground">
                Work = Force × Distance
              </p>
            </div>

            <p className="text-lg leading-relaxed mt-6">
              For example, a roller coaster converts its <strong>potential energy</strong> 
              (energy stored from its height) into <strong>kinetic energy</strong> (energy of motion) as it whizzes down a hill.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'potential-energy',
      type: 'concept',
      title: 'Potential Energy',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Potential Energy</h2>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 text-white rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-700">Stored Energy</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-blue-800">
                Potential energy is stored energy that has the potential to do work. It's like energy waiting to be released.
              </p>
              
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Stored energy</strong> - Ready to be used</li>
                <li>• <strong>Energy due to position</strong> - Height matters!</li>
                <li>• <strong>Higher = more potential energy</strong> - The higher up, the more stored energy</li>
                <li>• <strong>Example:</strong> Water behind a dam, a book on a shelf, a stretched rubber band</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-center font-semibold">
              Think of potential energy as "stored power" - like a battery waiting to be used!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'kinetic-energy',
      type: 'concept',
      title: 'Kinetic Energy',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Kinetic Energy</h2>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500 text-white rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-700">Energy of Motion</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-green-800">
                Kinetic energy is the energy of motion. Anything that's moving has kinetic energy.
              </p>
              
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Energy of motion</strong> - Moving objects have it</li>
                <li>• <strong>Depends on mass and speed</strong> - Heavier and faster = more kinetic energy</li>
                <li>• <strong>Faster = more kinetic energy</strong> - Speed matters a lot!</li>
                <li>• <strong>Example:</strong> Moving car, flying airplane, bouncing ball</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-center font-semibold">
              Kinetic energy is "active power" - energy being used right now through movement!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'conservation-law',
      type: 'concept',
      title: 'Law of Conservation of Energy',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Law of Conservation of Energy</h2>
          
          <div className="p-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-blue-700">The Universal Law</h3>
              <p className="text-xl font-semibold mb-4">
                Energy cannot be created or destroyed, only transformed from one form to another.
              </p>
              <p className="text-lg text-muted-foreground">
                The total amount of energy in a closed system always remains the same.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold">Energy In</h4>
              <p className="text-sm text-gray-600">Same amount</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl mb-2">🔄</div>
              <h4 className="font-semibold">Transformation</h4>
              <p className="text-sm text-gray-600">Changes form</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold">Energy Out</h4>
              <p className="text-sm text-gray-600">Same amount</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-center">
              <strong>Example:</strong> A roller coaster at the top of a hill has maximum potential energy. 
              As it goes down, potential energy converts to kinetic energy. The total energy stays the same!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'think-about-it',
      type: 'practice',
      title: 'A Moment for a Think',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500 text-white rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.578v.684a1 1 0 11-2 0v-.684L7.754 9.868a1 1 0 01-.372-1.364zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">A Moment for a Think:</h3>
                <p className="text-blue-800 text-lg leading-relaxed">
                  Imagine you're pushing a box across the floor. You're applying a force, and the box is moving a certain distance. 
                  What is the work you are doing?
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2">Think about:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• What force are you applying to the box?</li>
                <li>• How far is the box moving?</li>
                <li>• How would you calculate the work done?</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-2">Remember the formula:</h4>
              <p className="text-center text-lg font-mono bg-white p-2 rounded border">
                Work = Force × Distance
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'forms-of-energy',
      type: 'concept',
      title: 'Forms of Energy',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">The Many Forms of Energy</h2>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
            <h3 className="text-lg font-bold mb-3">Deeper Dive: The Forms of Energy</h3>
            <p className="text-green-800">
              Energy comes in many different forms. <strong>Mechanical energy</strong> is the sum of an object's potential and kinetic energy. 
              <strong>Thermal energy</strong> is related to temperature. <strong>Chemical energy</strong> is stored in the bonds of molecules. 
              <strong>Electrical energy</strong> comes from the movement of charged particles. All of these can be converted into one another, 
              but the total amount of energy in a closed system always remains the same.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="p-2 bg-red-500 text-white rounded">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold">Thermal Energy</h4>
                <p className="text-sm text-muted-foreground">Energy related to temperature and heat</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="p-2 bg-yellow-500 text-white rounded">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold">Chemical Energy</h4>
                <p className="text-sm text-muted-foreground">Energy stored in molecular bonds</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="p-2 bg-blue-500 text-white rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold">Electrical Energy</h4>
                <p className="text-sm text-muted-foreground">Energy from moving charged particles</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="p-2 bg-green-500 text-white rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold">Mechanical Energy</h4>
                <p className="text-sm text-muted-foreground">Sum of potential and kinetic energy</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'key-terms',
      type: 'summary',
      title: 'Key Terms Summary',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="p-3 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Key Terms to Remember</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-2">Energy</h4>
              <p className="text-sm text-blue-600">The ability to do work.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">Potential Energy</h4>
              <p className="text-sm text-green-600">Stored energy.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-700 mb-2">Kinetic Energy</h4>
              <p className="text-sm text-yellow-600">Energy of motion.</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-700 mb-2">Work</h4>
              <p className="text-sm text-red-600">Force applied over a distance.</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-700 mb-2">Conservation of Energy</h4>
              <p className="text-sm text-purple-600">Energy cannot be created or destroyed.</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-700 mb-2">Mechanical Energy</h4>
              <p className="text-sm text-indigo-600">Sum of potential and kinetic energy.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-center mb-3">🎉 Lesson Complete!</h3>
            <p className="text-center text-muted-foreground">
              You now understand the fundamental concepts of energy and work, and how energy transforms but is never lost!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};