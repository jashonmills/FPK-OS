import React from 'react';
import { Brain, Target, Lightbulb, CheckCircle, Users, Zap, AlertCircle, ShieldCheck } from 'lucide-react';
import { MicroLessonData } from '../../MicroLessonContainer';

export const logicCriticalThinkingMicroLessons: MicroLessonData = {
  id: 'excelling-logic-critical-thinking',
  moduleTitle: 'Excelling in Logic & Critical Thinking',
  totalScreens: 8,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Your Logical Advantage',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <Brain className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-3xl font-bold">Excelling in Logic & Critical Thinking</h2>
            <p className="text-lg text-muted-foreground">
              Leverage your systematic thinking for logical reasoning
            </p>
          </div>
          <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
            <p className="text-center">
              Logic and critical thinking are natural strengths for many neurodiverse minds. 
              Your systematic approach to processing information, attention to detail, 
              and ability to spot patterns give you powerful advantages in logical reasoning!
            </p>
          </div>
        </div>
      ),
      estimatedTime: 1
    },
    {
      id: 'logical-structures',
      type: 'concept',
      title: 'Understanding Logical Structures',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            The Architecture of Logic
          </h3>
          
          <div className="space-y-4">
            <p>
              Logic follows clear, systematic rules—exactly the kind of structured thinking 
              where neurodiverse minds often excel. Let's explore the fundamental building blocks.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400">Deductive Reasoning</h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                    <strong>Structure:</strong> General principle → Specific conclusion
                  </p>
                  <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <p><strong>Premise 1:</strong> All humans are mortal</p>
                    <p><strong>Premise 2:</strong> Socrates is human</p>
                    <p><strong>Conclusion:</strong> Therefore, Socrates is mortal</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-green-600 dark:text-green-400">Inductive Reasoning</h4>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                    <strong>Structure:</strong> Specific observations → General pattern
                  </p>
                  <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
                    <p><strong>Observation 1:</strong> Swan 1 is white</p>
                    <p><strong>Observation 2:</strong> Swan 2 is white</p>
                    <p><strong>Pattern:</strong> All swans are white (probably)</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Your Systematic Advantage</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You naturally follow step-by-step logical progressions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You're excellent at spotting inconsistencies in arguments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You can track complex logical relationships</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You prefer evidence-based conclusions over assumptions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'fallacy-detection',
      type: 'example',
      title: 'Spotting Logical Fallacies',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Your Pattern Recognition Superpower
          </h3>
          
          <div className="space-y-4">
            <p>
              Neurodiverse minds often excel at pattern recognition, making you particularly 
              good at spotting logical fallacies—errors in reasoning that undermine arguments.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-red-600 dark:text-red-400">Common Fallacies to Spot</h4>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                  <h5 className="font-medium text-sm text-red-800 dark:text-red-200">Ad Hominem</h5>
                  <p className="text-xs text-red-700 dark:text-red-300 mb-1">
                    Attacking the person instead of their argument
                  </p>
                  <p className="text-xs italic text-red-600 dark:text-red-400">
                    "You can't trust John's economic theory because he's young."
                  </p>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded border border-orange-200 dark:border-orange-800">
                  <h5 className="font-medium text-sm text-orange-800 dark:text-orange-200">False Dilemma</h5>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mb-1">
                    Presenting only two options when more exist
                  </p>
                  <p className="text-xs italic text-orange-600 dark:text-orange-400">
                    "You either support free markets or you're a socialist."
                  </p>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                  <h5 className="font-medium text-sm text-yellow-800 dark:text-yellow-200">Slippery Slope</h5>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-1">
                    Claiming one event will lead to extreme consequences
                  </p>
                  <p className="text-xs italic text-yellow-600 dark:text-yellow-400">
                    "If we raise minimum wage, all businesses will close."
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600 dark:text-green-400">Detection Strategies</h4>
                
                <div className="bg-card p-3 rounded border space-y-2">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Question Everything</p>
                      <p className="text-xs text-muted-foreground">
                        Ask: "Does this conclusion actually follow from the evidence?"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Look for Missing Steps</p>
                      <p className="text-xs text-muted-foreground">
                        Identify gaps in logical progression
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Check the Source</p>
                      <p className="text-xs text-muted-foreground">
                        Evaluate credibility and potential bias
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">Practice Exercise</h4>
              <p className="text-sm">
                Read news articles or opinion pieces and try to identify any logical fallacies. 
                This skill will serve you well in academic work and everyday decision-making!
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'evidence-evaluation',
      type: 'concept',
      title: 'Evaluating Evidence and Sources',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Critical Source Analysis
          </h3>
          
          <div className="space-y-4">
            <p>
              Your attention to detail and systematic thinking make you excellent at evaluating 
              the quality and reliability of evidence. This is a crucial critical thinking skill.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Evidence Quality Checklist</h4>
                <div className="bg-card p-4 rounded border space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Is the source credible and authoritative?</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Is the information recent and relevant?</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Is the methodology sound?</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Are there potential conflicts of interest?</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Can the findings be replicated?</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Do multiple sources confirm this?</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Source Hierarchy</h4>
                <div className="space-y-2">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                    <h5 className="font-medium text-sm text-green-800 dark:text-green-200">Tier 1: Strongest</h5>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Peer-reviewed studies, systematic reviews, meta-analyses
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                    <h5 className="font-medium text-sm text-blue-800 dark:text-blue-200">Tier 2: Good</h5>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Government reports, academic books, expert interviews
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                    <h5 className="font-medium text-sm text-yellow-800 dark:text-yellow-200">Tier 3: Okay</h5>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      News articles, documentaries, professional organizations
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                    <h5 className="font-medium text-sm text-red-800 dark:text-red-200">Tier 4: Weak</h5>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      Blogs, social media, opinion pieces, anecdotes
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">Your Detail-Oriented Advantage</h4>
              <p className="text-sm">
                Your natural attention to detail helps you notice things others miss: 
                sample sizes, methodology flaws, missing data, and subtle biases. 
                This makes you an excellent critical evaluator of evidence!
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'argument-construction',
      type: 'practice',
      title: 'Building Strong Arguments',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Constructing Logical Arguments
          </h3>
          
          <div className="space-y-4">
            <p>
              Your systematic thinking is perfect for building well-structured arguments. 
              Let's practice the step-by-step process of creating compelling, logical arguments.
            </p>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">The Argument Structure Template</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-medium text-sm">Claim (Thesis)</p>
                    <p className="text-xs text-muted-foreground">Your main argument or position</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="font-medium text-sm">Evidence</p>
                    <p className="text-xs text-muted-foreground">Facts, data, research, examples</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="font-medium text-sm">Warrant (Reasoning)</p>
                    <p className="text-xs text-muted-foreground">Why the evidence supports the claim</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                  <div>
                    <p className="font-medium text-sm">Counterarguments</p>
                    <p className="text-xs text-muted-foreground">Address opposing views</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                  <div>
                    <p className="font-medium text-sm">Rebuttal</p>
                    <p className="text-xs text-muted-foreground">Respond to counterarguments</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Example Argument</h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Claim: "Remote learning benefits neurodiverse students"
                  </p>
                  <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <p><strong>Evidence:</strong> Study shows 73% improvement in focus</p>
                    <p><strong>Warrant:</strong> Reduced sensory distractions improve concentration</p>
                    <p><strong>Counter:</strong> "Less social interaction"</p>
                    <p><strong>Rebuttal:</strong> Quality &gt; quantity of social interactions</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Your Practice Space</h4>
                <div className="bg-muted/20 p-3 rounded border space-y-2">
                  <p className="text-xs text-muted-foreground mb-1">Choose a topic and build your argument:</p>
                  <div className="space-y-1">
                    <input placeholder="Your claim..." className="w-full text-xs p-2 rounded border" />
                    <input placeholder="Your evidence..." className="w-full text-xs p-2 rounded border" />
                    <input placeholder="Your reasoning..." className="w-full text-xs p-2 rounded border" />
                    <input placeholder="Counter-argument..." className="w-full text-xs p-2 rounded border" />
                    <input placeholder="Your rebuttal..." className="w-full text-xs p-2 rounded border" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Systematic Advantage:</strong> Your natural tendency to think step-by-step 
                and consider multiple perspectives makes you excellent at building comprehensive, 
                well-reasoned arguments that address potential objections.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'problem-solving',
      type: 'practice',
      title: 'Systematic Problem Solving',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Your Problem-Solving Framework
          </h3>
          
          <div className="space-y-4">
            <p>
              Neurodiverse minds often excel at systematic problem-solving. 
              Let's harness your natural strengths with a structured approach that plays to your advantages.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">The IDEAL Method</h4>
                <div className="space-y-2">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">I</span>
                      Identify the Problem
                    </h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      What exactly needs to be solved? Define it clearly and specifically.
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm flex items-center gap-2">
                      <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">D</span>
                      Define Goals
                    </h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      What would a successful solution look like?
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm flex items-center gap-2">
                      <span className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">E</span>
                      Explore Strategies
                    </h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Brainstorm multiple approaches. Don't settle for the first idea.
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm flex items-center gap-2">
                      <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">A</span>
                      Act on Plan
                    </h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Implement your chosen strategy systematically.
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm flex items-center gap-2">
                      <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">L</span>
                      Look Back & Evaluate
                    </h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Did it work? What would you do differently next time?
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Problem-Solving Advantages</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>You naturally break complex problems into parts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>You're persistent and don't give up easily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>You notice details others might miss</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>You can think outside conventional approaches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>You prefer evidence-based solutions</span>
                  </li>
                </ul>
                
                <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 mt-4">
                  <h5 className="font-medium text-sm mb-1">Try This Exercise</h5>
                  <p className="text-xs">
                    Think of a current challenge in your life or studies. 
                    Apply the IDEAL method step by step. 
                    Notice how this systematic approach feels natural to your thinking style!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'application-strategies',
      type: 'concept',
      title: 'Applying Critical Thinking Skills',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Real-World Critical Thinking
          </h3>
          
          <div className="space-y-4">
            <p>
              Let's explore how to apply your critical thinking strengths across different areas 
              of academics and life. Your systematic approach is valuable everywhere!
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Academic Essays</h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Evaluate source credibility</li>
                  <li>• Construct logical arguments</li>
                  <li>• Address counterpoints</li>
                  <li>• Support claims with evidence</li>
                  <li>• Draw sound conclusions</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Research Projects</h4>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  <li>• Design research questions</li>
                  <li>• Analyze methodology</li>
                  <li>• Interpret data objectively</li>
                  <li>• Identify limitations</li>
                  <li>• Synthesize findings</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Daily Decisions</h4>
                <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                  <li>• Evaluate news critically</li>
                  <li>• Make informed purchases</li>
                  <li>• Assess risk vs. benefit</li>
                  <li>• Solve relationship conflicts</li>
                  <li>• Plan future goals</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Critical Thinking Toolkit</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-2">Questions to Always Ask:</h5>
                  <ul className="text-xs space-y-1">
                    <li>• What evidence supports this claim?</li>
                    <li>• What are the underlying assumptions?</li>
                    <li>• Are there alternative explanations?</li>
                    <li>• What are the implications?</li>
                    <li>• How reliable is this source?</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-2">Red Flags to Watch For:</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Emotional appeals over logic</li>
                    <li>• Vague or undefined terms</li>
                    <li>• Cherry-picked evidence</li>
                    <li>• Hasty generalizations</li>
                    <li>• Correlation claimed as causation</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Your Superpower:</strong> Your systematic, detail-oriented thinking combined with 
                pattern recognition makes you naturally excellent at critical thinking. 
                Trust your analytical instincts—they're often more accurate than you realize!
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'reflection',
      type: 'summary',
      title: 'Mastering Logic & Critical Thinking',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Your Logical Thinking Journey
          </h3>
          
          <div className="space-y-4">
            <p>
              You've explored how your neurodiverse mind excels at logic and critical thinking. 
              Let's consolidate your strengths and plan how to use them effectively.
            </p>
            
            <div className="bg-card p-6 rounded-lg border space-y-4">
              <h4 className="font-semibold">Reflection Questions:</h4>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">1. Your Logical Strengths</p>
                  <p className="text-xs text-muted-foreground">
                    Which aspects of logical thinking come most naturally to you? 
                    Pattern recognition? Systematic analysis? Fallacy detection? Evidence evaluation?
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">2. Problem-Solving Applications</p>
                  <p className="text-xs text-muted-foreground">
                    How can you apply the IDEAL method to current challenges in your life? 
                    What problems could benefit from your systematic approach?
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">3. Critical Thinking Goals</p>
                  <p className="text-xs text-muted-foreground">
                    In which areas of your studies or life do you want to apply critical thinking more? 
                    How will you practice and develop these skills further?
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <strong>You're a natural logical thinker!</strong> Your systematic approach, attention to detail, 
                and pattern recognition abilities give you significant advantages in logic and critical thinking. 
                Use these strengths confidently in your academic work and daily life!
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    }
  ]
};