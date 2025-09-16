import React from 'react';
import { GraduationCap, MapPin, Rocket, Star } from 'lucide-react';

export const realWorldApplicationMicroLessons = {
  id: 'real-world-application',
  moduleTitle: 'Real-World Application and Lifelong Learning',
  totalScreens: 6,
  screens: [
    {
      id: 'intro',
      type: 'concept' as const,
      title: 'From Learning to Living',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your Success Blueprint</h2>
            <p className="text-lg text-muted-foreground">
              Now it's time to take everything you've learned and create a personalized plan for lifelong success.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">What You've Built</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Self-understanding and awareness</span>
              </div>
              <div className="flex items-center space-x-3">
                <Rocket className="w-5 h-5 text-primary" />
                <span>Executive functioning systems</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-primary" />
                <span>Evidence-based study techniques</span>
              </div>
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span>Self-advocacy confidence</span>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-sm text-center">
              <strong>This module:</strong> Transform your toolkit into a sustainable lifestyle for ongoing success.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'academic-integration',
      type: 'practice' as const,
      title: 'Academic Success Strategy',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Putting It All Together for School</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">Your Academic Success Plan</h4>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h5 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Before Each Semester</h5>
                <ul className="text-sm space-y-1">
                  <li>• Contact disability services and professors</li>
                  <li>• Set up your organization systems</li>
                  <li>• Identify challenging courses for extra support</li>
                  <li>• Plan your optimal schedule (energy levels, breaks)</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-semibold mb-2 text-green-700 dark:text-green-300">During Each Week</h5>
                <ul className="text-sm space-y-1">
                  <li>• Use your executive functioning systems daily</li>
                  <li>• Apply multimodal study techniques</li>
                  <li>• Schedule spaced repetition review sessions</li>
                  <li>• Monitor and adjust based on what's working</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h5 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">When Challenges Arise</h5>
                <ul className="text-sm space-y-1">
                  <li>• Reframe the challenge using your new perspective</li>
                  <li>• Use self-advocacy scripts to get support</li>
                  <li>• Adjust systems rather than abandoning them</li>
                  <li>• Remember: accommodation isn't failure, it's smart</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h5 className="font-semibold mb-2">💡 Emergency Protocol</h5>
            <p className="text-sm">
              When overwhelmed: STOP → Use your strength reframing → Apply one organizational tool → 
              Reach out for support → Adjust and continue.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'workplace-preparation',
      type: 'concept' as const,
      title: 'Workplace Success Skills',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Neurodiversity in the Workplace</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">Translating Skills to Career Success</h4>
            
            <div className="grid gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Executive Functioning → Project Management</h5>
                <p className="text-sm">Your organizational systems become professional project management skills</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Resume language:</strong> "Developed systematic approaches to complex task management"
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Pattern Recognition → Strategic Thinking</h5>
                <p className="text-sm">Your ability to see connections becomes valuable strategic insight</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Resume language:</strong> "Identified innovative solutions through systematic analysis"
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Hyperfocus → Deep Expertise</h5>
                <p className="text-sm">Your intense focus becomes specialized knowledge and skill mastery</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Resume language:</strong> "Demonstrated ability to achieve mastery in complex technical areas"
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Self-Advocacy → Leadership</h5>
                <p className="text-sm">Your advocacy skills translate to team communication and leadership</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Resume language:</strong> "Effective communicator with strong collaborative problem-solving skills"
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">Workplace Disclosure Strategy</h5>
            <p className="text-sm">
              You don't have to disclose your neurodivergence, but if you do, focus on the accommodations 
              you need and the strengths you bring. Lead with value, follow up with support needs.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'lifelong-learning-plan',
      type: 'practice' as const,
      title: 'Your Lifelong Learning Plan',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">Staying Sharp and Growing</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">The Learning Growth Mindset</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Your brain thrives on novelty and challenge. Create a plan to continuously feed your curiosity 
              while building skills that matter to your goals.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">Skill Development Areas</h5>
                <ul className="text-sm space-y-1">
                  <li>• Technical skills relevant to your field</li>
                  <li>• Communication and interpersonal skills</li>
                  <li>• Creative and innovative thinking</li>
                  <li>• Leadership and mentoring abilities</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">Learning Methods</h5>
                <ul className="text-sm space-y-1">
                  <li>• Online courses (use your study techniques!)</li>
                  <li>• Professional conferences and workshops</li>
                  <li>• Mentorship and peer learning groups</li>
                  <li>• Hands-on projects and experimentation</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-3">Your Learning Plan Template</h4>
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded">
                <h6 className="font-medium mb-1">Monthly Goals</h6>
                <p className="text-sm text-muted-foreground">What new skill or knowledge area will you explore?</p>
              </div>
              <div className="bg-muted p-3 rounded">
                <h6 className="font-medium mb-1">Learning Method</h6>
                <p className="text-sm text-muted-foreground">How will you apply your multimodal learning style?</p>
              </div>
              <div className="bg-muted p-3 rounded">
                <h6 className="font-medium mb-1">Application Plan</h6>
                <p className="text-sm text-muted-foreground">How will you practice and apply what you learn?</p>
              </div>
              <div className="bg-muted p-3 rounded">
                <h6 className="font-medium mb-1">Success Metrics</h6>
                <p className="text-sm text-muted-foreground">How will you know you've achieved mastery?</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'support-network',
      type: 'concept' as const,
      title: 'Building Your Support Network',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center mb-6">You Don't Have to Go It Alone</h3>
          
          <div className="bg-card p-6 rounded-lg">
            <h4 className="font-semibold mb-4">Types of Support You Need</h4>
            
            <div className="grid gap-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h5 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Professional Support</h5>
                <ul className="text-sm space-y-1">
                  <li>• Academic advisors and disability services</li>
                  <li>• Coaches specializing in neurodiversity</li>
                  <li>• Therapists familiar with your challenges</li>
                  <li>• Career counselors who understand your strengths</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-semibold mb-2 text-green-700 dark:text-green-300">Peer Support</h5>
                <ul className="text-sm space-y-1">
                  <li>• Study groups with neurodivergent students</li>
                  <li>• Professional networks in your field</li>
                  <li>• Online communities and forums</li>
                  <li>• Mentorship relationships (both directions)</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h5 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">Personal Support</h5>
                <ul className="text-sm space-y-1">
                  <li>• Family members who understand your goals</li>
                  <li>• Friends who celebrate your successes</li>
                  <li>• Accountability partners for your systems</li>
                  <li>• People who remind you of your strengths</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">Building Your Network</h5>
            <p className="text-sm">
              Start small: identify one person in each category. As you grow more confident, 
              expand your network. Remember, successful people always have strong support systems!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'graduation-celebration',
      type: 'summary' as const,
      title: 'Your Journey Forward',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Star className="w-20 h-20 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-primary">Congratulations!</h2>
            <p className="text-xl text-muted-foreground">
              You've completed your transformation from challenge-focused to strength-focused learning.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 rounded-lg border border-primary/30">
            <h3 className="text-xl font-semibold mb-4 text-center">Your Empowering Learning Techniques Toolkit</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">✅ Self-Understanding</h4>
                <p className="text-sm">You know your learning style, strengths, and support needs</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">✅ Executive Function Mastery</h4>
                <p className="text-sm">You have systems for time, tasks, and organization that work</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">✅ Evidence-Based Study Skills</h4>
                <p className="text-sm">You know how to learn effectively and retain information</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">✅ Self-Advocacy Confidence</h4>
                <p className="text-sm">You can communicate your needs and get appropriate support</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">✅ Success Mindset</h4>
                <p className="text-sm">You see challenges as strengths and approach learning with confidence</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">✅ Lifelong Learning Plan</h4>
                <p className="text-sm">You're prepared to keep growing and succeeding throughout life</p>
              </div>
            </div>
          </div>
          
          <div className="text-center p-6 bg-card rounded-lg border">
            <h4 className="font-semibold mb-2">Your Next Steps</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Continue practicing these techniques, adjust them as needed, and remember: 
              your neurodivergence is not something to overcome—it's your competitive advantage.
            </p>
            <div className="inline-flex items-center space-x-2 text-primary">
              <Rocket className="w-5 h-5" />
              <span className="font-semibold">Go forth and thrive!</span>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    }
  ]
};