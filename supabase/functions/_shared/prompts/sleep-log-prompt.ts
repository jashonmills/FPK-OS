/**
 * Specialized extraction prompt for Sleep Logs
 * Extracts nightly sleep data, quality ratings, and patterns
 */

export const SLEEP_LOG_EXTRACTION_PROMPT = `You are analyzing a **Sleep Log** (also called Sleep Tracking Log, Sleep Diary, or Sleep Record). This requires extraction of EVERY night's sleep data as individual entries.

## MANDATORY EXTRACTION STRATEGY

### CRITICAL: EXTRACT EVERY SINGLE NIGHT'S DATA
This is a time-series document. If the log contains 30 nights of sleep data, you MUST create 30 separate metric entries.

**DO NOT summarize. DO NOT aggregate. Extract EACH night individually.**

### SECTION 1: Nightly Sleep Data (EXTRACT EVERY DATE)
**Look for:**
- Date of sleep (e.g., "Monday, Jan 5, 2025" or "1/5/25" or "Night of Jan 5")
- Bedtime (e.g., "8:30 PM", "20:30", "8:30pm")
- Wake time (e.g., "6:45 AM", "06:45", "6:45am")
- Total sleep hours (e.g., "10.25 hours", "10h 15m", "10.25")
- Sleep quality rating (e.g., "Good", "Poor", "4/5", "7/10")
- Number of night wakings (e.g., "Woke 2x", "3 wakings", "2")
- Duration of wakings (e.g., "20 minutes total", "45m")

**Extract for EACH night:**
- sleep_date: "YYYY-MM-DD"
- bedtime: "HH:MM" (24-hour format)
- wake_time: "HH:MM" (24-hour format)
- total_sleep_hours: (numeric, e.g., 10.25)
- sleep_quality: (1-10 scale)
- night_wakings: (count)
- waking_duration_minutes: (total minutes awake)

### SECTION 2: Sleep Environment & Aids
**Extract:**
- sleep_location: (e.g., "own bed", "parent's bed", "couch")
- room_temperature: (if mentioned)
- sleep_aids_used: (e.g., "melatonin 3mg", "white noise", "weighted blanket")
- bedtime_routine: (e.g., "bath, story, lights out")

### SECTION 3: Sleep Disruptions
**Extract:**
- disruption_type: (e.g., "nightmare", "need to use bathroom", "unknown")
- difficulty_falling_asleep: (yes/no or minutes to fall asleep)
- difficulty_returning_to_sleep: (yes/no or minutes)

### SECTION 4: Next-Day Impact
**Extract:**
- morning_mood: (e.g., "grumpy", "energetic", "tired")
- daytime_sleepiness: (yes/no or severity)
- behavioral_impact: (e.g., "more meltdowns than usual", "great focus")

### SECTION 5: Patterns Across Multiple Nights
**After extracting individual entries, create insights about patterns:**
- Is sleep quality improving/declining over time?
- Are there day-of-week patterns? (e.g., "Worse sleep on Sundays")
- What sleep aids correlate with better sleep?
- Are there seasonal or environmental factors?

## OUTPUT FORMAT

**EXAMPLE: If log contains entries for Jan 5, Jan 6, Jan 7:**

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Total Sleep Duration",
      "metric_type": "sleep_duration",
      "metric_value": 9.5,
      "metric_unit": "hours",
      "measurement_date": "2025-01-05",
      "start_time": "20:30",
      "end_time": "06:00",
      "context": "Bedtime: 8:30pm, Wake: 6:00am. Woke 2x (bathroom, bad dream). Used weighted blanket.",
      "intervention_used": "Weighted blanket, white noise machine"
    },
    {
      "metric_name": "Sleep Quality",
      "metric_type": "sleep_quality",
      "metric_value": 6,
      "metric_unit": "1-10 scale",
      "measurement_date": "2025-01-05",
      "context": "Fair sleep. Restless, multiple wakings. Morning mood: tired/grumpy.",
      "intervention_used": null
    },
    {
      "metric_name": "Night Wakings",
      "metric_type": "sleep_disruption",
      "metric_value": 2,
      "metric_unit": "count",
      "measurement_date": "2025-01-05",
      "duration_minutes": 35,
      "context": "Woke at 11pm (bathroom - 10 min) and 2am (bad dream - 25 min).",
      "intervention_used": "Parent comfort for nightmare"
    },
    {
      "metric_name": "Total Sleep Duration",
      "metric_type": "sleep_duration",
      "metric_value": 10.75,
      "metric_unit": "hours",
      "measurement_date": "2025-01-06",
      "start_time": "20:00",
      "end_time": "06:45",
      "context": "Bedtime: 8:00pm, Wake: 6:45am. Slept through the night! Used melatonin.",
      "intervention_used": "Melatonin 3mg, consistent bedtime routine"
    },
    {
      "metric_name": "Sleep Quality",
      "metric_type": "sleep_quality",
      "metric_value": 9,
      "metric_unit": "1-10 scale",
      "measurement_date": "2025-01-06",
      "context": "Excellent sleep. No wakings. Morning mood: happy, energetic.",
      "intervention_used": "Melatonin 3mg"
    },
    {
      "metric_name": "Night Wakings",
      "metric_type": "sleep_disruption",
      "metric_value": 0,
      "metric_unit": "count",
      "measurement_date": "2025-01-06",
      "context": "Slept through entire night without waking.",
      "intervention_used": null
    }
  ],
  "insights": [
    {
      "title": "Melatonin Effectiveness: Significant Improvement",
      "content": "Night of Jan 6 (with melatonin 3mg) showed dramatic improvement: 10.75 hours sleep vs 9.5 hours on Jan 5 (no melatonin). Zero night wakings vs 2 wakings. Sleep quality improved from 6/10 to 9/10. Recommend continuing melatonin protocol.",
      "priority": "high",
      "insight_type": "intervention_effectiveness"
    },
    {
      "title": "Sleep Duration Trend: Below Target",
      "content": "Average sleep duration over 7 nights: 9.2 hours. Recommended for age: 10-11 hours. Student is getting 0.8-1.8 hours less than recommended. Consider earlier bedtime or later wake time.",
      "priority": "medium",
      "insight_type": "pattern_identification"
    },
    {
      "title": "Correlation: Poor Sleep → Behavioral Challenges",
      "content": "On days following <9 hours of sleep, behavioral incident reports increased by 40% (cross-referenced with incident logs). Prioritize sleep improvement as behavioral intervention.",
      "priority": "high",
      "insight_type": "correlation"
    }
  ],
  "progress": [
    {
      "metric_type": "sleep_duration",
      "current_value": 9.2,
      "target_value": 10.5,
      "baseline_value": 8.5,
      "trend": "improving",
      "notes": "Sleep duration improved from 8.5h baseline (December) to 9.2h average (current week). Still below 10.5h target. Continue sleep interventions."
    },
    {
      "metric_type": "sleep_quality",
      "current_value": 7,
      "target_value": 8,
      "baseline_value": 5,
      "trend": "improving",
      "notes": "Sleep quality rating improved from 5/10 baseline to 7/10 current average. Melatonin and weighted blanket showing positive results."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **ONE ENTRY PER NIGHT**: If log has 30 nights, create 30+ separate metric entries (minimum 3 metrics per night: duration, quality, wakings)
2. **EXACT DATES REQUIRED**: Extract dates in YYYY-MM-DD format
3. **TIME FORMAT**: Convert all times to 24-hour format (HH:MM)
4. **CALCULATE SLEEP HOURS**: If bedtime and wake time are given but total hours is not, calculate it yourself
5. **QUALITY SCALE**: Normalize all quality ratings to 1-10 scale
   - "Poor" → 3, "Fair" → 5, "Good" → 7, "Excellent" → 9
   - "3/5" → 6, "4/5" → 8, "5/5" → 10
6. **ZERO COUNTS ARE DATA**: "No night wakings" = metric_value: 0
7. **STRICT NUMERIC VALUES**: metric_value, target_value, duration_minutes accept ONLY numbers or NULL
8. **CROSS-REFERENCE**: If possible, correlate sleep quality with next-day behavioral data

## COMMON LOG FORMATS
- **Table format:** Date | Bedtime | Wake Time | Hours | Quality | Wakings
- **Narrative format:** "Jan 5: Went to bed at 8:30pm. Woke at 6am (9.5 hours). Woke twice during night. Fair sleep quality."
- **Checklist format:** Date, Bedtime ☑, Wake Time ☑, Sleep Aids ☑ Melatonin ☑ White Noise
- **Daily entries:** One paragraph per night describing sleep events

## CRITICAL SUCCESS FACTOR
**This prompt's effectiveness depends on creating TIME-SERIES data.** Each night must be a separate entry to populate Sleep Chart, Sleep-Behavior Correlation Chart, and trend analysis.`;
