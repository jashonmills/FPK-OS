/**
 * Specialized extraction prompt for Vision Therapy Assessments
 */

export const VISION_THERAPY_PROMPT = `You are analyzing a **Vision Therapy Assessment** or **Functional Vision Evaluation**. This document assesses visual skills beyond basic acuity.

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the date of the vision assessment.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Visual Acuity
- distance_acuity_right (e.g., "20/40")
- distance_acuity_left
- near_acuity_right (e.g., "20/30")
- near_acuity_left

### SECTION 2: Oculomotor Skills
- tracking_smooth_pursuits (rating)
- saccades_accuracy (rating)
- fixation_stability (rating)

### SECTION 3: Binocular Vision
- convergence_near_point (cm)
- divergence_ability
- stereopsis_depth_perception (arc seconds)

### SECTION 4: Accommodative Function
- accommodation_flexibility
- accommodation_amplitude

### SECTION 5: Visual Perception
- visual_motor_integration_score
- visual_memory_score
- figure_ground_discrimination

### SECTION 6: Functional Vision Skills
- reading_stamina
- copying_accuracy
- visual_attention_span

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Distance Visual Acuity - Right Eye",
      "metric_type": "visual_acuity",
      "metric_value": 20,
      "metric_unit": "Snellen denominator (20/X)",
      "measurement_date": "2024-10-20",
      "context": "Right eye: 20/40. Reduced from expected 20/20. Corrected with glasses.",
      "target_value": 20
    },
    {
      "metric_name": "Convergence Near Point",
      "metric_type": "binocular_vision",
      "metric_value": 12,
      "metric_unit": "cm from nose",
      "measurement_date": "2024-10-20",
      "context": "Convergence breaks at 12cm. Expected: 6-10cm. Indicates convergence insufficiency.",
      "target_value": 8
    },
    {
      "metric_name": "VMI Standard Score",
      "metric_type": "visual_perception",
      "metric_value": 78,
      "metric_unit": "standard score",
      "measurement_date": "2024-10-20",
      "context": "Beery VMI: 78 (7th percentile). Below average visual-motor integration.",
      "target_value": 90
    }
  ],
  "insights": [
    {
      "title": "Convergence Insufficiency Impacts Near Work",
      "content": "Student demonstrates convergence insufficiency (near point: 12cm vs. expected 6-10cm). This contributes to eye strain, double vision, and reading fatigue. Recommend vision therapy 1x weekly.",
      "priority": "high",
      "insight_type": "diagnosis"
    }
  ],
  "progress": []
}
\`\`\`

## EXTRACTION RULES

1. **QUANTIFY ACUITY**: Convert "20/40" to denominator value (40)
2. **MEASURE DISTANCES**: Near point in cm
3. **NUMERIC SCORES**: Extract standardized test scores
4. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL`;