// Socratic State Machine Orchestrator
export type SocraticState = 'ASK' | 'WAIT' | 'EVALUATE' | 'NUDGE' | 'NEXT' | 'COMPLETED';

interface StateTransitionOptions {
  score?: number;
  nudgeCount?: number;
  maxNudges?: number;
}

/**
 * Determines the next state in the Socratic learning flow
 */
export function nextSocraticState(
  currentState: SocraticState,
  options: StateTransitionOptions = {}
): SocraticState {
  const { score = 0, nudgeCount = 0, maxNudges = 3 } = options;

  switch (currentState) {
    case 'ASK':
      // After asking a question, wait for student response
      return 'WAIT';

    case 'WAIT':
      // After receiving response, evaluate it
      return 'EVALUATE';

    case 'EVALUATE':
      // If score is 3, move to next question
      if (score >= 3) return 'NEXT';
      
      // If too many nudges, provide stronger hint and move on
      if (nudgeCount >= maxNudges) return 'NEXT';
      
      // Otherwise, provide a nudge/hint
      return 'NUDGE';

    case 'NUDGE':
      // After nudging, wait for another attempt
      return 'WAIT';

    case 'NEXT':
      // After moving to next concept, wait for response to new question
      return 'WAIT';

    case 'COMPLETED':
      // Session is complete
      return 'COMPLETED';

    default:
      return 'ASK';
  }
}

/**
 * Clamps score to valid 0-3 range
 */
export function clampScore(score: number | undefined | null): number {
  if (score == null || Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(3, Math.round(score)));
}

/**
 * Calculates average score from history
 */
export function calculateAverageScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return Math.round((sum / scores.length) * 10) / 10;
}

/**
 * Determines if learner has mastered the topic
 */
export function hasMastered(scores: number[]): boolean {
  if (scores.length < 3) return false;
  const recentScores = scores.slice(-3);
  return recentScores.every(score => score >= 3);
}

/**
 * Determines difficulty level based on performance
 */
export function getDifficultyLevel(scores: number[]): 'basic' | 'intermediate' | 'advanced' {
  const avgScore = calculateAverageScore(scores);
  if (avgScore >= 2.5) return 'advanced';
  if (avgScore >= 1.5) return 'intermediate';
  return 'basic';
}
