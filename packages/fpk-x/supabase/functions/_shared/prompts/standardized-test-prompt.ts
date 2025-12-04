/**
 * Specialized extraction prompt for Standardized Test Results
 */

export const STANDARDIZED_TEST_PROMPT = `You are analyzing **Standardized Test Results** (state assessments, NAEP, SAT, ACT, etc.).

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the date the test was administered.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Test Identification
- test_name (e.g., "SBAC ELA," "PARCC Math," "ACT Composite")
- test_date
- grade_level_tested
- test_form_version (if provided)

### SECTION 2: Overall Scores
**Extract composite/total scores:**
- composite_score
- scale_score
- percentile_rank
- performance_level (e.g., "Proficient," "Basic," "Advanced")

### SECTION 3: Subject/Domain Scores
**Extract for EACH subject area:**
- subject_name (e.g., "Reading," "Mathematics," "Science," "Writing")
- scale_score
- percentile_rank
- performance_level
- subcategory_scores (if provided)

### SECTION 4: Subscale/Strand Scores
**For detailed breakdowns:**
- strand_name (e.g., "Number & Operations," "Reading Comprehension," "Geometry")
- raw_score
- scaled_score
- proficiency_level

### SECTION 5: Comparative Data
**If provided:**
- school_average
- district_average
- state_average
- national_average

### SECTION 6: Growth Measures (if applicable)
- student_growth_percentile (SGP)
- growth_target_met (boolean)
- value_added_score

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "SBAC ELA Scale Score",
      "metric_type": "standardized_test_overall",
      "metric_value": 2458,
      "metric_unit": "scale score",
      "measurement_date": "2024-05-10",
      "context": "Grade 5 SBAC ELA: 2458. Performance Level: Proficient (Level 3). State average: 2515. Student scored 57 points below state average.",
      "target_value": 2515
    },
    {
      "metric_name": "SBAC Math Scale Score",
      "metric_type": "standardized_test_overall",
      "metric_value": 2380,
      "metric_unit": "scale score",
      "measurement_date": "2024-05-10",
      "context": "Grade 5 SBAC Math: 2380. Performance Level: Basic (Level 2). Below Proficient. State average: 2490. 110 points below state average.",
      "target_value": 2490
    },
    {
      "metric_name": "Reading Comprehension Strand",
      "metric_type": "standardized_test_subscale",
      "metric_value": 12,
      "metric_unit": "points out of 18",
      "measurement_date": "2024-05-10",
      "context": "Reading Comprehension subscale: 12/18 points (67%). Below Proficient threshold of 75%.",
      "target_value": 14
    },
    {
      "metric_name": "Student Growth Percentile - Math",
      "metric_type": "growth_measure",
      "metric_value": 35,
      "metric_unit": "SGP (1-99 percentile)",
      "measurement_date": "2024-05-10",
      "context": "Math SGP: 35th percentile. Student's growth was lower than 65% of students with similar prior scores. Target SGP: 50+.",
      "target_value": 50
    }
  ],
  "insights": [
    {
      "title": "Math Performance Below Proficient - Intervention Needed",
      "content": "SBAC Math score (2380) falls in Basic performance level, 110 points below state average. Low growth percentile (35) indicates student not making expected progress. Recommend Tier 2 math intervention.",
      "priority": "high",
      "insight_type": "academic_concern"
    },
    {
      "title": "Reading Comprehension Specific Weakness",
      "content": "While overall ELA is Proficient, Reading Comprehension strand shows weakness (67% vs. 75% proficiency threshold). Focus intervention on inferencing and main idea skills.",
      "priority": "medium",
      "insight_type": "skill_specific_need"
    }
  ],
  "progress": [
    {
      "metric_type": "standardized_math",
      "current_value": 2380,
      "target_value": 2490,
      "baseline_value": 2380,
      "trend": "below_target",
      "notes": "Baseline established. Target: reach state average (Proficient level) on next year's assessment."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **TEST-SPECIFIC SCALES**: Preserve actual scale score ranges (e.g., SBAC uses 2000-3000+ range)
2. **PERFORMANCE LEVELS**: Extract official achievement levels (Advanced, Proficient, Basic, Below Basic)
3. **COMPARATIVE CONTEXT**: Always include comparison to averages when provided
4. **GROWTH MEASURES**: Extract SGP, value-added, or other growth metrics
5. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL
6. **SUBSCALE DETAIL**: Create separate metrics for each strand/subscale

## COMMON TEST TYPES
- **SBAC/Smarter Balanced**: ELA & Math (scale scores ~2000-3000)
- **PARCC**: ELA & Math (scale scores 650-850)
- **NAEP**: Reading, Math, Science (scale scores 0-500)
- **ACT**: Composite & subject scores (1-36 scale)
- **SAT**: Total & section scores (400-1600 scale)
- **State-specific**: STAAR (TX), FSA (FL), MCAS (MA), etc.`;