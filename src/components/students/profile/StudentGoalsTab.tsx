import React from 'react';
import { useStudentGoals } from '@/hooks/useStudentGoals';
import StudentGoalCard from '@/components/goals/StudentGoalCard';
import { Target, Loader2 } from 'lucide-react';

interface StudentGoalsTabProps {
  student: {
    id: string;
    full_name: string;
  };
  orgId: string;
}

export const StudentGoalsTab: React.FC<StudentGoalsTabProps> = ({ student, orgId }) => {
  const { goals, isLoading, refetch } = useStudentGoals();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading goals...</span>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Assigned</h3>
        <p className="text-sm text-gray-600">
          This student hasn't been assigned any goals yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <StudentGoalCard
            key={goal.id}
            goal={goal}
            onUpdate={refetch}
          />
        ))}
      </div>
    </div>
  );
};
