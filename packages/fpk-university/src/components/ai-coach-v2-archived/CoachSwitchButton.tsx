import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RefreshCw } from 'lucide-react';
import { CoachPersona } from '@/hooks/useCoachSelection';

interface CoachSwitchButtonProps {
  currentCoach: CoachPersona;
  onSwitch: () => void;
  disabled?: boolean;
}

export function CoachSwitchButton({ currentCoach, onSwitch, disabled }: CoachSwitchButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const otherCoach = currentCoach === 'BETTY' ? 'Al' : 'Betty';

  const handleConfirm = () => {
    onSwitch();
    setShowConfirm(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowConfirm(true)}
        disabled={disabled}
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Switch to {otherCoach}
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch AI Coach?</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to switch from <strong>{currentCoach === 'BETTY' ? 'Betty' : 'Al'}</strong> to <strong>{otherCoach}</strong>. 
              Your conversation will continue, but the coaching style will change.
              {currentCoach === 'BETTY' ? (
                <span className="block mt-2">
                  Al will provide direct, factual answers instead of guided questions.
                </span>
              ) : (
                <span className="block mt-2">
                  Betty will guide you through questions instead of providing direct answers.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Switch Coach
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
