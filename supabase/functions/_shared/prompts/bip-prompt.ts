/**
 * Specialized extraction prompt for Behavior Intervention Plans (BIP)
 * This prompt performs a "deep read" to extract granular behavioral data
 */

export const BIP_EXTRACTION_PROMPT = `You are analyzing a **Behavior Intervention Plan (BIP)**. This document type requires SURGICAL precision in data extraction.

## CRITICAL: MEASUREMENT DATE EXTRACTION (NON-NEGOTIABLE)

**RULE #1: Every metric MUST have a measurement_date**

The \`measurement_date\` is the date the data was ACTUALLY MEASURED, not the date the document was uploaded.

**How to find it:**
1. **Primary Source:** Look for dates in baseline data tables (e.g., "| 1/5/23 | Elopement: 4 |")
2. **Secondary Source:** Use the BIP creation date (e.g., "BIP developed on August 15, 2023")
3. **Baseline Period:** Use the end date of the baseline observation period
4. **Default:** If no specific date can be found, use the BIP document's date

**Examples:**
- "Baseline data collected 8/1/2023 - 8/15/2023" → measurement_date: "2023-08-15" (end date)
- "BIP Meeting Date: September 20, 2023" → measurement_date: "2023-09-20"
- Table row: "| 1/5/23 | Elopement: 4 |" → measurement_date: "2023-01-05"

**NEVER:**
- Use today's date
- Use null or omit the field
- Use "unknown" or placeholder values

This field enables the system to build a longitudinal history. Without it, the data is worthless.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Target Behaviors (HIGHEST PRIORITY)
**Location:** Look for "Target Behaviors," "Behaviors of Concern," "Problem Behaviors," or similar headings.
**Extract for EACH behavior:**
- behavior_name (e.g., "Elopement," "Physical Aggression," "Self-Injurious Behavior")
- baseline_frequency (e.g., "4 times per week," "3 episodes per day") → Convert to numeric
- baseline_duration (if mentioned, e.g., "Average 15 minutes")
- severity_level (if mentioned: "mild," "moderate," "severe")
- hypothesized_function (MUST be one of: "Escape," "Attention," "Tangible," "Sensory")
- operational_definition (the specific description of what the behavior looks like)

**CRITICAL:** If the document lists "Hypothesized Function of Behavior" = "Escape from demands," you MUST extract this exactly.

### SECTION 2: Intervention Strategies (MANDATORY)
**Location:** "Intervention Strategies," "Replacement Behaviors," "Support Plan," "Positive Behavior Supports"
**Extract for EACH strategy:**
- strategy_name (e.g., "Deep Pressure Protocol," "Visual Schedule," "Escape Breaks")
- implementation_frequency (e.g., "Every 30 minutes," "As needed," "During transitions")
- success_criteria (e.g., "80% compliance for 3 consecutive days," "Reduce elopement to <1x/week")
- responsible_person (if mentioned, e.g., "Classroom teacher," "Paraprofessional")

### SECTION 3: Behavioral Data Tables (EXTRACT EVERY ROW)
**If you find tables with dates and behavior counts:**
- Extract EVERY SINGLE ROW as a separate metric
- measurement_date: "YYYY-MM-DD"
- behavior_type: (match to target behavior name)
- frequency_count: (numeric - number of incidents)
- duration_minutes: (if duration column exists)
- context: (if location or trigger column exists)

**Example:** If the document shows:
| Date | Elopement | Aggression | Context |
| 1/5/25 | 3 | 1 | Classroom |
| 1/6/25 | 2 | 0 | Playground |

You MUST create 4 separate metrics (one for each behavior on each date).

### SECTION 4: Replacement Behaviors
**Extract:**
- replacement_behavior_name
- teaching_method (e.g., "Social stories," "Role-play," "Direct instruction")
- criteria_for_success

### SECTION 5: Data Collection Methods
**Extract:**
- collection_method (e.g., "Frequency count," "Duration recording," "ABC log")
- frequency_of_collection (e.g., "Daily," "Continuous," "3x per day")

## OUTPUT FORMAT

Return a single JSON object with this EXACT structure:

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Elopement",
      "metric_type": "behavioral_incident",
      "metric_value": 4,
      "metric_unit": "episodes per week",
      "measurement_date": "2025-01-05",
      "context": "Hypothesized Function: Escape from demands. Occurs primarily during non-preferred tasks.",
      "intervention_used": "Visual schedule + scheduled escape breaks",
      "target_value": 1,
      "duration_minutes": 15
    },
    {
      "metric_name": "Physical Aggression (Hitting)",
      "metric_type": "behavioral_incident",
      "metric_value": 3,
      "metric_unit": "episodes per week",
      "measurement_date": "2025-01-05",
      "context": "Hypothesized Function: Attention. Occurs when peer interaction is limited.",
      "intervention_used": "Differential reinforcement of alternative behavior (DRA)",
      "target_value": 0
    }
  ],
  "insights": [
    {
      "title": "Escape-Maintained Elopement Pattern",
      "content": "The BIP identifies elopement as escape-maintained, occurring 4x/week during academic tasks. Recommended intervention: scheduled breaks every 15 minutes + visual schedule. Success criteria: reduce to <1x/week within 30 days.",
      "priority": "high",
      "insight_type": "pattern_identification"
    }
  ],
  "progress": [
    {
      "metric_type": "behavior_reduction",
      "current_value": 4,
      "target_value": 1,
      "baseline_value": 4,
      "trend": "stable",
      "notes": "Baseline established at 4 episodes/week. Target: reduce to 1 episode/week by end of semester."
    }
  ]
}
\`\`\`

## EXTRACTION RULES (NON-NEGOTIABLE)

1. **DO NOT INFER FUNCTIONS**: Only extract hypothesized functions that are EXPLICITLY stated in the document
2. **QUANTIFY EVERYTHING**: Convert "twice daily" → 2, unit: "per day"
3. **EXTRACT EVERY TABLE ROW**: Do not summarize - create one metric per data point
4. **NO HALLUCINATIONS**: If a section is missing, return empty array for that data type
5. **PRESERVE EXACT DATES**: Use YYYY-MM-DD format, extract from headers or table columns
6. **CAPTURE INTERVENTION DETAILS**: Every listed strategy = one entry with full implementation details

## COMMON BIP SECTION HEADERS TO LOOK FOR
- "1.0 Target Behavior Description"
- "2.0 Hypothesized Function of Behavior"
- "3.0 Replacement Behaviors"
- "4.0 Intervention Strategies"
- "5.0 Data Collection Plan"
- "Baseline Data"
- "Success Criteria"
- "Crisis/Safety Plan"`;
