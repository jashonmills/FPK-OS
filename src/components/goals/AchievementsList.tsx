
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DualLanguageText from '@/components/DualLanguageText';
import { Trophy, Lock, Star } from 'lucide-react';
import { useAchievements, predefinedAchievements } from '@/hooks/useAchievements';

export const AchievementsList = () => {
  const { achievements, loading, hasAchievement } = useAchievements();

  if (loading) {
    return (
      <Card className="fpk-card border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fpk-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-600" />
          <DualLanguageText translationKey="goals.sections.achievements" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {predefinedAchievements.map((achievement) => {
          const isUnlocked = hasAchievement(achievement.type);
          
          return (
            <Card key={achievement.type} className={`border ${isUnlocked ? 'border-amber-200 bg-amber-50' : 'border-gray-200'}`}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${isUnlocked ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold text-sm ${isUnlocked ? 'text-amber-800' : 'text-gray-600'}`}>
                        <DualLanguageText translationKey={achievement.name} />
                      </h4>
                      {isUnlocked ? (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          <DualLanguageText translationKey="goals.xpRewards.medium" />
                        </Badge>
                      ) : (
                        <Lock className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <p className={`text-xs ${isUnlocked ? 'text-amber-700' : 'text-gray-500'}`}>
                      <DualLanguageText translationKey={achievement.description} />
                    </p>
                  </div>
                  
                  {isUnlocked && (
                    <div className="text-amber-600">
                      <Trophy className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            <span className="font-semibold">{achievements.length}</span> of {predefinedAchievements.length} achievements unlocked
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
