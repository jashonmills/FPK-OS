import React from 'react';
import { MicroLessonData } from '../../MicroLessonContainer';

export const enhancedAssessmentsMicroLessons: MicroLessonData = {
  id: 'enhanced-assessments',
  moduleTitle: 'Comprehensive Assessment & Progress Tracking',
  totalScreens: 25,
  screens: [
    {
      id: 'diagnostic-overview',
      type: 'concept',
      title: 'Diagnostic Assessment Framework',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Comprehensive Diagnostic Assessment</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Pre-Assessment Tools</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Learning style inventory</li>
                <li>• Executive function screening</li>
                <li>• Attention and focus evaluation</li>
                <li>• Memory and processing assessment</li>
                <li>• Sensory profile questionnaire</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Ongoing Monitoring</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Progress tracking metrics</li>
                <li>• Skill development milestones</li>
                <li>• Behavioral observations</li>
                <li>• Self-reflection journals</li>
                <li>• Goal achievement tracking</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 240
    },
    {
      id: 'learning-style-assessment',
      type: 'practice',
      title: 'Learning Style Diagnostic Tool',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Learning Style Assessment</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Multi-Modal Learning Preferences</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold text-accent mb-2">Visual Learner Indicators</h4>
                <ul className="text-sm space-y-1">
                  <li>• Prefers charts and diagrams</li>
                  <li>• Benefits from color-coding</li>
                  <li>• Thinks in pictures</li>
                  <li>• Uses visual organizers</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold text-accent mb-2">Auditory Learner Indicators</h4>
                <ul className="text-sm space-y-1">
                  <li>• Learns through listening</li>
                  <li>• Benefits from discussions</li>
                  <li>• Uses verbal processing</li>
                  <li>• Remembers through repetition</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold text-accent mb-2">Kinesthetic Learner Indicators</h4>
                <ul className="text-sm space-y-1">
                  <li>• Learns through movement</li>
                  <li>• Needs hands-on activities</li>
                  <li>• Benefits from manipulation</li>
                  <li>• Uses body-based memory</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 180
    },
    {
      id: 'executive-function-screening',
      type: 'practice',
      title: 'Executive Function Skills Assessment',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Executive Function Evaluation</h2>
          <div className="space-y-4">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Core Assessment Areas</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Working Memory</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Following multi-step instructions</li>
                    <li>• Mental math capabilities</li>
                    <li>• Information processing speed</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cognitive Flexibility</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Adapting to rule changes</li>
                    <li>• Perspective-taking abilities</li>
                    <li>• Problem-solving approaches</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Inhibitory Control</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Impulse management</li>
                    <li>• Attention regulation</li>
                    <li>• Response inhibition</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Planning & Organization</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Goal setting abilities</li>
                    <li>• Time management skills</li>
                    <li>• Strategic thinking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 300
    },
    {
      id: 'attention-focus-evaluation',
      type: 'practice',
      title: 'Attention & Focus Assessment Protocol',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Attention & Focus Evaluation</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Assessment Components</h3>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Sustained Attention Tasks</h4>
                <p className="text-sm text-muted-foreground mb-2">Measuring ability to maintain focus over extended periods</p>
                <ul className="text-sm space-y-1">
                  <li>• 5-minute focused reading task</li>
                  <li>• Continuous performance test</li>
                  <li>• Vigilance task completion</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Selective Attention Measures</h4>
                <p className="text-sm text-muted-foreground mb-2">Evaluating filtering and focus abilities</p>
                <ul className="text-sm space-y-1">
                  <li>• Stroop test variations</li>
                  <li>• Visual search tasks</li>
                  <li>• Auditory discrimination tests</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Divided Attention Assessment</h4>
                <p className="text-sm text-muted-foreground mb-2">Testing multitasking capabilities</p>
                <ul className="text-sm space-y-1">
                  <li>• Dual-task performance</li>
                  <li>• Attention switching exercises</li>
                  <li>• Task prioritization scenarios</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 270
    },
    {
      id: 'memory-processing-assessment',
      type: 'practice',
      title: 'Memory & Processing Speed Evaluation',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Memory & Processing Assessment</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Memory Assessment</h3>
              <div className="space-y-3">
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Short-term Memory</h4>
                  <p className="text-xs text-muted-foreground">Digit span, word lists, spatial memory</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Working Memory</h4>
                  <p className="text-xs text-muted-foreground">Mental manipulation, backwards tasks</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Long-term Memory</h4>
                  <p className="text-xs text-muted-foreground">Retrieval strategies, consolidation</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Processing Speed</h3>
              <div className="space-y-3">
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Visual Processing</h4>
                  <p className="text-xs text-muted-foreground">Symbol scanning, pattern recognition</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Auditory Processing</h4>
                  <p className="text-xs text-muted-foreground">Sound discrimination, sequencing</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Motor Speed</h4>
                  <p className="text-xs text-muted-foreground">Fine motor coordination, response time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 240
    },
    {
      id: 'sensory-profile-questionnaire',
      type: 'practice',
      title: 'Comprehensive Sensory Profile',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Sensory Processing Profile</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Sensory System Assessment</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Auditory Processing</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Sound sensitivity levels</li>
                  <li>• Background noise tolerance</li>
                  <li>• Auditory discrimination</li>
                  <li>• Sound localization</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Visual Processing</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Light sensitivity</li>
                  <li>• Visual tracking abilities</li>
                  <li>• Color discrimination</li>
                  <li>• Depth perception</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Tactile Processing</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Touch sensitivity</li>
                  <li>• Texture preferences</li>
                  <li>• Temperature tolerance</li>
                  <li>• Proprioceptive awareness</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 200
    },
    {
      id: 'progress-tracking-system',
      type: 'concept',
      title: 'Dynamic Progress Tracking Framework',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Progress Tracking & Analytics</h2>
          <div className="space-y-4">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Multi-Dimensional Tracking</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Academic Progress</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Skill mastery levels</li>
                    <li>• Learning objective completion</li>
                    <li>• Assessment performance trends</li>
                    <li>• Knowledge retention rates</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Behavioral Indicators</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Engagement metrics</li>
                    <li>• Task persistence measures</li>
                    <li>• Self-regulation improvements</li>
                    <li>• Social interaction quality</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Data Visualization</h3>
              <p className="text-muted-foreground">Interactive dashboards showing progress trends, achievement milestones, and areas for improvement with visual charts and graphs.</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 180
    },
    {
      id: 'skill-milestone-mapping',
      type: 'concept',
      title: 'Developmental Milestone Framework',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Skill Development Milestones</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Progressive Skill Mapping</h3>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Foundation Level (Weeks 1-4)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Basic self-awareness skills</li>
                  <li>• Simple organization strategies</li>
                  <li>• Initial study habit formation</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Developing Level (Weeks 5-8)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Enhanced executive functioning</li>
                  <li>• Improved attention regulation</li>
                  <li>• Intermediate advocacy skills</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Proficient Level (Weeks 9-12)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Advanced problem-solving</li>
                  <li>• Independent strategy application</li>
                  <li>• Complex task management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 200
    },
    {
      id: 'behavioral-observation-tools',
      type: 'practice',
      title: 'Behavioral Observation & Documentation',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Behavioral Assessment Tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Observation Categories</h3>
              <div className="space-y-3">
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Task Engagement</h4>
                  <p className="text-xs text-muted-foreground">Focus duration, participation quality</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Social Interactions</h4>
                  <p className="text-xs text-muted-foreground">Peer communication, collaboration skills</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Self-Regulation</h4>
                  <p className="text-xs text-muted-foreground">Emotional control, coping strategies</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Documentation Methods</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Frequency data collection</li>
                <li>• Duration recording systems</li>
                <li>• Anecdotal observation logs</li>
                <li>• Video analysis protocols</li>
                <li>• Peer feedback forms</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 220
    },
    {
      id: 'self-reflection-journals',
      type: 'practice',
      title: 'Structured Self-Reflection Framework',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Self-Reflection & Metacognition</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Reflection Protocols</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Daily Reflection Prompts</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• What strategy worked best today?</li>
                  <li>• Which challenges did I overcome?</li>
                  <li>• How did I manage my attention?</li>
                  <li>• What will I try differently tomorrow?</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Weekly Goal Review</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Progress toward learning objectives</li>
                  <li>• Strategy effectiveness evaluation</li>
                  <li>• Adjustment needs identification</li>
                  <li>• Success celebration planning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 150
    },
    {
      id: 'goal-achievement-tracking',
      type: 'practice',
      title: 'Comprehensive Goal Management System',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Goal Setting & Achievement Tracking</h2>
          <div className="space-y-4">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">SMART Goals Framework</h3>
              <div className="grid md:grid-cols-5 gap-3">
                <div className="text-center p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm text-accent">Specific</h4>
                  <p className="text-xs text-muted-foreground">Clear & defined</p>
                </div>
                <div className="text-center p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm text-accent">Measurable</h4>
                  <p className="text-xs text-muted-foreground">Quantifiable progress</p>
                </div>
                <div className="text-center p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm text-accent">Achievable</h4>
                  <p className="text-xs text-muted-foreground">Realistic targets</p>
                </div>
                <div className="text-center p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm text-accent">Relevant</h4>
                  <p className="text-xs text-muted-foreground">Meaningful objectives</p>
                </div>
                <div className="text-center p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm text-accent">Time-bound</h4>
                  <p className="text-xs text-muted-foreground">Deadline driven</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Progress Monitoring Tools</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Visual progress bars and charts</li>
                <li>• Milestone celebration systems</li>
                <li>• Obstacle identification protocols</li>
                <li>• Success strategy documentation</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 190
    },
    {
      id: 'formative-assessment-strategies',
      type: 'concept',
      title: 'Ongoing Formative Assessment Methods',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Formative Assessment Strategies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Real-Time Assessment</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Exit tickets and quick checks</li>
                <li>• Thumbs up/down polling</li>
                <li>• One-minute reflections</li>
                <li>• Digital response systems</li>
                <li>• Peer assessment activities</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Performance-Based Assessment</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Portfolio development</li>
                <li>• Project-based evaluations</li>
                <li>• Demonstration tasks</li>
                <li>• Problem-solving scenarios</li>
                <li>• Collaborative group work</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 160
    },
    {
      id: 'summative-assessment-design',
      type: 'concept',
      title: 'Comprehensive Summative Assessment Framework',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Summative Assessment Design</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Multi-Modal Assessment Options</h3>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Traditional Assessments</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Adaptive testing formats</li>
                  <li>• Extended time accommodations</li>
                  <li>• Alternative response methods</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Creative Demonstrations</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Digital storytelling projects</li>
                  <li>• Interactive presentations</li>
                  <li>• Multimedia portfolios</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Authentic Performance Tasks</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Real-world problem solving</li>
                  <li>• Community-based projects</li>
                  <li>• Workplace simulations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 180
    },
    {
      id: 'accommodation-protocols',
      type: 'concept',
      title: 'Assessment Accommodation Guidelines',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Assessment Accommodations</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Presentation Accommodations</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Large print materials</li>
                <li>• Audio delivery options</li>
                <li>• Visual enhancement tools</li>
                <li>• Simplified language</li>
                <li>• Graphic organizers</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Response Accommodations</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Speech-to-text software</li>
                <li>• Alternative keyboards</li>
                <li>• Oral responses</li>
                <li>• Drawing/diagramming</li>
                <li>• Calculator usage</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Setting Accommodations</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Separate room testing</li>
                <li>• Reduced distractions</li>
                <li>• Flexible seating</li>
                <li>• Movement breaks</li>
                <li>• Preferred lighting</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 170
    },
    {
      id: 'rubric-development',
      type: 'practice',
      title: 'Comprehensive Rubric Design Framework',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Assessment Rubric Development</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Multi-Criteria Rubric Framework</h3>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Criteria</th>
                      <th className="border border-border p-2">Developing</th>
                      <th className="border border-border p-2">Proficient</th>
                      <th className="border border-border p-2">Advanced</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2 font-semibold">Strategy Application</td>
                      <td className="border border-border p-2 text-sm">Basic use with support</td>
                      <td className="border border-border p-2 text-sm">Independent application</td>
                      <td className="border border-border p-2 text-sm">Adaptive & creative use</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-semibold">Self-Advocacy</td>
                      <td className="border border-border p-2 text-sm">Identifies needs with help</td>
                      <td className="border border-border p-2 text-sm">Communicates needs clearly</td>
                      <td className="border border-border p-2 text-sm">Teaches others strategies</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 200
    },
    {
      id: 'data-analysis-interpretation',
      type: 'concept',
      title: 'Assessment Data Analysis & Interpretation',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Data-Driven Decision Making</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Quantitative Analysis</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Statistical trend analysis</li>
                <li>• Growth rate calculations</li>
                <li>• Performance correlation studies</li>
                <li>• Comparative benchmark data</li>
                <li>• Predictive modeling tools</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Qualitative Insights</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Behavioral pattern recognition</li>
                <li>• Contextual factor analysis</li>
                <li>• Narrative assessment summaries</li>
                <li>• Stakeholder feedback synthesis</li>
                <li>• Environmental impact evaluation</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 160
    },
    {
      id: 'intervention-planning',
      type: 'concept',
      title: 'Assessment-Based Intervention Planning',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Targeted Intervention Strategies</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Response to Assessment Framework</h3>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Tier 1: Universal Supports</h4>
                <p className="text-sm text-muted-foreground">High-quality instruction and classroom-wide strategies for all learners</p>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Tier 2: Targeted Interventions</h4>
                <p className="text-sm text-muted-foreground">Small group or individual support for specific skill deficits</p>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Tier 3: Intensive Interventions</h4>
                <p className="text-sm text-muted-foreground">Comprehensive, individualized support with frequent progress monitoring</p>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 180
    },
    {
      id: 'parent-family-reporting',
      type: 'concept',
      title: 'Family Communication & Reporting Systems',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Family Engagement in Assessment</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Progress Reports</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Visual progress dashboards</li>
                <li>• Narrative skill descriptions</li>
                <li>• Goal achievement summaries</li>
                <li>• Next steps recommendations</li>
                <li>• Home practice suggestions</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Family Input Collection</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Home behavior questionnaires</li>
                <li>• Strategy effectiveness surveys</li>
                <li>• Goal priority discussions</li>
                <li>• Concern and question forums</li>
                <li>• Celebration sharing opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 140
    },
    {
      id: 'technology-enhanced-assessment',
      type: 'concept',
      title: 'Technology-Enhanced Assessment Tools',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Digital Assessment Innovation</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Advanced Technology Integration</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">AI-Powered Analytics</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Pattern recognition</li>
                  <li>• Predictive modeling</li>
                  <li>• Personalized recommendations</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Adaptive Testing</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Dynamic difficulty adjustment</li>
                  <li>• Real-time calibration</li>
                  <li>• Efficient assessment design</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Multimodal Data Collection</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Voice analysis tools</li>
                  <li>• Eye-tracking studies</li>
                  <li>• Gesture recognition</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 190
    },
    {
      id: 'continuous-improvement-cycle',
      type: 'concept',
      title: 'Assessment System Continuous Improvement',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">System-Wide Assessment Improvement</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Quality Assurance Framework</h3>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Regular Review Cycles</h4>
                <p className="text-sm text-muted-foreground mb-2">Systematic evaluation of assessment effectiveness and validity</p>
                <ul className="text-sm space-y-1">
                  <li>• Monthly data review meetings</li>
                  <li>• Quarterly system audits</li>
                  <li>• Annual comprehensive evaluation</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Stakeholder Feedback Integration</h4>
                <p className="text-sm text-muted-foreground mb-2">Incorporating perspectives from all assessment participants</p>
                <ul className="text-sm space-y-1">
                  <li>• Student experience surveys</li>
                  <li>• Educator feedback sessions</li>
                  <li>• Family input opportunities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 150
    },
    {
      id: 'assessment-ethics-privacy',
      type: 'concept',
      title: 'Assessment Ethics & Data Privacy',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Ethical Assessment Practices</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Privacy Protection</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Data encryption protocols</li>
                <li>• Access control systems</li>
                <li>• Consent management processes</li>
                <li>• Retention policy compliance</li>
                <li>• Secure data transmission</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Bias Mitigation</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Cultural responsiveness review</li>
                <li>• Accessibility audit processes</li>
                <li>• Multiple perspective validation</li>
                <li>• Equitable assessment design</li>
                <li>• Ongoing bias monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 160
    },
    {
      id: 'professional-development-assessment',
      type: 'concept',
      title: 'Educator Assessment Competency Development',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Assessment Literacy for Educators</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Core Competency Areas</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Assessment Design Skills</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Valid assessment construction</li>
                  <li>• Accommodation planning</li>
                  <li>• Rubric development</li>
                  <li>• Technology integration</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Interpretation Abilities</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Statistical analysis basics</li>
                  <li>• Trend identification</li>
                  <li>• Instructional implications</li>
                  <li>• Communication strategies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 170
    },
    {
      id: 'assessment-implementation-guide',
      type: 'summary',
      title: 'Comprehensive Assessment Implementation',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Assessment Mastery Summary</h2>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg border">
            <h3 className="text-2xl font-semibold mb-4 text-center">🏆 Assessment Excellence Achieved</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-card rounded-lg">
                <h4 className="font-semibold text-accent mb-2">Diagnostic Tools</h4>
                <p className="text-sm text-muted-foreground">Comprehensive pre-assessment and ongoing monitoring systems</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <h4 className="font-semibold text-accent mb-2">Progress Tracking</h4>
                <p className="text-sm text-muted-foreground">Multi-dimensional analytics and milestone mapping</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <h4 className="font-semibold text-accent mb-2">Data-Driven Decisions</h4>
                <p className="text-sm text-muted-foreground">Evidence-based intervention planning and continuous improvement</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold text-primary">You have mastered comprehensive assessment strategies for neurodiverse learners!</p>
              <p className="text-muted-foreground mt-2">Ready to implement evidence-based assessment practices that support every learner's unique journey.</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 120
    }
  ]
};