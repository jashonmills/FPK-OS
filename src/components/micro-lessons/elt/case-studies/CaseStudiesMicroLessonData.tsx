import React from 'react';
import { MicroLessonData } from '../../MicroLessonContainer';
import { Users, Lightbulb, Trophy, Heart, Target, BookOpen } from 'lucide-react';

export const caseStudiesMicroLessons: MicroLessonData = {
  id: 'case-studies-micro',
  moduleTitle: 'Case Studies & Success Stories',
  totalScreens: 12,
  screens: [
    {
      id: '1',
      type: 'concept',
      title: 'Learning from Success Stories',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">Teaching Moment: Why Case Studies Matter</h3>
            </div>
            <p className="text-blue-700 mb-4">
              Real success stories provide powerful evidence that neurodivergent learners can thrive academically. They show us practical strategies, inspire hope, and demonstrate that challenges can become strengths.
            </p>
            <div className="bg-white/50 rounded p-4">
              <p className="text-blue-800 font-medium mb-2">What makes these stories valuable:</p>
              <ul className="text-blue-700 text-sm list-disc list-inside space-y-1">
                <li>They show real-world application of learning strategies</li>
                <li>They demonstrate how neurodivergent traits can be assets</li>
                <li>They provide hope and motivation during difficult times</li>
                <li>They offer concrete examples of what works</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: '2',
      type: 'example',
      title: 'Maria\'s ADHD Success Story',
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-bold text-green-800 mb-3">Maria: From Struggling Student to Academic Success</h4>
            <p className="text-green-700 mb-4">
              Maria was diagnosed with ADHD in her sophomore year of college. Before her diagnosis, she struggled with time management, staying organized, and maintaining focus during lectures.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <h5 className="font-semibold text-red-800 mb-2">Before: The Struggles</h5>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Consistently late with assignments</li>
                  <li>• Lost focus during 3-hour lectures</li>
                  <li>• Messy notes, couldn't find information</li>
                  <li>• Procrastinated until the last minute</li>
                  <li>• Felt overwhelmed and anxious</li>
                  <li>• GPA: 2.1</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h5 className="font-semibold text-green-800 mb-2">After: The Transformation</h5>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Assignments submitted on time</li>
                  <li>• Used active listening strategies</li>
                  <li>• Digital organization system</li>
                  <li>• Broke large tasks into small steps</li>
                  <li>• Developed coping strategies</li>
                  <li>• GPA: 3.7</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h5 className="font-semibold text-yellow-800 mb-3">🔑 Key Strategies That Worked for Maria</h5>
            <div className="grid md:grid-cols-2 gap-4 text-yellow-700 text-sm">
              <div>
                <p className="font-medium mb-2">Time Management:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Pomodoro Technique (25-min focused work)</li>
                  <li>Digital calendar with multiple reminders</li>
                  <li>Time-blocking for different activities</li>
                  <li>Breaking assignments into daily mini-goals</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Learning Strategies:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Active note-taking with color coding</li>
                  <li>Standing desk for fidgeting while studying</li>
                  <li>Recording lectures for later review</li>
                  <li>Study groups for accountability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: '3',
      type: 'example',
      title: 'David\'s Autism Success Journey',
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 className="font-bold text-purple-800 mb-3">David: Transforming Detail-Orientation into Academic Excellence</h4>
            <p className="text-purple-700 mb-4">
              David is an autistic graduate student in engineering. Initially, his professors viewed his attention to detail and need for structure as "inflexibility," but he learned to frame these traits as strengths.
            </p>
            
            <div className="bg-indigo-50 border border-indigo-200 rounded p-4 mb-4">
              <h5 className="font-semibold text-indigo-800 mb-2">The Challenge: Misunderstood Strengths</h5>
              <p className="text-indigo-700 text-sm">
                David's systematic approach and thorough analysis were initially seen as "overthinking" and "taking too long." Group projects were especially difficult due to communication differences and sensory sensitivities.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h5 className="font-semibold text-green-800 mb-2">The Solution: Strength-Based Approach</h5>
              <ul className="text-green-700 text-sm space-y-2">
                <li>• <strong>Leveraged systematic thinking:</strong> Created detailed project timelines that became team templates</li>
                <li>• <strong>Used special interests:</strong> Connected coursework to his passion for renewable energy</li>
                <li>• <strong>Managed sensory needs:</strong> Found quiet study spaces and used noise-canceling headphones</li>
                <li>• <strong>Improved communication:</strong> Practiced explaining complex ideas in simple terms</li>
                <li>• <strong>Built on routines:</strong> Established consistent daily and weekly schedules</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h5 className="font-semibold text-yellow-800 mb-3">💡 David's Key Insights</h5>
            <div className="space-y-3 text-yellow-700 text-sm">
              <div className="bg-white/70 rounded p-3">
                <p className="font-medium">"My attention to detail isn't a flaw—it's what makes me catch errors others miss."</p>
              </div>
              <div className="bg-white/70 rounded p-3">
                <p className="font-medium">"Structure isn't limiting—it frees up my mental energy for creative problem-solving."</p>
              </div>
              <div className="bg-white/70 rounded p-3">
                <p className="font-medium">"My direct communication style is actually appreciated in technical fields."</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: '4',
      type: 'example',
      title: 'Sarah\'s Dyslexia Breakthrough',
      content: (
        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h4 className="font-bold text-orange-800 mb-3">Sarah: From Reading Struggles to Creative Excellence</h4>
            <p className="text-orange-700 mb-4">
              Sarah struggled with reading throughout elementary and high school. She was often labeled as "lazy" or "not trying hard enough" until she was diagnosed with dyslexia in college and learned to harness her visual-spatial strengths.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <h5 className="font-semibold text-red-800 mb-2">The Reading Challenges</h5>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Slow reading speed</li>
                  <li>• Difficulty with phonetic decoding</li>
                  <li>• Poor spelling despite good vocabulary</li>
                  <li>• Avoided reading-heavy subjects</li>
                  <li>• Low academic self-confidence</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h5 className="font-semibold text-green-800 mb-2">The Visual Strengths</h5>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Excellent spatial reasoning</li>
                  <li>• Strong creative and artistic abilities</li>
                  <li>• Great at seeing the "big picture"</li>
                  <li>• Innovative problem-solving</li>
                  <li>• Strong storytelling skills</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h5 className="font-semibold text-blue-800 mb-3">🎨 Sarah's Breakthrough Strategies</h5>
            <div className="space-y-4 text-blue-700 text-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-2">Reading Support:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Text-to-speech software for all reading</li>
                    <li>Audiobooks paired with physical texts</li>
                    <li>Highlighting and annotation tools</li>
                    <li>Increased font size and spacing</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Strength Utilization:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Visual mind mapping for all subjects</li>
                    <li>Creating infographics for presentations</li>
                    <li>Using color-coding systems</li>
                    <li>Drawing concepts instead of just writing</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white/70 rounded p-3 mt-4">
                <p className="font-medium text-blue-800">Result:</p>
                <p className="text-blue-700">Sarah became a graphic design major and now uses her visual strengths professionally. She graduated magna cum laude and credits understanding her dyslexia as the turning point in her academic career.</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: '5',
      type: 'concept',
      title: 'Common Success Patterns',
      content: (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-emerald-800">Teaching Moment: Success Patterns</h3>
            </div>
            <p className="text-emerald-700 mb-4">
              While every neurodivergent journey is unique, successful students often follow similar patterns. Understanding these patterns can help you create your own path to success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <h4 className="font-bold text-blue-800 mb-3">🔄 The Success Cycle</h4>
              <div className="space-y-3 text-blue-700 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">1.</span>
                  <div>
                    <p className="font-medium">Self-Awareness</p>
                    <p className="text-xs">Understanding their neurodivergent profile</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">2.</span>
                  <div>
                    <p className="font-medium">Strategy Experimentation</p>
                    <p className="text-xs">Trying different approaches and tools</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">3.</span>
                  <div>
                    <p className="font-medium">System Development</p>
                    <p className="text-xs">Creating personalized learning systems</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">4.</span>
                  <div>
                    <p className="font-medium">Advocacy Skills</p>
                    <p className="text-xs">Communicating needs and strengths</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">5.</span>
                  <div>
                    <p className="font-medium">Confidence Building</p>
                    <p className="text-xs">Experiencing success and building on it</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
              <h4 className="font-bold text-purple-800 mb-3">💪 Key Success Factors</h4>
              <ul className="text-purple-700 text-sm space-y-2">
                <li>• <strong>Growth Mindset:</strong> Viewing challenges as opportunities to learn</li>
                <li>• <strong>Strength Focus:</strong> Building on natural abilities rather than just fixing weaknesses</li>
                <li>• <strong>Environmental Control:</strong> Creating optimal learning conditions</li>
                <li>• <strong>Support Networks:</strong> Building relationships with understanding peers and mentors</li>
                <li>• <strong>Tool Utilization:</strong> Embracing assistive technology and learning aids</li>
                <li>• <strong>Self-Compassion:</strong> Being patient and kind with themselves during the learning process</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: '6',
      type: 'practice',
      title: 'Your Success Story Planning',
      content: (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-800">Creating Your Success Story</h3>
            </div>
            <p className="text-yellow-700">
              Every success story starts with a plan. Let's identify the strategies and approaches that will work best for your unique situation and goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <h4 className="font-semibold text-blue-800 mb-3">📋 Success Story Planning</h4>
              <div className="space-y-3 text-blue-700 text-sm">
                <div className="bg-white/70 rounded p-3">
                  <p className="font-medium mb-1">My current challenges:</p>
                  <p className="text-xs text-blue-600">(What specific academic or learning difficulties are you facing?)</p>
                </div>
                <div className="bg-white/70 rounded p-3">
                  <p className="font-medium mb-1">My strengths and superpowers:</p>
                  <p className="text-xs text-blue-600">(What are you naturally good at? What do others compliment you on?)</p>
                </div>
                <div className="bg-white/70 rounded p-3">
                  <p className="font-medium mb-1">Strategies I want to try:</p>
                  <p className="text-xs text-blue-600">(Based on the case studies, which approaches resonate with you?)</p>
                </div>
                <div className="bg-white/70 rounded p-3">
                  <p className="font-medium mb-1">My success metrics:</p>
                  <p className="text-xs text-blue-600">(How will you know when you're making progress?)</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <h4 className="font-semibold text-green-800 mb-3">🎯 Action Planning</h4>
              <div className="space-y-3 text-green-700 text-sm">
                <div>
                  <p className="font-medium mb-2">This Week I Will:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Try one new study strategy</li>
                    <li>Set up one organizational system</li>
                    <li>Identify my optimal study environment</li>
                    <li>Practice one self-advocacy skill</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">This Month I Will:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Establish consistent routines</li>
                    <li>Build relationships with supportive peers</li>
                    <li>Communicate my needs to at least one instructor</li>
                    <li>Celebrate my progress and successes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 8
    },
    {
      id: '7',
      type: 'concept',
      title: 'Building Your Support Network',
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-indigo-800">Teaching Moment: The Power of Community</h3>
            </div>
            <p className="text-indigo-700 mb-4">
              No one succeeds in isolation. Building a strong support network is crucial for neurodivergent learners because it provides encouragement, practical help, and a sense of belonging.
            </p>
            <div className="bg-white/50 rounded p-4">
              <p className="text-indigo-800 font-medium mb-2">Why support networks matter:</p>
              <p className="text-indigo-700 text-sm">
                They provide emotional support during challenges, practical advice from shared experiences, accountability for goals, and advocacy when facing discrimination or misunderstanding.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">👥 Peer Support</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Study groups with understanding classmates</li>
                <li>• Neurodivergent student organizations</li>
                <li>• Online communities and forums</li>
                <li>• Accountability partners</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">🏫 Academic Support</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Disability services offices</li>
                <li>• Understanding professors and TAs</li>
                <li>• Academic coaches and tutors</li>
                <li>• Learning specialists</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">💝 Personal Support</h4>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Family members who understand</li>
                <li>• Close friends who accept differences</li>
                <li>• Therapists or counselors</li>
                <li>• Mentors in your field of interest</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: '8',
      type: 'example',
      title: 'Alex\'s Executive Function Success',
      content: (
        <div className="space-y-6">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <h4 className="font-bold text-teal-800 mb-3">Alex: From Chaos to Systems Mastery</h4>
            <p className="text-teal-700 mb-4">
              Alex struggled with executive functioning throughout high school. They were constantly losing assignments, forgetting deadlines, and feeling overwhelmed by multi-step projects. College seemed impossible until they discovered systematic approaches that worked with their brain.
            </p>
            
            <div className="bg-orange-50 border border-orange-200 rounded p-4 mb-4">
              <h5 className="font-semibold text-orange-800 mb-2">The Executive Function Challenges</h5>
              <div className="grid md:grid-cols-2 gap-3 text-orange-700 text-sm">
                <div>
                  <p className="font-medium">Planning & Organization:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Couldn't break down large projects</li>
                    <li>Lost track of multiple assignments</li>
                    <li>Disorganized workspace and materials</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Time Management:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Chronic procrastination</li>
                    <li>Poor time estimation skills</li>
                    <li>Missed deadlines regularly</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h5 className="font-semibold text-green-800 mb-2">The Systems That Changed Everything</h5>
              <div className="space-y-3 text-green-700 text-sm">
                <div>
                  <p className="font-medium">Digital Organization System:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Google Calendar with multiple color-coded categories</li>
                    <li>Notion workspace for all projects and notes</li>
                    <li>Automated reminders and recurring tasks</li>
                    <li>Weekly and daily planning rituals</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Project Management Approach:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Breaking every assignment into 15-minute tasks</li>
                    <li>Using Kanban boards for visual progress tracking</li>
                    <li>Setting artificial deadlines 2 days early</li>
                    <li>Body doubling sessions for accountability</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h5 className="font-semibold text-yellow-800 mb-3">🎯 Alex's Transformation Results</h5>
            <div className="grid md:grid-cols-2 gap-4 text-yellow-700 text-sm">
              <div>
                <p className="font-medium mb-2">Academic Improvements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>GPA increased from 2.3 to 3.6</li>
                  <li>Zero missed deadlines in final year</li>
                  <li>Became peer tutor for organization skills</li>
                  <li>Completed honors thesis project</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Personal Growth:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Increased confidence and self-efficacy</li>
                  <li>Reduced anxiety and stress levels</li>
                  <li>Better work-life balance</li>
                  <li>Strong self-advocacy skills</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white/70 rounded p-3 mt-4">
              <p className="font-medium text-yellow-800">Alex's Key Insight:</p>
              <p className="text-yellow-700 italic">"I learned that my brain isn't broken—it just needs different systems. Once I stopped fighting against my natural patterns and started working with them, everything changed."</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: '9',
      type: 'practice',
      title: 'Identifying Your Success Models',
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-800">Finding Your Success Models</h3>
            </div>
            <p className="text-purple-700">
              Looking at these success stories, identify which strategies and approaches resonate most with your situation and learning style.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-4">🔍 Strategy Selection Exercise</h4>
            <div className="space-y-4 text-blue-700 text-sm">
              <div className="bg-white/70 rounded p-4">
                <p className="font-medium mb-2">Which success story resonated most with you and why?</p>
                <div className="grid md:grid-cols-2 gap-3 text-xs text-blue-600">
                  <div>
                    <p className="font-medium">Consider:</p>
                    <ul className="list-disc list-inside">
                      <li>Similar challenges you face</li>
                      <li>Strengths you share</li>
                      <li>Strategies that seem doable</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Reflect on:</p>
                    <ul className="list-disc list-inside">
                      <li>What obstacles they overcame</li>
                      <li>How they changed their mindset</li>
                      <li>What support they accessed</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 rounded p-4">
                <p className="font-medium mb-2">What specific strategies will you try first?</p>
                <div className="grid md:grid-cols-3 gap-3 text-xs text-blue-600">
                  <div>
                    <p className="font-medium">Organization:</p>
                    <ul className="list-disc list-inside">
                      <li>Digital calendars</li>
                      <li>Task breakdown methods</li>
                      <li>Physical workspace setup</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Learning:</p>
                    <ul className="list-disc list-inside">
                      <li>Note-taking systems</li>
                      <li>Study environment</li>
                      <li>Technology tools</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Support:</p>
                    <ul className="list-disc list-inside">
                      <li>Peer connections</li>
                      <li>Academic resources</li>
                      <li>Self-advocacy skills</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-800 mb-4">📈 Progress Tracking Plan</h4>
            <div className="space-y-3 text-green-700 text-sm">
              <div className="bg-white/70 rounded p-3">
                <p className="font-medium mb-2">How will you measure success?</p>
                <div className="grid md:grid-cols-2 gap-3 text-xs text-green-600">
                  <div>
                    <p className="font-medium">Academic Metrics:</p>
                    <ul className="list-disc list-inside">
                      <li>Assignment completion rates</li>
                      <li>Grade improvements</li>
                      <li>Reduced late submissions</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Well-being Metrics:</p>
                    <ul className="list-disc list-inside">
                      <li>Stress levels</li>
                      <li>Confidence in abilities</li>
                      <li>Enjoyment of learning</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 rounded p-3">
                <p className="font-medium mb-2">What support will you seek?</p>
                <p className="text-xs text-green-600">Think about peers, professors, family members, or services that could help you succeed.</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 7
    },
    {
      id: '10',
      type: 'concept',
      title: 'Overcoming Common Obstacles',
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">Teaching Moment: Navigating Challenges</h3>
            </div>
            <p className="text-red-700 mb-4">
              Even with the best strategies, you'll face obstacles. Understanding common challenges and having plans to overcome them is crucial for long-term success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <h4 className="font-bold text-orange-800 mb-3">⚠️ Common Obstacles</h4>
              <div className="space-y-3 text-orange-700 text-sm">
                <div>
                  <p className="font-medium">Imposter Syndrome</p>
                  <p className="text-xs">Feeling like you don't belong or aren't "smart enough"</p>
                </div>
                <div>
                  <p className="font-medium">Strategy Overwhelm</p>
                  <p className="text-xs">Trying to implement too many changes at once</p>
                </div>
                <div>
                  <p className="font-medium">Inconsistent Progress</p>
                  <p className="text-xs">Having good days and bad days with strategies</p>
                </div>
                <div>
                  <p className="font-medium">Lack of Understanding</p>
                  <p className="text-xs">Encountering people who don't understand neurodiversity</p>
                </div>
                <div>
                  <p className="font-medium">Perfectionism</p>
                  <p className="text-xs">Setting unrealistic standards and being too self-critical</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <h4 className="font-bold text-green-800 mb-3">💪 Overcoming Strategies</h4>
              <div className="space-y-3 text-green-700 text-sm">
                <div>
                  <p className="font-medium">Build Self-Compassion</p>
                  <p className="text-xs">Treat yourself with the same kindness you'd show a friend</p>
                </div>
                <div>
                  <p className="font-medium">Start Small</p>
                  <p className="text-xs">Implement one strategy at a time until it becomes habit</p>
                </div>
                <div>
                  <p className="font-medium">Expect Fluctuation</p>
                  <p className="text-xs">Progress isn't linear—bad days don't erase good progress</p>
                </div>
                <div>
                  <p className="font-medium">Educate Others</p>
                  <p className="text-xs">Share resources about neurodiversity with important people</p>
                </div>
                <div>
                  <p className="font-medium">Focus on Progress</p>
                  <p className="text-xs">Celebrate small wins and improvements, not just perfection</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 className="font-semibold text-purple-800 mb-4">🛡️ Building Resilience</h4>
            <div className="grid md:grid-cols-3 gap-4 text-purple-700 text-sm">
              <div>
                <p className="font-medium mb-2">Mindset Tools:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Growth mindset practices</li>
                  <li>Positive self-talk</li>
                  <li>Stress management techniques</li>
                  <li>Regular self-reflection</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Support Systems:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Regular check-ins with mentors</li>
                  <li>Peer support groups</li>
                  <li>Professional counseling</li>
                  <li>Family understanding</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Practical Skills:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Problem-solving frameworks</li>
                  <li>Advocacy communication</li>
                  <li>Boundary setting</li>
                  <li>Self-care routines</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: '11',
      type: 'practice',
      title: 'Your Personal Success Action Plan',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Creating Your Success Action Plan</h3>
            </div>
            <p className="text-green-700">
              Based on all the success stories and strategies you've learned, create a concrete action plan for your own academic success journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <h4 className="font-semibold text-blue-800 mb-4">📋 30-Day Action Plan</h4>
              <div className="space-y-4 text-blue-700 text-sm">
                <div className="bg-white/70 rounded p-3">
                  <p className="font-medium mb-2">Week 1: Foundation Setting</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Complete comprehensive self-assessment</li>
                    <li>Choose 1-2 strategies to implement</li>
                    <li>Set up basic organizational system</li>
                    <li>Identify key support people</li>
                  </ul>
                </div>
                
                <div className="bg-white/70 rounded p-3">
                  <p className="font-medium mb-2">Week 2: System Implementation</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Start using chosen learning strategies</li>
                    <li>Establish daily and weekly routines</li>
                    <li>Practice self-advocacy in low-stakes situation</li>
                    <li>Track progress and challenges</li>
                  </ul>
                </div>
                
                <div className="bg-white/70 rounded p-3">
                  <p className="font-medium mb-2">Week 3: Refinement</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Adjust strategies based on what's working</li>
                    <li>Address any obstacles that arose</li>
                    <li>Strengthen support network connections</li>
                    <li>Celebrate small wins and progress</li>
                  </ul>
                </div>
                
                <div className="bg-white/70 rounded p-3">
                  <p className="font-medium mb-2">Week 4: Expansion</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Add one new strategy or tool</li>
                    <li>Plan for long-term sustainability</li>
                    <li>Share successes with support network</li>
                    <li>Set goals for continued growth</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
              <h4 className="font-semibold text-yellow-800 mb-4">🎯 Success Tracking</h4>
              <div className="space-y-4 text-yellow-700 text-sm">
                <div className="bg-white/70 rounded p-3">
                  <p className="font-medium mb-2">Daily Check-ins:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Did I use my chosen strategies today?</li>
                    <li>What worked well?</li>
                    <li>What was challenging?</li>
                    <li>How do I feel about my progress?</li>
                  </ul>
                </div>
                
                <div className="bg-white/70 rounded p-3">
                  <p className="font-medium mb-2">Weekly Reviews:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>What patterns am I noticing?</li>
                    <li>What adjustments do I need to make?</li>
                    <li>Who can I reach out to for support?</li>
                    <li>What successes should I celebrate?</li>
                  </ul>
                </div>
                
                <div className="bg-white/70 rounded p-3">
                  <p className="font-medium mb-2">Monthly Assessments:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>How have my academic outcomes improved?</li>
                    <li>What new strategies am I ready to try?</li>
                    <li>How has my confidence changed?</li>
                    <li>What goals do I want to set for next month?</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h4 className="font-semibold text-indigo-800 mb-4">💫 Your Success Commitment</h4>
            <div className="space-y-3 text-indigo-700 text-sm">
              <div className="bg-white/70 rounded p-3">
                <p className="font-medium">I commit to trying these specific strategies:</p>
                <p className="text-xs text-indigo-600 mt-1">(Choose 2-3 concrete strategies from the case studies)</p>
              </div>
              <div className="bg-white/70 rounded p-3">
                <p className="font-medium">I will seek support from:</p>
                <p className="text-xs text-indigo-600 mt-1">(Identify specific people or services)</p>
              </div>
              <div className="bg-white/70 rounded p-3">
                <p className="font-medium">I will measure my success by:</p>
                <p className="text-xs text-indigo-600 mt-1">(Define specific, measurable outcomes)</p>
              </div>
              <div className="bg-white/70 rounded p-3">
                <p className="font-medium">When I face obstacles, I will:</p>
                <p className="text-xs text-indigo-600 mt-1">(Plan your resilience strategies)</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 10
    },
    {
      id: '12',
      type: 'summary',
      title: 'Your Success Story Begins Now',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-800">Your Journey Starts Here</h3>
            </div>
            <p className="text-purple-700 mb-4">
              You've learned from the success stories of other neurodivergent learners and created your own action plan. Remember: every expert was once a beginner, and every success story started with a single step.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <h4 className="font-bold text-blue-800 mb-3">✅ What You've Accomplished</h4>
              <ul className="text-blue-700 text-sm space-y-2">
                <li>• Learned from multiple neurodivergent success stories</li>
                <li>• Identified common patterns and success factors</li>
                <li>• Selected strategies that resonate with your situation</li>
                <li>• Created a concrete 30-day action plan</li>
                <li>• Developed progress tracking systems</li>
                <li>• Prepared for common obstacles and challenges</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <h4 className="font-bold text-green-800 mb-3">🚀 Your Next Steps</h4>
              <ul className="text-green-700 text-sm space-y-2">
                <li>• Start implementing your chosen strategies this week</li>
                <li>• Connect with at least one person in your support network</li>
                <li>• Begin daily progress check-ins</li>
                <li>• Practice self-compassion during the learning process</li>
                <li>• Celebrate every small victory along the way</li>
                <li>• Remember that setbacks are part of the journey</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h4 className="font-bold text-yellow-800 mb-3">🌟 Remember This</h4>
            <div className="space-y-3 text-yellow-700">
              <p className="text-lg font-medium">
                Your neurodivergent brain is not a limitation—it's your unique advantage waiting to be unleashed.
              </p>
              <p className="text-sm">
                Every successful neurodivergent learner faced the same doubts and challenges you might be feeling now. 
                What made them successful wasn't the absence of struggles, but the courage to keep trying and adapting.
              </p>
              <p className="text-sm italic">
                "Success isn't about being perfect—it's about being persistent, compassionate with yourself, and celebrating progress over perfection."
              </p>
            </div>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h4 className="font-semibold text-indigo-800 mb-3 text-center">🎯 Your Success Mantra</h4>
            <div className="text-center text-indigo-700 space-y-2">
              <p className="text-lg font-medium">"I am capable, I am resilient, and I am worthy of success."</p>
              <p className="text-sm">"My brain works differently, and that difference is my strength."</p>
              <p className="text-sm">"Every small step forward is a victory worth celebrating."</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    }
  ]
};