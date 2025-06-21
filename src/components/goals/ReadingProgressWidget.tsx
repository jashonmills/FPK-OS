
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';

const ReadingProgressWidget = () => {
  console.log('📚 ReadingProgressWidget rendering');
  
  // Simplified widget without hook to prevent subscription issues
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
  };

  return (
    <Card className="fpk-card border-0 shadow-md">
      <CardHeader className="pb-2 p-4">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BookOpen className="h-4 w-4 text-blue-600" />
          Reading Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-3 w-3 text-blue-600 mr-1" />
            </div>
            <div className="text-lg font-bold text-blue-600">
              0h
            </div>
            <p className="text-xs text-gray-500">Total Time</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            </div>
            <div className="text-lg font-bold text-green-600">
              0
            </div>
            <p className="text-xs text-gray-500">This Week</p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 text-center">
            Start reading to track your progress
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingProgressWidget;
