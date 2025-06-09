
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
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">
          <DualLanguageText translationKey="common.loading" fallback="Loading..." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  <DualLanguageText translationKey="goals.stats.totalGoals" fallback="Total Goals" />
                </p>
                <p className="text-xl font-bold">{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  <DualLanguageText translationKey="goals.stats.activeGoals" fallback="Active Goals" />
                </p>
                <p className="text-xl font-bold">{activeGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Trophy className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  <DualLanguageText translationKey="goals.stats.completedGoals" fallback="Completed" />
                </p>
                <p className="text-xl font-bold">{completedGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  <DualLanguageText translationKey="goals.stats.completionRate" fallback="Completion Rate" />
                </p>
                <p className="text-xl font-bold">
                  {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Management */}
      <Card className="fpk-card border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <DualLanguageText translationKey="goals.myGoals" fallback="My Goals" />
            </CardTitle>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="fpk-gradient text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              <DualLanguageText translationKey="goals.createNew" fallback="Create Goal" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <DualLanguageText translationKey="goals.tabs.all" fallback="All" />
                <Badge variant="secondary" className="ml-1">{goals.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <DualLanguageText translationKey="goals.tabs.active" fallback="Active" />
                <Badge variant="secondary" className="ml-1">{activeGoals.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <DualLanguageText translationKey="goals.tabs.completed" fallback="Completed" />
                <Badge variant="secondary" className="ml-1">{completedGoals.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="paused" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <DualLanguageText translationKey="goals.tabs.paused" fallback="Paused" />
                <Badge variant="secondary" className="ml-1">{pausedGoals.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {getFilteredGoals().length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    <DualLanguageText 
                      translationKey={`goals.empty.${activeTab}Title`} 
                      fallback="No goals found" 
                    />
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    <DualLanguageText 
                      translationKey={`goals.empty.${activeTab}Description`} 
                      fallback="Start by creating your first goal to track your learning progress" 
                    />
                  </p>
                  {activeTab === 'all' || activeTab === 'active' ? (
                    <Button 
                      onClick={() => setShowCreateForm(true)}
                      className="fpk-gradient text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <DualLanguageText translationKey="goals.createFirst" fallback="Create Your First Goal" />
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                <DualLanguageText translationKey="goals.createNew" fallback="Create New Goal" />
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCreateForm(false)}
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
