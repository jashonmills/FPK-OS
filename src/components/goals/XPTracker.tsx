
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import DualLanguageText from '@/components/DualLanguageText';
import { useXPTracking } from '@/hooks/useXPTracking';
import { Trophy, Zap, Target } from 'lucide-react';

export const XPTracker = () => {
  const { xpData, loading } = useXPTracking();

  if (loading) {
    return (
      <div className="fpk-gradient text-white p-6 rounded-lg mb-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-6 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  const progressToNextLevel = ((1000 - xpData.xpToNextLevel) / 1000) * 100;

  return (
    <div className="fpk-gradient text-white p-6 rounded-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <DualLanguageText translationKey="goals.title" />
          </h1>
          <p className="text-white/80">
            <DualLanguageText translationKey="goals.subtitle" />
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-5 w-5" />
            <span className="text-sm">
              <DualLanguageText translationKey="goals.heroLevel" />
            </span>
            <span className="text-2xl font-bold">{xpData.level}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-lg font-semibold">{xpData.totalXP.toLocaleString()}</span>
            <span className="text-sm">
              <DualLanguageText translationKey="goals.heroXP" />
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4" />
              <span className="text-sm">
                <DualLanguageText translationKey="goals.nextMilestone" />
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{xpData.totalXP.toLocaleString()} XP</span>
                <span>{(xpData.level * 1000).toLocaleString()} XP</span>
              </div>
              <Progress value={progressToNextLevel} className="h-2 bg-white/20" />
              <p className="text-xs text-white/70">
                {xpData.xpToNextLevel} XP to Level {xpData.level + 1}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold mb-1">{xpData.currentStreak}</div>
            <div className="text-sm">
              <DualLanguageText translationKey="goals.currentStreak" />
            </div>
            <div className="mt-2 text-xl">🔥</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm">
              <DualLanguageText translationKey="goals.stats.totalXP" />
            </div>
            <div className="text-xl font-bold">{xpData.totalXP.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
