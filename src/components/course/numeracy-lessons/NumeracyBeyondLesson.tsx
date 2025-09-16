import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Brain, Rocket, Target } from 'lucide-react';

export function NumeracyBeyondLesson() {
  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Beyond Numeracy
            </h1>
            <p className="text-xl text-gray-600">Deep Dive Module 5</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="mr-3 h-8 w-8 text-blue-600" />
              Module 5 Deep Dive: Beyond Numeracy
            </h2>
            
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                The conclusion of our foundational course hints at the ultimate goal: using these principles to promote a love of numeracy and a calm mind. The core principles of an optimal learning state, intentional practice, and visual memorization can be applied far beyond numbers. This is about building a habit of metacognition—the ability to think about your own thinking. By understanding how you learn best, you can take control of any learning process. The confidence you gain from mastering numeracy can be a springboard to tackling other subjects, from complex scientific formulas to foreign languages.
              </p>
              
              <p className="text-lg leading-relaxed text-gray-700">
                This course is a foundational step in becoming a self-directed, lifelong learner. The skills you've developed are not just for math; they are for life.
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="mr-2 h-6 w-6 text-green-600" />
              Metacognition: Thinking About Thinking
            </h3>
            <div className="text-gray-700 space-y-3">
              <p><strong>Self-Awareness:</strong> Understanding how you learn best</p>
              <p><strong>Process Control:</strong> Taking control of any learning situation</p>
              <p><strong>Strategy Selection:</strong> Choosing the right approach for different challenges</p>
              <p><strong>Confidence Building:</strong> Using success to fuel further learning</p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Rocket className="mr-2 h-6 w-6 text-purple-600" />
              Real-World Connection: The Superpower Analogy
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Think about a time you tried to learn something new. Did you get frustrated and give up, or did you take a moment to understand the process? Mastering the principles of this course is like gaining a superpower. It gives you the ability to approach any challenge with a clear head, a focused mind, and a proven strategy for success. Whether it's learning to code, play an instrument, or simply preparing for a big presentation, the skills of self-awareness and intentional practice are your greatest assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-orange-400 bg-orange-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Universal Applications</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Complex scientific formulas</li>
                  <li>• Foreign language learning</li>
                  <li>• Musical instruments</li>
                  <li>• Coding and programming</li>
                  <li>• Creative pursuits</li>
                  <li>• Professional presentations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-teal-400 bg-teal-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Core Transferable Skills</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Optimal learning state creation</li>
                  <li>• Intentional practice habits</li>
                  <li>• Visual memorization techniques</li>
                  <li>• Relational thinking patterns</li>
                  <li>• Metacognitive awareness</li>
                  <li>• Confidence building strategies</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="mr-2 h-6 w-6 text-yellow-600" />
              Learning Moment
            </h3>
            <p className="text-gray-700 leading-relaxed">
              The key takeaway here is that you are not just learning a skill; you are learning how to learn. This framework of mindset, state control, and deliberate practice is the ultimate meta-skill. You've completed a powerful course on numeracy, but you've also gained a universal tool that can be applied to any challenge, from academic subjects to creative pursuits and beyond. This is your personal blueprint for success. What new skill will you master next?
            </p>
          </div>

          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">The Ultimate Meta-Skill</h3>
            <p className="text-lg text-gray-700 font-medium">
              Learning how to learn is the ultimate meta-skill that empowers you to master anything you set your mind to.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}