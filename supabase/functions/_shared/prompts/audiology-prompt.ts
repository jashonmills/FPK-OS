/**
 * Specialized extraction prompt for Audiology Reports
 */

export const AUDIOLOGY_PROMPT = `You are analyzing an **Audiology Evaluation** or **Hearing Assessment**.

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the date of the audiological assessment.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Pure Tone Audiometry
**Extract hearing thresholds (dB HL) for each frequency:**
- ear (left/right)
- frequency_hz (250, 500, 1000, 2000, 4000, 8000 Hz)
- threshold_db_hl (numeric)
- conduction_type (air/bone)

### SECTION 2: Speech Audiometry
- speech_reception_threshold_right (dB HL)
- speech_reception_threshold_left
- word_recognition_score_right (percentage)
- word_recognition_score_left

### SECTION 3: Tympanometry
- tympanogram_type_right (e.g., "Type A," "Type B," "Type C")
- tympanogram_type_left
- middle_ear_pressure_right (daPa)
- middle_ear_pressure_left

### SECTION 4: Hearing Classification
- hearing_level_right (e.g., "Normal," "Mild," "Moderate," "Severe," "Profound")
- hearing_level_left
- hearing_loss_type (e.g., "Sensorineural," "Conductive," "Mixed")

### SECTION 5: Recommendations
- hearing_aid_recommended (boolean)
- fm_system_recommended (boolean)
- preferential_seating_recommended (boolean)
- educational_accommodations

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Pure Tone Average - Right Ear",
      "metric_type": "hearing_threshold",
      "metric_value": 35,
      "metric_unit": "dB HL",
      "measurement_date": "2024-09-25",
      "context": "4-frequency average (500, 1000, 2000, 4000 Hz): 35 dB HL. Indicates mild hearing loss.",
      "target_value": 20
    },
    {
      "metric_name": "Word Recognition Score - Right Ear",
      "metric_type": "speech_discrimination",
      "metric_value": 88,
      "metric_unit": "percent correct",
      "measurement_date": "2024-09-25",
      "context": "WRS at 50 dB HL: 88%. Fair discrimination ability.",
      "target_value": 95
    }
  ],
  "insights": [
    {
      "title": "Bilateral Mild Hearing Loss",
      "content": "Student presents with bilateral mild sensorineural hearing loss (PTA: Right 35 dB, Left 32 dB). Recommend hearing aids and preferential seating in classroom.",
      "priority": "high",
      "insight_type": "diagnosis"
    }
  ],
  "progress": []
}
\`\`\`

## EXTRACTION RULES

1. **AVERAGE THRESHOLDS**: Calculate PTA (pure tone average) from frequencies
2. **LATERALITY**: Always note left vs. right ear
3. **QUANTIFY dB LEVELS**: Extract numeric thresholds
4. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL`;