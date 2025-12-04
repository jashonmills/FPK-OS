/**
 * Specialized extraction prompt for Seizure Tracking Logs
 */

export const SEIZURE_LOG_PROMPT = `You are analyzing a **Seizure Log** or **Seizure Tracking Record**.

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the date each seizure occurred.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Seizure Event Details
**Extract for EACH seizure:**
- seizure_date
- seizure_time
- seizure_type (e.g., "Tonic-clonic," "Absence," "Focal," "Atonic")
- duration_seconds
- location_occurred (e.g., "Classroom," "Home," "Playground")

### SECTION 2: Seizure Characteristics
- warning_signs_present (aura)
- level_of_consciousness (e.g., "Conscious," "Impaired awareness," "Unconscious")
- motor_symptoms (e.g., "Full body jerking," "Staring," "Lip smacking")
- post_ictal_state (recovery period description)

### SECTION 3: Triggers Identified
- potential_trigger (e.g., "Missed medication," "Sleep deprivation," "Flashing lights," "Stress")
- time_since_last_medication

### SECTION 4: Emergency Response
- emergency_medication_given (boolean)
- medication_name_dose (e.g., "Diastat 5mg rectal gel")
- time_medication_given
- ems_called (boolean)
- hospitalization_required (boolean)

### SECTION 5: Recovery
- recovery_time_minutes
- returned_to_activity (boolean)
- sent_home (boolean)
- parent_notified (boolean)

### SECTION 6: Frequency Tracking
- seizures_this_week
- seizures_this_month
- pattern_notes

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Tonic-Clonic Seizure Event",
      "metric_type": "seizure_event",
      "metric_value": 1,
      "metric_unit": "event count",
      "measurement_date": "2024-10-20",
      "start_time": "10:45",
      "duration_minutes": 2,
      "context": "Tonic-clonic seizure in classroom. Duration: 2 min 15 sec. No aura reported. Full loss of consciousness. Post-ictal confusion for 15 minutes. Diastat NOT required (seizure self-terminated). Parent notified, student sent home.",
      "intervention_used": "Standard seizure protocol, no emergency medication",
      "target_value": null
    },
    {
      "metric_name": "Seizure Frequency - October",
      "metric_type": "seizure_frequency",
      "metric_value": 3,
      "metric_unit": "seizures per month",
      "measurement_date": "2024-10-31",
      "context": "October: 3 seizures (10/5, 10/20, 10/28). All tonic-clonic type. Average duration: 90 seconds. Possible trigger: All occurred in morning before 11am. Medication adherence: 95%.",
      "target_value": 0
    }
  ],
  "insights": [
    {
      "title": "Increased Seizure Frequency - Medical Consult Needed",
      "content": "3 seizures in October vs. 1 in September. All morning occurrences suggest possible medication timing issue. Recommend neurology consultation to review medication regimen.",
      "priority": "high",
      "insight_type": "medical_concern"
    }
  ],
  "progress": [
    {
      "metric_type": "seizure_control",
      "current_value": 3,
      "target_value": 0,
      "baseline_value": 1,
      "trend": "increasing",
      "notes": "Seizure frequency increased from baseline. All tonic-clonic, morning pattern. Emergency medication not required."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **DURATION PRECISION**: Convert to seconds or minutes consistently
2. **TYPE SPECIFICITY**: Use medical terminology for seizure classification
3. **EMERGENCY RESPONSE**: Always note if emergency med used
4. **PATTERN TRACKING**: Calculate frequency per week/month
5. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL
6. **SAFETY CRITICAL**: Note hospitalization/EMS involvement`;