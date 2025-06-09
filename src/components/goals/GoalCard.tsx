
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Heart, 
  Briefcase, 
  Trophy, 
  Calendar,
  CheckCircle,
  Edit,
  Trash2,
  Play,
  Pause
} from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Goal = Database['public']['Tables']['goals']['Row'];

interface GoalCardProps {
  goal: Goal;
  onComplete: (id: string) => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
}

const GoalCard = ({ goal, onComplete, onUpdate, onDelete }: GoalCardProps) => {
  const categoryIcons = {
    learning: BookOpen,
    health: Heart,
    career: Briefcase,
    personal: Trophy,
  };

  const categoryColors = {
    learning: 'bg-purple-100 text-purple-700',
    health: 'bg-red-100 text-red-700',
    career: 'bg-blue-100 text-blue-700',
    personal: 'bg-green-100 text-green-700',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-red-100 text-red-700',
  };

  const statusColors = {
    active: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    paused: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const Icon = categoryIcons[goal.category as keyof typeof categoryIcons] || BookOpen;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = goal.target_date && goal.status === 'active' && 
    new Date(goal.target_date) < new Date();

  return (
    <Card className="fpk-card border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${categoryColors[goal.category as keyof typeof categoryColors]}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 leading-tight">
                {goal.title}
              </h3>
              {goal.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {goal.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge 
                  variant="secondary" 
                  className={priorityColors[goal.priority as keyof typeof priorityColors]}
                >
                  {goal.priority} priority
                </Badge>
                <Badge 
                  variant="secondary"
                  className={statusColors[goal.status as keyof typeof statusColors]}
                >
                  {goal.status}
                </Badge>
                {goal.target_date && (
                  <Badge 
                    variant="outline" 
                    className={`${isOverdue ? 'border-red-500 text-red-700' : 'border-gray-300'}`}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(goal.target_date)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          {goal.status === 'active' && goal.progress < 100 && (
            <Button
              onClick={() => onComplete(goal.id)}
              size="sm"
              className="fpk-gradient text-white"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Button>
          )}
          
          {goal.status === 'active' && (
            <Button
              onClick={() => onUpdate(goal.id, { status: 'paused' })}
              size="sm"
              variant="outline"
            >
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
          )}
          
          {goal.status === 'paused' && (
            <Button
              onClick={() => onUpdate(goal.id, { status: 'active' })}
              size="sm"
              variant="outline"
            >
              <Play className="h-4 w-4 mr-1" />
              Resume
            </Button>
          )}

          <Button
            onClick={() => onDelete(goal.id)}
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Celebration for completed goals */}
        {goal.status === 'completed' && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Goal Completed! 🎉</span>
            </div>
            {goal.completed_at && (
              <p className="text-sm text-green-700 mt-1">
                Completed on {formatDate(goal.completed_at)}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalCard;
