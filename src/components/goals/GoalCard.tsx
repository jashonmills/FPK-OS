
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Calendar, MoreHorizontal, Pause } from 'lucide-react';

interface Goal {
  id: number;
  title: string;
  description: string;
  status: string;
  progress: number;
  dueDate: string;
}

interface GoalCardProps {
  goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { getAccessibilityClasses } = useAccessibility();
  const textClasses = getAccessibilityClasses('text');
  const cardClasses = getAccessibilityClasses('card');

  return (
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
};

export default GoalCard;
