import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Target, Plus } from 'lucide-react';
import GoalCreateForm from './GoalCreateForm';
import DualLanguageText from '@/components/DualLanguageText';

interface GoalCreationDialogProps {
  children?: React.ReactNode;
  onGoalCreated?: () => void;
}

export const GoalCreationDialog: React.FC<GoalCreationDialogProps> = ({ 
  children, 
  onGoalCreated 
}) => {
  const [open, setOpen] = useState(false);

  const handleGoalCreated = () => {
    setOpen(false);
    if (onGoalCreated) {
      onGoalCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="fpk-gradient text-white">
            <Plus className="h-4 w-4 mr-2" />
            <DualLanguageText translationKey="goals.createNew" fallback="Create Goal" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Create a New Learning Goal
          </DialogTitle>
        </DialogHeader>
        <GoalCreateForm onGoalCreated={handleGoalCreated} />
      </DialogContent>
    </Dialog>
  );
};

export default GoalCreationDialog;