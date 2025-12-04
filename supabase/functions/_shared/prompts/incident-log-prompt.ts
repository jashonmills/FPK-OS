/**
 * Specialized extraction prompt for Incident Report Logs
 * Extracts ABC data, behavioral incidents, and intervention effectiveness
 */

export const INCIDENT_LOG_EXTRACTION_PROMPT = `You are analyzing an **Incident Report Log** (also called Behavioral Incident Log, ABC Data Collection, or Behavior Tracking Log). This requires extraction of EVERY incident as an individual entry.

## MANDATORY EXTRACTION STRATEGY

### CRITICAL: EXTRACT EVERY SINGLE INCIDENT
This is a time-series document. If the log contains 30 incidents, you MUST create 30 separate metric entries.

**DO NOT summarize. DO NOT aggregate. Extract EACH incident individually.**

### SECTION 1: Incident Details (EXTRACT EVERY INCIDENT)
**Look for:**
- Date of incident (e.g., "Monday, Jan 5, 2025" or "1/5/25")
- Time of incident (e.g., "10:15 AM", "2:30pm", "14:30")
- Location (e.g., "classroom", "cafeteria", "playground", "bus")
- Incident type (e.g., "physical aggression", "elopement", "self-injury", "property destruction", "verbal outburst")
- Severity (e.g., "mild", "moderate", "severe" or scale 1-10)
- Duration (e.g., "5 minutes", "30 min", "1 hour 15 min")

**Extract for EACH incident:**
- incident_date: "YYYY-MM-DD"
- incident_time: "HH:MM" (24-hour format)
- incident_type: (specific behavior)
- severity: (1-10 scale or mild/moderate/severe)
- duration_minutes: (numeric)
- location: (where it occurred)

### SECTION 2: ABC Data (Antecedent-Behavior-Consequence)
**Extract for EACH incident:**
- **Antecedent** (what happened BEFORE the behavior):
  - trigger: (e.g., "transition to non-preferred activity", "peer took toy", "loud noise")
  - time_of_day: (e.g., "morning", "after lunch", "end of day")
  - environmental_factors: (e.g., "crowded room", "fluorescent lights", "hot classroom")
  - preceding_activity: (e.g., "math worksheet", "group work", "free play")
  
- **Behavior** (what EXACTLY happened):
  - behavior_description: (detailed, objective description)
  - target_of_behavior: (e.g., "peer", "teacher", "self", "property", "none")
  - intensity: (force, volume, frequency)
  
- **Consequence** (what happened AFTER the behavior):
  - immediate_consequence: (e.g., "removed to quiet area", "loss of privilege", "given break")
  - staff_response: (what adults did)
  - student_response: (how student reacted to consequence)

### SECTION 3: Intervention Used
**Extract:**
- intervention_type: (e.g., "de-escalation protocol", "sensory break", "visual schedule", "social story")
- intervention_effectiveness: (e.g., "effective", "partially effective", "ineffective" or 1-10 scale)
- time_to_de-escalate: (minutes until student regulated)
- additional_support_needed: (e.g., "yes - crisis team called", "no")

### SECTION 4: People Involved
**Extract:**
- staff_present: (who witnessed/responded)
- peers_involved: (yes/no or count)
- parent_notified: (yes/no)

### SECTION 5: Patterns Across Multiple Incidents
**After extracting individual entries, create insights about patterns:**
- What are the most common antecedents/triggers?
- Are there time-of-day patterns? (e.g., "More incidents before lunch")
- Which interventions are most effective?
- Are incidents increasing/decreasing over time?
- Are there environmental patterns? (e.g., "70% of incidents occur in cafeteria")

## OUTPUT FORMAT

**EXAMPLE: If log contains incidents on Jan 5 (2 incidents), Jan 6 (1 incident):**

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Physical Aggression (Hitting)",
      "metric_type": "behavioral_incident",
      "metric_value": 1,
      "metric_unit": "episode",
      "measurement_date": "2025-01-05",
      "start_time": "10:15",
      "end_time": "10:45",
      "duration_minutes": 30,
      "context": "ANTECEDENT: Transition from preferred activity (free play) to non-preferred (math worksheet). BEHAVIOR: Hit peer who sat in 'his' chair. Escalated to throwing materials. CONSEQUENCE: Removed to quiet area, offered sensory tools.",
      "intervention_used": "Quiet area + deep pressure vest + 10 min break",
      "location": "Classroom",
      "severity": 7
    },
    {
      "metric_name": "Intervention Effectiveness - Deep Pressure",
      "metric_type": "intervention_effectiveness",
      "metric_value": 8,
      "metric_unit": "1-10 scale",
      "measurement_date": "2025-01-05",
      "start_time": "10:15",
      "duration_minutes": 30,
      "context": "Deep pressure vest + quiet area de-escalated student in 30 minutes. Student returned to classroom and completed math with minimal support.",
      "intervention_used": "Deep pressure vest",
      "target_value": 7
    },
    {
      "metric_name": "Elopement",
      "metric_type": "behavioral_incident",
      "metric_value": 1,
      "metric_unit": "episode",
      "measurement_date": "2025-01-05",
      "start_time": "14:20",
      "end_time": "14:25",
      "duration_minutes": 5,
      "context": "ANTECEDENT: Fire drill alarm (unexpected loud noise). BEHAVIOR: Ran from classroom to bathroom. CONSEQUENCE: Staff followed, waited outside. Student self-regulated in 5 min.",
      "intervention_used": "Allow safe space, verbal reassurance from outside bathroom",
      "location": "Hallway/Bathroom",
      "severity": 4
    },
    {
      "metric_name": "Self-Injurious Behavior (Hand Biting)",
      "metric_type": "behavioral_incident",
      "metric_value": 1,
      "metric_unit": "episode",
      "measurement_date": "2025-01-06",
      "start_time": "11:30",
      "end_time": "11:50",
      "duration_minutes": 20,
      "context": "ANTECEDENT: Denied access to playground due to rain. BEHAVIOR: Bit hand 3 times, left red marks. CONSEQUENCE: Offered fidget tools, visual schedule to show when playground would be available.",
      "intervention_used": "Fidget tools + visual schedule + verbal explanation",
      "location": "Classroom",
      "severity": 6
    },
    {
      "metric_name": "Intervention Effectiveness - Visual Schedule",
      "metric_type": "intervention_effectiveness",
      "metric_value": 7,
      "metric_unit": "1-10 scale",
      "measurement_date": "2025-01-06",
      "start_time": "11:30",
      "duration_minutes": 20,
      "context": "Visual schedule showing 'playground later' helped student understand situation. De-escalated in 20 min. Accepted alternative activity.",
      "intervention_used": "Visual schedule",
      "target_value": 7
    }
  ],
  "insights": [
    {
      "title": "Primary Trigger: Activity Transitions",
      "content": "66% of incidents (2 of 3) occurred during transitions between activities. Recommend enhanced transition warnings: 5-min warning + visual timer + preferred activity 'carrot' after transition.",
      "priority": "high",
      "insight_type": "antecedent_pattern"
    },
    {
      "title": "Intervention Success: Sensory-Based Approaches",
      "content": "Sensory interventions (deep pressure vest, fidget tools) averaged 7.5/10 effectiveness across all incidents. Significantly better than verbal de-escalation alone (4/10 effectiveness in previous weeks).",
      "priority": "high",
      "insight_type": "intervention_effectiveness"
    },
    {
      "title": "Time-of-Day Pattern: Late Morning Spike",
      "content": "50% of incidents occur between 10am-12pm. Hypothesis: Fatigue, hunger, or task demand accumulation. Recommend: Earlier sensory break (10:30am) and snack before this window.",
      "priority": "medium",
      "insight_type": "pattern_identification"
    },
    {
      "title": "Decreasing Incident Severity",
      "content": "Average incident severity decreased from 8/10 (prior month) to 5.7/10 (current week). Positive trend. Continue current intervention strategies.",
      "priority": "medium",
      "insight_type": "progress_note"
    }
  ],
  "progress": [
    {
      "metric_type": "behavior_frequency",
      "current_value": 3,
      "target_value": 1,
      "baseline_value": 8,
      "trend": "improving",
      "notes": "Incident frequency decreased from 8 incidents/week (baseline) to 3 incidents/week (current). Significant improvement. Goal: 1 incident/week."
    },
    {
      "metric_type": "behavior_severity",
      "current_value": 5.7,
      "target_value": 3,
      "baseline_value": 8,
      "trend": "improving",
      "notes": "Average severity decreased from 8/10 to 5.7/10. Trending toward 3/10 target (mild incidents only)."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **ONE ENTRY PER INCIDENT**: If log has 30 incidents, create 30+ separate metric entries
2. **EXACT DATES & TIMES REQUIRED**: Extract dates in YYYY-MM-DD format, times in HH:MM (24-hour)
3. **ABC DATA IS MANDATORY**: Every incident must include antecedent, behavior, consequence in context field
4. **SEVERITY SCALE**: Normalize to 1-10 scale:
   - Mild → 3, Moderate → 6, Severe → 9
   - Minor disruption → 2, Major crisis → 10
5. **DURATION CALCULATION**: If end time is given, calculate duration_minutes
6. **INTERVENTION TRACKING**: Create separate "intervention_effectiveness" metrics to track what works
7. **STRICT NUMERIC VALUES**: metric_value, severity, duration_minutes accept ONLY numbers or NULL
8. **LOCATION STANDARDIZATION**: Use consistent location names (e.g., always "classroom" not "class" or "room")

## COMMON LOG FORMATS
- **Table format:** Date | Time | Location | Behavior | Antecedent | Consequence | Intervention
- **ABC narrative:** "A: [what happened before], B: [what student did], C: [what happened after]"
- **Incident report form:** Structured form with checkboxes + narrative sections
- **Time-stamped entries:** "10:15am - Incident occurred. [description]. Staff response: [intervention]"

## CRITICAL SUCCESS FACTOR
**This prompt's effectiveness depends on creating TIME-SERIES data.** Each incident must be a separate entry to populate Incident Frequency Chart, Behavior Function Analysis, Strategy Success Rates Chart, and intervention effectiveness tracking.`;
