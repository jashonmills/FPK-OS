import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Trophy, BookOpen, ArrowRight } from 'lucide-react';

export function NumeracyConclusionLesson() {
  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Conclusion
            </h1>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Trophy className="mr-3 h-8 w-8 text-blue-600" />
              Module 5: Conclusion
            </h2>
            
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                OK hope your practice has gone well. Hopefully you guys will be seeing improvements like we've seen with the hundreds of young people that we have worked with over the years and that it is making learning so much easier for your children. If you've got concerns over their handwriting or their reading, jump into those courses cause they're even simpler. So, I hope you've enjoyed the Empowering Learning Numeracy course, well done for completing it and yeah, you've got this.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-green-400 bg-green-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="mr-2 h-6 w-6 text-green-600" />
                  What You've Accomplished
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Learned the optimal learning state techniques</li>
                  <li>• Discovered the historical origins of number shapes</li>
                  <li>• Mastered the Number Triangle technique</li>
                  <li>• Built a foundation for mathematical understanding</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-400 bg-purple-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <BookOpen className="mr-2 h-6 w-6 text-purple-600" />
                  Additional Resources
                </h3>
                <p className="text-gray-700 mb-3">
                  If you have concerns about handwriting or reading, we have additional courses available:
                </p>
                <ul className="text-gray-700 space-y-1">
                  <li>• Empowering Learning for Spelling</li>
                  <li>• Empowering Learning for Reading</li>
                  <li>• Handwriting courses</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Success Stories</h3>
            <p className="text-gray-700 leading-relaxed">
              These techniques have helped hundreds of young people over the years, making learning mathematics significantly easier and more enjoyable. You're now part of this success story!
            </p>
          </div>

          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 flex items-center justify-center">
              <Trophy className="mr-2 h-8 w-8 text-yellow-500" />
              Congratulations!
            </h3>
            <p className="text-lg text-gray-700 mb-4">
              Well done for completing the Empowering Learning Numeracy course!
            </p>
            <p className="text-xl font-bold text-blue-600">
              You've got this! 🎉
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center justify-center">
              <ArrowRight className="mr-2 h-6 w-6 text-gray-600" />
              What's Next?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Continue practicing the Number Triangle technique for just 5 minutes a day. Remember, consistency is key to building lasting mathematical confidence and skills.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}