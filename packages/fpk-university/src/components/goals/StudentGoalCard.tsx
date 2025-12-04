import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Calendar, Target } from 'lucide-react';
import { format } from 'date-fns';
import StudentGoalDetailsModal from './StudentGoalDetailsModal';

interface StudentGoalCardProps {
  goal: {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    target_date?: string;
    progress: number;
    target_status: string;
    created_at: string;
  };
  onUpdate: () => void;
}

const StudentGoalCard: React.FC<StudentGoalCardProps> = ({ goal, onUpdate }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card className="org-tile backdrop-blur-sm border shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {goal.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getPriorityColor(goal.priority)}>
                  {goal.priority}
                </Badge>
                <Badge className={getStatusColor(goal.target_status)}>
                  {goal.target_status}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(true)}
              className="text-white hover:bg-white/10 flex-shrink-0"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-white/90 line-clamp-2">
            {goal.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Progress</span>
              <span className="font-medium text-white">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-xs text-white/70 pt-2">
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span>{goal.category}</span>
            </div>
            {goal.target_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Due {format(new Date(goal.target_date), 'MMM dd')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <StudentGoalDetailsModal
        goal={goal}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default StudentGoalCard;
