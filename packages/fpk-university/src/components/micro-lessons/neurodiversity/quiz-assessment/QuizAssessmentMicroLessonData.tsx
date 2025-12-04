import React from 'react';
import { Trophy, CheckCircle, Brain, Target, Star, Award, Lightbulb, Users } from 'lucide-react';
import { MicroLessonData } from '../../MicroLessonContainer';

export const quizAssessmentMicroLessons: MicroLessonData = {
  id: 'quiz-assessment',
  moduleTitle: 'Quiz & Assessment',
  totalScreens: 8,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Demonstrate Your Knowledge',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <Trophy className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-3xl font-bold">Quiz & Assessment</h2>
            <p className="text-lg text-muted-foreground">
              Test your knowledge with interactive quizzes and reflection questions
            </p>
          </div>
          <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
            <p className="text-center">
              This isn't about perfect scores—it's about demonstrating your understanding 
              and reflecting on how you'll apply these concepts. Let's celebrate what you've 
              learned and plan for your continued growth!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 1
    },
    {
      id: 'knowledge-check-1',
      type: 'practice',
      title: 'Neurodiversity Foundations Quiz',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Test Your Understanding
          </h3>
          
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Question 1: Defining Neurodiversity</h4>
              <p className="text-sm mb-3">
                Which statement best describes the neurodiversity paradigm?
              </p>
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q1" className="mt-1" />
                  <span>Neurodivergent brains need to be fixed or cured</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q1" className="mt-1" />
                  <span>Neurodiversity is natural brain variation that brings unique strengths</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q1" className="mt-1" />
                  <span>All brains learn exactly the same way</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q1" className="mt-1" />
                  <span>Neurodivergence only affects children</span>
                </label>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Question 2: Brain Superpowers</h4>
              <p className="text-sm mb-3">
                Which of these are common neurodiverse strengths? (Select all that apply)
              </p>
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span>Pattern recognition</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span>Systematic thinking</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span>Attention to detail</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span>Deep focus (hyperfocus)</span>
                </label>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Question 3: Paradigm Shift</h4>
              <p className="text-sm mb-3">
                The shift from medical model to strengths-based model means:
              </p>
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q3" className="mt-1" />
                  <span>Focusing on what's wrong and needs fixing</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q3" className="mt-1" />
                  <span>Ignoring challenges completely</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q3" className="mt-1" />
                  <span>Identifying and building on natural abilities and strengths</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q3" className="mt-1" />
                  <span>Treating everyone exactly the same</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'knowledge-check-2',
      type: 'practice',
      title: 'Learning Strategies Quiz',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Learning Strategy Mastery
          </h3>
          
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Question 4: Cognitive Load</h4>
              <p className="text-sm mb-3">
                The "7±2 rule" for chunking information means:
              </p>
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q4" className="mt-1" />
                  <span>Study for 7-9 hours per day</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q4" className="mt-1" />
                  <span>Working memory can hold about 5-9 pieces of information</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q4" className="mt-1" />
                  <span>Take breaks every 7 minutes</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q4" className="mt-1" />
                  <span>Read 7-9 pages at a time</span>
                </label>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Question 5: Spaced Repetition</h4>
              <p className="text-sm mb-3">
                The optimal review schedule for spaced repetition is:
              </p>
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q5" className="mt-1" />
                  <span>Every day for a week</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q5" className="mt-1" />
                  <span>1 day, 3 days, 1 week, 2 weeks, 1 month</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q5" className="mt-1" />
                  <span>Only when you forget something</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q5" className="mt-1" />
                  <span>Right before the exam</span>
                </label>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Question 6: Metacognition</h4>
              <p className="text-sm mb-3">
                The three components of metacognition are:
              </p>
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q6" className="mt-1" />
                  <span>Reading, writing, arithmetic</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q6" className="mt-1" />
                  <span>Planning, monitoring, evaluating</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q6" className="mt-1" />
                  <span>See, think, wonder</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q6" className="mt-1" />
                  <span>Input, process, output</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'knowledge-check-3',
      type: 'practice',
      title: 'Application & Critical Thinking Quiz',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Applied Knowledge Assessment
          </h3>
          
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Question 7: FPK University Design</h4>
              <p className="text-sm mb-3">
                Universal Design for Learning (UDL) provides multiple means of:
              </p>
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span>Representation (how information is presented)</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span>Engagement (how students are motivated)</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span>Expression (how students show what they know)</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="mt-1" />
                  <span>All of the above</span>
                </label>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Question 8: Economics Application</h4>
              <p className="text-sm mb-3">
                A neurodiverse student's pattern recognition skills would be most helpful for:
              </p>
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q8" className="mt-1" />
                  <span>Memorizing economic definitions</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q8" className="mt-1" />
                  <span>Identifying market trends and economic cycles</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q8" className="mt-1" />
                  <span>Copying notes from the textbook</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q8" className="mt-1" />
                  <span>Following exactly what the teacher says</span>
                </label>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Question 9: Critical Thinking</h4>
              <p className="text-sm mb-3">
                The IDEAL problem-solving method stands for:
              </p>
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q9" className="mt-1" />
                  <span>Identify, Define, Explore, Act, Look back</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q9" className="mt-1" />
                  <span>Imagine, Dream, Execute, Achieve, Learn</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q9" className="mt-1" />
                  <span>Investigate, Determine, Evaluate, Apply, List</span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input type="radio" name="q9" className="mt-1" />
                  <span>Inspire, Design, Engage, Analyze, Lead</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'scenario-application',
      type: 'example',
      title: 'Real-World Scenario Analysis',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Apply Your Knowledge
          </h3>
          
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Scenario: Study Challenge</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Alex is a neurodiverse student struggling with their microeconomics course. They find lectures 
                overwhelming, have trouble focusing on long reading assignments, and feel frustrated that 
                their study methods aren't working. However, they excel at recognizing patterns in data 
                and enjoy creating visual representations of information.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card p-4 rounded-lg border">
                <h4 className="font-semibold mb-3">Analysis Questions:</h4>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">1. What neurodiverse strengths can Alex leverage?</p>
                    <textarea 
                      className="w-full text-sm p-2 rounded border h-20 resize-none"
                      placeholder="Identify Alex's strengths based on the scenario..."
                    />
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">2. Which learning strategies would you recommend?</p>
                    <textarea 
                      className="w-full text-sm p-2 rounded border h-20 resize-none"
                      placeholder="Suggest specific strategies from the course..."
                    />
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">3. How could Alex optimize their environment?</p>
                    <textarea 
                      className="w-full text-sm p-2 rounded border h-20 resize-none"
                      placeholder="Recommend environmental changes and FPK features..."
                    />
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">4. What specific economics study methods would work best?</p>
                    <textarea 
                      className="w-full text-sm p-2 rounded border h-20 resize-none"
                      placeholder="Connect Alex's strengths to economics learning..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Reflection:</strong> This scenario helps you practice applying course concepts to 
                real situations. Consider how you might advocate for similar accommodations and 
                strategies in your own learning journey.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'personal-reflection',
      type: 'summary',
      title: 'Personal Learning Portfolio',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Your Learning Journey Reflection
          </h3>
          
          <div className="space-y-6">
            <p>
              Create your personal learning portfolio by reflecting on your journey through this course. 
              This will serve as a valuable reference for your future academic endeavors.
            </p>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">My Neurodiverse Strengths Profile</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    My top 3 neurodiverse strengths are:
                  </label>
                  <textarea 
                    className="w-full text-sm p-2 rounded border h-16 resize-none"
                    placeholder="List and describe your strongest abilities..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">
                    I learn best when:
                  </label>
                  <textarea 
                    className="w-full text-sm p-2 rounded border h-16 resize-none"
                    placeholder="Describe your optimal learning conditions..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">
                    My biggest learning insight from this course:
                  </label>
                  <textarea 
                    className="w-full text-sm p-2 rounded border h-16 resize-none"
                    placeholder="Share your most important discovery..."
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">My Learning Strategy Toolkit</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Strategies I will continue using:
                  </label>
                  <textarea 
                    className="w-full text-sm p-2 rounded border h-16 resize-none"
                    placeholder="List the most effective strategies for you..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">
                    How I will apply these to future courses:
                  </label>
                  <textarea 
                    className="w-full text-sm p-2 rounded border h-16 resize-none"
                    placeholder="Plan how to transfer these skills..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">
                    My learning goals for the next semester:
                  </label>
                  <textarea 
                    className="w-full text-sm p-2 rounded border h-16 resize-none"
                    placeholder="Set specific, achievable goals..."
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <strong>Save this reflection!</strong> Come back to it regularly to remind yourself 
                of your strengths and successful strategies. Your insights will continue to evolve 
                as you grow in your academic journey.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 8
    },
    {
      id: 'peer-sharing',
      type: 'practice',
      title: 'Share Your Success Story',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Inspiring Others Through Your Journey
          </h3>
          
          <div className="space-y-4">
            <p>
              Your story matters! By sharing your experiences and insights, you can help other 
              neurodiverse learners recognize their own strengths and potential.
            </p>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Create Your Success Story</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Write a brief message you could share with other neurodiverse students just starting their journey.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Before this course, I thought my brain was:
                  </label>
                  <input 
                    type="text"
                    className="w-full text-sm p-2 rounded border"
                    placeholder="e.g., broken, different, challenging..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Now I know my brain is:
                  </label>
                  <input 
                    type="text"
                    className="w-full text-sm p-2 rounded border"
                    placeholder="e.g., powerful, unique, capable..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">
                    My advice to other neurodiverse students:
                  </label>
                  <textarea 
                    className="w-full text-sm p-2 rounded border h-24 resize-none"
                    placeholder="Share your encouragement and practical tips..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">
                    One thing I want educators to know:
                  </label>
                  <textarea 
                    className="w-full text-sm p-2 rounded border h-20 resize-none"
                    placeholder="Help others understand how to support neurodiverse learners..."
                  />
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Ways to Share</h4>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  <li>• FPK University community forums</li>
                  <li>• Study group discussions</li>
                  <li>• Social media (with #NeurodiverseStrengths)</li>
                  <li>• Mentoring new students</li>
                  <li>• Writing blog posts or articles</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Impact You Can Make</h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Help others see their strengths</li>
                  <li>• Reduce stigma and misconceptions</li>
                  <li>• Advocate for better accommodations</li>
                  <li>• Build a supportive community</li>
                  <li>• Inspire confidence in others</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <strong>Your voice matters!</strong> By sharing your story, you become part of a movement 
                that celebrates neurodiversity and helps create more inclusive learning environments for everyone.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'celebration',
      type: 'summary',
      title: 'Celebration of Achievement',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <Trophy className="w-20 h-20 text-primary mx-auto" />
            <h2 className="text-3xl font-bold">Congratulations!</h2>
            <p className="text-xl text-muted-foreground">
              You've completed the Neurodiversity: A Strengths-Based Approach course!
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 rounded-lg border border-primary/30">
            <h3 className="text-xl font-semibold text-center mb-4">What You've Accomplished</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Knowledge Gained
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Understanding of neurodiversity as strength</li>
                  <li>• Identification of your brain's superpowers</li>
                  <li>• Comprehensive learning strategies</li>
                  <li>• FPK University's design advantages</li>
                  <li>• Subject-specific applications</li>
                  <li>• Critical thinking skills</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Skills Developed
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Self-advocacy and confidence</li>
                  <li>• Metacognitive awareness</li>
                  <li>• Systematic problem-solving</li>
                  <li>• Learning environment optimization</li>
                  <li>• Academic strategy planning</li>
                  <li>• Peer mentoring readiness</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg border text-center space-y-4">
            <h3 className="text-xl font-semibold">Your Next Steps</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 bg-primary/5 rounded border">
                <h4 className="font-semibold text-sm mb-1">Continue Learning</h4>
                <p className="text-xs text-muted-foreground">
                  Apply these strategies to all your courses and continue building on your strengths
                </p>
              </div>
              <div className="p-3 bg-primary/5 rounded border">
                <h4 className="font-semibold text-sm mb-1">Share Your Story</h4>
                <p className="text-xs text-muted-foreground">
                  Help other neurodiverse learners by sharing your insights and experiences
                </p>
              </div>
              <div className="p-3 bg-primary/5 rounded border">
                <h4 className="font-semibold text-sm mb-1">Stay Connected</h4>
                <p className="text-xs text-muted-foreground">
                  Engage with the FPK University community and continue growing together
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 text-center">
            <h3 className="text-lg font-bold mb-2">🎉 You Are Ready to Thrive! 🎉</h3>
            <p className="text-sm mb-4">
              You now have the knowledge, strategies, and confidence to succeed in your academic journey. 
              Your neurodiverse brain is a powerful asset that will serve you well in all your future endeavors.
            </p>
            <p className="text-sm font-medium text-primary">
              Go forward with confidence, celebrate your unique strengths, and remember: 
              your brain is exactly as it should be! 🧠✨
            </p>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};