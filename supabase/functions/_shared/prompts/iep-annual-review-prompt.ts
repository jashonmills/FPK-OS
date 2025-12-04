/**
 * Specialized extraction prompt for IEP Annual Reviews
 */

export const IEP_ANNUAL_REVIEW_PROMPT = `You are analyzing an **IEP Annual Review** (yearly evaluation of student progress toward IEP goals).

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the date of the annual review meeting.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Goal Progress Summary
**Extract for EACH IEP goal:**
- goal_area (e.g., "Reading Comprehension," "Math Calculation")
- goal_statement
- baseline_performance (when goal was written)
- current_performance
- progress_status (e.g., "Mastered," "Adequate progress," "Insufficient progress," "Regression")
- percentage_of_goal_achieved

### SECTION 2: Service Effectiveness
**For EACH service:**
- service_type (e.g., "Resource Room," "Speech Therapy")
- frequency_provided (actual vs. mandated)
- attendance_percentage
- effectiveness_rating

### SECTION 3: Assessment Data
- standardized_test_results (if administered)
- curriculum_based_measures
- work_samples_analysis

### SECTION 4: Present Levels Update
- academic_functioning_summary
- functional_performance_summary
- changes_from_previous_year

### SECTION 5: Continuation/Changes Decision
- continue_special_education (boolean)
- eligibility_category (if changed)
- placement_changes
- service_changes

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Reading Fluency Goal - Annual Progress",
      "metric_type": "goal_progress",
      "metric_value": 85,
      "metric_unit": "percentage of goal achieved",
      "measurement_date": "2024-10-28",
      "context": "Goal: Increase ORF from 42 wcpm to 80 wcpm by annual review. Baseline: 42 wcpm (Sept 2023). Current: 74 wcpm (Oct 2024). Progress: 32 wcpm gain (84% of 38 wcpm target gain). Status: Adequate progress toward goal.",
      "target_value": 100
    },
    {
      "metric_name": "Math Calculation Goal - Annual Progress",
      "metric_type": "goal_progress",
      "metric_value": 45,
      "metric_unit": "percentage of goal achieved",
      "measurement_date": "2024-10-28",
      "context": "Goal: Solve 2-digit addition with regrouping at 80% accuracy. Baseline: 40% accuracy. Current: 58% accuracy. Progress: 18 percentage points gain (45% of 40-point target gain). Status: Insufficient progress - recommend goal continuation.",
      "target_value": 100
    }
  ],
  "insights": [
    {
      "title": "Mixed Progress Across Goal Areas",
      "content": "Student demonstrated adequate progress in reading (84% of goal) but insufficient progress in math (45% of goal). Team recommends increasing math intervention from 2x to 3x weekly.",
      "priority": "high",
      "insight_type": "progress_summary"
    }
  ],
  "progress": [
    {
      "metric_type": "overall_iep_progress",
      "current_value": 65,
      "target_value": 80,
      "baseline_value": 0,
      "trend": "increasing",
      "notes": "65% average goal attainment across all 8 annual goals. 5 goals adequate progress, 3 goals insufficient progress."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **CALCULATE GOAL ATTAINMENT**: (Current - Baseline) / (Target - Baseline) × 100
2. **QUANTIFY PROGRESS**: Extract numeric scores wherever possible
3. **SERVICE FIDELITY**: Note if services delivered as mandated
4. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL`;