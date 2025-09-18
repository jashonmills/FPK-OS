import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Flag, Plus, Search, Filter, Target, TrendingUp } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';

export default function GoalsManagement() {
  const { currentOrg } = useOrgContext();

  if (!currentOrg) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <OrgCard>
          <OrgCardContent className="p-8 text-center">
            <p className="text-purple-200">No organization selected</p>
          </OrgCardContent>
        </OrgCard>
      </div>
    );
  }

  // Mock goals data for demonstration
  const mockGoals = [
    {
      id: '1',
      title: 'Improve Organization-wide Learning Completion Rate',
      description: 'Increase course completion rate to 90% across all students',
      targetValue: 90,
      currentValue: 78,
      category: 'learning',
      priority: 'high',
      dueDate: '2024-03-31',
      assignedStudents: 15,
      status: 'active'
    },
    {
      id: '2',
      title: 'Enhance Student Engagement Metrics',
      description: 'Achieve 95% weekly active student participation',
      targetValue: 95,
      currentValue: 82,
      category: 'engagement',
      priority: 'medium',
      dueDate: '2024-02-29',
      assignedStudents: 12,
      status: 'active'
    },
    {
      id: '3',
      title: 'Reduce Course Dropout Rate',
      description: 'Maintain course dropout rate below 10%',
      targetValue: 10,
      currentValue: 8,
      category: 'retention',
      priority: 'high',
      dueDate: '2024-06-30',
      assignedStudents: 20,
      status: 'achieved'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'default';
      case 'engagement': return 'secondary';
      case 'retention': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Goals</h1>
          <p className="text-white/80 mt-2 drop-shadow">
            Set and track organizational learning goals for your students
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Goal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-white/70" />
              <span className="text-sm font-medium text-white">Total Goals</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-white">3</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-white/70" />
              <span className="text-sm font-medium text-white">Active Goals</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-blue-300">2</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white/70" />
              <span className="text-sm font-medium text-white">Achieved</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-300">1</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Avg Progress</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-white">83%</div>
          </OrgCardContent>
        </OrgCard>
      </div>

      {/* Search and Filters */}
      <OrgCard className="bg-orange-500/65 border-orange-400/50">
        <OrgCardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
              <Input 
                placeholder="Search goals..." 
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
            </div>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </OrgCardHeader>
      </OrgCard>

      {/* Goals List */}
      <div className="space-y-4">
        {mockGoals.map((goal) => {
          const progressPercentage = goal.category === 'retention' 
            ? Math.max(0, 100 - (goal.currentValue / goal.targetValue * 100))
            : (goal.currentValue / goal.targetValue) * 100;
          
          return (
            <OrgCard key={goal.id} className="bg-orange-500/65 border-orange-400/50">
              <OrgCardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <OrgCardTitle className="text-lg text-white">{goal.title}</OrgCardTitle>
                    <OrgCardDescription className="text-white/80">{goal.description}</OrgCardDescription>
                    <div className="flex gap-2">
                      <Badge variant={getCategoryColor(goal.category) as any} className="bg-white/20 text-white border-white/30">
                        {goal.category}
                      </Badge>
                      <Badge variant={getPriorityColor(goal.priority) as any} className="bg-white/20 text-white border-white/30">
                        {goal.priority} priority
                      </Badge>
                      <Badge variant={goal.status === 'achieved' ? 'default' : 'secondary'} className="bg-white/20 text-white border-white/30">
                        {goal.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </OrgCardHeader>
              <OrgCardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium text-white">Target</div>
                    <div className="text-lg font-bold text-white">
                      {goal.targetValue}{goal.category === 'retention' ? '% max' : '%'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-white">Current</div>
                    <div className="text-lg font-bold text-white">
                      {goal.currentValue}{goal.category === 'retention' ? '% current' : '%'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-white">Progress</div>
                    <div className="text-lg font-bold mb-1 text-white">
                      {Math.round(progressPercentage)}%
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          progressPercentage >= 100 ? 'bg-green-300' : 
                          progressPercentage >= 75 ? 'bg-blue-300' : 
                          progressPercentage >= 50 ? 'bg-yellow-300' : 'bg-red-300'
                        }`}
                        style={{ width: `${Math.min(100, progressPercentage)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20">
                      View Details
                    </Button>
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                      Edit Goal
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                  <div className="text-sm text-white/80">
                    Due: {new Date(goal.dueDate).toLocaleDateString()} • 
                    Assigned to {goal.assignedStudents} students
                  </div>
                </div>
              </OrgCardContent>
            </OrgCard>
          );
        })}
      </div>
    </div>
  );
}