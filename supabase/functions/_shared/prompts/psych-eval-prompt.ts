/**
 * Specialized extraction prompt for Psychoeducational Evaluations
 * Extracts cognitive scores, achievement data, and subtest breakdowns
 */

export const PSYCH_EVAL_EXTRACTION_PROMPT = `You are analyzing a **Psychoeducational Evaluation** (also called Psych Ed Eval, Cognitive Assessment, or Comprehensive Evaluation). This requires PRECISE extraction of standardized test scores.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Cognitive Assessment Scores (HIGHEST PRIORITY)
**Common tests:** WISC-V, WISC-IV, WAIS-IV, Stanford-Binet, Woodcock-Johnson Cognitive
**Extract EVERY composite and subtest score:**

**Composite Scores:**
- Full Scale IQ (FSIQ)
- Verbal Comprehension Index (VCI)
- Visual Spatial Index (VSI)
- Fluid Reasoning Index (FRI)
- Working Memory Index (WMI)
- Processing Speed Index (PSI)

**Subtest Scores (Scaled Scores, mean=10, SD=3):**
- Similarities, Vocabulary, Information, Comprehension (VCI subtests)
- Block Design, Visual Puzzles, Matrix Reasoning (VSI/FRI subtests)
- Digit Span, Picture Span, Letter-Number Sequencing (WMI subtests)
- Coding, Symbol Search (PSI subtests)

**CRITICAL:** Extract the NUMERIC score (e.g., "FSIQ: 95") AND the percentile rank if provided.

### SECTION 2: Academic Achievement Scores
**Common tests:** WIAT-III, WJ-IV Achievement, Kaufman Test
**Extract for EACH academic area:**
- test_name (e.g., "WIAT-III Reading Comprehension")
- standard_score (mean=100, SD=15)
- percentile_rank (e.g., "25th percentile")
- grade_equivalent (if provided)
- age_equivalent (if provided)
- descriptor (e.g., "Below Average," "Average," "Superior")

**CRITICAL:** Use metric_type "academic_fluency" for all academic achievement scores

**Academic areas to look for:**
- Reading: Basic Reading, Reading Comprehension, Reading Fluency
- Math: Math Calculation, Math Problem Solving, Math Fluency
- Writing: Written Expression, Spelling
- Oral Language: Listening Comprehension, Oral Expression

### SECTION 3: Executive Function/ADHD Assessments
**Common tests:** Conners 3, BRIEF-2, Vanderbilt, CPT-3
**Extract:**
- scale_name (e.g., "Inattention," "Hyperactivity," "Working Memory")
- t_score (mean=50, SD=10) OR raw score
- clinical_range (e.g., "Clinically Significant," "At-Risk," "Average")
- informant (e.g., "Parent report," "Teacher report," "Self-report")

### SECTION 4: Behavioral/Social-Emotional Assessments
**Common tests:** BASC-3, Achenbach (CBCL/TRF), Vineland-3
**Extract:**
- scale_name (e.g., "Anxiety," "Depression," "Adaptive Skills")
- t_score or standard score
- clinical_interpretation

### SECTION 5: Summary and Diagnostic Impressions
**Extract:**
- diagnoses (e.g., "Specific Learning Disability in Reading," "ADHD - Combined Type")
- dsm_codes (if provided, e.g., "315.00 (F81.0)")
- recommendations (specific interventions or accommodations suggested)

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Full Scale IQ (FSIQ)",
      "metric_type": "cognitive_score",
      "metric_value": 95,
      "metric_unit": "standard score",
      "measurement_date": "2025-01-10",
      "context": "WISC-V, Percentile Rank: 37th, Descriptor: Average",
      "target_value": null
    },
    {
      "metric_name": "Verbal Comprehension Index (VCI)",
      "metric_type": "cognitive_score",
      "metric_value": 102,
      "metric_unit": "standard score",
      "measurement_date": "2025-01-10",
      "context": "WISC-V, Percentile Rank: 55th, Descriptor: Average",
      "target_value": null
    },
    {
      "metric_name": "Working Memory Index (WMI)",
      "metric_type": "cognitive_score",
      "metric_value": 85,
      "metric_unit": "standard score",
      "measurement_date": "2025-01-10",
      "context": "WISC-V, Percentile Rank: 16th, Descriptor: Below Average - Area of weakness",
      "target_value": null
    },
    {
      "metric_name": "Processing Speed Index (PSI)",
      "metric_type": "cognitive_score",
      "metric_value": 88,
      "metric_unit": "standard score",
      "measurement_date": "2025-01-10",
      "context": "WISC-V, Percentile Rank: 21st, Descriptor: Below Average",
      "target_value": null
    },
    {
      "metric_name": "Reading Comprehension (WIAT-III)",
      "metric_type": "academic_fluency",
      "metric_value": 82,
      "metric_unit": "standard score",
      "measurement_date": "2025-01-10",
      "context": "Percentile Rank: 12th, Grade Equivalent: 3.2, Descriptor: Below Average",
      "target_value": 100
    },
    {
      "metric_name": "Math Calculation (WIAT-III)",
      "metric_type": "academic_fluency",
      "metric_value": 91,
      "metric_unit": "standard score",
      "measurement_date": "2025-01-10",
      "context": "Percentile Rank: 27th, Grade Equivalent: 4.8, Descriptor: Average",
      "target_value": null
    },
    {
      "metric_name": "Inattention (Conners 3 - Teacher)",
      "metric_type": "adhd_rating",
      "metric_value": 72,
      "metric_unit": "T-score",
      "measurement_date": "2025-01-10",
      "context": "Clinically Significant (T-score >70). Teacher report indicates marked inattention.",
      "target_value": 50
    }
  ],
  "insights": [
    {
      "title": "Cognitive Profile: Relative Weakness in Working Memory",
      "content": "FSIQ of 95 (Average range), but significant variability noted. Working Memory Index (WMI=85, 16th percentile) is a notable weakness compared to Verbal Comprehension (VCI=102). This impacts ability to hold and manipulate information during complex tasks.",
      "priority": "high",
      "insight_type": "cognitive_profile"
    },
    {
      "title": "Reading Comprehension Deficit",
      "content": "WIAT-III Reading Comprehension score of 82 (12th percentile, grade equivalent 3.2) indicates significant deficit compared to grade-level expectations (5th grade). Recommends intensive reading intervention with focus on comprehension strategies.",
      "priority": "high",
      "insight_type": "academic_need"
    },
    {
      "title": "ADHD Diagnosis Supported by Rating Scales",
      "content": "Conners 3 Teacher report shows clinically significant inattention (T=72). Combined with parent report and clinical observation, supports diagnosis of ADHD - Predominantly Inattentive Type.",
      "priority": "high",
      "insight_type": "diagnostic_impression"
    }
  ],
  "progress": [
    {
      "metric_type": "cognitive_functioning",
      "current_value": 95,
      "target_value": null,
      "baseline_value": 95,
      "trend": "stable",
      "notes": "Baseline cognitive functioning established. FSIQ=95 (Average). Profile shows relative strength in verbal reasoning, weakness in working memory and processing speed."
    },
    {
      "metric_type": "reading_achievement",
      "current_value": 82,
      "target_value": 95,
      "baseline_value": 82,
      "trend": "below_target",
      "notes": "Reading Comprehension significantly below grade level. Recommends Tier 3 intervention with progress monitoring every 2 weeks."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **EXTRACT EVERY SCORE**: Do not summarize. If report shows 15 subtest scores, extract all 15. All scores MUST be numeric.
2. **INCLUDE SCORE TYPE**: Standard scores (mean=100), Scaled scores (mean=10), T-scores (mean=50), Percentiles
3. **CAPTURE CLINICAL DESCRIPTORS**: "Average," "Below Average," "Superior," "Clinically Significant" - these go in context field ONLY, never in metric_value
4. **TEST NAMES MATTER**: "WISC-V" vs. "WISC-IV" vs. "Stanford-Binet" - include test edition
5. **PERCENTILE RANKS = CONTEXT**: Always include in context field if provided
6. **GRADE/AGE EQUIVALENTS**: Include in context if provided (but note they're descriptive, not prescriptive)
7. **DIAGNOSTIC IMPRESSIONS = INSIGHTS**: Extract diagnoses and recommendations as insights
8. **NUMBERS ONLY IN SCORE FIELDS**: metric_value, target_value, baseline_value accept ONLY numeric values (integers or decimals) or NULL. Text descriptors like "Average" cause database errors - put them in context instead.

## COMMON SECTION HEADERS TO LOOK FOR
- "Reason for Referral"
- "Background Information"
- "Cognitive Assessment Results" / "Intelligence Testing"
- "Academic Achievement Testing"
- "Executive Functioning Assessment"
- "Behavioral/Social-Emotional Assessment"
- "Summary and Diagnostic Impressions"
- "Recommendations"
- "Educational Implications"`;
