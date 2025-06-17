
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { 
  Target, 
  Plus, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Pause,
  MoreHorizontal,
  Award,
  Flag
} from 'lucide-react';

const Goals = () => {
  const { t, renderText, tString } = useGlobalTranslation('goals');
  const { getAccessibilityClasses } = useAccessibility();
  const [activeTab, setActiveTab] = useState('all');

  // Apply accessibility classes
  const containerClasses = getAccessibilityClasses('container');
  const textClasses = getAccessibilityClasses('text');
  const cardClasses = getAccessibilityClasses('card');

  // Mock data for goals
  const mockGoals = [
    {
      id: 1,
      title: 'Complete React Course',
      description: 'Finish all modules in the React course by the end of the month.',
      status: 'in-progress',
      progress: 60,
      dueDate: '2024-08-31',
    },
    {
      id: 2,
      title: 'Study 30 Minutes Daily',
      description: 'Dedicate at least 30 minutes each day to studying new material.',
      status: 'active',
      progress: 30,
      dueDate: '2024-09-15',
    },
    {
      id: 3,
      title: 'Learn a New JavaScript Framework',
      description: 'Explore and understand the basics of Vue.js.',
      status: 'paused',
      progress: 0,
      dueDate: '2024-10-01',
    },
    {
      id: 4,
      title: 'Master TypeScript',
      description: 'Become proficient in TypeScript by completing advanced tutorials.',
      status: 'completed',
      progress: 100,
      dueDate: '2024-07-31',
    },
    {
      id: 5,
      title: 'Contribute to Open Source',
      description: 'Make a meaningful contribution to a project on GitHub.',
      status: 'active',
      progress: 80,
      dueDate: '2024-09-30',
    },
  ];

  const EmptyState = ({ title, description, textClasses, cardClasses }: { title: string, description: string, textClasses: string, cardClasses: string }) => (
    <Card className={`fpk-card text-center py-12 ${cardClasses}`}>
      <CardContent>
        <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className={`text-lg font-semibold mb-2 ${textClasses}`}>{title}</h3>
        <p className={`text-gray-600 mb-4 ${textClasses}`}>{description}</p>
        <Button className={textClasses}>Create New Goal</Button>
      </CardContent>
    </Card>
  );

  const GoalCard = ({ goal, textClasses, cardClasses }: { goal: any, textClasses: string, cardClasses: string }) => (
    <Card className={`fpk-card hover:shadow-lg transition-shadow ${cardClasses}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg font-semibold ${textClasses}`}>{goal.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit Goal</DropdownMenuItem>
              <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
              <DropdownMenuItem>Pause Goal</DropdownMenuItem>
              <DropdownMenuItem>Delete Goal</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span className={textClasses}>Due: {goal.dueDate}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className={`text-sm text-gray-600 ${textClasses}`}>{goal.description}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className={`text-gray-600 ${textClasses}`}>Progress</span>
            <span className={`font-medium ${textClasses}`}>{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={textClasses}>{goal.status}</Badge>
          {goal.status === 'active' && (
            <Button variant="outline" size="sm" className={textClasses}>
              <Pause className="h-4 w-4 mr-2" />
              Pause Goal
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`p-3 md:p-6 space-y-4 md:space-y-6 ${containerClasses}`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-amber-600 bg-clip-text text-transparent ${textClasses}`}>
            {renderText(t('myGoals'))}
          </h1>
          <p className={`text-gray-600 mt-1 text-sm md:text-base ${textClasses}`}>
            Track your learning objectives and celebrate your achievements.
          </p>
        </div>
        
        <Button className={`gap-2 ${textClasses}`}>
          <Plus className="h-4 w-4" />
          {renderText(t('createNew'))}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className={`fpk-card ${cardClasses}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium text-gray-600 ${textClasses}`}>
                  {renderText(t('stats.totalGoals'))}
                </p>
                <p className={`text-xl md:text-2xl font-bold ${textClasses}`}>12</p>
              </div>
              <Target className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={`fpk-card ${cardClasses}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium text-gray-600 ${textClasses}`}>
                  {renderText(t('stats.activeGoals'))}
                </p>
                <p className={`text-xl md:text-2xl font-bold ${textClasses}`}>7</p>
              </div>
              <Flag className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={`fpk-card ${cardClasses}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium text-gray-600 ${textClasses}`}>
                  {renderText(t('stats.completedGoals'))}
                </p>
                <p className={`text-xl md:text-2xl font-bold ${textClasses}`}>5</p>
              </div>
              <CheckCircle className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={`fpk-card ${cardClasses}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium text-gray-600 ${textClasses}`}>
                  {renderText(t('stats.completionRate'))}
                </p>
                <p className={`text-xl md:text-2xl font-bold ${textClasses}`}>68%</p>
              </div>
              <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`w-full ${textClasses}`}>
          <TabsTrigger value="all" className={textClasses}>
            {renderText(t('tabs.all'))}
          </TabsTrigger>
          <TabsTrigger value="active" className={textClasses}>
            {renderText(t('tabs.active'))}
          </TabsTrigger>
          <TabsTrigger value="completed" className={textClasses}>
            {renderText(t('tabs.completed'))}
          </TabsTrigger>
          <TabsTrigger value="paused" className={textClasses}>
            {renderText(t('tabs.paused'))}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {mockGoals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {mockGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} textClasses={textClasses} cardClasses={cardClasses} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title={tString('empty.allTitle', 'No goals yet')}
              description={tString('empty.allDescription', 'Create your first goal to get started')}
              textClasses={textClasses}
              cardClasses={cardClasses}
            />
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {mockGoals.filter(goal => goal.status === 'active').length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {mockGoals.filter(goal => goal.status === 'active').map((goal) => (
                <GoalCard key={goal.id} goal={goal} textClasses={textClasses} cardClasses={cardClasses} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title={tString('empty.activeTitle', 'No active goals')}
              description={tString('empty.activeDescription', 'Set an active goal to track your progress')}
              textClasses={textClasses}
              cardClasses={cardClasses}
            />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {mockGoals.filter(goal => goal.status === 'completed').length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {mockGoals.filter(goal => goal.status === 'completed').map((goal) => (
                <GoalCard key={goal.id} goal={goal} textClasses={textClasses} cardClasses={cardClasses} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title={tString('empty.completedTitle', 'No completed goals')}
              description={tString('empty.completedDescription', 'Complete a goal to see it here')}
              textClasses={textClasses}
              cardClasses={cardClasses}
            />
          )}
        </TabsContent>

        <TabsContent value="paused" className="space-y-4">
          {mockGoals.filter(goal => goal.status === 'paused').length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {mockGoals.filter(goal => goal.status === 'paused').map((goal) => (
                <GoalCard key={goal.id} goal={goal} textClasses={textClasses} cardClasses={cardClasses} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title={tString('empty.pausedTitle', 'No paused goals')}
              description={tString('empty.pausedDescription', 'Paused goals will appear here')}
              textClasses={textClasses}
              cardClasses={cardClasses}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Goals;
