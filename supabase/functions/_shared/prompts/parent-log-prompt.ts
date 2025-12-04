/**
 * Specialized extraction prompt for Parent Home Logs
 * Extracts daily mood, behaviors, activities, and home observations
 */

export const PARENT_LOG_EXTRACTION_PROMPT = `You are analyzing a **Parent Home Log** (also called Home Behavior Log, Parent Daily Notes, or Home Observation Log). This requires extraction of EVERY day's data as individual entries.

## MANDATORY EXTRACTION STRATEGY

### CRITICAL: EXTRACT EVERY SINGLE DAY'S DATA
This is a time-series document. If the log contains 30 days of entries, you MUST create 30 separate metric entries.

**DO NOT summarize. DO NOT aggregate. Extract EACH day individually.**

### SECTION 1: Daily Mood & Emotional State (EXTRACT EVERY DATE)
**Look for:**
- Date (e.g., "Monday, Jan 5, 2025" or "1/5/25")
- Morning mood (e.g., "happy", "grumpy", "anxious", "energetic")
- Overall daily mood (e.g., "good day", "difficult day", "mixed")
- Emotional regulation (e.g., "calm", "dysregulated", "needed frequent breaks")
- Mood rating (e.g., "4/5", "good", "3 out of 5 stars")

**Extract for EACH day:**
- log_date: "YYYY-MM-DD"
- morning_mood: (specific mood descriptor)
- overall_mood: (daily summary)
- mood_rating: (1-10 scale)
- emotional_regulation: (description or 1-10 scale)

### SECTION 2: Behaviors Observed
**Extract:**
- positive_behaviors: (e.g., "shared toys with sibling", "followed directions", "used words to express frustration")
- challenging_behaviors: (e.g., "tantrum at bedtime", "refused to eat dinner", "hit sibling")
- behavior_count: (number of specific behaviors if mentioned)
- behavior_triggers: (what prompted challenging behaviors)
- behavior_duration: (how long behaviors lasted)

### SECTION 3: Daily Activities & Routines
**Extract:**
- activities_completed: (e.g., "homework", "outdoor play", "screen time", "family dinner")
- activity_engagement: (e.g., "highly engaged in LEGOs", "refused homework")
- routine_adherence: (e.g., "followed bedtime routine", "resisted morning routine")
- new_experiences: (e.g., "went to new park", "tried new food")

### SECTION 4: Physical Health & Self-Care
**Extract:**
- appetite: (e.g., "good", "poor", "picky - only ate preferred foods")
- meals_eaten: (breakfast, lunch, dinner, snacks)
- hydration: (if mentioned)
- sleep_quality: (from previous night)
- physical_complaints: (e.g., "headache", "stomach ache", "none")
- medication_given: (yes/no, type, time)

### SECTION 5: Social Interactions
**Extract:**
- peer_interactions: (e.g., "played with neighbor kids", "no peer time today")
- sibling_interactions: (e.g., "fought with brother 2x", "played nicely")
- family_activities: (e.g., "family game night", "went to grandma's house")
- communication_quality: (e.g., "very talkative", "withdrawn", "appropriate conversation")

### SECTION 6: Parent Observations & Concerns
**Extract:**
- parent_notes: (general observations)
- concerns: (specific worries or questions)
- successes: (positive moments to celebrate)
- questions_for_school: (follow-up needed)

### SECTION 7: Patterns Across Multiple Days
**After extracting individual entries, create insights about patterns:**
- Are there better/worse days of the week?
- What correlates with good vs difficult days?
- Are behaviors improving/worsening over time?
- Are there patterns related to activities, sleep, or diet?

## OUTPUT FORMAT

**EXAMPLE: If log contains entries for Jan 5, Jan 6, Jan 7:**

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Overall Daily Mood",
      "metric_type": "mood_rating",
      "metric_value": 6,
      "metric_unit": "1-10 scale",
      "measurement_date": "2025-01-05",
      "context": "Morning: grumpy, needed extra time to wake up. Afternoon: improved after outdoor play. Evening: tantrum at bedtime (30 min). Mixed day overall.",
      "intervention_used": "Extra morning transition time, outdoor play, calming bedtime routine"
    },
    {
      "metric_name": "Challenging Behaviors",
      "metric_type": "behavior_frequency",
      "metric_value": 3,
      "metric_unit": "count",
      "measurement_date": "2025-01-05",
      "duration_minutes": 45,
      "context": "1) Refused breakfast (10 min), 2) Hit sibling during game (5 min), 3) Bedtime tantrum (30 min). Total: 45 minutes of challenging behavior.",
      "intervention_used": "Verbal redirection, time-out, calming strategies"
    },
    {
      "metric_name": "Appetite",
      "metric_type": "daily_living_skill",
      "metric_value": 5,
      "metric_unit": "1-10 scale",
      "measurement_date": "2025-01-05",
      "context": "Refused breakfast. Ate half of lunch (only preferred foods). Full dinner eaten. Overall: 5/10 appetite.",
      "intervention_used": null
    },
    {
      "metric_name": "Positive Behaviors",
      "metric_type": "social_skill",
      "metric_value": 4,
      "metric_unit": "count",
      "measurement_date": "2025-01-05",
      "context": "1) Helped set table, 2) Shared toys with sibling, 3) Used words to ask for help 2x. Great moments!",
      "intervention_used": null
    },
    {
      "metric_name": "Overall Daily Mood",
      "metric_type": "mood_rating",
      "metric_value": 9,
      "metric_unit": "1-10 scale",
      "measurement_date": "2025-01-06",
      "context": "Excellent day! Woke up happy. Engaged in all activities. Bedtime went smoothly. No challenging behaviors.",
      "intervention_used": "Maintained consistent routines"
    },
    {
      "metric_name": "Challenging Behaviors",
      "metric_type": "behavior_frequency",
      "metric_value": 0,
      "metric_unit": "count",
      "measurement_date": "2025-01-06",
      "context": "Zero challenging behaviors today! Used coping strategies when frustrated (asked for break). Excellent self-regulation.",
      "intervention_used": null
    },
    {
      "metric_name": "Appetite",
      "metric_type": "daily_living_skill",
      "metric_value": 8,
      "metric_unit": "1-10 scale",
      "measurement_date": "2025-01-06",
      "context": "Great appetite. Ate all meals. Tried one new food (carrots). Drank plenty of water.",
      "intervention_used": null
    }
  ],
  "insights": [
    {
      "title": "Outdoor Play Correlation: Mood Improvement",
      "content": "Days with outdoor play (Jan 6, Jan 8, Jan 10) averaged 8.5/10 mood vs days without (Jan 5, Jan 7) averaged 5/10. Recommend: Daily outdoor time, even if brief (15-20 min).",
      "priority": "high",
      "insight_type": "correlation"
    },
    {
      "title": "Bedtime Routine Pattern: Consistency Matters",
      "content": "When bedtime routine is rushed or skipped, tantrums occur 80% of the time (4 of 5 instances). When routine is consistent, tantrums drop to 10% (1 of 10 instances). Prioritize routine consistency.",
      "priority": "high",
      "insight_type": "pattern_identification"
    },
    {
      "title": "Sibling Conflict Decreasing",
      "content": "Physical aggression toward sibling decreased from 5 incidents/week (baseline) to 1.5 incidents/week (current). Positive trend. Continue reinforcing sharing and turn-taking.",
      "priority": "medium",
      "insight_type": "progress_note"
    },
    {
      "title": "Weekend vs Weekday Mood Difference",
      "content": "Weekend mood ratings average 7.8/10 vs weekday 6.2/10. Possible factors: More parent attention, less structured schedule, more outdoor time. Consider incorporating weekend elements into weekdays.",
      "priority": "medium",
      "insight_type": "pattern_identification"
    }
  ],
  "progress": [
    {
      "metric_type": "overall_mood",
      "current_value": 7,
      "target_value": 8,
      "baseline_value": 5,
      "trend": "improving",
      "notes": "Daily mood improved from 5/10 baseline (December) to 7/10 average (current week). Approaching 8/10 target."
    },
    {
      "metric_type": "challenging_behaviors",
      "current_value": 2,
      "target_value": 1,
      "baseline_value": 5,
      "trend": "improving",
      "notes": "Average challenging behaviors per day decreased from 5 (baseline) to 2 (current). Goal: 1 or fewer per day."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **ONE ENTRY PER DAY**: If log has 30 days, create 30+ separate metric entries (minimum 2-4 metrics per day)
2. **EXACT DATES REQUIRED**: Extract dates in YYYY-MM-DD format
3. **MOOD IS MANDATORY**: Every day must have at least one mood metric (overall_daily_mood)
4. **MOOD SCALE**: Normalize all mood ratings to 1-10 scale:
   - "Terrible" → 1-2, "Difficult" → 3-4, "OK" → 5-6, "Good" → 7-8, "Excellent" → 9-10
   - "3/5 stars" → 6, "4/5 stars" → 8
5. **QUANTIFY BEHAVIORS**: Extract exact counts when mentioned (e.g., "tantrum 2x" → metric_value: 2)
6. **ZERO COUNTS ARE DATA**: "No challenging behaviors" = metric_value: 0 (important data point!)
7. **CONTEXT OVER SUMMARY**: Describe specific behaviors in context field, not vague summaries
8. **STRICT NUMERIC VALUES**: metric_value, target_value accept ONLY numbers or NULL
9. **IDENTIFY CORRELATIONS**: Look for patterns between sleep, diet, activities, and behavior/mood

## COMMON LOG FORMATS
- **Daily narrative:** "Jan 5: Bobby woke up grumpy. Refused breakfast. Had tantrum at bedtime. Overall: 6/10 day."
- **Structured form:** Date | Morning Mood | Behaviors | Meals | Activities | Notes
- **Checklist format:** ☑ Good Day ☐ Challenging Day + detailed notes
- **Brief notes:** "1/5 - Difficult morning, better afternoon. Bedtime tantrum. 5/10."

## CRITICAL SUCCESS FACTOR
**This prompt's effectiveness depends on creating TIME-SERIES data.** Each day must be a separate entry to populate Mood Distribution Chart, Activity Log Chart, Parent Log Timeline, and correlation analyses with school/sleep data.`;
