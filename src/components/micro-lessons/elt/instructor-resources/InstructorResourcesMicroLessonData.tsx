import React from 'react';
import { MicroLessonData } from '../../MicroLessonContainer';

export const instructorResourcesMicroLessons: MicroLessonData = {
  id: 'instructor-resources',
  title: 'Instructor Resources & Teaching Guide',
  description: 'Comprehensive resources for educators teaching neurodiverse learners',
  totalScreens: 16,
  screens: [
    {
      id: 'course-philosophy',
      type: 'concept',
      title: 'Course Philosophy & Goals',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20">
            <h3 className="text-xl font-semibold mb-4 text-primary">Neuro-Affirming Philosophy</h3>
            <p className="text-muted-foreground mb-4">
              This course is built on the philosophy that neurodiversity is a natural and valuable form of human variation. 
              The primary goal is to equip neurodiverse students with personalized learning strategies, executive functioning 
              skills, and self-advocacy tools to excel academically.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Core Principles</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Leverage individual strengths</li>
                  <li>• Transform challenges into opportunities</li>
                  <li>• Foster growth mindset</li>
                  <li>• Promote self-advocacy</li>
                </ul>
              </div>
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Target Outcomes</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Academic excellence</li>
                  <li>• Self-directed learning</li>
                  <li>• Confident self-advocacy</li>
                  <li>• Lifelong learning mindset</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'target-audience',
      type: 'concept',
      title: 'Target Audience & Learning Objectives',
      content: (
        <div className="space-y-6">
          <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
            <h3 className="text-xl font-semibold mb-4">Who This Course Serves</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Primary Audience</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Students with ADHD</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Autism Spectrum Disorder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Dyslexia, Dyscalculia, Dysgraphia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Executive Functioning Disorders</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Secondary Beneficiaries</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                    <span>Educators and instructors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                    <span>Parents and caregivers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                    <span>Academic support staff</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-background border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Learning Objectives</h3>
            <div className="grid gap-3">
              <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                <p className="text-sm">Understand neurodiversity and identify unique learning profiles</p>
              </div>
              <div className="p-3 bg-accent/5 rounded-lg border-l-4 border-accent">
                <p className="text-sm">Apply effective executive functioning strategies</p>
              </div>
              <div className="p-3 bg-secondary/20 rounded-lg border-l-4 border-secondary">
                <p className="text-sm">Utilize active learning and retention techniques</p>
              </div>
              <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                <p className="text-sm">Develop strong self-advocacy and communication skills</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'module-1-guidance',
      type: 'practice',
      title: 'Module 1: Teaching Neurodiversity Understanding',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Module 1 Teaching Guide</h3>
            <div className="space-y-4">
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Key Discussion Points</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Defining neurodiversity vs. deficit models</li>
                  <li>• Celebrating neurodivergent strengths</li>
                  <li>• The importance of self-discovery in learning</li>
                </ul>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Activity Guidance</h4>
                <p className="text-sm mb-2">Facilitate reflection on personal experiences with learning differences.</p>
                <p className="text-sm">Encourage voluntary sharing of insights from the Learning Style Inventory.</p>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Anticipated Questions</h4>
                <ul className="space-y-1 text-sm">
                  <li>• "Is neurodiversity just a new label for old problems?"</li>
                  <li>• "How do I know if I'm neurodiverse?"</li>
                  <li>• "What are my specific strengths?"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'module-2-guidance',
      type: 'practice',
      title: 'Module 2: Executive Functioning Instruction',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Module 2 Teaching Guide</h3>
            <div className="space-y-4">
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Key Discussion Points</h4>
                <ul className="space-y-1 text-sm">
                  <li>• The impact of executive function on academic success</li>
                  <li>• Practical application of planning and organization tools</li>
                  <li>• Combating procrastination effectively</li>
                </ul>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-teal-700 dark:text-teal-300 mb-2">Activity Guidance</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Guide students through setting up digital calendars</li>
                  <li>• Encourage sharing of successful time management hacks</li>
                  <li>• Practice breaking down hypothetical large assignments</li>
                </ul>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">Common Challenges</h4>
                <ul className="space-y-1 text-sm">
                  <li>• "These strategies take too much time to set up"</li>
                  <li>• "What if I forget to use my planner?"</li>
                  <li>• "How do I deal with distractions?"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'udl-principles',
      type: 'concept',
      title: 'Universal Design for Learning (UDL)',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">UDL Framework for Inclusive Education</h3>
            <div className="grid gap-4">
              <div className="bg-background/80 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Multiple Means of Engagement</h4>
                <p className="text-sm mb-2">Offer choices in how students learn and foster collaboration.</p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Varied activities and learning paths</li>
                  <li>• Group work and peer collaboration</li>
                  <li>• Real-world examples and relevance</li>
                </ul>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Multiple Means of Representation</h4>
                <p className="text-sm mb-2">Present information in diverse formats for different cognitive strengths.</p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Text, audio, video, and visual formats</li>
                  <li>• Hands-on and interactive elements</li>
                  <li>• Customizable presentation options</li>
                </ul>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Multiple Means of Action & Expression</h4>
                <p className="text-sm mb-2">Offer varied ways for students to demonstrate knowledge.</p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Written assignments and oral presentations</li>
                  <li>• Projects and visual displays</li>
                  <li>• Portfolio-based assessments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'neuro-affirming-environment',
      type: 'concept',
      title: 'Creating Neuro-Affirming Environments',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Building Inclusive Learning Spaces</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Embrace Neurodiversity</h4>
                  <p className="text-xs">Frame neurological differences as natural variations, not deficits.</p>
                </div>
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-1">Explicit Instruction</h4>
                  <p className="text-xs">Clearly articulate expectations and break down complex tasks.</p>
                </div>
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-red-700 dark:text-red-300 mb-1">Flexibility & Accommodations</h4>
                  <p className="text-xs">Provide reasonable accommodations like extended time and alternative formats.</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Predictability & Structure</h4>
                  <p className="text-xs">Maintain consistent routines and provide clear schedules.</p>
                </div>
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Sensory Considerations</h4>
                  <p className="text-xs">Be mindful of lighting, noise, and seating arrangements.</p>
                </div>
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">Promote Self-Advocacy</h4>
                  <p className="text-xs">Create safe spaces for students to communicate their needs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'facilitation-tips-patience',
      type: 'practice',
      title: 'Facilitation Tips: Patience & Modeling',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Essential Facilitation Strategies</h3>
            <div className="space-y-4">
              <div className="bg-background/80 p-4 rounded-lg border-l-4 border-rose-500">
                <h4 className="font-semibold text-rose-700 dark:text-rose-300 mb-2">Be Patient and Empathetic</h4>
                <p className="text-sm mb-2">Understand that learning new strategies and changing habits takes time, especially for neurodiverse learners.</p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Allow extra processing time</li>
                  <li>• Repeat instructions when needed</li>
                  <li>• Celebrate small victories</li>
                </ul>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg border-l-4 border-pink-500">
                <h4 className="font-semibold text-pink-700 dark:text-pink-300 mb-2">Model Strategies</h4>
                <p className="text-sm mb-2">Demonstrate how you use planning tools, note-taking methods, or self-reflection techniques.</p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Show your own planning process</li>
                  <li>• Share personal learning strategies</li>
                  <li>• Make thinking visible</li>
                </ul>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Encourage Experimentation</h4>
                <p className="text-sm">Emphasize that there is no single "right" way to learn. Encourage students to try different strategies.</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'feedback-community',
      type: 'practice',
      title: 'Feedback & Community Building',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Creating Supportive Learning Communities</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-teal-700 dark:text-teal-300 mb-3">Constructive Feedback</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                    <span>Focus on growth and effort</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                    <span>Offer specific improvement suggestions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                    <span>Avoid just pointing out errors</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-cyan-700 dark:text-cyan-300 mb-3">Building Community</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                    <span>Foster peer support environments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                    <span>Encourage strategy sharing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                    <span>Create safe discussion spaces</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 bg-background/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Support Service Referrals</h4>
              <p className="text-sm text-muted-foreground">
                Be aware of and ready to refer students to disability services, counseling, 
                or academic support centers when appropriate.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'assessment-strategies',
      type: 'example',
      title: 'Assessment & Evaluation Approaches',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Inclusive Assessment Methods</h3>
            <div className="space-y-4">
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Formative Assessment</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <ul className="space-y-1 text-sm">
                    <li>• Regular check-ins and progress monitoring</li>
                    <li>• Peer feedback sessions</li>
                    <li>• Self-reflection journals</li>
                  </ul>
                  <ul className="space-y-1 text-sm">
                    <li>• Strategy implementation tracking</li>
                    <li>• Goal-setting conferences</li>
                    <li>• Learning portfolio reviews</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Summative Assessment</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <ul className="space-y-1 text-sm">
                    <li>• Multi-modal project presentations</li>
                    <li>• Comprehensive learning portfolios</li>
                    <li>• Practical strategy demonstrations</li>
                  </ul>
                  <ul className="space-y-1 text-sm">
                    <li>• Peer teaching opportunities</li>
                    <li>• Real-world application projects</li>
                    <li>• Self-advocacy skill showcases</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'differentiation-strategies',
      type: 'practice',
      title: 'Differentiation for Diverse Learners',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Customizing Instruction</h3>
            <div className="space-y-4">
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-violet-700 dark:text-violet-300 mb-3">Content Differentiation</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-violet-600 dark:text-violet-300">📚</span>
                    </div>
                    <h5 className="font-medium text-sm">Visual Learners</h5>
                    <p className="text-xs text-muted-foreground">Diagrams, charts, mind maps</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-600 dark:text-purple-300">🎧</span>
                    </div>
                    <h5 className="font-medium text-sm">Auditory Learners</h5>
                    <p className="text-xs text-muted-foreground">Podcasts, discussions, TTS</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-pink-600 dark:text-pink-300">✋</span>
                    </div>
                    <h5 className="font-medium text-sm">Kinesthetic Learners</h5>
                    <p className="text-xs text-muted-foreground">Hands-on activities, movement</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Process Differentiation</h4>
                <ul className="grid md:grid-cols-2 gap-2 text-sm">
                  <li>• Flexible pacing options</li>
                  <li>• Choice in learning pathways</li>
                  <li>• Varied grouping strategies</li>
                  <li>• Multiple practice formats</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'technology-integration',
      type: 'example',
      title: 'Technology Tools for Inclusive Learning',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Assistive Technology Integration</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Reading Support</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Text-to-speech software</li>
                    <li>• Reading comprehension tools</li>
                    <li>• Digital highlighting systems</li>
                  </ul>
                </div>
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Writing Support</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Speech-to-text applications</li>
                    <li>• Grammar and spell checkers</li>
                    <li>• Graphic organizers</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-teal-700 dark:text-teal-300 mb-1">Organization Tools</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Digital calendars and planners</li>
                    <li>• Task management apps</li>
                    <li>• Note-taking applications</li>
                  </ul>
                </div>
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-cyan-700 dark:text-cyan-300 mb-1">Focus & Attention</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Focus apps and timers</li>
                    <li>• Noise-canceling tools</li>
                    <li>• Mindfulness applications</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'professional-development',
      type: 'concept',
      title: 'Continuous Professional Development',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Growing as a Neuro-Affirming Educator</h3>
            <div className="space-y-4">
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-3">Essential Knowledge Areas</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <ul className="space-y-1 text-sm">
                    <li>• Neurodiversity research and theory</li>
                    <li>• Universal Design for Learning</li>
                    <li>• Assistive technology tools</li>
                    <li>• Trauma-informed practices</li>
                  </ul>
                  <ul className="space-y-1 text-sm">
                    <li>• Executive function development</li>
                    <li>• Social-emotional learning</li>
                    <li>• Culturally responsive teaching</li>
                    <li>• Mental health awareness</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">Professional Learning Opportunities</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Neurodiversity conferences and workshops</li>
                  <li>• Online courses in inclusive education</li>
                  <li>• Professional learning communities</li>
                  <li>• Research partnerships with universities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'student-support-resources',
      type: 'practice',
      title: 'Connecting Students to Support Services',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Comprehensive Support Network</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">Academic Support</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Disability services offices</li>
                    <li>• Learning centers and tutoring</li>
                    <li>• Academic coaching programs</li>
                    <li>• Peer mentoring systems</li>
                  </ul>
                </div>
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-pink-700 dark:text-pink-300 mb-2">Mental Health Resources</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Counseling and therapy services</li>
                    <li>• Support groups and communities</li>
                    <li>• Crisis intervention resources</li>
                    <li>• Stress management programs</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Technology Support</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Assistive technology training</li>
                    <li>• Equipment lending programs</li>
                    <li>• Technical troubleshooting</li>
                    <li>• Software recommendations</li>
                  </ul>
                </div>
                <div className="bg-background/80 p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Career Services</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Career exploration and planning</li>
                    <li>• Interview preparation</li>
                    <li>• Workplace accommodation guidance</li>
                    <li>• Professional networking opportunities</li>;
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'measuring-success',
      type: 'example',
      title: 'Measuring Student Success & Course Effectiveness',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Success Metrics & Evaluation</h3>
            <div className="space-y-4">
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">Student Success Indicators</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <ul className="space-y-1 text-sm">
                    <li>• Increased self-awareness and confidence</li>
                    <li>• Improved academic performance</li>
                    <li>• Enhanced self-advocacy skills</li>
                    <li>• Better stress management</li>
                  </ul>
                  <ul className="space-y-1 text-sm">
                    <li>• Strategic tool adoption and usage</li>
                    <li>• Positive mindset development</li>
                    <li>• Engagement in learning activities</li>
                    <li>• Peer collaboration and support</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Assessment Methods</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Pre/post self-assessment surveys</li>
                  <li>• Learning portfolio reviews</li>
                  <li>• Goal achievement tracking</li>
                  <li>• Peer and instructor feedback</li>
                  <li>• Long-term follow-up studies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'course-adaptation',
      type: 'practice',
      title: 'Adapting Course Content for Different Contexts',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Contextual Adaptations</h3>
            <div className="space-y-4">
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-teal-700 dark:text-teal-300 mb-3">Educational Settings</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <h5 className="font-medium text-sm mb-1">K-12 Schools</h5>
                    <p className="text-xs text-muted-foreground">Age-appropriate examples, parent involvement</p>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <h5 className="font-medium text-sm mb-1">Higher Education</h5>
                    <p className="text-xs text-muted-foreground">Academic independence, career preparation</p>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <h5 className="font-medium text-sm mb-1">Workplace Training</h5>
                    <p className="text-xs text-muted-foreground">Professional contexts, accommodation requests</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Cultural Considerations</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Culturally relevant examples and case studies</li>
                  <li>• Language accessibility and translation</li>
                  <li>• Diverse representation in materials</li>
                  <li>• Respect for different learning traditions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'implementation-checklist',
      type: 'summary',
      title: 'Course Implementation Checklist',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Ready to Launch Checklist</h3>
            <div className="space-y-4">
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">Pre-Course Preparation</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Learning environment assessed for accessibility</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Support resources identified and available</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Assistive technology tools ready</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Materials adapted for multiple formats</span>
                  </label>
                </div>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-3">During Course Delivery</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Regular check-ins with students</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Flexible pacing maintained</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Multiple assessment options provided</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Peer support opportunities facilitated</span>
                  </label>
                </div>
              </div>
              
              <div className="bg-background/80 p-4 rounded-lg">
                <h4 className="font-semibold text-teal-700 dark:text-teal-300 mb-3">Post-Course Follow-up</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Student feedback collected and analyzed</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Long-term success metrics tracked</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Course materials updated based on feedback</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Ongoing support resources provided</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    }
  ]
};