
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, Clock, Award } from 'lucide-react';

const LearningAnalytics = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
        <p className="text-gray-600">Deep insights into your learning patterns and progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fpk-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-purple-600" />
              Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <BarChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500">Complete courses to see your performance analytics</p>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              Learning Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Trends Yet</h3>
            <p className="text-gray-500">Start learning to see your progress trends</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningAnalytics;
