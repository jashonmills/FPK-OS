
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useFlashcards } from '@/hooks/useFlashcards';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';

const ProgressSection: React.FC = () => {
  const { sessions } = useStudySessions();
  const { flashcards } = useFlashcards();

  // Calculate today's progress
  const today = new Date().toDateString();
  const todaySessions = sessions.filter(session => 
    new Date(session.created_at).toDateString() === today && session.completed_at
  );

  const todayStats = todaySessions.reduce((acc, session) => {
    acc.totalCards += session.total_cards;
    acc.correctAnswers += session.correct_answers;
    acc.studyTime += session.session_duration_seconds || 0;
    return acc;
  }, { totalCards: 0, correctAnswers: 0, studyTime: 0 });

  const accuracy = todayStats.totalCards > 0 
    ? Math.round((todayStats.correctAnswers / todayStats.totalCards) * 100) 
    : 0;

  const studyTimeMinutes = Math.round(todayStats.studyTime / 60);

  // Weekly goals (could be made dynamic from goals table)
  const weeklyGoals = {
    cardsTarget: 50,
    studyTimeTarget: 120, // minutes
    accuracyTarget: 80
  };

  const cardsProgress = Math.min(100, (todayStats.totalCards / weeklyGoals.cardsTarget) * 100);
  const timeProgress = Math.min(100, (studyTimeMinutes / weeklyGoals.studyTimeTarget) * 100);

  return (
    <Card className="fpk-card border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Review & Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Today's Progress */}
        <div className="space-y-4">
          <h3 className="font-medium">Today's Progress</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900">{todayStats.totalCards}</div>
              <div className="text-sm text-blue-700">Cards Studied</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-900">{accuracy}%</div>
              <div className="text-sm text-green-700">Accuracy</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-900">{studyTimeMinutes}</div>
              <div className="text-sm text-purple-700">Minutes</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-900">{flashcards.length}</div>
              <div className="text-sm text-orange-700">Total Cards</div>
            </div>
          </div>
        </div>

        {/* Weekly Goals Progress */}
        <div className="space-y-4">
          <h3 className="font-medium">Weekly Goals</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cards Studied</span>
                <span>{todayStats.totalCards} / {weeklyGoals.cardsTarget}</span>
              </div>
              <Progress value={cardsProgress} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Study Time</span>
                <span>{studyTimeMinutes} / {weeklyGoals.studyTimeTarget} min</span>
              </div>
              <Progress value={timeProgress} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Accuracy Goal</span>
                <span>{accuracy}% / {weeklyGoals.accuracyTarget}%</span>
              </div>
              <Progress 
                value={Math.min(100, (accuracy / weeklyGoals.accuracyTarget) * 100)} 
                className="h-2" 
              />
            </div>
          </div>
        </div>

        {/* Recent Study Sessions */}
        {todaySessions.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Recent Sessions</h3>
            <div className="space-y-2">
              {todaySessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {session.session_type.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm">
                      {session.correct_answers}/{session.total_cards} correct
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {session.session_duration_seconds 
                      ? `${Math.round(session.session_duration_seconds / 60)}m`
                      : 'N/A'
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {todaySessions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No study sessions today</p>
            <p className="text-sm">Start studying to track your progress!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressSection;
