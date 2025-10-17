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

// Tier 1: High-Volume Clinical Documents
import { SPEECH_THERAPY_EVAL_PROMPT } from './speech-therapy-eval-prompt.ts';
import { PHYSICAL_THERAPY_EVAL_PROMPT } from './physical-therapy-eval-prompt.ts';
import { PLAN_504_PROMPT } from './504-plan-prompt.ts';
import { TRANSITION_PLAN_PROMPT } from './transition-plan-prompt.ts';
import { VISION_THERAPY_PROMPT } from './vision-therapy-prompt.ts';
import { AUDIOLOGY_PROMPT } from './audiology-prompt.ts';
import { FEEDING_NUTRITION_PROMPT } from './feeding-nutrition-prompt.ts';
import { ASSISTIVE_TECH_PROMPT } from './assistive-tech-prompt.ts';
import { RTI_PROMPT } from './rti-prompt.ts';

// Tier 2: Educational Records
import { REPORT_CARD_PROMPT } from './report-card-prompt.ts';
import { STANDARDIZED_TEST_PROMPT } from './standardized-test-prompt.ts';
import { DISCIPLINE_RECORD_PROMPT } from './discipline-record-prompt.ts';
import { CLASSROOM_OBSERVATION_PROMPT } from './classroom-observation-prompt.ts';
import { IEP_AMENDMENT_PROMPT } from './iep-amendment-prompt.ts';
import { IEP_ANNUAL_REVIEW_PROMPT } from './iep-annual-review-prompt.ts';
import { TRIENNIAL_EVAL_PROMPT } from './triennial-eval-prompt.ts';

// Tier 3: Medical/Clinical Records
import { MEDICATION_LOG_PROMPT } from './medication-log-prompt.ts';
import { SEIZURE_LOG_PROMPT } from './seizure-log-prompt.ts';
import { HOSPITAL_DISCHARGE_PROMPT } from './hospital-discharge-prompt.ts';

export function getSpecializedPrompt(docType: string): string | null {
  const promptMap: Record<string, string> = {
    // Core Educational Documents (Original 11)
    "Behavior Intervention Plan (BIP)": BIP_EXTRACTION_PROMPT,
    "Individualized Education Program (IEP)": IEP_EXTRACTION_PROMPT,
    "IEP Amendment": IEP_AMENDMENT_PROMPT,
    "IEP Annual Review": IEP_ANNUAL_REVIEW_PROMPT,
    "Progress Report": PROGRESS_REPORT_EXTRACTION_PROMPT,
    "Functional Behavior Assessment (FBA)": FBA_EXTRACTION_PROMPT,
    "Psychoeducational Evaluation": PSYCH_EVAL_EXTRACTION_PROMPT,
    "Neuropsychological Evaluation": PSYCH_EVAL_EXTRACTION_PROMPT,
    "Evaluation Team Report (ETR)": PSYCH_EVAL_EXTRACTION_PROMPT,
    "Triennial Evaluation": TRIENNIAL_EVAL_PROMPT,
    
    // Therapy Evaluations (Tier 1)
    "Speech-Language Evaluation": SPEECH_THERAPY_EVAL_PROMPT,
    "Speech Therapy Evaluation": SPEECH_THERAPY_EVAL_PROMPT,
    "Speech-Language Assessment": SPEECH_THERAPY_EVAL_PROMPT,
    "Physical Therapy Evaluation": PHYSICAL_THERAPY_EVAL_PROMPT,
    "PT Evaluation": PHYSICAL_THERAPY_EVAL_PROMPT,
    "Occupational Therapy Evaluation": OT_SENSORY_PROFILE_PROMPT,
    "OT Evaluation": OT_SENSORY_PROFILE_PROMPT,
    "Sensory Profile": OT_SENSORY_PROFILE_PROMPT,
    "OT Progress Notes": OT_SENSORY_PROFILE_PROMPT,
    "Vision Therapy Assessment": VISION_THERAPY_PROMPT,
    "Functional Vision Evaluation": VISION_THERAPY_PROMPT,
    "Audiology Report": AUDIOLOGY_PROMPT,
    "Hearing Assessment": AUDIOLOGY_PROMPT,
    "Audiological Evaluation": AUDIOLOGY_PROMPT,
    "Feeding Assessment": FEEDING_NUTRITION_PROMPT,
    "Nutrition Assessment": FEEDING_NUTRITION_PROMPT,
    "Swallowing Evaluation": FEEDING_NUTRITION_PROMPT,
    "Assistive Technology Evaluation": ASSISTIVE_TECH_PROMPT,
    "AT Assessment": ASSISTIVE_TECH_PROMPT,
    
    // Educational Support Documents (Tier 1)
    "504 Plan": PLAN_504_PROMPT,
    "Section 504 Plan": PLAN_504_PROMPT,
    "Transition Plan": TRANSITION_PLAN_PROMPT,
    "Post-Secondary Transition Plan": TRANSITION_PLAN_PROMPT,
    "RTI Documentation": RTI_PROMPT,
    "Response to Intervention": RTI_PROMPT,
    "MTSS Documentation": RTI_PROMPT,
    
    // Educational Records (Tier 2)
    "Report Card": REPORT_CARD_PROMPT,
    "Grade Report": REPORT_CARD_PROMPT,
    "Standardized Test Results": STANDARDIZED_TEST_PROMPT,
    "State Assessment Results": STANDARDIZED_TEST_PROMPT,
    "SBAC Results": STANDARDIZED_TEST_PROMPT,
    "PARCC Results": STANDARDIZED_TEST_PROMPT,
    "Discipline Record": DISCIPLINE_RECORD_PROMPT,
    "Suspension Notice": DISCIPLINE_RECORD_PROMPT,
    "Office Referral": DISCIPLINE_RECORD_PROMPT,
    "Classroom Observation": CLASSROOM_OBSERVATION_PROMPT,
    "Observation Notes": CLASSROOM_OBSERVATION_PROMPT,
    "Classroom Observation Data": CLASSROOM_OBSERVATION_PROMPT,
    
    // Medical/Clinical Records (Tier 3)
    "Medication Log": MEDICATION_LOG_PROMPT,
    "Medication Administration Record": MEDICATION_LOG_PROMPT,
    "MAR": MEDICATION_LOG_PROMPT,
    "Seizure Log": SEIZURE_LOG_PROMPT,
    "Seizure Tracking Log": SEIZURE_LOG_PROMPT,
    "Hospital Discharge Summary": HOSPITAL_DISCHARGE_PROMPT,
    "ED Summary": HOSPITAL_DISCHARGE_PROMPT,
    "Emergency Department Summary": HOSPITAL_DISCHARGE_PROMPT,
    
    // Daily Communication (Original)
    "Communication Log (Parent-Teacher)": DAILY_COMMUNICATION_LOG_PROMPT,
    "Teacher Progress Notes": DAILY_COMMUNICATION_LOG_PROMPT,
    
    // Structured Log Documents (Original)
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
