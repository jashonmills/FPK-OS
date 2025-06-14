
import { supabase } from '@/integrations/supabase/client';

interface ValidationResult {
  success: boolean;
  message: string;
  details?: any;
}

export const validateGoalCompletion = async (goalId: string, userId: string): Promise<ValidationResult> => {
  try {
    console.log('🧪 Starting goal completion validation for:', goalId);

    // Check if goal is marked as completed
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('*')
      .eq('id', goalId)
      .eq('user_id', userId)
      .single();

    if (goalError || !goal) {
      return {
        success: false,
        message: 'Goal not found or inaccessible'
      };
    }

    if (goal.status !== 'completed') {
      return {
        success: false,
        message: 'Goal is not marked as completed',
        details: { status: goal.status }
      };
    }

    // Check if XP event was created for goal completion
    const { data: xpEvents, error: xpError } = await supabase
      .from('xp_events')
      .select('*')
      .eq('user_id', userId)
      .eq('event_type', 'goal_completed')
      .gte('created_at', goal.completed_at || goal.updated_at)
      .order('created_at', { ascending: false })
      .limit(1);

    if (xpError) {
      return {
        success: false,
        message: 'Error checking XP events',
        details: xpError
      };
    }

    const xpAwarded = xpEvents && xpEvents.length > 0;

    // Check if any achievements were unlocked recently
    const { data: recentAchievements, error: achievementError } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .gte('unlocked_at', goal.completed_at || goal.updated_at)
      .order('unlocked_at', { ascending: false });

    if (achievementError) {
      return {
        success: false,
        message: 'Error checking achievements',
        details: achievementError
      };
    }

    // Get current user stats
    const { data: userXP, error: userXPError } = await supabase
      .from('user_xp')
      .select('*')
      .eq('user_id', userId)
      .single();

    const validation = {
      goalCompleted: true,
      xpAwarded,
      achievementsUnlocked: recentAchievements?.length || 0,
      currentXP: userXP?.total_xp || 0,
      currentLevel: userXP?.level || 1
    };

    console.log('✅ Goal completion validation results:', validation);

    return {
      success: true,
      message: `Goal completion validated successfully. XP awarded: ${xpAwarded}, Achievements: ${validation.achievementsUnlocked}`,
      details: validation
    };

  } catch (error) {
    console.error('❌ Goal completion validation failed:', error);
    return {
      success: false,
      message: 'Validation failed due to unexpected error',
      details: error
    };
  }
};

export const testGoalCompletionFlow = async (userId: string): Promise<ValidationResult> => {
  try {
    console.log('🧪 Testing end-to-end goal completion flow');

    // Create a test goal
    const { data: testGoal, error: createError } = await supabase
      .from('goals')
      .insert({
        user_id: userId,
        title: 'Test Goal - Auto Generated',
        description: 'This is a test goal for validation',
        category: 'learning',
        priority: 'medium',
        status: 'active',
        progress: 90
      })
      .select()
      .single();

    if (createError || !testGoal) {
      return {
        success: false,
        message: 'Failed to create test goal',
        details: createError
      };
    }

    console.log('✅ Test goal created:', testGoal.id);

    // Wait a moment for real-time subscriptions
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Complete the test goal
    const { data: completedGoal, error: completeError } = await supabase
      .from('goals')
      .update({
        status: 'completed',
        progress: 100,
        completed_at: new Date().toISOString()
      })
      .eq('id', testGoal.id)
      .select()
      .single();

    if (completeError) {
      return {
        success: false,
        message: 'Failed to complete test goal',
        details: completeError
      };
    }

    console.log('✅ Test goal completed');

    // Wait for async processes
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Validate the completion
    const validationResult = await validateGoalCompletion(testGoal.id, userId);

    // Clean up test goal
    await supabase
      .from('goals')
      .delete()
      .eq('id', testGoal.id);

    console.log('🧹 Test goal cleaned up');

    return {
      success: validationResult.success,
      message: `End-to-end test ${validationResult.success ? 'passed' : 'failed'}: ${validationResult.message}`,
      details: {
        testGoalId: testGoal.id,
        validation: validationResult.details
      }
    };

  } catch (error) {
    console.error('❌ End-to-end test failed:', error);
    return {
      success: false,
      message: 'End-to-end test failed due to unexpected error',
      details: error
    };
  }
};
