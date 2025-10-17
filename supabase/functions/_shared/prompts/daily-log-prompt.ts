/**
 * Specialized extraction prompt for Daily Communication Logs
 * Extracts time-series behavioral data, mood, activities
 */

export const DAILY_COMMUNICATION_LOG_PROMPT = `You are analyzing a **Daily Communication Log** (also called Home-School Log, Parent-Teacher Communication, or Daily Notes). This requires extraction of EVERY daily entry with timestamps.

## MANDATORY EXTRACTION STRATEGY

### CRITICAL: EXTRACT EVERY SINGLE DAY'S DATA
This is a time-series document. If the log contains 30 days of entries, you MUST create 30 separate metric entries.

**DO NOT summarize. DO NOT aggregate. Extract EACH day individually.**

### SECTION 1: Daily Behavioral Notes (EXTRACT EVERY DATE)
**Look for:**
- Date of entry (e.g., "Monday, Jan 5, 2025" or "1/5/25")
- Behavioral observations (e.g., "Had 2 elopement incidents," "Great focus today," "Struggled during math")
- Specific incidents with times (e.g., "1:30pm - Became upset during transition to gym")
- Positive behaviors (e.g., "Shared toys with peers," "Used words to request help")
- Challenging behaviors (e.g., "Hit peer during recess," "Refused to follow directions")

**Extract for EACH entry:**
- log_date: "YYYY-MM-DD"
- behavior_summary: (brief description)
- positive_behaviors: (count or description)
- challenging_behaviors: (count or description)
- mood: (if mentioned: "happy," "frustrated," "calm," "dysregulated")
- time_of_incident: (if specific times are mentioned)

### SECTION 2: Daily Activities/Academic Notes
**Extract:**
- activities_completed: (e.g., "Completed math worksheet," "Participated in reading group")
- academic_progress: (e.g., "Mastered 3 new sight words," "Struggled with 2-digit addition")
- engagement_level: (e.g., "Highly engaged," "Required frequent redirection")

### SECTION 3: Communication Between Home and School
**Extract:**
- parent_questions: (questions from parents to teachers)
- teacher_responses: (responses from teachers)
- action_items: (follow-up tasks, e.g., "Send sensory tools," "Schedule meeting")

### SECTION 4: Patterns Across Multiple Days
**After extracting individual entries, create insights about patterns:**
- Are challenging behaviors increasing/decreasing over time?
- Which days of the week show more difficulties?
- Are there patterns related to activities (e.g., "Struggles every gym day")?

## OUTPUT FORMAT

**EXAMPLE: If log contains entries for Jan 5, Jan 6, Jan 7:**

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Elopement",
      "metric_type": "behavioral_incident",
      "metric_value": 2,
      "metric_unit": "episodes",
      "measurement_date": "2025-01-05",
      "start_time": "10:15",
      "end_time": null,
      "context": "Ran from classroom during transition to gym. Returned with minimal prompting.",
      "intervention_used": "Visual schedule reminder + preferred activity after gym"
    },
    {
      "metric_name": "Physical Aggression (Hitting)",
      "metric_type": "behavioral_incident",
      "metric_value": 1,
      "metric_unit": "episode",
      "measurement_date": "2025-01-05",
      "start_time": "1:44",
      "end_time": "2:14",
      "duration_minutes": 30,
      "context": "Hit peer during recess after peer took toy. Required 30 min to de-escalate.",
      "intervention_used": "Removed to quiet area, deep pressure, verbal processing"
    },
    {
      "metric_name": "Positive Peer Interaction",
      "metric_type": "social_skill",
      "metric_value": 5,
      "metric_unit": "instances",
      "measurement_date": "2025-01-05",
      "context": "Shared toys 3x, initiated play 2x. Used words to ask for help.",
      "intervention_used": null
    },
    {
      "metric_name": "Overall Mood",
      "metric_type": "mood_rating",
      "metric_value": 3,
      "metric_unit": "1-5 scale",
      "measurement_date": "2025-01-05",
      "context": "Mostly calm but struggled with transitions. Happy during preferred activities.",
      "intervention_used": null
    },
    {
      "metric_name": "Elopement",
      "metric_type": "behavioral_incident",
      "metric_value": 0,
      "metric_unit": "episodes",
      "measurement_date": "2025-01-06",
      "context": "No elopement incidents today. Used visual schedule independently.",
      "intervention_used": "Visual schedule"
    },
    {
      "metric_name": "Overall Mood",
      "metric_type": "mood_rating",
      "metric_value": 5,
      "metric_unit": "1-5 scale",
      "measurement_date": "2025-01-06",
      "context": "Great day! Happy, engaged, cooperative. No challenging behaviors.",
      "intervention_used": null
    },
    {
      "metric_name": "Self-Injurious Behavior (Hand Biting)",
      "metric_type": "behavioral_incident",
      "metric_value": 3,
      "metric_unit": "episodes",
      "measurement_date": "2025-01-07",
      "start_time": "9:20",
      "context": "Became dysregulated during math. Bit hand 3x. Required break.",
      "intervention_used": "Sensory break + fidget tools"
    }
  ],
  "insights": [
    {
      "title": "Weekly Elopement Trend: Decreasing",
      "content": "Elopement incidents decreased from 2 episodes on Mon (Jan 5) to 0 on Tue (Jan 6). Visual schedule implementation appears effective. Continue current strategy.",
      "priority": "medium",
      "insight_type": "pattern_identification"
    },
    {
      "title": "Monday Pattern: Increased Dysregulation",
      "content": "Across 3 weeks of logs, Mondays consistently show higher rates of challenging behavior (avg 4 incidents) vs. other weekdays (avg 1.5 incidents). Hypothesis: Weekend routine disruption. Recommend enhanced Monday morning sensory input and additional check-ins.",
      "priority": "high",
      "insight_type": "pattern_identification"
    },
    {
      "title": "Positive: Growing Use of Communication Strategies",
      "content": "Student increasingly using words to request help (noted on Jan 5, Jan 9, Jan 12). Reduction in physical aggression correlates with improved verbal communication. Continue reinforcing functional communication training.",
      "priority": "medium",
      "insight_type": "progress_note"
    }
  ],
  "progress": [
    {
      "metric_type": "behavior_regulation",
      "current_value": 2,
      "target_value": 5,
      "baseline_value": 1,
      "trend": "improving",
      "notes": "Average daily regulation improving from 1/5 (December baseline) to 2/5 (current). Fewer incidents of aggression, more use of coping strategies."
    },
    {
      "metric_type": "communication_with_peers",
      "current_value": 5,
      "target_value": 8,
      "baseline_value": 2,
      "trend": "improving",
      "notes": "Positive peer interactions increasing. Student now initiates play and shares materials. Goal: 8+ positive interactions per day."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **ONE ENTRY PER DATE**: If log has 30 days, create 30 separate metric entries minimum
2. **EXACT DATES REQUIRED**: Extract dates in YYYY-MM-DD format. If only "Monday" is given, use context to infer the actual date
3. **TIMESTAMPS MATTER**: If the note says "1:44pm - incident occurred," extract start_time: "1:44"
4. **QUANTIFY BEHAVIORS**: "Had a few incidents" is not acceptable. Extract EXACT counts if provided. If not provided, create a qualitative insight instead. metric_value MUST be a number.
5. **MOOD = METRIC**: If mood is mentioned daily (happy, frustrated, calm), extract as a numeric metric (1-5 scale) or categorical metric
6. **ZERO COUNTS ARE DATA**: If log says "No incidents today," create a metric with metric_value: 0
7. **IDENTIFY PATTERNS**: After extracting all daily data, create insights about weekly trends, day-of-week patterns, or time-based patterns
8. **STRICT NUMERIC VALUES**: metric_value, target_value, duration_minutes accept ONLY numbers or NULL. Never use text like "sometimes", "improving", or descriptive words - those belong in context field.

## COMMON LOG FORMATS
- **Narrative format:** "Today Bobby had a great day. He completed his math worksheet and participated in reading group. There were 2 incidents of elopement during transitions."
- **Structured format:** Date | Behavior | Academic | Communication
- **Checklist format:** ☑ Great Day ☐ OK Day ☐ Challenging Day + Notes
- **Time-stamped format:** "9:00am - Arrived happy. 10:15am - Elopement during gym transition. 1:44pm - Aggression during recess."

## CRITICAL SUCCESS FACTOR
**This prompt's effectiveness depends on creating TIME-SERIES data.** Each date must be a separate entry to populate trend charts (Activity Log, Incident Frequency, Intervention Effectiveness, Mood Distribution).`;
