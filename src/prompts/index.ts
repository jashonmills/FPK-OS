/**
 * Modular Prompt Architecture - Assembly System
 * 
 * This file assembles prompts from reusable modules, following the DRY principle
 * and enabling easy maintenance and experimentation with persona configurations.
 */

// Import core modules (shared by all personas)
import SAFETY_AND_ETHICS from './core/safety_and_ethics.md?raw';
import TONE_OF_VOICE from './core/tone_of_voice.md?raw';
import LANGUAGE_AND_STYLE from './core/language_and_style.md?raw';

// Import persona core modules
import BETTY_CORE from './personas/betty_socratic_core.md?raw';
import AL_DIRECT_CORE from './personas/al_direct_expert_core.md?raw';
import AL_SOCRATIC_SUPPORT from './personas/al_socratic_support.md?raw';

// Import skill modules
import VARY_AFFIRMATIONS from './skills/vary_affirmations.md?raw';
import HANDLE_TYPOS from './skills/handle_typos.md?raw';
import NO_META_REASONING from './skills/no_meta_reasoning.md?raw';
import SESSION_INITIALIZATION from './skills/session_initialization.md?raw';

/**
 * Module separator for clarity in assembled prompts
 */
const MODULE_SEPARATOR = '\n\n---\n\n';

/**
 * Assemble Betty's complete system prompt
 * 
 * Betty is the Socratic guide who uses questioning to develop deep understanding.
 * She needs: core rules, communication skills, and session management.
 */
export function buildBettyPrompt(): string {
  const modules = [
    NO_META_REASONING,        // Critical: Never expose internal thinking
    BETTY_CORE,               // Core Socratic method and AVCQ loop
    VARY_AFFIRMATIONS,        // Don't be repetitive
    HANDLE_TYPOS,             // Silently correct typos
    SESSION_INITIALIZATION,   // Handle different entry points
    TONE_OF_VOICE,            // Warm and encouraging
    LANGUAGE_AND_STYLE,       // Clear and concise
    SAFETY_AND_ETHICS,        // Never harmful or biased
  ];
  
  return modules.join(MODULE_SEPARATOR);
}

/**
 * Assemble Al's complete system prompt (Direct Expert Mode)
 * 
 * Al provides quick, factual answers. He needs: core identity, communication style,
 * and the same safety guardrails as Betty.
 */
export function buildAlPrompt(): string {
  const modules = [
    NO_META_REASONING,        // Critical: Never expose internal thinking
    AL_DIRECT_CORE,           // Core direct answer philosophy
    VARY_AFFIRMATIONS,        // Keep responses fresh
    HANDLE_TYPOS,             // Silently correct typos
    TONE_OF_VOICE,            // Friendly but efficient
    LANGUAGE_AND_STYLE,       // Clear and concise
    SAFETY_AND_ETHICS,        // Never harmful or biased
  ];
  
  return modules.join(MODULE_SEPARATOR);
}

/**
 * Assemble Al's enhanced system prompt (Socratic Support Mode)
 * 
 * This version of Al can interject during Socratic sessions to provide
 * factual clarifications, then hand back to Betty.
 */
export function buildAlSocraticSupportPrompt(): string {
  const modules = [
    NO_META_REASONING,        // Critical: Never expose internal thinking
    AL_DIRECT_CORE,           // Base direct answer philosophy
    AL_SOCRATIC_SUPPORT,      // Enhanced: Factual injection pattern
    VARY_AFFIRMATIONS,        // Keep responses fresh
    HANDLE_TYPOS,             // Silently correct typos
    TONE_OF_VOICE,            // Friendly but efficient
    LANGUAGE_AND_STYLE,       // Clear and concise
    SAFETY_AND_ETHICS,        // Never harmful or biased
  ];
  
  return modules.join(MODULE_SEPARATOR);
}

/**
 * Get a preview of a specific module (for debugging)
 */
export function getModulePreview(moduleName: string): string {
  const modules: Record<string, string> = {
    'safety': SAFETY_AND_ETHICS,
    'tone': TONE_OF_VOICE,
    'language': LANGUAGE_AND_STYLE,
    'betty_core': BETTY_CORE,
    'al_core': AL_DIRECT_CORE,
    'al_support': AL_SOCRATIC_SUPPORT,
    'vary_affirmations': VARY_AFFIRMATIONS,
    'handle_typos': HANDLE_TYPOS,
    'no_meta': NO_META_REASONING,
    'session_init': SESSION_INITIALIZATION,
  };
  
  return modules[moduleName] || 'Module not found';
}

/**
 * List all available modules (for debugging)
 */
export function listModules(): string[] {
  return [
    'safety',
    'tone',
    'language',
    'betty_core',
    'al_core',
    'al_support',
    'vary_affirmations',
    'handle_typos',
    'no_meta',
    'session_init',
  ];
}
