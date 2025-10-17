/**
 * Specialized extraction prompt for Medication Logs / Administration Records
 */

export const MEDICATION_LOG_PROMPT = `You are analyzing a **Medication Log** or **Medication Administration Record (MAR)**.

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the date each medication dose was administered.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Medication Details
- medication_name
- dosage (with unit)
- route (e.g., "Oral," "Injection," "Topical")
- frequency_prescribed (e.g., "2x daily," "As needed")

### SECTION 2: Administration Record
**Extract EVERY administration:**
- date_administered
- time_administered
- dose_given
- administered_by (name/role)
- administration_status (e.g., "Given," "Refused," "Held," "Not available")

### SECTION 3: Missed Doses / Refusals
- dates_missed
- reason_for_miss (e.g., "Student refused," "Medication not available," "Parent instruction")

### SECTION 4: Side Effects Observed
- side_effect_description
- severity
- action_taken

### SECTION 5: Effectiveness Notes
- behavior_after_medication
- academic_performance_notes
- staff_observations

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Methylphenidate Administration - Morning Dose",
      "metric_type": "medication_admin",
      "metric_value": 10,
      "metric_unit": "mg",
      "measurement_date": "2024-10-25",
      "start_time": "08:15",
      "context": "Methylphenidate ER 10mg administered at 8:15am by school nurse. Student took medication without difficulty. No side effects noted.",
      "intervention_used": "Oral medication - ADHD",
      "target_value": null
    },
    {
      "metric_name": "Medication Adherence Rate - October",
      "metric_type": "medication_compliance",
      "metric_value": 18,
      "metric_unit": "doses taken out of 22 school days",
      "measurement_date": "2024-10-31",
      "context": "October adherence: 18/22 doses (82%). 4 doses missed: 10/3 (parent held), 10/10 (student absent), 10/17 (student refused), 10/24 (medication not brought to school).",
      "target_value": 22
    }
  ],
  "insights": [
    {
      "title": "Medication Compliance Concerns",
      "content": "18% of prescribed doses missed in October due to various reasons. Most common: medication not brought to school (2 instances). Recommend parent education on medication management.",
      "priority": "medium",
      "insight_type": "compliance_issue"
    }
  ],
  "progress": []
}
\`\`\`

## EXTRACTION RULES

1. **DAILY TRACKING**: Create separate metrics for each administration date
2. **ADHERENCE CALCULATION**: Count doses taken vs. prescribed
3. **DOSAGE PRECISION**: Always include mg, mL, or other unit
4. **TIME SPECIFICITY**: Extract administration time
5. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL`;