
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

export function useXPSystem() {
  const [isAwarding, setIsAwarding] = useState(false);
  const { user } = useAuth();

  const awardXP = useCallback(async (amount: number, reason: string) => {
    if (!user?.id || isAwarding) return;

    setIsAwarding(true);
    try {
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('total_xp')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching current XP:', fetchError);
        return;
      }

      const newTotalXP = (currentProfile?.total_xp || 0) + amount;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ total_xp: newTotalXP })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating XP:', updateError);
        throw updateError;
      }

      toast({
        title: `+${amount} XP Earned!`,
        description: reason,
        duration: 3000,
      });

      console.log(`XP awarded: +${amount} for ${reason}. Total XP: ${newTotalXP}`);
    } catch (error) {
      console.error('Failed to award XP:', error);
    } finally {
      setIsAwarding(false);
    }
  }, [user?.id, isAwarding]);

  const calculateModuleXP = useCallback((moduleId: string) => {
    // Base XP for completing a module
    const baseXP = 50;
    // Bonus XP for early modules (encourages starting)
    const moduleNumber = parseInt(moduleId.replace('module-', ''));
    const bonusXP = Math.max(0, 20 - moduleNumber * 2);
    return baseXP + bonusXP;
  }, []);

  const calculateProgressXP = useCallback((percentage: number) => {
    // Award XP for major milestones
    if (percentage >= 100) return 100; // Course completion bonus
    if (percentage >= 75) return 25;
    if (percentage >= 50) return 15;
    if (percentage >= 25) return 10;
    return 0;
  }, []);

  return {
    awardXP,
    calculateModuleXP,
    calculateProgressXP,
    isAwarding,
  };
}
