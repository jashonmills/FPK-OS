
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
import ReadingProgressWidget from './ReadingProgressWidget';

export const GoalsDashboard = () => {
  const { goals = [], loading } = useGoals(); // Add default empty array
  const { t } = useDualLanguage();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="text-gray-500 text-sm sm:text-base">
          <DualLanguageText translationKey="common.loading" fallback="Loading..." />
        </div>
      </div>
    );
  }

  // Safe array length checks
  const totalGoals = goals?.length || 0;
  const activeGoalsCount = activeGoals?.length || 0;
  const completedGoalsCount = completedGoals?.length || 0;
  const pausedGoalsCount = pausedGoals?.length || 0;

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Stats Overview and Reading Widget */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4">
        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <div className="p-1 sm:p-1.5 md:p-2 bg-blue-100 rounded-lg flex-shrink-0 w-fit">
                <Target className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  <DualLanguageText translationKey="goals.stats.totalGoals" fallback="Total Goals" />
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold">{totalGoals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <div className="p-1 sm:p-1.5 md:p-2 bg-green-100 rounded-lg flex-shrink-0 w-fit">
                <Target className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-600" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  <DualLanguageText translationKey="goals.stats.activeGoals" fallback="Active" />
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold">{activeGoalsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <div className="p-1 sm:p-1.5 md:p-2 bg-amber-100 rounded-lg flex-shrink-0 w-fit">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-amber-600" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  <DualLanguageText translationKey="goals.stats.completedGoals" fallback="Complete" />
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold">{completedGoalsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <div className="p-1 sm:p-1.5 md:p-2 bg-purple-100 rounded-lg flex-shrink-0 w-fit">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-purple-600" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  <DualLanguageText translationKey="goals.stats.completionRate" fallback="Rate" />
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold">
                  {totalGoals > 0 ? Math.round((completedGoalsCount / totalGoals) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reading Progress Widget - NEW */}
        <ReadingProgressWidget />
      </div>

      {/* Goals Management - Improved tablet layout */}
      <Card className="fpk-card border-0 shadow-lg">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
              <span className="truncate">
                <DualLanguageText translationKey="goals.myGoals" fallback="My Goals" />
              </span>
            </CardTitle>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="fpk-gradient text-white text-sm sm:text-base px-3 sm:px-4 py-2 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                <DualLanguageText translationKey="goals.createNew" fallback="Create Goal" />
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Improved tablet-friendly tabs */}
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
                    <Button 
                      onClick={() => setShowCreateForm(true)}
                      className="fpk-gradient text-white text-sm px-4 py-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <DualLanguageText translationKey="goals.createFirst" fallback="Create Your First Goal" />
                    </Button>
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
                          created_at: goal.created_at || new Date().toISOString()
                        }} 
                      />
                    ) : null
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Goal Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold truncate mr-2">
                <DualLanguageText translationKey="goals.createNew" fallback="Create New Goal" />
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCreateForm(false)}
                className="flex-shrink-0"
              >
                ×
              </Button>
            </div>
            <GoalCreateForm />
          </div>
        </div>
      )}
    </div>
  );
};
