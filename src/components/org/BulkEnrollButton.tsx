import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BulkEnrollButtonProps {
  orgId: string;
}

export function BulkEnrollButton({ orgId }: BulkEnrollButtonProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  const handleBulkEnroll = async () => {
    setIsEnrolling(true);
    try {
      const { data, error } = await supabase.functions.invoke('bulk-enroll-org-students', {
        body: { orgId }
      });

      if (error) throw error;

      toast({
        title: "Bulk Enrollment Complete",
        description: `Successfully enrolled ${data.newEnrollments} students in required courses. ${data.alreadyEnrolled} students were already enrolled.`,
      });

      // Refresh the page to show updated enrollments
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Bulk enrollment error:', error);
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to enroll students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowConfirmDialog(true)}
        disabled={isEnrolling}
        variant="outline"
        size="sm"
      >
        {isEnrolling ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Enrolling...
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            Bulk Enroll Students
          </>
        )}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Enrollment</AlertDialogTitle>
            <AlertDialogDescription>
              This will enroll all active students in this organization into the required courses:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Empowering Learning: Handwriting</li>
                <li>Empowering Learning: Numeracy</li>
                <li>Empowering Learning: Reading</li>
                <li>Empowering Learning: State</li>
                <li>Interactive Geometry Course</li>
              </ul>
              <p className="mt-2">Students already enrolled will be skipped.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkEnroll}>
              Enroll All Students
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
