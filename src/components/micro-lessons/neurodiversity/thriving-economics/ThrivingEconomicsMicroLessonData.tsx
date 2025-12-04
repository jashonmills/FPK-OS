import React from 'react';
import { TrendingUp, Brain, Target, Lightbulb, CheckCircle, Users, BarChart, PieChart } from 'lucide-react';
import { MicroLessonData } from '../../MicroLessonContainer';

export const thrivingEconomicsMicroLessons: MicroLessonData = {
  id: 'thriving-in-economics',
  moduleTitle: 'Thriving in Economics',
  totalScreens: 8,
  screens: [
    {
      id: 'intro',
      type: 'concept',
      title: 'Your Economic Superpowers',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <TrendingUp className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-3xl font-bold">Thriving in Economics</h2>
            <p className="text-lg text-muted-foreground">
              Apply your pattern recognition skills to economic concepts
            </p>
          </div>
          <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
            <p className="text-center">
              Economics is all about patterns, systems, and logical connections—exactly the kind of thinking 
              where neurodiverse minds excel! Let's discover how your brain's unique wiring gives you 
              advantages in understanding economic principles.
            </p>
          </div>
        </div>
      ),
      estimatedTime: 1
    },
    {
      id: 'pattern-recognition',
      type: 'concept',
      title: 'Pattern Recognition in Economics',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Your Natural Economic Advantage
          </h3>
          
          <div className="space-y-4">
            <p>
              Many neurodiverse individuals excel at pattern recognition—a core skill in economic analysis. 
              Economics is fundamentally about identifying patterns in human behavior, market trends, and resource allocation.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-green-600 dark:text-green-400">Economic Patterns You Might Excel At</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Supply and demand relationships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Market cycle predictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Price elasticity trends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Consumer behavior patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Economic indicator correlations</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">Real-World Example</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Pattern:</strong> Gas prices rise → People buy smaller cars</p>
                  <p><strong>Economic Principle:</strong> Substitute goods and income effect</p>
                  <p><strong>Your Advantage:</strong> You might naturally spot these cause-and-effect relationships that others miss!</p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>ADHD Hyperfocus Advantage:</strong> When economics interests you, your ability to hyperfocus 
                can lead to deep insights that neurotypical students might miss in surface-level studying.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'systematic-thinking',
      type: 'concept',
      title: 'Systematic Economic Thinking',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Breaking Down Complex Systems
          </h3>
          
          <div className="space-y-4">
            <p>
              Autistic minds often excel at systematic thinking—perfect for understanding how economic systems work. 
              Let's explore how to use this strength in your economics studies.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <BarChart className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Microeconomics</h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Individual decision making</li>
                  <li>• Market structures</li>
                  <li>• Price mechanisms</li>
                  <li>• Consumer theory</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <PieChart className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Macroeconomics</h4>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  <li>• National economies</li>
                  <li>• Fiscal policy</li>
                  <li>• Monetary systems</li>
                  <li>• International trade</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Econometrics</h4>
                <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                  <li>• Statistical analysis</li>
                  <li>• Data interpretation</li>
                  <li>• Model building</li>
                  <li>• Forecasting</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Your Systematic Approach</h4>
              <ol className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                  <span>Identify the economic system or model</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                  <span>Break it down into component parts</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                  <span>Map relationships between parts</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                  <span>Predict how changes affect the whole system</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'data-visualization',
      type: 'example',
      title: 'Making Sense of Economic Data',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <BarChart className="w-5 h-5 text-primary" />
            Visual Learning in Economics
          </h3>
          
          <div className="space-y-4">
            <p>
              Many neurodiverse learners are visual processors. Economics offers rich opportunities 
              to use graphs, charts, and visual models to understand complex concepts.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Essential Economic Visualizations</h4>
                <div className="space-y-2">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm mb-1">Supply & Demand Curves</h5>
                    <p className="text-xs text-muted-foreground">
                      Visual representation of market equilibrium
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm mb-1">Production Possibility Frontiers</h5>
                    <p className="text-xs text-muted-foreground">
                      Shows trade-offs in resource allocation
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm mb-1">Circular Flow Diagrams</h5>
                    <p className="text-xs text-muted-foreground">
                      Maps how money flows through the economy
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Data Analysis Tools</h4>
                <div className="space-y-2">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm mb-1">Time Series Charts</h5>
                    <p className="text-xs text-muted-foreground">
                      Track economic indicators over time
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm mb-1">Scatter Plots</h5>
                    <p className="text-xs text-muted-foreground">
                      Show correlations between variables
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm mb-1">Heat Maps</h5>
                    <p className="text-xs text-muted-foreground">
                      Visualize complex multi-variable relationships
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">Pro Tip: Create Your Own Visuals</h4>
              <p className="text-sm">
                Don't just study existing graphs—create your own! Use tools like Excel, Google Sheets, 
                or even hand-drawn diagrams to visualize economic concepts in ways that make sense to your brain.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 3
    },
    {
      id: 'mathematical-models',
      type: 'concept',
      title: 'Economic Models and Equations',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Mathematical Beauty in Economics
          </h3>
          
          <div className="space-y-4">
            <p>
              Economics uses mathematical models to explain and predict behavior. 
              For many neurodiverse learners, these logical, rule-based systems can be incredibly satisfying to master.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Fundamental Equations</h4>
                <div className="bg-card p-4 rounded border space-y-3">
                  <div>
                    <h5 className="font-medium text-sm">Price Elasticity of Demand</h5>
                    <div className="bg-muted/50 p-2 rounded mt-1 font-mono text-xs">
                      PED = (% Change in Quantity) / (% Change in Price)
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Consumer Surplus</h5>
                    <div className="bg-muted/50 p-2 rounded mt-1 font-mono text-xs">
                      CS = 0.5 × (Max Price - Market Price) × Quantity
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">GDP Formula</h5>
                    <div className="bg-muted/50 p-2 rounded mt-1 font-mono text-xs">
                      GDP = C + I + G + (X - M)
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Why Math Helps Your Brain</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Clear, unambiguous rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Logical step-by-step processes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Predictable outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Precise calculations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Objective verification methods</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Strategy: Formula Flashcards</h4>
              <p className="text-sm text-muted-foreground">
                Create flashcards with the formula on one side and a real-world application on the other. 
                This helps connect abstract math to concrete economic scenarios—perfect for systematic thinkers!
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 4
    },
    {
      id: 'real-world-applications',
      type: 'practice',
      title: 'Economics in Everyday Life',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Connecting Theory to Reality
          </h3>
          
          <div className="space-y-4">
            <p>
              One advantage of neurodiverse thinking is the ability to see connections others miss. 
              Let's practice applying economic principles to situations you encounter every day.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400">Scenario Analysis Practice</h4>
                <div className="space-y-2">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                    <h5 className="font-medium text-sm mb-1">Coffee Shop Economics</h5>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Why does Starbucks charge $5 for coffee when gas stations charge $1? 
                      (Hint: Think about location, brand value, and consumer willingness to pay)
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                    <h5 className="font-medium text-sm mb-1">Streaming Services</h5>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      How do Netflix, Disney+, and Hulu compete? What economic principles 
                      explain their different pricing strategies?
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded border border-purple-200 dark:border-purple-800">
                    <h5 className="font-medium text-sm mb-1">Housing Markets</h5>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      Why are housing prices different in different cities? 
                      What factors create these price variations?
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400">Personal Economics</h4>
                <div className="space-y-2">
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded border border-orange-200 dark:border-orange-800">
                    <h5 className="font-medium text-sm mb-1">Opportunity Cost</h5>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      When you choose to study economics instead of watching TV, 
                      what's your opportunity cost?
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                    <h5 className="font-medium text-sm mb-1">Budget Constraints</h5>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      How do you decide how to spend your monthly budget? 
                      What economic principles guide your choices?
                    </p>
                  </div>
                  <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded border border-teal-200 dark:border-teal-800">
                    <h5 className="font-medium text-sm mb-1">Investment Decisions</h5>
                    <p className="text-xs text-teal-700 dark:text-teal-300">
                      Should you save money or invest it? How do interest rates 
                      and risk tolerance factor into this decision?
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">Practice Exercise</h4>
              <p className="text-sm mb-2">
                Choose one scenario above and analyze it using at least three economic concepts you've learned. 
                Write a brief explanation connecting theory to practice.
              </p>
              <p className="text-xs text-muted-foreground">
                This kind of analysis strengthens your understanding and shows how economics applies everywhere!
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'study-strategies',
      type: 'practice',
      title: 'Effective Economics Study Methods',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Tailored Study Strategies for Your Brain
          </h3>
          
          <div className="space-y-4">
            <p>
              Different brains learn differently. Here are evidence-based study strategies 
              that work particularly well for neurodiverse economics students.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">For Detail-Oriented Minds</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Create comprehensive glossaries of economic terms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Build detailed mind maps showing concept relationships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Practice problems with step-by-step solutions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Organize notes by economic models and theories</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">For Hyperfocus Advantages</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Deep-dive study sessions on specific topics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Research current economic events and trends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Explore economic data and create your own analyses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Follow economic podcasts and expert discussions</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Weekly Study Schedule Template</h4>
              <div className="grid grid-cols-7 gap-2 text-xs">
                <div className="font-medium text-center">Mon</div>
                <div className="font-medium text-center">Tue</div>
                <div className="font-medium text-center">Wed</div>
                <div className="font-medium text-center">Thu</div>
                <div className="font-medium text-center">Fri</div>
                <div className="font-medium text-center">Sat</div>
                <div className="font-medium text-center">Sun</div>
                
                <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded text-center">Theory</div>
                <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded text-center">Practice</div>
                <div className="bg-purple-100 dark:bg-purple-900/30 p-1 rounded text-center">Review</div>
                <div className="bg-orange-100 dark:bg-orange-900/30 p-1 rounded text-center">Apply</div>
                <div className="bg-red-100 dark:bg-red-900/30 p-1 rounded text-center">Test</div>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-1 rounded text-center">Current Events</div>
                <div className="bg-gray-100 dark:bg-gray-900/30 p-1 rounded text-center">Rest/Reflect</div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Remember:</strong> Adjust these strategies based on what works for your specific brain. 
                The goal is to leverage your strengths while building skills in areas that challenge you.
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
      title: 'Your Economic Learning Journey',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Celebrating Your Economic Strengths
          </h3>
          
          <div className="space-y-4">
            <p>
              You've explored how your neurodiverse brain can excel in economics. 
              Let's consolidate your learning and plan your path forward.
            </p>
            
            <div className="bg-card p-6 rounded-lg border space-y-4">
              <h4 className="font-semibold">Reflection Questions:</h4>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">1. Your Economic Superpowers</p>
                  <p className="text-xs text-muted-foreground">
                    Which economic skills align best with your natural strengths? 
                    Pattern recognition? Systematic thinking? Mathematical modeling? Visual analysis?
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">2. Real-World Connections</p>
                  <p className="text-xs text-muted-foreground">
                    What economic principles do you notice in your daily life? 
                    How can you use these observations to deepen your understanding?
                  </p>
                </div>
                
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">3. Study Strategy Customization</p>
                  <p className="text-xs text-muted-foreground">
                    Which study methods resonate with you? How will you adapt them to your learning style? 
                    What tools will you use to track your progress?
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <strong>You're equipped for economic success!</strong> Your unique way of processing information, 
                recognizing patterns, and thinking systematically are exactly the skills that make great economists. 
                Trust your brain's abilities and keep building on your strengths!
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    }
  ]
};