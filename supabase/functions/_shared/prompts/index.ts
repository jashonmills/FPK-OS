/**
 * Prompt selector for specialized document type extraction
 */

import { BIP_EXTRACTION_PROMPT } from './bip-prompt.ts';
import { IEP_EXTRACTION_PROMPT } from './iep-prompt.ts';
import { PSYCH_EVAL_EXTRACTION_PROMPT } from './psych-eval-prompt.ts';
import { OT_SENSORY_PROFILE_PROMPT } from './ot-sensory-prompt.ts';
import { DAILY_COMMUNICATION_LOG_PROMPT } from './daily-log-prompt.ts';

export function getSpecializedPrompt(docType: string): string | null {
  const promptMap: Record<string, string> = {
    "Behavior Intervention Plan (BIP)": BIP_EXTRACTION_PROMPT,
    "Individualized Education Program (IEP)": IEP_EXTRACTION_PROMPT,
    "IEP Amendment": IEP_EXTRACTION_PROMPT,
    "Progress Report": IEP_EXTRACTION_PROMPT,
    "Psychoeducational Evaluation": PSYCH_EVAL_EXTRACTION_PROMPT,
    "Neuropsychological Evaluation": PSYCH_EVAL_EXTRACTION_PROMPT,
    "Evaluation Team Report (ETR)": PSYCH_EVAL_EXTRACTION_PROMPT,
    "Occupational Therapy Evaluation": OT_SENSORY_PROFILE_PROMPT,
    "Sensory Profile": OT_SENSORY_PROFILE_PROMPT,
    "Communication Log (Parent-Teacher)": DAILY_COMMUNICATION_LOG_PROMPT,
    "Teacher Progress Notes": DAILY_COMMUNICATION_LOG_PROMPT,
  };

  return promptMap[docType] || null;
}
