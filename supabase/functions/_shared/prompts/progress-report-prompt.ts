/**
 * Specialized extraction prompt for Progress Reports
 * Optimized for extracting goal progress, current performance levels, and trends
 */

export const PROGRESS_REPORT_EXTRACTION_PROMPT = `You are analyzing a **Progress Report** (IEP Progress Report, Quarterly Update, or Annual Review). This document tracks student progress toward established goals.

## CRITICAL: MEASUREMENT DATE EXTRACTION (NON-NEGOTIABLE)

**RULE #1: Every metric MUST have a measurement_date**

The \`measurement_date\` is the date the progress was ACTUALLY MEASURED, not the date the report was generated.

**How to find it:**
1. **Primary Source:** Look for "Progress as of [date]" or "Data collected through [date]"
2. **Secondary Source:** Use the reporting period end date (e.g., "Quarter 2: 10/1/2024 - 12/20/2024" → use "2024-12-20")
3. **Report Date:** Use the report generation date (e.g., "Report Date: January 15, 2025")
4. **Default:** If no specific date can be found, use the report date

**Examples:**
- "Progress as of December 15, 2024" → measurement_date: "2024-12-15"
- "Q2 Progress Report (10/1/24 - 12/20/24)" → measurement_date: "2024-12-20"
- "Report generated on 1/10/2025" → measurement_date: "2025-01-10"

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: IEP Goal Progress (HIGHEST PRIORITY)
**Location:** Look for "Annual Goals," "Goal Progress," "Progress Toward Goals"
**Extract for EACH goal:**
- goal_title (e.g., "Increase reading fluency to 80 words per minute")
- goal_type (e.g., "academic_fluency," "social_skill," "communication")
- baseline_value (starting performance level)
- current_value (progress as of report date)
- target_value (end-of-year goal)
- progress_percentage (if stated, e.g., "75% progress toward goal")
- progress_status (e.g., "On Track," "Limited Progress," "Mastered," "Regression")
- measurement_date: "YYYY-MM-DD"

**CRITICAL:** If the report shows:
- "Goal: Read 80 words per minute. Baseline: 45 wpm. Current: 62 wpm. Progress: Adequate"

You MUST extract:
- baseline_value: 45
- current_value: 62
- target_value: 80
- progress_percentage: 42.5 (calculated: (62-45)/(80-45) * 100)
- metric_unit: "words_per_minute"

### SECTION 2: Academic Performance Metrics
**Location:** "Academic Progress," "Subject-Specific Performance," "Report Card Data"
**Extract for EACH subject:**
- metric_name (e.g., "Math Computation," "Reading Comprehension")
- metric_type: "academic_performance"
- metric_value (current performance - could be score, percentage, or grade level)
- metric_unit (e.g., "grade_level," "percentage_correct," "scaled_score")
- context (e.g., "Using calculator accommodation," "With graphic organizer support")
- target_value (if mentioned)

### SECTION 3: Behavioral/Social-Emotional Progress
**Location:** "Behavioral Goals," "Social Skills," "Emotional Regulation"
**Extract:**
- metric_name (e.g., "On-task behavior," "Peer interactions")
- metric_type: "behavioral_progress" or "social_skill"
- metric_value (e.g., frequency count, percentage, duration)
- context (e.g., "During structured activities," "With adult prompting")
- intervention_used (if specific strategies are mentioned)

### SECTION 4: Service Minutes/Frequency
**Location:** "Special Education Services," "Related Services"
**Extract for EACH service:**
- service_type (e.g., "Speech Therapy," "Resource Room," "Counseling")
- minutes_per_week (total service time)
- frequency (e.g., "3x per week," "Daily")
- service_location (e.g., "Push-in," "Pull-out," "Separate classroom")

### SECTION 5: Qualitative Progress Notes
**Location:** "Teacher Comments," "Observations," "Areas of Strength/Concern"
**Extract as insights:**
- strengths_observed (positive progress areas)
- areas_for_improvement (concerns or regression)
- recommended_next_steps (teacher/provider recommendations)

## OUTPUT FORMAT

Return a single JSON object with this EXACT structure:

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Reading Fluency",
      "metric_type": "academic_fluency",
      "metric_value": 62,
      "metric_unit": "words_per_minute",
      "measurement_date": "2024-12-15",
      "context": "ORF assessment using grade-level passage. Student used self-monitoring checklist.",
      "target_value": 80
    },
    {
      "metric_name": "Math Problem Solving",
      "metric_type": "academic_performance",
      "metric_value": 3.2,
      "metric_unit": "grade_level",
      "measurement_date": "2024-12-15",
      "context": "Using visual supports and extended time accommodation",
      "target_value": 4.0
    }
  ],
  "insights": [
    {
      "title": "Strong Progress in Reading Fluency",
      "content": "Student has increased reading fluency from 45 wpm (baseline) to 62 wpm, representing 42% progress toward annual goal of 80 wpm. Student is on track to meet goal by end of year.",
      "priority": "medium",
      "insight_type": "progress_summary"
    },
    {
      "title": "Limited Progress in Math Problem Solving",
      "content": "Student remains at 3.2 grade level (baseline: 3.0, target: 4.0). Recommend increasing visual supports and explicit strategy instruction.",
      "priority": "high",
      "insight_type": "intervention_recommendation"
    }
  ],
  "progress_tracking": [
    {
      "metric_type": "academic_fluency",
      "metric_name": "Reading Fluency",
      "baseline_value": 45,
      "current_value": 62,
      "target_value": 80,
      "trend": "improving",
      "notes": "On track to meet annual goal. Student demonstrates consistent growth with current interventions."
    },
    {
      "metric_type": "academic_performance",
      "metric_name": "Math Problem Solving",
      "baseline_value": 3.0,
      "current_value": 3.2,
      "target_value": 4.0,
      "trend": "minimal_progress",
      "notes": "Limited growth observed. IEP team recommends intensifying intervention and increasing service minutes."
    }
  ]
}
\`\`\`

## EXTRACTION RULES (NON-NEGOTIABLE)

1. **EXTRACT ALL GOALS**: Create one progress_tracking entry for EACH IEP goal mentioned
2. **CALCULATE PROGRESS**: If not stated, calculate progress_percentage: ((current - baseline) / (target - baseline)) * 100
3. **QUANTIFY EVERYTHING**: Convert descriptive levels to numeric values when possible
   - "Below grade level" → look for specific grade equivalents
   - "Adequate progress" → look for actual data points
4. **PRESERVE MEASUREMENT DATES**: Use the reporting period end date or "as of" date
5. **CAPTURE CONTEXT**: Store accommodation/modification information in context field
6. **NO HALLUCINATIONS**: If baseline or target not stated, leave as null
7. **NUMERIC FIELDS STRICT**: metric_value, baseline_value, current_value, target_value accept ONLY numbers or NULL
8. **EXTRACT TEACHER COMMENTS**: Capture qualitative observations in insights

## COMMON PROGRESS REPORT SECTION HEADERS
- "Annual Goal Progress Summary"
- "Progress Toward IEP Goals"
- "Quarterly Progress Report"
- "Academic Performance Update"
- "Behavioral Goals Progress"
- "Present Levels of Performance"
- "Areas of Strength"
- "Areas of Concern"
- "Recommended Next Steps"
- "Service Delivery Summary"
- "Modifications/Accommodations Effectiveness"`;
