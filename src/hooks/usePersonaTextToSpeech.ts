/**
 * @deprecated This hook has been merged into the unified useTextToSpeech hook.
 * 
 * MIGRATION GUIDE:
 * ------------------
 * Old API:
 *   const { speak } = useTextToSpeech(); // from usePersonaTextToSpeech
 *   speak(text, 'BETTY');
 * 
 * New API:
 *   import { useTextToSpeech } from '@/hooks/useTextToSpeech';
 *   const { speak } = useTextToSpeech();
 *   speak(text, 'BETTY'); // Same API!
 * 
 * The unified hook now includes:
 * - Premium voice selection (Windows 11 Neural, Google Chrome, macOS)
 * - 4-tier intelligent fallback system
 * - Backward compatibility with legacy options API
 * - Persona-aware voice selection for Betty, Al, and Nite Owl
 * 
 * This file will be removed in a future version.
 */

// Re-export the unified hook for backward compatibility
export { useTextToSpeech } from './useTextToSpeech';
