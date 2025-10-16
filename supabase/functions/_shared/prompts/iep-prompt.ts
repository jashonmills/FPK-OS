/**
 * Specialized extraction prompt for Individualized Education Programs (IEP)
 * Extracts ALL goals with baseline/current/target values, services, and accommodations
 */

export const IEP_EXTRACTION_PROMPT = `You are analyzing an **Individualized Education Program (IEP)**. This is a legally binding document requiring COMPLETE extraction of all educational data.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Annual Goals (EXTRACT EVERY SINGLE GOAL)
**Location:** "Annual Goals," "IEP Goals," "Measurable Goals"
**For EACH goal, extract:**
- goal_title (e.g., "Reading Comprehension," "Math Problem Solving," "Social Communication")
- goal_description (full text of the goal)
- baseline_value (e.g., "Currently reads at 45 WPM")
- current_value (if different from baseline)
- target_value (e.g., "Will read at 80 WPM")
- measurement_method (e.g., "CBM probes," "Teacher observation," "Work samples")
- evaluation_criteria (e.g., "4 out of 5 trials," "80% accuracy")
- goal_area (e.g., "Reading," "Math," "Communication," "Behavior," "Social Skills")
- target_date (when goal should be met)

**CRITICAL:** If an IEP lists 12 goals, you MUST extract all 12 as separate entries.

### SECTION 2: Present Levels of Academic Achievement and Functional Performance (PLOP/PLAAFP)
**Extract current performance data:**
- academic_area (e.g., "Reading Fluency")
- current_performance_level (e.g., "55 WPM on grade-level text")
- strengths (specific academic/functional strengths)
- areas_of_concern (specific deficits or challenges)

### SECTION 3: Special Education Services
**Extract for EACH service:**
- service_type (e.g., "Speech Therapy," "Resource Room," "Counseling")
- frequency (e.g., "2 times per week," "Daily")
- duration (e.g., "30 minutes," "60 minutes")
- location (e.g., "General education classroom," "Therapy room")
- provider (e.g., "SLP," "Special Education Teacher")
- start_date and end_date (if provided)

### SECTION 4: Accommodations and Modifications
**Extract EACH accommodation:**
- accommodation_name (e.g., "Extended time (1.5x)," "Small group testing," "Visual supports")
- setting_applied (e.g., "All settings," "Testing only," "Math class only")

### SECTION 5: Participation in State/District Assessments
**Extract:**
- assessment_participation (e.g., "General assessment with accommodations," "Alternate assessment")
- specific_accommodations_for_testing

### SECTION 6: Progress Monitoring
**Extract:**
- how_progress_will_be_measured
- reporting_frequency (e.g., "Quarterly," "Every 6 weeks")

## OUTPUT FORMAT

Return a single JSON object:

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Reading Fluency (Words Per Minute)",
      "metric_type": "academic_performance",
      "metric_value": 55,
      "metric_unit": "words per minute",
      "measurement_date": "2025-01-15",
      "context": "Grade-level text, measured via CBM probes",
      "target_value": 80,
      "intervention_used": "Daily fluency practice with resource teacher"
    },
    {
      "metric_name": "Math Problem Solving (Multi-Step Problems)",
      "metric_type": "academic_performance",
      "metric_value": 3,
      "metric_unit": "correct out of 10",
      "measurement_date": "2025-01-15",
      "context": "2-step word problems requiring computation and reasoning",
      "target_value": 8,
      "intervention_used": "Explicit instruction with visual aids"
    }
  ],
  "insights": [
    {
      "title": "Gap in Reading Fluency",
      "content": "Student currently reads at 55 WPM (grade-level expectation: 90 WPM). IEP goal targets 80 WPM by end of year through daily fluency practice and repeated reading interventions.",
      "priority": "high",
      "insight_type": "academic_need"
    },
    {
      "title": "Comprehensive Service Plan",
      "content": "IEP mandates 300 minutes/week of specialized instruction (60 min/day in resource room) + 60 min/week speech therapy + 30 min/week counseling. Accommodations include extended time (1.5x) and preferential seating.",
      "priority": "medium",
      "insight_type": "service_summary"
    }
  ],
  "progress": [
    {
      "metric_type": "reading_comprehension",
      "current_value": 55,
      "target_value": 80,
      "baseline_value": 45,
      "trend": "improving",
      "notes": "Annual Goal: By May 2026, student will read grade-level text at 80 WPM with 95% accuracy in 4/5 trials. Measurement: CBM oral reading fluency probes."
    },
    {
      "metric_type": "math_problem_solving",
      "current_value": 30,
      "target_value": 80,
      "baseline_value": 20,
      "trend": "improving",
      "notes": "Annual Goal: Student will solve 2-step word problems with 80% accuracy in 4/5 trials by May 2026."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **EXTRACT ALL GOALS**: Do not skip or summarize. Each goal = separate metric + progress entry
2. **QUANTIFY BASELINES AND TARGETS**: Convert "Student reads below grade level" to the EXACT metric if provided (e.g., 55 WPM)
3. **SERVICE MINUTES ARE CRITICAL**: Extract exact minutes per week for each service (IEPs are legally required to specify this)
4. **INCLUDE MEASUREMENT METHODS**: "Teacher observation" vs. "Standardized assessment" vs. "CBM probes" - these matter
5. **PLOP DATA = CURRENT PERFORMANCE**: Extract current levels as metric_value entries
6. **NO INFERENCE**: If baseline is stated as "Student struggles with transitions" but no frequency is given, don't create a numeric metric

## COMMON IEP SECTION HEADERS
- "Present Levels of Academic Achievement and Functional Performance (PLAAFP)"
- "Measurable Annual Goals"
- "Benchmarks/Short-Term Objectives"
- "Special Education and Related Services"
- "Supplementary Aids and Services"
- "Program Modifications"
- "Supports for School Personnel"
- "Participation in State/District Assessments"
- "Transition Services" (for students 14+)`;
