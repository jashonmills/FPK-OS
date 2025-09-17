import React from 'react';
import { MicroLessonData } from '../../MicroLessonContainer';

export const advancedStudyTechniquesMicroLessons: MicroLessonData = {
  id: 'advanced-study-techniques',
  moduleTitle: 'Advanced Study & Information Retention',
  totalScreens: 20,
  screens: [
    {
      id: 'active-learning-intro',
      type: 'concept',
      title: 'From Passive to Active Learning',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-6 rounded-lg border border-blue-500/20">
            <h3 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">The Active Learning Revolution</h3>
            <p className="text-muted-foreground mb-4">
              Passive learning methods like re-reading and highlighting are often ineffective for long-term retention. 
              Active learning strategies require meaningful engagement, leading to deeper understanding and better recall.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3">❌ Passive Learning</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span>Re-reading notes multiple times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span>Highlighting without purpose</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span>Listening to lectures without engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span>Copying information verbatim</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">✅ Active Learning</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Testing yourself without looking at answers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Creating concept maps and summaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Teaching concepts to others</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Asking questions and making connections</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-background/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🧠 Why Active Learning Works</h4>
              <p className="text-sm text-muted-foreground">
                Active learning engages multiple cognitive processes, creates stronger neural pathways, 
                and forces your brain to work harder to process and retrieve information. This leads to 
                better understanding, longer retention, and improved ability to apply knowledge.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'active-recall-deep-dive',
      type: 'practice',
      title: 'Active Recall: The Power of Testing',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-lg border border-purple-500/20">
            <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">The Testing Effect</h3>
            <p className="text-muted-foreground mb-4">
              Active recall, also known as the testing effect, is one of the most powerful learning strategies. 
              By forcing yourself to retrieve information from memory, you strengthen neural pathways and 
              improve long-term retention.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">🎯 Active Recall Methods</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h5 className="font-medium text-purple-600 mb-1">Flashcards (Digital or Physical)</h5>
                    <p className="text-xs text-muted-foreground">Question on front, answer on back. Use spaced repetition.</p>
                  </div>
                  <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <h5 className="font-medium text-pink-600 mb-1">Blank Paper Method</h5>
                    <p className="text-xs text-muted-foreground">Close books, write everything you remember about a topic.</p>
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <h5 className="font-medium text-indigo-600 mb-1">Feynman Technique</h5>
                    <p className="text-xs text-muted-foreground">Explain concepts in simple terms as if teaching a child.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="font-medium text-blue-600 mb-1">Practice Problems</h5>
                    <p className="text-xs text-muted-foreground">Solve problems without looking at solutions first.</p>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <h5 className="font-medium text-teal-600 mb-1">Question Generation</h5>
                    <p className="text-xs text-muted-foreground">Create your own test questions from material.</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h5 className="font-medium text-green-600 mb-1">Verbal Rehearsal</h5>
                    <p className="text-xs text-muted-foreground">Speak key concepts aloud without notes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">📚 Active Recall Study Session</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span className="text-sm">Read/study material for 25 minutes</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span className="text-sm">Close books, write what you remember (10 minutes)</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-sm">Check against source, note gaps and errors</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <span className="text-sm">Re-study gaps, then test again</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 7
    },
    {
      id: 'spaced-repetition',
      type: 'concept',
      title: 'Spaced Repetition: Timing Your Reviews',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 rounded-lg border border-green-500/20">
            <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">The Forgetting Curve & Optimal Timing</h3>
            <p className="text-muted-foreground mb-4">
              Spaced repetition leverages how our brains naturally forget and remember information. 
              By reviewing material at increasing intervals, we strengthen memory traces and achieve 
              long-term retention with minimal effort.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">📈 The Forgetting Curve</h4>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-3">
                <p className="text-sm text-center text-red-700 dark:text-red-300 font-medium">
                  Without review: 50% forgotten after 1 hour, 70% after 24 hours, 90% after 1 week
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-center text-green-700 dark:text-green-300 font-medium">
                  With spaced repetition: 90% retention even after months
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-blue-600">⏰ Optimal Review Schedule</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span className="text-sm font-medium">Initial Learning</span>
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Day 0</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span className="text-sm font-medium">First Review</span>
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Day 1</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span className="text-sm font-medium">Second Review</span>
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Day 3</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span className="text-sm font-medium">Third Review</span>
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Day 7</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span className="text-sm font-medium">Fourth Review</span>
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Day 21</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-purple-600">📱 Digital Tools</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <h5 className="font-medium text-sm">Anki</h5>
                    <p className="text-xs text-muted-foreground">Advanced spaced repetition with customization</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <h5 className="font-medium text-sm">Quizlet</h5>
                    <p className="text-xs text-muted-foreground">User-friendly with pre-made decks</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <h5 className="font-medium text-sm">RemNote</h5>
                    <p className="text-xs text-muted-foreground">Note-taking with built-in spaced repetition</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <h5 className="font-medium text-sm">SuperMemo</h5>
                    <p className="text-xs text-muted-foreground">Original spaced repetition algorithm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'elaborative-interrogation',
      type: 'practice',
      title: 'Elaborative Interrogation: The Power of "Why?"',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 rounded-lg border border-orange-500/20">
            <h3 className="text-xl font-semibold mb-4 text-orange-700 dark:text-orange-300">Deep Understanding Through Questioning</h3>
            <p className="text-muted-foreground mb-4">
              Elaborative interrogation involves asking "why" and "how" questions about material you're learning. 
              This creates deeper understanding by connecting new information to existing knowledge and 
              building rich mental models.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">🤔 Question Types</h4>
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h5 className="font-medium text-orange-600 mb-2">Why Questions</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Why does this concept work this way?</li>
                    <li>• Why is this fact true?</li>
                    <li>• Why is this important to understand?</li>
                    <li>• Why might this be different from what I expected?</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h5 className="font-medium text-red-600 mb-2">How Questions</h5>
                  <ul className="text-sm space-y-1">
                    <li>• How does this connect to what I already know?</li>
                    <li>• How can I apply this in different situations?</li>
                    <li>• How does this relate to other concepts?</li>
                    <li>• How would I explain this to someone else?</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h5 className="font-medium text-yellow-600 mb-2">Connection Questions</h5>
                  <ul className="text-sm space-y-1">
                    <li>• What does this remind me of?</li>
                    <li>• What are the implications of this?</li>
                    <li>• What would happen if this were different?</li>
                    <li>• What patterns do I notice?</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">📖 Example: Studying Photosynthesis</h4>
              <div className="space-y-2">
                <p className="text-sm"><strong>Fact:</strong> Plants convert sunlight into energy through photosynthesis.</p>
                <div className="ml-4 space-y-1">
                  <p className="text-sm text-green-600"><strong>Why:</strong> Why do plants need to convert sunlight? (Energy for growth and survival)</p>
                  <p className="text-sm text-blue-600"><strong>How:</strong> How is this similar to how I get energy from food?</p>
                  <p className="text-sm text-purple-600"><strong>Connection:</strong> What would happen to the ecosystem without photosynthesis?</p>
                  <p className="text-sm text-orange-600"><strong>Application:</strong> How does this explain why plants grow toward light?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'multimodal-learning',
      type: 'concept',
      title: 'Multi-Modal Learning for Neurodiverse Minds',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-lg border border-indigo-500/20">
            <h3 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">Engaging Multiple Senses</h3>
            <p className="text-muted-foreground mb-4">
              Neurodiverse learners often benefit greatly from engaging multiple senses. Combining visual, 
              auditory, and kinesthetic approaches creates stronger memory traces and accommodates different 
              processing strengths and preferences.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">👁️</span>
                  <span className="text-indigo-600">Visual Learning</span>
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                    <span>Mind maps and concept diagrams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                    <span>Color-coded organization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                    <span>Infographics and charts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                    <span>Video content and animations</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎧</span>
                  <span className="text-purple-600">Auditory Learning</span>
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                    <span>Podcasts and audio lectures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                    <span>Text-to-speech software</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                    <span>Discussion and verbal rehearsal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                    <span>Music and mnemonics</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">✋</span>
                  <span className="text-green-600">Kinesthetic Learning</span>
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Hands-on experiments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Physical models and manipulatives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Movement while studying</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Writing and drawing by hand</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">🎯 Multi-Modal Study Example: Learning History</h4>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <h5 className="font-medium text-indigo-600 mb-1">Visual</h5>
                  <p className="text-xs">Create timeline with images, watch historical documentaries</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h5 className="font-medium text-purple-600 mb-1">Auditory</h5>
                  <p className="text-xs">Listen to history podcasts, discuss with study group</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h5 className="font-medium text-green-600 mb-1">Kinesthetic</h5>
                  <p className="text-xs">Act out historical events, visit museums, build models</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'note-taking-methods',
      type: 'practice',
      title: 'Adaptive Note-Taking Methods',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 p-6 rounded-lg border border-teal-500/20">
            <h3 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-300">Note-Taking as Active Processing</h3>
            <p className="text-muted-foreground mb-4">
              Effective note-taking is more than transcription - it's an active process of organizing, 
              processing, and connecting information. Different methods work better for different types 
              of content and learning preferences.
            </p>
            
            <div className="space-y-4">
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-teal-600">📝 The Cornell Method</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border-2 border-teal-200 dark:border-teal-800">
                    <h5 className="font-medium text-sm mb-1">Cue Column (2.5")</h5>
                    <p className="text-xs">Keywords, questions, formulas</p>
                  </div>
                  <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border-2 border-cyan-200 dark:border-cyan-800">
                    <h5 className="font-medium text-sm mb-1">Note-Taking Area (6")</h5>
                    <p className="text-xs">Main notes during lecture/reading</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <h5 className="font-medium text-sm mb-1">Summary Section (2")</h5>
                    <p className="text-xs">Key takeaways at bottom</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-purple-600">🕸️ Mind Mapping</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Benefits for Neurodiverse Learners:</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• Shows connections between ideas</li>
                      <li>• Appeals to visual processors</li>
                      <li>• Non-linear structure matches thinking patterns</li>
                      <li>• Encourages creativity and association</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">How to Create:</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• Central topic in the middle</li>
                      <li>• Branch out with main themes</li>
                      <li>• Add sub-branches for details</li>
                      <li>• Use colors, symbols, and images</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-orange-600">🎨 Visual Notes (Sketchnoting)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Elements to Include:</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• Simple drawings and icons</li>
                      <li>• Different text sizes and styles</li>
                      <li>• Arrows and connectors</li>
                      <li>• Speech bubbles and frames</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Perfect For:</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• Lectures and presentations</li>
                      <li>• Book summaries</li>
                      <li>• Concept explanations</li>
                      <li>• Creative brainstorming</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Pro Tips for Better Notes</h4>
              <ul className="grid md:grid-cols-2 gap-2 text-sm">
                <li>• Use abbreviations and symbols consistently</li>
                <li>• Leave white space for later additions</li>
                <li>• Review and revise within 24 hours</li>
                <li>• Create a personal shorthand system</li>
                <li>• Use multiple colors meaningfully</li>
                <li>• Date and title every set of notes</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 8
    },
    {
      id: 'summarization-synthesis',
      type: 'practice',
      title: 'Summarization and Synthesis Techniques',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 p-6 rounded-lg border border-rose-500/20">
            <h3 className="text-xl font-semibold mb-4 text-rose-700 dark:text-rose-300">From Information to Understanding</h3>
            <p className="text-muted-foreground mb-4">
              Summarization and synthesis are crucial skills that transform scattered information into 
              coherent understanding. These techniques help consolidate learning and identify key patterns 
              and connections.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-rose-600">📋 Summarization</h4>
                <p className="text-sm mb-3">Condensing information to its essential points</p>
                <div className="space-y-2">
                  <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded">
                    <h5 className="font-medium text-sm">Main Idea Method</h5>
                    <p className="text-xs text-muted-foreground">Identify the central theme of each section</p>
                  </div>
                  <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded">
                    <h5 className="font-medium text-sm">Key Points Method</h5>
                    <p className="text-xs text-muted-foreground">List 3-5 most important points</p>
                  </div>
                  <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded">
                    <h5 className="font-medium text-sm">Question-Answer Method</h5>
                    <p className="text-xs text-muted-foreground">What questions does this material answer?</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-pink-600">🔗 Synthesis</h4>
                <p className="text-sm mb-3">Connecting ideas to create new understanding</p>
                <div className="space-y-2">
                  <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded">
                    <h5 className="font-medium text-sm">Pattern Recognition</h5>
                    <p className="text-xs text-muted-foreground">Find recurring themes across sources</p>
                  </div>
                  <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded">
                    <h5 className="font-medium text-sm">Compare & Contrast</h5>
                    <p className="text-xs text-muted-foreground">Identify similarities and differences</p>
                  </div>
                  <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded">
                    <h5 className="font-medium text-sm">Application Thinking</h5>
                    <p className="text-xs text-muted-foreground">How does this apply to new situations?</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">📝 The 3-2-1 Method</h4>
              <p className="text-sm mb-3">A simple framework for processing any material:</p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                  <div className="text-2xl mb-2">3️⃣</div>
                  <h5 className="font-medium text-sm">3 Key Points</h5>
                  <p className="text-xs">Most important takeaways</p>
                </div>
                <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <div className="text-2xl mb-2">2️⃣</div>
                  <h5 className="font-medium text-sm">2 Connections</h5>
                  <p className="text-xs">Links to prior knowledge</p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl mb-2">1️⃣</div>
                  <h5 className="font-medium text-sm">1 Question</h5>
                  <p className="text-xs">Something to explore further</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'technology-note-support',
      type: 'example',
      title: 'Technology Tools for Note-Taking',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-6 rounded-lg border border-blue-500/20">
            <h3 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">Digital Tools for Enhanced Learning</h3>
            <p className="text-muted-foreground mb-4">
              Modern technology offers powerful tools that can enhance note-taking and organization, 
              providing flexibility, accessibility, and advanced features that support neurodiverse learning needs.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-blue-600">📝 Note-Taking Apps</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="font-medium text-blue-600 mb-1">Notion</h5>
                    <p className="text-xs text-muted-foreground">All-in-one workspace with databases, templates, and collaboration</p>
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <h5 className="font-medium text-indigo-600 mb-1">Obsidian</h5>
                    <p className="text-xs text-muted-foreground">Connected notes with graph view and powerful linking</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h5 className="font-medium text-purple-600 mb-1">OneNote</h5>
                    <p className="text-xs text-muted-foreground">Free-form canvas with handwriting and multimedia support</p>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <h5 className="font-medium text-teal-600 mb-1">Evernote</h5>
                    <p className="text-xs text-muted-foreground">Web clipping, document scanning, and powerful search</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-green-600">🎤 Speech & Accessibility</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h5 className="font-medium text-green-600 mb-1">Otter.ai</h5>
                    <p className="text-xs text-muted-foreground">Real-time transcription for lectures and meetings</p>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <h5 className="font-medium text-emerald-600 mb-1">Dragon Dictation</h5>
                    <p className="text-xs text-muted-foreground">Professional speech-to-text software</p>
                  </div>
                  <div className="p-3 bg-lime-50 dark:bg-lime-900/20 rounded-lg">
                    <h5 className="font-medium text-lime-600 mb-1">Voice Memos</h5>
                    <p className="text-xs text-muted-foreground">Quick audio notes for later transcription</p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h5 className="font-medium text-yellow-600 mb-1">Natural Reader</h5>
                    <p className="text-xs text-muted-foreground">Text-to-speech for reviewing written notes</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">⚖️ Choosing the Right Tool</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2 text-orange-600">Consider Your Needs:</h5>
                  <ul className="space-y-1 text-sm">
                    <li>• Writing vs. typing vs. voice input</li>
                    <li>• Simple notes vs. complex organization</li>
                    <li>• Individual vs. collaborative work</li>
                    <li>• Free vs. paid features needed</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2 text-purple-600">Success Tips:</h5>
                  <ul className="space-y-1 text-sm">
                    <li>• Start with one tool and master it</li>
                    <li>• Sync across all your devices</li>
                    <li>• Regular backup of important notes</li>
                    <li>• Create templates for repeated tasks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'reading-comprehension-strategies',
      type: 'practice',
      title: 'Reading Comprehension for Neurodiverse Minds',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-6 rounded-lg border border-emerald-500/20">
            <h3 className="text-xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">Strategic Reading Approaches</h3>
            <p className="text-muted-foreground mb-4">
              Reading comprehension can be challenging for many neurodiverse learners. Strategic approaches 
              can help break down complex texts, improve focus, and enhance understanding through structured 
              pre-reading, active reading, and post-reading techniques.
            </p>
            
            <div className="space-y-4">
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-emerald-600">🔍 Pre-Reading Strategies</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Preview the Text:</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• Read headings and subheadings</li>
                      <li>• Look at images, charts, and captions</li>
                      <li>• Read the first and last paragraphs</li>
                      <li>• Scan for bolded or italicized words</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Set Purpose:</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• What do I need to learn from this?</li>
                      <li>• How does this connect to what I know?</li>
                      <li>• What questions do I have?</li>
                      <li>• How much detail do I need?</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-green-600">📖 Active Reading Techniques</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Engagement Strategies:</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• Ask questions while reading</li>
                      <li>• Make predictions about what's next</li>
                      <li>• Connect to personal experiences</li>
                      <li>• Visualize concepts and scenarios</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Annotation Methods:</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• Highlight key points (sparingly)</li>
                      <li>• Write questions in margins</li>
                      <li>• Summarize paragraphs in your words</li>
                      <li>• Mark confusing sections for review</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-teal-600">🧩 Text-Processing Adaptations</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <h5 className="font-medium text-emerald-600 mb-1">Chunking Text</h5>
                    <p className="text-xs text-muted-foreground">Break long passages into smaller, manageable sections. Read one chunk, summarize, then move on.</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h5 className="font-medium text-green-600 mb-1">Text-to-Speech</h5>
                    <p className="text-xs text-muted-foreground">Use software like NaturalReader or built-in accessibility features to hear text while following along.</p>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <h5 className="font-medium text-teal-600 mb-1">Reading Guides</h5>
                    <p className="text-xs text-muted-foreground">Use a ruler, finger, or digital highlighting to track your place and maintain focus.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">📚 The SQ3R Method</h4>
              <div className="grid grid-cols-5 gap-2">
                <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                  <h5 className="font-bold text-emerald-600">S</h5>
                  <p className="text-xs">Survey</p>
                </div>
                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <h5 className="font-bold text-green-600">Q</h5>
                  <p className="text-xs">Question</p>
                </div>
                <div className="text-center p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
                  <h5 className="font-bold text-teal-600">R</h5>
                  <p className="text-xs">Read</p>
                </div>
                <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <h5 className="font-bold text-blue-600">R</h5>
                  <p className="text-xs">Recite</p>
                </div>
                <div className="text-center p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                  <h5 className="font-bold text-indigo-600">R</h5>
                  <p className="text-xs">Review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 8
    },
    {
      id: 'critical-thinking-development',
      type: 'concept',
      title: 'Developing Critical Analysis Skills',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-6 rounded-lg border border-purple-500/20">
            <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">Beyond Surface Learning</h3>
            <p className="text-muted-foreground mb-4">
              Critical thinking involves analyzing information objectively, identifying biases, questioning 
              assumptions, and forming reasoned judgments. These skills are essential for academic success 
              and lifelong learning.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">🤔 Critical Thinking Framework</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h5 className="font-medium text-purple-600 mb-1">Analysis</h5>
                    <p className="text-xs">Break down complex information into parts</p>
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <h5 className="font-medium text-indigo-600 mb-1">Evaluation</h5>
                    <p className="text-xs">Assess the credibility and quality of sources</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="font-medium text-blue-600 mb-1">Inference</h5>
                    <p className="text-xs">Draw logical conclusions from evidence</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <h5 className="font-medium text-teal-600 mb-1">Interpretation</h5>
                    <p className="text-xs">Understand meaning and significance</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h5 className="font-medium text-green-600 mb-1">Explanation</h5>
                    <p className="text-xs">Articulate reasoning and evidence clearly</p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h5 className="font-medium text-yellow-600 mb-1">Self-Regulation</h5>
                    <p className="text-xs">Monitor and correct your own thinking</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-orange-600">❓ Questions to Ask</h4>
                <ul className="space-y-1 text-sm">
                  <li>• What is the main argument or claim?</li>
                  <li>• What evidence supports this position?</li>
                  <li>• Are there alternative explanations?</li>
                  <li>• What assumptions are being made?</li>
                  <li>• What are the implications if this is true?</li>
                  <li>• What might be missing from this analysis?</li>
                </ul>
              </div>
              
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-red-600">🚩 Red Flags to Watch For</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Emotional language instead of facts</li>
                  <li>• Cherry-picked or limited evidence</li>
                  <li>• False dichotomies (only two options)</li>
                  <li>• Ad hominem attacks on sources</li>
                  <li>• Correlation presented as causation</li>
                  <li>• Outdated or unreliable sources</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    },
    {
      id: 'abstract-concepts-strategies',
      type: 'practice',
      title: 'Mastering Abstract Concepts',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-6 rounded-lg border border-amber-500/20">
            <h3 className="text-xl font-semibold mb-4 text-amber-700 dark:text-amber-300">Making the Abstract Concrete</h3>
            <p className="text-muted-foreground mb-4">
              Abstract concepts can be challenging for many neurodiverse learners who excel with concrete, 
              visual thinking. By using analogies, examples, and visualization techniques, we can bridge 
              the gap between abstract ideas and concrete understanding.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">🌉 Bridging Strategies</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <h5 className="font-medium text-amber-600 mb-1">Concrete Analogies</h5>
                    <p className="text-xs text-muted-foreground">
                      Compare abstract ideas to familiar, tangible objects or experiences
                    </p>
                    <p className="text-xs mt-1"><strong>Example:</strong> "Democracy is like a group of friends deciding where to eat dinner by voting"</p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h5 className="font-medium text-orange-600 mb-1">Visual Models</h5>
                    <p className="text-xs text-muted-foreground">
                      Create diagrams, charts, or physical models to represent abstract relationships
                    </p>
                    <p className="text-xs mt-1"><strong>Example:</strong> Use a scale to represent justice and fairness</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h5 className="font-medium text-yellow-600 mb-1">Real-World Examples</h5>
                    <p className="text-xs text-muted-foreground">
                      Connect abstract concepts to current events, personal experiences, or practical applications
                    </p>
                    <p className="text-xs mt-1"><strong>Example:</strong> Explain supply and demand using concert ticket prices</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h5 className="font-medium text-red-600 mb-1">Story Narratives</h5>
                    <p className="text-xs text-muted-foreground">
                      Embed abstract concepts within stories or scenarios that illustrate the principles
                    </p>
                    <p className="text-xs mt-1"><strong>Example:</strong> Use character conflicts to explain ethical dilemmas</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">🧩 Step-by-Step Approach</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span className="text-sm">Identify the core elements of the abstract concept</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span className="text-sm">Find concrete analogies or examples from your experience</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-sm">Create visual representations or diagrams</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <span className="text-sm">Practice applying the concept to new situations</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
                  <span className="text-sm">Teach the concept to someone else using your analogies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 7
    },
    {
      id: 'inferential-reasoning',
      type: 'practice',
      title: 'Building Inferential Reasoning Skills',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6 rounded-lg border border-cyan-500/20">
            <h3 className="text-xl font-semibold mb-4 text-cyan-700 dark:text-cyan-300">Reading Between the Lines</h3>
            <p className="text-muted-foreground mb-4">
              Inferential reasoning involves drawing logical conclusions from available information, even when 
              those conclusions aren't explicitly stated. This skill is crucial for reading comprehension, 
              problem-solving, and understanding implicit meanings.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">🔍 Types of Inferences</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                    <h5 className="font-medium text-cyan-600 mb-1">Causal Inferences</h5>
                    <p className="text-xs text-muted-foreground">Understanding cause-and-effect relationships</p>
                    <p className="text-xs mt-1"><strong>Example:</strong> "The plants wilted" → inference: lack of water or too much heat</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="font-medium text-blue-600 mb-1">Predictive Inferences</h5>
                    <p className="text-xs text-muted-foreground">Anticipating what might happen next</p>
                    <p className="text-xs mt-1"><strong>Example:</strong> "Dark clouds gathered" → inference: it might rain soon</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <h5 className="font-medium text-teal-600 mb-1">Character/Motivation Inferences</h5>
                    <p className="text-xs text-muted-foreground">Understanding why people act as they do</p>
                    <p className="text-xs mt-1"><strong>Example:</strong> "She avoided eye contact" → inference: might be nervous or hiding something</p>
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <h5 className="font-medium text-indigo-600 mb-1">Theme/Message Inferences</h5>
                    <p className="text-xs text-muted-foreground">Identifying underlying meanings or lessons</p>
                    <p className="text-xs mt-1"><strong>Example:</strong> Story patterns → inference: themes about friendship or perseverance</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">🧠 Inference Detective Strategy</h4>
              <div className="space-y-2">
                <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                  <h5 className="font-medium mb-1">1. Collect the Clues</h5>
                  <p className="text-xs">What facts, details, or evidence does the text provide?</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h5 className="font-medium mb-1">2. Use Your Background Knowledge</h5>
                  <p className="text-xs">What do you already know about this topic or situation?</p>
                </div>
                <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <h5 className="font-medium mb-1">3. Make Logical Connections</h5>
                  <p className="text-xs">How do the clues and your knowledge connect logically?</p>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <h5 className="font-medium mb-1">4. Test Your Inference</h5>
                  <p className="text-xs">Does your conclusion make sense with all the available information?</p>
                </div>
              </div>
            </div>
            
            <div className="bg-background/20 p-4 rounded-lg border-2 border-dashed border-cyan-300">
              <h4 className="font-semibold mb-2 text-cyan-700 dark:text-cyan-300">📚 Practice Exercise</h4>
              <p className="text-sm mb-2">
                <strong>Scenario:</strong> "Maria packed her umbrella even though the sky was clear. She checked her phone one more time before leaving."
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Try inferring:</strong> Why did Maria pack an umbrella? What might she have seen on her phone? 
                Practice identifying the clues that led to your conclusions.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 7
    },
    {
      id: 'study-techniques-integration',
      type: 'summary',
      title: 'Integrating Study Techniques',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-6 rounded-lg border border-violet-500/20">
            <h3 className="text-xl font-semibold mb-4 text-violet-700 dark:text-violet-300">Your Personalized Study System</h3>
            <p className="text-muted-foreground mb-4">
              Effective studying isn't about using every technique - it's about finding the right combination 
              that works for your unique learning style, subject matter, and goals. Build your personalized 
              system gradually and adapt it as needed.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">🎯 Study Technique Selection Guide</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2 text-violet-600">For Memorization:</h5>
                  <ul className="space-y-1 text-sm">
                    <li>• Spaced repetition with flashcards</li>
                    <li>• Active recall testing</li>
                    <li>• Memory palace visualization</li>
                    <li>• Chunking complex information</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2 text-purple-600">For Understanding:</h5>
                  <ul className="space-y-1 text-sm">
                    <li>• Elaborative interrogation (asking why)</li>
                    <li>• Concept mapping and mind maps</li>
                    <li>• Teaching others (Feynman technique)</li>
                    <li>• Multi-modal learning approaches</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-green-600">Subject-Specific Adaptations</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <h5 className="font-medium text-sm">STEM Subjects</h5>
                    <p className="text-xs">Practice problems, visual models, step-by-step breakdowns</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <h5 className="font-medium text-sm">Humanities</h5>
                    <p className="text-xs">Critical analysis, essay planning, timeline visualizations</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <h5 className="font-medium text-sm">Languages</h5>
                    <p className="text-xs">Spaced repetition, immersion, conversation practice</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-orange-600">Weekly Study Rhythm</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Monday:</span>
                    <span>Plan week, review weekend notes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tue-Thu:</span>
                    <span>Active learning, new material</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday:</span>
                    <span>Review, synthesis, practice tests</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekend:</span>
                    <span>Spaced repetition, projects</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/20 p-4 rounded-lg border-2 border-dashed border-violet-300">
              <h4 className="font-semibold mb-2 text-violet-700 dark:text-violet-300">🚀 Your Next Steps</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Choose 2-3 techniques that resonated most with you</li>
                <li>Try them for one week with your current coursework</li>
                <li>Track what works and what doesn't in a simple journal</li>
                <li>Gradually add more techniques to your toolkit</li>
                <li>Adapt and personalize based on your results</li>
              </ol>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 5
    },
    {
      id: 'study-techniques-real-world',
      type: 'practice',
      title: 'Real-World Application & Success Strategies',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 rounded-lg border border-emerald-500/20">
            <h3 className="text-xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">From Theory to Practice</h3>
            <p className="text-muted-foreground mb-4">
              The ultimate test of study techniques is how well they work in real academic situations. 
              Let's create practical implementation plans that will help you succeed in your actual courses 
              and develop lasting learning habits.
            </p>
            
            <div className="bg-background/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">📅 Implementation Timeline</h4>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <h5 className="font-medium text-emerald-600 mb-2">Week 1-2: Foundation Building</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Set up your note-taking system</li>
                    <li>• Choose primary active recall method</li>
                    <li>• Establish daily review routine</li>
                    <li>• Identify your peak focus times</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <h5 className="font-medium text-teal-600 mb-2">Week 3-4: Technique Integration</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Add spaced repetition to your routine</li>
                    <li>• Practice elaborative interrogation</li>
                    <li>• Experiment with multi-modal approaches</li>
                    <li>• Begin weekly review sessions</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                  <h5 className="font-medium text-cyan-600 mb-2">Week 5-8: Optimization & Adaptation</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Refine techniques based on results</li>
                    <li>• Develop subject-specific approaches</li>
                    <li>• Build long-term retention systems</li>
                    <li>• Create exam preparation protocols</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-blue-600">📊 Success Metrics</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Improved test scores and grades</li>
                  <li>• Reduced study time for same results</li>
                  <li>• Better retention after weeks/months</li>
                  <li>• Increased confidence in learning</li>
                  <li>• Less stress around exams</li>
                  <li>• Greater enjoyment of subjects</li>
                </ul>
              </div>
              
              <div className="bg-background/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-purple-600">🛠️ Troubleshooting Tips</h4>
                <ul className="space-y-1 text-sm">
                  <li>• If technique isn't working, adapt it</li>
                  <li>• Start small and build gradually</li>
                  <li>• Track what works in a study journal</li>
                  <li>• Don't try to change everything at once</li>
                  <li>• Seek help from instructors/tutors</li>
                  <li>• Be patient with the learning process</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 bg-background/20 p-4 rounded-lg border-2 border-dashed border-emerald-300">
              <h4 className="font-semibold mb-2 text-emerald-700 dark:text-emerald-300">🌟 Remember</h4>
              <p className="text-sm text-muted-foreground">
                Learning is deeply personal. What works for others might need adaptation for you. 
                The goal isn't to use every technique perfectly, but to build a sustainable system 
                that helps you learn effectively and enjoy the process. Trust yourself to know what 
                works best for your unique mind.
              </p>
            </div>
          </div>
        </div>
      ),
      estimatedTime: 6
    }
  ]
};