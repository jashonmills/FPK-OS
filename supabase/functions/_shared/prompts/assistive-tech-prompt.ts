/**
 * Specialized extraction prompt for Assistive Technology Evaluations
 */

export const ASSISTIVE_TECH_PROMPT = `You are analyzing an **Assistive Technology (AT) Evaluation** or **AT Assessment**.

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the date of the AT evaluation.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Functional Limitations Identified
- task_area (e.g., "Written communication," "Access to curriculum," "Mobility")
- current_performance_level
- barrier_description

### SECTION 2: AT Devices Recommended
**Extract for EACH device:**
- device_name (e.g., "iPad with TouchChat AAC app," "FM system," "Slant board")
- device_category (e.g., "AAC," "Writing," "Positioning," "Access," "Vision," "Hearing")
- purpose (functional goal addressed)
- trial_status (e.g., "Recommended for trial," "Trial successful," "Not recommended")

### SECTION 3: AT Services Recommended
- training_needed (for student/staff/family)
- implementation_support
- maintenance_plan

### SECTION 4: Low-Tech vs. High-Tech Solutions
- low_tech_solutions (e.g., "Pencil grips," "Highlighted text," "Visual schedules")
- mid_tech_solutions (e.g., "Battery-operated recorder," "Simple switches")
- high_tech_solutions (e.g., "Speech-generating device," "Eye-gaze system")

### SECTION 5: Trial Results (if conducted)
- device_trialed
- trial_duration
- success_indicators
- student_preference

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "TouchChat AAC App on iPad",
      "metric_type": "at_device_recommended",
      "metric_value": 1,
      "metric_unit": "recommendation status (1=yes)",
      "measurement_date": "2024-10-12",
      "context": "High-tech AAC device. Student trialed for 2 weeks. Successfully communicated wants/needs using core vocabulary board. Recommend for educational and home use.",
      "target_value": null
    },
    {
      "metric_name": "Slant Board for Writing",
      "metric_type": "at_device_recommended",
      "metric_value": 1,
      "metric_unit": "recommendation status",
      "measurement_date": "2024-10-12",
      "context": "Low-tech positioning device. Improves wrist extension and letter formation. Recommend 20-degree angle slant board for all written work.",
      "target_value": null
    },
    {
      "metric_name": "Text-to-Speech Software",
      "metric_type": "at_device_recommended",
      "metric_value": 1,
      "metric_unit": "recommendation status",
      "measurement_date": "2024-10-12",
      "context": "Mid-tech reading support. Student comprehension improved from 40% to 75% when text read aloud via Natural Reader. Recommend for all grade-level reading assignments.",
      "target_value": null
    }
  ],
  "insights": [
    {
      "title": "AAC Device Supports Functional Communication",
      "content": "Student successfully used TouchChat AAC app to make requests, answer questions, and participate in classroom activities during 2-week trial. Recommend device acquisition through school district.",
      "priority": "high",
      "insight_type": "device_recommendation"
    },
    {
      "title": "Multi-Modal AT Approach Recommended",
      "content": "Combination of low-tech (slant board, pencil grips), mid-tech (text-to-speech), and high-tech (AAC device) solutions addresses barriers across writing, reading, and communication domains.",
      "priority": "medium",
      "insight_type": "intervention_plan"
    }
  ],
  "progress": []
}
\`\`\`

## EXTRACTION RULES

1. **DEVICE SPECIFICITY**: Use exact device names/models when provided
2. **TRIAL DATA**: Extract trial outcomes quantitatively when possible
3. **CATEGORICAL CLARITY**: Distinguish low/mid/high-tech
4. **FUNCTIONAL OUTCOMES**: Always link device to specific task it addresses
5. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL (use 1/0 for boolean recommendations)`;