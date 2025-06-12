
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target, Trophy, Calendar, Filter } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';
import GoalCreateForm from './GoalCreateForm';
import GoalCard from './GoalCard';

export const GoalsDashboard = () => {
  const { goals, loading } = useGoals();
  const { t } = useDualLanguage();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Filter goals by status
  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const pausedGoals = goals.filter(goal => goal.status === 'paused');

  // Get filtered goals based on active tab
  const getFilteredGoals = () => {
    switch (activeTab) {
      case 'active':
        return activeGoals;
      case 'completed':
        return completedGoals;
      case 'paused':
        return pausedGoals;
      default:
        return goals;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <div className="text-muted-foreground">
            <DualLanguageText translationKey="common.loading" fallback="Loading..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="fpk-enhanced-card border-0 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <DualLanguageText translationKey="goals.stats.totalGoals" fallback="Total Goals" />
                </p>
                <p className="text-xl sm:text-2xl font-bold fpk-gradient-text">{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-enhanced-card border-0 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <DualLanguageText translationKey="goals.stats.activeGoals" fallback="Active Goals" />
                </p>
                <p className="text-xl sm:text-2xl font-bold fpk-gradient-text">{activeGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-enhanced-card border-0 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <DualLanguageText translationKey="goals.stats.completedGoals" fallback="Completed" />
                </p>
                <p className="text-xl sm:text-2xl font-bold fpk-gradient-text">{completedGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-enhanced-card border-0 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <DualLanguageText translationKey="goals.stats.completionRate" fallback="Completion Rate" />
                </p>
                <p className="text-xl sm:text-2xl font-bold fpk-gradient-text">
                  {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Management */}
      <Card className="fpk-enhanced-card border-0">
        <CardHeader className="border-b border-border/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <span className="fpk-gradient-text">
                <DualLanguageText translationKey="goals.myGoals" fallback="My Goals" />
              </span>
            </CardTitle>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="fpk-gradient-button text-white shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              <DualLanguageText translationKey="goals.createNew" fallback="Create Goal" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6 bg-muted/30 p-1 rounded-lg">
              <TabsTrigger value="all" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">
                  <DualLanguageText translationKey="goals.tabs.all" fallback="All" />
                </span>
                <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary">{goals.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">
                  <DualLanguageText translationKey="goals.tabs.active" fallback="Active" />
                </span>
                <Badge variant="secondary" className="ml-1 bg-green-500/10 text-green-600">{activeGoals.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">
                  <DualLanguageText translationKey="goals.tabs.completed" fallback="Completed" />
                </span>
                <Badge variant="secondary" className="ml-1 bg-amber-500/10 text-amber-600">{completedGoals.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="paused" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">
                  <DualLanguageText translationKey="goals.tabs.paused" fallback="Paused" />
                </span>
                <Badge variant="secondary" className="ml-1 bg-gray-500/10 text-gray-600">{pausedGoals.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {getFilteredGoals().length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 rounded-full bg-muted/30 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Target className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-3">
                    <DualLanguageText 
                      translationKey={`goals.empty.${activeTab}Title`} 
                      fallback="No goals found" 
                    />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    <DualLanguageText 
                      translationKey={`goals.empty.${activeTab}Description`} 
                      fallback="Start by creating your first goal to track your learning progress" 
                    />
                  </p>
                  {(activeTab === 'all' || activeTab === 'active') && (
                    <Button 
                      onClick={() => setShowCreateForm(true)}
                      className="fpk-gradient-button text-white shadow-lg hover:shadow-xl"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <DualLanguageText translationKey="goals.createFirst" fallback="Create Your First Goal" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {getFilteredGoals().map((goal) => (
                    <GoalCard 
                      key={goal.id} 
                      goal={{
                        id: goal.id,
                        title: goal.title,
                        description: goal.description,
                        priority: goal.priority as 'low' | 'medium' | 'high',
                        status: goal.status as 'active' | 'completed' | 'paused',
                        progress: goal.progress,
                        target_date: goal.target_date,
                        created_at: goal.created_at
                      }} 
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Goal Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-2xl w-full max-w-md mx-4 border border-border/20">
            <div className="flex items-center justify-between p-6 border-b border-border/20">
              <h2 className="text-lg font-semibold fpk-gradient-text">
                <DualLanguageText translationKey="goals.createNew" fallback="Create New Goal" />
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCreateForm(false)}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                ×
              </Button>
            </div>
            <div className="p-6">
              <GoalCreateForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
