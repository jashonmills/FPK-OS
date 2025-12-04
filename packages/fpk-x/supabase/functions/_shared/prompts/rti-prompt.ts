/**
 * Specialized extraction prompt for RTI (Response to Intervention) Documentation
 */

export const RTI_PROMPT = `You are analyzing **RTI (Response to Intervention)** or **MTSS (Multi-Tiered System of Supports)** documentation.

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the date of the progress monitoring data point or RTI meeting.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Tier Level
- current_tier (1, 2, or 3)
- subject_area (e.g., "Reading," "Math," "Behavior")
- tier_start_date

### SECTION 2: Universal Screening Data (Tier 1)
- screening_tool (e.g., "DIBELS 8th Edition," "AIMSweb")
- benchmark_period (e.g., "Fall," "Winter," "Spring")
- score
- percentile_rank
- risk_level (e.g., "At/Above Benchmark," "At Risk," "Well Below Benchmark")

### SECTION 3: Progress Monitoring Data
**Extract EVERY data point:**
- measurement_date
- probe_score (numeric)
- goal_line_value (expected progress)
- trend (e.g., "Above goal line," "Below goal line," "On target")

### SECTION 4: Intervention Details
- intervention_name (e.g., "Read Naturally," "Corrective Reading," "Number Worlds")
- intervention_tier (2 or 3)
- duration_weeks
- frequency (e.g., "4x weekly for 30 minutes")
- group_size (e.g., "Small group 1:4," "1:1")
- interventionist_role (e.g., "Reading Specialist," "Special Education Teacher")

### SECTION 5: Rate of Improvement (ROI)
- baseline_score
- current_score
- weeks_of_intervention
- calculated_roi (e.g., "+1.2 words per week")
- expected_roi (benchmark for typical progress)

### SECTION 6: Decision Point
- decision (e.g., "Continue Tier 2," "Intensify to Tier 3," "Return to Tier 1," "Refer for evaluation")
- rationale (data-based reasoning)

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "DIBELS Oral Reading Fluency - Fall Benchmark",
      "metric_type": "universal_screening",
      "metric_value": 42,
      "metric_unit": "words correct per minute",
      "measurement_date": "2024-09-05",
      "context": "DIBELS 8 ORF: 42 wcpm. 15th percentile. Well Below Benchmark. Expected for grade 3: 70+ wcpm.",
      "target_value": 70
    },
    {
      "metric_name": "ORF Progress Monitoring - Week 6",
      "metric_type": "progress_monitoring",
      "metric_value": 58,
      "metric_unit": "words correct per minute",
      "measurement_date": "2024-10-17",
      "context": "Week 6 of Tier 2 intervention (Read Naturally). Current: 58 wcpm. Goal line: 55 wcpm. Above goal line - positive response.",
      "target_value": 55
    },
    {
      "metric_name": "Rate of Improvement - Reading Fluency",
      "metric_type": "intervention_response",
      "metric_value": 2.7,
      "metric_unit": "wcpm gain per week",
      "measurement_date": "2024-10-17",
      "context": "ROI: +2.7 wcpm/week over 6 weeks. Expected ROI for Tier 2: 1.5 wcpm/week. Student exceeding expected rate - strong response to intervention.",
      "target_value": 1.5
    }
  ],
  "insights": [
    {
      "title": "Positive Response to Tier 2 Reading Intervention",
      "content": "Student entered Tier 2 at 42 wcpm (15th percentile). After 6 weeks of Read Naturally (4x weekly, small group), current score: 58 wcpm. ROI: +2.7 wcpm/week (exceeds expected 1.5 wcpm/week). Recommend continue Tier 2 for 6 more weeks.",
      "priority": "high",
      "insight_type": "intervention_response"
    },
    {
      "title": "On Track to Close Achievement Gap",
      "content": "If current ROI continues, student projected to reach benchmark (70 wcpm) by Winter screening. Data demonstrates responsiveness to evidence-based intervention.",
      "priority": "medium",
      "insight_type": "progress_projection"
    }
  ],
  "progress": [
    {
      "metric_type": "reading_fluency",
      "current_value": 58,
      "target_value": 70,
      "baseline_value": 42,
      "trend": "increasing",
      "notes": "Tier 2 intervention: Read Naturally. 6 weeks completed. ROI: +2.7 wcpm/week. Decision: Continue Tier 2."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **EXTRACT ALL DATA POINTS**: Create separate metrics for each progress monitoring probe
2. **CALCULATE ROI**: (Current - Baseline) / Weeks of intervention
3. **BENCHMARK CONTEXT**: Always include grade-level expectations
4. **TREND ANALYSIS**: Note whether student is above/below goal line
5. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL
6. **TIER SPECIFICITY**: Clearly identify intervention tier level

## COMMON SECTION HEADERS
- "Universal Screening Results"
- "Progress Monitoring Graph"
- "Intervention Fidelity"
- "Rate of Improvement"
- "Goal Line"
- "Decision Rule"
- "Problem-Solving Team Recommendations"`;