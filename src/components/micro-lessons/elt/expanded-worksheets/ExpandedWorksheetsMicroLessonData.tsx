import React from 'react';
import { MicroLessonData } from '../../MicroLessonContainer';

export const expandedWorksheetsMicroLessons: MicroLessonData = {
  id: 'expanded-worksheets',
  moduleTitle: 'Advanced Interactive Worksheets & Activities',
  totalScreens: 20,
  screens: [
    {
      id: 'worksheet-framework',
      type: 'concept',
      title: 'Interactive Worksheet Design Framework',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Advanced Worksheet Architecture</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Design Principles</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Multi-sensory engagement strategies</li>
                <li>• Adaptive difficulty progressions</li>
                <li>• Real-world application focus</li>
                <li>• Metacognitive reflection prompts</li>
                <li>• Collaborative learning elements</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Interactive Components</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Digital manipulation tools</li>
                <li>• Multimedia integration points</li>
                <li>• Progress tracking mechanisms</li>
                <li>• Peer collaboration spaces</li>
                <li>• Immediate feedback systems</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 180
    },
    {
      id: 'executive-function-worksheets',
      type: 'practice',
      title: 'Executive Function Practice Worksheets',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Executive Function Skills Builder</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Comprehensive Practice Activities</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Planning & Organization</h4>
                <ul className="text-sm space-y-1">
                  <li>• Multi-step project planning templates</li>
                  <li>• Priority matrix exercises</li>
                  <li>• Time estimation challenges</li>
                  <li>• Resource allocation scenarios</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Working Memory</h4>
                <ul className="text-sm space-y-1">
                  <li>• Sequential instruction practice</li>
                  <li>• Mental manipulation exercises</li>
                  <li>• Information holding tasks</li>
                  <li>• Cognitive load management</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Cognitive Flexibility</h4>
                <ul className="text-sm space-y-1">
                  <li>• Perspective-taking scenarios</li>
                  <li>• Rule-switching games</li>
                  <li>• Problem-solving adaptations</li>
                  <li>• Creative thinking challenges</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Inhibitory Control</h4>
                <ul className="text-sm space-y-1">
                  <li>• Impulse management exercises</li>
                  <li>• Attention regulation tasks</li>
                  <li>• Response inhibition practice</li>
                  <li>• Self-monitoring activities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 300
    },
    {
      id: 'study-strategy-worksheets',
      type: 'practice',
      title: 'Advanced Study Strategy Worksheets',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Study Strategy Implementation</h2>
          <div className="space-y-4">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Note-Taking Mastery</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Cornell Method</h4>
                  <p className="text-xs text-muted-foreground">Structured format practice</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Mind Mapping</h4>
                  <p className="text-xs text-muted-foreground">Visual organization tools</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Digital Integration</h4>
                  <p className="text-xs text-muted-foreground">Technology-enhanced notes</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Memory Enhancement</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Mnemonic device creation worksheets</li>
                <li>• Spaced repetition scheduling templates</li>
                <li>• Multi-sensory encoding activities</li>
                <li>• Retrieval practice generators</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 270
    },
    {
      id: 'self-advocacy-worksheets',
      type: 'practice',
      title: 'Self-Advocacy Skills Development',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Self-Advocacy Practice</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Communication Scripts</h3>
              <div className="space-y-3">
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Teacher Conversations</h4>
                  <p className="text-xs text-muted-foreground">Requesting accommodations and support</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Peer Interactions</h4>
                  <p className="text-xs text-muted-foreground">Explaining learning differences</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Family Discussions</h4>
                  <p className="text-xs text-muted-foreground">Communicating needs at home</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Rights & Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Legal rights documentation</li>
                <li>• Resource identification guides</li>
                <li>• Support system mapping</li>
                <li>• Goal-setting frameworks</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 240
    },
    {
      id: 'attention-regulation-worksheets',
      type: 'practice',
      title: 'Attention Regulation Practice Activities',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Attention & Focus Mastery</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Multi-Modal Attention Training</h3>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Sustained Attention Exercises</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Progressive focusing challenges</li>
                  <li>• Distraction resistance training</li>
                  <li>• Mindfulness integration activities</li>
                  <li>• Endurance building protocols</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Selective Attention Tasks</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Visual filtering exercises</li>
                  <li>• Auditory discrimination tasks</li>
                  <li>• Relevant information identification</li>
                  <li>• Priority-setting activities</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Attention Switching Practice</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Task transition protocols</li>
                  <li>• Cognitive flexibility training</li>
                  <li>• Multi-tasking management</li>
                  <li>• Attention allocation strategies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 280
    },
    {
      id: 'sensory-processing-worksheets',
      type: 'practice',
      title: 'Sensory Processing & Regulation Activities',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Sensory Integration Worksheets</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Sensory Awareness</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Personal sensory profile mapping</li>
                <li>• Trigger identification exercises</li>
                <li>• Preference documentation tools</li>
                <li>• Threshold tracking activities</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Regulation Strategies</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Calming technique practice</li>
                <li>• Alerting activity selection</li>
                <li>• Organizing strategy implementation</li>
                <li>• Environmental modification plans</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Coping Tools</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Sensory break scheduling</li>
                <li>• Tool kit development</li>
                <li>• Crisis management protocols</li>
                <li>• Support communication cards</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 250
    },
    {
      id: 'time-management-worksheets',
      type: 'practice',
      title: 'Comprehensive Time Management Practice',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Time Management Mastery</h2>
          <div className="space-y-4">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Time Awareness Building</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Duration Estimation</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Activity timing exercises</li>
                    <li>• Real vs. estimated comparisons</li>
                    <li>• Calibration improvement tasks</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Schedule Planning</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Daily schedule templates</li>
                    <li>• Buffer time integration</li>
                    <li>• Priority-based scheduling</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Productivity Systems</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Pomodoro technique adaptation worksheets</li>
                <li>• Time-blocking practice templates</li>
                <li>• Energy management alignment tools</li>
                <li>• Procrastination intervention strategies</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 260
    },
    {
      id: 'problem-solving-worksheets',
      type: 'practice',
      title: 'Advanced Problem-Solving Frameworks',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Problem-Solving Methodology</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Systematic Approach Development</h3>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Problem Identification</h4>
                <ul className="text-sm space-y-1">
                  <li>• Root cause analysis templates</li>
                  <li>• Problem statement formulation</li>
                  <li>• Stakeholder impact assessment</li>
                  <li>• Constraint identification tools</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Solution Generation</h4>
                <ul className="text-sm space-y-1">
                  <li>• Brainstorming facilitation guides</li>
                  <li>• Creative thinking exercises</li>
                  <li>• Alternative perspective tools</li>
                  <li>• Innovation framework practice</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Solution Evaluation</h4>
                <ul className="text-sm space-y-1">
                  <li>• Decision matrix applications</li>
                  <li>• Cost-benefit analysis tools</li>
                  <li>• Risk assessment protocols</li>
                  <li>• Implementation planning guides</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 290
    },
    {
      id: 'social-skills-worksheets',
      type: 'practice',
      title: 'Social Skills & Communication Practice',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Social Communication Mastery</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Interpersonal Skills</h3>
              <div className="space-y-3">
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Active Listening</h4>
                  <p className="text-xs text-muted-foreground">Comprehension and response practice</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Nonverbal Communication</h4>
                  <p className="text-xs text-muted-foreground">Body language interpretation skills</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Conflict Resolution</h4>
                  <p className="text-xs text-muted-foreground">Mediation and negotiation techniques</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Group Dynamics</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Team collaboration exercises</li>
                <li>• Leadership skill development</li>
                <li>• Peer support strategies</li>
                <li>• Group project management</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 230
    },
    {
      id: 'emotional-regulation-worksheets',
      type: 'practice',
      title: 'Emotional Regulation & Self-Management',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Emotional Intelligence Development</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Comprehensive Emotional Toolkit</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Emotion Recognition</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Feeling identification charts</li>
                  <li>• Emotional intensity scales</li>
                  <li>• Trigger pattern mapping</li>
                  <li>• Physical sensation awareness</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Regulation Strategies</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Breathing technique guides</li>
                  <li>• Cognitive reframing exercises</li>
                  <li>• Grounding activity menus</li>
                  <li>• Self-soothing tool kits</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 220
    },
    {
      id: 'goal-setting-worksheets',
      type: 'practice',
      title: 'Strategic Goal Setting & Achievement',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Goal Mastery Framework</h2>
          <div className="space-y-4">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">SMART Goals Plus</h3>
              <div className="grid md:grid-cols-5 gap-2">
                <div className="text-center p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm text-accent">S</h4>
                  <p className="text-xs">Specific & Significant</p>
                </div>
                <div className="text-center p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm text-accent">M</h4>
                  <p className="text-xs">Measurable & Motivating</p>
                </div>
                <div className="text-center p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm text-accent">A</h4>
                  <p className="text-xs">Achievable & Aligned</p>
                </div>
                <div className="text-center p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm text-accent">R</h4>
                  <p className="text-xs">Relevant & Rewarding</p>
                </div>
                <div className="text-center p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm text-accent">T</h4>
                  <p className="text-xs">Time-bound & Trackable</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Implementation Planning</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Action step breakdown templates</li>
                <li>• Obstacle anticipation worksheets</li>
                <li>• Support system activation plans</li>
                <li>• Progress celebration protocols</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 240
    },
    {
      id: 'technology-integration-worksheets',
      type: 'practice',
      title: 'Educational Technology Integration',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Digital Learning Tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Assistive Technology</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Text-to-speech optimization guides</li>
                <li>• Voice recognition training exercises</li>
                <li>• Digital note-taking tutorials</li>
                <li>• Mind mapping software practice</li>
                <li>• Calendar and reminder system setup</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Productivity Apps</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Task management app tutorials</li>
                <li>• Focus timer application guides</li>
                <li>• Digital flashcard creation</li>
                <li>• Collaboration platform skills</li>
                <li>• Cloud storage organization</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 210
    },
    {
      id: 'real-world-application-worksheets',
      type: 'practice',
      title: 'Real-World Skills Application',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Practical Life Skills Integration</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Applied Learning Scenarios</h3>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Academic Applications</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Research project management</li>
                  <li>• Test preparation strategies</li>
                  <li>• Presentation skill development</li>
                  <li>• Group work optimization</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Workplace Preparation</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Professional communication practice</li>
                  <li>• Task prioritization scenarios</li>
                  <li>• Meeting participation skills</li>
                  <li>• Workplace accommodation requests</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Daily Living Skills</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Personal organization systems</li>
                  <li>• Financial planning basics</li>
                  <li>• Health and wellness routines</li>
                  <li>• Social relationship management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 260
    },
    {
      id: 'collaborative-worksheets',
      type: 'practice',
      title: 'Collaborative Learning Activities',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Peer Learning & Collaboration</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Group Project Templates</h3>
              <div className="space-y-3">
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Role Assignment</h4>
                  <p className="text-xs text-muted-foreground">Strength-based team roles</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Communication Protocols</h4>
                  <p className="text-xs text-muted-foreground">Effective team interaction</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <h4 className="font-semibold text-sm">Progress Tracking</h4>
                  <p className="text-xs text-muted-foreground">Shared accountability systems</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Peer Support Systems</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Study buddy matching protocols</li>
                <li>• Peer tutoring frameworks</li>
                <li>• Mutual mentorship programs</li>
                <li>• Collaborative problem-solving guides</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 200
    },
    {
      id: 'creativity-innovation-worksheets',
      type: 'practice',
      title: 'Creativity & Innovation Development',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Creative Thinking Enhancement</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Innovation Framework Practice</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Divergent Thinking</h4>
                <ul className="text-sm space-y-1">
                  <li>• Brainstorming techniques</li>
                  <li>• Alternative use exercises</li>
                  <li>• What-if scenarios</li>
                  <li>• Creative combination tasks</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Convergent Thinking</h4>
                <ul className="text-sm space-y-1">
                  <li>• Solution refinement tools</li>
                  <li>• Evaluation criteria development</li>
                  <li>• Decision-making matrices</li>
                  <li>• Implementation planning</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Innovation Application</h4>
                <ul className="text-sm space-y-1">
                  <li>• Problem redefinition exercises</li>
                  <li>• Design thinking protocols</li>
                  <li>• Prototype development guides</li>
                  <li>• Feedback integration systems</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 250
    },
    {
      id: 'mindfulness-wellness-worksheets',
      type: 'practice',
      title: 'Mindfulness & Wellness Integration',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Holistic Wellness Practice</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Mindfulness Practices</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Breathing awareness exercises</li>
                <li>• Body scan meditation guides</li>
                <li>• Mindful movement activities</li>
                <li>• Present moment anchoring tools</li>
                <li>• Gratitude practice templates</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibent mb-4 text-accent">Stress Management</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Stress identification worksheets</li>
                <li>• Coping strategy menus</li>
                <li>• Relaxation technique guides</li>
                <li>• Energy management protocols</li>
                <li>• Self-care planning tools</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 190
    },
    {
      id: 'assessment-reflection-worksheets',
      type: 'practice',
      title: 'Self-Assessment & Reflection Tools',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Metacognitive Development</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Comprehensive Self-Assessment</h3>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Learning Style Assessment</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Multi-modal preference identification</li>
                  <li>• Strategy effectiveness evaluation</li>
                  <li>• Environmental optimization planning</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Progress Reflection</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Achievement documentation templates</li>
                  <li>• Challenge analysis frameworks</li>
                  <li>• Growth mindset development tools</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Future Planning</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Goal refinement exercises</li>
                  <li>• Strategy adaptation planning</li>
                  <li>• Support system enhancement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 230
    },
    {
      id: 'parent-family-worksheets',
      type: 'practice',
      title: 'Family Engagement & Support Worksheets',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Family Partnership Tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Home Implementation</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Strategy transfer protocols</li>
                <li>• Home environment optimization</li>
                <li>• Family routine integration</li>
                <li>• Sibling support strategies</li>
                <li>• Extended family education tools</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-accent">Communication Tools</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• School-home communication logs</li>
                <li>• Progress sharing templates</li>
                <li>• Concern documentation forms</li>
                <li>• Celebration planning guides</li>
                <li>• Advocacy preparation worksheets</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 180
    },
    {
      id: 'transition-planning-worksheets',
      type: 'practice',
      title: 'Transition Planning & Life Skills',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Life Transition Preparation</h2>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Comprehensive Transition Framework</h3>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Academic Transitions</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Grade level preparation checklists</li>
                  <li>• School change adaptation guides</li>
                  <li>• Course selection decision trees</li>
                  <li>• Study habit evolution planning</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Career Preparation</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Interest and aptitude assessments</li>
                  <li>• Workplace skill development</li>
                  <li>• Professional portfolio creation</li>
                  <li>• Interview preparation protocols</li>
                </ul>
              </div>
              <div className="p-4 bg-background rounded border">
                <h4 className="font-semibold mb-2">Independent Living</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Daily living skill assessments</li>
                  <li>• Financial literacy development</li>
                  <li>• Health management protocols</li>
                  <li>• Social relationship building</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 270
    },
    {
      id: 'worksheet-mastery-summary',
      type: 'summary',
      title: 'Interactive Worksheet Mastery Complete',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Worksheet Excellence Achieved</h2>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg border">
            <h3 className="text-2xl font-semibold mb-4 text-center">🎯 Comprehensive Skills Development Complete</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-card rounded-lg">
                <h4 className="font-semibold text-accent mb-2">Executive Function</h4>
                <p className="text-sm text-muted-foreground">Advanced practice activities</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <h4 className="font-semibold text-accent mb-2">Study Strategies</h4>
                <p className="text-sm text-muted-foreground">Comprehensive skill building</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <h4 className="font-semibold text-accent mb-2">Real-World Application</h4>
                <p className="text-sm text-muted-foreground">Practical life skills integration</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <h4 className="font-semibold text-accent mb-2">Holistic Wellness</h4>
                <p className="text-sm text-muted-foreground">Complete personal development</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold text-primary">You have mastered comprehensive interactive worksheet development!</p>
              <p className="text-muted-foreground mt-2">Ready to implement hands-on, engaging activities that support every aspect of neurodiverse learning.</p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 120
    }
  ]
};