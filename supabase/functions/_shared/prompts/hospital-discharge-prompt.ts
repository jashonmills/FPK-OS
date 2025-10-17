/**
 * Specialized extraction prompt for Hospital Discharge Summaries
 */

export const HOSPITAL_DISCHARGE_PROMPT = `You are analyzing a **Hospital Discharge Summary** or **Emergency Department Summary**.

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the discharge date.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Admission/Discharge Details
- admission_date
- discharge_date
- length_of_stay_days
- admission_diagnosis
- discharge_diagnosis
- hospital_department (e.g., "Pediatrics," "Emergency Department," "PICU")

### SECTION 2: Reason for Hospitalization
- chief_complaint
- presenting_symptoms
- precipitating_event

### SECTION 3: Treatments/Procedures
**Extract EVERY intervention:**
- procedure_name
- date_performed
- outcome

### SECTION 4: Medications
- medications_during_hospitalization
- discharge_medications (new prescriptions)
- medication_changes_from_baseline

### SECTION 5: Test Results
**Extract key findings:**
- test_type (e.g., "MRI Brain," "Blood work," "EEG")
- result_summary
- abnormal_findings

### SECTION 6: Discharge Instructions
- activity_restrictions
- diet_restrictions
- return_to_school_date
- follow_up_appointments
- warning_signs_to_monitor

### SECTION 7: Educational Impact
- recommended_school_accommodations
- medical_excuse_duration
- physical_restrictions_for_school

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Hospital Admission - Pneumonia",
      "metric_type": "hospitalization",
      "metric_value": 5,
      "metric_unit": "length of stay (days)",
      "measurement_date": "2024-10-18",
      "context": "Admission: 10/13/24. Discharge: 10/18/24. Diagnosis: Bilateral pneumonia. Treatment: IV antibiotics, oxygen support. Discharged on oral antibiotics. Cleared to return to school 10/28/24 with activity restrictions.",
      "intervention_used": "Inpatient hospitalization - antibiotics and supportive care",
      "target_value": null
    },
    {
      "metric_name": "Activity Restriction - Post-Discharge",
      "metric_type": "medical_restriction",
      "metric_value": 14,
      "metric_unit": "days of restriction",
      "measurement_date": "2024-10-18",
      "context": "Post-discharge restrictions: No PE/recess for 2 weeks (through 11/1/24). May attend class but avoid strenuous activity. Extra rest breaks as needed.",
      "target_value": null
    }
  ],
  "insights": [
    {
      "title": "5-Day Hospitalization Requires School Reintegration Plan",
      "content": "Student hospitalized 5 days for pneumonia. Missed full week of school (10/13-10/18). Cleared to return 10/28 with restrictions: no PE/recess for 2 weeks, extra rest breaks. Recommend homebound instruction for 10/21-10/25.",
      "priority": "high",
      "insight_type": "educational_impact"
    }
  ],
  "progress": []
}
\`\`\`

## EXTRACTION RULES

1. **CALCULATE LENGTH OF STAY**: Discharge date minus admission date
2. **MEDICATION CHANGES**: Note new/discontinued/dose-changed meds
3. **SCHOOL IMPACT**: Extract return-to-school date and restrictions
4. **FOLLOW-UP**: Note upcoming medical appointments
5. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL`;