/**
 * Specialized extraction prompt for Physical Therapy Evaluations
 */

export const PHYSICAL_THERAPY_EVAL_PROMPT = `You are analyzing a **Physical Therapy Evaluation**. This document assesses gross motor skills, mobility, strength, and functional movement.

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

The \`measurement_date\` is the date the evaluation was conducted.

**How to find it:**
1. Look for "Date of Evaluation," "Assessment Date"
2. Use "Date of Report" if evaluation date not specified

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Standardized Test Scores
**Extract for EACH test:**
- test_name (e.g., "PDMS-2 Gross Motor Quotient," "BOT-2")
- standard_score
- percentile_rank
- age_equivalent

### SECTION 2: Range of Motion (ROM)
**Extract for EACH joint assessed:**
- joint_name (e.g., "Right Knee Flexion," "Left Hip Abduction")
- rom_degrees (numeric)
- within_normal_limits (boolean)
- limitations (if present)

### SECTION 3: Muscle Strength
**Extract for EACH muscle group:**
- muscle_group (e.g., "Quadriceps," "Hip Flexors")
- strength_grade (e.g., "4/5," "3+/5") → Convert to numeric 0-5 scale
- side (left/right/bilateral)

### SECTION 4: Gross Motor Skills
**Extract functional abilities:**
- skill_name (e.g., "Walking," "Stair Climbing," "Running")
- independence_level (e.g., "Independent," "Moderate Assistance," "Maximum Assistance")
- quality_rating (if provided)

### SECTION 5: Balance and Coordination
**Extract:**
- static_balance (e.g., "Stands on one foot for 8 seconds")
- dynamic_balance (e.g., "Requires hand-hold for walking on uneven surfaces")
- coordination_assessment

### SECTION 6: Gait Analysis
**Extract:**
- gait_pattern (e.g., "Antalgic," "Toe-walking," "Wide-based")
- assistive_devices (e.g., "Walker," "AFOs," "None")
- gait_speed (if measured)

### SECTION 7: Recommendations
**Extract:**
- therapy_frequency (e.g., "2x weekly for 45 minutes")
- equipment_needs (e.g., "AFOs," "Gait trainer")
- goal_areas

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "PDMS-2 Gross Motor Quotient",
      "metric_type": "standardized_assessment",
      "metric_value": 72,
      "metric_unit": "standard score",
      "measurement_date": "2024-10-01",
      "context": "Percentile: 3rd. Age Equivalent: 3 years 8 months. Below average gross motor development.",
      "target_value": 90
    },
    {
      "metric_name": "Right Knee Flexion ROM",
      "metric_type": "range_of_motion",
      "metric_value": 110,
      "metric_unit": "degrees",
      "measurement_date": "2024-10-01",
      "context": "Within normal limits (WNL). Expected range: 0-135 degrees.",
      "target_value": 135
    },
    {
      "metric_name": "Quadriceps Strength - Bilateral",
      "metric_type": "muscle_strength",
      "metric_value": 3.5,
      "metric_unit": "MMT grade (0-5 scale)",
      "measurement_date": "2024-10-01",
      "context": "Manual muscle testing grade: 3+/5. Fair+ strength bilaterally. Reduced from age-expected 5/5.",
      "target_value": 5
    },
    {
      "metric_name": "Stair Climbing",
      "metric_type": "functional_mobility",
      "metric_value": 2,
      "metric_unit": "independence (1=max assist, 5=independent)",
      "measurement_date": "2024-10-01",
      "context": "Requires moderate assistance and hand-rail. Step-to pattern, no reciprocal stepping.",
      "target_value": 5
    }
  ],
  "insights": [
    {
      "title": "Significant Gross Motor Delay - 3rd Percentile",
      "content": "Student demonstrates gross motor skills at 3rd percentile (PDMS-2 GMQ: 72), equivalent to a 3-year-8-month level. Primary deficits in bilateral coordination, balance, and lower extremity strength.",
      "priority": "high",
      "insight_type": "diagnosis"
    },
    {
      "title": "Reduced Lower Extremity Strength Impacts Function",
      "content": "Bilateral quadriceps weakness (3+/5) contributes to difficulty with stairs, running, and jumping. Recommend strengthening exercises and functional mobility training 2x weekly.",
      "priority": "high",
      "insight_type": "intervention_recommendation"
    }
  ],
  "progress": []
}
\`\`\`

## EXTRACTION RULES

1. **CONVERT MMT GRADES**: Translate "4/5" to 4.0, "3+/5" to 3.5, etc.
2. **QUANTIFY ROM**: Always extract degree measurements
3. **FUNCTIONAL LEVELS**: Map descriptive levels to numeric scales
4. **PRESERVE LATERALITY**: Always note left/right/bilateral
5. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL

## COMMON SECTION HEADERS
- "Chief Complaint"
- "Range of Motion"
- "Muscle Strength"
- "Gross Motor Skills"
- "Balance"
- "Coordination"
- "Gait Analysis"
- "Functional Mobility"
- "Clinical Observations"
- "Standardized Testing"
- "Goals and Recommendations"`;