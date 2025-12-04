/**
 * Specialized extraction prompt for Functional Behavior Assessments (FBA)
 * Critical for identifying behavioral functions and baseline data
 */

export const FBA_EXTRACTION_PROMPT = `You are analyzing a **Functional Behavior Assessment (FBA)**. This document is critical for understanding the WHY behind challenging behaviors.

## CRITICAL: MEASUREMENT DATE EXTRACTION (NON-NEGOTIABLE)

**RULE #1: Every metric MUST have a measurement_date**

The \`measurement_date\` is the date the observation/data was ACTUALLY COLLECTED, not the date the FBA was written.

**How to find it:**
1. **Primary Source:** Look for dates in observation logs (e.g., "Observed 9/12/2024 - 9/19/2024")
2. **Secondary Source:** Use the FBA completion date (e.g., "FBA completed on October 5, 2024")
3. **Observation Period:** Use the end date of the observation window
4. **Default:** If no specific date can be found, use the FBA document's date

**Examples:**
- "Direct observations conducted 9/5/2024 - 9/12/2024" → measurement_date: "2024-09-12" (end date)
- "FBA Meeting Date: September 25, 2024" → measurement_date: "2024-09-25"
- "ABC data collected on 10/3/2024" → measurement_date: "2024-10-03"

**NEVER:**
- Use today's date
- Use null or omit the field
- Use "unknown" or placeholder values

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Target Behavior Descriptions (HIGHEST PRIORITY)
**Location:** Look for "Target Behavior," "Behavior of Concern," "Operational Definition"
**Extract for EACH behavior:**
- behavior_name (e.g., "Elopement," "Physical Aggression," "Work Refusal")
- operational_definition (exact description of what the behavior looks like)
- baseline_frequency (e.g., "8 times per day," "3 episodes per week") → Convert to numeric
- baseline_duration (if mentioned, e.g., "Average 5 minutes per episode")
- severity_level (if mentioned: "mild," "moderate," "severe")

### SECTION 2: ABC Data (Antecedent-Behavior-Consequence)
**Location:** "Direct Observation Data," "ABC Analysis," "Observation Log"
**Extract EVERY SINGLE OBSERVATION as a separate metric:**
- measurement_date: "YYYY-MM-DD"
- start_time: (if available, e.g., "10:15 AM")
- behavior_type: (match to target behavior name)
- context: (the ANTECEDENT - what happened right before)
- intervention_used: (the CONSEQUENCE - what happened right after)
- duration_minutes: (if duration recorded)

**Example:** If the FBA shows:
| Date | Time | Antecedent | Behavior | Consequence | Duration |
| 9/5/24 | 10:15 | Math worksheet | Elopement | Verbal redirect | 3 min |
| 9/5/24 | 1:20 | Transition to recess | Elopement | Physical prompt | 2 min |

You MUST create 2 separate metrics (one for each observation).

### SECTION 3: Hypothesized Function (CRITICAL)
**Location:** "Function of Behavior," "Hypothesis Statement," "Functional Analysis"
**Extract:**
- hypothesized_function (MUST be one of: "Escape," "Attention," "Tangible," "Sensory")
- supporting_evidence (text explaining why this function was selected)

**CRITICAL:** If the FBA states "The function of elopement is to escape from non-preferred academic tasks," you MUST extract:
- hypothesized_function: "Escape"
- context: "Occurs during non-preferred academic tasks. Supporting evidence: [quote from FBA]"

### SECTION 4: Setting Event Analysis
**Extract environmental and physiological factors:**
- time_of_day_patterns (e.g., "Behaviors increase in morning")
- setting_events (e.g., "Sleep deprivation," "Medication changes," "Staff transitions")
- environmental_triggers (e.g., "Loud noises," "Crowded hallways")

### SECTION 5: Replacement Behavior Recommendations
**Extract:**
- replacement_behavior_name (e.g., "Request a break using visual card")
- teaching_method (e.g., "Direct instruction + role-play")
- criteria_for_success (e.g., "Uses break card 4/5 opportunities for 3 consecutive days")

## OUTPUT FORMAT

Return a single JSON object with this EXACT structure:

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Elopement from classroom",
      "metric_type": "behavioral_incident",
      "metric_value": 8,
      "metric_unit": "episodes per day",
      "measurement_date": "2024-09-12",
      "start_time": "10:15",
      "end_time": null,
      "duration_minutes": 3,
      "context": "Antecedent: Math worksheet presented. Hypothesized Function: Escape from academic demands.",
      "intervention_used": "Consequence: Verbal redirect to return to classroom",
      "target_value": 2
    },
    {
      "metric_name": "Physical Aggression (hitting peers)",
      "metric_type": "behavioral_incident",
      "metric_value": 5,
      "metric_unit": "episodes per week",
      "measurement_date": "2024-09-12",
      "context": "Antecedent: Peer interaction during unstructured time. Hypothesized Function: Attention seeking.",
      "intervention_used": "Consequence: Immediate removal to calm-down area",
      "duration_minutes": null,
      "target_value": 0
    }
  ],
  "insights": [
    {
      "title": "Escape-Maintained Elopement Pattern",
      "content": "Direct observations confirm elopement occurs primarily during academic tasks (8/10 observations). Student elopes to library or hallway. ABC data supports escape function with 90% of episodes occurring within 2 minutes of task demand.",
      "priority": "high",
      "insight_type": "pattern_identification"
    },
    {
      "title": "Attention-Seeking Aggression Hypothesis",
      "content": "Physical aggression toward peers occurs during low-supervision periods. Behavior increases when adult attention is diverted. Recommended replacement: Teach appropriate attention-seeking strategies.",
      "priority": "high",
      "insight_type": "intervention_recommendation"
    }
  ],
  "progress": [
    {
      "metric_type": "behavior_reduction",
      "current_value": 8,
      "target_value": 2,
      "baseline_value": 8,
      "trend": "stable",
      "notes": "Baseline established at 8 episodes/day. Target: reduce to 2/day or less within 60 days."
    }
  ]
}
\`\`\`

## EXTRACTION RULES (NON-NEGOTIABLE)

1. **DO NOT INFER FUNCTIONS**: Only extract hypothesized functions that are EXPLICITLY stated in the FBA
2. **QUANTIFY EVERYTHING**: Convert "multiple times daily" → metric_value: 8, unit: "per day"
3. **EXTRACT EVERY ABC OBSERVATION**: Do not summarize - create one metric per observation
4. **NO HALLUCINATIONS**: If a section is missing, return empty array for that data type
5. **PRESERVE EXACT DATES**: Use YYYY-MM-DD format
6. **CAPTURE OPERATIONAL DEFINITIONS**: Store full behavior descriptions in context field
7. **NUMERIC FIELDS STRICT**: metric_value, target_value, duration_minutes accept ONLY numbers (integers or decimals) or NULL. Never insert text strings.

## COMMON FBA SECTION HEADERS TO LOOK FOR
- "Target Behavior Description"
- "Operational Definition"
- "Direct Observation Data"
- "ABC Analysis"
- "Scatter Plot Data"
- "Hypothesized Function of Behavior"
- "Function-Based Hypothesis Statement"
- "Setting Events"
- "Antecedent Analysis"
- "Consequence Analysis"
- "Replacement Behavior Recommendations"
- "Function-Based Intervention Recommendations"`;
