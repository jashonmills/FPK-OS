import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Target, BookOpen, Users } from 'lucide-react';

export function NumeracyIntroductionLesson() {
  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Empowering Learning: Numeracy
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A new perspective on learning
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calculator className="mr-3 h-8 w-8 text-blue-600" />
              Module 1: Introduction
            </h2>
            
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-700">
                Hello welcome to the Empowering Learning for numeracy programme. This is gonna be a nice short course to start to help you understand: 1) why numbers are the way they are and 2) how we can use number triangles to help us with our addition, subtraction, multiplication and division. It's very straightforward. It's gonna use a lot of the techniques in the Empowering Learning Spelling. So let's jump right in!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-green-400 bg-green-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="mr-2 h-6 w-6 text-green-600" />
                  Importance of Numeracy
                </h3>
                <p className="text-gray-700">
                  Numeracy skills are vital for personal and professional success. They help in budgeting, measuring, and analyzing data.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-400 bg-purple-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <BookOpen className="mr-2 h-6 w-6 text-purple-600" />
                  Key Concepts
                </h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Basic Arithmetic</li>
                  <li>• Fractions and Decimals</li>
                  <li>• Percentages</li>
                  <li>• Measurement</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="mr-2 h-6 w-6 text-yellow-600" />
              Numeracy in Daily Life
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Everyday activities such as shopping, cooking, and planning require numeracy skills. Understanding prices, quantities, and time are all part of being numerate.
            </p>
          </div>

          <div className="text-center bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Conclusion</h3>
            <p className="text-gray-700 leading-relaxed">
              Improving numeracy skills can lead to better opportunities and a more informed decision-making process.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              © 2023 Empowering Learning Initiative
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}