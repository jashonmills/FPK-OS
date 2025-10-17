/**
 * Specialized extraction prompt for Triennial Evaluation Summaries
 */

export const TRIENNIAL_EVAL_PROMPT = `You are analyzing a **Triennial Evaluation Summary** or **Three-Year Reevaluation** (comprehensive reassessment every 3 years for special education eligibility).

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the date of the evaluation completion or eligibility determination meeting.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Continued Eligibility Determination
- continues_to_meet_eligibility (boolean)
- disability_category (current)
- disability_category_changed (boolean)
- previous_category (if changed)

### SECTION 2: Comprehensive Assessment Battery
**Extract EVERY test administered:**
- assessment_name
- assessor_role
- test_date
- overall_score
- interpretation

### SECTION 3: Multi-Disciplinary Team Members
**Extract team participants:**
- team_member_role
- assessment_area_evaluated

### SECTION 4: Comparative Data (3-Year Trend)
**Compare current to previous triennial:**
- domain_assessed
- score_3_years_ago
- current_score
- trend_direction

### SECTION 5: Impact on Education Statement
- adverse_educational_impact (boolean)
- areas_of_impact
- specialized_instruction_needed (boolean)

### SECTION 6: Recommendations
- continue_special_education (boolean)
- recommended_services
- recommended_placement

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "WISC-V Full Scale IQ - Triennial",
      "metric_type": "cognitive_assessment",
      "metric_value": 78,
      "metric_unit": "standard score",
      "measurement_date": "2024-10-15",
      "context": "WISC-V FSIQ: 78 (7th percentile). Borderline range. Previous triennial (2021): 75. Slight increase but remains in same classification.",
      "target_value": null
    },
    {
      "metric_name": "WIAT-4 Reading Composite - Triennial",
      "metric_type": "academic_achievement",
      "metric_value": 72,
      "metric_unit": "standard score",
      "measurement_date": "2024-10-15",
      "context": "WIAT-4 Reading: 72 (3rd percentile). Well below average. Previous triennial (2021): 68. 4-point gain over 3 years. Significant discrepancy from cognitive potential.",
      "target_value": null
    }
  ],
  "insights": [
    {
      "title": "Continued Eligibility - Specific Learning Disability",
      "content": "Student continues to meet eligibility criteria for SLD in reading. Despite 3 years of specialized instruction, significant discrepancy persists between cognitive ability (78) and reading achievement (72). Adverse educational impact documented.",
      "priority": "high",
      "insight_type": "eligibility_determination"
    }
  ],
  "progress": []
}
\`\`\`

## EXTRACTION RULES

1. **3-YEAR COMPARISON**: Always extract previous triennial scores when provided
2. **MULTI-DISCIPLINARY**: Note all team members/assessments
3. **ELIGIBILITY CRITERIA**: Extract specific criteria met
4. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL`;