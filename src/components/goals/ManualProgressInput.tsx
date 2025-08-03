import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { TrendingUp, Percent } from 'lucide-react';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';
import { useGoals } from '@/hooks/useGoals';
import { useAnalyticsPublisher } from '@/hooks/useAnalyticsEventBus';
import { useXPIntegration } from '@/hooks/useXPIntegration';
import { useNotifications } from '@/services/notificationService';
import { toast } from '@/hooks/use-toast';

interface ManualProgressInputProps {
  goalId: string;
  currentProgress: number;
  goalTitle: string;
  goalCategory?: string;
  goalPriority?: string;
}

const ManualProgressInput: React.FC<ManualProgressInputProps> = ({
  goalId,
  currentProgress,
  goalTitle,
  goalCategory = 'learning',
  goalPriority = 'medium'
}) => {
  const { t } = useDualLanguage();
  const { updateGoal } = useGoals();
  const analytics = useAnalyticsPublisher();
  const { awardGoalCompletionXP } = useXPIntegration();
  const { sendGoalCompletedNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [newProgress, setNewProgress] = useState([currentProgress]);
  const [progressNote, setProgressNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProgressUpdate = async () => {
    if (newProgress[0] === currentProgress) {
      setIsOpen(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const progressValue = Math.max(0, Math.min(100, newProgress[0]));
      
      // Update goal progress
      await updateGoal(goalId, { 
        progress: progressValue,
        ...(progressValue === 100 && { 
          status: 'completed', 
          completed_at: new Date().toISOString() 
        })
      });

      // Track analytics
      analytics.publishProgressUpdated(goalId, currentProgress, progressValue, {
        manual: true,
        note: progressNote || null,
        completed: progressValue === 100
      });

      // Award XP and send notification if goal is completed
      if (progressValue === 100) {
        const xpEarned = goalPriority === 'high' ? 50 : goalPriority === 'medium' ? 30 : 20;
        await awardGoalCompletionXP(goalCategory, goalPriority);
        await sendGoalCompletedNotification(goalTitle, xpEarned);
      }

      // Show success toast
      const isCompleted = progressValue === 100;
      if (isCompleted) {
        toast({ title: 'Goal completed! 🎉', description: 'Congratulations on reaching your goal!' });
      } else {
        toast({ title: 'Progress updated', description: `Updated to ${progressValue}%` });
      }

      setIsOpen(false);
      setProgressNote('');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({ title: 'Error', description: 'Failed to update progress', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressDelta = newProgress[0] - currentProgress;
  const isIncrease = progressDelta > 0;
  const isDecrease = progressDelta < 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <TrendingUp className="h-3 w-3 mr-1" />
          <DualLanguageText translationKey="goals.progress.update" fallback="Update Progress" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            <DualLanguageText translationKey="goals.progress.title" fallback="Update Progress" />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Goal Title */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium line-clamp-2">{goalTitle}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Current: {currentProgress}%
            </p>
          </div>

          {/* Progress Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              <DualLanguageText translationKey="goals.progress.newValue" fallback="New Progress Value" />
            </Label>
            <div className="space-y-3">
              <Slider
                value={newProgress}
                onValueChange={setNewProgress}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">0%</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={newProgress[0]}
                    onChange={(e) => setNewProgress([parseInt(e.target.value) || 0])}
                    min={0}
                    max={100}
                    className="w-16 h-8 text-xs text-center"
                  />
                  <span className="text-xs">%</span>
                </div>
                <span className="text-muted-foreground">100%</span>
              </div>
            </div>
          </div>

          {/* Progress Change Indicator */}
          {progressDelta !== 0 && (
            <div className={`p-3 rounded-lg ${
              isIncrease ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
            }`}>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className={`h-4 w-4 ${
                  isIncrease ? 'text-green-600 rotate-0' : 'text-orange-600 rotate-180'
                }`} />
                <span className={`font-medium ${
                  isIncrease ? 'text-green-700' : 'text-orange-700'
                }`}>
                  {isIncrease ? '+' : ''}{progressDelta}% change
                </span>
              </div>
              {newProgress[0] === 100 && (
                <p className="text-xs text-green-600 mt-1">
                  🎉 This will mark your goal as completed!
                </p>
              )}
            </div>
          )}

          {/* Optional Note */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              <DualLanguageText 
                translationKey="goals.progress.note" 
                fallback="Progress Note (Optional)" 
              />
            </Label>
            <Textarea
              placeholder="What did you accomplish? What helped you make progress?"
              value={progressNote}
              onChange={(e) => setProgressNote(e.target.value)}
              className="text-sm resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
            className="text-sm"
          >
            <DualLanguageText translationKey="common.cancel" fallback="Cancel" />
          </Button>
          <Button 
            onClick={handleProgressUpdate}
            disabled={isSubmitting || newProgress[0] === currentProgress}
            className="text-sm"
          >
            {isSubmitting ? (
              <DualLanguageText translationKey="common.updating" fallback="Updating..." />
            ) : (
              <DualLanguageText translationKey="goals.progress.save" fallback="Update Progress" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualProgressInput;