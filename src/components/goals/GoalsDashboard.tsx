import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target, Trophy, Calendar, Filter, AlertCircle, LogIn, BookOpen } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { useStudentGoals } from '@/hooks/useStudentGoals';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';
import GoalCreationDialog from './GoalCreationDialog';
import GoalCard from './GoalCard';
import StudentGoalCard from './StudentGoalCard';
import ReadingProgressWidget from './ReadingProgressWidget';
import ReadingProgressWidgetErrorBoundary from './ReadingProgressWidgetErrorBoundary';

export const GoalsDashboard = () => {
  const { goals = [], loading, error, refetch } = useGoals();
  const { goals: orgGoals, isLoading: orgLoading, refetch: refetchOrgGoals } = useStudentGoals();
  const { t } = useDualLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'personal' | 'assigned'>('personal');

  // Add loading state handling
  if (loading) {
    console.log('🎯 GoalsDashboard loading');
    return (
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <div className="ml-3 text-gray-500 text-sm sm:text-base">
          <DualLanguageText translationKey="common.loading" fallback="Loading goals..." />
        </div>
      </div>
    );
  }

  // Show error state if there's an authentication or other error
  if (error) {
    console.error('🎯 GoalsDashboard error:', error);
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-8">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Goals</h3>
        <p className="text-sm text-gray-600 text-center mb-4 max-w-md">
          {error}
        </p>
        {error.includes('Authentication') && (
          <Button 
            onClick={() => navigate('/login')}
            className="fpk-gradient text-white"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Log In Again
          </Button>
        )}
        {!error.includes('Authentication') && (
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-gray-300"
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }

  console.log('🎯 GoalsDashboard loaded with goals:', goals?.length || 0);

  // Filter goals by status with null checks
  const activeGoals = goals?.filter(goal => goal?.status === 'active') || [];
  const completedGoals = goals?.filter(goal => goal?.status === 'completed') || [];
  const pausedGoals = goals?.filter(goal => goal?.status === 'paused') || [];

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
        return goals || [];
    }
  };

  // Safe array length checks
  const totalGoals = goals?.length || 0;
  const activeGoalsCount = activeGoals?.length || 0;
  const completedGoalsCount = completedGoals?.length || 0;
  const pausedGoalsCount = pausedGoals?.length || 0;

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  <DualLanguageText translationKey="goals.stats.totalGoals" fallback="Total Goals" />
                </p>
                <p className="text-lg sm:text-xl font-bold">{totalGoals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg shrink-0">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  <DualLanguageText translationKey="goals.stats.activeGoals" fallback="Active" />
                </p>
                <p className="text-lg sm:text-xl font-bold">{activeGoalsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  <DualLanguageText translationKey="goals.stats.completedGoals" fallback="Complete" />
                </p>
                <p className="text-lg sm:text-xl font-bold">{completedGoalsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  <DualLanguageText translationKey="goals.stats.completionRate" fallback="Rate" />
                </p>
                <p className="text-lg sm:text-xl font-bold">
                  {totalGoals > 0 ? Math.round((completedGoalsCount / totalGoals) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reading Progress Widget - Separate Row */}
      <ReadingProgressWidgetErrorBoundary>
        <ReadingProgressWidget />
      </ReadingProgressWidgetErrorBoundary>

      {/* Goals Management */}
      <Card className="fpk-card border-0 shadow-lg">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                <span className="truncate">
                  <DualLanguageText translationKey="goals.myGoals" fallback="My Goals" />
                </span>
              </CardTitle>
              <GoalCreationDialog onGoalCreated={refetch}>
                <Button className="fpk-gradient text-white text-sm sm:text-base px-3 sm:px-4 py-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    <DualLanguageText translationKey="goals.createNew" fallback="Create Goal" />
                  </span>
                </Button>
              </GoalCreationDialog>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'personal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('personal')}
                className="flex-1"
              >
                <Target className="h-4 w-4 mr-2" />
                My Goals
              </Button>
              <Button
                variant={viewMode === 'assigned' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('assigned')}
                className="flex-1"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Assigned Goals {orgGoals.length > 0 && `(${orgGoals.length})`}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          {viewMode === 'assigned' ? (
            // Show assigned org goals
            <div className="space-y-4">
              {orgLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading assigned goals...</p>
                </div>
              ) : orgGoals.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No Assigned Goals</h3>
                  <p className="text-sm text-gray-500">
                    Your instructor hasn't assigned any goals to you yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {orgGoals.map((goal) => (
                    <StudentGoalCard
                      key={goal.id}
                      goal={goal}
                      onUpdate={refetchOrgGoals}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Show personal goals
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4 sm:mb-6 h-auto gap-1">
              <TabsTrigger value="all" className="flex flex-col items-center gap-1 p-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline truncate">
                    <DualLanguageText translationKey="goals.tabs.all" fallback="All" />
                  </span>
                  <span className="sm:hidden">All</span>
                </div>
                <Badge variant="secondary" className="text-xs min-w-0">{totalGoals}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active" className="flex flex-col items-center gap-1 p-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline truncate">
                    <DualLanguageText translationKey="goals.tabs.active" fallback="Active" />
                  </span>
                  <span className="sm:hidden">Active</span>
                </div>
                <Badge variant="secondary" className="text-xs min-w-0">{activeGoalsCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex flex-col items-center gap-1 p-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <Trophy className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline truncate">
                    <DualLanguageText translationKey="goals.tabs.completed" fallback="Done" />
                  </span>
                  <span className="sm:hidden">Done</span>
                </div>
                <Badge variant="secondary" className="text-xs min-w-0">{completedGoalsCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="paused" className="flex flex-col items-center gap-1 p-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline truncate">
                    <DualLanguageText translationKey="goals.tabs.paused" fallback="Paused" />
                  </span>
                  <span className="sm:hidden">Paused</span>
                </div>
                <Badge variant="secondary" className="text-xs min-w-0">{pausedGoalsCount}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="min-w-0">
              {getFilteredGoals().length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Target className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    <DualLanguageText 
                      translationKey={`goals.empty.${activeTab}Title`} 
                      fallback="No goals found" 
                    />
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 px-4 leading-relaxed">
                    <DualLanguageText 
                      translationKey={`goals.empty.${activeTab}Description`} 
                      fallback="Start by creating your first goal to track your learning progress" 
                    />
                  </p>
                   {activeTab === 'all' || activeTab === 'active' ? (
                    <GoalCreationDialog onGoalCreated={refetch}>
                      <Button className="fpk-gradient text-white text-sm px-4 py-2">
                        <Plus className="h-4 w-4 mr-2" />
                        <DualLanguageText translationKey="goals.createFirst" fallback="Create Your First Goal" />
                      </Button>
                    </GoalCreationDialog>
                  ) : null}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {getFilteredGoals().map((goal) => (
                    goal && goal.id ? (
                      <GoalCard 
                        key={goal.id} 
                        goal={{
                          id: goal.id,
                          title: goal.title || '',
                          description: goal.description || '',
                          priority: (goal.priority as 'low' | 'medium' | 'high') || 'medium',
                          status: (goal.status as 'active' | 'completed' | 'paused') || 'active',
                          progress: goal.progress || 0,
                          target_date: goal.target_date || null,
                          category: goal.category || 'learning',
                          created_at: goal.created_at || new Date().toISOString()
                        }}
                      />
                    ) : null
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          )}
        </CardContent>
      </Card>

    </div>
  );
};
