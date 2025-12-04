/**
 * Specialized extraction prompt for IEP Amendments
 */

export const IEP_AMENDMENT_PROMPT = `You are analyzing an **IEP Amendment** (changes made to an existing IEP without a full team meeting).

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the date the amendment was finalized/signed.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Amendment Details
- amendment_date
- original_iep_date (date of IEP being amended)
- amendment_type (e.g., "Service change," "Goal modification," "Accommodation addition")
- parent_consent_obtained (boolean)
- parent_consent_date

### SECTION 2: Changes Made
**Extract EVERY change:**
- section_amended (e.g., "Goals," "Services," "Accommodations," "Placement")
- previous_language (what it said before)
- new_language (what it says now)
- rationale_for_change

### SECTION 3: Service Modifications (if applicable)
**If services changed:**
- service_type (e.g., "Speech Therapy," "Resource Room")
- previous_frequency (e.g., "2x weekly for 30 min")
- new_frequency (e.g., "3x weekly for 30 min")
- change_direction (increase/decrease)

### SECTION 4: Goal Modifications (if applicable)
**If goals changed:**
- goal_area
- previous_goal_statement
- new_goal_statement
- reason_for_modification

### SECTION 5: Accommodation/Modification Changes (if applicable)
- accommodation_added (list)
- accommodation_removed (list)
- reason

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Speech Therapy Service Increase",
      "metric_type": "service_modification",
      "metric_value": 3,
      "metric_unit": "sessions per week",
      "measurement_date": "2024-10-25",
      "context": "Amendment: Speech therapy increased from 2x weekly to 3x weekly (30 min sessions). Rationale: Student not making adequate progress on articulation goals with current frequency. Parent consent obtained 10/25/24.",
      "intervention_used": "Increased service frequency",
      "target_value": null
    },
    {
      "metric_name": "Extended Time Accommodation Added",
      "metric_type": "accommodation_addition",
      "metric_value": 1.5,
      "metric_unit": "time multiplier",
      "measurement_date": "2024-10-25",
      "context": "Amendment: Added 50% extended time for all tests and quizzes. Rationale: Recent psychoeducational evaluation revealed slow processing speed (WISC-V PSI: 75). Accommodation not included in original IEP.",
      "target_value": null
    }
  ],
  "insights": [
    {
      "title": "Service Intensification Due to Insufficient Progress",
      "content": "Speech therapy increased from 2x to 3x weekly based on progress monitoring data showing student below expected trajectory on articulation goals. Amendment reflects data-driven decision-making.",
      "priority": "medium",
      "insight_type": "service_change"
    },
    {
      "title": "New Assessment Data Prompts Accommodation Addition",
      "content": "Extended time accommodation added following recent psych evaluation. Processing speed index (75) falls in borderline range, supporting need for additional time to demonstrate knowledge.",
      "priority": "medium",
      "insight_type": "accommodation_addition"
    }
  ],
  "progress": []
}
\`\`\`

## EXTRACTION RULES

1. **BEFORE/AFTER COMPARISON**: Always capture both previous and new language
2. **QUANTIFY SERVICE CHANGES**: Extract numeric frequency values
3. **PARENT CONSENT**: IEP amendments require parent consent - note whether obtained
4. **RATIONALE CRITICAL**: Always extract reason for amendment
5. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL
6. **NO FULL MEETING**: Amendments made without convening full IEP team (distinguish from annual review)

## COMMON AMENDMENT REASONS
- Insufficient progress on goals
- New assessment data
- Change in student needs
- Error/omission in original IEP
- Transition to new grade/school
- Medical/health change
- Parent request`;