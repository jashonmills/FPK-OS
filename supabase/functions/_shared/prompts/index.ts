/**
 * Prompt selector for specialized document type extraction
 */

import { BIP_EXTRACTION_PROMPT } from './bip-prompt.ts';
import { IEP_EXTRACTION_PROMPT } from './iep-prompt.ts';
import { PSYCH_EVAL_EXTRACTION_PROMPT } from './psych-eval-prompt.ts';
import { OT_SENSORY_PROFILE_PROMPT } from './ot-sensory-prompt.ts';
import { DAILY_COMMUNICATION_LOG_PROMPT } from './daily-log-prompt.ts';
import { SLEEP_LOG_EXTRACTION_PROMPT } from './sleep-log-prompt.ts';
import { INCIDENT_LOG_EXTRACTION_PROMPT } from './incident-log-prompt.ts';
import { PARENT_LOG_EXTRACTION_PROMPT } from './parent-log-prompt.ts';
import { EDUCATOR_LOG_EXTRACTION_PROMPT } from './educator-log-prompt.ts';
import { FBA_EXTRACTION_PROMPT } from './fba-prompt.ts';
import { PROGRESS_REPORT_EXTRACTION_PROMPT } from './progress-report-prompt.ts';

export function getSpecializedPrompt(docType: string): string | null {
  const promptMap: Record<string, string> = {
    // Educational Documents
    "Behavior Intervention Plan (BIP)": BIP_EXTRACTION_PROMPT,
    "Individualized Education Program (IEP)": IEP_EXTRACTION_PROMPT,
    "IEP Amendment": IEP_EXTRACTION_PROMPT,
    "Progress Report": PROGRESS_REPORT_EXTRACTION_PROMPT,
    "Functional Behavior Assessment (FBA)": FBA_EXTRACTION_PROMPT,
    "Psychoeducational Evaluation": PSYCH_EVAL_EXTRACTION_PROMPT,
    "Neuropsychological Evaluation": PSYCH_EVAL_EXTRACTION_PROMPT,
    "Evaluation Team Report (ETR)": PSYCH_EVAL_EXTRACTION_PROMPT,
    
    // Therapy Documents
    "Occupational Therapy Evaluation": OT_SENSORY_PROFILE_PROMPT,
    "Sensory Profile": OT_SENSORY_PROFILE_PROMPT,
    "OT Progress Notes": OT_SENSORY_PROFILE_PROMPT,
    
    // Daily Communication
    "Communication Log (Parent-Teacher)": DAILY_COMMUNICATION_LOG_PROMPT,
    "Teacher Progress Notes": DAILY_COMMUNICATION_LOG_PROMPT,
    
    // Structured Log Documents
    "Sleep Log": SLEEP_LOG_EXTRACTION_PROMPT,
    "Sleep Tracking Log": SLEEP_LOG_EXTRACTION_PROMPT,
    "Incident Report Log": INCIDENT_LOG_EXTRACTION_PROMPT,
    "Behavioral Incident Report": INCIDENT_LOG_EXTRACTION_PROMPT,
    "Behavior Tracking Log": INCIDENT_LOG_EXTRACTION_PROMPT,
    "Incident Reports": INCIDENT_LOG_EXTRACTION_PROMPT,
    "Parent Home Log": PARENT_LOG_EXTRACTION_PROMPT,
    "Home Behavior Log": PARENT_LOG_EXTRACTION_PROMPT,
    "Parent Daily Notes": PARENT_LOG_EXTRACTION_PROMPT,
    "Educator Session Log": EDUCATOR_LOG_EXTRACTION_PROMPT,
    "Classroom Log": EDUCATOR_LOG_EXTRACTION_PROMPT,
    "Teacher Session Notes": EDUCATOR_LOG_EXTRACTION_PROMPT,
  };

  return promptMap[docType] || null;
}
